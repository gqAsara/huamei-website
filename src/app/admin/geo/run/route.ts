/**
 * Browser-facing trigger for the GEO probe.
 *
 * Sits under /admin/geo/run so proxy.ts's Basic-auth gate covers it
 * automatically — the browser already has cached credentials for the
 * /admin scope and re-sends them on this form POST.
 *
 * This route does NOT do the probe work itself. It fires a
 * server-to-server fetch at /api/cron/geo-probe with Bearer CRON_SECRET
 * (so the cron route authorizes us as machine-not-browser) and
 * redirects the user back to the dashboard immediately. Vercel keeps
 * the outbound fetch alive after the response thanks to `after()` —
 * the cron route handles its own self-chaining from there.
 */

import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const promptId = url.searchParams.get("promptId");

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }

  // Build the target URL on the same deployment.
  const host = req.headers.get("host") ?? "huamei.io";
  const proto = host.includes("localhost") ? "http" : "https";
  const target = new URL(`${proto}://${host}/api/cron/geo-probe`);
  if (promptId) target.searchParams.set("promptId", promptId);

  // Fire-and-forget — kick off the probe in the background while we
  // redirect the user immediately. `after()` ensures the fetch runs even
  // after this response is sent.
  after(async () => {
    try {
      const res = await fetch(target.toString(), {
        method: "POST",
        headers: { Authorization: `Bearer ${cronSecret}` },
      });
      const body = await res.text().catch(() => "");
      console.log(`[geo-trigger] dispatched probe: ${res.status} ${body.slice(0, 200)}`);
    } catch (err) {
      console.error("[geo-trigger] fetch failed:", err);
    }
  });

  // Redirect back to the dashboard with a `triggered=1` flag so the
  // page can render a confirmation banner.
  const dest = promptId
    ? `/admin/geo/${encodeURIComponent(promptId)}?triggered=1`
    : "/admin/geo?triggered=1";
  return NextResponse.redirect(new URL(dest, req.url), 303);
}
