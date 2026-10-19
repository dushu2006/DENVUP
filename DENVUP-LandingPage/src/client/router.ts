/**
 * Progressive-enhancement soft navigation.
 *
 * Every route is a real, prerendered HTML file. When the browser supports
 * View Transitions and fetch, a same-origin link is fetched, only <main> is
 * swapped inside document.startViewTransition, the title and description are
 * updated, and history is pushed. The header, the stage canvas and the cursor
 * live outside <main>, so they are never torn down.
 *
 * Anything unexpected — a failed fetch, a non-HTML response, a missing main —
 * falls back to a normal navigation. With JavaScript off, links navigate
 * normally and every page still works.
 */

import { announce } from './env';

const LOADING = 'is-routing';
let controller: AbortController | null = null;
let current = window.location.pathname;
const scrollMemory = new Map<string, number>();

function reduced(): boolean {
  return document.documentElement.dataset.motion === 'reduced';
}

export function supportsSoftNav(): boolean {
  return 'fetch' in window && 'DOMParser' in window && 'history' in window && 'pushState' in history;
}

function setLoading(on: boolean): void {
  document.documentElement.classList.toggle(LOADING, on);
}

function updateHead(next: Document): void {
  const title = next.querySelector('title')?.textContent;
  if (title) document.title = title;

  const pairs: Array<[string, string]> = [
    ['meta[name="description"]', 'description'],
    ['link[rel="canonical"]', 'href'],
    ['meta[property="og:title"]', 'content'],
    ['meta[property="og:description"]', 'content'],
    ['meta[property="og:url"]', 'content'],
    ['meta[name="twitter:title"]', 'content'],
    ['meta[name="twitter:description"]', 'content'],
  ];

  for (const [selector, attr] of pairs) {
    const incoming = next.querySelector(selector);
    const existing = document.querySelector(selector);
    if (incoming && existing) existing.setAttribute(attr, incoming.getAttribute(attr) ?? '');
  }

  const chapter = next.documentElement.dataset.chapter;
  if (chapter) document.documentElement.dataset.chapter = chapter;
}

function syncNav(path: string): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-route-head] nav a, .footer nav a').forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    const active = href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  document.querySelectorAll<HTMLAnchorElement>('.head-nav a').forEach((link) => {
    if (link.getAttribute('href') === '/contact') link.setAttribute('aria-current', path === '/contact' ? 'page' : 'false');
  });
}

function focusMain(main: HTMLElement): void {
  const heading = main.querySelector<HTMLElement>('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  } else {
    main.focus({ preventScroll: true });
  }
}

function remount(): void {
  window.DENVUP?.remount?.();
}

async function swap(href: string, main: HTMLElement, next: Document, push: boolean, restore: boolean): Promise<void> {
  const incoming = next.querySelector<HTMLElement>('[data-route-main]');
  if (!incoming) throw new Error('No main element in the response');

  const apply = () => {
    main.replaceChildren(...Array.from(incoming.childNodes));
    document.body.dataset.route = href;
    const chapter = next.documentElement.dataset.chapter;
    if (chapter) document.documentElement.dataset.chapter = chapter;
    updateHead(next);
    syncNav(href);
    if (push) history.pushState({ route: href }, '', href);
    const y = restore ? scrollMemory.get(href) ?? 0 : 0;
    window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });
    remount();
    focusMain(main);
    current = href;
    announce(`${next.title.replace(' — DENVUP', '')} page loaded`);
  };

  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (doc.startViewTransition && !reduced()) {
    const transition = doc.startViewTransition(apply);
    await transition.finished.catch(() => undefined);
  } else {
    apply();
  }
}

export async function navigate(href: string, options: { push?: boolean; restore?: boolean } = {}): Promise<void> {
  const { push = true, restore = false } = options;
  if (!supportsSoftNav()) {
    window.location.assign(href);
    return;
  }
  controller?.abort();
  controller = new AbortController();
  const signal = controller.signal;

  setLoading(true);
  if (push) scrollMemory.set(current, window.scrollY);

  try {
    const response = await fetch(href, {
      signal,
      headers: { Accept: 'text/html', 'X-DENVUP-Route': '1' },
      credentials: 'same-origin',
      redirect: 'follow',
    });
    const type = response.headers.get('content-type') ?? '';
    if (!response.ok || !type.includes('text/html')) throw new Error(`Bad response ${response.status}`);

    const text = await response.text();
    if (signal.aborted) return;
    const next = new DOMParser().parseFromString(text, 'text/html');
    const main = document.querySelector<HTMLElement>('[data-route-main]');
    if (!main) throw new Error('No main element to swap');

    await swap(href, main, next, push, restore);
  } catch (error) {
    if (signal.aborted) return;
    // Any failure means the visitor gets the real page, not a broken one.
    window.location.assign(href);
  } finally {
    if (!signal.aborted) setLoading(false);
  }
}

function closeMenus(): void {
  document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((dialog) => dialog.close());
}

export function initRouter(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download') || link.dataset.native === 'true') return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    event.preventDefault();
    closeMenus();
    void navigate(url.pathname + url.search + url.hash);
  });

  window.addEventListener('popstate', () => {
    void navigate(window.location.pathname + window.location.search, { push: false, restore: true });
  });

  // Restore the previous scroll position when the browser restores a page.
  window.addEventListener('pageshow', (event) => {
    if ((event as PageTransitionEvent).persisted) setLoading(false);
  });
}
