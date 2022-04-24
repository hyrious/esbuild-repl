import type { BuildOptions } from "esbuild";
import { tick } from "svelte";
import { deps } from "../helpers";
import { esbuild, status } from "../stores";

// const esbuild = await wait_esbuild()
const wait_esbuild = () =>
  new Promise<typeof import("esbuild")>((resolve) => {
    let dispose = esbuild.subscribe(($esbuild) => {
      if ($esbuild) {
        resolve($esbuild);
        tick().then(dispose); // subscribe is sync, need to wait a tick to get "dispose"
      }
    });
  });

export async function build(options: BuildOptions) {
  const esbuild = await wait_esbuild();
  const plugins = options.plugins || [];
  plugins.push(deps({ log: status.set }));
  return esbuild.build({ logLevel: "verbose", ...options, plugins, write: false });
}
