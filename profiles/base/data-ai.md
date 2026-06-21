# Base: data-ai

**Status: provisional** · **Evidence maturity: one real-project dry-run.**

Delta over standards `00–10` for a **data / analysis / model** workload — ingestion,
transformation, and analytical or model-generated outputs. This base owns only what is
specific to *working with data and models*. Cross-cutting traits are modifiers; security is
global (`standards/07`). It does **not** restate them.

## Applies to / does NOT apply to

- **Applies:** pipelines that ingest external data, derive results, and/or call models to
  produce analysis, classifications, summaries, or suggestions.
- **Does not apply:** a product whose dominant work is serving a UI (`base/web-app`) or a
  headless contract (`base/api-service`) and that merely *uses* a model — those pick the UI/
  service base and add the `runtime-ai` modifier.

## Rules raised to MUST

1. **Provenance is tracked.** Every datum carries its **source, batch, capture time,
   schema/version,** and an **evidence reference or content hash**. "Where did this come
   from?" is answerable for any record.
2. **Lineage is explicit.** There is a traceable path from **raw input → each derived
   result**. A derived value names the inputs and the transform that produced it.
3. **Transforms are versioned.** Data-transform **code, config, and model/provider version**
   are all traceable for any output (so a result can be reproduced or explained).
4. **Deterministic stages are tested deterministically** — fixed input → asserted output
   (extends `standards/05` §2 to the pipeline, not just app logic).
5. **Stochastic / model-generated outputs use a versioned evaluation set + acceptance
   thresholds**, **not** verbatim equality. "The model changed and 3 eval cases regressed
   past threshold" is the failure signal, not a brittle string match.
6. **Data-quality checks are in an automated, *blocking* gate** (`standards/04`) — schema,
   null/range, referential, and freshness checks fail the build, not a manual script.
7. **`process-audit` is additional governance, never a substitute** for the build / test /
   evaluation gate (the dry-run lesson: a process-governance script ≠ build/test CI).
8. **If the project has any operator/internal UI, it MUST also add `internal-ui`.** Choosing
   `data-ai` does **not** exempt it from `standards/02` (a11y, state design, real controls,
   rendered review). A data workload commonly has a real web workbench.

## Rules that may relax

- This base relaxes little on its own. A pure pipeline **without** a UI modifier simply never
  triggers `standards/02`'s design-system requirements — that is the **absence of a UI
  modifier**, not `data-ai` waiving 02. Don't encode UI/SEO/backup relaxations here; those
  are owned (or not) by `public-ui` / `internal-ui` / `persistent-data`.

## Required controls

- A **data-quality gate** in required CI (blocking).
- A **versioned eval set + threshold runner** for any model-generated output.
- **Lineage/provenance recorded** at write time (queryable later).

## Acceptance evidence

- For a sampled output: its source records, the transform/version, and (if model-generated)
  the eval case + threshold are all retrievable.
- Deterministic-transform tests and the data-quality gate are **green in required CI**.
- The eval set is version-controlled; a model/prompt change shows a diff against thresholds.

## Starter defaults

- Eval thresholds: per-metric, set from a baseline run (no universal number — provisional).
- Freshness/quality thresholds: project-specific; record them in the adoption manifest.

## Required companion modifiers

Add the modifier when the trait is present (this base assumes none of them by default):

- Online model / provider / prompt routing at runtime → **`runtime-ai`**.
- State that cannot be cheaply rebuilt → **`persistent-data`** (backups, restore drill).
- An operator/analyst web workbench → **`internal-ui`**.
- AI suggestions can trigger external side effects (send / delete / permissions) →
  **`human-in-the-loop`**.

## Non-goals (owned elsewhere — do not restate here)

- **AI/analysis path is read-only; writes via a narrow audited path** → global
  **`standards/07` §1.5**. Prompt-injection boundary, secrets-out-of-context, no autonomous
  high-risk actions → `standards/07` §2.
- **Backups / restore / migration / retention** → raised by `persistent-data` +
  `standards/06` / `10`.
- **Brand tokens / SEO / public visual review** → `public-ui`; operator-UI quality →
  `internal-ui`.
- **Human approval of side effects** → `human-in-the-loop`. **Runtime model routing /
  permissions** → `runtime-ai`.

> Provisional: derived from a single data-ai dry-run. Re-validate against a second data/AI
> project before promoting any rule here to a cross-project default.
