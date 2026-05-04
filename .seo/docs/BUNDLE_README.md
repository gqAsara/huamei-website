# Huamei SEO — Claude Code Agent Bundle (v3)

Drop-in agent system for executing the Huamei SEO playbook with
Claude Code. **Five** specialist subagents, **seven** slash commands,
**five** hooks, CI workflows, and a small set of state files.

> **v3 ships 2026-05-04 (regression fixes from round-2 self-review).** See `CHANGELOG.md` for what changed since
> v1 and `ERRATA.md` for corrections to the v1 docx.

This bundle lives at the root of the huamei.io Next.js repository.
Drop these files in, run a one-time install script, and type `/seo`
to begin.

## Architecture map

```
huamei-seo-agents/
├── CLAUDE.md                           # project memory — voice, facts, rules
├── README.md
├── KICKOFF.md                          # bootstrap prompt
├── CHANGELOG.md                        # v1 → v2 diff
├── ERRATA.md                           # corrections to the v1 docx
├── .gitignore
├── .mcp.json                           # MCP servers (versions pinned)
├── .lighthouserc.json                  # CWV budgets
├── .github/
│   ├── CODEOWNERS                      # authoritative ownership gate
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── seo-validate.yml            # JSON-LD + state.json + secret scan on every PR
│       └── lighthouse-ci.yml           # CWV thresholds on every PR
├── .claude/
│   ├── settings.json                   # hooks + permissions
│   ├── agents/
│   │   ├── site-engineer.md            # codebase + JSON-LD + metadata (sonnet)
│   │   ├── editor.md                   # long-form prose + brand voice (opus drafts / sonnet edits)
│   │   ├── translator.md               # zh-Hans build (opus)
│   │   ├── outreach.md                 # external pitches + brand-mention log (sonnet)
│   │   └── analyst.md                  # GSC/GA4/Bing + GEO score (haiku routine / sonnet quarterly)
│   └── commands/
│       ├── seo.md                      # /seo — orchestrator
│       ├── brief.md                    # /brief
│       ├── publish.md                  # /publish
│       ├── refresh.md                  # /refresh
│       ├── score.md                    # /score
│       ├── mention.md                  # /mention
│       └── audit.md                    # /audit
├── .seo/
│   ├── playbook.md                     # operational reference
│   ├── state.json                      # progress tracker
│   ├── state.schema.json               # JSON schema for state.json
│   ├── competitors.md                  # top 10 to differentiate from
│   ├── decisions/                      # ADR log
│   ├── templates/
│   │   ├── article-frontmatter.md
│   │   ├── cluster-brief.md
│   │   ├── decision.md
│   │   ├── discovery-interview.md      # Phase 0.5 input
│   │   ├── llms.txt
│   │   └── schema/                     # JSON-LD templates
│   ├── reference/
│   │   ├── homepage.txt                # cold-start voice reference
│   │   ├── pinyin.md                   # canonical romanizations
│   │   └── brand-lines.md              # English ↔ zh-Hans approvals
│   ├── permissions/                    # signed client name permissions
│   │   └── README.md
│   └── reports/                        # weekly / monthly / mentions.csv / activity.log / outreach drafts
└── scripts/
    ├── install-skills.sh
    ├── validate-schema.mjs             # JSON-LD validator
    ├── validate-state-schema.mjs       # state.json schema validator
    ├── pre-write-guard.mjs             # hard-blocks protected paths
    ├── secret-scan.mjs                 # blocks API keys
    ├── post-bash-indexnow.mjs          # IndexNow on deploys
    ├── state-integrity-check.mjs       # smart Stop hook
    ├── dedup-mention.mjs               # mentions.csv dedup
    ├── activity-log.mjs                # turn log writer (with rotation)
    └── check-internal-links.mjs        # link integrity (CI advisory)
```

## Install (one time)

From the root of the huamei.io Next.js repo:

```bash
# 1. Drop this bundle in.
cp -r huamei-seo-agents/{CLAUDE.md,.mcp.json,.lighthouserc.json,.claude,.seo,.github,scripts,CHANGELOG.md,ERRATA.md,.gitignore} ./

# 2. Install dependencies for the validator scripts.
npm install --no-save ajv@8 ajv-formats@3

# 3. Install the upstream Claude Code SEO skills.
bash scripts/install-skills.sh

# 4. Set up env vars.
cat >> .env.local <<EOF
GITHUB_TOKEN=ghp_xxx
GA4_PROPERTY_ID=properties/123456789
VERCEL_TOKEN=xxx
VERCEL_PROJECT_ID=prj_xxx
INDEXNOW_KEY=$(openssl rand -hex 16)
EOF

# 5. Generate the IndexNow key file.
echo "$INDEXNOW_KEY" > public/$INDEXNOW_KEY.txt

# 6. Verify CI workflows.
ls .github/workflows/

# 7. Set CODEOWNERS team handles. Edit .github/CODEOWNERS to point
#    at your real GitHub teams (replace @huamei/seo etc.).

# 8. Run the discovery interview (Phase 0.5) BEFORE Phase 3.
#    See .seo/templates/discovery-interview.md.
```

