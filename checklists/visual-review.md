# Checklist: Visual review (user-facing change)

Owning standard: `standards/02`; activated/scoped by `internal-ui` / `public-ui`. Do this on
the **rendered output**, **before merge/release** (`02` §5) — not from the diff alone.

## Tokens & states (`02`, `internal-ui`)
- [ ] Uses design **tokens**, no ad-hoc hex/px.
- [ ] All states designed: loading / empty / error / disabled / focus.
- [ ] Real controls only — no dead/fake control, no link to a 404/`href="#"`.
- [ ] Text wraps/clamps cleanly at every width; longest realistic string doesn't break layout.

## Accessibility = WCAG 2.2 AA (`02` §4)
- [ ] Contrast, visible focus order, full keyboard operability, target sizes, reduced-motion.

## Audience (pick what applies)
- [ ] **internal-ui:** operator density designed; a11y/state still hold (no "internal" waiver).
- [ ] **public-ui:** indexable → sitemap/canonical; content↔render parity if a separate source;
      no brand/SEO leak of internal data.
- [ ] **protected-output:** locked output stays identical on its **declared dimensions**;
      internal fields excluded from external output (asserted by test).

## Gate
- [ ] A **rendered artifact** (screenshot / preview / visual-regression) is attached and
      reviewed before merge — not promised, attached.
