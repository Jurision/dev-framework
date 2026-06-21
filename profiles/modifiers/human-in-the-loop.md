# Modifier: human-in-the-loop

**Status: provisional** · **Evidence maturity: one real-project dry-run.**

AI (or automation) output can trigger **external or irreversible side effects** — sending a
message, deleting data, changing permissions, moving money, deploying. Delta over `00–10`:
this modifier **operationalizes** `standards/07` §2.3 ("no autonomous high-risk or
irreversible actions") for AI-suggested side effects.

## Applies to / does NOT apply to

- **Applies:** any path where a model/automation can *propose* an action with an external,
  costly, or irreversible effect.
- **Does not apply:** read-only / analysis-only products with no side-effecting actions.

## Rules raised to MUST

1. **AI drafts; a human commits.** The system **proposes**; a person performs the explicit,
   irreversible step. No autonomous send / delete / permission-change / payment / deploy.
2. **The boundary is enforced in code, not convention.** The AI path **cannot call the
   side-effecting API directly** — it queues a draft/approval; only a human-triggered,
   authenticated action executes it. (The dry-run's "AI drafts, human sends" is the model.)
3. **Approvals are attributable and audited.** Who approved what, when — recorded, so a
   side effect is always traceable to a human decision (`standards/07` §2.6).
4. **The human sees what they're approving** — the exact content/recipients/effect is shown
   before commit (no blind "approve all").

## Rules that may relax

- None. This is a safety boundary on irreversible actions.

## Required controls

- A **draft/approve queue** between AI output and any side-effecting API; an **audit log** of
  approvals (actor + payload + time).

## Acceptance evidence

- A side-effecting action cannot be invoked by the model path in code (test/architecture
  shows the gate); the approval audit log exists; the approval UI shows the concrete effect.

## Non-goals (owned elsewhere)

- The list of which actions count as high-risk/irreversible → **`standards/07`** §2.3.
- Runtime model routing / tool permissions → **`runtime-ai`**.

> Provisional: one human-in-the-loop dry-run (AI drafts, human sends). A clean instance of
> "no autonomous high-risk action" — keep strict.
