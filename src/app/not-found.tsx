import Link from "next/link";
import { UtilityBar } from "@/components/UtilityBar";
import { PrimaryNav } from "@/components/PrimaryNav";
import { Footer } from "@/components/Footer";
import "./not-found.css";

export default function NotFound() {
  return (
    <>
      <UtilityBar />
      <PrimaryNav />
      <main className="nf-wrap">
        <section className="nf-plate">
          <div className="nf-left">
            <div className="top">
              <span className="rule" />
              Errata &middot; Pl. iv
            </div>

            <div className="nf-numeral">
              <span className="big">
                4<span className="g">0</span>4
              </span>
              <span className="label">Not found</span>
            </div>

            <div className="chinese">頁 · 不 · 存</div>

            <div className="foot">
              <span>Misprint &middot; scrapped on the floor</span>
              <span className="italic">iv.</span>
            </div>
          </div>

          <div className="nf-right">
            <div>
              <div className="kicker">A note from the factory</div>
              <h1>
                The page you <em>asked for</em> is not on file.
              </h1>
              <p>
                Every now and again a sheet comes off the press out of register. We
                scrap it, we set the plate again, we carry on. This is the web
                equivalent &mdash; a link that no longer leads anywhere on our press
                floor.
              </p>
              <p>
                If you were looking for a specific volume, project, or material,{" "}
                <em>type it below</em>. Otherwise, a few places to begin.
              </p>

              <form className="nf-search" action="/" method="get" role="search">
                <input
                  type="text"
                  name="q"
                  placeholder="Search the archive — e.g. champagne foil, magnetic, Souverain"
                />
                <button type="submit">Look →</button>
              </form>
            </div>

            <div className="nf-where">
              <h4>Or turn to —</h4>
              <ul>
                <li>
                  <Link href="/">
                    <span className="rn">i.</span>
                    <span className="name">The front page</span>
                    <span className="meta">Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/volumes">
                    <span className="rn">ii.</span>
                    <span className="name">Case studies</span>
                    <span className="meta">30+ on file</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blogs">
                    <span className="rn">iii.</span>
                    <span className="name">Blogs</span>
                    <span className="meta">Notes from the press floor</span>
                  </Link>
                </li>
                <li>
                  <Link href="/house">
                    <span className="rn">iv.</span>
                    <span className="name">The House</span>
                    <span className="meta">Since 1992</span>
                  </Link>
                </li>
                <li>
                  <Link href="/begin">
                    <span className="rn">v.</span>
                    <span className="name">Begin a project</span>
                    <span className="meta">Intake</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="nf-signoff">
          <span>Status &middot; 404 &middot; page not found</span>
          <span className="ital">&ldquo;Corrections are free.&rdquo;</span>
          <a href="mailto:info@huamei.io">Write to the factory</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
