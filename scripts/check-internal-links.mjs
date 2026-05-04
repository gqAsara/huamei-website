#!/usr/bin/env node
// Walk content/ and ensure every internal link resolves to a known route.
// Exit 0 always (advisory) — hooks should not block on link checks.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

// Collect known routes from app/ (very rough — looks for page.tsx / page.mdx)
const routes = new Set(['/']);
for (const f of walk('app')) {
  if (f.endsWith('page.tsx') || f.endsWith('page.mdx')) {
    let route = '/' + f.replace(/^app\//, '').replace(/\/page\.(tsx|mdx)$/, '').replace(/\/\(.*?\)/g, '');
    route = route.replace(/\/\[lang\]/, ''); // strip locale segment for relative checks
    routes.add(route || '/');
  }
}

const missing = new Set();
const linkRe = /\[[^\]]*\]\((\/[^)\s]+)\)/g;
for (const f of walk('content')) {
  if (!['.md', '.mdx'].includes(extname(f))) continue;
  const src = readFileSync(f, 'utf8');
  let m;
  while ((m = linkRe.exec(src))) {
    const link = m[1].split('#')[0].split('?')[0].replace(/\/$/, '');
    if (!routes.has(link) && !routes.has(link + '/') && !link.startsWith('http')) {
      missing.add(`${f}: ${link}`);
    }
  }
}
if (missing.size === 0) console.log('internal-links: ok');
else { console.log('internal-links: ' + missing.size + ' unresolved'); for (const x of missing) console.log('  ' + x); }
process.exit(0);
