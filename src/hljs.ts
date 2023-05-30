declare const hljs: typeof import('highlight.js').default

importScripts('https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.8.0/highlight.min.js')

interface Payload {
  id: number
  code: string
  lang?: string
}

addEventListener('message', ({ data }: MessageEvent<Payload>) => {
  const { id, code, lang } = data
  const { value } = hljs.highlight(code, { language: lang || 'js' })
  postMessage({ id, value })
})
