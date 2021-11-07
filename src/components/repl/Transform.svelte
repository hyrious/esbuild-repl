<svelte:options immutable />

<script>
  import { onMount } from "svelte";

  import Layout from "./Layout.svelte";
  import Status from "./Status.svelte";
  import mode from "../../stores/mode";
  import { code, config, elapsed } from "../../stores/transform";
  import { error, loading } from "../../stores/esbuild";
  import { argsToConfig, configToArgs } from "../../helpers/cli";

  let transformInput;
  let transformOptions = "";
  let transformResult = "// initializing";
  let transformResultHTML = "";
  let transformErrors = [];
  let transformWarnings = [];

  const hljs =
    typeof Worker !== "undefined"
      ? new Worker("./hljs.js")
      : { postMessage() {}, addEventListener() {} };
  hljs.addEventListener("message", (e) => (transformResultHTML = e.data));

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

  $: !$loading && $mode === "transform" && transform($code, $config);
  $: transformOptions = configToArgs($config).join(" ");

  let timer = 0;

  $: {
    transformResultHTML = "";
    if (transformResult) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        hljs.postMessage({ code: transformResult, loader: $config.loader });
      }, 200);
    }
  }

  function updateConfig() {
    $config = argsToConfig(transformOptions);
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
    {#if transformResultHTML}
      <pre class="chunk">{@html transformResultHTML}</pre>
    {:else}
      <pre class="chunk">{transformResult}</pre>
    {/if}
    <Status errors={transformErrors} warnings={transformWarnings} elapsed={$elapsed} />
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
  }
</style>
