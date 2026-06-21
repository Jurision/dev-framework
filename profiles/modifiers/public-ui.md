# Modifier: public-ui

**Status: provisional** · **Evidence maturity: one real-project dry-run.**

The project serves **public, visitor-facing pages** (indexed, brand-exposed, conversion- or
content-driven). Delta over `00–10` for what a *public* surface adds beyond the base
`web-app` UI rules.

## Applies to / does NOT apply to

- **Applies:** marketing sites, public content/catalog pages, anything search engines index
  and anonymous visitors reach.
- **Does not apply:** authenticated operator tooling → `internal-ui` (a project may have
  both).

## Rules raised to MUST

1. **Discoverability contract.** A valid **sitemap**, correct meta/canonical tags, and stable
   public URLs are verified in CI (not hand-checked).
2. **Public link-graph integrity.** **No dead or fake public links** (`standards/02` hard
   rule + `standards/05` journey audit): internal links resolve, no `href="#"`, no link to a
   page that 404s.
3. **Content ↔ render parity.** Published content matches what renders (a content-source vs
   rendered-output check), so the public site can't silently drift from its source of truth.
4. **Full visual target + WCAG 2.2 AA on public pages** (`standards/02`): public surfaces
   carry brand and legal-accessibility exposure — tokens, responsive behavior, and rendered
   review apply without exception.
5. **Synthetic content monitoring** of production (`standards/06` §7): the scheduled health
   check asserts **content markers** (key text, sitemap, error fallbacks), not just HTTP 200.

## Rules that may relax

- Nothing security-relevant. Operator-density concerns are **not applicable** here (they're
  `internal-ui`).

## Required controls

- CI checks: **sitemap presence + public link-graph** (no dead links).
- A **scheduled synthetic content check** in production (content markers, not just 200).

## Acceptance evidence

- Sitemap + link-graph checks **green in required CI**; the production synthetic check runs
  on a schedule and asserts content (not status alone); a content↔render parity check exists.

## Non-goals (owned elsewhere)

- Operator workbench density / complex forms → **`internal-ui`**.
- Backups / restore / data persistence → **`persistent-data`** + `standards/06`.
- The design-system body → **`standards/02`** (this modifier sets which parts bite on public
  surfaces, it doesn't restate them).

> Provisional: one public-web dry-run. Image-relevance / above-the-fold / CTA audits seen in
> that project are candidates, not yet generalized — re-validate against a second public site.
