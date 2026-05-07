import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

if (!projectId) {
  // Don't throw at import time — let pages render with empty data so the build
  // doesn't break before envs are configured. The server fetchers will return
  // empty arrays and individual pages will 404 gracefully.
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set; CMS-backed pages will be empty."
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Server-side write client. Only used by scripts; never imported in /app code.
 * Reads SANITY_WRITE_TOKEN from the environment. Token is editor-scoped.
 */
export function writeClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "SANITY_WRITE_TOKEN is not set. Add it to .env.local for migration scripts."
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
