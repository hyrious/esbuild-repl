import { mkdirSync } from "node:fs";
import chokidar from "chokidar";
import debounceFn from "debounce-fn";
import serve from "@hyrious/w7";
import buildHTML from "./build-html";
import buildJS from "./build-js";

mkdirSync("dist", { recursive: true });
serve("dist", { port: 3000 });

const watcher = chokidar.watch("src", {
  ignoreInitial: true,
  ignorePermissionErrors: true,
  disableGlobbing: true,
});

const rebuild = debounceFn(
  async () => {
    try {
      await Promise.all([buildHTML(), buildJS()]);
      console.log("page refreshed");
    } catch {
      console.log("something went wrong");
    }
  },
  { wait: 100 }
);
watcher.on("change", rebuild);

rebuild();
console.log("watching src");
