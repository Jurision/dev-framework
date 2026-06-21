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
   irreversible step. No **model-initiated / model-decided** send / delete / permission-change
   / payment / production deploy. *(This forbids an **AI** triggering a high-risk action — not
   a deterministic CI/CD release from a reviewed PR on a protected trunk, which `standards/06`
   requires. That is human-decided automation, not an autonomous AI action.)*
2. **A code-level approval boundary the model path cannot bypass.** The AI path **cannot call
   the side-effecting API directly**; only a human-triggered, authenticated action executes
   it. The mechanism is **implementation-neutral** — an approval queue, a confirmation
   transaction, a policy engine, two-person approval, a signed command, or a staged promotion
   gate all qualify. (The dry-run's "AI drafts, human sends" is one such model.)
3. **Approvals are attributable and audited.** Who approved what, when — recorded, so a
   side effect is always traceable to a human decision (`standards/07` §2.6).
4. **The human sees what they're approving** — the exact content/recipients/effect is shown
   before commit (no blind "approve all").

## Rules that may relax

- None. This is a safety boundary on irreversible actions.

## Required controls

- A **code-level approval boundary** (any implementation above) between AI output and any
  side-effecting API; an **approval audit** recording **actor, action type, target,
  version/digest, decision, time** — sensitive content via a **protected reference, not copied
  into the log** (`standards/07` no-PII/secrets-in-logs).

## Acceptance evidence

- A side-effecting action cannot be invoked by the model path in code (test/architecture
  shows the gate); the approval audit log exists; the approval UI shows the concrete effect.

## Non-goals (owned elsewhere)

- The list of which actions count as high-risk/irreversible → **`standards/07`** §2.3.
- Runtime model routing / tool permissions → **`runtime-ai`**.

> Provisional: one human-in-the-loop dry-run (AI drafts, human sends). A clean instance of
> "no autonomous high-risk action" — keep strict.
