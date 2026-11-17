import { createServer } from 'node:http';
import handleRequest from './server.mjs';

const port = Number(process.env.PORT ?? 8787);
const host = process.env.BIND_HOST ?? '127.0.0.1';

createServer(handleRequest).listen(port, host, () => {
  console.log('Screenshot to PDF listening on port ' + port);
});
