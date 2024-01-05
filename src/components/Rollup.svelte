<script lang="ts">
  import { onMount } from 'svelte'
  import { output } from '../stores'
  import { terminal_to_html } from '../helpers/ansi'
  import Editor from './Editor.svelte'

  let promise: Promise<any>
  let stderr = ''

  onMount(() => {
    if ((window as any).rollup) {
      promise = Promise.resolve((window as any).rollup)
    } else {
      promise = new Promise(async (resolve, reject) => {
        // Rollup relies on the script src to find the wasm asset
        const signal = AbortSignal.timeout(5000)
        const timeout = () => reject(new Error('Timeout'))
        signal.addEventListener('abort', timeout)
        // prettier-ignore
        let resolved = await Promise.race([
          fetch('https://unpkg.com/@rollup/browser', { signal }).then((r) => r.url),
          fetch('https://cdn.jsdelivr.net/npm/@rollup/browser/package.json', { signal })
            .then((r) => r.json()),
        ])
        signal.removeEventListener('abort', timeout)
        // is package.json
        if (typeof resolved === 'object') {
          // currently the 'main' does not contain './', so it is safe to append it
          resolved = `https://cdn.jsdelivr.net/npm/@rollup/browser@${resolved.version}/${resolved.main}`
        }
        const script = document.createElement('script')
        script.src = resolved
        script.onload = () => resolve((window as any).rollup)
        script.onerror = () => reject(new Error(`Could not load Rollup from ${script.src}`))
        document.head.appendChild(script)
      })
    }
  })

  async function bundle(rollup: any) {
    const code = $output?.code_
    const esbuild = (window as any).esbuild
    if (!code || !esbuild) return '// not ready'

    const stdinPlugin = {
      name: 'stdin',
      resolveId(id: string) {
        if (id == 'main.js') return id
        return { id, external: true }
      },
      load(_id: string) {
        return code
      },
    }

    const warnings: { message: string }[] = []
    const onwarn = (warning: { message: string }) => {
      warnings.push(warning)
      console.warn(warning.toString())
    }

    const ret = await rollup.rollup({ input: 'main.js', plugins: [stdinPlugin], onwarn })
    const generated = await ret.generate({ format: 'es' })

    stderr = (
      await esbuild.formatMessages(
        warnings.map((e) => ({ text: e.message })),
        { kind: 'warning', color: true },
      )
    ).join('')

    const stage1 = generated.output[0].code
    console.log('===== STAGE 1 ===== (rollup.rollup)\n' + stage1)

    const { code: stage2 } = await esbuild.transform(stage1, { minifySyntax: true })
    console.log('===== STAGE 2 ===== (esbuild.minify)\n' + stage2)

    return stage2
  }
</script>

{#await promise}
  <p>(loading rollup&hellip;)</p>
{:then rollup}
  {#if rollup}
    {#await bundle(rollup)}
      <p>(rollup {rollup.VERSION} is bundling&hellip;)</p>
    {:then content}
      {#if stderr}
        <pre>{@html terminal_to_html(stderr)}</pre>
      {/if}
      <Editor label="ROLLUP {rollup.VERSION} | VITE" readonly {content} lang="js" />
    {/await}
  {:else}
    <p>(loading rollup&hellip;)</p>
  {/if}
{:catch error}
  <pre>{error.message}</pre>
{/await}

<style>
  pre {
    margin: 0 0 10px;
    font: var(--code-font);
    white-space: pre-wrap;
  }
  p {
    margin: 0 0 10px;
    opacity: 0.5;
  }
</style>
