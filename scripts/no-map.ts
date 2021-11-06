import type { Plugin } from "esbuild";
import { readFile } from "node:fs/promises";

// https://github.com/evanw/esbuild/issues/1685#issuecomment-944916409
const noMap: Plugin = {
  name: "no-map",
  setup({ onLoad }) {
    const EmptyMap =
      "\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiJdLCJtYXBwaW5ncyI6IkEifQ==";

    onLoad({ filter: /node_modules.*\.m?js$/ }, async (args) => {
      return {
        contents: (await readFile(args.path, "utf8")) + EmptyMap,
        loader: "default",
      };
    });
  },
};

export default noMap;
