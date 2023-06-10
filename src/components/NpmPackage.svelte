<script lang="ts">
  import { files, installed, type InstalledPackage } from '../stores'

  export let name = ''
  export let version = ''
  export let size = 0

  function npm_browser() {
    const url = `https://hyrious.me/npm-browser/?q=${name}@${version}`
    window.open(url, '_blank')
  }

  $: index = $installed.findIndex((e) => e.name === name)

  function uninstall() {
    if (index >= 0) {
      $installed.splice(index, 1)
      $installed = $installed
    }
  }

  let exploding: InstalledPackage | null = null
  let exp_list: string[] = []
  let exp_selected = ''

  function explode() {
    if (!size) return
    exploding = $installed[index]
    exp_selected = 'package.json'
    exp_list = []
  }

  function unexplode() {
    exploding = null
    exp_selected = ''
    exp_list = []
  }

  function exp_list_add() {
    if (exp_selected && !exp_list.includes(exp_selected)) {
      exp_list.push(exp_selected)
      exp_list = exp_list
    }
  }

  function exp_list_sub(event: Event) {
    const button = event.currentTarget as HTMLElement
    const path = button.dataset?.path
    if (path) {
      const index = exp_list.indexOf(path)
      if (index >= 0) {
        exp_list.splice(index, 1)
        exp_list = exp_list
      }
    }
  }

  function do_explode() {
    if (exploding == null) return
    if (exp_list.length === 0) return unexplode()

    const todo = new Set(exp_list)
    for (const { path, content } of exploding.files) {
      if (todo.has(path)) {
        $files.push({ entry: false, path: `node_modules/${exploding.name}/${path}`, content })
      }
    }
    uninstall()
    $files = $files
    unexplode()
  }
</script>

<div class="npm-package" class:not-installed={index < 0}>
  {#if index >= 0}
    <i class="i-mdi-package-variant-closed-check" title={size ? size + ' files' : ''} />
  {:else}
    <i class="i-mdi-package-variant-closed-plus" />
  {/if}
  <a class="npm-package__name" href="https://www.npmjs.com/package/{name}" target="_blank" rel="noreferrer">
    {name}
  </a>
  <span class="npm-package__version">{version}</span>
  {#if index >= 0}
    <button class="view" title="view package content" on:click={npm_browser}>
      <i class="i-mdi-eye-outline" />
    </button>
    <button class="open" title="explode this package" on:click={explode}>
      <i class="i-mdi-package-variant" />
    </button>
    <button class="remove" title="uninstall {name}" disabled={!size} on:click={uninstall}>
      <i class="i-mdi-package-variant-closed-remove" />
    </button>
  {/if}
  {#if exploding}
    <dialog open>
      <h3>
        <span>Select files to extract:</span>
        <button title="cancel" on:click={unexplode}>
          <i class="i-mdi-close" />
        </button>
      </h3>
      <article>
        <select bind:value={exp_selected}>
          {#each exploding.files as { path } (path)}
            <option value={path}>{path}</option>
          {/each}
        </select>
        <button on:click={exp_list_add}>
          <i class="i-mdi-plus" />
          <span>Add into list</span>
        </button>
      </article>
      <ul>
        {#each exp_list as path (path)}
          <li>
            <button class="remove" title="remove this file" data-path={path} on:click={exp_list_sub}>
              <i class="i-mdi-file-remove-outline" />
            </button>
            <span>{path}</span>
          </li>
        {/each}
      </ul>
      <footer>
        <button on:click={do_explode}>
          <span>Extract</span>
        </button>
        <button on:click={unexplode}>
          <span>Cancel</span>
        </button>
      </footer>
    </dialog>
  {/if}
</div>

<style>
  button {
    appearance: none;
    display: inline-flex;
    background: transparent;
    border: none;
    padding: 0;
    margin-left: 5px;
    cursor: pointer;
    color: inherit;
    font-size: 20px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  button span {
    font: 14px/20px sans-serif;
    white-space: nowrap;
  }
  button:hover {
    opacity: 1;
  }
  button.remove {
    color: #e24834;
  }
  dialog {
    position: absolute;
    top: 20px;
    inset-inline: 0;
    max-width: 400px;
    z-index: 10;
    background: var(--bg);
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);
  }
  dialog h3 {
    margin: 0 0 5px;
    font: 14px/20px sans-serif;
    font-weight: 700;
  }
  dialog h3 button {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  dialog ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  dialog ul li {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font: 14px/20px sans-serif;
    list-style-type: none;
  }
  dialog ul li button {
    margin-left: 0;
    margin-right: 5px;
  }
  dialog ul li span {
    width: 100%;
  }
  dialog article {
    display: flex;
    margin-bottom: 5px;
  }
  dialog article select {
    width: 100%;
    font: 14px/20px sans-serif;
  }
  dialog footer {
    display: flex;
    justify-content: flex-end;
  }
  .npm-package {
    display: flex;
    align-items: center;
    font: 14px/20px sans-serif;
    margin-bottom: 10px;
    padding: 0 1px;
    position: relative;
  }
  .not-installed {
    transform: translateX(20px);
    opacity: 0.5;
  }
  .npm-package > i {
    position: absolute;
    right: 100%;
    font-size: 20px;
  }
  .npm-package__name {
    text-decoration: none;
  }
  .npm-package__name:hover {
    text-decoration: underline;
  }
  .npm-package__version {
    flex-grow: 1;
    opacity: 0.5;
    font-variant-numeric: tabular-nums;
  }
  .npm-package__version::before {
    content: '@';
  }
  .i-mdi-package-variant-closed-check {
    cursor: help;
  }
</style>
