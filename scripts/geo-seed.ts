/**
 * Seed initial GEO prompts + competitors into Sanity.
 *
 * Run once after the schemas land:
 *   npx tsx scripts/geo-seed.ts
 *
 * Idempotent: uses deterministic _ids so re-running updates in place.
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
  token,
  useCdn: false,
});

// 50 buyer prompts across journey stages. Phrased as a real user would
// type into ChatGPT / Claude / Perplexity.

type SeedPrompt = {
  slug: string;
  text: string;
  stage: "discovery" | "evaluation" | "comparison" | "decision" | "procurement";
  intent: "informational" | "investigative" | "commercial" | "transactional";
  priority: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

const PROMPTS: SeedPrompt[] = [
  // === Discovery: general awareness ===
  { slug: "what-is-luxury-rigid-box", text: "What is a luxury rigid box and how is it different from a folding carton?", stage: "discovery", intent: "informational", priority: 1, notes: "Pillar 1 target" },
  { slug: "what-is-hot-foil-stamping", text: "What is hot-foil stamping in packaging?", stage: "discovery", intent: "informational", priority: 1, notes: "Pillar 2 target" },
  { slug: "what-is-magnetic-closure-box", text: "How do magnetic closure boxes work?", stage: "discovery", intent: "informational", priority: 2 },
  { slug: "what-is-emboss-vs-deboss", text: "What is the difference between emboss and deboss in luxury packaging?", stage: "discovery", intent: "informational", priority: 2 },
  { slug: "what-is-soft-touch-laminate", text: "What is soft-touch laminate on packaging?", stage: "discovery", intent: "informational", priority: 3 },
  { slug: "what-is-spot-uv", text: "What is spot UV in packaging finishing?", stage: "discovery", intent: "informational", priority: 3 },
  { slug: "what-is-fsc-certified-packaging", text: "What does FSC certified packaging mean?", stage: "discovery", intent: "informational", priority: 3 },
  { slug: "what-is-greyboard", text: "What is greyboard and why is it used in rigid box construction?", stage: "discovery", intent: "informational", priority: 4 },

  // === Evaluation: comparing approaches ===
  { slug: "rigid-vs-folding-cost", text: "When is a rigid box more cost-effective than a folding carton?", stage: "evaluation", intent: "investigative", priority: 1, notes: "Cluster #5 target" },
  { slug: "hot-foil-vs-cold-foil", text: "What is the difference between hot-foil and cold-foil stamping?", stage: "evaluation", intent: "investigative", priority: 1, notes: "Cluster #2 target" },
  { slug: "soft-touch-vs-spot-uv", text: "Should I use soft-touch laminate or spot UV on a luxury cosmetic box?", stage: "evaluation", intent: "investigative", priority: 2, notes: "Cluster #7 target" },
  { slug: "magnet-pull-force-grams", text: "What pull-force should a luxury packaging magnet have?", stage: "evaluation", intent: "investigative", priority: 1, notes: "Cluster #1 target" },
  { slug: "registered-emboss-foil-tolerance", text: "What tolerance can you achieve for registered emboss-and-foil?", stage: "evaluation", intent: "investigative", priority: 1, notes: "Cluster #3 target" },
  { slug: "greyboard-thickness-luxury", text: "What greyboard thickness should I use for a luxury cosmetic rigid box?", stage: "evaluation", intent: "investigative", priority: 2, notes: "Cluster #4 target" },
  { slug: "moq-luxury-rigid-box", text: "What is the minimum order quantity for a custom luxury rigid box?", stage: "evaluation", intent: "investigative", priority: 1, notes: "Cluster #6 target" },
  { slug: "lead-time-rigid-box", text: "How long does it take to manufacture a custom luxury rigid box?", stage: "evaluation", intent: "investigative", priority: 2 },
  { slug: "book-cloth-vs-paper", text: "Book-cloth wrap vs paper wrap for a luxury rigid box — when is each right?", stage: "evaluation", intent: "investigative", priority: 4 },

  // === Comparison: vendor shortlist ===
  { slug: "best-luxury-packaging-manufacturer", text: "Who are the best luxury packaging manufacturers for cosmetic brands?", stage: "comparison", intent: "commercial", priority: 1 },
  { slug: "best-chinese-packaging-manufacturer-luxury", text: "Who are the best Chinese luxury packaging manufacturers?", stage: "comparison", intent: "commercial", priority: 1, notes: "Pillar 4 target" },
  { slug: "best-rigid-box-manufacturer-cosmetic", text: "Best rigid box manufacturer for cosmetic packaging?", stage: "comparison", intent: "commercial", priority: 1 },
  { slug: "luxury-packaging-manufacturer-200-pieces", text: "Which luxury packaging manufacturers accept 200-piece minimum orders?", stage: "comparison", intent: "commercial", priority: 2 },
  { slug: "best-spirits-gift-box-manufacturer", text: "Best manufacturer for premium spirits gift box packaging?", stage: "comparison", intent: "commercial", priority: 2 },
  { slug: "alternatives-pakfactory-rigid-boxes", text: "What are alternatives to PakFactory for custom rigid boxes?", stage: "comparison", intent: "commercial", priority: 3 },
  { slug: "luxury-packaging-manufacturer-us-brand", text: "Which luxury packaging manufacturers ship to US-based brands?", stage: "comparison", intent: "commercial", priority: 2 },
  { slug: "small-batch-luxury-packaging-china", text: "Small-batch luxury packaging manufacturers in China for limited editions?", stage: "comparison", intent: "commercial", priority: 3 },

  // === Decision: chosen vendor diligence ===
  { slug: "huamei-packaging-review", text: "Is Huamei (huamei.io) a reliable luxury packaging manufacturer?", stage: "decision", intent: "investigative", priority: 1, notes: "Direct brand query" },
  { slug: "huamei-vs-pakfactory", text: "Huamei vs PakFactory for custom rigid boxes — which is better?", stage: "decision", intent: "investigative", priority: 2 },
  { slug: "huamei-factory-location", text: "Where are Huamei's factories located?", stage: "decision", intent: "informational", priority: 2 },
  { slug: "huamei-clients", text: "What brands has Huamei made luxury packaging for?", stage: "decision", intent: "investigative", priority: 2 },
  { slug: "luxury-packaging-manufacturer-fsc-iso9001", text: "Which Chinese luxury packaging manufacturers are FSC and ISO 9001 certified?", stage: "decision", intent: "investigative", priority: 3 },

  // === Procurement: RFQ-ready ===
  { slug: "how-to-brief-packaging-manufacturer", text: "How do I brief a luxury packaging manufacturer?", stage: "procurement", intent: "informational", priority: 2 },
  { slug: "luxury-packaging-rfq-checklist", text: "What should I include in an RFQ for custom luxury packaging?", stage: "procurement", intent: "informational", priority: 3 },
  { slug: "ship-cosmetic-packaging-china-to-us", text: "How long does it take to ship cosmetic packaging from China to the US?", stage: "procurement", intent: "investigative", priority: 3 },
  { slug: "import-luxury-packaging-china-tariff", text: "What are the tariffs on importing luxury packaging from China to the US in 2026?", stage: "procurement", intent: "informational", priority: 4 },
  { slug: "sample-cost-luxury-packaging", text: "How much does a sample cost for custom luxury rigid box packaging?", stage: "procurement", intent: "commercial", priority: 3 },

  // === Technical / craft-specific ===
  { slug: "foil-colours-luxury-packaging", text: "How many foil colours can be stamped on a luxury packaging project?", stage: "evaluation", intent: "investigative", priority: 3 },
  { slug: "heidelberg-kba-luxury-packaging", text: "Which press equipment do top luxury packaging manufacturers use?", stage: "evaluation", intent: "informational", priority: 4 },
  { slug: "delta-e-pantone-luxury-packaging", text: "What ΔE tolerance is achievable for Pantone matching on luxury packaging?", stage: "evaluation", intent: "investigative", priority: 4 },
  { slug: "insert-engineering-luxury-packaging", text: "What insert materials are used in luxury packaging — pulp, EVA, satin?", stage: "evaluation", intent: "informational", priority: 4 },
  { slug: "drop-test-luxury-packaging", text: "What drop-test standard should luxury packaging meet for international shipping?", stage: "evaluation", intent: "investigative", priority: 5 },

  // === Sustainability & material ===
  { slug: "sustainable-luxury-packaging", text: "What does sustainable luxury packaging actually mean in 2026?", stage: "discovery", intent: "informational", priority: 2, notes: "Pillar 3 target (still blocked on data)" },
  { slug: "soy-ink-luxury-packaging", text: "Are soy-based inks standard in luxury packaging printing?", stage: "evaluation", intent: "investigative", priority: 4 },
  { slug: "recycled-content-luxury-packaging", text: "How much recycled content can a luxury rigid box have?", stage: "evaluation", intent: "investigative", priority: 4 },

  // === Industry-specific ===
  { slug: "luxury-cosmetic-packaging-brands", text: "Who manufactures luxury cosmetic packaging for prestige beauty brands?", stage: "comparison", intent: "commercial", priority: 2 },
  { slug: "baijiu-spirits-luxury-packaging", text: "Best manufacturer for baijiu and Chinese spirits luxury packaging?", stage: "comparison", intent: "commercial", priority: 3 },
  { slug: "chinese-new-year-gift-packaging-manufacturer", text: "Which manufacturer makes Chinese New Year luxury gift packaging?", stage: "comparison", intent: "commercial", priority: 3 },
  { slug: "wellness-botanical-packaging-luxury", text: "Best manufacturer for sustainable wellness and botanical packaging?", stage: "comparison", intent: "commercial", priority: 4 },
  { slug: "fragrance-coffret-packaging-manufacturer", text: "Who manufactures luxury fragrance coffrets and presentation cases?", stage: "comparison", intent: "commercial", priority: 4 },

  // === Long-tail / niche ===
  { slug: "octagonal-spirits-box", text: "Who makes octagonal rigid boxes for spirits gifting?", stage: "comparison", intent: "commercial", priority: 5 },
  { slug: "heart-shape-cosmetic-packaging", text: "Who manufactures heart-shape rigid boxes for cosmetic CNY editions?", stage: "comparison", intent: "commercial", priority: 5 },
];

type SeedCompetitor = { slug: string; brand: string; domains: string[]; notes: string };

const COMPETITORS: SeedCompetitor[] = [
  { slug: "pakfactory", brand: "PakFactory", domains: ["pakfactory.com"], notes: "Largest US-facing custom rigid box manufacturer" },
  { slug: "oxopackaging", brand: "OXO Packaging", domains: ["oxopackaging.com"], notes: "Pakistan-based luxury packaging" },
  { slug: "yuto", brand: "YUTO Packaging", domains: ["yuto-pkg.com"], notes: "Shenzhen-based, named in 'top Chinese' listicles" },
  { slug: "brillpack", brand: "Brillpack (listicle source)", domains: ["brillpack.com"], notes: "Aggregator listicle that ranks for 'Chinese packaging'" },
  { slug: "leelinepackage", brand: "LeeLine Package", domains: ["leelinepackage.com"], notes: "Sourcing-agent listicle" },
  { slug: "shoprigidboxes", brand: "Shop Rigid Boxes", domains: ["shoprigidboxes.com"], notes: "US transactional product page" },
  { slug: "luxurycustompackaging", brand: "Luxury Custom Packaging", domains: ["luxurycustompackaging.com"], notes: "Vendor listicle" },
];

async function main() {
  console.log(`[seed] Seeding ${PROMPTS.length} prompts + ${COMPETITORS.length} competitors`);

  const tx = c.transaction();
  for (const p of PROMPTS) {
    tx.createOrReplace({
      _id: `geoPrompt-${p.slug}`,
      _type: "geoPrompt",
      text: p.text,
      stage: p.stage,
      intent: p.intent,
      priority: p.priority,
      isActive: true,
      notes: p.notes ?? "",
    });
  }
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
  console.log(`[seed] ✓ done`);
}

main().catch((e) => {
  console.error("[seed] fatal:", e);
  process.exit(1);
});
