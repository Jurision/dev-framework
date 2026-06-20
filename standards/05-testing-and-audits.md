# 05 — Testing and audits

Two jobs: **tests** prove the code does what it should; **audits** prove the running system
and the process haven't quietly drifted. Both must be cheap to run and honest. Graded
**MUST / SHOULD / MAY**.

## 1. The test pyramid *(SHOULD)*

- **Many** fast **unit** tests on pure logic; **fewer integration** tests across real
  boundaries (DB, API); a **thin layer of end-to-end smoke** on the critical journeys.
- Keep pure logic separated from I/O so it is unit-testable without a running world
  (`standards/01` §2). If something is hard to test, that's usually a design smell, not a
  testing problem.
- Tests are **isolated and deterministic** — no shared mutable state, no order dependence,
  no real network/clock/randomness unless pinned. A flaky test is a broken test: fix or
  quarantine it, don't normalize red.

## 2. Evidence by change type *(MUST — see `standards/00` §2)*

- A **bug fix carries a regression test that fails before and passes after.** "Fixed" without
  a failing-first test is unverified.
- New behavior carries a test for the behavior; a refactor keeps the existing tests green
  and changes none of them in the same commit (otherwise it isn't a pure refactor).

## 3. "HTTP 200 ≠ healthy" — journey & entity audits *(MUST for user-facing systems)*

A page returning 200 can still be **inert**: dead buttons, links to nowhere, a list that
renders but whose detail view 404s, an edit that never persists or never re-renders.

- **Smoke** catches crashes; **journey audits** walk the real user path (create → see it →
  edit → see the edit → export) and assert the *effect*, not the status code
  (`standards/00` §5).
- Define the canonical **entity → source → renderer** mapping the audit enforces, so "every
  entity that exists has a working view" is checkable, not vibes.

## 4. Compliance audits — the process, checked *(SHOULD)*

What gets audited gets followed (`standards/08` §12). A lightweight script over `git`/`gh`
flags, in plain language: WIP over the limit, stale branches, duplicate-topic branches,
undeleted merged branches, and core-file growth. **This framework runs exactly this idea on
itself** (`controls/check.mjs` in `framework-ci`) — rules the repo can't check, it shouldn't
claim.

## 5. Keep the suite fast and trusted *(MUST)*

- The full gate stack runs in CI on every PR (`standards/04`); a slow suite gets skipped.
- Coverage is a signal, not a target — chasing a number breeds assertion-free tests. Cover
  the **risk** (money, auth, data integrity, the critical journey) deliberately.
- A green suite that everyone distrusts is worse than none: invest in determinism so green
  actually means safe.
