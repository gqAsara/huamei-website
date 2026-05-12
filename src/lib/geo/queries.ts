/**
 * Read-side GROQ queries for the /admin/geo dashboard.
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

function client() {
  if (!projectId) throw new Error("Sanity not configured");
  return createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "published",
  });
}

export type Prompt = {
  _id: string;
  text: string;
  stage: string;
  intent: string;
  priority: number;
  isActive: boolean;
};

export type RunSummary = {
  _id: string;
  promptId: string;
  promptText: string;
  engine: "claude" | "openai" | "perplexity";
  model: string;
  runAt: string;
  ourDomainCited: boolean;
  ourBrandMentioned: boolean;
  ourCitationContext: string;
  competitorsCited: { brand: string; domain: string }[];
  citedUrlsCount: number;
  error: string | null;
};

export type RunDetail = RunSummary & {
  responseText: string;
  citedUrls: string[];
};

export async function getAllPrompts(): Promise<Prompt[]> {
  if (!projectId) return [];
  const c = client();
  return c.fetch(`*[_type=="geoPrompt"] | order(priority asc, _createdAt desc){
    _id, text, stage, intent, priority, isActive
  }`);
}

/**
 * For each prompt × engine, return the most recent run. Used by the matrix view.
 */
export async function getLatestRunsMatrix(): Promise<RunSummary[]> {
  if (!projectId) return [];
  const c = client();
  return c.fetch(`*[_type=="geoRun"]{
    "key": prompt._ref + "::" + engine,
    "promptId": prompt._ref,
    promptText, engine, model, runAt,
    ourDomainCited, ourBrandMentioned, ourCitationContext,
    competitorsCited,
    "citedUrlsCount": count(citedUrls),
    error,
    _id,
  } | order(runAt desc)`);
}

/**
 * All runs for a single prompt — time series view.
 */
export async function getRunsForPrompt(promptId: string): Promise<RunDetail[]> {
  if (!projectId) return [];
  const c = client();
  return c.fetch(
    `*[_type=="geoRun" && prompt._ref==$id] | order(runAt desc){
      _id, "promptId": prompt._ref, promptText, engine, model, runAt,
      responseText, citedUrls, "citedUrlsCount": count(citedUrls),
      ourDomainCited, ourBrandMentioned, ourCitationContext,
      competitorsCited, error
    }`,
    { id: promptId },
  );
}

export async function getActiveCompetitors(): Promise<{ brand: string; domains: string[] }[]> {
  if (!projectId) return [];
  const c = client();
  return c.fetch(`*[_type=="geoCompetitor" && isActive==true]{ brand, domains }`);
}

/**
 * For each prompt, find the most recent run per engine.
 * Returns deduplicated set (one row per prompt × engine).
 */
export function dedupeMatrixToLatest(rows: RunSummary[]): RunSummary[] {
  const seen = new Map<string, RunSummary>();
  for (const r of rows) {
    const key = `${r.promptId}::${r.engine}`;
    if (!seen.has(key)) seen.set(key, r); // first occurrence is most recent due to order
  }
  return Array.from(seen.values());
}

export type ShareOfVoice = {
  totalRuns: number;
  huameiCited: number;
  huameiMentioned: number;
  shareOfVoicePct: number; // huameiCited / total (last-run-per-prompt-engine)
  competitorCounts: { brand: string; count: number }[];
};

export function computeShareOfVoice(latest: RunSummary[]): ShareOfVoice {
  const total = latest.length;
  let cited = 0;
  let mentioned = 0;
  const compCounts = new Map<string, number>();
  for (const r of latest) {
    if (r.ourDomainCited) cited++;
    if (r.ourBrandMentioned) mentioned++;
    for (const c of r.competitorsCited ?? []) {
      compCounts.set(c.brand, (compCounts.get(c.brand) ?? 0) + 1);
    }
  }
  return {
    totalRuns: total,
    huameiCited: cited,
    huameiMentioned: mentioned,
    shareOfVoicePct: total ? Math.round((cited / total) * 100) : 0,
    competitorCounts: Array.from(compCounts.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/**
 * Returns the timestamp of the most recent run across all prompts/engines.
 * Used to display "probing now" indicator if a run is fresh (<10 min).
 */
export async function getMostRecentRunAt(): Promise<string | null> {
  if (!projectId) return null;
  const c = client();
  const result = await c.fetch<{ runAt: string } | null>(
    `*[_type=="geoRun"] | order(runAt desc)[0]{ runAt }`,
  );
  return result?.runAt ?? null;
}

/**
 * Counts runs created in the last N seconds.
 * Used as the "probing now" signal.
 */
export async function getRecentRunCount(seconds: number): Promise<number> {
  if (!projectId) return 0;
  const c = client();
  const cutoff = new Date(Date.now() - seconds * 1000).toISOString();
  return c.fetch<number>(
    `count(*[_type=="geoRun" && runAt > $cutoff])`,
    { cutoff },
  );
}
