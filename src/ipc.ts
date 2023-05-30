// Credits: https://github.com/esbuild/esbuild.github.io/blob/main/src/try/ipc.ts
import { emitter } from './global'

export interface OutputFile {
  path: string
  text: string
}

export type IPCRequest = TransformRequest | BuildRequest
export type IPCResponse = TransformResponse & BuildResponse

export interface TransformRequest {
  command_: 'transform'
  input_: string
  options_: Record<string, any>
}

export interface TransformResponse {
  code_?: string
  map_?: string
  mangleCache_?: Record<string, string | boolean>
  legalComments_?: string
  stderr_?: string
  duration_?: number
}

export interface BuildRequest {
  command_: 'build'
  input_: Record<string, string>
  options_: Record<string, any>
}

export interface BuildResponse {
  outputFiles_?: OutputFile[]
  metafile_?: string
  mangleCache_?: Record<string, string | boolean>
  stderr_?: string
  duration_?: number
}

interface Task {
  message_: any
  resolve_: (value: any) => void
  abort_: () => void
}

let workerText: Promise<string> | null = null
let activeTask: Task | null = null
let pendingTask: Task | null = null

let on_reload: (version: string) => Promise<Worker> = async () => null as any
emitter.on('reload', (version) => on_reload(version))

let workerPromise = new Promise<Worker>((resolve, reject) => {
  on_reload = (version) => {
    const reloadPromise = reloadWorker(version)
    reloadPromise.then(resolve, reject)
    on_reload = (version) => {
      workerPromise.then((worker) => worker.terminate())
      workerPromise = reloadWorker(version)
      return workerPromise
    }
    return reloadPromise
  }
})

const do_fetch: typeof fetch = (url, options) => {
  emitter.emit('status', `Fetching ${url}`)
  return fetch(url, options)
}

async function packageFetch(subpath: string): Promise<Response> {
  // Try to fetch from one CDN, but fall back to another CDN if that fails
  try {
    const response = await do_fetch(`https://cdn.jsdelivr.net/npm/${subpath}`)
    if (response.ok) return response
  } catch {
    // ignore
  }
  return do_fetch(`https://unpkg.com/${subpath}`)
}

async function reloadWorker(version: string): Promise<Worker> {
  let loadingFailure: string | undefined
  emitter.emit('status', `Loading esbuild ${version}…`)

  try {
    if (activeTask) activeTask.abort_()
    if (pendingTask) pendingTask.abort_()
    activeTask = null
    pendingTask = null

    // "browser.min.js" was added in version 0.8.33
    const [major, minor, patch] = version.split('.').map((x) => +x)
    const min = major === 0 && (minor < 8 || (minor === 8 && patch < 33)) ? '' : '.min'

    const [workerJS, esbuildJS, esbuildWASM] = await Promise.all([
      (workerText ||= fetch('worker.js').then((r) => r.text())),
      packageFetch(`esbuild-wasm@${version}/lib/browser${min}.js`).then((r) => r.text()),
      packageFetch(`esbuild-wasm@${version}/esbuild.wasm`).then((r) => r.arrayBuffer()),
    ])
    const parts = [esbuildJS, workerJS]
    const url = URL.createObjectURL(new Blob(parts, { type: 'application/javascript' }))

    return await new Promise<Worker>((resolve, reject) => {
      const worker = new Worker(url)
      worker.onmessage = (e) => {
        worker.onmessage = null
        if (e.data.status_ === 'success') {
          resolve(worker)
          emitter.emit('status', 'Loaded esbuild ' + version)
          emitter.emit('ready')
        } else {
          reject(new Error('Failed to create worker'))
          loadingFailure = e.data.error_
        }
        URL.revokeObjectURL(url)
      }
      worker.postMessage([version, esbuildWASM], [esbuildWASM])
    })
  } catch (err) {
    emitter.emit('status', loadingFailure || err + '')
    throw err
  }
}

export function sendIPC(message: IPCRequest): Promise<IPCResponse> {
  function activateTask(worker: Worker, task: Task): void {
    if (activeTask) {
      if (pendingTask) pendingTask.abort_()
      pendingTask = task
    } else {
      activeTask = task
      worker.onmessage = (e) => {
        worker.onmessage = null
        task.resolve_(e.data)
        activeTask = null
        if (pendingTask) {
          activateTask(worker, pendingTask)
          pendingTask = null
        }
      }
      worker.postMessage(task.message_)
    }
  }

  return new Promise((resolve, reject) => {
    workerPromise.then(
      (worker) =>
        activateTask(worker, {
          message_: message,
          resolve_: resolve,
          abort_: () => reject(new Error('Task aborted')),
        }),
      reject,
    )
  })
}
