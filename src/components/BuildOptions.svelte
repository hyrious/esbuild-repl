<script lang="ts">
  import { buildOptions, modules } from "../stores/build";

  let fold = true;

  function reset_build_options() {
    $buildOptions = { bundle: true };
  }

  $: entriesHTML = `[${$modules
    .filter((e) => e.isEntry)
    .map((e) => e.name)
    .map((e) => `<span class="hljs-string">"${e}"</span>`)
    .join(", ")}]`;
</script>

<article class:expanded={!fold} aria-expanded={!fold}>
  <header on:click={() => (fold = !fold)}>
    <h2>Build Options</h2>
    <i
      class="i-mdi-reload"
      title="Reset Build Options"
      on:click|stopPropagation={reset_build_options}
    />
    <i
      class="i-mdi-information"
      title="not all options are supported, try use esbuild in the browser console or install it locally."
    />
  </header>
  <pre style={fold ? "display: none" : ""}>result = <span class="hljs-keyword">await</span
    > esbuild.build(&#123;
    entryPoints: {@html entriesHTML},
    bundle: <div class="option">
      <input id="opt-bundle" type="checkbox" bind:checked={$buildOptions.bundle} />
      <label for="opt-bundle" class="hljs-keyword">{$buildOptions.bundle}</label>
    </div>,
    format: <div class="option">
      <input
        type="radio"
        name="format"
        id="opt-format-esm"
        value="esm"
        bind:group={$buildOptions.format}
      />
      <label for="opt-format-esm" class="hljs-string">"esm"</label>
      <input
        type="radio"
        name="format"
        id="opt-format-cjs"
        value="cjs"
        bind:group={$buildOptions.format}
      />
      <label for="opt-format-cjs" class="hljs-string">"cjs"</label>
      <input
        type="radio"
        name="format"
        id="opt-format-iife"
        value="iife"
        bind:group={$buildOptions.format}
      />
      <label for="opt-format-iife" class="hljs-string">"iife"</label>
    </div>,
    minify: <div class="option">
      <input id="opt-minify" type="checkbox" bind:checked={$buildOptions.minify} />
      <label for="opt-minify" class="hljs-keyword">{$buildOptions.minify}</label>
    </div>,
    platform: <div class="option">
      <input
        type="radio"
        name="platform"
        id="opt-platform-browser"
        value="browser"
        bind:group={$buildOptions.platform}
      />
      <label for="opt-platform-browser" class="hljs-string">"browser"</label>
      <input
        type="radio"
        name="platform"
        id="opt-platform-node"
        value="node"
        bind:group={$buildOptions.platform}
      />
      <label for="opt-platform-node" class="hljs-string">"node"</label>
      <input
        type="radio"
        name="platform"
        id="opt-platform-neutral"
        value="neutral"
        bind:group={$buildOptions.platform}
      />
      <label for="opt-platform-neutral" class="hljs-string">"neutral"</label>
    </div>,
    sourcemap: <div class="option">
      <input
        type="radio"
        name="sourcemap"
        id="opt-sourcemap-true"
        value={true}
        bind:group={$buildOptions.sourcemap}
      />
      <label for="opt-sourcemap-true" class="hljs-keyword">true</label>
      <input
        type="radio"
        name="sourcemap"
        id="opt-sourcemap-false"
        value={false}
        bind:group={$buildOptions.sourcemap}
      />
      <label for="opt-sourcemap-false" class="hljs-keyword">false</label>
      <input
        type="radio"
        name="sourcemap"
        id="opt-sourcemap-inline"
        value="inline"
        bind:group={$buildOptions.sourcemap}
      />
      <label for="opt-sourcemap-inline" class="hljs-string">"inline"</label>
      <input
        type="radio"
        name="sourcemap"
        id="opt-sourcemap-external"
        value="external"
        bind:group={$buildOptions.sourcemap}
      />
      <label for="opt-sourcemap-external" class="hljs-string">"external"</label>
      <input
        type="radio"
        name="sourcemap"
        id="opt-sourcemap-both"
        value="both"
        bind:group={$buildOptions.sourcemap}
      />
      <label for="opt-sourcemap-both" class="hljs-string">"both"</label>
    </div>,
    splitting: <div class="option">
      <input id="opt-splitting" type="checkbox" bind:checked={$buildOptions.splitting} />
      <label for="opt-splitting" class="hljs-keyword">{$buildOptions.splitting}</label>
    </div>,
    target: <div class="option">
      <input id="opt-target" type="text" placeholder="esnext" bind:value={$buildOptions.target} />
      <label for="opt-target" class="hljs-hidden">"{$buildOptions.target}"</label>
    </div>,
    charset: <div class="option">
      <input
        type="radio"
        name="charset"
        id="opt-charset-utf8"
        value="utf8"
        bind:group={$buildOptions.charset}
      />
      <label for="opt-charset-utf8" class="hljs-string">"utf8"</label>
      <input
        type="radio"
        name="charset"
        id="opt-charset-ascii"
        value="ascii"
        bind:group={$buildOptions.charset}
      />
      <label for="opt-charset-ascii" class="hljs-string">"ascii"</label>
    </div>,
    ignoreAnnotations: <div class="option">
      <input
        id="opt-ignore-annotations"
        type="checkbox"
        bind:checked={$buildOptions.ignoreAnnotations}
      />
      <label for="opt-ignore-annotations" class="hljs-keyword"
        >{$buildOptions.ignoreAnnotations}</label
      >
    </div>,
    keepNames: <div class="option">
      <input id="opt-keep-names" type="checkbox" bind:checked={$buildOptions.keepNames} />
      <label for="opt-keep-names" class="hljs-keyword">{$buildOptions.keepNames}</label>
    </div>,
    sourcesContent: <div class="option">
      <input id="opt-sources-content" type="checkbox" bind:checked={$buildOptions.sourcesContent} />
      <label for="opt-sources-content" class="hljs-keyword">{$buildOptions.sourcesContent}</label>
    </div>,
    treeShaking: <div class="option">
      <input id="opt-tree-shaking" type="checkbox" bind:checked={$buildOptions.treeShaking} />
      <label for="opt-tree-shaking" class="hljs-keyword">{$buildOptions.treeShaking}</label>
    </div>,
&#125;)</pre>
</article>

<style>
  article {
    border: 1px solid rgba(127, 127, 127, 0.5);
    border-radius: var(--gap);
  }
  header {
    position: relative;
  }
  .expanded header {
    border-bottom: 1px solid rgba(127, 127, 127, 0.5);
  }
  header h2 {
    margin: 0;
    padding: calc(var(--gap) * 1.5);
    font: 14px/1.4 var(--mono);
    color: var(--fg);
    background-color: rgba(127, 127, 127, 0.1);
    cursor: pointer;
    user-select: none;
  }
  header i {
    position: absolute;
    top: 0;
    bottom: 0;
    right: calc(var(--gap) * 1.5);
    margin: auto;
    cursor: help;
  }
  .i-mdi-reload {
    right: calc(32px + var(--gap) * 1.5);
    cursor: pointer;
  }
  pre {
    max-height: calc(100vh - 96px);
    border: none;
    white-space: pre;
    cursor: text;
    overflow-x: auto;
  }
  pre input {
    display: inline-block;
    width: initial;
    margin: 0 0.25em;
    align-self: center;
  }
  pre input:first-child {
    margin-left: 0;
  }
  .option {
    display: inline-flex;
    align-items: baseline;
  }
  input[type],
  label {
    cursor: pointer;
  }
  input[type]:not(:checked) + label {
    user-select: none;
  }
  input[type="text"] {
    padding: 0 0.25em;
    border: 0;
    cursor: text;
    border-radius: 0;
    border-bottom: 1px solid transparent;
  }
  input[type="text"]:focus {
    border-bottom: 1px solid rgba(127, 127, 127, 0.5);
  }
  .hljs-hidden {
    width: 0;
    visibility: hidden;
  }
</style>
