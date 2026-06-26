#!/usr/bin/env node
/**
 * Daily SEO digest composer + Resend sender.
 *
 * Reads:
 *   - .seo/reports/activity.log (today's entries)
 *   - .seo/reports/gsc-<today>.jsonl + previous-day file (for delta)
 *   - .seo/briefs/auto-*.md (queue depth)
 *   - Sanity geoRun docs (last 7 days, via SANITY_WRITE_TOKEN)
 *
 * Composes an HTML email summarizing the day and POSTs to Resend.
 *
 * Run:
 *   node scripts/seo-digest.mjs
 *
 * Flags:
 *   --dry-run   Print the email body, don't actually send
 *   --date YYYY-MM-DD  Use this date instead of today (for backfill)
 *
 * Env vars (required when not --dry-run):
 *   RESEND_API_KEY
 *
 * Env vars (optional):
 *   DIGEST_TO_EMAIL    (default: georgeqiao08@gmail.com)
 *   DIGEST_FROM_EMAIL  (default: "Huamei SEO Bot <seo-bot@huamei.io>")
 *   ROUTINE_DASHBOARD_URL  (default: https://claude.ai/code/routines/trig_01KPjanymcsUY3s9YfVVwHbA)
 *
 * GEO data is included automatically when the following Sanity env are set:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_WRITE_TOKEN  (read access only is enough)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

// Load .env.local into process.env (for local dev / dry-run). In CI,
// vars come from workflow `env:` block — this loop is a no-op there
// because .env.local isn't in the workflow checkout.
{
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

const REPO_ROOT = process.cwd();
const ACTIVITY_LOG = resolve(REPO_ROOT, ".seo/reports/activity.log");
const REPORTS_DIR = resolve(REPO_ROOT, ".seo/reports");
const BRIEFS_DIR = resolve(REPO_ROOT, ".seo/briefs");
const ROUTINE_URL =
  process.env.ROUTINE_DASHBOARD_URL ??
  "https://claude.ai/code/routines/trig_01KPjanymcsUY3s9YfVVwHbA";
const TO_EMAIL = process.env.DIGEST_TO_EMAIL ?? "georgeqiao08@gmail.com";
const FROM_EMAIL =
  process.env.DIGEST_FROM_EMAIL ?? "Huamei SEO Bot <seo-bot@huamei.io>";

function parseFlags() {
  const argv = process.argv.slice(2);
  let dryRun = false;
  let date = new Date().toISOString().slice(0, 10);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--date") date = argv[++i];
  }
  return { dryRun, date };
}

/**
 * Activity log entries: `<iso-timestamp>\t<agent>\t<event>\t<details>`
 * Returns entries whose timestamp falls on `date` (YYYY-MM-DD), in
 * either UTC or +08:00 (China). We accept both because the cloud
 * routine sometimes stamps in CST.
 */
function todaysEntries(date) {
  if (!existsSync(ACTIVITY_LOG)) return [];
  const raw = readFileSync(ACTIVITY_LOG, "utf8");
  const lines = raw.split("\n").filter(Boolean);
  return lines
    .map((line) => {
      const parts = line.split("\t");
      if (parts.length < 4) return null;
      const [ts, agent, event, details] = parts;
      return { ts, agent, event, details };
    })
    .filter((e) => {
      if (!e) return false;
      // Compare against both UTC and CST day boundaries
      const tsDateUTC = e.ts.slice(0, 10);
      // For +08:00 timestamps, subtract 8h to get UTC date
      let tsDateLocal = tsDateUTC;
      if (e.ts.includes("+08:00")) {
        const d = new Date(e.ts);
        tsDateLocal = new Date(d.getTime() - 8 * 3600_000)
          .toISOString()
          .slice(0, 10);
      }
      return tsDateUTC === date || tsDateLocal === date;
    });
}

