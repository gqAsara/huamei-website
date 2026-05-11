import { VOLUMES } from "./volumes";

export type TopicCategory = "craft" | "industry";

export type TopicItem = {
  rn: string;
  name: string;
  italic?: string;
  desc: string;
  meta: string;
  href: string;
};

export type TopicStep = {
  num: string;
  stage: string;
  title: string;
  italic?: string;
  desc: string;
  image: string;
};

export type TopicRelated = {
  rn: string;
  name: string;
  category: string;
  year: number;
  tag: string;
  cover: string;
  href: string;
};

export type TopicSpec = { label: string; value: string };

export type TopicFaq = { q: string; a: string };

export type TopicRelatedBlog = {
  slug: string;
  title: string;
  description: string;
};

export type Topic = {
  slug: string;
  category: TopicCategory;
  categoryLabel: string;
  parentLabel: string;
  parentHref: string;
  rn: string;
  title: string;
  italic?: string;
  cn: string;
  lede: string;
  meta: string[];
  prose: string[];
  pullQuote: string;
  itemsTitle: string;
  itemsItalic?: string;
  itemsStamp: string;
  items: TopicItem[];
  processStamp: string;
  processSteps: TopicStep[];
  related: TopicRelated[];
  specs: TopicSpec[];
  ctaKicker: string;
  ctaTitle: string;
  ctaDesc: string;
  heroImage?: string;
  // Commercial-intent fields (audit 2026-05-11). Optional — when set, the
  // route's generateMetadata uses commercialTitle/commercialDescription for
  // SEO; TopicTemplate renders buyerFaq + trustClients + relatedBlogs.
  commercialTitle?: string;
  commercialDescription?: string;
  buyerFaq?: TopicFaq[];
  trustClients?: string[]; // auto-derived in getTopic() from VOLUMES
  relatedBlogs?: TopicRelatedBlog[]; // auto-derived from TOPIC_RELATED_BLOGS map
};

const STRUCTURE_SLUGS = new Set([
  "rigid", "magnetic", "drawer", "folding",
  "book", "inserts", "shoppers", "bespoke",
]);
const SURFACE_SLUGS = new Set([
  "hot-foil", "emboss", "deboss", "soft-touch",
  "spot-uv", "offset", "wraps",
]);

function heroImageFor(slug: string): string | undefined {
  if (slug === "magnetic") return `/photos/generated/structures/magnetic-v2.jpg`;
  if (slug === "spot-uv")  return `/photos/generated/surfaces/spot-uv-v2.jpg`;
  if (STRUCTURE_SLUGS.has(slug)) return `/photos/generated/structures/${slug}.jpg`;
  if (SURFACE_SLUGS.has(slug))   return `/photos/generated/surfaces/${slug}.jpg`;
  return undefined;
}

const STRUCTURE_ORDER = ["rigid", "magnetic", "drawer", "folding", "book", "inserts", "shoppers", "bespoke"];
const SURFACE_ORDER   = ["hot-foil", "emboss", "deboss", "soft-touch", "spot-uv", "offset", "wraps"];
const INDUSTRY_ORDER  = ["cosmetic", "spirits", "seasonal", "wellness"];

// Industry slug → archive category labels found on Volume.category.
const INDUSTRY_CATEGORIES: Record<string, string[]> = {
  cosmetic: ["Cosmetics", "Skincare"],
  spirits:  ["Spirits", "Tea"],
  seasonal: ["Gifting"],
  wellness: ["Wellness"],
};

// Craft slug → list of volume slugs that demonstrate this technique.
// Inferred from each volume's tag/structure; adjust as the archive grows.
const CRAFT_VOLUMES: Record<string, string[]> = {
  // ----- Structures -----
  rigid: [
    "lancome-love", "lancome-1111", "estee-holiday", "loreal-gem", "kefumei",
    "hetaowang", "shede-6", "wuliangye-68", "zhonghua-dragon", "tianamen-jiu",
    "hongxing", "yangshao",
  ],
  magnetic:  ["lancome-cny", "wuliangye-clamshell"],
  drawer:    ["oriental-memoirs", "dukang", "heigouqi"],
  folding:   [
    "pink-food-sleeve", "glees-grove", "heart-window", "lavender-orchid",
    "mustard-deco", "heigouqi", "t2-tea", "collgene", "kefumei",
  ],
  book:      ["man-made-crayon", "danquan-cave", "tianamen-jiu", "wuliangye-clamshell"],
  inserts:   ["heigouqi", "wuliangye-clamshell", "yangshao", "cobalt-drum"],
  shoppers:  ["red-ribbon-shopper", "black-corded"],
  bespoke:   ["cobalt-drum", "dukang", "taozui-9"],

  // ----- Surfaces -----
  "hot-foil": [
    "lancome-cny", "lancome-love", "estee-holiday", "loreal-gem",
    "lavender-orchid", "mustard-deco", "heritage-tea", "taozui-9",
    "wuliangye-68", "zhonghua-dragon", "hongxing", "collgene",
  ],
  emboss:      ["zhonghua-dragon", "estee-holiday", "loreal-gem"],
  deboss:      ["yangshao", "glees-grove", "man-made-crayon"],
  "soft-touch":["kefumei", "lancome-love", "lancome-1111"],
  "spot-uv":   ["collgene", "kefumei", "lancome-1111"],
  offset:      ["estee-holiday", "lancome-1111", "t2-tea", "pink-food-sleeve", "heart-window"],
  wraps:       ["cobalt-drum", "lancome-love", "lancome-cny", "shede-6"],
};

function volumeToRelated(slug: string): TopicRelated | null {
  const v = VOLUMES.find((x) => x.slug === slug);
  if (!v) return null;
  return {
    rn: `${v.num}.`,
    name: v.name,
    category: v.category,
    year: v.year,
    tag: v.tag,
    cover: v.cover,
    href: `/volumes/${v.slug}`,
  };
}

function relatedFromVolumes(slug: string): TopicRelated[] | undefined {
  const cats = INDUSTRY_CATEGORIES[slug];
  if (cats) {
    return VOLUMES
      .filter((v) => cats.includes(v.category))
      .map((v) => volumeToRelated(v.slug)!);
  }
  const craftSlugs = CRAFT_VOLUMES[slug];
  if (craftSlugs) {
    return craftSlugs
      .map((s) => volumeToRelated(s))
      .filter((r): r is TopicRelated => r !== null);
  }
  return undefined;
}
const ROMAN = ["i.", "ii.", "iii.", "iv.", "v.", "vi.", "vii.", "viii.", "ix.", "x."];

function rnForSlug(slug: string): string {
  const s = STRUCTURE_ORDER.indexOf(slug);
  if (s !== -1) return ROMAN[s];
  const f = SURFACE_ORDER.indexOf(slug);
  if (f !== -1) return ROMAN[f];
  const i = INDUSTRY_ORDER.indexOf(slug);
  if (i !== -1) return ROMAN[i];
  return "—";
}

