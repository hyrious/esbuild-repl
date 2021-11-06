import { writable } from "svelte/store";
import { elapsed } from "./esbuild";

export type Mode = "transform" | "build";
const mode = writable<Mode>();
export default mode;

mode.subscribe((value) => {
  if (typeof document !== "undefined") {
    document.body.dataset.mode = value;
    elapsed.set(0);
  }
});
