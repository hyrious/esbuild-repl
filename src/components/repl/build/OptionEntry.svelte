<script>
  import Boolean from "./scalar/Boolean.svelte";
  import List from "./scalar/List.svelte";
  import Record from "./scalar/Record.svelte";
  import Select from "./scalar/Select.svelte";
  import Text from "./scalar/Text.svelte";

  export let name;
  export let type;
  export let value;
  export let options;
  export let placeholder;
</script>

<a href={`https://esbuild.github.io/api/#${name}`} target="_blank">
  <code>{name}</code>
</a>
{#if type === "boolean"}
  <Boolean bind:checked={value} />
{:else if type === "record"}
  <Record bind:record={value} {placeholder} />
{:else if type === "list"}
  <List bind:value {placeholder} />
{:else if type === "select"}
  <Select bind:value {options} {placeholder} />
{:else if type === "text"}
  <Text bind:value {placeholder} />
{/if}

<style>
  a {
    justify-self: right;
  }
  code {
    white-space: nowrap;
  }
</style>
