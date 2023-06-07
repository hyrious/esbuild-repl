<script lang="ts">
  import { files, options } from '../stores'
  import Editor from './Editor.svelte'

  export let show = true
</script>

<div data-build style={show ? '' : 'display: none'}>
  {#each $files as { entry, path, content }}
    <Editor
      bind:entry
      bind:name={path}
      bind:content
      header
      rows={2}
      label="INPUT"
      placeholder="(enter your code here)"
    />
  {/each}
</div>
