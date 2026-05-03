import Image from "next/image";
import Link from "next/link";
import type { Topic } from "@/lib/topics";
import { TopicArchiveCarousel } from "./TopicArchiveCarousel";
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

export function TopicTemplate({ topic }: { topic: Topic }) {
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
          {topic.heroImage ? (
            <>
              <div className="figure">
                <Image
                  src={topic.heroImage}
                  alt={`${topic.title.replace(/\.$/, "")}${topic.italic?.replace(/\.$/, "") ?? ""} — basic version`}
                  fill
                  sizes="(max-width: 960px) 100vw, 360px"
                  priority
                />
              </div>
              <div className="figcap">
                <span className="rn">Pl. {topic.rn}</span>
                <em>The basic version &mdash; {topic.categoryLabel.toLowerCase()} study object.</em>
              </div>
            </>
          ) : null}
          <div className="tp-prose-pull">&ldquo;{topic.pullQuote}&rdquo;</div>
        </aside>
      </section>

      {/* IV. Related */}
      <div className="tp-sec-head">
        <h2>In the <em>archive.</em></h2>
        <Link
          href="/volumes"
          className="stamp"
          style={{
            borderBottom: ".5px solid var(--rule)",
            paddingBottom: 2,
            textDecoration: "none",
            color: "var(--ink-2)",
          }}
        >
          {topic.category === "industry" || topic.category === "craft"
            ? `All ${topic.related.length} ${topic.related.length === 1 ? "volume" : "volumes"} →`
            : "All volumes →"}
        </Link>
      </div>
      {topic.category === "industry" || topic.category === "craft" ? (
        <TopicArchiveCarousel related={topic.related} />
      ) : (
        <section className="tp-related-grid">
          {topic.related.map((r) => (
            <Link key={r.rn} className="tp-rel" href={r.href}>
              <div className="cover" style={{ backgroundImage: `url('${r.cover}')` }}>
                <span className="rn">{r.rn}</span>
              </div>
              <div className="meta">
                <span>{r.category}</span>
                <span>{r.year}</span>
              </div>
              <h4>{r.name}</h4>
              <div className="tag">{r.tag}</div>
            </Link>
          ))}
        </section>
      )}

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

      {/* VI. CTA */}
      <section className="tp-cta">
        <div className="kicker">{topic.ctaKicker}</div>
        <h3>{topic.ctaTitle}</h3>
        <p>{topic.ctaDesc}</p>
        <div className="actions">
          <Link className="hm-plate" href="/begin">
            <span className="roman">→</span> Begin
          </Link>
          <a className="alt" href="mailto:info@huamei.io">info@huamei.io</a>
        </div>
      </section>
    </main>
  );
}
