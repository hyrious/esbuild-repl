/// <reference lib="WebWorker" />
export type {};

declare var self: ServiceWorkerGlobalScope;

const N = "esbuild-repl:v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("fetch", (ev) => {
  const url = ev.request.url;
  if (url.endsWith("esbuild.wasm") && !url.includes("latest")) {
    ev.respondWith(
      caches.open(N).then(async (cache) => {
        let resp = await cache.match(ev.request);
        if (resp) {
          return resp;
        } else {
          resp = await fetch(ev.request);
          cache.put(ev.request, resp);
          return resp;
        }
      })
    );
  }
});
