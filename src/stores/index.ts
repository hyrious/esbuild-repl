import { writable } from "svelte/store";
import { isBrowser } from "../helpers";

// header
export const theme = writable<"light" | "dark">("dark");

// footer
export const loading = writable(true);
export const status = writable("Loading...");

// essential
export const version = writable("latest");
export const esbuild = writable<typeof import("esbuild") | null>(null);
export const mode = writable<"transform" | "build" | "playground">("transform");

// other
export const debug = writable(import.meta.env.DEV);
export const versions = writable(["latest"]);

let timer = 0;
export function time() {
  timer = performance.now();
}
export function timeEnd() {
  const elapsed = performance.now() - timer;
  status.set(`Finished in ${elapsed.toFixed(2)}ms.`);
}

isBrowser && Object.assign(window, { stores: { theme, loading, status, esbuild, mode } });
