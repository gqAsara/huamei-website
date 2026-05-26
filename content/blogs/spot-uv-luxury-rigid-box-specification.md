---
title: "Spot UV coating on luxury rigid boxes: design specification and substrate guide"
description: "How to specify spot UV coating on a rigid box wrap — covering minimum feature sizes, trapping tolerances, substrate compatibility with soft-touch and matte lamination, and how registered spot UV aligns to print and hot-foil elements."
slug: "spot-uv-luxury-rigid-box-specification"
section: "blogs"
primaryKeyword: "spot UV rigid box specification"
secondaryKeywords:
  - "spot UV packaging design spec"
  - "spot UV on matte lamination"
  - "UV coating rigid box"
  - "spot UV over hot foil"
  - "luxury box surface finish spec"
intent: "investigative"
wordCount: 1020
author:
  name: "Sonia Sun"
  role: "Founder"
  tenure: "since 1992"
  factory: "Henan"
  url: "/house/people"
publishedAt: "2026-05-21T10:30:00+08:00"
updatedAt: "2026-05-21T10:30:00+08:00"
schema: "Article"
internalLinks:
  - "/craft/hot-foil"
  - "/blogs/soft-touch-vs-spot-uv-when-each-is-right"
  - "/volumes/collgene"
  - "/volumes/kefumei"
  - "/begin"
externalCitations:
  - { url: "https://www.iso.org/standard/61811.html", what: "ISO 12647-2:2013 — offset printing process control and colour management standard" }
  - { url: "https://www.fogra.org/en/", what: "FOGRA — European colour management and printing standards body" }
firstPartyData:
  - "Hot-foil registration held to ±0.1 mm at Huamei press floor"
  - "Seventeen curated hot-foil colours in-house"
  - "MOQ public floor: 200+ pieces"
  - "Sample lead time: 7–10 days"
  - "Production lead time: 15–20 days"
  - "Founded 1992, Heidelberg and KBA offset presses"
  - "Certifications: BSCI, CE, EQS, FSC, SGS"
featuredSnippetTarget:
  question: "What are the design file requirements for spot UV on a luxury rigid box?"
  answer: "Spot UV on a luxury rigid box requires a separate spot-colour separation in the print file — typically named 'SpotUV' or 'UV Varnish' — set to overprint at 100% opacity. Minimum feature size is 1 mm for isolated elements; use 0.3–0.5 mm trapping on edges that align to a printed element. Confirm the target substrate (soft-touch, matte, or gloss lamination) before file setup, as trapping and adhesion requirements differ."
geo:
  citablePassageCount: 5
  freshnessTarget: "annual"
---

# Spot UV coating on luxury rigid boxes: design specification and substrate guide

By Sonia Sun, Founder, Huamei 華美 — since 1992. Published 21 May 2026. Updated 21 May 2026.

Sonia Sun has run the finishing operations at Huamei since founding the company in Zhengzhou in 1992 — across multiple generations of UV coating equipment and thousands of rigid box wrap specifications, from skincare folding cartons to baijiu collector rigid boxes.

Spot UV is a selective coating — applied only to specific areas of the printed surface, rather than the full sheet — that creates a high-gloss, slightly raised element against a matte or soft-touch base. The effect is used to draw the eye to a logo, isolate a texture element, or create a contrast between a tactile surface and a luminous one. Getting it right requires correct file setup, the right substrate choice, and precise registration to any foil or emboss elements that share the same panel.

## What are the design file requirements for spot UV on a luxury rigid box?

> Spot UV on a luxury rigid box requires a separate spot-colour separation in the print file — typically named 'SpotUV' or 'UV Varnish' — set to overprint at 100% opacity. Minimum feature size is 1 mm for isolated elements; use 0.3–0.5 mm trapping on edges that align to a printed element. Confirm the target substrate (soft-touch, matte, or gloss lamination) before file setup, as trapping and adhesion requirements differ.

The spot UV element is prepared as a fifth colour in the print file — beyond the four CMYK separations — using a named spot colour swatch. The swatch name must match the convention the factory uses; confirm at brief stage, as naming varies between factories. The element is set to overprint rather than knockout: if it knocks out the print layer beneath, any registration drift creates a white gap between the UV and the print edge. Overprinting eliminates this risk.

