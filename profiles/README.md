# Profiles

🚧 Outline. The framework's numbers (line caps, WIP limits, staleness windows, gate
strictness) are **starter defaults**, not industry constants. A profile calibrates them to
a project's shape and grades each rule **MUST / SHOULD / MAY**.

Planned profiles:

- `solo-project.md` — one author; lighter ceremony (e.g. "issue per work" is MAY).
- `team-web-app.md` — small team, user-facing; the full defaults apply.
- `api-service.md` — backend service; stronger contract/versioning + security gates.
- `library-sdk.md` — public API stability, SemVer discipline, docs as a release artifact.
- `data-ai-project.md` — notebooks/experiments allowed; reproducibility + data lineage.
- `regulated-system.md` — compliance/audit evidence, approvals, retention controls.

A project picks one profile and records it in its `AGENTS.md`. Profile sits above framework
defaults but below the project's own decisions and security invariants (see precedence in
the root `README.md`).
