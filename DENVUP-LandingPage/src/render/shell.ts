import { brand, team, waLink, enquiryText, footer, closing } from '../content/site';
import { primaryNav, footerNav } from '../content/routes';
import { esc, icon, logoMark } from './html';

const NAV_ITEMS = primaryNav;

function isActive(path: string, href: string): boolean {
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}

export function header(path: string): string {
  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${esc(item.href)}"${isActive(path, item.href) ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`,
  ).join('');

  return `<a class="skip-link" href="#main">Skip to the content</a>
  <header class="site-head" data-head data-pinned data-route-head>
    <a class="brand" href="/" aria-label="DENVUP — home" data-transition-mark>
      ${logoMark('brand__mark')}
      <span class="brand__word">DENVUP</span>
    </a>
    <nav class="head-nav" aria-label="Primary">${links}</nav>
    <div class="head-tools">
      <button class="head-search" type="button" data-open-command aria-label="Jump to a page or demo" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">
        ${icon('search')}<span>Jump to</span><kbd data-kbd-mod>Ctrl K</kbd>
      </button>
      <a class="head-cta" href="/contact">Start a project ${icon('arrow-up-right')}</a>
      <button class="head-menu" type="button" data-open-menu aria-expanded="false" aria-haspopup="dialog" aria-controls="site-menu">
        <span class="head-menu__label">Menu</span><span class="head-menu__icon" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
    <div class="progress" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-progress><i data-progress-bar></i></div>
  </header>`;
}

/**
 * The persistent stage. One canvas for the whole site, behind everything,
 * keyed to the chapter in view. It draws a flat colour field, a slow grid and
 * a few geometric marks; `src/client/scene.ts` owns the loop. When WebGL or
 * canvas is unavailable the CSS field underneath is the fallback.
 */
export function stage(): string {
  return `<div class="scene" data-scene-root aria-hidden="true">
    <div class="scene__field" data-scene-field></div>
    <canvas class="scene__canvas" data-scene-canvas></canvas>
    <div class="scene__grid" data-scene-grid></div>
    <div class="scene__vignette"></div>
  </div>`;
}

/** Pointer-only cursor: a dot, a ring and a label. Never shown on touch. */
export function cursor(): string {
  return `<div class="cursor" data-cursor aria-hidden="true">
    <span class="cursor__ring" data-cursor-ring></span>
    <span class="cursor__dot" data-cursor-dot></span>
    <span class="cursor__label" data-cursor-label></span>
  </div>`;
}

export function footerBlock(path: string): string {
  const columns = footerNav
    .map(
      (c) => `<nav class="footer__col" aria-label="${esc(c.title)}">
        <h3>${esc(c.title)}</h3>
        <ul>${c.links.map((l) => `<li><a href="${esc(l.href)}"${isActive(path, l.href) ? ' aria-current="page"' : ''}>${esc(l.label)}</a></li>`).join('')}</ul>
      </nav>`,
    )
    .join('');

  return `<footer class="footer" id="footer" data-theme="ink" data-chapter="footer">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="footer__logo" href="/" aria-label="DENVUP, home">${logoMark('logo-mask--orange')}<span>DENVUP</span></a>
        <p class="footer__tagline">${esc(brand.tagline)}</p>
        <p class="footer__contact"><a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a><br>
        <a href="tel:${esc(brand.phones[0].e164)}">${esc(brand.phones[0].display)}</a><br>
        <a href="tel:${esc(brand.phones[1].e164)}">${esc(brand.phones[1].display)}</a></p>
      </div>
      <div class="footer__nav">${columns}
        <div class="footer__col footer__col--meta">
          <h3>Studio</h3>
          <p class="footer__meta">${esc(brand.location)}</p>
          <p class="footer__meta">${esc(brand.hours)}</p>
          <p class="footer__clock"><span data-clock>—</span> IST</p>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__colophon">${esc(footer.colophon)}</p>
      <div class="footer__tools">
        <button type="button" class="footer__tool" data-sound-toggle aria-pressed="false">${icon('sound-off')}<span data-sound-label>Sound off</span></button>
        <button type="button" class="footer__tool" data-open-shortcuts>${icon('command')}<span>Shortcuts</span></button>
        <button type="button" class="footer__tool" data-open-a11y>${icon('check')}<span>${esc(footer.accessibility)}</span></button>
        <button type="button" class="footer__tool" data-open-privacy>${icon('mail')}<span>${esc(footer.privacy)}</span></button>
      </div>
      <p class="footer__fine">© <span data-year>2026</span> DENVUP. ${esc(footer.shortcuts)}</p>
    </div>
    <button class="to-top" type="button" data-to-top aria-label="Back to top">${icon('arrow-down')}<span>Top</span></button>
  </footer>`;
}

