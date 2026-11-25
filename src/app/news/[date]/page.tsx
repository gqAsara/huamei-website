import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { displayablePhoto, formatNewsDate, getNewsIssue, localNewsDates, NEWS_URL } from "@/lib/news";
import { NewsPhoto } from "../NewsPhoto";
import { StudyResults } from "../StudyResults";

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
  const cover = issue.items.map((item) => displayablePhoto(item.image)).find(Boolean);
  return {
    title: issue.title, description: issue.summary,
    alternates: { canonical: url, types: {
      "application/rss+xml": NEWS_URL + "/feed.xml",
      ...(issue.study && { "text/csv": url + "/data.csv" }),
    } },
    openGraph: {
      type: "article", title: issue.title, description: issue.summary, url,
      publishedTime: issue.publishedAt ?? issue.date,
      section: issue.study ? "Packaging study" : "Packaging Q&A",
      ...(cover && { images: [{ url: new URL(cover.url, NEWS_URL), alt: cover.alt }] }),
    },
  };
}

export default async function NewsIssuePage({ params }: RouteProps) {
  const issue = await getNewsIssue((await params).date);
  if (!issue) notFound();
  const url = NEWS_URL + "/" + issue.date;
  const photos = issue.items.map((item) => displayablePhoto(item.image));
  const question = issue.items.length === 1 && issue.items[0].kind === "question" ? issue.items[0] : null;
  return (
    <main id="news-content" className="news-page news-detail">
      <JsonLd data={breadcrumbList([
        { name: "Home", path: "/" }, { name: "Packaging Q&A", path: "/news" },
        { name: issue.title, path: "/news/" + issue.date },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": issue.study ? "TechArticle" : "Article", "@id": url + "#article",
        url, headline: issue.title, description: issue.summary, inLanguage: "en",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: issue.publishedAt ?? issue.date,
        author: { "@type": "Organization", name: "Huamei", "@id": "https://huamei.io/#org", url: "https://huamei.io/" },
        publisher: { "@id": "https://huamei.io/#org" },
        image: photos.flatMap((photo) => photo ? [new URL(photo.url, NEWS_URL).href] : []),
        ...(issue.study && { articleSection: "Packaging study", hasPart: {
          "@type": "Dataset", "@id": url + "#data", name: issue.study.title, description: issue.study.method,
          url: url + "#data", variableMeasured: issue.study.columns,
          creator: { "@type": "Organization", "@id": "https://huamei.io/#org", name: "Huamei" },
          distribution: { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: url + "/data.csv" },
        } }),
        ...(question && { mainEntity: {
          "@type": "Question", name: issue.title,
          acceptedAnswer: { "@type": "Answer", text: [...new Set([issue.summary, question.summary, question.buyerNote])].join("\n\n") },
        } }),
      }} />
      <nav className="news-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/news">Packaging Q&amp;A</a></nav>
      <article>
        <header className="news-issue-head">
          <div className="news-meta"><time dateTime={issue.date}>{formatNewsDate(issue.date)}</time>{issue.study && <span> · Packaging study</span>}</div>
          <h1>{issue.title}</h1><p>{issue.summary}</p>
        </header>
        {question ? <div className="news-answer">
          {photos[0] && <NewsPhoto photo={photos[0]} eager />}
          {question.summary !== issue.summary && <p>{question.summary}</p>}
          <p className="news-buyer">{question.buyerNote}</p>
        </div> : issue.items.map((item, index) => <section className="news-item" id={"item-" + (index + 1)} key={item.title}>
          <h2>{item.title}</h2><p>{item.summary}</p>
          {photos[index] && <NewsPhoto photo={photos[index]} />}
          <p className="news-buyer"><strong>For packaging buyers</strong>{item.buyerNote}</p>
        </section>)}
        {issue.study && <StudyResults study={issue.study} date={issue.date} />}
      </article>
      <div className="news-related"><a href="/news">All packaging questions</a><a href="/#quote">Request a packaging quote</a></div>
    </main>
  );
}
