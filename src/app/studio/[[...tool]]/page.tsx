/**
 * Sanity Studio mount point.
 *
 * Studio UI is a client SPA. This server-component shell forwards Sanity's
 * recommended metadata + viewport, then renders the client child.
 *
 * Auth + access control is handled by Sanity itself — only users invited to
 * the project (currently George + Jacky) can sign in.
 */

import { Studio } from "./Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
