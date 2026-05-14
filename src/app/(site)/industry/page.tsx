import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "./industry.css";

export const metadata = {
  title: "Luxury packaging by industry — cosmetic, spirits, gifting, wellness",
  description:
    "Custom luxury packaging across four sectors: cosmetic & skincare (Estée Lauder, Collgene, Kefumei), wine spirits & tea (Wuliangye, Yangshao, Dukang), seasonal gifting, and wellness. MOQ 200+, since 1992.",
  alternates: { canonical: "/industry" },
};

export default function IndustryPage() {
  return (
    <main className="in-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Industry", path: "/industry" },
        ])}
      />
      {/* Masthead */}
      <section className="in-mast">
        <div className="k">
          <span className="rn">ii.</span>The category &middot; Vol. I
        </div>
        <h1>
          By <em>industry.</em>
        </h1>
        <div className="cn">行 · 業</div>
        <p className="lede">
          Four categories on the floor right now. The box changes when the buyer
          changes — a baijiu reveal is not a soap sleeve is not a CNY drawer.
        </p>
      </section>

      {/* Ledger */}
      <section className="in-ledger">
        <div className="ldh">
          <span>The four categories — <em>at a glance</em></span>
          <span>27 projects on file</span>
        </div>

        <Link href="/industry/cosmetic">
          <span className="rn">i.</span>
          <span className="nm">Cosmetic &amp; <em>Skincare</em></span>
          <span className="ct">5 projects</span>
          <span className="ar">→</span>
        </Link>
        <Link href="/industry/spirits">
          <span className="rn">ii.</span>
          <span className="nm">Wine, <em>Spirits</em> &amp; Tea</span>
          <span className="ct">14 projects</span>
          <span className="ar">→</span>
        </Link>
        <Link href="/industry/seasonal">
          <span className="rn">iii.</span>
          <span className="nm">Seasonal &amp; <em>Gifting</em></span>
          <span className="ct">6 projects</span>
          <span className="ar">→</span>
        </Link>
        <Link href="/industry/wellness">
          <span className="rn">iv.</span>
          <span className="nm"><em>Wellness</em></span>
          <span className="ct">2 projects</span>
          <span className="ar">→</span>
        </Link>
      </section>

      {/* Plate grid — 4 plates */}
      <section className="in-plates">
        {/* Row 1 — 8 + 4 */}
        <Link className="in-plate x8 tall" href="/industry/spirits">
          <div className="ph" style={{ backgroundImage: "url('/photos/cases/dukang/01.jpg')" }} />
          <div className="veil" />
          <div className="top">
            <span className="rn">i.</span>
            <span className="meta">14 on file &middot; baijiu, wine, tea</span>
          </div>
          <h3>Wine, Spirits <em>&amp; Tea.</em></h3>
          <span className="cn">酒 · 茶</span>
          <p className="desc">
            The longest-running register on the floor. Book-style coffrets,
            ceramic-and-foil clamshells, moisture-stable inserts.
          </p>
          <div className="foot">
            <span>Wuliangye &middot; Yangshao &middot; Dukang &middot; T2</span>
            <span className="gold">→</span>
          </div>
        </Link>

        <Link className="in-plate x4 tall" href="/industry/cosmetic">
          <div className="ph" style={{ backgroundImage: "url('/photos/cases/estee-holiday/01.jpg')" }} />
          <div className="veil" />
          <div className="top">
            <span className="rn">ii.</span>
            <span className="meta">5 &middot; prestige &amp; indie</span>
          </div>
          <h3><em>Cosmetic</em> &amp; Skincare.</h3>
          <span className="cn">化妆 · 护肤</span>
          <p className="desc">
            Compact, tube, jar — and everything that sits around them.
            Unit and outer, matched.
          </p>
          <div className="foot">
            <span>Estée Lauder &middot; Collgene &middot; Kefumei</span>
            <span className="gold">→</span>
          </div>
        </Link>

        {/* Row 2 — 6 + 6 */}
        <Link className="in-plate x6" href="/industry/seasonal">
          <div className="ph" style={{ backgroundImage: "url('/photos/cases/oriental-memoirs/01.jpg')" }} />
          <div className="veil" />
          <div className="top">
            <span className="rn">iii.</span>
            <span className="meta">6 &middot; seasonal &amp; gifting</span>
          </div>
          <h3>Seasonal <em>&amp;</em> Gifting.</h3>
          <span className="cn">節令 · 禮盒</span>
          <p className="desc">
            Chinese New Year, Mid-Autumn, Lunar limited editions, gift
            kits and shoppers. Booked a year ahead.
          </p>
          <div className="foot">
            <span>Colour and symbol are the brief</span>
            <span className="gold">→</span>
          </div>
        </Link>

        <Link className="in-plate x6" href="/industry/wellness">
          <div className="ph" style={{ backgroundImage: "url('/photos/cases/glees-grove/01.jpg')" }} />
          <div className="veil" />
          <div className="top">
            <span className="rn">iv.</span>
            <span className="meta">2 &middot; wellness</span>
          </div>
          <h3><em>Wellness.</em></h3>
          <span className="cn">養 · 生</span>
          <p className="desc">
            Botanicals, soaps, the quieter end of the wellness aisle.
            Folding cartons, sleeves, pulp inserts.
          </p>
          <div className="foot">
            <span>Type that whispers &middot; paper that composts</span>
            <span className="gold">→</span>
          </div>
        </Link>
      </section>

      {/* Context strip */}
      <section className="in-context">
        <h2>
          Who we&rsquo;ve worked with. <span className="cn">合作</span>
        </h2>
        <ul className="rlist">
          <li><span><em>Maison</em> de Parfum — Paris</span><span className="tag">Fragrance &middot; 9 yrs</span></li>
          <li><span>Shiseido &middot; Ginza</span><span className="tag">Cosmetic &middot; 12 yrs</span></li>
          <li><span>Piaget &amp; <em>Chaumet</em></span><span className="tag">Jewellery &middot; 6 yrs</span></li>
          <li><span>Hennessy <em>X.O</em></span><span className="tag">Spirits &middot; annual</span></li>
          <li><span>Louis Vuitton <em>Leather</em></span><span className="tag">Apparel &middot; 4 yrs</span></li>
          <li><span>La Prairie</span><span className="tag">Skincare &middot; 8 yrs</span></li>
          <li><span>Marou <em>Chocolat</em></span><span className="tag">Confection &middot; 3 yrs</span></li>
          <li><span>TWG &middot; <em>Tea</em> &amp; Tisanes</span><span className="tag">Tea &middot; 5 yrs</span></li>
        </ul>
      </section>

      {/* CTA */}
      <section className="in-cta">
        <div className="k">Your category, made plain</div>
        <h3>
          Tell us what&rsquo;s in the <em>box</em> — we&rsquo;ll suggest what&rsquo;s
          around it.
        </h3>
        <p>
          Twenty-minute consult. No brief required. We&rsquo;ll walk you through three
          structures your competitors have used, and three they haven&rsquo;t.
        </p>
        <div className="actions">
          <Link className="hm-plate" href="/begin">
            <span className="roman">→</span> Begin a project
          </Link>
          <Link className="hm-plate" href="/volumes" style={{ background: "var(--paper)" }}>
            <span className="roman">→</span> See the archive
          </Link>
        </div>
      </section>
    </main>
  );
}
