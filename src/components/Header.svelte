<script lang="ts">
  import { onMount } from 'svelte'
  import { emitter } from '../global'
  import { mode, theme, version, versions } from '../stores'
  import { load_query } from '../behaviors/query'

  function toggle_theme() {
    $theme = $theme === 'dark' ? 'light' : 'dark'
  }

  async function share(ev: MouseEvent) {
    try {
      const url = ev.shiftKey ? share_as_rollup() : ev.altKey ? share_as_esbuild_try() : location.href
      await navigator.clipboard.writeText(url)
      alert('Shareable URL has been copied to clipboard.')
    } catch (err) {
      console.error(err)
      alert(err + '')
    }
  }

  function share_as_rollup() {
    const query = load_query()
    let modules: { name: string; code: string; isEntry: boolean }[] | null = null
    if (query.t) {
      modules = [{ name: 'main.js', code: query.t, isEntry: true }]
    }
    if (query.b) {
      modules = query.b.map(([e, p, c]) => ({ name: p, code: c, isEntry: e }))
    }
    if (modules) {
      const shareable = { example: null, modules, options: { output: { format: 'es' }, treeshake: true } }
      return `https://rollupjs.org/repl/?shareable=${btoa(encodeURIComponent(JSON.stringify(shareable)))}`
    } else {
      throw new Error('no code to share')
    }
  }

  function share_as_esbuild_try() {
    const query = load_query()
    let parts: string[] | null = null
    if (query.t) {
      parts = ['t', $version, query.o || '', query.t]
    }
    if (query.b) {
      parts = ['b', $version, query.o || '']
      for (const [entry, path, content] of query.b) {
        parts.push(entry ? 'e' : '', path, content)
      }
    }
    if (parts) {
      const shareable = btoa(parts.join('\0')).replace(/=+$/, '')
      return `https://esbuild.github.io/try/#${shareable}`
    } else {
      throw new Error('no code to share')
    }
  }

  onMount(() =>
    version.subscribe(($version) => {
      if ($version !== 'latest') emitter.emit('reload', $version)
    }),
  )
</script>

<header>
  <h1>
    <a href="https://esbuild.github.io" target="_blank" rel="noreferrer">esbuild</a>
    <span>.</span>
    <a href="https://github.com/hyrious/esbuild-repl" target="_blank">repl</a>
  </h1>
  <nav>
    <label style:width="90px" title="esbuild.transform(code)">
      <input type="radio" name="mode" value="transform" bind:group={$mode} />
      <span>Transform</span>
    </label>
    <label style:width="50px" title="esbuild.build(options)">
      <input type="radio" name="mode" value="build" bind:group={$mode} />
      <span>Build</span>
    </label>
  </nav>
  <select title="change version" bind:value={$version}>
    {#if $versions.length}
      {#each $versions as version}
        <option value={version}>{version}</option>
      {/each}
    {:else}
      <option value={$version} disabled selected>{$version}</option>
    {/if}
  </select>
  <div class="buttons">
    <a
      class="btn"
      href="https://github.com/hyrious/esbuild-repl"
      target="_blank"
      title="hyrious/esbuild-repl"
    >
      <i class="i-mdi-github" />
    </a>
    <button
      data-share
      class="btn"
      title="share (press shift for rollup, alt/option for esbuild.try)"
      on:click={share}
    >
      <i class="i-mdi-share-variant" />
    </button>
    <button class="btn" title="theme: {$theme}" on:click={toggle_theme}>
      <i class={$theme === 'dark' ? 'i-mdi-moon-waxing-crescent' : 'i-mdi-white-balance-sunny'} />
    </button>
  </div>
</header>

<style>
  header {
    display: flex;
    padding: 25px 50px 0;
    gap: 5px;
  }
  header h1 {
    margin: 0;
    display: inline-flex;
    font-size: 16px;
    padding-left: 25px;
    background: url(../favicon.svg) no-repeat 0 center/20px;
  }
  header h1 a {
    text-decoration: none;
  }
  header h1 a:hover {
    color: var(--fg-on);
    text-decoration: underline;
  }
  header nav {
    flex-grow: 1;
    display: inline-flex;
  }
  header nav label {
    position: relative;
    text-align: center;
  }
  header nav label:hover span {
    color: var(--fg-on);
  }
  header nav label:has(:checked) span {
    color: var(--fg-on);
    font-weight: 700;
    border-bottom: 2px solid var(--active);
  }
  header nav label input {
    appearance: none;
    position: absolute;
    inset: 0;
    cursor: pointer;
  }
  header select {
    appearance: none;
    background: none;
    border: none;
    padding: 0 5px;
    color: inherit;
    font: 14px/20px 'Noto Sans Mono', monospace;
    cursor: pointer;
  }
  header select:hover {
    color: var(--fg-on);
  }
  header select option {
    background: var(--bg);
    color: var(--fg);
  }
  .buttons {
    display: inline-flex;
    gap: 5px;
  }
  .btn {
    appearance: none;
    background: none;
    border: none;
    padding: 0 5px;
    display: inline-flex;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
  }
  .btn:hover {
    color: var(--fg-on);
  }
  @media (max-width: 800px) {
    header {
      padding: 25px 25px 0;
    }
    header h1,
    header select {
      display: none;
    }
  }
  @media (max-width: 300px) {
    .buttons > *:not([data-share]) {
      display: none;
    }
  }
</style>
