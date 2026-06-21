#!/usr/bin/env node
// controls/workflow-policy.mjs — zero-dependency GitHub Actions workflow-policy lint.
// dev-framework standards/04 (CI hardening) + 07 (SHA-pinned Actions). Implements issue #32
// (WF001–WF008). Companion tools (optional, not bundled): actionlint, zizmor.
//
// Usage: node controls/workflow-policy.mjs [--json] [path ...]
//   Default scan: .github/workflows + templates/workflows. Exit 1 if any FAIL.
//   Optional config: controls/workflow-policy.config.json
//     { "classify": { "<rel/path>": "deploy|validation|other" },
//       "shaExceptions": ["owner/repo"], "ignore": ["<rel/path>"] }

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const argv = process.argv.slice(2)
const JSON_OUT = argv.includes('--json')
const explicitPaths = argv.filter(a => !a.startsWith('--'))

const CONFIG = (() => {
  const p = process.env.WORKFLOW_POLICY_CONFIG || join(ROOT, 'controls', 'workflow-policy.config.json')
  try { return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {} } catch { return {} }
})()
const classifyOverride = CONFIG.classify || {}
const shaExceptions = new Set(CONFIG.shaExceptions || [])
const ignore = new Set(CONFIG.ignore || [])

const SHA40 = /^[0-9a-f]{40}$/i
const findings = []
const add = (rule, severity, file, line, message, fix) =>
  findings.push({ rule, severity, file, line, message, fix })

// --- discover workflow files -------------------------------------------------
function walk(dir, out) {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (/\.ya?ml(\.template)?$/.test(name)) out.push(full)
  }
}
function targets() {
  if (explicitPaths.length) return explicitPaths.map(p => join(ROOT, p))
  const out = []
  walk(join(ROOT, '.github', 'workflows'), out)
  walk(join(ROOT, 'templates', 'workflows'), out)
  return out
}

