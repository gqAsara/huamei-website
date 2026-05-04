## What this changes

<!-- Plain English summary in 1–3 sentences. -->

## Why

<!-- Link to the playbook section (e.g., §6.3) or ADR. -->

## Validation evidence

- [ ] `node scripts/validate-schema.mjs` passes (paste output below if non-trivial)
- [ ] Tested in Google Rich Results Test for any new schema (paste URL)
- [ ] Tested in Schema.org Validator for any new schema
- [ ] Lighthouse CI green (or budgets adjusted in `.lighthouserc.json` with rationale)
- [ ] No secrets committed (gitleaks workflow)
- [ ] hreflang reciprocal — `en` ↔ `zh-Hans` both resolved

```
<!-- Paste validator output here -->
```

## State changes

- [ ] `.seo/state.json` updated (only if PR ships work that justifies it)
- [ ] `.seo/decisions/NNNN-*.md` appended (if a non-obvious choice was made)

## Rollback

<!-- One line: `git revert <sha>` or "revert PR #N" — must work without follow-up. -->

## Screenshots (if UI/layout)

## Reviewer notes

- Phase: <!-- 0 / 1 / 2 / 3 / 4 -->
- Subagent: <!-- site-engineer / editor / outreach / analyst / translator / human -->
- Affected routes: <!-- list -->