Minimum feature size for spot UV is 1 mm for isolated marks — logos, icons, standalone type. Elements narrower than 1 mm may not hold the UV coating through the curing cycle, particularly on soft-touch lamination where surface energy is lower than on gloss. Fine hairlines below 0.5 mm are the most common cause of spot UV quality issues in production; if the design calls for a hairline UV border, confirm the factory's minimum feature capability before committing to the file structure.

Trapping — the overlap of the UV element edge onto the adjacent print — compensates for small registration variation between the print pass and the UV pass. A standard trapping value of 0.3–0.5 mm is used when the UV element aligns to a printed colour. When the UV element aligns to a foil element instead, the trapping approach changes, as described in the registered spot UV section below.

## What substrates are compatible with spot UV coating?

Matte lamination and soft-touch lamination are both compatible with spot UV, but require different approaches. On a matte laminate surface, the contrast between the flat substrate and the glossy UV is the visual event: the UV element shines against the surrounding flatness. The substrate is stable and adhesion is straightforward when the UV formulation is matched to the laminate chemistry.

On a soft-touch laminate, the contrast is both visual and tactile: the UV element is hard and glossy against the velvety surrounding surface, creating a perceptible difference under fingertip contact. The [Collgene](/volumes/collgene) skincare carton uses this combination — soft-touch base with logo in spot UV — because the tactile distinction reinforces brand recognition without additional tooling cost. The constraint is adhesion: UV coatings on soft-touch laminates require a UV formulation with higher surface-energy affinity, and the curing energy (measured in mJ/cm²) must be calibrated correctly to avoid delamination on the laminate-to-board interface.

"Spot UV on a soft-touch matte laminate produces a tactile contrast — glossy UV against velvety surrounding surface — that is perceptible under fingertip contact without the box being visible." This dual-sensory effect is the primary reason the combination appears in cosmetic and skincare packaging.

Gloss lamination accepts spot UV without the adhesion adjustment required for soft-touch, but the contrast is lower — the UV sits on a surface that is already reflective. The effect on gloss is more subtle, closer to a dimensional raise than a colour contrast. Where the UV is meant to be felt rather than seen, gloss lamination is appropriate; where visual contrast is the design intent, matte or soft-touch is the correct substrate choice.

## How is spot UV registered to hot-foil and emboss elements?

Registered spot UV — UV coating that must align to a [hot-foil](/craft/hot-foil) element or an emboss panel — is among the most demanding finishing operations on a rigid box wrap. Each finishing step uses a separate die or screen, and registration drift across the three operations (print, foil, UV) accumulates. For the press-side detail behind foil application, see [hot-foil stamping for luxury packaging](/blogs/hot-foil-stamping-for-luxury-packaging).

At Huamei, hot-foil registration is held to ±0.1 mm. For a registered spot UV element that must align to a foil element, the combined registration tolerance must be managed through the trapping specification in the design file. The standard approach for a UV outline that follows a foil perimeter is to extend the UV element 0.3 mm inside the foil boundary — so that any registration variation keeps the UV within the foil shape rather than creating a UV halo outside the foil edge.

"Huamei holds hot-foil-to-emboss registration to ±0.1 mm — three times tighter than the industry-typical ±0.3 mm — which sets the baseline tolerance that spot UV registration must be designed against when all three operations share the same panel."

For the [Kefumei](/volumes/kefumei) skincare brief, the combination of matte lamination, registered spot UV on the brand mark, and blind deboss on the surrounding panel required three sample iterations — each iteration closing the gap between the UV boundary and the deboss panel. That process illustrates why registered spot UV specifications require a physical sample cycle before production is released: digital file review alone cannot confirm how the three-operation stack behaves on the actual substrate.

[ISO 12647-2:2013](https://www.iso.org/standard/61811.html) governs offset print process control — the underlying print layer beneath the UV must be consistent for the UV contrast to read predictably across a production run. [FOGRA](https://www.fogra.org/en/) media wedges are used to confirm colour drift is within tolerance before the UV pass begins. Huamei's Heidelberg and KBA offset presses operate to ISO 12647-2 press standards, providing the print consistency that registered spot UV requires.

The [decision guide for soft-touch versus spot UV](/blogs/soft-touch-vs-spot-uv-when-each-is-right) covers when spot UV is the right finishing choice relative to full-sheet lamination alternatives. Once the decision to use spot UV is made, the specification details in this article apply. For a new brief, start at [/begin](/begin) to confirm substrate compatibility and file requirements before sampling begins.
