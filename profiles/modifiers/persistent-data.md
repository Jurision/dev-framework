# Modifier: persistent-data

**Status: provisional** · **Evidence maturity: three real-project dry-runs.**

The project owns **state that cannot be cheaply rebuilt** (a production database, uploaded
files, generated artifacts). Delta over `00–10` for protecting that state. The recurring
finding across all three dry-runs: backups exist, but **recovery is rarely verified**.

## Applies to / does NOT apply to

- **Applies:** any always-on store whose loss is not recoverable by re-running a build or
  re-deriving from source.
- **Does not apply:** rebuildable/local/test data, or a stateless service (it still must
  prove its deployed revision — but that is `standards/06`, **not** this modifier).

## Rules raised to MUST

1. **Backups are atomic and crash-safe** (`standards/06` §4) — dump/snapshot to a temp
   target, integrity/non-empty check, atomic move. A half-written backup restores to garbage.
2. **At least one copy in a separate failure domain** (off-site / different host / region /
   account).
3. **A scheduled restore drill** (`standards/06` §5) — periodically **restore to a scratch
   environment and verify usability** (business-integrity / row-count checks), not only during
   an incident. **This is the rule the dry-runs most often fail (0/3 verified)** — kept MUST
   because it's the common blind spot. **Cadence** is set by RPO/RTO, change frequency, and
   risk, not one universal frequency.
4. **Track RPO and RTO** — define max acceptable data loss and downtime; the drill measures
   whether you actually meet them.
5. **A verified pre-migration recovery point** (`standards/10` §2) — before each production
   migration, **automatically establish and verify a recovery point appropriate to the risk
   model**: a snapshot, a PITR bookmark, a transactional rollback point, or equivalent — not a
   fixed implementation, and not just a runbook instruction.
6. **A written retention policy** (and, for personal data, deletion path + encryption — see
   `regulated` / `standards/07`).

## Rules that may relax

- Nothing here relaxes a security or data-integrity invariant. "We have a runbook" does
  **not** satisfy 3 or 5 — *documented ≠ executed*; the drill and the pre-migration recovery
  point must actually run and be verified.

## Required controls

- A **backup job** (scheduled, monitored — alert on a missed backup).
- A **restore-drill job** (scheduled) that restores + asserts integrity.
- A **risk-appropriate recovery-point step** (snapshot / PITR / transactional rollback /
  equivalent) wired into the deploy/migration pipeline.

## Acceptance evidence

- A recent backup exists **off-site**; the **last restore drill** has a date and a pass
  result; the migration pipeline shows a **verified pre-migration recovery point** step; RPO/RTO
  are written down.

## Non-goals (owned elsewhere)

- **Live-revision assertion** (`live == intended release SHA`) → **`standards/06` §2**: this
  applies to *every* deployed app, **including stateless ones**, so it is **not** part of this
  data modifier.
- Migration mechanics (additive/forward-only, expand/contract) → `standards/10`.
- Tenant isolation of that data → **`multi-tenant`**.

> Provisional but the **best-evidenced** modifier (3 dry-runs). The restore-drill MUST is
> deliberately strict against a 0/3 real-world record — a shared blind spot is a reason to
> keep the rule, not to weaken it.
