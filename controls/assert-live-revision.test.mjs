// controls/assert-live-revision.test.mjs — local HTTP server + file fixtures for issue #35.
// Calls run() in-process (in-process loopback works where a spawned subprocess can't reach it).
import http from 'node:http'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { run } from './assert-live-revision.mjs'

const SHA = '0123456789abcdef0123456789abcdef01234567'
const OTHER = 'ffffffffffffffffffffffffffffffffffffffff'

let flaky = 0
const server = http.createServer((req, res) => {
  const json = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)) }
  switch (req.url) {
    case '/json': return json(200, { version: SHA, build: { revision: SHA } })
    case '/text': res.writeHead(200); return res.end(`${SHA}\n`)
    case '/header': res.writeHead(200, { 'x-revision': SHA }); return res.end('')
    case '/mismatch': return json(200, { version: OTHER })
    case '/malformed': res.writeHead(200, { 'content-type': 'application/json' }); return res.end('not json{')
    case '/missing-field': return json(200, { foo: 'bar' })
    case '/short': return json(200, { version: SHA.slice(0, 12) })
    case '/flaky': flaky++; if (flaky < 2) { res.writeHead(503); return res.end('later') } return json(200, { version: SHA })
    case '/auth':
      if (req.headers.authorization === 'secret-token-value') return json(200, { version: SHA })
      res.writeHead(401); return res.end('no')
    default: res.writeHead(404); return res.end('nope')
  }
})

let failed = 0
const check = (label, cond) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`); if (!cond) failed++ }

await new Promise(r => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}`
const dir = mkdtempSync(join(tmpdir(), 'live-rev-'))
const marker = join(dir, 'rev'); writeFileSync(marker, `${SHA}\n`)
const c = async (opts) => (await run(opts)).code

try {
  // matches → 0
  check('json field match', await c({ expected: SHA, url: `${base}/json`, jsonPath: 'version' }) === 0)
  check('nested json path', await c({ expected: SHA, url: `${base}/json`, jsonPath: 'build.revision' }) === 0)
  check('response header', await c({ expected: SHA, url: `${base}/header`, header: 'x-revision' }) === 0)
  check('plain-text body', await c({ expected: SHA, url: `${base}/text` }) === 0)
  check('file marker', await c({ expected: SHA, file: marker }) === 0)

  // mismatch → 1
  check('mismatch → 1', await c({ expected: SHA, url: `${base}/mismatch`, jsonPath: 'version' }) === 1)

  // fail-closed → 2
  check('missing field → 2', await c({ expected: SHA, url: `${base}/missing-field`, jsonPath: 'version' }) === 2)
  check('malformed json → 2', await c({ expected: SHA, url: `${base}/malformed`, jsonPath: 'version' }) === 2)
  check('missing file → 2', await c({ expected: SHA, file: join(dir, 'nope') }) === 2)
  check('no source → 2', await c({ expected: SHA }) === 2)
  check('no expected → 2', await c({ file: marker }) === 2)

  // retry transport then match; retry never hides a confirmed mismatch
  flaky = 0
  check('retry 503→match → 0', await c({ expected: SHA, url: `${base}/flaky`, jsonPath: 'version', retries: 3, retryDelayMs: 5 }) === 0)
  check('retry does not hide mismatch → 1', await c({ expected: SHA, url: `${base}/mismatch`, jsonPath: 'version', retries: 5, retryDelayMs: 2 }) === 1)

  // short prefix: blocked by default, allowed with WARN
  check('short prefix blocked by default → 1', await c({ expected: SHA, url: `${base}/short`, jsonPath: 'version' }) === 1)
  const pfx = await run({ expected: SHA, url: `${base}/short`, jsonPath: 'version', allowPrefix: true, minPrefix: 7 })
  check('short prefix allowed → 0 + WARN', pfx.code === 0 && /prefix/i.test(pfx.warn || ''))

  // auth header from env, value never in the result
  process.env.TEST_TOKEN = 'secret-token-value'
  const auth = await run({ expected: SHA, url: `${base}/auth`, jsonPath: 'version', authHeaders: ['Authorization=TEST_TOKEN'] })
  check('auth header from env → 0', auth.code === 0)
  check('secret value not in output', !JSON.stringify(auth).includes('secret-token-value'))
} finally {
  server.close()
}

console.log(`\nassert-live-revision fixtures: ${failed === 0 ? 'all passed' : failed + ' FAILED'}`)
process.exit(failed ? 1 : 0)
