<script lang="ts">
  import { onMount } from "svelte";
  import { scripts, status, theme } from "../stores";

  export let show = false;

  let iframe: HTMLIFrameElement;
  let waiting = true;

  $: iframe && iframe.contentWindow?.postMessage($theme, "*");
  $: iframe && iframe.contentWindow?.postMessage($scripts, "*");

  onMount(() => {
    const listener = (ev: MessageEvent) => {
      if (ev.data === "ready") {
        waiting = false;
        iframe.contentWindow!.postMessage($theme, "*");
        iframe.contentWindow!.postMessage($scripts, "*");
        return;
      }
      if (typeof ev.data === "string" && ev.data.startsWith("error:")) {
        const data = ev.data.slice(6);
        const index = data.indexOf("|");
        if (index === -1) return;
        const name = data.slice(0, index);
        const message = data.slice(index + 1);
        $status = `${name}: ${message}`;
        return;
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  });
</script>

<div class="playground-wrapper" style:display={show ? "" : "none"}>
  <div class="placeholder" style:display={waiting ? "" : "none"}>Bundling&hellip;</div>
  <iframe
    width="0"
    class="playground"
    style:display={waiting ? "none" : ""}
    bind:this={iframe}
    title="playground"
    sandbox="allow-same-origin allow-scripts"
    frameborder="0"
    src="play.html"
  />
</div>

<style>
  .playground-wrapper {
    flex: 1;
    padding: var(--gap);
    display: flex;
  }
  .placeholder,
  .playground {
    flex: 1;
    border-radius: var(--gap);
    border: 1px solid rgba(127, 127, 127, 0.5);
    background-color: var(--bg-on);
  }
  .placeholder {
    padding: 8px;
  }
  @media screen and (max-width: 720px) {
    .playground-wrapper {
      padding: 0;
    }
  }
</style>
