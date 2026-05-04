# Huamei SEO — Project Memory for Claude Code

This file is loaded into context for every Claude Code session in this repo.
It is the single source of truth for brand voice, factual claims, and how the
agent team operates. Everything else (the playbook, agent system prompts, slash
commands) defers to this file when there is a conflict.

If anything below changes, update this file first; the agents read it on every
turn.

> **v2 note (2026-05).** Tier 1 corrections applied. Fabricated factory specs
> removed. See `CHANGELOG.md` for the full diff against v1.

---

## What Huamei is

- **Name:** Huamei (華美 — pronounced "hwah-may"). Always render with the Hanzi
  alongside the romanization at first mention on a page; Latin alone after that.
- **What it does:** Custom luxury packaging manufacturer. Rigid boxes, magnetic
  closures, hot-foil stamping, embossing, deboss, spot-UV, soft-touch
  lamination, paper engineering, presentation cases.
- **Founded:** 1992. State this every time the company's history is referenced.
- **Footprint:** Four factories in Henan, Zhejiang, Sichuan, Guizhou.
- **URL:** https://huamei.io
- **Tech stack:** Next.js (App Router) on Vercel with ISR.
- **Locales (BCP 47):** `en` is live at the root (no locale prefix).
  `zh-Hans` is NOT yet scaffolded — locale-prefix migration is deferred
  until the first Chinese-language pillar is ready (see ADR 0003). When
  it lands, the pattern will be `src/app/[lang]/...`. Use `zh-Hans`
  everywhere — never bare `zh`, never `zh-CN`. Mainland Baidu out of scope.

### Facts visible on the homepage today

These are the only specs we have publicly confirmed. Quote them exactly:

- "22,000 m² of paper & ink, across four provinces"
- "Ninety-nine structures, seventeen foils, eighty papers on file"
- "Founded 1992"
- "From sketch to sealed crate"
- Roughly 3,000 employees (homepage states "3,000+")

### Facts NOT yet confirmed (do not invent)

The following are common in luxury packaging copy but have NOT been confirmed
for Huamei. Use placeholders, ask the human, or run a discovery interview
(see `.seo/templates/discovery-interview.md`):

- Specific greyboard weights stocked
- Specific magnetic closure pull-force ranges
- Specific MOQ figures by structure type
- Specific sample-to-production lead times
- Reject rates, throughput, factory-line counts
- Named clients (luxury brands almost never want to be quoted; default: do
  not name)
- Specific certifications (FSC, ISO 9001, ISO 14001, BSCI, etc.) — confirm
  before claiming
- Factory addresses, phone numbers, GPS coordinates

When a draft needs one of these, surface a `<TODO: confirm with operations>`
placeholder and stop. Never paper over.

## Brand voice

