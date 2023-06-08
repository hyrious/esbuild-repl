import fs from 'node:fs'
import fg from 'fast-glob'
import { Plugin } from 'esbuild'

interface SourceMapPluginOptions {
  glob?: string
}

export const sourcemap = ({ glob = 'dist/**/*.map' }: SourceMapPluginOptions = {}): Plugin => {
  return {
    name: 'sourcemap',
    setup({ onEnd, initialOptions }) {
      if (!initialOptions.minify) return

      onEnd(async () => {
        const files = await fg(glob)
        for (const file of files) {
          const map = fs.readFileSync(file, 'utf8')
          const json = JSON.parse(map) as {
            sources: string[]
            x_google_ignoreList?: number[]
          }
          const x_google_ignoreList = json.sources.reduce((list, source, index) => {
            if (source.includes('node_modules')) list.push(index)
            return list
          }, [] as number[])
          const replace = ',\n  "x_google_ignoreList": ' + JSON.stringify(x_google_ignoreList) + '\n}\n'
          const changed = map.replace(/\n\}\s*$/, replace)
          fs.writeFileSync(file, changed)
        }
      })
    },
  }
}
