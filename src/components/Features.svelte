<script lang="ts">
  import type { TransformOptions } from 'esbuild'
  import { Mode, parseOptions } from '../helpers/options'
  import { version, input, options, status, output } from '../stores'
  import { tick } from 'svelte'
  import Editor from './Editor.svelte'

  let features: string[] = []
  let phase: 'idle' | 'detecting' | 'detected' = 'idle'

  $: if ($output) {
    phase = 'idle'
    features = []
  }

  let enabled = false
  // --supported is not available before esbuild 0.14.46
  $: if ($version !== 'latest') {
    const [major, minor, patch] = $version.split('.').map((x) => +x)
    enabled = major > 0 || minor > 14 || (minor === 14 && patch >= 46)
  }

  // See https://github.com/evanw/esbuild/blob/main/internal/compat/js_table.go
  const JS_FEATURES = [
    'arbitrary-module-namespace-names',
    'array-spread',
    'arrow',
    'async-await',
    'async-generator',
    'bigint',
    'class',
    'class-field',
    'class-private-accessor',
    'class-private-brand-check',
    'class-private-field',
    'class-private-method',
    'class-private-static-accessor',
    'class-private-static-field',
    'class-private-static-method',
    'class-static-blocks',
    'class-static-field',
    'const-and-let',
    'decorators',
    'default-argument',
    'destructuring',
    'dynamic-import',
    'exponent-operator',
    'export-star-as',
    'for-await',
    'for-of',
    'function-or-class-property-access',
    'generator',
    'hashbang',
    'import-assertions',
    'import-meta',
    'inline-script',
    'logical-assignment',
    'nested-rest-binding',
    'new-target',
    'node-colon-prefix-import',
    'node-colon-prefix-require',
    'nullish-coalescing',
    'object-accessors',
    'object-extensions',
    'object-rest-spread',
    'optional-catch-binding',
    'optional-chain',
    'regexp-dot-all-flag',
    'regexp-lookbehind-assertions',
    'regexp-match-indices',
    'regexp-named-capture-groups',
    'regexp-set-notation',
    'regexp-sticky-and-unicode-flags',
    'regexp-unicode-property-escapes',
    'rest-argument',
    'template-literal',
    'top-level-await',
    'typeof-exotic-object-is-object',
    'unicode-escapes',
  ]

  // See https://github.com/evanw/esbuild/blob/main/internal/compat/css_table.go
  const CSS_FEATURES = [
    'hex-rgba',
    'inline-style',
    'rebecca-purple',
    'modern-rgb-hsl',
    'inset-property',
    'nesting',
    'is-pseudo-class',
  ]

  class Task {
    cancelled = false
    resolve?: (features: string[]) => void
    reject?: (error: Error) => void
    constructor(
      esbuild: typeof import('esbuild'),
      code: string,
      options: TransformOptions,
      features: string[],
    ) {
      this._run(esbuild, code, options, features)
    }
    async _run(
      esbuild: typeof import('esbuild'),
      code: string,
      options: TransformOptions,
      features: string[],
    ) {
      await tick()
      const detected: string[] = []

      let baseline: string
      try {
        await esbuild.transform(code, options).then((r) => (baseline = r.code))
      } catch (err) {
        !this.cancelled && this.reject && this.reject(err)
        return
      }
      if (this.cancelled) return

      for (const feat of features) {
        options.supported = { [feat]: false }
        try {
          await esbuild.transform(code, options).then((r) => {
            if (r.code !== baseline) detected.push(feat)
          })
        } catch (err) {
          if (!err.message.includes('is not a valid feature')) detected.push(feat)
        }
        if (this.cancelled) return
      }

      this.resolve && this.resolve(detected)
    }
    cancel() {
      this.cancelled = true
    }
    then(fn: (features: string[]) => void) {
      this.resolve = fn
    }
    catch(fn: (error: Error) => void) {
      this.reject = fn
    }
  }

  let activeTask: Task | null = null

  function detect_features() {
    const esbuild: typeof import('esbuild') = (window as any).esbuild
    if (!esbuild) {
      throw new Error('esbuild has not been initialized')
    }

    const opts = parseOptions($options, Mode.Transform)
    const kind = !opts.loader ? 'js' : opts.loader === 'css' ? 'css' : 'js'
    const feats = kind === 'js' ? JS_FEATURES : CSS_FEATURES
    opts.supported = {}
    opts.target = 'esnext'

    phase = 'detecting'
    activeTask && activeTask.cancel()
    activeTask = new Task(esbuild, $input, opts, feats)
    activeTask.then((features_) => {
      features = features_
      phase = 'detected'
    })
    activeTask.catch((err) => {
      $status = err + ''
      phase = 'idle'
      features = []
    })
  }
</script>

<div class="features" style={!enabled || phase === 'detected' ? 'display: none' : ''}>
  <button
    class:detecting={phase === 'detecting'}
    title="--supported:?"
    disabled={phase !== 'idle'}
    on:click={detect_features}
  >
    <i class="i-mdi-magnify" />
    <span>{phase === 'detecting' ? 'Detecting' : 'Detect'} features</span>
  </button>
</div>
{#if phase === 'detected'}
  <Editor label="FEATURES" readonly content={features.join('\n')} lang="raw" />
{/if}

<style>
  .features {
    display: flex;
    margin: -6px 0 6px;
  }
  button {
    appearance: none;
    display: inline-flex;
    background: none;
    margin-left: auto;
    border: none;
    padding: 0;
    outline: none;
    color: inherit;
    font-size: 20px;
    opacity: 0.5;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  button:hover {
    opacity: 1;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button.detecting {
    cursor: wait;
  }
  button span {
    font: 14px/20px sans-serif;
  }
</style>
