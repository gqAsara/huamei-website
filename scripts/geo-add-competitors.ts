/**
 * Add real luxury-packaging competitors to the GEO competitor list.
 *
 * Sources: the top non-Huamei domains AI engines actually cite for our
 * tracked prompts (per scripts/geo-analyze.ts output 2026-05-11).
 *
 * Run: NPM_CONFIG_CACHE=/tmp/npm-cache-huamei npx tsx scripts/geo-add-competitors.ts
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const token = process.env.SANITY_WRITE_TOKEN!;
if (!projectId || !token) {
  console.error("Need NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_WRITE_TOKEN");
  process.exit(1);
}

const c = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

// Nine real competitors AI engines cite for luxury packaging queries.
// Brand-name strings are how each company refers to itself; domains
// cover both the .com and any country TLDs that surfaced in citations.
const COMPETITORS = [
  {
    slug: "verescence",
    brand: "Verescence",
    domains: ["verescence.com"],
    notes: "French glass packaging for cosmetics + perfumery. Surfaced 3x in initial probe for prestige beauty queries.",
  },
  {
    slug: "quadpack",
    brand: "Quadpack",
    domains: ["quadpack.com"],
    notes: "Spanish/UK beauty packaging full-service provider. Common citation for premium cosmetics packaging.",
  },
  {
    slug: "aptar",
    brand: "AptarGroup",
    domains: ["aptar.com"],
    notes: "Global dispensing + packaging. NYSE-listed. Heavy on AI engines for beauty/fragrance dispensers.",
  },
  {
    slug: "lumson",
    brand: "Lumson",
    domains: ["lumson.com"],
    notes: "Italian skincare + cosmetics packaging. Strong on premium plastic + airless packaging.",
  },
  {
    slug: "hcp",
    brand: "HCP Packaging",
    domains: ["hcpackaging.com"],
    notes: "Asian-headquartered beauty packaging, global footprint. Direct geographic competitor.",
  },
  {
    slug: "pochet",
    brand: "Groupe Pochet",
    domains: ["groupe-pochet.fr", "collectionsbygroupepochet.com"],
    notes: "Historic French glass house for haute parfumerie. Top-tier luxury packaging reference.",
  },
  {
    slug: "axilone",
    brand: "Axilone",
    domains: ["axilonegroup.com"],
    notes: "French premium cosmetics packaging (lipstick + skincare).",
  },
  {
    slug: "saverglass",
    brand: "Saverglass",
    domains: ["saverglass.com"],
    notes: "Premium glass for spirits + wine. AI-cited for high-end spirits packaging prompts.",
  },
  {
    slug: "stoelzle",
    brand: "Stoelzle Glass Group",
    domains: ["stoelzle.com"],
    notes: "Austrian luxury glass for spirits + perfumery.",
  },
];

async function main() {
  console.log(`[add-competitors] Adding ${COMPETITORS.length} real competitors`);
  const tx = c.transaction();
  for (const k of COMPETITORS) {
    tx.createOrReplace({
      _id: `geoCompetitor-${k.slug}`,
      _type: "geoCompetitor",
      brand: k.brand,
      domains: k.domains,
      isActive: true,
      notes: k.notes,
    });
  }
  await tx.commit();
  console.log(`[add-competitors] ✓ done — ${COMPETITORS.length} competitors upserted`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
