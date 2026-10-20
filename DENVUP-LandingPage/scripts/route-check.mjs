#!/usr/bin/env node
/**
 * Route check.
 *
 * The site is a multi-page build with a client-side router on top. This
 * script opens the built site in a real Chromium and checks the things only
 * a browser can answer:
 *
 *   - every route loads directly, with its own content and its own title,
 *   - a link click swaps the view without a full page load,
 *   - the shell — header, menu, cursor, stage, dock — is the *same DOM
 *     nodes* before and after a route change, which is the whole point of
 *     the persistent shell,
 *   - Back and Forward run the transition in reverse,
 *   - each route pair uses the transition it is supposed to use, and no
 *     transition is a plain fade,
 *   - the console stays clean through all of it.
 *
 * Usage:  node scripts/route-check.mjs [--url http://127.0.0.1:4185/]
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');
const shots = join(root, 'screenshots');
const PORT = 4185;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const base = flag('url', `http://127.0.0.1:${PORT}/`);

/** Join a route path onto the base without doubling the slash. */
const at = (path) => new URL(path, base).href;

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

/* ------------------------------------------------------------------ server */

let server = null;
let serverLog = '';

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(base);
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

if (!base.startsWith('http://127.0.0.1') && !base.startsWith('http://localhost')) {
  console.log(`Checking an already-running server at ${base}`);
} else {
  if (!existsSync(join(dist, 'index.html'))) {
    console.error('dist/index.html is missing — run `npx vite build` first.');
    process.exit(1);
  }
  server = spawn(
    join(root, 'node_modules/.bin/vite'),
    ['preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  server.stdout.on('data', (c) => {
    serverLog += c.toString();
  });
  server.stderr.on('data', (c) => {
    serverLog += c.toString();
  });
  const stop = () => {
    if (server && !server.killed) server.kill('SIGTERM');
  };
  process.on('exit', stop);
  process.on('SIGINT', () => {
    stop();
    process.exit(130);
  });
  const started = await waitForServer();
  check('the preview server starts and answers', started, serverLog.slice(-400));
  if (!started) process.exit(1);
}

/* ----------------------------------------------------------------- browser */

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

async function ensureChromiumLibraries() {
  const libDir = join(tmpdir(), 'al2023', 'lib');
  if (existsSync(join(libDir, 'libnspr4.so'))) return libDir;

  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', '@sparticuz', 'chromium');
  const helper = join(packageRoot, 'build', 'lambdafs.js');
  const archive = join(packageRoot, 'bin', 'al2023.tar.br');
  if (!existsSync(helper) || !existsSync(archive)) return null;

  const { inflate } = await import(pathToFileURL(helper).href);
  await inflate(archive);
  return existsSync(join(libDir, 'libnspr4.so')) ? libDir : null;
}

const libDirs = (process.env.CHROMIUM_LIBS ?? '').split(':').filter(Boolean);
if (!libDirs.length) {
  const unpacked = await ensureChromiumLibraries();
  if (unpacked) libDirs.push(unpacked);
  if (existsSync(join(tmpdir(), 'libEGL.so'))) libDirs.push(tmpdir());
}

const env = {
  ...process.env,
  LD_LIBRARY_PATH: [...libDirs, process.env.LD_LIBRARY_PATH ?? ''].filter(Boolean).join(':'),
};

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (await chromium.executablePath());
const browser = await puppeteer.launch({
  executablePath,
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: 'shell',
  env,
});

mkdirSync(shots, { recursive: true });

/* --------------------------------------------------------------- the routes */

/**
 * Navigate, with a generous timeout and one retry.
 *
 * The first navigation after the preview server has just started can exceed
 * Chromium's default 30 s budget on a loaded machine. That is a harness
 * artefact rather than a site defect: the page loads in well under two
 * seconds (see `npm run perf-check`). One retry keeps the check honest — it
 * still fails if the second attempt does not reach the page.
 */
async function open(page, url, timeout = 60000) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout });
      return;
    } catch (error) {
      if (attempt === 1) throw error;
      console.log(`  ..   the first navigation to ${url} timed out; retrying once`);
    }
  }
}

/**
 * A history move. The navigation itself is allowed to time out — the check
 * that follows it (waiting for the view attribute to change) is the real
 * assertion, and the shell is then read from the page.
 */
