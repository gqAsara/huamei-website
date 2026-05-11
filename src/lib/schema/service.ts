// Service schema for /craft/[slug] + /volumes/[slug] sub-pages. Each
// page is a custom-quoted manufacturing capability or a delivered project
// — not a SKU product. Using schema.org/Service so Google doesn't flag
// the page for missing price / availability / aggregateRating, which it
// did when these were emitted as Product (see ADR 0006).

const SITE = "https://huamei.io" as const;

function imageUrl(image: string): string {
  return image.startsWith("http") ? image : `${SITE}${image}`;
}

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
    ...(args.image ? { image: imageUrl(args.image) } : {}),
    provider: { "@id": `${SITE}/#org` },
    serviceType: "Custom luxury packaging manufacturing",
    areaServed: { "@type": "Place", name: "Worldwide" },
    url: `${SITE}/craft/${args.slug}`,
  };
}

/**
 * Industry-sector Service schema. Mirrors craftService — each /industry
 * page represents a sector-targeted manufacturing offering.
 */
export function industryService(args: {
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
    ...(args.image ? { image: imageUrl(args.image) } : {}),
    provider: { "@id": `${SITE}/#org` },
    serviceType: "Custom luxury packaging manufacturing",
    areaServed: { "@type": "Place", name: "Worldwide" },
    category: args.name,
    url: `${SITE}/industry/${args.slug}`,
  };
}

/**
 * Case study Service schema. Adds delivery-date hints (year) so Google
 * can place the project in time, and category metadata so it's
 * indexable as a portfolio entry.
 */
export function caseStudyService(args: {
  slug: string;
  name: string;
  client: string;
  tag: string;
  year: number;
  category: string;
  cover?: string;
  photos?: string[];
}) {
  const images = [args.cover, ...(args.photos ?? [])]
    .filter((u): u is string => Boolean(u))
    .map(imageUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: `${args.tag} — produced by Huamei for ${args.client}, ${args.year}.`,
    ...(images.length ? { image: images } : {}),
    provider: { "@id": `${SITE}/#org` },
    serviceType: "Custom luxury packaging manufacturing",
    category: args.category,
    areaServed: { "@type": "Place", name: "Worldwide" },
    url: `${SITE}/volumes/${args.slug}`,
  };
}
