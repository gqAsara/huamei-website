import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,

  async redirects() {
    return [
      // Enforce no trailing slash on every URL.
      { source: "/:path+/", destination: "/:path+", permanent: true },
      // /margin → /blogs (URL renamed 2026-05-04). Permanent (301) so any
      // crawlers that picked up the original /margin URLs migrate cleanly.
      { source: "/margin", destination: "/blogs", permanent: true },
      { source: "/margin/:slug*", destination: "/blogs/:slug*", permanent: true },
    ];
  },

  // studio.huamei.io → /studio rewrite is handled in src/proxy.ts (Next 16
  // proxy file convention, formerly middleware).
  // Doing it via next.config rewrites picks the wrong path on either side:
  // - beforeFiles intercepts /_next/static/* and breaks asset loading
  // - afterFiles fires too late; / has already matched the homepage route
  // Middleware runs first per request and its matcher cleanly excludes
  // /_next, /api, and metadata files.

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
