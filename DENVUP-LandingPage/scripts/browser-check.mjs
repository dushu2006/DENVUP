#!/usr/bin/env node
/**
 * Real-browser check.
 *
 * Everything else in this repo verifies markup, HTTP delivery and module
 * wiring. This script opens the built site in a real Chromium, lets the boot
 * sequence finish, and then checks the things only a renderer can answer:
 *
 *   - no overlay is left painted over the page at rest,
 *   - the first chapter's content is genuinely visible (not stuck at
 *     opacity 0 behind a failed reveal),
 *   - the document has no horizontal overflow at any breakpoint,
 *   - the console and the error log are clean,
 *   - every chapter scrolls into view and paints something.
 *
 * It also writes screenshots to `screenshots/` so the visual result can be
 * inspected, not merely asserted.
 *
 * Usage:  node scripts/browser-check.mjs [--url http://127.0.0.1:4183/] [--keep]
 *
 * The browser comes from `@sparticuz/chromium`, so no system Chrome is
 * required. `PUPPETEER_EXECUTABLE_PATH` overrides the binary; `CHROMIUM_LIBS`
 * may point at a directory of extra shared libraries to put on
 * `LD_LIBRARY_PATH`.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');
const shots = join(root, 'screenshots');
const PORT = 4184;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const url = flag('url', `http://127.0.0.1:${PORT}/`);

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
      const response = await fetch(url);
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

if (!url.startsWith('http://127.0.0.1') && !url.startsWith('http://localhost')) {
  console.log(`Checking an already-running server at ${url}`);
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

/*
 * `@sparticuz/chromium` ships the shared libraries Chromium needs in an
 * `al2023.tar.br` archive, which it only unpacks on Amazon Linux 2023.
 * Anywhere else the archive is shipped but never opened, so the browser
 * cannot start. The archive is opened here with the package's own inflate
 * helper, so the check works out of the box on any machine.
 *
 * `CHROMIUM_LIBS` overrides the search if the libraries live somewhere else.
 */
async function ensureChromiumLibraries() {
  const libDir = join(tmpdir(), 'al2023', 'lib');
  if (existsSync(join(libDir, 'libnspr4.so'))) return libDir;

  const packageRoot = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'node_modules',
    '@sparticuz',
    'chromium',
  );
  const helper = join(packageRoot, 'build', 'lambdafs.js');
  const archive = join(packageRoot, 'bin', 'al2023.tar.br');
  if (!existsSync(helper) || !existsSync(archive)) return null;

  // The helper is not on the package's export map, so it is imported by path.
  const { inflate } = await import(pathToFileURL(helper).href);
  await inflate(archive);
  return existsSync(join(libDir, 'libnspr4.so')) ? libDir : null;
}

