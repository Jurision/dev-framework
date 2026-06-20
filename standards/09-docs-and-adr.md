# 09 — Documentation & ADRs

🚧 Outline. To be written. Intended scope:

- **The doc set** — `README` (humans), `AGENTS.md` (agents), `STRUCTURE.md` (layout /
  worktree map), runbooks (`standards/06`). Each has one job; link, don't duplicate.
- **ADRs** — record significant/irreversible decisions (the why, the alternatives, the
  consequences) under `adr/`, numbered and indexed. A core change needs one first
  (`standards/00` §10).
- **Docs-as-code** — docs live with the code, change in the same PR as the convention, and
  are reviewed. Evidence for a docs change: links resolve, renders, examples valid
  (`standards/00` §2).
- **Generate, don't duplicate** — when a fact must appear in several places (a config, its
  doc, a report), generate them from one structured source; hand-syncing drifts
  (`standards/00` §7). Verify with a consistency check (`controls/`).
- **Keep current** — audit docs/`AGENTS.md` periodically (e.g. quarterly); a stale doc
  actively misleads.
