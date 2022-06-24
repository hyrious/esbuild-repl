<script lang="ts">
  import type { Loader } from "esbuild";
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
  import { isBrowser, isMobile } from "../helpers";
  import { hljs_action } from "../helpers/hljs";
  import { getCodeMirror } from "../behaviors/get-codemirror";
  import { mode } from "../stores";

  export let name = "";
  export let contents = "";
  export let isEntry = false;
  export let readonly = false;

  let CodeMirror: typeof import("codemirror") | undefined;
  let editor: CodeMirror.Editor | undefined;
  let editorEl: HTMLTextAreaElement | undefined;
  let previousContents = contents;
  let loader: Loader;

  $: loader = name.endsWith(".css") ? "css" : name.endsWith(".map") ? "json" : "js";
  $: if (CodeMirror && editor && name) {
    const m = /.+\.([^.]+)$/.exec(name);
    const info = CodeMirror.findModeByExtension((m && m[1]) || "js");
    if (info) {
      editor.setOption("mode", info.mime);
    }
  }

  const dispatch = createEventDispatcher();

  function focus_editor() {
    if (editor) {
      editor.focus();
      editor.setCursor(editor.lineCount(), 9999);
    }
  }

  onMount(async () => {
    if (!editorEl) return;
    ({ default: CodeMirror } = await getCodeMirror());

    editor = CodeMirror.fromTextArea(editorEl, {
      lineNumbers: true,
      lineWrapping: true,
      indentWithTabs: true,
      indentUnit: 2,
      tabSize: 2,
      dragDrop: false,
      value: contents,
      mode: loader === "js" ? "javascript" : loader,
      readOnly: readonly,
    });

    editor.on("change", (instance) => {
      contents = instance.getValue();
      previousContents = contents;
    });

    editor.setValue(contents);
  });

  onDestroy(() => {
    editor && (editor as any).toTextArea();
  });

  $: if (previousContents !== contents && editor) {
    previousContents = contents;
    editor.setValue(contents);
  }

  $: if ($mode && editor) {
    tick().then(editor.refresh.bind(editor));
  }
</script>

<article class="module" class:is-entry={isEntry}>
  <header>
    {#if readonly}
      <input placeholder="main.js" spellcheck="false" value={name} readonly />
    {:else}
      <input placeholder="main.js" spellcheck="false" bind:value={name} />
      <button class="remove" on:click={() => dispatch("remove")}>
        <span class="label">remove</span>
        <i class="i-mdi-close" />
      </button>
      <button class="entry" on:click={() => (isEntry = !isEntry)}>
        <span class="label">(entry&nbsp;module)</span>
        <i class={isEntry ? "i-mdi-minus" : "i-mdi-plus"} />
      </button>
    {/if}
  </header>
  {#if isBrowser && !isMobile && !readonly}
    <div class="codemirror-container" on:click|self={focus_editor}>
      <textarea tabindex="0" value={contents} bind:this={editorEl} />
    </div>
  {:else if readonly}
    <pre class="chunk" use:hljs_action={{ code: contents, loader }} />
  {:else}
    <textarea class="editor" rows="2" spellcheck="false" bind:value={contents} />
  {/if}
</article>

<style>
  article {
    border: 1px solid rgba(127, 127, 127, 0.5);
    border-radius: var(--gap);
    overflow: hidden;
  }
  header {
    position: relative;
    border-bottom: 1px solid rgba(127, 127, 127, 0.5);
  }
  input {
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    outline: none;
    font: 14px/1.4 var(--mono);
    background-color: rgba(127, 127, 127, 0.1);
    padding: calc(var(--gap) * 1.5);
    cursor: text;
    line-height: 1;
  }
  input[readonly] {
    color: var(--fg);
  }
  input:not([readonly]):focus {
    background-color: rgba(0, 0, 0, 0.1);
  }
  textarea {
    border: 0;
  }
  pre {
    max-height: calc(100vh - 96px);
    border: none;
    white-space: pre-wrap;
    word-break: break-all;
    cursor: text;
  }
  button {
    position: absolute;
    border: none;
    padding: 0.3em;
    outline: none;
    right: 0;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    color: var(--fg);
    opacity: 0.4;
    transition: opacity 0.2s;
    line-height: 1;
    cursor: pointer;
  }
  button:hover {
    opacity: 1;
  }
  .label {
    position: absolute;
    right: 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  button:hover .label,
  .is-entry .entry .label {
    opacity: 0.6;
  }
  .remove {
    --fg: var(--red);
    top: 0;
  }
  .entry {
    bottom: 0;
  }
  .codemirror-container {
    min-height: 48px;
    background-color: var(--bg);
    cursor: text;
  }
</style>
