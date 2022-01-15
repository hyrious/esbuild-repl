import { Plugin } from "esbuild";
import { statSync, promises } from "fs";
import { relative } from "path";
const write = promises.writeFile;

const thunder = "\u26A1";
const bold = "\x1b[97m";
const green = "\x1b[32m";
const cyan = "\x1b[36m";
const reset = "\x1b[m";

export function alsoEmits(files: string[]): Plugin {
  let timer = 0;
  const timeBegin = () => {
    timer = Date.now();
  };
  const timeEnd = () => {
    console.log(thunder, green + `Done in ${Date.now() - timer}ms` + reset);
  };

  const formatPath = (path: string[], color: boolean | 0) => {
    if (!color) return path.join("/");
    path = path.slice();
    const basename = path.pop();
    return path.join("/") + bold + "/" + basename + reset;
  };

  const formatSize = (size: number, color: boolean | 0) => {
    const num = size > 1000 ? (size / 1000).toFixed(1) + "kb" : size + "b ";
    if (!color) return num;
    return cyan + num + reset;
  };

  type Entry = [path: string[], size: number];
  const customSort = (a: Entry, b: Entry) => {
    const a_name = a[0].join("/");
    const b_name = b[0].join("/");
    const a_is_map = a_name.endsWith(".map");
    const b_is_map = b_name.endsWith(".map");

    if (!a_is_map && b_is_map) return -1;
    if (a_is_map && !b_is_map) return 1;

    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;

    return a_name.localeCompare(b_name);
  };

  return {
    name: "metafile",
    setup({ onStart, onEnd, initialOptions }) {
      initialOptions.write = false;
      initialOptions.metafile = true;
      initialOptions.logLevel = "silent";

      onStart(timeBegin);

      onEnd(async (result) => {
        const tasks: Promise<void>[] = [];
        const info: [path: string[], size: number][] = [];
        for (const file of files) {
          info.push([file.split(/[\\/]/), statSync(file).size]);
        }

        const cwd = process.cwd();
        for (const { path, contents } of result.outputFiles!) {
          const file = relative(cwd, path);
          info.push([file.split(/[\\/]/), contents.byteLength]);
          tasks.push(write(path, contents));
        }

        const width =
          info.reduce(
            (a, [p, s]) => Math.max(a, formatPath(p, 0).length + formatSize(s, 0).length),
            0
          ) + 2;

        for (const [p, s] of info.sort(customSort)) {
          const sub_width = formatPath(p, 0).length + formatSize(s, 0).length;
          const path = "  " + formatPath(p, true);
          const size = " ".repeat(width - sub_width) + formatSize(s, true);
          console.log(path + size);
        }
        console.log();
        timeEnd();

        await Promise.all(tasks);
      });
    },
  };
}
