/**
 * Feedback motion, in one place.
 *
 * Rules this module exists to keep:
 *  - every helper answers something the person just did; nothing runs on its own;
 *  - `prefers-reduced-motion` resolves to the finished state, never to a
 *    missing state — the content is identical either way;
 *  - only transform, opacity and clip-path are animated; the two `background`
 *    uses are a 2 px rule and a 620 ms field wash, both small and one-shot;
 *  - no library, no spring, no bounce. A person should notice the answer, not
 *    the animation.
 */

import { prefersReduced } from './env';

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const motionOn = (): boolean => !prefersReduced();

function animate(
  el: Element,
  frames: Keyframe[],
  options: KeyframeAnimationOptions = {},
): Animation | null {
  if (!motionOn() || typeof el.animate !== 'function') return null;
  try {
    return el.animate(frames, {
      duration: 200,
      easing: EASE_OUT,
      fill: 'both',
      ...options,
    });
  } catch {
    return null;
  }
}

/** Something has appeared. It rises 6 px and settles; nothing else moves. */
export function revealRise(el: HTMLElement, distance = 6, delay = 0, duration = 260): void {
  animate(
    el,
    [
      { opacity: 0, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'none' },
    ],
    { duration, delay },
  );
}

/** Re-enter after a remount: 0.985 → 1, so the eye finds the new content. */
export function reenter(el: HTMLElement, duration = 180): void {
  animate(el, [{ opacity: 0.86, scale: '0.992' }, { opacity: 1, scale: '1' }], { duration });
}

/** The stage frame acknowledges a replay without covering the demo. */
export function flashFrame(el: HTMLElement): void {
  animate(
    el,
    [
      { boxShadow: 'inset 0 0 0 1px var(--accent)' },
      { boxShadow: 'inset 0 0 0 1px transparent' },
    ],
    { duration: 180, easing: EASE_QUINT },
  );
}

/** A control turns half a turn to show it restarted. */
export function quarterTurn(el: Element): void {
  animate(el, [{ rotate: '0deg' }, { rotate: '180deg' }], { duration: 240, easing: EASE_QUINT });
}

/**
 * A value changed. The new value is written immediately — the screen must never
 * show a price that is not the one being quoted — and then it settles in from
 * just below its own line. Deferring the write (out, then in) looks smoother in
 * isolation but leaves stale text on screen for a frame or two, which is a lie
 * in a price and makes rapid changes queue up instead of tracking the input.
 */
export function rollValue(el: HTMLElement, next: string): void {
  if (el.textContent === next) return;
  el.textContent = next;
  if (!motionOn()) return;
  // jsdom has no Element.getAnimations; tests are not a target platform, but a
  // throw here would abort the caller mid-paint and leave a half-updated quote.
  for (const running of el.getAnimations?.() ?? []) running.cancel();
  animate(el, [{ opacity: 0.5, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], {
    duration: 150,
    easing: EASE_OUT,
  });
}

/**
 * Move one shared rule from wherever it is to a target, by measurement rather
 * than by guessing at index arithmetic. The element stays 1 px wide and is
 * stretched with `scaleX`, so the travel is a single composited transform.
 */
export function travel(
  indicator: HTMLElement,
  container: HTMLElement,
  target: HTMLElement,
  animateTravel = true,
): void {
  const box = target.getBoundingClientRect();
  if (!box.width) {
    indicator.style.opacity = '0';
    return;
  }
  const base = container.getBoundingClientRect();
  indicator.style.opacity = '1';
  indicator.style.height = `${box.height}px`;
  const dx = box.left - base.left - container.clientLeft;
  const dy = box.top - base.top - container.clientTop;
  const snap = !animateTravel || !motionOn();
  if (snap) indicator.style.transition = 'none';
  indicator.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scaleX(${box.width.toFixed(1)})`;
  if (snap) {
    void indicator.offsetWidth; // commit the un-transitioned position
    indicator.style.transition = '';
  }
}

/** A short, single shake along one axis. Two pixels: a "no", not a tantrum. */
export function nudge(el: HTMLElement): void {
  animate(
    el,
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 180, easing: EASE_QUINT },
  );
}

/** One pulse of the ring, used to point at the first field that needs work. */
export function ringPulse(el: HTMLElement): void {
  animate(
    el,
    [
      { boxShadow: '0 0 0 0 rgba(161, 38, 29, 0.5)' },
      { boxShadow: '0 0 0 4px rgba(161, 38, 29, 0)' },
    ],
    { duration: 420, easing: EASE_OUT },
  );
}

/**
 * Reveal a panel by its own height.
 *
 * `grid-template-rows: 0fr → 1fr` is the fashionable answer and would avoid
 * layout, but fr-track interpolation is uneven across engines and was not
 * observable here (this headless build throttles the animation clock, so every
 * transition reads as frozen then applied). Height is a layout property, and
 * this is the one place it is allowed: one small, user-triggered element for
 * 180–260 ms, never on scroll, always with a determinable end state.
 */
export function animateHeight(
  el: HTMLElement,
  to: number,
  duration: number,
  onDone?: () => void,
): void {
  const from = el.getBoundingClientRect().height;
  const finish = (): void => {
    el.style.height = to === 0 ? '0px' : 'auto';
    el.style.overflow = '';
    onDone?.();
  };
  el.style.overflow = 'hidden';
  if (!motionOn() || typeof el.animate !== 'function') {
    finish();
    return;
  }
  let done = false;
  const once = (): void => {
    if (done) return;
    done = true;
    anim.cancel();
    finish();
  };
  const anim = el.animate(
    [{ height: `${from}px` }, { height: `${to}px` }],
    { duration, easing: EASE_OUT, fill: 'both' },
  );
  anim.onfinish = once;
  window.setTimeout(once, duration + 140); // a cancelled animation must not wedge
}

/** The row the person just changed answers once, then gets out of the way. */
export function markTouched(el: HTMLElement): void {
  const row = el.closest('fieldset') ?? el;
  animate(
    row,
    [
      { boxShadow: 'inset 0 0 0 1px rgba(255, 74, 0, 0.85)' },
      { boxShadow: 'inset 0 0 0 1px rgba(255, 74, 0, 0)' },
    ],
    { duration: 320, easing: EASE_OUT },
  );
}

/** Stagger index → delay, capped so a long list never feels slow to settle. */
export const stagger = (index: number, step = 20, cap = 12): number =>
  Math.min(index, cap) * step;
