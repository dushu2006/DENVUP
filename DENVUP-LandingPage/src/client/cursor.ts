/**
 * Pointer-only cursor: a dot, a ring with a trailing echo, and a label.
 *
 * Rules that matter here:
 *  - only on fine pointers; a touch device keeps its native behaviour;
 *  - the native pointer is restored the moment anything fails, so a visitor is
 *    never left without a cursor;
 *  - no blend mode: the ring carries a two-tone rim so it stays visible on
 *    white, on orange and on the dark chapters;
 *  - pointer-events: none, so it can never swallow a click;
 *  - under reduced motion the echo is removed and the ring stops scaling.
 */

let ring: HTMLElement | null = null;
let dot: HTMLElement | null = null;
let label: HTMLElement | null = null;
let started = false;
let x = 0;
let y = 0;
let rx = 0;
let ry = 0;
let raf = 0;
let visible = false;

const LABELLED = 'a, button, [role="button"], [data-cursor-label], input, textarea, select, summary, [data-lab-host]';

function enabled(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function reduced(): boolean {
  return document.documentElement.dataset.motion === 'reduced';
}

function frame(): void {
  raf = requestAnimationFrame(frame);
  const ease = reduced() ? 1 : 0.18;
  rx += (x - rx) * ease;
  ry += (y - ry) * ease;
  if (ring) ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
  if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  if (label) label.style.transform = `translate3d(${(rx + 26).toFixed(1)}px, ${(ry + 18).toFixed(1)}px, 0)`;
}

function labelFor(target: HTMLElement): string {
  const explicit = target.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel;
  if (explicit) return explicit;
  if (target.closest('a, button, [role="button"], summary')) {
    if (target.closest('[data-lab-host]')) return 'play';
    return '';
  }
  return '';
}

function onOver(event: PointerEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const interactive = target.closest<HTMLElement>(LABELLED);
  document.documentElement.classList.toggle('cursor-is-hot', Boolean(interactive));
  const text = labelFor(target);
  if (label) {
    label.textContent = text;
    label.classList.toggle('is-on', Boolean(text));
  }
}

export function initCursor(): void {
  if (started) return;
  if (!enabled()) {
    document.documentElement.dataset.cursor = 'native';
    return;
  }
  ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
  dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!ring || !dot) {
    document.documentElement.dataset.cursor = 'native';
    return;
  }

  try {
    started = true;
    document.documentElement.dataset.cursor = 'custom';
    document.documentElement.classList.add('has-cursor');

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        document.documentElement.classList.add('cursor-is-on');
      }
    }, { passive: true });

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', () => document.documentElement.classList.add('cursor-is-down'));
    document.addEventListener('pointerup', () => document.documentElement.classList.remove('cursor-is-down'));
    document.addEventListener('pointerleave', () => {
      visible = false;
      document.documentElement.classList.remove('cursor-is-on');
    });

    raf = requestAnimationFrame(frame);
  } catch {
    /* If anything above fails, put the native cursor back. */
    document.documentElement.classList.remove('has-cursor');
    document.documentElement.dataset.cursor = 'native';
    cancelAnimationFrame(raf);
  }
}
