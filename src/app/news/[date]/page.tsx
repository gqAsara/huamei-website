import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { formatNewsDate, getNewsIssue, localNewsDates, NEWS_URL } from "@/lib/news";

type RouteProps = { params: Promise<{ date: string }> };

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return localNewsDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const issue = await getNewsIssue((await params).date);
  if (!issue) notFound();
  const url = NEWS_URL + "/" + issue.date;
  return {
    title: issue.title, description: issue.summary,
    alternates: { canonical: url, types: { "application/rss+xml": NEWS_URL + "/feed.xml" } },
    openGraph: {
      type: "article", title: issue.title, description: issue.summary, url,
      publishedTime: issue.publishedAt ?? issue.date,
    },
  };
}

export default async function NewsIssuePage({ params }: RouteProps) {
  const issue = await getNewsIssue((await params).date);
  if (!issue) notFound();
  const url = NEWS_URL + "/" + issue.date;
  return (
    <main id="news-content" className="news-page news-detail">
      <JsonLd data={breadcrumbList([
        { name: "Home", path: "/" }, { name: "Packaging news", path: "/news" },
        { name: issue.title, path: "/news/" + issue.date },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article", "@id": url + "#article",
        url, headline: issue.title, description: issue.summary, inLanguage: "en",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: issue.publishedAt ?? issue.date,
        author: { "@type": "Organization", name: "Huamei", "@id": "https://huamei.io/#org", url: "https://huamei.io/" },
        publisher: { "@id": "https://huamei.io/#org" },
        citation: issue.items.map((item) => ({
          "@type": "CreativeWork", url: item.sourceUrl,
          publisher: { "@type": "Organization", name: item.sourceName }, datePublished: item.sourceDate,
        })),
      }} />
      <nav className="news-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/news">Packaging news</a></nav>
      <article>
        <header className="news-issue-head">
          <div className="news-meta"><time dateTime={issue.date}>{formatNewsDate(issue.date)}</time><span>By Huamei</span></div>
          <h1>{issue.title}</h1><p>{issue.summary}</p>
        </header>
        {issue.items.map((item, index) => <section className="news-item" id={"item-" + (index + 1)} key={item.sourceUrl}>
          {item.kind === "reference" && <div className="news-meta">Source note</div>}
          <h2>{item.title}</h2><p>{item.summary}</p>
          <p className="news-buyer"><strong>For packaging buyers</strong>{item.buyerNote}</p>
          <p className="news-citation">Source published <time dateTime={item.sourceDate}>{formatNewsDate(item.sourceDate)}</time> · <a href={item.sourceUrl}>{item.sourceName}</a></p>
        </section>)}
      </article>
      <div className="news-related"><a href="/news">All packaging news</a><a href="/#quote">Discuss a packaging brief</a></div>
    </main>
  );
}
