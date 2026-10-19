/**
 * The persistent stage.
 *
 * One canvas, fixed behind the document, alive for the whole session — it
 * survives soft navigation because it is never inside <main>. It reads the
 * chapter under the viewport centre and moves its colour field, grid and marks
 * toward that chapter's palette. Scroll drives it, so it reverses when the
 * visitor scrolls back.
 *
 * Limits are deliberate: pixel ratio capped at 2, paused when hidden, drawn at
 * ~40 fps, no WebGL requirement (Canvas 2D), and under reduced motion it draws
 * one static frame per chapter instead of animating.
 */

type Palette = {
  bg: string;
  ink: string;
  accent: string;
  grid: number;
  shape: 'arc' | 'grid' | 'field' | 'bars';
};

const PAPER: Palette = { bg: '#ffffff', ink: '#0b0a09', accent: '#ff4a00', grid: 0.05, shape: 'grid' };
const BONE: Palette = { bg: '#ece4d7', ink: '#221a12', accent: '#c73e12', grid: 0.06, shape: 'bars' };
const ORANGE: Palette = { bg: '#ff4a00', ink: '#180700', accent: '#fff1e8', grid: 0.07, shape: 'field' };
const INK: Palette = { bg: '#0b0a09', ink: '#f1ede7', accent: '#ff4a00', grid: 0.08, shape: 'arc' };
const DEN: Palette = { bg: '#17120f', ink: '#f1ede7', accent: '#ff5a12', grid: 0.09, shape: 'field' };

const BY_KEY: Record<string, Palette> = {
  paper: PAPER, prelude: PAPER, services: PAPER, studio: PAPER, legal: PAPER, faq: PAPER, team: PAPER,
  bone: BONE, 'services-deep': BONE, process: BONE, showcase: BONE, concepts: BONE, service: BONE,
  orange: ORANGE, hero: ORANGE, contact: ORANGE, demo: ORANGE,
  ink: INK, manifesto: INK, capabilities: INK, pricing: INK, closing: INK, footer: INK, lab: INK, notfound: INK,
  den: DEN, demos: DEN, technologies: DEN, 'service-den': DEN,
};

/** A section declares its scene with data-scene; legacy sections use data-chapter. */
const SCENE_OF_CHAPTER: Record<string, string> = {
  prelude: 'paper', hero: 'orange', manifesto: 'ink', services: 'paper', 'services-deep': 'bone',
  capabilities: 'ink', demos: 'den', process: 'bone', technologies: 'den', team: 'paper',
  showcase: 'bone', pricing: 'ink', faq: 'paper', contact: 'orange', closing: 'ink', footer: 'ink',
  lab: 'ink', service: 'bone', concepts: 'bone', studio: 'paper', legal: 'paper', notfound: 'ink',
};

export function sceneFor(value: string | undefined): string {
  if (!value) return 'paper';
  return SCENE_OF_CHAPTER[value] ?? (BY_KEY[value] ? value : 'paper');
}

/** Accepts #rrggbb and the rgb(r g b) the mixer itself produces. */
const rgb = (value: string): [number, number, number] => {
  if (value.startsWith('#')) {
    const v = value.slice(1);
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  }
  const nums = value.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0];
  return [nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 0];
};

