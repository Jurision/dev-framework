# 04 — CI/CD quality gates

CI is where written rules become **enforced** rules (`standards/00` §6). Every PR runs the
gate stack; nothing merges red. A copyable, hardened workflow lives in
`templates/workflows/ci.yml.template`.

## 1. The gate stack *(MUST — every PR, all green to merge)*

Run, in order (fail fast):

1. **Typecheck / build** — the code compiles.
2. **Lint** — including the **file-size tripwire** (`standards/01` §3). Lint errors fail;
   never delete a gate to go green.
3. **Format check** — formatting is verified, not just available (`format:check`, not
   `format`).
4. **Unit tests** — fast, on pure logic.
5. **Smoke / e2e** — the critical journeys (`standards/05`). "200 ≠ healthy" lives here.

Expose **one composite command** (e.g. `check`) that runs the lot, so local and CI run the
same thing.

## 2. Required checks & branch protection *(MUST once the plan/visibility allows)*

The gates only bite if the platform requires them: make the CI check a **required status
check** and require a PR to merge (`standards/03` §4). Without that, CI is advisory.

## 3. Workflow hygiene *(MUST)*

A CI workflow is privileged code — harden it:

- **Pin third-party Actions to a commit SHA**, with the version in a trailing comment
  (`standards/07` §1.7). A floating `@v4` tag is mutable supply chain.
- **Least privilege** — set `permissions:` to the minimum (default `contents: read`; grant
  more only per job that needs it). Don't run with the default broad token.
- **Concurrency** — cancel superseded runs (`concurrency: { group: …, cancel-in-progress:
  true }`) to save minutes and avoid races.
- **Timeouts** — every job sets `timeout-minutes` so a hung step can't run forever.
- **Pin the toolchain** (Node/Python/etc. version) and cache dependencies; a slow gate gets
  bypassed.
- **Secrets** — never echo a secret; use the platform secret store; least-scope tokens
  (`standards/07`).

## 4. Dependency hygiene *(SHOULD)*

Automated updates with a **risk-classed** merge policy (`standards/01` §7): auto-merge only
low-risk groups with strong CI; review majors deliberately as their own task, never inside
a feature PR.

## 5. Deploy gate *(MUST for deployed apps)*

- Deploy **from the trunk** via CI; **never hand-copy artifacts**.
- After deploy, **verify the live version equals the trunk** (a deploy-revision marker /
  health endpoint reporting the commit). Details in `standards/06`.
- Promotion to production goes through CI + the human gate for high-risk changes
  (`standards/07` §2).

## 6. Keep it fast and honest

A gate that is slow, flaky, or routinely skipped is worse than none — it trains people to
bypass. Keep CI under a few minutes where possible; quarantine flaky tests; if a gate is
advisory (not yet enforceable), say so rather than implying a block you don't have.
