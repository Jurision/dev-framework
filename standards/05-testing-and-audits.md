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
- New behavior carries a test for the behavior. A **pure refactor** keeps externally
  observable behavior and acceptance results unchanged — it **may** move, rename, or
  reorganize tests, decouple them from internals, or add a characterization test first; the
  invariant is that **a test change must not mask a behavior change**. If behavior changed,
  it isn't a pure refactor.

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
undeleted merged branches, and core-file growth.

> **Honest scope.** This framework's own `controls/check.mjs` currently implements only the
> *documentation-consistency* slice (doc references + relative links + no leaked
> placeholders). The **process** audit just described (WIP / stale / duplicate-topic /
> merged-undeleted / core-growth) is a **next-layer control, not yet implemented here.**
> Don't claim a check the repo doesn't run (`standards/00` §6).

## 5. Keep the suite fast and trusted *(MUST)*

- The full gate stack runs in CI on every PR (`standards/04`); a slow suite gets skipped.
- Coverage is a signal, not a target — chasing a number breeds assertion-free tests. Cover
  the **risk** (money, auth, data integrity, the critical journey) deliberately.
- A green suite that everyone distrusts is worse than none: invest in determinism so green
  actually means safe.
