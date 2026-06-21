# Phase report — adoption checklists

Filled from `templates/PHASE_REPORT.md.template` (standards/11 §6). The implementer's report
is **input** to acceptance, not acceptance itself.

## Reported by
Claude (implementer / agent).

## Record
- **Plan revision:** `delivery/checklists.implementation-plan.md` (Phase 1).
- **PR / commit range:** this PR (`framework/dogfood-checklists`) — git-verifiable on merge.
- **Changed files:** `checklists/{definition-of-done,pr-review,visual-review,
  new-project-bootstrap}.md`; `delivery/` (this package); `standards/11` §2 (a finding fix);
  `README` structure; `CHANGELOG`.

## Evidence
- **CI:** `node controls/check.mjs` green (links resolve, no leaked placeholders).
- **Manual:** each checklist is **one screen**, **delta/pointer** (cites the owning standard,
  doesn't restate it); `pr-review` links to `definition-of-done` instead of duplicating the
  DoD (one fact, one owner).
- **Runtime proof:** n/a (docs only).
- **Known risks:** none material (docs; revertible).

## Deviations (against the plan)
- **Omitted:** none.
- **Added outside scope:** one **finding-driven** edit to `standards/11` §2 (see Findings) —
  in scope as "fix before tag" per the dogfood mandate, recorded here rather than smuggled.
- **Open issues:** none.

## Decisions
- **Product acceptance:** Accepted — four checklists exist, delta-only, one screen, links
  resolve (meets the feature spec's acceptance). **By:** project owner (pending your sign-off).
- **Technical verification:** **Self-review only** — single-author repo, no independent
  reviewer; `controls/check.mjs` is the sole automated gate. Recorded honestly as a limitation
  (`03` §4), **not** claimed as an independent technical gate. **By:** implementer (self).

## Findings — did the templates help? *(the point of the dogfood)*
1. **Reduced ambiguity: yes.** The feature spec's **non-goals + acceptance** forced "delta-only,
   don't restate the standards" up front — which directly shaped the checklists into pointers.
   Without the spec I'd likely have restated standards.
2. **Duplicate facts: caught, not shipped.** The real risk (checklists copying standards) was
   prevented by the spec rule + `09` generate-don't-duplicate; `pr-review` links to
   `definition-of-done` rather than re-listing the DoD.
3. **Useless paperwork: a real smell, now fixed.** The full package (brief→spec→plan→report,
   ~2 screens) to produce four one-screen checklists is **heavier than the work**. → Fixed by
   adding `11` §2 "**scale the package to risk and size**" (low-risk small work may collapse
   the package; full set is for substantial/high-risk phases). The dry-run earned its keep by
   surfacing this.
4. **Two-role acceptance is honest about its limit.** A single-author repo cannot satisfy
   independent technical review; the framework already says so (`03` §4) and the
   `definition-of-done` checklist makes you state it — confirmed, not hidden.

## Verdict
Standard 11 **validated**: the templates cut ambiguity and prevented duplication; the one
genuine flaw (package-too-heavy for small work) was found and fixed in this PR. Ready to roll
`[Unreleased] → [0.1.0-alpha]` and tag after merge.
