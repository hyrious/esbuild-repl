interface ImportMetaEnv {
  DEV: boolean
  SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svelte' {
  export { SvelteComponent as default } from 'svelte'
}

interface Navigator extends NavigatorUA {}
interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData
}
interface NavigatorUAData {
  readonly mobile: boolean
  readonly platform: string
}

interface Window {
  showSaveFilePicker?: (options?: {
    excludeAcceptAllOption?: boolean
    suggestedName?: string
    types?: { description?: string; accept?: Record<string, string[]> }[]
  }) => Promise<FileSystemFileHandle>
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>
}

interface FileSystemWritableFileStream<W = any> extends WritableStream<W> {
  write(data: W): Promise<void>
}
