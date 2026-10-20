/**
 * Smooth scrolling.
 *
 * Lenis is used for its inertia model only — the document keeps native
 * scrolling: wheel, touch, keyboard, scrollbar and find-in-page all behave
 * exactly as the browser intends. Lenis is switched off entirely when the
 * visitor asks for reduced motion, when the page is in a background tab, or
 * when a modal menu is open.
 */

import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './motion';
import { env } from './env';

let lenis: Lenis | null = null;
let rafId = 0;

export function initSmoothScroll(): Lenis | null {
  if (env.reducedMotion) return null;

  lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.6,
    wheelMultiplier: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => {
    lenis?.raf(time * 1000);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function stopSmoothScroll(): void {
  lenis?.stop();
}

export function startSmoothScroll(): void {
  lenis?.start();
}

export function destroySmoothScroll(): void {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
}

/** Scroll to an element, honouring the smooth-scroll engine if it is running. */
export function scrollTo(target: string | HTMLElement, offset = 0): void {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  if (!node) return;
  const top = node.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'auto' });
}

/**
 * Jump to a position immediately, ignoring the smooth-scroll engine.
 *
 * A deep link has to *arrive*. If the smooth engine is asked for a
 * twenty-thousand-pixel jump it will animate the whole way there, which
 * is neither quick nor useful, and a plain `window.scrollTo` would be
 * undone by the engine on its next frame.
 */
export function jumpTo(top: number): void {
  if (lenis) {
    /*
     * The engine caches the height of the page and clamps every scroll to
     * that cache. A page that grew — the laboratory mounts a
     * demonstration when its card comes into view — is therefore taller
     * than the engine thinks, and a jump would be cut short. Refreshing
     * the measurement first is what makes the jump land.
     */
    lenis.resize();
    const target = Math.max(0, Math.min(top, lenis.limit));
    lenis.scrollTo(target, { immediate: true, force: true });
    return;
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: Math.max(0, Math.min(top, max)), behavior: 'auto' });
}

/**
 * Keep an element at the top of the window while the page settles.
 *
 * A page that grows while it is being read moves the target under the
 * visitor's feet. The laboratory is the clearest case: a demonstration
 * mounts when its card comes into view, and a mounted demonstration is
 * taller than an empty one, so every card that mounts above the target
 * pushes it further down the page.
 *
 * So the position is corrected until it stops changing, and the attempt
 * is given up after a few seconds so it can never hold the page.
 */
export function settleOn(target: HTMLElement, attempts = 60, interval = 110): () => void {
  let count = 0;
  let timer = 0;

  const step = (): void => {
    const rect = target.getBoundingClientRect();
    /*
     * Where the target wants to sit: its own scroll margin, which keeps
     * it clear of the fixed header.
     */
    const want = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    if (Math.abs(rect.top - want) < 2) return;

    jumpTo(Math.round(rect.top + window.scrollY - want));
    count += 1;
    if (count > attempts) return;
    timer = window.setTimeout(step, interval);
  };

  step();
  return () => window.clearTimeout(timer);
}

/** Shared scroll progress, 0 → 1 across the whole document. */
export function getScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return window.scrollY / max;
}

/** Keep gsap's ticker in sync when the tab is hidden (encyclopedia 429). */
export function pauseOnHidden(): () => void {
  const onVisibility = () => {
    if (document.hidden) {
      gsap.ticker.sleep();
      stopSmoothScroll();
    } else {
      gsap.ticker.wake();
      startSmoothScroll();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  return () => document.removeEventListener('visibilitychange', onVisibility);
}
