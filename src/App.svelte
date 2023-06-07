<script lang="ts">
  import { version, mode, input, files, options, output, debug } from './stores'
  import { terminal_to_html } from './helpers/ansi'
  import Header from './components/Header.svelte'
  import SplitPane from './components/SplitPane.svelte'
  import Transform from './components/Transform.svelte'
  import Build from './components/Build.svelte'
  import Footer from './components/Footer.svelte'
  import Editor from './components/Editor.svelte'
  import { save_query } from './behaviors/query'

  $: lang = $options.includes('--loader=css') ? 'css' : 'js'

  $: save_query({ version: $version, t: $input, b: $files, o: $options, d: $debug })
</script>

<Header />
<main data-mode={$mode}>
  <SplitPane>
    <section slot="left">
      <Transform show={$mode === 'transform'} />
      <Build show={$mode === 'build'} />
    </section>
    <section slot="right">
      {#if $output}
        {#if 'code_' in $output}
          <Editor label="OUTPUT" readonly content={$output.code_} {lang} />
        {/if}
        {#if $output.legalComments_}
          <Editor label="LEGAL COMMENTS" readonly content={$output.legalComments_} lang="comment" />
        {/if}
        {#if $output.map_}
          <Editor label="SOURCE MAP" readonly content={$output.map_} lang="json" />
        {/if}
        {#if $output.mangleCache_ && Object.keys($output.mangleCache_).length}
          <Editor
            label="MANGLE CACHE"
            readonly
            content={JSON.stringify($output.mangleCache_, null, 2)}
            lang="json"
          />
        {/if}
        {#if $output.stderr_}
          <pre>{@html terminal_to_html($output.stderr_)}</pre>
        {/if}
      {/if}
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
  pre {
    margin: 0 0 10px;
    font: var(--code-font);
    white-space: pre-wrap;
  }
  @media (max-width: 800px) {
    main {
      padding: 25px;
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
