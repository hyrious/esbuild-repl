import type { BuildOptions } from "esbuild";
import { derived, Readable } from "svelte/store";
import { configToString, getQuery, setQuery } from "../helpers";
import { debug, mode, version } from "../stores";
import { buildOptions, Module, modules } from "../stores/build";
import { input, options } from "../stores/transform";

function encodeModules($modules: Module[]) {
  return JSON.stringify($modules.map((m) => [m.name, m.contents, Number(m.isEntry)]));
}

function decodeModules(raw: string): Module[] {
  try {
    return JSON.parse(raw).map(
      (e: string[]) =>
        ({
          name: e[0],
          contents: e[1],
          isEntry: Boolean(e[2]),
        } as Module)
    );
  } catch {
    return [];
  }
}

function encodeBuildOptions($buildOptions: BuildOptions) {
  return JSON.stringify($buildOptions);
}

function decodeBuildOptions(raw: string): BuildOptions {
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

const query: Readable<string> = derived(
  [version, mode, input, options, modules, buildOptions],
  ([$version, $mode, $input, $options, $modules, $buildOptions], set) => {
    if (!$version || $version === "latest") return;
    if ($mode === "playground") return;
    const params: [string, string][] = [
      ["version", $version],
      ["mode", $mode],
    ];
    if ($mode === "transform") {
      $input && params.push(["input", $input]);
      $options && params.push(["options", $options]);
    }
    if ($mode === "build") {
      $modules.length && params.push(["modules", encodeModules($modules)]);
      Object.keys($buildOptions).length &&
        params.push(["buildOptions", encodeBuildOptions($buildOptions)]);
    }
    const search = new URLSearchParams(params);
    set(search.toString());
  }
);

query.subscribe((value) => {
  if (value) setQuery(value);
});

const { shareable, ...shared } = getQuery();
// legacy shareable url
if (shareable) {
  const legacy = JSON.parse(decodeURIComponent(atob(shareable)));
  console.log("legacy shareable:", legacy);
  if (legacy.code) input.set(legacy.code);
  if (legacy.config) options.set(configToString(legacy.config));
  if (legacy.modules) {
    mode.set("build");
    modules.set(
      legacy.modules.map(({ code: contents, ...rest }: any) => {
        return { contents, ...rest } as Module;
      })
    );
  }
  if (legacy.options) buildOptions.set(legacy.options);
}

Object.keys(shared).length && console.log(shared);
if (shared.mode) mode.set(shared.mode as "build");
if (shared.input) input.set(shared.input);
if (shared.options) options.set(shared.options);
if (shared.modules) modules.set(decodeModules(shared.modules));
if (shared.buildOptions) buildOptions.set(decodeBuildOptions(shared.buildOptions));
if (shared.debug) debug.set(true);