async function history(page, action) {
  try {
    await page[action]({ waitUntil: 'networkidle2', timeout: 20000 });
  } catch {
    /* the wait for the view to change below is the assertion that counts */
  }
}

const ROUTES = [
  { id: 'home', path: '/', title: 'DENVUP — digital studio: website design, development & interactive experiences' },
  { id: 'services', path: '/services/', title: 'Services — DENVUP' },
  { id: 'service', path: '/services/web-design/', title: 'Web design &amp; development — DENVUP' },
  { id: 'lab', path: '/lab/', title: 'Interaction lab — DENVUP' },
  { id: 'concepts', path: '/concepts/', title: 'Concepts — DENVUP' },
  { id: 'studio', path: '/studio/', title: 'Studio — DENVUP' },
  { id: 'pricing', path: '/pricing/', title: 'Pricing — DENVUP' },
  { id: 'contact', path: '/contact/', title: 'Contact — DENVUP' },
  { id: 'privacy', path: '/privacy/', title: 'Privacy — DENVUP' },
  { id: 'terms', path: '/terms/', title: 'Terms — DENVUP' },
  { id: 'notfound', path: '/404.html', title: 'Page not found — DENVUP' },
];

/** The transition each route pair is supposed to use. */
const EXPECTED = {
  'home>service': 'service-expand',
  'services>service': 'service-expand',
  'home>lab': 'shape-wipe',
  'home>studio': 'colour-wipe',
  'home>pricing': 'panel-overlap',
  'home>contact': 'curtain-open',
  'home>concepts': 'image-mask',
  'home>notfound': 'glitch-settle',
};

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const consoleErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => consoleErrors.push(String(error)));

/* ------------------------------------------------------------------- tests */

console.log('\n— direct loads —');

for (const route of ROUTES) {
  await open(page, at(route.path));
  await page
    .waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', {
      timeout: 10000,
    })
    .catch(() => {});
  const state = await page.evaluate(() => {
    const view = document.querySelector('main#view');
    return {
      viewId: view?.getAttribute('data-view') ?? null,
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      hasHeader: Boolean(document.querySelector('#site-head')),
      hasStage: Boolean(document.querySelector('#stage-canvas')),
      hasDock: Boolean(document.querySelector('#dock')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  check(`${route.path} loads with its own content`, state.h1 !== null && state.h1.length > 0, state.h1 ?? 'no h1');
  check(
    `${route.path} has the right title`,
    state.title.replace(/&amp;/g, '&') === route.title.replace(/&amp;/g, '&'),
    state.title,
  );
  check(`${route.path} carries the shell`, state.hasHeader && state.hasStage && state.hasDock);
  check(`${route.path} has no horizontal overflow`, state.overflow <= 1, `${state.overflow}px`);
}

console.log('\n— client-side navigation —');

await open(page, at('/'));
await page.waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', {
  timeout: 10000,
});

/* Mark the shell so we can prove it survived the swap. */
await page.evaluate(() => {
  const head = document.querySelector('#site-head');
  const stage = document.querySelector('#stage-canvas');
  const cursor = document.querySelector('#cursor');
  const dock = document.querySelector('#dock');
  head?.setAttribute('data-shell-token', 'kept');
  stage?.setAttribute('data-shell-token', 'kept');
  cursor?.setAttribute('data-shell-token', 'kept');
  dock?.setAttribute('data-shell-token', 'kept');
  window.__navCount = 0;
  window.addEventListener('beforeunload', () => {
    window.__navCount = 1;
  });
});

/** Click a link in the shell and wait for the route to change. */
async function clickRoute(selector) {
  const before = page.url();
  const clicked = await page.evaluate((sel) => {
    const node = document.querySelector(sel);
    if (!node) return false;
    node.click();
    return true;
  }, selector);
  if (!clicked) return { ok: false, reason: 'link not found' };

  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    const view = await page.evaluate(() => document.querySelector('main#view')?.getAttribute('data-view'));
    if (page.url() !== before && view) return { ok: true, url: page.url(), view };
    await new Promise((r) => setTimeout(r, 80));
  }
  return { ok: false, reason: 'route did not change' };
}

