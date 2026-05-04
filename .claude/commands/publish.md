---
description: Publish a finished Editor draft. Validates schema, opens a draft PR, asks for review. Dispatches the Site Engineer subagent.
allowed-tools: Read, Bash(git:*)
argument-hint: <path-to-draft-markdown>
---

Dispatch the `site-engineer` subagent to publish the draft at
`$ARGUMENTS`.

Instruction to give the site engineer:

> Use the site-engineer subagent to publish the draft at "$ARGUMENTS".
> Specifically:
> 1. Read the draft and its frontmatter.
> 2. Reject if the frontmatter is missing any of:
>    title, description, slug, primaryKeyword, author{name,role,tenure},
>    publishedAt, updatedAt, schema, internalLinks (≥ 3),
>    externalCitations (≥ 1).
> 3. Create a feature branch named `seo/<phase>-publish-<slug>`.
> 4. Move the draft to its final route (e.g., `app/margin/<slug>/page.mdx`
>    or the equivalent for the section).
> 5. Generate the corresponding JSON-LD using the schema field and the
>    template under `.seo/templates/schema/`.
> 6. Run `node scripts/validate-schema.mjs` on every JSON-LD payload.
> 7. Add `lastModified` to `app/sitemap.ts`.
> 8. Open a draft PR titled `seo(p<phase>): publish <title>`.
> 9. Comment back with the PR URL and the validator output.
>
> Do NOT merge. Do NOT ping IndexNow. Both happen on human approval
> after PR review.
