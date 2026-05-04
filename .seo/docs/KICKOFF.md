# Kickoff prompt

Paste this into Claude Code on your first run, in the repo root after
the install script has finished:

---

> Read `CLAUDE.md`, `.seo/playbook.md`, and `.seo/state.json`.
> Confirm in 3 bullets what you understand about the Huamei brand,
> voice rules, and current phase. Then run `/seo` and propose the
> first move.
>
> Before suggesting any work, verify:
>
> 1. `.claude/agents/` contains five agent files: site-engineer,
>    editor, outreach, analyst, translator.
> 2. `.claude/settings.json` references the five hook scripts and
>    they all exist under `scripts/` and are executable.
> 3. `.mcp.json` declares at least github, google-search-console,
>    google-analytics, vercel. If any env vars referenced are
>    unset, list which ones I need to set before any
>    data-pulling work happens.
> 4. `.github/workflows/seo-validate.yml` exists. (CI mirror of
>    the schema hook — agent or human PRs both validate.)
> 5. `.seo/state.schema.json` exists; running
>    `node scripts/validate-state-schema.mjs` returns "ok".
>
> If anything is missing or wrong, list it before proposing work.

---

After the orchestrator's reply, your first commands are roughly:

> Use the analyst subagent to capture baseline metrics for week 1,
> even if some sources are not yet connected. Write the report to
> `.seo/reports/weekly/2026-W19.md` and update `.seo/state.json`
> only for the metrics you can actually measure today.

> Schedule the Phase 0.5 discovery interview using
> `.seo/templates/discovery-interview.md`. Until that interview is
> complete, Editor cannot draft pillar pages — Phase 3 is gated on
> it.

> Use the site-engineer subagent to ship Phase 1 commit #1 (title
> and metadata templates) per playbook §6.1. Open a draft PR and
> wait for my review.

Phase 1 ships in week 1 in parallel with Phase 0.5 discovery. Phase
3 (content) cannot start until discovery output lands at
`.seo/reference/discovery-<date>.md`.
