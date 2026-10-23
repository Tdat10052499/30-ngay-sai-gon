#!/usr/bin/env node
/*
 * Server tĩnh nhỏ cho thư mục game (không cần python). Dùng:  node tools/serve.js [cổng]
 * tools/ui-test.js gọi start() để chạy trên một cổng trống.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.json': 'application/json', '.ico': 'image/x-icon' };

function start(port = 0) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.normalize(path.join(ROOT, url === '/' ? 'index.html' : url));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end('Không có tệp'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise(ok => server.listen(port, '127.0.0.1', () => ok({ server, port: server.address().port })));
}

if (require.main === module) {
  start(+process.argv[2] || 8080).then(({ port }) => console.log(`Mở http://127.0.0.1:${port}/`));
}
module.exports = { start };
