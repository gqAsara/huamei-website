# Errata for Huamei_SEO_Playbook.docx (v1)

The v1 PDF/DOCX shipped with factual errors and outdated
recommendations. The v2 docx (this same playbook, regenerated)
fixes them. This file documents the diff for anyone reading the
v1 hard copy.

## Section 6 — Phase 1 commits

- **Commit #3 (JSON-LD):** v1 told you to use `LocalBusiness` with
  `@id: https://huamei.io/house/factory#henan` (URL fragment). v2
  uses `https://huamei.io/en/house/factory/henan` — a real per-
  factory page. Plan four pages, not one with anchors.
- **Schema decision:** v1 example used `Product` schema for /craft
  children. v2 keeps `Product` for craft pages (where they read
  as offerable services with `availability: MadeToOrder`) but
  switches the Materials Library to `DefinedTerm` because stocked
  materials are inputs, not sellable goods.
- **FAQPage schema:** v1 implied FAQPage was usable for /margin
  posts. It isn't. Google restricted FAQPage rich results to
  government and authoritative health sites in August 2023.
  Replace with on-page Q&A blocks under question-form H2s.

## Section 7 — Phase 2 GEO

- **GEO score weights** (25/20/20/15/10/10) are an operating
  heuristic, not validated outcome data. v1 presented them as
  if they were established. v2 calls this out and recommends
  calibration after 90 days.
- **Citability statistics** (+40% credentials, +28% quotations,
  +41% statistics, 3.2× freshness boost, +527% YoY AI traffic):
  these come from the synthesized rubrics in
  `zubair-trabzada/geo-seo-claude` and
  `199-biotechnologies/claude-skill-seo-geo-optimizer`. v2
  flags them with "evidence suggests" framing.
- **Wikidata recommendation:** v1 said "create the Q-item in
  week 4." Wikidata has notability requirements; for a B2B
  manufacturer with no English press, the Q-item will get
  nominated for deletion. v2 gates this on ≥3 secondary
  mentions and pushes it to month 6+.
- **Wikipedia entry at month 6:** removed entirely from v2
  scope.

## Section 7 — robots.txt

- Specific AI crawler list as v1 is fine; minor cleanup in v2
  (deduplicates `anthropic-ai` / `ClaudeBot` and `GPTBot` /
  `OAI-SearchBot` / `ChatGPT-User`).

## Section 8 — Phase 3 content

- **Pillar examples in v1 contained fabricated factory specs:**
  greyboard 2.0–2.5 mm, magnetic closure 12–18 g pull-force,
  MOQs from 500, 4–6 week sample-to-production timeline,
  "500+ luxury brands served." None of these came from
  Huamei's operations team. v2 marks every such number as
  `<TODO: confirm with operations>` and gates Pillar 1
  drafting on a Phase 0.5 discovery interview.
- **Materials Library:** v1 said "~100 Product schema records."
  v2 corrects to `DefinedTerm` schema (or lightweight
  `CreativeWork`).

## Section 8.4 — Citable passage example

- The example passage about magnetic closure pull-force, hot-foil
  reflectivity, and greyboard weights was illustrative ONLY in
  v1. The numbers were not Huamei's. v2 replaces the example
  with a generic structural template that the reader fills in
  from discovery output.

## "China locale" subsection (was inside §8.6)

- v1 said "SEO focus: Baidu (if willing), but still Google via
  Vercel CDN from HK." This is wrong. Vercel does not have a
  mainland China presence. Baidu requires ICP licensing.
- v2 explicitly scopes `zh-Hans` to Hong Kong, Singapore, Taiwan,
  and the global Chinese-speaking diaspora. Mainland Baidu is
  out of scope.

## hreflang language codes

- v1 mixed `zh`, `zh-CN`, `zh-Hans`. v2 uses `zh-Hans` everywhere
  per BCP 47.

## Appendix B — title templates

- All title templates in v1 are usable in v2 with the caveat that
  they implicitly use the `app/[lang]/...` route pattern; the
  `<title>` text is identical.

## Appendix C — pillar briefs

- "Required first-party data" rows in v1 list specific numbers.
  In v2, every spec in that row is replaced with
  `<TODO: discovery>` and the brief explicitly states it cannot
  be drafted until Phase 0.5 has captured the data.

## Appendix D — Technical SEO checklist

- v1 had `hreflang declared and reciprocal` as a checklist item.
  v2 makes it explicit: `en` and `zh-Hans` only, never bare
  `zh`, never `zh-CN`. `x-default` points to `/en` until further
  notice.

## What did NOT change between v1 and v2

- The four-phase structure.
- The Phase 1 commit list (5 commits).
- The Phase 2 GEO methodology (citable passages, brand mentions,
  llms.txt, freshness).
- The four pillar topics.
- The measurement framework (six metrics).
