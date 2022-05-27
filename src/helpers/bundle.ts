import type { BuildOptions, Plugin, TransformOptions } from "esbuild";
import { status, time, timeEnd } from "../stores";
import { normalizeName, stripExt } from "../stores/build";

export type Modules = { name: string; code: string }[];

const base_url = "https://unpkg.com";

type Res = { url: string; body: string };
const fetch_cache = new Map<string, Promise<Res>>();
async function fetch_if_uncached(url: string) {
  if (fetch_cache.has(url)) {
    return fetch_cache.get(url) as Promise<Res>;
  }
  await new Promise((r) => setTimeout(r, 1000));
  const promise = fetch(url)
    .then(async (r) => {
      if (r.ok) {
        return { url: r.url, body: await r.text() };
      } else {
        throw new Error(await r.text());
      }
    })
    .catch((err) => {
      fetch_cache.delete(url);
      throw err;
    });
  fetch_cache.set(url, promise);
  return promise;
}

async function follow_redirects(url: string) {
  const res = await fetch_if_uncached(url);
  return res.url;
}

function split(path: string) {
  const parts = path.split("/");
  if (path[0] === "@") {
    return [parts.slice(0, 2).join("/"), parts.slice(2).join("/")];
  } else {
    return [parts[0], parts.slice(1).join("/")];
  }
}

const unpkg_plugin: Plugin = {
  name: "unpkg",
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /^https?:/ }, (args) => {
      return { path: args.path, external: true };
    });

    onResolve({ filter: /^[@\w]/ }, async (args) => {
      status.set(`resolving ${args.path} ...`);
      const [pkg_bare, subpath] = split(args.path);
      const hint = `${base_url}/${pkg_bare}/package.json`;
      const pkg_url = await follow_redirects(hint);
      if (subpath) {
        if (subpath.endsWith(".js")) {
          const url = pkg_url.replace(/\/package\.json$/, "/" + subpath);
          return { path: url, namespace: "unpkg" };
        }
        try {
          const url = await follow_redirects(
            pkg_url.replace(/\/package\.json$/, "/" + subpath + ".js")
          );
          return { path: url, namespace: "unpkg" };
        } catch {}
        try {
          const url = await follow_redirects(
            pkg_url.replace(/\/package\.json$/, "/" + subpath + "/index.js")
          );
          return { path: url, namespace: "unpkg" };
        } catch {}
        throw new Error(`unable to resolve ${args.path}, resolving "exports" is not implemented`);
      } else {
        const pkg_json = (await fetch_if_uncached(pkg_url)).body;
        const pkg = JSON.parse(pkg_json);
        if (pkg.module || pkg.main) {
          const url = pkg_url.replace(/\/package\.json$/, "");
          const path = new URL(pkg.module || pkg.main, `${url}/`).href;
          return { path, namespace: "unpkg" };
        }
      }
    });

    onResolve({ filter: /^\./, namespace: "unpkg" }, async (args) => {
      const url = new URL(args.path, args.importer).href;
      status.set(`resolving ${url} ...`);
      const path = await follow_redirects(url);
      return { path, namespace: "unpkg" };
    });

    onLoad({ filter: /.*/, namespace: "unpkg" }, async (args) => {
      if (!fetch_cache.has(args.path)) {
        status.set(`resolving ${args.path} ...`);
      }
      const { body } = await fetch_if_uncached(args.path);
      return { contents: body, loader: "default" };
    });
  },
};

// based on https://gist.github.com/hyrious/5745fca7ca5b044da4b9935b318e1714
export async function bundle(
  modules: Modules,
  options: TransformOptions | BuildOptions
): Promise<Modules> {
  if (!window.esbuild) {
    alert("esbuild not ready, bundle stopped");
    return [];
  }

  const vfs_plugin: Plugin = {
    name: "vfs",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /.*/ }, (args) => {
        const absPath = normalizeName(args.path);

        let mod = modules.find((e) => normalizeName(e.name) === absPath);
        if (mod) return { path: normalizeName(mod.name), pluginData: mod };

        mod = modules.find((e) => stripExt(normalizeName(e.name)) === stripExt(absPath));
        if (mod) return { path: normalizeName(mod.name), pluginData: mod };
      });

      onLoad({ filter: /.*/ }, (args) => {
        const mod: Modules[number] | undefined = args.pluginData;
        const loader = stripExt(args.path) === args.path ? "js" : "default";
        if (mod) return { contents: mod.code, loader };
      });
    },
  };

  const { esbuild } = window;
  let unified_options = { ...options } as any;
  if (typeof unified_options.loader === "string") {
    delete unified_options.loader;
  }
  time();
  const { outputFiles } = await esbuild.build({
    ...unified_options,
    stdin: {
      contents: modules.map((m) => `import ${JSON.stringify(m.name)}`).join("\n"),
      resolveDir: "/",
    },
    plugins: [vfs_plugin, unpkg_plugin],
    bundle: true,
    sourcemap: "inline",
    outfile: "bundle.js",
    write: false,
    allowOverwrite: true,
  });
  timeEnd();

  return outputFiles.map((f) => ({ name: f.path, code: f.text }));
}
