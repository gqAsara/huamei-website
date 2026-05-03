export type NavLink = {
  label: string;
  href: string;
  meta?: string;
  italic?: string;
};

export type NavColumn = {
  roman: string;
  heading: string;
  items: NavLink[];
};

export type NavFeature = {
  eyebrow: string;
  volume: string;
  image: string;
  title: string;
  italicTitle?: string;
  client: string;
  caption: string;
};

export type NavFoot = {
  meta: string;
  quote: string;
  linkLabel: string;
  linkHref: string;
};

export type NavCategory = {
  key: string;
  label: string;
  href?: string;
  width?: "default" | "wide" | "xwide";
  columns?: NavColumn[];
  feature?: NavFeature;
  foot?: NavFoot;
};

export const navCategories: NavCategory[] = [
  {
    key: "craft",
    label: "Craft",
    width: "xwide",
    columns: [
      {
        roman: "i.",
        heading: "By Structure",
        items: [
          { label: "Rigid & telescoping", href: "/craft/rigid", meta: "14" },
          { label: "Magnetic closure", href: "/craft/magnetic", meta: "11" },
          { label: "Drawer & slipcase", href: "/craft/drawer", meta: "9" },
          { label: "Folding cartons", href: "/craft/folding", meta: "22" },
          { label: "Book-style & clamshell", href: "/craft/book", meta: "7" },
          { label: "Inserts & cradles", href: "/craft/inserts", meta: "18" },
          { label: "Shoppers & carriers", href: "/craft/shoppers", meta: "12" },
        ],
      },
      {
        roman: "ii.",
        heading: "By Surface",
        items: [
          { label: "Hot-foil ", italic: "stamping", href: "/craft/hot-foil", meta: "Au · Cu · Ag" },
          { label: "Registered emboss", href: "/craft/emboss", meta: "—" },
          { label: "Debossing", href: "/craft/deboss", meta: "—" },
          { label: "Soft-touch laminate", href: "/craft/soft-touch", meta: "—" },
          { label: "Spot UV & varnish", href: "/craft/spot-uv", meta: "—" },
          { label: "Offset & Pantone", href: "/craft/offset", meta: "—" },
          { label: "Wrap papers & cloth", href: "/craft/wraps", meta: "Gmund" },
        ],
      },
    ],
    feature: {
      eyebrow: "Featured · Case I",
      volume: "Vol. I",
      image: "/photos/case-01-fragrance-souverain.jpg",
      title: "A perfume that earns the ",
      italicTitle: "sound",
      caption: "of its box.",
      client: "Souverain · Hot-foil · Rigid · Velvet",
    },
    foot: {
      meta: "Ninety-nine structures on file · 300 pcs min · 2 wk fastest",
      quote: "Corrections are free.",
      linkLabel: "See the Catalogue →",
      linkHref: "/craft",
    },
  },
  {
    key: "industry",
    label: "Industry",
    columns: [
      {
        roman: "i.",
        heading: "Categories we serve",
        items: [
          { label: "Cosmetic & skincare", href: "/industry/cosmetic", meta: "9" },
          { label: "Wine, spirits & tea", href: "/industry/spirits", meta: "14" },
          { label: "Seasonal & gifting", href: "/industry/seasonal", meta: "6" },
          { label: "Wellness", href: "/industry/wellness", meta: "2" },
        ],
      },
    ],
  },
  {
    key: "margin",
    label: "Blogs",
    href: "/margin",
  },
  {
    key: "house",
    label: "The House",
    columns: [
      {
        roman: "i.",
        heading: "Huamei 華美",
        items: [
          { label: "Our philosophy", href: "/house/philosophy", meta: "—" },
          { label: "The factory & floor", href: "/house/factory", meta: "22,000 m²" },
          { label: "Certifications", href: "/house/certifications", meta: "FSC · ISO · CE" },
          { label: "People", href: "/house/people", meta: "3,000+" },
          { label: "Contact", href: "/house#contact", meta: "—" },
        ],
      },
    ],
  },
  {
    key: "volumes",
    label: "Case studies",
    href: "/volumes",
  },
];
