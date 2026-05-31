import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { industryItemList } from "@/lib/schema/collection";
import "./industry.css";

export const metadata = {
  title: "Luxury packaging by industry — cosmetic, spirits, gifting, wellness",
  description:
    "Custom luxury packaging across four sectors: cosmetic & skincare (Collgene, Kefumei, indie houses), wine spirits & tea (Wuliangye, Yangshao, Dukang), seasonal gifting, and wellness. MOQ 200+, since 1992.",
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
      <JsonLd data={industryItemList()} />
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
          <span>26 projects on file</span>
        </div>

        <Link href="/industry/cosmetic">
          <span className="rn">i.</span>
          <span className="nm">Cosmetic &amp; <em>Skincare</em></span>
          <span className="ct">4 projects</span>
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
          <div className="ph" style={{ backgroundImage: "url('/photos/cases/collgene/01.jpg')" }} />
          <div className="veil" />
          <div className="top">
            <span className="rn">ii.</span>
            <span className="meta">4 &middot; prestige &amp; indie</span>
          </div>
          <h3><em>Cosmetic</em> &amp; Skincare.</h3>
          <span className="cn">化妆 · 护肤</span>
          <p className="desc">
            Compact, tube, jar — and everything that sits around them.
            Unit and outer, matched.
          </p>
          <div className="foot">
            <span>Collgene &middot; Kefumei &middot; indie houses</span>
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

      {/* Context strip — authorized roster only (per .seo/SEO_CONTEXT.md) */}
      <section className="in-context">
        <h2>
          Who we&rsquo;ve worked with. <span className="cn">合作</span>
        </h2>
        <ul className="rlist">
          <li><Link href="/volumes/wuliangye-clamshell"><span><em>Wuliangye</em> 五粮液</span><span className="tag">Spirits &middot; baijiu</span></Link></li>
          <li><Link href="/volumes/yangshao"><span>Yangshao <em>Caitao</em> 仰韶</span><span className="tag">Spirits &middot; baijiu</span></Link></li>
          <li><Link href="/volumes/dukang"><span>Luoyang <em>Dukang</em> 杜康</span><span className="tag">Spirits &middot; baijiu</span></Link></li>
          <li><Link href="/volumes/hongxing"><span><em>Red Star</em> Erguotou 红星</span><span className="tag">Spirits &middot; baijiu</span></Link></li>
          <li><Link href="/volumes/t2-tea"><span>T2 <em>True Brews</em></span><span className="tag">Tea &middot; specialty</span></Link></li>
          <li><Link href="/volumes/heritage-tea"><span><em>DEEPURE</em> Heritage Tea</span><span className="tag">Tea &middot; gifting</span></Link></li>
          <li><Link href="/volumes/collgene"><span>Collgene</span><span className="tag">Skincare &middot; carton</span></Link></li>
          <li><Link href="/volumes/kefumei"><span><em>Kefumei</em> 可复美</span><span className="tag">Skincare &middot; rigid</span></Link></li>
          <li><Link href="/volumes/glees-grove"><span>Glees Grove <em>Soaps</em></span><span className="tag">Wellness &middot; folding</span></Link></li>
          <li><Link href="/volumes/man-made-crayon"><span>Man Made <em>Crayon</em></span><span className="tag">Gifting &middot; book-style</span></Link></li>
        </ul>
      </section>

      {/* Editorial cluster — internal links to /blogs by sector */}
      <section className="in-context">
        <h2>
          Read on, <em>by industry.</em> <span className="cn">讀</span>
        </h2>
        <ul className="rlist">
          <li><Link href="/blogs/baijiu-packaging-design-2026"><span>Baijiu packaging — <em>structure codes, foils, seasonal calendar</em></span><span className="tag">Spirits</span></Link></li>
          <li><Link href="/blogs/wine-champagne-gift-box-packaging"><span>Wine &amp; champagne gift box packaging</span><span className="tag">Spirits</span></Link></li>
          <li><Link href="/blogs/tea-gift-box-manufacturing"><span>Tea gift box manufacturing — <em>structures &amp; finishes</em></span><span className="tag">Tea</span></Link></li>
          <li><Link href="/blogs/cosmetic-packaging-luxury-rigid-box"><span>Cosmetic packaging — <em>luxury rigid box</em></span><span className="tag">Cosmetic</span></Link></li>
          <li><Link href="/blogs/skincare-packaging-rigid-box-guide"><span>Skincare packaging — structures, inserts, certifications</span><span className="tag">Skincare</span></Link></li>
          <li><Link href="/blogs/perfume-box-design-guide"><span>Perfume box design — <em>structure, paper, finish</em></span><span className="tag">Fragrance</span></Link></li>
          <li><Link href="/blogs/supplement-packaging-rigid-box-guide"><span>Supplement &amp; nutraceutical packaging</span><span className="tag">Wellness</span></Link></li>
          <li><Link href="/blogs/candle-home-fragrance-packaging-luxury"><span>Candle &amp; home fragrance packaging</span><span className="tag">Wellness</span></Link></li>
          <li><Link href="/blogs/chinese-new-year-gift-packaging-2027"><span>Chinese New Year packaging — <em>2027 calendar</em></span><span className="tag">Seasonal</span></Link></li>
          <li><Link href="/blogs/mid-autumn-festival-packaging-mooncake"><span>Mid-Autumn festival packaging — <em>mooncake gift box</em></span><span className="tag">Seasonal</span></Link></li>
          <li><Link href="/blogs/jewelry-watch-rigid-box-packaging"><span>Jewelry &amp; watch rigid box packaging</span><span className="tag">Gifting</span></Link></li>
          <li><Link href="/blogs/luxury-packaging-dtc-brands"><span>Luxury packaging for DTC brands</span><span className="tag">DTC</span></Link></li>
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
