import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { displayablePhoto, formatNewsDate, getNewsIssues, NEWS_URL } from "@/lib/news";
import { NewsPhoto } from "./NewsPhoto";

const description = "Practical answers to everyday questions about choosing, measuring, using and recycling paper packaging.";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packaging Q&A",
  description,
  alternates: { canonical: NEWS_URL, types: { "application/rss+xml": NEWS_URL + "/feed.xml" } },
  openGraph: { title: "Packaging Q&A", description, url: NEWS_URL, type: "website" },
};

export default async function PackagingNewsPage() {
  const issues = await getNewsIssues();
  const [latest, ...archive] = issues;
  const cover = displayablePhoto(latest?.cover);
  const previousStudy = !latest?.hasStudy && archive.find((issue) => issue.hasStudy);
  return (
    <main id="news-content" className="news-page">
      <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, { name: "Packaging Q&A", path: "/news" }])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "CollectionPage", "@id": NEWS_URL + "#collection",
        url: NEWS_URL, name: "Packaging Q&A", description, inLanguage: "en",
        publisher: { "@id": "https://huamei.io/#org" },
        mainEntity: {
          "@type": "ItemList", numberOfItems: issues.length,
          itemListElement: issues.map((issue, index) => ({
            "@type": "ListItem", position: index + 1, name: issue.title, url: NEWS_URL + "/" + issue.date,
          })),
        },
      }} />
      <div className="news-crumb"><a href="/">Home</a><span aria-hidden="true">/</span>Packaging Q&amp;A</div>
      <header className="news-mast">
        <div><h1>Packaging Q&amp;A</h1><p>One everyday packaging question answered each day. Our weekly study includes the method, results and data you can download.</p></div>
        <div className="news-mast-links">
          {previousStudy && <a className="news-rss" href={"/news/" + previousStudy.date}>Latest packaging study</a>}
          <a className="news-rss" href="/news/feed.xml">RSS feed</a>
        </div>
      </header>
      {latest ? <section className={cover ? "news-lead news-lead-illustrated" : "news-lead"}>
        <div>
          <div className="news-meta"><time dateTime={latest.date}>{formatNewsDate(latest.date)}</time> · {latest.hasStudy ? "Packaging study" : "Latest question"}</div>
          <h2><a href={"/news/" + latest.date}>{latest.title}</a></h2>
          <p>{latest.summary}</p>
          <a className="news-action" href={"/news/" + latest.date}>Read the answer <span aria-hidden="true">→</span></a>
        </div>
        {cover && <NewsPhoto photo={cover} split eager />}
      </section> : <p className="news-empty">The first answer will appear here.</p>}
      {archive.length > 0 && <section className="news-archive">
        <h2>More packaging questions</h2>
        <ol>{archive.map((issue) => {
          const photo = displayablePhoto(issue.cover);
          return <li key={issue.date}>
            <div className="news-meta"><time dateTime={issue.date}>{formatNewsDate(issue.date)}</time>{issue.hasStudy && <span>Packaging study</span>}</div>
            <a href={"/news/" + issue.date}>{issue.title}</a>
            {photo && <Image className="news-archive-photo" src={photo.url} alt={photo.alt} width={112} height={75} sizes="112px" />}
          </li>;
        })}</ol>
      </section>}
      <div className="news-related"><a href="/volumes">Explore the packaging library</a><a href="/#quote">Request a packaging quote</a></div>
    </main>
  );
}
