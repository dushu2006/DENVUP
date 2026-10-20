/**
 * Acceptance journey tests, in a real browser.
 *
 * These are the checks the brief names that the per-route suite does not cover:
 *   - a slow scroll down and back up the home page, asserting nothing stays
 *     hidden and every scroll-linked state reverses;
 *   - keyboard-only traversal;
 *   - every route reached by a real link click, forward and back, with the
 *     stage, header and cursor still alive;
 *   - the same journeys with View Transitions removed and with canvas disabled,
 *     proving the fallbacks are real rather than assumed;
 *   - touch emulation, proving the native cursor returns.
 *
 * Anything that cannot run is printed as NOT PERFORMED with the reason.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './launch.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const shots = path.join(root, '.browser/shots');
await mkdir(shots, { recursive: true });

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};
const skip = (name, reason) => {
  results.push({ name, pass: null, detail: reason });
  console.log(`NOT PERFORMED  ${name} — ${reason}`);
};

const { browser, page } = await launchBrowser({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

/* ------------------------------------------------- 1. slow scroll, both ways */
{
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));
  const height = await page.evaluate(() => document.body.scrollHeight);
  const states = [];
  for (let y = 0; y <= height; y += 500) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);
    await new Promise((r) => setTimeout(r, 90));
    if (y % 2500 === 0) {
      states.push(await page.evaluate((pos) => ({ pos, scene: document.documentElement.dataset.scene }), y));
    }
  }
  const atBottom = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('main section')].filter((s) => {
      const cs = getComputedStyle(s);
      return cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05;
    }).length;
    return { hidden, scrollY: window.scrollY, height: document.body.scrollHeight };
  });
  record('slow scroll down reaches the footer', atBottom.scrollY > 0 && atBottom.hidden === 0, `${atBottom.hidden} hidden sections`);

  for (let y = height; y >= 0; y -= 500) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);
    await new Promise((r) => setTimeout(r, 60));
  }
  // The step loop stops at the last multiple of 500, which is not necessarily 0.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 200));
  const back = await page.evaluate(() => ({ y: window.scrollY, scene: document.documentElement.dataset.scene }));
  record('slow scroll back returns to the top', back.y === 0, `scrollY ${back.y}`);
  record('scene reverses with the scroll', back.scene === states[0]?.scene, `top ${states[0]?.scene} → bottom → ${back.scene}`);
}

/* --------------------------------------------------------------- 2. anchors */
{
  // From part-way down the page, so "moves to" means something.
  await page.evaluate(() => window.scrollTo({ top: 2400, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 200));
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => document.querySelector('a[href="#main"]')?.click());
  // The anchor uses native smooth scrolling; wait for it to settle rather than
  // sampling mid-scroll.
  await page.waitForFunction(() => window.scrollY < 50, { timeout: 3000 }).catch(() => undefined);
  await new Promise((r) => setTimeout(r, 300));
  const after = await page.evaluate(() => ({
    y: window.scrollY,
    focusInsideMain: Boolean(document.activeElement && document.getElementById('main')?.contains(document.activeElement)),
    focusIsMain: document.activeElement?.id === 'main',
    focus: `${document.activeElement?.tagName}#${document.activeElement?.id ?? ''}`,
  }));
  const movedOrRefocused = after.y < 50;
  record(
    'skip link moves focus into the main content',
    after.focusInsideMain && movedOrRefocused,
    `y ${before} → ${after.y}, focus ${after.focus}`,
  );
}

/* -------------------------------------------------------- 3. keyboard only */
{
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: (document.activeElement?.textContent ?? '').slice(0, 30) }));
  record('first Tab reaches the skip link', first.text.toLowerCase().includes('skip'), `${first.tag} “${first.text}”`);

  const order = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 24) ?? ''));
  }
  const distinct = new Set(order).size;
  record('Tab order advances through distinct controls', distinct >= 6, `${distinct}/8 distinct`);

  const focusRing = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { outline: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow !== 'none' };
  });
  record('focused control has a visible outline', Boolean(focusRing && (focusRing.outline !== 'none' || focusRing.shadow)), JSON.stringify(focusRing));
}

