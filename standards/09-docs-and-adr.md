# 09 — Documentation & ADRs

Docs exist to stop knowledge from living only in one person's head (or one agent's expired
context). The rule is **one job per document, link don't duplicate, and change docs in the
same PR as the thing they describe.** Graded **MUST / SHOULD / MAY**.

## 1. The doc set — each has one job *(SHOULD)*

- **`README`** — for humans: what it is, how to run it, where things are.
- **`AGENTS.md`** — for agents: the working contract (`standards/08` §1).
- **`STRUCTURE.md`** — layout / module map / worktree→branch→owner map (`standards/08` §6).
- **Runbooks** — operate/rollback/restore (`standards/06` §8).

Each owns its job; they **link** to each other instead of restating. Overlap is where drift
starts — two copies of one fact disagree the moment one changes.

## 2. ADRs — decisions that outlive their authors *(MUST for core changes)*

Record **significant or hard-to-reverse decisions** as Architecture Decision Records under
`adr/`, numbered and indexed. Each captures **context → decision → alternatives considered →
consequences** — the *why*, not just the *what*. Use `templates/adr.md.template`.

- A change to the core (data model, security boundary, public interface, central module)
  gets an ADR **first** (`standards/00` §10, `standards/08` §8); peripheral fixes skip it.
- ADRs are **append-only**: don't rewrite history — supersede an old one with a new ADR that
  references it. "Why is it this way?" should always have a findable answer.

## 3. Docs-as-code *(MUST)*

- Docs live **with the code** and change in the **same PR** as the convention they describe.
  A PR that changes behavior but not its docs is incomplete; a stale doc actively misleads
  every reader, human or agent.
- **Evidence for a docs change** (`standards/00` §2): file references and relative links
  resolve, it renders, examples are valid. This repo's `controls/check.mjs` automatically
  verifies **only file references and relative links** — rendering, heading anchors, and
  example validity stay a manual or later-control check; don't imply enforcement the repo
  doesn't have (`standards/00` §6).
- Docs are reviewed like code — wrong docs are bugs.

## 4. Generate, don't duplicate *(SHOULD)*

When one fact must appear in several places (a config value, its documentation, a status
table, a generated report), **derive them from one structured source** rather than
hand-syncing copies (`standards/00` §7). Hand-maintained mirrors drift; a generator or a
consistency check (`controls/`) keeps them honest. The cheapest drift is the one a script
catches.

## 5. Keep it current *(SHOULD)*

Audit the doc set and `AGENTS.md` on a cadence (e.g. quarterly) and whenever the thing they
describe changes. Delete docs that no longer apply — an out-of-date doc is worse than a
missing one, because it is trusted.
