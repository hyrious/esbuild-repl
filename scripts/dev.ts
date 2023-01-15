import { resolve } from "path";
import { createReadStream, statSync } from "fs";
import { context, Plugin } from "esbuild";
import { createServer } from "http";
import { svelte } from "@hyrious/esbuild-plugin-svelte";
import { clearWarns } from "./plugins/utils";
import { icons } from "./plugins/icons";
// import { fixture } from "./plugins/fixture";

let port = 3000;

const liveReload: Plugin = {
  name: "live-reload",
  setup({ onEnd }) {
    onEnd(clearWarns);
  },
};

const ctx = await context({
  entryPoints: ["./src/main.ts", "./src/hljs.ts"],
  bundle: true,
  format: "esm",
  splitting: true,
  plugins: [
    // fixture({ filter: /playground\.ts$/ }),
    icons({ glob: "src/**/*.svelte" }),
    svelte(),
    liveReload,
  ],
  sourcemap: "inline",
  define: {
    "import.meta.env.DEV": "true",
    "__SSR__": "false",
  },
  // Don't write to disk, but still accessible from the dev server mode
  // In our case, we are serving the ./src folder, the ./src/index.html
  // requests './src/main.js', so the outdir is './src'
  // Be aware that in build mode, the index.html is moved to ./dist,
  // and the outdir should be adjusted to './dist' too
  outdir: "./src",
  write: false,
});

ctx.watch();
await ctx.serve({
  host: "localhost",
  port,
  servedir: "./src",
});

// This server only serves the esbuild.wasm file from local fs.
const server = createServer((req, res) => {
  if (req.url === "/esbuild.wasm") {
    const path = resolve("node_modules/esbuild-wasm/esbuild.wasm");
    const stats = statSync(path);
    res.writeHead(200, {
      "Content-Length": stats.size,
      "Content-Type": "application/wasm",
      "Last-Modified": stats.mtime.toUTCString(),
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": `http://localhost:${port}`,
    });
    createReadStream(path).pipe(res, { end: true });
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(30000);

process.once("SIGTERM", async () => {
  await ctx.dispose();
  server.close(() => {
    process.exit(0);
  });
});
