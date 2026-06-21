# Modifier: runtime-ai

**Status: provisional** · **Evidence maturity: one real-project dry-run.**

The **running product calls a model/LLM at request time** (not just offline/batch). Delta
over `00–10` for treating a live model as a privileged, fallible runtime dependency. Security
basics (injection boundary, secrets-out-of-context) are global `standards/07` — not restated.

## Applies to / does NOT apply to

- **Applies:** in-product inference — assistants, live classification, retrieval+generation,
  agentic tool calls.
- **Does not apply:** purely offline/batch model use → that's the eval discipline in
  `base/data-ai`.

## Rules raised to MUST

1. **Per-call traceability.** The **model, provider, and prompt/config version** are recorded
   for each runtime call, so a behavior change is explainable and reproducible.
2. **Tool/function permissions are least-privilege.** A model can invoke **only** the tools
   it's explicitly granted; granting an external side-effecting tool implies
   **`human-in-the-loop`**.
3. **Limits and timeouts.** Token/cost/rate caps and per-call timeouts exist; a runaway or
   stuck call can't exhaust budget or hang the request path.
4. **Graceful degradation.** A provider failure has a defined fallback (cached / reduced /
   explicit error) — the product doesn't hard-fail on an upstream blip.
5. **Observability without leakage.** Model latency / failure / fallback rates are monitored;
   **no PII or secrets in prompts/logs** (`standards/07` §1.8, §2.5).

## Rules that may relax

- None security-relevant. Eval-set rigor for output *quality* lives in `base/data-ai`; this
  modifier is about the runtime *dependency*.

## Required controls

- Per-call model/provider/prompt-version logging; cost/rate limit enforcement; a monitored
  failure/fallback metric.

## Acceptance evidence

- For a sampled response: model+provider+prompt version are retrievable; limits/timeouts are
  configured; a provider-outage path is tested; logs are PII/secret-free.

## Non-goals (owned elsewhere)

- **Prompt-injection boundary, secrets never in model context** → **`standards/07`** §2.
- **External side effects from AI output need human approval** → **`human-in-the-loop`**.
- **Output-quality eval sets + thresholds** → **`base/data-ai`**.

> Provisional: one runtime-AI dry-run. Re-validate against a second before promoting.
