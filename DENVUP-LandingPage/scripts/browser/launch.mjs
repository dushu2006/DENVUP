/**
 * Real Chromium for the acceptance tests.
 *
 * The sandbox has no browser binary and the Playwright/Puppeteer CDNs are not
 * reachable, so this launcher assembles one from packages that *are* reachable:
 *
 *   1. `@sparticuz/chromium` ships a headless Chromium build inside its npm
 *      tarball (it is the Lambda package, so it expects the system NSS).
 *   2. NSS (`libnss3`, `libnssutil3`) is fetched once from a public GitHub
 *      repository that publishes the two shared objects.
 *   3. NSPR (`libnspr4`, `libplc4`, `libplds4`) is compiled from Mozilla's
 *      NSPR source on codeload.github.com — small, ~7 s, no system packages.
 *
 * Everything lands in `.browser/` (git-ignored, but kept in the workspace so a
 * rerun is instant). If any step fails the caller records the tests as NOT
 * PERFORMED rather than pretending.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const libs = path.join(root, '.browser/libs');
const nsprBuild = path.join(root, '.browser/nspr');

const NEEDED = ['libnss3.so', 'libnssutil3.so', 'libnspr4.so', 'libplc4.so', 'libplds4.so'];

function haveLibs() {
  return NEEDED.every((name) => existsSync(path.join(libs, name)));
}

async function fetchNss() {
  const files = ['libnss3.so', 'libnssutil3.so'];
  for (const file of files) {
    const res = await fetch(
      `https://api.github.com/repos/melon-gg/libnss3.so/contents/${file}`,
      { headers: { Accept: 'application/vnd.github.raw' } },
    );
    if (!res.ok) throw new Error(`NSS fetch ${file}: HTTP ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.subarray(0, 4).toString() !== '\x7fELF') throw new Error(`${file} is not an ELF binary`);
    await writeFile(path.join(libs, file), bytes);
  }
}

async function buildNspr() {
  const tarball = path.join(root, '.browser/nspr.tar.gz');
  const res = await fetch('https://codeload.github.com/mozilla/nspr/tar.gz/refs/heads/main');
  if (!res.ok) throw new Error(`NSPR source: HTTP ${res.status}`);
  await writeFile(tarball, Buffer.from(await res.arrayBuffer()));

  mkdirSync(nsprBuild, { recursive: true });
  execFileSync('tar', ['xzf', tarball, '-C', nsprBuild, '--strip-components=1'], { stdio: 'inherit' });
  execFileSync('./configure', ['--disable-debug', '--enable-optimize', '--enable-64bit'], {
    cwd: nsprBuild,
    stdio: 'inherit',
  });
  execFileSync('make', ['-j', String(4)], { cwd: nsprBuild, stdio: 'inherit' });
  for (const name of ['libnspr4.so', 'libplc4.so', 'libplds4.so']) {
    copyFileSync(path.join(nsprBuild, 'dist/lib', name), path.join(libs, name));
  }
}

export async function ensureBrowserLibs() {
  mkdirSync(libs, { recursive: true });
  if (haveLibs()) return libs;
  if (!existsSync(path.join(libs, 'libnss3.so'))) await fetchNss();
  if (!existsSync(path.join(libs, 'libnspr4.so'))) await buildNspr();
  if (!haveLibs()) throw new Error('Browser libraries could not be assembled');
  return libs;
}

export async function launchBrowser({ width = 1440, height = 900, reducedMotion = false } = {}) {
  const libDir = await ensureBrowserLibs();
  process.env.LD_LIBRARY_PATH = `${libDir}:${process.env.LD_LIBRARY_PATH ?? ''}`;
  const { default: chromium } = await import('@sparticuz/chromium');
  const { default: puppeteer } = await import('puppeteer-core');
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    env: { ...process.env, LD_LIBRARY_PATH: libDir },
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  return { browser, page };
}
