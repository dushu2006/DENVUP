/**
 * DENVUP — the persistent stage.
 *
 * One canvas lives behind the whole site for the whole session. It is never
 * destroyed and never re-created: when the visitor moves from one route to
 * another, or from one chapter of the home page to the next, the stage is
 * *re-parameterised* — its palette, density, speed, field swirl, camera zoom
 * and seed all move toward a new target. That continuous change is the thing
 * that makes the site feel like one place rather than a stack of documents.
 *
 * The stage is decorative. It is `aria-hidden`, it never takes pointer
 * events, and if the 2D context cannot be created it falls back to a flat
 * painted field so the composition still reads.
 *
 * Under `prefers-reduced-motion` the loop never starts: one composed frame
 * is drawn and left there.
 */

import { env } from './env';
import { createLoop, fitCanvas, type LoopHandle } from './loop';
import { gsap } from './motion';

export interface StageLook {
  /** Particle colour. */
  ink: string;
  /** The faint field wash painted under the particles. */
  wash: string;
  /** Particles per 100 000 css px². */
  density: number;
  /** Field velocity multiplier. */
  speed: number;
  /** How hard the field turns. */
  swirl: number;
  /** Stroke length as a fraction of the viewport's short side. */
  length: number;
  /** Camera zoom. 1 = normal; the field is scaled about the centre. */
  zoom: number;
  /** Camera offset, as a fraction of the viewport. */
  offset: { x: number; y: number };
  /** Deterministic seed for the field. */
  seed: number;
}

const DEFAULTS: StageLook = {
  ink: '#edeeea',
  wash: '#0b0b0c',
  density: 1.1,
  speed: 0.5,
  swirl: 0.7,
  length: 0.05,
  zoom: 1,
  offset: { x: 0, y: 0 },
  seed: 7,
};

/** A tiny deterministic PRNG so a given seed always draws the same field. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mix(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return t < 0.5 ? a : b;
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r} ${g} ${bl})`;
}

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

interface Particle {
  x: number;
  y: number;
  life: number;
}

export interface StageHandle {
  /** Move the stage toward a new look. */
  setLook: (look: StageLook, duration?: number) => void;
  /** Current look, for tests. */
  getLook: () => StageLook;
  /** True when the canvas is actually drawing. */
  readonly live: boolean;
  destroy: () => void;
}

/**
 * Mount the stage. `canvas` may be null — in which case the stage is inert
 * and the CSS fallback field is used.
 */
