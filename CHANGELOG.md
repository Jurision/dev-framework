# Changelog

Notable changes to the framework. Format: [Keep a Changelog](https://keepachangelog.com);
versioning: [SemVer](https://semver.org). A project adopting the framework should record
which version it copied, so it can diff against later releases.

## [Unreleased]

### Added
- `standards/05-testing-and-audits.md` — test pyramid + isolation, fail-before/pass-after
  regression evidence, **journey/entity audits** ("200 ≠ healthy"), and process-compliance
  audits (the framework runs this on itself).
- `standards/06-deployment-ops.md` — deploy-from-trunk, **deploy-revision lockstep**, state
  outside the artifact, atomic/off-site backups + pre-migration snapshot, **restore drills**
  (RPO/RTO), first-class rollback, health/alerting on user-visible symptoms, runbooks,
  per-environment config & secrets.
- `standards/04-ci-cd-quality-gates.md` + `templates/workflows/ci.yml.template` — the gate
  stack, required checks, and a **hardened, copyable** workflow (SHA-pinned Actions,
  least-privilege token, concurrency cancel, per-job timeout).
- `standards/03-git-workflow.md` — trunk-based development, branch & commit rules
  (Conventional Commits / SemVer), profile-graded WIP/staleness, and branch-protection
  guidance (with the GitHub private-repo plan caveat).

### Governance
- Repo made **public**; `main` **branch protection enabled** (PR required, `check` required,
  conversation resolution, linear history, no force-push/deletion; admin break-glass kept).
  Governance is now **platform-enforced**, not just convention.

### Earlier in this cycle
- Self-enforcement: `controls/check.mjs` + `framework-ci` (the framework checks itself).
- Governance: `PULL_REQUEST_TEMPLATE`, `CODEOWNERS`, `VERSION`, `LICENSE`, this changelog.
- `adapters/` — tool adapters (e.g. `CLAUDE.md` importing `@AGENTS.md`) + compatibility matrix.
- `standards/07-security-invariants.md` (NIST SSDF / OWASP ASVS anchored; AI-agent security).
- Outlines for standards 02–06, 09, 10; `profiles/` and `checklists/` scaffolds.
- Precedence hierarchy (law/compliance > security > project > profile > framework defaults).

### Changed
- Corrected the `AGENTS.md` cross-tool claim: it is the *preferred* source, but tools
  discover it differently and may need an adapter; it is context, not enforcement.
- Definition of Done is now evidence-by-change-type, not "every change needs a test".
- File-size cap reframed as a tripwire (a floor, not proof of architectural health);
  numbers are starter defaults; dependency auto-merge qualified by risk class.
- README marked **Alpha / not adoption-ready**; "30 min" reframed as a target.

### Fixed (alpha-hardening follow-up)
- **Pinned framework CI Actions to commit SHAs** — the framework no longer violates its own
  `standards/07` rule to pin Actions.
- **Enabled this repo's own `.github/PULL_REQUEST_TEMPLATE.md` + `CODEOWNERS`** (not just the
  copyable `templates/` — the framework now actually runs under them).
- Graded the agent rules (issue-per-work, WIP ≤5, ~14-day staleness, worktree) as
  **MUST/SHOULD + profile-conditional**; "root = production baseline" qualified to projects
  that auto-deploy from the trunk.
- README "known-good baseline" → **"developing baseline"** (no longer contradicts the Alpha banner).
- **Pinned standard versions:** NIST SSDF v1.1, OWASP ASVS 5.0.0, WCAG 2.2.
- Reframed `controls/check.mjs` as a **minimal** self-check, with its current limits stated.

## [0.1.0-alpha] — initial scaffold
- README, AGENTS.md, principles, AI-agent collaboration, code architecture, AGENTS template.
