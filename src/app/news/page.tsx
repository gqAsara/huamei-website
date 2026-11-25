import type { Metadata } from "next";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { formatNewsDate, getNewsIssue, getNewsIssues, NEWS_URL } from "@/lib/news";

const description = "Daily source-linked coverage of paper packaging, materials, recycling and developments that affect packaging buyers.";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packaging news",
  description,
  alternates: { canonical: NEWS_URL, types: { "application/rss+xml": NEWS_URL + "/feed.xml" } },
  openGraph: { title: "Packaging news", description, url: NEWS_URL, type: "website" },
};

export default async function PackagingNewsPage() {
  const issues = await getNewsIssues();
  const [latest, ...archive] = issues;
  const headlines = latest ? (await getNewsIssue(latest.date))?.items ?? [] : [];
  return (
    <main id="news-content" className="news-page">
      <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, { name: "Packaging news", path: "/news" }])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "CollectionPage", "@id": NEWS_URL + "#collection",
        url: NEWS_URL, name: "Packaging news", description, inLanguage: "en",
        publisher: { "@id": "https://huamei.io/#org" },
        mainEntity: {
          "@type": "ItemList", numberOfItems: issues.length,
          itemListElement: issues.map((issue, index) => ({
            "@type": "ListItem", position: index + 1, name: issue.title, url: NEWS_URL + "/" + issue.date,
          })),
        },
      }} />
      <div className="news-crumb"><a href="/">Home</a><span aria-hidden="true">/</span>Packaging news</div>
      <header className="news-mast">
        <div><h1>Packaging news</h1><p>Daily briefings on paper packaging, sourcing and recycling. Each edition links to the original reports and explains what buyers can take from them.</p></div>
        <a className="news-rss" href="/news/feed.xml">RSS feed</a>
      </header>
      {latest ? <section className="news-lead">
        <div className="news-meta"><time dateTime={latest.date}>{formatNewsDate(latest.date)}</time> · Latest edition</div>
        <h2><a href={"/news/" + latest.date}>{latest.title}</a></h2>
        <p>{latest.summary}</p>
        {headlines.length > 1 && <ul className="news-headlines" aria-label="Inside this edition">
          {headlines.map((item, index) => <li key={item.sourceUrl}>
            <a href={"/news/" + latest.date + "#item-" + (index + 1)}>{item.title}</a>
          </li>)}
        </ul>}
        <a className="news-action" href={"/news/" + latest.date}>Read the briefing <span aria-hidden="true">→</span></a>
      </section> : <p className="news-empty">The first edition will appear here.</p>}
      {archive.length > 0 && <section className="news-archive">
        <h2>Earlier editions</h2>
        <ol>{archive.map((issue) => <li key={issue.date}><time dateTime={issue.date}>{formatNewsDate(issue.date)}</time><a href={"/news/" + issue.date}>{issue.title}</a></li>)}</ol>
      </section>}
      <div className="news-related"><a href="/volumes">Explore the packaging library</a><a href="/#quote">Request a packaging quote</a></div>
    </main>
  );
}
