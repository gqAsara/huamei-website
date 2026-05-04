---
description: Run a full technical SEO audit. Dispatches Site Engineer + Analyst.
allowed-tools: Read, Bash
---

Two parallel runs.

Site Engineer:

> Use the site-engineer subagent to run the full technical SEO audit
> per Playbook Appendix D. Output the result to
> `.seo/reports/audits/YYYY-MM-DD-technical.md` with one row per
> checklist item: status (pass / fail / not-applicable), evidence,
> proposed fix.

Analyst (in parallel):

> Use the analyst subagent to recalculate GEO score, AI citation
> samples, and brand mention totals into
> `.seo/reports/audits/YYYY-MM-DD-geo.md`.

After both complete, summarize the top 5 findings ranked by leverage
(score impact / effort) for the human.
