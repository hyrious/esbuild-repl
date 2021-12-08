<script>
  import { onMount } from "svelte";

  export let value;
  export let placeholder;

  let input;

  function updateValue() {
    const result = input.value.split(",").filter(Boolean);
    if (result.length) {
      value = result;
    } else {
      value = undefined;
    }
  }

  onMount(() => {
    if (value) {
      input.value = value.join(",");
    }
  });
</script>

<input bind:this={input} on:change={updateValue} {placeholder} />
