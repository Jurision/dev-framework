# Agent compatibility matrix

`AGENTS.md` is the preferred cross-tool source, but tools discover it differently and
support evolves. **Verify, per tool, that the rules are actually in the agent's context** —
presence of a file is not obedience. Fill `last verified` when you confirm it on your setup.

| Tool | How it picks up project rules | Adapter needed | Verify | Last verified |
|---|---|---|---|---|
| OpenAI Codex | reads `AGENTS.md` | none | open a session; confirm rules cited | <verify> |
| Cursor | reads `AGENTS.md` (and/or rules files) | maybe rules file | ask it to restate a project rule | <verify> |
| GitHub Copilot | `AGENTS.md` support added 2025 | none/per-IDE | confirm in IDE | <verify> |
| Claude Code | primary file is `CLAUDE.md` | **yes** — `CLAUDE.md` importing `@AGENTS.md` | rule appears in session project instructions | <verify> |
| Aider | conventions file | maybe explicit config | confirm it reads the file | <verify> |
| Gemini / Jules | varies | maybe explicit config | confirm in tool | <verify> |
| Windsurf / Zed / Amp / RooCode | `AGENTS.md` (varies) | varies | confirm in tool | <verify> |

Notes:
- A Markdown rule is **context, not a control**. Pair it with CI gates, hooks, permission
  scopes, and branch protection for anything that must be deterministic (`standards/07`).
- Keep this matrix honest: an unverified row is unverified. Re-audit when tools update.
