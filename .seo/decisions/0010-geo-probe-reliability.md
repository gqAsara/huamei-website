# ADR-0010 — geo-probe chain reliability + 5/19–5/20 silent miss

- Date: 2026-05-26
- Status: Accepted
- Author: Claude (investigation), George Qiao (decision)
- Supersedes: —
- Related: ADR-0007 (Sanity CMS for volumes — same Sanity write path)

## Context

`/api/cron/geo-probe` is scheduled `5 12 * * *` UTC in `vercel.json`
(set by commit `f76a5d2` on 2026-05-17). Its job is to probe 51 active
`geoPrompt` documents × 3 engines (ChatGPT, Claude, Perplexity via
OpenRouter) = **153 expected `geoRun` documents per day**. It uses a
self-chaining batched design: each invocation processes `batchSize=10`
prompts (30 probes), then fires a `fetch()` at itself with the next
offset, no `await`, no `next/server` `after()` wrapper. Each chain link
has a fresh 5-minute Vercel function budget.

### What we observed

Sanity `geoRun` document counts (queried 2026-05-26 from the prod
dataset, `_createdAt > 2026-05-14`):

| Day | Runs | Distinct prompts processed | First seen | Last seen | Notes |
|---|---|---|---|---|---|
| 2026-05-14 | 30 | 10 | 11:08 Z | 11:10 Z | only first batch |
| 2026-05-15 | 30 | 10 | 11:21 Z | 11:23 Z | only first batch |
| 2026-05-16 | 30 | 10 | 11:42 Z | 11:44 Z | only first batch |
| 2026-05-17 | 30 | 10 | 11:02 Z | 11:04 Z | only first batch |
| 2026-05-18 | 120 | 40 | **02:53 Z** | 03:00 Z | **manual fire** — 4 chain links survived |
| 2026-05-19 | **0** | — | — | — | **silent miss** |
| 2026-05-20 | **0** | — | — | — | **silent miss** |
| 2026-05-21 | 180 | 50 | 12:08 Z (30) + 21:35 Z (150) | 21:45 Z | cron 1st batch + manual 5-chain catchup |
| 2026-05-22 | 0 | — | — | — | silent miss |
| 2026-05-23 | 30 | 10 | 12:24 Z | 12:26 Z | only first batch |
| 2026-05-24 | 0 | — | — | — | silent miss |
| 2026-05-25 | 30 | 10 | 12:15 Z | 12:16 Z | only first batch |

Two structural problems hiding inside what looked like "30 successful
runs per day":

1. **The chain never survives a cron-triggered run.** Every cron day
   recorded exactly 30 docs (1 batch of 10 prompts × 3 engines), then
   stopped. The remaining 41 prompts × 3 engines = 123 probes are
   silently dropped. We have been observing only ~20% of the intended
   citation coverage since 5/14.
2. **The cron itself silently misses entire days.** 5/19, 5/20, 5/22,
   5/24 produced zero rows. There is no error trail, no Sanity error
   doc, no alert.

### Why each batch worked on 5/18 and 5/21

Both 5/18 (02:53 Z) and 5/21 (21:35 Z) are outside the cron window.
They were manual fires through `/admin/geo/run`, which uses
`next/server`'s `after()` to keep the outbound `fetch()` alive after
the redirect response is sent. The probe route's *own* `kickNextBatch`
does not use `after()` — it relies on the Node event loop having
already opened the TCP socket before the function freezes.

On manual fires, the parent process has just held a connection open
long enough via `after()` that the first chain link is reliably picked
up by Vercel's edge before the outer function is suspended. From
there, each subsequent chain link inherits the same uncertain timing
— and in practice 4 out of 5 hops survive on 5/18, all 5 on 5/21.

On cron-triggered fires, the function's `runtime: nodejs` instance is
allocated, runs the work, returns the response, and Vercel
**immediately suspends the instance** — pending I/O including the
unawaited `fetch()` is killed before the TCP handshake completes.
This is documented Vercel behavior: anything not wrapped in
`waitUntil()` / `after()` is not guaranteed to survive.

### Why two consecutive days went to zero on 5/19–5/20

The cron platform (Vercel) does not guarantee at-least-once delivery.
A cron schedule run can be missed when:

- The deployment that owns the `vercel.json` is in `Building` or
  `Error` status at the trigger time (the cron only fires against
  the latest *Ready* production deployment).
- The 12:05 Z trigger collides with a fresh deployment that hasn't
  yet propagated cron config.
