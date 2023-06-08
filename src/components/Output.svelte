<script lang="ts">
  import { options, output } from '../stores'
  import { terminal_to_html } from '../helpers/ansi'
  import Editor from './Editor.svelte'

  function json_print(obj: any): string {
    return JSON.stringify(obj, null, 2)
  }

  function guess_lang() {
    if ($options.includes('--loader=css') || /loader["']?\:\s*["']css/.test($options)) {
      return 'css'
    }
    return 'js'
  }

  $: console.log($output)
</script>

{#if $output}
  {#if $output.stderr_}
    <pre>{@html terminal_to_html($output.stderr_)}</pre>
  {/if}
  {#if typeof $output.code_ === 'string'}
    <Editor label="OUTPUT" readonly content={$output.code_} lang={guess_lang()} />
  {/if}
  {#if Array.isArray($output.outputFiles_)}
    {#if $output.outputFiles_.length === 0}
      <p>(no output)</p>
    {:else}
      {#each $output.outputFiles_ as { path, text }}
        <Editor label="OUTPUT" readonly header name={path.replace(/^\//, '')} content={text} />
      {/each}
    {/if}
  {/if}
  {#if $output.legalComments_}
    <Editor label="LEGAL COMMENTS" readonly content={$output.legalComments_} lang="comment" />
  {/if}
  {#if $output.map_}
    <Editor label="SOURCE MAP" readonly content={$output.map_} lang="json" />
  {/if}
  {#if $output.mangleCache_ && Object.keys($output.mangleCache_).length}
    <Editor label="MANGLE CACHE" readonly content={json_print($output.mangleCache_)} lang="json" />
  {/if}
  {#if $output.metafile_}
    <Editor label="METAFILE" readonly content={json_print($output.metafile_)} lang="json" />
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
