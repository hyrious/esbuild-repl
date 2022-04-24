import type { Plugin } from "esbuild";
import { tick } from "svelte";

// "pkg" => "pkg", ""
// "@org" => "@org", ""
// "pkg/abc" => "pkg", "abc"
// "@org/abc" => "@org/abc", ""
// "@org/pkg/abc" => "@org/pkg", "abc"
function split(path: string): [pkgName: string, subPath: string] {
  if (path.startsWith("@")) {
    const [org, pkg, sub] = path.split("/", 3);
    return pkg ? [`${org}/${pkg}`, sub || ""] : [org, ""];
  } else {
    const [pkg, sub] = path.split("/", 2);
    return [pkg, sub || ""];
  }
}

const fetch_cache = new Map<string, Promise<{ url: string; body: string }>>();
async function cached_fetch(url: string) {
  if (fetch_cache.has(url)) {
    return fetch_cache.get(url)!;
  }
  await tick();
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
  return promise;
}

async function follow_redirects(url: string) {
  const res = await cached_fetch(url);
  return res.url;
}

function is_external(path: string, external: string[]) {
  // Should we handle '*' in external config?
  return external.some((ext) => path === ext || path.startsWith(ext + "/"));
}

export interface DepsOptions {
  log?: (msg: string) => void;
  baseUrl?: string;
}

// Caveats:
// 1. Not support resolving extensions, i.e. must use `import "./file.js"`.
// 2. No complex resolving logic (browser, exports), just uses pkg.module || pkg.main.
export function deps({ log = console.log, baseUrl = "https://unpkg.com" }: DepsOptions): Plugin {
  return {
    name: "deps",
    setup({ onResolve, onLoad, initialOptions }) {
      const external = initialOptions.external || [];

      onResolve({ filter: /^https?:/ }, (args) => {
        return { path: args.path, external: true };
      });

      onResolve({ filter: /^[\@w]/ }, async (args) => {
        if (is_external(args.path, external)) {
          return null;
        }
        log(`resolving ${args.path}`);
        const [pkgName, subPath] = split(args.path);
        try {
          if (!subPath) {
            const pkg_url = await follow_redirects(`${baseUrl}/${pkgName}/package.json`);
            const pkg_json = (await cached_fetch(pkg_url)).body;
            const pkg = JSON.parse(pkg_json);
            if (pkg.module || pkg.main) {
              const url = pkg_url.replace(/\/package\.json$/, "");
              const path = new URL(pkg.module || pkg.main, `${url}/`).href;
              return { path, namespace: "deps" };
            }
          } else {
            // TODO: apply conditional exports rules on subPath
            const path = await follow_redirects(`${baseUrl}/${args.path}`);
            return { path, namespace: "deps" };
          }
        } catch (err) {
          return { errors: [{ text: err.message }] };
        }
      });

      onResolve({ filter: /^\./, namespace: "deps" }, async (args) => {
        // Should we test external here?
        const url = new URL(args.path, args.importer).href;
        log(`resolving ${url}`);
        try {
          const path = await follow_redirects(url);
          return { path, namespace: "deps" };
        } catch (err) {
          return { errors: [{ text: err.message }] };
        }
      });

      onLoad({ filter: /.*/, namespace: "deps" }, async (args) => {
        if (!fetch_cache.has(args.path)) {
          log(`resolving ${args.path}`);
        }
        try {
          const { body } = await cached_fetch(args.path);
          return { contents: body, loader: "default" };
        } catch (err) {
          return { errors: [{ text: err.message }] };
        }
      });
    },
  };
}
