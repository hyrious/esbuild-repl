<script lang="ts">
  import type { Loader } from "esbuild";
  import { createEventDispatcher } from "svelte";
  import { hljs_action } from "../helpers/hljs";

  export let name = "";
  export let contents = "";
  export let isEntry = false;
  export let readonly = false;

  let loader: Loader;

  $: loader = name.endsWith(".css") ? "css" : name.endsWith(".map") ? "json" : "js";

  const dispatch = createEventDispatcher();

  // TODO: CodeMirror
</script>

<article class="module" class:is-entry={isEntry}>
  <header>
    {#if readonly}
      <input placeholder="main.js" spellcheck="false" value={name} readonly />
    {:else}
      <input placeholder="main.js" spellcheck="false" bind:value={name} />
      <button class="remove" on:click={() => dispatch("remove")}>
        <span class="label">remove</span>
        <i class="i-mdi-close" />
      </button>
      <button class="entry" on:click={() => (isEntry = !isEntry)}>
        <span class="label">(entry&nbsp;module)</span>
        <i class={isEntry ? "i-mdi-minus" : "i-mdi-plus"} />
      </button>
    {/if}
  </header>
  {#if readonly}
    <pre class="chunk" use:hljs_action={{ code: contents, loader }} />
  {:else}
    <textarea class="editor" rows="2" spellcheck="false" bind:value={contents} />
  {/if}
</article>

<style>
  article {
    border: 1px solid rgba(127, 127, 127, 0.5);
    border-radius: var(--gap);
  }
  header {
    position: relative;
    border-bottom: 1px solid rgba(127, 127, 127, 0.5);
  }
  input {
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    outline: none;
    font: 14px/140% var(--mono);
    background-color: rgba(127, 127, 127, 0.1);
    padding: calc(var(--gap) * 1.5);
    cursor: text;
    line-height: 1;
  }
  input[readonly] {
    color: var(--fg);
  }
  input:not([readonly]):focus {
    background-color: rgba(0, 0, 0, 0.1);
  }
  textarea {
    border: 0;
  }
  pre {
    max-height: calc(100vh - 96px);
    border: none;
    white-space: pre-wrap;
    word-break: break-all;
    cursor: text;
  }
  button {
    position: absolute;
    border: none;
    padding: 0.3em;
    outline: none;
    right: 0;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    color: var(--fg);
    opacity: 0.4;
    transition: opacity 0.2s;
    line-height: 1;
    cursor: pointer;
  }
  button:hover {
    opacity: 1;
  }
  .label {
    position: absolute;
    right: 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  button:hover .label,
  .is-entry .entry .label {
    opacity: 0.6;
  }
  .remove {
    --fg: var(--red);
    top: 0;
  }
  .entry {
    bottom: 0;
  }
</style>
