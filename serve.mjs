// Zero-dependency local dev / preview server
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, watch } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);
const DIST_DIR = join(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
};

function runBuild() {
  return new Promise((resolve, reject) => {
    console.log('Building site...');
    const buildProc = spawn(process.execPath, ['build.mjs'], { stdio: 'inherit' });
    buildProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Build exited with code ${code}`));
    });
  });
}

function serveStatic(req, res) {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  let filePath = normalize(join(DIST_DIR, reqPath));

  // Security check: ensure path remains within dist directory
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  // Check if directory requested without trailing slash
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    const indexPath = join(filePath, 'index.html');
    if (existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      res.statusCode = 301;
      res.setHeader('Location', reqPath + '/');
      res.end();
      return;
    }
  }

  // If file doesn't exist, try appending .html or index.html
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    if (existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (existsSync(join(filePath, 'index.html'))) {
      filePath = join(filePath, 'index.html');
    }
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    try {
      const data = readFileSync(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-cache');
      res.end(data);
      return;
    } catch (err) {
      res.statusCode = 500;
      res.end('Internal Server Error: ' + err.message);
      return;
    }
  }

  // 404 fallback
  const notFoundPath = join(DIST_DIR, '404.html');
  if (existsSync(notFoundPath)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end(readFileSync(notFoundPath));
  } else {
    res.statusCode = 404;
    res.end('Page Not Found');
  }
}

async function start() {
  if (!existsSync(DIST_DIR)) {
    await runBuild();
  }

  const server = createServer(serveStatic);

  const startListening = (port) => {
    server.listen(port, () => {
      console.log(`\n========================================`);
      console.log(` Vectron site running at:`);
      console.log(`   http://localhost:${port}/`);
      console.log(`   http://127.0.0.1:${port}/`);
      console.log(`========================================\n`);
    });
  };

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${DEFAULT_PORT} is in use, trying ${DEFAULT_PORT + 1}...`);
      startListening(DEFAULT_PORT + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  startListening(DEFAULT_PORT);

  const watchMode = process.argv.includes('--watch') || process.argv.includes('-w');
  if (watchMode) {
    console.log('Watch mode enabled: watching src/ and assets/ for changes...');
    let debounceTimer = null;
    const triggerRebuild = (eventType, filename) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        console.log(`\nDetected change (${filename || eventType}). Rebuilding...`);
        try {
          await runBuild();
          console.log('Rebuild complete!');
        } catch (e) {
          console.error('Rebuild failed:', e.message);
        }
      }, 200);
    };

    if (existsSync('src')) watch('src', { recursive: true }, triggerRebuild);
    if (existsSync('assets')) watch('assets', { recursive: true }, triggerRebuild);
  }
}

start();
