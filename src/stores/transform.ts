import type { TransformOptions } from "esbuild";
import { writable } from "svelte/store";

export const code = writable("");
export const config = writable<TransformOptions>({});
export const elapsed = writable(0);
