import { writable } from "svelte/store";
import pRetry from "p-retry";
import { importScript } from "../helpers/script";

export type esbuild_t = typeof import("esbuild");

export const ready = writable(false);
export const version = writable("");
export const error = writable<Error | false>(false);

let resolveReady!: () => void;
let rejectReady!: (err: Error) => void;
export const readyPromise = new Promise<void>((r, j) => {
  resolveReady = r;
  rejectReady = j;
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

version.subscribe(async ($version: string) => {
  if (typeof document !== "undefined") {
    if (!$version) return;
    const url = getEsbuildUrl($version);

    try {
      await pRetry(
        () => importScript(url, () => typeof esbuild !== "undefined"),
        { retries: 3 }
      );

      const wasmURL = getEsbuildWasmUrl(esbuild.version);
      await pRetry(() => esbuild.initialize({ wasmURL }), { retries: 3 });

      await esbuild.transform("let a = 1");

      version.set(esbuild.version);
      ready.set(true);

      resolveReady();
    } catch (err) {
      error.set(err);
      ready.set(false);

      rejectReady(err);
    }
  }
});
