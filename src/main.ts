import './style.css'
import './behaviors/service-worker'
import './behaviors/live-reload'
import './behaviors/editor'

import App from './App.svelte'
import { sendIPC } from './ipc'

Object.assign(window, {
  app: new App({
    target: document.getElementById('app') as HTMLElement,
    hydrate: true,
  }),
  sendIPC,
})