const libDirs = (process.env.CHROMIUM_LIBS ?? '').split(':').filter(Boolean);
if (!libDirs.length) {
  const unpacked = await ensureChromiumLibraries();
  if (unpacked) libDirs.push(unpacked);
  for (const [dir, probe] of [
    [tmpdir(), 'libEGL.so'],
  ]) {
    if (existsSync(join(dir, probe))) libDirs.push(dir);
  }
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

/**
 * The seven viewports the acceptance test names: 360, 390, 768, 1024,
 * 1280, 1536 and 1920. `phone` is kept at 390 (the common phone width) and
 * `phone-small` covers 360, the narrowest phone still in use.
 */
const VIEWPORTS = [
  { name: 'wide', width: 1920, height: 1080 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop-wide', width: 1280, height: 800 },
  { name: 'desktop-wide', width: 1536, height: 960 },
  { name: 'laptop', width: 1185, height: 820 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'phone-small', width: 360, height: 740 },
];

const OVERLAYS = [
  '.guide',
  '.library__detail',
  '.cmdk',
  '.menu',
  '.tour',
  '.demo__detail',
  '.dock__list',
];

/**
 * Screenshot an element through the compositor and read its pixels back in
 * the browser. A canvas that initialises but never draws looks identical to
 * a working one until you look at the pixels.
 */
async function sampleElement(page, selector) {
  const box = await page
    .evaluate((sel) => {
      const node = document.querySelector(sel);
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return null;
      // Screenshot clips are in document coordinates, not viewport ones.
      return {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }, selector)
    .catch(() => null);
  if (!box) return null;

  const png = await page.screenshot({
    encoding: 'base64',
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
  });
  return page.evaluate(async (data) => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const { data: pixels } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    let max = 0;
    let lit = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const luma = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      sum += luma;
      if (luma > max) max = luma;
      if (luma > 20) lit += 1;
    }
    const total = pixels.length / 4;
    return {
      average: Math.round((sum / total) * 10) / 10,
      max: Math.round(max),
      litPixels: lit,
      litPercent: Math.round((lit / total) * 1000) / 10,
    };
  }, png);
}

const report = { url, viewports: [] };

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text().slice(0, 300));
  });
  page.on('pageerror', (error) => pageErrors.push(String(error.message ?? error).slice(0, 300)));
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.url()} (${request.failure()?.errorText ?? 'failed'})`);
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Let the boot sequence finish and the first chapter settle.
  await page
    .waitForFunction(() => !document.getElementById('boot'), { timeout: 15000 })
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));

  /* --- 1. nothing is painted over the page at rest --------------------- */
  const overlayState = await page.evaluate((selectors) => {
    const out = {};
    for (const selector of selectors) {
      const nodes = Array.from(document.querySelectorAll(selector));
      const visible = nodes.filter((node) => {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      out[selector] = {
        total: nodes.length,
        visible: visible.length,
        hiddenAttr: nodes.length > 0 ? nodes.every((n) => n.hasAttribute('hidden')) : true,
      };
    }
    return out;
  }, OVERLAYS);

  for (const [selector, state] of Object.entries(overlayState)) {
    check(
      `${viewport.name}: ${selector} is not painted over the page`,
      state.visible === 0,
      `${state.visible} visible`,
    );
  }

  /*
   * The enquiry is a three-step wizard: exactly one step may be on screen.
   * This is the check that catches the `hidden` attribute losing to an
   * author `display` declaration — all three steps used to show at once.
   */
  const enquirySteps = await page.evaluate(() => {
    const steps = Array.from(document.querySelectorAll('.enquiry__step'));
    const visible = steps.filter((node) => {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return { total: steps.length, visible: visible.length };
  });
  check(
    `${viewport.name}: exactly one enquiry step is shown (${enquirySteps.visible}/${enquirySteps.total})`,
    enquirySteps.total === 3 && enquirySteps.visible === 1,
    JSON.stringify(enquirySteps),
  );

  /* --- 2. the first chapter is genuinely visible ----------------------- */
  const firstScreen = await page.evaluate(() => {
    const heading = document.querySelector('#prelude h1, #prelude .prelude__beat-text');
    const header = document.querySelector('.site-head');
    const style = heading ? getComputedStyle(heading) : null;
    const rect = heading ? heading.getBoundingClientRect() : null;
    return {
      text: (document.querySelector('#prelude')?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 90),
      opacity: style ? Number(style.opacity) : null,
      visibility: style ? style.visibility : null,
      inViewport: rect ? rect.top < window.innerHeight && rect.bottom > 0 : false,
      headerVisible: header ? getComputedStyle(header).opacity !== '0' : false,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
    };
  });

  check(`${viewport.name}: the opening chapter has content`, firstScreen.text.length > 20, firstScreen.text);
  check(
    `${viewport.name}: the opening chapter is visible (opacity ${firstScreen.opacity})`,
    (firstScreen.opacity ?? 0) > 0.9 && firstScreen.visibility === 'visible' && firstScreen.inViewport,
    JSON.stringify(firstScreen),
  );
  check(`${viewport.name}: the header is visible`, firstScreen.headerVisible);

  /* --- 3. no horizontal overflow ---------------------------------------- */
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    offenders: Array.from(document.querySelectorAll('body *'))
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.right > document.documentElement.clientWidth + 2;
      })
      .slice(0, 6)
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return `${node.tagName.toLowerCase()}.${String(node.className || '').split(/\s+/)[0]} → ${Math.round(rect.right)}px`;
      }),
  }));
  check(
    `${viewport.name}: no horizontal overflow (${overflow.scrollWidth} ≤ ${overflow.clientWidth})`,
    overflow.scrollWidth <= overflow.clientWidth + 2,
    overflow.offenders.join(' | '),
  );

  /* --- 4. every chapter paints ----------------------------------------- */
  const chapters = await page.evaluate(async () => {
    const ids = Array.from(document.querySelectorAll('main section[id]')).map((s) => s.id);
    const results = [];
    for (const id of ids) {
      const node = document.getElementById(id);
      node.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const painted = Array.from(node.querySelectorAll('*')).some((child) => {
        const cs = getComputedStyle(child);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
        const r = child.getBoundingClientRect();
        return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < window.innerHeight;
      });
      results.push({
        id,
        height: Math.round(rect.height),
        display: style.display,
        painted,
      });
    }
    return results;
  });

  const unpainted = chapters.filter((c) => !c.painted || c.height < 40);
  check(
    `${viewport.name}: all ${chapters.length} chapters paint (${chapters.length - unpainted.length}/${chapters.length})`,
    unpainted.length === 0,
    unpainted.map((c) => `${c.id} (${c.height}px)`).join(', '),
  );

  /* --- 5. the WebGL panels actually paint ------------------------------- */
  /*
   * A canvas that initialises but never draws is indistinguishable from a
   * working one until you look at it. These panels are screenshotted through
   * the compositor and the pixels are read back in the browser, so a black
   * panel fails the check even though WebGL reported no error.
   */
  await page.evaluate(() => {
    document.getElementById('lab')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1800));

  for (const [label, selector] of [
    ['the WebGL shader field', '[data-shader-canvas]'],
    ['the Three.js scene', '.three-stage__canvas'],
  ]) {
    const stats = await sampleElement(page, selector);
    if (!stats) {
      check(`${viewport.name}: ${label} is present`, false, 'not found on the page');
      continue;
    }
    check(
      `${viewport.name}: ${label} renders pixels (avg ${stats.average}, max ${stats.max})`,
      stats.max > 24 && stats.litPercent > 2,
      JSON.stringify(stats),
    );
  }

  /* --- 5b. the mark chapter's particle field ---------------------------- */
  await page.evaluate(() => {
    document.getElementById('mark')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1600));
  const markField = await sampleElement(page, '[data-mark-canvas]');
  check(
    `${viewport.name}: the mark chapter's particle field renders pixels`,
    Boolean(markField) && markField.max > 24 && markField.litPixels >= 40,
    JSON.stringify(markField),
  );

  /* --- 6. the clean screenshots ---------------------------------------- */
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: join(shots, `${viewport.name}-01-opening.png`) });

  const chapterShots = [
    ['expansion', '02-expansion'],
    ['studio', '03-studio'],
    ['mark', '03b-mark'],
    ['atlas', '04-atlas'],
    ['library', '05-library'],
    ['lab', '06-lab'],
    ['pricing', '07-pricing'],
    ['contact', '08-contact'],
  ];
  for (const [id, file] of chapterShots) {
    const found = await page.evaluate((sectionId) => {
      const node = document.getElementById(sectionId);
      if (!node) return false;
      node.scrollIntoView({ behavior: 'instant', block: 'start' });
      return true;
    }, id);
    if (!found) continue;
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: join(shots, `${viewport.name}-${file}.png`) });
  }

  /* --- 6. the console is clean ----------------------------------------- */
  check(
    `${viewport.name}: no uncaught page errors`,
    pageErrors.length === 0,
    [...new Set(pageErrors)].slice(0, 4).join(' | '),
  );
  check(
    `${viewport.name}: no console errors`,
    consoleErrors.length === 0,
    [...new Set(consoleErrors)].slice(0, 4).join(' | '),
  );
  check(
    `${viewport.name}: no failed network requests`,
    failedRequests.length === 0,
    [...new Set(failedRequests)].slice(0, 4).join(' | '),
  );

  report.viewports.push({
    viewport: viewport.name,
    size: `${viewport.width}×${viewport.height}`,
    overlays: overlayState,
    firstScreen,
    overflow,
    chapters: chapters.length,
    unpainted: unpainted.map((c) => c.id),
    pageErrors: [...new Set(pageErrors)],
    consoleErrors: [...new Set(consoleErrors)],
    failedRequests: [...new Set(failedRequests)],
  });

  await page.close();
}

