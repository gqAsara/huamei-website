# Keyword registry

This directory is the source of truth for keywords and AI prompts that
the SEO loop tracks. Three files matter:

- `primary.yaml` — the canonical keyword list, ingested from the
  founder's `主打关键词.xlsx`. Each row has a target query, intent,
  stage, priority, and (after enrichment) DataForSEO volume metrics.
- `enrichment-log.jsonl` — append-only log of every DataForSEO call,
  one JSON object per call. Used for cost tracking + retry recovery.
- `archived/` — keywords that are no longer in active rotation (e.g.,
  for retired product lines or banned-brand associations). Never
  delete — archive.

## Workflow

1. **Add or update keywords.** Edit `primary.yaml`. Each entry must
   include `query`, `intent`, `stage`, `priority`. Volume fields are
   optional — they get populated by the enrichment script.
2. **Enrich.** Run `npx tsx scripts/dataforseo-enrich.ts`. Pulls
   monthly volume, CPC, competition, related queries. Writes back to
   `primary.yaml`. Stamps `last_enriched_at`.
3. **Score opportunities.** Run `npx tsx scripts/score-opportunities.ts`.
   Combines keyword data + Sanity geoRun citations + (eventually) GSC
   rank deltas. Writes ranked briefs to `.seo/briefs/auto-<date>-*.md`.
4. **Daily routine consumes briefs.** The 10am-PT cron in the
   `huamei-daily-seo-publish` routine reads the top 5 briefs and drafts
   articles against them. Published briefs move to
   `.seo/briefs/published/`.

## Schema for primary.yaml

```yaml
keywords:
  - query: "custom luxury rigid box manufacturer"
    intent: "commercial"          # informational | investigative | commercial | transactional
    stage: "comparison"            # discovery | evaluation | comparison | decision | procurement
    priority: 1                    # 1 (highest) to 5 (lowest)
    target_url: "/blogs/custom-luxury-rigid-box-manufacturing"  # optional
    notes: "Pillar 1 target"        # optional
    # Enriched fields (auto-populated by dataforseo-enrich.ts):
    volume_monthly: 1900
    cpc_usd: 3.42
    competition: 0.72              # 0-1
    related_queries:
      - "rigid box manufacturer china"
      - "luxury rigid box supplier"
    last_enriched_at: "2026-05-14T05:00:00Z"
    location_code: 2840            # ISO US (default); 2826 = UK, 2156 = CN
    language_code: "en"
```

## Cost notes

DataForSEO Search Volume endpoint costs ~$0.05 per 1,000 keywords
(batch). At Huamei's scale (200–500 active keywords), a monthly
enrichment is ~$0.01–0.03. Account balance is in Vercel env
`DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`. Top up at dataforseo.com
when balance dips below $10.
