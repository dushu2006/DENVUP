/**
 * The studio hero.
 *
 * The headline is split and revealed word by word, the spotlight follows the
 * pointer, and the studio facts count up from zero using the real numbers.
 */

import { $, $$ } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';
import { splitText } from '../core/pointer';
import { studioFacts } from '../data/site';

export function initStudio(): () => void {
  const section = $<HTMLElement>('#studio');
  if (!section) return () => {};

  const cleanups: (() => void)[] = [];

  // --- kinetic headline -------------------------------------------------- //
  const headline = $<HTMLElement>('[data-kinetic-headline]');
  if (headline) {
    const words = splitText(headline, 'words');
    if (env.reducedMotion) {
      gsap.set(words, { autoAlpha: 1, yPercent: 0 });
    } else {
      gsap.set(words, { autoAlpha: 0, yPercent: 115 });
      gsap.to(words, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.055,
        delay: 0.15,
      });
    }
  }

  // --- pointer spotlight -------------------------------------------------- //
  const spotlight = $('.studio__spotlight');
  if (spotlight) {
    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      spotlight.style.setProperty('--spot-x', `${x}px`);
      spotlight.style.setProperty('--spot-y', `${y}px`);
    };
    section.addEventListener('pointermove', onMove);
    cleanups.push(() => section.removeEventListener('pointermove', onMove));
  }

  // --- real counters ------------------------------------------------------ //
  const specs = $$<HTMLElement>('.studio__specs li b');
  specs.forEach((node) => {
    const target = Number(node.textContent ?? '0');
    if (!Number.isFinite(target)) return;
    if (env.reducedMotion) {
      node.textContent = String(target);
      return;
    }
    const proxy = { value: 0 };
    node.textContent = '0';
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          value: target,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            node.textContent = String(Math.round(proxy.value));
          },
          onComplete: () => {
            node.textContent = String(target);
          },
        });
      },
    });
    cleanups.push(() => trigger.kill());
  });

  // --- scroll cue --------------------------------------------------------- //
  const cue = $('.studio__scrollcue');
  if (cue && !env.reducedMotion) {
    gsap.to(cue, {
      yPercent: 22,
      opacity: 0.25,
      duration: 1.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  // --- facts, for reuse by the closing statement ------------------------- //
  section.dataset.facts = studioFacts.map((fact) => `${fact.value} ${fact.label}`).join(' | ');

  return () => cleanups.forEach((fn) => fn());
}
