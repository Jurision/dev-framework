<!-- Copy to .github/PULL_REQUEST_TEMPLATE.md in your project. -->

## What & why

<!-- One paragraph. Link the tracked issue. -->

## Acceptance criteria

<!-- What "done" means for this change, written before/with the work. -->
- [ ]

## Evidence (by change type — see standards/00 §2)

<!-- Pick the row that applies; delete the rest. -->
- [ ] Behavior code: test added/updated (bug fix has a fail-before/pass-after regression test); verified observable
- [ ] UI: interaction + accessibility + responsive checked; screenshot attached
- [ ] Config/infra: schema valid + dry-run + deploy verified
- [ ] Data migration: forward migration + backup/restore + compatibility checked
- [ ] Docs: links resolve + renders + examples valid
- [ ] Hotfix: exception — follow-up test + post-incident review by **<date>**

## Checklist

- [ ] One concern, small and reversible; targets the trunk
- [ ] No unexplained complexity increase; security invariants preserved
- [ ] Applicable standards followed; any deviation is documented (ADR or note below)
- [ ] Docs/AGENTS.md/README updated **in this PR** if a convention changed
- [ ] Claims are git-verifiable (pushed commits, not intent)

## Deviations / exceptions

<!-- Rule not followed + why. An undocumented deviation is the bug. -->
