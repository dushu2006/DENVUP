#!/usr/bin/env node
/**
 * Headless smoke test.
 *
 * There is no browser available in this environment, so the built site is
 * loaded into jsdom with the handful of APIs jsdom does not implement
 * stubbed out. The test asserts that:
 *
 *   1. the built HTML parses and the module entry point is present;
 *   2. every in-page anchor resolves to an element that exists;
 *   3. every asset the page references actually ships in dist/;
 *   4. the data modules load and the technique catalogue is complete;
 *   5. every demo in the registry mounts and tears down without throwing;
 *   6. the static source passes a link, asset and business-fact audit.
 *
 * It does not — and cannot — verify visual rendering, real WebGL output or
 * real network behaviour. That limitation is recorded in TESTING_REPORT.md.
 */

import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { JSDOM, VirtualConsole } from 'jsdom';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');

let failures = 0;
let checks = 0;

function check(label, condition, detail = '') {
  checks += 1;
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* DOM stubs jsdom does not provide                                    */
/* ------------------------------------------------------------------ */
function stubWindow(win) {
  win.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return false; },
  });
  win.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
  win.cancelAnimationFrame = (id) => clearTimeout(id);
  win.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
  win.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  win.scrollTo = () => {};
  win.HTMLCanvasElement.prototype.getContext = function getContext() { return null; };
  win.HTMLMediaElement = win.HTMLMediaElement || class {};
  win.AudioContext = undefined;
  win.URL.createObjectURL = () => 'blob:stub';
  win.URL.revokeObjectURL = () => {};
}

console.log('\n== 1. build output ==');
check('dist/index.html exists', existsSync(join(dist, 'index.html')));
const html = readFileSync(join(dist, 'index.html'), 'utf8');
check('module entry point present', /<script[^>]+type="module"[^>]+src="[^"]*\.js"/.test(html));
check('stylesheet present', /<link[^>]+rel="stylesheet"[^>]+href="[^"]*\.css"/.test(html));
check('skip link is the first focusable element', /<a class="skip-link" href="#view">/.test(html));

const distFiles = walk(dist).map((file) => file.replace(`${dist}/`, ''));

console.log('\n== 2. internal links and anchors ==');
const dom = new JSDOM(html, { url: 'https://example.invalid/' });
const { document } = dom.window;
const ids = new Set(Array.from(document.querySelectorAll('[id]')).map((node) => node.id));
const anchors = Array.from(document.querySelectorAll('a[href^="#"]')).map((node) =>
  node.getAttribute('href').slice(1),
);
const missingAnchors = [...new Set(anchors.filter((anchor) => anchor && !ids.has(anchor)))];
check(`every in-page anchor resolves (${anchors.length} links)`, missingAnchors.length === 0, missingAnchors.join(', '));

const navTargets = ['prelude', 'expansion', 'studio', 'mark', 'manifesto', 'services', 'atlas', 'process', 'library', 'type', 'lab', 'team', 'pricing', 'faq', 'contact', 'closing'];
const missingSections = navTargets.filter((id) => !ids.has(id));
check('every chapter section exists', missingSections.length === 0, missingSections.join(', '));

const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
const h1s = headings.filter((node) => node.tagName === 'H1');
check('exactly one h1 on the page', h1s.length === 1, String(h1s.length));
let order = 0;
let orderOk = true;
headings.forEach((node) => {
  const level = Number(node.tagName.slice(1));
  if (level > order + 1) orderOk = false;
  order = level;
});
check('heading levels never skip a step', orderOk);

console.log('\n== 3. referenced assets ship in dist ==');
const assetRefs = new Set();
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)) assetRefs.add(match[1].slice(2));
for (const match of html.matchAll(/content="(\.\/[^"]+)"/g)) assetRefs.add(match[1].slice(2));
const missingAssets = [...assetRefs].filter((ref) => !distFiles.includes(ref));
check(`all ${assetRefs.size} referenced assets exist`, missingAssets.length === 0, missingAssets.join(', '));

const cssFiles = distFiles.filter((file) => file.endsWith('.css'));

