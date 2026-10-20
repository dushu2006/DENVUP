/**
 * Motion core.
 *
 * GSAP + ScrollTrigger are the single animation engine for the whole site —
 * no competing timelines, no duplicated easing curves. Every module creates
 * its tweens inside a `gsap.context()` so `ctx.revert()` can clean up
 * listeners and inline styles when a component is destroyed.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from './env';

gsap.registerPlugin(ScrollTrigger);

/*
 * Lag smoothing is off.
 *
 * By default GSAP treats a frame longer than half a second as a hiccup and
 * advances its internal clock by only 33 ms. That is right for a page of
 * scroll-scrubbed animation, where a jump would be visible. It is wrong for
 * a route transition: a transition is a promise about elapsed time, and on a
 * slow device the promise was being broken — a one-second wipe could take
 * fifteen seconds of wall-clock time.
 *
 * With smoothing off, a transition that is late finishes late by the amount
 * it was late, and never later than that. The scrubbed chapters still track
 * the scroll position, because ScrollTrigger reads the position rather than
 * the clock.
 */
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger };

/** Shared easing vocabulary — used everywhere so motion feels like one system. */
export const ease = {
  out: 'power3.out',
  outExpo: 'expo.out',
  inOut: 'power2.inOut',
  inOutQuint: 'quint.inOut',
  smooth: 'cubic-bezier(0.32, 0.72, 0, 1)',
  /*
   * `back` is the one curve with an overshoot, and it is used **only by
   * the demonstration library**, which exists to show what these curves
   * look like. The interface itself does not use it: the
   * `design-taste-frontend` motion reference names "bounce or elastic
   * easing on interface elements" as one of the things that gives
   * generated motion away, so the site draws its own accents instead.
   */
  back: 'back.out(1.6)',
} as const;

/** Standard durations in seconds. */
export const dur = {
  fast: 0.28,
  base: 0.62,
  slow: 1.05,
  epic: 1.6,
} as const;

export function createContext(fn: (ctx: gsap.Context) => void): gsap.Context {
  return gsap.context(fn);
}

/**
 * Reveal helper: fade + rise, staggered, triggered when the element enters.
 * Uses ScrollTrigger so it plays in step with the rest of the scroll system.
 */
export function revealOnScroll(
  targets: gsap.DOMTarget,
  options: {
    trigger?: Element;
    start?: string;
    stagger?: number;
    y?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
  } = {},
): ScrollTrigger {
  const {
    trigger,
    start = 'top 85%',
    stagger = 0.07,
    y = 22,
    duration = dur.base,
    delay = 0,
    once = true,
  } = options;

  if (env.reducedMotion) {
    gsap.set(targets, { clearProps: 'all' });
    return ScrollTrigger.create({ trigger: trigger ?? undefined, start, once });
  }

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: ease.out,
      scrollTrigger: {
        trigger,
        start,
        once,
      },
    },
  ).scrollTrigger!;
}

/** Recalculate every trigger — call after fonts or layout shift. */
export function refreshTriggers(): void {
  ScrollTrigger.refresh();
}

/** Kill every trigger + tween (used on teardown / hot reload). */
export function killAll(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.globalTimeline.clear();
}
