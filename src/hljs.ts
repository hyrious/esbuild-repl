declare var hljs: typeof import("highlight.js").default;

importScripts("https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.5.1/highlight.min.js");

addEventListener(
  "message",
  ({ data }: MessageEvent<{ id: number; code: string; lang?: string }>) => {
    const { id, code, lang } = data;
    const { value } = hljs.highlight(code, { language: lang || "js" });
    postMessage({ id, value });
  }
);
