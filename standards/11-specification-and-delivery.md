# 11 — Specification & delivery

`00–10` govern **how** you build. This governs getting from a fuzzy idea to shipped work
**without the agent (or a human) drifting**. Two halves: **(A)** lay the foundation and rules
*before* business code; **(B)** drive each phase from **linked authoritative specs** in
**bounded, accepted** increments. Throughline: **never build on feeling — always a doc to
check against, a boundary to keep, and independent evidence.** Graded **MUST / SHOULD / MAY**;
calibrate by **risk and profile**.

## 1. Foundation before business code *(MUST — roughly in order; each informs the next)*

1. **Project brief + feature list/spec** — what the project is; features as clear items with
   **non-goals** (`templates/PROJECT_BRIEF`, `FEATURE_LIST`, `FEATURE_SPEC`). Vague
   requirements are the root failure.
2. **Tech-stack decision.** Weigh **requirement fit, human maintainability, security-support
   lifecycle, ecosystem, deploy cost, reversibility, and lock-in** — **agent familiarity is
   one factor, not the deciding one**. Record it as a **decision record** (`standards/09` §2).
   Don't churn it casually (each change re-lays foundation — but see the foundation rule).
3. **Architecture as a walking skeleton.** Build the **smallest production-shaped path that
   proves the chosen architecture can build, run, test, observe, and deliver one
   representative end-to-end behavior** (`standards/01`) — **only the foundation the profile
   actually needs.** Not a kitchen-sink of response-envelope / logging / global state / DB +
   permission entry by default — a static site, CLI, library, or batch pipeline has a
   different skeleton. Add infrastructure when a feature needs it, not preemptively.
4. **Agent contract — two stages** (`standards/08`):
   - **Bootstrap contract — exists from repo creation:** security & permission boundaries,
     no direct push to the trunk, evidence/authenticity (claimed ≠ done), the current sources
     of truth, and the **tool adapter + a check that the rules are actually loaded** (file
     existing ≠ rules in context). The agent must obey these *before* it ever helps with
     brief/stack/scaffold.
   - **Project-specific contract — filled once brief/stack/architecture exist:** build/test
     commands, module boundaries, protected zones, the profile, deploy rules.
   - Put the contract **in the tool-supported location or adapter, and verify it is actually
     loaded** — not "the tool auto-reads it every task" (tools differ; `standards/08` §1).

> **Foundation rule (MUST): the foundation is *stable by default, not immutable.*** Business
> details flex freely. Changing the foundation (stack / structure / schema / core fields /
> auth / payment) goes **through the front door**: impact assessment → **decision record**
> (`09`) → migration/compat + **rollback** plan → updated spec & implementation plan → note
> the affected tests/deploy/docs. What's forbidden is the **casual or silent** change to
> satisfy a one-off request (§4) — not principled change. A reusable framework must not
> permanently lock in a wrong early decision.

## 2. One phase at a time, just-in-time *(MUST)*

- Requirements break into **big phases**; a big phase is too coarse to hand an agent — it
  fills gaps with guesses and leans to low-effort filler.
- **Detail only the current big phase.** Later phases keep direction only — over-detailing
  ahead is wasted when requirements change. Finish one, then detail the next.

## 3. The delivery package — linked authoritative docs *(MUST)*

Not "one document rules all facts" (that lets *how to implement* override *what the product
wants*). A **linked set, each fact owned in exactly one place**, the rest link to it:

| Document | Owns |
|---|---|
| Project brief | problem, users, goals, success criteria |
| Feature spec | scope, behavior, business rules, **non-goals**, acceptance |
| Decision record (ADR) | key choices, alternatives, consequences (`standards/09`) |
| Implementation plan | sequence, impact, verification method, phase boundaries |
| Phase report | actual results, evidence, deviations, current status |

- The **implementation plan** owns *how / sequence / verification* — it **does not override**
  what the product wants (that's the feature spec; `standards/09` §3 — these are not
  interchangeable).
- A change is **authoritative only after it is written to the owning artifact, reviewed, and
  committed** — a chat message is not a change.
- **Don't duplicate requirements.** Reference the **versioned** brief/spec and run a
  requirement → spec → plan **traceability check**; don't re-paste a second copy that can
  drift.

## 4. Foundation-impact gate *(MUST)*

Mid-build, change requirements freely **only when they don't touch the foundation**. If you
can't tell whether a change touches the **stack / structure / schema / core fields / auth /
payment**, **ask first**. If it does: **stop and take it through the front door** (§1
foundation rule — impact assessment + decision record + migration/rollback) **before**
implementing. Never "satisfy the requirement first" and let the agent break the architecture.

## 5. Phase-gated execution — prevent drift, calibrated by risk *(MUST)*

**Drift** = the agent leaving the plan: free-playing (adding unrequested work) or
omitting/over-doing.

- The **implementation plan declares acceptance checkpoints.**
- **Stop and accept at every high-risk boundary** — architecture/security, data migration,
  production deploy, permissions, protected output, any irreversible action.
- **Low-risk, clearly-bounded, auto-tested steps may run as one bounded batch** to the next
  checkpoint — forcing a human stop after every trivial step is friction, not safety.
- **Any out-of-scope work, failure, or newly-discovered risk → stop immediately**, batch or not.
- **Box each batch:** follow the `AGENTS.md` + the implementation plan, do only the declared
  scope, **stop and report at the checkpoint** — don't auto-advance past it. Send the plan path.

## 6. Acceptance — two roles, evidence over self-report *(MUST)*

The agent's report is **input to acceptance, not acceptance itself** (a claim ≠ verification).
Keep the two roles separate (`standards/00` two roles; claimed ≠ done; evidence by change
type `00` §2):

- **Product acceptance** — the owner, **in plain language, no code-reading required**: does it
  solve the problem per the feature spec/brief? The agent's plain-language report helps here.
- **Technical acceptance** — **independent review that the agent's self-report cannot
  replace**: the diff, the tests, security implications, and **running evidence** are verified
  by the technical gate (`standards/05`, `standards/08` §5 git-verifiable).

The agent reports, against the plan: **(1)** done vs not done · **(2)** what exactly changed
(omissions? over-doing?) · **(3)** how it verified, the result, and the next step + why. A
"next" that doesn't match the plan = **drift, pull back**. (`templates/PHASE_REPORT`.)

## Throughline

Never let the agent build on feeling. Always a **doc to check against**, a **boundary to
keep**, and **independent evidence** — that is how the owner keeps direction (product
acceptance in plain language) while the technical gate still verifies the work is real.
