import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { zhHansLocale } from "@sanity/locale-zh-hans";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Don't throw here — would break server prerender + Studio module load.
// Studio surfaces its own friendly auth/config error if projectId is empty.
if (!projectId && typeof window !== "undefined") {
  console.warn("[sanity.config] NEXT_PUBLIC_SANITY_PROJECT_ID missing");
}

/**
 * Build the Studio config with a runtime-determined basePath.
 *
 * Two valid hosts:
 *   - studio.huamei.io  → basePath "/" (host-rewritten subdomain)
 *   - huamei.io/studio  → basePath "/studio" (default)
 *
 * The factory lets the Studio component pick the correct basePath
 * based on the request's host header (passed from the server) so
 * Studio's internal client router lines up with the URL the
 * browser actually shows.
 */
export function buildConfig({ basePath = "/studio" }: { basePath?: string } = {}) {
  return defineConfig({
    name: "huamei",
    title: "Huamei Studio",
    basePath,
    projectId,
    dataset,
    plugins: [
      structureTool({
        structure: (S) =>
          S.list()
            .title("Content")
            .items([
              // Primary editor surface — submit a new case study.
              S.listItem()
                .title("📷 New / past submissions · 案例上传")
                .child(
                  S.documentTypeList("caseStudySubmission")
                    .title("Submissions")
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),
              S.divider(),
              // Admin surface — view what the AI has produced.
              S.listItem()
                .title("📚 Published case studies (read-only for editors)")
                .child(
                  S.documentTypeList("caseStudy")
                    .title("Case studies")
                    .defaultOrdering([
                      { field: "featured", direction: "desc" },
                      { field: "year", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("🏷️ Industries")
                .child(
                  S.documentTypeList("industry")
                    .title("Industries")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
            ]),
      }),
      visionTool(),
      zhHansLocale({ title: "简体中文" }),
    ],
    schema: { types: schemaTypes },
  });
}

// Default export keeps `npx sanity` CLI working (it imports the default).
export default buildConfig();
