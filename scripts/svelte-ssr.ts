import type { Plugin } from "esbuild";
import type { Warning } from "svelte/types/compiler/interfaces";
import { relative } from "node:path";
import { readFile } from "node:fs/promises";
import { compile } from "svelte/compiler";
import { convertMessage } from "./utils";

const svelteSSR: Plugin = {
  name: "svelte-ssr",
  setup({ onLoad }) {
    const cwd = process.cwd();
    onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await readFile(args.path, "utf8");
      const filename = relative(cwd, args.path);
      try {
        // in ssr mode, we do not need css output because the whole `js`
        // is about to run in node side.
        const { js, warnings } = compile(source, {
          filename,
          generate: "ssr",
          hydratable: true,
          css: false,
        });
        return {
          contents: js.code + `//# sourceMappingURL=` + js.map.toUrl(),
          warnings: warnings.map((w) => convertMessage(source, filename, w)),
        };
      } catch (e) {
        return { errors: [convertMessage(source, filename, e as Warning)] };
      }
    });
  },
};

export default svelteSSR;
