<script lang="ts">
  import { onMount, tick } from "svelte";
  import { errorsHTML, modules, outputs } from "../stores/build";
  import Editor from "./Editor.svelte";
  import SplitPane from "./SplitPane.svelte";

  let BuildOptions: typeof import("./BuildOptions.svelte").default;

  export let show = true;

  let uid = 1;

  $: multiple = $outputs.files && $outputs.files.length > 1;

  function reset() {
    $modules = [{ name: "main.js", contents: "export let a = 1", isEntry: true }];
  }

  function remove(index: number) {
    $modules = $modules.filter((_, j) => index !== j);
  }

  function add() {
    if ($modules.length === 0) {
      $modules = [{ name: "main.js", contents: "export let a = 1", isEntry: true }];
    } else {
      $modules = [...$modules, { name: `module_${uid++}.js`, contents: "", isEntry: false }];
    }
    tick().then(() => {
      const editors = document.querySelectorAll(".input .editor");
      const last = editors[editors.length - 1] as HTMLInputElement;
      if (last) last.focus();
    });
  }

  onMount(async () => {
    BuildOptions = (await import("./BuildOptions.svelte")).default;
  });
</script>

<SplitPane {show}>
  <section slot="left" class="input">
    <h3>
      <span>ES6 modules go in&hellip;</span>
      <button class="btn" on:click={reset}>Start over</button>
    </h3>
    {#each $modules as file, i}
      <Editor
        on:remove={() => remove(i)}
        bind:name={file.name}
        bind:contents={file.contents}
        bind:isEntry={file.isEntry}
      />
    {/each}
    <button class="btn" on:click={add}>
      <i class="i-mdi-plus" />
      <span>add module</span>
    </button>
  </section>
  <section slot="right" class="output">
    <h3>
      <!-- prettier-ignore -->
      <span>&hellip;{#if multiple}chunks come{:else}bundle comes{/if} out</span>
    </h3>
    <svelte:component this={BuildOptions} />
    {#if $outputs.files}
      {#each $outputs.files as file}
        <Editor name={file.name.replace(/^\//, "")} contents={file.contents} readonly />
      {/each}
    {/if}
    {#if $errorsHTML}
      <pre class="result error">{@html $errorsHTML}</pre>
    {/if}
    {#if $outputs.metafile}
      <Editor
        name="metafile"
        contents={JSON.stringify($outputs.metafile, null, 2)}
        readonly
        download="metafile.json"
      />
    {/if}
  </section>
</SplitPane>

<style>
  h3 {
    margin: 0;
    font-weight: normal;
    font-size: 16px;
    line-height: 32px;
    position: relative;
    display: flex;
    align-items: center;
  }
  h3 span {
    flex-grow: 1;
  }
  h3 button {
    display: inline-flex;
    padding: calc(var(--gap) * 1.5) calc(var(--gap) * 2);
  }
  .result {
    cursor: text;
  }
  .error {
    font-size: 12px;
    white-space: pre-wrap;
  }
</style>
