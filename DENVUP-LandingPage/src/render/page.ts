import { brand, meta, nav, team } from '../content/site';
import { esc, icon, logoMark } from './html';
import {
  renderPrelude,
  renderHero,
  renderManifesto,
  renderServices,
  renderServiceDeepDives,
  renderCapabilities,
  renderProcess,
  renderTechnologies,
  renderTeam,
  renderShowcase,
  renderPricing,
  renderFaq,
  renderStandards,
} from './sections';
import { renderContact, renderClosing, renderFooter, renderDialogs } from './forms';

function header(): string {
  return `<a class="skip-link" href="#main">Skip to the content</a>
  <header class="site-head" data-head data-theme="paper" data-pinned>
    <a class="brand" href="#top" aria-label="DENVUP — back to the top">
      ${logoMark('brand__mark')}
      <span class="brand__word">DENVUP</span>
    </a>
    <nav class="head-nav" aria-label="Primary">
      ${nav.map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join('')}
    </nav>
    <div class="head-tools">
      <button class="head-search" type="button" data-open-command aria-label="Jump to a section or demo" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">
        ${icon('search')}<span>Jump to</span><kbd data-kbd-mod>Ctrl K</kbd>
      </button>
      <a class="head-cta" href="#contact">Start a project ${icon('arrow-up-right')}</a>
      <button class="head-menu" type="button" data-open-menu aria-expanded="false" aria-haspopup="dialog" aria-controls="site-menu">
        <span class="head-menu__label">Menu</span><span class="head-menu__icon" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
    <div class="progress" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-progress><i data-progress-bar></i></div>
  </header>`;
}

export function renderPage(): string {
  const year = new Date().getFullYear();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    description: brand.description,
    email: brand.email,
    telephone: brand.phones.map((p) => p.e164),
    address: { '@type': 'PostalAddress', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
    numberOfEmployees: team.length,
    knowsAbout: ['Website design', 'Web development', 'UI/UX design', 'Interactive experiences', 'WebGL'],
  };

  return `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  <meta name="theme-color" content="${meta.themeColor}">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(meta.ogAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(meta.title)}">
  <meta name="twitter:description" content="${esc(meta.description)}">
  <meta name="twitter:image" content="${meta.ogImage}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/instrument-sans-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/brand/logo-colour-360.webp" as="image" type="image/webp">
  <link rel="stylesheet" href="/src/styles/main.css">
  <script>
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
    document.documentElement.dataset.motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
    window.DENVUP = { endpoint: '' };
  </script>
</head>
<body id="top">
  ${header()}
  <main id="main" tabindex="-1">
    ${renderPrelude()}
    ${renderHero()}
    ${renderManifesto()}
    ${renderServices()}
    ${renderServiceDeepDives()}
    ${renderCapabilities()}
    ${renderProcess()}
    ${renderTechnologies()}
    ${renderTeam()}
    ${renderShowcase()}
    ${renderPricing()}
    ${renderFaq()}
    ${renderStandards()}
    ${renderContact()}
    ${renderClosing()}
  </main>
  ${renderFooter()}
  ${renderDialogs()}
  <div class="fx-toast" data-toast role="status" aria-live="polite"></div>
  <noscript><div class="noscript"><p><strong>JavaScript is off.</strong> The site still reads, but the live demos, menu and estimator need it. You can reach DENVUP at <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>, <a href="tel:${esc(brand.phones[0].e164)}">${esc(brand.phones[0].display)}</a> or <a href="tel:${esc(brand.phones[1].e164)}">${esc(brand.phones[1].display)}</a>.</p></div></noscript>
  <div class="legal-stamp" aria-hidden="true"><span>© ${year} DENVUP</span><span>${esc(brand.legalNote)}</span><span>${esc(brand.location)}</span></div>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`;
}

