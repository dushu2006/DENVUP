/**
 * The team chapter.
 *
 * No portraits were supplied, and inventing them was not an option. Instead
 * each member gets a monogram drawn from the studio's own emblem treatment,
 * a focus list, and a card that expands into a profile panel.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import { team } from '../data/site';

export function initTeam(): () => void {
  const list = $<HTMLElement>('[data-team-list]');
  if (!list) return () => {};

  const cleanups: (() => void)[] = [];
  const cards: HTMLElement[] = [];

  team.forEach((member, index) => {
    const item = el('li', 'team__item');
    const card = el('article', 'team__card');
    card.dataset.member = member.name;

    const mono = el('div', 'team__mono');
    mono.setAttribute('aria-hidden', 'true');
    mono.dataset.portrait = member.slug;
    mono.innerHTML = `<span class="team__mono-initials">${member.initials}</span>`;

    const body = el('div', 'team__body');
    const name = el('h3', 'team__name');
    name.textContent = member.name;
    const role = el('p', 'team__role');
    role.textContent = member.role;
    const focus = el('ul', 'team__focus');
    member.focus.forEach((item2) => {
      const li = el('li');
      li.textContent = item2;
      focus.appendChild(li);
    });
    const more = el('button', 'team__more');
    more.type = 'button';
    more.textContent = 'Full note';
    more.setAttribute('aria-expanded', 'false');
    body.append(name, role, focus, more);

    card.append(mono, body);
    item.appendChild(card);
    list.appendChild(item);
    cards.push(card);

    // --- the card expands to show the full note ------------------------- //
    const note = el('p', 'team__note');
    note.textContent = member.note;
    note.hidden = true;
    body.appendChild(note);

    const toggle = () => {
      const open = more.getAttribute('aria-expanded') === 'true';
      more.setAttribute('aria-expanded', String(!open));
      note.hidden = open;
      card.classList.toggle('is-open', !open);
      if (!open && !env.reducedMotion) {
        gsap.fromTo(
          note,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        );
      }
    };
    more.addEventListener('click', toggle);
    cleanups.push(() => more.removeEventListener('click', toggle));

    // --- tilt ------------------------------------------------------------- //
    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      mono.style.setProperty('--glow', String(Math.max(0, 1 - Math.hypot(x, y) * 1.4).toFixed(3)));
    };
    const onLeave = () => {
      card.style.transform = '';
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    });
    void index;
  });

  // --- arrow-key navigation across the strip ------------------------------ //
  const onKey = (event: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.team__item')) return;
    const index = cards.findIndex((card) => card.contains(target));
    if (index < 0) return;
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % cards.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + cards.length) % cards.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = cards.length - 1;
    else return;
    event.preventDefault();
    const focusable = cards[next].querySelector<HTMLElement>('button, [tabindex]');
    focusable?.focus();
    cards[next].scrollIntoView({ behavior: env.reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  };
  list.addEventListener('keydown', onKey);
  cleanups.push(() => list.removeEventListener('keydown', onKey));

  // --- the network that connects the four people ------------------------- //
  const network = el('div', 'team__network');
  network.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 200');
  svg.setAttribute('class', 'team__network-svg');
  const centres = [
    [60, 50],
    [340, 50],
    [110, 150],
    [290, 150],
  ];
  for (let i = 0; i < centres.length; i += 1) {
    for (let j = i + 1; j < centres.length; j += 1) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(centres[i][0]));
      line.setAttribute('y1', String(centres[i][1]));
      line.setAttribute('x2', String(centres[j][0]));
      line.setAttribute('y2', String(centres[j][1]));
      line.setAttribute('class', 'team__network-line');
      svg.appendChild(line);
    }
  }
  centres.forEach(([x, y]) => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));
    dot.setAttribute('r', '6');
    dot.setAttribute('class', 'team__network-dot');
    svg.appendChild(dot);
  });
  network.appendChild(svg);
  list.after(network);

  if (!env.reducedMotion) {
    const lines = svg.querySelectorAll<SVGLineElement>('.team__network-line');
    lines.forEach((line, index) => {
      const length = line.getTotalLength();
      gsap.fromTo(
        line,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.8, delay: index * 0.12, ease: 'power2.out' },
      );
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
