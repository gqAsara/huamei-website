import Link from "next/link";
import "./margin.css";

export const metadata = {
  title: "Margin — the Huamei journal of luxury packaging",
  description:
    "Notes from the press floor — production, people, customer success, sustainability and company news. Posted when we have something to say.",
  alternates: { canonical: "/margin" },
};

type Post = { num: string; title: string; italic: string; when: string };
type Section = {
  rn: string;
  id: string;
  title: string;
  italic: string;
  cn: string;
  intro: string;
  posts: Post[];
};

const SECTIONS: Section[] = [
  {
    rn: "I.",
    id: "production",
    title: "Production",
    italic: " & process.",
    cn: "工 · 序",
    intro:
      "Notes from the press floor — the materials we trust, the corners we won't cut, and the techniques we keep coming back to.",
    posts: [
      { num: "i.",   title: "Magnesium etched, ",      italic: "how a foil plate is born.",        when: "In preparation" },
      { num: "ii.",  title: "A morning at the ",       italic: "Yangshao kiln.",                   when: "In preparation" },
      { num: "iii.", title: "The pink we couldn't ",   italic: "match the first time.",            when: "In preparation" },
    ],
  },
  {
    rn: "II.",
    id: "people",
    title: "People",
    italic: " of the house.",
    cn: "人 · 才",
    intro:
      "Founders, masters, finishers — the names behind the work, and the ones who train the next press operator down the line.",
    posts: [
      { num: "i.",   title: "Master Wei, ",            italic: "on his thirty-eighth year at the press.", when: "In preparation" },
      { num: "ii.",  title: "Sonia Sun ",              italic: "on the small room in 1992.",       when: "In preparation" },
      { num: "iii.", title: "What a senior finisher ", italic: "actually does.",                   when: "In preparation" },
    ],
  },
  {
    rn: "III.",
    id: "customers",
    title: "Customer",
    italic: " success.",
    cn: "客 · 案",
    intro:
      "Projects told from the brief inward — the aesthetic decisions, the constraints, the route the box took before it shipped.",
    posts: [
      { num: "i.",   title: "The Souverain project: ", italic: "from sketch to ship.",          when: "In preparation" },
      { num: "ii.",  title: "Glee's Grove — ",          italic: "twelve weeks, four iterations.",  when: "In preparation" },
      { num: "iii.", title: "When Lancôme called for a ", italic: "holiday box.",                  when: "In preparation" },
    ],
  },
  {
    rn: "IV.",
    id: "sustainability",
    title: "Sustainability",
    italic: " & receipts.",
    cn: "可 · 持",
    intro:
      "FSC papers, recovered foil, the carbon math — published, audited, and explained without offsets.",
    posts: [
      { num: "i.",   title: "The 2025 ",                italic: "receipts, audited.",              when: "In preparation" },
      { num: "ii.",  title: "Why we don't ",            italic: "buy carbon offsets.",             when: "In preparation" },
      { num: "iii.", title: "Foil recovery: ",          italic: "the math behind 34%.",            when: "In preparation" },
    ],
  },
  {
    rn: "V.",
    id: "news",
    title: "Company",
    italic: " news.",
    cn: "近 · 訊",
    intro:
      "What's new at Huamei — new floors, new partnerships, awards, hires, openings.",
    posts: [
      { num: "i.",   title: "A new floor ",             italic: "opens in Guizhou.",               when: "In preparation" },
      { num: "ii.",  title: "Recognised at the ",       italic: "Pentawards 2025.",                when: "In preparation" },
      { num: "iii.", title: "Why we changed our ",      italic: "name in 1998.",                   when: "In preparation" },
    ],
  },
];

export default function MarginPage() {
  return (
    <main className="su-wrap">
      {/* Masthead */}
      <section className="su-mast">
        <div>
          <div className="k">
            <span className="rn">Blogs</span> &middot; <span className="rn">Huamei</span>
          </div>
          <h1>
            From <em>the floor.</em>
          </h1>
          <span className="cn">邊 · 紙</span>
        </div>
        <div className="aside">
          <p>
            Our <em>blogs</em> are where the press floor speaks — production and
            process, the people we work with, the projects we ship,
            sustainability with receipts, and the news from the four floors. Posted
            when there is something worth saying.
          </p>
          <nav className="mg-toc" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="mg-toc-link">
                <em>{s.rn}</em> {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Five categories */}
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="mg-cat">
          <div className="mg-cat-head">
            <div className="mg-cat-name">
              <span className="rn">{s.rn}</span>
              <h2>
                {s.title}
                <em>{s.italic}</em>
              </h2>
              <span className="cn">{s.cn}</span>
            </div>
            <p className="mg-cat-intro">{s.intro}</p>
          </div>
          <ul className="mg-forth-list">
            {s.posts.map((p) => (
              <li key={p.num} className="mg-forth-row">
                <span className="num">{p.num}</span>
                <span className="ttl">
                  {p.title}
                  <em>{p.italic}</em>
                </span>
                <span className="when">{p.when}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* CTA */}
      <section className="su-cta">
        <div className="k">A note from the floor</div>
        <h3>
          Tell us the brief. We&rsquo;ll tell you the most honest route to it — and
          the compromises the brief asks for.
        </h3>
        <p>
          Posts are published when finished, and sent by email to subscribers. To
          be added to the mailing list, write to{" "}
          <a href="mailto:info@huamei.io">info@huamei.io</a>.
        </p>
        <div className="actions">
          <Link className="hm-plate" href="/begin">
            <span className="roman">→</span> Begin a project
          </Link>
          <Link className="hm-plate" href="/house" style={{ background: "var(--paper)" }}>
            <span className="roman">→</span> Read the house
          </Link>
        </div>
      </section>
    </main>
  );
}
