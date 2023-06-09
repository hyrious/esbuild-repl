<div class="download">
  <button on:click>
    <i class="i-mdi-download" />
    <span>Download this file</span>
  </button>
</div>

<style>
  .download {
    display: flex;
    margin: -6px 0 6px;
  }
  button {
    margin-left: auto;
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    outline: 0;
    color: inherit;
    opacity: 0.5;
    font-size: 20px;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  button:hover {
    opacity: 1;
  }
  button span {
    font: 14px/20px sans-serif;
  }
</style>
