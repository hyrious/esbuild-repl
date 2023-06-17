<script lang="ts">
  import { wait } from '@hyrious/utils'
  import { status, options, output } from '../stores'
  import { terminal_to_html } from '../helpers/ansi'
  import Editor from './Editor.svelte'
  import Features from './Features.svelte'
  import Visualize from './Visualize.svelte'
  import Metafile from './Metafile.svelte'

  const decoder = new TextDecoder()

  function json_print(obj: any): string {
    return JSON.stringify(obj, null, 2)
  }

  function guess_lang() {
    if ($options.includes('--loader=css') || /loader["']?\:\s*["']css/.test($options)) {
      return 'css'
    }
    return 'js'
  }

  let source_map_url = new URL('https://evanw.github.io/source-map-visualization')
  function visualize_sourcemap(code: string, map: string) {
    const data = code.length + '\0' + code + map.length + '\0' + map
    source_map_url.hash = btoa(data).replace(/=+$/, '')
    window.open(source_map_url, '_blank')
  }

  function simple_sourcemap() {
    visualize_sourcemap($output?.code_ || '', $output?.map_ || '')
  }

  function outfile_sourcemap(path: string, map: string) {
    if ($output?.outputFiles_ && path.endsWith('.map')) {
      const source_path = path.slice(0, -4)
      const source = $output.outputFiles_.find((e) => e.path === source_path)
      if (source) {
        visualize_sourcemap(decoder.decode(source.contents), map)
      }
    }
  }

  async function download_metafile() {
    if ($output?.metafile_) {
      const blob = new Blob([json_print($output.metafile_)], { type: 'application/json' })
      const suggestedName = 'metafile.json'
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({ suggestedName })
          const writer = await handle.createWritable()
          await writer.write(blob)
          await writer.close()
          $status = `File ${handle.name} saved.`
          return
        } catch (err) {
          if (err.name === 'AbortError') return
          else console.error(err)
        }
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'metafile.json'
      a.style.display = 'none'
      document.body.append(a)
      a.click()
      await wait(1000)
      URL.revokeObjectURL(url)
      a.remove()
    }
  }

  let analyze_url = new URL('https://esbuild.github.io/analyze/')
  function analyze_metafile() {
    if ($output?.metafile_) {
      analyze_url.hash = btoa(JSON.stringify($output.metafile_)).replace(/=+$/, '')
      window.open(analyze_url, '_blank')
    }
  }

  function sorted<T extends { path: string }>(files: T[]): T[] {
    // mutate the state? it is ok..
    return files.sort((a, b) => +(a.path > b.path) - +(a.path < b.path))
  }
</script>

{#if $output}
  {#if $output.stderr_}
    <pre>{@html terminal_to_html($output.stderr_)}</pre>
  {/if}
  {#if typeof $output.code_ === 'string'}
    <Editor label="OUTPUT" readonly content={$output.code_} lang={guess_lang()} />
    {#if $output.code_}
      <Features />
    {/if}
  {/if}
  {#if Array.isArray($output.outputFiles_)}
    {#if $output.outputFiles_.length === 0}
      <p>(no output)</p>
    {:else}
      {#each sorted($output.outputFiles_) as { path, contents }}
        {@const name = path.replace(/^\//, '')}
        {@const text = decoder.decode(contents)}
        <Editor label="OUTPUT" readonly header {name} content={text} size={contents.byteLength} />
        {#if path.endsWith('.map')}
          <Visualize
            title="evanw/source-map-visualization"
            content="Visualize this source map"
            on:click={() => outfile_sourcemap(path, text)}
          />
        {/if}
      {/each}
    {/if}
  {/if}
  {#if $output.legalComments_}
    <Editor label="LEGAL COMMENTS" readonly content={$output.legalComments_} lang="comment" />
  {/if}
  {#if $output.map_}
    <Editor label="SOURCE MAP" readonly content={$output.map_} lang="json" />
    <Visualize
      title="evanw/source-map-visualization"
      content="Visualize this source map"
      on:click={simple_sourcemap}
    />
  {/if}
  {#if $output.mangleCache_ && Object.keys($output.mangleCache_).length}
    <Editor label="MANGLE CACHE" readonly content={json_print($output.mangleCache_)} lang="json" />
  {/if}
  {#if $output.metafile_}
    <Editor label="METAFILE" readonly content={json_print($output.metafile_)} lang="json" />
    <Metafile on:download={download_metafile} on:analyze={analyze_metafile} />
  {/if}
{:else}
  <p>(no output)</p>
{/if}

<style>
  pre {
    margin: 0 0 10px;
    font: var(--code-font);
    white-space: pre-wrap;
  }
  p {
    margin: 0;
    opacity: 0.5;
  }
</style>
