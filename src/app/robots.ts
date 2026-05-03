import type { MetadataRoute } from "next";

const SITE = "https://huamei.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/portal"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
