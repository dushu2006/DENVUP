/**
 * The service detail page.
 *
 * The static page carries the headline, the artwork and the structure; this
 * module fills in the parts that have to run: the animated "how it works"
 * diagram, the labelled concept demos, and the price hint. Everything it
 * draws comes from `src/data/services.ts`, so a service cannot describe one
 * thing on the home page and another here.
 *
 * The diagram is not a static illustration. It draws itself, walks the
 * request along the path and settles on the outcome — and when motion is
 * switched off it renders as a complete, readable diagram with the same
 * information.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import { serviceBySlug, services, type Service } from '../data/services';
import { demosByTechnique } from '../demos/registry';

interface DiagramStep {
  label: string;
  detail: string;
}

const DIAGRAMS: Record<Service['diagram'], { from: string; to: string; steps: DiagramStep[] }> = {
  build: {
    from: 'Brief',
    to: 'Live site',
    steps: [
      { label: 'Structure', detail: 'Pages, hierarchy and what sits where — decided before anything is drawn.' },
      { label: 'System', detail: 'Type scale, colour, grid and components, written down as rules.' },
      { label: 'Pages', detail: 'Every page designed and built in the browser, on a phone first.' },
      { label: 'Build', detail: 'Production front end, content model, and the handover notes.' },
    ],
  },
  motion: {
    from: 'Message',
    to: 'Movement',
    steps: [
      { label: 'Story', detail: 'The order the visitor meets things in, and why.' },
      { label: 'Timing', detail: 'Durations, easings and the distances things travel.' },
      { label: 'Motion pass', detail: 'Every entrance, exit and transition gets a rule.' },
      { label: 'Polish', detail: 'Reduced-motion alternatives, keyboard paths, and the fallback frame.' },
    ],
  },
  system: {
    from: 'Question',
    to: 'Accountable answer',
    steps: [
      { label: 'Retrieve', detail: 'The right sources are found, not the first plausible paragraph.' },
      { label: 'Model', detail: 'The model drafts an answer against your own content.' },
      { label: 'Check', detail: 'The answer is checked against the source, and the source is shown.' },
      { label: 'Publish', detail: 'The interface shows what is certain, what is inferred, and what failed.' },
    ],
  },
  commerce: {
    from: 'Catalogue',
    to: 'Fulfilment',
    steps: [
      { label: 'Catalogue', detail: 'One source of truth for products, stock and price.' },
      { label: 'Detail', detail: 'The product page is generated from that source, not typed twice.' },
      { label: 'Basket', detail: 'The order is assembled and checked against live stock.' },
      { label: 'Payment', detail: 'Payment, confirmation and the handover to fulfilment.' },
    ],
  },
  interface: {
    from: 'Request',
    to: 'Resolution',
    steps: [
      { label: 'Ask', detail: 'The request is captured once, with validation as you type.' },
      { label: 'Assign', detail: 'It is routed to the right person or queue.' },
      { label: 'Track', detail: 'Everyone can see where it is without asking.' },
      { label: 'Close', detail: 'The outcome is recorded, and the record is searchable.' },
    ],
  },
  care: {
    from: 'One system',
    to: 'One flow',
    steps: [
      { label: 'Map', detail: 'The step being removed is written down, with its edge cases.' },
      { label: 'Connect', detail: 'The two systems are joined, with failures handled on purpose.' },
      { label: 'Reconcile', detail: 'The two sides are compared, and differences are reported.' },
      { label: 'Log', detail: 'Every run is recorded, so a bad run can be explained.' },
    ],
  },
};

const NS = 'http://www.w3.org/2000/svg';

function svg(tag: string, attrs: Record<string, string> = {}): SVGElement {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/**
 * Build the animated workflow diagram.
 *
 * The SVG is a request travelling from the left-hand end to the right-hand
 * end. The line draws itself, the nodes fire in order, and a travelling
 * marker shows where the request currently is. The caption under the diagram
 * names the current step, so the information never depends on the animation
 * being seen.
 */
