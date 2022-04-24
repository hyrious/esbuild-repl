<script>
  export let contents = "";
</script>

<textarea class="editor" rows="2" spellcheck="false" bind:value={contents} />

<style>
  .editor {
    border-width: 0;
    border-radius: 0;
    height: 100%;
    font-size: 12px;
    background-color: var(--bg);
  }
</style>
