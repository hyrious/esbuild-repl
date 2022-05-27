<script lang="ts">
  import Transform from "./Transform.svelte";
  import Build from "./Build.svelte";
  import Playground from "./Playground.svelte";
  import { mode } from "../stores";
</script>

<main data-mode={$mode}>
  <Transform show={$mode === "transform"} />
  <Build show={$mode === "build"} />
  <Playground show={$mode === "playground"} />
</main>
