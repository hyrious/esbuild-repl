/// <reference no-default-lib="true"/>
/// <reference lib="ESNext" />
/// <reference lib="WebWorker" />
declare var self: ServiceWorkerGlobalScope;

self.oninstall = self.skipWaiting;
self.onactivate = (ev) => ev.waitUntil(self.clients.claim());
self.onfetch = (ev) =>
  ev.respondWith(
    caches.open("esbuild-repl:v1").then(async (cache) => {
      let response = await cache.match(ev.request);
      if (!response) {
        response = await fetch(ev.request);
        if (response.ok) {
          cache.put(ev.request, response);
        }
      }
      return response.clone();
    })
  );

export type {};
