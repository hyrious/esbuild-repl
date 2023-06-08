<div class="visualize-sourcemap">
  <button title="evanw/source-map-visualization" on:click>Visualize this source map</button>
</div>

<style>
  .visualize-sourcemap {
    display: flex;
    margin: -6px 0 6px;
    color: var(--fg);
    font-size: 12px;
    text-decoration: underline;
  }
  .visualize-sourcemap button {
    margin-left: auto;
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    outline: 0;
    color: inherit;
    opacity: 0.5;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  .visualize-sourcemap button:hover {
    opacity: 1;
  }
</style>
