# 03 — Git workflow

How changes move into the trunk: small, reviewable, reversible, and gated. Rule strength is
graded **MUST / SHOULD / MAY**; numeric limits are **starter defaults** to calibrate per
`profiles/`.

## 1. Trunk-based development *(MUST)*

- **One trunk** (`main`). Short-lived branches off the latest trunk; **all PRs target the
  trunk.**
- **Never base a feature on another feature/spike branch**, never merge through side
  channels, **never push directly to the trunk or to production.**
- Keep branches short-lived — long-running divergence is where merge pain and "merged but
  stale" bugs come from.

## 2. Branches & commits

- **Branch names** carry the actor/intent prefix: `feature/… | fix/… | refactor/… |
  chore/…`, or an agent prefix (`codex/… | claude/…`) in multi-agent repos. Branch from the
  **latest** trunk.
- **Small, atomic, reversible PRs** *(MUST)* — one concern per PR. If a PR does two things,
  split it.
- **Squash-merge, then delete the branch** *(SHOULD)* — keeps history linear and the branch
  list clean.
- **Conventional Commits** *(SHOULD; MUST for releasable artifacts)* — `type(scope): subject`
  (`feat`, `fix`, `docs`, `refactor`, `chore`, …). Drives changelogs and **SemVer** for
  libraries/SDKs.

## 3. Work-in-progress & staleness *(SHOULD; calibrate per profile)*

- **Cap in-flight branches/PRs.** Starter default **≤ 5**. Tighten for solo focus; loosen
  for a larger team. Finish or close before opening new.
- **Staleness window.** Starter default **~14 days** with no PR ⇒ stale: open the PR or
  delete the branch. Audit it (`standards/05` / `controls/`), don't rely on memory.
- **One tracked issue per unit of work, search before starting** — see `standards/08` §2
  for the profile grading (team: required; solo/experimental: may be ad-hoc but documented).

## 4. Branch protection *(MUST once the plan/visibility allows it)*

Enforce the rules above on the trunk — written rules that the platform doesn't enforce get
out-run by delivery pressure (`standards/00` §6). Recommended for `main`:

- **Require a pull request** to merge (no direct pushes).
- **Require status checks** to pass (the CI gate stack, `standards/04`).
- **Require conversation resolution.**
- **Require linear history** (matches squash-merge).
- **Block force-pushes and branch deletion.**
- **Solo repos:** do **not** require an approving reviewer / CODEOWNER approval — a sole
  author can't give an independent approval; keep an **admin break-glass bypass** and drop
  it when a second maintainer joins.
- **Team repos:** require ≥1 approving review (CODEOWNERS for sensitive paths) and remove the
  admin bypass.

> Platform note: GitHub branch protection needs a **public repo or a paid plan** on private
> repos. Until then, the gate is the CI check + PR convention, not a hard block — state that
> honestly rather than claiming enforcement you don't have.

## 5. Merging discipline *(MUST)*

- All required checks green before merge; never disable a gate to go green (`standards/04`).
- Prefer **squash** for a clean, revertible history; the PR is the unit of revert.
- After merge: delete the branch, close the issue, and confirm the result is real
  (`standards/00` §3 — report from the record, not intent).

## 6. Multi-agent specifics

When several agents share the repo, add the worktree-per-agent workflow and the
"check for in-flight work before editing a file" rule from `standards/08` §6.
