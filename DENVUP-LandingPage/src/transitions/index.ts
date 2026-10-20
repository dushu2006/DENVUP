/**
 * DENVUP — the route transitions.
 *
 * One table of rules. The router asks for "the rule that matches this pair
 * of routes" and runs it. First match wins, so the specific rules are listed
 * before the general ones.
 *
 * Every rule here is a *designed* transition. None of them is a fade, and
 * that is a testable property: if a cross-fade could be swapped in without
 * anyone noticing, the rule is not finished.
 *
 * Each rule follows the same shape:
 *
 *   beforeLeave  prepare any instrument the rule needs
 *   leave        animate the outgoing view out
 *   afterLeave   tidy up
 *   beforeEnter  measure the incoming view (it is in the DOM by now)
 *   enter        animate the incoming view in
 *   afterEnter   release the instruments
 *
 * Every rule also has a reduced-motion variant, and every rule knows which
 * way it is travelling. On a Back press the rule of the journey being undone
 * is chosen and played in reverse: the field grows from the other side, the
 * shape wipe closes where it opened, the panels fall instead of rise. The
 * reverse of a transition is not the same animation played again.
 */

import { gsap, ease } from '../core/motion';
import { env } from '../core/env';
import type { TransitionRule, ViewContext } from '../core/router';

/* ---------------------------------------------------------------------- */
/* Shared instruments                                                       */
/* ---------------------------------------------------------------------- */

type FxLayer = HTMLElement & { dataset: DOMStringMap };

const fxRoot: { el: HTMLElement | null } = { el: null };

function fxHost(): HTMLElement {
  if (fxRoot.el && document.body.contains(fxRoot.el)) return fxRoot.el;
  const host = document.createElement('div');
  host.className = 'fx-host';
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:fixed;inset:0;z-index:var(--z-overlay);pointer-events:none;';
  document.body.appendChild(host);
  fxRoot.el = host;
  return host;
}

