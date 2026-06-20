# 00 — Principles

The north star. Every other standard is an application of these. Read this first; when a
specific rule and a principle conflict, the principle wins and the rule is a bug.

## 1. Converge, don't accrete *(anti-sprawl / prime directive)*

The default failure mode of a fast-moving codebase is **sprawl** — overlapping branches,
special-case patches, duplicate utilities, files that grow to thousands of lines while
quality stays flat. Prefer **deleting and unifying** over adding. A change that grows the
system must earn it. If two things do the same job, make them one.

## 2. Merged is not done *(Definition of Done)*

A unit of work is DONE only when **all** hold:

1. Its written **acceptance criteria are met and demonstrated** (not assumed).
2. An **automated test** covers the new behavior. For a bug fix: a test that **fails
   before and passes after** (a regression guard).
3. It is **verified observable in the running/deployed system** — not just merged. "It
   builds" and "it's on main" are not "it works".
4. **No unexplained complexity increase** (see #4).
5. **Security invariants preserved** (see `standards/07-security-invariants.md`).
6. **Branch deleted, issue closed.**

## 3. Claimed is not done — report from the record, not from intent

Every completion claim must be **git-verifiable**. "I wrote / updated `<file>`" means a
**pushed commit** you can cite by hash. A PR body, a chat message, or a comment is *not*
"landed in the code/spec" — describe it as exactly what it is. Before reporting done,
confirm with `git log` / `gh pr view`. **Never delete a source branch until the salvaged
content is committed and pushed to its target.** (This single rule prevents the most
expensive class of agent mistake: confidently reporting work that exists only as intent.)

## 4. Complexity budget *(Boy Scout rule)*

Leave each file at least as clean as you found it. A change that materially grows a core
file must **refactor it or justify the growth** in the PR. Size and complexity of core
files are **tracked and enforced**, not left to taste — see
`standards/01-code-architecture.md`. Unexplained growth is a review blocker, not a detail.

## 5. HTTP 200 is not "healthy" *(audit business journeys, not just crashes)*

Smoke tests catch crashes. They do **not** catch a page that returns 200 but is inert: a
dead button, a detail view that never renders, an admin edit that never reaches the
reader, a feature that silently no-ops. A surface is healthy only when its real
**journeys** are visible, actionable, routed, and correct. Cover those with
journey/entity-level checks, not just status codes — see `standards/05-testing-and-audits.md`.

## 6. Rules are checkable, not arguable

Wherever a rule restates a known practice, **name the practice** and provide a way to
**verify compliance** — a CI gate, a script, or a checklist item. A standard that can only
be "followed by good intentions" will lose to delivery pressure. Prefer one enforced rule
over ten aspirational ones.

## 7. Single source of truth

Every unit of work maps to **one** tracked item (issue/ticket). Every fact lives in
**one** place; everything else links to it. **Before starting, search** existing issues,
open PRs, and branches for the same topic — continue the existing one rather than opening
a parallel effort. Duplicated work and duplicated truth are the same disease.

## 8. Small, atomic, reversible

Work in **small steps that are easy to review and easy to undo**: one concern per change,
trunk-based, squash-merge, delete the branch. Large irreversible changes need an explicit
decision record (see `standards/09-docs-and-adr.md`). Reversibility is a feature.

## 9. Protected zones are sacred

Some parts of a system are **load-bearing and must not change casually**: a finalized
visual/document design, a public contract/schema, a security boundary, a migration that
already shipped. Mark them explicitly. Touching a protected zone requires an explicit ask,
and "move, don't restyle/rewrite" is the default when you must.

## 10. Design before code — for core changes *(RFC / ADR)*

A change to the core (data model, security boundary, public interface, central module)
needs a short **design note + acceptance criteria written down first**. Implementation
starts after the criteria exist. Small peripheral fixes (a typo, an isolated bug with a
test) skip the ceremony.

## 11. Two roles, separated *(acceptance vs. technical gate)*

- **Product / acceptance owner** decides *what* "done" means and signs off — explained in
  plain language, no jargon required.
- **Technical review gate** decides *whether* it is actually done to standard.

Keeping these distinct stops "I built something" from being mistaken for "we shipped the
right thing, correctly."
