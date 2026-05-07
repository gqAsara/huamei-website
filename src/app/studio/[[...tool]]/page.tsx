import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Studio } from "./Studio";

// Studio is a client SPA; server just renders the shell. Dynamic-render
// rather than prerender — Sanity's bundle fails to prerender cleanly on
// Next 16 + Turbopack (known issue with sanity/next-sanity SSR).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Huamei Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default async function StudioPage() {
  // Read the host header so the Studio's basePath matches the URL the
  // browser actually shows. studio.huamei.io is host-rewritten to
  // /studio/*, so the browser URL is "/" while the Next route is
  // "/studio". Without this, Sanity's client router 404s on every page.
  const h = await headers();
  const host = h.get("host") ?? "";
  return <Studio host={host} />;
}
