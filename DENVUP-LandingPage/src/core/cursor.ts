/**
 * Custom cursor.
 *
 * A dot that tracks the pointer exactly plus a ring that lags behind it.
 * The ring grows over interactive targets and can carry a contextual label
 * ("View", "Drag", "Explore"). On touch devices the native cursor is left
 * completely alone — nothing here is required for navigation.
 */

import { $, $$ } from './dom';
import { env } from './env';
import { gsap } from './motion';

interface CursorTarget {
  element: HTMLElement;
  label?: string;
  grow?: boolean;
}

let root: HTMLElement | null = null;
let dot: HTMLElement | null = null;
let ring: HTMLElement | null = null;
let labelEl: HTMLElement | null = null;
let cleanup: (() => void) | null = null;

const LABEL_ATTR = 'data-cursor';

export function initCursor(): void {
  if (env.coarsePointer) return; // native cursor restored (encyclopedia 50)

  root = $<HTMLElement>('#cursor');
  dot = $<HTMLElement>('.cursor__dot', root ?? document);
  ring = $<HTMLElement>('.cursor__ring', root ?? document);
  labelEl = $<HTMLElement>('.cursor__label', root ?? document);
  if (!root || !dot || !ring || !labelEl) return;

  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...pointer };
  let visible = false;

  const move = (event: PointerEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!visible) {
      visible = true;
      root?.classList.add('is-active');
    }
    gsap.set(dot, { x: pointer.x, y: pointer.y });
  };

  const render = () => {
    ringPos.x += (pointer.x - ringPos.x) * 0.16;
    ringPos.y += (pointer.y - ringPos.y) * 0.16;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  };
  gsap.ticker.add(render);

  const findTarget = (event: PointerEvent): CursorTarget | null => {
    const node = event.target as HTMLElement | null;
    if (!node) return null;
    const labelled = node.closest<HTMLElement>(`[${LABEL_ATTR}]`);
    if (labelled) {
      return {
        element: labelled,
        label: labelled.getAttribute(LABEL_ATTR) ?? undefined,
        grow: true,
      };
    }
    const interactive = node.closest<HTMLElement>(
      'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])',
    );
    return interactive ? { element: interactive, grow: true } : null;
  };

  const over = (event: PointerEvent) => {
    const target = findTarget(event);
    if (!target) {
      root?.classList.remove('is-link', 'is-label');
      labelEl && (labelEl.textContent = '');
      return;
    }
    root?.classList.add('is-link');
    if (target.label) {
      root?.classList.add('is-label');
      labelEl && (labelEl.textContent = target.label);
    } else {
      root?.classList.remove('is-label');
      labelEl && (labelEl.textContent = '');
    }
  };

  const leave = () => {
    visible = false;
    root?.classList.remove('is-active', 'is-link', 'is-label');
  };

  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerover', over, { passive: true });
  document.addEventListener('mouseleave', leave);

  cleanup = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerover', over);
    document.removeEventListener('mouseleave', leave);
    gsap.ticker.remove(render);
  };
}

/** Let a component claim the cursor for a while (drag modes, galleries). */
export function setCursorMode(mode: 'default' | 'link' | 'label', text = ''): void {
  if (!root) return;
  root.classList.toggle('is-link', mode === 'link');
  root.classList.toggle('is-label', mode === 'label');
  if (labelEl) labelEl.textContent = text;
}

export function destroyCursor(): void {
  cleanup?.();
  cleanup = null;
}

/** Attach contextual labels to a set of elements in one call. */
export function labelCursor(selector: string, label: string): void {
  $$(selector).forEach((node) => node.setAttribute(LABEL_ATTR, label));
}
