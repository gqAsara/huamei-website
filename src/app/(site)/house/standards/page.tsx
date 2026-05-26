import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "../house.css";
import "./standards.css";

const SITE = "https://huamei.io" as const;
const PAGE_URL = `${SITE}/house/standards`;
const PUBLISHED = "2026-05-26";
const UPDATED = "2026-05-26";

export const metadata = {
  title:
    "International standards & sustainable supply chain — Huamei",
  description:
    "Over 80% solar power. Transit-grade testing at 50 °C and -30 °C, 24-hour vibration, drop, aging, empty-box compression. BSCI, CE, EQS, FSC, SGS, ISO 9001 / 14001 / 45001 on file.",
  alternates: { canonical: "/house/standards" },
  openGraph: {
    title:
      "International standards & sustainable supply chain — Huamei 華美",
    description:
      "Huamei's green-energy, transit-grade and international certification posture for US and EU procurement audits.",
    url: PAGE_URL,
    type: "article",
  },
};

type TestRow = {
  id: string;
  name: string;
  threshold: string;
  simulates: string;
  prevents: string;
};

const TESTS: TestRow[] = [
  {
    id: "temperature",
    name: "Temperature — high / low environmental",
    threshold: "+50 °C high, -30 °C low",
    simulates:
      "Sea-freight container exposure under sun, cold-chain and high-latitude transit, seasonal storage swings.",
    prevents:
      "Adhesive failure, lamination curl, foil migration, and ink shift between the press floor and the buyer's shelf.",
  },
  {
    id: "vibration",
    name: "Transit vibration — 24-hour simulation",
    threshold: "24 hours continuous",
    simulates:
      "Long-haul truck, ocean and rail vibration, repeated handling, stacked-pallet friction in transit.",
    prevents:
      "Scuffing, foil rub-off, edge wear, and structural loosening over multi-leg international shipments.",
  },
  {
    id: "drop",
    name: "Drop test",
    threshold: "Multi-edge, multi-corner drop sequence",
    simulates:
      "Forklift, last-mile and unboxing impacts a rigid carton meets in real distribution.",
    prevents:
      "Crushed corners, broken hinges, and magnet displacement that turn a luxury reveal into a return.",
  },
  {
    id: "aging",
    name: "Aging — colour, structure, surface",
    threshold: "Accelerated aging under controlled humidity and UV",
    simulates:
      "The full storage-and-shelf window for gifting, seasonal and limited-edition packaging.",
    prevents:
      "Yellowed paper, faded foil, delaminated film, and softened greyboard on packs that sit before they sell.",
  },
  {
    id: "compression",
    name: "Empty-box compression",
    threshold: "Static stacking load to failure",
    simulates:
      "Warehouse stacking, container stowage, and long-haul pallet loads on empty rigid boxes.",
    prevents:
      "Deformed walls, collapsed lids, and out-of-square boxes after weeks under their own carton stack.",
  },
];

type Cert = {
  id: string;
  name: string;
  full: string;
  body: string;
  bodyUrl: string;
  about: string;
  buyer: string;
};

