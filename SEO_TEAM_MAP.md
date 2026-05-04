# Huamei SEO Team — Operating Map

A one-page reference for how the five-agent SEO team is organized, what each
member owns, how work moves through the team, and the 90-day plan they are
executing against. Maps the agent bundle as designed; what is actually
adopted is a separate decision (see honest-review note at the end).

---

## At a glance

- **5 specialists + 1 human orchestrator (you).** Specialists draft; humans publish.
- **90-day plan in five phases.** Phase 0.5 (a 90-min discovery interview) is the gate everything else depends on.
- **Agents never push to `main`.** They open draft PRs; you merge.
- **State lives in files, not in agent heads.** Close the terminal, reopen tomorrow, the team picks up where it left off.
- **One repo, one terminal session.** `cd ~/Desktop/huamei-website && claude`.

---

## The team

| Agent | Owns | Default model | Triggered by | Hands off to |
|---|---|---|---|---|
| **Site Engineer** | Code: metadata, JSON-LD, hreflang, robots.txt, sitemap, canonical, Next.js routes, Core Web Vitals, locale routing, per-factory pages | Sonnet | "ship the schema commit", "add Pillar 2 route", "fix the title template" | Opens draft PR → you merge |
| **Editor** | Long-form prose: 4 pillars, ~16 cluster articles, /margin posts, FAQ pages, materials library, case-study narrative | Opus (drafts) / Sonnet (edits) | "draft Pillar 2", "write the cluster on magnetic pull-force" | Site Engineer publishes |
| **Translator** | English ↔ zh-Hans, locale voice, pinyin, brand-line approvals | Opus | "translate Pillar 2 to Chinese", "review zh-Hans homepage" | Site Engineer wires routing |
| **Outreach** | Trade-press pitches, directory submissions, LinkedIn drafts, HARO responses, brand-mention log | Sonnet | "draft a Dieline pitch", "log this week's mentions" | You send (never the agent) |
| **Analyst** | GSC / GA4 / Bing data pulls, GEO score recalc, weekly report, quarterly re-plan | Haiku (routine) / Sonnet (quarterly) | "weekly report", "did Pillar 2 lift hot-foil traffic" | Drops report PR → you merge |
| **Orchestrator (`/seo`)** | Reads state.json, recommends one next move, dispatches | Inherits | You typing `/seo` | Whichever specialist matches |

The orchestrator is the only agent without scope of its own. It is a routing layer.

---

## The 90-day plan

```
Day  1 ──────── 14 ──────── 30 ──────── 60 ──────── 90 ──── 180+
     │           │           │           │           │
     ├── Phase 0 ┤           │           │           │
     │  Measurement          │           │           │
     │  GSC · GA4 · Bing · IndexNow      │           │
     │           │           │           │           │
     ├──── Phase 0.5 ────────┤           │           │
     │  Discovery interview (you + ops)  │           │
     │  ★ GATE: blocks Phase 3 until done            │
     │           │           │           │           │
     ├──── Phase 1 ──────────┤           │           │
     │  Technical hygiene (5 commits)    │           │
     │  Site Engineer ships PRs          │           │
     │                       │           │           │
     │           ├──── Phase 2 ──────────┤           │
     │           │  GEO / AI search       │           │
     │           │  Site Engineer + Editor│           │
     │           │           │           │           │
     │           ├──── Phase 3 ──────────────────────────────►
     │           │  Content engine (4 pillars + 12 clusters)
     │           │  Editor drives, Site Engineer publishes
     │           │           │           │           │
     │                       ├──── Phase 4 ─────────────────►
     │                       │  Authority & links
     │                       │  Outreach drives
```

**The single most important date** is when Phase 0.5 lands. Editor refuses to
draft any pillar whose first-party data is `<TODO: confirm>`. Until the 90-min
ops interview happens, the entire content engine is a no-op.

---

## Task distribution

### Responsibility matrix

