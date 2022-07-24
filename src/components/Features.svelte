<script lang="ts">
  import { detect } from "../helpers/feat";
  import { esbuild, status } from "../stores/index";
  import { input as code, optionsObj as options, result } from "../stores/transform";

  let phase: "idle" | "detecting" | "detected";
  let features: string[] = [];

  async function detect_features() {
    if (!$esbuild) return;
    phase = "detecting";
    let task = detect($esbuild, $code, $options);
    task.then((feats) => {
      features = feats;
      phase = "detected";
    });
    task.catch((err) => {
      $status = err.message;
      phase = "idle";
      features = [];
    });
  }

  $: if ($result) {
    phase = "idle";
    features = [];
  }
</script>

<aside class="features">
  {#if phase !== "detected"}
    <button disabled={!$esbuild || phase === "detecting"} on:click={detect_features}>
      {#if phase === "detecting"}Detecting{:else}Detect{/if} Features
    </button>
  {:else}<pre class="features-result">Features:
{features.length ? features.join("\n") : "None"}</pre>{/if}
</aside>

<style>
  aside {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--gap);
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
    border: none;
    border-radius: var(--gap);
    outline: none;
    background-color: rgba(127, 127, 127, 0.1);
    color: var(--fg);
    padding: calc(var(--gap) * 2) calc(var(--gap) * 2);
    cursor: pointer;
    line-height: 1;
  }
  button:disabled {
    cursor: progress;
  }
  button:not(:disabled):hover {
    --fg: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.2);
  }
  button:not(:disabled):active {
    --fg: var(--fg-on);
    background-color: rgba(127, 127, 127, 0.1);
  }
</style>
