<script lang="ts">
  export let title: string
  export let content: string
</script>

<div>
  <button {title} on:click>
    <i class="i-mdi-eye-outline" />
    <span>{content}</span>
  </button>
</div>

<style>
  div {
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
