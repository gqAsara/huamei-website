import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { POST } from "../src/app/api/commission/route";
import { MAX_ATTACHMENT_BYTES } from "../src/lib/commission";

const originalFetch = globalThis.fetch;
const envKeys = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
let requests: { url: string; init?: RequestInit }[] = [];

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-key-never-send";
  process.env.CONTACT_FROM_EMAIL = "Huamei <test@example.com>";
  process.env.CONTACT_TO_EMAIL = "inbox@example.com";
  requests = [];
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return Response.json({ id: "mock-email-id" });
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

function form() {
  const data = new FormData();
  data.set("name", "Test Buyer");
  data.set("email", "buyer@example.com");
  data.set("brief", "A sample packaging project.");
  return data;
}

function request(data: FormData, json = true) {
  return new Request("https://huamei.example/api/commission", {
    method: "POST",
    body: data,
    headers: json ? { Accept: "application/json" } : {},
  });
}

test("sends real attachment bytes and repeated choices; escapes email HTML", async () => {
  const data = form();
  data.set("brief", "<script>not markup</script>\nNew line");
  data.append("structure", "rigid");
  data.append("structure", "drawer");
  data.append("attachments", new File(["%PDF-test-bytes"], "drawing.pdf", { type: "application/pdf" }));
  data.append("attachments", new File([new Uint8Array([137, 80, 78, 71])], "reference.png", { type: "image/png" }));
  const response = await POST(request(data));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://api.resend.com/emails");
  const sent = JSON.parse(String(requests[0].init?.body));
  assert.equal(sent.reply_to, "buyer@example.com");
  assert.deepEqual(sent.to, ["inbox@example.com"]);
  assert.equal(sent.from, "Huamei <test@example.com>");
  assert.equal(sent.attachments.length, 2);
  assert.equal(sent.attachments[0].filename, "drawing.pdf");
  assert.equal(Buffer.from(sent.attachments[0].content, "base64").toString(), "%PDF-test-bytes");
  assert.deepEqual(Buffer.from(sent.attachments[1].content, "base64"), Buffer.from([137, 80, 78, 71]));
  assert.match(sent.html, /rigid, drawer/);
  assert.match(sent.html, /&lt;script&gt;not markup&lt;\/script&gt;<br\/>New line/);
  assert.ok(requests[0].init?.signal instanceof AbortSignal);
});

test("native form preserves the 303 success redirect after delivery", async () => {
  const response = await POST(request(form(), false));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://huamei.example/begin/sent");
  assert.equal(requests.length, 1);
});

test("missing delivery configuration fails closed without sending", async () => {
  delete process.env.RESEND_API_KEY;
  const response = await POST(request(form()));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(requests.length, 0);
});

for (const field of ["name", "email", "brief"]) {
  test("rejects missing " + field + " before sending", async () => {
    const data = form();
    data.delete(field);
    assert.equal((await POST(request(data))).status, 400);
    assert.equal(requests.length, 0);
  });
}

test("rejects duplicate required fields and invalid emails", async () => {
  const duplicated = form();
  duplicated.append("email", "other@example.com");
  assert.equal((await POST(request(duplicated))).status, 400);
  const invalid = form();
  invalid.set("email", "not-an-address");
  assert.equal((await POST(request(invalid))).status, 400);
  assert.equal(requests.length, 0);
});

test("honeypot simulates success without emailing, including repeated trap fields", async () => {
  const data = form();
  data.append("company_website", "");
  data.append("company_website", "bot");
  const response = await POST(request(data));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(requests.length, 0);
});

test("rejects more than five attachments and combined size overflow", async () => {
  const count = form();
  for (let i = 0; i < 6; i++) count.append("attachments", new File(["x"], "file.pdf"));
  assert.equal((await POST(request(count))).status, 400);
  const size = form();
  size.append("attachments", new File([new Uint8Array(MAX_ATTACHMENT_BYTES)], "large.pdf"));
  size.append("attachments", new File(["x"], "extra.pdf"));
  assert.equal((await POST(request(size))).status, 400);
  assert.equal(requests.length, 0);
});

test("accepts five files at the combined size boundary", async () => {
  const data = form();
  for (let i = 0; i < 4; i++) data.append("attachments", new File(["x"], "small.pdf"));
  data.append("attachments", new File([new Uint8Array(MAX_ATTACHMENT_BYTES - 4)], "large.pdf"));
  assert.equal((await POST(request(data))).status, 200);
  assert.equal(JSON.parse(String(requests[0].init?.body)).attachments.length, 5);
});

test("rejects unsupported, empty and unexpected file fields", async () => {
  for (const [field, file] of [
    ["attachments", new File(["alert(1)"], "script.js")],
    ["attachments", new File([], "empty.pdf")],
    ["brief", new File(["x"], "unexpected.pdf")],
  ] as const) {
    const data = form();
    data.set(field, file);
    assert.equal((await POST(request(data))).status, 400);
  }
  assert.equal(requests.length, 0);
});

test("ignores the browser's empty unselected file input", async () => {
  const data = form();
  data.append("attachments", new File([], ""));
  assert.equal((await POST(request(data))).status, 200);
  assert.equal(JSON.parse(String(requests[0].init?.body)).attachments, undefined);
});

test("rejects malformed and excessive requests before sending", async () => {
  const malformed = new Request("https://huamei.example/api/commission", { method: "POST", body: "bad body" });
  assert.equal((await POST(malformed)).status, 400);
  const declared = request(form());
  declared.headers.set("content-length", String(5 * 1024 * 1024));
  assert.equal((await POST(declared)).status, 413);
  const huge = form();
  huge.set("notes", "x".repeat(16_001));
  assert.equal((await POST(request(huge))).status, 400);
  assert.equal(requests.length, 0);
});

test("provider errors, malformed success and network timeouts never claim delivery", async () => {
  for (const upstream of [
    async () => Response.json({ message: "provider detail" }, { status: 429 }),
    async () => Response.json({ unexpected: true }),
    async () => { throw new DOMException("timed out", "TimeoutError"); },
  ]) {
    globalThis.fetch = upstream;
    const response = await POST(request(form()));
    assert.equal(response.status, 502);
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.match(body.error, /info@huamei\.io/);
    assert.doesNotMatch(body.error, /provider detail/);
  }
});
