import './style.css'
import './behaviors/service-worker'
import './behaviors/live-reload'

import App from './App.svelte'

Object.assign(window, {
  app: new App({
    target: document.getElementById('app') as HTMLElement,
    hydrate: true,
  }),
})
