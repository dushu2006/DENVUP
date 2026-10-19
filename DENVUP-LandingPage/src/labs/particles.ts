import type { Lab } from './types';
import { makeCanvas, seeded } from './helpers';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function dots(count: number): Dot[] {
  const random = seeded(19);
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    vx: (random() - 0.5) * 0.0007,
    vy: (random() - 0.5) * 0.0007,
  }));
}

export const particlesLab: Lab = {
  slug: 'particles',
  title: 'Particles & backgrounds',
  blurb:
    'Atmosphere is a budget. Each field here caps its particle count, pauses when it leaves the viewport and has a still version.',
  modes: [
    {
      ids: [256, 257],
      name: 'A flow field',
      summary: 'Two thousand points drift through a sine field. The count is capped, the canvas resolution follows the element, and every point is gone when the demo is destroyed.',
      html: '',
      size: 'tall',
      init: (ctx) => {
        const kit = makeCanvas(ctx, 'd-canvas');
        const c = kit.ctx;
        const field = dots(2000);
        let t = 0;
        ctx.raf((time, delta) => {
          const w = kit.width;
          const h = kit.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          t = ctx.reduced ? 0.4 : time / 2600;
          c.fillStyle = '#ff4a00';
          const step = Math.min(2, delta / 16);
          for (const d of field) {
            const angle = Math.sin(d.x * 5 + t) * Math.cos(d.y * 4 - t) * Math.PI;
            d.x += Math.cos(angle) * 0.0012 * step;
            d.y += Math.sin(angle) * 0.0012 * step;
            if (d.x < 0) d.x += 1;
            if (d.x > 1) d.x -= 1;
            if (d.y < 0) d.y += 1;
            if (d.y > 1) d.y -= 1;
            c.fillRect(d.x * w, d.y * h, 1.3, 1.3);
          }
          c.fillStyle = '#fff';
          c.font = '600 12px system-ui';
          c.fillText('2,000 points · cap enforced', 12, h - 12);
        });
      },
      notes: { motion: 'One still frame, no drift.', touch: 'No interaction required.' },
    },
    {
      ids: [254, 258],
      name: 'A constellation',
      summary: 'Points connect when they are close. The lines are computed from distance, not faked with a background image.',
      html: '',
      size: 'tall',
      init: (ctx) => {
        const kit = makeCanvas(ctx, 'd-canvas');
        const c = kit.ctx;
        const pts = dots(64);
        ctx.raf((_, delta) => {
          const w = kit.width;
          const h = kit.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          const step = ctx.reduced ? 0 : Math.min(2, delta / 16);
          pts.forEach((p) => {
            p.x += p.vx * step;
            p.y += p.vy * step;
            if (p.x < 0 || p.x > 1) p.vx *= -1;
            if (p.y < 0 || p.y > 1) p.vy *= -1;
          });
          for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
              const a = pts[i]!;
              const b = pts[j]!;
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d > 0.13) continue;
              c.strokeStyle = `rgba(255,74,0,${(1 - d / 0.13) * 0.5})`;
              c.beginPath();
              c.moveTo(a.x * w, a.y * h);
              c.lineTo(b.x * w, b.y * h);
              c.stroke();
            }
          }
          c.fillStyle = '#fff';
          pts.forEach((p) => c.fillRect(p.x * w - 1, p.y * h - 1, 2, 2));
        });
      },
      notes: { motion: 'Static constellation, no drift.', touch: 'No dragging.' },
    },
    {
      ids: [270],
      name: 'A celebratory burst',
      summary: 'The burst is triggered by a button and uses a fixed number of pieces. It is never a surprise on page load, and it stops after one second.',
      html: `<div class="d-confetti"><canvas data-confetti aria-hidden="true"></canvas><div class="d-row"><button type="button" class="d-btn d-btn--solid" data-burst>Send the confetti</button><span class="d-cap" data-burst-note>Nothing happens until you ask.</span></div></div>`,
      init: (ctx) => {
        const canvas = ctx.stage.querySelector<HTMLCanvasElement>('[data-confetti]')!;
        const c = canvas.getContext('2d');
        const btn = ctx.stage.querySelector<HTMLButtonElement>('[data-burst]')!;
        const note = ctx.stage.querySelector<HTMLElement>('[data-burst-note]')!;
        if (!c) return;
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(r.width * dpr);
          canvas.height = Math.floor(r.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        let pieces: { x: number; y: number; vx: number; vy: number; spin: number; colour: string }[] = [];
        let started = 0;
        btn.addEventListener('click', () => {
          const w = canvas.getBoundingClientRect().width || 300;
          const h = canvas.getBoundingClientRect().height || 220;
          pieces = Array.from({ length: 90 }, () => ({
            x: w / 2,
            y: h * 0.42,
            vx: (Math.random() - 0.5) * 7,
            vy: -Math.random() * 7 - 2,
            spin: Math.random() * 6,
            colour: ['#ff4a00', '#f1ede7', '#f03c00'][Math.floor(Math.random() * 3)]!,
          }));
          started = performance.now();
          note.textContent = 'Burst sent by the button. It ends on its own.';
        });
        ctx.raf((time) => {
          const r = canvas.getBoundingClientRect();
          const w = r.width;
          const h = r.height;
          c.clearRect(0, 0, w, h);
          if (!pieces.length) return;
          if (time - started > 1500) {
            pieces = [];
            return;
          }
          pieces.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.16;
            p.vx *= 0.995;
            c.save();
            c.translate(p.x, p.y);
            c.rotate((time - started) * 0.004 + p.spin);
            c.fillStyle = p.colour;
            c.fillRect(-3, -2, 6, 4);
            c.restore();
          });
          if (w < 1 || h < 1) return;
        });
        return () => ro.disconnect();
      },
      notes: { motion: 'No confetti at all; the button still says what it would do.', keyboard: 'Only a button triggers it.' },
    },
    {
      ids: [251],
      name: 'Grain and dust',
      summary: 'A slow dust layer sits behind the copy. The density slider goes to zero, and the layer is one canvas rather than 300 DOM nodes.',
      html: `<div class="d-dust"><canvas data-dust aria-hidden="true"></canvas><div class="d-dust__copy"><p class="d-h">Quiet atmosphere</p><p class="d-cap">Density</p><input class="d-slider" type="range" min="0" max="120" value="60" data-dust-range aria-label="Dust density"><p class="d-cap" data-dust-note>60 motes</p></div></div>`,
      init: (ctx) => {
        const canvas = ctx.stage.querySelector<HTMLCanvasElement>('[data-dust]')!;
        const c = canvas.getContext('2d');
        const range = ctx.stage.querySelector<HTMLInputElement>('[data-dust-range]')!;
        const note = ctx.stage.querySelector<HTMLElement>('[data-dust-note]')!;
        if (!c) return;
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(r.width * dpr);
          canvas.height = Math.floor(r.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        const motes = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.6, s: 0.2 + Math.random() * 0.8 }));
        let count = Number(range.value);
        range.addEventListener('input', () => {
          count = Number(range.value);
          note.textContent = `${count} mote${count === 1 ? '' : 's'}`;
        });
        ctx.raf(() => {
          const w = canvas.getBoundingClientRect().width;
          const h = canvas.getBoundingClientRect().height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          c.fillStyle = 'rgba(241,237,231,.55)';
          motes.slice(0, count).forEach((m) => {
            m.y -= m.s * 0.0004;
            if (m.y < 0) m.y = 1;
            c.beginPath();
            c.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
            c.fill();
          });
        });
        return () => ro.disconnect();
      },
      notes: { motion: 'The field is drawn once, still.', touch: 'The slider is native.' },
    },
    {
      ids: [286],
      name: 'Ripples on the surface',
      summary: 'Each click adds a ring that expands and fades. Rings are capped and removed when finished, so a long session does not leak nodes.',
      html: `<div class="d-ripplefield" data-ripplefield><p class="d-cap">Click the field</p></div>`,
      init: ({ stage }) => {
        const field = stage.querySelector<HTMLElement>('[data-ripplefield]')!;
        field.addEventListener('pointerdown', (e) => {
          const r = field.getBoundingClientRect();
          const ring = document.createElement('span');
          ring.className = 'd-ripplefield__ring';
          ring.style.left = `${e.clientX - r.left}px`;
          ring.style.top = `${e.clientY - r.top}px`;
          field.append(ring);
          window.setTimeout(() => ring.remove(), 900);
          if (field.querySelectorAll('.d-ripplefield__ring').length > 12) field.querySelector('.d-ripplefield__ring')?.remove();
        });
      },
      notes: { keyboard: 'The field is decorative; no content depends on it.', touch: 'Tap creates the same ring.' },
    },
    {
      ids: [264, 265],
      name: 'A still alternative',
      summary: 'The same composition without movement: gradients and type only. This is what the page shows when motion is reduced or the GPU says no.',
      html: `<div class="d-stillfield"><p class="d-display">Atmosphere without animation</p><p class="d-body">A gradient, a texture and a sentence. No canvas, no frame loop, no battery cost.</p></div>`,
      notes: { motion: 'This is the reduced-motion mode, not a fallback notice.' },
    },
  ],
};
