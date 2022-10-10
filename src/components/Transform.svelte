<script lang="ts">
  import { hljs_action } from "../helpers/hljs";
  import { loading } from "../stores";
  import { errorsHTML, input as code, loader, options, result } from "../stores/transform";
  // ^ "input as code" see https://github.com/sveltejs/svelte/issues/5712
  // seems you can not use an import name the same as html tags
  import SplitPane from "./SplitPane.svelte";
  import Features from "./Features.svelte";

  export let show = true;

  let url = new URL("https://evanw.github.io/source-map-visualization");
  function view_sourcemap() {
    let code = result_code || "";
    let map = $result.map || "";
    let data = [code.length, "\0", code, map.length, "\0", map].join("");
    url.hash = btoa(data);
    window.open(url, "_blank");
  }

  $: result_code = $loading ? "// initializing" : $result.code;
</script>

<SplitPane {show}>
  <section slot="left" class="input">
    <textarea class="editor" rows="2" spellcheck="false" bind:value={$code} />
    <input placeholder="--loader=js" spellcheck="false" autocomplete="off" bind:value={$options} />
  </section>
  <section slot="right" class="output">
    {#if result_code}
      <pre class="result code" use:hljs_action={{ code: result_code, loader: $loader }} />
    {/if}
    {#if $result.map}
      <pre class="result map" use:hljs_action={{ code: $result.map, loader: "json" }} />
      <button class="btn" on:click={view_sourcemap}>Visualize Source Map</button>
    {/if}
    {#if $errorsHTML}
      <pre class="result error">{@html $errorsHTML}</pre>
    {/if}
    {#if result_code}
      <Features />
    {/if}
  </section>
</SplitPane>

<style>
  .result {
    cursor: text;
  }
  .code {
    white-space: pre-wrap;
    word-break: break-all;
  }
  .error {
    font-size: 12px;
    white-space: pre-wrap;
  }
</style>
