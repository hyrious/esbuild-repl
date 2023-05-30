<script lang="ts">
  import Header from './components/Header.svelte'
  import SplitPane from './components/SplitPane.svelte'
  import Transform from './components/Transform.svelte'
  import Build from './components/Build.svelte'
  import Footer from './components/Footer.svelte'
  import { onMount } from 'svelte'
  import { sendIPC } from './ipc'
  import { emitter } from './global'
  import { mode } from './stores'

  onMount(() => {
    window.sendIPC = sendIPC
  })
</script>

<Header />
<main data-mode={$mode}>
  <SplitPane>
    <section slot="left">
      <Transform show={$mode === 'transform'} />
      <Build show={$mode === 'build'} />
    </section>
    <section slot="right" />
  </SplitPane>
</main>
<Footer />

<style>
  main {
    padding: 25px 50px 70px;
  }
  section[slot='left'] {
    padding-right: 12.5px;
  }
  section[slot='right'] {
    padding-left: 12.5px;
  }
  @media (max-width: 800px) {
    main {
      padding: 25px;
    }
    section[slot] {
      padding: 0;
      padding-bottom: 12.5px;
    }
  }
</style>
