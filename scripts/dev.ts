import { createReadStream, statSync } from "fs";
import { build, Plugin, serve } from "esbuild";
import { createServer, ServerResponse } from "http";
import { svelte } from "@hyrious/esbuild-plugin-svelte";
import { clearWarns } from "./plugins/utils";
import { icons } from "./plugins/icons";
import { resolve } from "path";

let port = 3000;

const clients: ServerResponse[] = [];

const plugins: Plugin[] = [icons(), svelte()];

// use [watch] and [serve] together to enable hot reload.
// this is a bit tricky, the [icons] plugin will make use of
// `onEnd()` to generate an 'icons.css' file at the second pass.
//
// however, `onEnd()` will never be triggered in serve mode:
// https://github.com/evanw/esbuild/issues/1384
//
// we reuse the same plugin instance to let build & serve
// share the context -- hopefully it works! Thus in serve mode
// we can still get a fresh 'icons.css'.
//
// in other words, even when esbuild finally resolves that issue,
// the [icons] plugin will still work as expected.

const { stop: stopWatch } = await build({
  entryPoints: ["./src/main.ts", "./src/play.ts", "./src/hljs.ts"],
  bundle: true,
  format: "esm",
  plugins,
  watch: {
    onRebuild() {
      clearWarns();
      clients.forEach((res) => res.write("data: update\n\n"));
      clients.length = 0;
    },
  },
  logLevel: "silent",
  write: false,
  outdir: "dist",
});

const banner = `// hot-reload
;((source) => {
  if (source && source.onmessage) return;
  let count = 0; source && (source.onmessage = (ev) => {
    if (ev.data === 'init') count ? location.reload() : count++
    if (ev.data === 'update') location.reload()
  }, console.log("[dev] hot reload enabled"))
})(typeof window !== 'undefined' && (window.source ||= new EventSource("http://localhost:30000")));
`;

const { stop: stopServe } = await serve(
  {
    host: "localhost",
    port,
    servedir: "./src",
  },
  {
    entryPoints: ["./src/main.ts", "./src/play.ts", "./src/hljs.ts"],
    bundle: true,
    format: "esm",
    splitting: true,
    plugins,
    sourcemap: true,
    banner: {
      js: banner,
    },
    define: {
      "import.meta.env.DEV": "true",
    },
  }
);

createServer((req, res) => {
  if (req.url === "/") {
    const client = res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": `http://localhost:${port}`,
      Connection: "keep-alive",
    });
    res.write("data: init\n\n");
    clients.push(client);
  } else if (req.url === "/esbuild.wasm") {
    const path = resolve("node_modules/esbuild-wasm/esbuild.wasm");
    const stats = statSync(path);
    res.writeHead(200, {
      "Content-Length": stats.size,
      "Content-Type": "application/wasm",
      "Last-Modified": stats.mtime.toUTCString(),
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": `http://localhost:${port}`,
    });
    createReadStream(path).pipe(res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(30000, () => console.log(`serving http://localhost:${port}`));

process.once("SIGTERM", async () => {
  try {
    stopWatch && stopWatch();
    stopServe && stopServe();
  } finally {
    process.exit(0);
  }
});
