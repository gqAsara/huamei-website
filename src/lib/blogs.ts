import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type BlogAuthor = {
  name: string;
  role: string;
  tenure?: string;
  factory?: string;
  url?: string;
};

export type BlogExternalCitation = { url: string; what: string };

export type BlogHero = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  intent?: string;
  wordCount?: number;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt: string;
  hero?: BlogHero;
  internalLinks?: string[];
  externalCitations?: BlogExternalCitation[];
  featuredSnippet?: { question: string; answer: string };
  html: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blogs");

function read(slug: string): BlogPost | null {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content, { async: false }) as string;
  return {
    slug,
    title: data.title,
    description: data.description,
    primaryKeyword: data.primaryKeyword,
    secondaryKeywords: data.secondaryKeywords,
    intent: data.intent,
    wordCount: data.wordCount,
    author: data.author,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    hero: data.hero,
    internalLinks: data.internalLinks,
    externalCitations: data.externalCitations,
    featuredSnippet: data.featuredSnippetTarget,
    html,
  };
}

export function getBlogPost(slug: string): BlogPost | null {
  return read(slug);
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogSlugs()
    .map((s) => read(s))
    .filter((p): p is BlogPost => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}
