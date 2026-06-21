# Changelog

Notable changes to the framework. Format: [Keep a Changelog](https://keepachangelog.com);
versioning: [SemVer](https://semver.org). A project adopting the framework should record
which version it copied, so it can diff against later releases.

## [Unreleased]

### Added
- **`profiles/modifiers/protected-output.md`** (provisional) — pixel/format-locked documents
  & exports: renderers move **verbatim**, **golden-fixture regression** in required CI, an
  isolated zone, and **audience-correct output** (internal data excluded from external
  exports, asserted by test).
- **`profiles/modifiers/runtime-ai.md` + `human-in-the-loop.md`** (provisional) — AI
  modifiers. `runtime-ai`: per-call model/provider/prompt version, least-privilege tool
  permissions, limits/timeouts, graceful degradation, leak-free observability.
  `human-in-the-loop`: AI drafts / human commits, a **code-enforced approval gate + audit**
  (operationalizes `07` §2.3 for AI-suggested side effects).
- **`profiles/modifiers/multi-tenant.md`** (provisional) — security-boundary modifier: tenant
  key + per-tenant uniqueness, **query-layer default scoping** (schema key ≠ isolation), and a
  **cross-tenant negative test as a required-CI MUST** (the proof the dry-run lacked).
- **`profiles/modifiers/persistent-data.md`** (provisional, 3 dry-runs) — atomic/off-site
  backups, **scheduled restore drill** (raised to MUST against a 0/3 real-world record),
  RPO/RTO, pre-migration snapshot, retention. `live-revision` deliberately left in `06`
  (stateless apps need it too, so it isn't a *data* modifier rule).
- **`profiles/modifiers/internal-ui.md` + `public-ui.md`** (provisional) — first UI
  modifiers. `internal-ui`: `02` applies in full to operator tools (no a11y/state waiver for
  "internal"). `public-ui`: sitemap + public link-graph + content↔render parity + scheduled
  **synthetic content** monitoring + full WCAG on public pages. Both delta-only over `02`.
- **`profiles/base/web-app.md`** (provisional, 2 web dry-runs) — browser-delivered workload
  **delta only**: production artifact exercised in required CI; the project **defines and
  E2E-verifies its own critical journey(s)** (no fixed edit→render journey;
  mutation→persistence→render for write apps); routing contract. Inherits `02`/`06`; leaves
  public-vs-internal, tenancy, and protected-output to modifiers.
- **`profiles/base/data-ai.md`** (provisional, first base profile) — the data/analysis
  workload **delta only**: provenance + lineage, versioned transforms, deterministic-stage
  tests vs **versioned eval sets + thresholds** for model output, a **blocking data-quality
  gate**, and "process-audit ≠ build/test gate". Cross-refs `07`/modifiers instead of
  restating them (read-only AI path, backups, UI, side-effects live elsewhere).
- **`profiles/` composition model** — replaced "one project picks one profile" with **one
  base workload + composable modifiers** (the three frozen dry-runs proved real projects are
  mixed). Adds precedence-safe override rules (security/law never lowered; no silent
  downgrades), a delta-only per-doc skeleton, and an `adoption-manifest.template.yml`. Base
  and modifier docs follow in later PRs, generated from dry-run evidence.
- `standards/10-data-and-migrations.md` — additive/forward-only migrations, pre-migration
  backup, **expand/contract** for breaking changes (rollback-safe), schema as reviewed single
  source of truth, **tenant scoping as a security boundary** (cross-tenant regression test),
  retention & privacy. **Completes all 11 standards.**
- `standards/09-docs-and-adr.md` + `templates/adr.md.template` — one-job-per-doc doc set,
  **ADRs** for core/irreversible decisions (context→decision→alternatives→consequences,
  append-only), docs-as-code (change in the same PR), generate-don't-duplicate, keep-current.
- `standards/02-ui-design-system.md` — named design target (adjective pairs), tokens-not-
  magic-values, hard visual rules (no fake/dead controls, no invented URLs), WCAG 2.2 AA as
  a release criterion, the **visual review gate** (rendered-output review before merge),
  protected zones.
- `standards/05-testing-and-audits.md` — test pyramid + isolation, fail-before/pass-after
  regression evidence, **journey/entity audits** ("200 ≠ healthy"), and process-compliance
  audits (the repo's own check does doc-consistency; process audit is a next-layer control).
- `standards/06-deployment-ops.md` — deploy-from-trunk, **deploy-revision lockstep**, state
  outside the artifact, atomic/off-site backups + pre-migration snapshot, **restore drills**
  (RPO/RTO), first-class rollback, health/alerting on user-visible symptoms, runbooks,
  per-environment config & secrets.
- `standards/04-ci-cd-quality-gates.md` + `templates/workflows/` CI workflows — the gate
  stack, required checks, and a **hardened, copyable** workflow (SHA-pinned Actions,
  least-privilege token, concurrency cancel, per-job timeout).
- `standards/03-git-workflow.md` — trunk-based development, branch & commit rules
  (Conventional Commits / SemVer), profile-graded WIP/staleness, and branch-protection
  guidance (with the GitHub private-repo plan caveat).

### Governance
- Repo made **public**; `main` **branch protection enabled** (PR required, `check` required,
  conversation resolution, linear history, no force-push/deletion; admin break-glass kept).
  Governance is now **platform-enforced**, not just convention.

### Fixed (pre-dry-run consistency)
- **Self-check overclaims corrected (05, 09).** `controls/check.mjs` does *doc-consistency*
  only; the process audit (05 §4) and rendering/anchor/example checks (09 §3) are now marked
  explicitly as not-yet-implemented next-layer controls.
- **06 deploy assertion** fixed to `live == intended release SHA` (not `== trunk` — trunk can
  advance during a deploy and falsely flag a correct release).
- **06 health checks** split into **liveness / readiness / synthetic journey monitoring** (a
  journey check inside a liveness probe causes restart storms on dependency blips).
- **05 pure-refactor** relaxed: invariant is unchanged observable behavior, not "zero test
  edits in the commit".
- **02 visual review** generalized to "rendered-output review before merge/release";
  approve-**before-push** moved to a high-control profile.
- **10 migration MUSTs** scoped to persistent-production-data / zero-downtime; relaxed for
  rebuildable / local / PITR systems.
- **CI template** split into `ci-node` + `ci-generic` (the single template had assumed Node).

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
