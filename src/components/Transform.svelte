<script type="ts">
  import { input, options } from '../stores'

  export let show = true
</script>

<div data-transform style={show ? '' : 'display: none'}>
  <textarea class="editor" rows="2" bind:value={$input} />
  <textarea
    class="editor"
    rows="1"
    bind:value={$options}
    placeholder="e.g. --minify or {'{'} minify: true {'}'}"
  />
</div>

<style>
  textarea {
    appearance: none;
    resize: none;
    width: 100%;
    height: 100%;
    font: var(--code-font);
    background: var(--pre);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 8px;
    color: var(--fg);
  }
  textarea:not(:last-child) {
    margin-bottom: 10px;
  }
  textarea:focus {
    outline: none;
    border-color: var(--fg);
    color: var(--fg-on);
  }
</style>
