import type { Plugin } from "esbuild";
import type { Warning } from "svelte/types/compiler/interfaces";
import { parse, relative, dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { compile } from "svelte/compiler";
import { convertMessage } from "./utils";

interface Output {
  code: string;
  map: { toUrl(): string };
}

const svelte: Plugin = {
  name: "svelte",
  setup({ onResolve, onLoad }) {
    const cwd = process.cwd();
    const map = new Map<number, Data>();
    type Data = { js: Output; css: Output; dir: string };

    let _id_ = 1;
    const ID = () => _id_++;

    onResolve({ filter: /^__svelte_/ }, (args) => {
      const { 0: key, index } = args.path.match(/\d+/)!;
      return {
        path: args.path.slice(index! + key.length + 1),
        namespace: "svelte",
        pluginData: map.get(+key),
      };
    });

    onLoad({ filter: /\.css$/, namespace: "svelte" }, (args) => {
      const { css, dir } = args.pluginData as Data;
      if (css) {
        return {
          contents: css.code + `/*# sourceMappingURL=${css.map.toUrl()} */`,
          loader: "css",
          resolveDir: dir,
        };
      }
      return undefined;
    });

    onLoad({ filter: /\.js$/, namespace: "svelte" }, (args) => {
      const { js, dir } = args.pluginData as Data;
      if (js) {
        return {
          contents: js.code + `//# sourceMappingURL=` + js.map.toUrl(),
          resolveDir: dir,
        };
      }
      return undefined;
    });

    onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await readFile(args.path, "utf8");
      const filename = relative(cwd, args.path);
      try {
        const { js, css, warnings } = compile(source, {
          filename,
          name: parse(args.path).name,
          generate: "dom",
          hydratable: true,
          css: false,
        }) as { js: Output; css: Output; warnings: Warning[] };

        const messages = warnings.map((w) =>
          convertMessage(source, filename, w)
        );

        if (css.code) {
          const key = ID();
          map.set(key, { js, css, dir: dirname(args.path) });
          const id = `__svelte_${key}:${filename.replaceAll("\\", "/")}`;
          return {
            // svelte component must contains a default export
            contents: `
              import "${id}.css";
              export * from "${id}.js";
              export { default } from "${id}.js";
            `,
            warnings: messages,
          };
        }

        return {
          contents: js.code + `//# sourceMappingURL=` + js.map.toUrl(),
          warnings: messages,
        };
      } catch (e) {
        return { errors: [convertMessage(source, filename, e as Warning)] };
      }
    });
  },
};

export default svelte;
