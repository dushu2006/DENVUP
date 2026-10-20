/** Particle, generative-art and background demonstrations. */

import { el } from '../core/dom';
import { createLoop, fitCanvas } from '../core/loop';
import { button, canvasStage, controls, hint, palette, seeded, stage } from './helpers';
import type { Demo } from './types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

function particleCount(budget: 'low' | 'mid' | 'high', base: number): number {
  if (budget === 'low') return Math.round(base * 0.35);
  if (budget === 'mid') return Math.round(base * 0.65);
  return base;
}

const dust: Demo = {
  id: 'particles-dust',
  title: 'Floating dust',
  category: 'particles',
  summary: 'Slow motes drift across the frame with a gentle parallax between depths.',
  trigger: 'Automatic',
  techniques: [251],
  keywords: 'dust float ambient background',
  mount({ root, budget }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const count = particleCount(budget, 90);
    const rand = seeded(17);
    const parts: Particle[] = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      vx: (rand() - 0.5) * 0.012,
      vy: -0.004 - rand() * 0.012,
      life: rand(),
      size: 0.6 + rand() * 2.2,
    }));

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);
        parts.forEach((p) => {
          p.x += p.vx * 0.01;
          p.y += p.vy * 0.01;
          if (p.y < -0.05) {
            p.y = 1.05;
            p.x = rand();
          }
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;
          ctx.globalAlpha = 0.25 + p.life * 0.5;
          ctx.fillStyle = palette.amber;
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      },
    });
    return () => loop.destroy();
  },
};

const starfield: Demo = {
  id: 'particles-starfield',
  title: 'Starfield with depth parallax',
  category: 'particles',
  summary: 'Stars stream past the camera, and nearer ones move faster.',
  trigger: 'Automatic',
  techniques: [252],
  keywords: 'starfield space depth parallax',
  mount({ root, budget }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const count = particleCount(budget, 220);
    const rand = seeded(99);
    const parts = Array.from({ length: count }, () => ({
      x: rand() * 2 - 1,
      y: rand() * 2 - 1,
      z: rand(),
      size: 0.4 + rand() * 1.6,
    }));
    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.fillStyle = 'rgba(11,11,12,0.28)';
        ctx.fillRect(0, 0, width, height);
        parts.forEach((p) => {
          p.z -= 0.004;
          if (p.z <= 0.02) {
            p.z = 1;
            p.x = rand() * 2 - 1;
            p.y = rand() * 2 - 1;
          }
          const k = 0.6 / p.z;
          const x = width / 2 + p.x * width * k * 0.5;
          const y = height / 2 + p.y * height * k * 0.5;
          ctx.globalAlpha = Math.max(0, 1 - p.z);
          ctx.fillStyle = '#edeeea';
          ctx.beginPath();
          ctx.arc(x, y, p.size * k, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      },
    });
    return () => loop.destroy();
  },
};

const pointerParticles: Demo = {
  id: 'particles-pointer',
  title: 'Particles react to the pointer',
  category: 'particles',
  summary: 'The pointer pushes the field away, and the field slowly returns.',
  trigger: 'Move the pointer over the panel',
  techniques: [253, 241],
  keywords: 'particles pointer repel push field',
  mount({ root, budget }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const count = particleCount(budget, 140);
    const rand = seeded(5);
    const parts = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      vx: 0,
      vy: 0,
      life: rand(),
      size: 1 + rand() * 2.4,
    }));
    const pointer = { x: -999, y: -999, active: false };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);
        parts.forEach((p) => {
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 0.16 && d > 0.0001) {
              const force = (0.16 - d) * 0.09;
              p.vx += (dx / d) * force;
              p.vy += (dy / d) * force;
            }
          }
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.x += p.vx;
          p.y += p.vy;
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = palette.ember;
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      },
    });
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      loop.destroy();
    };
  },
};

