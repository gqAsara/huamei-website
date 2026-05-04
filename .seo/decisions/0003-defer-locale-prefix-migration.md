# ADR 0003 — Defer locale-prefix migration until zh-Hans content is ready

**Date:** 2026-05-04
**Status:** Accepted
**Deciders:** George Qiao (founder)

## Context

The Huamei SEO playbook v3 (§6.2.5) prescribes migrating all 55 indexed
URLs from `huamei.io/<thing>` to `huamei.io/en/<thing>` as Phase 1
Commit #2.5. The migration sets up the locale-prefix structure
(`src/app/[lang]/...`) needed for adding `zh-Hans` later.

The bundle's CLAUDE.md / SEO_CONTEXT.md was written assuming this
migration has happened, and instructs agents to write new routes under
`app/[lang]/...`.

## Decision

Defer the locale-prefix migration until the first `zh-Hans` pillar
is actually ready to ship. Until then:

- All routes remain at the current paths under `src/app/(site)/...`.
- New pillar / cluster / FAQ / materials-library pages are created at
  `src/app/(site)/margin/<slug>/page.tsx` etc.
- JSON-LD lives at `src/lib/schema/`.
- The existing 55 indexed URLs keep their current canonical paths.

When `zh-Hans` content is ready, migrate as a single coordinated change:
move existing routes to `src/app/[lang]/...`, generate the 55-URL 301
redirect map, set up hreflang annotations, and ship as one PR with the
pre-merge checklist from playbook §6.2.5.

## Consequences

**Positive:**
- 55 URLs are not exposed to redirect risk for zero present-value gain.
- One less migration to roll back if something breaks.
- Site Engineer agent does not have to author code into a route shape
  that does not yet exist on disk.

**Negative:**
- A future migration is non-trivial work (redirect map + hreflang +
  sitemap dual-publish + verification window).
- The bundle's playbook references `app/[lang]/` paths in many places;
  agents need to translate to `src/app/(site)/` until migration.

## How agents apply this

- **Site Engineer:** new routes go under `src/app/(site)/` with current
  conventions. Do not introduce `[lang]` segments. Phase 1 Commit #4
  (hreflang) is also deferred per this decision.
- **Editor:** content drafts are stored at `content/<section>/<slug>.md`
  and Site Engineer publishes to `src/app/(site)/<section>/<slug>/page.tsx`.
- **Translator:** stays in cold-start protocol (brand-line proposals
  only, no article translation) until this ADR is reversed and locale
  routing exists.

## Trigger to revisit

Reverse this decision when:

1. ≥3 brand-line proposals are `Accepted` in
   `.seo/reference/brand-lines.md`, AND
2. At least one full English pillar has been published and is stable, AND
3. There is a committed translator (human or agent) with capacity to
   produce ~2,500 zh-Hans words within 30 days of the migration shipping.
