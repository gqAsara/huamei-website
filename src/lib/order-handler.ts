import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { orderRequestSchema, ORDER_BODY_LIMIT, MAX_DESIGN_BYTES, validDesignFile } from "@/lib/order-request";
import { POST as deliverInquiry } from "@/app/api/commission/route";
const orderNumber = (key: string) => "HM-" + createHash("sha256").update(key).digest("hex").slice(0,16).toUpperCase();

const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });

export async function submitOrderRequest(request: Request, deliver: (request: Request) => Promise<Response> = deliverInquiry) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail("Please submit your request from this website.", 403);
  if (Number(request.headers.get("content-length")) > ORDER_BODY_LIMIT) return fail("Files are too large. Maximum 3 MiB combined.", 413);
  let data: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail("Please complete the order form.");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > ORDER_BODY_LIMIT) { await reader.cancel(); return fail("Files are too large. Maximum 3 MiB combined.", 413); }
      chunks.push(value);
    }
    data = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
  } catch { return fail("Could not read the form. Please try again."); }
  if (data.get("website")) return fail("Unable to accept this request.");
  const raw: Record<string, unknown> = {};
  for (const key of ["requestKey","boxType","length","width","height","unit","quantity","name","email","country","company","notes","consent"]) {
    const values = data.getAll(key);
    if (values.length > 1 || values.some(v => typeof v !== "string")) return fail("Invalid form fields.");
    raw[key] = values[0];
  }
  raw.finishes = [...new Set(data.getAll("finishes"))];
  const parsed = orderRequestSchema.safeParse(raw);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Please check your order details.");
  for (const [field, value] of data.entries()) {
    if (value instanceof File && field !== "designFiles") return fail("Unexpected file field.");
    if (field === "designFiles" && typeof value === "string" && value) return fail("Invalid design file.");
  }
  const uploads = data.getAll("designFiles").filter((v): v is File => v instanceof File && (v.size > 0 || v.name !== ""));
  if (uploads.length > 2 || uploads.reduce((s,f) => s+f.size,0) > MAX_DESIGN_BYTES) return fail("Upload up to 2 files, maximum 3 MiB combined.");

  for (const file of uploads) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!bytes.length || !validDesignFile(file.name, bytes)) return fail("Use a valid PDF, AI, INDD, PNG or JPG file.");

  }
  const input = parsed.data;
  const reference = orderNumber(input.requestKey);
  const fileHashes = await Promise.all(uploads.map(async f => ({name:f.name,mime:f.type,hash:createHash("sha256").update(new Uint8Array(await f.arrayBuffer())).digest("hex")})));
  const fingerprint = createHash("sha256").update(JSON.stringify({input, fileHashes})).digest("hex");
  const forwarded = new FormData();
  forwarded.set("name", input.name);
  forwarded.set("email", input.email);
  forwarded.set("brand", input.company);
  forwarded.set("ship", input.country);
  forwarded.set("qty", String(input.quantity));
  forwarded.set("structure", {mailer:"Mailer box / 飞机盒",book:"Book-style box / 书型盒",folding:"Folding box / 折叠盒"}[input.boxType]);
  input.finishes.forEach(f=>forwarded.append("finishing",f));
  forwarded.set("brief", `Packaging order request ${reference}\nInside dimensions: ${input.length} × ${input.width} × ${input.height} ${input.unit}\nQuantity: ${input.quantity}\nArtwork: ${uploads.length ? uploads.length+" file(s) attached" : "No design file yet; assistance may be needed"}\nStatus: Pending quotation, shipping and payment confirmation. No online payment taken.`);
  forwarded.set("notes", input.notes);
  forwarded.set("agree", "Agreed to privacy policy and manual quotation / payment confirmation.");
  uploads.forEach(file=>forwarded.append("attachments",file));
  try {
    const result = await deliver(new Request(new URL("/api/commission",request.url),{
      method:"POST",headers:{accept:"application/json","x-huamei-order-key":`${input.requestKey}:${fingerprint}`},body:forwarded,
    }));
    const json = await result.json().catch(()=>null);
    if (!result.ok || json?.ok !== true) return fail(json?.error || "We couldn't send your request. Please retry or email info@huamei.io.",result.status >= 400 ? result.status : 502);
    return NextResponse.json({ok:true,reference},{headers:{"Cache-Control":"no-store"}});
  } catch {
    console.error("[orders] Email request failed.");
    return fail("We couldn't send your request. Please retry or email info@huamei.io. No payment has been taken.",502);
  }
}
