<script lang="ts">
  import { onMount } from "svelte";
  import Transform from "./Transform.svelte";
  import Build from "./Build.svelte";
  import Playground from "./Playground.svelte";
  import { mode, play } from "../stores";

  let tablet = false;

  onMount(() => {
    const is_tablet = window.matchMedia("(max-width: 768px)");
    tablet = is_tablet.matches;
    const listener = (e: MediaQueryListEvent) => {
      tablet = e.matches;
    };
    is_tablet.addEventListener("change", listener);
    return () => is_tablet.removeEventListener("change", listener);
  });
</script>

<main data-mode={$mode}>
  <Transform show={tablet ? !$play && $mode === "transform" : $mode === "transform"} />
  <Build show={tablet ? !$play && $mode === "build" : $mode === "build"} />
  <Playground show={$play} />
</main>
