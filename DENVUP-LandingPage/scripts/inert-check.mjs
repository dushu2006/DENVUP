#!/usr/bin/env node
/**
 * Inert-control audit.
 *
 * A control that looks like a control but does nothing is the worst kind
 * of defect on a site whose whole argument is "we notice you". This
 * script asks the browser a question that only a real renderer can
 * answer: *does this element actually have a listener attached?*
 *
 * The answer comes from the Chrome DevTools Protocol
 * (`DOMDebugger.getEventListeners`), which reports the listeners the
 * engine really has for a given object — not what the markup implies.
 *
 * Elements are examined per route, including controls that live inside
 * lazily-mounted demo stages, so the audit scrolls the page first and
 * then resolves every element it can reach.
 *
 * The audit runs in two phases, and this matters:
 *
 *   Phase 1 walks each route once — counting the interactive elements,
 *   asking the protocol about each one's listeners, and recording the
 *   ids the page actually has.
 *
 *   Phase 2 resolves the links, using the id sets phase 1 collected.
 *
 * The earlier version opened a second browser tab and navigated it to
 * every link target to ask whether the fragment existed there. That
 * loaded the home page — four hundred and eighty cards and a WebGL
 * field — thirty times over, and the browser degraded until it began
 * reporting links that obviously existed as broken. Resolving against
 * what phase 1 already saw is both faster and honest.
 *
 * Usage:  node scripts/inert-check.mjs [--url http://127.0.0.1:4185/]
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const baseUrl = flag('url', 'http://127.0.0.1:4185/').replace(/\/$/, '');

const ROUTES = [
  '/',
  '/services/',
  '/services/web-design/',
  '/services/ai-solutions/',
  '/services/business-integrations/',
  '/services/creative-experiences/',
  '/services/automation/',
  '/lab/',
  '/concepts/',
  '/studio/',
  '/pricing/',
  '/contact/',
  '/privacy/',
  '/terms/',
];

let failures = 0;
let checks = 0;
let inertTotal = 0;

function check(label, condition, detail = '') {
  checks += 1;
  if (condition) console.log(`  ok   ${label}`);
  else {
    failures += 1;
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

/* ------------------------------------------------------------------ server */

let server = null;
let serverLog = '';

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl + '/');
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

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html is missing — run `npm run build` first.');
  process.exit(1);
}

if (baseUrl.includes('127.0.0.1') || baseUrl.includes('localhost')) {
  const port = Number(new URL(baseUrl).port);
  server = spawn('npx', ['vite', 'preview', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, LD_LIBRARY_PATH: '/tmp/al2023/lib:/tmp' },
  });
  server.stdout.on('data', (d) => {
    serverLog += d.toString();
  });
  server.stderr.on('data', (d) => {
    serverLog += d.toString();
  });
  if (!(await waitForServer())) {
    console.error('preview server did not start:\n' + serverLog);
    server.kill('SIGTERM');
    process.exit(1);
  }
}

/* ---------------------------------------------------------------- chromium */

let chromium;
let puppeteer;
try {
  ({ default: puppeteer } = await import('puppeteer-core'));
  ({ default: chromium } = await import('@sparticuz/chromium'));
} catch (error) {
  console.error('puppeteer-core / @sparticuz/chromium are not installed.');
  console.error(String(error));
  process.exit(1);
}

const libDirs = ['/tmp/al2023/lib', '/tmp'];
const launchEnv = {
  ...process.env,
  LD_LIBRARY_PATH: [...libDirs, process.env.LD_LIBRARY_PATH ?? ''].filter(Boolean).join(':'),
};

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (await chromium.executablePath());
const browser = await puppeteer.launch({
  executablePath,
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: 'shell',
  env: launchEnv,
});

/* ------------------------------------------------------------------- dist */

/**
 * Resolve a root-relative path to the file that was actually built.
 *
 * The site is a multi-page build: `/services/` is `services/index.html`.
 * A path that does not resolve to a built document is a broken link.
 */
function resolveRouteFile(path) {
  const clean = path.replace(/^\/+/, '');
  const candidates = clean === ''
    ? ['index.html']
    : [clean, `${clean}index.html`, `${clean}.html`];
  for (const candidate of candidates) {
    const full = join(dist, candidate);
    /* A directory is not a document: "/contact/" resolves to a folder
       that holds "index.html", and treating the folder as the file made
       every route with a fragment look broken. */
    try {
      if (statSync(full).isFile()) return full;
    } catch {
      /* not there */
    }
  }
  return null;
}

