import type { Module } from "../src/stores/build";

import { exit } from "node:process";
import fs_plugin from "../src/helpers/fs";
import esbuild from "esbuild";

const $modules: Module[] = [
  {
    name: "main.js",
    code: `
      import { add } from "./math.ts"
      console.log(add(3, 5))
    `,
    isEntry: true,
  },
  {
    name: "math.ts",
    code: `
      export const add = (a: number, b: number) => a + b
      export const mul = (a: number, b: number) => a * b
    `,
    isEntry: false,
  },
];

try {
  const result = await esbuild.build({
    entryPoints: $modules.filter((e) => e.isEntry).map((e) => e.name),
    bundle: true,
    format: "esm",
    splitting: true,
    outdir: "[out]",
    write: false,
    plugins: [fs_plugin($modules)],
    sourcemap: true,
    sourcesContent: false,
    charset: "utf8",
    minifySyntax: true,
  });
  for (const file of result.outputFiles) {
    console.log(
      "--".repeat(20),
      file.path.slice(file.path.lastIndexOf("[out]") + 6)
    );
    console.log(file.text);
  }
} catch {
  exit(1);
}
