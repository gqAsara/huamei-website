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
    // Permissive starter CSP. Allows what the site actually loads:
    //  - GA4 (gtag) script + analytics endpoint
    //  - Sanity image CDN, API, WebSocket (for Studio realtime)
    //  - Resend (form action posts to /api/commission, internal — not in
    //    form-action; Resend is server-to-server)
    //  - Inline scripts/styles (Next.js + Sanity Studio both need them)
    // 'unsafe-eval' is required by Sanity Studio for its dynamic schema
    // loading. Tighten over time via a stricter CSP scoped to non-studio
    // routes if needed.
    const csp = [
      "default-src 'self' https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.sanity.io https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://www.google-analytics.com https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://*.sanity.io wss://*.sanity.io https://api.resend.com https://*.vercel-insights.com",
      "frame-src 'self' https://*.sanity.io",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

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
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
