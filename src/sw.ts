/// <reference no-default-lib="true" />
/// <reference lib="ESNext" />
/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope

const cacheName = 'esbuild-repl:v1'

self.oninstall = self.skipWaiting
self.onactivate = (ev) => ev.waitUntil(self.clients.claim())
self.onfetch = (ev) => {
  const url = ev.request.url
  if (url.endsWith('esbuild.wasm') && !url.includes('latest')) {
    ev.respondWith(
      caches.open(cacheName).then(async (cache) => {
        let response = await cache.match(ev.request)
        if (!response) {
          response = await fetch(ev.request)
          if (response.ok) {
            cache.put(ev.request, response)
          }
        }
        try {
          return response.clone()
        } catch {
          cache.delete(ev.request)
          return fetch(ev.request)
        }
      }),
    )
  }
}

export type {}
