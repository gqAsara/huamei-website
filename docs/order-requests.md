# Packaging order requests

A small fixed button labelled Order Online links to `/order` from public pages. It sits above live chat and remains visible while scrolling. The homepage does not contain a separate ordering section. Visitors select a mailer, book-style or folding
box, inside dimensions and unit, quantity, finishes, contact information and
optional design files. This is an application for a manual quotation, not an
instant checkout. Pricing, availability, shipping and payment are agreed later.

`POST /api/orders` validates the specification and files, then reuses the
existing commission email delivery handler and its `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL` and `RESEND_API_KEY` settings. No database, payment platform
or new credentials are required. Staff receive the details and actual design
attachments in the existing inquiry mailbox and can reply directly to the
customer via Reply-To. The subject contains the application reference.

Success is returned only when Resend accepts the email, not when the customer
has paid or the application has been read. Failed delivery shows a retry error
and never displays a successful reference. A stable provider idempotency key
deduplicates identical browser retries within Resend's supported window.

Files: maximum two, 3 MiB combined, PDF/AI/INDD/PNG/JPG. No file is required.
They are sent as email attachments, never uploaded to a public asset library.
No new Sanity dataset, order database or administrative console is used.

Checks: `node --import tsx --test scripts/orders.test.ts scripts/commission.test.ts`.
All test sends are mocked. Do not submit test inquiries to the live mailbox
without authorization. Tests cover success without artwork, actual attachment
bytes, all box types, retries, validation and failure behavior.
