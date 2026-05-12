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
// Basic-auth gate for /admin/* paths (internal tools — HuameiGEO dashboard).
// Set ADMIN_PASSWORD in .env.local + Vercel prod env. Username can be anything;
// only the password is checked.
function checkAdminAuth(request: NextRequest): NextResponse | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null; // dev fallback — no password set, allow access
  const auth = request.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const presentedPass = decoded.split(":").slice(1).join(":");
      if (presentedPass === password) return null;
    } catch {
      // Fall through to challenge.
    }
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Huamei admin"' },
  });
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;

  // Gate /admin/* behind basic auth.
  if (path.startsWith("/admin")) {
    const challenge = checkAdminAuth(request);
    if (challenge) return challenge;
  }

  if (host === "studio.huamei.io") {
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
