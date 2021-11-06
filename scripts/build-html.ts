import type { Metafile } from "esbuild";

import { mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import App from "../src/App.svelte?ssr";

export default async function buildHTML() {
  mkdirSync("dist", { recursive: true });

  const { html, head } = App.render();

  let inputBytes = 0;
  let outputBytes = 0;

  await readFile("./src/index.html", "utf8").then((template) => {
    inputBytes = template.length;
    template = template.replace(
      "%head%",
      head + `<link rel="stylesheet" href="./main.css">`
    );
    template = template.replace("%html%", html);
    template = template.replace(
      "%entry%",
      `<script type="module" src="./main.js"></script>`
    );
    outputBytes = template.length;
    return writeFile("./dist/index.html", template);
  });

  const metafile: Metafile = {
    inputs: {
      ["src/index.html"]: {
        bytes: inputBytes,
        imports: [],
      },
    },
    outputs: {
      ["dist/index.html"]: {
        bytes: outputBytes,
        inputs: {
          ["src/index.html"]: {
            bytesInOutput: inputBytes,
          },
          ["src/App.svelte"]: {
            bytesInOutput: outputBytes - inputBytes,
          },
        },
        imports: [],
        exports: [],
        entryPoint: "src/index.html",
      },
    },
  };

  return metafile;
}
