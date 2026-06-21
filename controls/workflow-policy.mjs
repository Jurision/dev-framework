#!/usr/bin/env node
// controls/workflow-policy.mjs — zero-dependency GitHub Actions workflow-policy lint.
// dev-framework standards/04 (CI hardening) + 07 (SHA-pinned Actions). Implements issue #32
// (WF001–WF008). Companion tools (optional, not bundled): actionlint, zizmor.
//
// This is a LIMITED structural scanner, not a full YAML parser: where it cannot reliably
// determine a fact it WARNs (WF009) rather than passing silently.
//
// Usage: node controls/workflow-policy.mjs [--json] [path ...]
//   Default scan: .github/workflows + templates/workflows. Exit 1 if any FAIL.
//   Optional config: controls/workflow-policy.config.json (or $WORKFLOW_POLICY_CONFIG)
//     { "classify": { "<rel/path>": "deploy|validation|other" },
//       "shaExceptions": ["owner/repo"], "ignore": ["<rel/path>"] }

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const argv = process.argv.slice(2)
const JSON_OUT = argv.includes('--json')
const explicitPaths = argv.filter(a => !a.startsWith('--'))

// --- config (fail-closed on a malformed file) --------------------------------
const CONFIG = (() => {
  const p = process.env.WORKFLOW_POLICY_CONFIG || join(ROOT, 'controls', 'workflow-policy.config.json')
  if (!existsSync(p)) return {}
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch (e) {
    process.stderr.write(`workflow-policy: config ${p} is not valid JSON (${e.message}); refusing to run.\n`)
    process.exit(2)
  }
})()
const classifyOverride = CONFIG.classify || {}
const shaExceptions = new Set(CONFIG.shaExceptions || [])
const ignore = new Set(CONFIG.ignore || [])

const SHA40 = /^[0-9a-f]{40}$/i
const findings = []
const add = (rule, severity, file, line, message, fix) =>
  findings.push({ rule, severity, file, line, message, fix: fix || '' })

