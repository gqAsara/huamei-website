/**
 * Pull the latest GEO run data from Sanity and print a structured
 * analysis: share of voice, per-engine win/miss, top-cited domains
 * (us + competitors), prompts where we're winning, and prompts where
 * we're absent.
 *
 * Run: NPM_CONFIG_CACHE=/tmp/npm-cache-huamei npx tsx scripts/geo-analyze.ts
 */

import { config } from "dotenv";
import { createClient } from "@sanity/client";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID missing — run `vercel env pull .env.local`");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "published",
  token,
});

type Run = {
  _id: string;
  engine: "claude" | "openai" | "perplexity";
  model: string;
  runAt: string;
  ourDomainCited: boolean;
  ourBrandMentioned: boolean;
  ourCitationContext: string;
  competitorsCited: { brand: string; domain: string }[];
  citedUrls: string[];
  responseText: string;
  error: string | null;
  prompt: { _id: string; text: string; stage: string; intent: string; priority: number; isActive: boolean };
};

async function main() {
  const runs = await client.fetch<Run[]>(`
    *[_type == "geoRun"] | order(runAt desc) {
      _id, engine, model, runAt,
      ourDomainCited, ourBrandMentioned, ourCitationContext,
      competitorsCited, citedUrls, responseText, error,
      "prompt": prompt-> {
        _id, text, stage, intent, priority, isActive
      }
    }
  `);

  console.log(`\n=== HuameiGEO run analysis ===`);
  console.log(`Total run records:  ${runs.length}`);

  // Dedupe to latest run per (promptId, engine)
  const latestByKey = new Map<string, Run>();
  for (const r of runs) {
    if (!r.prompt) continue;
    const key = `${r.prompt._id}::${r.engine}`;
    if (!latestByKey.has(key)) latestByKey.set(key, r);
  }
  const latest = Array.from(latestByKey.values());
  console.log(`Latest runs (deduped to one per prompt × engine):  ${latest.length}`);

  // Active vs error
  const errored = latest.filter((r) => r.error);
  const ok = latest.filter((r) => !r.error);
  console.log(`  ok:     ${ok.length}`);
  console.log(`  error:  ${errored.length}`);
  if (errored.length > 0) {
    const errBuckets = new Map<string, number>();
    for (const r of errored) {
      const k = (r.error || "").slice(0, 80);
      errBuckets.set(k, (errBuckets.get(k) ?? 0) + 1);
    }
    for (const [msg, n] of errBuckets) console.log(`    ${n}x  "${msg}"`);
  }

  // Share of voice
  const cited = ok.filter((r) => r.ourDomainCited);
  const mentioned = ok.filter((r) => r.ourBrandMentioned && !r.ourDomainCited);
  const missed = ok.filter((r) => !r.ourBrandMentioned && !r.ourDomainCited);

  console.log(`\n=== Share of Voice ===`);
  console.log(`Domain cited (huamei.io link):     ${cited.length}  (${pct(cited.length, ok.length)}%)`);
  console.log(`Brand mentioned (no link):         ${mentioned.length}  (${pct(mentioned.length, ok.length)}%)`);
  console.log(`Not mentioned at all:              ${missed.length}  (${pct(missed.length, ok.length)}%)`);

  // Per-engine breakdown
  console.log(`\n=== Per-engine performance ===`);
  for (const eng of ["claude", "openai", "perplexity"] as const) {
    const e = ok.filter((r) => r.engine === eng);
    const ec = e.filter((r) => r.ourDomainCited);
    const em = e.filter((r) => r.ourBrandMentioned && !r.ourDomainCited);
    console.log(`  ${eng.padEnd(10)} ${e.length} runs · cited ${ec.length} (${pct(ec.length, e.length)}%) · mentioned ${em.length} (${pct(em.length, e.length)}%)`);
  }

  // Per-stage breakdown
  console.log(`\n=== Per-stage performance ===`);
  const stages = ["discovery", "evaluation", "comparison", "decision", "procurement"];
  for (const stage of stages) {
    const s = ok.filter((r) => r.prompt?.stage === stage);
    if (s.length === 0) continue;
    const sc = s.filter((r) => r.ourDomainCited);
    const sm = s.filter((r) => r.ourBrandMentioned && !r.ourDomainCited);
    console.log(`  ${stage.padEnd(14)} ${s.length} runs · cited ${sc.length} (${pct(sc.length, s.length)}%) · mentioned ${sm.length} (${pct(sm.length, s.length)}%)`);
  }

  // Competitor share
  console.log(`\n=== Competitor citations (across all runs) ===`);
  const compCounts = new Map<string, number>();
  for (const r of ok) {
    for (const c of r.competitorsCited ?? []) {
      compCounts.set(c.brand, (compCounts.get(c.brand) ?? 0) + 1);
    }
  }
  const compSorted = Array.from(compCounts.entries()).sort((a, b) => b[1] - a[1]);
  if (compSorted.length === 0) {
    console.log(`  (no competitors detected in any cited URL)`);
  } else {
    for (const [brand, n] of compSorted) {
      console.log(`  ${brand.padEnd(28)} ${n}`);
    }
  }

  // Top non-competitor cited domains (the "neutral" web)
  console.log(`\n=== Top cited domains (all sources) ===`);
  const domCounts = new Map<string, number>();
  for (const r of ok) {
    const seen = new Set<string>();
    for (const u of r.citedUrls ?? []) {
      try {
        const host = new URL(u).host.toLowerCase().replace(/^www\./, "");
        if (seen.has(host)) continue;
        seen.add(host);
        domCounts.set(host, (domCounts.get(host) ?? 0) + 1);
      } catch {
        // skip
      }
    }
  }
  const domSorted = Array.from(domCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20);
  for (const [host, n] of domSorted) {
    const flag = host.includes("huamei") ? " ← us" : "";
    console.log(`  ${host.padEnd(40)} ${n}${flag}`);
  }

  // Prompts where we won
  console.log(`\n=== Prompts where huamei.io was cited (any engine) ===`);
  const wonByPromptId = new Map<string, { text: string; stage: string; priority: number; engines: string[] }>();
  for (const r of cited) {
    if (!r.prompt) continue;
    const cur = wonByPromptId.get(r.prompt._id) ?? {
      text: r.prompt.text,
      stage: r.prompt.stage,
      priority: r.prompt.priority,
      engines: [],
    };
    cur.engines.push(r.engine);
    wonByPromptId.set(r.prompt._id, cur);
  }
  if (wonByPromptId.size === 0) {
    console.log(`  (none — zero prompts cited huamei.io across any engine)`);
  } else {
    const wonSorted = Array.from(wonByPromptId.values()).sort((a, b) => b.priority - a.priority);
    for (const p of wonSorted) {
      console.log(`  [${p.stage}/p${p.priority}] ${p.text}`);
      console.log(`      cited by: ${p.engines.join(", ")}`);
    }
  }

  // Top-priority prompts we lost on
  console.log(`\n=== High-priority prompts where huamei.io was absent (all engines) ===`);
  const byPrompt = new Map<string, Run[]>();
  for (const r of ok) {
    if (!r.prompt) continue;
    const arr = byPrompt.get(r.prompt._id) ?? [];
    arr.push(r);
    byPrompt.set(r.prompt._id, arr);
  }
  type LostRow = { text: string; stage: string; priority: number; mentions: number; total: number };
  const lost: LostRow[] = [];
  for (const [, rs] of byPrompt) {
    if (rs.length === 0) continue;
    const p = rs[0].prompt;
    const anyCited = rs.some((r) => r.ourDomainCited);
    if (anyCited) continue;
    const mentions = rs.filter((r) => r.ourBrandMentioned).length;
    lost.push({
      text: p.text,
      stage: p.stage,
      priority: p.priority,
      mentions,
      total: rs.length,
    });
  }
  lost.sort((a, b) => b.priority - a.priority || a.mentions - b.mentions);
  for (const p of lost.slice(0, 15)) {
    const tag = p.mentions > 0 ? `mentioned ${p.mentions}/${p.total}` : "absent";
    console.log(`  [${p.stage}/p${p.priority}] (${tag}) ${p.text}`);
  }

  // Citation context snippets (where huamei.io did appear)
  if (cited.length > 0) {
    console.log(`\n=== Citation context (how AI engines describe Huamei) ===`);
    const contexts = cited
      .map((r) => r.ourCitationContext)
      .filter((c) => c && c.length > 0)
      .slice(0, 5);
    for (const c of contexts) {
      console.log(`  • "${c.slice(0, 240)}${c.length > 240 ? "…" : ""}"`);
    }
  }

  console.log(`\n=== Summary ===`);
  const sov = pct(cited.length, ok.length);
  console.log(`Share of voice (domain cited): ${sov}%`);
  console.log(`Prompts won (cited on at least one engine): ${wonByPromptId.size} of ${byPrompt.size}`);
  console.log(`Engines that worked: ${["claude","openai","perplexity"].filter(e => ok.some(r => r.engine === e)).join(", ")}`);
  console.log();
}

function pct(n: number, d: number): string {
  if (d === 0) return "0";
  return ((n * 100) / d).toFixed(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