const HOT_FOIL: Topic = {
  slug: "hot-foil",
  category: "craft",
  categoryLabel: "Craft",
  parentLabel: "By Surface",
  parentHref: "/craft",
  rn: "i.",
  title: "Hot-foil ",
  italic: "stamping.",
  cn: "燙金",
  lede: "A line of metal pressed once, hot, into the page — and the brand is heavier than it was a moment ago.",
  meta: ["Au · Cu · Ag", "17 surfaces on file", "Min 200 pcs"],
  prose: [
    "Foil-stamping is the oldest decoration on a Huamei box and, still, the most argued about. A heated die meets a sheet of pigmented foil, and that foil — copper, champagne, silver, or one of the four blacks we keep on the floor — transfers in the shape of the die. Nothing is printed. Nothing is glued. The decoration is mechanical.",
    "What that means for the eye is specific. Light catches the line in only one direction. A logo set in foil is brighter than a logo set in ink and, at the same time, somehow {em}quieter{/em} — because it disappears when the surface is held off-axis. A box that uses foil well rewards the hand and not the camera.",
    "We hold seventeen foil colours in-house and match the rest on order. Registered emboss-and-foil — where the die rises and lights at once — is a Huamei specialty; we will demonstrate it on the proof.",
  ],
  pullQuote: "A line of metal pressed once, hot, into the page.",
  itemsTitle: "Foils ",
  itemsItalic: "on file.",
  itemsStamp: "17 colours · Au · Cu · Ag · Black · Holo",
  items: [
    { rn: "i.",   name: "Champagne ",     italic: "gold",       desc: "House primary. Warm, slightly green undertone. The catalogue rule, the cover plate.",         meta: "Warm · cover-plate", href: "#" },
    { rn: "ii.",  name: "Deep ",          italic: "copper",     desc: "Rose-cast. Reads warm on cream, sharp on noir.",                                              meta: "Rose-cast",          href: "#" },
    { rn: "iii.", name: "Cool silver",                          desc: "Neutral. The only silver we will press without first quoting matte vs. mirror.",              meta: "Neutral · matte option", href: "#" },
    { rn: "iv.",  name: "Black ",         italic: "gloss",      desc: "A foil that reads as ink, but holds the press shadow. For tone-on-tone wordmarks.",           meta: "Reads as ink",       href: "#" },
    { rn: "v.",   name: "Black ",         italic: "matte",      desc: "Dries velvet. Pairs with embossed kraft and uncoated stocks.",                                meta: "Velvet · uncoated",  href: "#" },
    { rn: "vi.",  name: "Pearl ",         italic: "iridescent", desc: "Used sparingly. A holographic with the colour-wheel pulled out — only the catch-light remains.", meta: "Catch-light only", href: "#" },
  ],
  processStamp: "Process · iv steps",
  processSteps: [
    { num: "i.",   stage: "Die-cut",       title: "Magnesium ",  italic: "etched.",     desc: "Your artwork is cut into a magnesium plate at 0.6 mm depth. We adjust by 0.05 mm for emboss-and-foil registration.", image: "/photos/press-1.jpg" },
    { num: "ii.",  stage: "Heat & tension", title: "Plate at ",  italic: "140°C.",      desc: "Foil tension is set against the press cylinder. A second operator times the dwell — 0.4 to 0.8 seconds — by sound.", image: "/photos/press-2.jpg" },
    { num: "iii.", stage: "Pull & check",  title: "Two pressmen.",                       desc: "Every fiftieth sheet is pulled. The catch-light is checked under both warm and cool lamps. Off-register sheets are scrapped on the floor.", image: "/photos/finishing-1.jpg" },
    { num: "iv.",  stage: "Hand-finish",   title: "Quiet ",      italic: "corrections.", desc: "If a sheet shows even minor blistering, we burnish by hand or scrap it. Corrections are free.",                       image: "/photos/press-die-cut-cropped.jpg" },
  ],
  related: [
    { rn: "I.",  name: "Dukang 杜康",       category: "Spirits",   year: 2024, tag: "Octagonal · Foil · Velvet",    cover: "/photos/cases/dukang/01.jpg",        href: "/volumes/dukang" },
    { rn: "IV.", name: "Estée Lauder Holiday", category: "Cosmetics", year: 2024, tag: "Watercolor · Foil starfield",  cover: "/photos/cases/estee-holiday/01.jpg", href: "/volumes/estee-holiday" },
    { rn: "IX.", name: "Collgene",            category: "Skincare",  year: 2025, tag: "Tuck-end · Silver foil",       cover: "/photos/cases/collgene/01.jpg",      href: "/volumes/collgene" },
  ],
  specs: [
    { label: "Stock list",        value: "17 colours · in-house" },
    { label: "Plate material",    value: "Magnesium · 0.6 mm" },
    { label: "Press temperature", value: "120 – 160°C" },
    { label: "Dwell",             value: "0.4 – 0.8 s" },
    { label: "Min run",           value: "200 pcs" },
    { label: "Lead time",         value: "20 – 28 days" },
    { label: "Min line weight",   value: "0.15 mm" },
    { label: "Registration",      value: "±0.1 mm to emboss" },
    { label: "Substrates",        value: "Coated · Uncoated · Cloth" },
  ],
  ctaKicker: "Foil samples · Posted free",
  ctaTitle: "Pull a foil sample, or send us a die.",
  ctaDesc: "We will press your wordmark on three stocks — coated, uncoated, and Gmund cloth — in your chosen foil and post the swatches within five working days.",
  heroImage: "/photos/generated/surfaces/hot-foil.jpg",
  commercialTitle: "Hot-foil stamping manufacturer for luxury packaging — 17 foils on file",
  commercialDescription: "Hot-foil stamping for rigid boxes and folding cartons. 17 in-house foil colours across warm, cool, pigmented, and holographic families. ±0.1 mm registration on emboss-and-foil. MOQ 200+, 7–10 day samples.",
  buyerFaq: [
    { q: "How many foil colours do you stock?", a: "17 in-house across five optical families — warm metallics (5), cool metallics (4), pigmented (4), holographic / pearlescent (2), specialty (2). Free swatch set posted within 5–7 days." },
    { q: "What registration do you hold for emboss-and-foil?", a: "±0.1 mm at Huamei. Industry typical is ±0.3 mm. The press operator re-checks alignment every 200 sheets across the run." },
    { q: "What's the press temperature and dwell?", a: "120–160 °C, dwell 0.4–0.8 s. The press operator dials each to the substrate — uncoated paper needs a higher dwell than coated; book-cloth needs a softer die." },
  ],
};

const CATEGORY_META: Record<TopicCategory, { label: string; cn: string; href: string }> = {
  craft:    { label: "Craft",    cn: "工 藝", href: "/craft" },
  industry: { label: "Industry", cn: "行 業", href: "/industry" },
};

const TOPICS: Record<string, Topic> = {
  "hot-foil": HOT_FOIL,
};

// Per-topic editorial copy — overrides the auto-fallback prose/pullQuote/meta.
// Items, process, related, specs, and CTA still come from the fallback so a single
// topic never goes empty. Add full-content topics to TOPICS instead when ready.
type TopicCopy = {
  prose: string[];
  pullQuote: string;
  meta: string[];
  // Optional overrides used by industry topics (and any other topic that needs a non-titleized title or richer header).
  title?: string;
  italic?: string;
  cn?: string;
  lede?: string;
  related?: TopicRelated[];
  // Commercial-intent fields. See Topic type.
  commercialTitle?: string;
  commercialDescription?: string;
  buyerFaq?: TopicFaq[];
};

