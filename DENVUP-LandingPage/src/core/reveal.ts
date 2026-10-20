/**
 * Viewport reveal.
 *
 * A single IntersectionObserver releases every `[data-reveal]` element. The
 * CSS keeps them visible when JavaScript has not booted (`.js` class on
 * <html> is only added by main.ts), so content is never trapped behind a
 * script failure.
 */

import { $, $$ } from './dom';
import { env } from './env';
import { gsap } from './motion';

let observer: IntersectionObserver | null = null;

export function initReveal(): void {
  const items = $$('[data-reveal]');
  if (!items.length) return;

  if (env.reducedMotion) {
    items.forEach((item) => item.classList.add('is-revealed'));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        const delay = Number(target.dataset.revealDelay ?? 0);
        gsap.to(target, {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          delay,
          ease: 'power3.out',
          onComplete: () => target.classList.add('is-revealed'),
        });
        observer?.unobserve(target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  items.forEach((item) => observer?.observe(item));
}

export function destroyReveal(): void {
  observer?.disconnect();
  observer = null;
}

/** Track which section is currently in view (used by nav + dock). */
export function initSectionSpy(onChange: (id: string) => void): () => void {
  const sections = $$('main section[id]');
  if (!sections.length) return () => {};

  const visible = new Map<string, number>();

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).id;
        visible.set(id, entry.intersectionRatio);
      });
      let best = '';
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      });
      if (best) onChange(best);
    },
    { threshold: [0.12, 0.35, 0.6, 0.9] },
  );

  sections.forEach((section) => spy.observe(section));
  return () => spy.disconnect();
}

/** Header state: stuck background, hide on scroll down, ink/paper contrast. */
/** Chapters whose substrate is too dark for the light header bar. */
const DARK_CHAPTERS = ['ch-ink', 'ch-signal', 'ch-ember'];

export function initHeader(): () => void {
  const header = $<HTMLElement>('#site-head');
  if (!header) return () => {};

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 24);

    const goingDown = y > lastY && y > 320;
    header.classList.toggle('is-hidden', goingDown && !document.body.classList.contains('is-locked'));
    lastY = y;

    // Contrast: are we over a dark chapter?
    const probe = document.elementFromPoint(
      Math.round(window.innerWidth / 2),
      Math.round(header.offsetHeight / 2 + 8),
    );
    const chapter = probe?.closest('section') as HTMLElement | null;
    // Only the paper chapter keeps the light header; ink, signal and ember
    // all need the dark bar so the header type stays legible.
    const isDark = chapter
      ? DARK_CHAPTERS.some((name) => chapter.classList.contains(name))
      : false;
    header.classList.toggle('is-over-ink', isDark);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
  return () => window.removeEventListener('scroll', onScroll);
}
