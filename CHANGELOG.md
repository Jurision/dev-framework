# Changelog

Notable changes to the framework. Format: [Keep a Changelog](https://keepachangelog.com);
versioning: [SemVer](https://semver.org). A project adopting the framework should record
which version it copied, so it can diff against later releases.

## [Unreleased]

### Added
- **`controls/workflow-policy.mjs`** (0.2 — first control, implements #32) — a
  **zero-dependency GitHub Actions workflow-policy lint** (rules **WF001–WF008**: full-SHA
  `uses:`, least-privilege `permissions:`, per-job `timeout-minutes`, validation-cancels vs
  **deploy-serialized** `concurrency`, privileged-trigger isolation, cache/artifact review,
  scan **all** workflows). Text + `--json`, exit-on-FAIL, optional config
  (`classify`/`shaExceptions`/`ignore`), fixtures (`workflow-policy.test.mjs`), and
  `controls/README.md` documenting **optional** `actionlint`/`zizmor` companions (not bundled).
  Wired into `framework-ci`; the dogfood caught a real gap (this repo's own CI lacked
  `timeout-minutes`/`concurrency` — now fixed).
- `delivery/adoption-feedback/001-workflow-hardening.md` — desensitized findings from the
  **first real-project adoption** (workflow hardening). Confirms **`workflow-policy lint`** as
  the first `0.2` control and surfaces two checklist lessons (formatter-vs-gate scope;
  inventory *all* workflows, not just validation CI).

_Next: `0.2` controls — `workflow-policy lint` first, then a live-revision assertion helper._

## [0.1.0-alpha] — 2026-06-21

### Added
- **`checklists/` completed** (definition-of-done · pr-review · visual-review ·
  new-project-bootstrap), **delivered via a standard-11 dogfood**: the framework used its own
  spec → plan → report flow on real work (`delivery/`). The dry-run **validated the templates**
  (cut ambiguity, prevented duplicate facts) and **surfaced one fix** applied in the same PR —
  `11` §2 now says **scale the package to risk/size** (a delivery package heavier than the work
  is a smell). Checklists are delta/pointer-style (cite the owning standard, don't restate).
- **`standards/11-specification-and-delivery.md`** (NEW standard) + templates
  `PROJECT_BRIEF` / `FEATURE_SPEC` / `IMPLEMENTATION_PLAN` / `PHASE_REPORT` — the spec-driven,
  phased-delivery layer `00–10` lacked: **foundation before business code** (brief+features →
  stack decision → architecture scaffold → AGENTS.md, in order; don't dig up the foundation),
  **just-in-time per-phase implementation source-of-truth doc** (single source; chat ideas
  must be written back), the **foundation-impact gate**, **phase-gated execution with drift
  control**, and **acceptance from evidence (a 3-question report), not code-reading**.
  Realizes the `09` 'planned standards/11' pointer. Distilled from a delivery methodology +
  the three repos' real spec/handoff usage.
- **`templates/workflows/ci-python.yml.template`** — Python validation-CI variant (pinned
  `setup-python`, the two-axis coverage/hardening/enforcement structure, pytest + optional
  ruff/mypy gates, profile-gate placeholder), produced from the Python dry-run. Templates now
  cover node / python / generic.
- **`profiles/examples/`** — three **desensitized** adoption-manifest examples (data-AI
  workbench · public content web · multi-tenant document app) generated from the frozen
  dry-runs. The two web shapes compose differently, validating base+modifiers end-to-end.
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

### Fixed (standard-11 hardening — review follow-up)
- **Two-stage agent contract:** a **bootstrap** contract (security / permissions / no
  direct-push / evidence / adapter+verify) exists from repo creation; the **project-specific**
  contract is filled after brief/stack/architecture — replaces "write `AGENTS.md` 4th" and
  "the tool auto-reads it" (aligns `08`).
- **Foundation is *stable by default, not immutable*** — change it through the front door
  (impact assessment + ADR + migration/rollback + updated spec/plan), not "never dig it up".
  Tech-stack criteria broadened beyond "the agent knows best" (maintainability, security
  lifecycle, reversibility, lock-in).
- **Delivery package, not one-doc-rules-all** — brief / feature-spec / ADR / plan / report
  each own one set of facts and link; **un-conflates feature spec vs implementation plan**
  (the `09` §3 distinction the first draft had collapsed); reference versioned requirements +
  a traceability check instead of re-pasting a copy.
- **Acceptance is two roles** — product acceptance (plain language, no code-reading) is **not**
  technical verification; the agent's report is **input, not a substitute** for independent
  review of diff / tests / security / running evidence (`00` two roles; claimed ≠ done).
- Architecture step reframed as a **walking skeleton** (smallest production-shaped slice), not
  a fixed infra checklist; per-sub-phase stops → **risk-calibrated acceptance checkpoints**.
- **Templates:** expanded `PROJECT_BRIEF`; split the feature list into `FEATURE_LIST` + a real
  `FEATURE_SPEC`; expanded `IMPLEMENTATION_PLAN` (sources/ADR/risk/impact/rollback/checkpoints/
  approver); `PHASE_REPORT` separates **product acceptance vs technical verification**; added
  `HANDOFF`.

### Fixed (profile hardening — review follow-up)
- **`runtime-ai`**: added a **minimum runtime-model eval gate** (versioned eval set +
  threshold check in required CI on model/prompt/tool/retrieval change) — closes the
  `web-app + runtime-ai` hole where output quality had **no** gate. Changed "no PII in
  prompts" to **PII governance** (minimize + approved provider + consent/retention/region
  policy; raw PII out of logs; **secrets still absolutely barred** from model context).
- **`human-in-the-loop`**: distinguished a forbidden **AI-initiated/decided** production
  action from an allowed **deterministic CI/CD release** (reviewed PR + protected trunk, per
  `06`); made the approval boundary **implementation-neutral** (queue / confirmation txn /
  policy engine / two-person / signed command / staged gate); narrowed the approval audit to
  actor / action / target / **version-digest** / decision / time (no full sensitive payload).
- **`persistent-data`**: fixed `RGT`→`RTO` typo; abstracted "pre-migration snapshot" to a
  **verified recovery point appropriate to the risk model** (snapshot / PITR / transactional
  rollback / equivalent); restore-drill **cadence** set by RPO/RTO/change-rate/risk, not one
  universal frequency.
- **`multi-tenant`**: made implementation-neutral — tenant ownership may be **direct or
  structural**; scoping at the **DB/RLS/repository/equivalent** boundary; uniqueness includes
  the tenant scope **only where a business key needs it**; removed "retrofitting cost avoided"
  as acceptance evidence.
- **`protected-output`**: replaced byte/pixel stability with **declared semantic / structural
  / visual dimensions + tolerance + normalization** (golden updates need reviewer
  confirmation); `supplier` → **project-defined** sensitive fields; fail-before/pass-after
  required only for real leak fixes.
- **`internal-ui`**: reframed "may relax" → **"not triggered (not an exception)"** — public
  brand/SEO/marketing don't apply to internal surfaces and aren't documented relaxations;
  added tokens/consistency + focus order to the MUST.
- **`public-ui`**: made the content-site rules **conditional** — sitemap/canonical only for
  **indexable** surfaces, content↔render parity only with a **separate content source**,
  synthetic monitoring verifies the **product's key public effect** (not universally text
  markers).
- **`profiles/examples/`**: removed the spurious `02 brand` "exception" (composition, not a
  relaxation); all three manifests now disclaim `exceptions: [] # …does not prove compliance`
  (a selection ≠ proof the required controls exist).
- **Consistency sweep (hardening changed the top, not the bottom/core):** unified the
  migration recovery point across **`standards/06` + `standards/10` + `persistent-data`**
  (snapshot → **risk-appropriate recovery point**: snapshot / PITR / transactional rollback /
  equivalent) — resolves a real **precedence contradiction** (core said snapshot-MUST while the
  profile allowed flexibility, and stricter-core-wins). Synced `public-ui` acceptance evidence
  to its now-conditional rules; widened `runtime-ai` eval to **non-displayed** model paths
  (backend classification / risk scoring); `multi-tenant` applies to **any tenant topology**;
  `protected-output` "identical" → "identical **on the declared dimensions**"; example wording
  aligned.

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
- **`standards/04` rewritten to two axes** — **gate coverage** (a risk→evidence inventory:
  every applicable risk has automated evidence, every release-blocking risk is a **required**
  gate; profile-required gates plug in) vs **workflow hardening** (SHA-pin, least-priv,
  timeout, toolchain/lockfile pin, untrusted-PR isolation, cache/artifact boundary;
  **validation CI may cancel superseded runs, but deploy/migration must serialize**), plus a
  per-gate **Required / Advisory** enforcement state. Fixed the leftover "live == trunk" →
  "live == **immutable release SHA**" (aligns with `06`). Both CI templates synced
  (coverage/hardening/enforcement comments, a profile-gate placeholder, `team-web`→`web-app`,
  fillable trunk name).
- **`standards/09` decision-record semantics fixed** — decoupled the **filing** (path/name
  MAY vary: `adr/`, `docs/decisions/`, or a decision section inside a spec) from the
  **semantics** (context + alternatives + consequences + status — MUST). Added §3
  distinguishing the four document jobs: **ADR / feature spec / implementation plan / handoff
  are NOT interchangeable** (a handoff is not a decision record). Points to a planned
  `standards/11`. (Corrects the earlier "treat them as interchangeable" over-flattening.)
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

### Initial scaffold (first commits)
- README, AGENTS.md, principles, AI-agent collaboration, code architecture, AGENTS template.
