# Adoption feedback 002 — deploy-revision assertion

Findings from the **second real-project adoption** of a `0.2` control — the post-deploy
**live-revision assertion** (`standards/06` §2), the candidate raised by 001 finding #6.
**Desensitized** — no project names, identifiers, paths, revisions, or production details; only
generalizable lessons.

**Context (generic):** the same `web-app + internal-ui + persistent-data + multi-tenant +
protected-output` shape as 001. The control was **vendored** (copied verbatim from a pinned
upstream commit) into the project and wired into its deploy pipeline.

## What worked
- **Closed the most-repeated gap.** 001 finding #6 (and every dry-run) flagged that pipelines
  *write* a revision marker but never *read it back and assert* `live == intended release SHA`.
  Running the assertion **after** the readiness wait and **before** the user-facing promotion
  did exactly that: a real production deploy reported a clean full-SHA match, and the last
  verification step no longer fell to a human.
- **Fail-closed held.** Exact full-SHA, no prefix, confirmed-mismatch-is-fatal — a mismatch (or
  transport/parse error) **stops the deploy before promotion**. Proven with a deliberately wrong
  SHA in a **test harness** (exit non-zero), *not* by breaking production.
- **Asserted against the live service, not the build.** The control read the *running* service's
  reported revision on the target host (not a local/built artifact) — so it proves the
  **deployment**, not the build.

## Friction → framework lessons
1. **Vendoring a control needs a documented, repeatable pattern.** Copying a control verbatim
   has two failure modes: (a) the copy silently **drifts** when someone edits it, and (b) the
   project's **auto-formatter** reformats it and breaks byte-equivalence — the formatter-vs-gate
   trap from 001 finding #1, now biting a *vendored control*. The adoption defused both: a
   **provenance header** (upstream repo + commit + path + sha256), an **in-repo integrity test**
   that strips the header and asserts size + sha256 against the pinned upstream, and adding the
   vendored file to the **formatter-ignore** list. → Ship a **"vendoring a control" checklist**
   so every adoption does this the same way.
2. **"Adopt verbatim from a pinned commit," never "pull latest."** Fetching a control from a
   moving branch during a production deploy makes the deploy non-reproducible. Pin the exact
   upstream commit; the integrity test is what makes the pin *enforceable*.
3. **A control's I/O boundary is part of its contract.** This control stays transport-agnostic
   (reads an HTTP field / header / plain body / local marker); the *pipeline* supplies the
   transport (e.g. runs it on the host). Keeping host/SSH/secret logic **out** of the control is
   what let it be vendored cleanly and tested in-process.

## Implications for 0.2
- Promote the live-revision assertion from **candidate** (001 #6) to a **shipped control with a
  vendoring checklist** (provenance header + integrity test + formatter-ignore). That checklist
  generalizes to **any** vendored control.
- Reinforces 001 finding #1: the **formatter-vs-gate scope** trap recurs for vendored files — the
  ignore-list step belongs in the checklist (`checklists/pr-review.md`).
