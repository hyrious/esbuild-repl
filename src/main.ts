import "./base.css";
import App from "./App.svelte";

Object.assign(window, {
  app: new App({
    target: document.querySelector("#app")!,
    hydrate: true,
  }),
});

import("./behaviors/editor");

if (__DEV__)
  navigator.serviceWorker
    .getRegistrations()
    .then((rs) => rs.forEach((r) => r.unregister()));
else
  navigator.serviceWorker
    .register("./sw.js")
    .then((e) => console.log("registered sw.js in scope:", e.scope))
    .catch((e) => console.log("failed to register sw.js:", e));