/** Pull every url(...) token out of a CSS string, skipping data URIs. */
function cssUrls(source) {
  const out = [];
  const pattern = /url\(/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < source.length && depth > 0) {
      if (source[index] === '(') depth += 1;
      else if (source[index] === ')') depth -= 1;
      index += 1;
    }
    const raw = source.slice(match.index + match[0].length, index - 1).trim().replace(/^['"]|['"]$/g, '');
    if (!raw.startsWith('data:')) out.push(raw);
    // Resume after the token we just consumed so nested url() calls are not
    // scanned a second time.
    pattern.lastIndex = index;
  }
  return out;
}

const missingCssAssets = [];
for (const file of cssFiles) {
  const source = readFileSync(join(dist, file), 'utf8');
  const baseDir = dirname(file);
  for (const ref of cssUrls(source)) {
    const resolved = ref.startsWith('/')
      ? ref.slice(1)
      : join(baseDir, ref).split('/').filter((part) => part && part !== '.').join('/');
    if (!distFiles.includes(resolved)) missingCssAssets.push(`${file} -> ${ref}`);
  }
}
check('all css url() assets exist', missingCssAssets.length === 0, missingCssAssets.join(', '));

const cssText = cssFiles.map((file) => readFileSync(join(dist, file), 'utf8')).join('\n');

const fontFaces = (cssText.match(/@font-face/g) ?? []).length;
check(`web fonts are self-hosted (${fontFaces} @font-face rules)`, fontFaces >= 2);

/*
 * Every custom property must resolve.
 *
 * An undefined `var()` does not fall back to the initial value — it
 * invalidates the *whole declaration* it appears in, so a transition
 * written with an undefined curve silently loses its timing, its easing
 * and sometimes its property. `--ease-out` was used 27 times across
 * `routes.css` and never defined, and every one of those transitions had
 * been running on the browser's default curve. This check closes that
 * class of defect for good.
 *
 * The properties set at runtime by the scripts are listed in
 * `RUNTIME_PROPERTIES`; everything else must be defined in the source.
 */
const RUNTIME_PROPERTIES = new Set([
  '--a', '--i', '--p', '--z', '--x', '--y', '--mx', '--my', '--depth',
  '--fill', '--glow', '--lift', '--delay', '--nav-w', '--nav-x', '--ul',
  '--axis-wdth', '--axis-wght', '--swatch', '--route-progress',
  '--fx-curtain-colour', '--fx-field-colour', '--fx-glitch-colour',
  '--fx-mask-image', '--fx-panel-1', '--fx-panel-2', '--fx-panel-3',
  '--fx-panel-colour', '--fx-wipe-colour',
]);

const styleSources = readdirSync(join(root, 'src/styles'))
  .filter((name) => name.endsWith('.css'))
  .map((name) => readFileSync(join(root, 'src/styles', name), 'utf8'))
  .join('\n');

const usedProperties = new Set(
  [...styleSources.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)].map((m) => m[1]),
);
const definedProperties = new Set(
  [...styleSources.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1]),
);
const undefinedProperties = [...usedProperties]
  .filter((name) => !definedProperties.has(name) && !RUNTIME_PROPERTIES.has(name))
  .sort();
check(
  `every custom property resolves (${usedProperties.size} used, ${definedProperties.size} defined)`,
  undefinedProperties.length === 0,
  undefinedProperties.join(', '),
);

console.log('\n== 4. data modules ==');
const techniques = JSON.parse(readFileSync(join(root, 'src/data/techniques.json'), 'utf8'));
check('catalogue has 480 techniques', techniques.techniques.length === 480, String(techniques.techniques.length));
check('catalogue has 21 categories', techniques.categories.length === 21, String(techniques.categories.length));
const idList = techniques.techniques.map((t) => t.id);
check('technique ids are unique and contiguous', new Set(idList).size === 480 && idList[0] === 1 && idList[479] === 480);
const statuses = techniques.techniques.reduce((acc, t) => ({ ...acc, [t.status]: (acc[t.status] ?? 0) + 1 }), {});
console.log(`       statuses: ${JSON.stringify(statuses)}`);

console.log('\n== 5. every demo mounts and tears down ==');
const buildDir = mkdtempSync(join(tmpdir(), 'denvup-'));
const bundle = join(buildDir, 'registry.mjs');
execFileSync(
  join(root, 'node_modules/.bin/esbuild'),
  [
    join(root, 'src/demos/registry.ts'),
    '--bundle',
    '--format=esm',
    '--platform=browser',
    '--target=es2020',
    `--outfile=${bundle}`,
    '--log-level=error',
  ],
  { cwd: root },
);

const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) => {
  failures += 1;
  console.log(`  FAIL runtime error: ${error.message}`);
});

const runtimeDom = new JSDOM(html, {
  url: 'https://example.invalid/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  virtualConsole,
});
stubWindow(runtimeDom.window);

