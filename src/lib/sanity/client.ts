import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

if (!projectId) {
  // Don't throw at import time. Preview/dev builds may run without Sanity
  // env configured; downstream query helpers in queries.ts already early-
  // return when projectId is missing, so the stub client is never actually
  // used. We just need a typed object to keep imports happy.
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set; CMS-backed pages will be empty.",
  );
}

function makeStubClient(): SanityClient {
  const reject = () =>
    Promise.reject(
      new Error("Sanity client called without NEXT_PUBLIC_SANITY_PROJECT_ID"),
    );
  // Minimal proxy: every method/property returns a function that rejects.
  // queries.ts guards with `if (!projectId) return [];` so this is never
  // hit in the misconfigured-env path; the proxy is just defensive.
  return new Proxy({} as SanityClient, {
    get: () => reject,
  });
}

export const sanityClient: SanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : makeStubClient();

/**
 * Server-side write client. Only used by scripts and the AI intake API
 * route; never imported in static-rendered code.
 * Reads SANITY_WRITE_TOKEN from the environment. Token is editor-scoped.
 */
export function writeClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) {
    throw new Error(
      "Sanity write client requires NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN.",
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
