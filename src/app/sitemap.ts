import type { MetadataRoute } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { navCategories } from "@/lib/nav";
import { getAllBlogPosts } from "@/lib/blogs";

const SITE = "https://huamei.io";

// Next 16's sitemap generator does NOT XML-escape values it interpolates
// into <image:loc>, <loc>, etc. — see
// node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js
// We pre-escape so Sanity image URLs (which contain `&` for query params
// like `?w=1200&q=85`) don't break sitemap parsing.
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Check whether a /public-relative path actually exists on disk. Used to
// gate image:image sitemap entries — emitting an entry for a missing file
// signals a broken image to Google.
function publicFileExists(src: string | undefined): boolean {
  if (!src || src.startsWith("http")) return Boolean(src);
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

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
    "/house/standards",
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

  const blogs = getAllBlogPosts();

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
    ...blogs.map((p) => ({
      url: `${SITE}/blogs/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      // Only emit image entry when the file actually exists on disk —
      // otherwise the sitemap signals a broken image to Google. Pillar
      // 4's hero is referenced in frontmatter but pending founder upload;
      // this gate prevents the 404 from leaking into the sitemap.
      ...(publicFileExists(p.hero?.src)
        ? {
            images: [
              xmlEscape(
                p.hero!.src.startsWith("http")
                  ? p.hero!.src
                  : `${SITE}${p.hero!.src}`,
              ),
            ],
          }
        : {}),
    })),
  ];
}
