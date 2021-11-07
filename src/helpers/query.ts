import type { BuildOptions, TransformOptions } from "esbuild";
import type { Opaque } from "type-fest";
import type { Module } from "../stores/build";

import { get } from "svelte/store";
import { modules, options } from "../stores/build";
import { code, config } from "../stores/transform";
import { version } from "../stores/esbuild";
import mode from "../stores/mode";

export interface Shareable {
  code?: string;
  config?: TransformOptions;
  modules?: Module[];
  options?: BuildOptions;
}

export interface QueryObject {
  version?: string;
  shareable?: Opaque<string, Shareable>;
  gist?: string;
  entry?: string;
}

interface GistResult {
  files: Record<string, { filename: string; content: string }>;
}

const atob =
  typeof window === "undefined"
    ? (base64: string) => Buffer.from(base64, "base64").toString()
    : window.atob;

export function getQuery(): QueryObject {
  if (typeof location === "undefined") return {};
  const query: QueryObject = {};
  for (const [key, value] of new URLSearchParams(location.search.slice(1))) {
    query[key as keyof QueryObject] = value as any;
  }
  return query;
}

const DefaultCode = "let a = 1";

const DefaultModule: Module = {
  name: "main.js",
  code: "export let a = 1",
  isEntry: true,
};

/**
 * Call this method at the very beginning, to update `$version`.
 * Then call `loadEsbuild($version)` to trigger loading.
 */
export async function updateStoresFromQuery(query: QueryObject) {
  try {
    if (query.shareable) {
      const json = decodeURIComponent(atob(query.shareable));
      const shareable: Shareable = JSON.parse(json);
      console.log(query.version, shareable);
      if (shareable.config) {
        config.set(shareable.config);
        code.set(shareable.code || DefaultCode);
        mode.set("transform");
      } else if (shareable.options) {
        options.set(shareable.options);
        modules.set(shareable.modules || [DefaultModule]);
        mode.set("build");
      }
    } else if (query.gist) {
      await updateStoreFromGist(query);
      mode.set("build");
    } else {
      mode.set("transform");
    }
  } catch (err) {
    console.error(err);
  }
  if (!get(code)) {
    code.set(DefaultCode);
  }
  if (get(modules).length === 0) {
    modules.set([DefaultModule]);
  }
  version.set(query.version || "latest");
}

async function updateStoreFromGist(query: QueryObject) {
  const result: GistResult = await fetch(
    `https://api.github.com/gists/${query.gist}`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  ).then((r) => r.json());
  const entries = query.entry ? query.entry.split(",") : [];
  modules.set(
    [result.files["main.js"] || { filename: "main.js", content: "" }]
      .concat(
        Object.keys(result.files)
          .filter((filename) => filename !== "main.js")
          .map((filename) => result.files[filename])
      )
      .map((module) => ({
        name: module.filename,
        code: module.content,
        isEntry: entries.includes(module.filename),
      }))
  );
}

export function updateQuery(shareable: Shareable, version: string) {
  if (typeof history === "undefined") return;
  const qs = new URLSearchParams({
    version,
    shareable: window.btoa(encodeURIComponent(JSON.stringify(shareable))),
  });
  history.pushState({}, "", location.pathname + "?" + qs.toString());
}
