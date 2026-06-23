# Adoption feedback 004 — stale context produces confident, wrong coordination

A session-hygiene case from a real **multi-agent** session. **Desensitized** — no project names,
identifiers, or production details. Validates `standards/08` §13 (session & context hygiene) from
the **coordination** angle: not only *degradation* of one long session, but **acting on stale or
partial context without re-verifying live state**.

**Context (generic):** a multi-day effort with **several agents / sessions** touching one repo,
coordinated by a human relaying between them.

## What happened
Two independent **stale-context coordination errors** occurred in one session, by **different
participants** — which is the point: this is a failure mode of the *method*, not of one agent.
- One participant, reasoning from an **issue's original text** (which said task B was "blocked
  by" task A), recommended having an implementer **redo A then B** — but A and B had **already
  been completed and merged**. The advice was confident and internally coherent; it was simply
  built on the issue as-written, not the live state.
- Another participant reported a feature as **"not yet live"** from **partial state** — it had
  checked the *automatic* deploy (which correctly **skips** the gated step) and concluded the
  step had not run, while a **sibling session had already performed the gated action manually**.
  Corrected only after reading the sibling session's actual record.

In both cases the fix was identical: **re-verify live state (git / issues / CI / the running
system / sibling sessions) before asserting or recommending.**

## Lessons (generalizable)
1. **Treat remembered, quoted, or handed-off context as a *hint*, not *truth*.** An issue's
   original text, a memory note, or a prior session's summary describes a *point in time*; the
   source of truth is the live repo / CI / runtime. Re-check before acting — exactly
   `standards/08` §13's "state lives in git, not the session."
2. **Coordination across agents/sessions is where stale context bites hardest.** A single agent
   usually still has its own recent actions in context; **hand-offs and parallel sessions** do
   not — so a claim about "what's already done" is the highest-risk thing to take on trust.
   Verify *before* you coordinate.
3. **"Confident and coherent" is not "current."** Both wrong calls were well-reasoned; coherence
   is no defense against staleness. The only defense is a cheap liveness check.
4. **The rule must be self-implicating.** It applies to **every** participant (human and agent),
   not "the other one." A hygiene rule expected only of others will not hold.

## Implications for 0.2 / standards
- Strengthen `standards/08` §13 with a **"verify-before-coordinate"** clause: before asserting
  completion status or recommending work across a hand-off or parallel session, **re-derive it
  from live state** (git / issues / CI / runtime) rather than quoting remembered or issued
  context.
- Candidate checklist line (`pr-review` / a handoff checklist): *"Claims about what is
  merged / deployed / done are checked against live state, not the issue text or a prior
  summary."*
