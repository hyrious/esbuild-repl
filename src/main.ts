import "./main.css";
import "./behaviors";
import App from "./App.svelte";

Object.assign(window, {
  app: new App({
    target: document.querySelector("#app")!,
    hydrate: !import.meta.env.DEV,
  }),
});

if (import.meta.env.DEV) {
  navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
} else {
  navigator.serviceWorker
    ?.register("./sw.js")
    .then((e) => console.log("registered sw.js in scope:", e.scope))
    .catch((e) => console.log("failed to register sw.js:", e));
}

console.debug("variables for debug: window.{ esbuild, stores, app }");