/** Does the built document contain an element with this id? */
function readFragment(file, fragment) {
  try {
    const source = readFileSync(file, 'utf8');
    return new RegExp(`id=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(source);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ audit */

/**
 * Resolve the real listeners for every interactive element on the page.
 *
 * The page is walked in page context so that we can label each element
 * the way a person would ("the Replay button inside the card for X"),
 * then each element is handed to the protocol one at a time.
 *
 * Anchors with an `href` are *navigational*: the browser resolves them
 * without any JavaScript, so they are audited separately (the href has
 * to point at something real) rather than being counted as inert.
 */
const SELECTOR =
  'button, a[href], input, select, textarea, [role="button"], [role="tab"], [role="switch"], [tabindex]:not([tabindex="-1"])';

const COLLECT = (selector) => {
  const nodes = Array.from(document.querySelectorAll(selector));
  const describe = (node) => {
    const tag = node.tagName.toLowerCase();
    const text = (node.getAttribute('aria-label') || node.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60);
    const cls = (node.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    const inStage = node.closest('.demo__stage') ? ' [demo]' : '';
    const inCard = node.closest('.fx-card') ? ' [card]' : '';
    const disabled = node.hasAttribute('disabled') ? ' [disabled]' : '';
    return `${tag}${cls ? `.${cls}` : ''} "${text}"${inStage}${inCard}${disabled}`;
  };
  return nodes.map((node, index) => {
    const form = node.closest('form');
    const forms = Array.from(document.forms);
    return {
      index,
      label: describe(node),
      navigational: node.tagName === 'A' && node.hasAttribute('href'),
      href: node.tagName === 'A' ? node.getAttribute('href') : null,
      formIndex: form ? forms.indexOf(form) : null,
    };
  });
};

async function listenersFor(cdp, index) {
  const evaluated = await cdp.send('Runtime.evaluate', {
    expression: `document.querySelectorAll(${JSON.stringify(SELECTOR)})[${index}]`,
    returnByValue: false,
  });
  const objectId = evaluated?.result?.objectId;
  if (!objectId) return null;
  try {
    const listed = await cdp.send('DOMDebugger.getEventListeners', { objectId });
    await cdp.send('Runtime.releaseObject', { objectId });
    return listed?.listeners ?? [];
  } catch {
    try {
      await cdp.send('Runtime.releaseObject', { objectId });
    } catch {
      /* the object may already be gone */
    }
    return null;
  }
}

/* ------------------------------------------------------- phase 1: the walk */

/** route → the ids that route's page actually has. */
const idsByRoute = new Map();
/** every link seen, with the route it was seen on. */
const links = [];

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const consoleErrors = [];
  page.on('pageerror', (error) => consoleErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));

  /* Walk the page so that lazily-mounted demo stages exist. */
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await new Promise((r) => setTimeout(r, 700));

  const cdp = await page.createCDPSession();
  const collected = await page.evaluate(COLLECT, SELECTOR);

  /* The ids this page really has, taken after the walk. */
  const ids = await page.evaluate(() => {
    const set = new Set();
    document.querySelectorAll('[id]').forEach((node) => set.add(node.id));
    document.querySelectorAll('[name]').forEach((node) => {
      if (node.id) return;
      const name = node.getAttribute('name');
      if (name) set.add(name);
    });
    return Array.from(set);
  });
  idsByRoute.set(route, new Set(ids));

  for (const item of collected) {
    if (item.navigational) links.push({ route, label: item.label, href: item.href ?? '' });
  }

  /*
   * A form's fields are read when the form is submitted, so a text input
   * does not need a listener of its own. What it *does* need is a form
   * that submits — so the rule is: a field is handled if it has its own
   * listener, or if the form around it has a submit listener.
   */
  const formHasSubmit = new Map();
  const formListeners = async (formIndex) => {
    if (formHasSubmit.has(formIndex)) return formHasSubmit.get(formIndex);
    const evaluated = await cdp.send('Runtime.evaluate', {
      expression: `document.forms[${formIndex}]`,
      returnByValue: false,
    });
    const objectId = evaluated?.result?.objectId;
    let handled = false;
    if (objectId) {
      try {
        const listed = await cdp.send('DOMDebugger.getEventListeners', { objectId });
        handled = (listed?.listeners ?? []).some((l) => l.type === 'submit');
        await cdp.send('Runtime.releaseObject', { objectId });
      } catch {
        handled = false;
      }
    }
    formHasSubmit.set(formIndex, handled);
    return handled;
  };

  const inert = [];
  for (const item of collected) {
    if (item.navigational) continue;
    const listeners = await listenersFor(cdp, item.index);
    if (listeners === null) continue; /* element vanished mid-walk */
    if (listeners.length === 0) {
      /* a form field is handled by the form that submits it */
      if (item.formIndex !== null && (await formListeners(item.formIndex))) continue;
      inert.push(item.label);
    }
  }

  inertTotal += inert.length;

  console.log(
    `  ${inert.length === 0 ? 'ok  ' : 'FAIL'} ${route.padEnd(34)} ${collected.length} interactive · ${inert.length} without a listener`,
  );
  if (inert.length > 0) inert.forEach((label) => console.log(`        · ${label}`));

  check(`${route} — every interactive control has a listener`, inert.length === 0, `${inert.length} inert`);
  check(`${route} — no page errors`, consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '));

  await cdp.detach();
  await page.close();
}

/* ------------------------------------------------- phase 2: the link check */

/**
 * Find the audited route that serves a given path.
 *
 * `/` is the home page; `/contact/` is the contact route. The trailing
 * slash is the site's convention, so both spellings are accepted.
 */
function routeFor(path) {
  const clean = path === '' ? '/' : path.replace(/\/+$/, '') || '/';
  const withSlash = clean === '/' ? '/' : `${clean}/`;
  if (idsByRoute.has(withSlash)) return withSlash;
  if (idsByRoute.has(clean)) return clean;
  return null;
}

const broken = [];
for (const link of links) {
  const href = link.href;
  if (!href) {
    broken.push({ ...link, why: 'empty href' });
    continue;
  }
  if (href.startsWith('#')) {
    /* a fragment on the same page */
    const id = href.slice(1);
    const ids = idsByRoute.get(link.route);
    if (ids && !ids.has(id)) broken.push({ ...link, why: `no id "${id}" on ${link.route}` });
    continue;
  }
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    if (href.length < 8) broken.push({ ...link, why: 'empty address' });
    continue;
  }
  if (/^https?:/i.test(href)) {
    /* external — nothing to verify locally */
    continue;
  }

  /*
   * A root-relative path is a route in this site. It is valid if the
   * document it names was actually built, and if it carries a fragment,
   * that fragment has to exist on the target page.
   */
  const [path, fragment] = href.split('#');
  const file = resolveRouteFile(path);
  if (!file) {
    broken.push({ ...link, why: 'no such document was built' });
    continue;
  }
  if (!fragment) continue;

  const target = routeFor(path);
  if (target) {
    const ids = idsByRoute.get(target);
    if (ids && !ids.has(fragment)) {
      broken.push({ ...link, why: `no id "${fragment}" on ${target}` });
    }
    continue;
  }
  /* a route this audit did not walk — fall back to the built file */
  if (!readFragment(file, fragment)) {
    broken.push({ ...link, why: `no id "${fragment}" in the built document` });
  }
}

const byRoute = new Map();
for (const item of broken) {
  if (!byRoute.has(item.route)) byRoute.set(item.route, []);
  byRoute.get(item.route).push(item);
}

for (const route of ROUTES) {
  const items = byRoute.get(route) ?? [];
  console.log(
    `  ${items.length === 0 ? 'ok  ' : 'FAIL'} ${route.padEnd(34)} ${links.filter((l) => l.route === route).length} links · ${items.length} broken`,
  );
  if (items.length > 0) {
    items.slice(0, 40).forEach((item) => console.log(`        ✗ ${item.label} → ${item.href} (${item.why})`));
  }
  check(`${route} — every link points at something real`, items.length === 0, items.slice(0, 3).map((i) => `${i.label} → ${i.href}`).join(' | '));
}

await browser.close();
if (server) server.kill('SIGTERM');

console.log('');
console.log(`  ${checks - failures}/${checks} checks passed · ${inertTotal} inert controls found · ${broken.length} broken links found`);
process.exit(failures === 0 ? 0 : 1);
