/**
 * Opportunity scorer + brief generator.
 *
 * Reads:
 *   - .seo/keywords/primary.yaml — keyword registry with volume data
 *   - content/blogs/*.md — existing articles (for dedupe)
 *   - .seo/briefs/*.md (active) and .seo/briefs/published/*.md (history)
 *
 * Writes:
 *   - .seo/briefs/auto-<date>-<rank>-<slug>.md — top N opportunities
 *
 * Future (v2, gated on GSC + Sanity reads):
 *   - GSC near-miss detection (rank 11-30 with rising impressions)
 *   - AI-prompt citation gap (geoRun docs from Sanity)
 *
 * Run:
 *   npx tsx scripts/score-opportunities.ts
 *
 * Flags:
 *   --top N          How many briefs to emit (default 10)
 *   --dry-run        Show ranked opportunities, don't write briefs
 *   --include-existing  Score keywords even if their target article exists
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { parse as parseYaml } from "yaml";

const KEYWORDS_PATH = resolve(process.cwd(), ".seo/keywords/primary.yaml");
const BLOGS_DIR = resolve(process.cwd(), "content/blogs");
const BRIEFS_DIR = resolve(process.cwd(), ".seo/briefs");
const PUBLISHED_DIR = resolve(BRIEFS_DIR, "published");

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
};

type Flags = {
  top: number;
  dryRun: boolean;
  includeExisting: boolean;
};

function parseFlags(): Flags {
  const argv = process.argv.slice(2);
  const f: Flags = { top: 10, dryRun: false, includeExisting: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--top") f.top = Number(argv[++i]);
    else if (a === "--dry-run") f.dryRun = true;
    else if (a === "--include-existing") f.includeExisting = true;
  }
  return f;
}

const INTENT_WEIGHT: Record<string, number> = {
  transactional: 1.6,
  commercial: 1.4,
  investigative: 1.0,
  informational: 0.7,
};

const PRIORITY_WEIGHT: Record<number, number> = {
  1: 2.0,
  2: 1.5,
  3: 1.0,
  4: 0.7,
  5: 0.5,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function articleExists(targetUrl: string | undefined): boolean {
  if (!targetUrl) return false;
  if (!targetUrl.startsWith("/blogs/")) return false; // /craft, /industry routes are commercial pages, not blogs
  const slug = targetUrl.replace(/^\/blogs\//, "").replace(/\/$/, "");
  const path = join(BLOGS_DIR, `${slug}.md`);
  return existsSync(path);
}

function existingBlogSlugs(): Set<string> {
  if (!existsSync(BLOGS_DIR)) return new Set();
  return new Set(
    readdirSync(BLOGS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, "")),
  );
}

function activeBriefSlugs(): Set<string> {
  if (!existsSync(BRIEFS_DIR)) return new Set();
  return new Set(
    readdirSync(BRIEFS_DIR)
      .filter((f) => f.startsWith("auto-") && f.endsWith(".md"))
      .map((f) => f.replace(/^auto-\d{4}-\d{2}-\d{2}-\d{3}-/, "").replace(/\.md$/, "")),
  );
}

type Scored = KeywordRow & {
  score: number;
  reason: string;
  slug: string;
  opportunity_type: string;
  has_article: boolean;
};

function scoreKeyword(row: KeywordRow, blogSlugs: Set<string>): Scored {
  const slug = slugify(row.query);
  const intentMul = INTENT_WEIGHT[row.intent] ?? 1.0;
  const priorityMul = PRIORITY_WEIGHT[row.priority] ?? 1.0;
  const has_article = articleExists(row.target_url) || blogSlugs.has(slug);

  // Base score: log of volume, weighted by intent + priority.
  // Volume = 0 (untracked) maps to a small floor so the row can still score.
  const volume = row.volume_monthly ?? 0;
  const volumeComponent = Math.log10(volume + 10); // 10 → 1.04, 100 → 2.04, 1000 → 3.0, 3600 → 3.56
  const competitionPenalty = 1 - (row.competition ?? 0.5) * 0.3; // up to 30% penalty for max-comp

  // No-article bonus: writing about a query that doesn't have a target yet is the highest-leverage move.
  const noArticleBonus = has_article ? 1.0 : 1.6;

  const score = volumeComponent * intentMul * priorityMul * noArticleBonus * competitionPenalty * 10;

  let opportunity_type = "new_content";
  let reason = "";
  if (!has_article && volume > 100) {
    opportunity_type = "high_volume_gap";
    reason = `${volume.toLocaleString()} monthly searches, no article yet, ${row.intent} intent`;
  } else if (!has_article) {
    opportunity_type = "long_tail_gap";
    reason = `${row.intent} intent, ${row.stage} stage, no article yet`;
  } else {
    opportunity_type = "existing_target_optimize";
    reason = `Article exists (${row.target_url ?? "via slug match"}); needs GSC data to know if optimization is warranted`;
  }

  return { ...row, score, reason, slug, opportunity_type, has_article };
}

function generateBrief(opp: Scored, rank: number, dateStamp: string): string {
  const briefSlug = `${opp.slug.slice(0, 50)}`;
  const briefId = `auto-${dateStamp}-${String(rank).padStart(3, "0")}-${briefSlug}`;

  const lines: string[] = [];
  lines.push("---");
  lines.push(`brief_id: "${briefId}"`);
  lines.push(`generated_at: "${new Date().toISOString()}"`);
  lines.push(`rank: ${rank}`);
  lines.push(`target_query: ${JSON.stringify(opp.query)}`);
  lines.push(`opportunity_type: ${JSON.stringify(opp.opportunity_type)}`);
  lines.push(`seo_score: ${Math.round(opp.score * 10) / 10}`);
  lines.push(`intent: ${JSON.stringify(opp.intent)}`);
  lines.push(`stage: ${JSON.stringify(opp.stage)}`);
  lines.push(`priority: ${opp.priority}`);
  if (opp.volume_monthly != null) lines.push(`volume_monthly: ${opp.volume_monthly}`);
  if (opp.competition != null) lines.push(`competition: ${opp.competition}`);
  if (opp.cpc_usd != null) lines.push(`cpc_usd: ${opp.cpc_usd}`);
  if (opp.target_url) lines.push(`target_url: ${JSON.stringify(opp.target_url)}`);
  if (opp.notes) lines.push(`notes: ${JSON.stringify(opp.notes)}`);
  lines.push(`has_article: ${opp.has_article}`);
  lines.push("---");
  lines.push("");
  lines.push(`# Brief: ${opp.query}`);
  lines.push("");
  lines.push(`**Why this one (auto-scored ${Math.round(opp.score * 10) / 10}):** ${opp.reason}`);
  lines.push("");
  lines.push("## Voice + structure guardrails");
  lines.push("");
  lines.push(
    "Follow `.seo/SEO_CONTEXT.md` Phase-2 GEO rules: every H2 leads with a declarative one-sentence answer; visible publication + updated dates in body; 3+ entity links on first mention; 3–7 quote-able API-ready sentences; byline credential expansion within the first 200 words.",
  );
  lines.push("");
  lines.push("## What to anchor on");
  lines.push("");
  if (opp.intent === "commercial" || opp.intent === "transactional") {
    lines.push(
      "Buyer-facing register. Lead the article with the load-bearing answer (MOQ, lead time, capability range). Tie to Huamei's published facts: 1992 founding, four-province footprint, 200+ MOQ floor, 7–10 day samples, 15–20 day production, BSCI/CE/EQS/FSC/SGS certifications, >80% solar share. End with a clear `/begin` CTA.",
    );
  } else {
    lines.push(
      "Editorial register. Anchor each H2 to a number or named technique. Use the long-form material vocabulary established in the existing pillars. End with a softer CTA — `/volumes` or `/begin`.",
    );
  }
  lines.push("");
  if (opp.target_url) {
    lines.push(`## Target URL: \`${opp.target_url}\``);
    lines.push("");
    if (opp.has_article) {
      lines.push(
        "**An article already exists at this URL.** This brief is for refinement or expansion — only act on it after pulling GSC data for this slug and confirming there's a rank-improvement opportunity. Otherwise skip and move to the next brief.",
      );
    } else {
      lines.push(
        "No article exists at this slug yet. Draft a new one. Target query is the H1 anchor.",
      );
    }
    lines.push("");
  }
  if (opp.related_queries && opp.related_queries.length > 0) {
    lines.push("## Related queries (use as H2 question forms)");
    lines.push("");
    for (const r of opp.related_queries) lines.push(`- ${r}`);
    lines.push("");
  }
  lines.push("## Recommended internal links");
  lines.push("");
  lines.push("Pick at least 2 of these (the routine's `/blogs/*` route schema requires it):");
  lines.push("");
  if (opp.intent === "commercial") {
    lines.push("- `/craft/rigid` or relevant `/craft/<surface-or-structure>`");
    lines.push("- `/industry/<sector>` (cosmetic / spirits / seasonal / wellness)");
    lines.push("- At least one `/volumes/<slug>` case study — pick from the authorized roster in `src/lib/volumes.ts`");
  } else {
    lines.push("- The relevant `/craft/<topic>` page");
    lines.push("- One Pillar post in `/blogs/` (custom-luxury-rigid-box-manufacturing, hot-foil-stamping-for-luxury-packaging, or working-with-a-chinese-luxury-packaging-manufacturer)");
    lines.push("- A `/volumes/<slug>` case that demonstrates the technique");
  }
  lines.push("");
  lines.push("## Featured-snippet answer to target");
  lines.push("");
  lines.push(`Write a 30–40 word declarative answer under a question-form H2 such as: \`## What is ${opp.query}?\`. Lead with the answer, then 2–3 supporting sentences with a number.`);
  lines.push("");
  lines.push("## Dedupe check");
  lines.push("");
  lines.push("Before drafting, grep `content/blogs/` for an existing slug or near-same title. If overlap, skip to the next brief.");
  lines.push("");

  return lines.join("\n");
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const flags = parseFlags();

  if (!existsSync(KEYWORDS_PATH)) {
    console.error(`[scorer] Missing: ${KEYWORDS_PATH}`);
    process.exit(1);
  }
  const raw = readFileSync(KEYWORDS_PATH, "utf8");
  const parsed = parseYaml(raw) as { keywords?: KeywordRow[] };
  const rows = parsed.keywords ?? [];
  console.log(`[scorer] ${rows.length} keywords loaded.`);

  const blogSlugs = existingBlogSlugs();
  const briefSlugs = activeBriefSlugs();

  const scored: Scored[] = rows
    .map((r) => scoreKeyword(r, blogSlugs))
    .sort((a, b) => b.score - a.score);

  let pool = scored;
  if (!flags.includeExisting) {
    pool = scored.filter((s) => !s.has_article);
  }
  pool = pool.filter((s) => !briefSlugs.has(s.slug)); // dedupe against active briefs

  console.log(`[scorer] ${pool.length} candidates after dedupe (excluding articles already drafted).`);
  const top = pool.slice(0, flags.top);

  if (top.length === 0) {
    console.log("[scorer] No qualifying opportunities. All target queries have articles. Add new keywords or pass --include-existing.");
    return;
  }

  console.log("[scorer] Top opportunities:");
  for (let i = 0; i < top.length; i++) {
    const o = top[i];
    console.log(`  #${i + 1} score=${o.score.toFixed(1)} vol=${o.volume_monthly ?? "—"} ${o.query} (${o.reason})`);
  }

  if (flags.dryRun) return;

  if (!existsSync(BRIEFS_DIR)) mkdirSync(BRIEFS_DIR, { recursive: true });
  if (!existsSync(PUBLISHED_DIR)) mkdirSync(PUBLISHED_DIR, { recursive: true });

  const stamp = dateStamp();
  let written = 0;
  for (let i = 0; i < top.length; i++) {
    const rank = i + 1;
    const opp = top[i];
    const filename = `auto-${stamp}-${String(rank).padStart(3, "0")}-${opp.slug.slice(0, 50)}.md`;
    const path = join(BRIEFS_DIR, filename);
    const brief = generateBrief(opp, rank, stamp);
    writeFileSync(path, brief);
    written++;
  }
  console.log(`[scorer] wrote ${written} briefs to ${BRIEFS_DIR}`);
}

main().catch((err) => {
  console.error("[scorer] failed:", err);
  process.exit(1);
});
