/**
 * Tiny, dependency-free HTML rendering helpers.
 * Everything is prerendered to static HTML; strings here are server-rendered
 * once at build time and then enhanced in the browser.
 */

export const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-down'
  | 'arrow-left'
  | 'plus'
  | 'close'
  | 'play'
  | 'pause'
  | 'search'
  | 'copy'
  | 'check'
  | 'mail'
  | 'phone'
  | 'whatsapp'
  | 'menu'
  | 'sound-on'
  | 'sound-off'
  | 'replay'
  | 'expand'
  | 'command';

const paths: Record<IconName, string> = {
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M6 18 18 6M8 6h10v10"/>',
  'arrow-down': '<path d="M12 4v15M6 13l6 6 6-6"/>',
  'arrow-left': '<path d="M20 12H5M11 18l-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M15 5.5H6a1 1 0 0 0-1 1V16"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/>',
  phone: '<path d="M7.5 3.5h-2A2 2 0 0 0 3.5 6c0 8 6.5 14.5 14.5 14.5a2 2 0 0 0 2-2v-2l-4-1.5-2 2-.5-.5a15 15 0 0 1-5-5l-.5-.5 2-2z"/>',
  whatsapp:
    '<path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.7Z"/><path d="M8.6 8.4c.3-.6 1-.6 1.3-.2l.9 1.2c.2.3.1.6-.1.8l-.5.5c.5 1.1 1.3 1.9 2.4 2.4l.5-.5c.2-.2.5-.3.8-.1l1.2.9c.4.3.4 1-.2 1.3-1.6.9-3.3-.2-4.6-1.5s-2.4-3-1.7-4.8Z"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  'sound-on': '<path d="M5 9.5h3L12 6v12l-4-3.5H5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  'sound-off': '<path d="M5 9.5h3L12 6v12l-4-3.5H5z"/><path d="m16 10 4 4M20 10l-4 4"/>',
  replay: '<path d="M4 10a8 8 0 1 1 2 8"/><path d="M4 5v5h5"/>',
  expand: '<path d="M9 4H4v5M15 20h5v-5M4 4l6 6M20 20l-6-6"/>',
  command: '<path d="M9 6.5A2.5 2.5 0 1 0 6.5 9H9m6 0h2.5A2.5 2.5 0 1 0 15 6.5V9M9 15H6.5A2.5 2.5 0 1 0 9 17.5V15m6 0v2.5a2.5 2.5 0 1 0 2.5-2.5H15M9 9h6v6H9z"/>',
};

export function icon(name: IconName, cls = ''): string {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}

/** The supplied mark used as a CSS mask so it can inherit the chapter colour. */
export function logoMark(cls = ''): string {
  return `<span class="logo-mask ${cls}" aria-hidden="true"></span>`;
}

export function wordmark(cls = ''): string {
  return `<span class="wordmark ${cls}" aria-hidden="true">DENVUP</span>`;
}

export interface CtaOptions {
  label: string;
  href: string;
  variant?: 'solid' | 'line' | 'ghost';
  icon?: IconName;
  attrs?: string;
  data?: Record<string, string>;
}

export function cta({ label, href, variant = 'solid', icon: iconName = 'arrow-up-right', attrs = '', data = {} }: CtaOptions): string {
  const dataAttrs = Object.entries(data)
    .map(([k, v]) => ` data-${k}="${esc(v)}"`)
    .join('');
  return `<a class="btn btn--${variant}" href="${esc(href)}"${dataAttrs} ${attrs}>
    <span class="btn__label">${esc(label)}</span>
    <span class="btn__icon">${icon(iconName)}</span>
  </a>`;
}

export type HeadingLevel = 2 | 3 | 4;

export function sectionHead(opts: {
  id?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  level?: HeadingLevel;
  align?: 'start' | 'center';
  theme?: string;
  extra?: string;
}): string {
  const level = opts.level ?? 2;
  return `<header class="section-head section-head--${opts.align ?? 'start'}"${opts.theme ? ` data-theme="${opts.theme}"` : ''}>
    ${opts.eyebrow ? `<p class="section-head__eyebrow"><span class="dot" aria-hidden="true"></span>${esc(opts.eyebrow)}</p>` : ''}
    <h${level} class="section-head__title"${opts.id ? ` id="${esc(opts.id)}"` : ''}>${opts.title}</h${level}>
    ${opts.lede ? `<p class="section-head__lede">${opts.lede}</p>` : ''}
    ${opts.extra ?? ''}
  </header>`;
}

/** Multi-colour word sequence for kinetic headings. */
export function splitWords(text: string, cls = 'word'): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => `<span class="${cls}" aria-hidden="true">${esc(w)}</span>`)
    .join(' ');
}

export function externalLink(label: string, href: string, attrs = ''): string {
  return `<a href="${esc(href)}" ${attrs} rel="noopener noreferrer" target="_blank">${label}</a>`;
}

export const mailto = (subject: string, body: string): string =>
  `mailto:${'denvupforyou@gmail.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
