<script type="ts">
  import { input, options } from '../stores'
  import Editor from './Editor.svelte'

  export let show = true
</script>

<div data-transform style={show ? '' : 'display: none'}>
  <Editor label="INPUT" bind:content={$input} rows={2} placeholder="(enter your code here)" />
  <Editor label="OPTIONS" bind:content={$options} placeholder="e.g. --minify or {'{'} minify: true {'}'}" />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
