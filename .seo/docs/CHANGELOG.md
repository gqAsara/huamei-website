# Changelog

## v3 — 2026-05-04 (regression fixes from round-2 self-review)

### Tier 1 regressions fixed

- **Title template for /en/house/factory** had unverified ISO-cert
  claim ("ISO-certified production, dedicated cosmetic and spirits
  lines"). Replaced with a non-claiming description; details
  detailed per-factory page after Phase 0.5 confirms.
- **MCP versions verified and pinned.** Three of the five servers
  named in v2 did not exist on npm:
  - `@itsjohncs/google-search-console-mcp` → replaced with
    `google-searchconsole-mcp@1.0.1`
  - `@google-analytics/mcp` → replaced with
    `mcp-server-google-analytics@1.1.0`
  - `@otterly/mcp` → replaced with `profound-mcp` (or
    `mcp-server-peecai@1.2.0` as alternative)
  - `@modelcontextprotocol/server-github` upgraded
    `2024.11.25` → `2025.11.25`
  - `@vercel/mcp-adapter` pinned to `0.3.2`
- **competitors.md fully rewritten.** Of v2's 10 listed competitors,
  ALL 10 were either dropped (procurement-services, paper
  suppliers, closure-only, generalist printers) or
  mischaracterized. Verified replacements: GPA Global, HH Deluxe
  Packaging, Edelmann Group, Curtis Packaging, McLaren Packaging,
  Shenzhen Hongte, Yuto Packaging.

### Tier 2 fixes

- **Locale migration redirect map.** New §6.2.5 in the playbook
  (Phase 1 commit #2.5). Walks through the 55-URL `/<thing>` →
  `/en/<thing>` migration with explicit pre-merge checklist and
  generated `next.config.js` redirect map.
- **Image strategy.** New §6.6 in the playbook covering next/image
  config, AVIF/WebP, LCP-priority hero, CLS-safe dimensions,
  retina source sizes, LQIP for Materials Library.
- **CRM mapping.** New §11.5 in the playbook with stage-by-stage
  GA4 → CRM tie-out. HubSpot or Salesforce recommended.
- **Cost basis caveated** as industry-typical estimate, not a
  quote.
- **.io TLD fallback** noted as §11.6 — register fallback domain,
  draft migration ADR, keep dormant.
- **validation-failures.log rotates at 5 MB** (was missing).
- **Translator cold-start protocol** — Translator no longer
  attempts article translation until ≥3 brand-line proposals are
  Accepted in `.seo/reference/brand-lines.md`.
- **Editor + Outreach get limited Bash** — restricted to
  `activity-log.mjs` and `dedup-mention.mjs` so logging works
  through the rotation-aware script.
- **Analyst model-tier escalation** — explicit triggers for
  haiku → sonnet escalation (3+ Hypothesis labels, ambiguous
  regression, quarterly re-plan, new MCP reconciliation).
- **CODEOWNERS self-documents its placeholders** — leading
  comment makes clear the team handles need replacing before the
  file does anything.

### Files added in v3

```
(none — v3 is regression fixes, not new files)
```

### Files modified in v3

```
CLAUDE.md                                  (no change vs v2)
.seo/playbook.md                           (added §6.2.5, §6.6, §11.5, §11.6)
.seo/competitors.md                        (full rewrite from research)
.mcp.json                                  (all 5 versions pinned/replaced)
.claude/agents/editor.md                   (limited Bash, log scripts)
.claude/agents/outreach.md                 (limited Bash, log scripts)
.claude/agents/translator.md               (cold-start protocol)
.claude/agents/analyst.md                  (haiku escalation triggers)
.github/CODEOWNERS                         (self-doc placeholder header)
scripts/validate-schema.mjs                (log rotation)
Huamei_SEO_Playbook_v3.docx                (regenerated)
README.md                                  (v3 references)
KICKOFF.md                                 (v3 references)
```

### Tier 3 strategic gaps still NOT addressed

These remain scope decisions, not engineering work:

- LinkedIn outbound / paid search / ABM scope
- Fuller multi-language plan (French, Italian, Korean, Japanese,
  German)
- A/B title testing infrastructure
- Trade-show booth ROI

### Tier 4 polish noted but deferred

- Branch names with date prefixes
- Mention CSV with structured columns enforced via a schema (vs
  the soft column documentation we have)
- Dashboard for the activity log


## v2 — 2026-05-04

This release fixes Tier 1 factual errors and Tier 2 architecture gaps
identified in the v1 self-review.

### Tier 1 — Factual corrections (CLAUDE.md, .seo/playbook.md, docx)

- **Removed all fabricated factory data.** Greyboard weights, magnetic
  closure pull-force ranges, MOQ figures, sample-to-production
  timelines, "500+ luxury brands" claims — none of these had a source.
  Replaced with `<TODO: confirm with operations>` placeholders and
  added a Phase 0.5 Discovery interview process at
  `.seo/templates/discovery-interview.md`.
- **Fixed the "Vercel-from-Hong-Kong / Baidu" claim.** Vercel does
  not have a meaningful mainland presence and Baidu requires ICP
  licensing the platform doesn't help with. The `zh-Hans` build now
  explicitly targets Hong Kong / Singapore / Taiwan / global Chinese-
  speaking buyers, NOT mainland Baidu. Mainland penetration documented
  as out of scope.
- **Standardized hreflang on `zh-Hans` everywhere.** Removed bare
  `zh` and `zh-CN` mixed usage. Per BCP 47.
- **Removed FAQPage schema recommendation.** Google restricted
  FAQPage rich results to government and authoritative health
  sites in August 2023. Articles now use Article + on-page Q&A
  blocks. ADR 0003 documents the decision.
- **Reframed GEO score weights as operating heuristic.** v1
  presented 25/20/20/15/10/10 as established fact; v2 explicitly
  flags this is synthesized from secondary sources and recommends
  calibration after 90 days.
- **Pushed Wikidata to month 6+.** Added explicit notability gate
  (≥3 secondary mentions). Removed Wikipedia from scope entirely.
- **Factories are real pages**, not URL fragments. Each factory's
  LocalBusiness schema lives at
  `https://huamei.io/en/house/factory/<province>` with that as its
  canonical `@id`.
- **Materials Library uses DefinedTerm / CreativeWork**, not
  Product. Stocked materials are inputs, not sellable goods.
- **Statistics now attributed.** "+40% citations with credentials,"
  "3.2× freshness boost," "+527% YoY AI traffic" — all flagged with
  the source rubric and treated as evidence-suggests, not fact.

### Tier 2 — Architecture additions

- **CI-side validation.** New `.github/workflows/seo-validate.yml`
  re-runs `validate-schema.mjs` and `validate-state-schema.mjs` on
  every PR — agent or human. Adds gitleaks secret scan.
- **Lighthouse CI.** New `.github/workflows/lighthouse-ci.yml` plus
  `.lighthouserc.json` enforces LCP <2.5s, CLS <0.1, INP <200ms,
  performance ≥85, SEO ≥95, accessibility ≥90 on every PR touching
  app/.
- **CODEOWNERS.** Routes SEO-critical paths to `@huamei/seo`,
  brand voice paths to `@huamei/brand`, translations to
  `@huamei/translator`. CODEOWNERS is the authoritative ownership
  gate; the pre-write hook is now soft-warning only.
- **PR template.** `.github/PULL_REQUEST_TEMPLATE.md` enforces the
  validation-evidence + rollback structure on every PR.
- **state.json schema.** New `.seo/state.schema.json` validates
  every write to `state.json`. Stop hook integrates the check.
  Distinguishes `null`, `"source_not_connected"`,
  `"measurement_failed"` properly.
- **Smarter Stop hook.** `state-integrity-check.mjs` no longer
  runs on pure-conversation turns. Reads `.seo/.last-tool-use`
  marker; runs only when a tool was used in the last 5 minutes
  AND state.json is dirty.
- **Soft pre-write guard.** Hard-blocks writes to `.env`,
  lockfiles, `node_modules/`, `.next/`, `.seo/permissions/`.
  Per-agent ownership downgraded to soft-warning because the
  hook payload's `subagent_type` is best-effort. CODEOWNERS
  enforces at PR time.
- **Secret scan hook.** `secret-scan.mjs` runs PreToolUse on
  Edit/Write. Hard-blocks AWS keys, GCP keys, GitHub PATs,
  OpenAI/Anthropic keys, Slack tokens, Stripe live keys, private
  keys.
- **Mention dedup.** `dedup-mention.mjs` checks the URL against
  `mentions.csv` before append. Outreach must run it.
- **Activity log.** `activity-log.mjs` writes one line per agent
  turn to `.seo/reports/activity.log`. Auto-rotates at 5 MB.
- **Internal link checker.** `check-internal-links.mjs` runs in
  CI, advisory only.
- **Fifth subagent — Translator.** Owns `/zh-Hans/` build, pinyin
  reference, brand-line proposal flow.
- **Model tier strategy.** Editor → opus drafts / sonnet edits.
  Analyst → haiku routine / sonnet quarterly. Other agents
  remain sonnet.
- **Cold-start exception** for Editor on a fresh site with fewer
  than three /margin posts.
- **Competitor reference.** New `.seo/competitors.md` with the
  ten brands Huamei competes with most directly.
- **MCP server versions pinned.** `.mcp.json` now uses specific
  versions instead of `latest` to prevent silent breakage.
- **MCPs marked unverified.** GSC and GA4 MCP packages flagged
  for the operator to verify against current registry on install.

### Files added in v2

```
.github/CODEOWNERS
.github/PULL_REQUEST_TEMPLATE.md
.github/workflows/seo-validate.yml
.github/workflows/lighthouse-ci.yml
.lighthouserc.json
.claude/agents/translator.md
.seo/state.schema.json
.seo/competitors.md
.seo/templates/discovery-interview.md
.seo/reference/homepage.txt
.seo/reference/pinyin.md
.seo/reference/brand-lines.md
.seo/permissions/README.md
scripts/validate-state-schema.mjs
scripts/secret-scan.mjs
scripts/dedup-mention.mjs
scripts/check-internal-links.mjs
scripts/activity-log.mjs
ERRATA.md
CHANGELOG.md
```

### Files modified in v2

```
CLAUDE.md
.seo/playbook.md
.seo/state.json (schema-conformant; phase05Discovery added)
.claude/agents/editor.md
.claude/agents/site-engineer.md
.claude/agents/analyst.md
.claude/agents/outreach.md
.claude/settings.json
.gitignore
.mcp.json
scripts/state-integrity-check.mjs
scripts/pre-write-guard.mjs
scripts/validate-schema.mjs
README.md
```

### What did NOT change in v2

- The four-agent core architecture (now five with Translator).
- The seven slash commands (`/seo`, `/brief`, `/publish`,
  `/refresh`, `/score`, `/mention`, `/audit`).
- The 90-day phased roadmap structure (Phase 0 / 1 / 2 / 3 / 4),
  though Phase 0.5 Discovery was added between Phase 0 and Phase 1.

### Tier 3 strategic gaps — NOT addressed in v2

These are surfaced for human decision:

- LinkedIn outbound / paid search / ABM scope.
- Fuller multi-language plan (French, Italian, Korean, Japanese,
  German).
- A/B title testing infrastructure.
- Revenue tie-out (CRM stages, pipeline value).
- Trade-show booth ROI.

These are scope decisions, not engineering work. Discuss before v3.

## v1 — 2026-05-03 (initial release)

Four-agent architecture (site-engineer, editor, outreach,
analyst). Seven slash commands. Hooks for schema validation,
IndexNow, state integrity. .seo/ state files, .mcp.json, README.
