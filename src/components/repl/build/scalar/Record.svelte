<script>
  import { onMount } from "svelte";

  export let record;
  export let placeholder;

  let textarea;

  function updateRecord() {
    let hasValue = false;
    const result = {};
    const lines = textarea.value.trim().split("\n");
    for (let line of lines) {
      const [key, value] = line.split("=");
      if (key && value) {
        result[key] = value;
        hasValue = true;
      }
    }
    if (hasValue) {
      record = result;
    } else {
      record = undefined;
    }
  }

  onMount(() => {
    if (record) {
      textarea.value = Object.entries(record)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
    }
  });
</script>

<textarea
  rows="1"
  bind:this={textarea}
  class="editor"
  {placeholder}
  on:change={updateRecord}
/>

<style>
  textarea {
    resize: none;
  }
</style>
