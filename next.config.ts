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

  async rewrites() {
    // Serve the Sanity Studio at studio.huamei.io. Internally everything is
    // mounted at /studio; this rewrites the subdomain's path tree so the
    // browser URL stays studio.huamei.io while the Next route is /studio/*.
    //
    // afterFiles (not beforeFiles) so Next's static asset handler resolves
    // /_next/static/*, /favicon.ico, etc. against the filesystem first —
    // otherwise the rewrite turns those requests into Studio HTML and the
    // page renders blank because chunks parse as garbage.
    return {
      afterFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "studio.huamei.io" }],
          destination: "/studio/:path*",
        },
      ],
    };
  },

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
