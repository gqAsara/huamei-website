import Link from "next/link";
import "../house.css";

export const metadata = {
  title: "People — three thousand craftspeople since 1992",
  description:
    "More than three thousand people work at Huamei across four press floors. Founded by Sonia Sun in 1992.",
  alternates: { canonical: "/house/people" },
};

export default function PeoplePage() {
  return (
    <main className="hs-wrap">
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
