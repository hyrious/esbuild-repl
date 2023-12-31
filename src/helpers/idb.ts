import * as idb from 'idb-keyval'
import { is_client } from './dom'

const NPM_PACKAGES = is_client ? idb.createStore('npm', 'packages') : undefined

export function get(name: string, version: string) {
  return idb.get<Uint8Array>(`${name}@${version}`, NPM_PACKAGES)
}

export function set(name: string, version: string, tgz: Uint8Array) {
  return idb.set(`${name}@${version}`, tgz, NPM_PACKAGES)
}

if (is_client) {
  Object.assign(window, {
    NPM_PACKAGES,
    idb: { get, set, NPM_PACKAGES },
    cached: () => idb.keys(NPM_PACKAGES),
  })
}
