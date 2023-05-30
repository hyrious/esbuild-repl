import { observable } from '@hyrious/utils'

export const emitter = observable<{
  // esbuild is just loaded, should rebuild now
  ready: void
  // notify to reload esbuild by version, triggering "status" and "ready"
  reload: string
  // show status message
  status: string
}>()
