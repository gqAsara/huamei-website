/**
 * Sanity Studio mount point.
 *
 * Studio UI is a client SPA. This server-component shell forwards Sanity's
 * recommended metadata + viewport, then renders the client child.
 *
 * Auth + access control is handled by Sanity itself — only users invited to
 * the project (currently George + Jacky) can sign in.
 */

import type { Metadata, Viewport } from "next";
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

export default function StudioPage() {
  return <Studio />;
}
