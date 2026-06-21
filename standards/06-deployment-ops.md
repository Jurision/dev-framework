# 06 — Deployment & operations

Getting code to production and keeping it healthy. The recurring failure here is **state**:
the code deploys fine, but data, config, or the live revision drift from what you think is
running. Rule strength graded **MUST / SHOULD / MAY**.

## 1. Deploy from the trunk, through CI *(MUST)*

- Production is built and released **from the trunk by the pipeline** — never hand-copied,
  never built on a developer laptop, never `scp`'d from a feature branch (`standards/04` §5).
- One promotion path. If there's a manual step, it's a scripted, reviewable one, not tribal
  knowledge.

## 2. Deploy-revision lockstep — verify, don't trust *(MUST)*

"The deploy job went green" is not "the new code is live" (`standards/00` §3, §4).

- The running app **exposes its build revision** (commit SHA) on a `/version` or health
  endpoint, and/or a `.deploy-revision` marker.
- **After every deploy, assert `live == the release SHA this pipeline built`** — not "latest
  trunk" (trunk may have advanced while the deploy ran, which would falsely flag a correct
  release as behind). The chain: intended release SHA → artifact attested with that SHA →
  deploy that artifact → live revision must equal that SHA. Automate it; a deploy that
  doesn't end in a confirmed match is not done.
- Surface the revision in logs/UI footer so anyone debugging knows exactly what's running.

## 3. State lives outside the deploy artifact *(MUST)*

The most expensive outage is the one that **destroys data on deploy**.

- **Persistent state** (databases, uploads, generated files, secrets) lives on **persistent
  paths / volumes** that a redeploy never overwrites — not inside the build/release
  directory that gets replaced.
- Maintain an explicit **never-commit list** (`.env`, keys, `storage/`, `uploads/`, `*.db`,
  generated media) *and* a **never-deploy-over list** (paths the release process must not
  touch). Both are part of the repo's contract (`standards/07`, `AGENTS.md`).
- Releases are **immutable and side-by-side** where possible (new dir / new image), with an
  atomic switch (symlink/router) — so rollback is a switch back, not a rebuild.

## 4. Backups — atomic, off-site, and retained *(MUST)*

- **Atomic & crash-safe** (dump/snapshot to a temp file, non-empty check, atomic move) — a
  half-written backup restores to corruption.
- **Scheduled** and **monitored**: a silent backup failure is the default way backups die.
  Alert when a backup is missed.
- **Establish and verify a risk-appropriate recovery point before every schema migration**
  (snapshot / PITR bookmark / transactional rollback point / equivalent), so a bad migration has
  an immediate recovery point (`standards/10`).
- At least one copy in a **separate failure domain** (different host/region/account) — a
  backup on the box that dies with the box is not a backup.
- Documented **retention** (e.g. daily/weekly/monthly) and, for regulated data, encryption
  and access controls (`standards/07`).

## 5. Restore drills — a backup you've never restored is a hope *(MUST)*

- **Periodically restore** to a scratch environment and verify the data is usable —
  including **business-integrity checks** (row/record counts, key invariants), not just
  "the restore command exited 0" — on a schedule, not only during an incident.
- Know and track your **RPO** (max acceptable data loss) and **RTO** (max acceptable
  downtime); the drill measures whether you actually meet them.

## 6. Rollback is a first-class path *(MUST)*

- **Every deploy is revertible.** Keep the last *N* releases ready; rollback is one
  command / one click, and the path itself is tested (not theoretical).
- Decide **rollback vs forward-fix** explicitly during an incident — defaulting to a panicked
  forward-fix on a broken prod is how small outages become long ones.
- A migration's rollback story is part of shipping it (`standards/10`): expand/contract so a
  rollback of code doesn't strand the schema.

## 7. Health & alerting — on symptoms users feel *(MUST)*

- **Distinguish three checks — don't collapse them into one probe:**
  - **Liveness** — is the process alive? Keep it **light and dependency-free**; a liveness
    probe that calls the DB triggers restart storms when a dependency merely blips.
  - **Readiness** — can this instance take traffic *right now*? May check critical
    dependencies; when they're down it **pulls the instance from the pool** (it does not
    restart it).
  - **Synthetic journey monitoring** — periodically exercise the real user path **from
    outside** the system (`standards/05` — "200 ≠ healthy"). Journey checks belong here, not
    in the container/load-balancer health probe.
- **Alert on user-visible symptoms** (error rate, latency, saturation, failed
  logins/exports) — each alert has an **owner** and a **runbook**, and is actionable (no
  alerts nobody acts on; they train people to ignore the pager).
- Keep enough **observability** (structured logs with the revision, key metrics, traces for
  hot paths; log rotation/limits) to answer "what changed?" fast — but **no secrets/PII in
  logs** (`standards/07`).

## 8. Runbooks *(SHOULD)*

Write down — and keep current — the procedures for **deploy, rollback, restore, and the top
incidents**. On-call should follow a runbook, not reverse-engineer the system at 3 a.m. A
runbook that's never been followed is a draft; validate it during drills.

## 9. Config & secrets per environment *(MUST)*

- Environment-specific config is **injected** (env vars / config store), not baked into the
  artifact — the same build promotes across environments.
- Secrets come from a **secret store**, scoped least-privilege, rotated; **never in the repo,
  the image, or logs** (`standards/07`). Production and non-production data/credentials stay
  separated.