// --- discover ---------------------------------------------------------------
function walk(dir, out) {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
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

// --- minimal indentation-aware scan (comments stripped) ----------------------
function scan(text) {
  const rows = []
  text.split(/\r?\n/).forEach((raw, i) => {
    const trimmed = raw.trim()
    if (!trimmed || trimmed.startsWith('#')) return // skip blanks + full-line comments
    const noComment = raw.replace(/\s+#.*$/, '') // strip trailing comment, keep value (e.g. '# v4')
    if (!noComment.trim()) return
    const indent = raw.length - raw.replace(/^\s*/, '').length
    rows.push({ n: i + 1, indent, raw, t: noComment.trim() })
  })
  return rows
}

// inline value after a key: "key: value" -> "value" (or '')
const inlineVal = t => {
  const m = t.match(/^[^:]+:\s*(.*)$/)
  return m ? m[1].trim() : ''
}

// --- triggers: scalar / flow-array / block-map / block-seq -------------------
function parseTriggers(rows) {
  const trigs = new Set()
  const onIdx = rows.findIndex(r => r.indent === 0 && /^on:/.test(r.t))
  if (onIdx === -1) return trigs
  const on = rows[onIdx]
  const v = inlineVal(on.t)
  if (v) {
    if (v.startsWith('[')) v.replace(/[[\]]/g, '').split(',').forEach(s => s.trim() && trigs.add(s.trim()))
    else trigs.add(v.replace(/['"]/g, '').trim())
    return trigs
  }
  // block form: collect children until indent returns to 0
  for (let j = onIdx + 1; j < rows.length && rows[j].indent > on.indent; j++) {
    const r = rows[j]
    // direct children only (block map keys or block seq items)
    if (r.indent === rows[onIdx + 1].indent) {
      if (r.t.startsWith('- ')) trigs.add(r.t.slice(2).replace(/['"]/g, '').trim())
      else { const k = r.t.match(/^([A-Za-z_]+):/); if (k) trigs.add(k[1]) }
    }
  }
  return trigs
}

// --- jobs: job-direct-child awareness ---------------------------------------
function parseJobs(rows) {
  const jobs = []
  const jobsIdx = rows.findIndex(r => r.indent === 0 && /^jobs:/.test(r.t))
  if (jobsIdx === -1) return jobs
  let jobIndent = -1
  for (let j = jobsIdx + 1; j < rows.length; j++) {
    const r = rows[j]
    if (r.indent === 0) break // left jobs:
    if (jobIndent === -1) jobIndent = r.indent
    if (r.indent === jobIndent && /^[A-Za-z0-9_-]+:\s*$/.test(r.t)) {
      jobs.push({ name: r.t.replace(/:\s*$/, ''), line: r.n, indent: r.indent,
        childIndent: -1, hasTimeout: false, hasPermissions: false, hasConcurrency: false })
    } else if (jobs.length) {
      const job = jobs[jobs.length - 1]
      if (job.childIndent === -1 && r.indent > job.indent) job.childIndent = r.indent
      if (r.indent === job.childIndent) {
        if (/^timeout-minutes:/.test(r.t)) job.hasTimeout = true
        if (/^permissions:/.test(r.t)) job.hasPermissions = true
        if (/^concurrency:/.test(r.t)) job.hasConcurrency = true
      }
    }
  }
  return jobs
}

function classify(rel, rows, trigs) {
  if (classifyOverride[rel]) return classifyOverride[rel]
  const text = rows.map(r => r.t).join('\n')
  const privilegedSignal =
    /\b(deploy|release|promote|migrat|ssh|scp|rsync|systemctl|secrets\.)/i.test(text)
  const priv = trigs.has('pull_request_target') || trigs.has('workflow_run')
  if (priv || ((trigs.has('push') || trigs.has('schedule')) && privilegedSignal)) return 'deploy'
  if (trigs.has('pull_request') || trigs.has('merge_group') || trigs.has('workflow_call')) return 'validation'
  if (trigs.size === 0) return 'unknown'
  return 'other'
}

function actionRef(t) {
  const m = t.match(/uses:\s*([^\s#]+)/)
  return m ? m[1] : null
}

function lintFile(file) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  if (ignore.has(rel)) return
  const isTemplate = file.endsWith('.template')
  const rows = scan(readFileSync(file, 'utf8'))
  const trigs = parseTriggers(rows)
  const jobs = parseJobs(rows)
  const klass = classify(rel, rows, trigs)
  const text = rows.map(r => r.t).join('\n')

  // top-level signals
  let topPermissions = false, topPermBroad = false, hasConcurrency = false, cancel = null
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    if (r.indent === 0 && /^permissions:/.test(r.t)) {
      topPermissions = true
      const v = inlineVal(r.t)
      if (/write-all/.test(v) || /:\s*write\b/.test(v)) topPermBroad = true
      for (let j = i + 1; j < rows.length && rows[j].indent > 0; j++)
        if (/write-all/.test(rows[j].t) || /:\s*write\b/.test(rows[j].t)) topPermBroad = true
    }
    if (r.indent === 0 && /^concurrency:/.test(r.t)) hasConcurrency = true
  }
  if (jobs.some(j => j.hasConcurrency)) hasConcurrency = true
  const cm = text.match(/cancel-in-progress:\s*(true|false)/)
  if (cm) cancel = cm[1] === 'true'

  // WF008 — classification reported, never silently misclassified
  if (klass === 'unknown')
    add('WF008', 'WARN', rel, 1, 'Could not classify this workflow (no recognizable triggers).',
      'Add an entry to workflow-policy.config.json "classify", or check the on: block.')

  // WF001 — external uses pinned to a full SHA
  for (const r of rows) {
    if (!/(^|-\s*)uses:/.test(r.t)) continue
    const ref = actionRef(r.t)
    if (!ref || !ref.includes('@')) continue
    const name = ref.slice(0, ref.lastIndexOf('@'))
    const at = ref.slice(ref.lastIndexOf('@') + 1)
    const isLocal = name.startsWith('./') || name.startsWith('.\\')
    const owner = name.split('/').slice(0, 2).join('/')
    if (!isLocal && !shaExceptions.has(owner) && !SHA40.test(at))
      add('WF001', 'FAIL', rel, r.n,
        `Action '${name}' is pinned to a mutable ref '@${at}', not a full commit SHA.`,
        'Pin to a 40-char commit SHA with the version in a trailing comment (standards/07 §1.7).')
  }

  // WF002 — least-privilege permissions (top-level OR every job)
  const allJobsHavePerms = jobs.length > 0 && jobs.every(j => j.hasPermissions)
  if (!topPermissions && !allJobsHavePerms)
    add('WF002', isTemplate ? 'WARN' : 'FAIL', rel, 1,
      'No explicit permissions: at workflow or job level (defaults to a broad token).',
      'Add `permissions: { contents: read }` at the top, or explicit permissions on every job.')
  else if (topPermBroad)
    add('WF002', 'WARN', rel, 1, 'Top-level permissions: grants a write scope.',
      'Prefer read-only at the top; grant write only on the job that needs it.')

  // WF003 — job-level timeout-minutes (not step-level)
  for (const j of jobs)
    if (!j.hasTimeout)
      add('WF003', 'FAIL', rel, j.line,
        `Job '${j.name}' has no job-level timeout-minutes (step-level does not count).`,
        'Add `timeout-minutes:` directly under the job.')

  // WF004 / WF005 — concurrency by class
  if (klass === 'validation') {
    if (!hasConcurrency)
      add('WF004', 'WARN', rel, 1, 'Validation workflow has no concurrency (won’t cancel superseded runs).',
        'Add a concurrency group with cancel-in-progress: true.')
    else if (cancel === false)
      add('WF004', 'WARN', rel, 1, 'Validation workflow sets cancel-in-progress: false.',
        'Validation CI should cancel superseded runs (cancel-in-progress: true).')
  }
  if (klass === 'deploy') {
    if (!hasConcurrency)
      add('WF005', 'FAIL', rel, 1, 'Deploy/migration workflow has no concurrency — releases are not serialized.',
        'Add a concurrency group with cancel-in-progress: false.')
    else if (cancel === true)
      add('WF005', 'FAIL', rel, 1, 'Deploy/migration workflow uses cancel-in-progress: true — can cancel an in-flight release.',
        'Set cancel-in-progress: false so deploys queue, never cancel mid-release.')
  }

  // WF006 — privileged trigger + handling of untrusted content (dangerous combination)
  const privileged = trigs.has('pull_request_target') || trigs.has('workflow_run')
  if (privileged) {
    const untrusted =
      /github\.event\.pull_request\.head|head_ref|head\.sha|actions\/download-artifact|github\.event\.workflow_run/.test(text) ||
      /ref:\s*\$\{\{\s*github\.event/.test(text)
    if (untrusted)
      add('WF006', 'FAIL', rel, 1,
        'Privileged trigger (pull_request_target/workflow_run) handles untrusted PR/run content (checkout head, event ref, or downloaded artifact).',
        'Do not check out or execute the untrusted ref/artifact in the privileged context; split trusted and untrusted steps.')
    else
      add('WF006', 'WARN', rel, 1,
        'Privileged trigger (pull_request_target/workflow_run) — verify it never checks out or executes untrusted PR/run content.',
        'Confirm no untrusted ref/artifact runs with this workflow’s token/secrets.')
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
for (const f of files) {
  try { lintFile(f) }
  catch (e) { add('WF009', 'WARN', relative(ROOT, f).replace(/\\/g, '/'), 1,
    `could not fully parse this workflow (${e.message}); review manually.`,
    'The scanner is a limited structural parser; verify by hand or with actionlint.') }
}

findings.sort((a, b) =>
  a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule) ||
  a.message.localeCompare(b.message))

const fails = findings.filter(f => f.severity === 'FAIL').length
const warns = findings.filter(f => f.severity === 'WARN').length

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ scanned: files.length, fails, warns, findings }, null, 2) + '\n')
} else {
  for (const f of findings)
    console.log(`${f.severity}  ${f.rule}  ${f.file}:${f.line}  ${f.message}\n        ↳ ${f.fix}`)
  console.log(`\nworkflow-policy: ${files.length} workflow(s) scanned — ${fails} FAIL, ${warns} WARN`)
}
process.exit(fails > 0 ? 1 : 0)
