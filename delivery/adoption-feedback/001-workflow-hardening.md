# Adoption feedback 001 — workflow hardening

Findings from the **first real-project adoption** of `v0.1.0-alpha`. **Desensitized** — no
project names, identifiers, paths, revisions, or production details; only generalizable
lessons. Input to `0.2`.

**Context (generic):** a `web-app + internal-ui + persistent-data + multi-tenant +
protected-output` project. The adoption closed a gap the framework's own reverse-test
predicted: strong CI **coverage** but missing **workflow hardening** (`standards/04` two axes)
and floating Action tags (`standards/07` §1.7).

## What worked (the framework earned its keep)
- **Gates caught real non-compliance.** The project's format gate flagged an unformatted file
  in the change; the hardening rules surfaced a genuine gap. Enforced rules > written rules.
- **Composable profile mapped cleanly.** One base + four modifiers described a real project
  with no ambiguity — evidence the composition model beats a single coarse profile.
- **Scale-to-risk held up.** For a low-risk infra change, the delivery package lived **in the
  PR body** (a few lines of spec/plan/acceptance), not committed docs — confirming `11` §2.

## Friction → framework lessons
1. **A repo's auto-formatter scope can differ from its format *gate* scope.** Running the
   project's "format everything" command reformatted dozens of unrelated files, while the gate
   only checks *changed* files. → **Run the gate's exact check locally; apply an auto-fixer
   only to the files you changed.** Candidate checklist line (`pr-review` / bootstrap).
2. **"CI green" ≠ "platform-required".** Without required status checks, a red gate can still
   merge. Coverage + hardening + **enforcement** are independent (`04`); confirm enforcement,
   don't infer it from a green run.
3. **A config/docs change can trigger a full production release.** A pipeline that deploys on
   every trunk push rebuilds, migrates, restarts, and swaps — **not a no-op.** Treat any
   trunk-merge as a real deploy and verify it (`06`).
4. **Inventory *all* workflows on adoption.** It is easy to harden the **validation** workflow
   and miss the **privileged deploy/migration** workflow — which is the one holding production
   credentials and most needs SHA-pinning + least privilege + serialization. Don't stop at CI.
5. **Selecting a modifier describes shape, not compliance.** Declaring `persistent-data` /
   `multi-tenant` records intent; it does **not** prove the restore drill or cross-tenant test
   exist. The manifest's `exceptions: []` must not be read as "compliant".
6. **Post-deploy, the live-revision assertion is commonly missing.** The pipeline *wrote* a
   revision marker but did not *read it back and assert* `live == intended release SHA` — so
   the last verification step fell to a human. This is the single most-repeated gap across
   adoption and the dry-runs.

## Implications for 0.2
- **First control = `workflow-policy lint`** (static): validated directly here; applies to
  nearly all Actions projects; low-risk (no production credentials); can immediately check the
  framework's own and all copied workflows; and would have caught finding #4 automatically.
- **Second candidate = a live-revision assertion** helper (finding #6).
- **Checklist tweak:** add finding #1 (formatter-vs-gate scope) and finding #4 (inventory all
  workflows) to `checklists/pr-review.md` / `new-project-bootstrap.md`.
