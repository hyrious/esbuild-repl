<svelte:options immutable />

<script>
  import { onMount } from "svelte";
  import { hljs_action } from "../../behaviors/hljs";

  import Layout from "./Layout.svelte";
  import Status from "./Status.svelte";
  import mode from "../../stores/mode";
  import { ready, error } from "../../stores/esbuild";
  import { code, config, elapsed } from "../../stores/transform";
  import { argsToConfig, configToArgs } from "../../helpers/cli";

  let transformInput;
  let transformOptions = "";
  let transformResult = "// initializing";
  let transformErrors = [];
  let transformWarnings = [];

  async function transform($code, $config) {
    try {
      const timeStart = performance.now();
      const result = await esbuild.transform($code, $config);
      $elapsed = (performance.now() - timeStart).toFixed(2);
      transformResult = result.code;
      transformErrors = [];
      transformWarnings = result.warnings;
      $error = false;
    } catch (err) {
      transformResult = "";
      if (err.errors) {
        transformErrors = err.errors;
        transformWarnings = err.warnings;
      } else {
        $error = err;
      }
    }
  }

  $: $ready && $mode === "transform" && transform($code, $config);
  $: transformOptions = configToArgs($config).join(" ");
  $: loader = $config.loader;

  function updateConfig() {
    const newConfig = argsToConfig(transformOptions);
    if (newConfig) {
      $config = newConfig;
    }
  }

  onMount(() =>
    requestAnimationFrame(() => {
      if ($mode === "transform") transformInput.focus();
    })
  );
</script>

<Layout mode="transform">
  <svelte:fragment slot="input">
    <textarea
      slot="input"
      class="editor"
      spellcheck="false"
      bind:value={$code}
      bind:this={transformInput}
    />
    <input
      spellcheck="false"
      autocomplete="off"
      placeholder="--loader=js"
      bind:value={transformOptions}
      on:change={updateConfig}
    />
  </svelte:fragment>
  <svelte:fragment slot="output">
    <pre class="chunk" use:hljs_action={{ code: transformResult, loader }} />
    <Status
      errors={transformErrors}
      warnings={transformWarnings}
      elapsed={$elapsed}
    />
  </svelte:fragment>
</Layout>

<style>
  textarea {
    display: block;
    width: 100%;
    height: 100%;
    resize: none;
  }
  pre {
    white-space: pre-wrap;
    word-break: break-all;
    cursor: text;
    max-height: 80vh;
  }
</style>