function buildWorkflow(service: Service): { element: HTMLElement; teardown: () => void } {
  const spec = DIAGRAMS[service.diagram];
  const wrap = el('figure', 'svc-how');
  wrap.dataset.diagram = service.diagram;

  const heading = el('h2', 'svc-how__title');
  heading.id = 'svc-how-title';
  heading.textContent = 'How this one works';

  const frame = el('div', 'svc-how__frame');
  const drawing = svg('svg', {
    viewBox: '0 0 900 300',
    class: 'svc-how__svg',
    role: 'img',
    'aria-label': `Workflow for ${service.title}: ${spec.from} to ${spec.to}, in ${spec.steps.length} stages.`,
  });

  const track = svg('path', {
    d: 'M70 150 H830',
    class: 'svc-how__track',
  });
  drawing.appendChild(track);

  const progress = svg('path', {
    d: 'M70 150 H830',
    class: 'svc-how__progress',
  });
  drawing.appendChild(progress);

  const marker = svg('g', { class: 'svc-how__marker' });
  const markerBody = svg('rect', { x: '-6', y: '-14', width: '12', height: '28', class: 'svc-how__marker-box' });
  marker.appendChild(markerBody);
  drawing.appendChild(marker);

  const nodes: SVGElement[] = [];
  spec.steps.forEach((step, index) => {
    const x = 70 + (index * 760) / (spec.steps.length - 1);
    const group = svg('g', { class: 'svc-how__node' });
    group.appendChild(svg('circle', { cx: String(x), cy: '150', r: '13', class: 'svc-how__node-ring' }));
    group.appendChild(svg('circle', { cx: String(x), cy: '150', r: '4', class: 'svc-how__node-core' }));
    const label = svg('text', { x: String(x), y: '196', class: 'svc-how__node-label', 'text-anchor': 'middle' });
    label.textContent = step.label;
    group.appendChild(label);
    drawing.appendChild(group);
    nodes.push(group);
  });

  const startLabel = svg('text', { x: '70', y: '54', class: 'svc-how__end' });
  startLabel.textContent = spec.from;
  const endLabel = svg('text', { x: '830', y: '54', class: 'svc-how__end', 'text-anchor': 'end' });
  endLabel.textContent = spec.to;
  drawing.append(startLabel, endLabel);

  frame.appendChild(drawing);

  /* The caption. It is the readable version of the animation, and it
     changes in step with the marker. */
  const caption = el('figcaption', 'svc-how__caption');
  const captionIndex = el('span', 'svc-how__caption-index');
  const captionLabel = el('span', 'svc-how__caption-label');
  const captionDetail = el('span', 'svc-how__caption-detail');
  caption.append(captionIndex, captionLabel, captionDetail);

  const steps = el('ol', 'svc-how__steps');
  spec.steps.forEach((step, index) => {
    const item = el('li', 'svc-how__step');
    item.dataset.step = String(index);
    const n = el('span', 'svc-how__step-index');
    n.textContent = String(index + 1).padStart(2, '0');
    const name = el('span', 'svc-how__step-name');
    name.textContent = step.label;
    const detail = el('span', 'svc-how__step-detail');
    detail.textContent = step.detail;
    item.append(n, name, detail);
    steps.appendChild(item);
  });

  const setStep = (index: number): void => {
    const step = spec.steps[index] ?? spec.steps[0];
    captionIndex.textContent = `${String(index + 1).padStart(2, '0')} / ${String(spec.steps.length).padStart(2, '0')}`;
    captionLabel.textContent = step.label;
    captionDetail.textContent = step.detail;
    nodes.forEach((node, i) => node.classList.toggle('is-on', i <= index));
    steps.querySelectorAll('.svc-how__step').forEach((item, i) => {
      item.classList.toggle('is-on', i === index);
    });
  };

  setStep(0);

  let teardown = (): void => {};

  if (!env.reducedMotion) {
    const length = 760;
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
    timeline
      .fromTo(
        progress,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 2.6, ease: 'none' },
      )
      .fromTo(
        marker,
        { attr: { x: 0 }, x: 70 },
        { x: 830, duration: 2.6, ease: 'none' },
        0,
      );

    spec.steps.forEach((_, index) => {
      timeline.call(
        () => setStep(index),
        undefined,
        0.22 + index * 0.62,
      );
    });

    teardown = () => timeline.kill();
  }

  wrap.append(heading, frame, caption, steps);
  return { element: wrap, teardown };
}

/**
 * The labelled concept demos.
 *
 * Each service names a small set of techniques. Where a technique has a
 * working demonstration, the link goes to the Effects Library and the
 * visitor can run it. Where it does not, the link goes to the technique
 * library, where the record says what the technique is and whether it is
 * implemented, under revision or blocked.
 *
 * The two kinds of link are labelled, because the difference matters: an
 * old line in this site used to claim that *every* technique on this list
 * was live, and half of them were not. Now the page says exactly which
 * are running and which are only written down.
 */
