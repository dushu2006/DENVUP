/**
 * The services chapter.
 *
 * A pinned, split-screen story. The right-hand stage stays fixed while five
 * service steps scroll past it, and the stage shows the signature visual for
 * whichever step is in view. The visual is not a picture of the service: it
 * is the one idea that identifies the line, running.
 *
 * The section is a real tab list as well as a scroll story — arrow keys move
 * between the steps, and selecting a step scrolls the story to it — so the
 * chapter works with a keyboard and with a screen reader as well as with a
 * pointer.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { ScrollTrigger } from '../core/motion';
import { scrollTo } from '../core/scroll';
import { services, type Service } from '../data/services';
import { createServiceVisual, type ServiceVisual } from './service-visuals';

const DIAGRAMS: Record<Service['diagram'], { from: string; to: string; steps: string[] }> = {
  build: {
    from: 'Brief',
    to: 'Live site',
    steps: ['Structure', 'System', 'Pages', 'Build'],
  },
  motion: {
    from: 'Message',
    to: 'Movement',
    steps: ['Story', 'Timing', 'Motion pass', 'Polish'],
  },
  system: {
    from: 'Question',
    to: 'Accountable answer',
    steps: ['Retrieve', 'Model', 'Check', 'Publish'],
  },
  commerce: {
    from: 'Catalogue',
    to: 'Fulfilment',
    steps: ['Catalogue', 'Detail', 'Basket', 'Payment'],
  },
  interface: {
    from: 'Request',
    to: 'Resolution',
    steps: ['Ask', 'Assign', 'Track', 'Close'],
  },
  care: {
    from: 'One system',
    to: 'One flow',
    steps: ['Map', 'Connect', 'Reconcile', 'Log'],
  },
};

export function buildDiagram(service: Service): HTMLElement {
  const spec = DIAGRAMS[service.diagram];
  const wrap = el('div', 'services__diagram');
  wrap.dataset.diagram = service.diagram;

  const drawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  drawing.setAttribute('viewBox', '0 0 520 150');
  drawing.setAttribute('class', 'services__diagram-svg');
  drawing.setAttribute('role', 'img');
  drawing.setAttribute('aria-label', `Workflow: ${spec.from} to ${spec.to}`);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', 'M28 74 H492');
  line.setAttribute('class', 'services__diagram-line');
  drawing.appendChild(line);

  spec.steps.forEach((step, index) => {
    const x = 28 + (index * 464) / (spec.steps.length - 1);
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    node.setAttribute('class', 'services__diagram-node');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', '74');
    circle.setAttribute('r', '9');
    node.appendChild(circle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x));
    text.setAttribute('y', '104');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'services__diagram-text');
    text.textContent = step;
    node.appendChild(text);
    drawing.appendChild(node);
  });

  const from = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  from.setAttribute('x', '28');
  from.setAttribute('y', '34');
  from.setAttribute('class', 'services__diagram-end');
  from.textContent = spec.from;
  const to = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  to.setAttribute('x', '492');
  to.setAttribute('y', '34');
  to.setAttribute('text-anchor', 'end');
  to.setAttribute('class', 'services__diagram-end');
  to.textContent = spec.to;
  drawing.append(from, to);

  wrap.appendChild(drawing);
  return wrap;
}

export function initServices(): () => void {
  const story = $<HTMLElement>('[data-service-story]');
  if (!story) return () => {};

  const cleanups: (() => void)[] = [];
  const steps: HTMLElement[] = [];
  const tabs: HTMLButtonElement[] = [];
  const visuals = new Map<string, ServiceVisual>();

  let activeIndex = 0;
  let scrollTrigger: ScrollTrigger | null = null;

  // ------------------------------------------------------------------ //
  // The steps
  // ------------------------------------------------------------------ //
  services.forEach((service) => {
    const step = el('article', 'services__step');
    step.dataset.serviceStep = service.slug;
    step.id = `service-${service.slug}`;

    const index_ = el('p', 'services__step-index');
    index_.textContent = service.index;

    // The line's own plate: the same original artwork its detail page shows,
    // kept small here so the stage on the right stays the loud part.
    const plate = el('figure', 'services__step-plate');
    const plateImage = document.createElement('img');
    plateImage.src = `/art/service-${service.slug}.jpg`;
    plateImage.alt = `Original artwork for the ${service.title} service line.`;
    plateImage.width = 1600;
    plateImage.height = 900;
    plateImage.loading = 'lazy';
    plateImage.decoding = 'async';
    plate.appendChild(plateImage);

    const head = el('div', 'services__step-head');
    head.append(index_, plate);

    const title = el('h3', 'services__step-title');
    title.textContent = service.title;

    const short = el('p', 'services__step-short');
    short.textContent = service.short;

    const body = el('p', 'services__step-body');
    body.textContent = service.body;

    const signature = el('p', 'services__step-signature');
    signature.textContent = service.signature;

    const facts = el('dl', 'services__step-facts');
    const audience = el('div');
    const audienceTerm = el('dt');
    audienceTerm.textContent = 'Who it is for';
    const audienceValue = el('dd');
    audienceValue.textContent = service.audience;
    audience.append(audienceTerm, audienceValue);
    const outcome = el('div');
    const outcomeTerm = el('dt');
    outcomeTerm.textContent = 'What it produces';
    const outcomeValue = el('dd');
    outcomeValue.textContent = service.outcome;
    outcome.append(outcomeTerm, outcomeValue);
    facts.append(audience, outcome);

    const list = el('div', 'services__step-deliverables');
    const listHeading = el('h4', 'services__deliverables-title');
    listHeading.textContent = 'What you get';
    const items = el('ul');
    service.deliverables.forEach((entry) => {
      const li = el('li');
      li.textContent = entry;
      items.appendChild(li);
    });
    list.append(listHeading, items);

    const diagram = buildDiagram(service);

    const actions = el('div', 'services__step-actions');
    const link = el('a', 'btn btn--solid');
    link.href = `/services/${service.slug}/`;
    link.innerHTML = `<span>Read the full service</span><span class="btn__icon" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg></span>`;
    const contact = el('a', 'btn btn--ghost');
    contact.href = '/contact/';
    contact.textContent = 'Talk about this scope';
    actions.append(link, contact);

    step.append(head, title, short, body, signature, facts, list, diagram, actions);
    story.appendChild(step);
    steps.push(step);
  });

  // ------------------------------------------------------------------ //
  // The stage
  // ------------------------------------------------------------------ //
  const stage = $<HTMLElement>('[data-service-stage]');
  if (stage) {
    services.forEach((service) => {
      const slot = el('div', 'services__visual');
      slot.dataset.serviceVisual = service.slug;
      const visual = createServiceVisual(service);
      slot.appendChild(visual.element);
      stage.appendChild(slot);
      visuals.set(service.slug, visual);
    });
  }

  // ------------------------------------------------------------------ //
  // The tab list
  // ------------------------------------------------------------------ //
  const tabList = $<HTMLElement>('[data-service-tabs]');
  if (tabList) {
    services.forEach((service, index) => {
      const tab = el('button', 'services__tab');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.id = `service-tab-${service.slug}`;
      tab.setAttribute('aria-controls', `service-${service.slug}`);
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tab.tabIndex = index === 0 ? 0 : -1;
      tab.innerHTML = `<span class="services__tab-index">${service.index}</span><span class="services__tab-title">${service.title}</span>`;
      tabList.appendChild(tab);
      tabs.push(tab);
    });
  }

  const setActive = (index: number, scroll = false): void => {
    if (index < 0 || index >= services.length) return;
    const service = services[index];
    const previous = services[activeIndex];
    activeIndex = index;

    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
      tab.tabIndex = i === index ? 0 : -1;
    });
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));

    if (previous && previous.slug !== service.slug) {
      visuals.get(previous.slug)?.leave();
      stage
        ?.querySelector(`[data-service-visual="${previous.slug}"]`)
        ?.classList.remove('is-on');
    }
    visuals.get(service.slug)?.enter();
    stage?.querySelector(`[data-service-visual="${service.slug}"]`)?.classList.add('is-on');

    if (scroll) {
      scrollTo(`#service-${service.slug}`, -90);
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActive(index, true));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
      setActive(step, true);
      tabs[step].focus();
    });
  });

  // ------------------------------------------------------------------ //
  // The scroll story
  // ------------------------------------------------------------------ //
  if (!env.reducedMotion) {
    const triggers = steps.map((step, index) =>
      ScrollTrigger.create({
        trigger: step,
        start: 'top 58%',
        end: 'bottom 42%',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      }),
    );
    triggers.forEach((trigger) => cleanups.push(() => trigger.kill()));

    scrollTrigger = ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const value = self.progress;
        visuals.get(services[activeIndex]?.slug ?? '')?.progress(value);
      },
    });
    cleanups.push(() => scrollTrigger?.kill());
  }

  // The stage is sticky; on a narrow screen the two columns stack and the
  // stage follows the step rather than sitting beside it.
  setActive(0);

  return () => cleanups.forEach((teardown) => teardown());
}
