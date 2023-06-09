// Credits: https://github.com/esbuild/esbuild.github.io/blob/main/src/try/worker.ts
// Note: to make this file work in a normal web worker, it should not have
// any common dependencies, './helpers/fs' is only imported here so it is ok.

/* eslint-disable no-control-regex */
// This file is responsible for spawning and terminating child worker threads.
// The worker thread is recreated every time the current API version changes.
// This file is the entry point for the child web worker

/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="ESNext" />

declare const esbuild: any

import { resetFileSystem, stderrSinceReset } from './helpers/fs'
import { IPCRequest, IPCResponse } from './ipc'

interface API {
  transform(input: string, options: any): Promise<any>
  build(options: any): Promise<any>

  // This was added in version 0.10.1
  formatMessages?(messages: Message[], options: FormatMessagesOptions): Promise<any>
}

interface FormatMessagesOptions {
  kind: 'error' | 'warning'
  color?: boolean
  terminalWidth?: number
}

interface Message {
  text: string
  location: Location | null
  notes?: Note[]
}

interface Note {
  text: string
  location: Location | null
}

interface Location {
  file: string
  line: number
  column: number
  length: number
  lineText: string
  suggestion?: string
}

// Do the setup in an async function to capture errors thrown (e.g. "WebAssembly" doesn't exist)
const setup = async ([version, wasm]: [string, ArrayBuffer]): Promise<API> => {
  const [major, minor, patch] = version.split('.').map((x) => +x)

  // Versions 0.5.20 to 0.8.34 have a bug where "worker" doesn't work. This
  // means that the "build" API is broken (because we can't inject our file
  // system shim) but the "transform" API still works, so we still allow
  // these buggy versions.
  const hasBugWithWorker =
    major === 0 &&
    ((minor === 5 && patch >= 20) || (minor >= 6 && minor <= 7) || (minor === 8 && patch <= 34))

  const options: Record<string, any> = {
    // This uses "wasmURL" instead of "wasmModule" because "wasmModule" was added in version 0.14.32
    wasmURL: URL.createObjectURL(new Blob([wasm], { type: 'application/wasm' })),
  }

  // Avoid triggering an esbuild bug that causes all output to be empty
  if (!hasBugWithWorker) {
    options.worker = false
  }

  // Use the "startService" API before version 0.9.0
  if (esbuild.startService) {
    await esbuild.startService(options)
  } else {
    // Otherwise use the "initialize" API
    await esbuild.initialize(options)
  }

  // Warm up
  if (esbuild.transform) {
    await esbuild.transform('let a = 1').catch(() => void 0)
  }

  return esbuild
}

const perf: { now(): number } = typeof performance !== 'undefined' ? performance : Date

const formatMessages = (api: API, messages: Message[], options: FormatMessagesOptions): Promise<string[]> => {
  if (api.formatMessages) return api.formatMessages(messages, options)

  // Do something reasonable for version 0.10.0 and earlier
  // cspell: disable
  const format = (kind: string, text: string, location: Location | null): string => {
    let result = kind === 'note' ? '   ' : '\x1B[1m > '
    if (location) result += `${location.file}:${location.line}:${location.column}: `
    result +=
      kind === 'error'
        ? '\x1B[31merror:\x1B[1m '
        : kind === 'warning'
        ? '\x1B[35mwarning:\x1B[1m '
        : '\x1B[1mnote:\x1B[0m '
    result += text + '\x1B[0m\n'
    if (location) {
      const { line, column, length, lineText } = location
      const prefix = line.toString().padStart(5)
      result +=
        `\x1B[37m${prefix} │ ${lineText.slice(0, column)}` +
        `\x1B[32m${lineText.slice(column, column + length)}` +
        `\x1B[37m${lineText.slice(column + length)}\n` +
        `${' '.repeat(prefix.length)} ╵ \x1B[32m${' '.repeat(column)}${
          length > 1 ? '~'.repeat(length) : '^'
        }\x1B[0m\n`
    }
    return result
  }
  // cspell: enable
  return Promise.resolve(
    messages.map((msg) => {
      let result = format(options.kind, msg.text, msg.location)
      for (const note of msg.notes || []) {
        result += format('note', note.text, note.location)
      }
      return result + '\n'
    }),
  )
}

