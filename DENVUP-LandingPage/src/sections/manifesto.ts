/**
 * The manifesto chapter.
 *
 * The headline is split into masked lines and reacts to scroll position; the
 * lead paragraph decodes into place; the three principles reveal on click or
 * keypress rather than animating themselves into view.
 */

import { $, $$ } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';
import { scramble, splitText } from '../core/pointer';

export function initManifesto(): () => void {
  const section = $<HTMLElement>('#manifesto');
  if (!section) return () => {};

  const cleanups: (() => void)[] = [];

  // --- masked, scroll-reactive headline (83, 92, 102, 128) --------------- //
  const title = $<HTMLElement>('[data-split-headline]');
  if (title) {
    const words = splitText(title, 'words');
    title.classList.add('is-split');

    if (env.reducedMotion) {
      gsap.set(words, { autoAlpha: 1, yPercent: 0 });
    } else {
      gsap.set(words, { autoAlpha: 0, yPercent: 105 });
      ScrollTrigger.create({
        trigger: title,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.85,
            ease: 'expo.out',
            stagger: 0.05,
          });
        },
      });

      // The type transforms as the section is scrolled.
      gsap.to(words, {
        yPercent: -14,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }
  }

  // --- decoding lead paragraph (94) -------------------------------------- //
  const lead = $<HTMLElement>('[data-scramble]');
  if (lead) {
    const text = lead.textContent ?? '';
    if (env.reducedMotion) {
      lead.textContent = text;
    } else {
      lead.textContent = '';
      const trigger = ScrollTrigger.create({
        trigger: lead,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          scramble(lead, text, { duration: 1.1 });
        },
      });
      cleanups.push(() => trigger.kill());
    }
  }

  // --- click / keypress principles (352, 408) ---------------------------- //
  const items = $$<HTMLElement>('.manifesto__item');
  items.forEach((item) => {
    const body = item.querySelector('p');
    if (!body) return;
    body.hidden = true;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const open = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!open));
      if (open) {
        body.hidden = true;
        item.classList.remove('is-open');
      } else {
        body.hidden = false;
        item.classList.add('is-open');
        if (!env.reducedMotion) {
          gsap.fromTo(
            body,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          );
        }
      }
    };

    item.addEventListener('click', toggle);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
    cleanups.push(() => item.removeEventListener('click', toggle));
  });

  return () => cleanups.forEach((fn) => fn());
}
