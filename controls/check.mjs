// Framework self-checks. The standards say "rules must be checkable" — so this repo
// checks itself in CI. Extend with more controls over time.
//
// Verifies:
//   1. every reference to a `standards/NN-*.md` doc points to a file that exists
//   2. every relative Markdown link resolves to a real file
//   3. no `<FILL` placeholders leak outside template files
//
// Run: node controls/check.mjs   (exits non-zero on any failure)

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'

const ROOT = process.cwd()
const failures = []

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

const docs = walk(ROOT).filter(f => f.endsWith('.md') || f.endsWith('.template'))

for (const file of docs) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const text = readFileSync(file, 'utf8')

  for (const m of text.matchAll(/standards\/\d\d-[a-z0-9-]+\.md/g)) {
    if (!existsSync(join(ROOT, m[0]))) failures.push(`${rel}: missing referenced ${m[0]}`)
  }

  for (const m of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = m[1].trim().split('#')[0]
    if (!target || /^(https?:|mailto:)/.test(target)) continue
    if (!existsSync(resolve(dirname(file), target))) {
      failures.push(`${rel}: broken link -> ${m[1]}`)
    }
  }

  if (!rel.startsWith('templates/') && !rel.endsWith('.template') && /<FILL/.test(text)) {
    failures.push(`${rel}: <FILL placeholder outside a template`)
  }
}

if (failures.length) {
  console.error('FAIL — framework checks:\n' + failures.map(f => '  - ' + f).join('\n'))
  process.exit(1)
}
console.log(`OK — framework checks passed (${docs.length} docs).`)
