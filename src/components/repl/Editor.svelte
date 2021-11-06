<script>
  import { createEventDispatcher } from "svelte";

  export let name = "foo.js";
  export let code = "";
  export let isEntry = false;
  export let readonly = false;

  const dispatch = createEventDispatcher();
</script>

<article class="module" class:is-entry={isEntry}>
  <header>
    {#if readonly}
      <div class="module-name">{name}</div>
    {:else}
      <input
        class="module-name"
        placeholder="main.js"
        bind:value={name}
        {readonly}
      />
      <button class="remove" on:click={() => dispatch("remove")}>
        <span class="label">remove</span>
        <i class="i mdi:close" />
      </button>
      <button class="entry" on:click={() => dispatch("set-entry", !isEntry)}>
        <span class="label">(entry&nbsp;module)</span>
        {#if isEntry}
          <i class="i mdi:minus" />
        {:else}
          <i class="i mdi:plus" />
        {/if}
      </button>
    {/if}
  </header>
  {#if readonly}
    <pre class="chunk">{code}</pre>
  {:else}
    <textarea class="editor" bind:value={code} />
  {/if}
</article>

<style>
  article {
    border: 1px solid rgba(127, 127, 127, 0.5);
    border-radius: var(--gap);
  }
  header {
    width: 100%;
    position: relative;
    border-bottom: 1px solid rgba(127, 127, 127, 0.5);
  }
  input {
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    display: block;
    width: 100%;
    outline: none;
    line-height: 1;
  }
  .module-name {
    font: 14px/140% var(--mono);
    background-color: rgba(127, 127, 127, 0.1);
    padding: calc(var(--gap) * 1.5);
    cursor: text;
  }
  input:focus {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .remove {
    top: 0;
  }
  .entry {
    bottom: 0;
  }
  button {
    position: absolute;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    right: 0;
    background-color: transparent;
    border: none;
    padding: 0;
    outline: none;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s;
    line-height: 1;
  }
  button i {
    padding: 0.3em;
  }
  .label {
    position: absolute;
    right: 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  button:hover {
    opacity: 1;
  }
  button:hover .label {
    opacity: 0.6;
  }
  .is-entry .entry .label {
    opacity: 0.6;
  }
  .remove {
    color: var(--red);
  }
  textarea {
    display: block;
    width: 100%;
    resize: none;
    border: 0;
  }
  pre {
    border: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