|  | Site Eng | Editor | Translator | Outreach | Analyst |
|---|---|---|---|---|---|
| Page metadata & `<title>` | **Owns** | – | – | – | – |
| JSON-LD schema | **Owns** | – | – | – | – |
| `robots.txt`, `sitemap.xml` | **Owns** | – | – | – | – |
| `next.config.js` (canonicals, headers) | **Owns** | – | – | – | – |
| Pillar pages (English) | Publishes | **Drafts** | – | – | – |
| Cluster articles (English) | Publishes | **Drafts** | – | – | – |
| Materials library entries | Publishes | **Drafts** | – | – | – |
| FAQ on-page Q&A blocks | Publishes | **Drafts** | – | – | – |
| zh-Hans translation | Wires routing | – | **Drafts** | – | – |
| Pinyin reference | – | – | **Owns** | – | – |
| Trade-press pitches | – | – | – | **Drafts** | – |
| LinkedIn posts | – | – | – | **Drafts** | – |
| Directory submissions | – | – | – | **Drafts** | – |
| Brand mention log (`mentions.csv`) | – | – | – | **Owns** | Reads |
| Weekly performance report | – | – | – | – | **Owns** |
| GEO score recalculation | – | – | – | – | **Owns** |
| `state.json` updates | After PR merge | – | – | – | After report |

Reading: bold = drafts/owns; "Publishes" = takes the markdown and ships the
route + schema; "–" = not their lane.

### What no agent owns (you keep)

- Sending email, hitting publish on LinkedIn, merging PRs
- Phase 0.5 discovery interview (human-led; agents read the transcript)
- Conversations with clients about case-study permissions
- Final yes/no on naming a client, claiming a certification, signing a pitch

---

## How a task flows through the team

```
┌────────┐
│  You   │  type:  "/seo"
└───┬────┘
    │
    ▼
┌──────────────┐  reads .seo/state.json + playbook.md
│ Orchestrator │  proposes ONE next move + which agent
└───┬──────────┘
    │
    ▼
┌────────┐
│  You   │  approve or override
└───┬────┘
    │  type:  "Use the editor subagent to draft Pillar 2"
    ▼
┌──────────────┐  reads CLAUDE.md, briefs, prior /margin posts
│  Specialist  │  drafts artifact (markdown / code / pitch)
│  subagent    │  validates (schema, banned phrases, citations)
└───┬──────────┘
    │
    ├─── prose ──────► saves to content/...
    ├─── code ───────► opens draft PR
    └─── outreach ──► saves to .seo/reports/outreach/
    │
    ▼
┌────────┐
│  You   │  review · edit · merge · send
└───┬────┘
    │
    ▼
┌──────────────┐  agent updates .seo/state.json
│   Hooks      │  validate-schema · indexnow · activity-log
│   (silent)   │  state-integrity-check on Stop
└──────────────┘
    │
    ▼
   next /seo cycle
```

Every loop ends with state.json updated and one line appended to
`.seo/reports/activity.log`. Tomorrow, `/seo` reads the same file and proposes
the next move.

---

## Daily interaction

### The seven slash commands

| Command | What it does | Who runs |
|---|---|---|
| `/seo` | "What should I do next?" — reads state, recommends, dispatches | Orchestrator |
| `/brief <topic>` | Writer-ready brief for a new pillar or cluster | Editor |
| `/publish <draft-path>` | Take a finished markdown draft and ship the route + schema | Site Engineer |
| `/refresh <slug>` | Re-edit an article ≥90 days old, bump dateModified | Editor |
| `/score` | Recalculate the GEO score (monthly cadence) | Analyst |
| `/mention <url>` | Log a brand mention to `mentions.csv` (with dedup) | Outreach |
| `/audit` | Full technical + GEO audit | Site Engineer + Analyst |

### Two ways to invoke a specialist

```
Implicit (description-matched routing):
> "Draft a cluster article on greyboard weights."

Explicit (forced routing — preferred for predictability):
> "Use the editor subagent to draft a cluster article on greyboard weights."
```

### A typical day, three scenarios

**Scenario 1 — "What's next?"**

```
$ cd ~/Desktop/huamei-website && claude
> /seo

[Orchestrator]: Phase 0. Last shipped: nothing.
                Next move: install GA4 via @next/third-parties.
                Dispatch to: site-engineer.

> Use the site-engineer subagent to install GA4.

[Site Engineer]: opens branch seo/p0-ga4, drafts the change,
                 validates, opens draft PR #14.

[You]: review PR #14 in browser → merge → done.
```

