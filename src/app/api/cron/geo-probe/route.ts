import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { ENGINES, probeEngine, type Engine } from "@/lib/geo/engines";
import { analyzeCitations, type CompetitorDef } from "@/lib/geo/citations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // up to 5 min per fan-out batch

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken = process.env.SANITY_WRITE_TOKEN;
const cronSecret = process.env.CRON_SECRET;
const adminPassword = process.env.ADMIN_PASSWORD;

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
  // Dev fallback — allow if neither secret nor admin password is set.
  if (!cronSecret && !adminPassword) return true;

  const auth = req.headers.get("authorization") ?? "";

  // 1. Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;

  // 2. Browser-driven "Run all now" / "Re-run this prompt" buttons come
  //    from /admin/geo, which proxy.ts has basic-auth-gated. The browser
  //    sends those Basic credentials with the form POST. Accept them
  //    when the password matches ADMIN_PASSWORD.
  if (adminPassword && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const presentedPass = decoded.split(":").slice(1).join(":");
      if (presentedPass === adminPassword) return true;
    } catch {
      // Fall through to 401.
    }
  }

  // 3. Manual override via query param (for curl testing).
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
  const promptIdFilter = url.searchParams.get("promptId"); // optional: probe one
  const engineFilter = url.searchParams.get("engine") as Engine | null;
  const limit = Number(url.searchParams.get("limit") ?? "50");

  let c;
  try {
    c = client();
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  // Fetch active prompts (optionally filtered to one) and competitors.
  const promptsQuery = promptIdFilter
    ? `*[_type=="geoPrompt" && _id==$id][0...$limit]{ _id, text }`
    : `*[_type=="geoPrompt" && isActive==true] | order(priority asc) [0...$limit]{ _id, text }`;
  const [prompts, competitors] = await Promise.all([
    c.fetch<PromptDoc[]>(promptsQuery, { id: promptIdFilter, limit }),
    c.fetch<CompetitorDoc[]>(
      `*[_type=="geoCompetitor" && isActive==true]{ brand, domains }`,
    ),
  ]);

  if (!prompts.length) {
    return NextResponse.json({ ok: true, processed: 0, note: "no active prompts" });
  }

  const enginesToRun = engineFilter && ENGINES.includes(engineFilter)
    ? [engineFilter]
    : ENGINES;

  // Run in batches: 3 concurrent prompts × 3 engines = 9 in flight; throttle so
  // we don't blow past per-provider rate limits.
  const results: unknown[] = [];
  for (const p of prompts) {
    const batch = await Promise.all(
      enginesToRun.map((e) => processOne(c, p, competitors, e).catch((err) => ({
        engine: e,
        promptId: p._id,
        ourDomainCited: false,
        error: err instanceof Error ? err.message : String(err),
      }))),
    );
    results.push(...batch);
  }

  return NextResponse.json({
    ok: true,
    promptsProcessed: prompts.length,
    engines: enginesToRun,
    runs: results.length,
    failures: results.filter((r) => (r as { error: string | null }).error).length,
  });
}
