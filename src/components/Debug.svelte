<script lang="ts">
  import { fade } from "svelte/transition";
  import { mode } from "../stores";
  import { input, options, optionsObj } from "../stores/transform";
  import { buildOptions, modules, outputs } from "../stores/build";

  let show = false;

  $: data = {
    $mode: $mode,
    Transform: {
      $input: $input,
      $options: $options,
      $optionsObj: $optionsObj,
    },
    Build: {
      $modules: $modules,
      $buildOptions: $buildOptions,
      $outputs: $outputs,
    },
  };
</script>

{#if show}
  <pre transition:fade={{ duration: 50 }}>{JSON.stringify(data, null, 2)}</pre>
{/if}
<button aria-checked={show} on:click={() => (show = !show)}>Debug</button>

<style>
  button {
    position: absolute;
    right: var(--gap);
    bottom: var(--gap);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--gap);
    outline: none;
    background-color: rgba(127, 127, 127, 0.1);
    color: var(--fg);
    padding: 0.5em 1em;
    cursor: pointer;
    line-height: 140%;
  }
  button:hover {
    --fg: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.2);
  }
  button:active {
    --fg: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.1);
  }
  pre {
    border: none;
    width: 50vw;
    position: absolute;
    inset: 0;
    left: initial;
    padding: calc(var(--gap) * 2);
    color: var(--fg-on);
    background-color: var(--bg);
    opacity: 0.8;
    cursor: text;
    overflow: auto;
    overscroll-behavior-y: contain;
  }
</style>