**Scenario 2 — "Pillar 2 draft."**

```
> Use the editor subagent to draft Pillar 2 — Hot-Foil, Emboss & Surface Finishing.

[Editor]: reads CLAUDE.md → finds Phase 0.5 discovery output exists
          → reads /margin posts (cold-start exception if <3) → drafts
          → flags <TODO> for any spec not in the discovery doc
          → saves content/margin/hot-foil-emboss-surface-finishing.md
          → reports back: "2,640 words, 4 first-party data points,
            3 external citations, 2 TODOs requiring ops input."

[You]: review the markdown, fill the TODOs, then:

> Use the site-engineer subagent to publish content/margin/hot-foil-emboss-surface-finishing.md.

[Site Engineer]: creates app/[lang]/margin/hot-foil-emboss-surface-finishing/page.tsx,
                 wires Article schema, BreadcrumbList, dateModified;
                 opens draft PR.
```

**Scenario 3 — Friday wrap.**

```
> /score

[Analyst]: pulls GSC + GA4 (last 7 days), recalculates GEO score,
           drops .seo/reports/weekly/2026-W19.md as a draft PR.
           Confidence labels on every claim.

> /mention https://dieline.com/article-mentioning-huamei

[Outreach]: runs dedup-mention.mjs → not duplicate → appends row
            to .seo/reports/mentions.csv.
```

---

## Source of truth — state files

```
.seo/
├── state.json                ← canonical "where are we?" — validated against schema
├── state.schema.json         ← rules for state.json shape
├── playbook.md               ← strategy, read once a week
├── competitors.md            ← top 7 direct competitors, quarterly refresh
├── decisions/                ← ADRs every time we diverge from the playbook
├── permissions/              ← signed client name permissions (write-once)
├── reference/
│   ├── homepage.txt          ← brand voice cold-start reference
│   ├── pinyin.md             ← canonical romanizations (Translator)
│   └── brand-lines.md        ← English ↔ zh-Hans line approvals
├── templates/
│   ├── article-frontmatter.md
│   ├── cluster-brief.md
│   ├── decision.md
│   ├── discovery-interview.md  ← Phase 0.5 question bank
│   └── schema/                 ← JSON-LD templates per type
└── reports/
    ├── activity.log          ← one line per agent turn (auto-rotates 5 MB)
    ├── mentions.csv          ← brand mention log (Outreach)
    ├── validation-failures.log
    ├── weekly/YYYY-WW.md     ← Analyst weekly
    ├── geo/YYYY-MM.md        ← Analyst monthly GEO score
    ├── quarterly/YYYY-Q[1-4].md
    └── outreach/             ← drafted pitches awaiting your send
```

`CLAUDE.md` at the repo root is loaded into every Claude Code session. It is
the project memory: brand voice, banned phrases, confirmed-vs-unconfirmed
facts, hard rules. **If anything in CLAUDE.md changes, agents pick it up on
the next turn.**

---

## Guardrails — hooks (run silently)

| Hook | Fires on | What it does | Can it block? |
|---|---|---|---|
| `pre-write-guard.mjs` | Edit / Write | Hard-blocks writes to `.env`, lockfiles, `node_modules/`, `.next/`, `.seo/permissions/` | **Yes** |
| `secret-scan.mjs` | Edit / Write | Detects AWS / GitHub / OpenAI / Anthropic / Stripe keys in content | **Yes** |
| `validate-schema.mjs --staged-only` | Post-Edit / Write | Validates JSON-LD; BLOCK on placeholder in production paths, WARN in templates | **Yes** |
| `post-bash-indexnow.mjs` | Post-Bash | Pings IndexNow when `git push` or `vercel deploy` runs | No |
| `state-integrity-check.mjs` | Stop | Runs only if `state.json` is dirty AND a tool was used recently. Validates schema, flags phantom updates | No |

You will mostly never see these — they exit silently on success. When one
blocks, the message is loud.

---

## Hard rules — universal across agents

