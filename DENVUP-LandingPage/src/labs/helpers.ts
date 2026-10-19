import type { LabContext } from './types';

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const rand = (min: number, max: number): number => min + Math.random() * (max - min);

/** Deterministic pseudo-random generator, so replayed demos look intentional. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface CanvasKit {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
}

/** Create a DPR-aware canvas that fills the stage and tracks its size. */
export function makeCanvas(ctx: LabContext, className = 'd-canvas'): CanvasKit {
  const canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.setAttribute('aria-hidden', 'true');
  ctx.stage.append(canvas);
  const c2d = canvas.getContext('2d');
  if (!c2d) throw new Error('Canvas 2D is unavailable');
  const kit: CanvasKit = { canvas, ctx: c2d, width: 0, height: 0, dpr: 1 };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    kit.dpr = Math.min(window.devicePixelRatio || 1, 2);
    kit.width = Math.max(1, Math.floor(rect.width));
    kit.height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(kit.width * kit.dpr);
    canvas.height = Math.floor(kit.height * kit.dpr);
    c2d.setTransform(kit.dpr, 0, 0, kit.dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  ctx.onCleanup(() => ro.disconnect());
  return kit;
}

export interface Point {
  x: number;
  y: number;
}

/** Pointer tracking normalised to the stage, with keyboard/touch fallback. */
export function trackPointer(ctx: LabContext, target: HTMLElement = ctx.stage) {
  const state = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, vx: 0, vy: 0, active: false, down: false };
  const rect = () => target.getBoundingClientRect();
  const set = (clientX: number, clientY: number) => {
    const r = rect();
    state.px = state.x;
    state.py = state.y;
    state.x = clamp((clientX - r.left) / Math.max(1, r.width));
    state.y = clamp((clientY - r.top) / Math.max(1, r.height));
    state.vx = state.x - state.px;
    state.vy = state.y - state.py;
    state.active = true;
  };
  const move = (e: PointerEvent) => set(e.clientX, e.clientY);
  const enter = (e: PointerEvent) => {
    state.active = true;
    set(e.clientX, e.clientY);
  };
  const leave = () => {
    state.active = false;
  };
  const down = (e: PointerEvent) => {
    state.down = true;
    set(e.clientX, e.clientY);
  };
  const up = () => {
    state.down = false;
  };
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerenter', enter);
  target.addEventListener('pointerleave', leave);
  target.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', up);
  ctx.onCleanup(() => {
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerenter', enter);
    target.removeEventListener('pointerleave', leave);
    target.removeEventListener('pointerdown', down);
    window.removeEventListener('pointerup', up);
  });
  return state;
}

export function splitLetters(el: HTMLElement, label = true): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  if (label) el.setAttribute('aria-label', text);
  const spans: HTMLElement[] = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.className = 'ltr';
    span.textContent = char === ' ' ? '\u00a0' : char;
    if (label) span.setAttribute('aria-hidden', 'true');
    el.append(span);
    spans.push(span);
  }
  return spans;
}

export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  el.setAttribute('aria-label', text);
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'wrd';
    wrap.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'wrd__in';
    inner.textContent = word;
    wrap.append(inner);
    el.append(wrap);
    if (i < words.length - 1) el.append(document.createTextNode(' '));
    return inner;
  });
}

/** A small magnetic pull for buttons: transform only, never layout. */
export function magnetic(el: HTMLElement, ctx: LabContext, strength = 0.28): void {
  const move = (e: PointerEvent) => {
    if (ctx.reduced) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };
  const reset = () => {
    el.style.transform = '';
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', reset);
  el.addEventListener('blur', reset);
  ctx.onCleanup(() => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', reset);
    el.removeEventListener('blur', reset);
  });
}

/** A one-shot typing routine used by several text demos. */
export function typeText(el: HTMLElement, text: string, perChar = 34): () => void {
  el.textContent = '';
  let i = 0;
  let timer = 0;
  const tick = () => {
    el.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) timer = window.setTimeout(tick, perChar);
  };
  tick();
  return () => window.clearTimeout(timer);
}

/** Copy text and return whether the clipboard API accepted it. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}
