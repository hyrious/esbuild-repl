async function main(prefix: string, url: string) {
  const code = await fetch(url).then((r) => r.text())
  console.log(prefix + '[')
  code.replace(/^\t"([-a-z]+)":/gm, (_, id) => {
    console.log(`  "${id}",`)
    return ''
  })
  console.log(']')
}

const js_table = 'https://cdn.jsdelivr.net/gh/evanw/esbuild/internal/compat/js_table.go'
const css_table = 'https://cdn.jsdelivr.net/gh/evanw/esbuild/internal/compat/css_table.go'
await main('const JS_FEATURES = ', js_table)
await main('const CSS_FEATURES = ', css_table)
