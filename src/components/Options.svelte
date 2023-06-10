<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { insert, set } from 'text-field-edit'
  import { Mode, parseOptions } from '../helpers/options'
  import { stop } from '../helpers/dom'
  import { filter } from '../helpers/completion'

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

  let textarea: HTMLTextAreaElement

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
      set(textarea, args.join(' '))
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
      set(textarea, result + (has_value ? '\n}' : '}'))
    }
  }

  let comp_x = 0
  let comp_y = 0
  let comp_text = ''
  let comp_info = ''
  let comp_index = 0
  let comp_items: [string, string][] = []
  let comp_pattern = ''
  let comp_ghost: HTMLPreElement | null = null
  let comp_caret: HTMLSpanElement | null = null

  function get_caret_position(textarea: HTMLTextAreaElement, before: string, after: string) {
    if (!comp_ghost) {
      comp_ghost = document.createElement('pre')
      comp_ghost.style.position = 'absolute'
      comp_ghost.style.top = '0'
      comp_ghost.style.left = '0'
      comp_ghost.style.visibility = 'hidden'
      comp_ghost.style.border = '1px solid'
      comp_ghost.style.padding = '8px'
      comp_ghost.style.font = 'var(--code-font)'
      comp_ghost.style.whiteSpace = 'pre-wrap'
      comp_ghost.style.pointerEvents = 'none'
    }

    if (!comp_caret) {
      comp_caret = document.createElement('span')
    }

    comp_ghost.innerText = ''
    document.body.append(comp_ghost)
    comp_ghost.style.width = textarea.clientWidth + 'px'
    comp_ghost.append(before, comp_caret, after)

    const parent = comp_ghost.getBoundingClientRect()
    const caret = comp_caret.getBoundingClientRect()
    comp_x = caret.x - parent.x
    comp_y = caret.y - parent.y

    comp_ghost.remove()
  }

  function refresh_comp_text() {
    const [text, info] = comp_items[comp_index]
    comp_text = text.slice(comp_pattern.length)
    comp_info = comp_text ? info : ''
  }

  let is_mobile: MediaQueryList | null = null
  function refresh_completions(event: Event) {
    if (is_json_like) return clear_completions()

    is_mobile ||= matchMedia('(max-width: 800px)')
    if (is_mobile.matches) return clear_completions()

    const textarea = event.target as HTMLTextAreaElement
    const [start, end] = [textarea.selectionStart, textarea.selectionEnd]
    if (start !== end) return clear_completions()

    const text = textarea.value
    const before = text.slice(0, start)
    const after = text.slice(start)

    const begin = before.lastIndexOf('--')
    if (begin < 0) return clear_completions()

    const pattern = before.slice(begin)
    if (!/^[-\w]+$/.test(pattern)) return clear_completions()

    comp_pattern = pattern
    comp_items = filter(pattern)
    if (comp_items.length) {
      comp_index = 0
      get_caret_position(textarea, before, after)
      refresh_comp_text()
    } else {
      clear_completions()
    }
  }

  function trigger_completions(event: KeyboardEvent) {
    if (comp_text) {
      if (
        event.key === 'ArrowRight' ||
        (event.key === 'Tab' && !event.shiftKey) ||
        (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey)
      ) {
        stop(event)
        const text = comp_text.match(/^[-\w]+/)?.[0] || ''
        insert(event.target as HTMLTextAreaElement, text)
        clear_completions()
        return
      }
      if (event.key === 'ArrowUp' && comp_items.length) {
        stop(event)
        comp_index = (comp_index + comp_items.length - 1) % comp_items.length
        refresh_comp_text()
        return
      }
      if (event.key === 'ArrowDown' && comp_items.length) {
        stop(event)
        comp_index = (comp_index + 1) % comp_items.length
        refresh_comp_text()
        return
      }
      if (event.key === 'Escape') {
        clear_completions()
      }
    }

    if (event.key === ' ' && event.ctrlKey) {
      stop(event)
      refresh_completions(event)
    }
  }

  function clear_completions() {
    comp_text = ''
    comp_info = ''
  }
</script>

<article>
  <div>
    <aside style:left="{comp_x}px" style:top="{comp_y}px">
      <span class="hint">{comp_text}</span>
      {#if comp_info}<span class="info">[{comp_index + 1}/{comp_items.length}] {comp_info}</span>{/if}
    </aside>
    <textarea
      bind:this={textarea}
      data-options
      class="editor"
      rows={1}
      spellcheck="false"
      bind:value={content}
      placeholder="e.g. --minify or {'{'} minify: true {'}'}"
      on:input={refresh_completions}
      on:keydown|capture={trigger_completions}
    />
  </div>
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
  div {
    display: flex;
    border-radius: 4px;
    background: var(--pre);
    position: relative;
  }
  textarea {
    appearance: none;
    resize: none;
    width: 100%;
    font: var(--code-font);
    color: inherit;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: none;
    outline: none;
    padding: 8px;
  }
  textarea:focus {
    color: var(--fg-on);
    border-color: var(--fg);
  }
  aside {
    position: absolute;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  aside span.hint {
    opacity: 0.5;
    font: var(--code-font);
    pointer-events: none;
  }
  aside span.info {
    margin-top: 4px;
    padding: 5px 8px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);
    color: var(--fg-on);
    font: 14px/20px sans-serif;
    z-index: 10;
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
    white-space: nowrap;
  }
</style>
