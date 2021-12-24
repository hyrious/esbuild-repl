import pRetry from "p-retry";
import { delay, getQuery, isBrowser, isDef, noop } from "../helpers";
import {
  esbuild as $esbuild,
  loading as $loading,
  status as $status,
  version as $version,
} from "../stores";

type esbuild_t = typeof import("esbuild");

const prefixes = ["https://cdn.jsdelivr.net/npm", "https://unpkg.com"];
const jsUrl = (i: number, ver: string) => `${prefixes[i]}/esbuild-wasm@${ver}/lib/browser.min.js`;
const wasmUrl = (i: number, ver: string) => `${prefixes[i]}/esbuild-wasm@${ver}/esbuild.wasm`;

async function load() {
  const version = getQuery().version || "latest";
  console.log("loading esbuild @", version);

  let module = {
    initialize: noop,
    build: noop,
    formatMessages: noop,
    transform: noop,
    version: "none",
  } as Partial<esbuild_t> as esbuild_t;

  if (!isBrowser) {
    $esbuild.set(module);
    return;
  }

  if (import.meta.env.DEV) {
    $status.set("Fetching esbuild @ " + version);
    module = await import("esbuild-wasm");
    window.esbuild = module;
    $version.set(module.version);
    $status.set("Downloading esbuild.wasm @ " + version);
    await module.initialize({ wasmURL: "http://localhost:30000/esbuild.wasm" });
    await module.transform("let a = 1");
    $esbuild.set(module);
    console.log("loaded esbuild @", module.version);
    return;
  }

  for (let i = 0; i < prefixes.length; ++i) {
    try {
      const jsURL = jsUrl(i, version);
      $status.set("Fetching " + jsURL);
      await pRetry(() => report(script(jsURL, () => isDef(window.esbuild))), { retries: 3 });
      module = window.esbuild as esbuild_t;
      $version.set(module.version);
      const wasmURL = wasmUrl(i, module.version);
      $status.set("Downloading " + wasmURL);
      await pRetry(() => report(module.initialize({ wasmURL })), { retries: 3 });
      await module.transform("let a = 1"); // warm up
      break;
    } catch {
      continue;
    }
  }

  if (module.version === "none") {
    throw new Error("Error: failed to load esbuild-wasm, try refresh the page.");
  }

  $esbuild.set(module);
  console.log("loaded esbuild @", module.version);
}

async function report<T>(promise: Promise<T>) {
  try {
    return await promise;
  } catch (err) {
    $status.set(String(err));
    console.error(err);
    throw err;
  }
}

function script(src: string, isReady: () => boolean) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = async () => {
      if (isReady()) resolve();
      for (let i = 0; i < 10; ++i) {
        await delay(100);
        if (isReady()) resolve();
      }
      reject(new Error(`Failed to import ${src}.`));
    };
    script.onerror = () => {
      script.remove();
      reject();
    };
    script.src = src;
    document.head.append(script);
  });
}

(async () => {
  try {
    await load();
    $status.set("Ready.");
    $loading.set(false);
  } catch (err) {
    $status.set(String(err));
    console.error(err);
  }
})();
