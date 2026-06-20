# 02 — UI design system

UI quality is not taste-by-argument; it's a **defined target + tokens + hard rules +
a visual review gate**. "Looks done" is not "works" (`standards/00` §5) and not "on-brand".
Graded **MUST / SHOULD / MAY**.

## 1. A named design target *(SHOULD)*

Write the target as **adjective pairs** — what to pull *toward* and *away from*: clean vs.
crowded, premium vs. discount, calm vs. busy, confident vs. timid. Every visual change must
move **toward** the target; "I changed it" is not "it's better". The pairs make review
objective instead of a matter of opinion.

## 2. Tokens, not magic values *(MUST)*

- **Color, typography, spacing, radius, elevation, motion** are defined **once** as tokens
  and referenced everywhere. No ad-hoc `#hex` or `17px` in a component.
- Tokens are the single source of truth (`standards/00` §7); theming/dark-mode/rebrand becomes
  a token change, not a find-and-replace across components.
- Components compose tokens; they don't invent values. A new value means a new (justified)
  token, reviewed.

## 3. Hard visual rules *(MUST — checkable, not vibes)*

- **No fake or dead controls** — no `href="#"`, no button that does nothing, no link to a
  page that doesn't exist (ties to the journey audit, `standards/05` §3).
- **No invented external URLs / brands / logos.** Only real, verified destinations.
- **Restraint over decoration** — every element earns its place; remove useless micro-labels
  and ornamental noise.
- **Text behaves** — wraps/clamps/truncates cleanly at every width; nothing overflows,
  overlaps, or gets cut. No layout that breaks on the longest realistic string.
- **Consistent states** — hover/focus/active/disabled/loading/empty/error are all designed,
  not just the happy path.

## 4. Accessibility = WCAG 2.2 AA *(MUST — a release criterion)*

Not "a11y" hand-waving — specific, checkable: **contrast** ratios, visible **focus** order,
full **keyboard** operability, **target sizes**, **reduced-motion** honored, meaningful
labels/alt. Treat AA as a gate the same as tests (`standards/07` anchors the version).

## 5. The visual review gate *(MUST for user-facing changes)*

- **Required reading before a UI task** (the design target + tokens + protected zones), and
  a **visual review checklist** (`checklists/`).
- A visual change **stops at a screenshot / preview and gets approval _before_ push** — the
  reviewer sees the rendered result, not just the diff. Catch drift before it ships, not in
  prod.

## 6. Protected design zones *(MUST)*

Finalized documents, brand surfaces, or pixel-locked artifacts are **moved verbatim, never
restyled** during refactors (`standards/01` §6). When relocating such a renderer, change its
location, not its output; verify the before/after render is identical.
