#!/usr/bin/env node
// PreToolUse hook addendum: scan write/edit content for likely secrets.
// Patterns kept conservative (false positives on regex literals are acceptable).
async function read() {
  return new Promise((res) => {
    let s = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (s += c));
    process.stdin.on('end', () => res(s));
  });
}
const payload = await read();
let parsed;
try { parsed = JSON.parse(payload); } catch { process.exit(0); }

const content = parsed?.tool_input?.content || parsed?.tool_input?.new_string || '';
if (!content) process.exit(0);

const PATTERNS = [
  { name: 'AWS Access Key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS Secret Key', re: /aws_secret_access_key\s*=\s*['"][A-Za-z0-9/+=]{40}['"]/i },
  { name: 'Google API Key', re: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: 'GitHub PAT', re: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  { name: 'OpenAI key', re: /sk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{20,}/ },
  { name: 'Anthropic key', re: /sk-ant-[A-Za-z0-9-]{30,}/ },
  { name: 'Vercel token', re: /vercel_token\s*=\s*['"][A-Za-z0-9]{24,}['"]/i },
  { name: 'Generic private key', re: /-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) ?(?:PRIVATE )?KEY-----/ },
  { name: 'Slack token', re: /xox[abposr]-[A-Za-z0-9-]{10,}/ },
  { name: 'Stripe live key', re: /sk_live_[A-Za-z0-9]{24,}/ },
];

const hits = PATTERNS.filter(p => p.re.test(content));
if (hits.length === 0) process.exit(0);

console.error('secret-scan: refusing write — likely secret detected:');
for (const h of hits) console.error(`  ${h.name}`);
console.error('  Move secrets to .env.local (which is gitignored).');
process.exit(2);
