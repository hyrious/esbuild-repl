<script>
  import { onMount } from "svelte";

  export let value;
  export let options;
  export let placeholder;

  let select;

  function updateValue() {
    if (select.value === "true") {
      value = true;
    } else if (select.value) {
      value = select.value;
    } else {
      value = undefined;
    }
  }

  onMount(() => {
    if (value) {
      select.value = value;
    }
  });
</script>

<select bind:this={select} on:change={updateValue}>
  {#each options as option}
    <option value={option}>{option || placeholder || ""}</option>
  {/each}
</select>

<style>
  select {
    color: var(--fg-on);
    font-family: var(--mono);
  }
</style>
