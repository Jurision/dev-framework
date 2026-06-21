# Base: web-app

**Status: provisional** · **Evidence maturity: two real-project dry-runs.**

Delta over standards `00–10` for a **browser-delivered application** — SSR or SPA, public
and/or internal. This base owns only what is common to *shipping a working UI to a browser*.
The two web dry-runs differed sharply (public-content vs authenticated-multi-tenant); those
differences are **modifiers**, not part of this base.

## Applies to / does NOT apply to

- **Applies:** anything whose dominant deliverable is a UI a browser loads and uses.
- **Does not apply:** a headless service (`base/api-service`) or a pipeline that merely has a
  small status page — and a UI that mainly *displays model output* still picks this base and
  adds `runtime-ai`.

## Rules raised to MUST

1. **The production execution path is exercised in required CI** — build the **production
   build / server artifact** and run the gate against it, not only unit tests on a dev server.
   (A green dev test that never builds prod is not coverage.)
2. **The project defines and automatically verifies its own critical browser journey(s)**,
   with **blocking E2E** that asserts the **real effect** — not merely HTTP 200 or
   "the element exists" (`standards/05` §3, "200 ≠ healthy"). There is no single fixed
   journey: a content site's may be load→navigate→inquire; an editor's may be
   edit→preview→export.
3. **Write-type apps verify the full loop:** after a successful action, the data is
   **actually persisted and re-rendered** — **no silent no-op**. Cover at least
   **mutation → persistence → rendered result**.
4. **The routing contract is verifiable** where applicable: direct-URL load, reload, 404,
   auth redirect, and deep links behave as specified.

## Inherited (cross-reference, do NOT restate here)

- **Visual changes** follow `standards/02`: state design, keyboard operability, **WCAG 2.2
  AA**, and **rendered-output review before merge/release**. The body lives in `02`; the
  applicable UI modifier (`public-ui` / `internal-ui`) sets which parts bite.
- **Deploy** follows `standards/06`: a web project MUST verify the **real production
  artifact** is what's live; revision-lockstep, rollback, and persistent paths are not
  rewritten here.

## Rules that may relax

- Little on its own. A web app **without** `public-ui` never triggers SEO/sitemap/link-graph
  gates; one **without** `multi-tenant` never triggers tenant-isolation rules. That is the
  **absence of a modifier**, not `web-app` waiving anything — don't encode those relaxations
  here.

## Required controls

- A **production-build step** in required CI.
- A **blocking E2E gate** over the project's declared critical journey(s).

## Acceptance evidence

- CI **builds the production artifact** and runs the **journey E2E green** (required, not
  optional).
- For a write app: a test demonstrates **persistence + re-render** after the action.
- Routing tests cover the declared contract (where applicable).

## Starter defaults

- At least **one** declared critical journey under blocking E2E (more as the surface grows).
- Concrete journeys/routes are project-specific — name them in the adoption manifest.

## Required companion modifiers

- **At least one of `public-ui` or `internal-ui`** (a web app has at least one audience; it
  may have both).
- Add **`persistent-data`** if it has state that can't be cheaply rebuilt.
- `web-app` does **not** imply `multi-tenant`, public SEO, or `protected-output` — add those
  modifiers only when the trait is real.

## Non-goals (owned elsewhere)

- SEO / sitemap / link graph / public content quality → **`public-ui`**.
- Admin operation density / complex forms / operator workbench → **`internal-ui`**.
- Database / backups / restore drill → **`persistent-data`** + `standards/06` / `10`.
- Workspace / tenant isolation + cross-tenant negative test → **`multi-tenant`**.
- Pixel-/format-locked documents or exports → **`protected-output`**.
- Runtime model routing / provider permissions → **`runtime-ai`**. Security invariants →
  `standards/07`.

> Provisional: derived from two web dry-runs that themselves differed (content vs
> authenticated-data). Keep the divergence in modifiers; re-validate before promoting.
