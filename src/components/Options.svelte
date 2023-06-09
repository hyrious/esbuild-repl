<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Mode, parseOptions } from '../helpers/options'
  import { send_input } from '../helpers/dom'

  export let content = ''
  export let mode: Mode = Mode.Transform

  $: is_json_like = /^{|^\/[*/]/.test(content.trimStart())

  const dispatch = createEventDispatcher()

  function escape_for_shell(value: string) {
    if (/[ '"]/.test(value)) {
      return "'" + value.replace(/'/g, "\\'") + "'"
    } else {
      return value
    }
  }

  function format() {
    const options = parseOptions(content, mode)
    if (is_json_like) {
      const args: string[] = []
      for (const key in options) {
        const prefix = '--' + key.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase())
        const value = options[key]
        if (typeof value === 'boolean') {
          if (value) args.push(prefix)
          else args.push(prefix + '=false')
        } else if (typeof value === 'string' || typeof value === 'number') {
          args.push(prefix + '=' + escape_for_shell(value + ''))
        } else if (value instanceof RegExp) {
          args.push(prefix + '=' + escape_for_shell(value.source))
        } else if (Array.isArray(value)) {
          if (
            key === 'resolveExtensions' ||
            key === 'mainFields' ||
            key === 'conditions' ||
            key === 'target'
          ) {
            args.push(prefix + '=' + value.join(','))
          } else {
            for (const item of value) {
              args.push(prefix + ':' + escape_for_shell(item))
            }
          }
        } else if (value && typeof value === 'object') {
          for (const key in value) {
            args.push(prefix + ':' + escape_for_shell(key) + '=' + escape_for_shell(value[key] + ''))
          }
        } else {
          console.warn('Unknown option type: ' + typeof value + ' for ' + key, value)
        }
      }
      content = args.join(' ')
    } else {
      let result = '{'
      let has_value = false
      for (const key in options) {
        has_value = true
        const value = options[key]
        if (typeof value === 'boolean' || typeof value === 'number' || value instanceof RegExp) {
          result += `\n  ${key}: ${value},`
        } else if (typeof value === 'string' || Array.isArray(value)) {
          result += `\n  ${key}: ${JSON.stringify(value)},`
        } else if (value && typeof value === 'object') {
          result += `\n  ${key}: {`
          let has_value = false
          for (const key in value) {
            has_value = true
            result += `\n    ${key}: ${JSON.stringify(value[key])},`
          }
          result += has_value ? '\n  },' : '},'
        } else {
          console.warn('Unknown option type: ' + typeof value + ' for ' + key, value)
        }
      }
      content = result + (has_value ? '\n}' : '}')
    }
    send_input('[data-options]')
  }
</script>

<article>
  <textarea
    data-options
    class="editor"
    rows={1}
    spellcheck="false"
    bind:value={content}
    placeholder="e.g. --minify or {'{'} minify: true {'}'}"
  />
  <footer>
    <button class="format" on:click={format}>
      <i class={is_json_like ? 'i-mdi-bash' : 'i-mdi-code-json'} />
      <span>To {is_json_like ? 'shell args' : 'JSON5'}</span>
    </button>
    <button class="reload" on:click={() => dispatch('reload')}>
      <i class="i-mdi-reload" />
      <span>Reset options</span>
    </button>
  </footer>
</article>

<style>
  article {
    display: flex;
    flex-direction: column;
    color: var(--fg);
  }
  article:focus-within {
    border-color: var(--fg);
  }
  textarea {
    appearance: none;
    resize: none;
    width: 100%;
    height: 100%;
    font: var(--code-font);
    color: inherit;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--pre);
    outline: none;
    padding: 8px;
    white-space: pre;
    overscroll-behavior: contain;
    overflow: auto;
  }
  textarea:focus {
    color: var(--fg-on);
    border-color: var(--fg);
  }
  footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
  }
  button {
    appearance: none;
    display: inline-flex;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin-left: 5px;
    cursor: pointer;
    color: inherit;
    font-size: 20px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  button:hover {
    opacity: 1;
  }
  button span {
    padding-left: 5px;
    font: 14px/20px sans-serif;
  }
</style>
