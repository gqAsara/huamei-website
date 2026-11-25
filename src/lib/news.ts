import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const NEWS_URL = "https://huamei.io/news";
const directory = join(process.cwd(), "content", "news");
const isoDay = /^\d{4}-\d{2}-\d{2}$/;
const summaryFields = "date, publishedAt, title, summary";
const issueFields = summaryFields + ", items[]{title, summary, buyerNote, sourceName, sourceUrl, sourceDate, kind}";

export type NewsItem = {
  title: string;
  summary: string;
  buyerNote: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
  kind?: "news" | "reference";
};

export type NewsSummary = {
  date: string;
  publishedAt?: string | null;
  title: string;
  summary: string;
};

export type NewsIssue = NewsSummary & { items: NewsItem[] };

const shanghaiDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
});
const displayDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC", year: "numeric", month: "long", day: "numeric",
});

export function formatNewsDate(date: string): string {
  return displayDate.format(new Date(date + "T12:00:00Z"));
}

function validDay(value: string): boolean {
  if (!isoDay.test(value)) return false;
  const timestamp = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function isPublic(summary: NewsSummary, now: Date): boolean {
  if (!summary || !validDay(summary.date) || summary.date > shanghaiDate.format(now) ||
      typeof summary.title !== "string" || !summary.title.trim() ||
      typeof summary.summary !== "string" || !summary.summary.trim()) return false;
  if (summary.publishedAt == null) return true;
  const timestamp = Date.parse(summary.publishedAt);
  return Number.isFinite(timestamp) && /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(summary.publishedAt) &&
    shanghaiDate.format(new Date(timestamp)) === summary.date && timestamp <= now.getTime();
}

function validItem(item: NewsItem, date: string): boolean {
  return item && [item.title, item.summary, item.buyerNote, item.sourceName].every(
    (text) => typeof text === "string" && text.trim().length > 0,
  ) && validDay(item.sourceDate) && item.sourceDate <= date &&
    URL.canParse(item.sourceUrl) && new URL(item.sourceUrl).protocol === "https:" &&
    (!item.kind || item.kind === "news" || item.kind === "reference");
}

function validIssue(issue: NewsIssue, date: string, now: Date): boolean {
  return isPublic(issue, now) && issue.date === date && Array.isArray(issue.items) &&
    issue.items.length > 0 && issue.items.every((item) => validItem(item, date));
}

function localIssue(date: string, now: Date): NewsIssue | null {
  const file = join(directory, date + ".json");
  if (!existsSync(file)) return null;
  const issue = JSON.parse(readFileSync(file, "utf8")) as NewsIssue;
  return validIssue(issue, date, now) ? issue : null;
}

export function localNewsDates(): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .map((file) => file.slice(0, 10));
}

async function querySanity<T>(query: string, params: Record<string, string>): Promise<T | null> {
  const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!project) return null;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const version = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
  if (!/^[a-z0-9-]+$/.test(project) || !/^[a-z0-9_-]+$/.test(dataset) || !isoDay.test(version)) {
    console.warn("[packaging-news] Invalid public CMS configuration; serving checked-in editions.");
    return null;
  }
  const url = new URL(`https://${project}.api.sanity.io/v${version}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  url.searchParams.set("returnQuery", "false");
  for (const [key, value] of Object.entries(params)) url.searchParams.set("$" + key, JSON.stringify(value));
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4500), next: { revalidate: 60, tags: ["packaging-news"] } });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const payload = await response.json() as { result?: T };
    return payload.result ?? null;
  } catch (error) {
    console.warn("[packaging-news] Public CMS read unavailable; serving checked-in editions.", error instanceof Error ? error.name + ": " + error.message : "Read failed");
    return null;
  }
}

export async function getNewsIssue(date: string, now = new Date()): Promise<NewsIssue | null> {
  if (!validDay(date) || date > shanghaiDate.format(now)) return null;
  const issue = await querySanity<NewsIssue>(
    `*[_type == "packagingNewsEdition" && _id == $id && date == $day][0]{${issueFields}}`,
    { id: "packagingNews-" + date, day: date },
  );
  return issue && validIssue(issue, date, now) ? issue : localIssue(date, now);
}

export async function getNewsIssues(limit = Infinity, now = new Date()): Promise<NewsSummary[]> {
  const entries = new Map<string, NewsSummary>();
  for (const date of localNewsDates()) {
    const issue = localIssue(date, now);
    if (issue) entries.set(date, issue);
  }
  const size = Math.min(100, limit);
  // Public document IDs have no dots. Each day has one stable ID; drafts and
  // scheduled versions cannot enter this archive. Lists fetch only summaries.
  const filter = '_type == "packagingNewsEdition" && _id == "packagingNews-" + date && date <= $through';
  let publicRows = 0;
  for (let offset = 0; size > 0; offset += size) {
    const rows = await querySanity<NewsSummary[]>(
      `*[${filter}] | order(date desc)[${offset}...${offset + size}]{${summaryFields}}`,
      { through: shanghaiDate.format(now) },
    );
    if (!Array.isArray(rows)) break;
    for (const row of rows) {
      if (!isPublic(row, now)) continue;
      entries.set(row.date, row);
      publicRows++;
    }
    if (rows.length < size || publicRows >= limit) break;
  }
  return [...entries.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
