// BreadcrumbList helper. Each entry is { name, path }; the helper
// resolves to the schema.org BreadcrumbList shape with absolute URLs.

const SITE = "https://huamei.io" as const;

export type Crumb = { name: string; path: string };

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
  };
}
