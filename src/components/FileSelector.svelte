<script lang="ts">
  import { tick } from "svelte";
  import { files } from "../stores/playground";

  let uid = 1;
  export let selected: "index.html" | number = "index.html";

  function select(id: typeof selected) {
    selected = id;
  }

  function addFile() {
    let id = uid++;
    let name = `file_${id}.js`;
    let contents = "console.log('hello, world!')";
    $files = [...$files, { uid: id, name, contents }];
    tick().then(() => select(id));
  }

  function removeFile(index: number) {
    $files = $files.filter((_, j) => index !== j);
  }

  $: if (!$files.some((file) => file.uid === selected)) {
    selected = "index.html";
  }
</script>

<header>
  <span
    class="index file"
    class:active={selected === "index.html"}
    on:click={() => select("index.html")}
  >
    index.html
  </span>
  {#each $files as file, i}
    <span class="file" class:active={selected === file.uid}>
      {#if selected === file.uid}
        <span contenteditable="true" bind:textContent={file.name} />
      {:else}
        <span on:click={() => select(file.uid)}>{file.name}</span>
      {/if}
      <button on:click={() => removeFile(i)}>
        <i class="i-mdi-close" />
      </button>
    </span>
  {/each}
  <button class="add" on:click={addFile} title="add new file">
    <i class="i-mdi-plus" />
  </button>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    overflow: auto;
    border-bottom: 1px solid rgba(127, 127, 127, 0.25);
    height: 36px;
  }
  .file {
    display: inline-block;
    padding: var(--gap) calc(var(--gap) * 2) calc(var(--gap) - 2px);
    cursor: pointer;
    font-size: 14px;
    font-family: var(--mono);
    outline: none;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
  }
  [contenteditable] {
    outline: none;
  }
  .active {
    cursor: text;
    border-bottom: 2px solid var(--highlight);
  }
  .index {
    cursor: pointer;
  }
  button {
    margin: 0;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    font-size: 1em;
  }
  .add {
    margin-left: 0.25em;
    padding: var(--gap) calc(var(--gap) * 2);
  }
  button:hover {
    --fg: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.1);
  }
</style>
