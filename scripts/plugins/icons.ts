// credits:
// https://github.com/antfu/unplugin-icons
// https://github.com/antfu/unocss

import fg from "fast-glob";
import { existsSync, promises } from "fs";
import { Plugin } from "esbuild";
import { createRequire } from "module";
import { compile } from "svelte/compiler";
import { IconifyJSON } from "@iconify/types";
import { iconToSVG } from "@iconify/utils/lib/svg/build";
import { getIconData } from "@iconify/utils/lib/icon-set/get-icon";
import { defaults as DefaultIconCustomizations } from "@iconify/utils/lib/customisations";
import { warnOnce } from "./utils";
import { join } from "path";

const read = promises.readFile;

const SvelteCompiler = (svg: string) => {
  const openTagEnd = svg.indexOf(">", svg.indexOf("<svg "));
  const closeTagStart = svg.lastIndexOf("</svg");
  const openTag = `${svg.slice(0, openTagEnd)} {...$$props}>`;
  const content = escapeSvelte(svg.slice(openTagEnd + 1, closeTagStart));
  const closeTag = svg.slice(closeTagStart);
  return `${openTag}${content}${closeTag}`;
};

function escapeSvelte(str: string): string {
  return str
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/`/g, "&#96;")
    .replace(/\\([trn])/g, " ");
}

const require = createRequire(import.meta.url);

const collections: Record<string, Promise<IconifyJSON | undefined>> = {};
async function loadCollection(name: string) {
  return (collections[name] ||= task());
  async function task() {
    let jsonPath = require.resolve(`@iconify-json/${name}/icons.json`);
    if (jsonPath) return JSON.parse(await read(jsonPath, "utf8"));
  }
}

function mergeIconProps(svg: string, props: Record<string, string>) {
  return svg.replace(
    "<svg",
    `<svg ${Object.keys(props)
      .map((p) => `${p}="${props[p]}"`)
      .join(" ")}`
  );
}

function searchForIcon(iconSet: IconifyJSON, ids: string[]) {
  for (const id of ids) {
    const iconData = getIconData(iconSet, id, true);
    if (iconData) {
      const { attributes, body } = iconToSVG(iconData, {
        ...DefaultIconCustomizations,
        width: "1em",
        height: "1em",
      });
      return mergeIconProps(`<svg>${body}</svg>`, attributes);
    }
  }
}

const validateFilterRE = /(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-?]/;

function isValidSelector(selector = ""): selector is string {
  return validateFilterRE.test(selector);
}

function splitCode(code: string) {
  return code.split(/[\s'"`;>=]+/g).filter(isValidSelector);
}

function isEqualSet<T>(a: Set<T>, b: Set<T>) {
  if (a === b) return true;
  if (a.size !== b.size) return false;
  for (const e of a) if (!b.has(e)) return false;
  return true;
}

async function searchForIconSvg(collection: string, icon: string) {
  const ids = [
    icon,
    icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    icon.replace(/([a-z])(\d+)/g, "$1-$2"),
  ];
  const iconSet = await loadCollection(collection);
  return iconSet && searchForIcon(iconSet, ids);
}

function encodeSvg(svg: string) {
  return svg
    .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E");
}

const classRE = /^i-(\w+)-([-\w]+)$/;
async function generate(cls: string, warn: boolean) {
  const match = cls.match(classRE);
  if (match) {
    const [, collection, icon] = match;
    const svg = await searchForIconSvg(collection, icon);
    if (!svg) {
      warn && warnOnce(`failed to load icon "${cls}"`);
      return;
    }
    const mode = svg.includes("currentColor") ? "mask" : "background-img";
    const url = `url("data:image/svg+xml;utf8,${encodeSvg(svg)}")`;
    let css: [string, string][] = [
      ["width", "1em"],
      ["height", "1em"],
      ["display", "inline-block"],
      ["vertical-align", "middle"],
    ];
    if (mode === "mask") {
      css = css.concat([
        ["--icon", url],
        ["mask", "var(--icon) no-repeat"],
        ["mask-size", "100% 100%"],
        ["-webkit-mask", "var(--icon) no-repeat"],
        ["-webkit-mask-size", "100% 100%"],
        ["background-color", "currentColor"],
        ["color", "var(--fg)"],
      ]);
    } else {
      css = css.concat([
        ["background", url],
        ["background-size", "100% 100%"],
        ["background-color", "transparent"],
      ]);
    }
    return (
      `.${cls.replace(":", "\\:")} {\n` + `${css.map(([k, v]) => `  ${k}: ${v};\n`).join("")}}`
    );
  }
}

interface Options {
  glob: string;
  ssr?: boolean;
}

/**
 * ```svelte
 * import Plus from "~icons/mdi/plus.svelte"
 * <div class="i-mdi-plus"><Plus /></div>
 * ```
 */
export function icons({ glob, ssr = false }: Options): Plugin {
  let collected = new Set<string>();
  async function scanClass(path: string) {
    if (existsSync(path)) {
      const text = await read(path, "utf8");
      splitCode(text)
        .map((e) => (e.startsWith("class:") ? e.slice(6) : e))
        .filter((e) => e.startsWith("i-"))
        .forEach((e) => collected.add(e));
    }
  }
  let prepare = fg([glob]).then((files) => Promise.all(files.map((path) => scanClass(path))));

  return {
    name: "icons",
    setup({ onResolve, onLoad, initialOptions }) {
      // ~icons/mdi/plus.svelte -> mdi/plus.svelte
      onResolve({ filter: /^~icons\/.+\.svelte$/ }, (args) => {
        return {
          path: args.path.slice(7),
          namespace: "icons",
          pluginData: { resolveDir: args.resolveDir },
        };
      });

      onLoad({ filter: /.+\.svelte$/, namespace: "icons" }, async (args) => {
        const [collection, icon] = args.path.slice(0, -7).split("/");
        const svg = await searchForIconSvg(collection, icon);
        if (svg) {
          const svelte = SvelteCompiler(svg);
          const filename = "/icons/" + args.path;
          const { js } = compile(svelte, {
            filename,
            generate: ssr ? "ssr" : "dom",
          });
          js.map.sources = [filename];
          js.map.sourcesContent = [svelte];
          const contents = js.code + `\n//# sourceMappingURL=` + js.map.toUrl();
          return { contents, resolveDir: args.pluginData.resolveDir };
        }
      });

      onLoad({ filter: /\.svelte$/ }, (args) => {
        scanClass(args.path);
        return null;
      });

      onResolve({ filter: /^icons\.css$/ }, (args) => {
        return { path: join(args.resolveDir, args.path) };
      });

      const warn = initialOptions.logLevel !== "silent";

      onLoad({ filter: /icons\.css$/ }, async () => {
        await prepare;
        const tasks = [...collected].map((e) => generate(e, warn));
        const contents = (await Promise.all(tasks)).filter(Boolean).join("\n");
        return { contents, loader: "css" };
      });
    },
  };
}
