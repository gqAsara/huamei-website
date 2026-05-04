# Phase 0.5 — Discovery interview with operations

**Goal:** capture the first-party data that gates Phase 3 content.
Without these numbers, Editor cannot write pillar pages without
violating the "do not invent" rule.

**Format:** 90-minute call with the most senior person in operations
(plant manager, director of manufacturing, or the founder if they
still walk the floor). Recorded with consent. Output committed to
`.seo/reference/discovery-<date>.md` (the file IS the data dictionary
for every subsequent article).

**Who runs it:** human, not an agent. Agents listen to the recording
or read the transcript — they do not interview.

---

## Materials

1. What greyboard weights do you stock? (List actual mm.)
2. What papers do you stock? (Confirm the "eighty papers on file"
   number; ask for the top 10 most-used grades.)
3. What hot-foil stocks? (Confirm the "seventeen foils." Ask for
   names — Kurz, API, Foilco — and finishes.)
4. What inks? (Soy-based, UV, conventional — and which lines.)
5. What adhesives? (Especially: any food-contact-safe options for
   confectionery / cosmetic packaging.)

## Structures and capabilities

6. The "ninety-nine structures" claim — can you walk through the
   top 12? (We need real names for /craft children pages.)
7. Magnetic closure — what pull-force range do you actually
   engineer to? (Industry varies 8–24g; what's typical here?)
8. Tray-and-lid vs telescoping — when do you recommend each?
9. What dieline tolerances do your machines hold?
10. What are your MOQ ranges by structure type?
11. What is the realistic sample-to-production timeline by
    structure type?

## Quality

12. What QA staffing ratio per production line?
13. What is the documented reject rate (most recent year)?
14. What are your rework / replacement policies if a client rejects
    a batch?
15. Tooling cost — at what run size does tooling amortize?

## Certifications

16. Which certifications does Huamei actively maintain? (FSC,
    PEFC, ISO 9001, ISO 14001, BSCI, Sedex, SMETA, FSSC 22000,
    SA8000 — name what's real and where the certificates can be
    cited.)
17. Are there factory-specific certifications that differ across
    the four sites?

## Factories

18. Full address, phone, and (if shareable) GPS coordinates for
    each of Henan, Zhejiang, Sichuan, Guizhou.
19. Specialization per factory — does each handle different
    structure types or industries?
20. Headcount per factory.
21. Any factory tours allowed? (Useful for case-study photo
    permission.)

## Clients

22. Are there any clients with signed permission to be named in
    case studies? If yes, get a copy of the permission letter on
    file at `.seo/permissions/<client-slug>.txt`.
23. What categories / scales of brand can we describe without
    naming? ("a Fortune 500 cosmetic house," "a Korean indie
    brand.")

## Sustainability

24. Recycled content — what range across the SKU mix?
25. Carbon-per-unit data — does Huamei measure it? Per which
    products?
26. End-of-life — recyclable, compostable, anything else?
27. Any client-mandated sustainability frameworks Huamei is
    accredited under (LVMH SAC, Kering's biodiversity standard,
    etc.)?

## Voice and people

28. Who would speak to a journalist about each of: structure
    engineering, surface finishing, sustainability, client
    success?
29. Their title, tenure, factory, photo (for /house/people)?

---

## Output

After the interview, the human writes:

`.seo/reference/discovery-<date>.md` with sections matching above.

Then runs:

```
node scripts/activity-log.mjs human discovery .seo/reference/discovery-<date>.md
```

And updates `.seo/state.json`'s `phase05Discovery.dataPointsCollected`
field — count of questions answered concretely.

Editor and Site Engineer read this file before any pillar work.
