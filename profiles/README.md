# Profiles — composable (base + modifiers)

The framework's numbers and strictness (line caps, WIP, staleness, gate strictness) are
**starter defaults**, not constants. A project calibrates them with a profile.

**A project does NOT pick one profile.** Real projects are mixed: a data/AI system can also
have an internal web workbench; a web app can also be a multi-tenant data system with
pixel-locked document output. So the model is:

> **one BASE workload profile + zero or more MODIFIERS.**

## Selection

- **Exactly one base** (the dominant workload): `base/web-app` · `base/api-service` ·
  `base/library-sdk` · `base/data-ai`.
- **Zero or more modifiers** (cross-cutting traits): `public-ui`, `internal-ui`,
  `persistent-data`, `multi-tenant`, `runtime-ai`, `protected-output`, `human-in-the-loop`,
  `team-maintained` / `solo-maintained`, `regulated`.
- Record the selection in the project's `AGENTS.md` via an **adoption manifest**
  (see [`adoption-manifest.template.yml`](adoption-manifest.template.yml)).

Real shapes (from the three frozen dry-runs, project specifics stripped):

| Workload | Composition |
|---|---|
| data/AI + internal workbench | `data-ai` + `internal-ui` + `persistent-data` + `runtime-ai` + `human-in-the-loop` |
| public content web | `web-app` + `public-ui` + `team-maintained` + `persistent-data` |
| authenticated multi-tenant web | `web-app` + `internal-ui` + `persistent-data` + `multi-tenant` + `protected-output` |

This is why a single coarse `team-web` profile is wrong: it would force one web app's
content/visual audits onto another that needs tenant isolation and protected-output rules
instead. Modifiers compose; profiles don't multiply.

## Override rules (precedence-safe)

Profiles sit **below** project decisions and **far below** security/law in the root
[precedence](../README.md). Therefore:

1. **Law/compliance and security/data invariants are never lowered** by a base or modifier.
2. A modifier **may raise** a default to MUST, **add** a required control, or **tighten** a
   number. It **may relax** a *non-security* default to SHOULD/MAY **only with a written
   reason**.
3. **No silent downgrades** — every relaxation is recorded in the manifest `exceptions` with
   a reason. An undocumented deviation is the bug.
4. **On conflict, the stricter wins** (and anything security-relevant always wins).

## What a base/modifier document contains — **delta only**

A profile doc records **only what differs** from standards `00–10`. It never copies them.
Required sections (skeleton):

```markdown
# <base|modifier>: <name>
## Applies to / does NOT apply to
## Rules raised to MUST                 (each cites the standard, e.g. `10 §5`)
## Rules that may relax to SHOULD/MAY   (with the condition)
## Required controls                    (the automated, blocking gates this demands)
## Acceptance evidence                  (what proves a project meets it)
## Starter defaults                     (numbers this suggests)
## Non-goals                            (explicitly out of scope)
```

## Catalog

🚧 = to be written in a following PR, **generated from dry-run evidence, not invented.**
A base/modifier without a real source project stays a stub rather than a guess.

**Bases** — [`base/data-ai`](base/data-ai.md) ✅ *(provisional)* ·
[`base/web-app`](base/web-app.md) ✅ *(provisional)* · `base/api-service` 🚧 *(unevidenced
stub)* · `base/library-sdk` 🚧 *(unevidenced stub)*.

**Modifiers** — [`internal-ui`](modifiers/internal-ui.md) ✅ *(prov.)* ·
[`public-ui`](modifiers/public-ui.md) ✅ *(prov.)* ·
[`persistent-data`](modifiers/persistent-data.md) ✅ *(prov.)* · `multi-tenant` 🚧
· `runtime-ai` 🚧 · `protected-output` 🚧 · `human-in-the-loop` 🚧 · `team-maintained` /
`solo-maintained` 🚧 · `regulated` 🚧 *(unevidenced stub)*.

> **Scope of this PR:** the composition *mechanism* only (this README + the manifest
> template). The base and modifier docs land in later PRs, each derived from the frozen
> dry-run reports.
