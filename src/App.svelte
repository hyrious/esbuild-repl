<script lang="ts">
  import { version, mode, input, files, options, debug, installed } from './stores'
  import { save_query } from './behaviors/query'
  import Header from './components/Header.svelte'
  import SplitPane from './components/SplitPane.svelte'
  import Transform from './components/Transform.svelte'
  import Build from './components/Build.svelte'
  import Output from './components/Output.svelte'
  import Footer from './components/Footer.svelte'

  $: save_query($mode, {
    version: $version,
    t: $input,
    b: $files,
    o: $options,
    d: $debug,
    i: $installed.map((e) => `${e.name}@${e.version}`),
  })
</script>

<Header />
<main data-mode={$mode}>
  <SplitPane>
    <section slot="left">
      <Transform show={$mode === 'transform'} />
      <Build show={$mode === 'build'} />
    </section>
    <section slot="right">
      <Output />
    </section>
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
      padding: 25px 25px 70px;
    }
    section[slot='left'] {
      padding-right: 0;
      padding-bottom: 12.5px;
    }
    section[slot='right'] {
      padding-left: 0;
      padding-top: 12.5px;
    }
  }
</style>
