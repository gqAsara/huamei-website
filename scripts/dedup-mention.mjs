#!/usr/bin/env node
// Check whether a URL is already in mentions.csv before append.
// Usage: node scripts/dedup-mention.mjs <url>
// Exit 0 = not yet logged, ok to append. Exit 1 = already logged.
import { readFileSync, existsSync } from 'node:fs';
const url = process.argv[2];
if (!url) { console.error('usage: node scripts/dedup-mention.mjs <url>'); process.exit(2); }
const path = '.seo/reports/mentions.csv';
if (!existsSync(path)) process.exit(0);
const lines = readFileSync(path, 'utf8').split('\n').slice(1).filter(Boolean);
for (const line of lines) {
  const cols = line.split(',');
  if (cols[2] && cols[2].trim() === url.trim()) {
    console.error(`mention already logged on ${cols[0]}: ${url}`);
    process.exit(1);
  }
}
console.log(`new: ${url}`);
process.exit(0);