const connections: Demo = {
  id: 'particles-connections',
  title: 'Particles connect when they are near',
  category: 'particles',
  summary: 'A line is drawn between any two particles that come within range.',
  trigger: 'Move the pointer to gather them',
  techniques: [254, 258],
  keywords: 'particles connect network lines near',
  mount({ root, budget }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const count = particleCount(budget, 70);
    const rand = seeded(23);
    const parts = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      vx: (rand() - 0.5) * 0.004,
      vy: (rand() - 0.5) * 0.004,
      life: rand(),
      size: 1 + rand() * 1.6,
    }));
    const pointer = { x: -999, y: -999, active: false };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);

        parts.forEach((p) => {
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 0.2) {
              p.x -= (dx / (d || 1)) * 0.004;
              p.y -= (dy / (d || 1)) * 0.004;
            }
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
        });

        const limit = 0.14;
        ctx.lineWidth = 0.7;
        for (let i = 0; i < parts.length; i += 1) {
          for (let j = i + 1; j < parts.length; j += 1) {
            const dx = parts[i].x - parts[j].x;
            const dy = parts[i].y - parts[j].y;
            const d = Math.hypot(dx, dy);
            if (d < limit) {
              ctx.globalAlpha = (1 - d / limit) * 0.5;
              ctx.strokeStyle = palette.signal;
              ctx.beginPath();
              ctx.moveTo(parts[i].x * width, parts[i].y * height);
              ctx.lineTo(parts[j].x * width, parts[j].y * height);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        parts.forEach((p) => {
          ctx.fillStyle = palette.amber;
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      },
    });
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      loop.destroy();
    };
  },
};

const flowField: Demo = {
  id: 'particles-flow',
  title: 'Particle flow field',
  category: 'particles',
  summary: 'Particles follow a vector field, which produces the look of moving water or smoke.',
  trigger: 'Automatic',
  techniques: [256, 257],
  keywords: 'flow field noise particles organic',
  mount({ root, budget }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const count = particleCount(budget, 420);
    const rand = seeded(41);
    const parts = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      life: rand(),
      size: 0.6 + rand() * 1.4,
    }));
    const loop = createLoop({
      observe: canvas,
      draw(dt, time) {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.fillStyle = 'rgba(11,11,12,0.16)';
        ctx.fillRect(0, 0, width, height);
        parts.forEach((p) => {
          const angle =
            Math.sin(p.x * 6 + time * 0.4) * 1.4 + Math.cos(p.y * 5 - time * 0.3) * 1.4;
          p.x += Math.cos(angle) * 0.0016;
          p.y += Math.sin(angle) * 0.0016;
          p.life -= 0.006;
          if (p.life <= 0 || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) {
            p.x = rand();
            p.y = rand();
            p.life = 1;
          }
          ctx.globalAlpha = Math.max(0, p.life) * 0.6;
          ctx.fillStyle = palette.ember;
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        void dt;
      },
    });
    return () => loop.destroy();
  },
};

const dotMatrix: Demo = {
  id: 'particles-dot-matrix',
  title: 'Reactive dot matrix',
  category: 'particles',
  summary: 'A matrix of dots swells and brightens around the pointer.',
  trigger: 'Move the pointer over the panel',
  techniques: [259, 260],
  keywords: 'dot matrix grid reactive pointer',
  mount({ root }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const cols = 26;
    const rows = 16;
    const pointer = { x: -999, y: -999, active: false };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);
        const gapX = width / cols;
        const gapY = height / rows;
        for (let x = 0; x < cols; x += 1) {
          for (let y = 0; y < rows; y += 1) {
            const px = (x + 0.5) * gapX;
            const py = (y + 0.5) * gapY;
            let d = 999;
            if (pointer.active) {
              d = Math.hypot(px / width - pointer.x, py / height - pointer.y);
            }
            const influence = Math.max(0, 1 - d / 0.22);
            const r = 1.2 + influence * 4.4;
            ctx.globalAlpha = 0.3 + influence * 0.7;
            ctx.fillStyle = influence > 0.35 ? palette.amber : palette.ember;
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      },
    });
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      loop.destroy();
    };
  },
};

