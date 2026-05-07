/**
 * One-time migration: VOLUMES[] from src/lib/volumes.ts → Sanity.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate-volumes.ts
 *
 * Idempotent: re-running with the same slugs updates existing docs in place
 * (deterministic _id from slug). Safe to retry after partial failures.
 *
 * What it does:
 *  1. Connects to Sanity using SANITY_WRITE_TOKEN from .env.local
 *  2. For each unique category in VOLUMES, creates an `industry` doc
 *  3. For each VOLUME, uploads the cover + photos to Sanity assets
 *  4. Creates the `caseStudy` doc with image refs and an industry reference
 *  5. Logs a per-volume summary; lists missing photo files at the end
 *
 * Reads .env.local manually (no dotenv dep needed).
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { config as loadDotenv } from "node:process";

// Read .env.local manually (no dotenv runtime dep)
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

import { VOLUMES, type Volume } from "../src/lib/volumes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("[migrate] NEXT_PUBLIC_SANITY_PROJECT_ID missing — aborting.");
  process.exit(1);
}
if (!token) {
  console.error("[migrate] SANITY_WRITE_TOKEN missing — aborting.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const PUBLIC = resolve(process.cwd(), "public");

function industryDocId(category: string): string {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `industry-${slug}`;
}

function caseStudyDocId(slug: string): string {
  return `caseStudy-${slug}`;
}

async function ensureIndustry(category: string, order: number): Promise<string> {
  const _id = industryDocId(category);
  const slug = _id.replace(/^industry-/, "");
  await client.createOrReplace({
    _id,
    _type: "industry",
    title: category,
    slug: { _type: "slug", current: slug },
    order,
  });
  return _id;
}

async function uploadPhoto(
  publicPath: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  // publicPath like "/photos/cases/dukang/01.jpg"
  const fsPath = resolve(PUBLIC, publicPath.replace(/^\//, ""));
  if (!existsSync(fsPath)) {
    console.warn(`  ⚠ missing on disk: ${publicPath}`);
    return null;
  }
  const buf = readFileSync(fsPath);
  const asset = await client.assets.upload("image", buf, {
    filename: basename(fsPath),
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function migrateVolume(
  v: Volume,
  industryRefId: string,
): Promise<{ slug: string; ok: boolean; missing: string[] }> {
  const missing: string[] = [];

  process.stdout.write(`[${v.num}] ${v.slug} ${v.name} … `);

  const cover = await uploadPhoto(v.cover);
  if (!cover) missing.push(v.cover);

  const photos = [];
  for (const p of v.photos) {
    const ref = await uploadPhoto(p);
    if (ref) photos.push(ref);
    else missing.push(p);
  }

  if (!cover) {
    console.log("SKIP (no cover)");
    return { slug: v.slug, ok: false, missing };
  }

  await client.createOrReplace({
    _id: caseStudyDocId(v.slug),
    _type: "caseStudy",
    num: v.num,
    name: v.name,
    slug: { _type: "slug", current: v.slug },
    client: v.client,
    tag: v.tag,
    year: v.year,
    section: v.section,
    featured: v.featured ?? false,
    industry: { _type: "reference", _ref: industryRefId },
    cover,
    photos,
  });

  console.log(`✓ ${photos.length + 1} images`);
  return { slug: v.slug, ok: true, missing };
}

async function main() {
  console.log(
    `[migrate] Sanity project=${projectId} dataset=${dataset} volumes=${VOLUMES.length}\n`,
  );

  // 1. Industries
  const industries = Array.from(new Set(VOLUMES.map((v) => v.category)));
  industries.sort();
  console.log(`[industries] ${industries.length}: ${industries.join(", ")}`);
  const industryByCategory = new Map<string, string>();
  for (let i = 0; i < industries.length; i++) {
    const id = await ensureIndustry(industries[i], i);
    industryByCategory.set(industries[i], id);
    console.log(`  ✓ ${industries[i]} → ${id}`);
  }

  // 2. Case studies
  console.log(`\n[caseStudies] ${VOLUMES.length}`);
  const results: { slug: string; ok: boolean; missing: string[] }[] = [];
  for (const v of VOLUMES) {
    const industryId = industryByCategory.get(v.category);
    if (!industryId) {
      console.warn(`  ⚠ ${v.slug}: industry "${v.category}" missing — skip`);
      results.push({ slug: v.slug, ok: false, missing: [] });
      continue;
    }
    try {
      results.push(await migrateVolume(v, industryId));
    } catch (err) {
      console.log(`✗ ERROR: ${(err as Error).message}`);
      results.push({ slug: v.slug, ok: false, missing: [] });
    }
  }

  // 3. Summary
  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  const missing = results.flatMap((r) => r.missing);

  console.log(`\n[summary]`);
  console.log(`  migrated: ${ok}/${results.length}`);
  if (fail > 0) console.log(`  failed:   ${fail}`);
  if (missing.length > 0) {
    console.log(`  missing photo files (${missing.length}):`);
    for (const p of missing) console.log(`    - ${p}`);
  }
}

main().catch((err) => {
  console.error("\n[migrate] fatal:", err);
  process.exit(1);
});
