import { derived, writable } from "svelte/store";
import { isBrowser } from "../helpers";
import { bundle, get_modules } from "../helpers/bundle";
import { buildOptions, outputs } from "./build";
import { optionsObj, result } from "./transform";

// header
export const theme = writable<"light" | "dark">("dark");

// footer
export const loading = writable(true);
export const status = writable("Loading...");

// essential
export const version = writable("latest");
export const esbuild = writable<typeof import("esbuild") | null>(null);
export const mode = writable<"transform" | "build">("transform");
export const play = writable(false);

// other
export const debug = writable(import.meta.env.DEV);
export const versions = writable(["latest"]);
export const scripts = derived(
  [play, esbuild, mode, buildOptions, optionsObj, result, outputs],
  ([$play, $esbuild, $mode, $buildOptions, $optionsObj, $result, $outputs], set) => {
    if ($play && $esbuild && ($result || $outputs)) {
      bundle(get_modules(), $mode === "build" ? $buildOptions : $optionsObj)
        .then(set)
        .catch(status.set);
    }
  }
);

let timer = 0;
export function time() {
  timer = performance.now();
}
export function timeEnd() {
  const elapsed = performance.now() - timer;
  if (elapsed > 1000) {
    status.set(`Finished in ${(elapsed / 1000).toFixed(2)}s.`);
  } else {
    status.set(`Finished in ${elapsed.toFixed(2)}ms.`);
  }
}

isBrowser && Object.assign(window, { stores: { theme, loading, status, esbuild, mode } });
