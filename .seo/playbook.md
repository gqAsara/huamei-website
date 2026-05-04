# Huamei SEO Playbook — operational reference

The full strategic playbook is `Huamei_SEO_Playbook.docx` (delivered
separately). This file is the operational reference for agents — section
IDs match the docx so agents can cross-reference. If anything below
conflicts with the docx, this file wins (because the docx is human
reference; this is what agents read).

> **v2 (2026-05).** Tier 1 corrections applied. See `CHANGELOG.md` and
> `ERRATA.md` for the diff against v1.

## Site facts (confirmed)

- huamei.io. Next.js (App Router) on Vercel with ISR.
- Founded 1992. Four factories: Henan, Zhejiang, Sichuan, Guizhou.
- Public on the homepage: 17 hot-foil stocks, 80 papers on file, 99
  structures, 22,000 m² floor, 3,000+ employees.
- Industries: cosmetic, spirits/wine/tea, seasonal gifting, wellness.
- 55 URLs in current sitemap.
- Stack: Next.js 14+ App Router. Vercel ISR. Edge functions available.
- Locales (BCP 47): `en` live; `zh-Hans` scaffolded. URL pattern
  `app/[lang]/...`.

## Site facts (NOT yet confirmed — discovery required)

Before publishing any pillar or cluster article, run a discovery
interview with operations using `.seo/templates/discovery-interview.md`
to capture:

- Greyboard weights stocked
- Pull-force ranges for magnetic closures
- MOQ ranges by structure type
- Sample-to-production lead times
- Reject rates and QA staffing
- Confirmed certifications (FSC, ISO 9001/14001, BSCI, Sedex)
- Factory addresses, phones, GPS coordinates (for LocalBusiness schema)
- Named clients with signed permission to publish (default: none)

Phase 0.5 (after measurement setup, before content) is dedicated to
this work.

## Phases

§5 — Phase 0: Measurement Foundation (week 1)
§5.5 — Phase 0.5: Discovery interview (week 1, parallel to Phase 1)
§6 — Phase 1: Technical Hygiene (weeks 1–2): five commits
§7 — Phase 2: GEO / AI Search Optimization (weeks 2–4)
§8 — Phase 3: Content Engine (weeks 2–12+, gated on Phase 0.5)
§9 — Phase 4: Authority & Links (months 2–6)

## Phase 1 commits — site-engineer's responsibility

1. **Title & metadata templates** (§6.1) — Next.js Metadata API,
   `template: '%s · Huamei'`, fix the doubled-Huamei issue on
   /craft, /industry.
2. **Canonical tags** (§6.2) — self-referencing absolute URLs, trailing
   slash policy via next.config.js.
3. **JSON-LD structured data** (§6.3) —
   - Organization + WebSite (root)
   - LocalBusiness × 4, each at its own canonical URL
     `app/[lang]/house/factory/<province>/page.tsx`
   - BreadcrumbList (every category)
   - Article (margin posts; not BlogPosting — see ADR 0003)
   - Product (craft pages, with `availability: MadeToOrder`,
     no price)
   - **Do NOT use FAQPage.** Google restricted FAQPage rich results
     to government and authoritative health domains in August 2023.
     Use Article + on-page Q&A blocks instead.
4. **hreflang scaffolding** (§6.4) — `app/[lang]/layout.tsx` declares
   alternates with `en` and `zh-Hans`. `x-default` points to `/en`
   until further notice.
5. **robots.txt for AI crawlers** (§6.5) — explicitly admit GPTBot,
   ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot,
   Google-Extended, CCBot, Bytespider, Applebot-Extended, cohere-ai.

## Phase 2 — GEO

§7.1 — GEO score rubric (0–100). **This is an operating heuristic**
synthesized from the rubrics in `aaron-he-zhu/seo-geo-claude-skills`,
`zubair-trabzada/geo-seo-claude`, and `AgriciDaniel/claude-seo`. It is
not validated against actual outcome data. Calibrate weights after the
first 90 days of measurement:

- AI Citability (25%) — 120–180 word self-contained passages
- Brand Authority (20%) — mentions, evidence suggests they correlate
  more strongly than backlinks for AI citation (per zubair-trabzada
  rubric; calibrate)
- Content Quality / E-E-A-T (20%)
- Technical (15%)
- Structured Data (10%)
- Platform Optimization (10%)

§7.2 — Citable passage template. Every H2 = self-contained, definitive
first sentence + supporting specifics + tie to Huamei.
§7.3 — Brand mention targets: LinkedIn, Thomasnet, GlobalSources,
Made-in-China, Alibaba Verified, Reddit, trade press. **Wikidata only
after ≥3 secondary-source mentions exist** (notability requirement).
**Wikipedia is out of scope.**
§7.4 — `/llms.txt`.
§7.5 — Freshness: quarterly refresh, dateModified visible.

## Phase 3 — Content (Editor's primary lane)

§8.1 — Four pillars (gated on Phase 0.5 discovery):

- P1 — Custom Luxury Rigid Box Manufacturing (2500–3500 words)
- P2 — Hot-Foil, Emboss & Surface Finishing (2500)
- P3 — Sustainable Luxury Packaging (3000)
- P4 — Working with a Chinese Packaging Manufacturer (2500)

Each pillar requires the discovery data points listed in
`.seo/templates/discovery-interview.md`. Editor refuses to draft
pillars whose required data is still TODO.

