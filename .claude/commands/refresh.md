---
description: Refresh a stale article (≥90 days old). Dispatches Editor for content rewrite, then Site Engineer for dateModified bump.
allowed-tools: Read
argument-hint: <slug-or-path>
---

Two-step refresh.

Step 1 — Editor:

> Use the editor subagent to refresh "$ARGUMENTS". Read the existing
> article. Identify what is stale: numbers, references to "this year"
> or current trends, broken external links, banned phrases that slipped
> in. Rewrite at least 10% of body content with fresh first-party data
> or current-year examples. Maintain the original word count ±10%. Do
> NOT change the URL or slug. Save changes to a working copy at
> `content/<section>/<slug>.refreshed.md` and report back with a diff
> summary.

After the human approves the diff, Step 2 — Site Engineer:

> Use the site-engineer subagent to merge the refreshed copy into the
> live route, bump `updatedAt` and `dateModified` in both frontmatter
> and JSON-LD, ensure `lastModified` updates in `app/sitemap.ts`, and
> open a draft PR titled `seo: refresh <slug>`.
