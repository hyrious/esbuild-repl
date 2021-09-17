// command line args to options XD
// --a="b c"  =>  { a: "b c" }

import type { TransformOptions } from "esbuild";
import { shellsplit } from "@hyrious/shellwords";
import {
  argsToBuildOptions,
  buildOptionsToArgs,
} from "@hyrious/esbuild-dev/args";

function quote(s: string) {
  if (/[ '"]/.test(s)) {
    // stolen from node:util
    return (
      "'" +
      JSON.stringify(s)
        .replace(/^"|"$/g, "")
        .replaceAll("'", "\\'")
        .replaceAll('\\"', '"') +
      "'"
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

/**
 * Call it at the very beginning to restore transform options from query.
 */
export function configToArgs(options: TransformOptions) {
  return buildOptionsToArgs(options).map(addQuote);
}

/**
 * Call it on every $config update.
 */
export function argsToConfig(args: string): TransformOptions {
  try {
    return argsToBuildOptions(shellsplit(args)) as TransformOptions;
  } catch {
    return {};
  }
}
