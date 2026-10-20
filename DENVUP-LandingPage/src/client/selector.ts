/**
 * The services selector on the home page, and the pinned deep-dive rail.
 *
 * Both are keyboard-first: the rows are real buttons in a list, arrow keys move
 * between them, and the panel that changes is announced through a live region
 * rather than animated silently.
 */

import { announce } from './env';

function initServicesSelector(): void {
  const root = document.querySelector<HTMLElement>('[data-svc-selector]');
  if (!root) return;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-svc-tab]')];
  const highlight = root.querySelector<HTMLElement>('[data-svc-highlight]');
  const rows = root.querySelector<HTMLElement>('.svc-rows');
  if (!tabs.length || !highlight || !rows) return;

  const panels = [...root.querySelectorAll<HTMLElement>('[data-svc-panel]')];
  const arts = [...root.querySelectorAll<HTMLElement>('[data-svc-art]')];

  const place = (index: number) => {
    const row = tabs[index]?.closest<HTMLElement>('.svc-row');
    if (!row) return;
    const top = row.offsetTop;
    highlight.style.height = `${row.offsetHeight}px`;
    highlight.style.setProperty('--hl-y', `${top}px`);
  };

  const select = (index: number, announceIt = false) => {
    const slug = tabs[index]?.dataset.svcTab;
    if (!slug) return;
    tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.svcPanel !== slug;
    });
    arts.forEach((art) => {
      art.hidden = art.dataset.svcArt !== slug;
    });
    place(index);
    if (announceIt) announce(`${tabs[index]?.querySelector('.svc-row__name')?.textContent ?? ''} selected`);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, true));
    tab.addEventListener('keydown', (event) => {
      const next =
        event.key === 'ArrowDown' ? i + 1 : event.key === 'ArrowUp' ? i - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
      if (next < 0) return;
      event.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      target?.focus();
      select((next + tabs.length) % tabs.length);
    });
  });

  select(0);
  const relayout = () => {
    const active = tabs.findIndex((t) => t.getAttribute('aria-pressed') === 'true');
    place(Math.max(0, active));
  };
  window.addEventListener('resize', relayout);
  if (document.fonts?.ready) void document.fonts.ready.then(relayout);
}

/**
 * The pinned deep dives: the section is tall, the figures stick, and each
 * figure reports which service is beside it. The rail is a set of anchor
 * buttons, so it works without any scroll listener at all when motion is off.
 */
function initDives(): void {
  const section = document.querySelector<HTMLElement>('[data-dives]');
  const rail = document.querySelector<HTMLElement>('[data-dives-rail]');
  if (!section || !rail) return;
  const dives = [...section.querySelectorAll<HTMLElement>('[data-dive]')];
  if (!dives.length) return;

  rail.replaceChildren(
    ...dives.map((dive, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dives__dot';
      btn.setAttribute('aria-label', `Go to ${dive.querySelector('h3')?.textContent ?? `service ${i + 1}`}`);
      btn.addEventListener('click', () => {
        dive.scrollIntoView({ block: 'start', behavior: 'smooth' });
        const heading = dive.querySelector<HTMLElement>('h3');
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
      });
      li.append(btn);
      return li;
    }),
  );

  if (typeof IntersectionObserver === 'undefined') return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const index = dives.indexOf(entry.target as HTMLElement);
        const dot = rail.querySelectorAll<HTMLButtonElement>('.dives__dot')[index];
        if (!dot) continue;
        dot.dataset.active = String(entry.isIntersecting);
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  dives.forEach((dive) => io.observe(dive));
}

export function initSelector(): void {
  initServicesSelector();
  initDives();
}