const TOPIC_COPY: Record<string, TopicCopy> = {
  rigid: {
    prose: [
      "A rigid box has two pieces — base and lid — and the lid lifts straight off. The walls are paper-wrapped chipboard, 1.5 to 2.5 mm thick. Heavy enough to feel intentional in the hand; light enough to ship by post.",
      "We wrap the boards in cream Gmund, Fedrigoni Woodstock, or whatever stock the brief calls for — uncoated, soft-touch matte, or book-cloth. The lid sits {em}flush{/em} on the base, sometimes with a recessed lip that whispers a magnet without showing one.",
      "Used for fragrance coffrets, jewellery sets, watch packaging, and any project where the unboxing is the moment. Minimum run 300. Lead time 20–28 days. Foil, emboss, and registered hot-foil are routine extras.",
    ],
    pullQuote: "Two pieces, lifted straight up — the simplest gesture a luxury box can make.",
    meta: ["1.5–2.5 mm core", "Paper or cloth wrap", "Min 300 pcs"],
    commercialTitle: "Custom luxury rigid box manufacturer — since 1992",
    commercialDescription: "Paper-wrapped rigid boxes for cosmetic, spirits, and gifting brands. 1.5–3.0 mm greyboard core, MOQ 200+ pieces, 20–28 day production. Built for Lancôme, Estée Lauder, Wuliangye and others.",
    buyerFaq: [
      { q: "What's the minimum order for a custom rigid box?", a: "200+ pieces public floor. Some structures run lower on a per-project quote. Below 200 the per-piece cost rises because press setup and hand-assembly time stop amortizing." },
      { q: "How long does a custom rigid box take?", a: "Samples 7–10 days; production 20–28 days from approved sample. Foil, emboss, and registered emboss-and-foil are included in the production schedule — no extra time." },
      { q: "What greyboard thickness should I spec?", a: "2.0 mm is the house standard for cosmetics; 2.5 mm for magnetic-flap and drawer constructions; 3.0 mm for spirits and heritage gift packs." },
    ],
  },
  magnetic: {
    prose: [
      "A flap that closes itself. Four to eight Type-N neodymium magnets sit hidden under the paper wrap, embedded in the lid and the base. The lid pulls home with a soft thunk and the seam disappears.",
      "Built on the rigid two-piece chassis with a third element — the hinged flap — wrapped in the same stock as the rest of the box. Common on jewellery, watches, and any project where the box doubles as a keepsake on a shelf.",
      "We pull-test every closure: 5,000 cycles, then ten random samples from each batch. Foil and emboss work the same as on a plain rigid. Lead time runs 24–32 days; the magnet sourcing adds about a week.",
    ],
    pullQuote: "The flap pulls home with a soft thunk; the seam disappears.",
    meta: ["4–8 N42 magnets", "Pull-tested 5,000 cycles", "24–32 days"],
    commercialTitle: "Magnetic closure rigid box manufacturer — luxury packaging",
    commercialDescription: "Magnetic-flap rigid boxes with 6–50 g pull-force at 2,800 Gauss, hidden under the wrap. MOQ 200+, 7–10 day samples, 24–32 day production. Built for Lancôme, Wuliangye and major cosmetic brands.",
    buyerFaq: [
      { q: "What's the minimum order quantity for a magnetic-flap rigid box?", a: "200+ pieces for rigid magnetic-flap construction. Some structures run lower on a per-project quote — ask in the brief." },
      { q: "How long does a magnetic-flap rigid box take to produce?", a: "Samples turn in 7–10 days. Production runs 24–32 days from approved sample. Magnet sourcing adds a week at very low volume." },
      { q: "How strong is the magnetic closure?", a: "Pull-force sits between 6 and 50 grams at 2,800 Gauss, tuned to lid weight and closure geometry. See the magnetic pull-force article for the full range." },
    ],
  },
  drawer: {
    prose: [
      "A drawer slides into a slipcase. The drawer carries the contents; the slipcase holds the wordmark. Both are paper-covered chipboard. The drawer has a thumb-slot or a ribbon pull; the slipcase shows nothing until the buyer reaches for it.",
      "We make singles, twins, and towers. The Advent calendar in Vol. IV is twenty-four drawers in a single oxblood shell — each drawer opening to a different interior paper, dawn cream to midnight ink.",
      "Used for jewellery, watches, fragrance sets, calendars, and any project with multiple objects to reveal in sequence. Hand-assembled. Drawer runners are paperboard — {em}never{/em} plastic. Lead time 22–30 days.",
    ],
    pullQuote: "The drawer carries the contents; the slipcase holds the wordmark.",
    meta: ["Single · twin · tower", "Ribbon or thumb-slot", "Hand-assembled"],
    commercialTitle: "Drawer & slipcase rigid box manufacturer — luxury packaging",
    commercialDescription: "Drawer-and-slipcase rigid construction for jewellery, fragrance, advent and gift sets. Singles, twins, towers. MOQ 200+, 22–30 day lead time. Paperboard runners — never plastic.",
    buyerFaq: [
      { q: "What's the minimum order for a drawer rigid box?", a: "200+ pieces for drawer-and-slipcase. Towers and twins quoted on a per-project basis." },
      { q: "How long does production take?", a: "Sample 7–10 days; production 22–30 days. Hand-assembled — drawer runners are paperboard, never plastic." },
      { q: "What formats do you make?", a: "Singles, twins, and towers (e.g. 24-drawer advent calendars). Drawer pull options: ribbon or thumb-slot." },
    ],
  },
  folding: {
    prose: [
      "The folding carton is the workhorse — flat-shipped, glued or tucked at the line. 250 to 450 gsm coated or uncoated stock, die-cut, scored, sometimes laminated. The cheapest box that can still feel considered.",
      "We make reverse-tuck, auto-bottom, seal-end, and a handful of bespoke crashes. Hot-foil and emboss are routine on the front panel. Soft-touch laminate is the upgrade most cosmetic clients reach for.",
      "Used for cosmetic outers, prestige FMCG, and retail-shelf packaging at scale. Minimum run 1,000 — per-unit cost falls fast above 5,000. Lead time 14–18 days, with hot-foil and emboss included in the schedule.",
    ],
    pullQuote: "The cheapest box that can still feel considered.",
    meta: ["250–450 gsm SBS", "1,000 pcs min", "14–18 days"],
    commercialTitle: "Folding carton manufacturer for luxury packaging",
    commercialDescription: "Reverse-tuck, auto-bottom, and seal-end folding cartons on 250–450 gsm SBS. MOQ 1,000+; per-piece cost falls fast above 5,000. 14–18 day lead time, hot-foil and soft-touch routine.",
    buyerFaq: [
      { q: "When is a folding carton cheaper than a rigid box?", a: "Above 5,000 pieces. Below 1,000 a rigid box is usually cheaper per unit because the rigid setup amortizes faster than the offset print setup." },
      { q: "What's the lead time on a folding carton?", a: "14–18 days. Hot-foil, emboss, and registered emboss-and-foil run inside the production schedule — no extra time for surface decoration." },
      { q: "What stocks do you use?", a: "250–450 gsm SBS folding boxboard. Reverse-tuck, auto-bottom, seal-end and bespoke crash formats. Soft-touch laminate is the most-specified upgrade." },
    ],
  },
  book: {
    prose: [
      "A book that doesn't open onto a page. The spine is hinged, the boards are wrapped in cloth — Iris, Wibalin, or Buckram — and a magnetic clasp inside the front cover keeps the case shut. The interior is foam or moulded pulp, shaped to hold the contents.",
      "We use a 2 mm chipboard core for the boards and a flexible cloth-wrapped spine. The wordmark goes on the front, foiled or debossed; the spine carries the colophon, {em}the way a book would{/em}. Cradles fit to ±1 mm.",
      "Used for archival kits, anniversary sets, and any project where the box is itself the object — kept on a shelf, opened on occasion. Lead time 28–35 days. Cloth options on file: fourteen colours, three weights.",
    ],
    pullQuote: "A book that doesn't open onto a page.",
    meta: ["Cloth-bound spine", "Magnetic clasp", "28–35 days"],
    commercialTitle: "Book-style & clamshell rigid box manufacturer — luxury packaging",
    commercialDescription: "Cloth-bound hinged book-style boxes with magnetic clasp closure. Iris, Wibalin, Buckram on file. MOQ 200+, 28–35 day lead time, ±1 mm cradle tolerance. Built for archival and anniversary kits.",
    buyerFaq: [
      { q: "What's the minimum order for a book-style rigid box?", a: "200+ pieces. Lead time runs longer than other structures because of the cloth-wrap step." },
      { q: "What cloth do you stock?", a: "Iris, Wibalin, and Buckram — 14 colours and 3 weights on file. Cloth options take about a week to source for orders outside the core palette." },
      { q: "How long does production take?", a: "Sample 10–14 days (cloth lead time is the bottleneck); production 28–35 days from approved sample." },
    ],
  },
  inserts: {
    prose: [
      "The structure inside the box. EVA foam (closed-cell, hand-cut or die-stamped), moulded paper pulp, cut-flute corrugated, or a satin-wrapped cradle. Whatever holds the object steady through transit and presents it cleanly on opening.",
      "We dimension to ±1 mm of the product. Bottles get pulp cradles with a recessed neck; jewellery sits on a foam pillow under a paper card. Multi-piece sets get matched apertures — the eye reads the kit before the hand reaches in.",
      "Inserts are drop-tested to ISTA-3A on project. Pulp is the sustainable default; EVA where impact protection is the priority. Lead time follows the outer box, 20–28 days typical.",
    ],
    pullQuote: "Whatever holds the object steady, and presents it cleanly on opening.",
    meta: ["EVA · pulp · satin · flute", "±1 mm tolerance", "ISTA-3A drop-test"],
    commercialTitle: "Custom packaging insert manufacturer — EVA, pulp, cradles",
    commercialDescription: "Moulded pulp, EVA foam, cut-flute and satin-wrapped cradles. ±1 mm tolerance to product. ISTA-3A drop-tested on project. Lead time matches outer box, 20–28 days typical.",
    buyerFaq: [
      { q: "What materials do you make inserts from?", a: "EVA foam (hand-cut or die-stamped), moulded paper pulp, cut-flute corrugated, satin-wrapped cradles. Pulp is the sustainable default; EVA where impact protection is the priority." },
      { q: "How tight is the fit?", a: "We dimension inserts to ±1 mm of the product. Bottle cradles include a recessed neck; multi-piece sets get matched apertures across the kit." },
      { q: "Are inserts drop-tested?", a: "Yes — to ISTA-3A on project. Test results are part of the project record. EVA is specified when impact protection is the priority." },
    ],
  },
  shoppers: {
    prose: [
      "A bag for the boutique floor. 200 gsm coated or uncoated paper, gusseted, with handles in rope, ribbon, knotted cord, or saddle-stitched leather. The base gets a reinforced board insert; the gussets tuck flat at the side.",
      "Common formats: tall portrait for fragrance, square for jewellery, broadsheet for apparel. We die-cut the handle holes to ±0.5 mm and reinforce with eyelets where the brief calls for them. Hot-foil and emboss on the front panel match the box inside.",
      "Used for boutique carry-out, retail flagship gift wrapping, and event hand-out. Lead time 16–22 days, minimum 500. The Sophisticate in Vol. XII is a corded handle on a broadsheet — the longest format we make.",
    ],
    pullQuote: "A bag is the box's antechamber — the customer's first surface.",
    meta: ["200 gsm + gusset", "Rope · ribbon · cord", "Min 500 pcs"],
    commercialTitle: "Luxury shopper bag manufacturer — rope, ribbon, leather handles",
    commercialDescription: "Gusseted 200 gsm paper shoppers with rope, ribbon, knotted cord, or saddle-stitched leather handles. MOQ 500+, 16–22 day production. Hot-foil and emboss on the front panel to match the box inside.",
    buyerFaq: [
      { q: "What's the MOQ for shoppers?", a: "500+ pieces. Lower per-project on quote for premium boutique flagship runs." },
      { q: "What handle options do you make?", a: "Rope, ribbon, knotted cord, or saddle-stitched leather. Eyelet reinforcement on per-brief basis. Handle holes are die-cut to ±0.5 mm." },
      { q: "How long does production take?", a: "Sample 5–7 days; production 16–22 days. Lead time scales with the handle complexity — leather adds a week." },
    ],
  },
  bespoke: {
    prose: [
      "When none of the standard structures answer the brief. Hexagonal footprints, tessellating stacks, asymmetric reveals, hidden drawers behind concealed seams. Engineered from scratch on the factory floor.",
      "We start with the contents and work {em}outward{/em}. A perfume that pours from an unconventional flacon needs a cradle no folding template covers; a calendar of twenty-four asymmetric drawers needs a shell engineered to hold them. We sketch, prototype in white blanks, and refine over two or three rounds before cutting the final dies.",
      "Lead time runs 6–10 weeks for the engineering alone; the production schedule follows. Minimum 100 units typical. We name each structure after the brand on the colophon — six are on file, each in a single archive.",
    ],
    pullQuote: "Engineered from the contents outward.",
    meta: ["6–10 wks engineering", "From 100 units", "Named after the brand"],
    commercialTitle: "Bespoke luxury packaging manufacturer — engineered one-offs",
    commercialDescription: "Custom packaging structures engineered from scratch for unusual flacons, calendars, and limited editions. From 100 units, 6–10 week engineering window. Each structure named after the brand on the colophon.",
    buyerFaq: [
      { q: "When is a bespoke structure the right call?", a: "When none of the standard structures answer the brief — unusual flacon geometries, asymmetric calendars, hidden drawer reveals. If a standard structure fits, we will tell you in the brief." },
      { q: "What's the minimum order?", a: "From 100 units typical. The constraint is engineering time amortization, not press capacity." },
      { q: "How long does it take?", a: "Engineering: 6–10 weeks (sketch → white-blank prototype → 2–3 refinement rounds → final dies). Production schedule follows once dies are cut." },
    ],
  },

  // ----- Surfaces -----
  emboss: {
    prose: [
      "A magnesium die, heated, pressed into the paper from below — the mark rises above the surface. No ink, no foil. Only the relief and the way light catches it. The most architectural decoration on the floor.",
      "We register emboss to ink and to foil at ±0.1 mm. Used for monograms, wordmarks, decorative borders, and the catch-light moment when the buyer turns the box under a showroom lamp. Best on uncoated stocks where the fibre stretches without breaking.",
      "Sculpted (multi-level) embossing adds a second die for depth; tone-on-tone pairs the relief with a matching ink. Plate cost rolls into the first run — subsequent runs reuse the magnesium. Min 300 pcs.",
    ],
    pullQuote: "No ink, no foil — only the relief and the light.",
    meta: ["±0.1 mm registration", "Magnesium · 0.6 mm", "300 pcs min"],
    commercialTitle: "Registered emboss manufacturer for luxury packaging — ±0.1 mm",
    commercialDescription: "Registered embossing held to ±0.1 mm — industry typical is ±0.3 mm. Magnesium dies for short runs, copper for longer. Best on uncoated stocks. MOQ 200+, sample 7–10 days.",
    buyerFaq: [
      { q: "What tolerance do you hold for registered emboss-and-foil?", a: "±0.1 mm at Huamei. Industry typical is ±0.3 mm. The difference shows up at six inches as a foil that 'shadows' the emboss." },
      { q: "Which stocks emboss best?", a: "Uncoated paper holds the relief crispest because the fibre stretches without breaking. Book-cloth and recycled stocks also work; coated art papers crack at deep emboss." },
      { q: "Do you do sculpted (multi-level) emboss?", a: "Yes — a second die adds depth detail. Sculpted is most often used for wordmarks; flat emboss for borders and decorative shapes." },
    ],
  },
  deboss: {
    prose: [
      "Emboss inverted. The mark is pressed below the surface, sunken into the page. A heated die comes down from above; the paper compresses, fibres compact, the impression sets cool. {em}Quieter{/em} than emboss, often more elegant on tinted stocks.",
      "Best on uncoated and lightly-textured papers — Crush Citrus, Colorplan, Wibalin — where the deboss reads as architecture rather than damage. We pair with foil for the standard wordmark treatment, or leave blind for a tone-on-tone whisper.",
      "Same ±0.1 mm registration as emboss. Plate is magnesium for short runs, copper for longer ones. Particularly good on book-cloth: the cloth holds the impression cleanly without cracking.",
    ],
    pullQuote: "The mark sunken into the page — quieter than emboss.",
    meta: ["±0.1 mm registration", "Best on uncoated", "Cloth-friendly"],
    commercialTitle: "Deboss manufacturer for luxury packaging — ±0.1 mm",
    commercialDescription: "Sunken-mark debossing on uncoated, tinted, and book-cloth stocks. Blind (no foil) or foil-filled. ±0.1 mm registration. MOQ 200+, lead time matches outer box.",
    buyerFaq: [
      { q: "What's the difference between emboss and deboss?", a: "Emboss raises the mark above the surface; deboss presses it below. Same ±0.1 mm registration tolerance. Deboss is quieter, often more elegant on tinted stocks." },
      { q: "Can deboss be done blind, or does it need foil?", a: "Both work. Blind deboss is the tone-on-tone whisper option; foil-filled deboss is the standard wordmark treatment. Most projects use one or the other, not both." },
      { q: "Does it work on cloth?", a: "Yes — book-cloth (Wibalin, Iris) holds the impression cleanly without cracking. Often the best surface for a tone-on-tone deboss." },
    ],
  },
  "soft-touch": {
    prose: [
      "A matte velvet film laminated to a printed sheet. Scratch-resistant, fingerprint-resistant, slightly silken under the fingertips. Reads as more expensive than the underlying stock — which is half the point.",
      "We laminate after offset printing, before the finishing line. Pairs with spot-UV (gloss-on-matte), foil, and emboss without complication. Soft-touch over a dark Pantone is a Huamei signature for cosmetic and skincare outers.",
      "Adds about ¥2.40 per unit at a 5k run. Runs inside the production schedule — no extra lead time. Not recommended on stocks under 250 gsm — the film stiffens the carton, which can over-stiffen a thin board.",
    ],
    pullQuote: "Reads as more expensive than the underlying stock — which is half the point.",
    meta: ["Matte velvet film", "+¥2.40/unit @ 5k", "≥ 250 gsm stock"],
    commercialTitle: "Soft-touch laminate manufacturer for luxury packaging",
    commercialDescription: "Velvet matte soft-touch laminate, scratch- and fingerprint-resistant. Pairs cleanly with spot-UV, hot-foil, and emboss. Recommended on ≥250 gsm stock. Runs inside the production schedule — no extra lead time.",
    buyerFaq: [
      { q: "What does soft-touch laminate do?", a: "Adds a velvet matte film over the printed sheet. Scratch-resistant, fingerprint-resistant, slightly silken in the hand. Reads as more expensive than the underlying stock." },
      { q: "Can I combine it with spot-UV or foil?", a: "Yes — soft-touch over dark Pantone with spot-UV on top is a Huamei signature for cosmetic outers. Hot-foil and emboss work on the laminate without issue." },
      { q: "Any stock restrictions?", a: "Not recommended below 250 gsm. The film stiffens the carton; on thin board it can over-stiffen and feel cardboardy rather than premium." },
    ],
  },
  "spot-uv": {
    prose: [
      "A gloss varnish printed in registered patterns over a matte field. The contrast is the subject: a pinstripe of gloss against soft-touch laminate, a wordmark sealed in clear over uncoated paper, a pattern that only catches the light from {em}one angle{/em}.",
      "We register spot-UV to ink and emboss at ±0.2 mm. Most common over soft-touch laminate, where the matte-and-gloss contrast is most pronounced; also used straight onto coated stock for a more subtle effect.",
      "Drawn at the artwork stage — the spot-UV file is a separate spot colour in the print PDF. We preview the gloss line on a sample sheet before going to production. Runs inside the production schedule — no extra lead time.",
    ],
    pullQuote: "A pattern that only catches the light from one angle.",
    meta: ["±0.2 mm to ink", "Best over soft-touch", "Registered to print"],
    commercialTitle: "Spot UV varnish manufacturer for luxury packaging",
    commercialDescription: "Gloss-on-matte spot UV varnish, registered to ink and emboss at ±0.2 mm. Best over soft-touch laminate. Drawn at the artwork stage as a separate spot colour. Runs inside the production schedule.",
    buyerFaq: [
      { q: "What does spot UV add to a box?", a: "A glossy varnish printed in registered patterns over a matte field. The contrast — gloss against soft-touch or uncoated — only catches the light from one angle. Used for wordmarks, decorative patterns, and accent panels." },
      { q: "What stock does it work best over?", a: "Soft-touch laminate is the strongest pairing — the matte-and-gloss contrast is most pronounced. Also works straight onto coated stock for a more subtle effect." },
      { q: "How is it specified in artwork?", a: "Spot UV is drawn as a separate spot colour in the print PDF. We preview the gloss line on a sample sheet before production; the screen cannot show how light catches the varnish." },
    ],
  },
  offset: {
    prose: [
      "Eight-colour Heidelberg XL 106, ISO 12647-2 colour-managed, ΔE ≤ 2. The press floor's main vehicle — every box that carries a printed graphic, a photograph, or a Pantone-matched brand colour passes through it. Plate-making is in-house; we cut new plates per job.",
      "Four colours are CMYK; the remaining four are reserved for Pantone spots, white, varnish, or speciality inks — metallic, soy, low-migration food-safe. We proof on contract paper at GMG-certified accuracy before press.",
      "Minimum 1,000 for offset; digital short-run fills below that. The press is most efficient at 5,000–80,000 units. Soy inks are house standard; petroleum on request only.",
    ],
    pullQuote: "ΔE ≤ 2 — the floor's hard ceiling on colour.",
    meta: ["8-col Heidelberg", "ΔE ≤ 2", "GMG contract proofs"],
    commercialTitle: "Offset print manufacturer for luxury packaging — Pantone ΔE ≤ 2",
    commercialDescription: "8-colour Heidelberg XL 106 offset, ISO 12647-2 colour managed to ΔE ≤ 2. Soy inks house standard. GMG-certified contract proofs. MOQ 1,000+ for offset; digital fills below that.",
    buyerFaq: [
      { q: "What's the colour tolerance you hold on press?", a: "ΔE ≤ 2 against Pantone, GMG-certified contract proof. The four 'extra' colour stations beyond CMYK carry Pantone spots, white, varnish, or speciality inks." },
      { q: "What's the minimum for offset?", a: "1,000+ pieces. Below that the press setup cost dominates per-piece price; digital short-run fills the volume below 1,000." },
      { q: "What inks do you use?", a: "Soy inks are house standard. Petroleum inks available on request only. Metallic and low-migration food-safe inks on file for the speciality stations." },
    ],
  },
  wraps: {
    prose: [
      "The skin of a rigid box. Paper, cloth, or film glued to the chipboard core after the box is built and before the lid is fitted. We hold 80+ stocks on file from Gmund, Fedrigoni, Iris, and Wibalin — the four mills that have set the catalogue's tone since 1992.",
      "Paper wraps {em}mitre{/em} at the corners; cloth wraps cover the corners flat, with the weave running consistently across the lid and walls. Wibalin and Iris are book-cloth — they take emboss and foil cleanly. Gmund Colors Matt is our default cream.",
      "Selection is part of the early consultation. We post a swatch of every candidate in the first sample round — paper feels different in the hand than in a PDF.",
    ],
    pullQuote: "The skin of the box — chosen at the first conversation.",
    meta: ["80+ stocks", "Gmund · Fedrigoni · Iris", "Mitred corners"],
    commercialTitle: "Wrap papers & cloth for luxury packaging — Gmund, Fedrigoni, Iris",
    commercialDescription: "80+ wrap stocks on file from Gmund, Fedrigoni, Iris book-cloth, Wibalin. Paper wraps mitre at the corners; cloth wraps cover flat. Selection in the first consultation; swatches posted free.",
    buyerFaq: [
      { q: "What stocks do you hold on file?", a: "80+ wrap stocks including Gmund Colors Matt (default cream), Fedrigoni Woodstock, Iris and Wibalin book-cloth. We post swatches of every candidate in the first sample round." },
      { q: "Paper or cloth wrap — how do I choose?", a: "Paper is the default; mitres at the corners. Cloth (Iris, Wibalin) covers corners flat and takes emboss + foil cleanly. Cloth adds about a week to lead time outside the core palette." },
      { q: "Can I bring my own stock?", a: "Yes — send the spec sheet. We will source through the mill or accept a brand-supplied roll. Mill-direct is usually faster and avoids customs delays." },
    ],
  },

  // ----- Industries -----
  cosmetic: {
    title: "Cosmetic ",
    italic: "& Skincare.",
    cn: "化妆 · 护肤",
    lede: "Compact, tube, jar — and the boxes that lift them off the shelf. Unit and outer, matched, in the registers the prestige aisle expects.",
    prose: [
      "Cosmetic and skincare outers are where the Huamei floor spends most of its press time. The brief is rarely loud: a soft-touch laminate, a foil wordmark, a spot-UV catch-light. The work is in the fit.",
      "Folding cartons for serum tubes and lipsticks; rigid two-piece for fragrance and palette sets; magnetic flaps where the unboxing is the moment. We register foil to emboss at ±0.1 mm, and the Pantone tolerance on press is {em}ΔE ≤ 2{/em}.",
      "Houses on file include Lancôme, Estée Lauder, L'Oréal, and a small bench of indie skincare projects. Minimum 1,000 for folding, 300 for rigid. Lead time 14–18 days for cartons, 22–32 days for rigid.",
    ],
    pullQuote: "The compact, the tube, the jar — and everything that sits around them.",
    meta: ["9 in archive", "ΔE ≤ 2", "Soft-touch standard"],
    commercialTitle: "Luxury cosmetic & skincare packaging manufacturer",
    commercialDescription: "Folding cartons, rigid boxes, and magnetic flaps for cosmetic and skincare brands. ΔE ≤ 2 colour, ±0.1 mm foil-to-emboss registration. Built for Lancôme, Estée Lauder, L'Oréal Paris.",
    buyerFaq: [
      { q: "What's the MOQ for cosmetic packaging?", a: "1,000+ for folding cartons; 300+ for rigid; 200+ for magnetic-flap rigid. Below the floors a rigid box is usually cheaper per unit than a folding carton." },
      { q: "What lead time should I plan for?", a: "14–18 days for folding cartons; 20–32 days for rigid. Surface decoration — hot-foil, emboss, soft-touch, spot-UV — runs inside the production schedule. Sample turnaround 7–10 days." },
      { q: "What colour tolerance do you hold?", a: "Pantone-matched to ΔE ≤ 2 on press, GMG-certified contract proof. Foil-to-emboss registration ±0.1 mm where the brief requires." },
    ],
  },

  spirits: {
    title: "Wine, Spirits ",
    italic: "& Tea.",
    cn: "酒 · 茶",
    lede: "Heritage spirits, baijiu coffrets, archival tea — book-style, drawer, cloth-wrapped. The reveal is half the bottle.",
    prose: [
      "Spirits are the longest-running register on the Huamei floor. Baijiu houses, grand-cru wine, and archival tea share a structural vocabulary — book-style boxes, slipcase-and-drawer, ceramic cradles, magnetic clamshells — and a tolerance for {em}weight{/em} that few other categories share.",
      "We engineer inserts to ±1 mm of the bottle profile and pulp the cradle where moisture stability matters. Foil-on-cloth is the catalogue rule for premium SKUs; ceramic-and-foil for the highest tier.",
      "Houses on file include Wuliangye, Yangshao, Dukang, Hongxing Erguotou, Shede, Taozui, and a tea bench that runs from T2 to DEEPURE Heritage. Lead time 22–35 days. Minimum 300 — 1,000 for the printed cartons that sit beside.",
    ],
    pullQuote: "The reveal is half the bottle.",
    meta: ["14 in archive", "Book · drawer · ceramic", "±1 mm cradles"],
    commercialTitle: "Luxury spirits, wine & tea packaging manufacturer",
    commercialDescription: "Book-style, drawer, and ceramic cradle gift packs for spirits, wine, and archival tea. ±1 mm bottle-profile tolerance. Built for Wuliangye, Yangshao, Dukang, Hongxing Erguotou.",
    buyerFaq: [
      { q: "What's the MOQ for a spirits gift box?", a: "300+ for rigid construction; 1,000+ for the printed folding cartons that sit beside the bottle in retail. Some heritage launches run lower on per-project quote." },
      { q: "How long does a spirits launch take?", a: "22–35 days production. Ceramic cradles add a week; cloth-wrapped book-style adds another. Plan 8–10 weeks from brief to a warehouse pallet in the US." },
      { q: "What insert options do you make for bottles?", a: "Moulded pulp (sustainable default, moisture-stable for cellared SKUs), EVA foam (impact protection), ceramic cradles (premium tier). All dimensioned to ±1 mm of the bottle profile." },
    ],
  },

  seasonal: {
    title: "Seasonal ",
    italic: "& Gifting.",
    cn: "節令 · 禮盒",
    lede: "Chinese New Year, Mid-Autumn, Lunar limited editions, gift kits and shoppers. Colour and symbol are the brief.",
    prose: [
      "Seasonal work is booked a year ahead. CNY ships in October; Mid-Autumn ships in June. The colour palette and the auspicious symbol arrive with the brief; the structure is engineered around them.",
      "Sleeves, drawers, ribbon shoppers, laser-cut overlays. We hold the catalogue's deepest bench of red-and-gold treatments, but the work is just as often a soft pink food sleeve or a kraft puzzle book. {em}Gifting{/em} is the longer register — birthdays, weddings, corporate hand-offs — and it travels through the year.",
      "Minimum 500 for shoppers, 1,000 for printed cartons. Lead time runs 18–28 days outside the seasonal lock-in; inside it, we reserve press capacity in February for the autumn moon.",
    ],
    pullQuote: "Booked a year ahead — colour and symbol are the brief.",
    meta: ["6 in archive", "CNY · Mid-Autumn", "Booked a year ahead"],
    commercialTitle: "CNY & Mid-Autumn gift box manufacturer — luxury seasonal packaging",
    commercialDescription: "Chinese New Year, Mid-Autumn, and lunar limited-edition gift packs. Sleeves, drawers, ribbon shoppers, laser-cut overlays. CNY ships October; Mid-Autumn ships June. Book press capacity a year ahead.",
    buyerFaq: [
      { q: "When do I need to book a CNY launch?", a: "Press capacity is reserved by February for the October ship date. The earlier the brief lands, the more structural engineering room there is. Late bookings ship; they just have less room to refine." },
      { q: "What's the MOQ for seasonal work?", a: "500+ for shoppers; 1,000+ for printed cartons. Limited editions occasionally run lower on per-project quote — say so in the brief." },
      { q: "What structures work best for seasonal gifting?", a: "Drawer-and-slipcase carries the most ceremony; sleeves are the lightweight option; laser-cut overlays add the symbol without changing the structure. Red-and-gold treatments are the deepest bench in our catalogue." },
    ],
  },

  wellness: {
    title: "Wellness",
    cn: "養 · 生",
    lede: "Botanicals, soaps, the quieter end of the wellness aisle. Folding cartons, sleeves, pulp inserts and a gentler palette.",
    prose: [
      "Wellness is the youngest register on the floor and, increasingly, the most considered. The brief asks for restraint: uncoated stock, vegetable inks, paper inserts that compost, type that whispers.",
      "We use folding cartons with sleeves for soap and botanical sets, pulp trays for capsule and sachet kits, and {em}floral{/em} debossed wraps where the brief is gift-minded. The colour register sits in soft pinks, eucalyptus greens, and ivory — never the saturated palette of mass cosmetic.",
      "Minimum 500 for folding cartons, 1,000 for runs above the prestige threshold. Lead time 16–22 days. Pulp is the sustainable default; soy ink is house standard.",
    ],
    pullQuote: "Type that whispers — paper that composts.",
    meta: ["2 in archive", "Pulp + folding", "Soy ink standard"],
    commercialTitle: "Luxury wellness & botanical packaging manufacturer",
    commercialDescription: "Restrained, considered packaging for botanicals, soaps, and supplements. Uncoated stocks, soy ink, pulp inserts that compost. FSC/PEFC default. MOQ 500+, 16–22 day lead time.",
    buyerFaq: [
      { q: "What sustainability standards do you hold?", a: "FSC or PEFC stocks by default. Soy ink house standard; petroleum ink available only on request. Pulp inserts are the sustainable default for cradles and trays." },
      { q: "What's the MOQ for wellness packaging?", a: "500+ for folding cartons. Prestige threshold (the runs where unit cost stabilizes) is at 1,000+." },
      { q: "What's the typical palette and stock?", a: "Soft pinks, eucalyptus greens, ivory — never the saturated palette of mass cosmetic. Uncoated stocks (Gmund, Fedrigoni) carry the brief; floral debossed wraps for gift-minded SKUs." },
    ],
  },
};

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Topic-slug → ordered list of blog post slugs to surface as "Read further"
// links. Each topic gets up to 3 blogs. Added 2026-05-11 to wire the
// hub-and-spoke link graph: commercial /craft + /industry pages link out
// to investigative /blogs/* content. Slug must match a file in content/blogs.
const TOPIC_RELATED_BLOGS: Record<string, string[]> = {
  // Structures
  rigid: ["custom-luxury-rigid-box-manufacturing", "greyboard-grades-for-luxury-rigid-construction", "rigid-box-vs-folding-carton"],
  magnetic: ["magnetic-pull-force-explained", "custom-luxury-rigid-box-manufacturing"],
  drawer: ["custom-luxury-rigid-box-manufacturing", "moq-realities-luxury-packaging"],
  folding: ["rigid-box-vs-folding-carton", "moq-realities-luxury-packaging"],
  book: ["custom-luxury-rigid-box-manufacturing", "greyboard-grades-for-luxury-rigid-construction"],
  inserts: ["custom-luxury-rigid-box-manufacturing"],
  shoppers: ["custom-luxury-rigid-box-manufacturing", "moq-realities-luxury-packaging"],
  bespoke: ["moq-realities-luxury-packaging", "custom-luxury-rigid-box-manufacturing"],
  // Surfaces
  "hot-foil": ["hot-foil-stamping-for-luxury-packaging", "hot-foil-vs-cold-foil-cost-and-finish", "registered-emboss-foil-tolerance"],
  emboss: ["registered-emboss-foil-tolerance", "hot-foil-stamping-for-luxury-packaging"],
  deboss: ["registered-emboss-foil-tolerance", "hot-foil-stamping-for-luxury-packaging"],
  "soft-touch": ["hot-foil-stamping-for-luxury-packaging"],
  "spot-uv": ["hot-foil-stamping-for-luxury-packaging"],
  offset: ["hot-foil-stamping-for-luxury-packaging"],
  wraps: ["custom-luxury-rigid-box-manufacturing", "greyboard-grades-for-luxury-rigid-construction"],
  // Industries
  cosmetic: ["custom-luxury-rigid-box-manufacturing", "magnetic-pull-force-explained", "greyboard-grades-for-luxury-rigid-construction"],
  spirits: ["custom-luxury-rigid-box-manufacturing", "working-with-a-chinese-luxury-packaging-manufacturer", "greyboard-grades-for-luxury-rigid-construction"],
  seasonal: ["custom-luxury-rigid-box-manufacturing", "moq-realities-luxury-packaging"],
  wellness: ["moq-realities-luxury-packaging", "custom-luxury-rigid-box-manufacturing"],
};

