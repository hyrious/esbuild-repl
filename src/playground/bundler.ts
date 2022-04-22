import { tick } from "svelte";
import { esbuild } from "../stores";

const wait_esbuild = () =>
  new Promise<typeof import("esbuild")>((resolve) => {
    let dispose = esbuild.subscribe(($esbuild) => {
      if ($esbuild) {
        resolve($esbuild);
        tick().then(dispose); // subscribe is sync, need to wait a tick to get "dispose"
      }
    });
  });
