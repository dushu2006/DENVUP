/**
 * The five service signatures.
 *
 * Each service gets one visual that could only belong to it. They share a
 * visual language — the DENVUP palette, hairline rules, flat geometry — but
 * they do not share a mechanism:
 *
 *   web design      a wireframe that assembles itself into a composition
 *   AI solutions    a node network that answers selection
 *   integrations    data travelling between named systems
 *   creative        a layered object that turns in space
 *   automation      a token entering a process and leaving as a result
 *
 * Every one of them is an illustration of the way the work is done. None of
 * them is presented as client work, and each carries that label on screen.
 */

import { el } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import type { Service } from '../data/services';

export interface ServiceVisual {
  element: HTMLElement;
  /** Called when the visual becomes the active one. */
  enter: () => void;
  /** Called when it stops being active. */
  leave: () => void;
  /** Called on every frame of the pinned scroll, with 0–1 progress. */
  progress: (value: number) => void;
  /** Release every listener, timer and tween. */
  destroy: () => void;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(tag: string, attrs: Record<string, string>): SVGElement {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/* ---------------------------------------------------------------------- */
/* 1 — Web design: a wireframe assembling into a composition               */
/* ---------------------------------------------------------------------- */

function webDesignVisual(): ServiceVisual {
  const root = el('div', 'sig sig--web');
  const frame = el('div', 'sig__frame');
  const wire = el('div', 'sig__wire');
  const built = el('div', 'sig__built');

  // The wireframe: the blocks a layout is made of.
  const blocks: HTMLElement[] = [];
  const layout = [
    [6, 4, 52, 10],
    [6, 18, 30, 26],
    [40, 18, 18, 26],
    [62, 18, 32, 12],
    [62, 34, 32, 10],
    [6, 48, 88, 6],
  ];
  layout.forEach(([x, y, w, h]) => {
    const block = el('span', 'sig__wire-block');
    block.style.left = `${x}%`;
    block.style.top = `${y}%`;
    block.style.width = `${w}%`;
    block.style.height = `${h}%`;
    wire.appendChild(block);
    blocks.push(block);
  });

  // The composition: the same blocks, filled and coloured.
  const fills: HTMLElement[] = [];
  const palette = ['ember', 'ink', 'signal', 'ink', 'ember', 'ink'];
  layout.forEach(([x, y, w, h], index) => {
    const fill = el('span', `sig__built-fill is-${palette[index]}`);
    fill.style.left = `${x}%`;
    fill.style.top = `${y}%`;
    fill.style.width = `${w}%`;
    fill.style.height = `${h}%`;
    built.appendChild(fill);
    fills.push(fill);
  });

  const handle = el('span', 'sig__handle');
  const label = el('p', 'sig__label');
  label.textContent = 'A concept of the transformation, not a client project.';

  frame.append(wire, built, handle);
  root.append(frame, label);

  const tween = gsap.to(fills, {
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    duration: 0.9,
    ease: 'power3.inOut',
    stagger: 0.08,
    paused: true,
  });
  gsap.set(fills, { scaleX: 0.2, scaleY: 0.2, opacity: 0, transformOrigin: '0 0' });
  gsap.set(blocks, { opacity: 1 });

  return {
    element: root,
    enter() {
      tween.play();
    },
    leave() {
      tween.reverse();
    },
    progress(value) {
      gsap.set(handle, { left: `${10 + value * 80}%` });
      gsap.set(wire, { opacity: 1 - value * 0.85 });
    },
    destroy() {
      tween.kill();
    },
  };
}

/* ---------------------------------------------------------------------- */
/* 2 — AI solutions: a node network that answers selection                 */
/* ---------------------------------------------------------------------- */

const AI_NODES: { x: number; y: number; label: string; note: string }[] = [
  { x: 12, y: 24, label: 'Question', note: 'What is being asked?' },
  { x: 12, y: 62, label: 'Context', note: 'What does the business already know?' },
  { x: 38, y: 14, label: 'Retrieve', note: 'The relevant passages are found.' },
  { x: 38, y: 44, label: 'Model', note: 'The answer is drafted.' },
  { x: 38, y: 74, label: 'Check', note: 'Is it supported by the source?' },
  { x: 64, y: 28, label: 'Source', note: 'The passage the answer came from.' },
  { x: 64, y: 66, label: 'Person', note: 'A human confirms when it matters.' },
  { x: 88, y: 46, label: 'Answer', note: 'Published with its evidence.' },
];

function aiSolutionsVisual(): ServiceVisual {
  const root = el('div', 'sig sig--ai');
  const canvas = el('div', 'sig__net');
  const caption = el('p', 'sig__caption');
  const dots: HTMLElement[] = [];
  const labels: HTMLElement[] = [];
  const lines: SVGElement[] = [];

  const edges: [number, number][] = [
    [0, 2], [1, 2], [0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 7], [6, 7], [4, 5],
  ];

  const drawing = svg('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none', class: 'sig__net-lines' });
  edges.forEach(([a, b]) => {
    const from = AI_NODES[a];
    const to = AI_NODES[b];
    const line = svg('line', {
      x1: String(from.x),
      y1: String(from.y),
      x2: String(to.x),
      y2: String(to.y),
      class: 'sig__net-line',
    });
    drawing.appendChild(line);
    lines.push(line);
  });
  canvas.appendChild(drawing);

  AI_NODES.forEach((node) => {
    const dot = el('button', 'sig__dot');
    dot.type = 'button';
    dot.style.left = `${node.x}%`;
    dot.style.top = `${node.y}%`;
    dot.setAttribute('aria-label', `${node.label}. ${node.note}`);
    const label = el('span', 'sig__dot-label');
    label.textContent = node.label;
    dot.appendChild(label);
    canvas.appendChild(dot);
    dots.push(dot);
    labels.push(label);
  });

  caption.textContent = 'An illustration of a working shape, not a live product.';
  root.append(canvas, caption);

  const highlight = (index: number): void => {
    caption.textContent = AI_NODES[index].note;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    lines.forEach((line, i) => {
      const [a, b] = edges[i];
      line.classList.toggle('is-lit', a === index || b === index);
    });
  };

  const onEnter = (event: Event): void => {
    const dot = event.currentTarget as HTMLElement;
    const index = dots.indexOf(dot);
    if (index >= 0) highlight(index);
  };
  dots.forEach((dot) => dot.addEventListener('mouseenter', onEnter));
  dots.forEach((dot) => dot.addEventListener('focus', onEnter));
  dots.forEach((dot) => dot.addEventListener('click', onEnter));

  const pulse = gsap.to(dots, {
    scale: 1.18,
    duration: 0.9,
    ease: 'sine.inOut',
    stagger: { each: 0.14, repeat: -1, yoyo: true },
    paused: true,
  });

  return {
    element: root,
    enter() {
      pulse.play();
    },
    leave() {
      pulse.pause();
    },
    progress() {
      /* the network is driven by selection, not by scroll */
    },
    destroy() {
      pulse.kill();
      dots.forEach((dot) => dot.removeEventListener('mouseenter', onEnter));
      dots.forEach((dot) => dot.removeEventListener('focus', onEnter));
      dots.forEach((dot) => dot.removeEventListener('click', onEnter));
    },
  };
}

/* ---------------------------------------------------------------------- */
/* 3 — Business integrations: data travelling between named systems         */
/* ---------------------------------------------------------------------- */

const SYSTEMS = ['Site', 'CRM', 'Payments', 'Warehouse', 'Email'];

function integrationsVisual(): ServiceVisual {
  const root = el('div', 'sig sig--integrations');
  const board = el('div', 'sig__systems');

  const boxes: HTMLElement[] = [];
  SYSTEMS.forEach((name, index) => {
    const box = el('div', 'sig__system');
    box.style.setProperty('--i', String(index));
    const title = el('span', 'sig__system-name');
    title.textContent = name;
    const port = el('span', 'sig__system-port');
    box.append(title, port);
    board.appendChild(box);
    boxes.push(box);
  });

  const drawing = svg('svg', { viewBox: '0 0 100 60', preserveAspectRatio: 'none', class: 'sig__flow-lines' });
  const paths: SVGElement[] = [];
  const pairs: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [1, 4]];
  pairs.forEach(([a, b]) => {
    const path = svg('path', {
      d: `M ${8 + a * 21} 12 C ${8 + a * 21} 44, ${8 + b * 21} 44, ${8 + b * 21} 12`,
      class: 'sig__flow-path',
    });
    drawing.appendChild(path);
    paths.push(path);
  });
  board.appendChild(drawing);