const navChecks = [
  { selector: '.site-nav__list a[data-route="services"]', expect: 'services' },
  { selector: '.site-nav__list a[data-route="lab"]', expect: 'lab' },
  { selector: '.site-nav__list a[data-route="studio"]', expect: 'studio' },
  { selector: '.site-nav__list a[data-route="pricing"]', expect: 'pricing' },
  { selector: '.site-nav__list a[data-route="contact"]', expect: 'contact' },
];

for (const nav of navChecks) {
  const result = await clickRoute(nav.selector);
  check(`clicking ${nav.selector} routes to ${nav.expect}`, result.ok, result.reason ?? '');
  if (result.ok) {
    const shell = await page.evaluate(() => ({
      head: document.querySelector('#site-head')?.getAttribute('data-shell-token') ?? null,
      stage: document.querySelector('#stage-canvas')?.getAttribute('data-shell-token') ?? null,
      cursor: document.querySelector('#cursor')?.getAttribute('data-shell-token') ?? null,
      dock: document.querySelector('#dock')?.getAttribute('data-shell-token') ?? null,
      view: document.querySelector('main#view')?.getAttribute('data-view') ?? null,
      title: document.title,
      direction: document.documentElement.getAttribute('data-direction') ?? null,
      transition: document.documentElement.getAttribute('data-transition') ?? null,
    }));
    check(
      `the shell survives the move to ${nav.expect}`,
      shell.head === 'kept' && shell.stage === 'kept' && shell.cursor === 'kept' && shell.dock === 'kept',
      JSON.stringify(shell),
    );
    check(`the view is now ${nav.expect}`, shell.view === nav.expect, shell.view ?? 'none');
    check(
      `the move to ${nav.expect} was played forwards`,
      shell.direction === 'forward',
      shell.direction ?? 'none',
    );
    check(
      `the move to ${nav.expect} used a transition, not a page load`,
      typeof shell.transition === 'string' && shell.transition.length > 0 && shell.transition !== 'none',
      shell.transition ?? 'none',
    );
  }
}

console.log('\n— back and forward —');

/*
 * The back/forward check runs on its own page. The history of the page
 * above has been used by a dozen client-side navigations, and a back
 * button pressed in the middle of that would walk into an entry from
 * earlier in the run rather than the one the test just made.
 */
const historyPage = await browser.newPage();
await historyPage.setViewport({ width: 1440, height: 900 });
const historyErrors = [];
historyPage.on('pageerror', (error) => historyErrors.push(String(error)));

await open(historyPage, at('/'));
await historyPage.waitForFunction(
  () => document.documentElement.getAttribute('data-router') === 'ready',
  { timeout: 10000 },
);
await historyPage.evaluate(() => {
  document.querySelector('#site-head')?.setAttribute('data-shell-token', 'kept');
  document.querySelector('#stage-canvas')?.setAttribute('data-shell-token', 'kept');
});

await historyPage.evaluate(() => {
  document.querySelector('.site-nav__list a[data-route="studio"]').click();
});
await historyPage.waitForFunction(() => location.pathname === '/studio/', { timeout: 10000 });
await new Promise((r) => setTimeout(r, 1600));
const onStudio = await historyPage.evaluate(() => ({
  url: location.pathname,
  view: document.querySelector('main#view')?.getAttribute('data-view') ?? null,
}));
check('a link to the studio routes', onStudio.url === '/studio/' && onStudio.view === 'studio', JSON.stringify(onStudio));

await history(historyPage, 'goBack');
await historyPage
  .waitForFunction(() => document.querySelector('main#view')?.dataset.view === 'home', {
    timeout: 12000,
  })
  .catch(() => {});
await new Promise((r) => setTimeout(r, 400));
const afterBack = await historyPage.evaluate(() => ({
  url: location.pathname,
  view: document.querySelector('main#view')?.getAttribute('data-view') ?? null,
  head: document.querySelector('#site-head')?.getAttribute('data-shell-token') ?? null,
  stage: document.querySelector('#stage-canvas')?.getAttribute('data-shell-token') ?? null,
  title: document.title,
  direction: document.documentElement.getAttribute('data-direction') ?? null,
  transition: document.documentElement.getAttribute('data-transition') ?? null,
}));
check('Back returns to the home page', afterBack.url === '/' && afterBack.view === 'home', JSON.stringify(afterBack));
check('the shell survives Back', afterBack.head === 'kept' && afterBack.stage === 'kept');
check('the title follows Back', afterBack.title.includes('DENVUP'), afterBack.title);
check(
  'Back plays the transition in reverse',
  afterBack.direction === 'back',
  afterBack.direction ?? 'none',
);
check(
  'Back runs the journey\'s own transition, reversed',
  afterBack.transition === 'colour-wipe',
  afterBack.transition ?? 'none',
);