/* ------------------------------------------------- slow network / low power */

/*
 * The encyclopedia's performance entries are only honest if they were
 * measured. This pass loads the site over a throttled connection with the
 * CPU slowed six-fold and checks that the page still reaches a usable state
 * rather than sitting behind the intro.
 */
const throttled = await browser.newPage();
await throttled.setViewport({ width: 1280, height: 800 });
const throttledErrors = [];
throttled.on('pageerror', (error) => throttledErrors.push(String(error.message ?? error).slice(0, 200)));
const throttledClient = await throttled.createCDPSession();
await throttledClient.send('Network.enable');
await throttledClient.send('Network.emulateNetworkConditions', {
  offline: false,
  downloadThroughput: (400 * 1024) / 8,
  uploadThroughput: (200 * 1024) / 8,
  latency: 300,
});
await throttledClient.send('Emulation.setCPUThrottlingRate', { rate: 6 });

const startedAt = Date.now();
await throttled.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
await throttled
  .waitForFunction(() => !document.getElementById('boot'), { timeout: 60000 })
  .catch(() => {});
const bootMs = Date.now() - startedAt;

const throttledState = await throttled.evaluate(() => {
  const heading = document.querySelector('#prelude .prelude__beat-text');
  const style = heading ? getComputedStyle(heading) : null;
  return {
    booted: !document.getElementById('boot'),
    opacity: style ? Number(style.opacity) : null,
    hasContent: (document.querySelector('#prelude')?.textContent ?? '').trim().length > 20,
  };
});

check(
  `the page still boots on a slow connection (${Math.round(bootMs / 100) / 10}s, CPU 6× slower)`,
  throttledState.booted && bootMs < 45000,
  JSON.stringify({ ...throttledState, bootMs }),
);
check(
  'the first chapter is readable on a slow connection',
  throttledState.hasContent && (throttledState.opacity ?? 0) > 0.9,
  JSON.stringify(throttledState),
);
check(
  'no uncaught errors on a slow connection',
  throttledErrors.length === 0,
  throttledErrors.slice(0, 3).join(' | '),
);
await throttled.screenshot({ path: join(shots, 'throttled-01-opening.png') });
await throttledClient.send('Emulation.setCPUThrottlingRate', { rate: 1 });
await throttled.close();

/* ------------------------------------------------------------- interaction */

/* The overlays must still open and close on demand. */
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const interactionErrors = [];
page.on('pageerror', (error) => interactionErrors.push(String(error.message ?? error).slice(0, 200)));
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await page.waitForFunction(() => !document.getElementById('boot'), { timeout: 15000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 900));

