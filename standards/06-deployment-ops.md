# 06 — Deployment & operations

🚧 Outline. To be written. Intended scope:

- **CI/CD from the trunk** — merge to trunk triggers build + deploy; no manual artifact
  copying. **Verify the live version equals the trunk** via a deploy-revision marker
  (`.deploy-revision` / health endpoint reporting the commit).
- **Runbooks** — staging, production, and **rollback** written down; migration order
  defined; a known recovery path.
- **Persistent-path discipline** — runtime data/uploads live outside the deployed app dir;
  never commit `storage/`, `uploads/`, `*.db`, `.env`, generated media. Keep a never-commit
  list.
- **Backups** — automated, **atomic & crash-safe** (temp + non-empty check + atomic move),
  retention policy, **off-site copy**, and a **restore that is actually tested** (restore +
  business-integrity counts), ideally on a schedule.
- **Health & observability** — liveness/health checks; alerting on the things that matter;
  log rotation/limits; access logs where useful.
- **Secrets & infra** — secrets in a manager, never in the repo; pin Actions to SHAs
  (`standards/07`).
- **Pre-migration backup hook** — snapshot before a schema migration runs.
