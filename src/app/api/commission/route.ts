import { NextResponse } from "next/server";
import { MAX_BODY_CHARS, validateAttachments } from "@/lib/commission";

export const runtime = "nodejs";
export const maxDuration = 30;

const HONEYPOT_FIELD = "company_website";
const DELIVERY_ERROR = "Couldn't deliver right now. Please try again or email info@huamei.io.";
const FIELDS = [
  "name", "role", "email", "brand", "website", "industry", "brief",
  "qty", "ship", "structure", "finishing", "notes", "agree",
] as const;
const REPEATED_FIELDS = new Set<string>(["structure", "finishing"]);

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function htmlRow(key: string, value: string | string[]): string {
  const safe = escapeHtml(Array.isArray(value) ? value.join(", ") : value)
    .replace(/\r?\n/g, "<br/>");
  return '<tr><td style="padding:6px 14px 6px 0;color:#6b615a;font:500 11px/1.4 -apple-system,sans-serif;letter-spacing:.18em;text-transform:uppercase;vertical-align:top;white-space:nowrap">'
    + escapeHtml(key) + '</td><td style="padding:6px 0;color:#1a1614;font:400 14px/1.55 Georgia,serif">'
    + safe + "</td></tr>";
}

function failure(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function success(request: Request) {
  if (request.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.redirect(new URL("/begin/sent", request.url), 303);
}

export async function POST(request: Request) {
  // Reject large declared requests before parsing; the attachment/body checks
  // below also apply when Content-Length is absent.
  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > 4 * 1024 * 1024) {
    return failure("Submission too large. Attach up to 3 MiB of files.", 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return failure("Invalid request body. Submit the form from /begin.");
  }

  // Bots receive the same success response without making an email request.
  if (formData.getAll(HONEYPOT_FIELD).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  )) {
    return success(request);
  }

  let totalChars = 0;
  const files: File[] = [];
  for (const [key, value] of formData.entries()) {
    totalChars += key.length;
    if (value instanceof File) {
      if (key !== "attachments") return failure("Unexpected attachment field.");
      if (value.size > 0 || value.name.length > 0) files.push(value);
    } else {
      totalChars += value.length;
    }
    if (totalChars > MAX_BODY_CHARS) return failure("Submission too large.");
  }

  const attachmentError = validateAttachments(files);
  if (attachmentError) return failure(attachmentError);

  const payload: Record<string, string | string[]> = {};
  for (const key of FIELDS) {
    const values = formData.getAll(key);
    if (values.some((value) => typeof value !== "string")) {
      return failure("Invalid form field.");
    }
    if (!REPEATED_FIELDS.has(key) && values.length > 1) {
      return failure("Duplicate form field: " + key + ".");
    }
    const strings = (values as string[]).map((value) => value.trim());
    if (strings.length) payload[key] = REPEATED_FIELDS.has(key) ? strings : strings[0];
  }

  const name = typeof payload.name === "string" ? payload.name : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const brief = typeof payload.brief === "string" ? payload.brief : "";
  if (!name) return failure("Name is required.");
  if (name.length > 200 || /[\r\n]/.test(name)) return failure("Please enter a valid name.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return failure("A valid email is required.");
  }
  if (!brief) return failure("Please describe your project.");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[commission] Email delivery is not configured.");
    return failure(DELIVERY_ERROR, 503);
  }

  if (files.length) payload.attachments = files.map(
    (file) => file.name + " (" + Math.ceil(file.size / 1024) + " KB)",
  );
  const rows = Object.entries(payload).map(([key, value]) => htmlRow(key, value)).join("");
  const html = '<div style="background:#f4efe6;padding:32px"><div style="max-width:640px;margin:0 auto;background:#fff;padding:36px 40px;border:.5px solid #c9bfb2"><div style="font:500 11px/1.2 -apple-system,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#8f6e2b;margin-bottom:6px">New project intake</div><div style="font:italic 28px/1.1 Georgia,serif;color:#1a1614;margin:0 0 24px">Huamei · /begin</div><table style="border-collapse:collapse;width:100%">'
    + rows + "</table></div></div>";

  try {
    const attachments = await Promise.all(files.map(async (file) => ({
      filename: file.name.replace(/[\r\n/\\]/g, "_"),
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })));
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Huamei <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || "info@huamei.io"],
        subject: "New project intake — " + name,
        html,
        reply_to: email,
        ...(attachments.length ? { attachments } : {}),
      }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || typeof result?.id !== "string" || !result.id) {
      console.error("[commission] Email provider rejected delivery.", response.status);
      return failure(DELIVERY_ERROR, 502);
    }
  } catch {
    // Do not log the enquiry, attachments, credentials or provider response.
    console.error("[commission] Email delivery failed or timed out.");
    return failure(DELIVERY_ERROR, 502);
  }

  return success(request);
}