// Read post titles + descriptions lazily from content/blogs at module init
// so the topic page can render real titles, not just slugs. Cached.
type BlogMeta = { title: string; description: string };
let _blogMetaCache: Record<string, BlogMeta> | null = null;
function getBlogMeta(): Record<string, BlogMeta> {
  if (_blogMetaCache) return _blogMetaCache;
  // Lazy import to avoid pulling fs into client bundles (Topic is server-only).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readFileSync, readdirSync, existsSync } = require("node:fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { join } = require("node:path");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const matter = require("gray-matter");
  const dir = join(process.cwd(), "content", "blogs");
  const map: Record<string, BlogMeta> = {};
  if (!existsSync(dir)) return (_blogMetaCache = map);
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const slug = file.replace(/\.md$/, "");
    const raw = readFileSync(join(dir, file), "utf8");
    const { data } = matter(raw);
    map[slug] = {
      title: data.title ?? slug,
      description: data.description ?? "",
    };
  }
  return (_blogMetaCache = map);
}

function relatedBlogsForTopic(slug: string): TopicRelatedBlog[] {
  const blogSlugs = TOPIC_RELATED_BLOGS[slug];
  if (!blogSlugs?.length) return [];
  const meta = getBlogMeta();
  return blogSlugs
    .map((s) => {
      const m = meta[s];
      return m ? { slug: s, title: m.title, description: m.description } : null;
    })
    .filter((b): b is TopicRelatedBlog => b !== null)
    .slice(0, 3);
}

