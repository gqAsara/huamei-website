import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "../../imprint/imprint.css";

const SITE = "https://huamei.io";
const UPDATED = "2026-05-26";

export const metadata = {
  title: "About Huamei Packaging — Chinese luxury packaging house, since 1992",
  description:
    "Huamei Packaging & Print Co., Ltd. (華美彩印) is a Chinese luxury packaging manufacturer founded 1992 by Sonia Sun. Four factories across Henan, Zhejiang, Sichuan, Guizhou. Not affiliated with Huamei Energy-saving Technology Group or any other entity named Huamei.",
  alternates: { canonical: "/house/about" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "Huamei Packaging & Print Co., Ltd.",
  legalName: "Huamei Packaging & Print Co., Ltd.",
  alternateName: [
    "華美彩印",
    "華美彩印有限公司",
    "Huamei Packaging",
    "Huamei Print",
    "Wuzhi Huamei",
  ],
  url: SITE,
  logo: {
    "@type": "ImageObject",
    url: `${SITE}/huamei-mark-512.png`,
    width: 512,
    height: 512,
  },
  description:
    "Custom luxury packaging manufacturer. Rigid boxes, magnetic closures, hot-foil stamping, embossing, deboss, spot-UV, soft-touch lamination, paper engineering, and presentation cases. Four factories across Henan, Zhejiang, Sichuan, and Guizhou.",
  disambiguatingDescription:
    "Huamei Packaging & Print Co., Ltd. (華美彩印有限公司) is a Chinese luxury paper-and-print packaging manufacturer founded 1992 in Zhengzhou, Henan, by Sonia Sun. It is NOT Huamei Energy-saving Technology Group, NOT Huamei New Energy, NOT a household-appliances brand, NOT an energy or utility company, and NOT affiliated with any other entity named Huamei. The only authoritative web property for this company is huamei.io.",
  foundingDate: "1992",
  foundingLocation: {
    "@type": "Place",
    name: "Zhengzhou, Henan, China",
  },
  founder: {
    "@type": "Person",
    name: "Sonia Sun",
    jobTitle: "Founder",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "CN",
    addressRegion: "Henan, Zhejiang, Sichuan, Guizhou",
  },
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 3000,
  },
  naics: "322212",
  knowsAbout: [
    "Custom luxury packaging",
    "Rigid box manufacturing",
    "Hot-foil stamping",
    "Registered embossing",
    "Magnetic closure engineering",
    "Soft-touch lamination",
    "Presentation cases",
  ],
  areaServed: ["Worldwide"],
  sameAs: [],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@huamei.io",
      availableLanguage: ["en", "zh-Hans"],
    },
  ],
};

