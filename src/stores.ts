import { is_client } from 'svelte/internal'
import { get, writable } from 'svelte/store'
import { emitter } from './global'
import { load_query } from './behaviors/query'
import { fetch_versions } from './helpers/versions'

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
      // esbuild-repl only works after 0.9.0
      const index_of_0_9_0 = $versions.indexOf('0.9.0')
      if (index_of_0_9_0 >= 0) {
        $versions = $versions.slice(0, index_of_0_9_0 + 1)
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
export const files = writable(initial_query.b || [{ entry: true, path: 'entry.js', content: '' }])
export const options = writable(initial_query.o || '')

export interface InstalledPackage {
  name: string
  version: string
  files: { path: string; content: string }[]
}
export const installed = writable<InstalledPackage[]>([])

export const ready = writable(0, (set) => {
  let next = 1
  emitter.on('ready', () => set(next++))
})

import type { IPCResponse } from './ipc'
export const output = writable<IPCResponse | null>(null)

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
    stores: { theme, version, versions, mode, input, files, options, installed, output, status, debug },
  })
}
