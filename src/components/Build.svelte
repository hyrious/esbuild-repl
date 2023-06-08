<script lang="ts">
  import { query_selector_all, tick } from 'svelte/internal'
  import { send_input } from '../helpers/dom'
  import { mode, files, options } from '../stores'
  import Editor from './Editor.svelte'

  export let show = true

  const default_options = "{\n\toutdir: '/',\n\tbundle: true,\n\tformat: 'esm',\n\tsplitting: true\n}"
  let build_options = ($mode === 'build' && $options) || default_options
  $: if ($mode === 'build') {
    $options = build_options
  }

  function reset_options() {
    build_options = default_options
    send_input('article[data-label="OPTIONS"] textarea.editor')
  }

  let new_file_name = 'entry.js'
  $: if ($files) {
    const filenames = new Set<string>()
    for (const { path } of $files) filenames.add(path)
    if (!filenames.has('entry.js')) new_file_name = 'entry.js'
    else
      for (let i = 1; i < 100; i++) {
        const name = `file${i === 1 ? '' : i}.js`
        if (!filenames.has(name)) {
          new_file_name = name
          break
        }
      }
  }

  function new_file() {
    $files.push({
      path: new_file_name,
      content: '',
      entry: new_file_name === 'entry.js',
    })
    $files = $files
    tick().then(() => {
      const inputs = query_selector_all('[data-label="INPUT"] input')
      const last = inputs[inputs.length - 1] as HTMLInputElement | undefined
      if (last) {
        last.focus()
        last.select()
      }
    })
  }

  function remove_file(index: number) {
    $files.splice(index, 1)
    $files = $files
  }

  function npm_install() {
    const name = prompt('Enter package name:')
    if (!name) return

    console.log('TODO: install', name)
  }
</script>

<div data-build style={show ? '' : 'display: none'}>
  <Editor
    bind:content={build_options}
    label="OPTIONS"
    rows={build_options.split('\n').length}
    placeholder="e.g. --minify or {'{'} minify: true {'}'}"
  >
    <aside class:show={build_options !== default_options} slot="header">
      <button on:click={reset_options} title="reset options">
        <i class="i-mdi-reload" />
      </button>
    </aside>
  </Editor>
  {#each $files as { entry, path, content }, i}
    <Editor
      bind:entry
      bind:name={path}
      bind:content
      on:remove={() => remove_file(i)}
      header
      rows={2}
      label="INPUT"
      placeholder="(enter your code here)"
    />
  {/each}
  <footer>
    <button on:click={new_file}>
      <i class="i-mdi-plus" />
      <span>{new_file_name}</span>
    </button>
    <button on:click={npm_install}>
      <i class="i-mdi-bash" />
      <span>npm i &hellip;</span>
    </button>
  </footer>
</div>

<style>
  aside {
    position: absolute;
    display: inline-flex;
    top: 1px;
    right: 100%;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  aside:hover,
  aside.show {
    opacity: 1;
  }
  button {
    position: relative;
    display: inline-flex;
    align-items: center;
    appearance: none;
    background: none;
    height: 20px;
    border: none;
    padding: 0 1px;
    margin-bottom: 10px;
    outline: none;
    font: var(--code-font);
    color: var(--fg);
    opacity: 0.5;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  button:hover {
    opacity: 1;
  }
  button i {
    font-size: 20px;
  }
  footer {
    display: flex;
    flex-direction: column;
  }
  footer button i {
    position: absolute;
    right: 100%;
  }
</style>
