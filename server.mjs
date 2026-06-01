import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT || 8080);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

createServer(async (request, response) => {
  try {
    const filePath = await resolveFilePath(request.url || '/');
    if (!filePath) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      'cache-control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      'content-type': contentTypes[extension] || 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Server error');
  }
}).listen(port, () => {
  console.log(`TattooCoder static server listening on ${port}`);
});

async function resolveFilePath(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const candidate = path.join(root, safePath);

  if (!candidate.startsWith(root)) return null;

  if (existsSync(candidate)) {
    const candidateStat = await stat(candidate);
    if (candidateStat.isDirectory()) return findExisting(path.join(candidate, 'index.html'));
    if (candidateStat.isFile()) return candidate;
  }

  return findExisting(path.join(root, safePath, 'index.html'));
}

function findExisting(filePath) {
  return existsSync(filePath) ? filePath : null;
}