export function dialogs(): string {
  const profiles = team
    .map(
      (m, i) => `<template data-person-template="${i}">
        <p class="profile__initials" aria-hidden="true">${esc(m.initials)}</p>
        <h2 class="profile__name" id="profile-name-${i}">${esc(m.name)}</h2>
        <p class="profile__copy">One of the four people who make up DENVUP. No job title or biography has been invented for this page: the work and the first call are the introduction.</p>
        <div class="profile__actions">
          <a class="btn btn--solid" href="/contact" data-close-dialog><span class="btn__label">Start a conversation</span><span class="btn__icon">${icon('arrow-up-right')}</span></a>
        </div>
      </template>`,
    )
    .join('');

  return `${profiles}
  <dialog class="sheet" id="profile-dialog" aria-label="Team profile">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close profile">${icon('close')}</button>
      <div data-profile-body></div>
    </div>
  </dialog>

  <dialog class="sheet sheet--wide" id="shortcuts-dialog" aria-labelledby="shortcuts-title">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close shortcuts">${icon('close')}</button>
      <h2 id="shortcuts-title">Keyboard</h2>
      <dl class="shortcuts">
        <div><dt><kbd>?</kbd></dt><dd>Open this guide</dd></div>
        <div><dt><kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd>Jump to a page or a demo</dd></div>
        <div><dt><kbd>M</kbd></dt><dd>Open the menu</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>Close a dialog or menu</dd></div>
        <div><dt><kbd>Tab</kbd></dt><dd>Every interactive element has a visible focus state</dd></div>
        <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Move between demos in a gallery</dd></div>
      </dl>
      <p class="sheet__note">${esc(footer.shortcuts)}</p>
    </div>
  </dialog>

  <dialog class="sheet" id="a11y-dialog" aria-labelledby="a11y-title">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close accessibility statement">${icon('close')}</button>
      <h2 id="a11y-title">Accessibility statement</h2>
      <p>Built to WCAG 2.2 AA as the baseline: semantic landmarks, one main heading per page, visible focus, keyboard-operable controls, labelled fields, and text contrast checked by hand.</p>
      <p>Motion is optional. A full reduced-motion path keeps every section and all content, removes pinning, parallax, cursor effects and auto-playing movement, and stops decorative canvases.</p>
      <p>The contact form has no server endpoint in this build, so it cannot store or transmit a message. It says so, and offers a prefilled email and WhatsApp instead. No cookies are set and no third-party analytics load.</p>
      <p>If something does not work, email <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a> with the page and what happened.</p>
    </div>
  </dialog>

  <dialog class="sheet" id="privacy-dialog" aria-labelledby="privacy-title">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close privacy note">${icon('close')}</button>
      <h2 id="privacy-title">Privacy, in plain language</h2>
      <p>This website sets no cookies and loads no third-party analytics, advertising or tracking scripts. Fonts and assets are served from this site.</p>
      <p>The contact form transmits nothing: there is no endpoint. Email and WhatsApp links open your own application, and the message is sent by you, through that provider.</p>
      <p>Your details are used to answer the enquiry and for nothing else. Ask us to delete the conversation and we will.</p>
      <p class="sheet__note">A statement of how this build behaves, not a legal contract. <a href="/privacy">Read the full policy</a>.</p>
    </div>
  </dialog>

  <dialog class="menu" id="site-menu" aria-labelledby="menu-title">
    <div class="menu__inner">
      <div class="menu__top">
        <a class="menu__brand" href="/" aria-label="DENVUP home">${logoMark()}<span>DENVUP</span></a>
        <button class="menu__close" type="button" data-menu-close aria-label="Close menu">${icon('close')}</button>
      </div>
      <h2 class="sr-only" id="menu-title">Site menu</h2>
      <nav class="menu__nav" aria-label="Main">
        <ol>
          ${[['Studio', '/studio'], ['Services', '/services'], ['Lab', '/lab'], ['Concepts', '/concepts'], ['Pricing', '/pricing'], ['Contact', '/contact'], ['Privacy', '/privacy'], ['Terms', '/terms']]
            .map(
              ([label, href], i) =>
                `<li style="--i:${i}"><a href="${href}" data-menu-link><span>${esc(label!)}</span>${icon('arrow-up-right')}</a></li>`,
            )
            .join('')}
        </ol>
      </nav>
      <div class="menu__foot">
        <div><p class="menu__label">New business</p><a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a></div>
        <div><p class="menu__label">Call</p><a href="tel:${esc(brand.phones[0].e164)}">${esc(brand.phones[0].display)}</a></div>
        <div><p class="menu__label">WhatsApp</p><a href="${esc(waLink(brand.phones[0], enquiryText.general))}" target="_blank" rel="noopener noreferrer">Message the studio</a></div>
        <p class="menu__note">${esc(brand.location)} · ${esc(brand.hours)}</p>
      </div>
    </div>
  </dialog>

  <dialog class="cmd" id="command-dialog" aria-labelledby="cmd-title">
    <div class="cmd__inner">
      <h2 class="sr-only" id="cmd-title">Jump to a page or demo</h2>
      <div class="cmd__field">
        ${icon('search')}
        <input id="cmd-input" type="search" placeholder="Jump to a page or a demo…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-autocomplete="list">
        <kbd>Esc</kbd>
      </div>
      <ul class="cmd__list" id="cmd-list" role="listbox" aria-label="Destinations" data-cmd-list></ul>
      <p class="cmd__hint"><span>↑ ↓ to move</span><span>Enter to open</span><span><kbd data-kbd-mod>Ctrl K</kbd> to close</span></p>
    </div>
  </dialog>`;
}

export { closing };
