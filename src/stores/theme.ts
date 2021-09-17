import { writable } from "svelte/store";

export type Theme = "light" | "dark" | "auto";
const theme = writable<Theme>("auto");
export default theme;

theme.subscribe((value) => {
  if (typeof document !== "undefined") {
    document.body.dataset.theme = value;
  }
});