// The library detail drawer opens on demand and closes again.
await page.evaluate(() => {
  document.getElementById('library')?.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await new Promise((r) => setTimeout(r, 600));
const drawer = await page.evaluate(async () => {
  const openButton = document.querySelector('.library__card-open');
  if (!openButton) return { opened: false };
  openButton.click();
  await new Promise((r) => setTimeout(r, 500));
  const panel = document.querySelector('.library__detail');
  const opened = panel ? !panel.hasAttribute('hidden') : false;
  const bodyVisible = panel ? getComputedStyle(panel).display !== 'none' : false;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((r) => setTimeout(r, 900));
  const closed = panel ? panel.hasAttribute('hidden') : false;
  return { opened, bodyVisible, closed };
});
check('the library detail drawer opens on demand', drawer.opened && drawer.bodyVisible, JSON.stringify(drawer));

/*
 * A demo inside the library must actually run, not merely mount. The drawer
 * is opened on a technique that ships a canvas demo and the canvas is then
 * sampled through the compositor.
 */
const demoCanvas = await page.evaluate(async () => {
  const cards = Array.from(document.querySelectorAll('.library__card'));
  for (const card of cards) {
    const open = card.querySelector('.library__card-open');
    const name = card.querySelector('.library__card-name')?.textContent ?? '';
    if (!open || !/demo/i.test(open.textContent ?? '')) continue;
    open.click();
    await new Promise((r) => setTimeout(r, 700));
    const canvas = document.querySelector('.library__detail .demo__canvas');
    if (!canvas) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise((r) => setTimeout(r, 400));
      continue;
    }
    return { name, found: true };
  }
  return { found: false };
});
if (demoCanvas.found) {
  await new Promise((r) => setTimeout(r, 1200));
  // Some demos only draw in response to the pointer, so drive it first.
  const box = await page.evaluate(() => {
    const node = document.querySelector('.library__detail .demo__canvas');
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  if (box) {
    for (let step = 0; step <= 12; step += 1) {
      await page.mouse.move(
        box.x + (box.width * step) / 12,
        box.y + box.height * (0.3 + 0.4 * Math.sin(step / 2)),
      );
      await new Promise((r) => setTimeout(r, 60));
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  const stats = await sampleElement(page, '.library__detail .demo__canvas');
  check(
    `the library demo canvas renders pixels (${demoCanvas.name})`,
    Boolean(stats) && stats.max > 24 && stats.litPixels >= 4,
    JSON.stringify(stats),
  );
} else {
  check('a library demo canvas is available to test', false, 'no canvas demo found');
}
check('the library detail drawer closes on Escape', drawer.closed, JSON.stringify(drawer));
await page.evaluate(() => {
  document.querySelector('.library__card-open')?.click();
});
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: join(shots, 'desktop-09-library-detail.png') });

// The command palette opens with the keyboard and filters.
const palette = await page.evaluate(async () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  await new Promise((r) => setTimeout(r, 500));
  const cmdk = document.getElementById('cmdk');
  const open = cmdk ? !cmdk.hasAttribute('hidden') : false;
  const input = cmdk?.querySelector('input');
  if (input) {
    input.value = 'cursor';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  await new Promise((r) => setTimeout(r, 400));
  const results = cmdk?.querySelectorAll('.cmdk__result').length ?? 0;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((r) => setTimeout(r, 500));
  const closed = cmdk ? cmdk.hasAttribute('hidden') : false;
  return { open, results, closed };
});
check('the command palette opens with Ctrl+K', palette.open, JSON.stringify(palette));
check('the command palette filters results', palette.results > 0, JSON.stringify(palette));
check('the command palette closes on Escape', palette.closed, JSON.stringify(palette));
await page.evaluate(() => document.getElementById('cmd-trigger')?.click());
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: join(shots, 'desktop-10-command-palette.png') });
await page.evaluate(() =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
);
await new Promise((r) => setTimeout(r, 500));

// The command palette also answers to "/".
const paletteSlash = await page.evaluate(async () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
  await new Promise((r) => setTimeout(r, 500));
  const cmdk = document.getElementById('cmdk');
  const open = cmdk ? !cmdk.hasAttribute('hidden') : false;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((r) => setTimeout(r, 500));
  return { open };
});
check('the command palette opens with "/"', paletteSlash.open, JSON.stringify(paletteSlash));

// The mobile menu opens and closes.
await page.setViewport({ width: 390, height: 844 });
await new Promise((r) => setTimeout(r, 400));
const mobileMenu = await page.evaluate(async () => {
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle) return { opened: false };
  toggle.click();
  await new Promise((r) => setTimeout(r, 600));
  const menu = document.getElementById('menu');
  const opened = menu ? !menu.hasAttribute('hidden') : false;
  const painted = menu ? getComputedStyle(menu).display !== 'none' : false;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((r) => setTimeout(r, 900));
  const closed = menu ? menu.hasAttribute('hidden') : false;
  return { opened, painted, closed };
});
check('the mobile menu opens on tap', mobileMenu.opened && mobileMenu.painted, JSON.stringify(mobileMenu));
check('the mobile menu closes on Escape', mobileMenu.closed, JSON.stringify(mobileMenu));

