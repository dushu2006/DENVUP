import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Every page of the site. Each one is a real document with real content, so
 * the site works without JavaScript, every route has its own URL, and a
 * static host can serve it without rewriting rules.
 */
const PAGES = [
  'index.html',
  'services/index.html',
  'services/web-design/index.html',
  'services/ai-solutions/index.html',
  'services/business-integrations/index.html',
  'services/creative-experiences/index.html',
  'services/automation/index.html',
  'lab/index.html',
  'concepts/index.html',
  'studio/index.html',
  'pricing/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
  '404.html',
];

function readPart(name: string): string {
  const path = resolve(here, 'src/shell', name);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

/**
 * The shell plugin.
 *
 * Every page is authored with two markers — `<!--@shell:before-->` and
 * `<!--@shell:after-->` — and the plugin fills them with the persistent
 * chrome: the header, the menu, the command palette, the cursor, the grain
 * and the stage. Because the shell is injected rather than copied, the
 * chrome is byte-identical on every route, which is what lets the router
 * swap only `<main id="view">` and keep everything else alive.
 *
 * `<!--@boot-->` is the intro screen. It is injected only into the home
 * page: an interior route should not make a returning visitor sit through a
 * cinematic opening to reach a price list.
 */
function shellPlugin(): Plugin {
  const before = readPart('shell-before.html');
  const after = readPart('shell-after.html');
  const boot = readPart('boot.html');

  return {
    name: 'denvup-shell',
    transformIndexHtml(html, ctx) {
      let out = html;
      out = out.replace('<!--@boot-->', boot);
      out = out.replace('<!--@shell:before-->', before);
      out = out.replace('<!--@shell:after-->', after);
      // Any page that forgets a marker should fail loudly rather than ship
      // a page with no header.
      if (out.includes('<!--@shell:')) {
        throw new Error(`shell marker left unresolved in ${ctx.filename ?? 'page'}`);
      }
      return out;
    },
  };
}

/**
 * DENVUP website build configuration.
 *
 * Notes:
 * - No remote CDNs are used at runtime. Fonts are bundled from `@fontsource*`
 *   packages so the site works fully offline.
 * - Three.js is split into its own chunk and lazily imported by the 3D lab so
 *   the initial payload stays small (encyclopedia techniques 446 / 454).
 * - The site is a multi-page build. Every route is a real document; the
 *   client-side router upgrades navigation to an animated transition when
 *   JavaScript is available, and degrades to a normal page load when it is not.
 */
export default defineConfig({
  // The site is served from the domain root. Every route is a directory in
  // the build output, so a relative base would resolve `/logo_black.png`
  // against `/services/` and break the shell on every interior page.
  base: '/',
  plugins: [shellPlugin()],
  build: {
    target: 'es2020',
    cssTarget: 'chrome100',
    outDir: 'dist',
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: Object.fromEntries(
        PAGES.filter((page) => existsSync(resolve(here, page))).map((page) => [
          page,
          resolve(here, page),
        ]),
      ),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/lenis')) return 'lenis';
          return undefined;
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // The sandbox preview is reached through a generated hostname, so the
    // dev server has to accept hosts it does not recognise. There is no
    // server-side secret on this site, so the risk is nil.
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
});
