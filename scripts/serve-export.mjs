import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8']
]);

function getArgument(name, fallback) {
  const index = process.argv.indexOf(name);

  if (index === -1 || index === process.argv.length - 1) {
    return fallback;
  }

  return process.argv[index + 1];
}

const rootDirectory = path.resolve(process.cwd(), getArgument('--root', 'out'));
const port = Number(getArgument('--port', '4173'));

async function isReadableFile(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

async function resolveRequestPath(requestPathname) {
  const normalizedPath = decodeURIComponent(requestPathname.split('?')[0]);
  const safePath = normalizedPath.replace(/^\/+/, '');
  const absolutePath = path.resolve(rootDirectory, `.${path.sep}${safePath}`);

  if (!absolutePath.startsWith(rootDirectory)) {
    return {
      filePath: path.join(rootDirectory, '404.html'),
      statusCode: 403
    };
  }

  const candidates = [];
  const extension = path.extname(absolutePath);

  if (normalizedPath === '/' || normalizedPath === '') {
    candidates.push(path.join(rootDirectory, 'index.html'));
  } else {
    candidates.push(absolutePath);

    if (!extension) {
      candidates.push(`${absolutePath}.html`);
      candidates.push(path.join(absolutePath, 'index.html'));
    }
  }

  for (const candidate of candidates) {
    if (await isReadableFile(candidate)) {
      return {
        filePath: candidate,
        statusCode: 200
      };
    }
  }

  return {
    filePath: path.join(rootDirectory, '404.html'),
    statusCode: 404
  };
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  try {
    const { filePath, statusCode } = await resolveRequestPath(request.url);
    const content = await readFile(filePath);
    const contentType = MIME_TYPES.get(path.extname(filePath)) ?? 'application/octet-stream';

    response.writeHead(statusCode, {
      'Cache-Control': 'no-store',
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': contentType
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    response.end(content);
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    response.end(error instanceof Error ? error.message : 'Unexpected server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving static export from ${rootDirectory} at http://127.0.0.1:${port}`);
});
