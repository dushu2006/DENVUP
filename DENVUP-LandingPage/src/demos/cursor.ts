/** Cursor and pointer demonstrations. */

import { el } from '../core/dom';
import { createLoop, fitCanvas } from '../core/loop';
import { artwork, canvasStage, hint, palette, stage } from './helpers';
import type { Demo, DemoContext } from './types';

type TrailMode = 'fade' | 'speed' | 'art';

function trailDemo(options: {
  id: string;
  title: string;
  summary: string;
  techniques: number[];
  keywords: string;
  mode: TrailMode;
}): Demo {
  return {
    id: options.id,
    title: options.title,
    category: 'cursor',
    summary: options.summary,
    trigger: 'Move the pointer across the panel',
    techniques: options.techniques,
    keywords: options.keywords,
    mount({ root, reduced, budget }: DemoContext) {
      const canvas = canvasStage(root, 'demo__stage--canvas');
      const points: { x: number; y: number; life: number }[] = [];
      const pointer = { x: -999, y: -999, speed: 0 };
      let last = { x: 0, y: 0 };

      const onMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        pointer.speed = Math.hypot(x - last.x, y - last.y);
        last = { x, y };
        pointer.x = x;
        pointer.y = y;
      };

      const density = budget === 'low' ? 1 : 2;

      const loop = createLoop({
        observe: canvas,
        draw() {
          const fitted = fitCanvas(canvas);
          if (!fitted) return;
          const { ctx, width, height } = fitted;
          ctx.clearRect(0, 0, width, height);

          if (options.mode === 'art') {
            ctx.fillStyle = 'rgba(240,73,15,0.09)';
            ctx.fillRect(0, 0, width, height);
          }

          if (options.mode === 'speed' && pointer.speed > 2) {
            const count = Math.min(8, Math.ceil(pointer.speed / 6)) * density;
            for (let i = 0; i < count; i += 1) {
              points.push({
                x: pointer.x + (Math.random() - 0.5) * 6,
                y: pointer.y + (Math.random() - 0.5) * 6,
                life: 1,
              });
            }
          } else if (pointer.x > -900) {
            /*
             * The fading trail and the artwork trail both lay down a point
             * wherever the pointer is. The speed trail is the only one that
             * waits for a threshold — and it must not be the branch that
             * decides whether the canvas gets any ink at all.
             */
            points.push({ x: pointer.x, y: pointer.y, life: 1 });
          }

          for (let i = points.length - 1; i >= 0; i -= 1) {
            const p = points[i];
            p.life -= options.mode === 'fade' ? 0.028 : 0.05;
            if (p.life <= 0) {
              points.splice(i, 1);
              continue;
            }
            const size = 2 + p.life * (options.mode === 'speed' ? 4 : 2.4);
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle =
              options.mode === 'art'
                ? palette.amber
                : options.mode === 'speed'
                  ? palette.signal
                  : palette.ember;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        },
      });

      canvas.addEventListener('pointermove', onMove);
      if (reduced) {
        hint(root, 'Reduced motion is on: the trail is drawn once instead of animating.');
      }
      return () => {
        canvas.removeEventListener('pointermove', onMove);
        loop.destroy();
      };
    },
  };
}

const maskRevealDemo: Demo = {
  id: 'cursor-mask-reveal',
  title: 'Cursor reveals a second artwork',
  category: 'cursor',
  summary:
    'A circular mask follows the pointer and uncovers a second image underneath the first.',
  trigger: 'Move the pointer over the panel',
  techniques: [31, 32],
  keywords: 'mask reveal hover image second layer',
  mount({ root }) {
    const box = stage(root, 'demo__stage--stack');
    const a = el('img', 'demo__layer');
    const b = el('img', 'demo__layer demo__layer--top');
    a.src = artwork('a');
    b.src = artwork('b');
    a.alt = '';
    b.alt = '';
    box.append(a, b);

    const onMove = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      b.style.clipPath = `circle(70px at ${x}px ${y}px)`;
    };
    const onLeave = () => {
      b.style.clipPath = 'circle(0px at -200px -200px)';
    };
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);
    return () => {
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
    };
  },
};

