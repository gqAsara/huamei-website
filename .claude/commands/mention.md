---
description: Log a brand mention to the tracking CSV. Dispatches Outreach.
allowed-tools: Read
argument-hint: <url> [optional one-line context]
---

Dispatch the `outreach` subagent to log a brand mention.

Instruction to give outreach:

> Use the outreach subagent to log a brand mention.
> URL or context: "$ARGUMENTS"
>
> Specifically:
> 1. WebFetch the URL.
> 2. Extract: platform (LinkedIn / Reddit / Wikipedia / etc.), date of
>    the mention, the surrounding context (1–2 sentences), citation
>    type (dofollow / nofollow / mention-no-link / image / quote).
> 3. Capture a screenshot if technically possible; otherwise note the
>    URL only.
> 4. Append a row to `.seo/reports/mentions.csv` with the schema in
>    your agent definition.
> 5. Report the new row count and the running total of mentions
>    logged.
