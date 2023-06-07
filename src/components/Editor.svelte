<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { highlight } from '../helpers/hljs'

  export let header = false
  export let rows = 1
  export let name = ''
  export let label = ''
  export let content = ''
  export let placeholder = ''
  export let entry = false
  export let readonly = false
  export let download = false
  export let lang = 'js'

  const dispatch = createEventDispatcher()

  async function download_it() {}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<article tabindex="0" data-label={label}>
  {#if header}
    <header>
      {#if readonly}
        <input placeholder="<stdout>" spellcheck="false" value={name} readonly />
      {:else}
        <button class="entry" title="toggle entry point" on:click={() => (entry = !entry)}>
          <i class={entry ? 'i-mdi-minus' : 'i-mdi-plus'} />
        </button>
        <input placeholder="<stdin>" spellcheck="false" bind:value={name} />
        <button class="remove" title="remove it" on:click={() => dispatch('remove')}>
          <i class="i-mdi-close" />
        </button>
      {/if}
      {#if download}
        <button class="download" title="download it" on:click={download_it} />
      {/if}
    </header>
  {/if}
  {#if readonly}
    {#if lang === 'comment'}
      <pre class="hljs-comment">{content}</pre>
    {:else}
      <pre use:highlight={{ code: content, loader: lang }} />
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
  }
  article {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--pre);
    overflow: hidden;
    color: var(--fg);
  }
  article:not(:last-child) {
    margin-bottom: 10px;
  }
  article:focus,
  article:has(:focus) {
    outline: none;
    border-color: var(--fg);
    color: var(--fg-on);
  }
  pre {
    margin: 0;
    padding: 8px;
    min-height: 34px;
    font: var(--code-font);
    white-space: pre-wrap;
    word-break: break-all;
    cursor: text;
  }
  textarea {
    appearance: none;
    resize: none;
    width: 100%;
    height: 100%;
    font: var(--code-font);
    color: inherit;
    background: none;
    border: none;
    outline: none;
    padding: 8px;
    white-space: pre;
  }
  textarea[rows='2'] {
    min-height: 54px;
  }
</style>