function layer(className: string, html = ''): FxLayer {
  const host = fxHost();
  const existing = host.querySelector<FxLayer>(`.${className}`);
  if (existing) return existing;
  const el = document.createElement('div');
  el.className = `fx-layer ${className}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = html;
  host.appendChild(el);
  return el;
}

function show(el: FxLayer, on: boolean): void {
  el.dataset.active = on ? 'true' : 'false';
}

function release(...els: (FxLayer | null | undefined)[]): void {
  els.forEach((el) => {
    if (!el) return;
    show(el, false);
    gsap.set(el, { clearProps: 'all' });
  });
}

/** Put the incoming view over the outgoing one without collapsing the page. */
function overlap(outgoing: HTMLElement, incoming: HTMLElement): void {
  const height = outgoing.getBoundingClientRect().height;
  outgoing.style.position = 'absolute';
  outgoing.style.top = '0';
  outgoing.style.left = '0';
  outgoing.style.width = '100%';
  outgoing.style.height = `${height}px`;
  outgoing.style.zIndex = '1';
  outgoing.style.pointerEvents = 'none';
  incoming.style.position = 'relative';
  incoming.style.zIndex = '2';
  incoming.style.minHeight = `${height}px`;
}

function restore(incoming: HTMLElement): void {
  incoming.style.position = '';
  incoming.style.zIndex = '';
  incoming.style.minHeight = '';
}

/** True when the transition is running backwards. */
const isBack = (ctx: ViewContext): boolean => ctx.direction === 'back';

/* ---------------------------------------------------------------------- */
/* Instrument: the shared brand mark                                       */
/* ---------------------------------------------------------------------- */

function markLayer(): FxLayer {
  return layer(
    'fx-mark',
    '<img src="/logo_color.png" alt="" width="240" height="210" decoding="async" />',
  );
}

/* ---------------------------------------------------------------------- */
/* 1 — Home → a service detail: the card expands from its exact position   */
/* ---------------------------------------------------------------------- */

const serviceExpand: TransitionRule = {
  name: 'service-expand',
  from: ['home', 'services'],
  to: 'service',

  beforeLeave(ctx: ViewContext): void {
    const el = layer('fx-expand');

    if (isBack(ctx)) {
      /*
       * Going back: the artwork on the service page is the thing that
       * collapses. It is measured here and shrunk back towards the middle
       * of the screen, which is where the card lives on the home page.
       */
      const art = ctx.element.querySelector<HTMLImageElement>('[data-service-art]');
      const rect = art?.getBoundingClientRect();
      el.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;background-size:cover;background-position:center;opacity:0;`;
      if (art) {
        el.style.backgroundImage = `url("${art.currentSrc || art.src}")`;
        el.dataset.rect = JSON.stringify({
          x: rect?.left ?? 0,
          y: rect?.top ?? 0,
          w: rect?.width ?? window.innerWidth,
          h: rect?.height ?? window.innerHeight,
        });
      }
      show(el, true);
      gsap.set(el, { opacity: 0, scale: 0.4, xPercent: 0, yPercent: 0, transformOrigin: '50% 50%' });
      return;
    }

    const trigger = ctx.trigger;
    const card = trigger?.closest<HTMLElement>('[data-service-card]');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const art = card.dataset.art ?? '';

    el.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;background-image:url("${art}");background-size:cover;background-position:center;opacity:0;`;
    show(el, true);
    gsap.set(el, { opacity: 0, scaleX: 1, scaleY: 1, x: 0, y: 0, transformOrigin: '0 0' });
    el.dataset.rect = JSON.stringify({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
  },

  async leave(ctx: ViewContext): Promise<void> {
    const el = fxHost().querySelector<FxLayer>('.fx-expand');
    if (!el) return;
    const view = ctx.element;

    if (env.reducedMotion) {
      gsap.set(el, { opacity: 0 });
      show(el, false);
      return;
    }

    if (isBack(ctx)) {
      const tl = gsap.timeline();
      tl.to(el, { opacity: 1, scale: 1, duration: 0.36, ease: 'power2.out' }, 0);
      tl.to(el, { opacity: 0, scale: 0.22, duration: 0.42, ease: 'power3.in' }, 0.36);
      tl.to(view, { scale: 0.96, duration: 0.5, ease: 'power2.inOut' }, 0);
      await tl.then();
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = JSON.parse(el.dataset.rect ?? '{}') as { x: number; y: number; w: number; h: number };
    const sx = vw / Math.max(1, rect.w);
    const sy = vh / Math.max(1, rect.h);

    const tl = gsap.timeline();
    tl.to(el, { opacity: 1, duration: 0.24, ease: 'power2.out' }, 0);
    tl.to(
      el,
      {
        x: -rect.x,
        y: -rect.y,
        scaleX: sx,
        scaleY: sy,
        duration: 0.72,
        ease: 'expo.inOut',
      },
      0,
    );
    tl.to(view, { scale: 0.96, duration: 0.72, ease: 'power2.inOut' }, 0);
    await tl.then();
  },

  beforeEnter(ctx: ViewContext): void {
    const art = ctx.element.querySelector<HTMLImageElement>('[data-service-art]');
    if (!art) return;
    const rect = art.getBoundingClientRect();
    art.dataset.targetRect = JSON.stringify({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      w: rect.width,
      h: rect.height,
    });
    gsap.set(art, { opacity: 0 });
  },

  async enter(ctx: ViewContext): Promise<void> {
    const el = fxHost().querySelector<FxLayer>('.fx-expand') ?? undefined;
    const art = ctx.element.querySelector<HTMLImageElement>('[data-service-art]');

    if (isBack(ctx)) {
      /* The home page grows back into place. */
      if (env.reducedMotion) {
        gsap.set(ctx.element, { clearProps: 'transform' });
        if (el) show(el, false);
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        ctx.element,
        { scale: 0.96 },
        { scale: 1, duration: 0.5, ease: 'expo.out' },
        0,
      );
      await tl.then();
      gsap.set(ctx.element, { clearProps: 'transform' });
      return;
    }

    if (!el || !art) return;
    const target = JSON.parse(art.dataset.targetRect ?? '{}') as {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cur = JSON.parse(el.dataset.rect ?? '{}') as { x: number; y: number; w: number; h: number };

    if (env.reducedMotion) {
      gsap.set(art, { opacity: 1 });
      show(el, false);
      return;
    }

    const toX = target.x - window.scrollX;
    const toY = target.y - window.scrollY;
    const tl = gsap.timeline();
    tl.to(
      el,
      {
        x: toX - cur.x,
        y: toY - cur.y,
        scaleX: Math.max(0.02, target.w / vw),
        scaleY: Math.max(0.02, target.h / vh),
        duration: 0.66,
        ease: 'expo.out',
      },
      0,
    );
    tl.to(el, { opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.42);
    tl.to(art, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.42);
    await tl.then();
    gsap.set(art, { clearProps: 'opacity' });
  },

  afterEnter(): void {
    release(fxHost().querySelector<FxLayer>('.fx-expand') as FxLayer);
  },
};

/* ---------------------------------------------------------------------- */
/* 2 — any → Lab: a shape wipe from the click point over a blueprint grid   */
/* ---------------------------------------------------------------------- */

const shapeWipe: TransitionRule = {
  name: 'shape-wipe',
  to: 'lab',

  beforeLeave(ctx: ViewContext): void {
    const origin = ctx.origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const grid = layer('fx-blueprint');
    const wipe = layer('fx-wipe');
    wipe.style.setProperty('--fx-wipe-colour', 'var(--signal)');
    const radius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    );
    gsap.set(wipe, { clipPath: 'circle(0% at 50% 50%)' });
    gsap.set(grid, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });
    show(grid, true);
    show(wipe, true);
    wipe.dataset.radius = String(radius);
    wipe.dataset.originX = String(origin.x);
    wipe.dataset.originY = String(origin.y);
  },

  async leave(ctx: ViewContext): Promise<void> {
    const wipe = fxHost().querySelector<FxLayer>('.fx-wipe');
    const grid = fxHost().querySelector<FxLayer>('.fx-blueprint');
    if (!wipe) return;
    if (env.reducedMotion) {
      gsap.set(wipe, { clipPath: 'circle(150% at 50% 50%)' });
      return;
    }
    const radius = Number(wipe.dataset.radius ?? 2000);
    const tl = gsap.timeline();
    tl.to(grid, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0);
    if (isBack(ctx)) {
      /* Undoing the forward exit: the circle opens again, from the centre. */
      tl.to(wipe, { clipPath: `circle(${radius}px at 50% 50%)`, duration: 0.62, ease: 'expo.inOut' }, 0);
    } else {
      tl.to(wipe, { clipPath: `circle(${radius}px at ${wipe.dataset.originX}px ${wipe.dataset.originY}px)`, duration: 0.62, ease: 'expo.inOut' }, 0);
    }
    tl.to(ctx.element, { scale: 0.97, duration: 0.62, ease: 'power2.inOut' }, 0);
    await tl.then();
  },

  async enter(ctx: ViewContext): Promise<void> {
    const wipe = fxHost().querySelector<FxLayer>('.fx-wipe');
    const grid = fxHost().querySelector<FxLayer>('.fx-blueprint');
    if (!wipe) return;
    if (env.reducedMotion) {
      show(wipe, false);
      if (grid) show(grid, false);
      return;
    }
    const originX = wipe.dataset.originX ?? '50%';
    const originY = wipe.dataset.originY ?? '50%';
    const tl = gsap.timeline();
    if (isBack(ctx)) {
      /* The reverse closes the circle where the forward one opened it. */
      tl.to(wipe, { clipPath: `circle(0% at ${originX}px ${originY}px)`, duration: 0.58, ease: 'expo.inOut' }, 0);
    } else {
      tl.to(wipe, { clipPath: 'circle(0% at 50% 50%)', duration: 0.58, ease: 'expo.inOut' }, 0);
    }
    tl.to(grid, { opacity: 0, scale: 1.08, duration: 0.58, ease: 'power2.in' }, 0);
    await tl.then();
    show(wipe, false);
    if (grid) show(grid, false);
  },

  afterEnter(): void {
    const host = fxHost();
    release(
      host.querySelector<FxLayer>('.fx-wipe') as FxLayer,
      host.querySelector<FxLayer>('.fx-blueprint') as FxLayer,
    );
  },
};

/* ---------------------------------------------------------------------- */
/* 3 — any → Studio: a horizontal colour wipe, the mark travelling across   */
/* ---------------------------------------------------------------------- */

const colourWipe: TransitionRule = {
  name: 'colour-wipe',
  to: 'studio',

  beforeLeave(ctx: ViewContext): void {
    const field = layer('fx-field');
    field.style.setProperty('--fx-field-colour', 'var(--ember)');
    const mark = markLayer();
    const back = isBack(ctx);
    gsap.set(field, { scaleX: 0, transformOrigin: back ? 'right center' : 'left center' });
    gsap.set(mark, { opacity: 0, xPercent: back ? -140 : 140, rotate: back ? 8 : -8 });
    show(field, true);
    show(mark, true);
  },

  async leave(ctx: ViewContext): Promise<void> {
    const field = fxHost().querySelector<FxLayer>('.fx-field');
    const mark = fxHost().querySelector<FxLayer>('.fx-mark');
    if (!field) return;
    if (env.reducedMotion) {
      gsap.set(field, { scaleX: 1 });
      return;
    }
    const back = isBack(ctx);
    const tl = gsap.timeline();
    tl.to(field, { scaleX: 1, duration: 0.58, ease: 'expo.inOut' }, 0);
    if (back) {
      tl.to(mark, { opacity: 1, xPercent: 140, duration: 0.9, ease: 'power2.inOut' }, 0.06);
      tl.to(ctx.element, { x: 40, duration: 0.58, ease: 'expo.inOut' }, 0);
    } else {
      tl.to(mark, { opacity: 1, xPercent: -140, duration: 0.9, ease: 'power2.inOut' }, 0.06);
      tl.to(ctx.element, { x: -40, duration: 0.58, ease: 'expo.inOut' }, 0);
    }
    await tl.then();
  },

  async enter(ctx: ViewContext): Promise<void> {
    const field = fxHost().querySelector<FxLayer>('.fx-field');
    const mark = fxHost().querySelector<FxLayer>('.fx-mark');
    if (!field) return;
    if (env.reducedMotion) {
      show(field, false);
      if (mark) show(mark, false);
      return;
    }
    const back = isBack(ctx);
    const tl = gsap.timeline();
    tl.set(ctx.element, { x: back ? -60 : 60 });
    tl.to(
      field,
      { scaleX: 0, transformOrigin: back ? 'left center' : 'right center', duration: 0.62, ease: 'expo.inOut' },
      0.08,
    );
    if (back) {
      tl.to(mark, { xPercent: -140, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0.1);
    } else {
      tl.to(mark, { xPercent: 140, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0.1);
    }
    tl.to(ctx.element, { x: 0, duration: 0.62, ease: 'power2.out' }, 0.08);
    await tl.then();
    gsap.set(ctx.element, { clearProps: 'x' });
  },

  afterEnter(): void {
    const host = fxHost();
    release(host.querySelector<FxLayer>('.fx-field') as FxLayer, host.querySelector<FxLayer>('.fx-mark') as FxLayer);
  },
};

/* ---------------------------------------------------------------------- */
/* 4 — any → Pricing: overlapping panels arriving at different speeds      */
/* ---------------------------------------------------------------------- */

const panelOverlap: TransitionRule = {
  name: 'panel-overlap',
  to: 'pricing',

  beforeLeave(ctx: ViewContext): void {
    const panels = layer('fx-panel', '<i class="fx-panel"></i><i class="fx-panel"></i><i class="fx-panel"></i>');
    panels.style.setProperty('--fx-panel-1', 'var(--ink)');
    panels.style.setProperty('--fx-panel-2', 'var(--ember)');
    panels.style.setProperty('--fx-panel-3', 'var(--paper)');
    const slabs = Array.from(panels.querySelectorAll<HTMLElement>('.fx-panel'));
    const back = isBack(ctx);
    slabs.forEach((slab) => {
      gsap.set(slab, { yPercent: back ? -100 : 100, scaleY: 1 });
      gsap.set(slab, { transformOrigin: back ? 'top center' : 'bottom center' });
    });
    show(panels, true);
  },

  async leave(ctx: ViewContext): Promise<void> {
    const panels = fxHost().querySelector<FxLayer>('.fx-panel');
    if (!panels) return;
    if (env.reducedMotion) {
      gsap.set(panels.querySelectorAll('.fx-panel'), { yPercent: 0 });
      return;
    }
    const slabs = panels.querySelectorAll<HTMLElement>('.fx-panel');
    const back = isBack(ctx);
    const tl = gsap.timeline();
    if (back) {
      /* The panels fall into place instead of rising. */
      tl.to(slabs[0], { yPercent: 0, duration: 0.52, ease: 'power3.out' }, 0);
      tl.to(slabs[1], { yPercent: 0, duration: 0.64, ease: 'power3.out' }, 0.07);
      tl.to(slabs[2], { yPercent: 0, duration: 0.76, ease: 'power3.out' }, 0.14);
    } else {
      tl.to(slabs[0], { yPercent: 0, duration: 0.52, ease: 'power3.out' }, 0);
      tl.to(slabs[1], { yPercent: 0, duration: 0.64, ease: 'power3.out' }, 0.07);
      tl.to(slabs[2], { yPercent: 0, duration: 0.76, ease: 'power3.out' }, 0.14);
    }
    tl.to(ctx.element, { scale: 0.98, duration: 0.6, ease: 'power2.inOut' }, 0);
    await tl.then();
  },

  async enter(): Promise<void> {
    const panels = fxHost().querySelector<FxLayer>('.fx-panel');
    if (!panels) return;
    if (env.reducedMotion) {
      show(panels, false);
      return;
    }
    const slabs = panels.querySelectorAll<HTMLElement>('.fx-panel');
    const tl = gsap.timeline();
    tl.to(slabs[2], { yPercent: -100, duration: 0.6, ease: 'power3.in' }, 0);
    tl.to(slabs[1], { yPercent: -100, duration: 0.52, ease: 'power3.in' }, 0.08);
    tl.to(slabs[0], { yPercent: -100, duration: 0.44, ease: 'power3.in' }, 0.16);
    await tl.then();
    show(panels, false);
  },

  afterEnter(): void {
    const host = fxHost();
    release(host.querySelector<FxLayer>('.fx-panel') as FxLayer);
  },
};

/* ---------------------------------------------------------------------- */
/* 5 — any → Contact: a curtain opens over an already-settled page        */
/* ---------------------------------------------------------------------- */

const curtainOpen: TransitionRule = {
  name: 'curtain-open',
  to: 'contact',

  beforeLeave(ctx: ViewContext): void {
    const curtain = layer('fx-curtain', '<i class="fx-curtain"></i><i class="fx-curtain"></i>');
    curtain.style.setProperty('--fx-curtain-colour', 'var(--ink)');
    const halves = curtain.querySelectorAll<HTMLElement>('.fx-curtain');
    if (isBack(ctx)) {
      /* The reverse curtain comes from the opposite corners. */
      gsap.set(halves[0], { xPercent: 101 });
      gsap.set(halves[1], { xPercent: -101 });
    } else {
      gsap.set(halves[0], { xPercent: -101 });
      gsap.set(halves[1], { xPercent: 101 });
    }
    show(curtain, true);
  },

  async leave(ctx: ViewContext): Promise<void> {
    const curtain = fxHost().querySelector<FxLayer>('.fx-curtain');
    if (!curtain) return;
    const halves = curtain.querySelectorAll<HTMLElement>('.fx-curtain');
    if (env.reducedMotion) {
      gsap.set(halves[0], { xPercent: 0 });
      gsap.set(halves[1], { xPercent: 0 });
      return;
    }
    const tl = gsap.timeline();
    tl.to(halves[0], { xPercent: 0, duration: 0.46, ease: 'power3.inOut' }, 0);
    tl.to(halves[1], { xPercent: 0, duration: 0.46, ease: 'power3.inOut' }, 0);
    tl.to(ctx.element, { y: isBack(ctx) ? 24 : -24, duration: 0.46, ease: 'power2.in' }, 0);
    await tl.then();
  },

  async enter(ctx: ViewContext): Promise<void> {
    const curtain = fxHost().querySelector<FxLayer>('.fx-curtain');
    if (!curtain) return;
    const halves = curtain.querySelectorAll<HTMLElement>('.fx-curtain');
    if (env.reducedMotion) {
      gsap.set(halves[0], { xPercent: -101 });
      gsap.set(halves[1], { xPercent: 101 });
      show(curtain, false);
      return;
    }
    const tl = gsap.timeline();
    tl.to(halves[0], { xPercent: -101, duration: 0.66, ease: 'power3.inOut' }, 0);
    tl.to(halves[1], { xPercent: 101, duration: 0.66, ease: 'power3.inOut' }, 0);
    const stagger = ctx.element.querySelectorAll<HTMLElement>('[data-enter-stagger]');
    if (stagger.length) {
      tl.fromTo(
        stagger,
        { y: 28 },
        { y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' },
        0.12,
      );
    }
    await tl.then();
  },

  afterEnter(): void {
    const host = fxHost();
    release(host.querySelector<FxLayer>('.fx-curtain') as FxLayer);
  },
};

/* ---------------------------------------------------------------------- */
/* 6 — any → Concepts: an image-mask, liquid wipe                          */
/* ---------------------------------------------------------------------- */

const imageMask: TransitionRule = {
  name: 'image-mask',
  to: 'concepts',

  beforeLeave(ctx: ViewContext): void {
    const mask = layer('fx-mask');
    const art = ctx.element.dataset.art ?? '';
    mask.style.setProperty('--fx-mask-image', art ? `url("${art}")` : 'var(--ember)');
    gsap.set(mask, { clipPath: 'circle(0% at 50% 50%)' });
    show(mask, true);
  },

  async leave(ctx: ViewContext): Promise<void> {
    const mask = fxHost().querySelector<FxLayer>('.fx-mask');
    if (!mask) return;
    if (env.reducedMotion) {
      gsap.set(mask, { clipPath: 'circle(150% at 50% 50%)' });
      return;
    }
    const tl = gsap.timeline();
    if (isBack(ctx)) {
      /* The liquid wobble runs the other way round. */
      tl.to(mask, { clipPath: 'circle(46% at 48% 52%)', duration: 0.4, ease: 'power1.inOut' }, 0);
      tl.to(mask, { clipPath: 'circle(28% at 52% 48%)', duration: 0.4, ease: 'power2.inOut' }, 0.4);
      tl.to(mask, { clipPath: 'circle(160% at 50% 50%)', duration: 0.5, ease: 'power2.in' }, 0.8);
    } else {
      tl.to(mask, { clipPath: 'circle(28% at 50% 48%)', duration: 0.42, ease: 'power2.out' }, 0);
      tl.to(mask, { clipPath: 'circle(46% at 52% 52%)', duration: 0.4, ease: 'power1.inOut' }, 0.42);
      tl.to(mask, { clipPath: 'circle(160% at 50% 50%)', duration: 0.5, ease: 'power2.in' }, 0.82);
    }
    tl.to(ctx.element, { scale: 0.96, duration: 0.9, ease: 'power2.inOut' }, 0);
    await tl.then();
  },

  async enter(): Promise<void> {
    const mask = fxHost().querySelector<FxLayer>('.fx-mask');
    if (!mask) return;
    if (env.reducedMotion) {
      show(mask, false);
      return;
    }
    const tl = gsap.timeline();
    tl.to(mask, { clipPath: 'circle(0% at 50% 50%)', duration: 0.56, ease: 'expo.inOut' }, 0);
    await tl.then();
    show(mask, false);
  },

  afterEnter(): void {
    const host = fxHost();
    release(host.querySelector<FxLayer>('.fx-mask') as FxLayer);
  },
};

/* ---------------------------------------------------------------------- */
/* 7 — any → 404: a controlled glitch that settles                         */
/* ---------------------------------------------------------------------- */

const glitchSettle: TransitionRule = {
  name: 'glitch-settle',
  to: 'notfound',

  beforeLeave(ctx: ViewContext): void {
    const glitch = layer('fx-glitch', '<span></span><span></span><span></span>');
    glitch.style.setProperty('--fx-glitch-colour', 'var(--ink)');
    const bands = glitch.querySelectorAll<HTMLElement>('span');
    const back = isBack(ctx);
    gsap.set(glitch, { opacity: 1 });
    gsap.set(bands[0], { x: back ? 60 : -60 });
    gsap.set(bands[1], { x: back ? -90 : 90 });
    gsap.set(bands[2], { x: back ? 30 : -30 });
    show(glitch, true);
  },

  async leave(ctx: ViewContext): Promise<void> {
    const glitch = fxHost().querySelector<FxLayer>('.fx-glitch');
    if (!glitch) return;
    if (env.reducedMotion) {
      gsap.set(glitch, { opacity: 0 });
      return;
    }
    const back = isBack(ctx);
    const sign = back ? -1 : 1;
    const bands = glitch.querySelectorAll<HTMLElement>('span');
    const tl = gsap.timeline();
    tl.to(bands[0], { x: 120 * sign, duration: 0.07, ease: 'steps(2)' }, 0);
    tl.to(bands[1], { x: -140 * sign, duration: 0.06, ease: 'steps(2)' }, 0.05);
    tl.to(bands[2], { x: 70 * sign, duration: 0.05, ease: 'steps(2)' }, 0.1);
    tl.to(bands[0], { x: -40 * sign, duration: 0.06, ease: 'steps(2)' }, 0.15);
    tl.to(bands[1], { x: 60 * sign, duration: 0.05, ease: 'steps(2)' }, 0.2);
    tl.to(bands[2], { x: 0, duration: 0.05, ease: 'steps(2)' }, 0.24);
    tl.to(ctx.element, { x: -14 * sign, duration: 0.09, ease: 'steps(3)' }, 0.02);
    tl.to(ctx.element, { x: 0, duration: 0.09, ease: 'steps(3)' }, 0.18);
    await tl.then();
  },

  async enter(ctx: ViewContext): Promise<void> {
    const glitch = fxHost().querySelector<FxLayer>('.fx-glitch');
    if (!glitch) return;
    if (env.reducedMotion) {
      show(glitch, false);
      return;
    }
    const bands = glitch.querySelectorAll<HTMLElement>('span');
    const tl = gsap.timeline();
    tl.to(bands, { x: 0, duration: 0.1, ease: 'power2.out' }, 0);
    tl.to(glitch, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.06);
    const stagger = ctx.element.querySelectorAll<HTMLElement>('[data-enter-stagger]');
    if (stagger.length) {
      tl.fromTo(
        stagger,
        { y: 26 },
        { y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out' },
        0.14,
      );
    }
    await tl.then();
    show(glitch, false);
  },

  afterEnter(): void {
    const host = fxHost();
    release(host.querySelector<FxLayer>('.fx-glitch') as FxLayer);
  },
};

/* ---------------------------------------------------------------------- */
/* 8 — the default: the outgoing view stacks under the incoming one        */
/* ---------------------------------------------------------------------- */

const stackDefault: TransitionRule = {
  name: 'stack-default',

  beforeLeave(ctx: ViewContext): void {
    overlap(ctx.element, document.querySelector<HTMLElement>('#view') ?? ctx.element);
  },

  async leave(ctx: ViewContext): Promise<void> {
    if (env.reducedMotion) return;
    const back = isBack(ctx);
    const tl = gsap.timeline();
    tl.to(ctx.element, { scale: 0.94, y: back ? 26 : -26, duration: 0.5, ease: 'power2.inOut' }, 0);
    tl.to(ctx.element, { filter: 'brightness(0.55)', duration: 0.5, ease: 'power2.inOut' }, 0);
    await tl.then();
  },

  async enter(ctx: ViewContext): Promise<void> {
    if (env.reducedMotion) {
      restore(ctx.element);
      return;
    }
    const back = isBack(ctx);
    const tl = gsap.timeline();
    tl.fromTo(
      ctx.element,
      { y: back ? -46 : 46, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      0,
    );
    const stagger = ctx.element.querySelectorAll<HTMLElement>('[data-enter-stagger]');
    if (stagger.length) {
      tl.fromTo(
        stagger,
        { y: 24 },
        { y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
        0.08,
      );
    }
    await tl.then();
    restore(ctx.element);
  },
};

/* ---------------------------------------------------------------------- */
/* The reduced-motion fallback                                             */
/* ---------------------------------------------------------------------- */

/**
 * What runs when the visitor has asked for less motion.
 *
 * None of the designed transitions is played. The two views exchange
 * places with a short crossfade and a very small settle, and that is all.
 *
 * This is the one place in the system where a fade is the right answer.
 * Everywhere else a fade would be a cop-out — the brief asks for each
 * entrance and exit to have a shape of its own. Here the shape of the
 * answer is "as little movement as possible", and a crossfade is the
 * smallest honest way to say that while still telling the visitor that
 * something changed.
 */
export const reducedCrossfade: TransitionRule = {
  name: 'crossfade',

  beforeLeave(ctx: ViewContext): void {
    gsap.set(ctx.element, { opacity: 1 });
  },

  async leave(ctx: ViewContext): Promise<void> {
    await withFade(ctx.element, 0);
  },

  async enter(ctx: ViewContext): Promise<void> {
    await withFade(ctx.element, 1);
  },
};

/** A plain opacity change, used only by the reduced-motion fallback. */
function withFade(element: HTMLElement, to: number): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(element, {
      opacity: to,
      duration: 0.24,
      ease: 'none',
      onComplete: () => {
        gsap.set(element, { clearProps: 'opacity' });
        resolve();
      },
    });
  });
}

/* ---------------------------------------------------------------------- */
/* The table                                                                */
/* ---------------------------------------------------------------------- */

export const TRANSITIONS: TransitionRule[] = [
  serviceExpand,
  shapeWipe,
  colourWipe,
  panelOverlap,
  curtainOpen,
  imageMask,
  glitchSettle,
  stackDefault,
];

/** Exposed for tests: the rule that would run for a given pair. */
export function transitionNameFor(from: string | null, to: string): string {
  const list = (value: string | string[] | undefined): string[] =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];
  for (const rule of TRANSITIONS) {
    const fromList = list(rule.from);
    const toList = list(rule.to);
    const fromOk = fromList.length === 0 || (from !== null && fromList.includes(from));
    const toOk = toList.length === 0 || toList.includes(to);
    if (fromOk && toOk) return rule.name;
  }
  return 'none';
}

export { ease };
