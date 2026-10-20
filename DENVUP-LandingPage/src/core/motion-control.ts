/**
 * One place that decides what "reduced motion" means on this page.
 *
 * Pausing motion touches four systems, and they all have to agree:
 *
 *   1. CSS — a class on <html> neutralises transitions and keyframes.
 *   2. Smooth scrolling — Lenis stops, so the page returns to native scroll.
 *   3. Scroll reveals — every non-scrubbed reveal is landed immediately, so
 *      nothing is left waiting for a scroll that may never come. Scrubbed
 *      animations are left alone: they are a direct mapping of scroll
 *      position to a value, not an animation with its own timeline.
 *   4. Canvas and WebGL loops — they listen for {@link MOTION_EVENT} and
 *      stop drawing.
 *
 * The event is also the public hook for anything else that wants to know.
 */

import { env, setMotionPaused } from './env';
import { gsap, ScrollTrigger, refreshTriggers } from './motion';
import { startSmoothScroll, stopSmoothScroll } from './scroll';

/** Dispatched on `window` whenever the motion state changes. */
export const MOTION_EVENT = 'denvup:motion';

export interface MotionEventDetail {
  reduced: boolean;
}

/**
 * Apply a motion state to the whole page.
 *
 * @param reduced  true to pause motion, false to let it run again.
 * @param manual   true when the change came from the in-page switch. Manual
 *                 changes never undo a system-level reduction.
 */
export function setPageMotion(reduced: boolean, manual = true): void {
  const effective = manual ? env.systemReducedMotion || reduced : reduced;

  document.documentElement.classList.toggle('is-motion-paused', effective);
  if (manual) setMotionPaused(reduced && !env.systemReducedMotion);

  if (effective) {
    stopSmoothScroll();
    ScrollTrigger.getAll().forEach((trigger) => {
      const animation = trigger.animation;
      if (!animation) return;
      // Scrubbed timelines are a scroll-position readout, not an animation.
      if (trigger.vars.scrub) return;
      animation.progress(1).pause();
    });
  } else {
    startSmoothScroll();
  }

  refreshTriggers();
  window.dispatchEvent(
    new CustomEvent<MotionEventDetail>(MOTION_EVENT, { detail: { reduced: effective } }),
  );
}

/** Read the current state of the in-page switch. */
export function isMotionPaused(): boolean {
  return document.documentElement.classList.contains('is-motion-paused');
}

/**
 * Keep the in-page switch in step with the operating system.
 *
 * When the system turns reduced motion on, the switch is locked on and
 * explains why. When the system turns it off again, the page returns to
 * whatever the visitor had chosen.
 */
export function watchSystemMotion(
  onChange: (state: { reduced: boolean; locked: boolean }) => void,
): () => void {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = () => {
    onChange({ reduced: env.reducedMotion, locked: query.matches });
    setPageMotion(query.matches, false);
  };
  query.addEventListener('change', handler);
  onChange({ reduced: env.reducedMotion, locked: query.matches });
  return () => query.removeEventListener('change', handler);
}

export { gsap };
