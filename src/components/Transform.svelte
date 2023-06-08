<script type="ts">
  import { mode, input, options } from '../stores'
  import Editor from './Editor.svelte'

  export let show = true

  let transform_options = $mode === 'transform' ? $options : ''
  $: if ($mode === 'transform') {
    $options = transform_options
  }
</script>

<div data-transform style={show ? '' : 'display: none'}>
  <Editor label="INPUT" bind:content={$input} rows={2} placeholder="(enter your code here)" />
  <Editor
    label="OPTIONS"
    bind:content={transform_options}
    placeholder="e.g. --minify or {'{'} minify: true {'}'}"
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
