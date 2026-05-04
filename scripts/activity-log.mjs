#!/usr/bin/env node
// Append a line to .seo/reports/activity.log with rotation at 5MB.
// Usage: node scripts/activity-log.mjs <agent> <action> <artifact-or-url>
import { appendFileSync, existsSync, statSync, renameSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [agent, action, artifact] = process.argv.slice(2);
if (!agent || !action) { console.error('usage: activity-log.mjs <agent> <action> [artifact]'); process.exit(2); }

const path = '.seo/reports/activity.log';
mkdirSync(dirname(path), { recursive: true });

if (existsSync(path) && statSync(path).size > 5 * 1024 * 1024) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  renameSync(path, `${path}.${stamp}.log`);
}

const ts = new Date().toISOString();
appendFileSync(path, `${ts}\t${agent}\t${action}\t${artifact || ''}\n`);
