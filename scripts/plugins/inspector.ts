// Credits: https://github.com/sveltejs/vite-plugin-svelte/tree/main/packages/vite-plugin-svelte-inspector
import fs from 'node:fs'
import { Plugin } from 'esbuild'

export const inspector = (): Plugin => {
  return {
    name: 'svelte-inspector',
    setup({ onLoad, initialOptions }) {
      // Only enable in dev mode
      if (initialOptions.minify) return

      onLoad({ filter: /src.main\.ts$/ }, async (args) => {
        let contents = await fs.promises.readFile(args.path, 'utf8')
        contents = `import './inspector'\n${contents}`
        return { contents, loader: 'default' }
      })
    },
  }
}

export default inspector
