import { VolumesCatalogue } from "@/components/VolumesCatalogue";
import { VOLUMES } from "@/lib/volumes";
import { getAllVolumes, getAllIndustries } from "@/lib/sanity/queries";
import "./volumes.css";

export const metadata = {
  title: "Case studies",
  description:
    "A running ledger of work. Every volume is a closed book; every drawer pulled left a record behind.",
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

  return <VolumesCatalogue volumes={volumes} industries={industries} />;
}
