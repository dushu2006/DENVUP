/**
 * The studio route.
 *
 * The studio page carries the same facts as the home chapter, arranged
 * differently: the manifesto first, then the principles, then the process,
 * then the tool set, then the people. The people are rendered from the same
 * data as the home chapter, so the two can never disagree about who works
 * here.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import { team } from '../data/site';

export function initStudioRoute(): () => void {
  const cleanups: (() => void)[] = [];

  /* --- the people ------------------------------------------------------- */
  const list = $<HTMLElement>('[data-studio-team]');
  if (list) {
    team.forEach((member, index) => {
      const item = el('li', 'studio-person');
      item.dataset.person = member.slug;

      const slot = el('span', 'studio-person__portrait');
      slot.dataset.portrait = member.slug;
      slot.setAttribute('aria-hidden', 'true');
      const initials = el('span', 'studio-person__initials');
      initials.textContent = member.initials;
      slot.appendChild(initials);

      const body = el('div', 'studio-person__body');

      const index_ = el('span', 'studio-person__index');
      index_.textContent = String(index + 1).padStart(2, '0');

      const name = el('h3', 'studio-person__name');
      name.textContent = member.name;

      const role = el('p', 'studio-person__role');
      role.textContent = member.role;

      const note = el('p', 'studio-person__note');
      note.textContent = member.note;

      const focus = el('ul', 'studio-person__focus');
      member.focus.forEach((entry) => {
        const li = el('li');
        li.textContent = entry;
        focus.appendChild(li);
      });

      body.append(index_, name, role, note, focus);
      item.append(slot, body);
      list.appendChild(item);
    });

    if (!env.reducedMotion) {
      const people = list.querySelectorAll<HTMLElement>('.studio-person');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const person = entry.target as HTMLElement;
            observer.unobserve(person);
            gsap.fromTo(
              person,
              { autoAlpha: 0, y: 22 },
              { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' },
            );
          });
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      people.forEach((person) => observer.observe(person));
      cleanups.push(() => observer.disconnect());
    }
  }

  /* --- the principles --------------------------------------------------- */
  const principles = $<HTMLElement>('[data-studio-principles]');
  if (principles) {
    const items = Array.from(principles.querySelectorAll<HTMLElement>('[data-principle]'));
    if (!env.reducedMotion) {
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: principles, start: 'top 78%', once: true },
          },
        );
      });
    }
  }

  return () => cleanups.forEach((teardown) => teardown());
}
