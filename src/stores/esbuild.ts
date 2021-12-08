import { writable } from "svelte/store";
import pRetry from "p-retry";

export type esbuild_t = typeof import("esbuild");

export const ready = writable(false);
export const version = writable("");
export const error = writable<Error | false>(false);

let resolveReady!: () => void;
export const readyPromise = new Promise<void>((r) => {
  resolveReady = r;
});

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
    const url = getEsbuildUrl($version);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const onerror = () => {
        const err = new Error(`Could not load esbuild from ${url}.`);
        error.set(err);
        reject(err);
        ready.set(false);
      };
      script.onerror = onerror;
      script.onload = async () => {
        const wasmURL = getEsbuildWasmUrl(esbuild.version);
        await pRetry(() => esbuild.initialize({ wasmURL }), {
          retries: 3,
        }).catch(onerror);
        await esbuild.transform("let a = 1");
        version.set(esbuild.version);
        resolve(esbuild);
        ready.set(true);
        resolveReady();
      };
      script.src = url;
      document.head.append(script);
    });
  }
});
