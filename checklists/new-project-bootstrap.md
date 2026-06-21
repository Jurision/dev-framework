# Checklist: New-project bootstrap

Adopt the framework into a project. Order follows `standards/11` §1 (foundation before
business code). Pointers, not restatements. Tick as you go.

## Foundation, in order (`11` §1)
- [ ] **Project brief + feature list** (`templates/PROJECT_BRIEF` + `FEATURE_LIST`); state
      **non-goals**.
- [ ] **Bootstrap `AGENTS.md` now** (`11` §1.4, `08`): security/permission boundaries, no
      direct push to trunk, evidence/authenticity, the adapter — and **verify the rules load**
      in your tools (file existing ≠ in context).
- [ ] **Pick a profile** — one base + modifiers (`profiles/`); record it in the adoption
      manifest.
- [ ] **Tech-stack decision** — record it as an **ADR** (`09`); weigh fit / maintainability /
      security lifecycle / lock-in, not just "the agent knows best" (`11` §1.2).
- [ ] **Walking skeleton** — the smallest production-shaped slice that builds / runs / tests /
      observes / delivers one behavior (`11` §1.3, `01`); only the infra this profile needs.
- [ ] **Complete the project-specific `AGENTS.md`** — build/test commands, module boundaries,
      protected zones, deploy rules.

## Governance & gates
- [ ] `PULL_REQUEST_TEMPLATE.md` + `CODEOWNERS`.
- [ ] Branch protection: PRs only, required status checks, conversation resolution, linear
      history, no force-push/delete (`03` §4).
- [ ] CI gates (`04`): **coverage** (build/lint/format/tests + profile-required gates) **and**
      **hardening** (SHA-pinned Actions, least-priv, timeout, concurrency); make them required.
- [ ] Dependency updater with a risk-classed merge policy (`01` §7).
- [ ] Security invariants + controls for this project (`07`).
- [ ] Backups + a **tested restore** + deploy-revision lockstep (`06`, `persistent-data`).

## Verify
- [ ] Record the framework version copied (root `CHANGELOG.md`).
- [ ] **Dry-run:** ship one small change end-to-end through the gates before trusting them.
