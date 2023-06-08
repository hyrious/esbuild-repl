import os from 'node:os'
import fs from 'node:fs'
import url from 'node:url'
import { build, BuildOptions, Plugin } from 'esbuild'
import { join, normalize } from 'node:path'
import { svelte } from '@hyrious/esbuild-plugin-svelte'
import prettyBytes from 'pretty-bytes'

interface SvelteSSRPluginOptions {
  entryPoints?: Record<string, string>
  search?: string
}

interface SvelteSSR {
  render(): { html: string; head: string }
}

export const svelte_ssr = ({
  entryPoints = {},
  search = '<div id="app">',
}: SvelteSSRPluginOptions = {}): Plugin => {
  return {
    name: 'svelte-ssr',
    setup({ onResolve, onLoad, onEnd, initialOptions }) {
      const dev = !initialOptions.minify

      // This cache only lives for 1 second
      const cache: Record<string, { t: number; r: string }> = Object.create(null)

      const search_entry = (path: string) => {
        for (const key in entryPoints) {
          if (normalize(key) === normalize(path)) {
            return entryPoints[key]
          }
        }
      }

      onResolve({ filter: /\.html$/ }, (args) => {
        const svelteFile = search_entry(args.path)
        if (args.kind === 'entry-point' && svelteFile) {
          return {
            path: join(args.resolveDir, args.path),
            pluginData: svelteFile,
            namespace: 'svelte-ssr',
          }
        }
      })

      const find_node_modules = (dir: string): string => {
        const node_modules = join(dir, 'node_modules')
        if (fs.existsSync(node_modules)) {
          return node_modules
        }
        const parent = join(dir, '..')
        if (parent === dir) {
          return ''
        }
        return find_node_modules(parent)
      }
      const tmpdir = join(find_node_modules(process.cwd()) || os.tmpdir(), '.svelte-ssr')
      fs.mkdirSync(tmpdir, { recursive: true })
      fs.writeFileSync(join(tmpdir, 'package.json'), '{"type":"module"}')

      const build_into_cache = async (entry: string, options: BuildOptions) => {
        const outfile = join(tmpdir, entry.replace(/[/\\]/g, '+') + '.mjs')
        await build({
          entryPoints: [entry],
          platform: 'node',
          target: `node${process.versions.node}`,
          bundle: true,
          format: 'esm',
          sourcemap: true,
          sourcesContent: false,
          treeShaking: true,
          packages: 'external',
          outfile,
          ...options,
        })
        return outfile
      }

      onLoad({ filter: /(?:)/, namespace: 'svelte-ssr' }, async (args) => {
        if (cache[args.path] && Date.now() - cache[args.path].t < 1000) {
          return { contents: cache[args.path].r, loader: 'copy' }
        }

        const read_template = fs.promises.readFile(args.path, 'utf8')

        const path = await build_into_cache(args.pluginData, {
          plugins: [svelte({ emitCss: true, compilerOptions: { dev, generate: 'ssr', hydratable: true } })],
          define: {
            'import.meta.env.DEV': JSON.stringify(dev),
            'import.meta.env.SSR': 'true',
          },
          loader: { '.svg': 'empty' },
        })
        const mod: { default: SvelteSSR } = await import(url.pathToFileURL(path) + '?t=' + Date.now())

        const { html, head } = mod.default.render()
        const template = await read_template

        const beforeHead = template.indexOf('</head>')
        const inApp = template.indexOf(search) + search.length

        let result = template.slice(0, beforeHead)
        result += head
        result += template.slice(beforeHead, inApp)
        result += html.trim()
        result += template.slice(inApp)

        cache[args.path] = { r: result, t: Date.now() }

        return { contents: result, loader: 'copy' }
      })

      onEnd(({ errors, outputFiles }) => {
        if (errors.length === 0) {
          console.log('\x1B[2J\x1B[0;0H\x1B[32mSvelte SSR runs successfully.\x1B[m')
          if (outputFiles) {
            const table: [string, string][] = []
            for (const { path, contents } of outputFiles) {
              table.push([
                path.slice(path.lastIndexOf('dist')),
                prettyBytes(contents.byteLength, { binary: true }),
              ])
            }
            let w = 1
            for (const [path] of table) {
              w = Math.max(w, path.length)
            }
            for (const [path, size] of table) {
              console.log(`  ${path.padEnd(w)}  ${size}`)
            }
          }
        }
      })
    },
  }
}

export default svelte_ssr
