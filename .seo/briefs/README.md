# Brief queue

Auto-generated content briefs that the daily 10am-PT routine consumes.
One brief per high-opportunity keyword or AI prompt, scored by
`scripts/score-opportunities.ts`.

## Lifecycle

```
.seo/briefs/auto-<date>-<rank>-<slug>.md   ← created by scorer
       ↓ consumed by daily routine (drafts the article)
.seo/briefs/published/<date>-<slug>.md     ← archived after publish
```

The routine reads the top 5 briefs by `rank` prefix in the filename
(auto-001-* before auto-002-* etc.). After a brief is published, the
routine moves it to `published/` and appends a one-line entry to
`.seo/reports/activity.log`.

## Brief schema

Each `.md` file uses this frontmatter shape:

```yaml
---
brief_id: "auto-2026-05-14-001-mooncake-coffret-structures"
generated_at: "2026-05-14T07:00:00-07:00"
rank: 1
target_query: "mooncake coffret structures luxury packaging"
opportunity_type: "seo_near_miss" | "geo_missing_citation" | "geo_competitor_dominant" | "seasonal_window"
seo_score: 87.4
geo_score: 0
volume_monthly: 880
current_position: 12
target_position: 5
competitor_dominant: ["packaging-of-the-world.com", "thedieline.com"]
related_queries:
  - "mooncake gift box manufacturer"
  - "mid autumn coffret packaging"
recommended_internal_links:
  - "/industry/seasonal"
  - "/craft/drawer"
  - "/volumes/oriental-memoirs"
snippet_target: |
  A luxury mooncake coffret pairs a 4- or 8-cavity drawer construction
  with a slipcase wrap, scored to lift cleanly under a magnetic closure.
  Construction tolerance ±1 mm per cavity; lead time 24–32 days.
---

# Mooncake coffret structures — what a luxury launch needs

[Brief continues with: gap analysis, why-this-now context, voice
notes, anti-pattern flags.]
```

## Triage rules for the routine

When reading briefs, the daily routine should:

1. **Take the top 5 by rank, in order.** Don't skip and don't shuffle.
2. **Skip any brief whose `target_query` substring already appears in
   an existing `content/blogs/*.md` title.** Dedupe protection.
3. **If fewer than 5 briefs exist in the queue,** generate the
   remainder using the self-generation flow already in the routine
   prompt (industry news + seasonal + comparison buckets).
4. **After publish, mv the brief to `published/`** with the date
   prefix matching the publish day.

## Manual briefs

A human-written brief can be dropped in here at any time. Use rank
`auto-000-*` to force it to the top of the queue ahead of the scored
briefs. Or use a rank > 100 to deprioritize and only consume on
quiet days.

## Cost / churn note

The scorer generates 10–20 briefs per day. The routine consumes 5.
Excess briefs that age > 7 days without being consumed should be
archived to `published/aged-out/` and removed from the queue — let
the scorer regenerate them with fresh data rather than acting on a
week-old signal.
