/**
 * The brand signature chapter.
 *
 * The emblem is not an image on this page — it is data. We sample the alpha
 * channel of the supplied `logo_color.png`, turn every opaque sample into a
 * particle, and then assemble them in front of the visitor. The pointer
 * pushes the field around; the button rebuilds it.
 */

import { $ } from '../core/dom';
import { createLoop, fitCanvas } from '../core/loop';
import { gsap } from '../core/motion';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  ember: boolean;
}

const SAMPLE_WIDTH = 116;

export function initMark(): () => void {
  const section = $<HTMLElement>('#mark');
  const canvas = $<HTMLCanvasElement>('[data-mark-canvas]');
  const reassemble = $<HTMLButtonElement>('[data-reassemble]');
  const silhouette = $<HTMLButtonElement>('[data-toggle-silhouette]');
  if (!section || !canvas) return () => {};

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const cleanups: (() => void)[] = [];
  const state = {
    particles: [] as Particle[],
    assembled: false,
    silhouette: false,
    pointer: { x: -9999, y: -9999, active: false },
    progress: 0,
  };

  const buildParticles = async () => {
    const image = new Image();
    image.src = './logo_color.webp';
    try {
      await image.decode();
    } catch {
      // The asset may already be decoded; continue either way.
    }

    /*
     * A broken or still-loading image cannot be drawn: the browser throws
     * a DOMException and the whole chapter dies with it. Check first.
     */
    if (!image.complete || image.naturalWidth === 0) return;

    const source = document.createElement('canvas');
    const width = SAMPLE_WIDTH;
    const height = Math.max(
      1,
      Math.round((image.naturalHeight / Math.max(1, image.naturalWidth)) * SAMPLE_WIDTH),
    );
    source.width = width;
    source.height = height;
    const sctx = source.getContext('2d');
    if (!sctx) return;
    sctx.clearRect(0, 0, width, height);
    sctx.drawImage(image, 0, 0, width, height);

    const data = sctx.getImageData(0, 0, width, height).data;
    const particles: Particle[] = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        if (alpha < 40) continue;
        const r = data[index];
        const b = data[index + 2];
        const warm = r > b;
        particles.push({
          x: Math.random() * 1.4 - 0.2,
          y: Math.random() * 1.4 - 0.2,
          tx: x / width,
          ty: y / height,
          vx: 0,
          vy: 0,
          size: 0.7 + Math.random() * 1.5,
          ember: warm,
        });
      }
    }
    state.particles = particles;
    assemble();
  };

  const assemble = () => {
    state.assembled = true;
    state.progress = 0;
    state.particles.forEach((particle) => {
      particle.x = Math.random() * 1.4 - 0.2;
      particle.y = Math.random() * 1.4 - 0.2;
      particle.vx = 0;
      particle.vy = 0;
    });
    section.classList.add('is-assembled');
  };

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = (event.clientX - rect.left) / rect.width;
    state.pointer.y = (event.clientY - rect.top) / rect.height;
    state.pointer.active = true;
  };
  const onPointerLeave = () => {
    state.pointer.active = false;
  };
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  cleanups.push(() => {
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerleave', onPointerLeave);
  });

  const loop = createLoop({
    observe: canvas,
    draw(dt) {
      const fitted = fitCanvas(canvas);
      if (!fitted) return;
      const { ctx: c, width, height } = fitted;
      c.clearRect(0, 0, width, height);
      if (!state.particles.length) return;

      const step = Math.min(2.2, dt * 60);
      state.progress = Math.min(1, state.progress + 0.012 * step);

      for (const particle of state.particles) {
        const pull = 0.045 * state.progress;
        particle.vx += (particle.tx - particle.x) * pull;
        particle.vy += (particle.ty - particle.y) * pull;

        if (state.pointer.active) {
          const dx = particle.x - state.pointer.x;
          const dy = particle.y - state.pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 0.12 && d > 0.0001) {
            const force = (0.12 - d) * 0.9;
            particle.vx += (dx / d) * force;
            particle.vy += (dy / d) * force;
          }
        }

        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.x += particle.vx * 0.04 * step;
        particle.y += particle.vy * 0.04 * step;

        const px = particle.x * width;
        const py = particle.y * height;
        const alpha = Math.min(1, 0.25 + state.progress * 0.75);
        c.globalAlpha = alpha;
        if (state.silhouette) {
          c.fillStyle = '#edeeea';
        } else {
          c.fillStyle = particle.ember ? '#f0490f' : '#ffb627';
        }
        c.beginPath();
        c.arc(px, py, particle.size, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    },
  });
  cleanups.push(() => loop.destroy());

  reassemble?.addEventListener('click', () => {
    assemble();
    window.dispatchEvent(new CustomEvent('denvup:emblem-pulse'));
  });
  cleanups.push(() => reassemble?.removeEventListener('click', assemble));

  silhouette?.addEventListener('click', () => {
    state.silhouette = !state.silhouette;
    silhouette.setAttribute('aria-pressed', String(state.silhouette));
    silhouette.querySelector('span')?.replaceChildren(
      document.createTextNode(state.silhouette ? 'View colour' : 'View silhouette'),
    );
  });

  // Hover reveals a fine detail ring (encyclopedia 396).
  const stage = section.querySelector<HTMLElement>('.mark-chapter__stage');
  if (stage) {
    const onEnter = () => stage.classList.add('is-detail');
    const onLeave = () => stage.classList.remove('is-detail');
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('focusin', onEnter);
    stage.addEventListener('focusout', onLeave);
    cleanups.push(() => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
    });
  }

  // The secret word pulses the emblem.
  const onPulse = () => {
    gsap.fromTo(
      canvas,
      { scale: 1 },
      { scale: 1.04, duration: 0.18, yoyo: true, repeat: 3, ease: 'sine.inOut' },
    );
    assemble();
  };
  window.addEventListener('denvup:emblem-pulse', onPulse);
  cleanups.push(() => window.removeEventListener('denvup:emblem-pulse', onPulse));

  void buildParticles();

  return () => cleanups.forEach((fn) => fn());
}
