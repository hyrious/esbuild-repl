import os from 'node:os'
import fs from 'node:fs'
import url from 'node:url'
import { build, BuildOptions, Plugin } from 'esbuild'
import { join, normalize } from 'node:path'
import { svelte } from '@hyrious/esbuild-plugin-svelte'

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
    setup({ onResolve, onLoad, initialOptions }) {
      const dev = !initialOptions.minify

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

        return { contents: result, loader: 'copy' }
      })
    },
  }
}

export default svelte_ssr
