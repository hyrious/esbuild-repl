import { Metafile } from "esbuild";

let warned = new Set<string>();

export function clearWarns() {
  warned.clear();
}

export function warnOnce(str: string) {
  if (!warned.has(str)) {
    warned.add(str);
    console.warn(str);
  }
}

export function trimNodeModules(metafile: Metafile) {
  const outfiles = Object.keys(metafile.outputs);
  for (const file of outfiles) {
    const info = metafile.outputs[file].inputs;
    for (const path of Object.keys(info)) {
      const index = path.lastIndexOf("node_modules/");
      if (index !== -1) {
        const short = path.slice(index);
        info[short] = info[path];
        delete info[path];
      }
    }
  }
  return metafile;
}
