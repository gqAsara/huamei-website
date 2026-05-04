// Product schema for /craft/[slug] sub-pages. Each craft topic is
// a made-to-order service; we use Product + Offer with
// availability: MadeToOrder and no fixed price.
//
// Per playbook §6.3 and ADR 0003 (no zh-Hans yet, so no inLanguage
// alternates here).

const SITE = "https://huamei.io" as const;

export function craftProduct(args: {
  slug: string;
  name: string;
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    ...(args.image ? { image: args.image.startsWith("http") ? args.image : `${SITE}${args.image}` } : {}),
    brand: { "@id": `${SITE}/#org` },
    manufacturer: { "@id": `${SITE}/#org` },
    category: "Custom Luxury Packaging",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/MadeToOrder",
      seller: { "@id": `${SITE}/#org` },
      url: `${SITE}/begin`,
    },
  };
}
