import type { Action } from 'svelte/action'
import { noop } from '@hyrious/utils'
import { is_client, stop } from './dom'

const hljs = is_client ? new Worker('hljs.js') : null

interface Request {
  id: number
  code: string
  lang?: string
}

interface Response {
  id: number
  value: string
}

const Tasks = new Map<number, (value: string) => void>()

hljs?.addEventListener('message', (ev: MessageEvent<Response>) => {
  const { id, value } = ev.data
  const task = Tasks.get(id)
  if (task) {
    task(value)
    Tasks.delete(id)
  }
})

let id = 1

function request(code: string, lang?: string): Promise<string> {
  if (!hljs) return new Promise(noop)
  let resolve!: (value: string) => void
  const task = new Promise<string>((r) => (resolve = r))
  Tasks.set(id, resolve)
  hljs.postMessage({ id, code, lang } satisfies Request)
  id++
  return task
}

class Task {
  cancelled = false
  constructor(readonly node: HTMLElement, readonly token: number) {}
  replaceInnerHTML = (html: string): void => {
    clearTimeout(this.token)
    if (!this.cancelled) {
      this.node.innerHTML = html
    }
  }
  cancel() {
    clearTimeout(this.token)
    this.cancelled = true
  }
}

interface Params {
  code?: string
  loader?: string
}

const MAX_CODE_SIZE = 100_000 // 100 KB

export const highlight: Action<HTMLElement, Params> = function highlight(node, params) {
  let activeTask: Task | null = null

  const update = ({ code, loader }: Params) => {
    if (activeTask) {
      activeTask.cancel()
      activeTask = null
    }
    if (code && code.length > MAX_CODE_SIZE) {
      node.innerText = code
      return
    }
    if (code) {
      activeTask = new Task(
        node,
        setTimeout(() => {
          node.innerText = code
        }, 50),
      )
      request(code, loader).then(activeTask.replaceInnerHTML)
    } else {
      node.innerText = ''
    }
  }
  const select_all = (event: MouseEvent) => {
    stop(event)
    const range = document.createRange()
    range.selectNodeContents(node)
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
  const destroy = () => {
    node.removeEventListener('dblclick', select_all)
    if (activeTask) {
      activeTask.cancel()
      activeTask = null
    }
  }

  node.addEventListener('dblclick', select_all)
  update(params)

  return { update, destroy }
}
