<script lang="ts">
  import { onMount } from 'svelte'
  import { output } from '../stores'
  import Editor from './Editor.svelte'

  let promise: Promise<any>

  onMount(() => {
    promise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@rollup/browser'
      script.onload = () => resolve((window as any).rollup)
      script.onerror = () => reject(new Error(`Could not load Rollup from ${script.src}`))
      document.head.appendChild(script)
    })
  })

  async function bundle(rollup: any) {
    const code = $output?.code_
    const esbuild = (window as any).esbuild
    if (!code || !esbuild) return '// not ready'

    const stdinPlugin = {
      name: 'stdin',
      resolveId(id: string) {
        return id
      },
      load(_id: string) {
        return code
      },
    }

    const ret = await rollup.rollup({ input: 'main.js', plugins: [stdinPlugin] })
    const generated = await ret.generate({ format: 'es' })

    const stage1 = generated.output[0].code
    const { code: stage2 } = await esbuild.transform(stage1, { minifySyntax: true })

    console.log('===== STAGE 1 =====\n' + stage1 + '===== STAGE 2 =====\n' + stage2)

    return stage2
  }
</script>

{#await promise}
  <p>(loading rollup&hellip;)</p>
{:then rollup}
  {#if rollup}
    {#await bundle(rollup) then content}
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
