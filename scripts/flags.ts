import cp from 'node:child_process'
import util from 'node:util'

let bin = './node_modules/.bin/esbuild'
if (process.platform === 'win32') bin = bin.replace(/\//g, '\\') + '.cmd'
const { stdout } = await util.promisify(cp.execFile)(bin, ['--help'], { encoding: 'utf8' })

const flags: Record<string, string[]> = Object.create(null)
let current: string[] | null = null
for (const line of stdout.split('\n')) {
  if (line.startsWith('  --')) {
    const flag = line.slice(2, line.indexOf(' ', 2))
    const comment_start = line.slice(flag.length + 3).match(/\S/)?.index
    if (!comment_start) {
      throw new Error('Failed to parse: ' + line)
    }
    const comment = line.slice(comment_start + flag.length + 3).trimEnd()
    current = flags[flag] = [comment]
  } else if (current && line.startsWith('   ')) {
    current.push(line.trim())
  } else {
    current = null
  }
}

// remove flags that are not supported in repl
const unsupported = new Set([
  'serve',
  'watch',
  'analyze', // should we have this?
  'certfile',
  'keyfile',
  'preserve-symlinks',
  'servedir',
  'version',
])
for (const flag in flags) {
  if (unsupported.has(flag.match(/^--([-\w]+)/)?.[1] as string)) {
    delete flags[flag]
  }
}

console.log('const FLAGS = [')
for (const flag in flags) {
  const comment = flags[flag].join(' ')
  console.log(`  ['${flag}', '${comment.replace(/'/g, "\\'")}'],`)
}
console.log(']')