## Bootstrap prompt

`KICKOFF.md` has the first prompt to paste. Pasted here for visibility:

> Read CLAUDE.md, .seo/playbook.md, and .seo/state.json. Confirm in
> 3 bullets what you understand about the brand, voice rules, and
> current phase. Then run /seo and propose the first move.

## Day-to-day usage

Same seven slash commands as v1, plus the new agents:

| Command | When to use |
|---|---|
| `/seo` | "What should I do next?" |
| `/brief <topic>` | Writer-ready brief for a new pillar or cluster |
| `/publish <draft-path>` | Publish a finished Editor draft |
| `/refresh <slug>` | Refresh a ≥90-day-old article |
| `/score` | Recalculate GEO score (monthly) |
| `/mention <url>` | Log a brand mention to mentions.csv |
| `/audit` | Full technical + GEO audit |

Direct subagent invocation:

> Use the editor subagent to draft Pillar 2.
> Use the translator subagent to translate Pillar 2 to zh-Hans.
> Use the site-engineer subagent to ship Phase 1 commit #3.

## Hooks (now five)

Defined in `.claude/settings.json`:

- **PreToolUse on Edit/Write** → `pre-write-guard.mjs` + `secret-scan.mjs`.
  Hard-blocks protected paths and API keys.
- **PostToolUse on Edit/Write** → `validate-schema.mjs --staged-only` +
  tool-use marker.
- **PostToolUse on Bash** → `post-bash-indexnow.mjs` + tool-use marker.
- **Stop** → `state-integrity-check.mjs` (smart — only on dirty
  state.json AND recent tool use).

## CI workflows (new in v2)

`.github/workflows/seo-validate.yml`:
- JSON-LD validation
- state.json schema validation
- Internal link check (advisory)
- gitleaks secret scan

`.github/workflows/lighthouse-ci.yml`:
- LCP <2.5s, CLS <0.1, INP <200ms (warning)
- Performance ≥85, SEO ≥95, accessibility ≥90

Configure budgets in `.lighthouserc.json`.

## What this bundle does NOT include

- The Next.js scaffolding (`app/`, `lib/schema/`). Site Engineer's
  Phase 1.
- The full strategic playbook docx — see `Huamei_SEO_Playbook.docx`
  separately.
- API credentials. Use `.env.local`.
- The four GitHub SEO skills. Run `install-skills.sh`.
- The Phase 0.5 discovery data. Human-led interview.

## Troubleshooting

Same as v1, plus:

**state.json fails schema validation.** Run
`node scripts/validate-state-schema.mjs` to see the specific
violations. The schema is at `.seo/state.schema.json`.

**Stop hook not running on Linux/Windows.** The hook uses POSIX
shell. On Windows, use WSL or rewrite the marker line for cmd.exe.

**`@next/third-parties/google` not installing.** Check Next.js
version — it requires Next 14.0+.

**Lighthouse CI fails because the start command doesn't exist.**
Make sure `npm run start` is defined in package.json. If your
project uses a different command, update `.lighthouserc.json`.

**CODEOWNERS not enforcing.** GitHub's branch protection must be
enabled and "Require review from Code Owners" checked, or
CODEOWNERS is just documentation.

## Updating to v3

When the playbook or methodology changes again:

1. Update CLAUDE.md and `.seo/playbook.md`.
2. Append a CHANGELOG.md entry.
3. If voice or facts changed, agents will pick it up on next turn.
4. If hooks or schemas changed, run them on a feature branch first.
5. Add an ADR to `.seo/decisions/`.

## License / attribution

Methodology synthesized from these GitHub-hosted Claude Code SEO
skills:

- aaron-he-zhu/seo-geo-claude-skills
- AgriciDaniel/claude-seo
- inhouseseo/superseo-skills
- AndreasH96/seo-geo-consultant
- zubair-trabzada/geo-seo-claude
- 199-biotechnologies/claude-skill-seo-geo-optimizer
- Bhanunamikaze/Agentic-SEO-Skill
- aevans-eng/seo-skill
- nowork-studio/toprank
