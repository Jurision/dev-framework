# 01 — Code architecture

How the code is organized so it stays navigable, testable, and safe to change — and how to
**prevent** the single most common decay: the god file. The mechanism is an enforced gate,
not discipline (see `00-principles.md` #6).

## 1. Composition root

The entry/root file (`main`, `App`, `index`, the server bootstrap) is a **composition
root only**: it wires together providers, routing, and the top-level shell. It holds **no
domain logic and no large components**. Logic lives in modules it imports.

A useful target: the root file is a thin orchestrator (a few hundred lines at most),
readable in one sitting. If it is growing, that is the symptom — extract.

## 2. One concern per file

Each file does one job and is named for it. A typical layout (adapt to your stack):

| Concern | Lives in |
|---|---|
| Screens / pages | `pages/` (or `routes/`, `views/`) |
| Domain logic / models | `*Model.*` / `domain/` — pure, unit-tested |
| App state / providers | `state/` |
| Side-effectful integration (sync, API clients) | `*Client.*` / `services/` |
| Shared UI | `components/` |
| Vendored / generated code | a clearly separate dir, **not hand-edited** |

Pure logic is **separated from UI and from side effects** so it can be unit-tested
directly. "Extract a cohesive concern", not "split to hit a number" (see #3).

## 3. File-size tripwire *(enforced in CI)*

A hard backstop against god files. The number is a **tripwire that forces a decision**,
not an ideal — set it generously so it only fires on genuine sprawl, and make crossing it
require an explicit, reviewed exemption rather than be impossible.

- **Per-file cap, type-aware.** Components (verbose markup) get more room than plain logic
  modules. A sensible default: **~800 lines for component files, ~500 for logic files**
  (counting non-blank, non-comment lines). Vendored code and tests are exempt.
- **Per-function cap as a `warn`** (e.g. ~400 lines) to surface monster functions without
  blocking — these are advisory and folded into feature work, not a separate refactor
  sprint.
- **Enforce in CI** via the linter's `max-lines` (or an equivalent script), so any new or
  re-growing file over the cap **fails the build and cannot merge**. A documented rule
  with no gate gets out-run by delivery pressure.

### The ratchet (handling legacy monoliths)

You will adopt this with files already over the cap. Do **not** weaken the gate.

- Add a small **grandfather exemption list**: each over-cap file gets a per-file cap set at
  (or just above) its current size. The list is the **visible, shrinking decomposition
  backlog**.
- **Caps may only be lowered, never raised.** A PR that shrinks a grandfathered file
  lowers its cap to the new size in the same PR — the cap tracks actual size, never lags.
- **Delete the entry** once the file drops under the global cap. When the list is empty,
  the codebase is monolith-free and can only stay that way.

Never disable the gate (e.g. drop the lint step) to make CI green — fix the cause.

## 4. Decomposition discipline

Breaking up a monolith is **pure refactor: behavior-preserving, zero functional change.**

- Move/extract in **small, atomic PRs**; one cohesive concern at a time.
- Have a **safety net first**: unit tests on the extracted pure logic, plus an end-to-end
  smoke for the critical flow, wired into CI **before** the risky splits. Then each split
  is validated automatically.
- Keep extractions **structural** — pull out a sub-component/hook/module; don't bake in
  assumptions that an upcoming feature will change. If a feature is about to restructure a
  file, split it **as part of that feature**, not in a throwaway pass first.
- Protected/design-locked zones move **verbatim** — change location, not appearance.

## 5. Module boundaries & dependency direction

- Dependencies point **inward / downward**: UI → domain → primitives; domain logic does
  not import UI; shared/low-level modules do not import feature modules.
- No import cycles. A cycle is a design smell — break it by extracting the shared piece.
- A feature owns its files; cross-feature reuse goes through a shared module, not a reach
  into another feature's internals.

## 6. Protected zones

Some code is **load-bearing and must not be changed casually** (see `00-principles.md`
#9): a finalized document/visual design, generated artifacts, vendored libraries, a public
schema. Isolate them (a scoped style layer, a separate dir) and state in `AGENTS.md` that
they move-but-don't-change without an explicit ask.

## 7. Dependency hygiene

- **Every dependency is a liability** (bundle size, maintenance, security surface). Prefer
  the platform/stdlib; add a dep only when it clearly pays for itself.
- **Lazy-load heavy, rarely-used deps** so they don't tax first load.
- Keep deps current with an automated updater (e.g. Dependabot): **auto-merge grouped
  patch/minor after CI**, **review majors deliberately** (a failing CI on a major bump is
  the signal — handle it as its own task, never inside a feature PR).

## 8. Naming & consistency

Match the surrounding code — its naming, comment density, and idioms — over importing your
own style. Consistency is a feature: a reader (human or agent) should not be able to tell
which file a given author wrote.
