# 00 — Principles

The north star. Every other standard is an application of these.

## How to read these rules

- **MUST / SHOULD / MAY** (RFC 2119) grade how hard a rule is. Unmarked prose is guidance.
- **Numbers are starter defaults**, not industry constants. Calibrate to your team size,
  language, and history — see `profiles/`.
- **Principles guide design; they do not override the precedence hierarchy.** When a
  principle conflicts with law/compliance, a security/data invariant, or an approved
  project decision, the higher item wins (see `README.md` → Precedence). A vague principle
  never overrides a hard constraint.

## 1. Converge, don't accrete *(anti-sprawl / prime directive)*

The default failure mode of a fast-moving codebase is **sprawl** — overlapping branches,
special-case patches, duplicate utilities, files that grow while quality stays flat.
**Prefer deleting and unifying over adding.** A change that grows the system must earn it.
If two things do the same job, make them one.

## 2. Merged is not done — evidence by change type *(Definition of Done)*

A unit of work is DONE only when it has the **right evidence for its kind** and is
demonstrably correct, not merely merged ("it builds" ≠ "it works"). Pick the evidence:

| Change type | Evidence (MUST) |
|---|---|
| Behavior / business code | unit / integration / regression test (a bug fix has a **fail-before, pass-after** test) + observable in the running system |
| UI | interaction + accessibility + responsive check + a screenshot/visible-output |
| Config / infra | schema valid + dry-run + deploy verification |
| Data migration | forward migration + backup/restore proof + compatibility check |
| Docs | links resolve + renders + examples valid |
| Hotfix | exception allowed, but with a **follow-up test and a post-incident review by a deadline** |

In all cases: no unexplained complexity increase (#4), security invariants preserved, and
the tracked item closed.

## 3. Claimed is not done — report from the record, not from intent

Every completion claim MUST be **git-verifiable**. "I wrote / updated `<file>`" means a
**pushed commit** you can cite by hash. A PR body, a chat message, or a comment is *not*
"landed" — describe it as exactly what it is. Before reporting done, confirm with `git log`
/ `gh pr view`. **Never delete a source branch until the salvaged content is committed and
pushed.** (This prevents the most expensive class of agent mistake: confidently reporting
work that exists only as intent.)

## 4. Complexity budget *(Boy Scout rule)*

Leave each file at least as clean as you found it. A change that materially grows a core
file MUST **refactor it or justify the growth** in the PR. But size is only a tripwire —
architectural health also means low coupling, no cycles, clear boundaries, and isolated
tests (see `standards/01-code-architecture.md`).

## 5. HTTP 200 is not "healthy" *(audit journeys, not crashes)*

Smoke tests catch crashes. They do not catch a page that returns 200 but is inert — a dead
button, a detail view that never renders, an admin edit that never reaches the reader. A
surface is healthy only when its real **journeys** are visible, actionable, routed, and
correct. Cover those with journey/entity-level checks (see `standards/05-testing-and-audits.md`).

## 6. Rules are checkable, not arguable

Wherever a rule restates a known practice, **name the practice** and provide a way to
**verify compliance** (a CI gate, a script, a checklist item). A rule that can only be
"followed by good intentions" loses to delivery pressure. This framework enforces this on
itself via `controls/`.

## 7. Single source of truth — and generate, don't duplicate

Every unit of work maps to **one** tracked item; **search before starting** and continue
the existing effort rather than forking a parallel one. Every fact lives in **one** place;
everything else links to it. When the same fact must appear in several places (e.g. a
lint-exemption list *and* its doc *and* a CI report), **generate them from one structured
source** — hand-syncing drifts (a real, recurring failure).

## 8. Small, atomic, reversible

Work in small steps that are easy to review and easy to undo: one concern per change,
trunk-based, squash-merge, delete the branch. Large irreversible changes need a decision
record (`standards/09-docs-and-adr.md`). Reversibility is a feature.

## 9. Protected zones are sacred

Some parts are **load-bearing**: a finalized visual/document design, a public
contract/schema, a security boundary, a shipped migration. Mark them explicitly. Touching
one needs an explicit ask, and "move, don't restyle/rewrite" is the default.

## 10. Design before code — for core changes *(RFC / ADR)*

A core change (data model, security boundary, public interface, central module) needs a
short **design note + acceptance criteria written down first**. Peripheral fixes skip it.

## 11. Two roles, separated *(acceptance vs. technical gate)*

- **Product / acceptance owner** decides *what* "done" means and signs off — in plain
  language.
- **Technical review gate** decides *whether* it is actually done to standard.

Keeping these distinct stops "I built something" from being mistaken for "we shipped the
right thing, correctly."
