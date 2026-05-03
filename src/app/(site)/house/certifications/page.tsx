import Link from "next/link";
import CertificationCarousel from "@/components/CertificationCarousel";
import { CERTIFICATIONS } from "@/lib/certifications";
import "../house.css";

export const metadata = {
  title: "Certifications · Huamei",
  description:
    "FSC, ISO 9001, ISO 14001, ISO 45001 and CE — the audited standards behind every Huamei project. Producing worldwide, sustainably, at the highest standards.",
};

export default function CertificationsPage() {
  return (
    <main className="hs-wrap">
      <header className="hs-subcover">
        <div className="kicker">
          <Link href="/house">← The House</Link>
        </div>
        <h1>
          <em>Certifications.</em>
        </h1>
        <span className="cn">證 · 書</span>
      </header>

      <section className="cert-intro">
        <p>
          Huamei produces for clients on <em>four continents,</em> shipping into
          markets that audit packaging the way they audit the product inside it.
          Every press floor, every reel of board, every drum of foil is held to a
          standard that is recognised in Europe, North America and the Pacific —
          and proven on paper.
        </p>
        <p>
          Our paper is FSC chain-of-custody certified. Our quality, environmental,
          and occupational-safety systems are audited annually under ISO 9001,
          14001 and 45001. Export-bound rigid box and shopper lines carry CE
          conformity. The licences below are the originals, on file and current.
        </p>
        <div className="cert-stamps">
          <span><em>i.</em> FSC C014233</span>
          <span><em>ii.</em> ISO 9001</span>
          <span><em>iii.</em> ISO 14001</span>
          <span><em>iv.</em> ISO 45001</span>
          <span><em>v.</em> CE — paper box &amp; bag</span>
          <span><em>vi.</em> SGS audited</span>
        </div>
      </section>

      <CertificationCarousel items={CERTIFICATIONS} />
    </main>
  );
}
