import { readFile } from 'node:fs/promises';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const widget = await readFile(new URL('./screenshot-to-pdf.html', import.meta.url), 'utf8');
const uri = 'ui://widget/screenshot-to-pdf.html';
const mimeType = 'text/html;profile=mcp-app';

function buildServer() {
  const mcp = new McpServer({ name: 'screenshot-to-pdf', version: '0.1.0' });
  mcp.registerResource('screenshot-to-pdf-widget', uri, { mimeType }, async () => ({
    contents: [{ uri, mimeType, text: widget, _meta: { ui: { prefersBorder: true } } }],
  }));
  mcp.registerTool('open_screenshot_to_pdf', {
    title: 'Open Screenshot to PDF',
    description: 'Open a converter so the user can select local PNG, JPEG or WebP images and create a single PDF. This tool does not access or replace earlier chat attachments.',
    annotations: { readOnlyHint: true, openWorldHint: false },
    _meta: { ui: { resourceUri: uri }, 'openai/outputTemplate': uri },
  }, async () => ({
    content: [{ type: 'text', text: 'Choose the images in the converter, arrange the pages, and create a PDF. Then attach the finished PDF to the chat.' }],
  }));
  return mcp;
}

export default async function handleRequest(req, res) {
  const path = req.url?.split('?')[0];
  if (req.method === 'GET' && path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(widget);
    return;
  }
  if (path !== '/mcp') { res.writeHead(404).end(); return; }
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' })
      .end(JSON.stringify({jsonrpc:'2.0', error:{code:-32000,message:'Method not allowed'}, id:null}));
    return;
  }
  if (req.headers.origin && req.headers.origin !== process.env.ALLOWED_ORIGIN) {
    res.writeHead(403).end(); return;
  }
  const mcp = buildServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  res.once('close', () => { void mcp.close(); });
  try {
    await mcp.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500).end();
    else if (!res.writableEnded) res.end();
  }
}
