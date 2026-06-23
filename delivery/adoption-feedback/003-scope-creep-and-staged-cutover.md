# Adoption feedback 003 — scope creep on a high-risk cutover

A cautionary case from real delivery (same adoption window as 002). **Desensitized** — no
project names, identifiers, or production details; only generalizable lessons. Validates
`standards/11` (specification & delivery) and `standards/06` (deployment-ops), and surfaces a
**build-vs-buy** principle the framework currently states only implicitly.

**Context (generic):** a single-user tool, gated by a **shared reverse-proxy login**, needed to
admit a few **invited** additional users, each with an **isolated workspace**. The request
*read* as "add a login"; the real need was **productization** (multi-user / multi-tenant).

## What happened
Framed as "let users sign in," the work expanded — in roughly two days and ~ten PRs — into a
from-scratch **auth system** (email OTP, sessions, rate-limit), **multi-tenant** workspace
isolation, a **cloud-sync** layer, a **durable client-side outbox**, a **reverse-proxy cutover**
from the old gateway to the new auth, and a **production data-migration**. Two things went wrong
beyond the time/compute cost:
- The from-scratch auth migration **mis-promoted a business *seed* contact record into a login
  identity** — a real, if contained, security defect (later fixed with a corrective migration +
  regression test).
- The cutover was **wired to run on every trunk deploy**, where it failed its own post-reload
  route check and **auto-rolled-back on each run** — turning *every unrelated deploy red* and
  masking real failures — until it was **gated behind a manual dispatch**.

## Lessons (generalizable)
0. **Classify the need before designing: "login" vs "productization."** "Users can sign in" and
   "multiple isolated tenants" look identical at the request but differ by an order of magnitude.
   Decide which you are funding *first*. (`standards/11` — brief/foundation before code.)
1. **Buy commodity infrastructure; build only the differentiated business logic.** Identity (OTP,
   sessions, email delivery, rate-limit, abuse/bot defense) is **commodity** — evaluate a managed
   provider before writing it. **Data ownership, tenant isolation, and offline/sync conflict
   policy are differentiated** — you build those regardless. A bought identity layer removes the
   auth-plumbing cost but **not** the isolation/sync work. (Candidate explicit principle for
   `standards/00`.)
2. **A high-risk cutover must be gated + staged + rollback-able + canaried — never coupled to
   every trunk deploy.** Trial-in-production on each merge churns the live system, masks
   unrelated failures, and inverts `standards/06`. Gate behind manual dispatch / a flag; prove
   with a **dry-run against a config backup**; flip once; keep a verified rollback.
3. **Scope to risk and phase it.** Don't land interlocking infrastructure (auth + tenancy + sync
   + outbox + cutover + migration) in one burst. A saner order: identity + isolation → data
   ownership → staging verification → **gated** cutover → small canary → admin/ops.
   (`standards/11` — scale-to-risk + phased execution.)
4. **Seed / sample business data must never become an auth identity.** A migration that backfills
   identities must not alias a business contact or sample record into a login. Add a regression
   test proving seed/sample records cannot become login aliases. (`standards/10` data-and-migrations
   + `standards/07` security-invariants.)

## What worked (be fair)
Once gated, the **rollback was real and verified** — production stayed healthy throughout. The
eventual fix shape — **gate → dry-run → flip once** — is correct; it simply should have been the
*starting* shape, not the recovery.

## Implications for 0.2
- **Candidate principle (`standards/00`): build-vs-buy** — "commodity infrastructure: adopt/buy;
  differentiated business logic: build." The most leverage-y lesson here.
- **Candidate control / checklist:** a **cutover-safety** checklist for `standards/06` (manual
  gate + dry-run-against-backup + verified rollback + canary); a **seed-is-not-identity**
  regression expectation for `standards/10`.
- Reinforces `standards/11` scale-to-risk and adds a **"classify the need"** gate ahead of
  foundation design.