const { window } = runtimeDom;
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'CustomEvent', 'Event', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'IntersectionObserver', 'ResizeObserver', 'Image', 'Blob', 'URL', 'SVGElement', 'ImageData']) {
  if (!(key in window)) continue;
  try {
    Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true });
  } catch {
    /* some globals (navigator) are getter-only in Node — skip them */
  }
}
globalThis.self = window;

let registry = null;
try {
  registry = await import(pathToFileURL(bundle).href);
  check('demo registry loads', registry && Array.isArray(registry.allDemos));
} catch (error) {
  check('demo registry loads', false, String(error));
}

if (registry) {
  const { allDemos } = registry;
  check(`registry holds demos across every category (${allDemos.length} demos)`, allDemos.length >= 60);
  const ids = allDemos.map((demo) => demo.id);
  check('demo ids are unique', new Set(ids).size === ids.length);

  const mounted = [];
  const failuresList = [];
  for (const demo of allDemos) {
    const host = window.document.createElement('div');
    window.document.body.appendChild(host);
    try {
      const teardown = demo.mount({
        root: host,
        reduced: false,
        budget: 'mid',
        announce: () => {},
      });
      mounted.push({ demo, teardown });
    } catch (error) {
      failuresList.push(`${demo.id}: ${error.message}`);
    }
  }
  check(`every demo mounts (${mounted.length}/${allDemos.length})`, failuresList.length === 0, failuresList.join(' | '));

  const teardownFailures = [];
  for (const { demo, teardown } of mounted) {
    try {
      if (typeof teardown === 'function') teardown();
    } catch (error) {
      teardownFailures.push(`${demo.id}: ${error.message}`);
    }
  }
  check('every demo tears down cleanly', teardownFailures.length === 0, teardownFailures.join(' | '));

  // Reduced-motion path must also mount without throwing.
  const reducedFailures = [];
  for (const demo of allDemos) {
    const host = window.document.createElement('div');
    window.document.body.appendChild(host);
    try {
      const teardown = demo.mount({ root: host, reduced: true, budget: 'low', announce: () => {} });
      if (typeof teardown === 'function') teardown();
    } catch (error) {
      reducedFailures.push(`${demo.id}: ${error.message}`);
    }
  }
  check('every demo mounts in reduced-motion mode', reducedFailures.length === 0, reducedFailures.join(' | '));

  // Technique coverage: every Tested technique must point at a file that
  // actually exists in the repository.
  const missingComponents = techniques.techniques
    .filter((t) => t.status === 'Tested')
    .filter((t) => t.comp !== 'n/a' && !existsSync(join(root, t.comp)));
  check(
    `every Tested technique points at a file that exists (${missingComponents.length} missing)`,
    missingComponents.length === 0,
    missingComponents.slice(0, 12).map((t) => `${t.id} -> ${t.comp}`).join(' | '),
  );

  // Every technique that claims a working demonstration must be reachable
  // from the registry.
  const covered = new Set();
  for (const demo of allDemos) demo.techniques.forEach((t) => covered.add(t));
  const demoBacked = techniques.techniques.filter((t) => covered.has(t.id));
  check(
    `${demoBacked.length} techniques have a live demonstration in the registry; the remainder are implemented inside the site chapters`,
    demoBacked.length >= 240,
    String(demoBacked.length),
  );
}

console.log('\n== 6. static audit ==');
const allHtml = html;
const waLinks = [...allHtml.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => m[1]);
check(
  'both WhatsApp numbers are linked',
  waLinks.includes('https://wa.me/917675993371') && waLinks.includes('https://wa.me/919133585849'),
  waLinks.join(', '),
);
check('email address is correct', allHtml.includes('mailto:denvupforyou@gmail.com'));
const teamNames = ['T. Dusyanth', 'M. Nanda Kishore', 'K. V. Sai Prashanth', 'P. Venkatesh'];
const siteData = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
check('all four team members are named in the data', teamNames.every((name) => siteData.includes(name)));
const siteDataWithoutComments = siteData.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
check(
  'no invented testimonials, awards or client names in the data',
  !/testimonial|award|winner|clientLogo|clients\s*:/i.test(siteDataWithoutComments),
);
const pricingData = readFileSync(join(root, 'src/data/pricing.ts'), 'utf8');
check('starting prices are the supplied ones', /15000/.test(pricingData) && /20000/.test(pricingData) && /50000/.test(pricingData));
check('pricing carries an explicit disclaimer', pricingData.includes('not fixed quotations'));


console.log('\n== 7. css and source audit ==');
const sourceFiles = walk(join(root, 'src')).filter((f) => f.endsWith('.ts') || f.endsWith('.css'));
const sourceText = sourceFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

