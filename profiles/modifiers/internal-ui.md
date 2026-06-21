# Modifier: internal-ui

**Status: provisional** · **Evidence maturity: two real-project dry-runs.**

The project has an **operator / admin / analyst UI** (an internal audience). Delta over
`00–10` — and a correction to a common mistake: choosing a non-public base (`data-ai`) or an
internal audience does **not** exempt a UI from `standards/02`.

## Applies to / does NOT apply to

- **Applies:** dashboards, admin panels, operator workbenches, analyst tooling — UIs used by
  authenticated internal users.
- **Does not apply:** public marketing/content surfaces → `public-ui` (a project may have
  both; add both modifiers).

## Rules raised to MUST

1. **`standards/02` applies in full to internal UIs.** Design **tokens + consistency**, state
   design (loading / empty / error / disabled for every control), keyboard operability and
   **focus order**, real controls (**no dead/fake controls** — dense operator tools are where
   these hide), and **rendered-output review before merge/release**.
2. **Accessibility ≥ WCAG 2.2 AA** still holds. "Internal-only" is not an a11y waiver;
   operators use these tools all day — keyboard and focus order matter **more**, not less.
3. **Density is designed, not accidental.** High-information operator screens get explicit
   layout/scan-order/state decisions, not a dump of fields.

## Not triggered here (NOT an exception to document)

- **Public brand expression, SEO/sitemap/indexing, and marketing-conversion** simply **don't
  apply** to an internal surface. These are **not relaxations to record in the manifest** —
  they're `public-ui` concerns you didn't opt into. a11y, state design, tokens, and
  real-controls do **not** relax.

## Required controls

- **Rendered-output review** is required on internal-UI changes (`standards/02` §5) —
  screenshot / preview / visual-regression, before merge.

## Acceptance evidence

- An internal-UI change shows a **rendered review artifact**; every interactive control has
  designed states; keyboard path verified for the critical operator journey.

## Non-goals (owned elsewhere)

- Public SEO / sitemap / link graph / content quality → **`public-ui`**.
- The design-system body (tokens, hard visual rules, the visual gate) → **`standards/02`**
  (this modifier only says *it applies here too*).

> Provisional: two dry-runs (a data workbench and an admin panel). Re-validate before
> promoting.
