<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import prettyBytes from 'pretty-bytes'
  import { highlight } from '../helpers/hljs'

  export let header = false
  export let rows = 1
  export let name = ''
  export let label = ''
  export let content = ''
  export let size = 0
  export let placeholder = ''
  export let entry = false
  export let readonly = false
  export let download: boolean | string = false
  export let lang = ''

  const dispatch = createEventDispatcher()

  function guess_lang(name: string) {
    if (name.endsWith('.css')) return 'css'
    if (name.endsWith('.map') || name.endsWith('.json')) return 'json'
    return 'js'
  }

  async function download_it() {}
</script>

<article data-label={label}>
  {#if header || $$slots.header}
    <slot name="header">
      <header class:entry>
        {#if readonly}
          <input placeholder="<stdout>" spellcheck="false" value={name} readonly />
          {#if size}<span class="size">{prettyBytes(size, { binary: true })}</span>{/if}
        {:else}
          <button class="entry" title="entry: {entry ? 'yes' : 'no'}" on:click={() => (entry = !entry)}>
            <i class={entry ? 'i-mdi-checkbox-marked-outline' : 'i-mdi-checkbox-blank-outline'} />
          </button>
          <input placeholder="<stdin>" spellcheck="false" bind:value={name} />
          <button class="remove" title="remove {name || 'it'}" on:click={() => dispatch('remove')}>
            <i class="i-mdi-close" />
          </button>
        {/if}
        {#if download}
          <button class="download" title="download it" on:click={download_it} />
        {/if}
      </header>
    </slot>
  {/if}
  {#if readonly}
    {#if lang === 'raw'}
      <pre>{content}</pre>
    {:else if lang === 'comment'}
      <pre class="hljs-comment">{content}</pre>
    {:else}
      <pre use:highlight={{ code: content, loader: lang || guess_lang(name) }} />
    {/if}
  {:else}
    <textarea class="editor" {rows} spellcheck="false" bind:value={content} {placeholder} />
  {/if}
</article>

<style>
  [data-label] {
    position: relative;
  }
  [data-label]::after {
    content: attr(data-label);
    position: absolute;
    right: 8px;
    top: 5px;
    font: var(--code-font);
    opacity: 0.5;
    font-weight: 700;
    color: var(--fg);
    pointer-events: none;
  }
  [data-label]:has(header)::after {
    top: 29px;
  }
  article {
    display: flex;
    flex-direction: column;
    color: var(--fg);
  }
  article:not(:last-child) {
    margin-bottom: 10px;
  }
  header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  header input {
    flex: 1;
    width: 100%;
    appearance: none;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 1px;
    font: var(--code-font);
    color: inherit;
  }
  header input[readonly] {
    color: var(--fg-on);
    font-weight: 700;
  }
  header.entry input,
  header.entry button.entry {
    color: #58a549;
  }
  header.entry input {
    font-weight: 700;
  }
  header button {
    appearance: none;
    display: inline-flex;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    font-size: 20px;
    transition: opacity 0.2s;
  }
  button.entry {
    position: absolute;
    right: 100%;
    z-index: 10;
    opacity: 0;
  }
  :where(header:hover) button.entry {
    opacity: 0.5;
  }
  header:focus-within button.entry,
  header.entry button.entry,
  button.entry:hover {
    opacity: 1;
  }
  button.remove {
    color: #e24834;
    opacity: 0.5;
  }
  button.remove:hover {
    opacity: 1;
  }
  span.size {
    font: 14px/20px sans-serif;
    font-variant-numeric: tabular-nums;
    opacity: 0.5;
  }
  pre {
    margin: 0;
    padding: 8px;
    border-radius: 4px;
    min-height: 34px;
    max-height: 400px;
    font: var(--code-font);
    background: var(--pre);
    white-space: pre;
    word-break: break-all;
    cursor: text;
  }
  @media (max-width: 800px) {
    pre {
      white-space: pre;
    }
  }
  textarea {
    appearance: none;
    resize: none;
    width: 100%;
    height: 100%;
    font: var(--code-font);
    color: inherit;
    background: var(--pre);
    border: 1px solid var(--border);
    border-radius: 4px;
    outline: none;
    padding: 8px;
    white-space: pre;
    overscroll-behavior: contain;
    overflow: auto;
  }
  textarea:focus {
    color: var(--fg-on);
    border-color: var(--fg);
  }
</style>
