/**
 * Build the five service plates.
 *
 * No image model is available in this environment and no third-party artwork may
 * be used, so the plates are authored here as geometry: one art direction
 * (paper ground, oxide ink, a single accent, hairline grid) and one seed per
 * service. They are deterministic — the same input always produces the same
 * file — so they can be regenerated and reviewed in a diff.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/assets/plates');

const PAPER = '#f6f1e8';
const INK = '#0b0a09';
const OXIDE = '#ff4a00';

/** Small deterministic PRNG so a plate never changes between builds. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1200;
const H = 900;

const grid = () => {
  const lines = [];
  for (let x = 0; x <= W; x += 75) lines.push(`<path d="M${x} 0V${H}"/>`);
  for (let y = 0; y <= H; y += 75) lines.push(`<path d="M0 ${y}H${W}"/>`);
  return `<g stroke="${INK}" stroke-opacity=".08" stroke-width="1" fill="none">${lines.join('')}</g>`;
};

/** web — stacked type bars, a measured column */
function web() {
  const bars = Array.from({ length: 7 }, (_, i) => {
    const w = 300 + ((i * 137) % 420);
    const y = 210 + i * 78;
    return `<rect x="120" y="${y}" width="${w}" height="${i === 1 ? 54 : 26}" fill="${i === 1 ? OXIDE : INK}" opacity="${i === 1 ? 1 : 0.82}"/>`;
  }).join('');
  return `${bars}<circle cx="900" cy="300" r="132" fill="none" stroke="${INK}" stroke-width="2"/><rect x="830" y="500" width="200" height="200" fill="${OXIDE}"/>`;
}

/** ai — a set of sources converging on one node, with the sources still named */
function ai() {
  const r = rng(7);
  const nodes = Array.from({ length: 9 }, (_, i) => {
    const y = 140 + i * 82;
    const x = 120 + r() * 90;
    return `<line x1="${x + 34}" y1="${y}" x2="820" y2="450" stroke="${INK}" stroke-opacity=".35" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="13" fill="none" stroke="${INK}" stroke-width="2"/>`;
  }).join('');
  return `${nodes}<circle cx="880" cy="450" r="96" fill="${OXIDE}"/><circle cx="880" cy="450" r="132" fill="none" stroke="${INK}" stroke-width="2"/>`;
}

/** integrations — a grid of records, one path lit */
function integrations() {
  const r = rng(19);
  const cells = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 3; y++) {
      const lit = x === 2 && y === 1;
      cells.push(
        `<rect x="${120 + x * 240}" y="${150 + y * 200}" width="180" height="140" fill="${lit ? OXIDE : 'none'}" stroke="${INK}" stroke-width="1.5" stroke-opacity="${lit ? 1 : 0.5}"/>`,
      );
    }
  }
  const dots = Array.from({ length: 40 }, () => `<circle cx="${120 + r() * 720}" cy="${130 + r() * 600}" r="2" fill="${INK}" opacity=".25"/>`).join('');
  return `${cells.join('')}${dots}`;
}

/** interactive — concentric response rings and a displaced core */
function interactive() {
  const rings = Array.from({ length: 7 }, (_, i) => {
    const rad = 90 + i * 58;
    const dash = i % 2 ? '10 16' : 'none';
    return `<circle cx="600" cy="450" r="${rad}" fill="none" stroke="${INK}" stroke-opacity="${0.55 - i * 0.05}" stroke-width="2" ${dash === 'none' ? '' : `stroke-dasharray="${dash}"`}/>`;
  }).join('');
  return `${rings}<circle cx="600" cy="450" r="58" fill="${OXIDE}"/><ellipse cx="600" cy="450" rx="210" ry="74" fill="none" stroke="${OXIDE}" stroke-width="2"/>`;
}

/** automation — an ordered chain with one loop back */
function automation() {
  const steps = Array.from({ length: 4 }, (_, i) => {
    const x = 150 + i * 250;
    return `<rect x="${x}" y="380" width="150" height="150" fill="none" stroke="${INK}" stroke-width="2"/>
      <path d="M${x + 150} 455H${x + 250}" stroke="${INK}" stroke-width="2"/>`;
  }).join('');
  return `${steps}<path d="M950 455C1050 455 1050 250 900 250H300C200 250 175 330 175 380" fill="none" stroke="${OXIDE}" stroke-width="2" stroke-dasharray="8 10"/>`;
}

const PLATES = {
  'web-design': web,
  'ai-solutions': ai,
  integrations,
  interactive,
  automation,
};

await mkdir(out, { recursive: true });
const written = [];
for (const [slug, draw] of Object.entries(PLATES)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <title>DENVUP service plate — ${slug.replace(/-/g, ' ')}</title>
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${grid()}
  ${draw()}
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${OXIDE}"/>
</svg>`;
  const file = path.join(out, `${slug}.svg`);
  await writeFile(file, svg, 'utf8');
  written.push(`${slug}.svg — ${(Buffer.byteLength(svg) / 1024).toFixed(1)} kB`);
}
console.log(`[plates] ${written.length} plates`);
written.forEach((line) => console.log('  ' + line));
