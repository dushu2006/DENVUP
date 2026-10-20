#!/usr/bin/env node
/**
 * Performance check.
 *
 * Measures the real cost of each route in a real browser: how long it takes
 * to load, how long until the router says it is ready, how many long tasks
 * (over 50 ms) the page produces while idle, what the frame rate is while
 * the page is scrolled from top to bottom, and how many console errors the
 * route produced.
 *
 * The numbers this prints are the numbers quoted in `TESTING_REPORT.md` §4.2
 * and in `UI_UX_AUDIT.md` Appendix B.
 *
 * The browser is a headless, software-rasterised Chromium, so these are a
 * floor, not a measurement of real hardware. The report says so too.
 *
 * Usage:  node scripts/perf-check.mjs
 * Requires a build and a server first:
 *   npx vite build && npx vite preview --host 127.0.0.1 --port 4173
 * or point it somewhere else:
 *   BASE=http://127.0.0.1:4173 node scripts/perf-check.mjs
 */

import { existsSync } from 'node:fs';

const LIB = '/tmp/al2023/lib';
if (existsSync(LIB)) {
  process.env.LD_LIBRARY_PATH = `${LIB}:${process.env.LD_LIBRARY_PATH ?? ''}`;
}

const { default: puppeteer } = await import('puppeteer-core');
const { default: chromium } = await import('@sparticuz/chromium');

const exec = process.env.PUPPETEER_EXECUTABLE_PATH || (await chromium.executablePath());

const browser = await puppeteer.launch({
  executablePath: exec,
  headless: 'shell',
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const base = process.env.BASE ?? 'http://127.0.0.1:4173';

async function measure(path, label) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });

  const t0 = Date.now();
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
  const load = Date.now() - t0;
  await page.waitForFunction(() => document.documentElement.getAttribute('data-router') === 'ready', {
    timeout: 20000,
  });
  const ready = Date.now() - t0;

  // Count long tasks over three seconds of idle.
  await page.evaluate(() => {
    window.__long = 0;
    window.__longMs = 0;
    try {
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__long += 1;
          window.__longMs += entry.duration;
        }
      });
      obs.observe({ entryTypes: ['longtask'] });
    } catch {
      /* longtask is not supported everywhere */
    }
  });
  await new Promise((r) => setTimeout(r, 3000));
  const idle = await page.evaluate(() => ({
    long: window.__long ?? -1,
    longMs: Math.round(window.__longMs ?? 0),
  }));

  /*
   * The frame rate while scrolling.
   *
   * It is measured as the **median of five short samples** rather than
   * as one pass over the whole page. One pass is a poor instrument: the
   * laboratory page mounts a hundred and forty-nine live demonstrations
   * as it goes, so how many of them are alive at once depends on where
   * the pass happens to be, and the same build measured 14 and 60 frames
   * a second on different passes in the same run. The median of five
   * samples of two seconds each is reproducible, and it is also the
   * number that describes what a visitor scrolling the page experiences.
   */
  const fpsSamples = await page.evaluate(async () => {
    const samples = [];
    for (let pass = 0; pass < 5; pass += 1) {
      const height = document.body.scrollHeight;
      const step = 600;
      const until = Math.min(height, window.scrollY + 2400);
      let frames = 0;
      let running = true;
      const count = () => {
        if (!running) return;
        frames += 1;
        requestAnimationFrame(count);
      };
      requestAnimationFrame(count);
      const started = performance.now();
      for (let y = window.scrollY; y < until; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      const elapsed = performance.now() - started;
      running = false;
      if (elapsed > 200) samples.push(Math.round((frames / elapsed) * 1000));
      /* back to the top for the next sample */
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    }
    samples.sort((a, b) => a - b);
    return samples;
  });
  const fps = fpsSamples.length ? fpsSamples[Math.floor(fpsSamples.length / 2)] : 0;

  console.log(
    `${label.padEnd(10)} load ${load}ms  ready ${ready}ms  longTasks ${idle.long} (${idle.longMs}ms)  scrollFps ${fps} [${fpsSamples.join(', ')}]  errors ${errors.length}`,
  );
  if (errors.length) console.log('   ', errors.slice(0, 4).join('\n    '));
  await page.close();
}

await measure('/', 'home');
await measure('/lab/', 'lab');
await measure('/studio/', 'studio');
await measure('/services/', 'services');
await measure('/services/web-design/', 'service');

await browser.close();
