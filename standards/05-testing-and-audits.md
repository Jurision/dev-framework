# 05 — Testing and audits

🚧 Outline. To be written. Intended scope:

- **Test pyramid** — many fast unit tests on pure logic, fewer integration, a thin layer of
  end-to-end smoke for critical journeys. Keep pure logic separated so it is unit-testable
  (`standards/01` §2).
- **Evidence by change type** (`standards/00` §2) — a bug fix carries a **fail-before /
  pass-after** regression test.
- **HTTP 200 ≠ healthy** (`standards/00` §5) — smoke catches crashes; **journey/entity-level
  audits** catch inert-but-200 surfaces (dead controls, missing detail views, edits that
  never render). Define the canonical entity → source → renderer mapping the audit enforces.
- **Compliance audits** — a lightweight script over `git`/`gh` flags WIP-over-limit, stale
  branches, duplicate-topic branches, undeleted merged branches, and core-file growth, in
  plain language (`standards/08` §12). The framework does this on itself in `controls/`.
- **Test isolation** — no shared mutable state; deterministic; fast.