await history(historyPage, 'goForward');
await historyPage
  .waitForFunction(() => document.querySelector('main#view')?.dataset.view === 'studio', {
    timeout: 12000,
  })
  .catch(() => {});
await new Promise((r) => setTimeout(r, 400));
const afterForward = await historyPage.evaluate(() => ({
  url: location.pathname,
  view: document.querySelector('main#view')?.getAttribute('data-view') ?? null,
  direction: document.documentElement.getAttribute('data-direction') ?? null,
}));
check(
  'Forward returns to the studio',
  afterForward.url === '/studio/' && afterForward.view === 'studio',
  JSON.stringify(afterForward),
);
check(
  'Forward plays the transition forwards',
  afterForward.direction === 'forward',
  afterForward.direction ?? 'none',
);

check('the back/forward pass raises no errors', historyErrors.length === 0, historyErrors.join(' | '));
await historyPage.close();

console.log('\n— the transition each route pair uses —');

/**
 * Read which transition ran.
 *
 * The transitions write their name onto the document as
 * `data-transition`, so the check reads it rather than guessing from
 * timing.
 */
const transitionProbe = async (fromPath, toPath) => {
  await open(page, at(fromPath));
  await page
    .waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', {
      timeout: 10000,
    })
    .catch(() => {});
  const name = await page.evaluate(async (to) => {
    const link = document.querySelector(
      `a[href="${to}"], a[href="${to.replace(/\/$/, '')}"]`,
    );
    if (!link) return 'no-link';
    link.click();
    await new Promise((r) => setTimeout(r, 1400));
    return (
      document.documentElement.getAttribute('data-transition') ??
      document.documentElement.getAttribute('data-transitioning') ??
      'none'
    );
  }, toPath);
  return name;
};

const usedTransitions = new Set();
for (const [pair, expected] of Object.entries(EXPECTED)) {
  const [from, to] = pair.split('>');
  const fromPath = ROUTES.find((route) => route.id === from)?.path ?? '/';
  const toPath = ROUTES.find((route) => route.id === to)?.path ?? '/';
  const used = await transitionProbe(fromPath, toPath);
  usedTransitions.add(used);
  check(`${pair} uses ${expected}`, used === expected, `used ${used}`);
}

/*
 * The brief forbids a plain fade as any entrance or exit. The transitions
 * write their own name onto the document, so the check can prove that the
 * names actually used are the designed ones and not a generic fade.
 */
check(
  'no route transition is a plain fade',
  ![...usedTransitions].some((name) => /fade|crossfade|dissolve/i.test(name)),
  [...usedTransitions].join(', '),
);
const expectedRules = new Set(Object.values(EXPECTED));
check(
  `every designed transition rule was exercised (${usedTransitions.size} of ${expectedRules.size})`,
  usedTransitions.size === expectedRules.size &&
    [...expectedRules].every((rule) => usedTransitions.has(rule)),
  `used ${[...usedTransitions].join(', ')}`,
);

console.log('\n— the 404 —');

await open(page, at('/no-such-page/'));
await new Promise((r) => setTimeout(r, 1200));
const missing = await page.evaluate(() => ({
  view: document.querySelector('main#view')?.getAttribute('data-view') ?? null,
  h1: document.querySelector('h1')?.textContent?.trim() ?? null,
  title: document.title,
}));
check('an unknown path lands on the 404 view', missing.view === 'notfound', JSON.stringify(missing));
check('the 404 has its own heading', Boolean(missing.h1), missing.h1 ?? 'none');

console.log('\n— reduced motion —');

