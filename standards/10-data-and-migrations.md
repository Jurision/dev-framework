# 10 — Data & migrations

Code is replaceable; **data is not**. Schema changes are the highest-blast-radius routine
operation, so they get the most discipline: additive, reversible, backed up, and reviewed as
core changes. Graded **MUST / SHOULD / MAY**.

> **Calibrate by data-system type.** The MUSTs below assume **persistent production data** —
> an always-on store you cannot simply rebuild. For rebuildable / local / SQLite / test data,
> a framework with a transactional migration ledger, a system that can take a maintenance
> window, or a very large DB that relies on **PITR** rather than per-migration snapshots,
> several rules (per-migration snapshot, dual-write, full expand/contract) relax to
> **SHOULD** or "choose by risk" (see `profiles/`). What stays **MUST everywhere**: never
> edit a shipped migration, and always have a known recovery path.

## 1. Migrations are additive & forward-only *(MUST)*

- **Never edit a shipped migration** — once it has run anywhere, it is immutable; add a new
  migration instead. Editing history desyncs every environment that already applied it.
- Every migration is **reversible or has a documented recovery path**. "How do I undo this?"
  is answered before it merges, not during the incident.
- Migrations are **ordered and idempotent-safe** to re-run/resume; a half-applied migration
  must not corrupt state.

## 2. Backed up before it runs *(MUST for persistent production data)*

- **Establish and verify a risk-appropriate recovery point before every schema migration**
  (snapshot / PITR / transactional rollback / equivalent; the pre-migration hook,
  `standards/06` §4) so a
  bad migration has an immediate, tested restore point (`standards/06` §5). A migration
  without a recovery point is a gamble with the one thing you can't rebuild.

## 3. Expand / contract for breaking changes *(MUST for zero-downtime systems; else SHOULD)*

To change a schema without a flag-day outage, split it across deploys so each step is
backward-compatible and reversible:

1. **Expand** — add the new column/table (nullable/defaulted); don't remove anything.
2. **Dual-write / backfill** — write both, migrate existing rows.
3. **Migrate reads** — switch readers to the new shape once backfill is verified.
4. **Contract** — drop the old shape only after nothing reads it.

This keeps a **code rollback** safe at every step (`standards/06` §6) — the schema never gets
ahead of the code that can run against it.

## 4. Schema is a reviewed, single source of truth *(MUST)*

- **One source of truth** for the schema (the migration history / schema file), generated
  from — not hand-synced with — the ORM/models (`standards/00` §7).
- Review schema changes as **core changes** — an ADR for anything significant
  (`standards/00` §10, `standards/09` §2). A column is forever; a function is a refactor away.

## 5. Tenancy & scoping — decide early *(MUST if multi-tenant)*

- **Every business entity carries a tenant / workspace key and is isolated by it**, with a
  per-tenant uniqueness constraint/index. Queries are tenant-scoped by default; a missing
  scope is a data-leak bug.
- Treat the tenant boundary as a **security boundary** (`standards/07`): enforce it in the
  data layer, and add a **regression test that asserts cross-tenant access fails.**
- Decide this **early** — retrofitting tenancy onto a single-tenant schema is one of the most
  expensive migrations there is.

## 6. Retention & privacy *(MUST for personal data)*

- Define **what is kept, for how long, and how it is deleted** (including hard-delete and
  cascade). Don't accrete personal data with no expiry.
- **No PII/secrets in logs** (`standards/07`); separate production data from non-production;
  honor deletion/export obligations where they apply (`standards/00` precedence: law first).
