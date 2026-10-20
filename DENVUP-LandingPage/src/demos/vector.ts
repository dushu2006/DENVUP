/** SVG, vector and illustration demonstrations. */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { button, controls, hint, seeded, stage } from './helpers';
import type { Demo } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgStage(root: HTMLElement, viewBox = '0 0 400 240'): SVGSVGElement {
  const wrap = stage(root, 'demo__stage--vector');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('class', 'demo__svg');
  wrap.appendChild(svg);
  return svg;
}

const pathDraw: Demo = {
  id: 'vector-path-draw',
  title: 'SVG path draw and stroke reveal',
  category: 'vector',
  summary: 'A path draws itself with a dash offset, then fills in.',
  trigger: 'Press Replay',
  techniques: [206, 210],
  keywords: 'svg path draw stroke dash',
  mount({ root, reduced }) {
    const svg = svgStage(root);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M40 190 C 60 60, 150 40, 200 110 S 340 190, 360 70');
    path.setAttribute('class', 'demo__path');
    svg.appendChild(path);
    const play = () => {
      const length = path.getTotalLength?.() ?? 0;
      if (!length) return;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length });
      if (!reduced) {
        gsap.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' });
      }
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const pathMorph: Demo = {
  id: 'vector-morph',
  title: 'SVG path morphing',
  category: 'vector',
  summary: 'One outline changes into another by interpolating between matching point sets.',
  trigger: 'Press Morph',
  techniques: [207, 214],
  keywords: 'morph shape path blob organic',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 300 300');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'demo__path demo__path--fill');
    svg.appendChild(path);

    const blob = (points: number, radius: number, seed: number) => {
      const rand = seeded(seed);
      const coords: [number, number][] = [];
      for (let i = 0; i < points; i += 1) {
        const angle = (i / points) * Math.PI * 2;
        const r = radius * (0.72 + rand() * 0.5);
        coords.push([150 + Math.cos(angle) * r, 150 + Math.sin(angle) * r]);
      }
      return `M${coords.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
    };

    const shapeA = blob(7, 92, 11);
    const shapeB = blob(9, 88, 29);
    const shapeC = blob(5, 96, 47);
    const shapes = [shapeA, shapeB, shapeC];
    let index = 0;

    const morph = () => {
      index = (index + 1) % shapes.length;
      const next = shapes[index];
      if (reduced) {
        path.setAttribute('d', next);
        return;
      }
      const from = path.getAttribute('d') ?? shapeA;
      const fromPoints = from.replace(/[MLZ]/g, '').trim().split(/\s+/).map(Number);
      const toPoints = next.replace(/[MLZ]/g, '').trim().split(/\s+/).map(Number);
      const count = Math.min(fromPoints.length, toPoints.length);
      const proxy = { t: 0 };
      const build = (t: number) => {
        const out: string[] = [];
        for (let i = 0; i < count; i += 2) {
          const x = fromPoints[i] + (toPoints[i] - fromPoints[i]) * t;
          const y = fromPoints[i + 1] + (toPoints[i + 1] - fromPoints[i + 1]) * t;
          out.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        return `M${out.join(' L')} Z`;
      };
      gsap.to(proxy, {
        t: 1,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => path.setAttribute('d', build(proxy.t)),
      });
    };

    path.setAttribute('d', shapeA);
    const bar = controls(root);
    bar.appendChild(button('Morph', morph));
  },
};

const lineArt: Demo = {
  id: 'vector-line-art',
  title: 'Animated line-art figure',
  category: 'vector',
  summary: 'An original drawing whose strokes redraw themselves in a slow loop.',
  trigger: 'Automatic',
  techniques: [208, 223],
  keywords: 'line art illustration stroke loop character',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 300 300');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'demo__lineart');
    const paths = [
      'M150 40 C 110 60, 92 100, 96 150 C 100 200, 130 236, 150 258',
      'M150 40 C 190 60, 208 100, 204 150 C 200 200, 170 236, 150 258',
      'M124 118 C 132 110, 142 110, 148 118',
      'M176 118 C 168 110, 158 110, 152 118',
      'M138 176 C 145 182, 155 182, 162 176',
      'M150 258 L150 286',
    ];
    paths.forEach((d, i) => {
      const p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', 'demo__path');
      p.style.setProperty('--delay', `${i * 0.22}s`);
      g.appendChild(p);
    });
    svg.appendChild(g);
    if (reduced) return;
    gsap.to(g, { opacity: 0.35, duration: 1.6, ease: 'power1.inOut', yoyo: true, repeat: -1 });
  },
};

const gradientSvg: Demo = {
  id: 'vector-gradient',
  title: 'Animated gradient inside an SVG',
  category: 'vector',
  summary: 'A gradient stop shifts, which reads as light moving across a surface.',
  trigger: 'Automatic',
  techniques: [211],
  keywords: 'gradient svg animate light',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 300 200');
    const defs = document.createElementNS(SVG_NS, 'defs');
    const grad = document.createElementNS(SVG_NS, 'linearGradient');
    grad.setAttribute('id', 'demo-grad');
    grad.setAttribute('x1', '0');
    grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '1');
    grad.setAttribute('y2', '1');
    const s1 = document.createElementNS(SVG_NS, 'stop');
    s1.setAttribute('offset', '0%');
    s1.setAttribute('stop-color', '#f0490f');
    const s2 = document.createElementNS(SVG_NS, 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', '#2b39e6');
    grad.append(s1, s2);
    defs.appendChild(grad);
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('width', '300');
    rect.setAttribute('height', '200');
    rect.setAttribute('fill', 'url(#demo-grad)');
    svg.append(defs, rect);
    if (reduced) return;
    gsap.to(s1, { attr: { 'stop-color': '#ffb627' }, duration: 2.4, yoyo: true, repeat: -1 });
    gsap.to(s2, { attr: { 'stop-color': '#f0490f' }, duration: 2.4, yoyo: true, repeat: -1 });
  },
};

const clipMask: Demo = {
  id: 'vector-clip-mask',
  title: 'SVG clipping-mask transition',
  category: 'vector',
  summary: 'A shape mask changes from a circle to a triangle while the drawing stays put.',
  trigger: 'Press Switch shape',
  techniques: [212],
  keywords: 'clipping mask shape transition svg',
  mount({ root }) {
    const svg = svgStage(root, '0 0 300 220');
    const defs = document.createElementNS(SVG_NS, 'defs');
    const clip = document.createElementNS(SVG_NS, 'clipPath');
    clip.setAttribute('id', 'demo-clip');
    const shape = document.createElementNS(SVG_NS, 'path');
    clip.appendChild(shape);
    defs.appendChild(clip);
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('clip-path', 'url(#demo-clip)');
    for (let i = 0; i < 14; i += 1) {
      const bar = document.createElementNS(SVG_NS, 'rect');
      bar.setAttribute('x', String(i * 22));
      bar.setAttribute('y', '0');
      bar.setAttribute('width', '10');
      bar.setAttribute('height', '220');
      bar.setAttribute('fill', i % 2 ? '#f0490f' : '#ffb627');
      g.appendChild(bar);
    }
    svg.append(defs, g);

    const shapes = [
      'M150 20 A 90 90 0 1 1 149 20 Z',
      'M150 15 L245 200 L55 200 Z',
      'M40 110 H260 V190 H40 Z',
    ];
    let index = 0;
    const bar = controls(root);
    bar.appendChild(
      button('Switch shape', () => {
        index = (index + 1) % shapes.length;
        gsap.to(shape, {
          attr: { d: shapes[index] },
          duration: 0.7,
          ease: 'power2.inOut',
        });
      }),
    );
    gsap.set(shape, { attr: { d: shapes[0] } });
  },
};

const filterDistort: Demo = {
  id: 'vector-filter',
  title: 'SVG filter distortion',
  category: 'vector',
  summary: 'A turbulence filter bends the drawing while the displacement animates.',
  trigger: 'Automatic',
  techniques: [213],
  keywords: 'filter turbulence distort displacement svg',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 300 220');
    const defs = document.createElementNS(SVG_NS, 'defs');
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', 'demo-distort');
    const feTurb = document.createElementNS(SVG_NS, 'feTurbulence');
    feTurb.setAttribute('type', 'fractalNoise');
    feTurb.setAttribute('baseFrequency', '0.03 0.05');
    feTurb.setAttribute('numOctaves', '2');
    feTurb.setAttribute('result', 'noise');
    const feDisp = document.createElementNS(SVG_NS, 'feDisplacementMap');
    feDisp.setAttribute('in', 'SourceGraphic');
    feDisp.setAttribute('in2', 'noise');
    feDisp.setAttribute('scale', '0');
    filter.append(feTurb, feDisp);
    defs.appendChild(filter);
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', '150');
    text.setAttribute('y', '140');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'demo__svg-text');
    text.setAttribute('filter', 'url(#demo-distort)');
    text.textContent = 'DISTORT';
    svg.append(defs, text);
    if (reduced) return;
    gsap.to(feDisp, { attr: { scale: 26 }, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  },
};

const contourLines: Demo = {
  id: 'vector-contours',
  title: 'Animated contour lines',
  category: 'vector',
  summary: 'Concentric contours expand outward, like a map of a moving field.',
  trigger: 'Automatic',
  techniques: [215],
  keywords: 'contour lines topography expand',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 300 220');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'demo__contours');
    const paths: SVGPathElement[] = [];
    for (let i = 0; i < 9; i += 1) {
      const p = document.createElementNS(SVG_NS, 'path');
      const r = 12 + i * 9;
      p.setAttribute(
        'd',
        `M150 110 m${-r} 0 a${r} ${r * 0.62} 0 1 0 ${r * 2} 0 a${r} ${r * 0.62} 0 1 0 ${
          -r * 2
        } 0`,
      );
      p.setAttribute('class', 'demo__path demo__path--thin');
      g.appendChild(p);
      paths.push(p);
    }
    svg.appendChild(g);
    if (reduced) return;
    gsap.to(g, { scale: 1.12, transformOrigin: '50% 50%', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  },
};

const generativeGeometry: Demo = {
  id: 'vector-generative',
  title: 'Generative geometry from parameters',
  category: 'vector',
  summary: 'Move the sliders and the drawing is rebuilt from a seeded generator.',
  trigger: 'Drag the sliders',
  techniques: [216, 270, 403],
  keywords: 'generative geometry parameters seed random',
  mount({ root }) {
    const svg = svgStage(root, '0 0 300 220');
    const bar = controls(root);
    const draw = (count: number, spread: number, seed: number) => {
      svg.innerHTML = '';
      const rand = seeded(seed);
      for (let i = 0; i < count; i += 1) {
        const r = 6 + rand() * spread;
        const x = 20 + rand() * 260;
        const y = 20 + rand() * 180;
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('cx', x.toFixed(1));
        c.setAttribute('cy', y.toFixed(1));
        c.setAttribute('r', r.toFixed(1));
        c.setAttribute('class', rand() > 0.5 ? 'demo__dot demo__dot--ember' : 'demo__dot demo__dot--signal');
        svg.appendChild(c);
      }
    };
    let count = 26;
    let spread = 16;
    let seed = 7;

    const countInput = el('input');
    countInput.type = 'range';
    countInput.min = '8';
    countInput.max = '70';
    countInput.value = String(count);
    const spreadInput = el('input');
    spreadInput.type = 'range';
    spreadInput.min = '4';
    spreadInput.max = '40';
    spreadInput.value = String(spread);
    const seedInput = el('input');
    seedInput.type = 'range';
    seedInput.min = '1';
    seedInput.max = '99';
    seedInput.value = String(seed);

    const label = (text: string, input: HTMLInputElement) => {
      const wrap = el('label', 'demo__slider');
      const cap = el('span', 'demo__slider-label');
      cap.textContent = text;
      wrap.append(cap, input);
      return wrap;
    };

    countInput.addEventListener('input', () => {
      count = Number(countInput.value);
      draw(count, spread, seed);
    });
    spreadInput.addEventListener('input', () => {
      spread = Number(spreadInput.value);
      draw(count, spread, seed);
    });
    seedInput.addEventListener('input', () => {
      seed = Number(seedInput.value);
      draw(count, spread, seed);
    });

    bar.append(label('Count', countInput), label('Size', spreadInput), label('Seed', seedInput));
    draw(count, spread, seed);
    hint(root, 'The same seed always produces the same drawing.');
  },
};

const orbits: Demo = {
  id: 'vector-orbits',
  title: 'Orbiting elements and rotating rings',
  category: 'vector',
  summary: 'Rings turn at different rates while satellites orbit the centre.',
  trigger: 'Automatic',
  techniques: [220, 221],
  keywords: 'orbit rings rotate satellite',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 300 220');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'demo__orbits');
    for (let i = 0; i < 3; i += 1) {
      const ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('cx', '150');
      ring.setAttribute('cy', '110');
      ring.setAttribute('r', String(30 + i * 24));
      ring.setAttribute('class', 'demo__path demo__path--thin');
      ring.dataset.spin = String(10 + i * 14);
      g.appendChild(ring);
    }
    const satellites = [0, 1, 2].map((i) => {
      const s = document.createElementNS(SVG_NS, 'circle');
      s.setAttribute('r', '5');
      s.setAttribute('class', 'demo__dot demo__dot--ember');
      s.dataset.r = String(30 + i * 24);
      s.dataset.speed = String(0.6 + i * 0.4);
      g.appendChild(s);
      return s;
    });
    svg.appendChild(g);
    if (reduced) return;
    const state = { t: 0 };
    gsap.to(state, {
      t: Math.PI * 2,
      duration: 12,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        satellites.forEach((s, i) => {
          const r = Number(s.dataset.r);
          const speed = Number(s.dataset.speed);
          const angle = state.t * speed + (i * Math.PI * 2) / 3;
          s.setAttribute('cx', (150 + Math.cos(angle) * r).toFixed(1));
          s.setAttribute('cy', (110 + Math.sin(angle) * r * 0.6).toFixed(1));
        });
        g.querySelectorAll<SVGElement>('[data-spin]').forEach((ring) => {
          const speed = Number(ring.dataset.spin ?? 10);
          ring.setAttribute('transform', `rotate(${(state.t * speed).toFixed(2)} 150 110)`);
        });
      },
    });
  },
};

const pointGrid: Demo = {
  id: 'vector-point-grid',
  title: 'Point grid reacts to the pointer',
  category: 'vector',
  summary: 'A lattice of points swells away from the cursor.',
  trigger: 'Move the pointer over the panel',
  techniques: [222],
  keywords: 'point grid lattice pointer react',
  mount({ root }) {
    const svg = svgStage(root, '0 0 300 200');
    const g = document.createElementNS(SVG_NS, 'g');
    const points: SVGElement[] = [];
    for (let x = 20; x <= 280; x += 20) {
      for (let y = 20; y <= 180; y += 20) {
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('cx', String(x));
        c.setAttribute('cy', String(y));
        c.setAttribute('r', '3');
        c.setAttribute('class', 'demo__dot demo__dot--soft');
        c.dataset.x = String(x);
        c.dataset.y = String(y);
        g.appendChild(c);
        points.push(c);
      }
    }
    svg.appendChild(g);

    const onMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 300;
      const py = ((event.clientY - rect.top) / rect.height) * 200;
      points.forEach((c) => {
        const dx = Number(c.dataset.x) - px;
        const dy = Number(c.dataset.y) - py;
        const d = Math.hypot(dx, dy);
        const push = Math.max(0, 26 - d) / 26;
        c.setAttribute('r', (3 + push * 7).toFixed(2));
        c.setAttribute('cx', (Number(c.dataset.x) + (dx || 0.01) * push * 0.5).toFixed(1));
        c.setAttribute('cy', (Number(c.dataset.y) + (dy || 0.01) * push * 0.5).toFixed(1));
      });
    };
    const onLeave = () => {
      points.forEach((c) => {
        c.setAttribute('r', '3');
        c.setAttribute('cx', c.dataset.x!);
        c.setAttribute('cy', c.dataset.y!);
      });
    };
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerleave', onLeave);
    return () => {
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerleave', onLeave);
    };
  },
};

const iconStates: Demo = {
  id: 'vector-icon-states',
  title: 'Animated icon states',
  category: 'vector',
  summary: 'One icon redraws itself for each state it represents.',
  trigger: 'Press a state',
  techniques: [224],
  keywords: 'icon states animate svg glyph',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--vector');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('class', 'demo__svg demo__svg--icon');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'demo__icon');
    svg.appendChild(g);
    wrap.appendChild(svg);

    const states = {
      play: 'M40 34 L86 60 L40 86 Z',
      pause: 'M46 34 L46 86 M74 34 L74 86',
      check: 'M34 62 L52 80 L88 40',
    };
    const setState = (name: keyof typeof states) => {
      g.innerHTML = '';
      const p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', states[name]);
      p.setAttribute('class', 'demo__path');
      const length = p.getTotalLength?.() ?? 0;
      if (!length) return;
      gsap.fromTo(
        p,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' },
      );
    };
    setState('play');
    const bar = controls(root);
    (Object.keys(states) as (keyof typeof states)[]).forEach((name) => {
      bar.appendChild(button(name, () => setState(name)));
    });
  },
};

const requestFlow: Demo = {
  id: 'vector-request-flow',
  title: 'Animated request flow',
  category: 'vector',
  summary: 'A request travels through a chain of components, lighting each one up.',
  trigger: 'Automatic on a loop',
  techniques: [313, 314, 219],
  keywords: 'api request flow data nodes sequence',
  mount({ root, reduced }) {
    const svg = svgStage(root, '0 0 420 180');
    const nodes = [40, 140, 240, 340].map((x, i) => {
      const g = document.createElementNS(SVG_NS, 'g');
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', String(x - 30));
      rect.setAttribute('y', '60');
      rect.setAttribute('width', '60');
      rect.setAttribute('height', '44');
      rect.setAttribute('rx', '6');
      rect.setAttribute('class', 'demo__node');
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', String(x));
      text.setAttribute('y', '87');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'demo__node-text');
      text.textContent = ['client', 'api', 'db', 'ui'][i];
      g.append(rect, text);
      svg.appendChild(g);
      return rect;
    });

    const lines = [0, 1, 2].map((i) => {
      const l = document.createElementNS(SVG_NS, 'line');
      l.setAttribute('x1', String(70 + i * 100));
      l.setAttribute('y1', '82');
      l.setAttribute('x2', String(110 + i * 100));
      l.setAttribute('y2', '82');
      l.setAttribute('class', 'demo__line');
      svg.appendChild(l);
      return l;
    });

    if (reduced) return;
    const pulse = document.createElementNS(SVG_NS, 'circle');
    pulse.setAttribute('r', '5');
    pulse.setAttribute('class', 'demo__dot demo__dot--ember');
    svg.appendChild(pulse);
    const state = { i: 0 };
    gsap.to(state, {
      i: 4,
      duration: 2.6,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const t = state.i % 4;
        const next = (t + 1) % 4;
        const x = 40 + t * 100 + ((state.i % 1) * 100);
        pulse.setAttribute('cx', String(x));
        pulse.setAttribute('cy', '82');
        nodes.forEach((n, i) => n.classList.toggle('is-active', i <= t));
        lines.forEach((l, i) => l.classList.toggle('is-active', i < t));
        void next;
      },
    });
  },
};

export const vectorDemos: Demo[] = [
  pathDraw,
  pathMorph,
  lineArt,
  gradientSvg,
  clipMask,
  filterDistort,
  contourLines,
  generativeGeometry,
  orbits,
  pointGrid,
  iconStates,
  requestFlow,
];
