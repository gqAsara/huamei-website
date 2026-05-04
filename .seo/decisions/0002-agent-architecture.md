# ADR 0002 — Four-agent SEO team architecture

## Status

Accepted

## Context

Phase 0 of the playbook calls for a multi-month, multi-stream effort:
codebase commits, long-form content, brand-mention building,
measurement. A single Claude Code session cannot maintain context
across all four streams without drift, especially on voice (the
failure mode flagged in CLAUDE.md).

## Decision

Four specialist subagents under a thin human-led orchestrator:

- `site-engineer` — code commits and JSON-LD only
- `editor` — long-form prose, brand voice owner
- `outreach` — external-facing copy, brand mention log
- `analyst` — measurement, GEO scoring, weekly reports

Coordination via `.seo/state.json` (machine-readable progress) and
`.seo/decisions/` (this folder). Slash command `/seo` reads state and
proposes the next move.

## Alternatives considered

- **Single agent.** Rejected — voice drift between phases, no
  separation of code-writing and prose-writing review.
- **Two agents (Engineer + Writer).** Rejected — Outreach work has a
  different audience and rhythm from website content; combining them
  collapses important quality controls.
- **Six+ agents (separate Schema, Performance, GEO, Content, Outreach,
  Analyst).** Rejected — too much overlap, agents fight for context,
  human spends more time routing than reviewing.

## Consequences

- Easier: voice consistency, small-blast-radius PRs, clean handoffs.
- Harder: any task that genuinely spans two specialties (e.g., schema
  changes that depend on copy decisions) needs an explicit handoff —
  documented in agent system prompts.
- Revisit if: in 90 days the team is consistently running two specialists
  on the same task, that's evidence to merge.

## Date / agent / approver

- Date: 2026-05-04
- Drafted by: orchestrator (human + Claude)
- Approved by: <repository owner>
