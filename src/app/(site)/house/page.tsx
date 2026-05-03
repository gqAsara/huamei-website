import Link from "next/link";
import "./house.css";

export const metadata = {
  title: "The House · Huamei",
  description:
    "Press floors across Henan, Zhejiang, Sichuan and Guizhou, since 1992. 22,000 m², 3,000+ craftspeople. Founded by Sonia Sun.",
};

export default function HousePage() {
  return (
    <main className="hs-wrap">
      {/* I. Index — links to /house/philosophy, /house/factory, /house/certifications */}
      <nav className="hs-index" aria-label="Inside the House">
        <Link href="/house/philosophy">
          <span className="k">i. &middot; 理念</span>
          <h3>
            Our <em>philosophy.</em>
          </h3>
          <p className="lede">
            A letter from Sonia, and the threshold — why we believe a box is a
            brand&rsquo;s first physical handshake.
          </p>
          <span className="arrow">Read →</span>
        </Link>
        <Link href="/house/factory">
          <span className="k">ii. &middot; 廠房</span>
          <h3>
            The <em>factory &amp; floor.</em>
          </h3>
          <p className="lede">
            22,000 m² across Henan, Zhejiang, Sichuan and Guizhou — foil, emboss,
            lamination, finishing, all under one roof.
          </p>
          <span className="arrow">Visit →</span>
        </Link>
        <Link href="/house/certifications">
          <span className="k">iii. &middot; 證書</span>
          <h3>
            <em>Certifications.</em>
          </h3>
          <p className="lede">
            FSC, ISO 9001, 14001, 45001 and CE — the audited standards behind every
            Huamei project, on file and current.
          </p>
          <span className="arrow">View →</span>
        </Link>
        <Link href="/house/people">
          <span className="k">iv. &middot; 人才</span>
          <h3>
            The <em>people.</em>
          </h3>
          <p className="lede">
            More than 3,000 craftspeople across four floors — most have been here
            longer than ten years, many longer than twenty.
          </p>
          <span className="arrow">Meet →</span>
        </Link>
      </nav>

      {/* V. Contact */}
      <div className="hs-section-head" id="contact">
        <h3>
          <em>Contact.</em>
        </h3>
        <span className="stamp">24 / 7</span>
      </div>
      <section className="hs-contact">
        <div className="tile">
          <div className="k">Founder &amp; projects</div>
          <div className="v"><a href="mailto:info@huamei.io">info@huamei.io</a></div>
          <div className="sub">Sonia Sun &middot; reads every email</div>
        </div>
        <div className="tile">
          <div className="k">Office</div>
          <div className="v">+1 310 896 6923</div>
          <div className="sub">24 / 7</div>
        </div>
        <div className="tile">
          <div className="k">Showrooms</div>
          <div className="v">Henan · Zhejiang · Sichuan · Guizhou</div>
          <div className="sub">By appointment &middot; samples on the table</div>
        </div>
        <div className="tile cta">
          <div className="k">Or simply</div>
          <div className="v">
            <Link href="/begin">Begin a project →</Link>
          </div>
          <div className="sub">300 pcs minimum &middot; 2 — 4 weeks on demand</div>
        </div>
      </section>
    </main>
  );
}
