# Checklist: Definition of Done

Pointers, not restatements. Owning standards: `standards/00` §2–3, `standards/08` §5,
`standards/11` §6. "Merged" / "claimed" is **not** done.

## Evidence matches the change type (`00` §2)
- [ ] **Behavior/code** — automated test; a bug fix has a **fail-before / pass-after** test.
- [ ] **UI** — a11y + a **rendered-output** review artifact (`02`; `internal-ui`/`public-ui`).
- [ ] **Config** — schema-validated / dry-run shown.
- [ ] **Data/migration** — verified recovery point + restore path (`10`, `persistent-data`).
- [ ] **Docs** — links resolve, renders, examples valid.
- [ ] **Hotfix** — exception noted + follow-up test + review deadline.

## Git-verifiable & real (`08` §5, `00` §3)
- [ ] Every "I did X" = a **pushed commit citable by hash** (not a chat/PR comment).
- [ ] Verified **observable in the running system** where applicable ("200 ≠ healthy", `05`).
- [ ] No net complexity increase without justification; branch deleted / issue closed.

## Two-role acceptance (`11` §6)
- [ ] **Product acceptance** — meets the feature spec, in plain language.
- [ ] **Technical verification** — diff / tests / security / runtime **independently** reviewed
      (if single-author, say so — it's self-review, not an independent gate; `03` §4).
