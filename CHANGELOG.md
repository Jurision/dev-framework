# Changelog

Notable changes to the framework. Format: [Keep a Changelog](https://keepachangelog.com);
versioning: [SemVer](https://semver.org). A project adopting the framework should record
which version it copied, so it can diff against later releases.

## [Unreleased]

### Added
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

## [0.1.0-alpha] — initial scaffold
- README, AGENTS.md, principles, AI-agent collaboration, code architecture, AGENTS template.
