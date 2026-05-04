---
description: Create a writer-ready brief for a new pillar or cluster article. Dispatches the Editor subagent.
allowed-tools: Read
argument-hint: <pillar-number or cluster-topic>
---

Dispatch the `editor` subagent to produce a writer-ready brief for the
piece named in `$ARGUMENTS`.

Instruction to give the editor:

> Use the editor subagent to produce a brief for "$ARGUMENTS". Use the
> template at `.seo/templates/cluster-brief.md`. Read at least three
> existing /margin posts before drafting. Include:
> - Target keyword + 2–4 secondary keywords
> - Search intent classification
> - Word count target (per playbook §8.1 for pillars, 1200–1800 for clusters)
> - Author byline (real person on /house/people)
> - Full H1/H2/H3 outline
> - First-party data points required (specific numbers Huamei must supply)
> - Featured-snippet target (one question + 30–40 word answer)
> - Schema choice (Article / BlogPosting)
> - Internal links out (≥ 3)
> - External citations (≥ 1 to a standards body or named report)
>
> Save the brief to `.seo/reports/briefs/<slug>.md` and report back with
> a one-line summary plus any open questions for the human.
