/**
 * Mounts the interactive studies.
 *
 * On /lab and in the demos chapters, a study is only mounted when it comes
 * near the viewport, and it is destroyed when it is far away again, so 148
 * canvases never run at once. Replay rebuilds one study from scratch.
 */

import { mountEmbed } from './labs';
import { flashFrame, quarterTurn, revealRise, reenter, rollValue, stagger, travel } from './motion-feedback';

interface Mounted {
  destroy: (() => void) | null;
  host: HTMLElement;
}

const live = new Map<HTMLElement, Mounted>();
let observer: IntersectionObserver | null = null;
let bound = false;

function mount(host: HTMLElement): void {
  if (live.has(host)) return;
  const slug = host.dataset.lab ?? '';
  const mode = Number(host.dataset.mode ?? 0);
  const label = host.dataset.label ?? 'Interactive study';
  const fallback = host.querySelector('.demo-card__fallback, .lab-card__fallback, .cap__fallback');
  const destroy = mountEmbed(host, slug, mode, label);
  if (destroy) {
    fallback?.remove();
    host.classList.add('is-live');
    live.set(host, { destroy, host });
  }
}

function unmount(host: HTMLElement): void {
  const entry = live.get(host);
  if (!entry) return;
  entry.destroy?.();
  live.delete(host);
  host.classList.remove('is-live');
}

function mountVisible(): void {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const host = entry.target as HTMLElement;
        if (entry.isIntersecting) mount(host);
        else if (Math.abs(entry.boundingClientRect.top) > window.innerHeight * 2) unmount(host);
      }
    },
    { rootMargin: '240px 0px 240px 0px', threshold: 0.01 },
  );
  document.querySelectorAll<HTMLElement>('[data-lab-host]').forEach((host) => observer?.observe(host));
}

function bindReplay(): void {
  document.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-lab-replay]');
    if (!button) return;
    const host = button.closest('[data-lab-card], [data-ch-part], [data-lab-group]')?.querySelector<HTMLElement>('[data-lab-host]');
    if (!host) return;
    unmount(host);
    mount(host);
    // Say that it restarted: the frame answers, the control turns, the study
    // arrives again. The demo itself is untouched by this layer.
    flashFrame(host);
    const icon = button.querySelector('svg');
    if (icon) quarterTurn(icon);
    reenter(host);
  });
}

/* ------------------------------------------------------------------ filters */

let filter = 'all';
let query = '';
let searchTimer = 0;

/* One shared rule travels between the tabs. Everything is measured from the
   live DOM, so it survives a different tab count on a different page. */
let rule: HTMLElement | null = null;
let tabsHost: HTMLElement | null = null;

function ensureRule(): void {
  if (rule?.isConnected) return;
  rule = null;
  tabsHost = null;
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-lab-filter]')];
  const host = tabs[0]?.parentElement;
  if (!host || tabs.length < 2) return;
  const el = document.createElement('span');
  el.className = 'lab-tabs__rule';
  el.setAttribute('aria-hidden', 'true');
  host.classList.add('has-rule');
  host.prepend(el);
  rule = el;
  tabsHost = host;
}

function placeRule(animateTravel = true): void {
  ensureRule();
  if (!rule || !tabsHost) return;
  const tabs = [...tabsHost.querySelectorAll<HTMLButtonElement>('[data-lab-filter]')];
  const active = tabs.find((tab) => tab.getAttribute('aria-pressed') === 'true');
  if (!active) return;
  // The tabs wrap to three rows at desktop width, so the rule travels in two
  // dimensions rather than being disabled the moment the list wraps.
  travel(rule, tabsHost, active, animateTravel);
}

/** Cards that were hidden and are now visible rise in, capped so it stays quick. */
const wasVisible = new WeakMap<HTMLElement, boolean>();
let firstFilterRun = true;

// Twelve is the cap for both the delay and the number of elements animated:
// going from one group back to “All” restores 143 cards, and 143 concurrent
// layers is not something to spend on a mid-range phone for a list the person
// is about to scroll anyway. The first screenful arrives; the rest are simply
// already there, below the fold.
const REVEAL_CAP = 12;

function revealCards(cards: HTMLElement[], shown: Set<HTMLElement>): void {
  let arrival = 0;
  cards.forEach((card) => {
    const before = wasVisible.get(card) ?? false;
    const now = shown.has(card);
    if (now && !before && !firstFilterRun && arrival < REVEAL_CAP) {
      card.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 180, delay: stagger(arrival++), easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
      );
    }
    wasVisible.set(card, now);
  });
  firstFilterRun = false;
}

function applyFilters(): void {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-lab-card]')];
  if (!cards.length) return;
  const visible = new Set<HTMLElement>();
  cards.forEach((card) => {
    const section = card.closest<HTMLElement>('[data-lab-section]')?.dataset.labSection ?? '';
    const text = card.dataset.search ?? '';
    const matchFilter = filter === 'all' || section === filter;
    const matchQuery = !query || text.includes(query);
    const match = matchFilter && matchQuery;
    card.hidden = !match;
    if (match) visible.add(card);
  });
  document.querySelectorAll<HTMLElement>('[data-lab-section]').forEach((section) => {
    const any = [...section.querySelectorAll<HTMLElement>('[data-lab-card]')].some((card) => !card.hidden);
    section.hidden = !any;
  });
  revealCards(cards, visible);
  const shown = visible.size;
  const count = document.querySelector<HTMLElement>('[data-lab-count]');
  if (count) rollValue(count, String(shown));
  const empty = document.querySelector<HTMLElement>('[data-lab-empty]');
  if (empty) {
    const wasHidden = empty.hidden;
    empty.hidden = shown !== 0;
    if (shown === 0 && wasHidden) revealRise(empty, 8);
  }
  document.querySelectorAll<HTMLButtonElement>('[data-lab-filter]').forEach((tab) => {
    tab.setAttribute('aria-pressed', String(tab.dataset.labFilter === filter));
  });
  // After the pressed state is written: the rule travels to the new tab, not
  // to the one that was pressed a moment ago.
  placeRule();
}

function bindFilters(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-lab-filter]')];
  if (!tabs.length || bound) return;
  bound = true;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filter = tab.dataset.labFilter ?? 'all';
      applyFilters();
    });
  });
  document.querySelector<HTMLInputElement>('[data-lab-search]')?.addEventListener('input', (event) => {
    const next = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // 120 ms: long enough to settle a word, short enough to feel immediate.
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      query = next;
      applyFilters();
    }, 120);
  });
  document.querySelector<HTMLElement>('[data-lab-reset]')?.addEventListener('click', () => {
    filter = 'all';
    query = '';
    const input = document.querySelector<HTMLInputElement>('[data-lab-search]');
    if (input) input.value = '';
    applyFilters();
  });
}

export function initLabLibrary(): void {
  initLabResize();
  mountVisible();
  if (!bound) {
    bindReplay();
    bindFilters();
  }
  if (document.querySelector('[data-lab-card]')) applyFilters();
}

/** A width change can rewrap the tabs, so the rule is re-measured, not animated. */
let resizeBound = false;
export function initLabResize(): void {
  if (resizeBound) return;
  resizeBound = true;
  window.addEventListener(
    'resize',
    () => {
      if (rule?.isConnected) placeRule(false);
    },
    { passive: true },
  );
}