function buildDemos(service: Service): HTMLElement {
  const wrap = el('section', 'svc-demos');
  const heading = el('h2', 'svc-demos__title');
  heading.textContent = 'What the interaction could look like';
  const lead = el('p', 'svc-demos__lead');

  const runnable = service.techniqueIds.filter((id) => (demosByTechnique.get(Number(id)) ?? []).length > 0);
  lead.textContent = runnable.length
    ? `These are the techniques this service usually leans on. ${runnable.length} of them ${
        runnable.length === 1 ? 'is' : 'are'
      } running live in the Effects Library — the link takes you straight to it. The rest are written up in the technique library.`
    : 'These are the techniques this service usually leans on. They are written up in the technique library, with the component each one is built from.';

  const list = el('ul', 'svc-demos__list');

  service.techniqueIds.forEach((id) => {
    const item = el('li', 'svc-demos__item');
    const link = el('a', 'svc-demos__link');
    const hasDemo = (demosByTechnique.get(Number(id)) ?? []).length > 0;
    link.href = hasDemo ? `/lab/#tech-${id}` : `/#tech-${id}`;
    link.dataset.technique = id;
    if (!hasDemo) link.dataset.reference = 'true';
    const number = el('span', 'svc-demos__index');
    number.textContent = `T${String(id).padStart(3, '0')}`;
    const name = el('span', 'svc-demos__name');
    name.textContent = DEMO_NAMES[id] ?? 'Named technique';
    /*
     * The label says where the link goes. It used to cycle five words by
     * position — "entrance", "scroll", "pointer" — which described
     * nothing in particular and told the visitor nothing at all.
     */
    const kind = el('span', 'svc-demos__kind');
    kind.textContent = hasDemo ? 'live demo' : 'reference';
    link.append(number, name, kind);
    item.appendChild(link);
    list.appendChild(item);
  });

  wrap.append(heading, lead, list);
  return wrap;
}

const DEMO_NAMES: Record<string, string> = {
  '102': 'Reveal on enter',
  '118': 'Scroll-driven framing',
  '131': 'Progressive disclosure',
  '146': 'Masked section change',
  '202': 'Progressive answer',
  '215': 'Staggered sequence',
  '233': 'Type-driven counter',
  '289': 'Magnetic target',
  '301': 'Path travel',
  '312': 'System diagram',
  '327': 'Data flow line',
  '341': 'Wireframe to build',
  '121': 'Split-screen pin',
  '158': 'Shared element',
  '196': 'Cursor trail',
  '274': 'Layered parallax',
  '288': 'Token workflow',
  '336': 'State machine',
  '359': 'Elastic entrance',
  '372': 'Focus-managed swap',
};

/**
 * Mount the service detail page.
 *
 * @param slug The route slug, e.g. 'web-design'.
 */
export function initServiceDetail(slug: string): () => void {
  const service = serviceBySlug(slug);
  if (!service) return () => {};

  const cleanups: (() => void)[] = [];

  /* --- the animated diagram ------------------------------------------- */
  const howSlot = $<HTMLElement>('[data-svc-how]');
  if (howSlot) {
    const { element, teardown } = buildWorkflow(service);
    howSlot.replaceChildren(element);
    cleanups.push(teardown);
  }

  /* --- the labelled concept demos -------------------------------------- */
  const demoSlot = $<HTMLElement>('[data-svc-demos]');
  if (demoSlot) {
    demoSlot.replaceChildren(buildDemos(service));
  }

  /* --- the price hint -------------------------------------------------- */
  const priceSlot = $<HTMLElement>('[data-svc-price]');
  if (priceSlot) {
    const note = el('p', 'svc-price__note');
    note.textContent = service.priceNote;
    priceSlot.replaceChildren(note);
  }

  /* --- the sibling rail ------------------------------------------------ */
  const siblingSlot = $<HTMLElement>('[data-svc-siblings]');
  if (siblingSlot) {
    const list = el('ul', 'siblings');
    services
      .filter((other) => other.slug !== service.slug)
      .forEach((other) => {
        const item = el('li', 'sibling');
        const link = el('a', 'sibling__link');
        link.href = `/services/${other.slug}/`;
        const index = el('span', 'sibling__index');
        index.textContent = other.index;
        const title = el('span', 'sibling__title');
        title.textContent = other.title;
        link.append(index, title);
        item.appendChild(link);
        list.appendChild(item);
      });
    siblingSlot.replaceChildren(list);
  }

  return () => cleanups.forEach((teardown) => teardown());
}
