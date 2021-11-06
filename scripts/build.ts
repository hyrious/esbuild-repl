import esbuild from "esbuild";
import { argv, exit } from "node:process";
import { mergeMetafile } from "./utils";
import buildHTML from "./build-html";
import buildJS from "./build-js";
import prettyBytes from "pretty-bytes";

type Entry = [filename: string, info: { bytes: number }];

function customSort(a: Entry, b: Entry) {
  // Sort source maps last
  const isSourceMap = (x: Entry) => x[0].endsWith(".map");
  let isSourceMap_a = isSourceMap(a);
  let isSourceMap_b = isSourceMap(b);
  if (!isSourceMap_a && isSourceMap_b) {
    return -1;
  }
  if (isSourceMap_a && !isSourceMap_b) {
    return 1;
  }

  // Sort by size first
  if (a[1].bytes > b[1].bytes) {
    return -1;
  }
  if (a[1].bytes < b[1].bytes) {
    return 1;
  }

  // Sort alphabetically
  return a[0].localeCompare(b[0]);
}

try {
  const metafile = mergeMetafile(await buildHTML(), await buildJS());
  if (argv.includes("--verbose")) {
    console.log(
      await esbuild.analyzeMetafile(metafile, { color: true, verbose: true })
    );
  } else {
    const files = Object.entries(metafile.outputs)
      .sort(customSort)
      .map(([filename, e]) => ({ filename, bytes: e.bytes }));
    let maxWidth = 0;
    for (let { filename } of files) {
      maxWidth = Math.max(maxWidth, filename.length);
    }
    for (let { filename, bytes } of files) {
      console.log("  " + filename.padEnd(maxWidth), prettyBytes(bytes));
    }
  }
} catch (e) {
  console.error(e);
  exit(1);
}
