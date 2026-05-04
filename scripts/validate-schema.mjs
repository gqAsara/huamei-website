#!/usr/bin/env node
// Validate every JSON-LD payload found in staged files (or in lib/schema/).
// v3: rotates validation-failures.log at 5MB.
// Exit code 0 = pass, 2 = block (PreToolUse hook contract).

import { readFileSync, readdirSync, statSync, existsSync, renameSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const REQUIRED_BY_TYPE = {
  Organization: ['@id', 'name', 'url', 'logo', 'description'],
  WebSite: ['@id', 'url', 'name', 'publisher'],
  LocalBusiness: ['@id', 'name', 'address', 'parentOrganization'],
  BreadcrumbList: ['itemListElement'],
  Article: ['headline', 'datePublished', 'author', 'publisher'],
  BlogPosting: ['headline', 'datePublished', 'author', 'publisher'],
  Product: ['name', 'description', 'brand'],
  DefinedTerm: ['name', 'description'],
};

const PLACEHOLDER_PATTERNS = [/XXXXXX/, /<<<.+>>>/, /Replace with/, /<TODO[^>]*>/];

function findJsonLdInFile(path) {
  const src = readFileSync(path, 'utf8');
  const blocks = [];
  if (extname(path) === '.json') {
    try { blocks.push({ json: JSON.parse(src), path }); } catch {}
    return blocks;
  }
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(src))) {
    try { blocks.push({ json: JSON.parse(m[1]), path }); }
    catch (e) { blocks.push({ error: e.message, path }); }
  }
  return blocks;
}

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue;
    const p = join(dir, name);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) yield* walk(p);
    else if (['.json', '.tsx', '.jsx', '.ts', '.js', '.mdx'].includes(extname(p))) yield p;
  }
}

function targets() {
  const stagedOnly = process.argv.includes('--staged-only');
  if (stagedOnly) {
    try {
      const out = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });
      return out.split('\n').filter(Boolean).filter(p => /\.(json|tsx?|jsx?|mdx)$/.test(p));
    } catch { return []; }
  }
  return [
    ...walk('lib/schema'),
    ...walk('src/lib/schema'),
    ...walk('app'),
    ...walk('src/app'),
    ...walk('.seo/templates/schema'),
  ].filter(p => /\.(json|tsx?|jsx?)$/.test(p));
}

function validateBlock({ json, path }) {
  const failures = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    const t = Array.isArray(node['@type']) ? node['@type'][0] : node['@type'];
    if (t && REQUIRED_BY_TYPE[t]) {
      for (const field of REQUIRED_BY_TYPE[t]) {
        if (!(field in node)) failures.push(`${path}: ${t} missing required field "${field}"`);
      }
    }
    for (const v of Object.values(node)) {
      if (Array.isArray(v)) v.forEach(visit);
      else if (typeof v === 'object') visit(v);
    }
  };
  visit(json);

  const isTemplate = path.includes('.seo/templates/');
  const flat = JSON.stringify(json);
  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(flat)) {
      const msg = `${path}: placeholder pattern ${pat} present`;
      failures.push(isTemplate ? `WARN: ${msg}` : `BLOCK: ${msg}`);
    }
  }
  return failures;
}

const allFailures = [];
for (const path of targets()) {
  for (const block of findJsonLdInFile(path)) {
    if (block.error) { allFailures.push(`${path}: JSON parse error — ${block.error}`); continue; }
    allFailures.push(...validateBlock(block));
  }
}

const blockers = allFailures.filter(f => f.startsWith('BLOCK:') || (!f.startsWith('WARN:') && f.includes(':')));

if (allFailures.length === 0) { console.log('schema: ok'); process.exit(0); }

console.error('schema validation findings:');
for (const f of allFailures) console.error('  ' + f);

if (blockers.length > 0) {
  try {
    const fs = await import('node:fs/promises');
    if (existsSync('.seo/reports')) {
      const logPath = '.seo/reports/validation-failures.log';
      // v3: rotate at 5MB
      if (existsSync(logPath) && statSync(logPath).size > 5 * 1024 * 1024) {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        renameSync(logPath, `${logPath}.${stamp}.log`);
      }
      const stamp = new Date().toISOString();
      await fs.appendFile(logPath, `${stamp}\n${blockers.join('\n')}\n---\n`);
    }
  } catch {}
  process.exit(2);
}
process.exit(0);
