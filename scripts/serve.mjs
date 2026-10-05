import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.txt': 'text/plain; charset=utf-8' };

export function resolvePublicPath(rawUrl) {
  let pathname;
  try { pathname = decodeURIComponent(rawUrl.split('?')[0]); } catch { return null; }
  if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0')) return null;
  if (pathname.split('/').some((part) => part.startsWith('.'))) return null;
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filename = path.resolve(output, relative.endsWith('/') ? `${relative}index.html` : relative);
  if (!filename.startsWith(output)) return null;
  return filename;
}

export function createServer() {
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'");
    response.setHeader('Cache-Control', 'no-cache');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const rawUrl = request.url || '/';
    if (/^\/(en|fr)(\?|$)/.test(rawUrl)) {
      const [pathname, query] = rawUrl.split('?');
      response.writeHead(308, { Location: `${pathname}/${query ? `?${query}` : ''}` }).end();
      return;
    }
    const filename = resolvePublicPath(rawUrl);
    if (!filename || !types[path.extname(filename)]) {
      response.writeHead(404).end();
      return;
    }
    try {
      const data = await readFile(filename);
      response.writeHead(200, { 'Content-Type': types[path.extname(filename)] });
      response.end(request.method === 'HEAD' ? undefined : data);
    } catch {
      const data = await readFile(path.join(output, '404.html')).catch(() => 'Page not found. Run npm run build first.');
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : data);
    }
  });
}

export function startServer() {
  const port = Number(process.env.PORT || 4173);
  const server = createServer();
  server.on('error', (error) => {
    console.error(`Could not start local preview: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => console.log(`Sorcova preview: http://127.0.0.1:${port}/en/`));
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer();
