<script>
  import { loading, error } from "../../stores/esbuild";
  import { printError, printWarning } from "../../helpers/ansi";

  export let errors, warnings, elapsed;

  // prettier-ignore
  $: status =
      $loading                ? "loading"
    : $error || errors.length ? "error"
    : warnings.length         ? "warning"
    :                           "success";
</script>

<div class="status {status}">
  {#if status === "loading"}
    Loading esbuild&hellip;
  {:else if status === "success"}
    {#if elapsed}
      Finished in {elapsed}ms.
    {:else}
      Ready.
    {/if}
  {:else if status === "error"}
    {#if $error}
      {#await printError($error) then html}
        {@html html}
      {/await}
    {/if}
    {#if errors.length}
      {#await printError(errors) then html}
        {@html html}
      {/await}
    {/if}
  {:else if warnings.length}
    {#await printWarning(warnings) then html}
      {@html html}
    {/await}
  {/if}
</div>

<style>
  .status {
    padding: calc(var(--gap) * 1.5);
    font-family: var(--mono);
    font-size: x-small;
    white-space: pre-wrap;
    line-height: 140%;
    border-radius: var(--gap);
    background: rgba(127, 127, 127, 0.1);
    border: 1px solid rgba(127, 127, 127, 0.5);
    color: var(--pre);
  }
</style>
