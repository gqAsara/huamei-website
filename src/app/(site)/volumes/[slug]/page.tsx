import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase, getVolumeNeighbours } from "@/lib/cases";
import { VOLUMES, type Volume } from "@/lib/volumes";
import { getAllVolumes, getVolumeBySlug } from "@/lib/sanity/queries";
import { CaseOpening } from "@/components/CaseOpening";
import { CaseCarousel } from "@/components/CaseCarousel";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { caseStudyService } from "@/lib/schema/service";
import "./case.css";

export async function generateStaticParams() {
  const sanityVolumes = await getAllVolumes();
  const list = sanityVolumes.length > 0 ? sanityVolumes : VOLUMES;
  return list.map((v) => ({ slug: v.slug }));
}

async function resolveVolume(slug: string): Promise<Volume | null> {
  const fromSanity = await getVolumeBySlug(slug);
  if (fromSanity) return fromSanity;
  return VOLUMES.find((v) => v.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  const vol = await resolveVolume(slug);
  const name = c?.name ?? vol?.name ?? "Volume";
  const tagline = c?.tagline ?? vol?.tag ?? "";
  return {
    title: `${name} · Case studies`,
    description: tagline,
    alternates: { canonical: `/volumes/${slug}` },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  const vol = await resolveVolume(slug);

  if (!c && !vol) notFound();

  const crumbName = c?.name ?? vol?.name ?? "Volume";
  const crumbs = breadcrumbList([
    { name: "Home", path: "/" },
    { name: "Case studies", path: "/volumes" },
    { name: crumbName, path: `/volumes/${slug}` },
  ]);

  // Per-page Service JSON-LD for portfolio indexability. Falls back to
  // the editorial brief / specification when the case has full content;
  // otherwise uses the catalogue-row tag line.
  const serviceJsonLd = vol
    ? caseStudyService({
        slug,
        name: vol.name,
        client: vol.client,
        tag: vol.tag,
        year: vol.year,
        category: vol.category,
        cover: vol.cover,
        photos: vol.photos,
      })
    : null;

  // Stub view for volumes without full case data yet
  if (!c) {
    return (
      <>
        <JsonLd data={crumbs} />
        {serviceJsonLd ? <JsonLd data={serviceJsonLd} /> : null}
        <div className="cs-back">
          <Link href="/volumes">← Return to Case studies</Link>
        </div>
        <main className="cs-wrap">
          <section className="cs-mast">
            <div className="rn">{vol!.num}.</div>
            <h1>{vol!.name}</h1>
            <div className="client">{vol!.client}</div>
            <p className="tag">{vol!.tag}</p>
            <div className="meta">
              <span>{vol!.year}</span>
              <span>{vol!.category}</span>
            </div>
          </section>
          {vol!.photos.length > 1 ? (
            <CaseCarousel photos={vol!.photos} alt={vol!.name} />
          ) : (
            <section className="cs-hero">
              <Image
                src={vol!.cover}
                alt={vol!.name}
                fill
                sizes="(max-width: 760px) 100vw, 1200px"
                priority
              />
            </section>
          )}
          <div className="cs-stub">
            <h2>
              <em>{vol!.name}</em> — case study in preparation.
            </h2>
            <p>
              The full plate, opening sequence, and specification for this volume are
              being typeset. In the meantime, the cover and core details are above —
              and the rest of the archive is one click away.
            </p>
            <div className="actions">
              <Link className="hm-plate" href="/volumes">
                <span className="roman">→</span> All case studies
              </Link>
              <Link className="hm-plate" href="/begin" style={{ background: "var(--paper)" }}>
                <span className="roman">→</span> Begin a project
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const neighbours = getVolumeNeighbours(slug);
  const prev = c.prev ?? neighbours.prev;
  const next = c.next ?? neighbours.next;

  return (
    <>
      <JsonLd data={crumbs} />
      {serviceJsonLd ? <JsonLd data={serviceJsonLd} /> : null}
      <div className="cs-back">
        <Link href="/volumes">← Return to Case studies</Link>
      </div>

      <main className="cs-wrap" id="csWrap">
        {/* Masthead */}
        <section className="cs-mast">
          <div className="rn">{c.number}.</div>
          <h1>{c.name}</h1>
          <div className="client">{c.client}</div>
          <p className="tag">{c.tagline}</p>
          <div className="meta">
            {c.year ? <span>{c.year}</span> : null}
            {c.month ? <span>{c.month}</span> : null}
            {c.tags.length ? <span>{c.tags.join(" · ")}</span> : null}
          </div>
        </section>

        {/* Hero */}
        <section className="cs-hero">
          <Image
            src={c.hero}
            alt={c.name}
            fill
            sizes="(max-width: 760px) 100vw, 1200px"
            priority
          />
        </section>

        {/* Colophon ledger */}
        {c.ledger.length ? (
          <dl className="cs-colophon">
            {c.ledger.map((k) => {
              const v = c.specification[k];
              if (!v) return null;
              return (
                <div className="cell" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              );
            })}
          </dl>
        ) : null}

        {/* Brief */}
        {c.brief.length ? (
          <section className="cs-brief">
            <div className="cs-brief-label">The brief</div>
            <div className="cs-brief-body">
              {c.brief.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {c.pullQuote ? (
              <div className="cs-pull">&ldquo;{c.pullQuote}&rdquo;</div>
            ) : null}
          </section>
        ) : null}

        {/* Opening sequence */}
        {c.openingSequence.length >= 2 ? (
          <CaseOpening frames={c.openingSequence} />
        ) : null}

        {/* Plates */}
        {c.plates.length ? (
          <section className="cs-plates">
            <div className="cs-plates-head">
              <h3>Details</h3>
              <div className="counter">{c.plates.length} Details</div>
            </div>
            <div className="cs-plates-grid">
              {c.plates.map((p, i) => (
                <figure
                  key={i}
                  className="cs-plate"
                  data-span={p.span ?? "tall"}
                  style={{ backgroundImage: `url('${p.photo}')` }}
                >
                  <span className="num">Detail {String(i + 1).padStart(2, "0")}</span>
                  {p.caption ? <div className="cap">{p.caption}</div> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Specification */}
        {Object.keys(c.specification).length ? (
          <section className="cs-spec">
            <div className="cs-spec-head">
              <h3>Specification</h3>
              <div className="stamp">Huamei &middot; Archive</div>
            </div>
            <div className="cs-spec-grid">
              {Object.entries(c.specification).map(([k, v]) => (
                <div className="cs-spec-row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Project CTA */}
        <section className="cs-project">
          <div className="kicker">Projects open &middot; Vol. XII</div>
          <h4>Want something in this register?</h4>
          <p>
            Every volume begins with a conversation — the object, the ceremony, the
            weight of the thing in the hand. Tell us what you are making.
          </p>
          <Link className="cta" href="/begin">
            Begin a conversation <span className="arrow">→</span>
          </Link>
          <span className="sub">or write to info@huamei.io</span>
        </section>

        {/* Endmark */}
        <footer className="cs-end">
          {prev ? (
            <Link className="cs-end-prev" href={`/volumes/${prev.slug}`}>
              <span className="dir">← Previous volume</span>
              <span className="ttl">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          <div className="cs-end-seal">
            <span className="mark">Huamei</span>Henan &middot; Zhejiang &middot; Sichuan &middot; Guizhou
          </div>
          {next ? (
            <Link className="cs-end-next" href={`/volumes/${next.slug}`}>
              <span className="dir">Next volume →</span>
              <span className="ttl">{next.name}</span>
            </Link>
          ) : (
            <span />
          )}
        </footer>
      </main>
    </>
  );
}
