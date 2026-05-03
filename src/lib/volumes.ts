export type Volume = {
  num: string;
  slug: string;
  name: string;
  client: string;
  tag: string;
  year: number;
  category: string;
  section: "branded" | "dtc";
  cover: string;
  photos: string[];
  featured?: boolean;
};

const photoset = (slug: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/photos/cases/${slug}/${String(i + 1).padStart(2, "0")}.jpg`);

export const VOLUMES: Volume[] = [
  // ── DTC Brand (newest first) ──
  { num: "XXXI", slug: "pink-food-sleeve",  name: "Pink Food Sleeve",      client: "House design",       tag: "Gifting · Hot pink food sleeve",     year: 2025, category: "Gifting",   section: "dtc",     cover: "/photos/cases/pink-food-sleeve/01.jpg",  photos: photoset("pink-food-sleeve", 4), featured: true },
  { num: "XXX",   slug: "man-made-crayon",   name: "Man Made Crayon",       client: "Man Made Crayon",    tag: "Gifting · Kraft puzzle book-style",  year: 2025, category: "Gifting",   section: "dtc",     cover: "/photos/cases/man-made-crayon/01.jpg",   photos: photoset("man-made-crayon", 5), featured: true },
  { num: "XXIX",  slug: "glees-grove",       name: "Glees Grove Soaps",     client: "Glees Grove",        tag: "Wellness · Floral folding carton",   year: 2025, category: "Wellness",  section: "dtc",     cover: "/photos/cases/glees-grove/01.jpg",       photos: photoset("glees-grove", 2), featured: true },
  { num: "XXVIII",slug: "heritage-tea",      name: "Heritage Tea",          client: "DEEPURE",            tag: "Tea · Red + gold-foil leaf",         year: 2025, category: "Tea",       section: "dtc",     cover: "/photos/cases/heritage-tea/01.jpg",      photos: photoset("heritage-tea", 2) },
  { num: "XXVII", slug: "red-ribbon-shopper",name: "Red Ribbon Shopper",    client: "House design",       tag: "Gifting · Wide ribbon shopper",      year: 2024, category: "Gifting",   section: "dtc",     cover: "/photos/cases/red-ribbon-shopper/01.jpg",photos: photoset("red-ribbon-shopper", 2) },
  { num: "XXVI",  slug: "black-corded",      name: "Black Corded Shopper",  client: "House design",       tag: "Gifting · Tall corded carrier",      year: 2024, category: "Gifting",   section: "dtc",     cover: "/photos/cases/black-corded/01.jpg",      photos: photoset("black-corded", 2) },
  { num: "XXV",   slug: "heart-window",      name: "Double-Heart Window",   client: "DTC client",     tag: "Cosmetics · Heart-shape window",     year: 2024, category: "Cosmetics", section: "dtc",     cover: "/photos/cases/heart-window/01.jpg",      photos: photoset("heart-window", 2) },
  { num: "XXIV",  slug: "lavender-orchid",   name: "Lavender Orchid",       client: "DTC client",     tag: "Cosmetics · Orchid foil",            year: 2025, category: "Cosmetics", section: "dtc",     cover: "/photos/cases/lavender-orchid/01.jpg",   photos: photoset("lavender-orchid", 2) },
  { num: "XXIII", slug: "heigouqi",          name: "Wild Black Berry",      client: "DTC · Wellness",     tag: "Wellness · Sleeve + tray",           year: 2025, category: "Wellness",  section: "dtc",     cover: "/photos/cases/heigouqi/01.jpg",          photos: photoset("heigouqi", 2) },
  { num: "XXII",  slug: "mustard-deco",      name: "Mustard Deco",          client: "Studio client",  tag: "Gifting · Deco line-art",            year: 2025, category: "Gifting",   section: "dtc",     cover: "/photos/cases/mustard-deco/01.jpg",      photos: photoset("mustard-deco", 2) },
  { num: "XXI",   slug: "cobalt-drum",       name: "Cobalt Drum",           client: "House design",       tag: "Spirits · Bespoke leather drum",     year: 2024, category: "Spirits",   section: "dtc",     cover: "/photos/cases/cobalt-drum/01.jpg",       photos: photoset("cobalt-drum", 3) },
  { num: "XX",    slug: "oriental-memoirs",  name: "Oriental Memoirs",      client: "DTC client",     tag: "Gifting · Drawer + laser-cut",       year: 2024, category: "Gifting",   section: "dtc",     cover: "/photos/cases/oriental-memoirs/01.jpg",  photos: photoset("oriental-memoirs", 3) },

  // ── Branded clients (newest first) ──
  { num: "XIX",   slug: "yangshao",          name: "Yangshao Caitao",       client: "Yangshao",           tag: "Spirits · Bottle-silhouette deboss", year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/yangshao/01.jpg",          photos: photoset("yangshao", 2), featured: true },
  { num: "XVIII", slug: "wuliangye-clamshell",name: "Wuliangye Premium Brew",client: "Wuliangye",         tag: "Spirits · Glass-lined clamshell",    year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/wuliangye-clamshell/01.jpg",photos: photoset("wuliangye-clamshell", 2) },
  { num: "XVII",  slug: "taozui-9",          name: "Taozui 9",              client: "Taozui",             tag: "Spirits · Ceramic + cloud foil",     year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/taozui-9/01.jpg",          photos: photoset("taozui-9", 2) },
  { num: "XVI",   slug: "hetaowang",         name: "Hetao Wang",            client: "Hetao Wang",         tag: "Spirits · Open-face emerald rigid",  year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/hetaowang/01.jpg",         photos: photoset("hetaowang", 2) },
  { num: "XV",    slug: "shede-6",           name: "Shede 6",               client: "Shede",              tag: "Spirits · Maroon + cream rigid",     year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/shede-6/01.jpg",           photos: photoset("shede-6", 2) },
  { num: "XIV",   slug: "wuliangye-68",      name: "Wuliangye 68",          client: "Wuliangye",          tag: "Spirits · Red + gold rigid",         year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/wuliangye-68/01.jpg",      photos: photoset("wuliangye-68", 2) },
  { num: "XIII",  slug: "danquan-cave",      name: "Danquan Cave-aged",     client: "Danquan",            tag: "Spirits · Blue book-style",          year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/danquan-cave/01.jpg",      photos: photoset("danquan-cave", 2) },
  { num: "XII",   slug: "zhonghua-dragon",   name: "Zhonghua Dragon",       client: "Zhonghua",           tag: "Spirits · Red dragon w/ medallion",  year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/zhonghua-dragon/01.jpg",   photos: photoset("zhonghua-dragon", 2) },
  { num: "XI",    slug: "tianamen-jiu",      name: "Tian An Men Jiu",       client: "Tian An Men Jiu",    tag: "Spirits · Rigid book-style",         year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/tianamen-jiu/01.jpg",      photos: photoset("tianamen-jiu", 2) },
  { num: "X",     slug: "t2-tea",            name: "T2 True Brews",         client: "T2 True Brews",      tag: "Tea · Multi-color sleeve",           year: 2024, category: "Tea",       section: "branded", cover: "/photos/cases/t2-tea/01.jpg",            photos: photoset("t2-tea", 2) },
  { num: "IX",    slug: "collgene",          name: "Collgene",              client: "Collgene",           tag: "Skincare · Tuck-end carton",         year: 2025, category: "Skincare",  section: "branded", cover: "/photos/cases/collgene/01.jpg",          photos: photoset("collgene", 3) },
  { num: "VIII",  slug: "kefumei",           name: "Kefumei",               client: "Kefumei",            tag: "Skincare · Mass + premium SKU",      year: 2025, category: "Skincare",  section: "branded", cover: "/photos/cases/kefumei/01.jpg",           photos: photoset("kefumei", 3) },
  { num: "VII",   slug: "lancome-cny",       name: "Lancôme CNY",            client: "Lancôme Paris",       tag: "Cosmetics · Magnetic flap",          year: 2025, category: "Cosmetics", section: "branded", cover: "/photos/cases/lancome-cny/01.jpg",       photos: photoset("lancome-cny", 3), featured: true },
  { num: "VI",    slug: "lancome-1111",      name: "Lancôme × 11.11",        client: "Lancôme × Tmall",     tag: "Cosmetics · Kite collab",            year: 2024, category: "Cosmetics", section: "branded", cover: "/photos/cases/lancome-1111/01.jpg",      photos: photoset("lancome-1111", 4) },
  { num: "V",     slug: "lancome-love",      name: "Lancôme Love",           client: "Lancôme Paris",       tag: "Cosmetics · Heart-shape rigid",      year: 2025, category: "Cosmetics", section: "branded", cover: "/photos/cases/lancome-love/01.jpg",      photos: photoset("lancome-love", 2) },
  { num: "IV",    slug: "estee-holiday",     name: "Estée Lauder Holiday",  client: "Estée Lauder",       tag: "Cosmetics · Watercolor + starfield", year: 2024, category: "Cosmetics", section: "branded", cover: "/photos/cases/estee-holiday/01.jpg",     photos: photoset("estee-holiday", 4), featured: true },
  { num: "III",   slug: "loreal-gem",        name: "L'Oréal Gem",           client: "L'Oréal Paris",       tag: "Cosmetics · Faceted gold gem",       year: 2024, category: "Cosmetics", section: "branded", cover: "/photos/cases/loreal-gem/01.jpg",        photos: photoset("loreal-gem", 2), featured: true },
  { num: "II",    slug: "hongxing",          name: "Hongxing Erguotou",     client: "Red Star Erguotou",  tag: "Spirits · Imperial yellow",          year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/hongxing/01.jpg",          photos: photoset("hongxing", 2) },
  { num: "I",     slug: "dukang",            name: "Dukang",                client: "Luoyang Dukang",     tag: "Spirits · Octagonal theatre",        year: 2024, category: "Spirits",   section: "branded", cover: "/photos/cases/dukang/01.jpg",            photos: photoset("dukang", 3), featured: true },
];
