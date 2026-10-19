import {
  brand,
  closing,
  contact,
  enquiryText,
  footer,
  pricing,
  team,
  teamNote,
  waLink,
} from '../content/site';
import { cta, esc, icon, logoMark, wordmark } from './html';

/* ------------------------------------------------------------------- contact */

export function renderContact(level: 1 | 2 = 2): string {
  const phoneRows = brand.phones
    .map(
      (p, i) => `<li class="direct-line">
        <span class="direct-line__label">${esc(p.label)} ${i + 1}</span>
        <a class="direct-line__value" href="tel:${esc(p.e164)}">${esc(p.display)}</a>
        <a class="direct-line__wa" href="${esc(waLink(p, enquiryText.general))}" target="_blank" rel="noopener noreferrer">WhatsApp ${icon('arrow-up-right')}</a>
      </li>`,
    )
    .join('');

  const projects = contact.projectTypes.map((p) => `<option value="${esc(p)}">${esc(p)}</option>`).join('');
  const budgets = contact.budgets.map((b) => `<option value="${esc(b)}">${esc(b)}</option>`).join('');

  return `<section id="contact" class="contact" data-chapter="contact" data-theme="orange" aria-labelledby="contact-title">
    <div class="contact__grain" aria-hidden="true"></div>
    <div class="contact__inner wrap">
      <div class="contact__head">
        <h${level} class="contact__title" id="contact-title">${esc(contact.title)}</h${level}>
        <p class="contact__intro">${esc(contact.intro)}</p>
      </div>
      <div class="contact__grid">
        <form class="enquiry" id="enquiry" data-enquiry data-endpoint="" novalidate>
          <div class="form-status" data-form-status role="status" aria-live="polite"></div>
          <div class="form-error-summary" data-error-summary role="alert" hidden></div>

          <div class="field">
            <label for="f-name">${esc(contact.fields.name)}</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name">
            <p class="field__error" id="e-name" data-error-for="name" hidden></p>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="f-email">${esc(contact.fields.email)}</label>
              <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="e-email">
              <p class="field__error" id="e-email" data-error-for="email" hidden></p>
            </div>
            <div class="field">
              <label for="f-phone">${esc(contact.fields.phone)}</label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="f-project">${esc(contact.fields.project)}</label>
              <div class="field__select">
                <select id="f-project" name="project" required aria-describedby="e-project">
                  <option value="">Choose one</option>
                  ${projects}
                </select>
                ${icon('arrow-down')}
              </div>
              <p class="field__error" id="e-project" data-error-for="project" hidden></p>
            </div>
            <div class="field">
              <label for="f-budget">${esc(contact.fields.budget)}</label>
              <div class="field__select">
                <select id="f-budget" name="budget">
                  ${budgets}
                </select>
                ${icon('arrow-down')}
              </div>
            </div>
          </div>

          <div class="field">
            <label for="f-message">${esc(contact.fields.message)}</label>
            <textarea id="f-message" name="message" rows="5" required minlength="10" aria-describedby="e-message"></textarea>
            <p class="field__hint"><span data-message-count>0</span> characters. A sentence is enough to start.</p>
            <p class="field__error" id="e-message" data-error-for="message" hidden></p>
          </div>

          <div class="field field--trap" aria-hidden="true">
            <label for="f-company">Company</label>
            <input id="f-company" name="company" type="text" tabindex="-1" autocomplete="off">
          </div>

          <label class="consent">
            <input type="checkbox" name="consent" required aria-describedby="e-consent">
            <span class="consent__box" aria-hidden="true">${icon('check')}</span>
            <span>${esc(contact.fields.consent)}</span>
          </label>
          <p class="field__error" data-error-for="consent" id="e-consent" hidden></p>

          <div class="enquiry__actions">
            <button class="btn btn--solid btn--submit" type="submit" data-submit>
              <span class="btn__label">${esc(contact.fields.submit)}</span>
              <span class="btn__icon">${icon('arrow-up-right')}</span>
            </button>
            <button class="btn btn--line" type="button" data-enquiry-email>
              <span class="btn__label">Email instead</span>
              <span class="btn__icon">${icon('mail')}</span>
            </button>
          </div>
          <p class="enquiry__note">${esc(contact.formNote)}</p>
          <div class="enquiry__fallback" data-enquiry-fallback hidden></div>
        </form>

        <div class="contact__direct" role="group" aria-labelledby="direct-title">
          <h${level === 1 ? 2 : 3} id="direct-title">${esc(contact.directTitle)}</h${level === 1 ? 2 : 3}>
          <div class="direct-mail">
            <a class="direct-mail__value" href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>
            <button type="button" class="copy-btn" data-copy="${esc(brand.email)}">${icon('copy')}<span>Copy email</span></button>
          </div>
          <ul class="direct-lines">${phoneRows}</ul>
          <dl class="direct-facts">
            <div><dt>Where</dt><dd>${esc(brand.location)}</dd></div>
            <div><dt>When</dt><dd>${esc(brand.hours)}</dd></div>
            <div><dt>Reply</dt><dd>${esc(brand.replyNote)}</dd></div>
          </dl>
          <p class="contact__reply">${esc(contact.reply)}</p>
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------- closing */

export function renderClosing(): string {
  return `<section id="closing" class="closing" data-chapter="closing" data-theme="ink" aria-labelledby="closing-title">
    <div class="closing__marquee">
      <div class="marquee" data-marquee>
        <div class="marquee__track" data-marquee-track>
          <span class="marquee__item">Built in the den <em aria-hidden="true">✳</em> Made to move <em aria-hidden="true">✳</em> DENVUP <em aria-hidden="true">✳</em></span>
          <span class="marquee__item" aria-hidden="true">Built in the den <em>✳</em> Made to move <em>✳</em> DENVUP <em>✳</em></span>
        </div>
      </div>
      <button class="marquee__pause" type="button" data-marquee-pause aria-pressed="false" aria-label="Pause moving text">${icon('pause')}</button>
    </div>
    <div class="closing__inner">
      <div class="closing__mark" aria-hidden="true">${logoMark('logo-mask--orange')}</div>
      <h2 class="closing__title" id="closing-title">
        <span data-reveal="rise">${esc(closing.line[0])}</span>
        <span data-reveal="rise">${esc(closing.line[1])}</span>
      </h2>
      <p class="closing__note">${esc(closing.note)}</p>
      <div class="closing__actions">
        ${cta({ label: closing.cta, href: '#contact', variant: 'solid', icon: 'arrow-up-right' })}
        ${cta({ label: 'Back to the top', href: '#top', variant: 'line', icon: 'arrow-down' })}
      </div>
      <div class="closing__ring" aria-hidden="true"></div>
    </div>
  </section>`;
}

/* -------------------------------------------------------------------- footer */

export function renderFooter(): string {
  const columns = footer.columns
    .map(
      (c) => `<nav class="footer__col" aria-label="${esc(c.title)}">
        <h3>${esc(c.title)}</h3>
        <ul>${c.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
      </nav>`,
    )
    .join('');

  return `<footer class="footer" id="footer" data-theme="ink">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="footer__logo" href="#top" aria-label="DENVUP, back to top">${logoMark('logo-mask--orange')}<span>DENVUP</span></a>
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

/* ------------------------------------------------------------------- dialogs */

export function renderDialogs(): string {
  const teamProfiles = team
    .map(
      (m, i) => `<template data-person-template="${i}">
        <p class="profile__initials" aria-hidden="true">${esc(m.initials)}</p>
        <h2 class="profile__name" id="profile-name-${i}">${esc(m.name)}</h2>
        <p class="profile__copy">One of the four people who make up DENVUP. We have deliberately not invented a job title or biography for this page — the work and the first call are the introduction.</p>
        <p class="profile__copy">${esc(teamNote)}</p>
        <div class="profile__actions">
          <a class="btn btn--solid" href="#contact" data-close-dialog><span class="btn__label">Start a conversation</span><span class="btn__icon">${icon('arrow-up-right')}</span></a>
        </div>
      </template>`,
    )
    .join('');

  return `${teamProfiles}
  <dialog class="sheet" id="profile-dialog" aria-label="Team profile">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close profile">${icon('close')}</button>
      <p class="sheet__eyebrow">Team</p>
      <div data-profile-body></div>
    </div>
  </dialog>

  <dialog class="sheet sheet--wide" id="shortcuts-dialog" aria-labelledby="shortcuts-title">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close shortcuts">${icon('close')}</button>
      <p class="sheet__eyebrow">Keyboard</p>
      <h2 id="shortcuts-title">Shortcuts</h2>
      <dl class="shortcuts">
        <div><dt><kbd>?</kbd></dt><dd>Open this guide</dd></div>
        <div><dt><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd>Jump to a section or a demo</dd></div>
        <div><dt><kbd>M</kbd></dt><dd>Open the menu</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>Close a dialog or menu</dd></div>
        <div><dt><kbd>Tab</kbd></dt><dd>Every interactive element has a visible focus state</dd></div>
        <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Move between capability demos</dd></div>
      </dl>
      <p class="sheet__note">${esc(footer.shortcuts)}</p>
    </div>
  </dialog>

  <dialog class="sheet" id="a11y-dialog" aria-labelledby="a11y-title">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close accessibility statement">${icon('close')}</button>
      <p class="sheet__eyebrow">Accessibility</p>
      <h2 id="a11y-title">Accessibility statement</h2>
      <p>This site is built to WCAG 2.2 AA as its baseline: semantic landmarks, one main heading per section, visible focus, keyboard-operable controls, labelled fields, reduced-motion layouts and text contrast checked by hand.</p>
      <p>Motion is optional. A full reduced-motion path keeps every section and all content, removes pinning, parallax, cursor effects and auto-playing movement, and stops decorative canvases.</p>
      <p>The contact form in this build has no server endpoint, so it cannot store or transmit your message. It says so, and gives you a prefilled email and WhatsApp instead. No cookies are set and no third-party analytics or trackers load.</p>
      <p>If something does not work for you, email <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a> with the page and what happened. That is the fastest route to a fix.</p>
      <p class="sheet__note">Tested items and known limitations are listed in TESTING_REPORT.md in the repository.</p>
    </div>
  </dialog>

  <dialog class="sheet" id="privacy-dialog" aria-labelledby="privacy-title">
    <div class="sheet__inner">
      <button class="sheet__close" type="button" data-dialog-close aria-label="Close privacy note">${icon('close')}</button>
      <p class="sheet__eyebrow">Privacy</p>
      <h2 id="privacy-title">Privacy, in plain language</h2>
      <p>This website sets no cookies and loads no third-party analytics, advertising or tracking scripts. Fonts and assets are served from this site, not a font CDN.</p>
      <p>If you use the contact form in this build, nothing is transmitted: there is no endpoint. The email and WhatsApp links open your own mail or messaging application, and the message is sent by you, through that provider, under their terms.</p>
      <p>If you email or message DENVUP, your details are used to reply to that enquiry and for nothing else. Ask us to delete the conversation and we will.</p>
      <p class="sheet__note">This page is a statement of how this build behaves, not a legal contract.</p>
    </div>
  </dialog>

  <dialog class="menu" id="site-menu" aria-labelledby="menu-title">
    <div class="menu__inner">
      <div class="menu__top">
        <a class="menu__brand" href="#top" aria-label="DENVUP home">${logoMark()}<span>DENVUP</span></a>
        <button class="menu__close" type="button" data-menu-close aria-label="Close menu">${icon('close')}</button>
      </div>
      <h2 class="sr-only" id="menu-title">Site menu</h2>
      <nav class="menu__nav" aria-label="Main">
        <ol>
          ${[
            ['Studio', '#hero'],
            ['Services', '#services'],
            ['Capabilities', '#capabilities'],
            ['Process', '#process'],
            ['Technologies', '#technologies'],
            ['Team', '#team'],
            ['Concepts', '#showcase'],
            ['Pricing', '#pricing'],
            ['Questions', '#faq'],
            ['Contact', '#contact'],
          ]
            .map(
              ([label, href], i) =>
                `<li style="--i:${i}"><a href="${href}" data-menu-link><span>${esc(label)}</span>${icon('arrow-up-right')}</a></li>`,
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
      <h2 class="sr-only" id="cmd-title">Jump to a section or demo</h2>
      <div class="cmd__field">
        ${icon('search')}
        <input id="cmd-input" type="search" placeholder="Jump to a section or a demo…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-autocomplete="list">
        <kbd>Esc</kbd>
      </div>
      <ul class="cmd__list" id="cmd-list" role="listbox" aria-label="Destinations" data-cmd-list></ul>
      <p class="cmd__hint"><span>↑ ↓ to move</span><span>Enter to open</span><span><kbd data-kbd-mod>Ctrl K</kbd> to close</span></p>
    </div>
  </dialog>`;
}

export { wordmark, pricing };
