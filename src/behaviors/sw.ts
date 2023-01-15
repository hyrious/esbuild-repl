if (import.meta.env.DEV) {
  navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  // https://esbuild.github.io/api/#live-reload
  new EventSource("/esbuild").addEventListener("change", () => location.reload());
} else {
  navigator.serviceWorker
    ?.register("./sw.js")
    .then((e) => console.log("registered sw.js in scope:", e.scope))
    .catch((e) => console.log("failed to register sw.js:", e));
}
