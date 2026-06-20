# dev-framework

A reusable engineering + AI-agent collaboration standards framework. Copy it into a new
project to get a known-good baseline for **how** to build, ship, and operate software —
especially when humans and AI coding agents work the same codebase.

It is distilled from real projects and aligned to current industry standards, then
generalized: nothing here is tied to a specific product. Adopt the whole thing, or pull
the pieces you need.

## Why this exists

Most failures on small, fast-moving codebases are not "hard problems" — they are missing
*framework*: no single source of truth, branch sprawl, "merged but not actually working",
god files, design drift, and agents re-deriving conventions every session. The cost shows
up later, as rework. This repo front-loads the conventions so that decision is made once.

For AI-agent collaboration the stakes are higher: an agent follows what is written, not
what you meant. Ambiguity becomes a bug. A precise, machine-readable contract
(`AGENTS.md`) is the single highest-leverage artifact a project can have.

## How to adopt (30 minutes)

1. Copy `templates/AGENTS.md.template` to your repo root as `AGENTS.md` and fill the
   `<FILL>` blanks. This is the contract every agent reads before working.
2. Wire the quality gates from `standards/04-ci-cd-quality-gates.md` into CI (typecheck,
   lint, format, unit, smoke) plus a file-size tripwire.
3. Add `PULL_REQUEST_TEMPLATE.md` and `CODEOWNERS` from `templates/`.
4. Skim `checklists/new-project-bootstrap.md` and tick the rest.
5. Link your `AGENTS.md` and `README.md` to the relevant `standards/` files instead of
   restating them — keep one source of truth.

## Structure

Legend: ✅ written · 🚧 in progress · ⬜ planned

```
engineering-standards/
├─ README.md                          ✅ this file
├─ AGENTS.md                          ✅ how agents work ON this repo
├─ standards/
│  ├─ 00-principles.md                ✅ north-star principles (read first)
│  ├─ 01-code-architecture.md         🚧 composition roots, file-size tripwires, protected zones
│  ├─ 02-ui-design-system.md          ⬜ design tokens, hard visual rules, a11y, visual review
│  ├─ 03-git-workflow.md              ⬜ trunk-based, atomic PRs, WIP limit, conventional commits
│  ├─ 04-ci-cd-quality-gates.md       ⬜ the gate stack + size guard + dependency hygiene
│  ├─ 05-testing-and-audits.md        ⬜ test pyramid, "200 ≠ healthy" journey audits
│  ├─ 06-deployment-ops.md            ⬜ runbooks, backups, deploy markers, health checks, secrets
│  ├─ 07-security-invariants.md       ⬜ least privilege, identity trust root, data separation
│  ├─ 08-ai-agent-collaboration.md    ✅ AGENTS.md contract, DoD, multi-agent workflow, roles
│  ├─ 09-docs-and-adr.md              ⬜ README/AGENTS/STRUCTURE, ADRs, docs-as-code
│  └─ 10-data-and-migrations.md       ⬜ additive migrations, schema discipline, tenancy scoping
├─ templates/                         🚧 AGENTS.md ✅, PR/CODEOWNERS/CI/eslint/scripts ⬜
├─ checklists/                        ⬜ DoD, PR review, visual review, bootstrap
└─ adr/                               ⬜ ADR template + index
```

## How to use it well

- **Standards are defaults, not dogma.** Deviate when you have a reason — and write the
  reason down (an ADR, or a one-line note in the PR). An undocumented deviation is the bug.
- **Keep it small and enforced.** A rule that is not checked in CI or review will be
  ignored under delivery pressure. Prefer one enforced rule over ten aspirational ones.
- **Update in pull requests.** When a convention changes, change the standard in the same
  PR. Stale standards are worse than none.

## License

Internal reusable framework. Adapt freely across your own projects.
