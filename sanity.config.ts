import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Don't throw here — would break server prerender + Studio module load.
// Studio surfaces its own friendly auth/config error if projectId is empty.
if (!projectId && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn("[sanity.config] NEXT_PUBLIC_SANITY_PROJECT_ID missing");
}

export default defineConfig({
  name: "huamei",
  title: "Huamei Studio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Case studies")
              .child(
                S.documentTypeList("caseStudy")
                  .title("Case studies")
                  .defaultOrdering([
                    { field: "featured", direction: "desc" },
                    { field: "year", direction: "desc" },
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("Industries")
              .child(
                S.documentTypeList("industry")
                  .title("Industries")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
