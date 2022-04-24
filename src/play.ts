import "./main.css";
import "./behaviors";
import Playground from "./playground/Playground.svelte";

Object.assign(window, {
  app: new Playground({
    target: document.querySelector("#app")!,
    hydrate: !import.meta.env.DEV,
  }),
});
