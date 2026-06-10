import Link from "next/link";
import CertificationCarousel from "@/components/CertificationCarousel";
import HouseCta from "@/components/HouseCta";
import { CERTIFICATIONS } from "@/lib/certifications";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "../house.css";

export const metadata = {
  title: "Certifications — FSC, BSCI, SGS, CE, EQS, ISO 9001 / 14001 / 45001",
  description:
    "FSC, BSCI, SGS, CE, EQS and ISO 9001 / 14001 / 45001 — the audited standards behind every Huamei project, with a buyer-side decoder for EU and US procurement teams.",
  alternates: { canonical: "/house/certifications" },
};

type CertDecoder = {
  rn: string;
  short: string;
  long: string;
  body: string;
};

const CERT_DECODERS: CertDecoder[] = [
  {
    rn: "i.",
    short: "FSC",
    long: "Forest Stewardship Council — chain-of-custody",
    body:
      "Certifies that the paper and board on a Huamei project come from responsibly managed forests, with full chain-of-custody traceability. EU buyers routinely require FSC documentation on shipments; many US and Japanese retailers list it as a pre-condition for cosmetic and gifting cartons.",
  },
  {
    rn: "ii.",
    short: "BSCI",
    long: "Business Social Compliance Initiative (amfori)",
    body:
      "Audits worker rights, wages, working hours, and health-and-safety practices on the factory floor against the amfori code of conduct. EU and US procurement teams treat BSCI as a baseline social-responsibility check before placing an order — especially in cosmetics, retail private-label, and seasonal gifting.",
  },
  {
    rn: "iii.",
    short: "SGS",
    long: "SGS — third-party testing and inspection",
    body:
      "Independent verification by SGS, one of the world's largest inspection bodies. The presence of SGS audit reports signals that Huamei's quality and material claims are checked by a third party that international buyers already trust for product and supplier validation.",
  },
  {
    rn: "iv.",
    short: "CE",
    long: "CE — European Conformity (paper box & paper bag)",
    body:
      "Declares conformity with the EU health, safety, and environmental directives that apply to packaging products entering the European Economic Area. Huamei carries CE on both rigid box and shopper lines, which is what European retailers expect to see on customs and freight paperwork.",
  },
  {
    rn: "v.",
    short: "EQS",
    long: "EQS — environmental quality system",
    body:
      "An environmental-quality system audit that complements ISO 14001 with the additional documentation required for stricter EU markets. Useful for buyers whose sustainability teams need a second environmental evidence file beyond the ISO baseline.",
  },
  {
    rn: "vi.",
    short: "ISO 9001",
    long: "ISO 9001 — quality management system",
    body:
      "The international baseline for a documented quality management system: defined processes, traceable records, corrective action, continuous improvement. Audited annually across all four Huamei sites.",
  },
  {
    rn: "vii.",
    short: "ISO 14001",
    long: "ISO 14001 — environmental management system",
    body:
      "The international standard for an environmental management system: emissions, waste, water, energy, and supplier impact, all tracked and reviewed. The infrastructure layer behind Huamei's >80% solar and biomass-investment claims.",
  },
  {
    rn: "viii.",
    short: "ISO 45001",
    long: "ISO 45001 — occupational health and safety",
    body:
      "The international standard for occupational health and safety on the factory floor: hazard identification, risk control, worker participation, incident reporting. Complements BSCI's social-audit lens with an engineering-controls lens.",
  },
];

export default function CertificationsPage() {
  return (
    <main className="hs-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "The House", path: "/house" },
          { name: "Certifications", path: "/house/certifications" },
        ])}
      />
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
          14001 and 45001. Social compliance is audited under BSCI, with SGS
          third-party inspection on file and an EQS environmental layer for
          stricter EU buyers. Export-bound rigid box and shopper lines carry CE
          conformity. The licences below are the originals, on file and current.
        </p>
        <div className="cert-stamps">
          <span><em>i.</em> FSC C014233</span>
          <span><em>ii.</em> BSCI</span>
          <span><em>iii.</em> SGS audited</span>
          <span><em>iv.</em> CE — paper box &amp; bag</span>
          <span><em>v.</em> EQS</span>
          <span><em>vi.</em> ISO 9001</span>
          <span><em>vii.</em> ISO 14001</span>
          <span><em>viii.</em> ISO 45001</span>
        </div>
      </section>

      <section className="cert-decoder" aria-labelledby="cert-decoder-heading">
        <div className="cert-decoder-head">
          <div className="kicker">
            <span className="rn">ii.</span>W H A T &nbsp; E A C H ·  S T A N D A R D &nbsp; M E A N S
          </div>
          <h2 id="cert-decoder-heading">
            A <em>buyer-side</em> decoder.
          </h2>
          <p className="lede">
            What an EU or US procurement team actually reads when each of these
            certifications shows up on a supplier file. For deeper context on
            transit-grade testing and ESG infrastructure, see{" "}
            <Link href="/house/standards">the standards file</Link>.
          </p>
        </div>
        <dl className="cert-decoder-list">
          {CERT_DECODERS.map((c) => (
            <div className="cert-decoder-row" key={c.short} id={c.short.toLowerCase().replace(/\s+/g, "-")}>
              <dt>
                <span className="rn">{c.rn}</span>
                <span className="short">{c.short}</span>
                <span className="long">{c.long}</span>
              </dt>
              <dd>{c.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CertificationCarousel items={CERTIFICATIONS} />

      <HouseCta
        heading={
          <>
            A supplier file your <em>procurement team</em> can read tonight.
          </>
        }
        sub="FSC, BSCI, SGS, CE, EQS, ISO 9001 / 14001 / 45001 — scans available on request. Founder-led reply within 48 hours. MOQ 200+ pieces."
      />
    </main>
  );
}
