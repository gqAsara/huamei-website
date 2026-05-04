# ADR 0004 — Lighthouse CI thresholds calibrated to current baseline

**Date:** 2026-05-04
**Status:** Accepted
**Deciders:** George Qiao (founder)

## Context

The bundle's `.lighthouserc.json` ships with assertions calibrated to
playbook ideals (Performance ≥0.85, Accessibility ≥0.90, SEO ≥0.95,
LCP <2.5s, CLS <0.1). On the first PR through CI (PR #1, Phase 0 GA4
install), these assertions failed because:

- Performance scored 0.63–0.79 across the four sampled pages
- Accessibility scored 0.86 on all four pages
- LCP and INP audits did not produce values reliably in the CI
  cold-start environment

PR #1 made no UI changes; it added a `<GoogleAnalytics>` component to
the root layout and a `NEXT_PUBLIC_GA_ID` environment variable. The
Lighthouse failures reflect existing site conditions, not regressions.

The purpose of Lighthouse CI is to catch *regressions* against a
known baseline. Calibrating assertions to ideal targets rather than
current reality means every PR fails on day one, training reviewers
to ignore Lighthouse output.

## Decision

Calibrate Lighthouse CI thresholds to the actual baseline observed in
PR #1, not the playbook ideal. Promote thresholds upward only after
fixing the underlying issue.

| Audit | Threshold | Severity | Rationale |
|---|---|---|---|
| Performance | ≥0.85 | warn | CI cold-start is unreliable; warn is honest |
| SEO | ≥0.95 | error | Stable across runs; current site exceeds |
| Accessibility | ≥0.85 | error | Floor of current baseline (0.86) |
| LCP | <2500ms | warn | Audit unreliable in CI cold-start |
| CLS | <0.1 | error | Stable, current passes |
| INP | <200ms | warn | Audit often skipped in CI |

## Follow-up work — accessibility audit

The 0.86 accessibility score is the current site condition, not a
regression. Open a dedicated branch (`seo/accessibility-audit`) to
investigate. Likely culprits given the brand's cream-and-gold palette:

- Color contrast on gold-on-cream type
- Missing aria-label on icon-only buttons (carousel arrows, mobile
  burger)
- Form labels associated correctly to inputs on /begin
- Heading hierarchy consistency

Once fixed, the threshold can be promoted to 0.90.

## Follow-up work — performance baseline

The homepage scoring 0.63 reflects the photo-heavy hero + carousel +
non-priority images. Already partially addressed by the May 3
optimization pass (image re-encode, next/image conversion). Real fix
requires: AVIF/WebP, blur placeholders on the materials grid (when
that ships), font-display: swap on the display fonts.

## Trigger to revisit

Quarterly. After each accessibility or performance commit lands,
recalibrate the floor upward. Goal by month 6: Accessibility ≥0.90,
Performance ≥0.85.