const reduced = await browser.newPage();
await reduced.setViewport({ width: 1440, height: 900 });
await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const reducedErrors = [];
reduced.on('pageerror', (error) => reducedErrors.push(String(error)));
await open(reduced, `${base}/`);
await new Promise((r) => setTimeout(r, 600));
const reducedState = await reduced.evaluate(async () => {
  const link = document.querySelector('.site-nav__list a[data-route="lab"]');
  link?.click();
  await new Promise((r) => setTimeout(r, 1200));
  return {
    view: document.querySelector('main#view')?.getAttribute('data-view') ?? null,
    isReduced: document.documentElement.classList.contains('is-reduced'),
    transition: document.documentElement.getAttribute('data-transition'),
  };
});
check('reduced motion still routes', reducedState.view === 'lab', JSON.stringify(reducedState));

/*
 * The feedback layer under reduced motion.
 *
 * "Fewer and gentler, not none": the state must still change and the
 * feedback must still be there. A visitor who asks for less motion must
 * not lose the tick, the trace or the error rule — only the travel.
 */
const reducedAck = await (async () => {
  await open(reduced, `${base}/`);
  await new Promise((r) => setTimeout(r, 900));
  return reduced.evaluate(async () => {
    const out = {};
    /* a copy still confirms */
    const copy = document.querySelector('[data-copy]');
    if (copy) {
      copy.click();
      await new Promise((r) => setTimeout(r, 450));
      out.copyState = copy.dataset.feedbackState ?? null;
      out.copyHasTick = Boolean(copy.querySelector('[data-feedback-tick]'));
    }
    /* a choice still traces itself */
    const choice = document.querySelector('[data-enquiry-type] .enquiry__choice');
    if (choice) {
      choice.querySelector('input')?.click();
      await new Promise((r) => setTimeout(r, 350));
      const trace = getComputedStyle(choice, '::after');
      out.choiceTraced = choice.classList.contains('is-registered');
      out.choiceTraceWidth = trace.width;
      out.choiceAnimation = trace.animationName;
    }
    /* a rejected field still rules itself */
    const name = document.querySelector('#enquiry-name');
    if (name) {
      const owner = name.closest('.field');
      owner?.classList.add('is-rejected');
      await new Promise((r) => setTimeout(r, 250));
      const rule = getComputedStyle(owner, '::after');
      out.rejectHeight = rule.height;
      out.rejectBackground = rule.backgroundColor;
    }
    return out;
  });
})();

check(
  'reduced motion still confirms a copy',
  reducedAck.copyState === 'confirmed' && reducedAck.copyHasTick === true,
  JSON.stringify(reducedAck),
);
check(
  'reduced motion still traces a choice',
  reducedAck.choiceTraced === true && reducedAck.choiceTraceWidth !== '0px',
  JSON.stringify(reducedAck),
);
check(
  'reduced motion still rules a rejected field',
  reducedAck.rejectHeight === '2px' && reducedAck.rejectBackground !== 'rgba(0, 0, 0, 0)',
  JSON.stringify(reducedAck),
);
check('reduced motion is detected', reducedState.isReduced === true);
check('reduced motion raises no errors', reducedErrors.length === 0, reducedErrors.join(' | '));

console.log('\n— mobile —');

const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await open(mobile, `${base}/`);
const mobileOverflow = await mobile.evaluate(() => {
  const doc = document.documentElement;
  return {
    overflow: doc.scrollWidth - doc.clientWidth,
    widest: Array.from(document.querySelectorAll('body *'))
      .map((node) => ({
        tag: node.tagName,
        cls: node.className?.toString?.().slice(0, 40) ?? '',
        right: node.getBoundingClientRect().right,
      }))
      .filter((item) => item.right > doc.clientWidth + 2)
      .slice(0, 5),
  };
});
check('the home page has no horizontal overflow at 390px', mobileOverflow.overflow <= 1, JSON.stringify(mobileOverflow));

for (const route of ['/services/', '/lab/', '/pricing/', '/contact/']) {
  await open(mobile, at(route));
  const overflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check(`${route} has no horizontal overflow at 390px`, overflow <= 1, `${overflow}px`);
}

console.log('\n— console —');
check('the console is clean through every route change', consoleErrors.length === 0, consoleErrors.slice(0, 4).join(' | '));

await browser.close();
if (server && !server.killed) server.kill('SIGTERM');

console.log(`\n${checks - failures}/${checks} checks passed.`);
if (failures) {
  console.log(`${failures} FAILED.`);
  process.exit(1);
}
process.exit(0);
