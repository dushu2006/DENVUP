/**
 * Does the custom cursor stay visible on every ground?
 *
 * Headless Chromium reports `hover: none; pointer: coarse`, so the real cursor
 * module would refuse to mount. A shim overrides *only* that media query before
 * the page scripts run; everything else — mount, pointermove probe, adaptive
 * ink, CSS variables — is the production path.
 *
 * The ground is not taken on trust: for flat backgrounds the painted ancestor
 * is composited (alpha included), and for images the pixel under the pointer is
 * drawn into a 1×1 canvas and composited over the card behind, which is what a
 * visitor actually sees. The ring's border colour is then measured against it.
 *
 * A stop is a failure below 3:1 — WCAG 1.4.11 for a non-text indicator.
 */
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { launchBrowser } from './launch.mjs';

const PAGE = process.env.DENVUP_URL ?? 'http://127.0.0.1:4173/';
const SHOTS = '.browser/shots';

const linear = (channel) => {
  const v = channel / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};

const { browser, page } = await launchBrowser({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => {
  const real = window.matchMedia.bind(window);
  window.matchMedia = (query) =>
    query.includes('hover: hover') && query.includes('pointer: fine')
      ? { matches: true, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }
      : real(query);
});

const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
await page.goto(PAGE, { waitUntil: 'networkidle0' });
await page.mouse.move(720, 450);
await new Promise((resolve) => setTimeout(resolve, 300));

const mount = await page.evaluate(() => ({
  mode: document.documentElement.dataset.cursor,
  ring: Boolean(document.querySelector('[data-cursor-ring]')),
}));
if (mount.mode !== 'custom' || !mount.ring) {
  console.log(`FAIL  cursor did not mount (mode ${mount.mode}, ring ${mount.ring})`);
  await browser.close();
  process.exit(1);
}

/** Native smooth scrolling means scrollTo() is not finished when it returns. */
const settle = async () => {
  let previous = -1;
  let stable = 0;
  for (let i = 0; i < 40 && stable < 3; i += 1) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    stable = y === previous ? stable + 1 : 0;
    previous = y;
    if (stable < 3) await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return previous;
};

const read = () =>
  page.evaluate(() => {
    const parsable = (value) => {
      const nums = value.match(/[\d.]+/g)?.map(Number);
      if (!nums || nums.length < 3) return null;
      const scale = value.startsWith('color(') ? 255 : 1;
      return [nums[0] * scale, nums[1] * scale, nums[2] * scale, nums[3] ?? 1];
    };
    const ring = getComputedStyle(document.querySelector('[data-cursor-ring]')).borderColor;
    const top = document.elementFromPoint(720, 450);
    const layers = [];
    let node = top;
    while (node) {
      const colour = parsable(getComputedStyle(node).backgroundColor);
      if (colour && colour[3] > 0) {
        layers.push(colour);
        if (colour[3] >= 1) break;
      }
      node = node.parentElement;
    }
    // Flattened ground: bottom-up compositing of the ancestor stack.
    const ground = [255, 255, 255];
    for (const [r, g, b, a] of layers.slice().reverse()) {
      ground[0] = r * a + ground[0] * (1 - a);
      ground[1] = g * a + ground[1] * (1 - a);
      ground[2] = b * a + ground[2] * (1 - a);
    }
    // Images paint their own pixels; read the one under the pointer.
    let pixel = null;
    if (top instanceof HTMLImageElement && top.complete && top.naturalWidth) {
      try {
        const rect = top.getBoundingClientRect();
        const scale = Math.max(rect.width / top.naturalWidth, rect.height / top.naturalHeight);
        const drawnWidth = top.naturalWidth * scale;
        const drawnHeight = top.naturalHeight * scale;
        const u = (720 - rect.left - (rect.width - drawnWidth) / 2) / drawnWidth;
        const v = (450 - rect.top - (rect.height - drawnHeight) / 2) / drawnHeight;
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d');
        context.drawImage(top, Math.max(0, u * top.naturalWidth - 8), Math.max(0, v * top.naturalHeight - 8), 16, 16, 0, 0, 1, 1);
        const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
        const a = alpha / 255;
        let behind = [255, 255, 255];
        let parent = top.parentElement;
        while (parent) {
          const colour = parsable(getComputedStyle(parent).backgroundColor);
          if (colour && colour[3] >= 0.5) { behind = colour.slice(0, 3); break; }
          parent = parent.parentElement;
        }
        pixel = [r * a + behind[0] * (1 - a), g * a + behind[1] * (1 - a), b * a + behind[2] * (1 - a)];
      } catch {
        pixel = null; // unreadable image: the report says so rather than guessing
      }
    }
    return {
      ink: document.documentElement.dataset.cursorInk ?? 'scene',
      ring: parsable(ring).slice(0, 3),
      ground: pixel ?? ground,
      unreadable: top instanceof HTMLImageElement && pixel === null,
      where: top ? `${top.tagName.toLowerCase()}.${String(top.className || '').split(' ')[0]}` : '',
      y: Math.round(window.scrollY),
    };
  });

mkdirSync(SHOTS, { recursive: true });
const height = await page.evaluate(() => document.documentElement.scrollHeight);
const failures = [];
let lowest = { ratio: Infinity };

for (let y = 0; y < height; y += 450) {
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await settle();
  await new Promise((resolve) => setTimeout(resolve, 160)); // probe debounce is 90 ms
  const afterScroll = await read();
  await page.mouse.move(719, 449);
  await page.mouse.move(720, 450);
  await new Promise((resolve) => setTimeout(resolve, 220));
  const afterMove = await read();

  for (const [phase, sample] of [['scroll', afterScroll], ['move', afterMove]]) {
    const measured = Number(ratio(sample.ring, sample.ground).toFixed(2));
    if (measured < lowest.ratio) lowest = { ratio: measured, ...sample, phase };
    if (measured < 3 || sample.unreadable) {
      failures.push({ phase, measured, ...sample });
    }
  }
}

for (const [name, y] of [['orange', 1350], ['glow-image', 8550], ['demo-canvas', 15300], ['light-form', 20700]]) {
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await settle();
  await page.mouse.move(719, 449);
  await page.mouse.move(720, 450);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await sharp(await page.screenshot()).extract({ left: 560, top: 330, width: 340, height: 240 }).toFile(`${SHOTS}/cursor-${name}.png`);
}

for (const failure of failures) {
  console.log(`FAIL  ${failure.phase} y ${failure.y}: ${failure.measured}:1 over ${failure.where}`);
}
console.log(`      lowest measured ${lowest.ratio}:1 over ${lowest.where} (${lowest.phase})`);
console.log(`      page errors: ${errors.length}`);
console.log(`\n${failures.length === 0 && errors.length === 0 ? 'PASS' : 'FAIL'}  cursor ink — ${height} px, ${Math.ceil(height / 450)} stops × 2 phases`);

await browser.close();
process.exit(failures.length === 0 && errors.length === 0 ? 0 : 1);
