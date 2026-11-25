import { displayablePhoto, getNewsIssues, NEWS_URL } from "@/lib/news";

export const dynamic = "force-static";
export const revalidate = 60;

function escapeXml(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export async function GET() {
  const issues = await getNewsIssues(30);
  const items = issues.map((issue) => {
    const url = NEWS_URL + "/" + issue.date;
    const date = issue.publishedAt ? "<pubDate>" + new Date(issue.publishedAt).toUTCString() + "</pubDate>" : "";
    const cover = displayablePhoto(issue.cover);
    const media = cover
      ? '<media:content medium="image" url="' + escapeXml(new URL(cover.url, NEWS_URL).href) + '">' +
        '<media:description type="plain">' + escapeXml(cover.alt) + '</media:description></media:content>'
      : "";
    return "<item><title>" + escapeXml(issue.title) + "</title><link>" + url + "</link>" +
      "<guid isPermaLink=\"true\">" + url + "</guid>" + date +
      (issue.hasStudy ? "<category>Packaging study</category>" : "") +
      "<description>" + escapeXml(issue.summary) + "</description>" + media + "</item>";
  });
  const rss = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/"><channel>' +
    '<title>Huamei Packaging Q&amp;A</title><link>' + NEWS_URL + '</link>' +
    '<description>Practical answers to everyday paper packaging questions.</description><language>en</language>' +
    '<atom:link href="' + NEWS_URL + '/feed.xml" rel="self" type="application/rss+xml"/>' +
    items.join("\n") + '</channel></rss>';
  return new Response(rss, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
