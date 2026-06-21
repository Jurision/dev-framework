#!/usr/bin/env node
// controls/assert-live-revision.mjs — assert the live system serves the intended release SHA.
// dev-framework standards/06 §2 (deploy-revision lockstep). Zero runtime dependencies.
// Implements issue #35. Out of scope (v1): SSH, rollback, cloud adapters, GitHub API.
//
// One actual-revision source (pick exactly one):
//   --url <u> --json-path <p>   read a JSON field (dotted path, e.g. build.revision)
//   --url <u> --header <name>   read a response header
//   --url <u>                   read the trimmed plain-text body
//   --file <path>               read a local marker file
// Expected: --expected <sha> or $LIVE_REVISION_EXPECTED (the SHA THIS deploy built).
// Auth (never echoed): --auth-header "Name=ENV_VAR" (value read from process.env[ENV_VAR]).
// Matching: exact full SHA by default; --allow-prefix [--min-prefix N] permits a prefix (WARN).
// Reliability: --timeout-ms, --retries, --retry-delay-ms (retry transport only, never a mismatch).
// Exit: 0 match · 1 confirmed mismatch · 2 config/transport/parse/missing-source.
//
// The core (parseArgs / compare / run) is exported so it can be tested in-process.

import { readFileSync } from 'node:fs'
import http from 'node:http'
import https from 'node:https'

const DEFAULTS = { authHeaders: [], retries: 0, retryDelayMs: 500, timeoutMs: 5000, minPrefix: 7 }

export function parseArgs(argv) {
  const o = { ...DEFAULTS, authHeaders: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => argv[++i]
    switch (a) {
      case '--expected': o.expected = next(); break
      case '--url': o.url = next(); break
      case '--json-path': o.jsonPath = next(); break
      case '--header': o.header = next(); break
      case '--file': o.file = next(); break
      case '--auth-header': o.authHeaders.push(next()); break
      case '--allow-prefix': o.allowPrefix = true; break
      case '--min-prefix': o.minPrefix = Number(next()); break
      case '--timeout-ms': o.timeoutMs = Number(next()); break
      case '--retries': o.retries = Number(next()); break
      case '--retry-delay-ms': o.retryDelayMs = Number(next()); break
      case '--json': break
      default: if (a.startsWith('--')) o.__bad = a
    }
  }
  return o
}

const sleep = ms => new Promise(r => setTimeout(r, ms))
class TransportError extends Error {}

function authHeaderMap(specs) {
  const headers = {}
  for (const s of specs) {
    const m = s.match(/^([^=]+)=(.+)$/)
    if (!m) throw new Error(`invalid --auth-header '${s}' (expected Name=ENV_VAR)`)
    const value = process.env[m[2]]
    if (value == null) throw new Error(`--auth-header ${m[1]} references unset env var ${m[2]}`)
    headers[m[1].trim()] = value // value is never put into output
  }
  return headers
}

function request(url, headers, timeoutMs) {
  return new Promise((resolve, reject) => {
    let lib
    try { lib = new URL(url).protocol === 'http:' ? http : https } catch { return reject(new Error('invalid --url')) }
    const req = lib.get(url, { headers }, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8')
        if (res.statusCode >= 500 || res.statusCode === 429) return reject(new TransportError(`HTTP ${res.statusCode}`))
        if (res.statusCode >= 300) return reject(new Error(`HTTP ${res.statusCode}`)) // non-retryable
        resolve({ status: res.statusCode, headers: res.headers, body })
      })
    })
    req.on('error', e => reject(new TransportError(e.message)))
    req.setTimeout(timeoutMs, () => req.destroy(new TransportError(`timeout after ${timeoutMs}ms`)))
  })
}

const pick = (obj, dotted) => dotted.split('.').reduce((v, k) => (v == null ? v : v[k]), obj)