  const packet = el('span', 'sig__packet');
  board.appendChild(packet);
  const caption = el('p', 'sig__label');
  caption.textContent = 'A diagram of a flow, drawn before any of it is built.';
  root.append(board, caption);

  const length = 100;
  gsap.set(paths, { strokeDasharray: length, strokeDashoffset: length });

  return {
    element: root,
    enter() {
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        stagger: 0.12,
        repeat: -1,
        repeatDelay: 0.4,
      });
      /* The packet travels the first path by hand: the motion-path plugin is
         not part of the GSAP build this site ships, and a hand-written
         tween keeps the bundle small. */
      gsap.fromTo(
        packet,
        { x: 0, y: 0, opacity: 0 },
        {
          x: 42,
          y: 26,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 0.9,
          onRepeat: () => {
            gsap.set(packet, { opacity: 0 });
          },
        },
      );
    },
    leave() {
      gsap.killTweensOf(paths);
      gsap.killTweensOf(packet);
    },
    progress(value) {
      gsap.set(boxes, { y: value * -6 });
    },
    destroy() {
      gsap.killTweensOf(paths);
      gsap.killTweensOf(packet);
    },
  };
}

/* ---------------------------------------------------------------------- */
/* 4 — Creative: a layered object that turns in space                       */
/* ---------------------------------------------------------------------- */

