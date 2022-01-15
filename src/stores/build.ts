import type { BuildOptions, Message, Plugin } from "esbuild";
import { derived, Readable, writable } from "svelte/store";
import { isBrowser, render } from "../helpers";
import { esbuild, time, timeEnd } from "./index";

export interface Module {
  name: string;
  contents: string;
  isEntry: boolean;
}

export const modules = writable<Module[]>([
  { name: "main.js", contents: "export let a = 1", isEntry: true },
]);
export const buildOptions = writable<BuildOptions>({
  bundle: true,
  format: "esm",
  splitting: true,
});

export interface Outputs {
  files?: Module[];
  errors?: Message[];
  warnings?: Message[];
}

function normalizeName(path: string) {
  return "/" + path.replace(/^[.\/]*/g, "");
}

function stripExt(path: string) {
  const i = path.lastIndexOf(".");
  return i !== -1 ? path.slice(0, i) : path;
}

function repl($modules: Module[]): Plugin {
  return {
    name: "repl",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /.*/ }, (args) => {
        const absPath = normalizeName(args.path);

        let mod = $modules.find((e) => normalizeName(e.name) === absPath);
        if (mod) return { path: absPath, pluginData: mod };

        mod = $modules.find((e) => stripExt(normalizeName(e.name)) === stripExt(absPath));
        if (mod) return { path: absPath, pluginData: mod };

        return { path: args.path, external: true };
      });

      onLoad({ filter: /.*/ }, (args) => {
        const mod: Module | undefined = args.pluginData;
        const loader = stripExt(args.path) === args.path ? "js" : "default";
        if (mod) return { contents: mod.contents, loader };
      });
    },
  };
}

export const outputs: Readable<Outputs> = derived(
  [esbuild, modules, buildOptions],
  ([$esbuild, $modules, $buildOptions], set) => {
    if (!$esbuild) return;

    const entryPoints = $modules.filter((e) => e.isEntry).map((e) => e.name);
    if (entryPoints.length === 0) return set({});

    const buildOptions = { entryPoints, ...$buildOptions };
    (buildOptions.plugins ||= []).unshift(repl($modules));
    buildOptions.outdir = "/";
    buildOptions.write = false;
    buildOptions.allowOverwrite = true;

    time();
    $esbuild
      .build(buildOptions as BuildOptions & { write: false })
      .then(({ outputFiles, errors, warnings }) => {
        const files = outputFiles.map(
          (file) =>
            ({
              name: file.path,
              contents: file.text,
              isEntry: false,
            } as Module)
        );
        set({ files, errors, warnings });
      })
      .catch(set)
      .finally(timeEnd);
  },
  { files: [{ name: "main.js", contents: "// initializing", isEntry: false }] } as Outputs
);

export const errorsHTML = derived([esbuild, outputs], ([$esbuild, $outputs], set) => {
  if (!$esbuild) return;
  const { errors, warnings } = $outputs;
  Promise.all([
    errors?.length ? $esbuild.formatMessages(errors, { color: true, kind: "error" }) : null,
    warnings?.length ? $esbuild.formatMessages(warnings, { color: true, kind: "warning" }) : null,
  ]).then((raw) => {
    const strings = (raw as string[][]).reduce((sum, xs) => (xs ? [...sum, ...xs] : sum), []);
    set(strings.map((ansi) => render(ansi)).join("\n"));
  });
});

isBrowser &&
  Object.assign(window, {
    stores_build: { modules, buildOptions, outputs },
  });
