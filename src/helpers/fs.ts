// virtual fs plugin
// redirect all entry to $modules

import type { Loader, Plugin } from "esbuild";
import type { Module } from "../stores/build";

function extname(filename: string) {
  const i = filename.lastIndexOf(".");
  if (i !== -1) return filename.slice(i);
}

function stripExt(filename: string) {
  const i = filename.lastIndexOf(".");
  if (i !== -1) {
    return filename.slice(0, i);
  } else {
    return filename;
  }
}

const ExtToLoader: Record<string, Loader> = {
  ".js": "js",
  ".mjs": "js",
  ".cjs": "js",
  ".jsx": "jsx",
  ".ts": "ts",
  ".cts": "ts",
  ".mts": "ts",
  ".tsx": "tsx",
  ".css": "css",
  ".json": "json",
  ".txt": "text",
};

function extToLoader(filename: string) {
  const ext = extname(filename);
  if (ext) return ExtToLoader[ext];
}

const fs_plugin: ($modules: Module[]) => Plugin = ($modules) => ({
  name: "fs",
  setup({ onResolve, onLoad, initialOptions, esbuild: esbuildFromPlugin }) {
    onResolve({ filter: /.*/ }, (args) => {
      const name = args.path.replace(/^\.\//, "");
      let mod: Module | undefined;
      mod = $modules.find((e) => e.name === name);
      if (mod) {
        return { path: name, namespace: "fs", pluginData: mod };
      } else {
        const withoutExt = $modules.filter((e) => stripExt(e.name) === name);
        if (withoutExt.length === 1) {
          [mod] = withoutExt;
          return { path: mod.name, namespace: "fs", pluginData: mod };
        }
        return { path: args.path, external: true };
      }
    });
    onLoad({ filter: /.*/, namespace: "fs" }, async (args) => {
      const mod: Module = args.pluginData;
      if (mod) {
        const { code } = await (esbuildFromPlugin || window.esbuild).transform(
          mod.code,
          {
            loader: extToLoader(mod.name),
            sourcefile: args.path,
            sourcemap: "inline",
            format: initialOptions.format,
          }
        );
        return { contents: code, loader: "default" };
      }
    });
  },
});

export default fs_plugin;
