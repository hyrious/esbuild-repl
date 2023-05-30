// This file creates a server that handles /__open-in-editor?file=file:line:column requests.
import url from 'node:url'
import http, { IncomingMessage, RequestListener, ServerResponse } from 'node:http'
import launch_editor from 'launch-editor-middleware'

const middleware: RequestListener = launch_editor('code')

function open_in_editor_handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'GET' && url.parse(req.url as string).pathname === '/__open-in-editor') {
    middleware(req, res)
  } else {
    res.statusCode = 404
    res.end()
  }
}

export function open_in_editor() {
  return http.createServer(open_in_editor_handler)
}

export default open_in_editor
