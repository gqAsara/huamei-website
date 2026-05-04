#!/usr/bin/env node
// Stop hook. Verifies that .seo/state.json was not updated without a
// corresponding artifact. Only runs if state.json is dirty AND a tool was used
// during this turn (tracked in .seo/.last-tool-use). Validates state.json
// against the JSON schema if dirty.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

if (!existsSync('.seo/state.json')) process.exit(0);

let stateDirty = '';
try {
  stateDirty = execSync('git status --porcelain .seo/state.json', { encoding: 'utf8' }).trim();
} catch { process.exit(0); /* not a git repo */ }
if (!stateDirty) process.exit(0);

// Was a tool used this turn?
const toolMarker = '.seo/.last-tool-use';
let toolUsedRecently = false;
if (existsSync(toolMarker)) {
  const ageMs = Date.now() - statSync(toolMarker).mtimeMs;
  toolUsedRecently = ageMs < 5 * 60 * 1000; // 5 minutes
}
if (!toolUsedRecently) process.exit(0); // pure conversation turn — don't bother

// Schema validate state.json
try {
  const Ajv = (await import('ajv')).default;
  const addFormats = (await import('ajv-formats')).default;
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync('.seo/state.schema.json', 'utf8'));
  const data = JSON.parse(readFileSync('.seo/state.json', 'utf8'));
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error('⚠ state-integrity: .seo/state.json failed schema validation:');
    for (const e of validate.errors) console.error('  ' + ajv.errorsText([e]));
  }
} catch (e) {
  // ajv not installed yet — skip. The CI workflow will catch it.
}

// Phantom update check
let allChanges = [];
try {
  allChanges = execSync('git status --porcelain', { encoding: 'utf8' }).split('\n').filter(Boolean);
} catch { process.exit(0); }

const onlyState = allChanges.length === 1 && allChanges[0].includes('.seo/state.json');
if (onlyState) {
  console.error('⚠ state-integrity: .seo/state.json was updated this turn but no other artifact changed.');
  console.error('  Per CLAUDE.md rule 2, state.json updates should accompany a merged PR, published URL, or logged mention.');
}
process.exit(0);