const CERTS: Cert[] = [
  {
    id: "fsc",
    name: "FSC",
    full: "FSC Chain-of-Custody Certification",
    body: "Forest Stewardship Council",
    bodyUrl: "https://fsc.org",
    about: "Sustainable forestry",
    buyer:
      "Proves paper and board come from responsibly managed forests. Required by EU and North-American beauty, spirits and wellness brands operating an FSC-only paper policy.",
  },
  {
    id: "bsci",
    name: "BSCI",
    full: "amfori BSCI — Business Social Compliance Initiative",
    body: "amfori",
    bodyUrl: "https://www.amfori.org/en/solutions/social/about-bsci",
    about: "Social responsibility, labour, ethics",
    buyer:
      "Audited social-compliance standard covering working hours, wages, health and safety. The default social-audit framework for many EU procurement teams.",
  },
  {
    id: "sgs",
    name: "SGS",
    full: "SGS — third-party inspection and testing",
    body: "SGS S.A.",
    bodyUrl: "https://www.sgs.com",
    about: "Quality inspection and material testing",
    buyer:
      "Independent inspection of production, packaging and materials. Carries weight in buyer-side QA reports when shipping into the US, EU and Japan.",
  },
  {
    id: "ce",
    name: "CE",
    full: "CE — European Conformity, paper box and paper bag",
    body: "European Economic Area notified bodies",
    bodyUrl: "https://ec.europa.eu/growth/single-market/ce-marking_en",
    about: "Conformity for the European single market",
    buyer:
      "Covers Huamei's rigid box and shopper lines as exported into the European single market. Streamlines customs and retailer onboarding in EU markets.",
  },
  {
    id: "eqs",
    name: "EQS",
    full: "EQS — environmental and quality system audit",
    body: "Issuing body on file",
    bodyUrl: "https://huamei.io/house/certifications",
    about: "Environmental and quality management",
    buyer:
      "Buyer-facing evidence that the press floors are audited beyond ISO baseline for environmental and quality system rigour.",
  },
  {
    id: "iso-9001",
    name: "ISO 9001",
    full: "ISO 9001 — Quality Management Systems",
    body: "International Organization for Standardization",
    bodyUrl: "https://www.iso.org/iso-9001-quality-management.html",
    about: "Quality management",
    buyer:
      "The global default for quality-management system audits. Annually renewed across all four Huamei sites.",
  },
  {
    id: "iso-14001",
    name: "ISO 14001",
    full: "ISO 14001 — Environmental Management Systems",
    body: "International Organization for Standardization",
    bodyUrl: "https://www.iso.org/iso-14001-environmental-management.html",
    about: "Environmental management",
    buyer:
      "Documents how the factories track, reduce and report environmental impact. Pairs with the green-energy posture for ESG due-diligence questionnaires.",
  },
  {
    id: "iso-45001",
    name: "ISO 45001",
    full: "ISO 45001 — Occupational Health and Safety",
    body: "International Organization for Standardization",
    bodyUrl: "https://www.iso.org/iso-45001-occupational-health-and-safety.html",
    about: "Occupational health and safety",
    buyer:
      "Covers worker health and safety on the press floors. Together with BSCI it forms the social-audit pair most US and EU buyers expect.",
  },
];

function certUrl(id: string) {
  return `${PAGE_URL}#${id}`;
}

function buildSchemaGraph() {
  const certNodes = CERTS.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    "@id": certUrl(c.id),
    name: c.full,
    credentialCategory: "certificate",
    recognizedBy: {
      "@type": "Organization",
      name: c.body,
      url: c.bodyUrl,
    },
    about: c.about,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#page`,
        url: PAGE_URL,
        name: "International standards & sustainable supply chain — Huamei",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#org` },
        datePublished: PUBLISHED,
        dateModified: UPDATED,
        inLanguage: "en",
        description:
          "Huamei's green-energy, transit-grade testing, and international certification posture for US and EU procurement audits.",
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "Custom luxury packaging with international supply-chain readiness",
        description:
          "Custom rigid box, magnetic closure, hot-foil and folding-carton manufacturing held to international transit-grade testing and audited under BSCI, CE, EQS, FSC, SGS and ISO 9001 / 14001 / 45001.",
        provider: { "@id": `${SITE}/#org` },
        serviceType:
          "Custom luxury packaging with international supply-chain readiness",
        areaServed: { "@type": "Place", name: "Worldwide" },
        url: PAGE_URL,
        hasCredential: CERTS.map((c) => ({ "@id": certUrl(c.id) })),
      },
      ...certNodes,
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        hasCredential: CERTS.map((c) => ({ "@id": certUrl(c.id) })),
      },
    ],
  } as const;
}

const SCHEMA_GRAPH = buildSchemaGraph();

