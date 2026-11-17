# Screenshot to PDF

Turn up to 50 PNG, JPEG, or WebP screenshots into one PDF attachment. Arrange the images in page order, choose **Sharp text** or **Smaller file**, and click **Create PDF**. The converter displays the PDF size alongside the original total. The PDF contains images, with no searchable text layer. Re-encoding can make some already compressed images larger.

## Use it now

Open `screenshot-to-pdf.html` in a browser, choose your files, and download the result. Upload only the finished PDF to your chat. No server, API key, or upload is needed for conversion.

For an older chat, download the images you want to keep, bundle them, and use the PDF in a new chat if you want a cleaner thread. The converter cannot scan or rewrite chat history. One attachment takes up fewer slots on screen; this does not promise a lower model context cost or smaller stored bytes.

## Connect as a custom ChatGPT plugin

1. Extract the archive. With Node.js 22 or newer, run `npm ci` and `npm start` in the extracted folder. Open `http://127.0.0.1:8787/` to preview the converter.
2. Make `/mcp` reachable via a Secure MCP Tunnel or an HTTPS deployment. The server binds to localhost by default; set `BIND_HOST=0.0.0.0` only if the deployment requires it. The default port is 8787; set `PORT` to override it.
3. In ChatGPT on the web, go to **Plugins → + → Add custom MCP server**. Add the HTTPS URL ending in `/mcp` or select your secure tunnel. Follow your workspace's connection settings.
4. In a new chat, select the plugin with `@` and ask “Open Screenshot to PDF.” Select your local files in the widget. Download and attach the result. If the ChatGPT Library save helper is available, you can also save the generated PDF there and select it separately.

The server only delivers the converter UI and tool metadata. Image bytes and PDF generation stay in the browser. The optional **Save to ChatGPT Library** button sends the finished PDF to ChatGPT when clicked. The server requires no user account or credentials because it does not process or store files.

[Official OpenAI connection instructions](https://developers.openai.com/plugins/deploy/connect-chatgpt)

## Deploy on Vercel

Create a separate Vercel project from this GitHub repository. Use the repository root and let Vercel detect the Node.js server in `server.mjs`. No secret variables or custom build command are needed.

Once the deployment succeeds, open its production URL to check that the converter loads. Use that same URL with `/mcp` appended when adding the custom server in ChatGPT. Keep preview deployments protected and use a production URL reachable by ChatGPT.

## Verification

Tested local image selection, page reordering, both quality presets, download, and corrupt image handling in Chromium. Both sample PDFs rendered in Poppler. An SDK client verified MCP initialization, tool discovery, resource retrieval, and tool invocation. ChatGPT installation, iframe downloads, and the optional Library save require testing in the ChatGPT host.
