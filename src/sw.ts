/// <reference lib="WebWorker" />
export type {};

declare var self: ServiceWorkerGlobalScope;

const N = "esbuild-repl:v1";
const R = ["esbuild.wasm", "browser.js"];

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("fetch", (ev) => {
  if (R.some((name) => ev.request.url.endsWith(name))) {
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
