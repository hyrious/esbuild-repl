interface ImportMetaEnv {
  DEV: boolean
  SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svelte' {
  export { SvelteComponentDev as default } from 'svelte/internal'
}

interface Navigator extends NavigatorUA {}
interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData
}
interface NavigatorUAData {
  readonly mobile: boolean
  readonly platform: string
}
