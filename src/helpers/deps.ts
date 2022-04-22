import { Plugin } from "esbuild";

function deps(): Plugin {
  return {
    name: "deps",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /^[\@w]/ }, (args) => {});
    },
  };
}
