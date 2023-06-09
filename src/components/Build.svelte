<script lang="ts">
  import { onMount } from 'svelte'
  import { tick, noop } from 'svelte/internal'
  import { focus_last, send_input } from '../helpers/dom'
  import { get, set } from '../helpers/idb'
  import { read_tarball } from '../helpers/tarball'
  import { Mode, parseOptions, prettyPrintErrorAsStderr } from '../helpers/options'
  import { mode, files, options, status, initial_query, installed, ready, output } from '../stores'
  import { sendIPC } from '../ipc'
  import Editor from './Editor.svelte'
  import NpmPackage from './NpmPackage.svelte'

  export let show = true

  const default_options = `--bundle
--format=esm
--splitting
--outdir=/
--packages=external
--allow-overwrite`
  let build_options = $mode === 'build' ? $options : ''
  $: if ($mode === 'build') {
    $options = build_options

    if ($ready) {
      try {
        const o = parseOptions($options, Mode.Build)
        const entryPoints = Array.isArray(o.entryPoints) ? o.entryPoints : (o.entryPoints = [])
        const input: Record<string, string> = Object.create(null)
        const duplicates = new Set<string>()

        let stdin: any
        for (const { entry, path, content } of $files) {
          if (duplicates.has(path)) {
            throw new Error('Duplicate input file: ' + (path ? JSON.stringify(path) : '<stdin>'))
          }
          duplicates.add(path)
          if (!path) {
            stdin = o.stdin && typeof o.stdin === 'object' ? o.stdin : (o.stdin = {})
            stdin.contents = content
            if (!('resolveDir' in stdin)) stdin.resolveDir = '/'
          } else {
            input[path] = content
            if (entry) entryPoints.push(path)
          }
        }

        // for (const {files} of $installed)
        // svelte-lsp error: seems cannot use local variable whose name is the same as imported store
        for (const pkg of $installed) {
          const base = `node_modules/${pkg.name}/`
          for (const { path, content } of pkg.files) {
            const resolved = base + path
            if (duplicates.has(resolved)) {
              throw new Error('Duplicate input file: ' + JSON.stringify(resolved))
            }
            input[resolved] = content
          }
        }

        sendIPC({
          command_: 'build',
          input_: input,
          options_: o,
        }).then(output.set, noop)
      } catch (err) {
        $output = { stderr_: prettyPrintErrorAsStderr(err) }
      }
    }
  }

  function reset_options() {
    build_options = default_options
    send_input('article[data-label="OPTIONS"] textarea.editor')
  }

  let new_file_name = 'entry.js'
  $: if ($files) {
    const filenames = new Set<string>()
    for (const { path } of $files) filenames.add(path)
    if (!filenames.has('entry.js')) new_file_name = 'entry.js'
    else
      for (let i = 1; i < 100; i++) {
        const name = `file${i === 1 ? '' : i}.js`
        if (!filenames.has(name)) {
          new_file_name = name
          break
        }
      }
  }

  function new_file() {
    $files.push({
      path: new_file_name,
      content: '',
      entry: new_file_name === 'entry.js',
    })
    $files = $files
    focus_last('[data-label="INPUT"] input')
  }

  function remove_file(index: number) {
    $files.splice(index, 1)
    $files = $files
  }

  async function npm_install(raw?: MouseEvent | string | null) {
    if (typeof raw !== 'string') {
      raw = prompt('Enter package name:')
      if (!raw) return
    }

    const i = raw.indexOf('@', 1)
    const name = i === -1 ? raw : raw.slice(0, i)
    if (!name) return

    if ($installed.some((e) => e.name === name)) {
      // Already installed.
      return
    }

    const spec = i === -1 ? 'latest' : raw.slice(i + 1)
    const version = await resolve_version(name, spec)

    let buffer: ArrayBuffer | Uint8Array
    let url = `https://registry.npmjs.org/${name}/-/${name.split('/').pop()}-${version}.tgz`

    try {
      $status = `Installing ${name}@${version} …`
      const cached = await get(name, version)
      if (cached) {
        buffer = cached.buffer
      } else {
        buffer = await fetch(url).then((r) => r.arrayBuffer())
        await set(name, version, new Uint8Array(buffer))
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      $status = err + ''
      throw err
    }

    $status = `Extracting ${name}@${version} …`
    const files = await read_tarball(new Uint8Array(buffer))
    const package_json = files.find((e) => e.path === 'package.json')
    if (package_json) {
      tick().then(install_dependencies.bind(null, package_json.content))
    }

    if (!$installed.some((e) => e.name === name)) {
      $installed.push({ name, version, files })
      $installed = $installed
    }

    $status = `Extracted ${files.length} files.`
  }

  function install_dependencies(json: string) {
    const pkg = JSON.parse(json)
    if (pkg.dependencies) {
      for (const name of Object.keys(pkg.dependencies)) {
        npm_install(`${name}@${pkg.dependencies[name]}`).catch(console.error)
      }
    }
  }

  const semver_loose =
    /^[\s=v]*(\d+)\.(\d+)\.(\d+)(?:-?((?:\d+|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:\d+|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/

  async function resolve_version(name: string, spec: string): Promise<string> {
    if (!semver_loose.test(spec)) {
      spec = await follow_redirects(`https://unpkg.com/${name}@${spec}/package.json`)
      spec = spec.slice(18 + name.length + 1)
      spec = spec.slice(0, spec.indexOf('/'))
    }
    return spec
  }

  const fetch_cache = new Map<string, Promise<string>>()
  async function follow_redirects(url: string): Promise<string> {
    if (fetch_cache.has(url)) {
      return fetch_cache.get(url)!
    }

    const promise = fetch(url)
      .then(async (r) => {
        if (r.ok) return r.url
        else throw new Error(await r.text())
      })
      .catch((err) => {
        fetch_cache.delete(url)
        throw err
      })

    fetch_cache.set(url, promise)
    return promise
  }

  onMount(() => {
    for (const spec of initial_query.i || []) {
      npm_install(spec).catch(console.error)
    }
  })
</script>

<div data-build style={show ? '' : 'display: none'}>
  <Editor
    bind:content={build_options}
    label="OPTIONS"
    rows={1}
    placeholder="e.g. --minify or {'{'} minify: true {'}'}"
  >
    <aside class:show={build_options !== default_options} slot="header">
      <button on:click={reset_options} title="reset options">
        <i class="i-mdi-reload" />
      </button>
    </aside>
  </Editor>
  {#each $files as { entry, path, content }, i}
    <Editor
      bind:entry
      bind:name={path}
      bind:content
      on:remove={() => remove_file(i)}
      header
      rows={2}
      label="INPUT"
      placeholder="(enter your code here)"
    />
  {/each}
  <footer>
    <button on:click={new_file}>
      <i class="i-mdi-file-plus-outline" />
      <span>{new_file_name}</span>
    </button>
    {#each $installed as { name, version, files } (name)}
      <NpmPackage {name} {version} size={files.length} />
    {/each}
    <button on:click={npm_install} title="npm install &hellip;">
      <i class="i-mdi-package-variant-closed-plus" />
      <span>npm i &hellip;</span>
    </button>
  </footer>
</div>

<style>
  aside {
    position: absolute;
    display: inline-flex;
    top: 8px;
    right: 100%;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  aside button {
    padding: 0;
  }
  aside:hover,
  aside.show {
    opacity: 1;
  }
  button {
    position: relative;
    display: inline-flex;
    align-items: center;
    appearance: none;
    background: none;
    height: 20px;
    border: none;
    padding: 0 1px;
    outline: none;
    font: var(--code-font);
    color: var(--fg);
    opacity: 0.5;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  button:not(:last-child) {
    margin-bottom: 10px;
  }
  button:hover {
    opacity: 1;
  }
  button i {
    font-size: 20px;
  }
  footer {
    display: flex;
    flex-direction: column;
  }
  footer button i {
    position: absolute;
    right: 100%;
  }
</style>
