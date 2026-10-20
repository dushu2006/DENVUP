/**
 * DENVUP — the feedback layer.
 *
 * The site is an instrument panel, so when you touch it, it registers.
 * This module is the grammar of that registration. There are six
 * acknowledgements and every control uses the same six, so a visitor
 * learns the grammar once:
 *
 *   press     the finger went down        (140ms)
 *   register  a choice was made and traced (260ms)
 *   confirm   an action succeeded          (320ms)
 *   reject    an action was refused        (240ms)
 *   advance   a step or panel changed      (300ms out / 420ms in)
 *   reveal    something grew from its trigger
 *
 * Two rules hold the layer together:
 *
 *  1. **Residue, not flash.** A confirmation leaves a reading behind —
 *     a drawn tick, a traced rule, a settled number. It does not blink
 *     and vanish. If the visitor looks away and looks back, they can
 *     still see that the thing happened.
 *
 *  2. **Nothing is animated that cannot be a state.** Every motion
 *     here resolves to a class, a style or a piece of text, so the
 *     reduced-motion path is the same code path with the motion
 *     switched off — not a second implementation.
 *
 * Everything is gated on `env.reducedMotion`. Under
 * `prefers-reduced-motion: reduce` the states still change; they simply
 * arrive without travelling.
 */

import { gsap } from './motion';
import { env } from './env';

/* ---------------------------------------------------------------------- */
/* The tick — the one mark this system draws                               */
/* ---------------------------------------------------------------------- */

