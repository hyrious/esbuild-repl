<script lang="ts">
  let selected = 0;
  let files = ["main.ts", "lib.ts", "package.json", "index.html"];

  function change_file(ev: Event) {
    const target = ev.target as HTMLInputElement;
    if (target instanceof HTMLInputElement && target.dataset.i) {
      selected = Number(target.dataset.i);
    }
  }

  function close_file(ev: Event) {
    const btn = ev.currentTarget as HTMLButtonElement;
    if (btn && btn.dataset.i) {
      const i = Number(btn.dataset.i);
      files = files.filter((_, j) => j !== i);
      if (selected && i < selected) {
        selected--;
      } else if (i === selected) {
        selected = 0;
      }
    }
  }
</script>

<div class="tabs" on:input={change_file}>
  {#each files as name, i}
    <label class="tab" class:active={i === selected}>
      <input class="tab-input" type="radio" name="tabs" checked={i === selected} data-i={i} />
      <span class="filename">{name}</span>
      <button class="btn close" data-i={i} on:click={close_file}>
        <i class="i-mdi-close" />
      </button>
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
    padding: 0 var(--gap) 0 calc(2 * var(--gap));
    border-right: 1px solid var(--border);
    display: inline-flex;
    align-items: center;
    height: 32px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }
  .tab-input {
    display: none;
  }
  .filename {
    padding-right: var(--gap);
  }
  .i-mdi-close {
    pointer-events: none;
  }
  .btn {
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 2px;
    padding: 0;
    appearance: none;
    cursor: pointer;
    user-select: none;
    background-color: var(--bg);
    -webkit-user-select: none;
    opacity: 0;
    transition: opacity 0.3s, background-color 0.3s;
  }
  .btn:hover {
    opacity: 1;
    background-color: var(--bg-on);
  }
  .active {
    position: relative;
    color: var(--fg-on);
    background-color: var(--bg);
    cursor: grab;
  }
  .active .btn {
    opacity: 1;
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