/*
 * The menu must be readable: light type on an ink curtain. This is the check
 * that catches the curtain never rising — the menu would still be "open"
 * while its own background stayed collapsed.
 */
const menuContrast = await page.evaluate(async () => {
  const toggle = document.querySelector('.menu-toggle');
  toggle?.click();
  await new Promise((r) => setTimeout(r, 900));
  const menu = document.getElementById('menu');
  const label = menu?.querySelector('.menu__item-label');
  const bg = menu?.querySelector('.menu__bg');
  if (!menu || !label || !bg) return { measured: false };
  const labelStyle = getComputedStyle(label);
  const bgStyle = getComputedStyle(bg);
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (value) => (value.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
  const l1 = luminance(parse(labelStyle.color));
  const l2 = luminance(parse(bgStyle.backgroundColor));
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return {
    measured: true,
    ratio: Math.round(ratio * 100) / 100,
    label: labelStyle.color,
    background: bgStyle.backgroundColor,
    curtain: getComputedStyle(menu).className,
  };
});
check(
  'the menu is readable on its curtain (contrast ≥ 7:1)',
  menuContrast.measured && menuContrast.ratio >= 7,
  JSON.stringify(menuContrast),
);
await page.screenshot({ path: join(shots, 'phone-03-menu.png') });
await page.evaluate(() =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
);
await new Promise((r) => setTimeout(r, 900));

// The type-on-a-path demo must actually animate.
await page.setViewport({ width: 1440, height: 900 });
const typePath = await page.evaluate(async () => {
  const node = document.querySelector('.typepath__text textPath');
  if (!node) return { found: false };
  const first = node.getAttribute('startOffset');
  await new Promise((r) => setTimeout(r, 900));
  const second = node.getAttribute('startOffset');
  return { found: true, first, second, moved: first !== second };
});
check('the type-on-a-path demo animates', typePath.found && typePath.moved, JSON.stringify(typePath));

/*
 * The enquiry is a three-step wizard whose two radio questions must be
 * independent groups. If they share a name, answering the scope question
 * clears the project question and the visitor silently loses their answer.
 */
const enquiry = await page.evaluate(async () => {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  await new Promise((r) => setTimeout(r, 400));
  const typeInputs = Array.from(document.querySelectorAll('[data-enquiry-type] input'));
  const scopeInputs = Array.from(document.querySelectorAll('[data-enquiry-scope] input'));
  const names = [...new Set([...typeInputs, ...scopeInputs].map((input) => input.name))];
  typeInputs[0]?.click();
  await new Promise((r) => setTimeout(r, 150));
  const typeChecked = typeInputs.filter((input) => input.checked).length;
  scopeInputs[0]?.click();
  await new Promise((r) => setTimeout(r, 150));
  return {
    groups: names.length,
    names,
    typeCheckedAfterPickingType: typeChecked,
    typeStillChecked: typeInputs[0]?.checked ?? false,
    scopeChecked: scopeInputs[0]?.checked ?? false,
    radioBox: typeInputs[0] ? Math.round(typeInputs[0].getBoundingClientRect().width) : 0,
  };
});
check(
  'the enquiry has two independent radio groups',
  enquiry.groups === 2 && enquiry.names.every((name) => name.length > 0),
  JSON.stringify(enquiry),
);
check(
  'answering the scope question does not clear the project question',
  enquiry.typeStillChecked && enquiry.scopeChecked,
  JSON.stringify(enquiry),
);
check(
  'the radio control is not stretched across its card',
  enquiry.radioBox > 0 && enquiry.radioBox <= 24,
  `${enquiry.radioBox}px`,
);

/*
 * The feedback layer.
 *
 * Every action on this site is supposed to register. These checks assert
 * that the registration actually happens — that a copy draws its tick, that
 * a choice traces itself, that a rejected field rules itself, and that the
 * enquiry's steps travel rather than blinking.
 */
const feedback = await page.evaluate(async () => {
  const out = {};

  // --- a copy registers, and leaves a tick behind -----------------------
  const copyTarget = document.querySelector('[data-copy]');
  if (copyTarget) {
    copyTarget.click();
    await new Promise((r) => setTimeout(r, 420));
    const tick = copyTarget.querySelector('[data-feedback-tick]');
    out.copyState = copyTarget.dataset.feedbackState ?? null;
    out.copyHasTick = Boolean(tick);
    out.copyTickPath = tick?.querySelector('path')?.getAttribute('d') ?? null;
  }

  // --- a choice traces itself -------------------------------------------
  const choice = document.querySelector('[data-enquiry-type] .enquiry__choice');
  if (choice) {
    choice.querySelector('input')?.click();
    await new Promise((r) => setTimeout(r, 420));
    out.choiceTraced = choice.classList.contains('is-registered');
    const trace = getComputedStyle(choice, '::after');
    out.choiceTraceWidth = trace.width;
  }

  // --- a rejected field rules itself -------------------------------------
  /*
   * The rule is drawn with a keyframe animation, and a browser normalises
   * an identity transform to "none", so the computed transform is not a
   * reliable signal. The *geometry* is: the rule must exist, be two
   * pixels tall, and be painted in the error colour.
   */
  const nameInput = document.querySelector('#enquiry-name');
  const errorNode = document.querySelector('[data-error-for="name"]');
  if (nameInput && errorNode) {
    const owner = nameInput.closest('.field');
    owner?.classList.add('is-rejected');
    await new Promise((r) => setTimeout(r, 320));
    const rule = getComputedStyle(owner, '::after');
    out.rejectHeight = rule.height;
    out.rejectBackground = rule.backgroundColor;
    out.rejectHasContent = rule.content;
  }

  // --- the enquiry steps travel ------------------------------------------
  const steps = Array.from(document.querySelectorAll('.enquiry__step'));
  const next = document.querySelector('[data-enquiry-next]');
  if (steps.length > 1 && next) {
    const first = steps[0];
    const second = steps[1];
    second.hidden = true;
    next.click();
    await new Promise((r) => setTimeout(r, 90));
    /* mid-travel: the incoming step must already have a transform */
    const mid = getComputedStyle(second).transform;
    await new Promise((r) => setTimeout(r, 700));
    out.stepTravelled = mid !== 'none' && second.hidden === false;
    out.stepFinalOpacity = Number(getComputedStyle(second).opacity);
    out.firstHidden = first.hidden;
  }

  // --- nothing in the feedback layer bounces -----------------------------
  out.bounceCurves = Array.from(
    document.querySelectorAll('[data-writing], .is-confirmed, .is-registered'),
  ).filter((node) => {
    const style = getComputedStyle(node);
    return /cubic-bezier\(0\.34,\s*1\.56/.test(style.transitionTimingFunction);
  }).length;

  return out;
});

check(
  'a copy draws its tick and leaves it behind',
  feedback.copyState === 'confirmed' && feedback.copyHasTick && Boolean(feedback.copyTickPath),
  JSON.stringify(feedback),
);
check(
  'a choice traces itself',
  feedback.choiceTraced === true && feedback.choiceTraceWidth !== '0px',
  JSON.stringify(feedback),
);
check(
  'a rejected field rules itself',
  feedback.rejectHeight === '2px' &&
    feedback.rejectBackground !== 'rgba(0, 0, 0, 0)' &&
    feedback.rejectHasContent !== 'none',
  JSON.stringify(feedback),
);
check(
  'the enquiry steps travel rather than blink',
  feedback.stepTravelled === true && feedback.stepFinalOpacity === 1,
  JSON.stringify(feedback),
);
check(
  'the feedback layer uses no bounce curve',
  feedback.bounceCurves === 0,
  JSON.stringify(feedback),
);

check('no uncaught errors during interaction', interactionErrors.length === 0, interactionErrors.slice(0, 3).join(' | '));

await page.close();

/*
 * The "I want this" button on a laboratory card.
 *
 * It used to be inert on the laboratory page: the handler looked for a
 * brief field that the laboratory does not have, found nothing, and
 * returned without a sound. A control that does nothing is worse than no
 * control at all, so this asserts that the acknowledgement strip opens and
 * carries the reference.
 */
/*
 * The laboratory page is checked on its own, after the home page has been
 * closed. The two together mount 149 demonstrations, a WebGL field and two
 * Three.js scenes in a software rasteriser, and the home page's own rAF
 * loops starve the laboratory page's event loop badly enough that a
 * `networkidle2` wait can time out. One page at a time is also how a
 * visitor actually meets them.
 */
const labPage = await browser.newPage();
await labPage.setViewport({ width: 1440, height: 900 });
const labErrors = [];
labPage.on('pageerror', (error) => labErrors.push(String(error.message ?? error).slice(0, 200)));
labPage.on('console', (message) => {
  if (message.type() === 'error') labErrors.push(message.text().slice(0, 200));
});
await labPage.goto(`${url}lab/`, { waitUntil: 'domcontentloaded', timeout: 90000 });
await labPage
  .waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', { timeout: 30000 })
  .catch(() => {});
await labPage.waitForFunction(() => !document.getElementById('boot'), { timeout: 20000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 1200));

const want = await labPage.evaluate(async () => {
  const button = document.querySelector('.fx-card__want');
  if (!button) return { found: false };
  button.click();
  await new Promise((r) => setTimeout(r, 700));
  const card = button.closest('.fx-card');
  const strip = card?.querySelector('.fx-card__ack');
  const open = card?.querySelector('.fx-card__ack .fx-card__want');
  return {
    found: true,
    stripOpen: strip ? !strip.hidden : false,
    stripText: strip?.querySelector('.fx-card__ack-text')?.textContent ?? '',
    carriesReference: /DENVUP-T\d{3}/.test(open?.getAttribute('href') ?? ''),
    state: button.dataset.feedbackState ?? null,
  };
});

check(
  '"I want this" is not inert — it acknowledges and carries the reference',
  want.found &&
    want.stripOpen === true &&
    want.carriesReference === true &&
    want.state === 'confirmed' &&
    /DENVUP-T\d{3}/.test(want.stripText),
  JSON.stringify(want),
);
check('the laboratory page raises no errors', labErrors.length === 0, labErrors.slice(0, 3).join(' | '));

/* --- the whole catalogue is reachable ---------------------------------- //
 *
 * The Effects Library holds 149 demonstrations. For a long time the grid
 * was taken out of the flow by a rule that belonged to a transition
 * overlay of the same name, which held it at the height of the section
 * and clipped the rest: 147 of the 149 demonstrations could never be
 * reached, and nothing else in this check noticed.
 *
 * So the check now says what it means — the last demonstration has to be
 * reachable — and the page has to be tall enough to hold its own
 * content.
 */
const reach = await labPage.evaluate(async () => {
  const cards = Array.from(document.querySelectorAll('.fx-card'));
  const last = cards[cards.length - 1];
  if (!last) return { cards: 0 };

  /*
   * The scroll is animated by the smooth-scroll engine, and it is
   * twenty-eight thousand pixels of catalogue away, so the position is
   * asked for until the card is actually on screen rather than assumed
   * after a fixed delay.
   */
  let rect = last.getBoundingClientRect();
  for (let attempt = 0; attempt < 25; attempt += 1) {
    last.scrollIntoView({ behavior: 'auto', block: 'center' });
    await new Promise((r) => setTimeout(r, 400));
    rect = last.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) break;
  }
  const visible = rect.top < window.innerHeight && rect.bottom > 0;

  /*
   * Nothing on the page may sit below the point the page can scroll to.
   * Content outside the scrollable area is content the visitor cannot
   * reach, however good it looks.
   */
  const limit = document.documentElement.scrollHeight;
  const strays = [];
  document.querySelectorAll('main *').forEach((node) => {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    if (style.position === 'fixed') return;
    const box = node.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) return;
    if (box.bottom + window.scrollY > limit + 4) {
      strays.push(`${node.tagName.toLowerCase()}.${String(node.className).slice(0, 40)}`);
    }
  });

  return {
    cards: cards.length,
    lastVisible: visible,
    lastTop: Math.round(rect.top),
    limit,
    strays: strays.slice(0, 4),
    strayCount: strays.length,
  };
});

