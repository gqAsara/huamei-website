import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "../house.css";

const SITE = "https://huamei.io";

export const metadata = {
  title: "People — three thousand craftspeople since 1992",
  description:
    "More than three thousand people work at Huamei across four press floors. Founded by Sonia Sun in 1992. Press, finishing, QA, design, fulfilment.",
  alternates: { canonical: "/house/people" },
};

// AboutPage + Person schema. The Person entity ties Sonia Sun's byline
// (used on every /blogs/* post) to a knowledge-graph identity so AI
// engines can attribute Huamei content to a real person — an E-E-A-T win.
const peopleGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE}/house/people#page`,
      url: `${SITE}/house/people`,
      name: "People — Huamei",
      description:
        "More than three thousand people work at Huamei across four press floors. Founded by Sonia Sun in 1992.",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#org` },
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${SITE}/house/people#sonia-sun`,
      name: "Sonia Sun",
      alternateName: "孙",
      jobTitle: "Founder",
      worksFor: { "@id": `${SITE}/#org` },
      url: `${SITE}/house/people`,
      description:
        "Sonia Sun founded Huamei in Zhengzhou, Henan, in 1992 and has run the press floor since — three decades on the same craft.",
      knowsAbout: [
        "Custom luxury packaging",
        "Rigid box manufacturing",
        "Hot-foil stamping",
        "Registered emboss",
        "Magnetic closure engineering",
      ],
    },
  ],
};

export default function PeoplePage() {
  return (
    <main className="hs-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "The House", path: "/house" },
          { name: "People", path: "/house/people" },
        ])}
      />
      <JsonLd data={peopleGraph} />
      <header className="hs-subcover">
        <div className="kicker">
          <Link href="/house">← The House</Link>
        </div>
        <h1>
          The <em>people.</em>
        </h1>
        <span className="cn">人 · 才</span>
      </header>

      <div className="hs-section-head" id="people">
        <h3>
          <em>3,000+</em> hands.
        </h3>
        <span className="stamp">Four floors &middot; one craft</span>
      </div>
      <section className="hs-people">
        <div className="copy">
          <p>
            More than three thousand people work at Huamei. Most have been here
            longer than ten years; many longer than twenty. The press operators in
            Henan trained the press operators in Zhejiang. The senior finisher in
            Sichuan trained the senior finisher in Guizhou. The work passes hand to
            hand, the way it always has.
          </p>
          <p>
            The house is led by <em>Sonia Sun</em>, who founded Huamei in 1992.
            Every project goes past her desk before it goes to press.
          </p>
        </div>
        <div className="roster">
          <div className="row"><span className="n">420</span><span className="l">Design &amp; structural</span></div>
          <div className="row"><span className="n">1,200</span><span className="l">Press floor</span></div>
          <div className="row"><span className="n">880</span><span className="l">Finishing &amp; assembly</span></div>
          <div className="row"><span className="n">360</span><span className="l">Quality &amp; QA</span></div>
          <div className="row"><span className="n">240</span><span className="l">Fulfilment &amp; logistics</span></div>
        </div>
      </section>
    </main>
  );
}
