/**
 * Quick check: how many GEO runs in the last N minutes? Used during
 * cron probe debugging to verify the chain is making progress.
 */

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
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function main() {
  const minutes = Number(process.argv[2] ?? 10);
  const cutoff = new Date(Date.now() - minutes * 60_000).toISOString();

  const runs = await c.fetch<{ runAt: string; engine: string; error: string | null; prompt: { text: string } | null }[]>(
    `*[_type == "geoRun" && runAt > $cutoff] | order(runAt desc) {
      runAt, engine, error, "prompt": prompt->{text}
    }`,
    { cutoff },
  );

  console.log(`Runs in last ${minutes} min: ${runs.length}`);
  const errCount = runs.filter((r) => r.error).length;
  console.log(`  ok:     ${runs.length - errCount}`);
  console.log(`  error:  ${errCount}`);
  if (runs.length > 0) {
    console.log(`  latest: ${runs[0].runAt}  ${runs[0].engine}  "${runs[0].prompt?.text?.slice(0, 60)}"`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
