import { is_client } from 'svelte/internal'

interface Query {
  version?: string
  t?: string // transform input, like 'let a = 1'
  b?: [entry: boolean, path: string, content: string][] // build input, encoded as [e,n,c,...]
  o?: string // options, can be '--minify' or '{minify:true}' (json5 value)
  d?: true // debug
}

function json_parse(raw: any, def: any = {}): any {
  try {
    return JSON.parse(raw)
  } catch (e) {
    return def
  }
}

export function load_query(): Query {
  const search = is_client ? new URLSearchParams(location.search) : new Map<string, string>()

  const query: Query = Object.create(null)

  const version = search.get('version')
  if (version && /^\d[.\d]+$/.test(version)) query.version = version

  const shareable = search.get('shareable')
  if (shareable) {
    const legacy = json_parse(decodeURIComponent(atob(shareable))) as {
      code?: string
      config?: Record<string, any>
      modules?: { name: string; code: string; isEntry: boolean }[]
    }
    if (legacy.code) query.t = legacy.code
    if (legacy.config) query.o = JSON.stringify(legacy.config)
    if (legacy.modules) query.b = legacy.modules.map((m) => [m.isEntry, m.name, m.code])
  }

  if (search.get('mode') === 'build') {
    const modules = search.get('module')
    if (modules) query.b = json_parse(modules, []).map((e: any) => [Boolean(e[2]), e[0], e[1]])
  } else {
    const input = search.get('input')
    if (input) query.t = input
  }

  const options = search.get('o') || search.get('options') || search.get('buildOptions')
  if (options) query.o = options

  if (search.has('d') || search.has('debug')) query.d = true

  const t = search.get('t')
  if (t) query.t = t

  const b = search.get('b')
  if (b) {
    if (b[0] === '[') {
      query.b = json_parse(b, [])
    } else {
      const parts = atob(b).split('\0')
      query.b = []
      for (let i = 0; i < parts.length; i += 3) {
        query.b.push([parts[i] === 'e', parts[i + 1], parts[i + 2]])
      }
    }
  }

  const hash = is_client ? location.hash.slice(1) : ''
  if (hash) {
    const parts = atob(hash).split('\0')

    if (parts[0] === 't' && parts.length === 4) {
      query.version = parts[1]
      query.o = parts[2]
      query.t = parts[3]
    }

    if (parts[0] === 'b' && parts.length % 3 === 0) {
      query.version = parts[1]
      query.o = parts[2]
      query.b = []
      for (let i = 3; i < parts.length; i += 3) {
        query.b.push([parts[i] === 'e', parts[i + 1], parts[i + 2]])
      }
    }
  }

  return query
}

export function save_query(query: Query): void {
  if (!is_client) return

  const search = new URLSearchParams()

  if (query.version) search.set('version', query.version)

  if (query.t) search.set('t', query.t)

  if (query.b) {
    try {
      const parts: string[] = []
      for (const [entry, path, content] of query.b) {
        parts.push(entry ? 'e' : '', path, content)
      }
      search.set('b', btoa(parts.join('\0')).replace(/=+$/, ''))
    } catch {
      search.set('b', JSON.stringify(query.b))
    }
  }

  if (query.o) search.set('o', query.o)

  if (query.d) search.set('d', '')

  const pathname = location.pathname
  const querystring = search.toString()
  history.replaceState({}, '', querystring ? pathname + '?' + querystring : pathname)
}
