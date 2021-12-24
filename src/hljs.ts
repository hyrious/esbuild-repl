declare var hljs: typeof import("highlight.js").default;

importScripts("https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.4.0/build/highlight.min.js");

addEventListener(
  "message",
  ({ data }: MessageEvent<{ id: number; code: string; lang?: string }>) => {
    const { id, code, lang } = data;
    const { value } = hljs.highlight(code, { language: lang || "js" });
    postMessage({ id, value });
  }
);
