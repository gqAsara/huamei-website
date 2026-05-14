import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "./craft.css";

export const metadata = {
  title: "Luxury packaging craft — 99 structures, 17 foils, 80 papers",
  description:
    "Custom luxury packaging capabilities: rigid box construction, magnetic closures, hot-foil stamping, embossing, soft-touch laminate, spot UV. 99+ structures, 17 in-house foils, 80 papers on file. MOQ 200+.",
  alternates: { canonical: "/craft" },
};

type Item = {
  rn: string;
  name: string;
  italic?: string;
  desc: string;
  count: string;
  href: string;
  image?: string;
};

const STRUCTURES: Item[] = [
  { rn: "i.",    name: "Rigid & telescoping",  desc: "Two-piece lift-off — the house standard.",          count: "14",    href: "/craft/rigid",     image: "/photos/generated/structures/rigid.jpg" },
  { rn: "ii.",   name: "Magnetic ", italic: "closure", desc: "Hidden neodymium, soft-latch reveal.",       count: "11",    href: "/craft/magnetic",  image: "/photos/generated/structures/magnetic.jpg" },
  { rn: "iii.",  name: "Drawer & slipcase",    desc: "Single, twin, or tower — thumb-slotted.",            count: "9",     href: "/craft/drawer",    image: "/photos/generated/structures/drawer.jpg" },
  { rn: "iv.",   name: "Folding cartons",      desc: "Reverse-tuck, auto-bottom, seal-end.",               count: "22",    href: "/craft/folding",   image: "/photos/generated/structures/folding.jpg" },
  { rn: "v.",    name: "Book-style & clamshell", desc: "Hinged, cloth-bound, concealed spine.",            count: "7",     href: "/craft/book",      image: "/photos/generated/structures/book.jpg" },
  { rn: "vi.",   name: "Inserts & cradles",    desc: "EVA, moulded pulp, cut-flute, satin.",               count: "18",    href: "/craft/inserts",   image: "/photos/generated/structures/inserts.jpg" },
  { rn: "vii.",  name: "Shoppers & carriers",  desc: "Rope-handle, ribbon, knotted cord.",                 count: "12",    href: "/craft/shoppers",  image: "/photos/generated/structures/shoppers.jpg" },
  { rn: "viii.", name: "Bespoke ", italic: "one-offs", desc: "Custom structures, named after their brand.", count: "6", href: "/craft/bespoke",   image: "/photos/generated/structures/bespoke.jpg" },
];

const SURFACES: Item[] = [
  { rn: "i.",   name: "Hot-foil ", italic: "stamping", desc: "Champagne, copper, silver, black · seventeen on file.", count: "17",    href: "/craft/hot-foil",   image: "/photos/generated/surfaces/hot-foil.jpg" },
  { rn: "ii.",  name: "Registered emboss",     desc: "Die rises in perfect alignment with ink or foil.",   count: "—",     href: "/craft/emboss",     image: "/photos/generated/surfaces/emboss.jpg" },
  { rn: "iii.", name: "Debossing",             desc: "The mark pressed below the page, blind or filled.",  count: "—",     href: "/craft/deboss",     image: "/photos/generated/surfaces/deboss.jpg" },
  { rn: "iv.",  name: "Soft-touch ", italic: "laminate", desc: "Velvet finish · matte, scratch-resistant.", count: "—",     href: "/craft/soft-touch", image: "/photos/generated/surfaces/soft-touch.jpg" },
  { rn: "v.",   name: "Spot UV & varnish",     desc: "Gloss over matte — drawn where it matters.",         count: "—",     href: "/craft/spot-uv",    image: "/photos/generated/surfaces/spot-uv.jpg" },
  { rn: "vi.",  name: "Offset & Pantone",      desc: "Eight-colour offset · colour-managed from proof.",   count: "—",     href: "/craft/offset",     image: "/photos/generated/surfaces/offset.jpg" },
  { rn: "vii.", name: "Wrap papers & cloth",   desc: "Gmund, Fedrigoni, Iris book-cloth.",                 count: "Gmund", href: "/craft/wraps",      image: "/photos/generated/surfaces/wraps.jpg" },
];

