import type { Plugin } from "esbuild";
import type { Warning } from "svelte/types/compiler/interfaces";
import { relative, dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { compile } from "svelte/compiler";
import { convertMessage } from "./utils";

interface Output {
  code: string;
  map: {
    toUrl(): string;
    file: string;
    sources: string[];
    sourcesContent: string[];
  };
}

const svelte: Plugin = {
  name: "svelte",
  setup({ onResolve, onLoad }) {
    const cwd = process.cwd();
    const map = new Map<number, Data>();
    type Data = { js: Output; css: Output; dir: string; filename: string };

    let _id_ = 1;
    const ID = () => _id_++;

    onResolve({ filter: /^__svelte__:\/\// }, (args) => {
      const { 1: key, index } = args.path.match(/\?id=(\d+)$/)!;
      return {
        path: args.path.slice(13, index),
        namespace: "svelte",
        pluginData: map.get(+key),
      };
    });

    onLoad({ filter: /\.css$/, namespace: "svelte" }, (args) => {
      const { css, dir, filename } = args.pluginData as Data;
      if (css) {
        // hack into css sourcemap, because cssOutputFilename does not work
        css.map.file = `../${filename}`;
        css.map.sources = [css.map.file];
        return {
          contents: css.code + `/*# sourceMappingURL=${css.map.toUrl()} */`,
          loader: "css",
          resolveDir: dir,
        };
      }
    });

    onLoad({ filter: /\.js$/, namespace: "svelte" }, (args) => {
      const { js, dir } = args.pluginData as Data;
      if (js) {
        return {
          contents: js.code + `//# sourceMappingURL=` + js.map.toUrl(),
          resolveDir: dir,
        };
      }
    });

    onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await readFile(args.path, "utf8");
      const filename = relative(cwd, args.path).replace(/\\/g, "/");
      try {
        const { js, css, warnings } = compile(source, {
          filename,
          outputFilename: "dist/main.js",
          generate: "dom",
          hydratable: true,
          css: false,
        }) as { js: Output; css: Output; warnings: Warning[] };

        const messages = warnings.map((w) =>
          convertMessage(source, filename, w)
        );

        const key = ID();
        map.set(key, { js, css, dir: dirname(args.path), filename });
        const id = `__svelte__://${filename}`;
        return {
          // svelte component must contains a default export
          contents: `
            ${css.code ? `import "${id}.css?id=${key}";` : ""}
            export * from "${id}.js?id=${key}";
            export { default } from "${id}.js?id=${key}";
          `,
          warnings: messages,
        };
      } catch (e) {
        return { errors: [convertMessage(source, filename, e as Warning)] };
      }
    });
  },
};

export default svelte;
