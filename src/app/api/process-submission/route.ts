import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { processSubmissionWithAI } from "@/lib/ai/processSubmission";
import { nextRoman } from "@/lib/roman";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // AI vision call can take 30–90s

type SanityImageRef = {
  _key?: string;
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type SubmissionDoc = {
  _id: string;
  projectName: string;
  client: string;
  year: number;
  materials?: string;
  notes?: string;
  photos: SanityImageRef[];
  status?: string;
  generatedCaseStudy?: { _ref: string };
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken = process.env.SANITY_WRITE_TOKEN;
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

function client() {
  if (!projectId || !writeToken) {
    throw new Error("Sanity env not configured for write access");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    token: writeToken,
    useCdn: false,
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function industryDocId(name: string): string {
  return `industry-${slugify(name)}`;
}

function caseStudyDocId(slug: string): string {
  return `caseStudy-${slug}`;
}

async function uniqueSlug(c: ReturnType<typeof client>, base: string): Promise<string> {
  let slug = base || "case";
  let n = 1;
  while (
    await c.fetch<boolean>(`defined(*[_type=="caseStudy" && slug.current==$s][0])`, {
      s: slug,
    })
  ) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

async function findOrCreateIndustry(
  c: ReturnType<typeof client>,
  name: string,
): Promise<string> {
  // Match by exact title (case-insensitive).
  const existing = await c.fetch<{ _id: string } | null>(
    `*[_type=="industry" && lower(title)==lower($n)][0]{_id}`,
    { n: name },
  );
  if (existing?._id) return existing._id;

  // Create new.
  const _id = industryDocId(name);
  const slug = _id.replace(/^industry-/, "");
  await c.createOrReplace({
    _id,
    _type: "industry",
    title: name,
    slug: { _type: "slug", current: slug },
  });
  return _id;
}

export async function POST(req: NextRequest) {
  // Validate webhook secret. Sanity sends it as the
  // `sanity-webhook-signature` header by default; we use a simple
  // shared-secret header for clarity.
  const presented = req.headers.get("x-webhook-secret");
  if (!webhookSecret || presented !== webhookSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { _id?: string; _type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (body._type !== "caseStudySubmission" || !body._id) {
    return NextResponse.json({ error: "wrong doc type" }, { status: 400 });
  }

  // Strip drafts.<id> prefix if present — Sanity webhooks fire on both.
  const submissionId = body._id.replace(/^drafts\./, "");
  const c = client();

  // Fetch the published submission.
  const sub = await c.fetch<SubmissionDoc | null>(
    `*[_type=="caseStudySubmission" && _id==$id][0]`,
    { id: submissionId },
  );
  if (!sub) {
    return NextResponse.json({ error: "submission not found" }, { status: 404 });
  }

  // Idempotency: if already published, no-op.
  if (sub.status === "published" && sub.generatedCaseStudy?._ref) {
    return NextResponse.json({ ok: true, skipped: "already published" });
  }
  if (!sub.photos?.length) {
    await c.patch(submissionId).set({ status: "failed", aiError: "No photos uploaded" }).commit();
    return NextResponse.json({ error: "no photos" }, { status: 400 });
  }

  // Mark processing.
  await c.patch(submissionId).set({ status: "processing", aiError: undefined }).commit();

  try {
    // Resolve photo asset URLs for Claude vision.
    const assetIds = sub.photos.map((p) => p.asset._ref);
    const assets = await c.fetch<{ _id: string; url: string }[]>(
      `*[_id in $ids]{_id, url}`,
      { ids: assetIds },
    );
    const urlMap = new Map(assets.map((a) => [a._id, a.url]));
    const photoUrls = assetIds.map((id) => urlMap.get(id)).filter((u): u is string => Boolean(u));
    if (!photoUrls.length) throw new Error("Could not resolve photo URLs");

    // Existing industries.
    const existingIndustries = await c.fetch<string[]>(
      `*[_type=="industry"].title`,
    );

    // Existing roman numerals.
    const existingNums = await c.fetch<string[]>(
      `*[_type=="caseStudy" && defined(num)].num`,
    );
    const num = nextRoman(existingNums);

    // Call Claude.
    const ai = await processSubmissionWithAI({
      projectName: sub.projectName,
      client: sub.client,
      year: sub.year,
      materials: sub.materials,
      notes: sub.notes,
      photoUrls,
      existingIndustries,
    });

    // Resolve industry (existing or new).
    const industryId = await findOrCreateIndustry(c, ai.industryName);

    // Pick a slug, ensuring uniqueness.
    const baseSlug = slugify(ai.name);
    const slug = await uniqueSlug(c, baseSlug);

    // First photo as cover; full set as gallery.
    const cover: SanityImageRef = {
      _type: "image",
      asset: sub.photos[0].asset,
    };
    const photos = sub.photos.map((p, i) => ({
      _key: `p${i}`,
      _type: "image" as const,
      asset: p.asset,
    }));

    // Publish the case study.
    const caseStudyId = caseStudyDocId(slug);
    await c.createOrReplace({
      _id: caseStudyId,
      _type: "caseStudy",
      num,
      name: ai.name,
      slug: { _type: "slug", current: slug },
      client: ai.client,
      tag: ai.tag,
      year: sub.year,
      section: ai.section,
      featured: ai.featured,
      industry: { _type: "reference", _ref: industryId },
      cover,
      photos,
      aiGenerated: true,
      sourceSubmission: { _type: "reference", _ref: submissionId },
    });

    // Link back + mark published.
    await c
      .patch(submissionId)
      .set({
        status: "published",
        generatedCaseStudy: { _type: "reference", _ref: caseStudyId },
        aiError: undefined,
      })
      .commit();

    return NextResponse.json({
      ok: true,
      caseStudyId,
      slug,
      num,
      industryId,
      industryWasNew: ai.industryIsNew,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await c
      .patch(submissionId)
      .set({ status: "failed", aiError: message })
      .commit();
    return NextResponse.json({ error: "processing failed", message }, { status: 500 });
  }
}
