# dev-framework

A reusable engineering + AI-agent collaboration standards framework. Copy it into a new
project to get a known-good baseline for **how** to build, ship, and operate software —
especially when humans and AI coding agents work the same codebase.

It is distilled from real projects and aligned to current industry standards, then
generalized: nothing here is tied to a specific product.

> **Status: `0.1.0-alpha` — not adoption-ready.** The foundation (principles, AI-agent
> collaboration, code architecture, security) and the framework's own enforcement are in
> place; the remaining standards are outlines. Numbers in this repo are **starter
> defaults to calibrate**, not industry mandates. See `CHANGELOG.md` and `VERSION`. Do not
> treat any document as final until it is marked ✅ below and has passed a real-project
> dry-run.

## Why this exists

Most failures on small, fast-moving codebases are not "hard problems" — they are missing
*framework*: no single source of truth, branch sprawl, "merged but not actually working",
god files, design drift, and agents re-deriving conventions every session.

For AI-agent collaboration the stakes are higher: an agent follows what is **written**,
not what you meant. But writing is not enforcement — a Markdown rule is model *context*,
not a control. Determinism comes from CI, hooks, permissions, and branch protection. This
repo pairs the written contract (`AGENTS.md`) with the gates that make it stick.

## Precedence (when guidance conflicts)

Higher overrides lower. A framework default never overrides a security invariant or the
law.

```
1. Law & compliance
2. Security & data invariants
3. Project decisions & protected contracts (approved ADRs, schemas)
4. Project standards (the project's own AGENTS.md / docs)
5. Profile (project type: solo / team / api / library / data-ai / regulated)
6. Framework defaults (this repo)
```

The "principles" here guide design; they do **not** override 1–3.

## How to adopt (target ~30 min once stable; today: partial)

Ready now (✅) vs outline-only (🚧):

1. ✅ Copy `templates/AGENTS.md.template` → your repo's `AGENTS.md`; fill in the
   placeholders. This is the contract every agent reads first.
2. ✅ Add an agent adapter so your tools actually pick it up — see `adapters/`
   (e.g. a `CLAUDE.md` that imports `@AGENTS.md`). **Verify it is in effect; don't assume.**
3. ✅ Add `templates/PULL_REQUEST_TEMPLATE.md` and `templates/CODEOWNERS`.
4. 🚧 Wire the quality gates from `standards/04-ci-cd-quality-gates.md` (currently an
   outline) into CI, plus a file-size tripwire.
5. 🚧 Walk `checklists/new-project-bootstrap.md` (outline) and tick the rest.

## Structure

Legend: ✅ written · 🚧 outline / planned

```
dev-framework/
├─ README.md · AGENTS.md · VERSION · CHANGELOG.md · LICENSE        ✅
├─ standards/
│  ├─ 00-principles.md                ✅   06-deployment-ops.md          🚧
│  ├─ 01-code-architecture.md         ✅   07-security-invariants.md     ✅
│  ├─ 02-ui-design-system.md          🚧   08-ai-agent-collaboration.md  ✅
│  ├─ 03-git-workflow.md              🚧   09-docs-and-adr.md            🚧
│  ├─ 04-ci-cd-quality-gates.md       🚧   10-data-and-migrations.md     🚧
│  └─ 05-testing-and-audits.md        🚧
├─ adapters/        ✅ tool adapters + compatibility-matrix.md
├─ templates/       ✅ AGENTS.md · PR template · CODEOWNERS   ·  🚧 CI / eslint / scripts
├─ controls/        ✅ check.mjs — the framework checks itself
├─ checklists/      🚧 DoD · PR review · visual review · bootstrap
├─ profiles/        🚧 solo / team-web / api / library / data-ai / regulated
└─ adr/             🚧 ADR template + index
```

## How to use it well

- **Standards are defaults, not dogma.** Deviate when you have a reason — write the reason
  down (an ADR or a one-line PR note). An undocumented deviation is the bug. Use
  **MUST / SHOULD / MAY** to grade how hard each rule is.
- **Keep it small and enforced.** A rule not checked in CI or review gets ignored under
  pressure. One enforced rule beats ten aspirational ones — this repo runs `controls/`
  on itself.
- **Update in pull requests.** Change the standard in the same PR that changes the
  convention. Stale standards are worse than none.

Maintainer: project owner. Changes go through PRs with the framework CI check green.
