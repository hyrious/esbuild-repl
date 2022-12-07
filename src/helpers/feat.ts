import type { Loader, TransformOptions } from "esbuild";
import { tick } from "svelte/internal";

// https://github.com/evanw/esbuild/blob/main/internal/compat/js_table.go
const js_features = [
  "arbitrary-module-namespace-names",
  "array-spread",
  "arrow",
  "async-await",
  "async-generator",
  "bigint",
  "class",
  "class-field",
  "class-private-accessor",
  "class-private-brand-check",
  "class-private-field",
  "class-private-method",
  "class-private-static-accessor",
  "class-private-static-field",
  "class-private-static-method",
  "class-static-blocks",
  "class-static-field",
  "const-and-let",
  "default-argument",
  "destructuring",
  "dynamic-import",
  "exponent-operator",
  "export-star-as",
  "for-await",
  "for-of",
  "generator",
  "hashbang",
  "import-assertions",
  "import-meta",
  "inline-script",
  "logical-assignment",
  "nested-rest-binding",
  "new-target",
  "node-colon-prefix-import",
  "node-colon-prefix-require",
  "nullish-coalescing",
  "object-accessors",
  "object-extensions",
  "object-rest-spread",
  "optional-catch-binding",
  "optional-chain",
  "regexp-dot-all-flag",
  "regexp-lookbehind-assertions",
  "regexp-match-indices",
  "regexp-named-capture-groups",
  "regexp-sticky-and-unicode-flags",
  "regexp-unicode-property-escapes",
  "rest-argument",
  "template-literal",
  "top-level-await",
  "typeof-exotic-object-is-object",
  "unicode-escapes",
];

const css_features = [
  "hex-rgba",
  "inline-style",
  "rebecca-purple",
  "modern-rgb-hsl",
  "inset-property",
  "nesting",
];

const js_loaders: Loader[] = ["js", "jsx", "ts", "tsx"];

const css_loaders: Loader[] = ["css"];

export function detectable({ loader }: TransformOptions) {
  return !loader || js_loaders.includes(loader) || css_loaders.includes(loader);
}

type esbuild = typeof import("esbuild");

class Task {
  cancelled = false;
  resolve?: (features: string[]) => void;
  reject?: (error: Error) => void;
  constructor(esbuild: esbuild, code: string, options: TransformOptions, features: string[]) {
    this._run(esbuild, code, options, features);
  }
  async _run(esbuild: esbuild, code: string, options: TransformOptions, features: string[]) {
    await tick();
    const detected: string[] = [];

    let baseline: string;
    try {
      await esbuild.transform(code, options).then((r) => {
        baseline = r.code;
      });
    } catch (error) {
      !this.cancelled && this.reject && this.reject(error);
      return;
    }
    if (this.cancelled) return;

    for (const feat of features) {
      options.supported = { [feat]: false };
      try {
        await esbuild.transform(code, options).then((r) => {
          if (r.code !== baseline) {
            detected.push(feat);
          }
        });
      } catch {
        detected.push(feat);
      }
      if (this.cancelled) return;
    }

    this.resolve && this.resolve(detected);
  }
  cancel() {
    this.cancelled = true;
  }
  then(fn: (features: string[]) => void) {
    this.resolve = fn;
  }
  catch(fn: (error: Error) => void) {
    this.reject = fn;
  }
}

let last: Task | null = null;

export function detect(esbuild: esbuild, code: string, options: TransformOptions) {
  const source_type = !options.loader ? "js" : options.loader === "css" ? "css" : "js";
  const features = source_type === "js" ? js_features : css_features;
  const opts: TransformOptions = { ...options, supported: {}, target: "esnext" };
  last && last.cancel();
  last = new Task(esbuild, code, opts, features);
  return last;
}
