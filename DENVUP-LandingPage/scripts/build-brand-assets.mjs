#!/usr/bin/env node
/**
 * Reproducible brand-asset pipeline for the DENVUP website.
 *
 * Sources: ./logo_black.png and ./logo_color.png (read only — never modified).
 * Outputs: public/assets/brand/* and public/assets/fonts/*
 *
 * Run: npm run assets
 *
 * The script derives every web asset from the two supplied logo files:
 *   - optimised logo artwork (webp + png) for <img> use
 *   - a white "knockout" made from the black mark's alpha channel
 *   - favicons (PNG + a hand-written ICO container), maskable icons, touch icon
 *   - a 1200x630 social preview image composed from the logo + wordmark
 *   - a tiling grain texture used by the site's paper/film surfaces
 *
 * It writes only into public/assets. No external binaries are required.
 */
import { mkdir, copyFile, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => path.join(root, 'public', 'assets', ...p);
const ORANGE = '#ff4a00';
const ORANGE_DEEP = '#f03c00';
const INK = '#0b0a09';
const PAPER = '#ffffff';

const log = (msg) => console.log(`[brand-assets] ${msg}`);

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/** Turn any image into a flat single-colour silhouette, keeping its alpha. */
async function silhouette(input, hex) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgb = hexToRgb(hex);
  const pixels = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i += 4) {
    pixels[i] = rgb.r;
    pixels[i + 1] = rgb.g;
    pixels[i + 2] = rgb.b;
    pixels[i + 3] = data[i + 3];
  }
  return sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } });
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/**
 * Minimal ICO writer: an ICO directory whose entries embed PNG payloads.
 * Windows Vista+, all modern browsers and macOS accept PNG-compressed entries.
 */
function encodeIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const directory = [];
  for (const { size, png } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    directory.push(entry);
  }
  return Buffer.concat([header, ...directory, ...entries.map((e) => e.png)]);
}

async function logoOnField(logo, size, background, logoRatio = 0.72) {
  const inner = Math.round(size * logoRatio);
  const mark = await sharp(logo)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();
}

