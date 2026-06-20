# New-project bootstrap

🚧 Outline. Adopt the framework into a project. Tick as you go.

- [ ] Pick a profile (`profiles/`) and record it in `AGENTS.md`.
- [ ] Copy `templates/AGENTS.md.template` → `AGENTS.md`; fill in every placeholder.
- [ ] Add the agent adapter(s) (`adapters/`) and **verify** the rules load in your tools.
- [ ] Add `PULL_REQUEST_TEMPLATE.md` and `CODEOWNERS`.
- [ ] Turn on branch protection: PRs only, required reviews, required status checks.
- [ ] Wire CI gates (`standards/04`): typecheck, lint, format, unit, smoke + a file-size
      tripwire. No direct pushes to the trunk.
- [ ] Set up a dependency updater with a risk-classed merge policy (`standards/01` §7).
- [ ] Define security invariants for this project (`standards/07`) and their controls.
- [ ] Establish backups + a tested restore + deploy-version markers (`standards/06`).
- [ ] Record the framework version you copied (see root `CHANGELOG.md`).
- [ ] Do a dry-run: ship one small change end-to-end through the gates before trusting them.