- A platform-side incident (Vercel has had cron incidents in 2025
  and 2026).

`vercel ls` only retains ~24h of deployments, so we cannot inspect the
5/19–5/20 build statuses directly. But the daily-routine commit
history shows: every day's 5 blog posts (and thus a fresh `main`
push + new prod deployment) lands between 12:21 and 12:32 Z — i.e.
**15–25 minutes after the cron should fire**. On most days that's
fine. On the days where a build was queued or canceled at 12:05 Z
(or had failed and was retrying), the cron silently missed.

A second contributing factor: even when the cron fired and the first
batch completed, the chain immediately died, so any subsequent
introspection — "did today's run happen?" — could only see 30 docs at
best. There was no way to distinguish "cron didn't fire" from "cron
fired but chain failed."

## Decision

Two-part fix. Part 1 is a one-line code change (apply now). Part 2 is
operational guardrails (track in `.seo/state.json`).

### Part 1 — wrap the chain kickoff in `after()`

`src/app/api/cron/geo-probe/route.ts`'s `kickNextBatch` becomes the
same pattern as `/admin/geo/run/route.ts`: the outbound `fetch()` is
moved inside `after(async () => { ... })` so Vercel keeps the
connection alive past the response. This is the documented
Vercel-supported way to fire-and-forget on a serverless function.

After this change, a single cron trigger should reliably produce
153 `geoRun` documents (51 prompts × 3 engines) across ~5 chain
hops over ~10 minutes — matching what manual fires already produce.

### Part 2 — operational guardrails (deferred, separate work)

Not implementing in this commit, but recommended next steps:

1. **Coverage alarm.** A second Vercel cron at `30 12 * * *` UTC
   (25 min after the geo-probe should have completed) that queries
   Sanity: "if today's `geoRun` count is < 100, fire a Resend email
   to the founder." Cost: one Vercel cron slot + one Sanity read.
2. **Fallback retry cron.** A third cron at `0 13 * * *` UTC that
   re-invokes `/api/cron/geo-probe?offset=0` only if today's count
   is < 50. Catches Vercel platform-level cron misses.
3. **Error doc emission.** When a chain link fails to dispatch
   (`fetch().catch(...)` already exists but only logs to console),
   also write a `geoRunError` Sanity document so we can see the
   failure on the admin dashboard.
4. **Wider deployment window for high-traffic days.** The 12:05 Z
   cron + 12:21 Z daily-routine commit are 16 minutes apart. If
   `f76a5d2`'s "compress to 5:00–5:15am PT" decision ever causes
   builds to overlap the cron, move geo-probe back to `0 11 * * *`
   (a quiet hour).

## Consequences

**Positive**

- Daily citation coverage goes from 20% to 100% of intended (51
  prompts × 3 engines).
- Citation-rate trend in the daily digest becomes statistically
  meaningful (currently sampling only 10 prompts).
- The fix is a single function rewrite, no schema migration.

**Negative**

- OpenRouter spend increases ~5× per day (from 30 → 153 probes).
  Current cost is ~$0.01/day per the SEO_CONTEXT cadence table;
  this rises to ~$0.05/day. Acceptable.
- 5x more Sanity writes per day. Still well within free-tier and
  document-count limits.

**Risk of recurrence**

- Vercel-side cron miss (5/19, 5/20, 5/22, 5/24 pattern) is NOT
  fixed by Part 1. Part 2's coverage alarm + fallback retry are
  needed to make the system actually durable. Until then we
  should expect ~1 silent miss per week.

## Root cause summary

Two independent failures that compounded:

1. **Primary (every day)**: chain self-POST in `kickNextBatch`
   relies on undocumented connection-pre-establishment timing
   that doesn't survive Vercel cron-triggered function suspension.
   Confidence: **high**. Evidence: every cron day records exactly
   1 batch (30 docs); every manual fire (which uses `after()` at
   the entry point) records 4–5 batches.

2. **Secondary (5/19, 5/20, 5/22, 5/24)**: Vercel platform-level
   cron miss, likely because the 12:05 Z trigger landed during a
   queued / failed / not-yet-propagated production build (the
   daily-routine commit lands at 12:21–12:32 Z, ~20 min later, so
   a slow build at 12:05 Z would leave no Ready deployment for
   the cron to target). Confidence: **medium**. Vercel does not
   retain build logs that far back; we can't prove it directly.
   No other plausible explanation given the alternating pattern.
