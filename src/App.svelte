<script lang="ts">
  import Header from "./components/Header.svelte";
  import Repl from "./components/Repl.svelte";
  import Footer from "./components/Footer.svelte";
  import Debug from "./components/Debug.svelte";
  import { debug } from "./stores";
</script>

<Header />
<Repl />
<Footer />
{#if $debug}<Debug />{/if}

<style>
  :global(#app) {
    display: flex;
    flex-grow: 1;
    flex-flow: column nowrap;
    overflow: hidden;
  }
</style>
