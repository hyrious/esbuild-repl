<script lang="ts">
  let selected = 0;
  let files = ["main.ts", "lib.ts", "package.json", "index.html"];

  function change_file(ev: Event) {
    const target = ev.target as HTMLInputElement;
    if (target instanceof HTMLInputElement && target.dataset.i) {
      selected = Number(target.dataset.i);
    }
  }
</script>

<div class="tabs" on:input={change_file}>
  {#each files as name, i}
    <label class="tab" class:active={i === selected}>
      <input type="radio" name="tabs" data-i={i} />
      <span>{name}</span>
      <button>&cross;</button>
    </label>
  {/each}
  <div class="splitter" />
  <slot />
</div>

<style>
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
  }
  .tab {
    padding: 0 calc(2 * var(--gap));
    border-right: 1px solid var(--border);
    display: inline-flex;
    align-items: center;
    height: 32px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }
  .active {
    position: relative;
    color: var(--fg-on);
    background-color: var(--bg);
    cursor: grab;
  }
  .active::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--bg);
  }
  .splitter {
    flex: 1;
  }
</style>