export default function StandardsPage() {
  return (
    <main className="hs-wrap st-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "The House", path: "/house" },
          { name: "Standards", path: "/house/standards" },
        ])}
      />
      <JsonLd data={SCHEMA_GRAPH} />

      <header className="hs-subcover">
        <div className="kicker">
          <Link href="/house">← The House</Link>
        </div>
        <h1>
          International <em>standards.</em>
        </h1>
        <span className="cn">標 · 準</span>
      </header>

      <section className="st-lede">
        <p className="byline">
          By Sonia Sun, Founder, Huamei 華美 — since 1992. Published 26 May 2026.
          Updated 26 May 2026.
        </p>
        <p className="lede-q">
          What standards does Huamei meet for international packaging buyers?
        </p>
        <p className="lede-a">
          Huamei runs four press floors on{" "}
          <em>over 80% solar energy</em>, tests every export-grade pack at
          +50 °C and -30 °C with 24-hour transit-vibration, drop, aging and
          empty-box compression, and holds BSCI, CE, EQS, FSC, SGS and ISO 9001
          / 14001 / 45001 on file — the audit posture US and EU procurement
          teams ask for.
        </p>
        <p className="lede-bio">
          Sonia Sun has run the Huamei press floor since founding the company
          in 1992 — more than three decades on the same craft. The standards on
          this page are the international upgrade of that work: same factories,
          audited under the frameworks global buyers actually procure against.
        </p>
      </section>

      {/* Section 1 — sustainability */}
      <div className="hs-section-head" id="sustainability">
        <h3>
          How Huamei powers its <em>press floors.</em>
        </h3>
        <span className="stamp">i · 綠 能</span>
      </div>
      <section className="st-section">
        <p className="st-answer">
          Over 80% of Huamei&rsquo;s factory energy comes from solar
          generation across the four press floors in Henan, Zhejiang, Sichuan
          and Guizhou. The company&rsquo;s shareholders hold long-term
          investments in biomass renewable-energy power plants and hydro
          generation — Huamei&rsquo;s green-energy posture extends past the
          roof of the factory.
        </p>
        <p>
          Traditional Chinese rigid-box manufacture is energy-heavy: offset
          presses, foil heads, lamination towers and finishing lines all draw
          serious load. Pushing that load onto solar lowers carbon per pack and
          aligns the supply chain with the ESG questionnaires that European
          and North-American beauty, spirits and wellness brands now send
          before they will quote.
        </p>
        <p>
          The shareholder stake in biomass and hydro is not decoration. It
          signals the company&rsquo;s long-term view on energy and supply-chain
          responsibility — the kind of evidence procurement teams look for
          when they are picking a partner, not a vendor. For the buyer-facing
          framing on Pillar 3, see{" "}
          <Link href="/blogs/sustainable-luxury-packaging-manufacturer">
            sustainable luxury packaging manufacturer
          </Link>
          .
        </p>
        <ul className="st-facts">
          <li>
            <span className="n">&gt;80%</span>
            <span className="l">Solar energy share</span>
            <span className="s">Across the four press floors.</span>
          </li>
          <li>
            <span className="n">Biomass</span>
            <span className="l">Shareholder investment</span>
            <span className="s">Long-term renewable-energy holdings.</span>
          </li>
          <li>
            <span className="n">Hydro</span>
            <span className="l">Shareholder investment</span>
            <span className="s">
              Diversifies the renewables portfolio beyond solar.
            </span>
          </li>
          <li>
            <span className="n">ESG</span>
            <span className="l">Posture</span>
            <span className="s">
              Built to answer EU and US procurement questionnaires.
            </span>
          </li>
        </ul>
      </section>

      {/* Section 2 — transit-grade testing */}
      <div className="hs-section-head" id="testing">
        <h3>
          Tested for the journey, not the <em>factory door.</em>
        </h3>
        <span className="stamp">ii · 運 輸 測 試</span>
      </div>
      <section className="st-section">
        <p className="st-answer">
          Transit-grade means a pack that leaves Huamei must still meet
          specification at +50 °C in a sea-freight container, at -30 °C in
          high-latitude transit, after 24 hours of continuous vibration, after
          drop and aging cycles, and under empty-box compression in a stacked
          warehouse. Most factories test for the floor; we test for the
          journey.
        </p>
        <p>
          The five tests below are run on the export-grade lines and recorded
          before a run ships. They are the engineering side of the same
          promise the homepage makes — &ldquo;from sketch to sealed crate.&rdquo;
          For deeper coverage of what each test prevents, see{" "}
          <Link href="/blogs/transit-grade-testing-for-luxury-packaging">
            transit-grade testing for luxury packaging
          </Link>
          .
        </p>

        <div className="st-tests" role="table" aria-label="Transit-grade test matrix">
          <div className="st-tests-head" role="row">
            <span role="columnheader">Test</span>
            <span role="columnheader">Threshold</span>
            <span role="columnheader">What it simulates</span>
            <span role="columnheader">What it prevents</span>
          </div>
          {TESTS.map((t) => (
            <div key={t.id} className="st-test-row" role="row" id={t.id}>
              <span role="cell" className="st-test-name">{t.name}</span>
              <span role="cell" className="st-test-th">{t.threshold}</span>
              <span role="cell" className="st-test-sim">{t.simulates}</span>
              <span role="cell" className="st-test-prev">{t.prevents}</span>
            </div>
          ))}
        </div>

        <p className="st-pull">
          &ldquo;The standard is that a Huamei pack reaches the buyer in the
          same condition it left the floor — through containers, climates and
          carriers.&rdquo;
        </p>
      </section>

      {/* Section 3 — international certifications */}
      <div className="hs-section-head" id="certifications">
        <h3>
          Audits the world&rsquo;s buyers <em>actually accept.</em>
        </h3>
        <span className="stamp">iii · 國際認證</span>
      </div>
      <section className="st-section">
        <p className="st-answer">
          Huamei holds BSCI, CE, EQS, FSC and SGS alongside ISO 9001, ISO 14001
          and ISO 45001 — the eight credentials that, taken together, cover
          quality, environment, occupational safety, social compliance, paper
          sourcing, third-party inspection and the European single market.
          Originals are filed at <Link href="/house/certifications">/house/certifications</Link>.
        </p>

        <div className="st-certs">
          {CERTS.map((c) => (
            <article key={c.id} id={c.id} className="st-cert">
              <header>
                <h4>{c.name}</h4>
                <span className="st-cert-full">{c.full}</span>
              </header>
              <dl>
                <dt>Issuing body</dt>
                <dd>
                  <a href={c.bodyUrl} target="_blank" rel="noopener">
                    {c.body}
                  </a>
                </dd>
                <dt>Certifies</dt>
                <dd>{c.about}</dd>
                <dt>Why a buyer cares</dt>
                <dd>{c.buyer}</dd>
              </dl>
            </article>
          ))}
        </div>

        <p className="st-foot-link">
          The five additional cert scans on file — business licence, printing
          licence, bank-account licence, ISO authorisation and CE authorisation
          — sit in the audited{" "}
          <Link href="/house/certifications">certification archive</Link>.
        </p>
      </section>

      {/* Section 4 — what this means for buyers */}
      <div className="hs-section-head" id="buyers">
        <h3>
          What this means for an <em>international buyer.</em>
        </h3>
        <span className="stamp">iv · 對 買 家</span>
      </div>
      <section className="st-section">
        <p className="st-answer">
          For a US or EU procurement team, the combination of green energy,
          transit-grade testing and international certifications turns Huamei
          from a contract manufacturer into a supply-chain partner — one that
          answers the audit before it is asked, and that can carry a brand&rsquo;s
          risk through customs, shelf life and reputational scrutiny.
        </p>
        <ul className="st-buyer">
          <li>
            <strong>Stability.</strong> Four press floors across four provinces
            since 1992 — the company does not depend on a single roof, a
            single grid, or a single shift.
          </li>
          <li>
            <strong>ESG-ready.</strong> Over 80% solar plus shareholder
            biomass and hydro investment gives procurement a real answer to
            scope-2 and scope-3 questions, not a sustainability slogan.
          </li>
          <li>
            <strong>Global-shipping reliability.</strong> Transit-grade testing
            at +50 °C / -30 °C, 24-hour vibration, drop, aging and empty-box
            compression means packs arrive in spec across sea, rail and air.
          </li>
          <li>
            <strong>EU and US audit-readiness.</strong> BSCI covers the social
            audit, FSC the paper audit, CE the European market audit, SGS the
            inspection trail, and ISO 9001 / 14001 / 45001 the system audits.
          </li>
          <li>
            <strong>Long-term partnership risk.</strong> Three decades of
            uninterrupted operation, named press operators on{" "}
            <Link href="/house/people">/house/people</Link>, and disclosed
            province-level locations on{" "}
            <Link href="/house/about">/house/about</Link>.
          </li>
          <li>
            <strong>Brand-risk-bearing capacity.</strong> The combination of
            transit testing and certifications lets a brand commit a hero SKU
            to Huamei without absorbing the customs, lamination-failure or
            social-audit downside themselves.
          </li>
          <li>
            <strong>Documented, not asserted.</strong> Every claim on this
            page maps to a scan filed at{" "}
            <Link href="/house/certifications">/house/certifications</Link> or
            a test recorded on the line.
          </li>
        </ul>
      </section>

      <section className="st-cta">
        <h4>
          Bring the next <em>international SKU</em> to a floor that already
          ships internationally.
        </h4>
        <p>
          Founder-led reply within 48 hours. Samples in 7 – 10 days, production
          in 15 – 20. MOQ 200+ pieces.
        </p>
        <Link href="/begin" className="st-cta-link">
          Begin a project →
        </Link>
      </section>
    </main>
  );
}