const MATERIALS: Item[] = [
  { rn: "i.",   name: "Uncoated ", italic: "papers", desc: "Gmund, Fedrigoni, Arjo — tactile, absorbent.", count: "32", href: "/craft/uncoated" },
  { rn: "ii.",  name: "Coated art papers",     desc: "Silk, matte, gloss · 120 – 400 gsm.",                count: "18", href: "/craft/coated" },
  { rn: "iii.", name: "Book-cloth & wraps",    desc: "Iris, Wibalin, Buckram — the spine's skin.",          count: "14", href: "/craft/cloth" },
  { rn: "iv.",  name: "Recycled & ", italic: "alt-fibre", desc: "Grasshopper, Crush Citrus, hemp, bamboo.", count: "12", href: "/craft/recycled" },
  { rn: "v.",   name: "Grey & chipboard",      desc: "Rigid skeleton · 1.5 – 3.0 mm.",                     count: "—",  href: "/craft/chipboard" },
  { rn: "vi.",  name: "Specialty stocks",      desc: "Translucent, metallic-core, seeded, hand-made.",     count: "8",  href: "/craft/specialty" },
];

function Items({ items }: { items: Item[] }) {
  return (
    <div className="cr-items">
      {items.map((it) => (
        <Link key={it.href} className="cr-it" href={it.href}>
          <span className="rn">{it.rn}</span>
          <span className="lbl">
            <span className="name">
              {it.name}
              {it.italic ? <em>{it.italic}</em> : null}
            </span>
            <span className="desc">{it.desc}</span>
          </span>
          <span className="count">
            {it.count}
            <span className="arrow">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function Showcase({ items }: { items: Item[] }) {
  const cards = items.filter((it) => it.image);
  if (!cards.length) return null;
  return (
    <div className="cr-showcase">
      {cards.map((it) => (
        <Link key={it.href} className="cr-show-card" href={it.href}>
          <div className="img">
            <Image
              src={it.image!}
              alt={`${it.name}${it.italic ?? ""}`.trim()}
              fill
              sizes="(max-width: 960px) 50vw, 280px"
            />
          </div>
          <div className="meta">
            <span className="rn">{it.rn}</span>
            <span className="lbl">
              {it.name}
              {it.italic ? <em>{it.italic}</em> : null}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function CraftPage() {
  return (
    <main className="cr-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Craft", path: "/craft" },
        ])}
      />
      {/* Masthead */}
      <section className="cr-mast">
        <div className="ltop">
          <div>
            <span className="gold">i.</span> The category
          </div>
          <div style={{ marginTop: 8 }}>Huamei &middot; Vol. I</div>
        </div>
        <div className="centre">
          <h1>
            The <em>Craft.</em>
          </h1>
          <div className="cn">工 · 藝</div>
        </div>
        <div className="rtop">
          Ninety-nine structures, seventeen foils, eighty papers on file — each a
          choice the box can make, and a choice we can make better.
          <span className="caps">Structure &middot; Surface &middot; Material</span>
        </div>
      </section>

      {/* Lede */}
      <section className="cr-lede">
        <div className="side">i.</div>
        <p>
          &ldquo;Craft&rdquo; at Huamei means the full stack of manual and mechanical
          decision-making that happens between a brief and a box on a shelf. Three
          categories: how the <em>structure</em> folds, what the <em>surface</em> is
          treated with, and which <em>material</em> — paper, cloth, board — carries
          it all. Every volume in the archive is a combination of the three.
        </p>
      </section>

      {/* Band i. Structure */}
      <section className="cr-band">
        <div className="cr-band-head">
          <div className="chapter">i.</div>
          <h2>
            By <em>structure.</em> <span className="cn">結構</span>
          </h2>
          <div className="count">
            <span className="n">99+</span>on file &middot; eight families
          </div>
        </div>
        <div className="cr-band-body">
          <p className="intro">
            The skeleton under the box. We keep dies for rigid, magnetic, drawer,
            book-style, folding, shoppers, inserts — and a library of 99+ one-off
            structures made for past projects.
          </p>
          <div className="featured">
            <div className="cover" style={{ backgroundImage: "url('/photos/huamei-pink-drawer.jpg')" }} />
            <div>
              <div className="meta">Currently on press</div>
              <p className="t">A <em>four-drawer</em> tower in matte cream.</p>
              <p className="q">For a cosmetic house, 2026. Nested magnetic closure; paper-covered chipboard; 2.5 mm wall.</p>
              <Link href="/craft/drawer">See the structure →</Link>
            </div>
          </div>
        </div>
        <Showcase items={STRUCTURES} />
        <Items items={STRUCTURES} />
      </section>

      {/* Band ii. Surface (dark) */}
      <section className="cr-band dark">
        <div className="cr-band-head">
          <div className="chapter">ii.</div>
          <h2>
            By <em>surface.</em> <span className="cn">表 面</span>
          </h2>
          <div className="count">
            <span className="n">17</span>foils &middot; seven treatments
          </div>
        </div>
        <div className="cr-band-body">
          <p className="intro">
            What happens to the paper once the die is cut. Foil, emboss, deboss, spot
            varnish, soft-touch — the grammar of how light catches the mark.
          </p>
          <div className="featured">
            <div className="cover" style={{ backgroundImage: "url('/photos/press-die-cut-cropped.jpg')" }} />
            <div>
              <div className="meta">House specialty</div>
              <p className="t">Registered <em>emboss-and-foil.</em></p>
              <p className="q">Die rises and lights at once. ±0.1 mm registration. We will demonstrate on the proof.</p>
              <Link href="/craft/emboss">See the process →</Link>
            </div>
          </div>
        </div>
        <Showcase items={SURFACES} />
        <Items items={SURFACES} />
      </section>

      {/* Band iii. Material */}
      <section className="cr-band">
        <div className="cr-band-head">
          <div className="chapter">iii.</div>
          <h2>
            By <em>material.</em> <span className="cn">材 料</span>
          </h2>
          <div className="count">
            <span className="n">80+</span>stocks &middot; FSC &middot; PEFC
          </div>
        </div>
        <div className="cr-band-body">
          <p className="intro">
            The stock itself — paper, board, cloth, film, and the sustainable
            alternatives we now default to. All stocks are FSC- or PEFC-certified
            unless the client specifies otherwise.
          </p>
          <div className="featured">
            <div className="cover" style={{ backgroundImage: "url('/photos/pattern-dreamy-essentials.jpg')" }} />
            <div>
              <div className="meta">Signature stock</div>
              <p className="t">Gmund <em>Urban.</em></p>
              <p className="q">A cream-tinted stock with a faint flecking — the default Huamei wrap for catalogues and Volume I.</p>
              <Link href="/craft/uncoated">See the material →</Link>
            </div>
          </div>
        </div>
        <Items items={MATERIALS} />
      </section>

      {/* Related archive */}
      <section className="cr-related">
        <div className="head">
          <h3>The <em>archive</em>, by craft.</h3>
          <Link className="more" href="/volumes">All case studies →</Link>
        </div>
        <div className="cr-grid">
          <Link className="cr-card" href="/volumes/dukang">
            <div className="ph" style={{ backgroundImage: "url('/photos/cases/dukang/01.jpg')" }}>
              <span className="rn">I.</span>
            </div>
            <div className="meta"><span>Spirits</span><span>2024</span></div>
            <h4>Dukang 杜康</h4>
            <div className="tag">Octagonal &middot; Velvet &middot; Mirror</div>
          </Link>
          <Link className="cr-card" href="/volumes/oriental-memoirs">
            <div className="ph" style={{ backgroundImage: "url('/photos/cases/oriental-memoirs/01.jpg')" }}>
              <span className="rn">X.</span>
            </div>
            <div className="meta"><span>Gifting</span><span>2024</span></div>
            <h4>Oriental Memoirs</h4>
            <div className="tag">Drawer &middot; Laser-cut</div>
          </Link>
          <Link className="cr-card" href="/volumes/estee-holiday">
            <div className="ph" style={{ backgroundImage: "url('/photos/cases/estee-holiday/01.jpg')" }}>
              <span className="rn">IV.</span>
            </div>
            <div className="meta"><span>Cosmetics</span><span>2024</span></div>
            <h4>Estée Lauder Holiday</h4>
            <div className="tag">Watercolor &middot; Foil starfield</div>
          </Link>
          <Link className="cr-card" href="/volumes/collgene">
            <div className="ph" style={{ backgroundImage: "url('/photos/cases/collgene/01.jpg')" }}>
              <span className="rn">IX.</span>
            </div>
            <div className="meta"><span>Skincare</span><span>2025</span></div>
            <h4>Collgene</h4>
            <div className="tag">Tuck-end &middot; Silver foil</div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cr-cta">
        <div className="k">Begin with craft</div>
        <h3>Pull a swatch, send us a die, or ask for a dieline.</h3>
        <p>Prototypes in 72 hours. Foil swatches posted free. Corrections are free, every time, at every stage.</p>
        <div className="actions">
          <Link className="hm-plate" href="/begin">
            <span className="roman">→</span> Begin a project
          </Link>
          <Link className="hm-plate" href="/craft/rigid" style={{ background: "var(--paper)" }}>
            <span className="roman">→</span> See a topic
          </Link>
        </div>
      </section>
    </main>
  );
}
