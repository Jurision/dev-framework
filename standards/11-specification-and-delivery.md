# 11 — Specification & delivery

`00–10` govern **how** you build. This governs getting from a fuzzy idea to shipped work
**without the agent (or a human) drifting**. Two halves: **(A)** lay the foundation and rules
*before* any business code; **(B)** drive each phase from a single-source spec in **bounded,
accepted** increments. The throughline: **never build on feeling — always a doc to check
against and a boundary to keep.** Graded **MUST / SHOULD / MAY**; numbers are starter defaults.

## 1. Foundation before business code *(MUST — in this order; each feeds the next)*

1. **Project brief + feature list.** What the project is; features broken into clear,
   individually-stated items **and non-goals**. Vague requirements are the root failure —
   a human *or* an agent builds the wrong thing from them. The agent is your programmer; align
   the requirement as exactly as you would with one. (`templates/PROJECT_BRIEF.md.template`,
   `templates/FEATURE_SPEC.md.template`.)
2. **Tech-stack decision.** Choose the stack that **best fits the project and that the agent
   knows best** — not the fanciest; avoid over-selection. Record it as a **decision record**
   (`standards/09` §2). **Once chosen, don't waver** — every swap re-lays the foundation.
3. **Architecture scaffold.** A **minimal runnable skeleton with the universal rules set** —
   composition root, config loading, unified response + error handling, logging, data/
   permission entry; UI: directory layout, component conventions, a request wrapper, state
   management — **before any business feature** (`standards/01`). Not auth/orders/payment yet;
   the skeleton and the rules everything else will follow.
4. **Agent contract (`AGENTS.md`).** Written **4th**, because a good one combines the project's
   real brief / features / stack — which steps 1–3 just defined. It is **read into the agent's
   context every task** (not a passive doc) and must live where the tool **auto-reads** it
   (`standards/08` §1). Don't blind-copy a template — have the agent **adapt it to the real
   project**, then explain each rule in plain language.

> **Foundation rule (MUST):** once laid, **don't dig it up.** Business details flex; the
> foundation — stack, structure, schema, core fields, auth, payment flow — is not casually
> changed mid-build (see §4).

## 2. One phase at a time, just-in-time *(MUST)*

- Requirements break into **big phases**; a big phase is **too coarse to hand an agent** — it
  fills the gaps with guesses, and leans toward low-effort filler.
- **Detail only the current big phase.** Later phases keep direction only. Over-detailing
  ahead is wasted when requirements change — finish one big phase, then detail the next.

## 3. The implementation source-of-truth doc *(MUST — per phase)*

Break the current big phase into **sub-phases → steps**, fine enough that the agent knows
**three things per step: what to do, what counts as done, and what NOT to touch now** — with
**acceptance criteria and a verification method** written in. Every step is **executable,
acceptance-able, and bounded**. (`templates/IMPLEMENTATION_PLAN.md.template`.)

- It is the phase's **single source of truth** (`standards/00` §7): development *and*
  acceptance both follow it. A chat idea is not a change **until it is written back into the
  doc.**
- It is distinct from `AGENTS.md` (which governs *how* the agent works) — this is *what this
  phase builds*. As a document it is a **feature spec + implementation plan, not a decision
  record** (`standards/09` §3).
- **Read it before any code — it is the last requirements-alignment checkpoint.** Re-paste the
  original requirements and have the agent check the plan against them for conflicts; list and
  resolve them **before** writing code.

## 4. Foundation-impact gate *(MUST)*

Mid-build you may change only requirements **unrelated to the low-level architecture.** If
you can't tell whether a change touches the **stack / structure / schema / core fields / auth
/ payment**, **ask first.** If it does: **stop — get an impact assessment + adjustment plan
before implementing** (`standards/08` §8; a decision record for the call, `standards/09`).
Never "satisfy the requirement first" and let the agent break the architecture to obey.

## 5. Phase-gated execution — prevent drift *(MUST)*

**Drift** = the agent leaving the plan: free-playing (adding unrequested work) or
omitting / over-doing.

- **Box each sub-phase before it starts.** Instruct the agent to: *follow the `AGENTS.md` and
  the implementation doc, implement only the current sub-phase, not exceed scope, and stop and
  report — do not auto-advance.* Send the doc path. Two boundaries: *how* it works and *what*
  it does this time.
- **Accept every sub-phase before the next.** Even if the agent — or an auto-execute mode —
  ran further, don't push on without acceptance.

## 6. Acceptance from evidence, not code-reading *(MUST)*

You don't need to read the code. Have the agent report **three things**, against the doc:

1. **Done vs not done** this phase (against the implementation doc).
2. **What exactly changed** — any omissions? any over-doing?
3. **How it verified, the result, and the next sub-phase + why.**

If the stated "next" doesn't match the doc, its understanding has **drifted — pull it back**
before continuing. If an answer is unclear, have it explained in plain language. This is the
git-verifiable, evidence-first DoD (`standards/00` §3, `standards/05`, `standards/08` §5)
applied per sub-phase. (`templates/PHASE_REPORT.md.template`.)

## Throughline

Never let the agent build on feeling. Always a **doc to check against**, a **boundary to
keep**, and **acceptance evidence** — that is how someone who can't read the code keeps
direction instead of handing it over.
