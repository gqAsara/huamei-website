import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { getAllBlogPosts, type BlogPost } from "@/lib/blogs";
import "./blogs.css";

export const metadata = {
  title: "Luxury packaging guides & technical references — Huamei blog",
  description:
    "Editorial guides on luxury packaging manufacturing: rigid box construction, hot-foil stamping, magnetic closure pull-force, greyboard grades, MOQ economics, Chinese manufacturing, and sustainability. 80+ posts, written from the press floor.",
  alternates: { canonical: "/blogs" },
};

const SITE = "https://huamei.io";

function monthLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function groupByMonth(posts: BlogPost[]): Array<{ key: string; label: string; posts: BlogPost[] }> {
  const order: string[] = [];
  const buckets = new Map<string, BlogPost[]>();
  for (const p of posts) {
    const d = new Date(p.publishedAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(p);
  }
  return order.map((key) => ({
    key,
    label: monthLabel(buckets.get(key)![0].publishedAt),
    posts: buckets.get(key)!,
  }));
}

export default function BlogsPage() {
  const posts = getAllBlogPosts();
  const months = groupByMonth(posts);

  const collectionGraph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE}/blogs#collection`,
    name: "Huamei Blog — luxury packaging guides and technical references",
    description:
      "Editorial guides on luxury packaging manufacturing from the Huamei press floor — rigid box construction, hot-foil stamping, magnetic closures, sustainability, sourcing, and seasonal launches.",
    url: `${SITE}/blogs`,
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/blogs/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <main className="su-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Blogs", path: "/blogs" },
        ])}
      />
      <JsonLd data={collectionGraph} />
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
            process, materials and structures, the people we work with, the
            projects we ship, sustainability with receipts, and the news from the
            four floors. {posts.length} entries, newest first.
          </p>
          <p style={{ marginTop: 12 }}>
            Want it in your inbox? Posts are emailed when finished. To be added
            to the mailing list, write to{" "}
            <a href="mailto:info@huamei.io">info@huamei.io</a>.
          </p>
        </div>
      </section>

      {/* All posts — by month */}
      {months.map((m) => (
        <section key={m.key} id={m.key} className="mg-cat">
          <div className="mg-cat-head">
            <div className="mg-cat-name">
              <span className="rn">{m.label.split(" ")[0].slice(0, 3)}.</span>
              <h2>
                {m.label.split(" ")[0]}
                <em> {m.label.split(" ")[1]}.</em>
              </h2>
            </div>
            <p className="mg-cat-intro">
              {m.posts.length} {m.posts.length === 1 ? "entry" : "entries"} this
              month.
            </p>
          </div>
          <ul className="mg-forth-list">
            {m.posts.map((p, i) => (
              <li
                key={p.slug}
                className="mg-forth-row mg-forth-row--live"
              >
                <Link href={`/blogs/${p.slug}`} className="mg-forth-link">
                  <span className="num">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="ttl">
                    {p.title}
                  </span>
                  <span className="when">{shortDate(p.publishedAt)}</span>
                </Link>
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
