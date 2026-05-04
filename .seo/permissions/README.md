# Client permission letters

Signed permission to use a client's name in published Huamei
content lives in this folder, one file per client:

`<client-slug>.txt` (or `.pdf` — both fine).

The pre-write guard treats `.seo/permissions/` as write-once. To
update an existing permission, append a new dated entry below the
original (do not overwrite). Removal requires manual operator action
outside of any agent.

## Required content per file

- Client legal entity name
- Authorized signer name + title
- Date signed
- Scope of permission ("may be named in case studies and trade
  press / blog posts on huamei.io and Huamei social channels —
  Y/N")
- Any restrictions ("not in mainland Chinese-language press")
- Expiration date (or "indefinite")
- Counterpart contact for renewal

## Blanket discovery roster authorization (2026-05-04)

George Qiao (founder) explicitly authorized public naming of every
client referenced in `.seo/reference/discovery-2026-05-04.md` during
the 2026-05-04 Claude Code discovery session. The /volumes catalogue
is also de facto authoritative — clients already published in
`src/lib/volumes.ts` are grandfathered and require no separate file.

**Practical rule for the Editor agent:**

1. If a client is in `src/lib/volumes.ts` → grandfathered, name freely.
2. If a client is in the discovery file but not in /volumes → name freely
   on the strength of this blanket authorization, but file a
   per-client `.seo/permissions/<slug>.txt` record at the time of first
   public mention so the audit trail stays clean.
3. If a client is not in either → require a fresh permission file
   before naming.

Signed letters from individual clients remain a "TODO — chase down"
for record-keeping, but they do not gate publication.
