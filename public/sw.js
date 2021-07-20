self.addEventListener('install', function oninstall() {
    self.skipWaiting();
});

self.addEventListener('fetch', function onfetch(event) {
    if (event.request.url.endsWith('esbuild.wasm') || event.request.url.endsWith('browser.js')) {
        event.respondWith(caches.open('esbuild-repl:v1').then(function opencache(cache) {
            return cache.match(event.request).then(function matchcache(response) {
                return response || fetch(event.request).then(function fetched(response) {
                    cache.put(event.request, response);
                    return response.clone();
                });
            });
        }));
    }
});
