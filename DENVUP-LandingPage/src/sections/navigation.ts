/**
 * Navigation.
 *
 * The full-screen menu, the command palette, the floating journey dock and the
 * back-to-top control. Both overlays trap focus while they are open and give
 * it back when they close, and every shortcut is also an ordinary control.
 */

import { $, $$ } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import { scrollTo } from '../core/scroll';
import { navSections } from '../data/site';
import { MENU_ENTRIES } from '../data/routes';
import { techniques } from '../data/techniques';
import { allDemos, searchDemos } from '../demos/registry';

/**
 * A section in the floating journey dock.
 *
 * The dock is rebuilt for every route, so it always lists the sections of
 * the view the reader is actually in rather than a fixed set of anchors.
 */
export interface DockSection {
  id: string;
  index: string;
  label: string;
}

let dockListEl: HTMLElement | null = null;

/** Rebuild the journey dock for the view that is now on screen. */
export function setDockSections(sections: DockSection[]): void {
  if (!dockListEl) return;
  const list = dockListEl;
  list.replaceChildren();
  sections.forEach((section) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.innerHTML = `<span class="dock__num">${section.index}</span><span>${section.label}</span>`;
    item.appendChild(link);
    list.appendChild(item);
  });
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;
  const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (node) => node.offsetParent !== null || node === document.activeElement,
  );
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function initNavigation(): () => void {
  const cleanups: (() => void)[] = [];

  // ------------------------------------------------------------------ //
  // Full-screen menu
  // ------------------------------------------------------------------ //
  const menu = $<HTMLElement>('#menu');
  const menuToggle = $<HTMLButtonElement>('#menu-toggle');
  const menuList = $<HTMLElement>('#menu-list');
  const menuChapters = $<HTMLElement>('#menu-chapters');

  if (menu && menuList && menuToggle) {
    /*
     * The menu is the site's map: every route first, then the chapters of
     * the home page. The chapter links point at `/#id`, so they work as
     * ordinary links if the router is not running at all.
     */
    MENU_ENTRIES.forEach((entry) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = entry.href;
      link.className = 'menu__item';
      link.dataset.route = entry.href;
      link.innerHTML = `<span class="menu__item-index">${entry.index}</span><span class="menu__item-label">${entry.label}</span><span class="menu__item-blurb">${entry.blurb}</span>`;
      item.appendChild(link);
      menuList.appendChild(item);
    });

    if (menuChapters) {
      navSections.forEach((section) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/#${section.id}`;
        link.className = 'menu__item menu__item--chapter';
        link.innerHTML = `<span class="menu__item-index">${section.index}</span><span class="menu__item-label">${section.label}</span><span class="menu__item-blurb">${section.blurb}</span>`;
        item.appendChild(link);
        menuChapters.appendChild(item);
      });
    }

    let open = false;
    let lastFocused: HTMLElement | null = null;

    const setOpen = (next: boolean) => {
      if (next === open) return;
      open = next;
      menuToggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
      if (next) {
        lastFocused = document.activeElement as HTMLElement;
        menu.hidden = false;
        /*
         * `is-open` raises the ink curtain behind the menu. Without it the
         * curtain stays collapsed and the menu's light type sits directly on
         * the page, which is unreadable on the paper chapters.
         */
        menu.classList.add('is-open');
        const items = $$('.menu__item', menu);
        if (env.reducedMotion) {
          gsap.set(items, { autoAlpha: 1, y: 0 });
        } else {
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.035, delay: 0.12 },
          );
        }
        (menu.querySelector<HTMLElement>('.menu__item') as HTMLElement | null)?.focus();
      } else {
        const finish = () => {
          menu.hidden = true;
        };
        menu.classList.remove('is-open');
        const items = $$('.menu__item', menu);
        if (env.reducedMotion) {
          finish();
        } else {
          gsap.to(items, { autoAlpha: 0, y: 18, duration: 0.24, ease: 'power2.in' });
          // The curtain takes 760ms to fall; hide the dialog once it has.
          window.setTimeout(finish, 780);
        }
        lastFocused?.focus();
      }
    };

    const onToggle = () => setOpen(!open);
    menuToggle.addEventListener('click', onToggle);
    cleanups.push(() => menuToggle.removeEventListener('click', onToggle));

    menu.addEventListener('click', (event) => {
      if (event.target === menu || (event.target as HTMLElement).closest('.menu__panel') === null) {
        setOpen(false);
      }
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('.menu__item');
      if (link) setOpen(false);
    });

    const onMenuKey = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      trapFocus(menu, event);
    };
    document.addEventListener('keydown', onMenuKey);
    cleanups.push(() => document.removeEventListener('keydown', onMenuKey));
  }

  // ------------------------------------------------------------------ //
  // Command palette
  // ------------------------------------------------------------------ //
  const cmdk = $<HTMLElement>('#cmdk');
  const cmdkInput = $<HTMLInputElement>('#cmdk-input');
  const cmdkResults = $<HTMLElement>('#cmdk-results');
  const cmdkTrigger = $<HTMLButtonElement>('#cmd-trigger');

  if (cmdk && cmdkInput && cmdkResults && cmdkTrigger) {
    type Result = { label: string; hint: string; kind: string; run: () => void };

    const buildResults = (query: string): Result[] => {
      const needle = query.trim().toLowerCase();
      const results: Result[] = [];

      MENU_ENTRIES.forEach((entry) => {
        if (needle && !`${entry.label} ${entry.blurb}`.toLowerCase().includes(needle)) return;
        results.push({
          label: `${entry.index} — ${entry.label}`,
          hint: entry.blurb,
          kind: 'Page',
          run: () => {
            if (entry.href === '/') scrollTo('#top', -60);
            else location.href = entry.href;
          },
        });
      });

      navSections.forEach((section) => {
        if (needle && !`${section.label} ${section.blurb}`.toLowerCase().includes(needle)) return;
        results.push({
          label: `${section.index} — ${section.label}`,
          hint: section.blurb,
          kind: 'Chapter',
          run: () => scrollTo(`#${section.id}`, -60),
        });
      });

      if (needle) {
        const matched = techniques
          .filter(
            (technique) =>
              technique.name.toLowerCase().includes(needle) ||
              technique.catLabel.toLowerCase().includes(needle) ||
              String(technique.id) === needle,
          )
          .slice(0, 8);
        matched.forEach((technique) => {
          results.push({
            label: `T${String(technique.id).padStart(3, '0')} — ${technique.name}`,
            hint: technique.catLabel,
            kind: 'Technique',
            run: () => scrollTo('#library', -60),
          });
        });

        searchDemos(query)
          .slice(0, 5)
          .forEach((demo) => {
            results.push({
              label: demo.title,
              hint: demo.summary,
              kind: 'Demo',
              run: () => scrollTo('#library', -60),
            });
          });
      }

      return results.slice(0, 12);
    };

    let activeIndex = 0;
    let current: Result[] = [];

    const render = () => {
      current = buildResults(cmdkInput.value);
      cmdkResults.innerHTML = '';
      if (!current.length) {
        const empty = document.createElement('li');
        empty.className = 'cmdk__empty';
        empty.textContent = 'Nothing matches that yet.';
        cmdkResults.appendChild(empty);
        return;
      }
      current.forEach((result, index) => {
        const item = document.createElement('li');
        item.className = 'cmdk__result';
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(index === activeIndex));
        item.innerHTML = `<span class="cmdk__result-kind">${result.kind}</span><span class="cmdk__result-label">${result.label}</span><span class="cmdk__result-hint">${result.hint}</span>`;
        item.addEventListener('click', () => {
          result.run();
          close();
        });
        cmdkResults.appendChild(item);
      });
    };

    let open = false;
    let lastFocused: HTMLElement | null = null;

    const openPalette = () => {
      if (open) return;
      open = true;
      lastFocused = document.activeElement as HTMLElement;
      cmdk.hidden = false;
      // Raises the scrim behind the panel — without it the palette floats
      // over the page with nothing dimming what is behind it.
      cmdk.classList.add('is-open');
      document.body.classList.add('is-locked');
      cmdkInput.value = '';
      activeIndex = 0;
      render();
      cmdkInput.focus();
      if (!env.reducedMotion) {
        gsap.fromTo(
          cmdk.querySelector('.cmdk__panel'),
          { autoAlpha: 0, y: -14, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out' },
        );
      }
    };

    const close = () => {
      if (!open) return;
      open = false;
      cmdk.classList.remove('is-open');
      cmdk.hidden = true;
      document.body.classList.remove('is-locked');
      lastFocused?.focus();
    };

    cmdkTrigger.addEventListener('click', openPalette);
    cleanups.push(() => cmdkTrigger.removeEventListener('click', openPalette));

    cmdk.querySelectorAll('[data-cmdk-close]').forEach((node) => {
      node.addEventListener('click', close);
    });

    cmdkInput.addEventListener('input', () => {
      activeIndex = 0;
      render();
    });

    const onKey = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = Math.min(current.length - 1, activeIndex + 1);
        render();
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = Math.max(0, activeIndex - 1);
        render();
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        current[activeIndex]?.run();
        close();
        return;
      }
      trapFocus(cmdk, event);
    };
    document.addEventListener('keydown', onKey);
    cleanups.push(() => document.removeEventListener('keydown', onKey));
  }

  // ------------------------------------------------------------------ //
  // Global shortcuts
  // ------------------------------------------------------------------ //
  const onGlobalKey = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const typing =
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable);
    if (typing) return;
    if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      $<HTMLButtonElement>('#cmd-trigger')?.click();
      return;
    }
    // ⌘K / Ctrl+K — the shortcut every command palette is expected to answer to.
    if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      $<HTMLButtonElement>('#cmd-trigger')?.click();
    }
  };
  document.addEventListener('keydown', onGlobalKey);
  cleanups.push(() => document.removeEventListener('keydown', onGlobalKey));

  // ------------------------------------------------------------------ //
  // Journey dock
  // ------------------------------------------------------------------ //
  const dock = $<HTMLElement>('#dock');
  const dockList = $<HTMLElement>('#dock-list');
  const dockToggle = $<HTMLButtonElement>('[data-dock-toggle]');

  if (dock && dockList && dockToggle) {
    /*
     * The dock lists the sections of the view that is on screen. It is
     * rebuilt by `setDockSections` whenever a route changes, so the dock
     * always describes where the reader actually is.
     */
    dockListEl = dockList;

    const onToggle = () => {
      const next = dockToggle.getAttribute('aria-expanded') !== 'true';
      dockToggle.setAttribute('aria-expanded', String(next));
      dockList.hidden = !next;
    };
    dockToggle.addEventListener('click', onToggle);
    cleanups.push(() => dockToggle.removeEventListener('click', onToggle));
  }

  // ------------------------------------------------------------------ //
  // Back to top
  // ------------------------------------------------------------------ //
  const toTop = $<HTMLButtonElement>('#to-top');
  if (toTop) {
    const onClick = () => scrollTo('#top', 0);
    toTop.addEventListener('click', onClick);
    cleanups.push(() => toTop.removeEventListener('click', onClick));

    const onScroll = () => {
      const ratio = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      toTop.hidden = ratio < 0.6;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));
  }

  // ------------------------------------------------------------------ //
  // Floating contact button on small screens
  // ------------------------------------------------------------------ //
  if (env.narrow) {
    const float = document.createElement('a');
    float.className = 'float-contact';
    float.href = '#contact';
    float.textContent = 'Start a project';
    document.body.appendChild(float);
    cleanups.push(() => float.remove());
  }

  // ------------------------------------------------------------------ //
  // The active section is marked in the nav and the dock
  // ------------------------------------------------------------------ //
  return () => cleanups.forEach((fn) => fn());
}

/**
 * Mark the route that is on screen in the primary navigation.
 *
 * The indicator is a single element that slides between links, so the
 * active state is a movement rather than a colour change.
 */
export function initNavigationForRoute(routeId: string): void {
  const list = $<HTMLElement>('#site-nav-list');
  const indicator = $<HTMLElement>('#nav-indicator');
  if (!list) return;

  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a[data-route]'));
  links.forEach((link) => {
    const active = link.dataset.route === routeId || (routeId === 'service' && link.dataset.route === 'services');
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  if (!indicator) return;
  const active = links.find((link) => link.classList.contains('is-active'));
  if (!active) {
    indicator.classList.remove('is-visible');
    return;
  }
  const listRect = list.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  indicator.style.setProperty('--nav-x', `${rect.left - listRect.left}px`);
  indicator.style.setProperty('--nav-w', `${rect.width}px`);
  indicator.classList.add('is-visible');
}

/** Used by main.ts to mark the current section in the nav and dock. */
export function markActiveSection(id: string): void {
  $$('[data-nav-link]').forEach((link) => {
    const target = link.getAttribute('href');
    const active = target === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  $$('.dock__list a').forEach((link) => {
    const target = link.getAttribute('href');
    const active = target === `#${id}`;
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

export { allDemos };
