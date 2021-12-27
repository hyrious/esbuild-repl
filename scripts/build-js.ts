import { argv } from "node:process";
import esbuild, { BuildOptions } from "esbuild";
import { mergeMetafile } from "./utils";
import svelte from "./svelte";
import noMap from "./no-map";

const prod = argv.includes("--prod");

export const commonOptions: BuildOptions = {
  outdir: "dist",
  minify: prod,
  treeShaking: true,
  charset: "utf8",
  define: {
    __DEV__: prod ? "false" : "true",
  },
  metafile: true,
  target: "chrome86",
};

export default async function buildJS() {
  let main = esbuild.build({
    entryPoints: ["./src/main.ts"],
    bundle: true,
    format: "esm",
    sourcemap: true,
    plugins: [svelte, ...(prod ? [noMap] : [])],
    splitting: true,
    loader: {
      ".svg": "file",
      ".woff": "file",
      ".woff2": "dataurl",
      ".eot": "file",
      ".ttf": "file",
    },
    ...commonOptions,
  });

  // let sw = esbuild.build({
  //   entryPoints: ["./src/sw.ts"],
  //   ...commonOptions,
  // });

  let hljs = esbuild.build({
    entryPoints: ["./src/hljs.ts"],
    ...commonOptions,
  });

  const { metafile: m1 } = await main;
  // const { metafile: m2 } = await sw;
  const { metafile: m3 } = await hljs;

  return [m1, m3].reduce(mergeMetafile);
}
