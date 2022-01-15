import type { BuildOptions, TransformOptions } from "esbuild";

function isBuildOptions(options: BuildOptions | TransformOptions): options is BuildOptions {
  return "entryPoints" in options || "plugins" in options;
}

function dashize(s: string) {
  return s.replace(/([A-Z])/g, (x) => "-" + x.toLowerCase());
}

function buildOptionsToArgs(options: BuildOptions | TransformOptions) {
  const args: string[] = [];
  if (isBuildOptions(options)) {
    if (Array.isArray(options.entryPoints)) {
      args.push(...options.entryPoints);
    } else if (options.entryPoints) {
      args.push(...Object.entries(options.entryPoints).map(([k, v]) => `${k}=${v}`));
    }
    delete options.entryPoints;
    delete options.plugins;
  }
  for (const [k, v] of Object.entries(options)) {
    const key = dashize(k);
    if (Array.isArray(v)) {
      if (["resolveExtensions", "mainFields", "conditions", "target"].includes(k)) {
        args.push(`--${key}=${v.join(",")}`);
      } else {
        args.push(...v.map((value) => `--${key}:${value}`));
      }
    } else if (key === "tsconfig-raw" && typeof v === "object") {
      args.push(`--${key}=${JSON.stringify(v)}`);
    } else if (typeof v === "object" && v !== null) {
      // --define:process.env={} --footer:js="// hello"
      args.push(...Object.entries(v).map(([sub, val]) => `--${key}:${sub}=${val}`));
    } else if (v === true) {
      args.push(`--${key}`);
    } else {
      args.push(`--${key}=${v}`);
    }
  }
  return args;
}

function quote(s: string) {
  if (/[ '"]/.test(s)) {
    // stolen from node:util
    return (
      "'" + JSON.stringify(s).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'"
    );
  } else {
    return s;
  }
}

function addQuote(s: string) {
  let i = s.indexOf("=");
  if (i !== -1) {
    return s.slice(0, i + 1) + quote(s.slice(i + 1));
  } else {
    return s;
  }
}

export function configToString(options: TransformOptions) {
  return buildOptionsToArgs(options).map(addQuote).join(" ");
}
