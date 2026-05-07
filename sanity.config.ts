import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local " +
      "(see /Users/.../huamei-website/.env.local) and to Vercel project env."
  );
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
