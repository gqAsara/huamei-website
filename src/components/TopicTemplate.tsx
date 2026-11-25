import Link from "next/link";
import type { Topic } from "@/lib/topics";
import "./topic.css";

function renderProse(line: string) {
  // Split on {em}...{/em} to render italics in CMS-friendly text.
  const parts = line.split(/(\{em\}.*?\{\/em\})/g);
  return parts.map((part, i) => {
    const m = part.match(/^\{em\}(.*?)\{\/em\}$/);
    if (m) return <em key={i}>{m[1]}</em>;
    return <span key={i}>{part}</span>;
  });
}

const sectorFilters: Record<string, string> = {
  cosmetic: "beauty", wellness: "beauty", spirits: "drinks", seasonal: "lifestyle",
};
const formatFilters: Record<string, string> = {
  rigid: "rigid", drawer: "drawer", folding: "carton", inserts: "inserts", shoppers: "bag",
};

export function TopicTemplate({ topic }: { topic: Topic }) {
  const sector = topic.category === "industry" ? sectorFilters[topic.slug] : undefined;
  const format = topic.category === "craft" ? formatFilters[topic.slug] : undefined;
  const filters = new URLSearchParams({ type: "boxes" });
  const quote = new URLSearchParams();
  if (sector) {
    filters.set("industry", sector);
    quote.set("industry", sector);
  }
  if (format) {
    filters.set("format", format);
    quote.set("format", format);
  }
  const quoteUrl = quote.size ? `/#quote?${quote}` : "/#quote";
  return (
    <main className="tp-wrap">
      {/* Masthead */}
      <section className="tp-mast">
        <div>
          <div className="crumbs">
            <Link href={topic.parentHref}>{topic.categoryLabel}</Link>
            <span className="sep">&middot;</span>
            <Link href={topic.parentHref}>{topic.parentLabel}</Link>
            <span className="sep">&middot;</span>
            {/* Final crumb is the topic itself */}
            {topic.title.replace(/\.$/, "")}
            {topic.italic ? topic.italic.replace(/\.$/, "") : ""}
          </div>
          <div className="rn">{topic.rn}</div>
          <h1>
            {topic.title}
            {topic.italic ? <em>{topic.italic}</em> : null}
          </h1>
          <div className="cn">{topic.cn}</div>
        </div>
        <div>
          <p className="lede">{topic.lede}</p>
          <div className="meta">
            {topic.meta.map((m, i) => (
              <span key={i}>
                {i > 0 ? <span className="dot">&middot;</span> : null}
                <span style={{ marginLeft: i > 0 ? 18 : 0 }}>{m}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* I. Prose */}
      <div className="tp-sec-head">
        <h2><em>What</em> it is.</h2>
        <span className="roman">i.</span>
      </div>
      <section className="tp-prose">
        <div className="tp-prose-side">i. Philosophy</div>
        <div className="tp-prose-body">
          {topic.prose.map((p, i) => (
            <p key={i}>{renderProse(p)}</p>
          ))}
        </div>
        <aside className="tp-prose-aside">
          <div className="tp-prose-pull">&ldquo;{topic.pullQuote}&rdquo;</div>
        </aside>
      </section>

      <div className="tp-sec-head">
        <h2>Packaging <em>references.</em></h2>
      </div>
      <section className="tp-readmore">
        <a className="tp-readmore-row" href={`/#cases?${filters}`}>
          <span className="tp-readmore-title">Browse packaging photographs</span>
          <span className="tp-readmore-desc">Choose a reference to include in your quotation request.</span>
          <span className="tp-readmore-arr" aria-hidden="true">→</span>
        </a>
      </section>

      {/* V. Specs */}
      <div className="tp-sec-head">
        <h2><em>Specification.</em></h2>
        <span className="stamp">Huamei &middot; Archive</span>
      </div>
      <dl className="tp-specs">
        {topic.specs.map((s) => (
          <div className="row" key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* VI. Buyer FAQ — added 2026-05-11 as commercial-intent layering.
          Plain on-page Q&A, NOT FAQPage schema (per SEO_CONTEXT.md: Google
          restricted FAQPage rich results to gov/health domains in 2023). */}
      {topic.buyerFaq?.length ? (
        <>
          <div className="tp-sec-head">
            <h2>What <em>buyers ask</em> first.</h2>
            <span className="stamp">Huamei &middot; FAQ</span>
          </div>
          <section className="tp-faq">
            {topic.buyerFaq.map((f, i) => (
              <div className="tp-faq-row" key={i}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        </>
      ) : null}

      {/* VI-b. Related blog posts (cluster + pillar links). Wires the
          hub-and-spoke architecture: this commercial page → investigative
          long-form content. */}
      {topic.relatedBlogs?.length ? (
        <>
          <div className="tp-sec-head">
            <h2>Read <em>further.</em></h2>
            <span className="stamp">Notes from the press floor</span>
          </div>
          <section className="tp-readmore">
            {topic.relatedBlogs.map((b) => (
              <Link key={b.slug} className="tp-readmore-row" href={`/blogs/${b.slug}`}>
                <span className="tp-readmore-title">{b.title}</span>
                {b.description ? <span className="tp-readmore-desc">{b.description}</span> : null}
                <span className="tp-readmore-arr">→</span>
              </Link>
            ))}
          </section>
        </>
      ) : null}

      {/* VII. CTA */}
      <section className="tp-cta">
        <div className="kicker">{topic.ctaKicker}</div>
        <h3>{topic.ctaTitle}</h3>
        <p>{topic.ctaDesc}</p>
        <div className="actions">
          <a className="hm-plate" href={quoteUrl}>
            <span className="roman">→</span> Request a quote
          </a>
          <a className="alt" href="mailto:jackychan@huamei.io">jackychan@huamei.io</a>
        </div>
      </section>
    </main>
  );
}
