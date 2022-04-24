<script lang="ts">
  import Footer from "../components/Footer.svelte";
  import SplitPane from "../components/SplitPane.svelte";
  import { clamp } from "../helpers";
  import { version } from "../stores";
  import Editor from "./Editor.svelte";
  import Explorer from "./Explorer.svelte";
  import Preview from "./Preview.svelte";
  import Tabs from "./Tabs.svelte";

  let width = 255;
  let dragging = false;
  let show_explorer = true;
  let show_preview = false;

  function drag(node: HTMLElement, callback: (ev: PointerEvent) => void) {
    const down = (ev: PointerEvent) => {
      if (!ev.isPrimary) return;

      ev.preventDefault();
      dragging = true;

      const up = () => {
        dragging = false;
        window.removeEventListener("pointermove", callback, false);
        window.removeEventListener("pointerup", up, false);
      };

      window.addEventListener("pointermove", callback, false);
      window.addEventListener("pointerup", up, false);
    };

    node.addEventListener("pointerdown", down);

    return {
      destroy() {
        node.removeEventListener("pointerdown", down);
      },
    };
  }

  function move_divider(ev: PointerEvent) {
    width = clamp(ev.clientX, 50, window.innerWidth - 50);
  }
</script>

<main class="full">
  <div class="left" style:display={show_explorer ? "" : "none"} style="width:{width}px">
    <Explorer />
  </div>
  <div class="right">
    <Tabs>
      <button class="refresh-preview" style:display={show_preview ? "" : "none"}>Refresh</button>
      <label class="toggle-preview" class:active={show_preview} for="toggle-preview">
        <input type="checkbox" name="preview" id="toggle-preview" bind:checked={show_preview} />
        <span>Preview</span>
      </label>
    </Tabs>
    <div class="right-contents">
      <SplitPane show_right={show_preview} show_divider>
        <Editor slot="left" />
        <Preview slot="right" />
      </SplitPane>
    </div>
  </div>
  <div class="divider" style="left:{width - 8}px" use:drag={move_divider} />
  <div class="cat" style:display={dragging ? "" : "none"} />
</main>
<Footer size="small">
  <input id="toggle-explorer" class="btn" type="checkbox" bind:checked={show_explorer} />
  <label for="toggle-explorer" title="Toggle Sidebar">
    <i class="i-ph-sidebar-simple-fill" />
  </label>
  <span class="footer-right" slot="right">
    esbuild@{$version}
  </span>
</Footer>

<style>
  .full {
    position: relative;
    padding: 0;
  }
  .left,
  .right {
    overflow: hidden;
  }
  .left {
    border-right: 1px solid var(--border);
  }
  .right {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
  }
  .right-contents {
    flex: 1;
  }
  .toggle-preview,
  .refresh-preview {
    appearance: none;
    border: 0;
    border-radius: 0;
    color: var(--fg);
    padding: 0 calc(2 * var(--gap));
    display: inline-flex;
    align-items: center;
    background-color: var(--bg);
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }
  .toggle-preview:hover,
  .refresh-preview:hover {
    background-color: var(--bg-on);
  }
  .toggle-preview.active,
  .refresh-preview:active {
    color: var(--fg-on);
  }
  .divider {
    display: block;
    position: absolute;
    height: 100%;
    padding-inline: 8px;
    inline-size: 0;
    cursor: col-resize;
    z-index: 10;
  }
  .divider::after {
    content: "";
    position: absolute;
    inset-inline-start: 6px;
    inset-block-start: 0;
    inline-size: 4px;
    block-size: 100%;
    background-color: var(--fg);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .divider:hover::after {
    opacity: 1;
  }
  .cat {
    position: absolute;
    inset: 0;
  }
  .btn[type="checkbox"] {
    display: none;
  }
  .btn[type="checkbox"] + label {
    padding: 0 4px;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }
  .btn[type="checkbox"] + label i {
    color: var(--fg);
  }
  .btn[type="checkbox"] + label:hover i {
    color: var(--fg-on);
  }
  .footer-right {
    padding-right: var(--gap);
  }
</style>
