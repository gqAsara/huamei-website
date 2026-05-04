#!/usr/bin/env node
// Post-Bash hook. After the agent runs `git push` or `vercel deploy` or similar,
// detect changed URLs from the most recent commit and fire IndexNow.
// Silent on success (exit 0). Never blocks (exit 0 even on transient errors).

import { execSync } from 'node:child_process';

function readToolPayload() {
  try {
    let chunks = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (chunks += c));
    return new Promise((res) => process.stdin.on('end', () => res(chunks)));
  } catch { return Promise.resolve(''); }
}

const payload = await readToolPayload();
const command = (() => { try { return JSON.parse(payload).tool_input?.command || ''; } catch { return ''; } })();

const shouldFire = /git push|vercel deploy|vercel --prod/.test(command);
if (!shouldFire) process.exit(0);

const key = process.env.INDEXNOW_KEY;
if (!key) { console.error('INDEXNOW_KEY env not set; skipping'); process.exit(0); }

let urls = [];
try {
  const changed = execSync('git diff-tree --no-commit-id --name-only -r HEAD', { encoding: 'utf8' })
    .split('\n').filter(Boolean);
  urls = changed
    .filter(p => p.startsWith('app/') && (p.endsWith('page.tsx') || p.endsWith('page.mdx')))
    .map(p => 'https://huamei.io' + p
      .replace(/^app/, '')
      .replace(/\/page\.(tsx|mdx)$/, '')
      .replace(/\/\(.*?\)/g, '')
      .replace(/\/$/, ''))
    .map(u => u || 'https://huamei.io/');
} catch { urls = ['https://huamei.io/']; }

if (urls.length === 0) process.exit(0);

const body = JSON.stringify({
  host: 'huamei.io',
  key,
  keyLocation: `https://huamei.io/${key}.txt`,
  urlList: urls,
});

try {
  execSync(`curl -s -X POST -H "Content-Type: application/json" -d '${body.replace(/'/g, "'\\''")}' https://api.indexnow.org/indexnow`, { stdio: 'pipe' });
  console.log(`indexnow: pinged ${urls.length} URLs`);
} catch (e) {
  console.error(`indexnow: ping failed (${e.message}); not blocking`);
}
process.exit(0);
