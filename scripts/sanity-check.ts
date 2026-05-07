import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  const out = await c.fetch(`{
    "caseStudies": count(*[_type=="caseStudy"]),
    "industries": count(*[_type=="industry"]),
    "industryNames": *[_type=="industry"] | order(order asc).title,
    "sample": *[_type=="caseStudy" && slug.current=="dukang"][0]{
      name, "cover": cover.asset->url, "photoCount": count(photos)
    }
  }`);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
