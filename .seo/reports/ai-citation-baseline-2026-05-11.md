# AI / search citation baseline — 2026-05-11

First probe pass for Huamei brand visibility and pillar content citation. Two days after the cluster expansion, 7 days after first content shipped.

## Probe 1: `site:huamei.io`

**Initial result (WebSearch tool):** Zero indexed pages.

**CORRECTION 2026-05-11 (later same day).** The WebSearch tool returns a third-party scraped index, **not** Google's actual index. Founder pulled the real number from Google Search Console:

```
GSC Page Indexing report (data as of 5/7/26):
  Indexed:      47 pages
  Not indexed:  19 pages  (1 reason)
```

**Real read.** Google has already indexed **47 of ~66 known pages** at day 7. This is materially faster than the "3–6 month brand sandbox" timeline the playbook assumes. Two implications:

1. **The sandbox framing should be revised toward 2–8 weeks**, not 3–6 months, for non-branded competitive ranking. Indexing alone is the first hurdle and we're already past it.
2. **The 19 not-indexed pages are worth diagnosing.** GSC reports them under a single reason — likely "Crawled — currently not indexed" or "Page with redirect" (our `/margin` → `/blogs` 301s). Founder can drill into the "1 reason" link in GSC to confirm.

**Action.** Founder to click the "Not indexed → 1 reason" pill in GSC and report back what category the 19 pages fall under. If it's "Crawled — currently not indexed" (Google's "we saw it, we don't think it's worth indexing yet"), the next move is content quality + internal-linking on those specific URLs. If it's "Page with redirect" (our old `/margin` URLs), no action — that's correct.

## Probe 2: Brand collision — "huamei luxury packaging manufacturer"

**Result:** Three other "Huamei" packaging companies rank above us.

| URL | Company | Industry |
|---|---|---|
| huamei-inc.com | Huamei Inc. (Shenzhen) | Multi-industry rigid + plastic packaging |
| huameipack.com | Shandong Huamei Packaging Co. Ltd. | Tin / aerosol cans, cold-chain |
| huameiprinting.com | Guangdong Huamei Printing | Print sourcing |

**Read.** "Huamei" is a contested brand name in Chinese packaging. The two companies most likely to be mistaken for us are **Huamei Inc.** (huamei-inc.com) and **Guangdong Huamei Printing** — both have English-language sites, both target Western buyers, both rank for "Huamei" branded queries.

This is a long-term brand-distinction problem that content alone cannot solve. It needs:

1. **Backlinks** from trusted English-language sources with `huamei.io` as the anchor (the outreach work that is currently blocked on LinkedIn page creation).
2. **Stronger schema disambiguation** — `Organization.alternateName` already includes `華美` but `sameAs` is empty. Adding `sameAs` URLs (LinkedIn, Crunchbase, etc.) would help. **Founder action item.**
3. **A possible disambiguation page** — `/house/which-huamei` calling out the three other companies and explicitly clarifying who we are. Risky (mentions competitors by name) but high-clarity. Not recommended yet; revisit if confusion shows up in inbound RFQs.

Action: queue `Organization.sameAs` enrichment for next site PR.

## Probe 3: "magnetic closure pull force grams luxury packaging" — substantive content audit

**Result:** Surfaced a unit-convention issue in our cluster #1.

Industry-reference content (e.g. [ADAMS Magnetic Products](https://www.adamsmagnetic.com/applications-and-markets-served/package-closure-magnets/)) quotes pull-force in **3–5 pounds** (1,400–2,300 grams). Our cluster #1 publishes **6–50 grams at 2,800 Gauss**. The two numbers differ by ~40×.

**Diagnosis.** Both are right for different applications.

- **Industry "3–5 lbs"** measures peak axial separation force between two large neodymium magnet pairs, typically for industrial gift boxes, wood-cased presentation cases, hinged enclosures where the lid weighs several hundred grams.
- **Huamei's "6–50 g"** measures the hold-against-gravity force for luxury cosmetic / spirits / gifting rigid boxes where the lid weighs 30–80 grams and is opened with a single thumb.

A 3-lb closure on a 60-gram cosmetic lid feels industrial, not luxurious. The 6–50 g spec is what's actually appropriate for the products we make.

**Action this session.** Updated cluster #1 (`/blogs/magnetic-pull-force-explained`) with a new sub-section "A note on units — why some manufacturers quote pounds, not grams" that:
- Acknowledges the 3–5 lb industry convention
- Explains it measures a different thing (industrial heavy-lid closures)
- Reaffirms why grams is the correct spec for luxury rigid construction
- States the conversion ask: "if a brief specifies in pounds, we ask one question — what is the lid weight"

This is the kind of clarification that wins AI citations: being the page that explains a confusing industry term.

## Probe 4: Pillar primary keywords — citation watch

For each pillar's primary keyword, check whether Huamei appears in the top 20:

| Pillar | Primary keyword | Huamei in top 20? |
|---|---|---|
| P1 | "custom luxury rigid box manufacturer" | Not yet (WebSearch — true GSC ranking probably TBD) |
| P2 | "hot-foil stamping for luxury packaging" | Not yet |
| P4 | "Chinese luxury packaging manufacturer" | Not yet |

**Read after the correction above.** Since Google has 47 pages indexed, ranking is the next gate, not indexing. Worth checking GSC → Performance → Queries (last 28 days) for any non-zero impressions on pillar keywords; even position-50 impressions are early signal that the algorithm is testing our content against the query.

**Founder action.** Open GSC → Performance → toggle "Average position" on → look for queries containing "luxury packaging," "rigid box," "hot foil," or "Chinese packaging." If any show up with even a single impression at position 30+, we're inside the ranking window and the brand sandbox is shorter than expected.

## Recommended actions

| # | Action | Owner | Status |
|---|---|---|---|
| 1 | Cluster #6 — MOQ realities for luxury packaging | editor | in this PR |
| 2 | Pillar 4 — add "manufacturer-not-agent" positioning | editor | in this PR |
| 3 | Cluster #1 refresh — units clarification (lbs vs grams) | editor | in this PR |
| 4 | Enrich Organization.sameAs (LinkedIn / Crunchbase / etc.) | founder + site-engineer | queued (founder needs to create LinkedIn first) |
| 5 | Re-probe site:huamei.io weekly | analyst | queued |
| 6 | Full AI-engine citation probe (Claude / Perplexity / Gemini / ChatGPT) | analyst | scheduled ~2026-05-25 once indexing is mature |

## Sources

- [ADAMS Magnetic — Package closure magnets](https://www.adamsmagnetic.com/applications-and-markets-served/package-closure-magnets/)
- [Huamei Inc (the other one) — Shenzhen](https://www.huamei-inc.com/)
- [Shandong Huamei Packaging](http://huameipack.com/page/about-us.html)
- [Guangdong Huamei Printing](https://huameiprinting.com/)