check(
  'every demonstration in the Effects Library is reachable',
  reach.cards > 100 && reach.lastVisible === true,
  JSON.stringify(reach),
);
check(
  'nothing on the laboratory page sits outside the scrollable area',
  reach.strayCount === 0,
  JSON.stringify(reach.strays),
);
await labPage.close();


/* ---------------------------------------------------------------------- //
 * The feedback layer, the search, the form and the deep links
 * ---------------------------------------------------------------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error.message ?? error).slice(0, 200)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text().slice(0, 200));
  });

  /* --- a service page links to a technique, and the link lands --------- */
  await page.goto(`${url}services/automation/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page
    .waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', { timeout: 30000 })
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));

  const serviceLinks = await page.$$eval('.svc-demos__link', (nodes) =>
    nodes.map((node) => node.getAttribute('href')),
  );
  check(
    'every technique on a service page has a link that can be resolved',
    serviceLinks.length === 4 && serviceLinks.every((href) => Boolean(href)),
    JSON.stringify(serviceLinks),
  );

  const demoLink = serviceLinks.find((href) => href && href.startsWith('/lab/'));
  if (demoLink) {
    /* the technique list is below the fold; scroll first, then click */
    await page.evaluate((href) => {
      document.querySelector(`.svc-demos__link[href="${href}"]`)?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, demoLink);
    await new Promise((r) => setTimeout(r, 1600));
    await page.click(`.svc-demos__link[href="${demoLink}"]`);
    await new Promise((r) => setTimeout(r, 3500));
    const landed = await page.evaluate(() => {
      const hash = window.location.hash;
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      const rect = target?.getBoundingClientRect();
      return {
        hash: window.location.hash,
        found: Boolean(target),
        top: rect ? Math.round(rect.top) : null,
      };
    });
    check(
      'a deep link to a technique lands on the technique',
      landed.found === true && landed.top !== null && landed.top < 200,
      JSON.stringify(landed),
    );
  }

  /* --- the enquiry fields report that they hold something -------------- */
  await page.goto(`${url}contact/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page
    .waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', { timeout: 30000 })
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    document.querySelector('[data-enquiry-type] .enquiry__choice')?.click();
    document.querySelector('[data-enquiry-next]')?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.evaluate(() => {
    document.querySelector('[data-enquiry-scope] .enquiry__choice')?.click();
    document.querySelector('[data-enquiry-next]')?.click();
  });
  await new Promise((r) => setTimeout(r, 900));

  await page.type('#enquiry-name', 'Priya', { delay: 20 });
  await page.type('#enquiry-email', 'not-an-address', { delay: 15 });
  await page.type('#enquiry-brief', 'A site that answers every action.', { delay: 10 });
  await new Promise((r) => setTimeout(r, 400));

  const fields = await page.evaluate(() => {
    const read = (id) => {
      const field = document.getElementById(id);
      return {
        state: field?.dataset.fieldState ?? null,
        tick: Boolean(field?.closest('.field')?.querySelector('.field__mark [data-feedback-tick]')),
      };
    };
    return {
      name: read('enquiry-name'),
      email: read('enquiry-email'),
      brief: read('enquiry-brief'),
      count: document.querySelector('.field__count')?.textContent ?? '',
    };
  });

  check(
    'a written field reports that it is filled',
    fields.name.state === 'filled' && fields.name.tick === true,
    JSON.stringify(fields.name),
  );
  check(
    'an address that does not read like an address is not reported as filled',
    fields.email.state === 'writing' && fields.email.tick === false,
    JSON.stringify(fields.email),
  );
  check(
    'the brief reports its length and that it is filled',
    fields.brief.state === 'filled' && fields.brief.tick === true && /\d+ words/.test(fields.count),
    JSON.stringify(fields.brief),
  );

  /* --- the FAQ search says what it found ------------------------------- */
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page
    .waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', { timeout: 30000 })
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));

  const faqAtRest = await page.evaluate(() => {
    const box = document.querySelector('[data-faq-search="faq"]')?.closest('.faq__search');
    return {
      count: box?.querySelector('.faq__count')?.textContent ?? '',
      total: document.querySelectorAll('.faq__item').length,
    };
  });
  check(
    'the FAQ search reports how many questions there are',
    faqAtRest.total > 0 && /\d+ questions/.test(faqAtRest.count),
    JSON.stringify(faqAtRest),
  );

  await page.type('[data-faq-search="faq"]', 'zzzzqqq', { delay: 20 });
  await new Promise((r) => setTimeout(r, 400));
  const faqEmpty = await page.evaluate(() => {
    const empty = document.querySelector('.faq__empty');
    return {
      hidden: empty?.hidden ?? null,
      text: empty?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      actions: Array.from(empty?.querySelectorAll('button, a') ?? []).map((n) => n.textContent.trim()),
    };
  });
  check(
    'the FAQ search says when it finds nothing, and offers a way out',
    faqEmpty.hidden === false &&
      /No question matches/.test(faqEmpty.text) &&
      faqEmpty.actions.some((label) => /Clear the search/.test(label)),
    JSON.stringify(faqEmpty),
  );

  /*
   * The empty state sits below the fold of a sixteen-chapter page, and
   * the smooth-scroll engine animates the movement, so the click is
   * preceded by a scroll and a wait. Puppeteer's own scroll-into-view is
   * not enough, because the page keeps moving after it has measured.
   */
  await page.evaluate(() => {
    document.querySelector('.faq__empty-actions button')?.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1600));
  await page.click('.faq__empty-actions button');
  await new Promise((r) => setTimeout(r, 400));
  const faqCleared = await page.evaluate(() => ({
    value: document.querySelector('[data-faq-search="faq"]')?.value ?? '',
    visible: Array.from(document.querySelectorAll('.faq__item')).filter((i) => !i.hidden).length,
    emptyHidden: document.querySelector('.faq__empty')?.hidden ?? null,
  }));
  check(
    'clearing the FAQ search brings every question back',
    faqCleared.value === '' && faqCleared.visible === faqAtRest.total && faqCleared.emptyHidden === true,
    JSON.stringify(faqCleared),
  );

  /* --- the technique library filters without rebuilding ---------------- */
  await page.evaluate(() => document.querySelector('[data-library-grid]')?.scrollIntoView({ block: 'center' }));
  await new Promise((r) => setTimeout(r, 1200));
  const library = await page.evaluate(async () => {
    const grid = document.querySelector('[data-library-grid]');
    const search = document.querySelector('[data-library-search]');
    if (!grid || !search) return { found: false };
    const first = grid.querySelector('.library__card');
    const before = grid.children.length;
    search.value = 'magnetic';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => requestAnimationFrame(r));
    const after = grid.children.length;
    const same = grid.querySelector('.library__card') === first;
    let visible = 0;
    grid.querySelectorAll('.library__card').forEach((card) => {
      if (!card.hidden) visible += 1;
    });
    return {
      found: true,
      before,
      after,
      same,
      visible,
      count: document.querySelector('[data-library-count]')?.textContent ?? '',
    };
  });
  check(
    'the technique library filters without rebuilding its cards',
    library.found === true &&
      library.before === library.after &&
      library.same === true &&
      library.visible > 0 &&
      /\d+ of \d+ techniques/.test(library.count),
    JSON.stringify(library),
  );

  check('the feedback checks raise no errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.close();
}

await browser.close();
if (server && !server.killed) server.kill('SIGTERM');

writeFileSync(join(shots, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(`\n${checks - failures}/${checks} checks passed.`);
if (failures) {
  console.log('Browser check FAILED.');
  process.exit(1);
}
console.log('Browser check passed. Screenshots are in screenshots/.');
process.exit(0);
