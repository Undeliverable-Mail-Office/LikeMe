// @ts-check
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname } from 'node:path';
const types = { '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png' };
createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const path = pathname === '/' ? '/index.html' : pathname;
  try {
    const body = readFileSync(new URL(`../../.pages-dist${path}`, import.meta.url));
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404); response.end();
  }
}).listen(8188, '127.0.0.1');
