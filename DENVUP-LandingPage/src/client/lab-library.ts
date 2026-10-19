/**
 * Mounts the interactive studies.
 *
 * On /lab and in the demos chapters, a study is only mounted when it comes
 * near the viewport, and it is destroyed when it is far away again, so 148
 * canvases never run at once. Replay rebuilds one study from scratch.
 */

import { mountEmbed } from './labs';

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
  });
}

/* ------------------------------------------------------------------ filters */

let filter = 'all';
let query = '';

function applyFilters(): void {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-lab-card]')];
  if (!cards.length) return;
  let shown = 0;
  cards.forEach((card) => {
    const section = card.closest<HTMLElement>('[data-lab-section]')?.dataset.labSection ?? '';
    const text = card.dataset.search ?? '';
    const matchFilter = filter === 'all' || section === filter;
    const matchQuery = !query || text.includes(query);
    const visible = matchFilter && matchQuery;
    card.hidden = !visible;
    if (visible) shown += 1;
  });
  document.querySelectorAll<HTMLElement>('[data-lab-section]').forEach((section) => {
    const any = [...section.querySelectorAll<HTMLElement>('[data-lab-card]')].some((card) => !card.hidden);
    section.hidden = !any;
  });
  const count = document.querySelector<HTMLElement>('[data-lab-count]');
  if (count) count.textContent = String(shown);
  const empty = document.querySelector<HTMLElement>('[data-lab-empty]');
  if (empty) empty.hidden = shown !== 0;

  document.querySelectorAll<HTMLButtonElement>('[data-lab-filter]').forEach((tab) => {
    tab.setAttribute('aria-pressed', String(tab.dataset.labFilter === filter));
  });
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
    query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    applyFilters();
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
  mountVisible();
  if (!bound) {
    bindReplay();
    bindFilters();
  }
  if (document.querySelector('[data-lab-card]')) applyFilters();
}
