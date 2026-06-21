# Implementation plan — Phase 1: adoption checklists

Filled from `templates/IMPLEMENTATION_PLAN.md.template` (standards/11 §3). **Owns:** sequence,
impact, verification, boundaries. Does not override the feature spec.

- **Sources (referenced, not re-pasted):** `delivery/checklists.feature-spec.md` ·
  `README.md` (brief) · related ADR: none (no core/irreversible decision — docs only).
- **Risk level:** **low** (docs only; no code, schema, deploy, or security surface).
- **In scope:** write `definition-of-done.md`, `pr-review.md`, `visual-review.md`; align the
  existing `new-project-bootstrap.md` to standard 11's foundation order.
- **Out of scope / do NOT touch:** the standards `00–11` themselves; any code/control; the
  CI workflow.
- **Impact surface:** `checklists/` (+ `README` structure line, `CHANGELOG`). No data/API/deploy.
- **Profile-required gates:** none (docs).
- **Rollback:** revert the PR (docs only).

## Sub-phase 1.1: write the four checklists   *(risk: low → batch to checkpoint)*

1. `definition-of-done.md` — point to `00` §2 (evidence by change type), `08` §5
   (git-verifiable), `11` §6 (two-role acceptance).
   - **Done =** the four evidence-by-change-type rows + the "claimed ≠ done" check, all as pointers.
   - **Verify by:** `controls/check.mjs` green; manual read = one screen, no restated prose.
2. `pr-review.md` — point to `01` (size), `03` (workflow), `04` (gates), `07` (security), `08`/`11` (DoD).
3. `visual-review.md` — point to `02` + `internal-ui`/`public-ui`.
4. Align `new-project-bootstrap.md` to `11` §1 foundation order (brief→stack→skeleton→AGENTS).
   - **Done =** it references `11` and the two-stage AGENTS contract.
   - **Don't touch:** don't turn it into a restatement of `11`.

## Acceptance checkpoints (standards/11 §5)
- **Checkpoint A — spec approval:** the feature spec is agreed before writing (low-risk, so
  approval is the owner's nod, recorded in the phase report).
- **Checkpoint B — implementation + independent technical verification:** after writing, run
  `check.mjs` + review each checklist for delta-only/one-screen, and **record honestly that
  technical review is self-review** (single-author repo — no second reviewer; `03` §4).

## Traceability & open questions
- requirement → spec → plan check: every plan item traces to a feature-spec acceptance bullet. ✓
- Open: evaluate paperwork-vs-value (carried to the phase report).

## Change log / approver
- 2026-06-21 — initial plan — owner: project owner (single-author; see Checkpoint B caveat).
