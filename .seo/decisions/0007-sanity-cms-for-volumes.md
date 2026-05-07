# ADR 0007 — Sanity CMS for /volumes + industry taxonomy

**Date:** 2026-05-07
**Status:** Accepted
**Authors:** site-engineer (Claude); approved by founder (George Qiao)

## Context

Production team needs the ability to upload case studies (cover + photo
gallery) and add/delete industries without going through git. Founder
George approved a 2-user setup (himself + Jacky Chan, design lead).
Jacky has no GitHub access and no technical background.

Existing state pre-decision:
- `/volumes` and `/volumes/[slug]` read from `src/lib/volumes.ts`
- 31 case studies, 6 industries, 89 photos at `/public/photos/cases/`
- Editing requires a developer who can git commit
- Photos are committed to the repo, bloating the git history

## Decision

Adopt **Sanity** as the CMS for `caseStudy` and `industry` document
types. Studio embedded at `/studio` in the same Next.js app; will
publish at `studio.huamei.io` via Vercel subdomain rewrite.

### Why Sanity (vs alternatives considered)

| Option | Why rejected |
|---|---|
| Decap CMS (git-backed) | Requires colleague to have GitHub account; GitHub access often blocked at Chinese corp networks |
| Custom `/admin` page | ~2 weeks of build; ongoing maintenance for auth, image upload, edit history, undo. Single-user scope no longer justifies the cost |
| Payload CMS (self-host) | Adds a database dependency (Neon/Supabase via marketplace); ~2 weeks setup |
| Notion / Airtable backend | Notion image URLs expire after 1h via API; Airtable's free tier is restrictive on attachments |

### Scope of CMS ownership

CMS owns:
- `caseStudy` documents (was `Volume[]` in `src/lib/volumes.ts`)
- `industry` documents (was the hard-coded `CATS` array in
  `volumes/page.tsx`)

CMS does NOT own:
- `/craft` topics, schemas, layouts, components
- `/blogs` editorial content (markdown in `content/blogs/`)
- `/house/*` pages (philosophy, people, factory, certifications)
- The rich `getCase()` editorial layer in `src/lib/cases.ts` (brief
  copy, plate captions, opening sequence) — Phase 2+ if it ever needs
  to come out of code

This keeps the surface area small and the CMS scoped to "what the
production team actually edits."

## Architecture

```
huamei.io                       ← Next.js app on Vercel
├── /volumes (server, ISR 60s)  ← reads from Sanity, falls back to volumes.ts
├── /volumes/[slug] (SSG 60s)   ← same
├── /studio (client SPA)        ← Sanity Studio
└── studio.huamei.io            ← Vercel rewrite → /studio
```

```
Sanity (project: pn9bcq7e, dataset: production)
├── caseStudy (31 docs)
└── industry (6 docs: Cosmetics, Spirits, Tea, Wellness, Gifting, Skincare)
```

### Single source of truth

Sanity is now authoritative. `src/lib/volumes.ts` is kept for two
reasons:
1. Build-time fallback if Sanity is misconfigured (graceful degrade,
   not hard fail).
2. The migration script reads from it.

After 2 weeks of stable operation (~2026-05-21), volumes.ts may be
deprecated or trimmed.

### ISR + webhook flow

1. Editor publishes a case study in Studio
2. Sanity emits a webhook → Vercel deploy hook
3. Vercel rebuilds; ISR cache is invalidated
4. Live site reflects the change in ~60s

Webhook configured in: Sanity dashboard → API → Webhooks.

## Permissions model

Two users with `editor` role on the Sanity project:
- George Qiao (project owner)
- Jacky Chan (editor)

Editor role can:
- Create / update / delete documents of types we expose (caseStudy,
  industry)
- Upload images to the asset CDN

Editor role CANNOT:
- Add new document types (schema is code-defined; deploys via git)
- Change project settings, billing, or user list
- Read drafts of users they have no access to

## Costs

- **$0/month** at current footprint. Sanity free plan covers 3 users,
  1 project, 100K API requests/mo, 5GB asset storage.
- Migration footprint: ~50MB of photos uploaded; 31 docs; 100% within
  free tier.

## Risks accepted

1. **Second source of truth.** `npm run build` no longer tells you what
   ships on /volumes; Sanity does. Mitigation: weekly Analyst pull
   includes a "Sanity vs deployed" diff check.
2. **Vendor lockin (mild).** GROQ queries aren't portable, but content
   exports as JSON via `sanity dataset export`. Worst case: rebuild on
   another headless CMS in ~1 week.
3. **Sanity outage degrades /volumes.** Mitigated by:
   - Fallback to `volumes.ts` when `getAllVolumes()` returns empty
   - ISR cached HTML stays served for up to 1 year
4. **Token leak.** The migration token was shared in chat. Will be
   rotated post-migration. Future tokens stay in `.env.local` (gitignored)
   and Vercel env (not visible to users).

## Implementation log

| Date | Action |
|---|---|
| 2026-05-07 | Decision approved; project provisioned |
| 2026-05-07 | Schemas written, migration run (31/31 success), build green |
| 2026-05-07 | Studio mounted at /studio |
| TODO | Vercel deploy webhook configured |
| TODO | studio.huamei.io subdomain rewrite |
| TODO | Jacky invited as editor |
| TODO | Mandarin how-to delivered |
| TODO | Migration token rotated |

## Files added

- `sanity.config.ts`, `sanity.cli.ts` (root)
- `sanity/schemas/caseStudy.ts`, `industry.ts`, `index.ts`
- `src/app/studio/[[...tool]]/page.tsx`, `Studio.tsx`, `layout.tsx`
- `src/lib/sanity/{client,queries,image}.ts`
- `src/components/VolumesCatalogue.tsx` (extracted client UI from page)
- `scripts/sanity-migrate-volumes.ts`, `sanity-check.ts`

## Files modified

- `src/app/(site)/volumes/page.tsx` — server shell that fetches from
  Sanity, fallback to volumes.ts
- `src/app/(site)/volumes/[slug]/page.tsx` — same pattern
- `.env.local` — three Sanity env vars
- `package.json` — added 6 sanity packages + tsx dev-dep
