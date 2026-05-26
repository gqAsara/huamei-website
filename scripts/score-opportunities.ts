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
const REPORTS_DIR = resolve(process.cwd(), ".seo/reports");

// GSC near-miss opportunities: queries ranking 11-30 (page 2-3) where a
// rank push could plausibly land them on page 1. The scorer multiplies
// the base score by a near-miss bonus when the keyword has GSC presence
// in this range.
type GscRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

function loadLatestGsc(): Map<string, GscRow> {
  const byQuery = new Map<string, GscRow>();
  if (!existsSync(REPORTS_DIR)) return byQuery;
  const files = readdirSync(REPORTS_DIR)
    .filter((f) => /^gsc-\d{4}-\d{2}-\d{2}\.jsonl$/.test(f))
    .sort();
  if (files.length === 0) return byQuery;
  const latest = files[files.length - 1];
  const raw = readFileSync(join(REPORTS_DIR, latest), "utf8");
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line) as GscRow;
      // If the same query maps to multiple pages, keep the one with
      // the most impressions (the primary ranking page).
      const k = r.query.toLowerCase();
      const prior = byQuery.get(k);
      if (!prior || r.impressions > prior.impressions) byQuery.set(k, r);
    } catch {
      // skip malformed line
    }
  }
  return byQuery;
}

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

/**
 * Reads frontmatter from every content/blogs/*.md and returns the set of
 * every keyword (primaryKeyword + secondaryKeywords[]) covered by any
 * published blog, normalized to lower case.
 *
 * This is the operator → publish coordination channel: when the daily
 * SEO operator extends an article's content to target a query, it
 * appends the query to that article's `secondaryKeywords` frontmatter.
 * The scorer reads that on the next fire and dedupes against it, so
 * publish never drafts a brand-new article for a query the operator
 * already extended.
 */
function coveredKeywordsFromBlogs(): Set<string> {
  const covered = new Set<string>();
  if (!existsSync(BLOGS_DIR)) return covered;
  for (const f of readdirSync(BLOGS_DIR)) {
    if (!f.endsWith(".md")) continue;
    let raw: string;
    try {
      raw = readFileSync(join(BLOGS_DIR, f), "utf8");
    } catch {
      continue;
    }
    // Cheap frontmatter extraction (avoid pulling gray-matter into the
    // script; the format is stable enough to grep).
    const m = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = m[1];
    const primary = /^primaryKeyword:\s*"?([^"\n]+?)"?\s*$/m.exec(fm);
    if (primary) covered.add(primary[1].trim().toLowerCase());
    const secBlock = /^secondaryKeywords:\s*\n((?:\s+-\s+.+\n?)+)/m.exec(fm);
    if (secBlock) {
      for (const line of secBlock[1].split("\n")) {
        const lm = /^\s+-\s+"?([^"\n]+?)"?\s*$/.exec(line);
        if (lm) covered.add(lm[1].trim().toLowerCase());
      }
    }
  }
  return covered;
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
  gsc_position?: number;
  gsc_impressions?: number;
  gsc_page?: string;
};

function scoreKeyword(
  row: KeywordRow,
  blogSlugs: Set<string>,
  coveredKeywords: Set<string>,
  gscByQuery: Map<string, GscRow>,
): Scored {
  const slug = slugify(row.query);
  const intentMul = INTENT_WEIGHT[row.intent] ?? 1.0;
  const priorityMul = PRIORITY_WEIGHT[row.priority] ?? 1.0;
  // Three dedupe signals: (1) target_url file exists, (2) slugified query
  // matches an existing blog filename, (3) query appears verbatim in any
  // blog's primaryKeyword or secondaryKeywords frontmatter — the operator
  // writes there when it extends an article to cover a new query.
  const has_article =
    articleExists(row.target_url) ||
    blogSlugs.has(slug) ||
    coveredKeywords.has(row.query.trim().toLowerCase());

  // Base score: log of volume, weighted by intent + priority.
  const volume = row.volume_monthly ?? 0;
  const volumeComponent = Math.log10(volume + 10);
  const competitionPenalty = 1 - (row.competition ?? 0.5) * 0.3;
  const noArticleBonus = has_article ? 1.0 : 1.6;

  // GSC near-miss: rank 11-30 with non-zero impressions means we're close
  // to page 1. Optimization here is higher-leverage than writing yet
  // another new article. Scales 1.0 (no near-miss) to 2.5 (rank 11 with
  // many impressions).
  const gsc = gscByQuery.get(row.query.toLowerCase());
  let nearMissBonus = 1.0;
  if (gsc && gsc.position >= 11 && gsc.position <= 30) {
    // The closer to position 11 (page 2 top), the bigger the bonus.
    const positionFactor = (31 - gsc.position) / 20; // pos 11 → 1.0, pos 30 → 0.05
    const impressionFactor = Math.min(1.0, gsc.impressions / 100); // saturates at 100 impressions
    nearMissBonus = 1.0 + (1.5 * positionFactor * impressionFactor);
  }

  const score =
    volumeComponent *
    intentMul *
    priorityMul *
    noArticleBonus *
    competitionPenalty *
    nearMissBonus *
    10;

  let opportunity_type = "new_content";
  let reason = "";
  if (gsc && gsc.position >= 11 && gsc.position <= 30 && nearMissBonus > 1.5) {
    opportunity_type = "gsc_near_miss";
    reason = `Ranking #${gsc.position.toFixed(0)} on Google for "${row.query}" with ${gsc.impressions} impressions — push to page 1 by adding/optimizing content`;
  } else if (!has_article && volume > 100) {
    opportunity_type = "high_volume_gap";
    reason = `${volume.toLocaleString()} monthly searches, no article yet, ${row.intent} intent`;
  } else if (!has_article) {
    opportunity_type = "long_tail_gap";
    reason = `${row.intent} intent, ${row.stage} stage, no article yet`;
  } else {
    opportunity_type = "existing_target_optimize";
    reason = `Article exists (${row.target_url ?? "via slug match"})${gsc ? ` — GSC rank ${gsc.position.toFixed(0)}` : ""}`;
  }

  return {
    ...row,
    score,
    reason,
    slug,
    opportunity_type,
    has_article,
    gsc_position: gsc?.position,
    gsc_impressions: gsc?.impressions,
    gsc_page: gsc?.page,
  };
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
  const coveredKeywords = coveredKeywordsFromBlogs();
  if (coveredKeywords.size > 0) {
    console.log(`[scorer] ${coveredKeywords.size} keywords covered by published blog frontmatter (incl. operator extensions).`);
  }
  const briefSlugs = activeBriefSlugs();
  const gscByQuery = loadLatestGsc();
  if (gscByQuery.size > 0) {
    console.log(`[scorer] GSC data: ${gscByQuery.size} ranked queries from latest snapshot.`);
  } else {
    console.log(`[scorer] No GSC data yet — run scripts/gsc-pull.ts to enable near-miss detection.`);
  }

  const scored: Scored[] = rows
    .map((r) => scoreKeyword(r, blogSlugs, coveredKeywords, gscByQuery))
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
