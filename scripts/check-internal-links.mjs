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

// Collect known routes from src/app/ (looks for page.tsx / page.mdx).
// Dynamic segments like [slug] are recorded as prefix patterns so that
// /craft/magnetic, /volumes/yangshao, etc. resolve against /craft/[slug].
const routes = new Set(['/']);
const dynamicPrefixes = new Set(); // e.g. "/craft" for /craft/[slug]/page.tsx
for (const f of walk('src/app')) {
  if (f.endsWith('page.tsx') || f.endsWith('page.mdx')) {
    // Strip src/app prefix and page file suffix, then remove route groups
    // (e.g. (site)) from every segment, then rebuild the path.
    const segments = f
      .replace(/^src\/app\//, '')
      .replace(/\/page\.(tsx|mdx)$/, '')
      .split('/')
      .filter(s => s && !s.startsWith('(') && s !== '[lang]');
    let route = '/' + segments.join('/');
    route = route || '/';
    if (route.includes('[')) {
      // Dynamic route — record the static prefix so /prefix/anything resolves
      dynamicPrefixes.add(route.replace(/\/\[.*/, ''));
    } else {
      routes.add(route);
    }
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
    // Static route match or dynamic prefix match (/craft/magnetic → /craft)
    const isDynamic = [...dynamicPrefixes].some(p => link === p || link.startsWith(p + '/'));
    if (!routes.has(link) && !routes.has(link + '/') && !isDynamic && !link.startsWith('http')) {
      missing.add(`${f}: ${link}`);
    }
  }
}
if (missing.size === 0) console.log('internal-links: ok');
else { console.log('internal-links: ' + missing.size + ' unresolved'); for (const x of missing) console.log('  ' + x); }
process.exit(0);
