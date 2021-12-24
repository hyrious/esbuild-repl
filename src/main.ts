import "./main.css";
import "./behaviors";
import App from "./App.svelte";

Object.assign(window, {
  app: new App({
    target: document.querySelector("#app")!,
    hydrate: !import.meta.env.DEV,
  }),
});

navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));

console.debug("variables for debug: window.{ esbuild, stores, app }");
