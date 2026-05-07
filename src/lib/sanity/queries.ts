import type { Volume } from "@/lib/volumes";
import { sanityClient } from "./client";
import { urlFor } from "./image";

type SanityImage = {
  asset: { _ref: string; _type: "reference" };
};

type RawCaseStudy = {
  _id: string;
  num: string;
  slug: { current: string };
  name: string;
  client: string;
  tag: string;
  year: number;
  section: "branded" | "dtc";
  featured?: boolean;
  industryTitle: string;
  cover: SanityImage | null;
  photos?: SanityImage[];
};

const FIELDS = `
  _id,
  num,
  slug,
  name,
  client,
  tag,
  year,
  section,
  featured,
  "industryTitle": industry->title,
  cover,
  photos
`;

const ALL_QUERY = `*[_type == "caseStudy"] | order(featured desc, year desc) { ${FIELDS} }`;
const BY_SLUG_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0] { ${FIELDS} }`;

const COVER_W = 1200;
const PHOTO_W = 1600;

function toVolume(c: RawCaseStudy): Volume {
  return {
    num: c.num,
    slug: c.slug.current,
    name: c.name,
    client: c.client,
    tag: c.tag,
    year: c.year,
    category: c.industryTitle,
    section: c.section,
    cover: c.cover ? urlFor(c.cover).width(COVER_W).quality(85).url() : "",
    photos: (c.photos ?? []).map((p) =>
      urlFor(p).width(PHOTO_W).quality(85).url()
    ),
    featured: c.featured ?? false,
  };
}

export async function getAllVolumes(): Promise<Volume[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  const rows = await sanityClient.fetch<RawCaseStudy[]>(
    ALL_QUERY,
    {},
    { next: { revalidate: 60, tags: ["caseStudy"] } }
  );
  return rows.map(toVolume);
}

export async function getVolumeBySlug(slug: string): Promise<Volume | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  const row = await sanityClient.fetch<RawCaseStudy | null>(
    BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 60, tags: ["caseStudy", `caseStudy:${slug}`] } }
  );
  return row ? toVolume(row) : null;
}

export async function getAllIndustries(): Promise<{ title: string; slug: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  return sanityClient.fetch(
    `*[_type == "industry"] | order(order asc, title asc) { title, "slug": slug.current }`,
    {},
    { next: { revalidate: 60, tags: ["industry"] } }
  );
}
