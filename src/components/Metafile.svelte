<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<div class="download">
  <button on:click={() => dispatch('download')}>
    <i class="i-mdi-download" />
    <span>Download</span>
  </button>
  <button on:click={() => dispatch('analyze')}>
    <i class="i-mdi-eye-outline" />
    <span>Analyze this metafile</span>
  </button>
</div>

<style>
  .download {
    display: flex;
    justify-content: flex-end;
    margin: -6px 0 6px;
  }
  button {
    margin-left: 5px;
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    outline: 0;
    color: inherit;
    opacity: 0.5;
    font-size: 20px;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  button:hover {
    opacity: 1;
  }
  button span {
    font: 14px/20px sans-serif;
  }
</style>