const waveField: Demo = {
  id: 'particles-wave',
  title: 'Procedural wave field',
  category: 'particles',
  summary: 'A line graph driven by layered sine waves, redrawn every frame.',
  trigger: 'Automatic',
  techniques: [261, 264, 475],
  keywords: 'wave field procedural sine data',
  mount({ root }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const loop = createLoop({
      observe: canvas,
      draw(_, time) {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1.6;
        for (let layer = 0; layer < 3; layer += 1) {
          ctx.beginPath();
          ctx.strokeStyle = layer === 0 ? palette.ember : layer === 1 ? palette.amber : palette.signal;
          ctx.globalAlpha = 0.9 - layer * 0.22;
          for (let x = 0; x <= width; x += 4) {
            const nx = x / width;
            const y =
              height / 2 +
              Math.sin(nx * 9 + time * 1.4 + layer) * (26 - layer * 6) +
              Math.sin(nx * 21 - time * 0.9) * (9 - layer * 2);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      },
    });
    return () => loop.destroy();
  },
};

const morphShapes: Demo = {
  id: 'particles-morph',
  title: 'Particles morph between shapes',
  category: 'particles',
  summary: 'The same particles re-target between a circle, a square and a triangle.',
  trigger: 'Press Next shape',
  techniques: [468, 270],
  keywords: 'particle morph shapes retarget',
  mount({ root, budget }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const count = particleCount(budget, 260);
    const rand = seeded(3);
    const parts = Array.from({ length: count }, () => ({ x: rand(), y: rand(), tx: 0, ty: 0 }));
    const shapes = ['circle', 'square', 'triangle'] as const;
    let shapeIndex = 0;

    const assign = () => {
      parts.forEach((p, i) => {
        const t = i / parts.length;
        let x = 0;
        let y = 0;
        if (shapes[shapeIndex] === 'circle') {
          const a = t * Math.PI * 2;
          const r = 0.34 * Math.sqrt(rand());
          x = 0.5 + Math.cos(a) * r;
          y = 0.5 + Math.sin(a) * r;
        } else if (shapes[shapeIndex] === 'square') {
          x = 0.16 + rand() * 0.68;
          y = 0.16 + rand() * 0.68;
        } else {
          const a = t * Math.PI * 2;
          const r = 0.38 * Math.sqrt(rand());
          x = 0.5 + Math.cos(a) * r;
          y = 0.5 + Math.sin(a) * r * 0.8 - 0.05;
        }
        p.tx = x;
        p.ty = y;
      });
    };
    assign();

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);
        parts.forEach((p) => {
          p.x += (p.tx - p.x) * 0.045;
          p.y += (p.ty - p.y) * 0.045;
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = palette.amber;
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      },
    });

    const bar = controls(root);
    bar.appendChild(
      button('Next shape', () => {
        shapeIndex = (shapeIndex + 1) % shapes.length;
        assign();
      }),
    );
    return () => loop.destroy();
  },
};

const liquidGradient: Demo = {
  id: 'particles-liquid-gradient',
  title: 'Liquid gradient background',
  category: 'particles',
  summary: 'Blended colour fields that drift like ink in water.',
  trigger: 'Automatic',
  techniques: [263, 262],
  keywords: 'liquid gradient mesh colour background',
  mount({ root }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const loop = createLoop({
      observe: canvas,
      draw(_, time) {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx, width, height } = fitted;
        ctx.clearRect(0, 0, width, height);
        const blobs = [
          { c: '240,73,15', r: 0.34, a: 0.9, s: 0.00021 },
          { c: '255,182,39', r: 0.28, a: 0.6, s: -0.00016 },
          { c: '43,57,230', r: 0.3, a: 0.55, s: 0.00013 },
        ];
        ctx.globalCompositeOperation = 'lighter';
        blobs.forEach((b, i) => {
          const x = width * (0.5 + Math.cos(time * b.s * 1000 + i) * 0.28);
          const y = height * (0.5 + Math.sin(time * b.s * 820 + i * 2) * 0.3);
          const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height) * b.r);
          g.addColorStop(0, `rgba(${b.c},${b.a})`);
          g.addColorStop(1, `rgba(${b.c},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);
        });
        ctx.globalCompositeOperation = 'source-over';
      },
    });
    return () => loop.destroy();
  },
};

const microIllustration: Demo = {
  id: 'particles-micro-illustration',
  title: 'Randomised micro-illustration with a stable fallback',
  category: 'particles',
  summary: 'A small drawing generated from a seed — identical on every visit, and shown as a fallback when motion is off.',
  trigger: 'Press Reseed',
  techniques: [403, 270],
  keywords: 'micro illustration seeded random fallback',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--vector');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 160');
    svg.setAttribute('class', 'demo__svg');
    wrap.appendChild(svg);
    let seed = 12;
    const draw = () => {
      svg.innerHTML = '';
      const rand = seeded(seed);
      for (let i = 0; i < 7; i += 1) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', (20 + rand() * 160).toFixed(1));
        c.setAttribute('cy', (20 + rand() * 120).toFixed(1));
        c.setAttribute('r', (5 + rand() * 22).toFixed(1));
        c.setAttribute('class', rand() > 0.5 ? 'demo__dot demo__dot--ember' : 'demo__dot demo__dot--soft');
        c.setAttribute('opacity', (0.3 + rand() * 0.6).toFixed(2));
        svg.appendChild(c);
      }
    };
    draw();
    const bar = controls(root);
    bar.appendChild(
      button('Reseed', () => {
        seed = (seed * 7 + 13) % 997;
        draw();
      }),
    );
    hint(root, 'The same seed always redraws the same picture.');
  },
};

export const particleDemos: Demo[] = [
  dust,
  starfield,
  pointerParticles,
  connections,
  flowField,
  dotMatrix,
  waveField,
  morphShapes,
  liquidGradient,
  microIllustration,
];

export { el };
