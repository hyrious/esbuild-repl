import { writable } from "svelte/store";

export type Mode = "transform" | "build";
const mode = writable<Mode>();
export default mode;

mode.subscribe((value) => {
  if (typeof document !== "undefined") {
    document.body.dataset.mode = value;
  }
});