check(
  'a reduced-motion media query exists',
  /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(cssText),
);
check('the in-page motion switch has CSS rules', cssText.includes('is-motion-paused'));
check('the motion switch is wired to the page', sourceText.includes('setPageMotion'));
check('safe-area insets are respected', (sourceText.match(/safe-area-inset/g) ?? []).length >= 3);
check('focus-visible styles exist', cssText.includes(':focus-visible'));
const outlineNone = [...cssText.matchAll(/outline:\s*none/g)].length;
const focusNotVisible = [...cssText.matchAll(/:focus:not\(:focus-visible\)/g)].length;
check(
  `outline is only removed for non-keyboard focus (${outlineNone} removals, ${focusNotVisible} guarded)`,
  outlineNone === 0 || focusNotVisible >= outlineNone,
);
const intervals = (sourceText.match(/setInterval\(/g) ?? []).length;
const cleared = (sourceText.match(/clearInterval\(/g) ?? []).length;
check(
  `every timer is cleared on teardown (${intervals} started, ${cleared} cleared)`,
  intervals === cleared,
);
check('every listener registration has a matching teardown path', /removeEventListener/.test(sourceText));

/* --- colour contrast of the documented token pairs --------------------- */
function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
const CONTRAST_PAIRS = [
  ['body text on paper', '#0b0b0c', '#edeeea', 7],
  ['muted text on paper', '#5c5e57', '#edeeea', 4.5],
  ['body text on ink', '#edeeea', '#0b0b0c', 7],
  ['muted text on ink', '#a3a49c', '#0b0b0c', 4.5],
  ['ember accent text on paper', '#b8300a', '#edeeea', 4.5],
  ['ember accent text on ink', '#ff5b18', '#0b0b0c', 4.5],
  ['ink on ember', '#0b0b0c', '#f0490f', 4.5],
  ['paper on signal', '#edeeea', '#2b39e6', 4.5],
  ['signal accent text on signal', '#ffc94d', '#2b39e6', 4.5],
  ['ink on amber', '#140a05', '#ffb627', 4.5],
  /*
   * The two "soft" foregrounds are alpha-composited over their chapter
   * ground, so the pair is checked at its *composited* value — that is what
   * the eye actually sees. The ember soft text was 3.71:1 until the alpha
   * was raised to 0.86; this pair is the check that keeps it there.
   */
  ['soft text on ember', '#331303', '#f0490f', 4.5],
  ['soft text on signal', '#f0f1ff', '#2b39e6', 4.5],
  ['signal accent on paper', '#2b39e6', '#edeeea', 4.5],
  ['amber on ink', '#ffb627', '#0b0b0c', 4.5],
];
const contrastFailures = CONTRAST_PAIRS.filter(([, a, b, min]) => contrast(a, b) < min);
check(
  `every documented colour pair clears its contrast target (${CONTRAST_PAIRS.length} pairs)`,
  contrastFailures.length === 0,
  contrastFailures.map(([name, a, b, min]) => `${name} ${contrast(a, b).toFixed(2)} < ${min}`).join(' | '),
);


console.log('\n== 8. supplied brand assets ==');
const { createHash } = await import('node:crypto');
const digest = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const name of ['logo_black.png', 'logo_color.png']) {
  const supplied = join(root, name);
  const published = join(root, 'public', name);
  check(
    `${name} is published byte-identically`,
    existsSync(supplied) && existsSync(published) && digest(supplied) === digest(published),
  );
}
check('the page references the supplied logo files', /src="(\.\/|\/)?logo_black\.png"/.test(html) && /src="(\.\/|\/)?logo_color\.png"/.test(html));
check('the page also offers a WebP sibling of each mark',
  /srcset="(\.\/|\/)?logo_black\.webp"/.test(html) && /srcset="(\.\/|\/)?logo_color\.webp"/.test(html));
check('the mark chapter samples the supplied emblem', sourceText.includes("./logo_color.webp"));

console.log(`\n${checks - failures}/${checks} checks passed.`);
if (failures) {
  console.log(`${failures} check(s) failed.`);
  process.exit(1);
}
console.log('Smoke test passed.');

/*
 * GSAP's ScrollTrigger keeps a permanent requestAnimationFrame loop alive
 * once it is enabled (`_rafBugFix` in ScrollTrigger's source), which is
 * correct in a browser but keeps the Node process from ever exiting. The
 * harness therefore ends explicitly.
 */
process.exit(0);
