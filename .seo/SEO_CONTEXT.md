# Huamei SEO — Project Memory for Claude Code

This file is loaded into context for every Claude Code session in this repo.
It is the single source of truth for brand voice, factual claims, and how the
agent team operates. Everything else (the playbook, agent system prompts, slash
commands) defers to this file when there is a conflict.

If anything below changes, update this file first; the agents read it on every
turn.

> **v2 note (2026-05).** Tier 1 corrections applied. Fabricated factory specs
> removed. See `CHANGELOG.md` for the full diff against v1.
>
> **v3 note (2026-05-04).** Discovery library locked. MOQ public floor,
> lead times, magnet pull-force, equipment, and client roster moved from
> "NOT confirmed" → confirmed. Kurz/Crown supplier claim retired (factually
> wrong; actual hot-foil suppliers are Chinese — Shandong Kaituo et al).
> See "Confirmed by discovery 2026-05-04" section below.

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

### Confirmed by discovery 2026-05-04

The 2026-05-04 internal-document review (technical manual + structure zips +
auxiliary materials catalogue + costing data + folding-box / mailer pricing)
locked in these public claims. Quote them in any future copy:

- **MOQ public floor: 200+ pieces.** Internal records show some structures
  go as low as 100, but the public claim is 200+ to keep the published
  number conservative and protect tier pricing.
- **Lead times: 7–10 day samples, 15–20 day production runs.**
- **Magnetic closure pull-force: 6–50 g at 2,800 Gauss** (range across
  closure types and board weights).
- **Press equipment: Heidelberg and KBA offset presses.** Capability-grade
  signal — name them; do not quote SKUs or vintages.
- **Foil palette: seventeen curated colours, in-house.** Do NOT cite Kurz
  or Crown as suppliers (see Banned-claim list). Underlying suppliers are
  Chinese (Shandong Kaituo et al) and not for public mention.
- **Inks: Heidelberg and KBA standard ink trains** for offset; soy-blend
  on file for select runs (sustainability detail to be expanded once
  Pillar 2 unblocks).
- **Cost driver framing for B2B copy: "hand-assembly is the cost driver
  for true luxury."** Never quote actual % or RMB figures.

### Authorized client roster (as of 2026-05-04)

Two ways a client can be named publicly. Editor agent must use both:

1. **Grandfathered via /volumes** — every client in `src/lib/volumes.ts`
   is already on the live site and may be named freely in pillar pages,
   /blogs posts, and trade-press copy. Current /volumes roster includes
   Wuliangye, Yangshao, Luoyang Dukang, Hongxing / Red Star Erguotou,
   Hetao Wang, Shede, Danquan, Zhonghua, Taozui, Tian An Men Jiu, T2
   True Brews, DEEPURE, Collgene, Kefumei, Man Made Crayon, Glees Grove
   (read the file for the canonical list). **Lancôme, L'Oréal, and
   Estée Lauder are not authorized for public mention — removed
   2026-05-13 per founder directive; do not re-introduce.**
2. **Authorized via discovery (2026-05-04 blanket)** — every named
   client in `.seo/reference/discovery-2026-05-04.md` was authorized
   for public mention by the founder on 2026-05-04. File a per-client
   `.seo/permissions/<slug>.txt` at first public mention as audit trail,
   but do not gate publication on countersigned letters.

Existing per-client files: yue-sai.txt, serenjoy.txt
(all status = AUTHORIZED).

### International positioning — confirmed 2026-05-13