const handler = function (this: API, e: MessageEvent<IPCRequest>) {
  const respondWithError = (
    respond: (response: IPCResponse) => void,
    err: Error & { errors?: any[]; warnings?: any[] },
  ): void => {
    let errors = err && err.errors
    const warnings = err && err.warnings
    if (!errors && !warnings) errors = [{ text: err + '' }]
    Promise.all([
      errors ? formatMessages(this, errors, { kind: 'error', color }) : [],
      warnings ? formatMessages(this, warnings, { kind: 'warning', color }) : [],
    ]).then(([errors, warnings]) => {
      respond({
        stderr_: [...errors, ...warnings].join(''),
      })
    })
  }

  // There are two sources of log information: the log messages returned through
  // the API and the stderr stream from WebAssembly. The returned log messages
  // are likely colored while the stderr stream from WebAssembly likely isn't, so
  // we prefer the messages from the API. However, don't want to omit unique
  // information from WebAssembly such as verbose log messages. Remove duplicate
  // log information so each message is only shown once.
  const mergeStderrStreams = (formatted: string[], stderr: string): string => {
    for (const text of formatted) {
      const replaced = stderr.replace(text, '')
      if (replaced !== stderr) {
        // Try with escape codes
        stderr = replaced
      } else {
        // Try without escape codes
        const replaced = text.replace(/\x1B\[[^m]*m/g, '')
        if (replaced !== text) {
          stderr = stderr.replace(replaced, '')
        }
      }
    }
    return formatted.join('') + stderr
  }

  const finish = (warnings: any[], done: (stderr: string) => void): void => {
    if (warnings.length) {
      formatMessages(this, warnings, { kind: 'warning', color }).then((formatted) =>
        done(mergeStderrStreams(formatted, stderrSinceReset)),
      )
    } else {
      done(stderrSinceReset)
    }
  }

  const request: IPCRequest = e.data
  const respond: (response: IPCResponse) => void = postMessage
  let start: number
  let color = true

  try {
    // Transform API
    if (request.command_ === 'transform') {
      if (request.options_.color === false) color = false
      resetFileSystem({})
      start = perf.now()
      this.transform(request.input_, request.options_).then(
        ({ code, map, js, jsSourceMap, warnings, mangleCache, legalComments }) =>
          finish(warnings, (stderr: string) =>
            respond({
              // "code" and "map" were "js" and "jsSourceMap" before version 0.8.0
              code_: code ?? js,
              map_: map ?? jsSourceMap,
              mangleCache_: mangleCache,
              legalComments_: legalComments,
              stderr_: stderr,
              duration_: perf.now() - start,
            }),
          ),
        (err) => respondWithError(respond, err),
      )
    }

    // Build API
    else if (request.command_ === 'build') {
      if (request.options_.color === false) color = false
      resetFileSystem(request.input_)
      start = perf.now()
      this.build(request.options_).then(
        ({ warnings, outputFiles, metafile, mangleCache }) =>
          finish(warnings, (stderr: string) =>
            respond({
              outputFiles_: outputFiles.map(({ path, text }) => ({ path, text })),
              metafile_: metafile,
              mangleCache_: mangleCache,
              stderr_: stderr,
              duration_: perf.now() - start,
            }),
          ),
        (err) => respondWithError(respond, err),
      )
    }
  } catch (err) {
    respondWithError(respond, err)
  }
}

onmessage = async (e: MessageEvent<[string, ArrayBuffer]>) => {
  try {
    const api = await setup(e.data)
    onmessage = handler.bind(api)
    postMessage({
      status_: 'success',
    })
  } catch (err) {
    console.error(err)
    postMessage({
      status_: 'failure',
      error_: err + '',
    })
  }
}
