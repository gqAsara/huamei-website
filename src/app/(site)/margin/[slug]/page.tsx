import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMarginPost, getAllMarginSlugs } from "@/lib/margin";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { articleGraph } from "@/lib/schema/article";
import "./post.css";

export async function generateStaticParams() {
  return getAllMarginSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getMarginPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/margin/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author.name,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function MarginPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getMarginPost(slug);
  if (!post) notFound();

  const crumbs = breadcrumbList([
    { name: "Home", path: "/" },
    { name: "Margin", path: "/margin" },
    { name: post.title, path: `/margin/${slug}` },
  ]);

  return (
    <main className="mp-wrap">
      <JsonLd data={crumbs} />
      <JsonLd data={articleGraph(post)} />

      <div className="mp-back">
        <Link href="/margin">← Return to Margin</Link>
      </div>

      <article className="mp-article">
        <header className="mp-head">
          <div className="mp-kicker">Margin · the Huamei journal</div>
          <h1 className="mp-h1">{post.title}</h1>
          <div className="mp-byline">
            <span className="by">
              By <strong>{post.author.name}</strong>
              {post.author.role ? `, ${post.author.role}` : ""}
              {post.author.tenure ? ` · ${post.author.tenure}` : ""}
            </span>
            <span className="dot">·</span>
            <span className="dt">Updated {formatDate(post.updatedAt)}</span>
          </div>
        </header>

        {post.hero ? (
          <figure className="mp-hero">
            <div className="img">
              <Image
                src={post.hero.src}
                alt={post.hero.alt}
                fill
                sizes="(max-width: 960px) 100vw, 880px"
                priority
              />
            </div>
            {post.hero.alt ? <figcaption>{post.hero.alt}</figcaption> : null}
          </figure>
        ) : null}

        <div
          className="mp-prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.externalCitations?.length ? (
          <aside className="mp-cites" aria-label="External citations">
            <div className="lbl">Cited</div>
            <ul>
              {post.externalCitations.map((c) => (
                <li key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.what}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </article>
    </main>
  );
}
