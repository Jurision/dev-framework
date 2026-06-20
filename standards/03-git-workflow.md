# 03 — Git workflow

🚧 Outline. To be written. Intended scope:

- **Trunk-based development** — short-lived branches off the trunk; all PRs target the
  trunk; never base a feature on another feature/spike branch; never push directly to the
  trunk or production.
- **Branch naming** — `feature/… | fix/… | refactor/… | chore/…` (or your agent prefix).
- **Small, atomic, reversible PRs** — one concern; **squash-merge, delete the branch.**
- **WIP limit** — starter default ≤ 5 in-flight branches/PRs (calibrate per profile); a
  branch with no PR after ~14 days is stale → open or delete.
- **Conventional Commits** + **SemVer** for libraries/releasable artifacts.
- **Branch protection** — required reviews + required status checks; the framework itself
  runs under this (`.github/workflows/framework-ci.yml`).

See `standards/00` §7–8 and `standards/08` for the agent-specific application.
