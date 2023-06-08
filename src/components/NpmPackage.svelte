<script lang="ts">
  import { installed } from '../stores'

  export let name = ''
  export let version = ''
  export let size = 0

  function npm_browser() {
    const url = `https://hyrious.me/npm-browser/?q=${name}@${version}`
    window.open(url, '_blank')
  }

  function uninstall() {
    const index = $installed.findIndex((e) => e.name === name)
    if (index >= 0) {
      $installed.splice(index, 1)
      $installed = $installed
    }
  }
</script>

<div class="npm-package">
  <i class="i-mdi-package-variant-closed-check" title={size ? size + ' files' : ''} />
  <a class="npm-package__name" href="https://www.npmjs.com/package/{name}" target="_blank" rel="noreferrer">
    {name}
  </a>
  <span class="npm-package__version">{version}</span>
  <button class="view" title="view package content" on:click={npm_browser}>
    <i class="i-mdi-eye-outline" />
  </button>
  <button class="remove" title="uninstall {name}" on:click={uninstall}>
    <i class="i-mdi-package-variant-closed-remove" />
  </button>
</div>

<style>
  button {
    appearance: none;
    display: inline-flex;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin-left: 5px;
    cursor: pointer;
    color: inherit;
    font-size: 20px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  button:hover {
    opacity: 1;
  }
  button.remove {
    color: #e24834;
  }
  .npm-package {
    display: flex;
    align-items: center;
    font: 14px/20px sans-serif;
    margin-bottom: 10px;
    padding: 0 1px;
    position: relative;
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
