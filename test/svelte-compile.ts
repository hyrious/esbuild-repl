import { compile } from "svelte/compiler";

const source = `
<div>Hello world!</div>
<style>div { color: red }</style>
`;

const { js, css } = compile(source, {
  filename: "src/Input.svelte",
  outputFilename: "_actual.js",
  cssOutputFilename: "_actual.css",
  generate: "dom",
  css: false,
});

console.log(js.map.sources, css.map.sources);
