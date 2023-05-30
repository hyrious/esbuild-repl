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

export const status = writable('Loading esbuild…', (set) => emitter.on('status', set))
export const debug = writable(import.meta.env.DEV || initial_query.d)

if (is_client) {
  Object.assign(window, {
    stores: { theme, version, versions, mode, input, files, options, status, debug },
  })
}
