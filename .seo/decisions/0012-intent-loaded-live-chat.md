# ADR 0012 — Load live chat when a visitor opens it

## Status

Accepted — live account connected, bidirectional chat verified, and production deployment authorized.

## Context

The website renovation requires genuine in-site consultation, alongside the
existing project enquiry form. A third-party chat widget adds network activity,
visitor tracking and page weight. The existing performance baseline (ADR 0004)
also calls for avoiding unnecessary initial work.

## Decision

Integrate the official tawk.to widget behind validated public property/widget
identifiers. Load it only after the visitor chooses a chat entry. Mount the
provider in the public-site layout so the conversation survives ordinary site
navigation, and hide the widget on exit from that layout. Use the provider's
actual availability; do not announce “online” before it is known. Missing
configuration hides the feature, and connection failures offer a clearly
identified project-form fallback.

## Alternatives considered

- Loading the widget on every page view adds work and third-party contact
  before the visitor requests a conversation.
- A decorative chat panel backed only by email would not satisfy live chat.
- Opening WhatsApp was offered; the user selected in-site live chat instead.

## Consequences

The first click includes the provider's connection time. Real-time replies
still require an available staff member in the provider dashboard/app. Public
embed identifiers must be set before a new build, and provider/account checks
must pass before claiming the feature is connected. Setup and verification are
documented in `docs/live-chat.md`.

## Date / agent / approver

- Date: 2026-10-09
- Drafted by: site-engineer
- Authorized by: user request to integrate live chat and explicit approval of the internal bidirectional test; deployment authorized on 2026-10-09 and reconfirmed on 2026-10-10.