// --- minimal indentation-aware scan ------------------------------------------
// Not a full YAML parser: a workflow-policy lint only needs structural signals
// (top-level keys, jobs, steps, uses/permissions/timeout/concurrency/on) + line numbers.
function scan(text) {
  const lines = text.split(/\r?\n/)
  const rows = []
  lines.forEach((raw, i) => {
    const trimmed = raw.trim()
    if (!trimmed || trimmed.startsWith('#')) return // skip blank lines + full-line comments
    const noComment = raw.replace(/\s+#.*$/, '') // strip trailing comment, keep value (e.g. before '# v4')
    if (!noComment.trim()) return
    const indent = raw.length - raw.replace(/^\s*/, '').length
    rows.push({ n: i + 1, indent, raw, t: noComment.trim() })
  })
  return rows
}

function classify(rel, rows) {
  if (classifyOverride[rel]) return classifyOverride[rel]
  const text = rows.map(r => r.t).join('\n').toLowerCase()
  const onPush = /(^|\n)on:[\s\S]*?push:/.test(text) || /\bpush:/.test(text)
  const privilegedSignal =
    /(deploy|release|promote|migrat|ssh|scp|rsync|systemctl|\.env|secrets\.)/i.test(text) ||
    /pull_request_target/.test(text)
  const pr = /pull_request\b/.test(text) && !/pull_request_target/.test(text)
  if (/pull_request_target/.test(text) || (onPush && privilegedSignal)) return 'deploy'
  if (pr || /\bworkflow_call\b/.test(text)) return 'validation'
  if (onPush) return 'other' // push-only without privileged signal — unclassified-ish
  return 'unknown'
}

function actionRef(t) {
  // "- uses: owner/repo@ref" or "uses: owner/repo/sub@ref # vN"
  const m = t.match(/uses:\s*([^\s#]+)/)
  return m ? m[1] : null
}

function lintFile(file) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  if (ignore.has(rel)) return
  const isTemplate = file.endsWith('.template')
  const text = readFileSync(file, 'utf8')
  const rows = scan(text)
  const klass = classify(rel, rows)

  // WF008: every workflow is scanned (implicit — we are here). Report unknown class.
  if (klass === 'unknown')
    add('WF008', 'WARN', rel, 1, 'Could not classify this workflow (triggers/signals unclear).',
      'Add an entry to controls/workflow-policy.config.json "classify".')

  // top-level structure
  let hasTopPermissions = false
  let topPermissionsBroad = false
  let hasConcurrency = false
  let cancelInProgress = null // true | false | null

  // jobs
  const jobs = [] // { name, line, indent, hasTimeout }
  let inJobs = false
  let jobsIndent = -1
  let cur = null

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const t = r.t

    if (r.indent === 0 && /^permissions:/.test(t)) {
      hasTopPermissions = true
      if (/write-all|:\s*write\b/.test(t)) topPermissionsBroad = true
      // block form: look ahead for write scopes
      for (let j = i + 1; j < rows.length && rows[j].indent > 0; j++) {
        if (/:\s*write\b/.test(rows[j].t) || /write-all/.test(rows[j].t)) topPermissionsBroad = true
      }
    }
    if (r.indent === 0 && /^concurrency:/.test(t)) hasConcurrency = true
    if (/cancel-in-progress:\s*(true|false)/.test(t))
      cancelInProgress = /cancel-in-progress:\s*true/.test(t)

    if (r.indent === 0 && /^jobs:/.test(t)) { inJobs = true; jobsIndent = 0; continue }
    if (inJobs) {
      if (r.indent === 0 && !/^jobs:/.test(t)) inJobs = false
      else if (cur === null || r.indent <= cur.indent) {
        // a job header is the shallowest key under jobs:
        if (cur === null) cur = { indent: r.indent }
        if (r.indent === cur.indent && /^[A-Za-z0-9_-]+:\s*$/.test(t)) {
          cur = { name: t.replace(/:\s*$/, ''), line: r.n, indent: r.indent, hasTimeout: false }
          jobs.push(cur)
        }
      }
      if (cur && r.indent > cur.indent && /^timeout-minutes:/.test(t)) cur.hasTimeout = true
    }

    // WF001 — external uses pinned to full SHA
    if (/(^|-)\s*uses:|^\s*uses:/.test(r.raw) || /^uses:|^- uses:|uses:/.test(t)) {
      const ref = actionRef(t)
      if (ref && ref.includes('@')) {
        const [name, at] = [ref.slice(0, ref.lastIndexOf('@')), ref.slice(ref.lastIndexOf('@') + 1)]
        const isLocal = name.startsWith('./') || name.startsWith('.\\')
        const owner = name.split('/').slice(0, 2).join('/')
        if (!isLocal && !shaExceptions.has(owner) && !SHA40.test(at)) {
          add('WF001', 'FAIL', rel, r.n,
            `Action '${name}' is pinned to a mutable ref '@${at}', not a full commit SHA.`,
            `Pin to a 40-char commit SHA with the version in a trailing comment (standards/07 §1.7).`)
        }
      }
    }
  }

  // WF002 — explicit least-privilege permissions
  if (!hasTopPermissions)
    add('WF002', isTemplate ? 'WARN' : 'FAIL', rel, 1,
      'No explicit top-level permissions: (defaults to a broad token).',
      'Add `permissions: { contents: read }` and widen only per-job where needed.')
  else if (topPermissionsBroad)
    add('WF002', 'WARN', rel, 1, 'permissions: grants a write scope at workflow level.',
      'Prefer read-only at top level; grant write on the specific job that needs it.')

  // WF003 — every job has timeout-minutes
  for (const j of jobs)
    if (!j.hasTimeout)
      add('WF003', 'FAIL', rel, j.line, `Job '${j.name}' has no timeout-minutes.`,
        'Add `timeout-minutes:` so a hung job cannot run forever.')

  // WF004 / WF005 — concurrency by class
  if (klass === 'validation') {
    if (hasConcurrency && cancelInProgress === false)
      add('WF004', 'WARN', rel, 1,
        'Validation workflow sets cancel-in-progress: false (won’t cancel superseded runs).',
        'Validation CI should cancel superseded runs (cancel-in-progress: true).')
  }
  if (klass === 'deploy') {
    if (!hasConcurrency)
      add('WF005', 'FAIL', rel, 1,
        'Deploy/migration workflow has no concurrency group — releases are not serialized.',
        'Add a concurrency group with cancel-in-progress: false.')
    else if (cancelInProgress === true)
      add('WF005', 'FAIL', rel, 1,
        'Deploy/migration workflow uses cancel-in-progress: true — can cancel an in-flight release.',
        'Set cancel-in-progress: false so deploys queue, never cancel mid-release.')

    // WF006 — privileged workflow + untrusted trigger
    const lower = rows.map(r => r.t).join('\n')
    if (/pull_request_target/.test(lower))
      add('WF006', 'FAIL', rel, 1,
        'Privileged workflow is triggered by pull_request_target (untrusted PR code + secrets).',
        'Avoid pull_request_target with checkout of the PR head, or isolate the privileged step.')
  }

  // WF007 — cache/artifact trust boundary (advisory)
  for (const r of rows)
    if (/uses:\s*actions\/(cache|upload-artifact|download-artifact)@/.test(r.t)) {
      add('WF007', 'WARN', rel, r.n, 'Cache/artifact use — review trust boundary + retention.',
        'Scope cache keys; do not trust a cache/artifact a fork could poison.')
      break
    }
}

// --- run ---------------------------------------------------------------------
const files = targets()
for (const f of files) { try { lintFile(f) } catch (e) { add('WF000', 'FAIL', relative(ROOT, f), 1, `lint error: ${e.message}`) } }

findings.sort((a, b) =>
  a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule))

const fails = findings.filter(f => f.severity === 'FAIL').length
const warns = findings.filter(f => f.severity === 'WARN').length

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ scanned: files.length, fails, warns, findings }, null, 2) + '\n')
} else {
  for (const f of findings)
    console.log(`${f.severity}  ${f.rule}  ${f.file}:${f.line}  ${f.message}\n        ↳ ${f.fix || ''}`)
  console.log(`\nworkflow-policy: ${files.length} workflow(s) scanned — ${fails} FAIL, ${warns} WARN`)
}
process.exit(fails > 0 ? 1 : 0)
