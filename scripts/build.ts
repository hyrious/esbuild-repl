import { build, analyzeMetafile } from "esbuild";
import { mkdirSync, promises, rmSync } from "fs";
import { importFile } from "@hyrious/esbuild-dev";
import { svelte, Options } from "@hyrious/esbuild-plugin-svelte";
import { icons } from "./plugins/icons";
import { noMap } from "./plugins/no-map";
import { alsoEmits } from "./plugins/emits";
import { trimNodeModules } from "./plugins/utils";
// import { fixture } from "./plugins/fixture";
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

// build html
{
  async function renderHTML(svelteFile: string, templateFile: string) {
    const { default: App } = await importFile(svelteFile, {
      plugins: [
        // fixture({ filter: /playground\.ts$/ }),
        icons({ glob: "src/**/*.svelte", ssr: true }),
        svelte({ compilerOptions: { generate: "ssr", ...compilerOptions } }),
      ],
      define: {
        "import.meta.env.DEV": "false",
        __SSR__: "true",
      },
    }).catch(() => process.exit(1));

    const { html, head } = App.render();
    const template = await read(templateFile, "utf8");

    const beforeHead = template.indexOf("</head>");
    const inApp = template.indexOf('<div id="app">') + '<div id="app">'.length;

    let result = template.slice(0, beforeHead);
    result += head;
    result += template.slice(beforeHead, inApp);
    result += html.trim();
    result += template.slice(inApp);

    await write(templateFile.replace(/^src\//, "dist/"), result);
  }

  await Promise.all([
    renderHTML("src/App.svelte", "src/index.html"),
    renderHTML("src/playground/Playground.svelte", "src/play.html"),
    copy("src/favicon.svg", "dist/favicon.svg"),
  ]);
}

// build js
{
  const result = await build({
    entryPoints: ["src/main.ts", "./src/play.ts", "src/sw.ts", "src/hljs.ts"],
    bundle: true,
    format: "esm",
    plugins: [
      // fixture({ filter: /playground\.ts$/ }),
      icons({ glob: "src/**/*.svelte", ssr: true }),
      svelte({ emitCss: true, compilerOptions }),
      noMap,
      alsoEmits(["dist/index.html", "dist/play.html", "dist/favicon.svg"]),
    ],
    splitting: true,
    minify: true,
    sourcemap: true,
    outdir: "dist",
    define: {
      "import.meta.env.DEV": "false",
      __SSR__: "false",
    },
    legalComments: "none",
    metafile: true,
  }).catch(() => process.exit(1));

  console.log(await analyzeMetafile(trimNodeModules(result.metafile), { color: true }));
}
