import Link from "next/link";
import EquipmentCarousel from "@/components/EquipmentCarousel";
import HouseCta from "@/components/HouseCta";
import { EQUIPMENT } from "@/lib/equipment";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { videoObject } from "@/lib/schema/video";
import "../house.css";

export const metadata = {
  title: "Factory & floor — four press floors across China",
  description:
    "Press floors across Henan, Zhejiang, Sichuan and Guizhou — 22,000 m² of foil, emboss, deboss, lamination and finishing under one roof.",
  alternates: { canonical: "/house/factory" },
};

export default function FactoryPage() {
  return (
    <main className="hs-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "The House", path: "/house" },
          { name: "Factory", path: "/house/factory" },
        ])}
      />
      <JsonLd
        data={videoObject({
          id: "factory-floor",
          name: "Huamei factory floor — luxury rigid box production",
          description:
            "A 2-minute look at Huamei's press floor: Heidelberg and KBA offset presses, hot-foil stamping, registered emboss, hand-assembly. Four factories across Henan, Zhejiang, Sichuan and Guizhou — 22,000 m² of paper and ink, founded 1992.",
          thumbnailUrl: "/photos/factory-floor.jpg",
          uploadDate: "2026-05-02T18:12:00+08:00",
          contentUrl: "/video/factory-floor.mp4",
          embedPageUrl: "/house/factory",
          duration: "PT2M5S",
        })}
      />
      <header className="hs-subcover">
        <div className="kicker">
          <Link href="/house">← The House</Link>
        </div>
        <h1>
          The <em>factory &amp; floor.</em>
        </h1>
        <span className="cn">廠 · 房</span>
      </header>

      <div className="hs-section-head" id="factory">
        <h3>
          Huamei factory floor — <em>luxury rigid box production.</em>
        </h3>
        <span className="stamp">2 min &middot; press floor walkthrough</span>
      </div>
      <section className="hs-floor-video-section">
        <video
          src="/video/factory-floor.mp4"
          poster="/photos/factory-floor.jpg"
          controls
          muted
          playsInline
          preload="metadata"
          aria-label="Huamei factory floor"
          title="Huamei factory floor — luxury rigid box production"
        />
      </section>

      <section id="equipment">
        <div className="hs-section-head">
          <h3>
            The <em>register.</em>
          </h3>
          <span className="stamp">{EQUIPMENT.length} machines &middot; under one roof</span>
        </div>
        <EquipmentCarousel items={EQUIPMENT} />
      </section>

      <HouseCta
        heading={
          <>
            Put your next run on <em>this floor.</em>
          </>
        }
        sub="Heidelberg and KBA presses, finishing under one roof. Samples in 7 – 10 days, production in 15 – 20. MOQ 200+ pieces."
      />
    </main>
  );
}