// Auto-derive named clients (max 5) from the volumes that demonstrate this
// topic. Used to render the trust line on /craft/* and /industry/* pages.
function clientsForTopic(category: TopicCategory, slug: string): string[] {
  let volumeSlugs: string[] = [];
  if (category === "craft") {
    volumeSlugs = CRAFT_VOLUMES[slug] ?? [];
  } else {
    const cats = INDUSTRY_CATEGORIES[slug];
    if (cats) {
      volumeSlugs = VOLUMES.filter((v) => cats.includes(v.category)).map((v) => v.slug);
    }
  }
  const seen = new Set<string>();
  const clients: string[] = [];
  for (const vs of volumeSlugs) {
    const v = VOLUMES.find((x) => x.slug === vs);
    if (!v) continue;
    const c = v.client.trim();
    if (!c || /house design|studio client|dtc client/i.test(c)) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    clients.push(c);
    if (clients.length >= 5) break;
  }
  return clients;
}

export function getTopic(category: TopicCategory, slug: string): Topic {
  const explicit = TOPICS[slug];
  if (explicit && explicit.category === category) {
    const dynamic = relatedFromVolumes(slug);
    const base = dynamic ? { ...explicit, related: dynamic } : explicit;
    const trustClients = clientsForTopic(category, slug);
    const relatedBlogs = relatedBlogsForTopic(slug);
    return {
      ...base,
      ...(trustClients.length ? { trustClients } : {}),
      ...(relatedBlogs.length ? { relatedBlogs } : {}),
    };
  }

  const meta = CATEGORY_META[category];
  const name = titleize(slug);
  const copy = TOPIC_COPY[slug];
  const trustClients = clientsForTopic(category, slug);
  const relatedBlogs = relatedBlogsForTopic(slug);

  return {
    slug,
    category,
    categoryLabel: meta.label,
    parentLabel: STRUCTURE_SLUGS.has(slug)
      ? "By Structure"
      : SURFACE_SLUGS.has(slug)
        ? "By Surface"
        : meta.label,
    parentHref: meta.href,
    rn: copy ? rnForSlug(slug) : "—",
    title: copy?.title ?? name,
    italic: copy?.italic,
    cn: copy?.cn ?? meta.cn,
    heroImage: heroImageFor(slug),
    lede: copy?.lede ?? (copy
      ? `${name} on the Huamei floor — the materials, the use cases, the operational details.`
      : "A topic from the Huamei archive — content for this page is being prepared. The structure below is the shape every topic takes."),
    meta: copy?.meta ?? ["Min 300 pcs", "20 – 28 days", "Corrections free"],
    prose: copy?.prose ?? [
      `${name} is one of the practices on the Huamei floor. Like every other topic in this category, it has a history, a press, a set of materials, and a small number of decisions that matter more than the rest.`,
      "This page is the {em}reusable template{/em} that every topic uses — philosophy, sub-options, process, related work, and the spec table. Real content for this slug will be wired through the CMS.",
      "In the meantime, the structure remains: a paragraph or two of prose, a short list of options, four steps of process, three or four related volumes, and the hard-numbered spec table at the bottom.",
    ],
    pullQuote: copy?.pullQuote ?? "Every topic earns the same template. The content is what differs.",
    itemsTitle: "Inside ",
    itemsItalic: name.toLowerCase(),
    itemsStamp: "Sub-options · placeholder",
    items: HOT_FOIL.items.slice(0, 4).map((it, i) => ({
      ...it,
      name: `Item ${i + 1}`,
      italic: undefined,
      desc: "Placeholder description. Replace once the CMS field is populated.",
    })),
    processStamp: "Process · iv steps",
    processSteps: HOT_FOIL.processSteps,
    related: relatedFromVolumes(slug) ?? copy?.related ?? HOT_FOIL.related,
    specs: [
      { label: "Min run",        value: "300 pcs" },
      { label: "Lead time",      value: "20 – 28 days" },
      { label: "Substrates",     value: "Coated · Uncoated · Cloth" },
      { label: "Certifications", value: "FSC · PEFC · ISO 14001" },
      { label: "Tolerance",      value: "±0.1 mm" },
      { label: "Sample turn",    value: "72 hr" },
    ],
    ctaKicker: "Samples · Posted free",
    ctaTitle: `Begin with ${name.toLowerCase()}.`,
    ctaDesc: "Every topic in the Huamei archive starts the same way — a brief, a sample, a price band. We post first-round samples free of charge.",
    commercialTitle: copy?.commercialTitle,
    commercialDescription: copy?.commercialDescription,
    buyerFaq: copy?.buyerFaq,
    ...(trustClients.length ? { trustClients } : {}),
    ...(relatedBlogs.length ? { relatedBlogs } : {}),
  };
}
