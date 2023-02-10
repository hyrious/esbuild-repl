<script lang="ts">
  import { tick } from "svelte";
  import { EsbuildFlags } from "@hyrious/esbuild-dev/args";
  import { match_trace } from "@hyrious/fuzzy-match";
  import { hljs_action } from "../helpers/hljs";
  import { loading } from "../stores";
  import { errorsHTML, input as code, loader, options, result } from "../stores/transform";
  // ^ "input as code" see https://github.com/sveltejs/svelte/issues/5712
  // seems you can not use an import name the same as html tags
  import SplitPane from "./SplitPane.svelte";
  import Features from "./Features.svelte";
  import TextWithStops from "./TextWithStops.svelte";

  export let show = true;

  let url = new URL("https://evanw.github.io/source-map-visualization");
  function view_sourcemap() {
    let code = result_code || "";
    let map = $result.map || "";
    let data = [code.length, "\0", code, map.length, "\0", map].join("");
    url.hash = btoa(data);
    window.open(url, "_blank");
  }

  let completing = [0, 0];

  const non_space = /\S/;
  function update_hint(ev: Event & { currentTarget: HTMLInputElement }) {
    const input = ev.currentTarget;
    const j = input.selectionStart;
    if (j && non_space.test(input.value[j - 1])) {
      const i = input.value.lastIndexOf(" ", j - 1) + 1;
      const pattern = input.value.slice(i, j);
      if (pattern.length) {
        completing = [i, j];
        return refresh_hint(pattern);
      }
    }
    refresh_hint();
  }

  let hints: Array<{ score: number; flag: string; stops: number[] }> = [];
  const flags = Array.from(new Set(EsbuildFlags.map((e) => "--" + e[0])));
  function refresh_hint(pattern?: string) {
    hints = [];
    if (!pattern) return;
    for (const flag of flags) {
      const trace = match_trace(pattern, flag);
      if (trace) {
        hints.push({ flag, ...trace });
      }
    }
    hints.sort((a, b) => b.score - a.score);
  }

  async function complete(ev: MouseEvent & { currentTarget: HTMLButtonElement }) {
    const [i, j] = completing;
    const completion = ev.currentTarget.textContent!;
    $options = $options.slice(0, i) + completion + $options.slice(j);
    hints = [];
    await tick();
    const input = document.querySelector(".input input") as HTMLInputElement | null;
    if (input) {
      input.focus();
      const caret = i + completion.length;
      input.setSelectionRange(caret, caret);
    }
  }

  function complete_tab(ev: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (ev.key === "Tab") {
      const first_completion = document.querySelector(".hint button") as HTMLButtonElement | null;
      if (first_completion) {
        ev.preventDefault();
        first_completion.click();
      }
    }
  }

  $: result_code = $loading ? "// initializing" : $result.code;
</script>

<SplitPane {show}>
  <section slot="left" class="input">
    <textarea class="editor" rows="2" spellcheck="false" bind:value={$code} />
    <input
      placeholder="--loader=js"
      spellcheck="false"
      autocomplete="off"
      bind:value={$options}
      on:input={update_hint}
      on:keydown={complete_tab}
    />
    <ul class="hint">
      {#each hints as { flag, stops }}
        <li>
          <button on:click={complete} title="input it">
            <TextWithStops text={flag} {stops} />
          </button>
          <a
            href={"https://esbuild.github.io/api/#" + flag.slice(2)}
            target="_blank"
            rel="noreferrer"
            title="document"
          >
            <i class="i-mdi-link-variant" />
          </a>
        </li>
      {/each}
    </ul>
  </section>
  <section slot="right" class="output">
    {#if result_code}
      <pre class="result code" use:hljs_action={{ code: result_code, loader: $loader }} />
    {/if}
    {#if $result.legalComments}
      <pre
        class="result legal-comments hljs-comment"
        title="legal comments">{$result.legalComments}</pre>
    {/if}
    {#if $result.map}
      <pre class="result map" use:hljs_action={{ code: $result.map, loader: "json" }} />
      <button class="btn" on:click={view_sourcemap}>Visualize Source Map</button>
    {/if}
    {#if $errorsHTML}
      <pre class="result error">{@html $errorsHTML}</pre>
    {/if}
    {#if result_code}
      <Features />
    {/if}
  </section>
</SplitPane>

<style>
  .result {
    cursor: text;
  }
  .code {
    white-space: pre-wrap;
    word-break: break-all;
  }
  .error {
    font-size: 12px;
    white-space: pre-wrap;
  }
  .hint {
    margin: 0;
    padding: 0 calc(var(--gap) * 1.5 + 1px);
    list-style-type: none;
    font: 14px/1.4 var(--mono);
  }
  .hint button {
    appearance: none;
    outline: none;
    margin: 0;
    border: 0;
    padding: 0;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
</style>
