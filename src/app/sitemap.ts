import type { MetadataRoute } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { VOLUMES } from "@/lib/volumes";
import { navCategories } from "@/lib/nav";
import { getAllBlogPosts } from "@/lib/blogs";
import { getAllVolumes } from "@/lib/sanity/queries";

const SITE = "https://huamei.io";

// Check whether a /public-relative path actually exists on disk. Used to
// gate image:image sitemap entries — emitting an entry for a missing file
// signals a broken image to Google.
function publicFileExists(src: string | undefined): boolean {
  if (!src || src.startsWith("http")) return Boolean(src);
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Prefer Sanity (live, includes AI-generated case studies); fall back to
  // the static volumes.ts during build environments without Sanity envs.
  const sanityVolumes = await getAllVolumes();
  const volumes = sanityVolumes.length > 0 ? sanityVolumes : VOLUMES;
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
    ...volumes.map((v) => ({
      url: `${SITE}/volumes/${v.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      // Image sitemap entries — Google Images is a real top-of-funnel
      // for packaging buyers shopping by visual reference.
      images: [v.cover, ...v.photos].filter(
        (u): u is string => typeof u === "string" && u.length > 0,
      ),
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
              p.hero!.src.startsWith("http")
                ? p.hero!.src
                : `${SITE}${p.hero!.src}`,
            ],
          }
        : {}),
    })),
  ];
}
