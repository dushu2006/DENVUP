/**
 * The closing statement.
 *
 * A radial field of colour behind the last words, and a headline that lands
 * with the same easing vocabulary as the rest of the site.
 */

import { $ } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';
import { splitText } from '../core/pointer';

export function initClosing(): () => void {
  const section = $<HTMLElement>('#closing');
  const title = $<HTMLElement>('[data-closing-type]');
  if (!section) return () => {};

  const cleanups: (() => void)[] = [];

  if (title) {
    const words = splitText(title, 'words');
    if (env.reducedMotion) {
      gsap.set(words, { autoAlpha: 1, yPercent: 0 });
    } else {
      gsap.set(words, { autoAlpha: 0, yPercent: 110 });
      ScrollTrigger.create({
        trigger: title,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.06,
          });
        },
      });
    }
  }

  // The field behind the statement breathes slowly.
  const field = section.querySelector<HTMLElement>('.closing__field');
  if (field && !env.reducedMotion) {
    gsap.to(field, {
      backgroundPosition: '50% 120%',
      duration: 18,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  // The footer mark rotates slowly.
  const mark = document.querySelector<HTMLElement>('.site-foot__mark');
  if (mark && !env.reducedMotion) {
    gsap.to(mark, {
      rotation: 360,
      duration: 42,
      ease: 'none',
      repeat: -1,
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
