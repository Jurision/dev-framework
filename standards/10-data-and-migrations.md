# 10 — Data & migrations

🚧 Outline. To be written. Intended scope:

- **Migrations are additive & forward-only** — never edit a shipped migration; add a new
  one. Every migration is reversible or has a documented recovery path.
- **Pre-migration backup** + a tested restore (`standards/06`); a bad migration must not be
  unrecoverable.
- **Schema discipline** — one source of truth for the schema; review schema changes as core
  changes (`standards/00` §10).
- **Tenancy / scoping** — if multi-tenant, **every business entity carries a tenant/
  workspace key and is isolated by it**, with a uniqueness/index per tenant. Decide this
  early; retrofitting tenancy is expensive. Treat it as a security boundary (`standards/07`).
- **Data retention & privacy** — define what is kept, for how long, and how it is deleted;
  keep PII out of logs.
- **Backwards compatibility** — expand/contract for breaking schema changes (add new, dual-
  write, migrate, drop old) so deploys stay reversible.
