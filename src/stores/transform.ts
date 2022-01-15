//
// options --(parse)-> optionsObj -> loader
//                         |
// input ------------------+-(esbuild)-> result --(render)-> errorsHTML
//

import type { Loader, Message, TransformOptions } from "esbuild";
import { EsbuildFlags, parse } from "@hyrious/esbuild-dev/args";
import { shellsplit } from "@hyrious/shellwords";
import { derived, Readable, writable } from "svelte/store";
import { isBrowser, render } from "../helpers";
import { esbuild, time, timeEnd } from "./index";

export const input = writable("let a = 1");
export const options = writable("");

export const optionsObj: Readable<TransformOptions> = derived(options, ($options, set) => {
  const { _, ...options } = parse(shellsplit($options), EsbuildFlags) as any;
  set(options);
});

export const loader: Readable<Loader | undefined> = derived(optionsObj, ($options, set) => {
  set($options.loader);
});

export const result: Readable<{
  code?: string;
  map?: string;
  errors?: Message[];
  warnings?: Message[];
}> = derived(
  [esbuild, input, optionsObj],
  ([$esbuild, $input, $options], set) => {
    if (!$esbuild) return;
    time();
    console.log([$input, $options], Math.random());
    $esbuild.transform($input, $options).then(set).catch(set).finally(timeEnd);
  },
  {}
);

export const errorsHTML = derived([esbuild, result], ([$esbuild, $result], set) => {
  if (!$esbuild) return;
  const { errors, warnings } = $result;
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
    stores_transform: { input, options, optionsObj, loader, result, errorsHTML },
  });