const mix = (a: string, b: string, t: number): string => {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r} ${g} ${bl})`;
};

interface Section {
  el: HTMLElement;
  key: string;
  top: number;
  height: number;
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let sections: Section[] = [];
let current: Palette = PAPER;
let target: Palette = PAPER;
let currentKey = 'paper';
let w = 0;
let h = 0;
let dpr = 1;
let raf = 0;
let running = false;
let last = 0;
let pointerX = 0.5;
let pointerY = 0.4;
let hasPointer = false;
let started = false;

function measure(): void {
  sections = [...document.querySelectorAll<HTMLElement>('main [data-scene],main [data-chapter]')]
    .map((el) => ({
      el,
      key: sceneFor(el.dataset.scene || el.dataset.chapter),
      top: el.offsetTop,
      height: el.offsetHeight,
    }))
    .sort((a, b) => a.top - b.top);
}

function sceneAhead(): string {
  const mid = window.scrollY + window.innerHeight * 0.42;
  let key = sections[0]?.key ?? 'paper';
  for (const s of sections) {
    if (s.top <= mid) key = s.key;
    else break;
  }
  return key;
}

function applyPalette(key: string): void {
  const next = BY_KEY[key] ?? PAPER;
  target = next;
  if (key === currentKey) return;
  currentKey = key;
  const root = document.documentElement;
  root.dataset.scene = key;
  root.style.setProperty('--scene-bg', next.bg);
  root.style.setProperty('--scene-ink', next.ink);
  root.style.setProperty('--scene-accent', next.accent);
  try {
    sessionStorage.setItem('denvup:stage', JSON.stringify({ scene: key, chapter: root.dataset.chapter ?? '' }));
  } catch {
    /* storage can be denied; the stage still works */
  }
  if (reduced()) {
    current = next;
    draw(performance.now(), 1);
  }
}

function reduced(): boolean {
  return document.documentElement.dataset.motion === 'reduced';
}

function resize(): void {
  if (!canvas || !ctx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  measure();
}

function draw(time: number, settle = 0): void {
  if (!ctx) return;
  if (settle < 1) {
    const step = reduced() ? 1 : 0.06;
    current = {
      bg: mix(current.bg, target.bg, step),
      ink: mix(current.ink, target.ink, step),
      accent: mix(current.accent, target.accent, step),
      grid: current.grid + (target.grid - current.grid) * step,
      shape: target.shape,
    };
  }

  const scroll = window.scrollY;
  const pan = reduced() ? 0 : scroll * 0.06;

  ctx.fillStyle = current.bg;
  ctx.fillRect(0, 0, w, h);

  /* A slow field of light, offset by the pointer when one exists. */
  const gx = w * (hasPointer && !reduced() ? pointerX : 0.5);
  const gy = h * (hasPointer && !reduced() ? pointerY : 0.34);
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.72);
  const [ar, ag, ab] = rgb(current.accent);
  glow.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0.12)`);
  glow.addColorStop(0.55, `rgba(${ar}, ${ag}, ${ab}, 0.035)`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  /* Grid: the chapter's rhythm. Moves a fraction of the scroll. */
  const gap = 72;
  ctx.strokeStyle = current.ink;
  ctx.globalAlpha = current.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const offset = ((pan % gap) + gap) % gap;
  for (let x = -offset; x < w + gap; x += gap) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, h);
  }
  for (let y = -offset; y < h + gap; y += gap) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(w, Math.round(y) + 0.5);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  const cx = w * 0.5;
  const cy = h * 0.5;
  const base = Math.min(w, h);

  if (current.shape === 'arc') {
    ctx.strokeStyle = current.accent;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(1, base * 0.0016);
    for (let i = 0; i < 3; i++) {
      const r = base * (0.24 + i * 0.1);
      const a = reduced() ? 0 : time * 0.00006 + i * 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy + (reduced() ? 0 : Math.sin(time * 0.0002 + i) * 12), r, a, a + Math.PI * 1.35);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (current.shape === 'bars') {
    const count = 7;
    const bw = Math.max(10, w / (count * 2.4));
    ctx.fillStyle = current.accent;
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < count; i++) {
      const bh = base * (0.08 + (i % 4) * 0.06) * (reduced() ? 1 : 0.7 + Math.sin(time * 0.0004 + i) * 0.3);
      ctx.fillRect(w * 0.08 + i * bw * 1.6, h * 0.78 - bh, bw, bh);
    }
    ctx.globalAlpha = 1;
  }

  if (current.shape === 'field') {
    ctx.fillStyle = current.accent;
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 34; i++) {
      const seed = i * 137.5;
      const x = (Math.sin(seed) * 0.5 + 0.5) * w + (reduced() ? 0 : Math.sin(time * 0.00007 + i) * 24);
      const y = (Math.cos(seed * 1.3) * 0.5 + 0.5) * h + (reduced() ? 0 : Math.cos(time * 0.00009 + i) * 18);
      const r = 1 + (i % 4) * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* Two marks that read as "the same object" across chapters. */
  ctx.strokeStyle = current.ink;
  ctx.globalAlpha = 0.16;
  ctx.lineWidth = 1;
  const markX = w * 0.86;
  const markY = h * 0.18 + (reduced() ? 0 : Math.sin(time * 0.0003) * 10);
  ctx.strokeRect(markX, markY, 46, 46);
  ctx.beginPath();
  ctx.arc(markX + 23, markY + 23, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function loop(time: number): void {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  if (time - last < 24) return;
  last = time;
  if (document.hidden) return;
  draw(time);
}

function onScroll(): void {
  applyPalette(sceneAhead());
  if (reduced()) draw(performance.now(), 1);
}

export function refreshScene(): void {
  measure();
  applyPalette(sceneAhead());
  if (reduced()) draw(performance.now(), 1);
}

export function initScene(): void {
  if (started) return;
  canvas = document.querySelector<HTMLCanvasElement>('[data-scene-canvas]');
  if (!canvas) return;
  ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    document.documentElement.dataset.sceneFailed = 'true';
    return;
  }
  started = true;

  const root = document.documentElement;
  const restored = root.dataset.scene ? sceneFor(root.dataset.scene) : 'paper';
  current = BY_KEY[restored] ?? PAPER;
  currentKey = restored;
  root.dataset.scene = restored;
  root.style.setProperty('--scene-bg', current.bg);
  root.style.setProperty('--scene-ink', current.ink);
  root.style.setProperty('--scene-accent', current.accent);

  resize();
  applyPalette(sceneAhead());
  draw(performance.now(), 1);

  running = true;
  if (!reduced()) raf = requestAnimationFrame(loop);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resize();
    draw(performance.now(), 1);
  });
  window.addEventListener('pointermove', (event) => {
    hasPointer = event.pointerType === 'mouse';
    pointerX = event.clientX / Math.max(1, window.innerWidth);
    pointerY = event.clientY / Math.max(1, window.innerHeight);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      if (!reduced()) raf = requestAnimationFrame(loop);
    }
  });

  document.addEventListener('denvup:motion', () => {
    if (reduced()) {
      running = false;
      cancelAnimationFrame(raf);
      current = target;
      draw(performance.now(), 1);
    } else if (!running) {
      running = true;
      raf = requestAnimationFrame(loop);
    }
  });
}
