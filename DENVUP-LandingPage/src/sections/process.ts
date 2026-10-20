/**
 * The process chapter.
 *
 * A vertical rail of five stages on the left, a sticky detail panel on the
 * right. The active stage follows the scroll position, the rail line draws
 * as the section enters, and each stage has its own illustration.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';
import { processStages } from '../data/services';

/** A small abstract illustration per stage — never a stock icon. */
const ILLUSTRATIONS: Record<string, string[]> = {
  discovery: ['M40 120 C 90 40, 150 160, 200 80', 'M40 160 H240'],
  design: ['M40 60 H240', 'M40 100 H180', 'M40 140 H210', 'M40 180 H120'],
  build: ['M60 40 V160 M60 160 H200 M110 160 V90 M110 90 H200'],
  motion: ['M40 160 C 90 40, 150 160, 200 60', 'M40 160 C 90 40, 150 160, 200 60'],
  launch: ['M40 140 L100 70 L140 110 L200 40', 'M40 170 H220'],
};

export function initProcess(): () => void {
  const rail = $<HTMLElement>('[data-process-rail]');
  const detail = $<HTMLElement>('[data-process-detail]');
  if (!rail || !detail) return () => {};

  const cleanups: (() => void)[] = [];
  const items: HTMLLIElement[] = [];
  let active = 0;

  processStages.forEach((stage, index) => {
    const item = el('li', 'process__item');
    item.dataset.stage = stage.id;
    const button = el('button', 'process__node');
    button.type = 'button';
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    button.innerHTML = `
      <span class="process__node-index">${stage.index}</span>
      <span class="process__node-name">${stage.name}</span>
      <span class="process__node-when">${stage.when}</span>`;
    const line = el('span', 'process__node-line');
    line.setAttribute('aria-hidden', 'true');
    item.append(button, line);
    rail.appendChild(item);
    items.push(item);
  });

  const renderDetail = (index: number) => {
    const stage = processStages[index];
    if (!stage) return;
    detail.innerHTML = '';

    const head = el('div', 'process__detail-head');
    const kicker = el('p', 'process__detail-kicker');
    kicker.textContent = `Stage ${stage.index} — ${stage.name}`;
    const title = el('h3', 'process__detail-title');
    title.textContent = stage.title;
    const body = el('p', 'process__detail-body');
    body.textContent = stage.body;
    head.append(kicker, title, body);

    const art = el('div', 'process__detail-art');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 280 200');
    svg.setAttribute('class', 'process__detail-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Illustration for the ${stage.name} stage`);
    (ILLUSTRATIONS[stage.id] ?? []).forEach((d, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'process__detail-path');
      path.style.setProperty('--delay', `${i * 90}ms`);
      svg.appendChild(path);
    });
    art.appendChild(svg);

    const outputs = el('div', 'process__detail-outputs');
    const heading = el('h4', 'process__outputs-title');
    heading.textContent = 'What you get at the end of this stage';
    const list = el('ul', 'process__outputs');
    stage.outputs.forEach((output) => {
      const li = el('li');
      li.textContent = output;
      list.appendChild(li);
    });
    outputs.append(heading, list);

    detail.append(head, art, outputs);

    if (!env.reducedMotion) {
      gsap.fromTo(
        detail.children,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.06 },
      );
    }
  };

  const setActive = (index: number) => {
    if (index === active && detail.childElementCount) return;
    active = index;
    items.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
      item.querySelector('button')?.setAttribute('aria-pressed', String(i === index));
    });
    renderDetail(index);
  };

  items.forEach((item, index) => {
    const button = item.querySelector('button');
    if (!button) return;
    const onClick = () => setActive(index);
    button.addEventListener('click', onClick);
    cleanups.push(() => button.removeEventListener('click', onClick));
  });

  setActive(0);

  // The active step follows the scroll position.
  const triggers = items.map((item, index) =>
    ScrollTrigger.create({
      trigger: item,
      start: 'top 58%',
      end: 'bottom 42%',
      onEnter: () => setActive(index),
      onEnterBack: () => setActive(index),
    }),
  );
  cleanups.push(() => triggers.forEach((trigger) => trigger.kill()));

  // The rail line draws as the section enters.
  const railLine = el('span', 'process__rail-line');
  railLine.setAttribute('aria-hidden', 'true');
  rail.appendChild(railLine);
  if (!env.reducedMotion) {
    gsap.fromTo(
      railLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: rail, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      },
    );
  }

  return () => cleanups.forEach((fn) => fn());
}
