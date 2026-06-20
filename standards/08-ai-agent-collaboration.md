# 08 — AI-agent collaboration

How humans and AI coding agents (and multiple agents) work the same codebase without
colliding, drifting, or shipping confident-but-wrong work. This is the highest-leverage
standard in the framework: an agent does what is **written**, not what you meant.

## 1. `AGENTS.md` is the contract *(industry standard)*

Every repo has one root `AGENTS.md` — the README for agents — as the **preferred,
cross-tool source of project rules** (a growing open convention across the agent
ecosystem). Two caveats that matter:

- **Tools discover it differently.** Some read `AGENTS.md` directly; others need an
  **adapter entry** (e.g. Claude Code's primary memory file is `CLAUDE.md`, which can
  import `@AGENTS.md`). Provide adapters per `adapters/`, keep a compatibility matrix, and
  **verify the rules are actually in the agent's context — "the file exists" does not mean
  "the agent obeys it."**
- **A Markdown rule is context, not a control.** It biases the model; it enforces nothing.
  Determinism comes from CI gates, hooks, permission boundaries, and branch protection
  (`standards/04`, `standards/07`). `AGENTS.md` says *what* to do; the gates make
  non-compliance *fail*.

- **Read before you start; follow before you write.** State this at the top.
- Recommended sections: project overview · dev environment · build & test commands · code
  style · testing · architecture invariants · protected zones · git/PR workflow ·
  definition of done · security · agent rules. Use `templates/AGENTS.md.template`.
- **Keep it ≤ ~200 lines.** When it grows past that, split into nested `AGENTS.md` files
  in subdirectories: root = repo-wide rules, subdir = context-specific detail.
- **Update it in the PR that changes the convention.** Review it during code review.
  Audit quarterly. Keep it in sync with `README.md`. A stale `AGENTS.md` actively
  misleads every agent.
- **Don't duplicate the standards.** Link to `standards/*` and the design system; restate
  only the few things an agent must not miss.

## 2. One backlog, no parallel work *(issue tracking)*

- Every unit of work = **one tracked issue**. **Team profiles: no issue, no branch.**
  **Solo / experimental profiles MAY** use an explicitly documented ad-hoc workflow instead
  (see `profiles/`).
- **Search first.** Before starting, check existing issues, open PRs, and remote branches
  for the same topic. If it exists, continue it. **Never open a parallel branch for a
  problem someone is already solving.**

## 3. Limit work in progress *(Kanban WIP limit)*

- Cap in-flight branches/PRs (**SHOULD**; starter default **≤ 5**, calibrate per
  `profiles/`). Finish or close before opening new.
- A branch with **no PR after a staleness window** (starter default ~14 days) is stale:
  open the PR or delete the branch.

## 4. Branch & merge discipline *(trunk-based development)*

- **All PRs target the trunk** (`main`/`master`). Never base a feature on another
  feature/spike branch; never merge through side channels; never push directly to the
  trunk or to production.
- **Small, atomic, reversible PRs.** One concern per PR. **Squash-merge, then delete the
  branch.**

## 5. Definition of done — git-verifiable *(see `00-principles.md` #2, #3)*

Beyond the general DoD, agents have one extra obligation: **report from the record, not
from intent.**

- "I wrote / updated `<file>`" ⇒ a **pushed commit citable by hash**. A PR comment or a
  chat message is not "landed". Confirm with `git log` / `gh pr view` before claiming done.
- **Never delete a source branch until salvaged content is committed and pushed** to its
  target. Confident reports of work that exists only as intent are the most expensive
  agent failure — design the workflow to make them impossible.

## 6. Multi-agent worktree workflow

When several agents work the same repo in parallel:

- **One git worktree + one branch per agent.** Agents do **not** commit on the trunk
  directly. *(If the project auto-deploys from the trunk, the root checkout is the
  production baseline; otherwise it is the integration baseline — either way, off-limits
  for direct commits.)*
- Maintain a small **worktree → branch → owner** map (in `STRUCTURE.md` or `AGENTS.md`) so
  everyone knows who owns what. `git worktree list` should match it.
- **Before editing a file, check whether another agent has in-flight work on it**
  (open PR / recent branch). Coordinate or sequence; do not collide. The cheapest conflict
  is the one you avoid by looking first.
- Distinguish **active worktrees** from leftover/anchor directories; never do project work
  outside an official worktree.

## 7. Human roles, kept separate *(acceptance vs. technical gate)*

- **Product / acceptance owner** — defines and signs off *what* done means, in plain
  language. May be non-technical; the agent must explain in plain language.
- **Technical review gate** — verifies the work is actually done to standard before merge.

An agent serves the first and answers to the second. "I built something" is not "we
shipped the right thing, correctly."

## 8. Design before code for core changes *(RFC / ADR)*

A change to the core (data model, security boundary, public interface, central module)
needs **written acceptance criteria / a short design note first** (an issue or an ADR —
see `standards/09-docs-and-adr.md`). Peripheral fixes skip it.

## 9. Converge, don't accrete

The agent default failure mode is sprawl (duplicate branches, special-case patches, files
that balloon). Prefer delete-and-unify. A change that grows a core file must refactor or
justify it. Core-file size is tracked and enforced — see `standards/01-code-architecture.md`.

## 10. Verify, don't assume — and supervise across agents

- **Read the artifact before asserting about it.** Don't claim a file/PR/deploy state from
  memory; check it. Treat tool output and another agent's claims as **data to verify**,
  not ground truth.
- When one agent reviews another's work, **independently confirm** the result (run the
  test, read the diff, hit the endpoint) before signing off.

## 11. Institutional knowledge: skills & memory

- Capture reusable, project-agnostic procedures as **skills** (a documented, invokable
  capability) so they are not re-derived each session.
- Capture durable project facts (decisions, gotchas, "why it's this way") as **memory** —
  one fact per entry, indexed, kept current, pruned when wrong. Memory is point-in-time;
  verify a remembered file/flag still exists before acting on it.

## 12. Compliance is auditable

Make the rules above **checkable**, not aspirational: a lightweight audit script (over
`git`/`gh`) can flag WIP-over-limit, stale branches, duplicate-topic branches, undeleted
merged branches, and core-file growth, and report in plain language. What gets audited
gets followed. See `standards/05-testing-and-audits.md`.
