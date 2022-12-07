import https from "https";

const prefix = "https://raw.githubusercontent.com/evanw/esbuild/main/internal/compat";

// https.get(`${prefix}/js_table.go`, async (res) => {
https.get(`${prefix}/css_table.go`, async (res) => {
  const chunks = [];
  for await (const chunk of res) {
    chunks.push(chunk);
  }
  const code = Buffer.concat(chunks).toString();
  const feats: string[] = [];
  code.replace(/^\t"([-a-z]+)":/gm, (_, id) => {
    feats.push(id);
    return "";
  });
  console.log(JSON.stringify(feats));
});