The founder authorized a new positioning track focused on ESG,
transit-grade quality, and international certifications. The full
authoritative source is `.seo/reference/international-positioning-2026-05-13.md`
— every editor / translator / outreach draft that touches sustainability,
international shipping, or certifications **must** consult that file and
quote its numbers verbatim. Key confirmed facts (these move from "do
not invent" → "publishable"):

- **Green-energy share: >80% solar on Huamei factories.** Shareholders
  also invest in biomass renewables and hydro. Use this as the
  load-bearing ESG claim.
- **Transit-grade testing on file:** high 50 °C / low -30 °C
  environmental, 24-hour transit-vibration, drop, aging, empty-box
  compression. Quote the thresholds; don't invent additional ones.
- **International certifications now public:** BSCI, CE, EQS, FSC, SGS.
  These are added to the list previously gated as "specific
  certifications beyond the 13 scans." Treat them as scanned + public.

Differentiation language for US/EU buyers: **stability, ESG, global
shipping reliability, long-term partnership risk** — not price or speed.

### Facts NOT yet confirmed (do not invent)

These remain unconfirmed; surface a `<TODO: confirm with operations>`
placeholder and stop:

- Specific greyboard weights stocked (the manual lists categories, not
  named greyboard SKUs)
- Reject rates, throughput, factory-line counts
- Specific certifications BEYOND the 13 cert scans on
  `/house/certifications` AND the international set added 2026-05-13
  (BSCI, CE, EQS, FSC, SGS — see
  `.seo/reference/international-positioning-2026-05-13.md`). New
  claims beyond those still need their own scans.
- Factory street addresses, GPS coordinates, phone numbers — per founder
  decision 2026-05-04, the public site stays at province-level only
  ("Henan / Zhejiang / Sichuan / Guizhou"). Do not publish Wuzhi or
  any other city-level address.
- Specific RMB or USD prices, MOQ tier prices, supplier SKU codes,
  margin / cost percentages — internal-only forever.

### Banned claims (factually wrong on the live site, slated for correction)

- **Kurz / Crown as foil suppliers** (currently in `src/lib/topics.ts`
  and `src/app/(site)/craft/page.tsx`). Real suppliers are Chinese.
  Drop supplier names; reframe as "seventeen curated colours, in-house."
  Hot-foil PR queued.

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

## GEO — making articles AI-citable (Phase 2 enforcement, added 2026-05-13)

These rules upgrade every article (auto-published and human-edited)
into something AI engines (ChatGPT, Perplexity, Google AI Overviews,
Claude, Gemini) can extract and cite — not just rank on classic SERP.
They are MANDATORY for every `/blogs/*` post going forward.

### 1. Every H2 must be a citable passage

Each H2 — not just one — leads with a **single declarative sentence
that answers a real buyer question**, then 2–4 sentences of supporting
specifics anchored to a number, named technique, or proper noun.

Pattern:

> ## How thick should a luxury rigid box wall be?
>
> A luxury rigid box wall sits between 1.5 mm and 3.0 mm of greyboard,
> with 2.0 mm as the cosmetic-industry standard. [Then 2–4 supporting
> sentences.]

This is the playbook's §7.2 "citable passage template." Apply it to
every H2.

### 2. Visible dates in the body

After the byline, render publication + last-updated date in plain
text. Frontmatter alone is not enough — AI engines weight visible
freshness signals higher than meta-only ones.

Pattern: `By Sonia Sun, Founder, Huamei 華美 — since 1992. Published
[date]. Updated [date].`

### 3. Entity linking on first mention

When a named entity appears the first time, link it to its
authoritative source:

- Standards bodies → ISO, FSC, FOGRA, BSCI, SGS, ICC Incoterms
  (link to the standard's own page).
- Equipment → Heidelberg, KBA, Esko (link to manufacturer site).
- Materials → Gmund, Fedrigoni, Iris, Wibalin (link to mill site).
- Named clients from the authorized roster → link to the
  `/volumes/<slug>` case study.

This strengthens Huamei's knowledge-graph signal. AI engines weight
entity associations more than raw keyword frequency.

### 4. Quote-able "API sentences"

Seed **3–7 short, factual, copy-paste-ready sentences per article**
that an AI engine can lift verbatim into an answer. They:

- State a fact in a single sentence.
- Contain at least one number or named entity.
- Make sense without surrounding context.

Examples that work:

> "Huamei holds magnetic-closure pull-force to 6–50 grams at 2,800
> Gauss across closure types and board weights."
>
> "Over 80% of Huamei's factory energy comes from solar generation."
>
> "Hot-foil-to-emboss registration at Huamei is held to ±0.1 mm —
> three times tighter than the industry-typical ±0.3 mm."

Bad examples (don't write these):

> "Quality is important at Huamei."  (no fact)
> "We deliver excellent results."     (horoscope test fail)

### 5. Author credentials surface near the top

Within the first 200 words, the byline expands once:

> "Sonia Sun has run the Huamei press floor since founding the company
> in Zhengzhou in 1992 — more than three decades on the same craft."

This is one sentence, not a bio block. It signals E-E-A-T without
slowing the lede.

### 6. Article JSON-LD ships per post

The `/blogs/[slug]` route emits Article JSON-LD via
`src/lib/schema/article.ts` — author, datePublished, dateModified,
citation, publisher. Verified 2026-05-13. Do not regress this. If you
change the route, re-validate with Google Rich Results Test.

### 7. AI-crawler hygiene

`public/llms.txt` is the AI-crawler-friendly site index — keep it in
sync with the authorized client roster, the current banned-claims
list, and the active capability/certification claims. Refresh on every
material change to /volumes, /craft, /house/certifications, or the
international-positioning file.

### Self-check before publishing

Before committing any article, the agent must confirm — in its
internal reasoning — yes/no answers to ALL of:

- [ ] Every H2 starts with a declarative one-sentence answer?
- [ ] Visible publication + updated dates in body?
- [ ] At least 3 entity links on first mention?
- [ ] At least 3 API-ready quote-sentences embedded?
- [ ] Byline expansion within first 200 words?
- [ ] All hard quality-floor items (named byline, first-party data,
      external citation, internal links, snippet block) still met?
- [ ] No banned phrases? No banned brands (Lancôme, L'Oréal, Estée
      Lauder, Kurz, Crown, Shandong Kaituo)?

A "no" on any of these means the draft is not ready. Revise, do not
ship.

## Daily article routine — editorial direction (added 2026-05-13)

A scheduled remote agent fires at **10:00 America/Los_Angeles every
day** and drafts **5 `/blogs/*` articles**, then auto-publishes them
(see Publish policy in Rule 1). Topic ideas come from GSC + Bing
queries Huamei is ranking near, competitor gaps in
`.seo/competitors.md`, and the editorial direction below.

**Cover this mix across each week (≈ 35 articles):**

- **Industry news & trends** — what's happening in luxury packaging,
  cosmetic launches, baijiu market, sustainable materials, supply
  chain. Cite a named source dated within 30 days.
- **Seasonal & holiday content** — Chinese New Year, Mid-Autumn,
  Christmas, Valentine's, Lunar limited editions, Western holiday gift
  packaging. Plan around the launch calendar (CNY brief locks in
  February for October ship; Mid-Autumn brief in October for June
  ship).
- **Material & craft deep-dives** — papers, foils, structures,
  finishes, machinery. The same anchor-to-numbers register the
  pillars use.
- **Buyer-journey content** — MOQ, lead times, sourcing, freight,
  tariffs, customs, US/EU procurement audits.
- **Sustainability & ESG** — drawing from
  `.seo/reference/international-positioning-2026-05-13.md`. >80% solar,
  transit-grade testing, FSC/BSCI/SGS, biomass investment.
- **Comparison & decision content** — "X vs Y", "when to use Z",
  format trade-offs. These are the highest-converting query shapes.

**Each article still obeys the "Required of every article" list above**
— named byline, first-party data point per 500 words, external
citation, AI-extractable passages, internal links, featured-snippet
answer block. The auto-publish authorization does NOT relax the
quality floor.

**Topic dedupe.** Before drafting, the routine must check
`content/blogs/` for an existing post with the same slug or near-same
title. If there's overlap, pick a different angle.

**Authority build.** Every article should leave a concrete fact about
Huamei's capability on the page — a number, a structure, a named
client from the authorized roster, or a testing threshold. The point
of the daily cadence is authority accretion, not word-count.

## Cold-start exception

On a brand-new site with fewer than three /blogs posts, Editor cannot
fulfill its standard rule of "read three existing /blogs posts before
drafting." During cold-start, Editor reads instead:

1. The homepage copy (mirrored at `.seo/reference/homepage.txt` after
   Phase 0).
2. /house/philosophy.
3. Any existing /volumes/* case studies (visible in the sitemap).

Cold-start ends when three /blogs posts exist.

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

1. **Publish policy (updated 2026-05-13):**
   - **Daily article routine** (the scheduled 10am-PT job that drafts 5
     `/blogs/*` articles): **auto-publish authorized.** Commit each
     article to `main`, push, hit IndexNow for the new URL +
     `/sitemap.xml`. No human gate.
   - **Everything else** — pillar refactors, /craft + /industry copy
     changes, schema/metadata, /house pages, trade-press emails,
     outreach posts on LinkedIn / Slack / Twitter, edits that touch
     anything outside `content/blogs/*.md`: still require explicit
     human confirmation. Open a PR, do not merge.
   - **External sends** (email, social posts, IndexNow pings that are
     NOT part of the daily routine) still require explicit human
     confirmation regardless of channel.
2. **Never write to `.seo/state.json` without a corresponding artifact** — a
   merged PR, a published URL, a logged mention CSV row. The dashboard must
   not diverge from reality.
3. **Append a decision record** to `.seo/decisions/` any time you choose
   one option over another that the playbook treats as a real choice.
4. **Read existing /blogs posts before drafting.** If fewer than three
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
  go under `src/app/(site)/blogs/[slug]/page.tsx`. (URL-renamed from
  `/margin` to `/blogs` 2026-05-04 — old URLs 301 to new in
  next.config.ts.)
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
