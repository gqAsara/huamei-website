import { VolumesCatalogue } from "@/components/VolumesCatalogue";
import { VOLUMES } from "@/lib/volumes";
import { getAllVolumes, getAllIndustries } from "@/lib/sanity/queries";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "./volumes.css";

const SITE = "https://huamei.io";

export const metadata = {
  title: "Luxury packaging case studies — 26 projects on file",
  description:
    "Case studies from Huamei's press floor: Wuliangye, Yangshao, Dukang, Collgene, Kefumei, and more. Filterable by year, industry, and view. Cosmetic, spirits, gifting, wellness — since 1992.",
  alternates: { canonical: "/volumes" },
};

const FALLBACK_INDUSTRIES = [
  "Cosmetics",
  "Skincare",
  "Spirits",
  "Tea",
  "Wellness",
  "Gifting",
];

export default async function VolumesPage() {
  // Fetch from Sanity; fall back to the static volumes.ts during the migration
  // window or if the CMS is misconfigured. Building the page should never fail
  // because of CMS state.
  const [sanityVolumes, sanityIndustries] = await Promise.all([
    getAllVolumes(),
    getAllIndustries(),
  ]);

  const volumes = sanityVolumes.length > 0 ? sanityVolumes : VOLUMES;
  const industries =
    sanityIndustries.length > 0
      ? sanityIndustries.map((i) => i.title)
      : FALLBACK_INDUSTRIES;

  const collectionGraph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE}/volumes#collection`,
    name: "Luxury packaging case studies — Huamei volumes archive",
    description:
      "Selected case studies from the Huamei press floor across cosmetics, spirits, tea, wellness, and gifting categories.",
    url: `${SITE}/volumes`,
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: volumes.length,
      itemListElement: volumes.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/volumes/${v.slug}`,
        name: v.name,
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/volumes" },
        ])}
      />
      <JsonLd data={collectionGraph} />
      <VolumesCatalogue volumes={volumes} industries={industries} />
    </>
  );
}