async function observe(o, authHeaders) {
  if (o.file != null) {
    let txt
    try { txt = readFileSync(o.file, 'utf8') } catch (e) { throw new Error(`cannot read file: ${e.code || e.message}`) }
    return txt.trim()
  }
  const res = await request(o.url, authHeaders, o.timeoutMs)
  if (o.jsonPath) {
    let data
    try { data = JSON.parse(res.body) } catch { throw new Error('response body is not valid JSON') }
    const v = pick(data, o.jsonPath)
    if (v == null) throw new Error(`JSON path '${o.jsonPath}' not found`)
    return String(v).trim()
  }
  if (o.header) {
    const v = res.headers[o.header.toLowerCase()]
    if (v == null) throw new Error(`response header '${o.header}' not present`)
    return String(v).trim()
  }
  return res.body.trim()
}

export function compare(expected, observed, o) {
  if (observed === expected) return { result: 'match' }
  if (o.allowPrefix) {
    const [short, long] = expected.length <= observed.length ? [expected, observed] : [observed, expected]
    if (short.length >= (o.minPrefix ?? 7) && long.startsWith(short))
      return { result: 'match', warn: `matched by ${short.length}-char prefix; prefixes weaken identity (use full SHA)` }
  }
  return { result: 'mismatch' }
}

// Returns a structured result (no printing, no process.exit) so it is testable in-process.
export async function run(input) {
  const o = { ...DEFAULTS, ...input }
  if (o.__bad) return { code: 2, result: 'error', message: `unknown option ${o.__bad}` }
  o.expected = (o.expected ?? process.env.LIVE_REVISION_EXPECTED ?? '').trim()
  const err = (message, extra = {}) => ({ code: 2, result: 'error', message, ...extra })
  if (!o.expected) return err('no --expected (or $LIVE_REVISION_EXPECTED) given')
  if ([o.file != null, o.url != null].filter(Boolean).length !== 1)
    return err('select exactly one source: --url … or --file …')
  const source = o.file != null ? `file:${o.file}`
    : o.jsonPath ? `url:${o.url} (json:${o.jsonPath})`
    : o.header ? `url:${o.url} (header:${o.header})`
    : `url:${o.url} (text)`
  let authHeaders
  try { authHeaders = authHeaderMap(o.authHeaders) } catch (e) { return err(e.message, { source }) }

  for (let attempt = 1; ; attempt++) {
    try {
      const observed = await observe(o, authHeaders)
      if (!observed) throw new Error('observed revision is empty')
      const cmp = compare(o.expected, observed, o)
      const base = { source, expected: o.expected, observed, attempts: attempt, warn: cmp.warn }
      return cmp.result === 'match'
        ? { code: 0, result: 'match', ...base }
        : { code: 1, result: 'mismatch', message: 'live revision does not equal the intended release SHA', ...base }
    } catch (e) {
      if (e instanceof TransportError && attempt <= o.retries) { await sleep(o.retryDelayMs); continue }
      return { code: 2, result: 'error', source, expected: o.expected, observed: null, attempts: attempt,
        message: `${e instanceof TransportError ? 'transport' : 'parse/source'} failure: ${e.message}` }
    }
  }
}

// --- CLI entry (only when invoked directly, not when imported) ----------------
function emit(r, jsonOut) {
  if (jsonOut) { process.stdout.write(JSON.stringify(r, null, 2) + '\n'); return }
  if (r.warn) console.log(`WARN  ${r.warn}`)
  console.log(`live-revision: ${r.result.toUpperCase()}`)
  console.log(`  source:   ${r.source ?? '(none)'}`)
  console.log(`  expected: ${r.expected ?? '(unset)'}`)
  console.log(`  observed: ${r.observed ?? '(none)'}`)
  if (r.attempts != null) console.log(`  attempts: ${r.attempts}`)
  if (r.message) console.log(`  detail:   ${r.message}`)
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('controls/assert-live-revision.mjs')) {
  const jsonOut = process.argv.includes('--json')
  run(parseArgs(process.argv.slice(2))).then(r => { emit(r, jsonOut); process.exit(r.code) })
}
