/**
 * Daily Google Search Console puller.
 *
 * Reads OAuth credentials from ~/.config/gsc-huamei-oauth.json (or env
 * vars in production), mints a short-lived access token, and pulls the
 * last 28 days of search analytics for sc-domain:huamei.io grouped by
 * query + page.
 *
 * Output: `.seo/reports/gsc-YYYY-MM-DD.jsonl` — one row per
 * (query, page) tuple with clicks / impressions / ctr / position. The
 * file is committed to git so deltas show up in `git diff`.
 *
 * Run:
 *   npx tsx scripts/gsc-pull.ts
 *
 * Flags:
 *   --days N         How many days back to pull (default 28)
 *   --site SITE      Override the GSC site (default sc-domain:huamei.io)
 *   --min-impr N     Drop rows with < N impressions (default 5)
 *   --dry-run        Don't write the file; print summary only
 *
 * Env vars (alternatives to ~/.config/gsc-huamei-oauth.json):
 *   GSC_OAUTH_CLIENT_ID
 *   GSC_OAUTH_CLIENT_SECRET
 *   GSC_OAUTH_REFRESH_TOKEN
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { resolve, join } from "node:path";

const SITE_DEFAULT = "sc-domain:huamei.io";
const REPORTS_DIR = resolve(process.cwd(), ".seo/reports");
const ROW_LIMIT = 25_000;

type Flags = {
  days: number;
  site: string;
  minImpr: number;
  dryRun: boolean;
};

function parseFlags(): Flags {
  const argv = process.argv.slice(2);
  const f: Flags = { days: 28, site: SITE_DEFAULT, minImpr: 5, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--days") f.days = Number(argv[++i]);
    else if (a === "--site") f.site = argv[++i];
    else if (a === "--min-impr") f.minImpr = Number(argv[++i]);
    else if (a === "--dry-run") f.dryRun = true;
  }
  return f;
}

type Creds = {
  client_id: string;
  client_secret: string;
  refresh_token: string;
};

function loadCreds(): Creds {
  // Prefer env vars (production)
  if (process.env.GSC_OAUTH_CLIENT_ID && process.env.GSC_OAUTH_REFRESH_TOKEN) {
    return {
      client_id: process.env.GSC_OAUTH_CLIENT_ID,
      client_secret: process.env.GSC_OAUTH_CLIENT_SECRET ?? "",
      refresh_token: process.env.GSC_OAUTH_REFRESH_TOKEN,
    };
  }
  const path = join(homedir(), ".config/gsc-huamei-oauth.json");
  if (!existsSync(path)) {
    console.error(`❌ No credentials. Either set GSC_OAUTH_* env vars or run scripts/gsc-oauth-init.mjs to create ${path}.`);
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return {
    client_id: raw.client_id,
    client_secret: raw.client_secret,
    refresh_token: raw.refresh_token,
  };
}

async function mintAccessToken(creds: Creds): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: creds.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    if (body.error === "invalid_grant") {
      console.error("❌ Refresh token expired (OAuth Testing-mode tokens expire after 7 days).");
      console.error("   Re-run scripts/gsc-oauth-init.mjs to get a fresh refresh token.");
    } else {
      console.error("❌ Token mint failed:", body);
    }
    process.exit(1);
  }
  return body.access_token as string;
}

type GscRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

async function fetchAnalytics(
  accessToken: string,
  site: string,
  startDate: string,
  endDate: string,
): Promise<GscRow[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const allRows: GscRow[] = [];
  let startRow = 0;

  while (true) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query", "page"],
        rowLimit: ROW_LIMIT,
        startRow,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`❌ GSC API HTTP ${res.status}:`, errBody.slice(0, 500));
      process.exit(1);
    }
    const body: { rows?: GscRow[] } = await res.json();
    const rows = body.rows ?? [];
    allRows.push(...rows);
    console.log(`  fetched ${rows.length} rows (startRow=${startRow}, total so far ${allRows.length})`);
    if (rows.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }
  return allRows;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const flags = parseFlags();
  const creds = loadCreds();

  const endDate = isoDate(new Date(Date.now() - 2 * 86_400_000)); // GSC data lags ~2 days
  const startDate = isoDate(new Date(Date.now() - (flags.days + 2) * 86_400_000));

  console.log(`[gsc] pulling ${flags.site}`);
  console.log(`[gsc] window: ${startDate} → ${endDate} (${flags.days} days)`);

  const accessToken = await mintAccessToken(creds);
  console.log("[gsc] access token ok");

  const rows = await fetchAnalytics(accessToken, flags.site, startDate, endDate);
  console.log(`[gsc] total rows: ${rows.length}`);

  const filtered = rows.filter((r) => r.impressions >= flags.minImpr);
  console.log(`[gsc] after min-impr ≥ ${flags.minImpr}: ${filtered.length}`);

  if (filtered.length > 0) {
    // Summary stats
    const totalClicks = filtered.reduce((s, r) => s + r.clicks, 0);
    const totalImpr = filtered.reduce((s, r) => s + r.impressions, 0);
    const avgPos =
      filtered.reduce((s, r) => s + r.position * r.impressions, 0) / Math.max(totalImpr, 1);
    console.log(
      `[gsc] totals: ${totalClicks} clicks · ${totalImpr.toLocaleString()} impressions · avg pos ${avgPos.toFixed(1)}`,
    );

    // Top 10 by impressions
    const top = [...filtered].sort((a, b) => b.impressions - a.impressions).slice(0, 10);
    console.log(`[gsc] top 10 by impressions:`);
    for (const r of top) {
      const [q, p] = r.keys;
      console.log(
        `  imp=${r.impressions.toString().padStart(5)} clk=${r.clicks.toString().padStart(3)} pos=${r.position.toFixed(1).padStart(4)} | ${q}  →  ${p}`,
      );
    }
  }

  if (flags.dryRun) return;

  // Write JSONL (one row per line for clean git diffs).
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
  const today = isoDate(new Date());
  const outPath = join(REPORTS_DIR, `gsc-${today}.jsonl`);
  const lines = filtered
    .map((r) => {
      const [query, page] = r.keys;
      return JSON.stringify({
        query,
        page,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: Math.round(r.ctr * 10_000) / 10_000,
        position: Math.round(r.position * 10) / 10,
      });
    })
    .join("\n") + "\n";
  writeFileSync(outPath, lines);
  console.log(`[gsc] wrote ${outPath}`);
}

main().catch((err) => {
  console.error("[gsc] failed:", err);
  process.exit(1);
});
