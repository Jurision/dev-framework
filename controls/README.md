# controls/

The framework's own automated checks — it runs these on itself in `framework-ci`
(`standards/00` §6: rules must be checkable).

- **`check.mjs`** — documentation consistency: `standards/NN` references exist, relative links
  resolve, no leaked fill-in placeholders. Minimal by design (see its header for what it does
  *not* verify).
- **`workflow-policy.mjs`** — zero-dependency GitHub Actions **workflow-policy lint**
  (`standards/04` hardening + `standards/07` SHA-pinning). Scans `.github/workflows/` +
  `templates/workflows/`; rules **WF001–WF008** (full-SHA `uses:`, least-privilege
  `permissions:`, per-job `timeout-minutes`, validation-cancels vs deploy-serialized
  `concurrency`, privileged-trigger isolation, cache/artifact review, scan-all-workflows).
  `--json` for machine output; exits non-zero on any FAIL. Optional
  `controls/workflow-policy.config.json` (`classify` / `shaExceptions` / `ignore`). Fixtures +
  test: `workflow-policy.test.mjs`.

> `workflow-policy.mjs` is a **limited structural scanner**, not a full YAML engine. It
> reports anything it cannot parse (**WF009 WARN**) rather than passing it silently, and leans
> on the companion tools below for deeper syntax/security analysis.

## Recommended companion tools (optional — not bundled, not required)

The wrapper above enforces the framework's deterministic rules. For deeper analysis it does
**not** attempt, adopters may add:

- **[actionlint](https://github.com/rhysd/actionlint)** — Actions syntax + static semantics.
- **[zizmor](https://github.com/woodruffw/zizmor)** — Actions security (template injection,
  credential leaks, over-broad permissions): `zizmor .github/workflows/`.

They **complement** `workflow-policy.mjs`; they don't replace it.
