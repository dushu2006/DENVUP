/**
 * Prerender every route to real HTML.
 *
 * Two outputs from one renderer:
 *   - `index.html` at the project root, with dev asset paths, for `vite dev`;
 *   - `dist/<route>/index.html` after a build, pointing at the hashed bundle
 *     recorded in `dist/.vite/manifest.json`.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDocument, type AssetPaths } from '../src/render/page';
import { routes } from '../src/content/routes';
import { labs, labEntries, implementedIds } from '../src/labs/registry';
import { coverageSummary } from '../src/content/coverage-map';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prod = process.argv.includes('--prod');

const DEV: AssetPaths = { css: ['/src/styles/main.css'], js: ['/src/main.ts'] };

async function prodAssets(): Promise<AssetPaths> {
  const manifestPath = path.join(root, 'dist/.vite/manifest.json');
  if (!existsSync(manifestPath)) throw new Error('No build manifest — run `vite build` first');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<
    string,
    { file: string; css?: string[]; isEntry?: boolean }
  >;
  const entry = Object.values(manifest).find((c) => c.isEntry) ?? manifest['index.html'];
  if (!entry) throw new Error('No entry chunk in the manifest');
  const css = [...new Set(
    Object.values(manifest)
      .flatMap((c) => [c.file, ...(c.css ?? [])])
      .filter((f) => f.endsWith('.css')),
  )].map((f) => `/${f}`);
  return { css, js: [`/${entry.file}`] };
}

const assets = prod ? await prodAssets() : DEV;
const outRoot = prod ? path.join(root, 'dist') : root;

if (prod) {
  for (const name of ['services', 'lab', 'concepts', 'studio', 'pricing', 'contact', 'privacy', 'terms', '404']) {
    await rm(path.join(outRoot, name), { recursive: true, force: true });
  }
}

let written = 0;
for (const route of routes) {
  const html = renderDocument(route.path, assets);
  const dir = route.path === '/' ? outRoot : path.join(outRoot, route.path.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html, 'utf8');
  written += 1;
}

const dupe = implementedIds.filter((id, i) => implementedIds.indexOf(id) !== i);
const outOfRange = implementedIds.filter((id) => id < 1 || id > 480);

console.log(`[prerender] ${written} routes → ${prod ? 'dist/' : 'project root (dev)'}`);
console.log(`[prerender] assets: ${assets.css.join(', ') || 'none'} + ${assets.js.join(', ')}`);
console.log(`[prerender] ${labs.length} labs, ${labEntries.length} live demos, ${implementedIds.length} distinct technique IDs`);
console.log(
  `[prerender] coverage: ${coverageSummary.Tested} tested, ${coverageSummary.Implemented} implemented, ` +
    `${coverageSummary['Requires revision']} requires revision, ${coverageSummary.Blocked} blocked, ${coverageSummary.Planned} planned`,
);
if (dupe.length) console.warn('[prerender] duplicate IDs in lab mode lists:', dupe.join(', '));
if (outOfRange.length) console.warn('[prerender] IDs outside the 1–480 catalogue:', outOfRange.join(', '));
