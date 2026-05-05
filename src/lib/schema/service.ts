// Service schema for /craft/[slug] sub-pages. Each craft topic is a
// custom-quoted manufacturing capability — not a SKU product. Using
// schema.org/Service so Google does not flag the page for missing
// price / availability / aggregateRating, which it did for Product
// without rich-result-grade fields.
//
// Replaces the previous Product schema, which generated GSC rich-result
// errors on 2026-05-05 (Product snippets + Merchant listings critical
// issues for missing offers.price). See ADR 0006.

const SITE = "https://huamei.io" as const;

export function craftService(args: {
  slug: string;
  name: string;
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    ...(args.image
      ? { image: args.image.startsWith("http") ? args.image : `${SITE}${args.image}` }
      : {}),
    provider: { "@id": `${SITE}/#org` },
    serviceType: "Custom luxury packaging manufacturing",
    areaServed: { "@type": "Place", name: "Worldwide" },
    url: `${SITE}/craft/${args.slug}`,
  };
}
