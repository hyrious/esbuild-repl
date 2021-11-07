<script>
  import Layout from "./Layout.svelte";
  import Editor from "./Editor.svelte";
  import Status from "./Status.svelte";

  import mode from "../../stores/mode";
  import { loading, error } from "../../stores/esbuild";
  import { elapsed, modules, options, outputs } from "../../stores/build";
  import fs_plugin from "../../helpers/fs";

  let uid = 1;

  function addModule() {
    if ($modules.length === 0) {
      $modules = [{ name: "main.js", code: "", isEntry: true }];
    } else {
      const name = `module_${uid++}.js`;
      $modules = [...$modules, { name, code: "", isEntry: false }];
    }
    requestAnimationFrame(() => {
      const editors = document.querySelectorAll(".input .editor");
      const last = editors[editors.length - 1];
      last?.focus();
    });
  }

  function removeModule(i) {
    $modules = $modules.filter((_, j) => i !== j);
  }

  function setEntry(i, isEntry) {
    $modules = $modules.map((e, j) => {
      if (i === j) e.isEntry = isEntry;
      return e;
    });
  }

  let buildErrors = [];
  let buildWarnings = [];

  async function build($modules, $options) {
    try {
      const entryPoints = $modules.filter((e) => e.isEntry).map((e) => e.name);
      if (entryPoints.length === 0) {
        $outputs = [];
        $elapsed = 0;
        return;
      }
      const timeStart = performance.now();
      const result = await esbuild.build({
        entryPoints,
        bundle: true,
        format: "esm",
        splitting: true,
        plugins: [fs_plugin($modules)],
        ...$options,
        outdir: "__out__",
        write: false,
      });
      $elapsed = (performance.now() - timeStart).toFixed(2);
      $outputs = result.outputFiles.map((file) => {
        const sliceAt = file.path.lastIndexOf("__out__") + "__out__".length + 1;
        const name = file.path.slice(sliceAt);
        const code = file.text.replace(/^\/\/ fs:/gm, "// ");
        return { name, code, isEntry: false };
      });
      buildErrors = result.errors;
      buildWarnings = result.warnings;
      $error = false;
    } catch (err) {
      $outputs = [];
      if (err.errors) {
        buildErrors = err.errors;
        buildWarnings = err.warnings;
      } else {
        $error = err;
      }
    }
  }

  $: !$loading && $mode === "build" && build($modules, $options);
</script>

<Layout mode="build">
  <svelte:fragment slot="input">
    {#each $modules as { name, code, isEntry }, i}
      <Editor
        bind:name
        bind:code
        {isEntry}
        on:remove={() => removeModule(i)}
        on:set-entry={(ev) => setEntry(i, ev.detail)}
      />
    {/each}
    <button on:click={addModule}>
      <i class="i mdi:plus" />
      <span>add module</span>
    </button>
  </svelte:fragment>
  <svelte:fragment slot="output">
    {#each $outputs as { name, code, isEntry }}
      <Editor {name} {code} {isEntry} readonly />
    {/each}
    <Status errors={buildErrors} warnings={buildWarnings} elapsed={$elapsed} />
  </svelte:fragment>
</Layout>

<style>
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--gap);
    outline: none;
    background-color: rgba(127, 127, 127, 0.1);
    color: var(--fg);
    padding: calc(var(--gap) * 1.5);
    cursor: pointer;
    line-height: 1;
  }
  button i {
    padding: 0.3em;
  }
  button:hover {
    color: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.2);
  }
</style>