const TICK = `<svg viewBox="0 0 16 16" data-feedback-tick aria-hidden="true" focusable="false">
  <path d="M2.5 8.6 L6.2 12.2 L13.5 4.4" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

/**
 * Give an element the ability to show a tick.
 *
 * The tick is a child element rather than a background image so it can
 * be *drawn* — the stroke is revealed by animating `stroke-dashoffset`
 * from its length to zero, which is the only honest way to draw a tick
 * that was not already there.
 */
function ensureTick(host: HTMLElement): SVGElement | null {
  let tick = host.querySelector<SVGElement>('[data-feedback-tick]');
  if (tick) return tick;
  host.insertAdjacentHTML('beforeend', TICK);
  tick = host.querySelector<SVGElement>('[data-feedback-tick]');
  if (!tick) return null;
  const path = tick.querySelector('path');
  if (path) {
    /*
     * `getTotalLength()` can return 0 for a path that has not been laid
     * out yet, and a dash offset of 0 would make the "draw" invisible.
     * The path's own length is the truth, so fall back to it.
     */
    const measured = path.getTotalLength?.() ?? 0;
    const length = measured > 0 ? measured : 16;
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    tick.dataset.tickLength = String(length);
  }
  return tick;
}

/* ---------------------------------------------------------------------- */
/* press — the finger went down                                            */
/* ---------------------------------------------------------------------- */

/**
 * Acknowledge a press on any control.
 *
 * The class is added on `pointerdown` and removed on release, so the
 * press reads as a physical depression rather than a colour change.
 * Keyboard activation never fires `pointerdown`, so a keyboard user
 * gets the same acknowledgement through `:focus-visible` and the
 * `.is-activated` class that `activate()` sets.
 */
export function initPressFeedback(root: ParentNode = document): () => void {
  const controls = Array.from(
    root.querySelectorAll<HTMLElement>(
      'button, a[href], [role="button"], input[type="radio"], input[type="checkbox"], label',
    ),
  ).filter((node) => !node.hasAttribute('data-no-press'));

  const onDown = (event: Event) => {
    const target = event.target as HTMLElement | null;
    const control = target?.closest<HTMLElement>('.btn, .chip, .faq__q, .enquiry__choice, .demo__toggle, .fx-card__replay, .fx-card__copy, .fx-card__want, .library__export, .menu-toggle, .dock__toggle, .cmd-trigger, .to-top, button, a[href]');
    if (!control) return;
    control.classList.add('is-pressed');
  };

  const onUp = () => {
    controls.forEach((control) => control.classList.remove('is-pressed'));
  };

  document.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('pointerup', onUp, { passive: true });
  document.addEventListener('pointercancel', onUp, { passive: true });

  return () => {
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    controls.forEach((control) => control.classList.remove('is-pressed'));
  };
}

/* ---------------------------------------------------------------------- */
/* register — a choice was made and traced                                 */
/* ---------------------------------------------------------------------- */

/**
 * Trace a choice.
 *
 * A hairline draws around the thing that was chosen, from its leading
 * edge. The trace is the site's own language: it is a rule being drawn
 * in ink, the same gesture the chapters use when a rule extends.
 */
export function register(el: HTMLElement): void {
  el.classList.remove('is-registered');
  /* force a reflow so the trace restarts if the same thing is re-picked */
  void el.offsetWidth;
  el.classList.add('is-registered');
}

/**
 * Draw the tick into a host and leave it there.
 *
 * The stroke is revealed by animating its dash offset from the path's own
 * length down to zero, so the mark is genuinely *drawn* rather than
 * swapped in. Under reduced motion the offset is set to zero instead: the
 * mark is present without travelling.
 *
 * No overshoot. The motion reference names "bounce or elastic easing on
 * interface elements" as one of the things that gives generated motion
 * away, so the tick eases in and stops.
 */
function drawTick(host: HTMLElement): SVGElement | null {
  const tick = ensureTick(host);
  if (!tick) return null;

  const path = tick.querySelector('path') as SVGPathElement | null;
  const length = Number(tick.dataset.tickLength ?? 16);

  if (path) {
    if (env.reducedMotion) {
      path.style.strokeDashoffset = '0';
    } else {
      gsap.fromTo(
        path,
        { strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.32, ease: 'power3.out' },
      );
    }
  }

  if (env.reducedMotion) {
    tick.style.opacity = '1';
    tick.style.transform = 'none';
  } else {
    gsap.fromTo(
      tick,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.32, ease: 'power3.out' },
    );
  }

  return tick;
}

/* ---------------------------------------------------------------------- */
/* confirm — an action succeeded and left a reading                        */
/* ---------------------------------------------------------------------- */

/*
 * Each confirmation owns its own timer. A single shared timer meant that
 * confirming on one card cancelled the label restoration of the card
 * before it, so the first card was left saying "Copied" forever.
 */
const confirmTimers = new WeakMap<HTMLElement, number>();

/**
 * Confirm an action.
 *
 * The tick is drawn, the label is replaced, and the residue stays until
 * the next confirmation on the same element. The label is restored
 * afterwards, but the *mark* is not — the visitor can still see that
 * the copy worked.
 */
export function confirm(el: HTMLElement, label = 'Done', restoreAfter = 2600): void {
  el.classList.add('is-confirmed');
  el.dataset.feedbackState = 'confirmed';

  const previous = el.dataset.feedbackLabel ?? el.textContent ?? '';
  el.dataset.feedbackLabel = previous;
  const textNode = Array.from(el.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  ) as Text | undefined;
  if (textNode) textNode.textContent = label;

  drawTick(el);

  const existing = confirmTimers.get(el);
  if (existing) window.clearTimeout(existing);
  const timer = window.setTimeout(() => {
    if (textNode && el.dataset.feedbackLabel) textNode.textContent = el.dataset.feedbackLabel;
    el.classList.remove('is-confirmed');
    delete el.dataset.feedbackState;
    confirmTimers.delete(el);
  }, restoreAfter);
  confirmTimers.set(el, timer);
}

/**
 * Refuse an action.
 *
 * The rule wipes in from the left under the offending field. It is not
 * a shake: a shake is a generic tell, and this site draws rules
 * instead of jolting things.
 */
export function reject(el: HTMLElement): void {
  el.classList.remove('is-rejected');
  void el.offsetWidth;
  el.classList.add('is-rejected');
  window.setTimeout(() => el.classList.remove('is-rejected'), 1600);
}

/* ---------------------------------------------------------------------- */
/* advance — a step or a panel changed                                      */
/* ---------------------------------------------------------------------- */

/**
 * Move between two panels.
 *
 * The outgoing panel leaves on the vertical axis and the incoming one
 * arrives behind it. The incoming panel is prepared before the outgoing
 * one moves, so there is never a frame with nothing on screen.
 */
export function advance(
  outgoing: HTMLElement | null | undefined,
  incoming: HTMLElement | null | undefined,
  direction: 1 | -1 = 1,
): void {
  if (!incoming) return;
  incoming.hidden = false;
  if (env.reducedMotion) {
    if (outgoing) outgoing.hidden = true;
    return;
  }
  const distance = 18 * direction;
  gsap.set(incoming, { opacity: 0, y: distance, x: 0 });
  if (outgoing) {
    gsap.to(outgoing, {
      opacity: 0,
      y: -distance,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        outgoing.hidden = true;
        gsap.set(outgoing, { opacity: 1, y: 0 });
      },
    });
  }
  gsap.to(incoming, {
    opacity: 1,
    y: 0,
    duration: 0.42,
    delay: outgoing ? 0.12 : 0,
    ease: 'power3.out',
  });
}

/* ---------------------------------------------------------------------- */
/* field — a text field that reports that it holds something               */
/* ---------------------------------------------------------------------- */

/**
 * Watch a text field and let it report that it has been filled.
 *
 * The motion reference is explicit about this one: an action a visitor
 * performs *hundreds* of times — typing — gets no animation at all. So a
 * field's acknowledgement is a state, not a movement. The mark is drawn
 * once, the first time the field crosses from empty to holding something
 * that reads correctly, and it stays until the field is emptied again.
 *
 * Nothing moves on a keystroke, so the response is as comfortable at the
 * hundredth character as it is at the first.
 *
 * @param field    The field to watch.
 * @param options.valid  Decides whether what is typed counts as a reading.
 *                       An email address, for instance, is not "filled"
 *                       until it looks like an address.
 * @param options.mark   Where the mark is drawn. Defaults to the label's
 *                       own row, so the mark sits beside its field.
 */
export function watchField(
  field: HTMLInputElement | HTMLTextAreaElement,
  options: {
    valid?: (value: string) => boolean;
    mark?: HTMLElement;
  } = {},
): () => void {
  const wrap = field.closest<HTMLElement>('.field');
  const label = field.id
    ? (wrap?.querySelector<HTMLElement>(`label[for="${field.id}"]`) ?? null)
    : null;
  const mark = options.mark ?? label?.parentElement ?? field.parentElement;
  let drawn = false;

  const update = (): void => {
    const value = field.value.trim();
    const holds = value.length > 0;
    const ok = holds && (options.valid ? options.valid(value) : true);
    field.dataset.fieldState = ok ? 'filled' : holds ? 'writing' : 'empty';
    if (!mark) return;
    if (ok && !drawn) {
      drawn = true;
      drawTick(mark);
    } else if (!ok && drawn) {
      drawn = false;
      mark.querySelector('[data-feedback-tick]')?.remove();
    }
  };

  field.addEventListener('input', update);
  update();

  return () => {
    field.removeEventListener('input', update);
    mark?.querySelector('[data-feedback-tick]')?.remove();
  };
}

/* ---------------------------------------------------------------------- */
/* write — the signature moment                                            */
/* ---------------------------------------------------------------------- */

/**
 * Write a line of text into a field, visibly.
 *
 * This is the one place on the site where motion *shows the visitor
 * something they asked for*. When someone presses "I want this" on a
 * technique, the reference is typed into their brief in front of them,
 * so the connection between the thing they liked and the thing they are
 * about to write is visible rather than implied.
 *
 * The field's own value is only set at the end, so a form that
 * serialises mid-typing never sees a half-written string.
 */
export function writeInto(
  field: HTMLTextAreaElement | HTMLInputElement,
  text: string,
  onDone?: () => void,
): void {
  const original = field.value;

  if (env.reducedMotion) {
    field.value = original + text;
    field.focus({ preventScroll: true });
    field.setSelectionRange(field.value.length, field.value.length);
    onDone?.();
    return;
  }

  const proxy = { n: 0 };
  field.setAttribute('data-writing', 'true');
  gsap.to(proxy, {
    n: text.length,
    duration: Math.min(1.5, 0.28 + text.length * 0.012),
    ease: 'none',
    onUpdate: () => {
      field.value = original + text.slice(0, Math.round(proxy.n));
    },
    onComplete: () => {
      field.value = original + text;
      field.removeAttribute('data-writing');
      field.focus({ preventScroll: true });
      field.setSelectionRange(field.value.length, field.value.length);
      onDone?.();
    },
  });
}
