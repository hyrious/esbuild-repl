<script>
  export let checked;

  $: indeterminate = typeof checked !== "boolean";
</script>

<label>
  <input type="checkbox" bind:checked {indeterminate} />
  <code>{String(checked)}</code>
</label>

<style>
  label {
    display: inline-flex;
    gap: var(--gap);
    align-items: center;
    cursor: pointer;
  }
  code {
    color: var(--fg-on);
  }
</style>
