import "./main.css";
import "./behaviors";
import "./behaviors/query";
import App from "./App.svelte";

Object.assign(window, {
  app: new App({
    target: document.querySelector("#app")!,
    hydrate: !import.meta.env.DEV,
  }),
});

console.debug("variables for debug: window.{ esbuild, stores, app }");
