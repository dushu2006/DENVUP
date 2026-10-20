#!/usr/bin/env node
/**
 * HTTP check.
 *
 * Serves the production build with `vite preview` and fetches the routes and
 * assets the page actually references, so the delivery path — not just the
 * files on disk — is verified.
 *
 * Usage:  node scripts/serve-check.mjs
 * Requires a build first: npx vite build
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');
const PORT = 4183;

let failures = 0;
let checks = 0;

function check(label, condition, detail = '') {
  checks += 1;
  if (condition) console.log(`  ok   ${label}`);
  else {
    failures += 1;
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html is missing — run `npx vite build` first.');
  process.exit(1);
}

const server = spawn(
  join(root, 'node_modules/.bin/vite'),
  ['preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
);

let serverLog = '';
server.stdout.on('data', (chunk) => {
  serverLog += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  serverLog += chunk.toString();
});

const stop = () => {
  if (!server.killed) server.kill('SIGTERM');
};
process.on('exit', stop);
process.on('SIGINT', () => {
  stop();
  process.exit(130);
});

/** Wait until the preview server answers. */
async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/`);
      if (response.ok) {
        await response.arrayBuffer();
        return true;
      }
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

const started = await waitForServer();
check('the preview server starts and answers', started, serverLog.slice(-400));

if (started) {
  const html = await (await fetch(`http://127.0.0.1:${PORT}/`)).text();

  check('the served document is the built document', html.includes('<div class="boot'));
  check('the served document contains all sixteen chapters',
    (html.match(/<section /g) ?? []).length >= 16,
    String((html.match(/<section /g) ?? []).length));

  /*
   * Every route must be served as its own document, with its own content.
   * A single-page build would answer all of these with the same bytes.
   */
  const ROUTES = [
    '/', '/services/', '/services/web-design/', '/services/ai-solutions/',
    '/services/business-integrations/', '/services/creative-experiences/',
    '/services/automation/', '/lab/', '/concepts/', '/studio/', '/pricing/',
    '/contact/', '/privacy/', '/terms/', '/404.html',
  ];
  const routeBodies = new Map();
  for (const route of ROUTES) {
    const response = await fetch(`http://127.0.0.1:${PORT}${route}`);
    if (!response.ok) {
      check(`${route} is served`, false, String(response.status));
      continue;
    }
    const body = await response.text();
    routeBodies.set(route, body);
    check(`${route} is served`, true);
  }
  const distinct = new Set(routeBodies.values());
  check(
    `every route serves its own document (${routeBodies.size} routes, ${distinct.size} distinct)`,
    distinct.size === routeBodies.size,
    `${distinct.size} distinct bodies`,
  );
  for (const [route, body] of routeBodies) {
    check(`${route} carries the shell`, body.includes('id="site-head"') && body.includes('id="stage-canvas"'));
  }
  check('the 404 is marked as such', (routeBodies.get('/404.html') ?? '').includes('noindex'));

  // Every local reference in the served documents must resolve over HTTP.
  const refs = new Set();
  const collect = (body) => {
    for (const match of body.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)) refs.add(match[1].slice(2));
    for (const match of body.matchAll(/(?:src|href)="(\/[^"]+)"/g)) refs.add(match[1].slice(1));
    for (const match of body.matchAll(/content="(\.\/[^"]+)"/g)) refs.add(match[1].slice(2));
    for (const match of body.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) refs.add(url.replace(/^\.\//, '').replace(/^\//, ''));
      }
    }
  };
  for (const body of routeBodies.values()) collect(body);

  const missing = [];
  for (const ref of refs) {
    const response = await fetch(`http://127.0.0.1:${PORT}/${ref}`);
    if (!response.ok) missing.push(`${ref} (${response.status})`);
    else await response.arrayBuffer();
  }
  check(`every referenced asset is served (${refs.size})`, missing.length === 0, missing.join(', '));

  // The hashed CSS and JS the document points at.
  const cssRef = html.match(/href="(?:\.\/|\/)?(assets\/[^"]+\.css)"/)?.[1];
  const jsRef = html.match(/src="(?:\.\/|\/)?(assets\/[^"]+\.js)"/)?.[1];
  check('the stylesheet is served', Boolean(cssRef && (await fetch(`http://127.0.0.1:${PORT}/${cssRef}`)).ok));
  check('the entry module is served', Boolean(jsRef && (await fetch(`http://127.0.0.1:${PORT}/${jsRef}`)).ok));

  // The font files the stylesheet points at.
  const css = cssRef ? readFileSync(join(dist, cssRef), 'utf8') : '';
  const fontRefs = [
    ...new Set(
      [...css.matchAll(/url\((['"]?)(?:\.\/|\/)?([^)'"]+\.woff2)\1\)/g)].map((m) => m[2]),
    ),
  ];
  const missingFonts = [];
  for (const ref of fontRefs) {
    const response = await fetch(`http://127.0.0.1:${PORT}/${ref}`);
    if (!response.ok) missingFonts.push(ref);
    else await response.arrayBuffer();
  }
  check(`every webfont is served (${fontRefs.length})`, missingFonts.length === 0, missingFonts.join(', '));

  // The Three.js chunk must exist on disk but must NOT be referenced by the
  // initial document — it is loaded on demand.
  const threeChunkExists = readdirSync(join(dist, 'assets')).some((file) => file.startsWith('three-'));
  check('the Three.js chunk exists as its own file', threeChunkExists);
  check(
    'the Three.js chunk is not referenced by the initial document',
    !/assets\/three-[\w-]+\.js/.test(html),
  );

  // The honest-formula check: the page must not contain a fake success string.
  check('the contact form makes no false success claim',
    !/we('| ha)?ve received|thanks for (your )?enquiry|we'll be in touch/i.test(html));

  // robots.txt and the web manifest.
  const robots = await (await fetch(`http://127.0.0.1:${PORT}/robots.txt`)).text();
  check('robots.txt is served and allows crawling', robots.includes('Allow:'));
  const manifest = await (await fetch(`http://127.0.0.1:${PORT}/site.webmanifest`)).json();
  check('the web manifest is valid JSON with a name', typeof manifest.name === 'string' && manifest.name.length > 0);
}

stop();

console.log(`\n${checks - failures}/${checks} checks passed.`);
if (failures) process.exit(1);
console.log('Serve check passed.');
process.exit(0);
