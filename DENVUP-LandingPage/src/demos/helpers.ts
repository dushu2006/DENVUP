/** Shared building blocks for the technique library demos. */

import { el } from '../core/dom';

export function stage(root: HTMLElement, className = ''): HTMLDivElement {
  const node = el('div', `demo__stage ${className}`.trim());
  root.appendChild(node);
  return node;
}

export function canvasStage(
  root: HTMLElement,
  className = '',
): HTMLCanvasElement {
  const wrap = stage(root, className);
  const canvas = el('canvas', 'demo__canvas');
  wrap.appendChild(canvas);
  return canvas;
}

export function controls(root: HTMLElement, className = ''): HTMLDivElement {
  const node = el('div', `demo__controls ${className}`.trim());
  root.appendChild(node);
  return node;
}

export function button(
  label: string,
  onClick: () => void,
  options: { pressed?: boolean; title?: string } = {},
): HTMLButtonElement {
  const node = el('button', 'demo__btn');
  node.type = 'button';
  node.textContent = label;
  if (options.pressed !== undefined) node.setAttribute('aria-pressed', String(options.pressed));
  if (options.title) node.title = options.title;
  node.addEventListener('click', onClick);
  return node;
}

export function slider(
  label: string,
  min: number,
  max: number,
  value: number,
  onInput: (value: number) => void,
): { wrap: HTMLElement; input: HTMLInputElement } {
  const wrap = el('label', 'demo__slider');
  const caption = el('span', 'demo__slider-label');
  caption.textContent = label;
  const input = el('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);
  input.step = String((max - min) / 100);
  input.addEventListener('input', () => onInput(Number(input.value)));
  wrap.append(caption, input);
  return { wrap, input };
}

export function hint(root: HTMLElement, text: string): HTMLParagraphElement {
  const node = el('p', 'demo__hint');
  node.textContent = text;
  root.appendChild(node);
  return node;
}

/** Deterministic pseudo random generator (mulberry32). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a small, abstract artwork as an inline SVG data URI. */
export function artwork(
  variant: 'a' | 'b',
  size = 640,
  hue = 22,
): string {
  const id = `${variant}${hue}`;
  const colors =
    variant === 'a'
      ? [`hsl(${hue} 92% 58%)`, `hsl(${hue + 14} 96% 68%)`, `hsl(${hue - 10} 70% 22%)`]
      : [`hsl(${(hue + 190) % 360} 88% 62%)`, `hsl(${(hue + 210) % 360} 92% 44%)`, `hsl(${(hue + 170) % 360} 60% 14%)`];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="1" stop-color="${colors[1]}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="${colors[2]}"/>
  <circle cx="${variant === 'a' ? 38 : 62}" cy="${variant === 'a' ? 60 : 38}" r="30" fill="url(#g${id})"/>
  <path d="M10 88 L44 34 L64 62 L92 12 L92 88 Z" fill="${colors[0]}" opacity="0.55"/>
  <circle cx="${variant === 'a' ? 70 : 30}" cy="${variant === 'a' ? 28 : 72}" r="9" fill="${colors[1]}"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Shared palette for canvas demos so the whole library looks like one product. */
export const palette = {
  ember: '#f0490f',
  amber: '#ffb627',
  signal: '#2b39e6',
  paper: '#edeeea',
  ink: '#0b0b0c',
  ash: '#8d8f88',
};
