# 04 — CI/CD quality gates

CI is where written rules become **enforced** rules (`standards/00` §6). Every PR runs **its
applicable gate inventory**; **all required gates must pass before merge.** Score CI on **two
independent axes** — what it checks (**coverage**) and whether the pipeline itself is safe
(**hardening**) — plus a per-gate **enforcement** state. A project can be strong on one axis
and weak on the other; don't collapse them into one "has CI" verdict. Copyable, hardened
workflows live in `templates/workflows/` (`ci-node.yml.template`, `ci-generic.yml.template`).

## Axis 1 — Gate coverage *(does every applicable risk have automated evidence?)*

Not "run these five commands". Each project maintains a small **risk → evidence** inventory;
a risk is `Applies` or `N/A`, and **`N/A` needs a written reason — not a silently deleted
command.**

| Risk | Automated evidence | Applies? | Enforcement |
|---|---|---|---|
| Artifact won't build / render | build, typecheck, docs render | Applies / N/A | Required |
| Static-quality decay | lint, format check, **file-size tripwire** (`01` §3) | Applies / N/A | Required |
| Business-logic regression | unit / integration | Applies / N/A | Required |
| Critical journey breaks | smoke / E2E ("200 ≠ healthy", `05` §3) | Applies / N/A | Required |
| Profile-specific risk | data-quality, model eval, cross-tenant negative test, protected-output regression, … | **set by the manifest** | Required |

> **Coverage MUST:** *every applicable risk has automated evidence; every release-blocking
> risk is represented by a **required** gate.* Profile-required gates (`profiles/`) plug into
> this row by the same rule — a `multi-tenant` repo's cross-tenant test or a `runtime-ai`
> repo's eval gate is part of *its* inventory, not an optional extra.

Keep **one local composite command** (e.g. `check`) so local == CI; CI **may run the gates in
parallel jobs** — the composite is for humans, not a serialization requirement.

## Axis 2 — Workflow hardening *(is the pipeline that runs the gates itself safe?)*

A CI/CD workflow is privileged code — harden it *(MUST)*:

- **Pin third-party Actions to a full commit SHA**, version in a trailing comment
  (`standards/07` §1.7). A floating `@v4` tag is mutable supply chain.
- **Least privilege** — `permissions:` set to the minimum (default `contents: read`; grant
  more only on the job that needs it).
- **Per-job `timeout-minutes`** — a hung step can't run forever.
- **Pin the toolchain + lockfile** (language version, `--frozen-lockfile`); cache with a
  trust boundary.
- **Secrets** stay out of untrusted code paths; use the platform store; least-scope tokens;
  never echoed (`standards/07`).
- **Isolate untrusted input from privileged workflows** — fork-PR / `pull_request_target` and
  any privileged deploy job are separated; untrusted PR code never runs with deploy secrets.
- **Cache/artifact trust boundary** — scoped keys, retention, and integrity; don't trust a
  cache or artifact a fork could poison.
- **Concurrency is a MUST to *consider*, not a fixed setting:**
  - **Validation CI** *should* **cancel superseded runs** (`cancel-in-progress: true`) — save
    minutes.
  - **Deploy / migration workflows MUST serialize and usually must NOT
    `cancel-in-progress`** — cancelling mid-deploy/mid-migration can corrupt state. Use a
    concurrency group that **queues**, not cancels.

## Axis 3 is not a score — it's the **enforcement** state *(mark per gate)*

Each gate is `Required` or `Advisory`. Both are legitimate: build/lint/core-tests are
`Required`; an experimental audit you're still stabilizing may be `Advisory` for now. **CI is
only "enforced" when *all applicable release-blocking gates* are platform-`required` status
checks** (`standards/03` §4). A green-but-advisory workflow that can't block a merge is *not*
a gate — say so honestly rather than implying a block you don't have.

## Dependency hygiene *(SHOULD)*

Automated updates with a **risk-classed** merge policy (`standards/01` §7): auto-merge only
low-risk groups with strong CI; review majors deliberately as their own task, never inside a
feature PR.

## Deploy gate *(MUST for deployed apps)*

- Deploy **from the trunk** via CI; **never hand-copy artifacts**.
- After deploy, **assert the live revision equals the immutable release SHA built by that
  deployment run** — not "latest trunk" (trunk can advance mid-deploy). This is the
  `standards/06` §2 lockstep; read it back, don't just stamp it.
- Promotion to production goes through CI + the human gate for high-risk changes
  (`standards/07` §2; `human-in-the-loop` for AI-initiated actions).

## Keep it fast and honest

A gate that is slow, flaky, or routinely skipped is worse than none — it trains people to
bypass. Keep CI fast; quarantine flaky tests; and never weaken Axis 1 by deleting a command
or Axis 3 by quietly dropping a gate from `Required`.