§8.2 — Anti-AI-slop rules. CLAUDE.md has the full banned-phrase list.

§8.3 — Featured snippet targets per pillar: 30–40 word answer blocks
under question-form H2s. Implemented as on-page Q&A, NOT FAQPage
schema.

§8.4 — Materials Library — searchable enumeration of every paper, foil,
board grade Huamei stocks. Schema choice: `DefinedTerm` (per material
type) or lightweight `CreativeWork`. **Not Product** — these are stocked
inputs, not sellable goods.

## Phase 4 — Authority (Outreach's lane)

§9 — Industry directories (1/week, weeks 1–8), trade press (1/quarter),
HARO/Qwoted (continuous), case-study link-back program (continuous,
gated on signed client permission), conferences (annual). Wikidata
contingent (see §7.3).

## China locale (zh-Hans)

The `zh-Hans` build serves Chinese-speaking audiences in Hong Kong,
Singapore, Taiwan, and global markets — NOT mainland China via Baidu.
Mainland Baidu visibility requires ICP licensing and an in-country
host, which are out of scope for this playbook. If mainland penetration
becomes a goal, treat as a separate project with its own infrastructure
plan.

The `Translator` agent owns the locale: it does not auto-translate,
it produces locale-appropriate copy that respects Mandarin business
register. Pinyin spellings of brand names are documented at
`.seo/reference/pinyin.md`.

## Measurement (Analyst's lane)

§11 — Six metrics, monthly review:

- Indexed pages (target: every sitemap URL within 30 days)
- Branded vs non-branded impressions (split GSC queries on "huamei"
  and "華美")
- Top 1–10 keyword count (5 by day 60, 25 by day 90, 100 by day 180)
- GEO score (75 by day 90, 85 by day 180 — calibration target, not
  guarantee)
- Brand mentions (10 / 30 / 100 by day 60 / 90 / 180)
- RFQ inquiries (GA4 conversions on /begin form, mapped to CRM stage
  if connected)

Cost basis: Phase 3 content engine alone is 50,000–60,000 words +
discovery interviews + author bylines + design. Budget ranges:
in-house ($30k–$45k Y1), freelance ($25k–$50k Y1), agency
($60k–$120k Y1). Surface this to the human before Phase 3 starts.

## Phase 1 — locale migration (new in v3, §6.2.5)

Existing 55 indexed URLs live at `huamei.io/<thing>` (no locale
prefix). Phase 1 commit #4 introduces `app/[lang]/...` routing
which means every existing URL gets a 301 to its `/en/` equivalent.
This is the highest-risk part of Phase 1; ship it as its own
intermediate commit between #2 (canonicals) and #3 (JSON-LD).

Required artifacts:

- A redirect map at `next.config.js` that maps every existing path
  to `/en/<path>`. Generate from the current sitemap.xml. Confirm
  count = 55 before merging.
- Sitemap submitted twice: once with the legacy URLs marked as 301
  redirects, once with the `/en/` URLs as canonical. Wait two
  weeks before removing the legacy entries.
- Open Graph image URLs updated (they use absolute paths and will
  break otherwise).
- Test plan: for the top 10 indexed pages, manually verify the
  301 + canonical chain in browser dev tools and via curl.

Site Engineer opens this as a separate PR (`seo/p1-locale-migration`)
with explicit reviewer note: "55-URL migration; staging deploy
verified before merge."

## Image strategy (new in v3, §6.6)

Huamei is image-heavy by category. Without a strategy this hits
Core Web Vitals immediately.

- `next/image` with `formats: ['image/avif', 'image/webp']`
- `priority: true` on the homepage hero and on every category-page
  hero (LCP candidate)
- Explicit `width` / `height` on every image (prevents CLS)
- `sizes` attribute set per image so srcset generation makes sense
- Lazy-load everything below the fold (next/image default)
- Source images: at least 2400 px wide for retina; serve via Vercel
  Image Optimization (configure `images.deviceSizes` and `imageSizes`
  in next.config.js)
- For the Materials Library page, use a low-resolution placeholder
  (LQIP / blurDataURL) to avoid layout shift on a long grid
- Alt text required on every image; for product/material photos,
  describe the material name and finish ("Kurz Light Line Gold,
  hot-foil applied at 120°C, matte-shimmer finish") — both an
  accessibility win and a GEO-citability win

## CRM mapping (new in v3, §11.5)

Analyst's RFQ-conversion metric is hollow without CRM tie-out.
Decide before Phase 0 ends:

| Stage | Source | Owner |
|---|---|---|
| Inquiry submitted | GA4 conversion on /begin | Analyst |
| Inquiry qualified | CRM stage 1 | Sales (manual) |
| Sample requested | CRM stage 2 | Sales (manual) |
| Sample shipped | CRM stage 3 | Operations |
| Production order | CRM stage 4 | Sales |
| Won (revenue booked) | CRM stage 5 | Finance |

Recommended CRM: HubSpot or Salesforce. Both have GA4 connectors.
If the human picks something else, append an ADR documenting the
choice and adjust the mapping.

Without CRM tie-out, the playbook tracks lead generation only. The
gap between leads and revenue is what business leadership cares
about.

## .io TLD fallback (new in v3)

The .io top-level domain is administered by a registry whose status
has been politically contested. Not a near-term operational risk,
but plan for it: register a fallback domain (huamei.com, huamei.cn,
or huamei.co — verify availability) and document the migration
plan as ADR. Keep this dormant until needed.