function creativeVisual(): ServiceVisual {
  const root = el('div', 'sig sig--creative');
  const scene = el('div', 'sig__scene');
  const caption = el('p', 'sig__label');
  caption.textContent = 'A composition study — depth, layer and light, not a client project.';

  const layers = ['ember', 'signal', 'ink', 'paper'];
  const planes: HTMLElement[] = [];
  layers.forEach((tone, index) => {
    const plane = el('span', `sig__plane is-${tone}`);
    plane.style.setProperty('--depth', String(index));
    scene.appendChild(plane);
    planes.push(plane);
  });

  const ring = el('span', 'sig__ring');
  scene.appendChild(ring);
  root.append(scene, caption);

  const tween = gsap.to(planes, {
    rotateY: 360,
    duration: 18,
    ease: 'none',
    repeat: -1,
    paused: true,
  });

  const onMove = (event: PointerEvent): void => {
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(scene, { rotateY: x * 26, rotateX: -y * 18, duration: 0.6, ease: 'power2.out' });
  };
  scene.addEventListener('pointermove', onMove);

  return {
    element: root,
    enter() {
      tween.play();
    },
    leave() {
      tween.pause();
    },
    progress(value) {
      gsap.set(scene, { rotateZ: value * 12 });
    },
    destroy() {
      tween.kill();
      scene.removeEventListener('pointermove', onMove);
    },
  };
}

/* ---------------------------------------------------------------------- */
/* 5 — Automation: a token entering a process and leaving as a result      */
/* ---------------------------------------------------------------------- */

function automationVisual(): ServiceVisual {
  const root = el('div', 'sig sig--automation');
  const track = el('div', 'sig__track');
  const caption = el('p', 'sig__label');
  caption.textContent = 'A workflow drawn as a loop, the way it is drawn before it is built.';

  const inLabel = el('span', 'sig__track-end');
  inLabel.textContent = 'Request';
  const outLabel = el('span', 'sig__track-end');
  outLabel.textContent = 'Result';
  const processor = el('span', 'sig__processor');
  processor.textContent = 'The rule';

  const tokens: HTMLElement[] = [];
  ['A', 'B', 'C'].forEach((letter) => {
    const token = el('span', 'sig__token');
    token.textContent = letter;
    track.appendChild(token);
    tokens.push(token);
  });

  const rail = el('span', 'sig__rail');
  track.append(rail, processor, inLabel, outLabel);
  root.append(track, caption);

  const onEnter = (): void => {
    tokens.forEach((token, index) => {
      gsap.fromTo(
        token,
        { x: -10, opacity: 0, scale: 0.6 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          delay: index * 0.14,
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(token, {
              x: 120,
              opacity: 0,
              scale: 0.8,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power2.in',
            });
          },
        },
      );
    });
  };

  return {
    element: root,
    enter() {
      onEnter();
    },
    leave() {
      gsap.killTweensOf(tokens);
    },
    progress(value) {
      gsap.set(processor, { scale: 1 + value * 0.06 });
    },
    destroy() {
      gsap.killTweensOf(tokens);
    },
  };
}

/* ---------------------------------------------------------------------- */

const BUILDERS: Record<Service['slug'], () => ServiceVisual> = {
  'web-design': webDesignVisual,
  'ai-solutions': aiSolutionsVisual,
  'business-integrations': integrationsVisual,
  'creative-experiences': creativeVisual,
  automation: automationVisual,
};

/** Build the signature visual for a service. */
export function createServiceVisual(service: Service): ServiceVisual {
  const builder = BUILDERS[service.slug];
  if (!builder) {
    const fallback = el('div', 'sig');
    const label = el('p', 'sig__label');
    label.textContent = service.signature;
    fallback.appendChild(label);
    return {
      element: fallback,
      enter() {},
      leave() {},
      progress() {},
      destroy() {},
    };
  }
  return builder();
}

export { env };