1. **Never publish without explicit human confirmation.** Drafting and PR-creation are fine; merging, deploying, sending email, hitting publish are not.
2. **Never invent factory specs, employee counts, client names, or certifications.** If a fact is not in the "confirmed" list of CLAUDE.md or the discovery output, the agent uses `<TODO: confirm>` and surfaces the gap.
3. **Never use FAQPage schema.** Google restricted it to gov / health domains in Aug 2023. Use Article + on-page Q&A blocks.
4. **Never name a client without a signed permission file** at `.seo/permissions/<client-slug>.txt`.
5. **Never write to `state.json` without a corresponding artifact** (merged PR, published URL, logged mention). The Stop hook flags violations.
6. **Append a decision record** any time you choose option A over option B that the playbook treats as a real choice. `.seo/decisions/`.
7. **Validate every JSON-LD payload** against Schema.org Validator AND Google Rich Results Test before requesting review. Pre-commit hook enforces; CI re-runs on every PR.

---

## Dependencies and blockers

```
Phase 0 (measurement)
   │
   ▼
Phase 0.5 (discovery interview)  ← ★ CRITICAL PATH
   │
   ├──────────────► Phase 1 (technical hygiene)
   │                     │
   │                     ▼
   │                Phase 2 (GEO)
   │                     │
   ▼                     ▼
Phase 3 (content) ◄─────┘
   │
   ▼
Phase 4 (authority)
```

What blocks what:

- **Phase 3 cannot start** until Phase 0.5 transcript is committed.
- **Translator article work cannot start** until ≥3 brand-line proposals are `Accepted` in `brand-lines.md`.
- **Editor cannot use the standard "read 3 prior /margin posts" rule** until 3 /margin posts exist; cold-start exception applies until then.
- **Wikidata Q-item draft is blocked** until ≥3 secondary mentions are logged in `mentions.csv`.
- **Outreach cannot pitch a publication** until it has read that pub's last 5 articles in the target section (rule built into the agent).
- **Analyst cannot publish numbers** without a source citation and a confidence label (`Confirmed` / `Likely` / `Hypothesis`).

---

## Glossary

- **GEO (Generative Engine Optimization)** — making content citable by AI engines (ChatGPT, Perplexity, Claude, Google AI Overviews), not just by Google's blue links.
- **Citable passage** — a 120–180 word self-contained answer under an H2, structured so an AI engine can extract it as a standalone block.
- **First-party data** — facts Huamei owns (factory specs, MOQs, lead times, certifications). Sourced from the discovery interview.
- **CLAUDE.md** — the project memory file at repo root, loaded into every Claude Code session.
- **Cold-start exception** — fallback behavior when a normal precondition isn't yet met (no /margin posts, no zh-Hans translations).
- **Phase 0.5** — the 90-min ops interview that captures the first-party data Editor needs to draft pillars without inventing.
- **ADR (architecture decision record)** — a one-page markdown file in `.seo/decisions/` recording why we chose option A over option B.
- **`@id`** — the canonical URL of a schema entity, used to link entities across pages (e.g., the Organization `@id` is referenced by every Article's `publisher`).
- **DefinedTerm** — the schema.org type used for materials library entries (paper grade, foil stock) — they are inputs, not sellable products.
- **`zh-Hans`** — BCP 47 tag for Simplified Chinese (Hong Kong / Singapore / Taiwan / global Chinese diaspora). Never `zh` or `zh-CN`. Mainland Baidu is out of scope.
- **The Horoscope Test** — if a sentence could appear in a horoscope and remain plausibly true, it does not belong in a Huamei article. Cut.

---

## Footnote — what to actually adopt

This map describes the bundle as designed. For a solo operator at week 1
with no published content, ~80% is scaffolding. The high-leverage subset:

1. `CLAUDE.md` (voice, banned phrases, fact lists)
2. `.seo/templates/discovery-interview.md` — schedule and run this first
3. The four pillar briefs as plain markdown
4. `secret-scan.mjs` as a PreToolUse hook
5. JSON-LD schema templates as reference for Phase 1 commits

Everything else (5 specialist agents, 7 slash commands, state schema,
CODEOWNERS, Lighthouse CI) becomes useful when there is content and a
second human reviewing PRs. Until then, run the work inline in a single
Claude Code session.

This map stays accurate either way — it shows what the team would look
like if fully staffed. Treat it as the org chart you build toward, not
the one you install on day one.
