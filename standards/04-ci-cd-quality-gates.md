# 04 — CI/CD quality gates

🚧 Outline. To be written. Intended scope:

- **The gate stack, every PR, all green to merge** — typecheck → lint → format check →
  unit tests → smoke; e2e where it pays. Expose one composite command (e.g. `check`).
- **File-size tripwire** in CI (`standards/01` §3) — new/regrowing files over the cap fail.
- **Format/lint enforced**, not advisory; never delete a gate to make CI green.
- **Required status checks** + branch protection so the gates actually block (gates are the
  enforcement layer behind the written rules — `standards/08` §1).
- **Dependency hygiene** — automated updates with a **risk-classed** merge policy
  (`standards/01` §7); majors reviewed deliberately.
- **Deploy** — auto-deploy from the trunk; verify the live version matches the trunk via a
  deploy-revision marker; never hand-copy artifacts (`standards/06`).
- Keep CI fast and cacheable; a slow gate gets bypassed.
