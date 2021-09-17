declare var hljs: typeof import("highlight.js").default;

importScripts(
  "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/highlight.min.js"
);

addEventListener(
  "message",
  ({ data }: MessageEvent<{ code: string; loader?: "css" }>) => {
    const { code, loader } = data;
    const { value } = hljs.highlight(code, { language: loader || "js" });
    postMessage(value);
  }
);
