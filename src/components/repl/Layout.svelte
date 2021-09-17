<script>
  import { outputs } from "../../stores/build";

  export let mode;
</script>

<div class="repl {mode}">
  <div class="left">
    {#if mode === "build"}
      <h3>ES6 modules go in&hellip;</h3>
    {/if}
    <div class="input">
      <slot name="input" />
    </div>
  </div>
  <div class="right">
    {#if mode === "build"}
      <h3>
        &hellip;{#if $outputs.length > 1}chunks come{:else}bundle comes{/if} out
      </h3>
    {/if}
    <div class="output">
      <slot name="output" />
    </div>
  </div>
</div>

<style>
  :global([data-mode="transform"] .repl.transform),
  :global([data-mode="build"] .repl.build) {
    display: grid;
  }
  .repl {
    display: none;
    grid-template-columns: 1fr 1fr;
    padding: var(--gap) calc(var(--gap) * 2);
    gap: calc(var(--gap) * 2);
    background-color: var(--bg);
  }
  @media screen and (max-width: 720px) {
    .repl {
      grid-template-columns: 1fr;
      gap: var(--gap);
    }
  }
  h3 {
    margin: 0;
    padding-bottom: var(--gap);
    font-weight: normal;
    font-size: 16px;
  }
  .input,
  .output {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
</style>
