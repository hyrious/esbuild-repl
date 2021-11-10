<script>
  import { onMount } from "svelte";

  export let value;
  export let placeholder;

  let input;

  function updateValue() {
    value = input.value;
  }

  onMount(() => {
    if (value) {
      input.value = value;
    }
  });
</script>

<input bind:this={input} on:change={updateValue} {placeholder} />
