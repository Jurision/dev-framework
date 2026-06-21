# Modifier: protected-output

**Status: provisional** · **Evidence maturity: one real-project dry-run.**

The project produces **documents / exports / artifacts with a fixed semantic and visual
contract** — invoices, trade documents, branded PDFs, regulated forms. These are not ordinary
app screens; their output must stay stable on the **dimensions the project commits to** (rule 2).
Delta over `00–10` (extends the protected-zone rules of `standards/01` §6 and `standards/02` §6).

## Applies to / does NOT apply to

- **Applies:** generated output whose exact content/layout is a contract (legal, financial,
  brand-locked, audience-specific).
- **Does not apply:** the surrounding application UI → `internal-ui` / `public-ui`.

## Rules raised to MUST

1. **Protected renderers move verbatim.** When refactoring/relocating a protected renderer,
   change its **location, not its output** — never restyle in the same change
   (`standards/01` §6, `standards/02` §6). Verify the before/after render is identical.
2. **Declare the protected dimensions, then regression-test them in required CI.** Pin the
   output on the dimensions the artifact actually promises — **semantic** (fields, amounts,
   order, audience-data), **structural** (page count, tables, regions, schema), and/or
   **visual** (layout/style, **with a defined tolerance**). A byte/pixel diff alone is not the
   contract — timestamps, metadata, compression, and font rendering vary acceptably. Golden
   fixtures **normalize non-deterministic fields first**, then compare on the committed
   dimensions; **updating a golden requires explicit reviewer confirmation of the diff** (no
   "tests went red → regenerate the snapshot").
3. **The protected zone is isolated** (e.g., a CSS scope / dedicated module) so unrelated
   changes can't bleed into it.
4. **Audience-correct output (security-flavored).** **Project-defined internal-only /
   sensitive fields** (e.g. cost, margin, internal identifiers, PII) **MUST NOT leak into
   externally-shared output** — exclusion is the default and is **asserted by test**
   (`standards/07` internal≠external; the dry-run's customer-safe export with a regression test
   is the model).

## Rules that may relax

- None. These are contract and data-exposure guarantees.

## Required controls

- A **golden-fixture / output regression test** in required CI.
- For audience-split output: a test asserting **internal fields are excluded** from external
  exports (fail-closed).

## Acceptance evidence

- Regression tests on the declared dimensions are green; a "pure move" PR shows an identical
  render on those dimensions; the audience-exclusion is covered by a valid regression test
  (**fail-before/pass-after only when fixing a real leak** — a new customer-safe output just
  needs a valid regression test, `standards/05` §2).

## Non-goals (owned elsewhere)

- The app's own design system / screen visual review → `standards/02` + `internal-ui` /
  `public-ui`.
- General data-leak / least-privilege rules → `standards/07`.

> Provisional: one protected-output dry-run (trade documents + customer-safe exports). The
> **internal-data-exclusion test** is the highest-value control — keep it MUST.
