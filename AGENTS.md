# AGENTS.md — working on this repository

This repo is a **standards framework**, not an application. Every coding agent (Codex,
Claude Code, or any other) reads this file before editing, and follows it before writing.

## What this repo is

A reusable set of engineering and AI-collaboration standards, generalized from real
projects. Its value is being **project-agnostic, precise, and enforceable**. Edits that
erode any of those three properties are regressions.

## Hard rules

1. **Project-agnostic only.** Never write a specific product, company, person, file path,
   domain, IP, or secret into a standard. If a real example helps, abstract it ("a
   protected design zone", not a named CSS class). The whole point is reuse.
2. **Standards must be enforceable or explicitly advisory.** For each rule, prefer a way
   to check it (a CI gate, a script, a review checklist item). If a rule can only be
   "followed by good intentions", say so — and mark it advisory.
3. **Map rules to named practices.** Where a rule restates a known software-engineering
   practice (trunk-based development, definition of done, ADR, …), name it. Named rules
   can be checked, not argued.
4. **One source of truth.** Don't restate the same rule in two files. Cross-link
   (`see standards/03-git-workflow.md`). Keep `README.md`'s structure table in sync when
   you add or rename a doc.
5. **Concise and scannable.** Prefer numbered rules, tables, and short imperative
   sentences over prose. A standard nobody finishes reading isn't a standard.

## Conventions

- **Language:** English (for portability). Sentence case in headings and labels.
- **Numbering:** `standards/NN-topic.md`. Keep the two-digit prefix stable; it orders the
  reading path.
- **Status:** when a planned doc becomes real, flip its marker in the `README.md` table
  (⬜ → 🚧 → ✅).
- **Voice:** opinionated and decisive. State the default, then the escape hatch ("do X;
  if you must do Y, record the reason"). Avoid hedging.

## Definition of done (for a standards change)

A change is done when: the doc is internally consistent, project-agnostic, cross-linked
(not duplicated), the `README.md` structure table reflects it, and the commit is pushed.
"Wrote it in a comment" or "described it in the PR body" is **not** done — see
`standards/00-principles.md` on git-verifiable claims.

## PR workflow

Small, atomic PRs to `main`; one topic per PR; squash-merge. The framework practices what
it preaches — see `standards/03-git-workflow.md`.
