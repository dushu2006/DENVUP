/**
 * The expansion chapter.
 *
 * The small square that appeared in the prelude grows into a full-bleed
 * ember field as the visitor scrolls into this section. The transformation is
 * a scale + clip-path + mask sequence, so it works without WebGL and reads
 * correctly with reduced motion (the panel simply appears finished).
 */

import { $ } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';

export function initExpansion(): () => void {
  const section = $<HTMLElement>('#expansion');
  const panel = $<HTMLElement>('[data-expansion-panel]');
  const emblem = $<HTMLElement>('[data-expansion-emblem]');
  const copy = $<HTMLElement>('[data-expansion-copy]');
  if (!section) return () => {};

  if (env.reducedMotion) {
    section.classList.add('is-expanded');
    copy?.classList.add('is-visible');
    return () => {};
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.55,
    },
  });

  if (panel) {
    timeline.fromTo(
      panel,
      { clipPath: 'inset(12% 22% 12% 22%)', scale: 0.28 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'power2.inOut' },
      0,
    );
  }

  if (emblem) {
    timeline.fromTo(
      emblem,
      { scale: 0.4, autoAlpha: 0, rotate: -14 },
      { scale: 1, autoAlpha: 1, rotate: 0, ease: 'power3.out' },
      0.18,
    );
  }

  if (copy) {
    timeline.fromTo(
      copy,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, ease: 'power2.out' },
      0.42,
    );
  }

  // The chapter switches substrate as the panel completes.
  ScrollTrigger.create({
    trigger: section,
    start: 'top 30%',
    end: 'bottom top',
    onUpdate: (self) => {
      section.classList.toggle('is-expanded', self.progress > 0.45);
    },
  });

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}
