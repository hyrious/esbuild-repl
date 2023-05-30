// Credits: https://github.com/unocss/unocss/tree/main/packages/preset-icons
import fs from 'node:fs'
import fg from 'fast-glob'
import { Plugin } from 'esbuild'
import { resolve } from 'node:path'
import { PartialMessage } from 'esbuild'
import { searchForIcon } from '@iconify/utils/lib/loader/modern'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'

interface IconsPluginOptions {
  glob?: string
  custom?: Record<string, string>
}

interface IconifyJSON {
  prefix: string
  icons: Record<string, { body: string }>
}

export const icons = ({ glob = 'src/**/*.{tsx,vue,svelte}', custom }: IconsPluginOptions = {}): Plugin => {
  const root_package_json = resolve(__dirname, '../../package.json')

  // .cache/icons/mdi.json
  const cache_dir = resolve(root_package_json, '../node_modules/.cache/icons')
  fs.mkdirSync(cache_dir, { recursive: true })
  const save_cache = (collection: string, json: IconifyJSON) => {
    fs.writeFileSync(resolve(cache_dir, `${collection}.json`), JSON.stringify(json))
  }

  // in-memory cache, eagerly load on startup
  const cache = new Map<string, IconifyJSON | Promise<IconifyJSON>>()
  for (const file of fs.readdirSync(cache_dir)) {
    if (file.endsWith('.json')) {
      cache.set(file.slice(0, -5), JSON.parse(fs.readFileSync(resolve(cache_dir, file), 'utf8')))
    }
  }
  if (custom) {
    const icons: Record<string, { body: string }> = {}
    for (const icon in custom) {
      const file = custom[icon]
      icons[icon] = { body: fs.readFileSync(resolve(root_package_json, '../', file), 'utf8') }
    }
    cache.set('custom', { prefix: 'custom', icons })
  }

  const do_fetch_collection = async (collection: string): Promise<IconifyJSON> => {
    console.log(`fetching icons "${collection}"`)
    const cdn_bases = ['https://esm.sh/', 'https://cdn.jsdelivr.net/npm/', 'https://unpkg.com/']
    for (const cdn of cdn_bases) {
      const url = `${cdn}@iconify-json/${collection}/icons.json`
      const res = await fetch(url).catch(() => ({ ok: false, json: () => void 0 }))
      if (res.ok) {
        const json = await res.json()
        console.log(`cached icons "${collection}" from ${url}`)
        save_cache(collection, json)
        return json
      }
    }
    throw new Error(`failed to fetch icons "${collection}"`)
  }

  const fetch_collection = async (collection: string): Promise<IconifyJSON> => {
    if (!cache.has(collection)) {
      cache.set(collection, do_fetch_collection(collection))
    }
    return cache.get(collection) as Promise<IconifyJSON>
  }

  const fetch_svg = async (collection: string, icon: string): Promise<string | undefined> => {
    const icon_set = await fetch_collection(collection)
    return await searchForIcon(icon_set, collection, [
      icon,
      icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      icon.replace(/([a-z])(\d+)/g, '$1-$2'),
    ])
  }

  return {
    name: 'icons',
    setup({ onStart, onResolve, onLoad }) {
      const collected = new Set<string>()

      const selector_re = /(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-?]/
      const is_valid_selector = (text: string) => selector_re.test(text)
      const scan_icon_classes = (text: string) => {
        const pieces = text.split(/[\s'"`;>=]+/g).filter(is_valid_selector)
        for (let name of pieces) {
          if (name.startsWith('class:')) name = name.slice(6)
          if (name.startsWith('i-')) collected.add(name)
        }
      }

      const class_re = /^i-(\w+)-([-\w]+)$/
      const generate = async (cls: string, warnings: PartialMessage[]): Promise<string | undefined> => {
        let match: RegExpMatchArray | null
        if ((match = cls.match(class_re))) {
          const [, collection, icon] = match
          const svg = await fetch_svg(collection, icon)
          if (svg) {
            const url = `url("data:image/svg+xml;utf8,${encodeSvgForCss(svg)}")`
            const css: Record<string, string> = {
              'width': '1em',
              'height': '1em',
              'display': 'inline-block',
              'vertical-align': 'middle',
            }
            if (svg.includes('currentColor')) {
              Object.assign(css, {
                '--icon': url,
                '-webkit-mask': 'var(--icon) no-repeat',
                'mask': 'var(--icon) no-repeat',
                '-webkit-mask-size': '100% 100%',
                'mask-size': '100% 100%',
                'background-color': 'currentColor',
                'color': 'inherit',
              })
            } else {
              Object.assign(css, {
                'background': `${url} no-repeat`,
                'background-size': '100% 100%',
                'background-color': 'transparent',
              })
            }
            return `.${cls.replace(':', '\\:')} {\n${Object.entries(css)
              .map(([k, v]) => `  ${k}: ${v};\n`)
              .join('')}}`
          } else {
            warnings.push({ text: `failed to load icon "${cls}"` })
          }
        }
      }

      let prepare = Promise.resolve()
      let watchFiles: string[] = []

      onStart(async () => {
        collected.clear()
        watchFiles = await fg(glob)
        watchFiles.unshift(root_package_json)
        const tasks: Promise<void>[] = []
        for (const file of watchFiles) {
          tasks.push(fs.promises.readFile(file, 'utf8').then(scan_icon_classes))
        }
        prepare = Promise.all(tasks).then(() => void 0)
      })

      onResolve({ filter: /^icons\.css$/ }, () => ({ path: 'index.css', namespace: 'icons' }))

      onLoad({ filter: /(?:)/, namespace: 'icons' }, async () => {
        const warnings: PartialMessage[] = []
        await prepare
        let contents = ''
        for (const cls of collected) {
          const css = await generate(cls, warnings)
          if (css) contents += css + '\n'
        }
        return { contents, loader: 'css', watchFiles, warnings }
      })
    },
  }
}
