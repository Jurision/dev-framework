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
5. **Observability without leakage.** Model latency / failure / fallback rates are monitored.
   **Secrets never enter model context** (`standards/07` §2.5). **PII is governed, not banned
   outright:** send only the minimum data a task needs to an **approved** provider; honor
   consent / retention / region / data-processing policy; keep **raw PII out of logs** and
   redact sensitive fields per policy.
6. **A minimum runtime-model eval gate.** Model behavior that **affects users, business
   decisions, security, or data outcomes** — including **non-displayed paths** like backend
   classification or risk scoring — has a **versioned eval set**; a change to the **model,
   prompt, toolset, or retrieval config** runs a **regression evaluation against explicit
   thresholds in a required gate**. Live quality metrics complement but **do not replace**
   pre-release eval. *(This closes the `web-app + runtime-ai` hole — any
   base + runtime AI gets a behavior gate, not only `data-ai`.)*

## Rules that may relax

- None security-relevant. **Division of eval duty:** this modifier owns the **minimum
  runtime-model-behavior eval gate** (rule 6); `base/data-ai` owns the fuller **data
  provenance / lineage / data-quality** gate. They compose, they don't overlap.

## Required controls

- Per-call model/provider/prompt-version logging; cost/rate limit enforcement; a monitored
  failure/fallback metric; a **versioned eval set + threshold check in required CI**.

## Acceptance evidence

- For a sampled response: model+provider+prompt version are retrievable; limits/timeouts are
  configured; a provider-outage path is tested; logs are secret-free and PII-governed; the
  **eval set is versioned and its threshold check is green in required CI**.

## Non-goals (owned elsewhere)

- **Prompt-injection boundary, secrets never in model context** → **`standards/07`** §2.
- **External side effects from AI output need human approval** → **`human-in-the-loop`**.
- **Fuller data provenance / lineage / data-quality gate** → **`base/data-ai`** (this modifier
  keeps only the runtime-model-behavior eval, rule 6).

> Provisional: one runtime-AI dry-run. Re-validate against a second before promoting.
