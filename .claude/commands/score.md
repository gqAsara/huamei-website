---
description: Recalculate the GEO Score (0–100) using the rubric in playbook §7.1. Dispatches the Analyst subagent.
allowed-tools: Read
---

Dispatch the `analyst` subagent to recalculate the GEO Score and write
the result to `.seo/reports/geo/YYYY-MM.md`.

Instruction to give the analyst:

> Use the analyst subagent to recalculate the GEO score per Playbook §7.1.
> Read every dimension's data source. For any dimension where the source
> is not yet connected, leave the score blank and note "source not
> connected" in the evidence column. Update `.seo/state.json`'s
> `currentGeoScore` and `lastUpdated` fields ONLY after the report file
> is committed. Identify the weakest dimension and propose, in one
> sentence, what next 30 days of work should concentrate on.
