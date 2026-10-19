import { brand, meta, team } from '../content/site';
import { routeByPath } from '../content/routes';
import { esc } from './html';
import { header, stage, cursor, footerBlock, dialogs } from './shell';
import {
  homeBody,
  servicesIndexBody,
  serviceDetailBody,
  labBody,
  conceptsBody,
  studioBody,
  pricingBody,
  contactBody,
  legalBody,
  notFoundBody,
} from './pages';


/**
 * Chapter hand-offs.
 *
 * Each <section> that opens a chapter gets:
 *   data-handoff — the device that uncovers it (plate, curtain, flood, scale, line);
 *   data-cover   — the ground colour of the chapter before it, so the covering
 *                  plate is the outgoing chapter sliding away, not a blank panel.
 * The client only animates these; the attributes are static HTML, so a browser
 * with no scroll-timeline support simply never draws the plate.
 */
const DEVICES = ['plate', 'curtain', 'flood', 'scale', 'line'] as const;

function annotateHandoffs(html: string): string {
  let index = 0;
  let previous = '';
  const withThemes = html.replace(
    /<section\b([^>]*?)data-scene="([^"]+)"([^>]*)>/g,
    (tag, before: string, scene: string, after: string) =>
      /data-theme="/.test(tag) ? tag : `<section${before}data-scene="${scene}"${after} data-theme="${scene}">`,
  );
  return withThemes.replace(/<section\b([^>]*?)data-chapter="([^"]+)"([^>]*)>/g, (tag, before: string, chapter: string, after: string) => {
    const theme = /data-theme="([^"]+)"/.exec(tag)?.[1] ?? 'paper';
    // The hero is uncovered by the prelude's own flood, so it draws no second
    // device. A device on both sides of one seam is two transitions, not one.
    const device = chapter === 'prelude' ? 'flood' : chapter === 'hero' ? 'none' : DEVICES[index % DEVICES.length];
    const attrs = ` data-handoff="${device}" data-cover="${previous || theme}"`;
    previous = theme;
    index += 1;
    return `<section${before}data-chapter="${chapter}"${after}${attrs}>`;
  });
}

export interface AssetPaths {
  css: string[];
  js: string[];
}

const DEV_ASSETS: AssetPaths = { css: ['/src/styles/main.css'], js: ['/src/main.ts'] };

export function routeBody(path: string): string {
  if (path === '/') return homeBody();
  if (path === '/services') return servicesIndexBody();
  if (path.startsWith('/services/')) return serviceDetailBody(path.slice('/services/'.length));
  if (path === '/lab') return labBody();
  if (path === '/concepts') return conceptsBody();
  if (path === '/studio') return studioBody();
  if (path === '/pricing') return pricingBody();
  if (path === '/contact') return contactBody();
  if (path === '/privacy') return legalBody('privacy');
  if (path === '/terms') return legalBody('terms');
  return notFoundBody();
}

const CHAPTER_INDEX: Record<string, number> = {
  prelude: 1, hero: 2, manifesto: 3, services: 4, 'services-deep': 5, capabilities: 6,
  demos: 7, process: 8, technologies: 9, team: 10, showcase: 11, pricing: 12, faq: 13,
  contact: 14, closing: 15, footer: 16, lab: 1, service: 1, concepts: 1, studio: 1,
  legal: 1, notfound: 1,
};

export function renderDocument(path: string, assets: AssetPaths = DEV_ASSETS): string {
  const metaForRoute = routeByPath.get(path) ?? routeByPath.get('/404')!;
  const canonical = `https://denvup.com${path === '/' ? '/' : path}`;
  const isHome = path === '/';
  const title = isHome ? meta.title : metaForRoute.title;
  const description = isHome ? meta.description : metaForRoute.description;

  const jsonLd = isHome
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: brand.name,
        description: brand.description,
        email: brand.email,
        telephone: brand.phones.map((p) => p.e164),
        address: { '@type': 'PostalAddress', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
        numberOfEmployees: team.length,
        knowsAbout: ['Website design', 'Web development', 'UI/UX design', 'Interactive experiences', 'AI-powered solutions', 'Business integrations', 'Automation'],
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: metaForRoute.name,
        description,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: brand.name, url: 'https://denvup.com/' },
      };

  return `<!DOCTYPE html>
<html lang="en" class="no-js" data-chapter="${esc(metaForRoute.chapter)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="${meta.themeColor}">
  <meta name="color-scheme" content="light">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${meta.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(meta.ogAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${meta.ogImage}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/instrument-sans-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/brand/logo-colour-360.webp" as="image" type="image/webp">
${assets.css.map((href) => `  <link rel="stylesheet" href="${href}">`).join('\n')}
  <script>
    (function () {
      var root = document.documentElement;
      root.classList.remove('no-js');
      root.classList.add('js');
      root.dataset.motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
      root.dataset.chapter = ${JSON.stringify(metaForRoute.chapter)};
      root.dataset.chapters = ${JSON.stringify(CHAPTER_INDEX)};
      try {
        var saved = sessionStorage.getItem('denvup:stage');
        if (saved) root.dataset.scene = JSON.parse(saved).scene || '';
      } catch (e) {}
      window.DENVUP = { endpoint: '', route: ${JSON.stringify(path)} };
    })();
  </script>
</head>
<body id="top" data-route="${esc(path)}">
  ${header(path)}
  ${stage()}
  ${cursor()}
  <main id="main" tabindex="-1" data-route-main>
    ${annotateHandoffs(routeBody(path))}
  </main>
  ${footerBlock(path)}
  ${dialogs()}
  <div class="fx-toast" data-toast role="status" aria-live="polite"></div>
  <div class="route-loader" data-route-loader aria-hidden="true"><span></span></div>
  <noscript><div class="noscript"><p><strong>JavaScript is off.</strong> The site still reads and every page is reachable. The live demos, menu and estimator need it. You can reach DENVUP at <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>, <a href="tel:${esc(brand.phones[0].e164)}">${esc(brand.phones[0].display)}</a> or <a href="tel:${esc(brand.phones[1].e164)}">${esc(brand.phones[1].display)}</a>.</p></div></noscript>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
${assets.js.map((src) => `  <script type="module" src="${src}"></script>`).join('\n')}
</body>
</html>`;
}

/** Kept for the existing tests and for the home page. */
export function renderPage(): string {
  return renderDocument('/');
}
