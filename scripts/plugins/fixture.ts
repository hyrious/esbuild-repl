import fg from "fast-glob";
import { Plugin } from "esbuild";
import { promises, readFileSync } from "fs";
import { basename, dirname, join } from "path";

interface Options {
  filter: RegExp;
}

export function fixture({ filter }: Options): Plugin {
  return {
    name: "fixture",
    setup({ onLoad }) {
      const read = promises.readFile;

      onLoad({ filter }, async (args) => {
        const resolveDir = dirname(args.path);
        let code = await read(args.path, "utf8");
        // must be double quoted string
        code = code.replace(/\bfixture\(("[^)]+)\)/g, (_, string) => {
          const path = join(resolveDir, JSON.parse(string));
          const files = fg.sync(path);
          return JSON.stringify(
            files.map((file) => ({
              name: basename(file),
              contents: readFileSync(file, "utf8"),
            }))
          );
        });
        return { contents: code, loader: "default" };
      });
    },
  };
}
