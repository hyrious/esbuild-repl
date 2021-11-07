import type { BuildOptions } from "esbuild";
import { writable } from "svelte/store";

export interface Module {
  name: string;
  code: string;
  isEntry: boolean;
}

export const modules = writable<Module[]>([]);
export const options = writable<BuildOptions>({});
export const outputs = writable<Module[]>([]);
export const elapsed = writable(0);
