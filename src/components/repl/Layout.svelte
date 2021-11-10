<script>
  import Options from "./build/Options.svelte";
  import { modules, outputs } from "../../stores/build";
  import { DefaultModule } from "../../helpers/query";

  export let mode;

  let optionsOpen = false;

  function startOver() {
    $modules = [{ ...DefaultModule }];
  }

  function toggleOptions() {
    optionsOpen = !optionsOpen;
  }

  function closeOptions() {
    optionsOpen = false;
  }
</script>

<div class="repl {mode}">
  <div class="left">
    {#if mode === "build"}
      <h3>
        <span>ES6 modules go in&hellip;</span>
        <button on:click={startOver}>Start over</button>
      </h3>
    {/if}
    <div class="input">
      <slot name="input" />
    </div>
  </div>
  <div class="right">
    {#if mode === "build"}
      <h3>
        <span>&hellip;{#if $outputs.length > 1}chunks come{:else}bundle comes{/if} out</span>
        <button class:open={optionsOpen} on:click={toggleOptions}>Options</button>
        <Options open={optionsOpen} on:close={closeOptions} />
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
    display: grid !important;
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
    line-height: 32px;
    position: relative;
  }
  h3 button {
    position: absolute;
    right: 0;
    border: none;
    border-radius: var(--gap);
    outline: none;
    background-color: rgba(127, 127, 127, 0.1);
    color: var(--fg);
    padding: calc(var(--gap) * 1.5) calc(var(--gap) * 2);
    display: inline;
    cursor: pointer;
    line-height: 1;
  }
  h3 button:hover {
    color: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.2);
    outline: 1px solid var(--highlight);
    outline-offset: 2px;
  }
  h3 button:active,
  h3 button.open {
    color: var(--black);
    background-color: var(--highlight);
  }
  .input,
  .output {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
</style>
