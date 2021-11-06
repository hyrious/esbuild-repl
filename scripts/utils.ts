import type { Metafile } from "esbuild";
import type { Warning } from "svelte/types/compiler/interfaces";

export function convertMessage(
  source: string,
  filename: string,
  { message, start, end }: Warning
) {
  let location;
  if (start && end) {
    let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1];
    let lineEnd = start.line === end.line ? end.column : lineText.length;
    location = {
      file: filename,
      line: start.line,
      column: start.column,
      length: lineEnd - start.column,
      lineText,
    };
  }
  return { text: message, location };
}

export function mergeMetafile(m1?: Metafile, m2?: Metafile): Metafile {
  return {
    inputs: { ...m1?.inputs, ...m2?.inputs },
    outputs: { ...m1?.outputs, ...m2?.outputs },
  };
}
