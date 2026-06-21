# Feature spec: adoption checklists

Filled from `templates/FEATURE_SPEC.md.template` (standards/11 §3). **Owns:** scope, behavior,
non-goals, acceptance for this feature.

- **Source:** the repo `README.md` (the project brief — referenced, not copied) +
  `standards/00–11` as the authoritative rule set.

## Goal
Adopters can run a short, checkable list at each gate (done / PR review / visual change /
new project) instead of re-reading whole standards — turning the standards into **operable
gates**.

## Actors
- A human or agent **opening/closing a PR** (DoD, PR-review), **making a UI change**
  (visual-review), or **bootstrapping a repo** (new-project-bootstrap).

## Preconditions
- The relevant standards exist (they do: `00–11`).

## Behavior & business rules
- Each checklist is **delta-only**: it **points to** the owning standard and lists the few
  things to actually verify — it does **not** restate the standard (`standards/09`
  generate-don't-duplicate). One fact, one owner.
- Items are **checkable** (a yes/no a reviewer can answer), not aspirations.
- Each checklist names which **profile/modifier** rows it activates where relevant
  (e.g. visual-review pulls in `internal-ui`/`public-ui`).

## Edge & failure cases
- Single-author repo → "independent technical review" has no second person; the checklist
  must say so honestly rather than imply a gate that isn't there.
- A checklist that duplicates a standard → defect (fix to a pointer).

## Permission & data impact
- None (docs only).

## Non-functional requirements
- Each checklist **fits on one screen**; `controls/check.mjs` stays green (links resolve).

## Observable result (acceptance)
- Four checklists exist under `checklists/`: **definition-of-done**, **pr-review**,
  **visual-review**, **new-project-bootstrap**; each is delta/pointer style, one screen,
  links resolve; README marks `checklists/` ✅.

## Non-goals
- Not a new standard or rule. Not restating `00–11`. Not automating the checks (that's a
  future `controls/` item, deferred).

## Dependencies & open questions
- Depends on `00–11`. Open question (for the phase report): does the full delivery package
  (brief→spec→plan→report) **help** for work this small, or is it paperwork? — evaluate.
