#!/usr/bin/env node
// PreToolUse guard for Edit and Write.
// HARD blocks on protected files (env, lockfiles, node_modules, .next).
// SOFT warns on per-agent ownership violations — Claude Code's hook payload
// does not always include subagent_type, so this is best-effort only. The
// authoritative ownership gate is CODEOWNERS at PR review time.

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

const filePath = parsed?.tool_input?.file_path || parsed?.tool_input?.path || '';
const subagent = parsed?.subagent_type || parsed?.agent || '';

const ALWAYS_BLOCK = [
  /\.env(\..+)?$/,
  /node_modules\//,
  /\.next\//,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  /\.seo\/permissions\//, // signed permission files are write-once
];
for (const p of ALWAYS_BLOCK) {
  if (p.test(filePath)) {
    console.error(`pre-write-guard: BLOCK write to ${filePath} — protected file`);
    process.exit(2);
  }
}

const OWNERSHIP = {
  editor:        ['content/', '.seo/reports/briefs/', '.seo/templates/', '.seo/reference/'],
  translator:    ['content/zh-Hans/', '.seo/reference/'],
  outreach:      ['.seo/reports/'],
  analyst:       ['.seo/reports/', '.seo/state.json', '.seo/decisions/'],
  'site-engineer': ['app/', 'lib/', 'public/', 'next.config.js', '.seo/state.json', '.seo/decisions/', '.seo/reports/audits/', 'scripts/', '.github/'],
};

if (subagent && OWNERSHIP[subagent]) {
  const allowed = OWNERSHIP[subagent];
  if (!allowed.some(prefix => filePath.startsWith(prefix) || filePath.includes('/' + prefix))) {
    console.error(
      `pre-write-guard: WARN — subagent "${subagent}" tried to write to ${filePath}.\n` +
      `  Allowed prefixes for ${subagent}: ${allowed.join(', ')}\n` +
      `  Best-effort warning only. CODEOWNERS is the authoritative gate at PR time.`
    );
    // Soft-warn (exit 0). The CI / CODEOWNERS path is what enforces.
  }
}

process.exit(0);
