import { build, analyzeMetafile } from "esbuild";
import { mkdirSync, promises, rmSync } from "fs";
import { importFile } from "@hyrious/esbuild-dev";
import { svelte, Options } from "@hyrious/esbuild-plugin-svelte";
import { icons } from "./plugins/icons";
import { noMap } from "./plugins/no-map";
import { alsoEmits } from "./plugins/emits";
import { trimNodeModules } from "./plugins/utils";
const read = promises.readFile;
const write = promises.writeFile;
const copy = promises.copyFile;

rmSync("dist", { recursive: true, force: true, maxRetries: 3 });
mkdirSync("dist", { recursive: true });

const compilerOptions: Options["compilerOptions"] = {
  hydratable: true,
  css: false,
  enableSourcemap: { js: true, css: false },
};

const iconsPlugin = icons({ ssr: true });

// build html
{
  const { default: App } = await importFile("src/App.svelte", {
    plugins: [iconsPlugin, svelte({ compilerOptions: { generate: "ssr", ...compilerOptions } })],
    define: {
      "import.meta.env.DEV": "false",
    },
  }).catch(() => process.exit(1));
  const { html, head } = App.render();
  const template = await read("src/index.html", "utf8");

  const beforeHead = template.indexOf("</head>");
  const inApp = template.indexOf('<div id="app">') + '<div id="app">'.length;

  let result = template.slice(0, beforeHead);
  result += head;
  result += template.slice(beforeHead, inApp);
  result += html.trim();
  result += template.slice(inApp);

  await Promise.all([
    write("dist/index.html", result),
    copy("src/favicon.svg", "dist/favicon.svg"),
  ]);
}

// build js
{
  const result = await build({
    entryPoints: ["src/main.ts", "src/sw.ts", "src/hljs.ts"],
    bundle: true,
    format: "esm",
    plugins: [
      iconsPlugin,
      svelte({ emitCss: true, compilerOptions }),
      noMap,
      alsoEmits(["dist/index.html", "dist/favicon.svg"]),
    ],
    splitting: true,
    minify: true,
    sourcemap: true,
    outdir: "dist",
    define: {
      "import.meta.env.DEV": "false",
    },
    legalComments: "none",
    metafile: true,
  }).catch(() => process.exit(1));

  console.log(await analyzeMetafile(trimNodeModules(result.metafile), { color: true }));
}