const parallaxDemo: Demo = {
  id: 'cursor-parallax',
  title: 'Pointer-driven parallax layers',
  category: 'cursor',
  summary: 'Three layers move at different rates against the pointer to build depth.',
  trigger: 'Move the pointer across the panel',
  techniques: [41, 44],
  keywords: 'parallax depth pointer layers',
  mount({ root }) {
    const box = stage(root, 'demo__stage--stack');
    const layer = (depth: number, cls: string) => {
      const node = el('div', `demo__plane demo__plane--${cls}`);
      node.dataset.depth = String(depth);
      box.appendChild(node);
      return node;
    };
    layer(0.12, 'back');
    layer(0.3, 'mid');
    layer(0.6, 'front');

    const onMove = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      box.querySelectorAll<HTMLElement>('.demo__plane').forEach((node) => {
        const depth = Number(node.dataset.depth ?? 0);
        node.style.transform = `translate3d(${(-x * depth * 40).toFixed(2)}px, ${(
          -y * depth * 40
        ).toFixed(2)}px, 0)`;
      });
    };
    box.addEventListener('pointermove', onMove);
    return () => box.removeEventListener('pointermove', onMove);
  },
};

const spotlightDemo: Demo = {
  id: 'cursor-spotlight',
  title: 'Soft spotlight follows the pointer',
  category: 'cursor',
  summary: 'A masked radial light tracks the pointer and reveals the hidden layer beneath.',
  trigger: 'Move the pointer across the panel',
  techniques: [27, 40],
  keywords: 'spotlight light pointer radial',
  mount({ root }) {
    const box = stage(root, 'demo__stage--stack');
    const base = el('div', 'demo__plate demo__plate--base');
    const glow = el('div', 'demo__plate demo__plate--glow');
    const type = el('span', 'demo__plate-word');
    type.textContent = 'DENVUP';
    base.appendChild(type);
    box.append(base, glow);

    const onMove = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      glow.style.setProperty('--x', `${event.clientX - rect.left}px`);
      glow.style.setProperty('--y', `${event.clientY - rect.top}px`);
    };
    box.addEventListener('pointermove', onMove);
    return () => box.removeEventListener('pointermove', onMove);
  },
};

const rippleDemo: Demo = {
  id: 'cursor-ripple',
  title: 'Pointer-triggered ripple',
  category: 'effects',
  summary: 'Every press sends a ring across the surface; the ring grows and fades.',
  trigger: 'Press anywhere in the panel',
  techniques: [45, 286],
  keywords: 'ripple click ring wave',
  mount({ root }) {
    const box = stage(root, 'demo__stage--stack demo__stage--ripple');
    const onPress = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      const ring = el('span', 'demo__ripple');
      ring.style.left = `${event.clientX - rect.left}px`;
      ring.style.top = `${event.clientY - rect.top}px`;
      box.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());
    };
    box.addEventListener('pointerdown', onPress);
    return () => box.removeEventListener('pointerdown', onPress);
  },
};

export const cursorDemos: Demo[] = [
  trailDemo({
    id: 'cursor-fade-trail',
    title: 'Fading cursor trail',
    summary: 'Every pointer position leaves a mark that fades away behind it.',
    techniques: [29],
    keywords: 'trail fade canvas',
    mode: 'fade',
  }),
  trailDemo({
    id: 'cursor-speed-trail',
    title: 'Pointer-speed particle trail',
    summary: 'The faster the pointer moves, the more particles it throws off.',
    techniques: [30, 44],
    keywords: 'speed velocity particles trail',
    mode: 'speed',
  }),
  trailDemo({
    id: 'cursor-art-trail',
    title: 'Trail changes over interactive artwork',
    summary:
      'Crossing the artwork switches the trail from ember to amber and leaves a warm wash behind it.',
    techniques: [49],
    keywords: 'artwork trail colour change',
    mode: 'art',
  }),
  maskRevealDemo,
  parallaxDemo,
  spotlightDemo,
  rippleDemo,
];