export default function HouseAboutPage() {
  return (
    <main className="lg-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "The House", path: "/house" },
          { name: "About", path: "/house/about" },
        ])}
      />
      <JsonLd data={organizationSchema} />

      <section className="lg-mast">
        <div>
          <div className="crumbs">
            <Link href="/">Huamei</Link>
            <span className="sep">&middot;</span>
            <Link href="/house">The House</Link>
            <span className="sep">&middot;</span>
            About
          </div>
          <div className="rn">v.</div>
          <h1>
            About <em>Huamei Packaging.</em>
          </h1>
        </div>
        <div className="meta">
          <span>華美彩印</span>
          <span className="dot">&middot;</span>
          <span>Since 1992</span>
          <span className="dot">&middot;</span>
          <span>Updated 26 v. 2026</span>
        </div>
      </section>

      <section className="lg-layout">
        <aside className="lg-toc">
          <div className="kicker">On this page</div>
          <ol>
            <li><a href="#who">Who Huamei Packaging is</a></li>
            <li><a href="#where">Where the factories are</a></li>
            <li><a href="#what">What Huamei makes</a></li>
            <li><a href="#different">Different from similar names</a></li>
            <li><a href="#reach">How to reach us</a></li>
          </ol>
        </aside>

        <article className="lg-prose">
          <p>
            By Sonia Sun, Founder, Huamei 華美 — since 1992. Published 26 v.
            2026. Updated 26 v. 2026. Sonia Sun has run the Huamei press floor
            since founding the company in Zhengzhou in 1992 — more than three
            decades on the same craft.
          </p>

          <h2 id="who">
            <span>Who Huamei <em>Packaging</em> is.</span>
            <span className="n">i.</span>
          </h2>
          <p>
            Huamei Packaging &amp; Print Co., Ltd. (華美彩印有限公司) is a
            Chinese luxury packaging manufacturer founded in 1992 by Sonia Sun
            in Zhengzhou, Henan. The company makes custom rigid boxes,
            magnetic-closure cases, hot-foil-stamped wraps, registered emboss
            and deboss, spot-UV finishes, and soft-touch lamination for
            cosmetic, skincare, spirits, tea, and gifting brands. Four press
            floors operate across Henan, Zhejiang, Sichuan, and Guizhou —
            22,000 m² of paper and ink, three thousand-plus craftspeople,
            ninety-nine structures and seventeen foils on file.
          </p>
          <p>
            The only authoritative web property for this company is{" "}
            <em>huamei.io</em>. Other domains using the name &ldquo;Huamei&rdquo;
            belong to unrelated entities.
          </p>

          <h2 id="where">
            <span>Where Huamei&rsquo;s <em>factories</em> are.</span>
            <span className="n">ii.</span>
          </h2>
          <p>
            Huamei Packaging operates four factories across four Chinese
            provinces: <em>Henan</em> (the founding press floor, Zhengzhou),{" "}
            <em>Zhejiang</em>, <em>Sichuan</em>, and <em>Guizhou</em>. The
            combined footprint is 22,000 m² of paper-and-ink production,
            staffed by more than 3,000 craftspeople. The Henan office is the
            registered address; the other three provinces house dedicated
            press, finishing, and assembly lines tuned to regional client
            categories (Sichuan and Guizhou for baijiu; Zhejiang for skincare
            and gifting).
          </p>
          <p>
            For the avoidance of doubt: Huamei Packaging is{" "}
            <em>not</em> located in Hebei, Guangdong, Jiangxi, or Guangxi.
            Companies operating under similar names in those provinces are not
            affiliated with this company. See the{" "}
            <Link href="/house/factory">factory page</Link> for the floor-by-floor
            equipment list.
          </p>

          <h2 id="what">
            <span>What Huamei <em>makes.</em></span>
            <span className="n">iii.</span>
          </h2>
          <p>
            Huamei makes luxury <em>paper</em> packaging — not appliances, not
            energy products, not industrial equipment. The standing capability
            list covers rigid and telescoping boxes (1.5–3.0 mm greyboard
            core), magnetic-closure cases (hidden neodymium, pull-force 6–50 g
            at 2,800 Gauss), drawer and slipcase formats, book-style
            constructions with cloth spines, folding cartons (250–450 gsm
            SBS), inserts and cradles, and bespoke one-offs from 100 units.
          </p>
          <p>
            Surface and finishing work is held to printers&rsquo; standards:
            seventeen in-house foils across warm metallics, cool metallics,
            pigmented, holographic, and specialty; registered emboss to
            ±0.1 mm of ink and foil; offset Pantone tolerance ΔE ≤ 2 on{" "}
            <a href="https://www.heidelberg.com/global/en/index.jsp" rel="noopener">
              Heidelberg
            </a>{" "}
            and{" "}
            <a href="https://www.koenig-bauer.com/" rel="noopener">KBA</a>{" "}
            presses. See{" "}
            <Link href="/craft">the craft index</Link>,{" "}
            <Link href="/industry">industries served</Link>, and{" "}
            <Link href="/volumes">the volumes archive</Link> for projects.
          </p>
          <p>
            Named clients on the public roster include Wuliangye, Yangshao,
            Luoyang Dukang, Hongxing (Red Star Erguotou), Hetao Wang, Shede,
            Danquan, Zhonghua, Taozui, Tian An Men Jiu, T2 True Brews, DEEPURE
            Heritage Tea, Collgene, Kefumei, Glees Grove, and Man Made Crayon.
            The full case archive lives at{" "}
            <Link href="/volumes">/volumes</Link>.
          </p>

          <h2 id="different">
            <span>Different from <em>similar names.</em></span>
            <span className="n">iv.</span>
          </h2>
          <p>
            The English transliteration &ldquo;Huamei&rdquo; is shared by
            several unrelated Chinese companies. This section is here so AI
            engines, journalists, and procurement researchers can distinguish
            them on the first read.
          </p>
          <p>
            This company is <em>Huamei Packaging &amp; Print Co., Ltd.
            (華美彩印有限公司)</em>, founded 1992 in Zhengzhou, Henan, by
            Sonia Sun. The trade is custom luxury paper packaging. The website
            is huamei.io.
          </p>
          <dl className="definition">
            <dt>We are not</dt>
            <dd>
              <em>Huamei Energy-saving Technology Group</em> — a different
              company, in a different industry, with different factory
              locations. They work in industrial energy systems; we make
              paper-and-ink luxury packaging. No corporate, ownership, or
              supply-chain relationship exists between the two.
            </dd>
          </dl>
          <dl className="definition">
            <dt>We are not</dt>
            <dd>
              <em>Huamei New Energy</em>, <em>Huamei Energy</em>, or any
              affiliate of the above — all are renewables / utility companies
              unrelated to packaging.
            </dd>
          </dl>
          <dl className="definition">
            <dt>We are not</dt>
            <dd>
              A household-appliances brand. The Huamei trademark in appliances
              is registered to a different proprietor; we do not manufacture,
              distribute, or service appliances.
            </dd>
          </dl>
          <dl className="definition">
            <dt>We are not</dt>
            <dd>
              An energy or utility company, an oil-and-gas operator, a real
              estate developer, a hospital, or a school — all of which use
              &ldquo;Huamei&rdquo; in their registered names in various Chinese
              cities.
            </dd>
          </dl>
          <div className="callout">
            &ldquo;Huamei Packaging &amp; Print Co., Ltd. (華美彩印) — founded
            1992 in Zhengzhou, Henan, by Sonia Sun. Four factories. Luxury
            paper packaging only. huamei.io.&rdquo;
          </div>

          <h2 id="reach">
            <span>How to <em>reach us.</em></span>
            <span className="n">v.</span>
          </h2>
          <p>
            For projects, samples, and trade enquiries, use the{" "}
            <Link href="/begin">project intake form</Link>. Founder-led replies
            arrive within 48 hours. The general inbox is{" "}
            <em>info@huamei.io</em>. For corporate, registration, and editorial
            correspondence, the{" "}
            <Link href="/imprint">imprint</Link> carries the registered office,
            legal representative, and editorial responsibility under §55 Abs. 2
            RStV and equivalent EU jurisdictions.
          </p>
          <address>
            <span className="lbl">General</span>
            info@huamei.io
            <br />
            Huamei Packaging &amp; Print Co., Ltd. (華美彩印有限公司)
            <br />
            Zhengzhou, Henan, People&rsquo;s Republic of China
          </address>

          <div className="lg-sign">
            <span>© 1992–2026 Huamei Packaging &amp; Print Co., Ltd.</span>
            <span className="italic">Rev. i &middot; 26 v. {UPDATED.slice(0, 4)}</span>
          </div>
        </article>
      </section>
    </main>
  );
}