/* --------------------------------------- 4. every route by click, and back */
{
  const pairs = [
    ['/', '/services'],
    ['/services', '/services/web-design'],
    ['/services/web-design', '/lab'],
    ['/lab', '/concepts'],
    ['/concepts', '/studio'],
    ['/studio', '/pricing'],
    ['/pricing', '/contact'],
    ['/contact', '/'],
  ];
  for (const [from, to] of pairs) {
    await page.goto(BASE + from, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 250));
    const clicked = await page.evaluate(async (target) => {
      const link = [...document.querySelectorAll('a[href]')].find((a) => new URL(a.href).pathname === target && !a.hash);
      if (!link) return false;
      link.click();
      for (let i = 0; i < 100; i++) {
        await new Promise((r) => setTimeout(r, 40));
        if (location.pathname === target && document.body.dataset.route === target) break;
      }
      return location.pathname === target;
    }, to);
    const alive = await page.evaluate(() => ({
      stage: Boolean(document.querySelector('[data-scene-canvas]')?.isConnected),
      head: Boolean(document.querySelector('[data-head]')?.isConnected),
      cursor: Boolean(document.querySelector('.cursor')?.isConnected),
      h1: Boolean(document.querySelector('h1')),
    }));
    record(`click ${from} → ${to}`, clicked && alive.stage && alive.head && alive.cursor, JSON.stringify(alive));
    await page.goBack();
    await new Promise((r) => setTimeout(r, 500));
    const back = await page.evaluate(() => ({ path: location.pathname, route: document.body.dataset.route || '' }));
    record(`back ${to} → ${from}`, back.path === from, JSON.stringify(back));
  }
}

/* ------------------------------------- 5. no View Transitions at all */
{
  await page.evaluateOnNewDocument(() => {
    // @ts-expect-error deliberate removal for the fallback test
    delete Document.prototype.startViewTransition;
    Object.defineProperty(document, 'startViewTransition', { value: undefined, configurable: true });
  });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 300));
  const r = await page.evaluate(async () => {
    const link = [...document.querySelectorAll('a[href="/pricing"]')][0];
    link?.click();
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 40));
      if (document.body.dataset.route === '/pricing') break;
    }
    return {
      supported: typeof document.startViewTransition === 'function',
      route: document.body.dataset.route,
      stage: Boolean(document.querySelector('[data-scene-canvas]')),
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 30),
    };
  });
  record('soft nav works with no View Transitions API', r.supported === false && r.route === '/pricing' && r.stage, JSON.stringify(r));
}

/* ---------------------------------------- 6. canvas unavailable / no WebGL */
{
  await page.evaluateOnNewDocument(() => {
    HTMLCanvasElement.prototype.getContext = function () {
      return null;
    };
  });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  const r = await page.evaluate(() => ({
    failed: document.documentElement.dataset.sceneFailed === 'true',
    text: (document.querySelector('h1')?.textContent ?? '').length > 0,
    sections: document.querySelectorAll('main section').length,
    bodyBg: getComputedStyle(document.body).backgroundColor,
  }));
  record('no-canvas fallback keeps the page readable', r.failed && r.text && r.sections > 10, JSON.stringify(r));
  await page.screenshot({ path: path.join(shots, 'fallback-no-canvas.png') });
}

/* ------------------------------------------------ 7. touch: native cursor */
{
  const touchPage = await browser.newPage();
  await touchPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await touchPage.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  const r = await touchPage.evaluate(() => ({
    cursor: document.documentElement.dataset.cursor,
    customHidden: getComputedStyle(document.querySelector('.cursor')).opacity === '0',
    pointer: getComputedStyle(document.body).cursor,
  }));
  record('touch device keeps the native cursor', r.cursor === 'native' && r.customHidden, JSON.stringify(r));
  await touchPage.screenshot({ path: path.join(shots, 'mobile-390.png') });
  await touchPage.close();
}

/* ------------------------------------------------------- 8. reduced motion */
{
  const rm = await browser.newPage();
  await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rm.setViewport({ width: 1440, height: 900 });
  await rm.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 500));
  const r = await rm.evaluate(() => {
    const hidden = [...document.querySelectorAll('main section')].filter((s) => {
      const cs = getComputedStyle(s);
      return cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05;
    }).length;
    const overlays = [...document.querySelectorAll('main section')].filter(
      (s) => getComputedStyle(s, '::after').content !== 'none',
    ).length;
    return { motion: document.documentElement.dataset.motion, hidden, overlays, words: document.body.innerText.length };
  });
  record('reduced motion keeps all content and draws no hand-off plates', r.hidden === 0 && r.overlays === 0 && r.words > 3000, JSON.stringify(r));
  await rm.screenshot({ path: path.join(shots, 'reduced-motion.png'), fullPage: false });
  await rm.close();
}

record('no uncaught page errors during the journeys', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => r.pass === false).length;
const skipped = results.filter((r) => r.pass === null).length;
console.log(`\n${results.length - failed - skipped} passed, ${failed} failed, ${skipped} not performed`);
process.exitCode = failed === 0 ? 0 : 1;
