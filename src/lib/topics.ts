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
  meta: ["Au · Cu · Ag", "17 surfaces on file", "Min 300 pcs"],
  prose: [
    "Foil-stamping is the oldest decoration on a Huamei box and, still, the most argued about. A heated die meets a sheet of pigmented foil, and that foil — copper, champagne, silver, or one of the four blacks we keep on the floor — transfers in the shape of the die. Nothing is printed. Nothing is glued. The decoration is mechanical.",
    "What that means for the eye is specific. Light catches the line in only one direction. A logo set in foil is brighter than a logo set in ink and, at the same time, somehow {em}quieter{/em} — because it disappears when the surface is held off-axis. A box that uses foil well rewards the hand and not the camera.",
    "We hold seventeen foil colours in stock and pull the rest from Kurz. Registered emboss-and-foil — where the die rises and lights at once — is a Huamei specialty; we will demonstrate it on the proof.",
  ],
  pullQuote: "A line of metal pressed once, hot, into the page.",
  itemsTitle: "Foils ",
  itemsItalic: "on file.",
  itemsStamp: "17 colours · Au · Cu · Ag · Black · Holo",
  items: [
    { rn: "i.",   name: "Champagne ",     italic: "gold",       desc: "House primary. Warm, slightly green undertone. The catalogue rule, the cover plate.",         meta: "Kurz Lux 220", href: "#" },
    { rn: "ii.",  name: "Deep ",          italic: "copper",     desc: "Rose-cast. Reads warm on cream, sharp on noir. Used on the Bella Haircare wordmark.",         meta: "Kurz 470",     href: "#" },
    { rn: "iii.", name: "Cool silver",                          desc: "Neutral. The only silver we will press without first quoting matte vs. mirror.",              meta: "Kurz 392",     href: "#" },
    { rn: "iv.",  name: "Black ",         italic: "gloss",      desc: "A foil that reads as ink, but holds the press shadow. For tone-on-tone wordmarks.",           meta: "Kurz 901",     href: "#" },
    { rn: "v.",   name: "Black ",         italic: "matte",      desc: "Dries velvet. Pairs with embossed kraft and uncoated stocks.",                                meta: "Kurz 905",     href: "#" },
    { rn: "vi.",  name: "Pearl ",         italic: "iridescent", desc: "Used sparingly. A holographic with the colour-wheel pulled out — only the catch-light remains.", meta: "Kurz 360",  href: "#" },
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
    { label: "Stock list",        value: "17 colours · Kurz · Crown · in-house" },
    { label: "Plate material",    value: "Magnesium · 0.6 mm" },
    { label: "Press temperature", value: "120 – 160°C" },
    { label: "Dwell",             value: "0.4 – 0.8 s" },
    { label: "Min run",           value: "300 pcs" },
    { label: "Lead time",         value: "20 – 28 days" },
    { label: "Min line weight",   value: "0.15 mm" },
    { label: "Registration",      value: "±0.1 mm to emboss" },
    { label: "Substrates",        value: "Coated · Uncoated · Cloth" },
  ],
  ctaKicker: "Foil samples · Posted free",
  ctaTitle: "Pull a foil sample, or send us a die.",
  ctaDesc: "We will press your wordmark on three stocks — coated, uncoated, and Gmund cloth — in your chosen foil and post the swatches within five working days.",
  heroImage: "/photos/generated/surfaces/hot-foil.jpg",
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
  },
  magnetic: {
    prose: [
      "A flap that closes itself. Four to eight Type-N neodymium magnets sit hidden under the paper wrap, embedded in the lid and the base. The lid pulls home with a soft thunk and the seam disappears.",
      "Built on the rigid two-piece chassis with a third element — the hinged flap — wrapped in the same stock as the rest of the box. Common on jewellery, watches, and any project where the box doubles as a keepsake on a shelf.",
      "We pull-test every closure: 5,000 cycles, then ten random samples from each batch. Foil and emboss work the same as on a plain rigid. Lead time runs 24–32 days; the magnet sourcing adds about a week.",
    ],
    pullQuote: "The flap pulls home with a soft thunk; the seam disappears.",
    meta: ["4–8 N42 magnets", "Pull-tested 5,000 cycles", "24–32 days"],
  },
  drawer: {
    prose: [
      "A drawer slides into a slipcase. The drawer carries the contents; the slipcase holds the wordmark. Both are paper-covered chipboard. The drawer has a thumb-slot or a ribbon pull; the slipcase shows nothing until the buyer reaches for it.",
      "We make singles, twins, and towers. The Advent calendar in Vol. IV is twenty-four drawers in a single oxblood shell — each drawer opening to a different interior paper, dawn cream to midnight ink.",
      "Used for jewellery, watches, fragrance sets, calendars, and any project with multiple objects to reveal in sequence. Hand-assembled. Drawer runners are paperboard — {em}never{/em} plastic. Lead time 22–30 days.",
    ],
    pullQuote: "The drawer carries the contents; the slipcase holds the wordmark.",
    meta: ["Single · twin · tower", "Ribbon or thumb-slot", "Hand-assembled"],
  },
  folding: {
    prose: [
      "The folding carton is the workhorse — flat-shipped, glued or tucked at the line. 250 to 450 gsm coated or uncoated stock, die-cut, scored, sometimes laminated. The cheapest box that can still feel considered.",
      "We make reverse-tuck, auto-bottom, seal-end, and a handful of bespoke crashes. Hot-foil and emboss are routine on the front panel. Soft-touch laminate is the upgrade most cosmetic clients reach for.",
      "Used for cosmetic outers, prestige FMCG, and retail-shelf packaging at scale. Minimum run 1,000 — per-unit cost falls fast above 5,000. Lead time 14–18 days for unprinted blanks; add a week for hot-foil.",
    ],
    pullQuote: "The cheapest box that can still feel considered.",
    meta: ["250–450 gsm SBS", "1,000 pcs min", "14–18 days"],
  },
  book: {
    prose: [
      "A book that doesn't open onto a page. The spine is hinged, the boards are wrapped in cloth — Iris, Wibalin, or Buckram — and a magnetic clasp inside the front cover keeps the case shut. The interior is foam or moulded pulp, shaped to hold the contents.",
      "We use a 2 mm chipboard core for the boards and a flexible cloth-wrapped spine. The wordmark goes on the front, foiled or debossed; the spine carries the colophon, {em}the way a book would{/em}. Cradles fit to ±1 mm.",
      "Used for archival kits, anniversary sets, and any project where the box is itself the object — kept on a shelf, opened on occasion. Lead time 28–35 days. Cloth options on file: fourteen colours, three weights.",
    ],
    pullQuote: "A book that doesn't open onto a page.",
    meta: ["Cloth-bound spine", "Magnetic clasp", "28–35 days"],
  },
  inserts: {
    prose: [
      "The structure inside the box. EVA foam (closed-cell, hand-cut or die-stamped), moulded paper pulp, cut-flute corrugated, or a satin-wrapped cradle. Whatever holds the object steady through transit and presents it cleanly on opening.",
      "We dimension to ±1 mm of the product. Bottles get pulp cradles with a recessed neck; jewellery sits on a foam pillow under a paper card. Multi-piece sets get matched apertures — the eye reads the kit before the hand reaches in.",
      "Inserts are drop-tested to ISTA-3A on project. Pulp is the sustainable default; EVA where impact protection is the priority. Lead time follows the outer box, 20–28 days typical.",
    ],
    pullQuote: "Whatever holds the object steady, and presents it cleanly on opening.",
    meta: ["EVA · pulp · satin · flute", "±1 mm tolerance", "ISTA-3A drop-test"],
  },
  shoppers: {
    prose: [
      "A bag for the boutique floor. 200 gsm coated or uncoated paper, gusseted, with handles in rope, ribbon, knotted cord, or saddle-stitched leather. The base gets a reinforced board insert; the gussets tuck flat at the side.",
      "Common formats: tall portrait for fragrance, square for jewellery, broadsheet for apparel. We die-cut the handle holes to ±0.5 mm and reinforce with eyelets where the brief calls for them. Hot-foil and emboss on the front panel match the box inside.",
      "Used for boutique carry-out, retail flagship gift wrapping, and event hand-out. Lead time 16–22 days, minimum 500. The Sophisticate in Vol. XII is a corded handle on a broadsheet — the longest format we make.",
    ],
    pullQuote: "A bag is the box's antechamber — the customer's first surface.",
    meta: ["200 gsm + gusset", "Rope · ribbon · cord", "Min 500 pcs"],
  },
  bespoke: {
    prose: [
      "When none of the standard structures answer the brief. Hexagonal footprints, tessellating stacks, asymmetric reveals, hidden drawers behind concealed seams. Engineered from scratch on the factory floor.",
      "We start with the contents and work {em}outward{/em}. A perfume that pours from an unconventional flacon needs a cradle no folding template covers; a calendar of twenty-four asymmetric drawers needs a shell engineered to hold them. We sketch, prototype in white blanks, and refine over two or three rounds before cutting the final dies.",
      "Lead time runs 6–10 weeks for the engineering alone; the production schedule follows. Minimum 100 units typical. We name each structure after the brand on the colophon — six are on file, each in a single archive.",
    ],
    pullQuote: "Engineered from the contents outward.",
    meta: ["6–10 wks engineering", "From 100 units", "Named after the brand"],
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
  },
  deboss: {
    prose: [
      "Emboss inverted. The mark is pressed below the surface, sunken into the page. A heated die comes down from above; the paper compresses, fibres compact, the impression sets cool. {em}Quieter{/em} than emboss, often more elegant on tinted stocks.",
      "Best on uncoated and lightly-textured papers — Crush Citrus, Colorplan, Wibalin — where the deboss reads as architecture rather than damage. We pair with foil for the standard wordmark treatment, or leave blind for a tone-on-tone whisper.",
      "Same ±0.1 mm registration as emboss. Plate is magnesium for short runs, copper for longer ones. Particularly good on book-cloth: the cloth holds the impression cleanly without cracking.",
    ],
    pullQuote: "The mark sunken into the page — quieter than emboss.",
    meta: ["±0.1 mm registration", "Best on uncoated", "Cloth-friendly"],
  },
  "soft-touch": {
    prose: [
      "A matte velvet film laminated to a printed sheet. Scratch-resistant, fingerprint-resistant, slightly silken under the fingertips. Reads as more expensive than the underlying stock — which is half the point.",
      "We laminate after offset printing, before the finishing line. Pairs with spot-UV (gloss-on-matte), foil, and emboss without complication. Soft-touch over a dark Pantone is a Huamei signature for cosmetic and skincare outers.",
      "Adds about ¥2.40 per unit at a 5k run. Lead time +2 days for the laminate cure. Not recommended on stocks under 250 gsm — the film stiffens the carton, which can over-stiffen a thin board.",
    ],
    pullQuote: "Reads as more expensive than the underlying stock — which is half the point.",
    meta: ["Matte velvet film", "+¥2.40/unit @ 5k", "≥ 250 gsm stock"],
  },
  "spot-uv": {
    prose: [
      "A gloss varnish printed in registered patterns over a matte field. The contrast is the subject: a pinstripe of gloss against soft-touch laminate, a wordmark sealed in clear over uncoated paper, a pattern that only catches the light from {em}one angle{/em}.",
      "We register spot-UV to ink and emboss at ±0.2 mm. Most common over soft-touch laminate, where the matte-and-gloss contrast is most pronounced; also used straight onto coated stock for a more subtle effect.",
      "Drawn at the artwork stage — the spot-UV file is a separate spot colour in the print PDF. We preview the gloss line on a sample sheet before going to production. Lead time +1 day.",
    ],
    pullQuote: "A pattern that only catches the light from one angle.",
    meta: ["±0.2 mm to ink", "Best over soft-touch", "+1 day lead"],
  },
  offset: {
    prose: [
      "Eight-colour Heidelberg XL 106, ISO 12647-2 colour-managed, ΔE ≤ 2. The press floor's main vehicle — every box that carries a printed graphic, a photograph, or a Pantone-matched brand colour passes through it. Plate-making is in-house; we cut new plates per job.",
      "Four colours are CMYK; the remaining four are reserved for Pantone spots, white, varnish, or speciality inks — metallic, soy, low-migration food-safe. We proof on contract paper at GMG-certified accuracy before press.",
      "Minimum 1,000 for offset; digital short-run fills below that. The press is most efficient at 5,000–80,000 units. Soy inks are house standard; petroleum on request only.",
    ],
    pullQuote: "ΔE ≤ 2 — the floor's hard ceiling on colour.",
    meta: ["8-col Heidelberg", "ΔE ≤ 2", "GMG contract proofs"],
  },
  wraps: {
    prose: [
      "The skin of a rigid box. Paper, cloth, or film glued to the chipboard core after the box is built and before the lid is fitted. We hold 80+ stocks on file from Gmund, Fedrigoni, Iris, and Wibalin — the four mills that have set the catalogue's tone since 1992.",
      "Paper wraps {em}mitre{/em} at the corners; cloth wraps cover the corners flat, with the weave running consistently across the lid and walls. Wibalin and Iris are book-cloth — they take emboss and foil cleanly. Gmund Colors Matt is our default cream.",
      "Selection is part of the early consultation. We post a swatch of every candidate in the first sample round — paper feels different in the hand than in a PDF.",
    ],
    pullQuote: "The skin of the box — chosen at the first conversation.",
    meta: ["80+ stocks", "Gmund · Fedrigoni · Iris", "Mitred corners"],
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
  },
};

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getTopic(category: TopicCategory, slug: string): Topic {
  const explicit = TOPICS[slug];
  if (explicit && explicit.category === category) {
    const dynamic = relatedFromVolumes(slug);
    return dynamic ? { ...explicit, related: dynamic } : explicit;
  }

  const meta = CATEGORY_META[category];
  const name = titleize(slug);
  const copy = TOPIC_COPY[slug];

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
  };
}
