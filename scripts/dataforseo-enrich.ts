/**
 * DataForSEO keyword enrichment.
 *
 * Reads .seo/keywords/primary.yaml. For every entry without a fresh
 * `last_enriched_at` (default: stale after 30 days), batches up to 1,000
 * queries per request and asks the Google Ads Keyword Volume endpoint
 * for monthly search volume + CPC + competition + related queries.
 *
 * Writes results back into primary.yaml in-place, preserving the file's
 * comment/structure. Appends one JSON line to enrichment-log.jsonl per
 * API call.
 *
 * Run:
 *   npx tsx scripts/dataforseo-enrich.ts
 *
 * Flags (optional):
 *   --force           Re-enrich every keyword regardless of staleness
 *   --stale-days N    Override the 30-day staleness threshold
 *   --max N           Cap the number of keywords enriched in this run
 *   --dry-run         Show what would be enriched, don't call DataForSEO
 *
 * Env vars (required):
 *   DATAFORSEO_LOGIN
 *   DATAFORSEO_PASSWORD
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseDocument, Document } from "yaml";

// Load .env.local into process.env (no dotenv runtime dep)
{
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

const KEYWORDS_PATH = resolve(process.cwd(), ".seo/keywords/primary.yaml");
const LOG_PATH = resolve(process.cwd(), ".seo/keywords/enrichment-log.jsonl");
const API_BASE = "https://api.dataforseo.com/v3";

type KeywordRow = {
  query: string;
  intent: string;
  stage: string;
  priority: number;
  target_url?: string;
  notes?: string;
  volume_monthly?: number;
  cpc_usd?: number;
  competition?: number;
  related_queries?: string[];
  last_enriched_at?: string;
  location_code?: number;
  language_code?: string;
};

type Defaults = {
  location_code: number;
  language_code: string;
};

type Flags = {
  force: boolean;
  staleDays: number;
  max: number | null;
  dryRun: boolean;
};

function parseFlags(): Flags {
  const argv = process.argv.slice(2);
  const flags: Flags = { force: false, staleDays: 30, max: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") flags.force = true;
    else if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--stale-days") flags.staleDays = Number(argv[++i]);
    else if (a === "--max") flags.max = Number(argv[++i]);
  }
  return flags;
}

function authHeader(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    console.error("[enrich] DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing.");
    process.exit(1);
  }
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

function isStale(row: KeywordRow, staleDays: number): boolean {
  if (!row.last_enriched_at) return true;
  const ageMs = Date.now() - new Date(row.last_enriched_at).getTime();
  return ageMs > staleDays * 86_400_000;
}

type DfsTaskInput = {
  keywords: string[];
  location_code: number;
  language_code: string;
};

type DfsKeywordResult = {
  keyword: string;
  search_volume: number | null;
  cpc: number | null;
  // DataForSEO returns competition as a STRING ("HIGH" | "MEDIUM" | "LOW")
  // and competition_index as a 0-100 number. We normalize to 0-1 below.
  competition: string | null;
  competition_index: number | null;
  monthly_searches?: Array<{ year: number; month: number; search_volume: number }>;
};

async function callDataForSEO(
  input: DfsTaskInput,
): Promise<DfsKeywordResult[]> {
  const url = `${API_BASE}/keywords_data/google_ads/search_volume/live`;
  const body = [input];
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  const json: {
    status_code: number;
    status_message: string;
    cost: number;
    tasks?: Array<{
      status_code: number;
      status_message: string;
      result?: DfsKeywordResult[];
    }>;
  } = await res.json();

  appendFileSync(
    LOG_PATH,
    JSON.stringify({
      ts: new Date().toISOString(),
      endpoint: "google_ads/search_volume/live",
      input,
      cost: json.cost,
      status_code: json.status_code,
      status_message: json.status_message,
      result_count: json.tasks?.[0]?.result?.length ?? 0,
    }) + "\n",
  );

  if (json.status_code !== 20000) {
    throw new Error(
      `DataForSEO task failed: ${json.status_code} ${json.status_message}`,
    );
  }
  const task = json.tasks?.[0];
  if (!task) return [];
  if (task.status_code !== 20000) {
    throw new Error(
      `DataForSEO task ${task.status_code}: ${task.status_message}`,
    );
  }
  return task.result ?? [];
}

async function fetchRelatedQueries(
  keyword: string,
  defaults: Defaults,
): Promise<string[]> {
  const url = `${API_BASE}/keywords_data/google_ads/keywords_for_keywords/live`;
  const body = [
    {
      keywords: [keyword],
      location_code: defaults.location_code,
      language_code: defaults.language_code,
      limit: 5,
    },
  ];
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return [];
    const json: {
      cost: number;
      tasks?: Array<{ result?: Array<{ keyword: string }> }>;
    } = await res.json();
    appendFileSync(
      LOG_PATH,
      JSON.stringify({
        ts: new Date().toISOString(),
        endpoint: "google_ads/keywords_for_keywords/live",
        seed: keyword,
        cost: json.cost,
      }) + "\n",
    );
    const items = json.tasks?.[0]?.result ?? [];
    return items
      .map((it) => it.keyword)
      .filter((k) => k.toLowerCase() !== keyword.toLowerCase())
      .slice(0, 5);
  } catch {
    return [];
  }
}

async function main() {
  const flags = parseFlags();

  if (!existsSync(KEYWORDS_PATH)) {
    console.error(`[enrich] Not found: ${KEYWORDS_PATH}`);
    process.exit(1);
  }

  const raw = readFileSync(KEYWORDS_PATH, "utf8");
  const doc: Document = parseDocument(raw);
  const root = doc.toJS() as {
    defaults?: Defaults;
    keywords?: KeywordRow[];
  };
  const defaults: Defaults = {
    location_code: root.defaults?.location_code ?? 2840,
    language_code: root.defaults?.language_code ?? "en",
  };
  const keywords: KeywordRow[] = root.keywords ?? [];

  // Identify rows that need enriching.
  const targets: KeywordRow[] = [];
  for (const row of keywords) {
    if (flags.force || isStale(row, flags.staleDays)) {
      targets.push(row);
      if (flags.max && targets.length >= flags.max) break;
    }
  }

  console.log(`[enrich] ${keywords.length} total keywords, ${targets.length} need enriching.`);
  if (flags.dryRun) {
    for (const t of targets) console.log(`  - ${t.query}`);
    return;
  }
  if (targets.length === 0) {
    console.log("[enrich] Nothing to do. Pass --force to re-enrich anyway.");
    return;
  }

  // DataForSEO search_volume/live accepts up to 1,000 keywords per call.
  // We'll keep batches small (50) to stay polite on cost-per-call.
  const BATCH = 50;
  const queryList = targets.map((t) => t.query);
  const resultsByQuery = new Map<string, DfsKeywordResult>();

  for (let i = 0; i < queryList.length; i += BATCH) {
    const slice = queryList.slice(i, i + BATCH);
    console.log(`[enrich] batch ${i / BATCH + 1}: ${slice.length} keywords`);
    const results = await callDataForSEO({
      keywords: slice,
      location_code: defaults.location_code,
      language_code: defaults.language_code,
    });
    for (const r of results) {
      resultsByQuery.set(r.keyword.toLowerCase(), r);
    }
  }

  // Fetch related-queries for the top-priority rows only (priority 1 + 2)
  // to keep cost down; the rest stay un-expanded until they're promoted.
  for (const t of targets) {
    if (t.priority <= 2) {
      const related = await fetchRelatedQueries(t.query, defaults);
      if (related.length > 0) t.related_queries = related;
    }
  }

  // Merge results back into rows.
  let enriched = 0;
  for (const t of targets) {
    const r = resultsByQuery.get(t.query.toLowerCase());
    if (!r) continue;
    if (r.search_volume != null) t.volume_monthly = r.search_volume;
    if (r.cpc != null) t.cpc_usd = Math.round(r.cpc * 100) / 100;
    if (r.competition_index != null) {
      // 0-100 → 0-1 for consistency with the docs.
      t.competition = Math.round(r.competition_index) / 100;
    }
    t.last_enriched_at = new Date().toISOString();
    enriched++;
  }

  // Write back into the YAML doc, preserving structure.
  // Strategy: replace the `keywords` collection in the parsed Document
  // with the updated array. The yaml library preserves order + comments
  // for unchanged keys.
  const keywordsNode = doc.get("keywords", true);
  if (keywordsNode && typeof (keywordsNode as { items?: unknown[] }).items !== "undefined") {
    // Update individual items in place where the row was enriched.
    const items = (keywordsNode as { items: Array<{ toJSON: () => KeywordRow }> }).items;
    for (let i = 0; i < items.length; i++) {
      const original = (items[i] as unknown as { toJSON: () => KeywordRow }).toJSON();
      const updated = keywords[i]; // same index — we didn't reorder
      if (
        updated.last_enriched_at &&
        updated.last_enriched_at !== original.last_enriched_at
      ) {
        // Replace the whole item with the updated JS object; yaml will
        // re-serialize it. Comments on this specific item may be lost
        // but file-level comments are preserved.
        (doc.get("keywords") as unknown as { set: (i: number, v: unknown) => void }).set(
          i,
          updated,
        );
      }
    }
  }

  writeFileSync(KEYWORDS_PATH, String(doc));
  console.log(`[enrich] enriched ${enriched} keywords. Wrote ${KEYWORDS_PATH}.`);
}

main().catch((err) => {
  console.error("[enrich] failed:", err);
  process.exit(1);
});