- **Editorial, not promotional.** The existing tagline ("The shape of a
  promise becoming physical") sets the register. We describe; we do not boast.
- **Specific over abstract.** Every claim is anchored to a number, a material,
  a named technique, or a process step. "Premium materials" → name the actual
  paper or board grade.
- **Calm, not breathless.** No exclamation points. Few adjectives. Verbs do
  the work.
- **First-person plural ("we") used sparingly.** Most sentences are about
  the packaging, not about Huamei.
- **Mandarin-aware English.** Read aloud well to a non-native English
  speaker. Avoid idioms and culture-specific references.

## Banned phrases (zero tolerance)

Tier 1 — never appear in any published copy:
"in today's fast-paced world," "unlock the power of," "in conclusion,"
"the future of X is now," "navigate the landscape," "elevate your brand,"
"take it to the next level," "reimagine," "world-class," "best-in-class,"
"cutting-edge," "innovative solutions."

Tier 2 — allowed only if immediately followed by a specific number, named
example, or proper noun: "leverage," "synergy," "holistic," "robust,"
"seamless," "premium" (qualify with material spec), "luxury" (qualify with
material spec or named brand category).

The Horoscope Test: if a sentence could appear in a horoscope and remain
plausibly true, it does not belong in a Huamei article. Cut it.

## Required of every article

- Named author byline with title and tenure (real person on /house/people).
- Visible publication date and last-updated date in copy.
- At least one first-party data point per 500 words (sourced from
  operations, not invented).
- At least one external citation to a standards body or named industry
  report.
- 120–180 word self-contained passage under at least three H2 headings,
  written so an AI engine can extract them as standalone answers.
- Internal link to at least two relevant /craft/* or /industry/* pages
  and one /volumes/* case study.
- 30–40 word answer block immediately after at least one question-form
  H2, formatted to win a featured snippet.

## Cold-start exception

On a brand-new site with fewer than three /margin posts, Editor cannot
fulfill its standard rule of "read three existing /margin posts before
drafting." During cold-start, Editor reads instead:

1. The homepage copy (mirrored at `.seo/reference/homepage.txt` after
   Phase 0).
2. /house/philosophy.
3. Any existing /volumes/* case studies (visible in the sitemap).

Cold-start ends when three /margin posts exist.

## How the agent team is organized

Five specialist subagents plus one orchestrator slash command.

| Agent | Owns | Default model |
|---|---|---|
| `site-engineer` | Codebase commits: metadata, JSON-LD, hreflang, robots, sitemap, Core Web Vitals | sonnet |
| `editor` | Long-form content: pillars, clusters, FAQ, materials library | opus (drafts), sonnet (edits) |
| `translator` | English ↔ zh-Hans translation, locale-aware copy review | opus |
| `outreach` | Drafts directory submissions, trade-press pitches, LinkedIn copy, brand-mention log | sonnet |
| `analyst` | Pulls GSC/GA4/Bing data, recalculates GEO score, writes weekly report | haiku (routine), sonnet (quarterly re-plan) |

The orchestrator is the human (you) plus the `/seo` slash command, which
reads `.seo/state.json` and proposes the next move.

## Source-of-truth files

- `.seo/playbook.md` — the strategic plan. Read this once per week.
- `.seo/state.json` — what is done, what is next, latest GEO score.
  Validated against `.seo/state.schema.json` on every write.
- `.seo/decisions/` — ADR-style records. Append a new one any time we
  diverge from the playbook.
- `.seo/competitors.md` — top 10 competitors and what to learn from each.
- `.seo/templates/` — frontmatter, schema, brief, discovery templates.
- `.seo/reports/` — weekly Analyst output + activity log.

## Rules every agent must obey

1. **Never publish (commit to main, hit IndexNow, send an email) without
   explicit human confirmation.** Drafting and PR-creation are fine; merging
   and external sends are not.
2. **Never write to `.seo/state.json` without a corresponding artifact** — a
   merged PR, a published URL, a logged mention CSV row. The dashboard must
   not diverge from reality.
3. **Append a decision record** to `.seo/decisions/` any time you choose
   one option over another that the playbook treats as a real choice.
4. **Read existing /margin posts before drafting.** If fewer than three
   exist, follow the Cold-start exception above.
5. **Validate every JSON-LD payload** against schema.org and Google's Rich
   Results Test before requesting review. The pre-commit hook enforces this;
   do not bypass it. The CI workflow at `.github/workflows/seo-validate.yml`
   re-runs validation on every PR — agent or human.
6. **If a claim cannot be sourced**, do not publish it. Replace with a
   first-party number, or omit. Specifically: never invent factory specs,
   employee counts, client names, certifications, or supply chain details.
7. **Append a one-line entry to `.seo/reports/activity.log`** at the end
   of every turn. Format: `<ISO timestamp>\t<agent>\t<action>\t<artifact>`.

## Repository conventions

- Routes live in `src/app/(site)/`. The route group `(site)` does not appear
  in URLs; it groups pages that share the marketing layout. New pillar pages
  go under `src/app/(site)/margin/[slug]/page.tsx`.
- JSON-LD lives in `src/lib/schema/` (directory does not yet exist; Phase 1
  Commit #3 creates it).
- Per-page metadata uses Next.js `Metadata` API. See
  `src/app/(site)/volumes/[slug]/page.tsx` for the existing pattern.
- Author bios live in `src/data/authors.ts` (does not yet exist; create
  when first author byline is needed).
- Factories will be per-province pages under
  `src/app/(site)/house/factory/<province>/`, each with its own LocalBusiness
  schema. The current `/house/factory` is a single page; per-province pages
  are a Phase 1 / Phase 0.5 deliverable (addresses come from discovery).
- **Locale routing is deferred.** Migrate to `src/app/[lang]/...` only when
  `zh-Hans` content is ready to ship. See ADR 0003.

## When asked "what's next?"

Read `.seo/state.json`. The `nextAction` field is canonical. If empty,
read `.seo/playbook.md` from the last `lastPhaseCompleted` and propose the
following item. The `/seo` slash command also checks
`.seo/reports/validation-failures.log` for recent blockers and surfaces
them before suggesting new work.
