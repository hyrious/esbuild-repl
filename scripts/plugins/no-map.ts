import { Plugin } from "esbuild";
import { promises } from "fs";
const read = promises.readFile;

function base64(str: string) {
  return Buffer.from(str).toString("base64");
}
const EmptyMap =
  "data:application/json;base64," +
  base64('{"version":3,"sources":[""],"mappings":"A"}');

// https://github.com/evanw/esbuild/issues/1685#issuecomment-944916409
export const noMap: Plugin = {
  name: "no-map",
  setup({ onLoad }) {
    onLoad({ filter: /node_modules.*\.m?js$/ }, async (args) => {
      return {
        contents:
          (await read(args.path, "utf8")) +
          `\n//# sourceMappingURL=${EmptyMap}`,
        loader: "default",
      };
    });
    onLoad({ filter: /node_modules.*\.css$/ }, async (args) => {
      return {
        contents:
          (await read(args.path, "utf8")) +
          `\n/*# sourceMappingURL=${EmptyMap} */`,
        loader: "default",
      };
    });
  },
};
