<script>
  import { createEventDispatcher } from "svelte";
  import { options } from "../../../stores/build";
  import Boolean from "./scalar/Boolean.svelte";
  import OptionEntry from "./OptionEntry.svelte";

  export let open;

  let dispatch = createEventDispatcher();

  function onClose(ev) {
    ev.stopPropagation();
    dispatch("close", ev);
  }
</script>

<section class:open>
  <h4>
    <a href="https://esbuild.github.io/api">Options</a>
    <button on:click={onClose}>
      <span class="close">close</span>
      <i class="i mdi:close" />
    </button>
  </h4>
  <p>
    Note: not all options are supported, try use esbuild in the browser console or install it locally.
  </p>
  {#if open}
    <div class="options">
      <OptionEntry
        name="bundle"
        type="boolean"
        bind:value={$options.bundle}
      />
      <OptionEntry
        name="define"
        type="record"
        placeholder="DEBUG=1"
        bind:value={$options.define}
      />
      <OptionEntry
        name="format"
        type="select"
        options={["", "iife", "cjs", "esm"]}
        bind:value={$options.format}
      />
      <OptionEntry
        name="loader"
        type="record"
        placeholder=".svg=dataurl"
        bind:value={$options.loader}
      />
      <OptionEntry
        name="minify"
        type="boolean"
        bind:value={$options.minify}
      />
      <OptionEntry
        name="platform"
        type="select"
        options={["", "browser", "node", "neutral"]}
        bind:value={$options.platform}
      />
      <OptionEntry
        name="sourcemap"
        type="select"
        options={["", "true", "external", "inline", "both"]}
        bind:value={$options.sourcemap}
      />
      <OptionEntry
        name="splitting"
        type="boolean"
        bind:value={$options.splitting}
      />
      <OptionEntry
        name="target"
        type="list"
        placeholder="es6"
        bind:value={$options.target}
      />
      <h5>Advanced options</h5>
      <OptionEntry
        name="asset-names"
        type="text"
        placeholder="[dir]/[name]-[hash]"
        bind:value={$options.assetNames}
      />
      <OptionEntry
        name="charset"
        type="select"
        options={["", "utf8", "ansii"]}
        bind:value={$options.charset}
      />
      <OptionEntry
        name="chunk-names"
        type="text"
        placeholder="[dir]/[name]-[hash]"
        bind:value={$options.chunkNames}
      />
      <OptionEntry
        name="entry-names"
        type="text"
        placeholder="[dir]/[name]-[hash]"
        bind:value={$options.chunkNames}
      />
      <OptionEntry
        name="global-name"
        type="text"
        bind:value={$options.globalName}
      />
      <OptionEntry
        name="ignore-annotations"
        type="boolean"
        bind:value={$options.ignoreAnnotations}
      />
      <OptionEntry
        name="jsx"
        type="select"
        options={["", "transform", "preserve"]}
        bind:value={$options.jsx}
      />
      <OptionEntry
        name="jsx-factory"
        type="text"
        placeholder="h"
        bind:value={$options.jsxFactory}
      />
      <OptionEntry
        name="jsx-fragment"
        type="text"
        placeholder="Fragment"
        bind:value={$options.jsxFragment}
      />
      <OptionEntry
        name="keep-names"
        type="boolean"
        bind:value={$options.keepNames}
      />
      <OptionEntry
        name="legal-comments"
        type="select"
        options={["", "none", "inline", "eof", "linked", "external"]}
        bind:value={$options.legalComments}
      />
      <OptionEntry
        name="out-extension"
        type="record"
        placeholder=".js=.mjs"
        bind:value={$options.outExtension}
      />
      <OptionEntry
        name="pure"
        type="list"
        placeholder="console.log"
        bind:value={$options.pure}
      />
      <OptionEntry
        name="resolve-extensions"
        type="list"
        placeholder=".tsx,.ts,.jsx,.js,.css,.json"
        bind:value={$options.resolveExtensions}
      />
      <OptionEntry
        name="sources-content"
        type="boolean"
        bind:value={$options.sourcesContent}
      />
      <OptionEntry
        name="tree-shaking"
        type="boolean"
        bind:value={$options.treeShaking}
      />
    </div>
  {/if}
</section>

<style>
  section {
    position: absolute;
    right: 0;
    top: 100%;
    width: 400px;
    padding: calc(var(--gap) * 2);
    color: var(--fg);
    background-color: var(--bg-on);
    border: 1px solid rgba(127, 127, 127, 0.5);
    border-radius: var(--gap);
    box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);
    user-select: text;
    cursor: default;
    z-index: 1;
    line-height: 1.4;
    display: none;
    max-height: 80vh;
    overflow-y: scroll;
  }
  h5 {
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    grid-column: 1 / span 2;
  }
  @media screen and (max-width: 720px) {
    section {
      position: fixed;
      inset: 0;
      width: 100%;
      max-height: unset;
    }
  }
  .open {
    display: block;
  }
  h4 {
    margin: 0;
    text-align: left;
    font-size: 14px;
  }
  h4 a {
    text-decoration: none;
  }
  h4 a:hover {
    text-decoration: underline;
  }
  h4 button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.3em;
    color: var(--red);
    background-color: transparent;
    border: none;
    outline: none;
    opacity: 0.4;
    transition: opacity 0.2s;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    cursor: pointer;
  }
  @media screen and (max-width: 720px) {
    h4 button {
      font-size: 16px;
      padding: 0.8em;
    }
  }
  .close {
    position: absolute;
    right: 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  h4 button:hover,
  h4 button:hover .close {
    opacity: 1;
  }
  .options {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: calc(var(--gap) * 2) var(--gap);
    align-items: center;
    text-align: left;
  }
  p {
    margin: var(--gap) 0;
    text-align: start;
    font-size: 14px;
  }
</style>