function ymdMinus(date, days) {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function loadGscFile(date) {
  const path = join(REPORTS_DIR, `gsc-${date}.jsonl`);
  if (!existsSync(path)) return null;
  const rows = readFileSync(path, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return rows;
}

function gscDelta(date) {
  // Compare today's pull to the most recent prior file (could be 1-7 days back).
  const todayRows = loadGscFile(date);
  if (!todayRows) return null;
  let priorRows = null;
  let priorDate = null;
  for (let i = 1; i <= 14; i++) {
    const candidate = ymdMinus(date, i);
    const rows = loadGscFile(candidate);
    if (rows) {
      priorRows = rows;
      priorDate = candidate;
      break;
    }
  }
  const sum = (rows, field) =>
    rows.reduce((s, r) => s + (r[field] ?? 0), 0);
  const totalImpressionsToday = sum(todayRows, "impressions");
  const totalClicksToday = sum(todayRows, "clicks");
  const totalImpressionsPrior = priorRows
    ? sum(priorRows, "impressions")
    : null;
  const totalClicksPrior = priorRows ? sum(priorRows, "clicks") : null;
  const queriesToday = todayRows.length;
  const queriesPrior = priorRows ? priorRows.length : null;

  // Top 3 movers by impressions
  const priorMap = new Map(
    (priorRows ?? []).map((r) => [`${r.query}::${r.page}`, r.impressions]),
  );
  const movers = todayRows
    .map((r) => ({
      query: r.query,
      page: r.page,
      impressions: r.impressions,
      delta: r.impressions - (priorMap.get(`${r.query}::${r.page}`) ?? 0),
    }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);

  return {
    today: {
      date,
      impressions: totalImpressionsToday,
      clicks: totalClicksToday,
      queries: queriesToday,
    },
    prior: priorDate
      ? {
          date: priorDate,
          impressions: totalImpressionsPrior,
          clicks: totalClicksPrior,
          queries: queriesPrior,
        }
      : null,
    movers,
  };
}

function activeBriefCount() {
  if (!existsSync(BRIEFS_DIR)) return 0;
  return readdirSync(BRIEFS_DIR).filter(
    (f) => f.startsWith("auto-") && f.endsWith(".md"),
  ).length;
}

/**
 * Fetch last-7-days GEO probe summary from Sanity. Returns null if creds
 * are missing or the query fails (digest still ships).
 */
async function fetchGeoSummary() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  const since = new Date(Date.now() - 7 * 86400_000).toISOString();
  const query = `*[_type == "geoRun" && _createdAt > "${since}"]{
    _id, _createdAt, runAt, promptText,
    prompt->{text, intent, stage, priority},
    engine, ourBrandMentioned, ourDomainCited, competitorsCited
  } | order(_createdAt desc)[0...500]`;
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  let result;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const body = await res.json();
    result = body.result;
  } catch {
    return null;
  }
  if (!Array.isArray(result) || result.length === 0) {
    return { totalRuns: 0, huameiHits: 0, byEngine: {}, byPrompt: {}, competitorCounts: {}, byDay: {} };
  }

  const byEngine = {};
  const byPrompt = {};
  const competitorCounts = {};
  const byDay = {};
  let huameiHits = 0;

  for (const r of result) {
    const eng = r.engine ?? "?";
    byEngine[eng] = byEngine[eng] ?? { runs: 0, huamei: 0 };
    byEngine[eng].runs++;
    const huameiYes = r.ourBrandMentioned === true || r.ourDomainCited === true;
    if (huameiYes) {
      byEngine[eng].huamei++;
      huameiHits++;
    }
    const pTxt = r.promptText ?? r.prompt?.text ?? "?";
    byPrompt[pTxt] = byPrompt[pTxt] ?? {
      runs: 0,
      huamei: 0,
      intent: r.prompt?.intent,
      priority: r.prompt?.priority,
    };
    byPrompt[pTxt].runs++;
    if (huameiYes) byPrompt[pTxt].huamei++;
    for (const c of r.competitorsCited ?? []) {
      // competitorsCited is an array of {brand, domain} objects.
      const name = typeof c === "string" ? c : (c.brand ?? c.domain ?? "?");
      competitorCounts[name] = (competitorCounts[name] ?? 0) + 1;
    }
    const day = (r.runAt ?? r._createdAt ?? "").slice(0, 10);
    if (day) byDay[day] = (byDay[day] ?? 0) + 1;
  }

  return {
    totalRuns: result.length,
    huameiHits,
    byEngine,
    byPrompt,
    competitorCounts,
    byDay,
  };
}

function renderGeoSection(geo) {
  if (!geo) return "";
  const lines = [];
  lines.push(`<h3 style="font-family:system-ui">🤖 AI search citations (last 7 days)</h3>`);
  if (geo.totalRuns === 0) {
    lines.push(`<p style="color:#a33;font-family:system-ui">No GEO probe runs in the last 7 days. The Vercel cron may be stalled. Investigate: <code>/api/cron/geo-probe</code>.</p>`);
    return lines.join("\n");
  }
  const rate = ((geo.huameiHits / geo.totalRuns) * 100).toFixed(1);
  lines.push(`<p style="font-family:system-ui;line-height:1.6">Huamei cited on <strong>${geo.huameiHits} / ${geo.totalRuns}</strong> runs (<strong>${rate}%</strong>) across ${Object.keys(geo.byEngine).length} engines, ${Object.keys(geo.byPrompt).length} prompts, ${Object.keys(geo.byDay).length} days.</p>`);

  // Per-engine breakdown
  if (Object.keys(geo.byEngine).length > 0) {
    lines.push(`<p style="font-family:system-ui;line-height:1.6"><strong>By engine:</strong><br>`);
    const engineRows = Object.entries(geo.byEngine).map(([eng, s]) => {
      const pct = s.runs ? ((s.huamei / s.runs) * 100).toFixed(0) : "—";
      return `${eng}: <code>${s.huamei}/${s.runs}</code> (${pct}%)`;
    });
    lines.push(engineRows.join("&nbsp;&nbsp;·&nbsp;&nbsp;"));
    lines.push(`</p>`);
  }

  // Top competitors mentioned
  const topComps = Object.entries(geo.competitorCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (topComps.length > 0) {
    lines.push(`<p style="font-family:system-ui;line-height:1.6"><strong>Competitors in AI answers (last 7d):</strong></p>`);
    lines.push(`<ul style="font-family:system-ui;line-height:1.6">`);
    for (const [name, n] of topComps) {
      lines.push(`<li><code>${name}</code> — ${n} mentions</li>`);
    }
    lines.push(`</ul>`);
  }

  // Opportunity prompts: where Huamei never cited but probe ran ≥ 3 times
  const misses = Object.entries(geo.byPrompt)
    .filter(([, s]) => s.huamei === 0 && s.runs >= 3)
    .sort((a, b) => b[1].runs - a[1].runs)
    .slice(0, 5);
  if (misses.length > 0) {
    lines.push(`<p style="font-family:system-ui;line-height:1.6"><strong>Opportunity — prompts where Huamei is never cited:</strong></p>`);
    lines.push(`<ul style="font-family:system-ui;line-height:1.6;color:#555">`);
    for (const [prompt, s] of misses) {
      lines.push(`<li>0/${s.runs} · <em>${s.intent ?? "?"}</em> · ${prompt.length > 100 ? prompt.slice(0, 100) + "…" : prompt}</li>`);
    }
    lines.push(`</ul>`);
  }

  return lines.join("\n");
}

function classifyEntries(entries) {
  const published = [];
  const errors = [];
  const warnings = [];
  const archive = [];
  const dedup = [];
  const other = [];
  for (const e of entries) {
    if (!e) continue;
    if (e.event === "publish") published.push(e);
    else if (e.event === "warn") warnings.push(e);
    else if (e.event === "error") errors.push(e);
    else if (e.event === "archive") archive.push(e);
    else if (e.event === "dedup") dedup.push(e);
    else if (e.agent !== "daily-routine") continue;
    else other.push(e);
  }
  return { published, errors, warnings, archive, dedup, other };
}

async function composeEmail(date) {
  const entries = todaysEntries(date);
  const buckets = classifyEntries(entries);
  const briefQueue = activeBriefCount();
  const gsc = gscDelta(date);
  const geo = await fetchGeoSummary();

  // Status: OK if 5 articles published; PARTIAL if 1-4; FAILURE if 0
  let status, statusIcon;
  if (buckets.published.length >= 5) {
    status = "OK";
    statusIcon = "✅";
  } else if (buckets.published.length > 0) {
    status = "PARTIAL";
    statusIcon = "⚠️";
  } else {
    status = "FAILURE";
    statusIcon = "🔴";
  }

  const subject = `${statusIcon} Huamei SEO digest — ${date} — ${buckets.published.length} articles published`;

  const lines = [];
  lines.push(`<h2 style="margin-bottom:0;font-family:system-ui">${statusIcon} Daily SEO digest — ${date}</h2>`);
  lines.push(`<p style="color:#666;margin-top:4px;font-family:system-ui">Status: <strong>${status}</strong> · ${buckets.published.length}/5 articles · ${briefQueue} briefs in queue</p>`);

  // Articles published
  lines.push(`<h3 style="font-family:system-ui">📝 Articles published (${buckets.published.length})</h3>`);
  if (buckets.published.length === 0) {
    lines.push(`<p style="color:#a33;font-family:system-ui">No articles published today. Check the routine: <a href="${ROUTINE_URL}">${ROUTINE_URL}</a></p>`);
  } else {
    lines.push(`<ul style="font-family:system-ui;line-height:1.6">`);
    for (const e of buckets.published) {
      // details format: "<url> — <title>"
      const m = e.details.match(/^(https?:\/\/\S+)\s*[—-]\s*(.*)$/);
      if (m) {
        lines.push(`<li><a href="${m[1]}">${m[2]}</a></li>`);
      } else {
        lines.push(`<li>${e.details}</li>`);
      }
    }
    lines.push(`</ul>`);
  }

  // GSC delta
  if (gsc) {
    lines.push(`<h3 style="font-family:system-ui">📊 Google Search Console (28-day rolling)</h3>`);
    if (gsc.prior) {
      const dImpr = gsc.today.impressions - gsc.prior.impressions;
      const dQueries = gsc.today.queries - gsc.prior.queries;
      const sign = (n) => (n > 0 ? `+${n}` : `${n}`);
      lines.push(`<p style="font-family:system-ui;line-height:1.6">`);
      lines.push(`Impressions: <strong>${gsc.today.impressions}</strong> (${sign(dImpr)} vs ${gsc.prior.date})<br>`);
      lines.push(`Clicks: <strong>${gsc.today.clicks}</strong><br>`);
      lines.push(`Indexed queries: <strong>${gsc.today.queries}</strong> (${sign(dQueries)})`);
      lines.push(`</p>`);
    } else {
      lines.push(`<p style="font-family:system-ui">Today: ${gsc.today.impressions} impressions across ${gsc.today.queries} queries. No prior file to compare.</p>`);
    }
    if (gsc.movers.length > 0 && gsc.movers[0].delta > 0) {
      lines.push(`<p style="font-family:system-ui"><strong>Top gainers:</strong></p>`);
      lines.push(`<ul style="font-family:system-ui;line-height:1.6">`);
      for (const m of gsc.movers) {
        if (m.delta <= 0) continue;
        lines.push(`<li><code>${m.query}</code> on <code>${m.page}</code> — +${m.delta} impressions (${m.impressions} total)</li>`);
      }
      lines.push(`</ul>`);
    }
  } else {
    lines.push(`<h3 style="font-family:system-ui">📊 Google Search Console</h3>`);
    lines.push(`<p style="color:#a33;font-family:system-ui">No GSC pull for ${date} yet. Check the GSC GitHub Action.</p>`);
  }

  // Brief queue
  lines.push(`<h3 style="font-family:system-ui">📋 Brief queue</h3>`);
  lines.push(`<p style="font-family:system-ui">${briefQueue} active briefs waiting for the routine. ${briefQueue < 5 ? '<strong style="color:#c80">Queue running low — re-score or add keywords.</strong>' : ""}</p>`);

  // GEO citation tracking (from Sanity geoRun docs, last 7 days)
  const geoSection = renderGeoSection(geo);
  if (geoSection) lines.push(geoSection);

  // Warnings + errors
  if (buckets.warnings.length > 0 || buckets.errors.length > 0) {
    lines.push(`<h3 style="font-family:system-ui;color:#c80">⚠️ Warnings & errors (${buckets.warnings.length + buckets.errors.length})</h3>`);
    lines.push(`<ul style="font-family:system-ui;line-height:1.6;color:#333">`);
    for (const e of buckets.errors) {
      lines.push(`<li><strong style="color:#a33">ERROR:</strong> ${e.details}</li>`);
    }
    for (const e of buckets.warnings) {
      lines.push(`<li><strong style="color:#c80">WARN:</strong> ${e.details}</li>`);
    }
    lines.push(`</ul>`);
  }

  // Footer
  lines.push(`<hr style="margin-top:32px;border:none;border-top:1px solid #eee">`);
  lines.push(`<p style="font-family:system-ui;color:#999;font-size:12px">Auto-generated by daily-seo-digest workflow · Routine dashboard: <a href="${ROUTINE_URL}">${ROUTINE_URL}</a></p>`);

  return { subject, html: lines.join("\n"), status, articleCount: buckets.published.length };
}

async function sendEmail(subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing — set it in env to send.");
    process.exit(1);
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      html,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error(`Resend HTTP ${res.status}:`, body);
    process.exit(1);
  }
  return body;
}

async function main() {
  const flags = parseFlags();
  console.log(`[digest] composing for date=${flags.date}`);
  const { subject, html, status, articleCount } = await composeEmail(flags.date);
  console.log(`[digest] status=${status} articles=${articleCount}`);
  console.log(`[digest] subject: ${subject}`);
  if (flags.dryRun) {
    console.log("--- HTML body (dry-run) ---");
    console.log(html);
    return;
  }
  console.log(`[digest] sending to ${TO_EMAIL} from ${FROM_EMAIL}...`);
  const result = await sendEmail(subject, html);
  console.log(`[digest] sent. Resend id: ${result.id}`);
}

main().catch((err) => {
  console.error("[digest] failed:", err);
  process.exit(1);
});
