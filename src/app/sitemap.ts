import type { MetadataRoute } from "next";
import { VOLUMES } from "@/lib/volumes";
import { navCategories } from "@/lib/nav";
import { getAllBlogPosts } from "@/lib/blogs";

const SITE = "https://huamei.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/craft",
    "/industry",
    "/blogs",
    "/house",
    "/house/philosophy",
    "/house/factory",
    "/house/certifications",
    "/house/people",
    "/volumes",
    "/begin",
    "/imprint",
  ];

  const subPaths = navCategories
    .flatMap((c) => c.columns ?? [])
    .flatMap((col) => col.items)
    .map((it) => it.href)
    .filter(
      (h): h is string =>
        typeof h === "string" &&
        (h.startsWith("/craft/") || h.startsWith("/industry/")),
    );
  const subPathsUnique = Array.from(new Set(subPaths));

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1.0 : 0.7,
    })),
    ...subPathsUnique.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...VOLUMES.map((v) => ({
      url: `${SITE}/volumes/${v.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllBlogPosts().map((p) => ({
      url: `${SITE}/blogs/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
