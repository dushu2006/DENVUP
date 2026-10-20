/**
 * Real-browser acceptance checks.
 *
 * Usage: node scripts/browser/run.mjs [--base http://127.0.0.1:4173]
 *
 * For every route it records: HTTP status, console and page errors, horizontal
 * overflow at each width, images that failed to decode, heading structure, and
 * axe-core violations (colour-contrast disabled: a headless canvas cannot model
 * text over the stage). It also exercises soft navigation and reduced motion,
 * and writes screenshots to .browser/shots/.
 *
 * A result is only "PASS" when the assertion actually ran. Anything skipped is
 * printed as NOT PERFORMED.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './launch.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const baseArg = process.argv.indexOf('--base');
const BASE = baseArg > -1 ? process.argv[baseArg + 1] : 'http://127.0.0.1:4173';

const ROUTES = [
  '/', '/services', '/services/web-design', '/services/ai-solutions', '/services/integrations',
  '/services/interactive', '/services/automation', '/lab', '/concepts', '/studio', '/pricing',
  '/contact', '/privacy', '/terms', '/404',
];

const WIDTHS = [360, 390, 768, 1024, 1280, 1536, 1920];
const results = { base: BASE, started: new Date().toISOString(), routes: [], softNav: null, reduced: null, axe: {} };

async function collect(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const broken = [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src'));
    return {
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      h1Text: document.querySelector('h1')?.textContent?.trim().slice(0, 70) ?? '',
      docWidth: html.scrollWidth,
      viewWidth: window.innerWidth,
      brokenImages: broken,
      scrolled: window.scrollY,
      navCurrent: document.querySelectorAll('[aria-current="page"]').length,
      mainChildren: document.querySelector('[data-route-main]')?.children.length ?? 0,
    };
  });
}

async function axe(page) {
  await page.addScriptTag({ path: path.join(root, 'node_modules/axe-core/axe.min.js') });
  return page.evaluate(async () => {
    const res = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    return res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
  });
}

const { browser, page } = await launchBrowser({ width: 1440, height: 900 });
await page.setBypassCSP(true);
const consoleErrors = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
await mkdir(path.join(root, '.browser/shots'), { recursive: true });

for (const route of ROUTES) {
  const entry = { route, widths: {}, errors: [], axe: [] };
  const response = await page.goto(BASE + route, { waitUntil: 'networkidle2' });
  entry.status = response?.status() ?? 0;
  await new Promise((r) => setTimeout(r, 350));
  const info = await collect(page);
  entry.info = info;

  for (const width of WIDTHS) {
    await page.setViewport({ width, height: width < 500 ? 780 : 900 });
    await new Promise((r) => setTimeout(r, 120));
    const m = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      view: window.innerWidth,
      drift: document.documentElement.scrollWidth - window.innerWidth,
    }));
    entry.widths[width] = m;
  }
  await page.setViewport({ width: 1440, height: 900 });

  entry.axe = await axe(page);
  entry.consoleErrors = [...new Set(consoleErrors)];
  consoleErrors.length = 0;

  if (['/', '/services', '/lab', '/pricing', '/contact', '/services/web-design'].includes(route)) {
    const name = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
    await page.screenshot({ path: path.join(root, `.browser/shots/${name}.png`), fullPage: false });
    if (route === '/') {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.42));
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: path.join(root, '.browser/shots/home-mid.png') });
    }
  }
  results.routes.push(entry);
}

/* ---------------------------------------------------- soft navigation check */
{
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
  const before = await page.evaluate(() => ({
    stage: Boolean(document.querySelector('[data-scene-canvas]')),
    head: document.querySelector('[data-head]')?.getBoundingClientRect().top ?? null,
    main: document.querySelector('[data-route-main]')?.getAttribute('data-swap'),
  }));
  const nav = await page.evaluate(async () => {
    const started = performance.now();
    const link = document.createElement('a');
    link.href = '/services/web-design';
    document.body.append(link);
    link.click();
    // Wait for the main to change route.
    const target = '/services/web-design';
    for (let i = 0; i < 120; i++) {
      await new Promise((r) => setTimeout(r, 50));
      if (document.body.dataset.route === target) break;
    }
    const after = {
      route: document.body.dataset.route,
      title: document.title,
      ms: Math.round(performance.now() - started),
      stageAlive: Boolean(document.querySelector('[data-scene-canvas]')),
      sameCanvas: document.querySelector('[data-scene-canvas]')?.isConnected ?? false,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      focused: document.activeElement?.tagName ?? '',
      history: location.pathname,
    };
    link.remove();
    return after;
  });
  await page.goBack();
  await new Promise((r) => setTimeout(r, 1800));
  const back = await page.evaluate(() => ({ route: document.body.dataset.route, stage: Boolean(document.querySelector('[data-scene-canvas]')) }));
  results.softNav = { before, nav, back };
}

/* ------------------------------------------------------------ reduced motion */
{
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 300));
  const reduced = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('main section')].filter((s) => {
      const cs = getComputedStyle(s);
      return cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0;
    }).length;
    return {
      motion: document.documentElement.dataset.motion,
      sections: document.querySelectorAll('main section').length,
      hiddenSections: hidden,
      intro: Boolean(document.querySelector('.intro')),
      overlays: getComputedStyle(document.querySelector('main section'), '::after').content,
    };
  });
  results.reduced = reduced;
  await page.screenshot({ path: path.join(root, '.browser/shots/reduced-motion.png') });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
}

await browser.close();

await mkdir(path.join(root, '.browser'), { recursive: true });
await writeFile(path.join(root, '.browser/report.json'), JSON.stringify(results, null, 2));

/* --------------------------------------------------------------- the verdict */
let failures = 0;
const line = (ok, text) => { if (!ok) failures += 1; console.log(`${ok ? 'PASS' : 'FAIL'}  ${text}`); };

for (const r of results.routes) {
  const overflow = Object.entries(r.widths).filter(([, m]) => m.drift > 1);
  line(r.status === 200 || (r.route === '/404'), `${r.route} status ${r.status}`);
  line(r.info.h1 === 1, `${r.route} one h1 (${r.info.h1})`);
  line(overflow.length === 0, `${r.route} no horizontal overflow ${overflow.length ? JSON.stringify(overflow.map(([w, m]) => [w, m.drift])) : ''}`);
  line(r.info.brokenImages.length === 0, `${r.route} images decode ${r.info.brokenImages.length ? r.info.brokenImages.join(',') : ''}`);
  line(r.consoleErrors.length === 0, `${r.route} console clean ${r.consoleErrors.slice(0, 2).join(' | ')}`);
  line(r.axe.length === 0, `${r.route} axe ${r.axe.length ? r.axe.map((a) => `${a.id}(${a.nodes})`).join(',') : 'clean'}`);
}
line(results.softNav?.nav.route === '/services/web-design', `soft nav reached ${results.softNav?.nav.route} in ${results.softNav?.nav.ms}ms`);
line(results.softNav?.nav.stageAlive === true, 'stage canvas survived soft navigation');
line(results.softNav?.nav.focused === 'H1', `focus moved to the new h1 (${results.softNav?.nav.focused})`);
line(results.softNav?.back.route === '/', `back returned to ${results.softNav?.back.route}`);
line(results.reduced?.hiddenSections === 0, `reduced motion hides ${results.reduced?.hiddenSections} sections`);
line(results.reduced?.intro === false, 'reduced motion skips the intro');

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
console.log('report: .browser/report.json');
process.exitCode = failures === 0 ? 0 : 1;
