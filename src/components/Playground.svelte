<script lang="ts">
  import { files, html } from "../stores/playground";
  import FileSelector from "./FileSelector.svelte";
  import SplitPane from "./SplitPane.svelte";

  export let show = true;

  let selected: "index.html" | number = "index.html";

  let started = false;
  let iframe: HTMLIFrameElement;

  $: index = $files.findIndex((file) => file.uid === selected);
</script>

<SplitPane {show}>
  <section slot="left">
    <FileSelector bind:selected />
    {#if selected === "index.html"}
      <textarea class="editor" rows="2" spellcheck="false" bind:value={$html} />
    {:else if $files[index]}
      <textarea class="editor" rows="2" spellcheck="false" bind:value={$files[index].contents} />
    {/if}
  </section>
  <section class="preview" slot="right">
    <h3>Preview</h3>
    <iframe
      title="Preview"
      bind:this={iframe}
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
      srcdoc={$html}
    />
  </section>
</SplitPane>

<style>
  h3 {
    margin: 0;
    font-weight: normal;
    font-size: 16px;
    line-height: 36px;
    border-bottom: 1px solid rgba(127, 127, 127, 0.25);
    font-family: var(--mono);
    font-size: 14px;
    display: flex;
  }
  iframe {
    flex: 1;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(127, 127, 127, 0.5);
    display: block;
  }
  .preview {
    position: absolute;
    inset: 0;
    display: flex;
    flex-flow: column nowrap;
  }
</style>
