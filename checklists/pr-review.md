# Checklist: PR review

Pointers to the owning standards. A reviewer answers each yes/no before approving.

## Scope & architecture (`01`, `03`)
- [ ] **One concern**, small, reversible; targets the trunk via PR (no direct push).
- [ ] No file over its size tripwire without a justified, lowered-only exemption (`01` §3).
- [ ] No casual change to the foundation (stack/schema/auth) — if touched, it went through the
      front door (impact + ADR + migration), `11` §1/§4.

## Gates green & enforced (`04`)
- [ ] All **required** gates pass (build/lint/format/tests + profile-required gates); none
      disabled to go green. Advisory ≠ required.

## Security (`07`)
- [ ] No secret in code/logs; least privilege; input validated; internal≠external preserved;
      Actions SHA-pinned if the workflow changed.

## Done & evidence (`08` §5, `11` §6, see `definition-of-done.md`)
- [ ] Claims are git-verifiable; evidence matches the change type; product **and** technical
      acceptance recorded (or self-review noted).

## Docs in the same PR (`09`)
- [ ] Behavior change updates its docs; a significant/irreversible decision has an ADR.
