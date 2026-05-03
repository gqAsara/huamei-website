import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FROM = process.env.CONTACT_FROM_EMAIL || "Huamei <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || "info@huamei.io";
const KEY = process.env.RESEND_API_KEY;

function htmlRow(k: string, v: string | string[]): string {
  const val = Array.isArray(v) ? v.join(", ") : v;
  const safe = val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  return `<tr><td style="padding:6px 14px 6px 0;color:#6b615a;font:500 11px/1.4 -apple-system,sans-serif;letter-spacing:.18em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#1a1614;font:400 14px/1.55 Georgia,serif">${safe}</td></tr>`;
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const payload: Record<string, string | string[]> = {};
  const attachmentNames: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) attachmentNames.push(`${value.name} (${Math.round(value.size / 1024)} KB)`);
      continue;
    }
    const existing = payload[key];
    if (existing === undefined) {
      payload[key] = String(value);
    } else if (Array.isArray(existing)) {
      existing.push(String(value));
    } else {
      payload[key] = [existing, String(value)];
    }
  }
  if (attachmentNames.length) payload["attachments"] = attachmentNames;

  if (KEY) {
    const rows = Object.entries(payload)
      .map(([k, v]) => htmlRow(k, v))
      .join("");
    const html = `<div style="background:#f4efe6;padding:32px"><div style="max-width:640px;margin:0 auto;background:#fff;padding:36px 40px;border:.5px solid #c9bfb2"><div style="font:500 11px/1.2 -apple-system,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#8f6e2b;margin-bottom:6px">New project intake</div><div style="font:italic 28px/1.1 Georgia,serif;color:#1a1614;margin:0 0 24px">Huamei · /begin</div><table style="border-collapse:collapse;width:100%">${rows}</table></div></div>`;

    const replyTo =
      typeof payload["email"] === "string" ? (payload["email"] as string) : undefined;

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
          subject: `New project intake — ${payload["name"] || payload["company"] || "anonymous"}`,
          html,
          ...(replyTo ? { reply_to: replyTo } : {}),
        }),
      });
      if (!res.ok) {
        console.error("[commission] Resend non-OK", res.status, await res.text());
      }
    } catch (err) {
      console.error("[commission] Resend send failed", err);
    }
  } else {
    console.log("[commission] new submission (no RESEND_API_KEY set, not sending)", payload);
  }

  return NextResponse.redirect(new URL("/begin?sent=1", request.url), 303);
}
