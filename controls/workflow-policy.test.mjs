// controls/workflow-policy.test.mjs — fixtures for the workflow-policy lint (issue #32).
// Runs the linter (--json) on each fixture and asserts the set of rule IDs it reports.
import { spawnSync } from 'node:child_process'

const LINT = 'controls/workflow-policy.mjs'
const FX = 'controls/fixtures/workflow-policy'

function rulesFor(relPath, env = {}) {
  const r = spawnSync('node', [LINT, '--json', `${FX}/${relPath}`], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
  if (!r.stdout) throw new Error(`no output for ${relPath}: ${r.stderr}`)
  const out = JSON.parse(r.stdout)
  return [...new Set(out.findings.map(f => f.rule))].sort()
}

const eq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i])
let failed = 0
function expect(label, got, want) {
  const ok = eq(got, want)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  want [${want}] got [${got}]`)
  if (!ok) failed++
}

// One scenario per #32's fixture list.
expect('good-validation', rulesFor('good-validation.yml'), [])
expect('good-deploy (serialized)', rulesFor('good-deploy.yml'), [])
expect('good-local-action', rulesFor('good-local-action.yml'), [])
expect('floating tag + no permissions + no timeout', rulesFor('bad-floating-missing.yml'), [
  'WF001',
  'WF002',
  'WF003',
])
expect('deploy with cancel-in-progress: true', rulesFor('bad-deploy-cancel.yml'), ['WF005'])
expect('privileged pull_request_target', rulesFor('bad-privileged.yml'), ['WF006'])

// configured exception: a floating tag for an allow-listed owner.
expect('exception owner (no config)', rulesFor('exceptions/wf.yml'), ['WF001'])
expect('exception owner (with config)', rulesFor('exceptions/wf.yml', {
  WORKFLOW_POLICY_CONFIG: `${FX}/exceptions/config.json`,
}), [])

console.log(`\nworkflow-policy fixtures: ${failed === 0 ? 'all passed' : failed + ' FAILED'}`)
process.exit(failed ? 1 : 0)
