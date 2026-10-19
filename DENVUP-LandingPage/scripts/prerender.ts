/**
 * Prerender the whole page to index.html. Vite then enhances it: the HTML is
 * static (every word, price and demo description is in the document), and the
 * client bundle progressively mounts the interactive parts.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from '../src/render/page';
import { labs, labEntries, implementedIds } from '../src/labs/registry';
import { coverageSummary } from '../src/content/coverage-map';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const html = renderPage();
await writeFile(path.join(root, 'index.html'), html, 'utf8');

const dupe = implementedIds.filter((id, i) => implementedIds.indexOf(id) !== i);
const outOfRange = implementedIds.filter((id) => id < 1 || id > 480);

console.log('[prerender] index.html written');
console.log(`[prerender] ${labs.length} labs, ${labEntries.length} live demos, ${implementedIds.length} distinct technique IDs`);
console.log(
  `[prerender] coverage: ${coverageSummary.Tested} tested, ${coverageSummary.Implemented} implemented, ` +
    `${coverageSummary['Requires revision']} requires revision, ${coverageSummary.Blocked} blocked, ${coverageSummary.Planned} planned`,
);
if (dupe.length) console.warn('[prerender] duplicate IDs in lab mode lists:', dupe.join(', '));
if (outOfRange.length) console.warn('[prerender] IDs outside the 1–480 catalogue:', outOfRange.join(', '));
