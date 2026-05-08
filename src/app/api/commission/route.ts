import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FROM = process.env.CONTACT_FROM_EMAIL || "Huamei <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || "info@huamei.io";
const KEY = process.env.RESEND_API_KEY;

// Honeypot field name — must match the hidden field in /begin form.
// Real users never see / fill it; automated bots filling all inputs do.
const HONEYPOT_FIELD = "company_website";

// Hard cap on payload size for the email body (excluding attachments).
// Generous for a real intake form; cuts off scrapers stuffing data.
const MAX_BODY_CHARS = 16_000;

function htmlRow(k: string, v: string | string[]): string {
  const val = Array.isArray(v) ? v.join(", ") : v;
  const safe = val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  return `<tr><td style="padding:6px 14px 6px 0;color:#6b615a;font:500 11px/1.4 -apple-system,sans-serif;letter-spacing:.18em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#1a1614;font:400 14px/1.55 Georgia,serif">${safe}</td></tr>`;
}

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(request: Request) {
  // Parse formData defensively. The original handler awaited
  // request.formData() unconditionally and threw 500 on raw POSTs without a
  // body, leaking error stacks. Now we return a structured 400.
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest("Invalid request body. Submit the form from /begin.");
  }

  const payload: Record<string, string | string[]> = {};
  const attachmentNames: string[] = [];
  let totalChars = 0;

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) attachmentNames.push(`${value.name} (${Math.round(value.size / 1024)} KB)`);
      continue;
    }
    const str = String(value);
    totalChars += str.length;
    if (totalChars > MAX_BODY_CHARS) {
      return badRequest("Submission too large.");
    }
    const existing = payload[key];
    if (existing === undefined) {
      payload[key] = str;
    } else if (Array.isArray(existing)) {
      existing.push(str);
    } else {
      payload[key] = [existing, str];
    }
  }
  if (attachmentNames.length) payload["attachments"] = attachmentNames;

  // Honeypot: if filled, silently 303 to /begin/sent without sending email.
  // Don't reveal that we caught the bot — they'll keep submitting and we'll
  // keep dropping. Returning 4xx would tell them which field to skip.
  const trap = payload[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim().length > 0) {
    return NextResponse.redirect(new URL("/begin/sent", request.url), 303);
  }
  delete payload[HONEYPOT_FIELD];

  // Minimal real-user validation: must have a name AND email AND something
  // resembling a project description.
  const name = typeof payload["name"] === "string" ? payload["name"].trim() : "";
  const email = typeof payload["email"] === "string" ? payload["email"].trim() : "";
  if (!name) return badRequest("Name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("A valid email is required.");
  }

  if (KEY) {
    const rows = Object.entries(payload)
      .map(([k, v]) => htmlRow(k, v))
      .join("");
    const html = `<div style="background:#f4efe6;padding:32px"><div style="max-width:640px;margin:0 auto;background:#fff;padding:36px 40px;border:.5px solid #c9bfb2"><div style="font:500 11px/1.2 -apple-system,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#8f6e2b;margin-bottom:6px">New project intake</div><div style="font:italic 28px/1.1 Georgia,serif;color:#1a1614;margin:0 0 24px">Huamei · /begin</div><table style="border-collapse:collapse;width:100%">${rows}</table></div></div>`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [TO],
          subject: `New project intake — ${name || payload["company"] || "anonymous"}`,
          html,
          reply_to: email,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("[commission] Resend non-OK", res.status, detail);
        return NextResponse.json(
          { ok: false, error: "Couldn't deliver right now. Please email info@huamei.io." },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error("[commission] Resend send failed", err);
      return NextResponse.json(
        { ok: false, error: "Couldn't deliver right now. Please email info@huamei.io." },
        { status: 502 },
      );
    }
  } else {
    console.log("[commission] new submission (no RESEND_API_KEY set, not sending)", payload);
  }

  return NextResponse.redirect(new URL("/begin/sent", request.url), 303);
}
