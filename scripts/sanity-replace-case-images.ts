/**
 * Swap every Sanity caseStudy doc's cover + photos[] image refs to the
 * current local /public/photos/cases/<slug>/*.jpg files.
 *
 * Use this AFTER running scripts/image-upgrade/upgrade.py so the new
 * Pro-backgrounded versions get uploaded to Sanity (which is what
 * /volumes/[slug] pages actually load from).
 *
 * Preserves every other doc field (alt text, metadata, body, etc.) by
 * using .patch() not .createOrReplace().
 *
 * Run:
 *   NPM_CONFIG_CACHE=/tmp/npm-cache-huamei npx tsx scripts/sanity-replace-case-images.ts
 *   NPM_CONFIG_CACHE=/tmp/npm-cache-huamei npx tsx scripts/sanity-replace-case-images.ts --dry-run
 *   NPM_CONFIG_CACHE=/tmp/npm-cache-huamei npx tsx scripts/sanity-replace-case-images.ts --slug wuliangye-68
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

{
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const SLUG_FILTER = (() => {
  const i = args.indexOf("--slug");
  return i >= 0 ? args[i + 1] : null;
})();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing SANITY env in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });
const PUBLIC = resolve(process.cwd(), "public");

function localPhotosFor(slug: string): string[] {
  const dir = resolve(PUBLIC, "photos/cases", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => resolve(dir, f));
}

async function withRetry<T>(label: string, fn: () => Promise<T>, max = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= max; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      lastErr = e;
      const code = (e as { statusCode?: number }).statusCode;
      const transient = !code || code >= 500 || code === 429;
      if (!transient || i === max) throw e;
      const delay = 1000 * 2 ** (i - 1);
      process.stdout.write(`(retry ${i}/${max - 1} in ${delay}ms) `);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function uploadImage(fsPath: string) {
  const buf = readFileSync(fsPath);
  const asset = await withRetry(`upload ${basename(fsPath)}`, () =>
    client.assets.upload("image", buf, { filename: basename(fsPath) }),
  );
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

type Doc = {
  _id: string;
  slug: string;
  name: string;
  photos: Array<{ _key?: string; alt?: string }>;
};

async function processOne(doc: Doc) {
  const files = localPhotosFor(doc.slug);
  if (files.length === 0) {
    console.log(`  [${doc.slug}] SKIP — no local files in public/photos/cases/${doc.slug}`);
    return { ok: false };
  }
  if (DRY) {
    console.log(`  [${doc.slug}] would upload ${files.length} files, patch cover + photos[${files.length}]`);
    return { ok: true };
  }

  process.stdout.write(`  [${doc.slug}] uploading ${files.length}... `);
  const refs = [];
  for (const f of files) refs.push(await uploadImage(f));

  // Preserve existing alt text where possible (match by index)
  const existing = doc.photos ?? [];
  const photos = refs.map((r, i) => {
    const prev = existing[i] ?? {};
    return {
      _key: prev._key ?? `photo-${i}-${Date.now().toString(36)}`,
      ...r,
      ...(prev.alt ? { alt: prev.alt } : {}),
    };
  });

  await client.patch(doc._id).set({ cover: refs[0], photos }).commit();
  console.log(`✓ patched`);
  return { ok: true };
}

async function main() {
  const groq = SLUG_FILTER
    ? `*[_type=='caseStudy' && slug.current==$slug]{ _id, 'slug': slug.current, name, photos }`
    : `*[_type=='caseStudy']{ _id, 'slug': slug.current, name, photos } | order(slug asc)`;
  const docs: Doc[] = await client.fetch(groq, SLUG_FILTER ? { slug: SLUG_FILTER } : {});

  console.log(`${DRY ? "[DRY-RUN] " : ""}found ${docs.length} caseStudy doc${docs.length === 1 ? "" : "s"}\n`);

  let ok = 0;
  let skip = 0;
  let fail = 0;
  const failed: string[] = [];
  for (const d of docs) {
    try {
      const r = await processOne(d);
      if (r.ok) ok++;
      else skip++;
    } catch (e) {
      fail++;
      failed.push(d.slug);
      console.log(`\n  [${d.slug}] FAILED: ${(e as Error).message?.slice(0, 200)}`);
    }
  }
  console.log(`\nDONE. patched=${ok} skipped=${skip} failed=${fail}`);
  if (failed.length) console.log(`failed slugs: ${failed.join(",")}`);
  if (failed.length) process.exit(2);
}

main().catch((e) => {
  console.error("fatal:", e);
  process.exit(1);
});
