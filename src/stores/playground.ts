import { writable } from "svelte/store";

export interface ReplFile {
  name: string; // name should be unique, we are simulating a real file system
  contents: string;
}

export const html = writable(`<!-- see main.jsx -->`);
export const files = writable<ReplFile[]>(fixture("../fixture/*"));

// will be replaced by scripts/plugins/fixture.ts
declare function fixture(path: string): ReplFile[];
