import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = join(root, 'public');
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = normalize(join(root, relative));
  const publicTarget = normalize(join(publicRoot, relative));

  if (pathname.startsWith('/api/')) {
    const payload = {
      '/api/session': { authenticated: false, provider: 'discord', message: 'Mock session. Wire Discord OAuth2 server-side.' },
      '/api/guilds': { guilds: [{ id: 'arcadia-hq', name: 'Arcadia HQ', permissions: ['MANAGE_GUILD'], bots: ['Music', 'Level', 'Ticket', 'Guard'] }] },
      '/api/bots': { bots: ['Music', 'Level', 'Ticket', 'Guard', 'Greet', 'Custom'] },
      '/api/invites': { base: 'https://discord.com/oauth2/authorize', scope: 'bot applications.commands', message: 'Mock invite builder.' }
    }[pathname];
    response.writeHead(payload ? 200 : 404, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(payload || { error: 'Not found' }));
    return;
  }

  if (!target.startsWith(root) || !publicTarget.startsWith(publicRoot)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    let content;
    let filePath = target;
    try {
      content = await readFile(target);
    } catch {
      filePath = publicTarget;
      content = await readFile(publicTarget);
    }
    response.writeHead(200, {
      'Content-Type': mime[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`AUREX preview listening on http://0.0.0.0:${port}`);
});
