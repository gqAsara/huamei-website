import { NextResponse, type NextRequest } from "next/server";

/**
 * Host-based rewrite for studio.huamei.io.
 *
 * studio.huamei.io is added as a Vercel domain alias for huamei.io. By
 * default that means it serves the marketing homepage. This middleware
 * intercepts every request and, when the Host header is the studio
 * subdomain, rewrites the path tree to /studio/* so the Sanity Studio
 * (mounted at the catch-all route /studio/[[...tool]]) handles it.
 *
 * The matcher below excludes /_next/static, /_next/image, and metadata
 * files so static assets are served without going through this middleware
 * (otherwise they'd also get rewritten and the browser would receive
 * Studio HTML where it expects JS/CSS).
 *
 * Browser URL stays as the user typed (studio.huamei.io/...); only the
 * internal route changes.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === "studio.huamei.io") {
    const path = request.nextUrl.pathname;
    if (!path.startsWith("/studio")) {
      const url = request.nextUrl.clone();
      url.pathname = path === "/" ? "/studio" : `/studio${path}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match every request path except:
     *  - /_next/static  (compiled JS/CSS chunks)
     *  - /_next/image   (image optimization)
     *  - /favicon.ico, /robots.txt, /sitemap.xml, /apple-icon.png, /icon.png
     *  - /opengraph-image, /BingSiteAuth.xml, IndexNow key file
     *  - /api/*         (server routes — never want to rewrite these)
     */
    "/((?!_next/static|_next/image|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|apple-icon\\.png|icon\\.png|opengraph-image|BingSiteAuth\\.xml|.*\\.txt$).*)",
  ],
};
