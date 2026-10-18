import { brand, chapters, meta, nav, team } from '../content/site';
import { esc, icon, logoMark } from './html';
import {
  renderPrelude,
  renderGate,
  renderHero,
  renderIdentity,
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
import { renderEffects } from './effects';
import { renderContact, renderClosing, renderFooter, renderDialogs } from './forms';

function loader(): string {
  return `<div class="loader" id="loader" role="status" aria-label="Opening the den">
    <div class="loader__inner">
      <div class="loader__mark">
        <img src="/assets/brand/logo-colour-360.webp" width="360" height="360" alt="" decoding="async" fetchpriority="high">
        <span class="loader__ring" aria-hidden="true"></span>
      </div>
      <p class="loader__word">DENVUP</p>
      <div class="loader__meta"><span data-loader-status>Opening the den</span><span data-loader-pct>0%</span></div>
      <div class="loader__bar" aria-hidden="true"><i data-loader-bar></i></div>
      <button type="button" class="loader__skip" data-loader-skip>Skip the opening</button>
    </div>
  </div>`;
}

function header(): string {
  return `<a class="skip-link" href="#main">Skip to the content</a>
  ${loader()}
  <header class="site-head" data-head data-theme="paper">
    <a class="brand" href="#top" aria-label="DENVUP — back to the top">
      ${logoMark('brand__mark')}
      <span class="brand__word">DENVUP</span>
    </a>
    <nav class="head-nav" aria-label="Primary">
      ${nav.map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join('')}
    </nav>
    <div class="head-tools">
      <button class="head-search" type="button" data-open-command aria-label="Jump to a section or effect" aria-haspopup="dialog">
        ${icon('search')}<span>Jump to</span><kbd>⌘K</kbd>
      </button>
      <a class="head-cta" href="#contact">Start a project ${icon('arrow-up-right')}</a>
      <button class="head-menu" type="button" data-open-menu aria-expanded="false" aria-haspopup="dialog" aria-controls="site-menu">
        <span class="head-menu__label">Menu</span><span class="head-menu__icon" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </header>
  <div class="progress" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-progress><i data-progress-bar></i></div>
  <nav class="chapter-rail" aria-label="Chapters">
    <ol>${chapters
      .map(
        (c) =>
          `<li><a href="#${c.id}" data-chapter-link="${c.id}"><span class="chapter-rail__label">${esc(c.label)}</span><span class="chapter-rail__num">${esc(c.short)}</span><span class="chapter-rail__dot" aria-hidden="true"></span></a></li>`,
      )
      .join('')}</ol>
  </nav>`;
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
    ${renderGate()}
    ${renderHero()}
    ${renderIdentity()}
    ${renderManifesto()}
    ${renderServices()}
    ${renderServiceDeepDives()}
    ${renderCapabilities()}
    ${renderEffects()}
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
  <div class="grain" aria-hidden="true"></div>
  <div class="cursor" data-cursor aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"></span><span class="cursor__label"></span></div>
  <div class="fox-run" data-fox aria-hidden="true"><img src="/assets/brand/logo-white-360.webp" width="360" height="360" alt=""></div>
  <div class="fx-toast" data-toast role="status" aria-live="polite"></div>
  <noscript><div class="noscript"><p><strong>JavaScript is off.</strong> The site still reads, but the live effects, menu and estimator need it. You can reach DENVUP at <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>, <a href="tel:${esc(brand.phones[0].e164)}">${esc(brand.phones[0].display)}</a> or <a href="tel:${esc(brand.phones[1].e164)}">${esc(brand.phones[1].display)}</a>.</p></div></noscript>
  <div class="legal-stamp" aria-hidden="true"><span>© ${year} DENVUP</span><span>${esc(brand.legalNote)}</span><span>${esc(brand.location)}</span></div>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`;
}

