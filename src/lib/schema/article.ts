import type { MarginPost } from "@/lib/margin";

const SITE = "https://huamei.io";

export function articleGraph(post: MarginPost) {
  const url = `${SITE}/margin/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    inLanguage: "en",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.url ? `${SITE}${post.author.url}` : undefined,
      jobTitle: post.author.role,
    },
    publisher: { "@id": `${SITE}#organization` },
    image: post.hero ? `${SITE}${post.hero.src}` : undefined,
    keywords: [
      post.primaryKeyword,
      ...(post.secondaryKeywords ?? []),
    ].filter(Boolean),
    citation: post.externalCitations?.map((c) => ({
      "@type": "CreativeWork",
      url: c.url,
      name: c.what,
    })),
  };
}
