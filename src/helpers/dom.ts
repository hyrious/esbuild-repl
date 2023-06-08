import { query_selector_all, tick } from 'svelte/internal'

export function stop(event: Event) {
  event.stopPropagation()
  if (event.cancelable) {
    event.preventDefault()
  }
}

export function send_input(selector: string) {
  tick().then(() => {
    for (const textarea of query_selector_all(selector))
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }))
  })
}
