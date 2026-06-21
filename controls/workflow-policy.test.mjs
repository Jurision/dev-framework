// controls/workflow-policy.test.mjs — fixtures for the workflow-policy lint (issue #32).
// Asserts the rule set, exit code, and (for key cases) severity + line — not just rule IDs.
import { spawnSync } from 'node:child_process'

const LINT = 'controls/workflow-policy.mjs'
const FX = 'controls/fixtures/workflow-policy'

function run(rel, env = {}) {
  const r = spawnSync('node', [LINT, '--json', `${FX}/${rel}`], { encoding: 'utf8', env: { ...process.env, ...env } })
  if (!r.stdout) return { status: r.status, findings: [], rules: [] }
  const out = JSON.parse(r.stdout)
  return { status: r.status, findings: out.findings, rules: [...new Set(out.findings.map(f => f.rule))].sort() }
}

let failed = 0
const eq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i])
function check(label, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`)
  if (!cond) failed++
}
function expectCase(rel, { rules, status }, env) {
  const res = run(rel, env)
  check(`${rel} rules [${rules}] exit ${status}`, eq(res.rules, rules) && res.status === status)
  return res
}

// good fixtures: no findings, exit 0 (incl. job-level permissions accepted by WF002)
for (const f of ['good-validation.yml', 'good-deploy.yml', 'good-local-action.yml', 'job-permissions.yml'])
  expectCase(f, { rules: [], status: 0 })

// bad fixtures
expectCase('bad-floating-missing.yml', { rules: ['WF001', 'WF002', 'WF003', 'WF004'], status: 1 })
expectCase('bad-deploy-cancel.yml', { rules: ['WF005'], status: 1 })
expectCase('step-timeout-only.yml', { rules: ['WF003'], status: 1 }) // step timeout ≠ job timeout
expectCase('deploy-scalar-trigger.yml', { rules: ['WF005'], status: 1 }) // `on: push` scalar classified deploy

// WF006 — dangerous combination FAILs; a safe privileged trigger WARNs (exit 0)
const danger = expectCase('bad-privileged.yml', { rules: ['WF006'], status: 1 })
check('bad-privileged WF006 severity FAIL', danger.findings.find(f => f.rule === 'WF006')?.severity === 'FAIL')
const safe = expectCase('safe-pr-target.yml', { rules: ['WF006'], status: 0 })
check('safe-pr-target WF006 severity WARN', safe.findings.find(f => f.rule === 'WF006')?.severity === 'WARN')

// WF001 reports the correct line + severity
const wf001 = run('bad-floating-missing.yml').findings.find(f => f.rule === 'WF001')
check('WF001 FAIL at line 8', wf001?.severity === 'FAIL' && wf001?.line === 8)

// configured exception suppresses WF001
expectCase('exceptions/wf.yml', { rules: ['WF001'], status: 1 })
expectCase('exceptions/wf.yml', { rules: [], status: 0 }, { WORKFLOW_POLICY_CONFIG: `${FX}/exceptions/config.json` })

// malformed config fails closed (exit 2), never silently empty
const broken = spawnSync('node', [LINT, '--json', `${FX}/good-validation.yml`],
  { encoding: 'utf8', env: { ...process.env, WORKFLOW_POLICY_CONFIG: `${FX}/exceptions/wf.yml` } })
check('malformed config fails closed (exit 2)', broken.status === 2)

console.log(`\nworkflow-policy fixtures: ${failed === 0 ? 'all passed' : failed + ' FAILED'}`)
process.exit(failed ? 1 : 0)
