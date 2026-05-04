import Link from "next/link";
import EquipmentCarousel from "@/components/EquipmentCarousel";
import { EQUIPMENT } from "@/lib/equipment";
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
      <header className="hs-subcover">
        <div className="kicker">
          <Link href="/house">← The House</Link>
        </div>
        <h1>
          The <em>factory &amp; floor.</em>
        </h1>
        <span className="cn">廠 · 房</span>
      </header>

      <section className="hs-floor-video-section" id="factory">
        <video
          src="/video/factory-floor.mp4"
          poster="/photos/factory-floor.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Huamei factory floor"
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
    </main>
  );
}
