// virtual fs plugin
// redirect all entry to $modules

import type { Plugin } from "esbuild";
import type { Module } from "../stores/build";

const fs_plugin: ($modules: Module[]) => Plugin = ($modules) => ({
  name: "fs",
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /()/ }, (args) => {
      const name = args.path.replace(/^\.\//, "");
      const mod = $modules.find((e) => e.name === args.path);
      if (mod) {
        return { path: name, namespace: "fs", pluginData: mod };
      } else {
        return { path: args.path, external: true };
      }
    });
    onLoad({ filter: /()/, namespace: "fs" }, (args) => {
      const mod: Module = args.pluginData;
      if (mod) {
        return { contents: mod.code, loader: "default" };
      }
    });
  },
});

export default fs_plugin;
