# ADR 0005 — Phase 2 GEO scope: ship /llms.txt; defer the rest

**Date:** 2026-05-04
**Status:** Accepted
**Deciders:** George Qiao (founder)

## Context

Phase 2 of the playbook (§7) covers Generative Engine Optimization
across five areas:

| § | Area | Owner | Shippable today? |
|---|---|---|---|
| 7.1 | GEO score rubric (operating heuristic) | Analyst | Blocked — needs ~7-14 days of GSC data |
| 7.2 | Citable passage structure (120-180 word passages) | Editor | Blocked — needs Phase 0.5 first-party data |
| 7.3 | Brand mention building | Outreach | Out of scope for Site Engineer |
| 7.4 | `/llms.txt` | Site Engineer | **Yes** |
| 7.5 | Freshness signals (visible dateModified) | Editor + Site Engineer | Blocked — needs /margin posts to exist |

George explicitly chose to skip the Phase 0.5 discovery interview
for now. That keeps the content engine paused, but Phase 2 §7.4 is
still independently shippable.

## Decision

Ship `/llms.txt` at `public/llms.txt`. Defer §7.1, §7.2, §7.3, §7.5
until their gating dependencies clear:

- §7.1 GEO score baseline — recompute when GSC has 14+ days of
  impression data (~ 2026-05-18).
- §7.2 Citable passages — when Phase 0.5 transcript exists.
- §7.5 Freshness signals — when first /margin pillar ships.
- §7.3 Brand mentions — Outreach agent's domain; out of Site
  Engineer scope.

## Consequences

**Positive:**
- AI agents (ChatGPT, Claude, Perplexity, Gemini, Doubao) get a
  curated, copy-edited index of huamei.io's structure on their next
  crawl.
- No fabricated data shipped. Every fact in `/llms.txt` traces to
  homepage copy, nav data, or page content already publicly visible.

**Negative:**
- Phase 2 is partially complete; the citable passage and freshness
  work that would actually move the GEO score waits.

## How agents apply this

- **Site Engineer:** when Phase 0.5 transcript lands, refresh
  `/llms.txt` with concrete specs (greyboard weights, MOQ ranges,
  certifications) and revisit. Open a `seo/p2-llms-refresh` branch.
- **Editor:** Phase 2 §7.2 citable passages remain blocked until
  Phase 0.5. No work for Editor in Phase 2 today.
- **Analyst:** baseline GEO score on or after 2026-05-18 (14 days
  post-GSC verify). Use the synthesized rubric in playbook §7.1; flag
  it as an operating heuristic, not validated outcome data.

## Trigger to revisit

When Phase 0.5 discovery transcript is committed to
`.seo/reference/discovery-<date>.md`. At that point: refresh
`/llms.txt`, draft citable passages for Pillar 1, and unblock
Editor's full pipeline.
