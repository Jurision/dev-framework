# Modifier: multi-tenant

**Status: provisional** · **Evidence maturity: one real-project dry-run.**

One deployment serves **multiple isolated tenants** (workspaces / orgs / customers). This is
a **security boundary** (`standards/07`), so it is reviewed as one. Delta over `standards/10`
§5 (tenancy): this modifier turns that conditional section **on** and raises it past the
schema into the query layer and the test suite.

## Applies to / does NOT apply to

- **Applies:** SaaS / workspace products where one DB/instance holds many tenants' data.
- **Does not apply:** single-tenant products (one site / one customer) — then `standards/10`
  §5 simply doesn't fire.

## Rules raised to MUST

1. **Every business entity carries a tenant/workspace key** and is isolated by it.
2. **Per-tenant uniqueness + index** — composite `@@unique([tenantId, id])` / equivalent; an
   entity's natural keys are unique *within* a tenant, not globally.
3. **Query-layer default scoping.** Every read/write is tenant-scoped **by default** at the
   repository/service layer. **A schema key is not enough** — a query that resolves by bare
   `id` without the tenant scope is a **data-leak bug** (the dry-run had scoped reads but this
   must be the invariant, not a habit).
4. **A cross-tenant negative test is MUST and in required CI** — assert that tenant A
   **cannot** read or write tenant B's data, and that it **fails closed**. (The dry-run
   implemented scoping but had **no** such test — exactly the missing proof this raises.)
5. **The boundary is enforced in code/data, not only at the proxy** (`standards/07` identity
   trust root): the tenant identity comes from a trusted source and is applied server-side.

## Rules that may relax

- None. This is a security boundary; nothing here relaxes.

## Required controls

- A **cross-tenant negative test** in required CI (the blocking proof of isolation).
- Recommended: a **lint/check that flags un-scoped tenant queries** (a candidate control —
  see the synthesis backlog).

## Acceptance evidence

- Schema shows the tenant key + per-tenant uniqueness on every business entity; repository
  queries are tenant-scoped; **a cross-tenant negative test is green in required CI**;
  retrofitting cost was avoided by deciding this early.

## Non-goals (owned elsewhere)

- Backups / restore / retention of that data → **`persistent-data`**.
- General identity trust root, least privilege, secrets → **`standards/07`**.
- Migration mechanics → **`standards/10`** §1–4.

> Provisional: one multi-tenant dry-run. The **cross-tenant negative test** is the single most
> important control here and was the one thing that real project was missing — keep it MUST.
