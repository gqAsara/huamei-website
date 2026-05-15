#!/usr/bin/env node
/**
 * IndexNow batch ping with the correct POST + keyLocation form.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs <url1> <url2> ...
 *
 * Auto-includes https://huamei.io/sitemap.xml on every call.
 *
 * Env:
 *   INDEXNOW_KEY  (required)  — the IndexNow API key
 *
 * Or it falls back to discovering the key from the filename in public/*.txt.
 * Exit 0 on success or transient failure; never blocks.
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// .env.local fallback for local runs
{
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

function discoverKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const publicDir = resolve(process.cwd(), "public");
  if (!existsSync(publicDir)) return null;
  for (const f of readdirSync(publicDir)) {
    // IndexNow keys are typically 32+ hex chars in a .txt file
    if (/^[a-f0-9]{32,}\.txt$/.test(f)) {
      return f.replace(/\.txt$/, "");
    }
  }
  return null;
}

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("usage: indexnow-ping.mjs <url1> <url2> ...");
  process.exit(2);
}

const key = discoverKey();
if (!key) {
  console.error("indexnow: no INDEXNOW_KEY env and no key file in public/; skipping.");
  process.exit(0);
}

// Always include the sitemap so search engines re-crawl the index too.
const urlList = Array.from(new Set([...urls, "https://huamei.io/sitemap.xml"]));

const body = JSON.stringify({
  host: "huamei.io",
  key,
  keyLocation: `https://huamei.io/${key}.txt`,
  urlList,
});

try {
  const out = execSync(
    `curl -sS -X POST -H "Content-Type: application/json" -w "%{http_code}" -d '${body.replace(/'/g, "'\\''")}' https://api.indexnow.org/indexnow`,
    { encoding: "utf8" },
  );
  // Last 3 chars are the http code
  const code = out.slice(-3);
  if (code.startsWith("2")) {
    console.log(`indexnow: HTTP ${code} for ${urlList.length} URLs.`);
    process.exit(0);
  } else {
    console.error(`indexnow: HTTP ${code} — body: ${out.slice(0, -3)}`);
    process.exit(0); // never block
  }
} catch (e) {
  console.error(`indexnow: ping failed (${e.message}); not blocking`);
  process.exit(0);
}
