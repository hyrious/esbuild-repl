<script>
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Repl from "./components/Repl.svelte";

  import mode from "./stores/mode";
  import { code, config } from "./stores/transform";
  import { modules, options } from "./stores/build";
  import { loading, version } from "./stores/esbuild";

  import {
    getQuery,
    updateQuery,
    updateStoresFromQuery,
  } from "./helpers/query";
  import { render } from "./helpers/ansi";

  onMount(() => updateStoresFromQuery(getQuery()));

  $: if (!$loading) {
    if ($mode === "build")
      updateQuery({ modules: $modules, options: $options }, $version);
    else if ($mode === "transform")
      updateQuery({ code: $code, config: $config }, $version);
  }
</script>

<Header />
<Repl />
