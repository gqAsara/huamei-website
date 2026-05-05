# ADR 0006 — Drop Product schema on /craft/* in favor of Service

**Date:** 2026-05-05
**Status:** Accepted
**Context phase:** Phase 1 (Technical Hygiene) post-launch correction

## Context

On 2026-05-05 Google Search Console emailed two critical issues against
huamei.io:

1. **Product snippets** — "Either `price` or `priceSpecification.price`
   should be specified (in `offers`)"; non-critical: invalid `availability`
   enum, missing `priceCurrency`, missing `review`, missing
   `aggregateRating`.
2. **Merchant listings** — "Either `price` or `priceSpecification` should
   be specified (in `offers`)"; non-critical: invalid `brand` object type,
   missing `shippingDetails`, missing `hasMerchantReturnPolicy`, invalid
   `availability` enum.

Root cause: `src/lib/schema/product.ts` (now removed) emitted a `Product`
JSON-LD on every `/craft/[slug]` route — fifteen pages — with
`availability: "https://schema.org/MadeToOrder"` and no `price`.

The intent was to expose Huamei's craft capabilities (hot-foil stamping,
emboss, magnetic closures, etc.) as queryable products so that AI engines
and Google could parse them. In practice:

- Huamei does not list SKU prices for custom luxury packaging — every
  project is RFQ-quoted.
- Google's Product validator requires `offers.price` for rich-snippet
  eligibility AND for Merchant listings. Without it, the page is flagged
  as a critical structured-data failure.
- `MadeToOrder` is a valid `ItemAvailability` value per schema.org, but
  Google's parser flags it as "invalid enum value" because the
  Merchant-listings rich-result spec accepts a narrower set
  (`InStock`, `OutOfStock`, `PreOrder`, etc.).
- The Brand reference (`brand: { "@id": "${SITE}/#org" }`) was non-typed,
  also flagged.

The Product schema was a misuse: `/craft/*` pages describe a *capability*
or *service offering*, not a tradable product instance.

## Decision

Replace `Product` schema with `Service` schema on `/craft/[slug]` routes.

- Renamed `src/lib/schema/product.ts` → `src/lib/schema/service.ts`.
- Renamed `craftProduct(...)` → `craftService(...)`.
- New payload: `Service` with `name`, `description`, `provider` (typed
  `@id` reference to the Organization graph), `serviceType:
  "Custom luxury packaging manufacturing"`, `areaServed: Worldwide`, and
  optional `image`. No `offers`, no `price`, no `availability`.
- Updated `src/app/(site)/craft/[slug]/page.tsx` to call `craftService`.

Also fixed a separate but related defect: `src/lib/schema/article.ts`
was emitting `publisher: { "@id": "${SITE}#organization" }`, but the
Organization graph in `src/lib/schema/organization.ts` defines its
`@id` as `${SITE}/#org`. The publisher reference was dangling on every
published `/blogs/*` page. Corrected to `${SITE}/#org`.

## Consequences

**Lost:**
- `/craft/*` pages no longer eligible for Google Product rich snippets.
  In practice they were never going to appear there — without price,
  reviews, or a real product instance, Google would not surface them
  anyway. So the loss is theoretical.

**Gained:**
- Five GSC critical issues resolved in one schema swap.
- Cleaner entity graph: `Service` is the honest schema.org type for
  what these pages describe.
- AI engines (Claude, ChatGPT, Perplexity, Gemini) can still parse
  the page as a service offered by Huamei, with provider linked into
  the Organization graph.
- Article `publisher` reference now resolves to a real `@id`, restoring
  the published-pillar attribution chain.

## Validation

- `npm run validate:schema` — pass (Service is unrestricted in the local
  validator's required-fields map; payload contains no placeholder
  tokens).
- `npm run build` — green; all 15 `/craft/[slug]` pages prerender.
- Re-submit the affected pages to Google Search Console using the
  URL Inspection tool after deploy so the rich-result errors clear.

## Future

If we ever introduce a fixed-price stock SKU (e.g. a sample-pack
purchasable on the site), the right schema is then a fresh `Product`
graph with real `price` + `priceCurrency` + valid `availability` and
`hasMerchantReturnPolicy`. Until then, `Service` is correct.
