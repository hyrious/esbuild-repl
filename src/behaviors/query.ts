import { is_client } from '../helpers/dom'

interface Query {
  version?: string
  t?: string // transform input, like 'let a = 1'
  b?: { entry: boolean; path: string; content: string }[] // build input, multiple 'e,path,content'
  o?: string // options, can be '--minify' or '{minify:true}' (json5 value)
  i?: string[] // installed npm packages, like '&i=jquery&i=react'
  d?: true // debug
}

function json_parse(raw: any, def: any = {}): any {
  try {
    return JSON.parse(raw)
  } catch {
    return def
  }
}

export function load_query(): Query {
  const search = new URLSearchParams(is_client ? location.search : '')

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
    if (legacy.config) query.o = JSON.stringify(legacy.config, null, 2)
    if (legacy.modules)
      query.b = legacy.modules.map((m) => ({
        entry: m.isEntry,
        path: m.name,
        content: m.code,
      }))
  }

  if (search.get('mode') === 'build') {
    const modules = search.get('modules')
    if (modules) {
      query.b = json_parse(modules, []).map((e: any) => ({
        entry: Boolean(e[2]),
        path: e[0],
        content: e[1],
      }))
    }
  } else {
    const input = search.get('input')
    if (input) query.t = input
  }

  const options = search.get('o') || search.get('options') || search.get('buildOptions')
  if (options) query.o = options
  if (search.get('mode') === 'build' && query.o) {
    try {
      const obj = JSON.parse(query.o)
      obj.outdir = '/'
      obj.packages = 'external'
      obj.allowOverwrite = true
      query.o = JSON.stringify(obj, null, 2)
    } catch {
      // ignore parsing error
    }
  }

  if (search.has('d') || search.has('debug')) query.d = true

  const t = search.get('t')
  if (t) query.t = t

  const b = search.getAll('b')
  if (b.length > 0) {
    query.b = []
    for (const raw of b) {
      const [entry, path, content] = raw.split('\0')
      query.b.push({ entry: entry === 'e', path, content })
    }
  }

  const i = search.getAll('i')
  if (i.length > 0) query.i = i

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
        query.b.push({ entry: parts[i] === 'e', path: parts[i + 1], content: parts[i + 2] })
      }
    }
  }

  return query
}

export function save_query(mode: string, query: Query): void {
  if (!is_client) return

  const search = new URLSearchParams()

  if (query.version && query.version !== 'latest') search.set('version', query.version)

  if (mode === 'transform' && query.t) search.set('t', query.t)

  if (mode === 'build' && query.b) {
    for (const { entry, path, content } of query.b) {
      search.append('b', (entry ? 'e' : '') + '\0' + path + '\0' + content)
    }
    if (query.i) {
      for (const spec of query.i) search.append('i', spec)
    }
  }

  if (query.o) search.set('o', query.o)

  if (query.d) search.set('d', '1')

  const base = location.pathname
  const suffix = search.toString()
  history.replaceState({}, '', suffix ? base + '?' + suffix : base)
}
