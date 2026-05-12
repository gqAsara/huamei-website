/**
 * Reshape the seeded GEO prompts: drop pure-definition discovery queries
 * (buyers don't search those) and add higher-value prompts in
 * comparison/decision/procurement stages.
 *
 *   npx tsx scripts/geo-reshape-prompts.ts
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

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

// IDs of discovery prompts to drop — pure definitional ("what is X")
// queries that B2B buyers don't actually search for.
const TO_DELETE = [
  "geoPrompt-what-is-hot-foil-stamping",
  "geoPrompt-what-is-magnetic-closure-box",
  "geoPrompt-what-is-emboss-vs-deboss",
  "geoPrompt-what-is-soft-touch-laminate",
  "geoPrompt-what-is-spot-uv",
  "geoPrompt-what-is-fsc-certified-packaging",
  "geoPrompt-what-is-greyboard",
];

// Re-stage one prompt from discovery → evaluation (it's actually a
// comparison query, just framed as a definition).
const TO_RESTAGE = [
  { id: "geoPrompt-what-is-luxury-rigid-box", stage: "evaluation" },
];

// New higher-value prompts to add.
type NewPrompt = {
  slug: string;
  text: string;
  stage: "comparison" | "decision" | "procurement" | "evaluation";
  intent: "informational" | "investigative" | "commercial" | "transactional";
  priority: 1 | 2 | 3 | 4 | 5;
  notes: string;
};

const TO_ADD: NewPrompt[] = [
  // === Comparison (vendor shortlist) — 3 adds ===
  {
    slug: "luxury-rigid-box-manufacturer-fragrance-coffret",
    text: "Best luxury rigid box manufacturer for fragrance coffrets and presentation cases?",
    stage: "comparison",
    intent: "commercial",
    priority: 2,
    notes: "Fragrance is a high-margin sub-vertical we have credible work in",
  },
  {
    slug: "luxury-packaging-manufacturer-indie-beauty-brands",
    text: "Best Chinese luxury packaging manufacturer for indie beauty brands at low volume?",
    stage: "comparison",
    intent: "commercial",
    priority: 2,
    notes: "Indie + low MOQ is exactly Huamei's positioning (200+ floor)",
  },
  {
    slug: "luxury-packaging-manufacturer-henan-province",
    text: "Which luxury packaging manufacturers are based in Henan province, China?",
    stage: "comparison",
    intent: "commercial",
    priority: 3,
    notes: "Geography-specific query — Huamei's main floor is in Henan",
  },

  // === Decision (vendor diligence) — 2 adds ===
  {
    slug: "huamei-press-equipment",
    text: "What press equipment does Huamei use for luxury packaging manufacturing?",
    stage: "decision",
    intent: "investigative",
    priority: 3,
    notes: "Brand-direct technical due diligence query",
  },
  {
    slug: "huamei-certifications",
    text: "What certifications does Huamei hold for luxury packaging manufacturing?",
    stage: "decision",
    intent: "investigative",
    priority: 3,
    notes: "ISO 9001 + FSC + PEFC certs we have on /house/certifications",
  },

  // === Procurement (RFQ-ready) — 2 adds ===
  {
    slug: "qualify-chinese-luxury-packaging-manufacturer-remotely",
    text: "How do I qualify a Chinese luxury packaging manufacturer remotely without visiting the factory?",
    stage: "procurement",
    intent: "informational",
    priority: 2,
    notes: "US-founder pain point; Pillar 4 already addresses this",
  },
  {
    slug: "payment-terms-chinese-packaging-manufacturer",
    text: "What payment terms do Chinese luxury packaging manufacturers typically offer?",
    stage: "procurement",
    intent: "informational",
    priority: 3,
    notes: "Practical procurement question — deposit %, milestones, etc.",
  },
];

async function main() {
  console.log(`[reshape] Reshaping GEO prompts...`);
  console.log(`  Delete (pure discovery defs):  ${TO_DELETE.length}`);
  console.log(`  Re-stage (discovery → eval):   ${TO_RESTAGE.length}`);
  console.log(`  Add (commercial intent):        ${TO_ADD.length}`);
  console.log();

  // 1. Delete the dropped prompts
  console.log("[reshape] Deleting low-value discovery prompts...");
  for (const id of TO_DELETE) {
    try {
      await c.delete(id);
      console.log(`  ✓ deleted ${id}`);
    } catch (err) {
      console.log(`  ✗ ${id}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 2. Re-stage
  console.log("\n[reshape] Re-staging...");
  for (const r of TO_RESTAGE) {
    try {
      await c.patch(r.id).set({ stage: r.stage }).commit();
      console.log(`  ✓ re-staged ${r.id} → ${r.stage}`);
    } catch (err) {
      console.log(`  ✗ ${r.id}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 3. Add new prompts
  console.log("\n[reshape] Adding higher-value prompts...");
  const tx = c.transaction();
  for (const p of TO_ADD) {
    tx.createOrReplace({
      _id: `geoPrompt-${p.slug}`,
      _type: "geoPrompt",
      text: p.text,
      stage: p.stage,
      intent: p.intent,
      priority: p.priority,
      isActive: true,
      notes: p.notes,
    });
  }
  await tx.commit();
  TO_ADD.forEach((p) => console.log(`  ✓ added ${p.slug} (${p.stage})`));

  // 4. Final tally
  console.log();
  const counts = await c.fetch<Record<string, number>>(`{
    "discovery":   count(*[_type=="geoPrompt" && stage=="discovery" && isActive==true]),
    "evaluation":  count(*[_type=="geoPrompt" && stage=="evaluation" && isActive==true]),
    "comparison":  count(*[_type=="geoPrompt" && stage=="comparison" && isActive==true]),
    "decision":    count(*[_type=="geoPrompt" && stage=="decision" && isActive==true]),
    "procurement": count(*[_type=="geoPrompt" && stage=="procurement" && isActive==true])
  }`);
  console.log("[reshape] New stage distribution:");
  console.log(`  Discovery:   ${counts.discovery}`);
  console.log(`  Evaluation:  ${counts.evaluation}`);
  console.log(`  Comparison:  ${counts.comparison}`);
  console.log(`  Decision:    ${counts.decision}`);
  console.log(`  Procurement: ${counts.procurement}`);
  console.log(`  Total active: ${Object.values(counts).reduce((a, b) => a + b, 0)}`);
}

main().catch((e) => {
  console.error("[reshape] fatal:", e);
  process.exit(1);
});
