import fs from 'node:fs'
import { svelte } from '@hyrious/esbuild-plugin-svelte'
import { BuildOptions, Metafile, analyzeMetafile, build, context } from 'esbuild'
import { icons } from './plugins/icons'
import { svelte_ssr } from './plugins/svelte-ssr'
import { inspector } from './plugins/inspector'
import { open_in_editor } from './plugins/open-in-editor'
import { sourcemap } from './plugins/sourcemap'

const panic = () => process.exit(1)

const args = process.argv.slice(2)
const serve = args.includes('--serve')

const options: BuildOptions = {
  entryPoints: [
    'src/index.html',
    'src/favicon.svg',
    'src/main.ts',
    'src/hljs.ts',
    'src/sw.ts',
    'src/worker.ts',
  ],
  bundle: true,
  format: 'esm',
  splitting: true,
  sourcemap: true,
  outdir: 'dist',
  legalComments: 'none',
  define: {
    'import.meta.env.DEV': JSON.stringify(serve),
    'import.meta.env.SSR': 'false',
  },
  loader: {
    '.svg': 'copy',
  },
  plugins: [
    icons({ glob: 'src/**/*.svelte' }),
    svelte_ssr({ entryPoints: { 'src/index.html': 'src/App.svelte' } }),
    svelte({ emitCss: true, compilerOptions: { dev: serve, hydratable: true } }),
    inspector(),
    sourcemap(),
  ],
}

fs.rmSync('dist', { recursive: true, force: true, maxRetries: 3 })

if (serve) {
  const editor = open_in_editor()
  editor.listen(3001, 'localhost', () => {
    console.log('serving http://localhost:3001/__open-in-editor')
  })

  options.write = false
  options.sourcemap = 'inline'
  const ctx = await context(options)
  const { port } = await ctx.serve({ host: 'localhost', port: 3000, servedir: 'dist' })
  await ctx.watch()
  console.log('serving http://localhost:' + port)

  process.on('SIGTERM', () => {
    editor.close()
    ctx.dispose()
  })
} else {
  options.minify = true
  options.mangleProps = /[^_]_$/
  options.metafile = true
  options.logLevel = 'info'
  const result = await build(options).catch(panic)
  const metafile = result.metafile as Metafile

  const outfiles = Object.keys(metafile.outputs)
  for (const file of outfiles) {
    const info = metafile.outputs[file].inputs
    for (const path of Object.keys(info)) {
      const index = path.lastIndexOf('node_modules/')
      if (index >= 0) {
        const short = path.slice(index)
        info[short] = info[path]
        delete info[path]
      }
    }
  }

  console.log(await analyzeMetafile(metafile, { color: true }))
}
