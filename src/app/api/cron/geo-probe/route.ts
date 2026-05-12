import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { ENGINES, probeEngine, type Engine } from "@/lib/geo/engines";
import { analyzeCitations, type CompetitorDef } from "@/lib/geo/citations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min cap per Vercel function invocation

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken = process.env.SANITY_WRITE_TOKEN;
const cronSecret = process.env.CRON_SECRET;
const adminPassword = process.env.ADMIN_PASSWORD;

const DEFAULT_BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 25;

type PromptDoc = { _id: string; text: string };
type CompetitorDoc = { brand: string; domains: string[] };

function client() {
  if (!projectId || !writeToken) {
    throw new Error("Sanity write env not configured");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    token: writeToken,
    useCdn: false,
  });
}

function isAuthorized(req: NextRequest): boolean {
  if (!cronSecret && !adminPassword) return true; // dev fallback
  const auth = req.headers.get("authorization") ?? "";
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  if (adminPassword && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const presentedPass = decoded.split(":").slice(1).join(":");
      if (presentedPass === adminPassword) return true;
    } catch {
      // fall through
    }
  }
  const url = new URL(req.url);
  if (cronSecret && url.searchParams.get("secret") === cronSecret) return true;
  return false;
}

async function processOne(
  c: ReturnType<typeof client>,
  prompt: PromptDoc,
  competitors: CompetitorDef[],
  engine: Engine,
) {
  const result = await probeEngine(engine, prompt.text);
  const analysis = analyzeCitations(result.text, result.citedUrls, competitors);
  await c.create({
    _type: "geoRun",
    prompt: { _type: "reference", _ref: prompt._id },
    promptText: prompt.text,
    engine,
    model: result.model,
    runAt: new Date().toISOString(),
    responseText: result.text,
    citedUrls: result.citedUrls,
    ourDomainCited: analysis.ourDomainCited,
    ourBrandMentioned: analysis.ourBrandMentioned,
    ourCitationContext: analysis.ourCitationContext,
    competitorsCited: analysis.competitorsCited,
    error: result.error,
  });
  return {
    engine,
    promptId: prompt._id,
    ourDomainCited: analysis.ourDomainCited,
    error: result.error ?? null,
  };
}

/**
 * Fire the next batch in the chain. Uses Bearer CRON_SECRET so the
 * recipient route authorizes server-to-server regardless of how the
 * current invocation was authenticated. Fire-and-forget: we don't
 * await the response; the next batch runs in its own Vercel function
 * invocation with a fresh 5-min budget.
 */
async function kickNextBatch(req: NextRequest, nextOffset: number, batchSize: number, engineFilter: string | null) {
  if (!cronSecret) {
    console.warn("[geo-probe] cron secret missing — cannot chain to next batch");
    return;
  }
  const url = new URL(req.url);
  url.searchParams.set("offset", String(nextOffset));
  url.searchParams.set("batchSize", String(batchSize));
  if (engineFilter) url.searchParams.set("engine", engineFilter);
  url.searchParams.delete("secret");
  url.searchParams.delete("promptId"); // don't carry the single-prompt filter into batches
  try {
    // Don't await the body — but do start the request. We can't truly
    // fire-and-forget on Vercel functions because the function exits
    // when we return; instead, we use waitUntil semantics by attaching
    // to the returned promise without blocking on it.
    fetch(url.toString(), {
      method: "POST",
      headers: { Authorization: `Bearer ${cronSecret}` },
    }).catch((err) => console.warn("[geo-probe] chain fetch error", err));
  } catch (err) {
    console.warn("[geo-probe] chain kickoff failed", err);
  }
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const promptIdFilter = url.searchParams.get("promptId");
  const engineFilter = url.searchParams.get("engine") as Engine | null;
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10));
  const requestedBatch = parseInt(url.searchParams.get("batchSize") ?? `${DEFAULT_BATCH_SIZE}`, 10);
  const batchSize = Math.min(MAX_BATCH_SIZE, Math.max(1, requestedBatch));
  const chain = url.searchParams.get("chain") !== "0"; // default on

  let c;
  try {
    c = client();
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  // Single-prompt mode bypasses batching entirely.
  if (promptIdFilter) {
    const [prompt, competitors] = await Promise.all([
      c.fetch<PromptDoc | null>(`*[_type=="geoPrompt" && _id==$id][0]{ _id, text }`, { id: promptIdFilter }),
      c.fetch<CompetitorDoc[]>(`*[_type=="geoCompetitor" && isActive==true]{ brand, domains }`),
    ]);
    if (!prompt) {
      return NextResponse.json({ ok: false, error: "prompt not found" }, { status: 404 });
    }
    const enginesToRun = engineFilter && ENGINES.includes(engineFilter) ? [engineFilter] : ENGINES;
    const results = await Promise.all(
      enginesToRun.map((e) => processOne(c, prompt, competitors, e).catch((err) => ({
        engine: e,
        promptId: prompt._id,
        ourDomainCited: false,
        error: err instanceof Error ? err.message : String(err),
      }))),
    );
    return NextResponse.json({
      ok: true,
      mode: "single-prompt",
      promptId: prompt._id,
      runs: results.length,
      failures: results.filter((r) => (r as { error: string | null }).error).length,
    });
  }

  // Batched mode — paginate active prompts and self-chain.
  const [batch, total, competitors] = await Promise.all([
    c.fetch<PromptDoc[]>(
      `*[_type=="geoPrompt" && isActive==true] | order(priority asc, _createdAt asc) [$start...$end]{ _id, text }`,
      { start: offset, end: offset + batchSize },
    ),
    c.fetch<number>(`count(*[_type=="geoPrompt" && isActive==true])`),
    c.fetch<CompetitorDoc[]>(`*[_type=="geoCompetitor" && isActive==true]{ brand, domains }`),
  ]);

  if (!batch.length) {
    return NextResponse.json({
      ok: true,
      mode: "batched",
      processed: 0,
      offset,
      total,
      done: true,
      note: "no prompts at this offset",
    });
  }

  const enginesToRun = engineFilter && ENGINES.includes(engineFilter) ? [engineFilter] : ENGINES;

  // For each prompt, run all engines in parallel. Prompts within a batch
  // also run in parallel — a 10-prompt batch × 3 engines = 30 concurrent
  // probes, fits well within provider rate limits.
  const results = await Promise.all(
    batch.flatMap((p) =>
      enginesToRun.map((e) =>
        processOne(c, p, competitors, e).catch((err) => ({
          engine: e,
          promptId: p._id,
          ourDomainCited: false,
          error: err instanceof Error ? err.message : String(err),
        })),
      ),
    ),
  );

  const nextOffset = offset + batch.length;
  const hasMore = nextOffset < total;

  // Fire next batch if there's more and chaining isn't disabled.
  if (hasMore && chain) {
    await kickNextBatch(req, nextOffset, batchSize, engineFilter);
  }

  return NextResponse.json({
    ok: true,
    mode: "batched",
    processed: batch.length,
    runs: results.length,
    failures: results.filter((r) => (r as { error: string | null }).error).length,
    offset,
    nextOffset: hasMore ? nextOffset : null,
    total,
    remaining: Math.max(0, total - nextOffset),
    done: !hasMore,
    chained: hasMore && chain,
  });
}
