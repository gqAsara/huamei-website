#!/usr/bin/env node
// Validate .seo/state.json against .seo/state.schema.json
import { readFileSync, existsSync } from 'node:fs';
let Ajv, addFormats;
try {
  Ajv = (await import('ajv')).default;
  addFormats = (await import('ajv-formats')).default;
} catch {
  console.error('ajv not installed; run: npm install --no-save ajv ajv-formats');
  process.exit(2);
}
if (!existsSync('.seo/state.json') || !existsSync('.seo/state.schema.json')) {
  console.error('state files missing'); process.exit(2);
}
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const schema = JSON.parse(readFileSync('.seo/state.schema.json', 'utf8'));
const data = JSON.parse(readFileSync('.seo/state.json', 'utf8'));
const validate = ajv.compile(schema);
if (validate(data)) { console.log('state.json: ok'); process.exit(0); }
console.error('state.json validation errors:');
for (const e of validate.errors) console.error('  ' + ajv.errorsText([e]));
process.exit(2);