async function main() {
  const black = path.join(root, 'logo_black.png');
  const colour = path.join(root, 'logo_color.png');
  for (const f of [black, colour]) {
    if (!(await exists(f))) throw new Error(`Missing source logo: ${f}`);
  }
  await mkdir(out('brand'), { recursive: true });
  await mkdir(out('fonts'), { recursive: true });
  await mkdir(out('media'), { recursive: true });

  const blackMeta = await sharp(black).metadata();
  const colourMeta = await sharp(colour).metadata();
  log(`source logo_black ${blackMeta.width}x${blackMeta.height}, logo_color ${colourMeta.width}x${colourMeta.height}`);

  // --- Web artwork -----------------------------------------------------------
  await sharp(black)
    .resize(720, 720, { fit: 'contain' })
    .png({ compressionLevel: 9, palette: false })
    .toFile(out('brand', 'logo-black-720.png'));
  await sharp(black).resize(720, 720, { fit: 'contain' }).webp({ quality: 88, alphaQuality: 100 }).toFile(out('brand', 'logo-black-720.webp'));
  await sharp(colour)
    .resize(960, 960, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(out('brand', 'logo-colour-960.webp'));
  await sharp(colour)
    .resize(960, 960, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out('brand', 'logo-colour-960.png'));

  // Small marks for the loader and animated identity moment.
  await sharp(colour)
    .resize(360, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(out('brand', 'logo-colour-360.webp'));
  await sharp(black)
    .resize(360, 360, { fit: 'contain' })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(out('brand', 'logo-black-360.webp'));

  // White knockout for dark and orange fields, built from the black mark's alpha.
  const white = await silhouette(black, '#ffffff');
  await white.clone().resize(360, 360, { fit: 'contain' }).webp({ quality: 88, alphaQuality: 100 }).toFile(out('brand', 'logo-white-360.webp'));
  await white.clone().resize(720, 720, { fit: 'contain' }).png().toFile(out('brand', 'logo-white-720.png'));
  const ink = await silhouette(black, INK);
  await ink.clone().resize(720, 720, { fit: 'contain' }).png().toFile(out('brand', 'logo-ink-720.png'));

  // Mask asset used by CSS currentColor: pure alpha, black fill.
  await sharp(black).resize(512, 512, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(out('brand', 'logo-mask-512.png'));

  // --- Favicons, touch icon, maskable icons ---------------------------------
  const fav32 = await sharp(colour)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const fav16 = await sharp(colour)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const fav48 = await sharp(colour)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await mkdir(path.join(root, 'public'), { recursive: true });
  await writeFile(path.join(root, 'public', 'favicon.ico'), encodeIco([
    { size: 16, png: fav16 },
    { size: 32, png: fav32 },
    { size: 48, png: fav48 },
  ]));
  await sharp(black).resize(256, 256, { fit: 'contain' }).png().toFile(path.join(root, 'public', 'favicon.png'));

  await writeFile(
    path.join(root, 'public', 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${ORANGE}"/><image href="/assets/brand/logo-ink-720.png" x="8" y="8" width="48" height="48"/></svg>\n`,
  );

  for (const [size, name] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
    const png = await logoOnField(black, size, { r: 255, g: 74, b: 0, alpha: 1 }, size === 180 ? 0.7 : 0.62);
    await writeFile(path.join(root, 'public', name), png);
  }
  // Maskable icon needs a 20% safe area, so the mark sits smaller in the field.
  for (const size of [192, 512]) {
    const png = await logoOnField(black, size, { r: 255, g: 74, b: 0, alpha: 1 }, 0.5);
    await writeFile(out('brand', `icon-maskable-${size}.png`), png);
  }

  // --- Web app manifest -----------------------------------------------------
  await writeFile(
    path.join(root, 'public', 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'DENVUP — digital studio',
        short_name: 'DENVUP',
        description:
          'Website design and development, UI/UX, interactive experiences and custom digital solutions.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: ORANGE,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/assets/brand/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/assets/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ) + '\n',
  );

  // --- Social preview -------------------------------------------------------
  const ogLogo = await sharp(black).resize(340, 340, { fit: 'contain' }).png().toBuffer();
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${ORANGE}"/>
    <circle cx="1130" cy="66" r="190" fill="${ORANGE_DEEP}"/>
    <circle cx="96" cy="588" r="150" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 9"/>
    <g font-family="DejaVu Sans, Arial, sans-serif" fill="${INK}">
      <text x="72" y="104" font-size="22" letter-spacing="7" font-weight="700">DIGITAL STUDIO · ANDHRA PRADESH, INDIA</text>
      <text x="66" y="484" font-size="196" font-weight="700" letter-spacing="-9">DENVUP</text>
      <text x="72" y="548" font-size="30" font-weight="400">Websites, interfaces and interactive experiences.</text>
      <text x="72" y="592" font-size="24" font-weight="700">denvupforyou@gmail.com  ·  +91 76759 93371</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(ogSvg))
    .composite([{ input: ogLogo, left: 790, top: 132 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out('brand', 'og-image.jpg'));
  await sharp(Buffer.from(ogSvg))
    .composite([{ input: ogLogo, left: 790, top: 132 }])
    .png({ compressionLevel: 9 })
    .toFile(out('brand', 'og-image.png'));

  // --- Grain/texture --------------------------------------------------------
  const G = 160;
  const grain = Buffer.alloc(G * G * 4);
  let seed = 20261018;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = 0; i < G * G; i++) {
    const v = Math.floor(rnd() * 255);
    grain[i * 4] = v;
    grain[i * 4 + 1] = v;
    grain[i * 4 + 2] = v;
    grain[i * 4 + 3] = 26 + Math.floor(rnd() * 52);
  }
  await sharp(grain, { raw: { width: G, height: G, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out('media', 'grain.png'));

  // Soft radial "den light" plate used behind dark chapters.
  const glow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
    <defs><radialGradient id="g" cx="50%" cy="42%" r="52%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity=".55"/>
      <stop offset="45%" stop-color="${ORANGE}" stop-opacity=".14"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="1200" height="1200" fill="url(#g)"/>
  </svg>`);
  await sharp(glow).webp({ quality: 82 }).toFile(out('media', 'den-glow.webp'));

  // --- Fonts ----------------------------------------------------------------
  const fonts = [
    ['node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2', 'bricolage-grotesque-var.woff2'],
    ['node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2', 'instrument-sans-var.woff2'],
    ['node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-italic.woff2', 'instrument-sans-var-italic.woff2'],
  ];
  for (const [from, to] of fonts) {
    await copyFile(path.join(root, from), out('fonts', to));
    log(`font → ${to}`);
  }
  await copyFile(
    path.join(root, 'node_modules/@fontsource-variable/bricolage-grotesque/LICENSE'),
    out('fonts', 'LICENSE-bricolage-grotesque.txt'),
  );
  await copyFile(
    path.join(root, 'node_modules/@fontsource-variable/instrument-sans/LICENSE'),
    out('fonts', 'LICENSE-instrument-sans.txt'),
  );

  const manifest = {
    generatedAt: new Date().toISOString(),
    sources: { black: 'logo_black.png', colour: 'logo_color.png' },
    sourceDimensions: {
      black: [blackMeta.width, blackMeta.height],
      colour: [colourMeta.width, colourMeta.height],
    },
    palette: { orange: ORANGE, orangeDeep: ORANGE_DEEP, ink: INK, paper: PAPER },
    note: 'All files here are derived from the two supplied logos or generated by scripts/build-brand-assets.mjs. Originals are untouched.',
  };
  await writeFile(out('brand', 'brand-manifest.json'), JSON.stringify(manifest, null, 2));
  log('done');
}

main().catch((err) => {
  console.error('[brand-assets] failed:', err);
  process.exit(1);
});
