import { is_client } from 'svelte/internal'
import { derived, get, writable, type Readable } from 'svelte/store'
import { emitter } from './global'
import { load_query } from './behaviors/query'
import { fetch_versions } from './helpers/versions'
import { Mode, parseOptions, prettyPrintErrorAsStderr } from './helpers/options'
import { sendIPC, type IPCResponse } from './ipc'

export const theme = writable<'light' | 'dark'>('dark')
// @ts-expect-error 'matchMedia' may not exist
if (is_client && window.matchMedia) {
  const query = matchMedia('(prefers-color-scheme: dark)')
  const update = () => theme.set(query.matches ? 'dark' : 'light')
  query.addEventListener('change', update)
  update()
  theme.subscribe((value) => {
    document.documentElement.dataset.theme = value
  })
}

export const initial_query = load_query()

export const version = writable(initial_query.version || 'latest')

export const versions = writable<string[]>([])
if (is_client) {
  fetch_versions('esbuild-wasm').then(
    ($versions) => {
      const index_of_0_5_1 = $versions.indexOf('0.5.1')
      if (index_of_0_5_1 >= 0) {
        $versions = $versions.slice(0, index_of_0_5_1 + 1)
      }
      versions.set($versions)
      if (get(version) === 'latest') {
        version.set($versions[0])
      }
    },
    () => {
      status.set('Failed to fetch versions.')
    },
  )
}

export const mode = writable<'transform' | 'build'>(initial_query.b ? 'build' : 'transform')
export const input = writable(initial_query.t || 'let a = 1')
export const files = writable(initial_query.b || [])
export const options = writable(initial_query.o || '')

export const output: Readable<IPCResponse> = derived(
  [mode, input, files, options],
  ([$mode, $input, $files, $options], set) => {
    try {
      if ($mode === 'transform') {
        sendIPC({
          command_: 'transform',
          input_: $input,
          options_: parseOptions($options, Mode.Transform),
        }).then(set, () => {
          // Swallow errors (e.g. "task aborted" or "failed to create worker")
        })
      }

      if ($mode === 'build') {
        const o = parseOptions($options, Mode.Build)
        const entryPoints = Array.isArray(o.entryPoints) ? o.entryPoints : (o.entryPoints = [])
        const input: Record<string, string> = Object.create(null)
        const duplicates = new Set<string>()

        for (const [entry, path, content] of $files) {
          if (duplicates.has(path)) {
            throw new Error('Duplicate input file: ' + (path ? JSON.stringify(path) : '<stdin>'))
          }
          duplicates.add(path)
          if (!path) {
            const stdin = o.stdin && typeof o.stdin === 'object' ? o.stdin : (o.stdin = {})
            stdin.contents = content
            if (!('resolveDir' in stdin)) stdin.resolveDir = '/'
          } else {
            input[path] = content
            if (entry) entryPoints.push(path)
          }
        }

        sendIPC({
          command_: 'build',
          input_: input,
          options_: o,
        }).then(set, () => {
          // Swallow errors (e.g. "task aborted" or "failed to create worker")
        })
      }
    } catch (err) {
      set({ stderr_: prettyPrintErrorAsStderr(err) })
    }
  },
)
// export const error

export const status = writable('Loading esbuild…', (set) => emitter.on('status', set))
if (is_client) {
  output.subscribe((result) => {
    if (result) {
      if (result.duration_) status.set(`Finished in ${result.duration_.toFixed(2)}ms`)
      else status.set('')
    }
  })
}

export const debug = writable(import.meta.env.DEV || initial_query.d)

if (is_client) {
  Object.assign(window, {
    stores: { theme, version, versions, mode, input, files, options, output, status, debug },
  })
}
