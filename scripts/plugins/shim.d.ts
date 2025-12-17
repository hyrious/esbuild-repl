declare module 'launch-editor-middleware' {
  export default function fn(editor: string): import('node:http').RequestListener
}
