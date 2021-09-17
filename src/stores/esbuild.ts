import { writable } from "svelte/store";

export type esbuild_t = typeof import("esbuild");

export const loading = writable(true);
export const version = writable("");
export const error = writable<Error | false>(false);
export const elapsed = writable(0);

function getEsbuildUrl($version: string) {
  return `https://cdn.jsdelivr.net/npm/esbuild-wasm@${$version}/lib/browser.min.js`;
}

function getEsbuildWasmUrl($version: string) {
  return `https://cdn.jsdelivr.net/npm/esbuild-wasm@${$version}/esbuild.wasm`;
}

declare global {
  var esbuild: esbuild_t;
}

version.subscribe(($version: string) => {
  if (typeof document !== "undefined") {
    if (!$version) return;
    loading.set(true);
    const url = getEsbuildUrl($version);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = async () => {
        await esbuild.initialize({ wasmURL: getEsbuildWasmUrl($version) });
        await esbuild.transform("let a = 1");
        version.set(esbuild.version);
        loading.set(false);
        resolve(esbuild);
      };
      script.onerror = () => {
        const err = new Error(`Could not load esbuild from ${url}.`);
        error.set(err);
        loading.set(false);
        reject(err);
      };
      script.src = url;
      document.head.append(script);
    });
  }
});