export function initStage(canvas: HTMLCanvasElement | null): StageHandle {
  const current: StageLook = { ...DEFAULTS };
  let particles: Particle[] = [];
  let ctx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;
  let loop: LoopHandle | null = null;
  let tween: gsap.core.Tween | null = null;
  let live = false;

  const random = mulberry32(current.seed);
  let angle = random() * Math.PI * 2;

  const ensureSize = (): boolean => {
    if (!canvas) return false;
    const fitted = fitCanvas(canvas, env.budget === 'low' ? 1 : 2);
    if (!fitted) return false;
    if (fitted.width !== width || fitted.height !== height) {
      width = fitted.width;
      height = fitted.height;
      rebuild();
    }
    ctx = fitted.ctx;
    return true;
  };

  const rebuild = (): void => {
    if (!width || !height) return;
    const area = width * height;
    const count = Math.round((area / 100_000) * current.density * 26);
    const rand = mulberry32(current.seed);
    particles = Array.from({ length: Math.max(24, count) }, () => ({
      x: rand() * width,
      y: rand() * height,
      life: rand() * 120,
    }));
  };

  const draw = (dt: number): void => {
    if (!ctx || !width || !height) return;
    const g = ctx;

    g.save();
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = current.wash;
    g.fillRect(0, 0, width, height);

    // Camera: the field is scaled and offset about the centre.
    g.translate(width / 2 + current.offset.x * width, height / 2 + current.offset.y * height);
    g.scale(current.zoom, current.zoom);
    g.translate(-width / 2, -height / 2);

    g.globalCompositeOperation = 'lighter';
    g.strokeStyle = current.ink;
    g.lineWidth = 1;
    g.lineCap = 'round';

    const short = Math.min(width, height);
    const step = Math.max(0.6, short * 0.0035) * (1 + current.speed);
    const len = short * current.length;
    const swirl = current.swirl;

    for (const p of particles) {
      // The field is a slow rotation plus a positional wave.
      const field =
        angle +
        Math.sin(p.y * 0.0022 + current.seed) * swirl +
        Math.cos(p.x * 0.0017 - current.seed * 0.5) * swirl * 0.6;

      const nx = p.x + Math.cos(field) * step;
      const ny = p.y + Math.sin(field) * step;

      g.globalAlpha = 0.16;
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.lineTo(nx + Math.cos(field) * len, ny + Math.sin(field) * len);
      g.stroke();

      p.x = nx;
      p.y = ny;
      p.life -= 1;

      if (p.life <= 0 || p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > height + 40) {
        const rand = mulberry32((current.seed * 31 + Math.round(p.x + p.y)) >>> 0);
        p.x = rand() * width;
        p.y = rand() * height;
        p.life = 80 + rand() * 140;
      }
    }

    g.restore();
    angle += dt * 0.05 * (0.4 + current.speed);
  };

  const start = (): void => {
    if (loop || !canvas) return;
    if (!ensureSize()) return;
    live = true;
    if (env.reducedMotion) {
      // One composed frame, then stillness.
      draw(0.016);
      return;
    }
    loop = createLoop({
      fps: env.budget === 'low' ? 30 : 60,
      draw: (dt) => draw(dt),
    });
  };

  const stop = (): void => {
    loop?.destroy();
    loop = null;
  };

  /*
   * The stage is decorative, and a decorative canvas has no business
   * burning a frame budget in a tab nobody is looking at. The loop is
   * stopped when the document is hidden and started again when it returns.
   */
  const onVisibility = (): void => {
    if (document.hidden) {
      stop();
    } else if (live) {
      start();
    }
  };

  const onResize = (): void => {
    if (ensureSize()) draw(0.016);
  };

  if (canvas) {
    if (ensureSize()) {
      live = true;
      start();
      window.addEventListener('resize', onResize, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
    } else {
      // The canvas could not be sized or has no 2D context: the element keeps
      // its CSS fallback field and the stage is inert.
      canvas.setAttribute('data-stage-fallback', 'true');
    }
  }

  return {
    setLook(look: StageLook, duration = 1.2): void {
      const next: StageLook = { ...look, offset: { ...look.offset } };
      tween?.kill();
      const seedChanged = next.seed !== current.seed;
      if (env.reducedMotion || duration <= 0) {
        Object.assign(current, next, { offset: { ...next.offset } });
        if (seedChanged) {
          const rand = mulberry32(current.seed);
          angle = rand() * Math.PI * 2;
          rebuild();
        }
        draw(0.016);
        return;
      }
      const proxy = {
        inkT: 0,
        washT: 0,
        density: current.density,
        speed: current.speed,
        swirl: current.swirl,
        length: current.length,
        zoom: current.zoom,
        ox: current.offset.x,
        oy: current.offset.y,
      };
      tween = gsap.to(proxy, {
        inkT: 1,
        washT: 1,
        density: next.density,
        speed: next.speed,
        swirl: next.swirl,
        length: next.length,
        zoom: next.zoom,
        ox: next.offset.x,
        oy: next.offset.y,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          current.ink = mix(current.ink, next.ink, 0.08);
          current.wash = mix(current.wash, next.wash, 0.08);
          current.density = proxy.density;
          current.speed = proxy.speed;
          current.swirl = proxy.swirl;
          current.length = proxy.length;
          current.zoom = proxy.zoom;
          current.offset.x = proxy.ox;
          current.offset.y = proxy.oy;
        },
        onComplete: () => {
          current.ink = next.ink;
          current.wash = next.wash;
          current.offset = { ...next.offset };
          if (seedChanged) {
            const rand = mulberry32(current.seed);
            angle = rand() * Math.PI * 2;
            rebuild();
          }
        },
      });
    },
    getLook: () => ({ ...current, offset: { ...current.offset } }),
    get live() {
      return live;
    },
    destroy() {
      tween?.kill();
      tween = null;
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      particles = [];
    },
  };
}
