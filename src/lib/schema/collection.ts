const SITE = "https://huamei.io" as const;

export function craftItemList() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/craft#list`,
    name: "Huamei luxury packaging craft capabilities — structures, surfaces, materials",
    description:
      "99+ custom luxury packaging structures, 17 in-house foils, and 80 papers on file from Huamei. Covers rigid boxes, magnetic closures, drawer boxes, hot-foil stamping, emboss, deboss, soft-touch laminate, and specialty materials.",
    url: `${SITE}/craft`,
    numberOfItems: 21,
    itemListElement: [
      { "@type": "ListItem", position: 1,  name: "Rigid & telescoping boxes",        url: `${SITE}/craft/rigid` },
      { "@type": "ListItem", position: 2,  name: "Magnetic closure rigid boxes",     url: `${SITE}/craft/magnetic` },
      { "@type": "ListItem", position: 3,  name: "Drawer & slipcase boxes",          url: `${SITE}/craft/drawer` },
      { "@type": "ListItem", position: 4,  name: "Folding cartons",                  url: `${SITE}/craft/folding` },
      { "@type": "ListItem", position: 5,  name: "Book-style & clamshell boxes",     url: `${SITE}/craft/book` },
      { "@type": "ListItem", position: 6,  name: "Packaging inserts & cradles",      url: `${SITE}/craft/inserts` },
      { "@type": "ListItem", position: 7,  name: "Shoppers & carrier bags",          url: `${SITE}/craft/shoppers` },
      { "@type": "ListItem", position: 8,  name: "Bespoke packaging structures",     url: `${SITE}/craft/bespoke` },
      { "@type": "ListItem", position: 9,  name: "Hot-foil stamping",                url: `${SITE}/craft/hot-foil` },
      { "@type": "ListItem", position: 10, name: "Registered embossing",             url: `${SITE}/craft/emboss` },
      { "@type": "ListItem", position: 11, name: "Debossing",                        url: `${SITE}/craft/deboss` },
      { "@type": "ListItem", position: 12, name: "Soft-touch laminate",              url: `${SITE}/craft/soft-touch` },
      { "@type": "ListItem", position: 13, name: "Spot UV & varnish",                url: `${SITE}/craft/spot-uv` },
      { "@type": "ListItem", position: 14, name: "Offset & Pantone printing",        url: `${SITE}/craft/offset` },
      { "@type": "ListItem", position: 15, name: "Wrap papers & book-cloth",         url: `${SITE}/craft/wraps` },
      { "@type": "ListItem", position: 16, name: "Uncoated papers",                  url: `${SITE}/craft/uncoated` },
      { "@type": "ListItem", position: 17, name: "Coated art papers",                url: `${SITE}/craft/coated` },
      { "@type": "ListItem", position: 18, name: "Book-cloth & wraps",               url: `${SITE}/craft/cloth` },
      { "@type": "ListItem", position: 19, name: "Recycled & alt-fibre stocks",      url: `${SITE}/craft/recycled` },
      { "@type": "ListItem", position: 20, name: "Grey & chipboard",                 url: `${SITE}/craft/chipboard` },
      { "@type": "ListItem", position: 21, name: "Specialty stocks",                 url: `${SITE}/craft/specialty` },
    ],
  };
}

export function industryItemList() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/industry#list`,
    name: "Huamei luxury packaging by industry sector",
    description:
      "Custom luxury packaging for cosmetic & skincare, wine spirits & tea, seasonal gifting, and wellness brands. 26 projects on file. MOQ 200+, since 1992.",
    url: `${SITE}/industry`,
    numberOfItems: 4,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cosmetic & Skincare packaging",     url: `${SITE}/industry/cosmetic` },
      { "@type": "ListItem", position: 2, name: "Wine, Spirits & Tea packaging",     url: `${SITE}/industry/spirits` },
      { "@type": "ListItem", position: 3, name: "Seasonal & Gifting packaging",      url: `${SITE}/industry/seasonal` },
      { "@type": "ListItem", position: 4, name: "Wellness packaging",                url: `${SITE}/industry/wellness` },
    ],
  };
}
