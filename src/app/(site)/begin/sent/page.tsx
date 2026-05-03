import Link from "next/link";
import "./sent.css";

export const metadata = {
  title: "Brief received · Huamei",
  description:
    "Your brief reached the Huamei studio. A founder-led reply lands within 48 hours, often sooner.",
  robots: { index: false, follow: false },
};

export default function SentPage() {
  return (
    <main className="sent-wrap">
      <section className="sent-mast">
        <div className="rn">vi. &middot; Received</div>
        <h1>
          Your brief is in our <em>keeping.</em>
        </h1>
        <div className="cn">收 妥</div>
      </section>

      <section className="sent-body">
        <div className="sent-rule" aria-hidden="true">
          <span /> <em>vi.</em> <span />
        </div>

        <p className="lede">
          We read every brief by hand, the day it lands. A founder-led reply
          arrives within <em>forty-eight hours</em>, often sooner.
        </p>

        <p className="prose">
          If you sent dielines, references, or a budget band, our studio walks
          them to the press floor before we write back — so the response you
          receive is grounded in what your project actually needs, not a
          template.
        </p>

        <p className="prose">
          If something urgent surfaces in the meantime, write to{" "}
          <a href="mailto:info@huamei.io">info@huamei.io</a> directly. Sonia
          reads that inbox first thing each morning.
        </p>

        <ol className="sent-steps">
          <li>
            <span className="n">i.</span>
            <span className="k">Read.</span>
            <span className="v">
              We circulate your brief to the relevant atelier — rigid, magnetic,
              folding — within hours.
            </span>
          </li>
          <li>
            <span className="n">ii.</span>
            <span className="k">Reply.</span>
            <span className="v">
              You receive a written response with first observations, questions,
              and a proposed next step.
            </span>
          </li>
          <li>
            <span className="n">iii.</span>
            <span className="k">Refine.</span>
            <span className="v">
              If we are a fit, we move to dielines, materials, and a first round
              of corrections — free of charge.
            </span>
          </li>
        </ol>

        <div className="sent-mark" aria-hidden="true">
          <span className="rule" />
          <span className="char">藝</span>
          <span className="rule" />
        </div>

        <div className="sent-links">
          <Link href="/volumes">Read recent volumes</Link>
          <span className="sep">&middot;</span>
          <Link href="/craft">Browse the catalogue</Link>
          <span className="sep">&middot;</span>
          <Link href="/">Return home</Link>
        </div>

        <div className="sent-sig">
          — <em>Huamei Studio</em>, 華美 &middot; Songjiang &middot; Henan
          &middot; Zhejiang &middot; Sichuan &middot; Guizhou
        </div>
      </section>
    </main>
  );
}
