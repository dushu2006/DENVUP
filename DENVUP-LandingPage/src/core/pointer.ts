/**
 * Pointer micro-physics.
 *
 *  - Magnetic controls that lean toward the pointer.
 *  - Proximity activation: nearby elements wake up as the pointer approaches.
 *  - Character repulsion / attraction for typographic demos.
 *
 * All of it is opt-in per element and degrades to nothing on touch.
 */

import { $$, mapRange, rafThrottle } from './dom';
import { env } from './env';
import { gsap } from './motion';

/** Magnetic buttons + links: `[data-magnetic]`. */
export function initMagnetic(): void {
  if (env.coarsePointer) return;

  const items = $$<HTMLElement>('[data-magnetic]');
  items.forEach((item) => {
    const strength = Number(item.dataset.magneticStrength ?? 0.32);
    const quickX = gsap.quickTo(item, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickY = gsap.quickTo(item, 'y', { duration: 0.5, ease: 'power3.out' });

    const move = (event: PointerEvent) => {
      const rect = item.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    };

    const leave = () => {
      quickX(0);
      quickY(0);
    };

    item.addEventListener('pointermove', move);
    item.addEventListener('pointerleave', leave);
  });
}

/**
 * Proximity activation: elements with `[data-proximity]` scale / brighten as
 * the pointer comes close, regardless of whether it is over them.
 */
export function initProximity(): void {
  if (env.coarsePointer) return;

  const items = $$<HTMLElement>('[data-proximity]');
  if (!items.length) return;

  const update = rafThrottle((x: number, y: number) => {
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(x - cx, y - cy);
      const radius = Number(item.dataset.proximity ?? 180);
      const influence = Math.max(0, 1 - distance / radius);
      item.style.setProperty('--proximity', influence.toFixed(3));
    });
  });

  window.addEventListener('pointermove', (e) => update(e.clientX, e.clientY), { passive: true });
}

/**
 * Split an element into words / lines / characters while keeping the original
 * text available to assistive tech (the visual split is aria-hidden, a
 * visually hidden copy of the source text is left in place).
 */
export function splitText(
  node: HTMLElement,
  mode: 'words' | 'chars' = 'words',
): HTMLElement[] {
  if (node.dataset.split === 'done') {
    return Array.from(node.querySelectorAll<HTMLElement>('[data-split-unit]'));
  }

  const source = node.textContent ?? '';
  const parts = mode === 'words' ? source.split(/(\s+)/) : Array.from(source);

  node.textContent = '';
  const units: HTMLElement[] = [];

  parts.forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      node.appendChild(document.createTextNode(part));
      return;
    }
    const unit = document.createElement('span');
    unit.dataset.splitUnit = mode === 'words' ? 'word' : 'char';
    unit.className = 'split-unit';
    unit.setAttribute('aria-hidden', 'true');
    if (mode === 'words') {
      unit.innerHTML = part
        .split('')
        .map((ch) => `<span class="split-char">${ch}</span>`)
        .join('');
    } else {
      unit.textContent = part;
    }
    node.appendChild(unit);
    units.push(unit);
  });

  // Accessible name.
  //
  // A heading can carry the original sentence as its accessible name, which
  // keeps the document free of a second, hidden copy of the same words. For
  // anything that is not a heading, `aria-label` would not be exposed, so a
  // visually hidden copy is used instead.
  if (node.matches('h1, h2, h3, h4, h5, h6, [role="heading"]')) {
    node.setAttribute('aria-label', source);
  } else {
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = source;
    node.appendChild(sr);
  }
  node.dataset.split = 'done';

  return units;
}

/** Text scramble / decode effect. */
export function scramble(
  node: HTMLElement,
  finalText: string,
  options: { duration?: number; chars?: string } = {},
): gsap.core.Tween {
  const { duration = 1.1, chars = '▚▞█▓▒░/\\<>{}[]#*+=' } = options;
  const state = { progress: 0 };
  const length = finalText.length;

  return gsap.to(state, {
    progress: 1,
    duration: env.reducedMotion ? 0 : duration,
    ease: 'none',
    onUpdate() {
      const count = Math.floor(state.progress * length);
      let out = '';
      for (let i = 0; i < length; i += 1) {
        const ch = finalText[i];
        if (i < count) {
          out += ch;
        } else if (ch === ' ') {
          out += ' ';
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      node.textContent = out;
    },
    onComplete() {
      node.textContent = finalText;
    },
  });
}

/** Typewriter effect with a blinking caret. */
export function typewriter(
  node: HTMLElement,
  text: string,
  options: { speed?: number; start?: boolean } = {},
): { destroy: () => void } {
  const { speed = 38, start = true } = options;
  let index = 0;
  let timer = 0;

  const tick = () => {
    node.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) timer = window.setTimeout(tick, speed);
  };

  if (start && !env.reducedMotion) timer = window.setTimeout(tick, speed);
  else node.textContent = text;

  return {
    destroy() {
      window.clearTimeout(timer);
    },
  };
}

/** Map a pointer's position inside an element to 0 → 1 on both axes. */
export function relativePosition(
  element: HTMLElement,
  event: PointerEvent,
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: mapRange(event.clientX, rect.left, rect.right, 0, 1),
    y: mapRange(event.clientY, rect.top, rect.bottom, 0, 1),
  };
}
