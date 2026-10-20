/**
 * The capability atlas.
 *
 * A plotted map of the studio's real tool set. The connectors are drawn as
 * the section enters, the map's path fills with scroll progress, and selecting
 * a node highlights its neighbours and explains what the tool is for.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';
import { atlasLayers, atlasNodes, type AtlasNode } from '../data/atlas';

const VIEW_W = 1200;
const VIEW_H = 540;

/** Edges between tools that genuinely work together. */
const EDGES: [string, string][] = [
  ['figma', 'type'],
  ['figma', 'tokens'],
  ['type', 'html'],
  ['tokens', 'css'],
  ['html', 'ts'],
  ['css', 'vite'],
  ['ts', 'vite'],
  ['ts', 'gsap'],
  ['gsap', 'lenis'],
  ['lenis', 'three'],
  ['gsap', 'webgl'],
  ['webgl', 'canvas'],
  ['canvas', 'content'],
  ['a11y', 'content'],
  ['perf', 'a11y'],
  ['content', 'vite'],
  ['three', 'webgl'],
  ['css', 'webgl'],
];

export function initAtlas(): () => void {
  const map = $<HTMLElement>('[data-atlas-map]');
  const panel = $<HTMLElement>('[data-atlas-panel]');
  if (!map || !panel) return () => {};

  const cleanups: (() => void)[] = [];

  // --- the blueprint backdrop -------------------------------------------- //
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
  svg.setAttribute('class', 'atlas__svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('preserveAspectRatio', 'none');

  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  grid.setAttribute('class', 'atlas__grid');
  for (let x = 0; x <= VIEW_W; x += 60) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x));
    line.setAttribute('y1', '0');
    line.setAttribute('x2', String(x));
    line.setAttribute('y2', String(VIEW_H));
    grid.appendChild(line);
  }
  for (let y = 0; y <= VIEW_H; y += 60) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', String(y));
    line.setAttribute('x2', String(VIEW_W));
    line.setAttribute('y2', String(y));
    grid.appendChild(line);
  }
  svg.appendChild(grid);

  // --- layer bands -------------------------------------------------------- //
  const bands = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  bands.setAttribute('class', 'atlas__bands');
  atlasLayers.forEach((_layer, index) => {
    const band = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    band.setAttribute('x', '0');
    band.setAttribute('y', String(index * (VIEW_H / atlasLayers.length)));
    band.setAttribute('width', String(VIEW_W));
    band.setAttribute('height', String(VIEW_H / atlasLayers.length));
    band.setAttribute('class', `atlas__band atlas__band--${index}`);
    bands.appendChild(band);
  });
  svg.appendChild(bands);

  // --- connectors --------------------------------------------------------- //
  const byId = new Map(atlasNodes.map((node) => [node.id, node]));
  const connectorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  connectorGroup.setAttribute('class', 'atlas__connectors');
  const connectorPaths: SVGPathElement[] = [];

  EDGES.forEach(([fromId, toId]) => {
    const from = byId.get(fromId);
    const to = byId.get(toId);
    if (!from || !to) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midX = (from.x + to.x) / 2;
    path.setAttribute(
      'd',
      `M${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`,
    );
    path.setAttribute('class', 'atlas__connector');
    path.dataset.from = fromId;
    path.dataset.to = toId;
    connectorGroup.appendChild(path);
    connectorPaths.push(path);
  });
  svg.appendChild(connectorGroup);

  // The travelling dots are the "data flow" along the connectors.
  const flowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  flowGroup.setAttribute('class', 'atlas__flow');
  const flowDots: { dot: SVGCircleElement; path: SVGPathElement }[] = [];
  connectorPaths.forEach((path) => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '3');
    dot.setAttribute('class', 'atlas__flow-dot');
    flowGroup.appendChild(dot);
    flowDots.push({ dot, path });
  });
  svg.appendChild(flowGroup);

  map.appendChild(svg);

  // --- node buttons ------------------------------------------------------- //
  const nodeLayer = el('div', 'atlas__nodes');
  map.appendChild(nodeLayer);

  const nodeButtons = new Map<string, HTMLButtonElement>();
  atlasNodes.forEach((node) => {
    const button = el('button', `atlas__node atlas__node--${node.layer.toLowerCase()}`);
    button.type = 'button';
    button.dataset.node = node.id;
    button.style.left = `${(node.x / VIEW_W) * 100}%`;
    button.style.top = `${(node.y / VIEW_H) * 100}%`;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span class="atlas__node-dot" aria-hidden="true"></span><span class="atlas__node-label">${node.label}</span>`;
    nodeLayer.appendChild(button);
    nodeButtons.set(node.id, button);
  });

  // --- panel -------------------------------------------------------------- //
  const renderPanel = (node: AtlasNode | null) => {
    panel.innerHTML = '';
    if (!node) {
      const empty = el('p', 'atlas__panel-empty');
      empty.textContent =
        'Select a node to see what it is used for, which stage it belongs to, and the layer it sits in.';
      panel.appendChild(empty);
      return;
    }
    const heading = el('h3', 'atlas__panel-title');
    heading.textContent = node.label;
    const layer = el('p', 'atlas__panel-layer');
    layer.textContent = `${node.layer} layer · ${node.stage} stage`;
    const purpose = el('p', 'atlas__panel-purpose');
    purpose.textContent = node.purpose;
    const notes = el('p', 'atlas__panel-notes');
    notes.textContent = node.notes;
    panel.append(heading, layer, purpose, notes);

    if (!env.reducedMotion) {
      gsap.fromTo(
        [heading, layer, purpose, notes],
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 },
      );
    }
  };
  renderPanel(null);

  // --- selection ---------------------------------------------------------- //
  const select = (node: AtlasNode | null) => {
    nodeButtons.forEach((button, id) => {
      const active = node?.id === id;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    connectorPaths.forEach((path) => {
      const connected = node
        ? path.dataset.from === node.id || path.dataset.to === node.id
        : false;
      path.classList.toggle('is-active', connected);
    });
    renderPanel(node);
  };

  nodeButtons.forEach((button, id) => {
    const node = byId.get(id);
    if (!node) return;
    const onClick = () => {
      select(node);
      // The node changes shape as well as colour, never colour alone.
      button.classList.toggle('is-active');
      if (button.classList.contains('is-active')) select(node);
    };
    button.addEventListener('click', onClick);
    cleanups.push(() => button.removeEventListener('click', onClick));
  });

  // --- connectors draw on entry, path fills with scroll -------------------- //
  if (!env.reducedMotion) {
    connectorPaths.forEach((path, index) => {
      const length = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.inOut',
          delay: index * 0.035,
          scrollTrigger: { trigger: map, start: 'top 78%', once: true },
        },
      );
    });

    flowDots.forEach(({ dot, path }) => {
      const length = path.getTotalLength();
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        duration: 3.4,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          const point = path.getPointAtLength(proxy.t * length);
          dot.setAttribute('cx', point.x.toFixed(1));
          dot.setAttribute('cy', point.y.toFixed(1));
        },
      });
    });
  }

  // --- scroll progress draws the map's path ------------------------------ //
  const pathLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathLine.setAttribute(
    'd',
    'M60 470 C 240 470, 300 200, 520 200 S 820 120, 1120 200',
  );
  pathLine.setAttribute('class', 'atlas__progress-path');
  svg.appendChild(pathLine);
  const progressLength = pathLine.getTotalLength();
  gsap.set(pathLine, { strokeDasharray: progressLength, strokeDashoffset: progressLength });
  const progressTrigger = ScrollTrigger.create({
    trigger: map,
    start: 'top 80%',
    end: 'bottom 60%',
    scrub: 0.6,
    onUpdate: (self) => {
      gsap.set(pathLine, { strokeDashoffset: progressLength * (1 - self.progress) });
    },
  });
  cleanups.push(() => progressTrigger.kill());

  return () => cleanups.forEach((fn) => fn());
}
