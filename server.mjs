import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * Static host for the built The Squad bundle.
 * No dependencies on purpose: the container only needs Node itself.
 */

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.rules': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(self)',
};

/** Resolve a URL path inside ROOT, refusing traversal outside the bundle. */
function resolveSafe(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null; // malformed percent-encoding
  }
  if (decoded.includes('\0')) return null;
  const normalized = path.posix.normalize(decoded);
  const target = path.join(ROOT, normalized);
  const relative = path.relative(ROOT, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return target;
}

async function tryFile(target) {
  try {
    const info = await stat(target);
    if (info.isFile()) return { file: target, size: info.size, mtime: info.mtime };
    if (info.isDirectory()) {
      const index = path.join(target, 'index.html');
      const idxInfo = await stat(index).catch(() => null);
      if (idxInfo?.isFile()) return { file: index, size: idxInfo.size, mtime: idxInfo.mtime };
    }
  } catch {
    /* fall through */
  }
  return null;
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', ...SECURITY_HEADERS });
    res.end('Method Not Allowed');
    return;
  }

  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const resolved = resolveSafe(urlPath);

  if (!resolved) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
    res.end('Bad Request');
    return;
  }

  // Serve the file, else fall back to index.html for app routes,
  // but never for asset-looking requests (so real 404s stay visible).
  let found = await tryFile(resolved);
  const looksLikeAsset = path.extname(resolved) !== '';
  if (!found && !looksLikeAsset) found = await tryFile(path.join(ROOT, 'index.html'));

  if (!found) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(found.file).toLowerCase();
  const isHtml = ext === '.html';
  const isHashed = /-[A-Za-z0-9_]{8,}\./.test(path.basename(found.file));

  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': found.size,
    'Cache-Control': isHashed
      ? 'public, max-age=31536000, immutable'
      : isHtml
        ? 'no-cache'
        : 'public, max-age=3600',
    ...SECURITY_HEADERS,
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = createReadStream(found.file);
  stream.on('error', () => {
    if (!res.headersSent) res.writeHead(500, SECURITY_HEADERS);
    res.end();
  });
  stream.pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`The Squad is serving dist/ on http://${HOST}:${PORT}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
