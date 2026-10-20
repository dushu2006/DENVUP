/**
 * The interaction lab.
 *
 * Two things live here:
 *
 * 1. A playground that replays the real route transitions over the page
 *    that is on screen. The rules are the same objects the router calls,
 *    so what runs here is what a visitor sees when they move between
 *    routes — not a recording of it.
 *
 * 2. The controls for the stage, the field that runs behind every page.
 */

import { $, $$ } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import { bindStageControls } from '../core/stage-controller';
import { TRANSITIONS } from '../transitions';
import type { TransitionRule, ViewContext } from '../core/router';

interface LabContext {
  id: string;
  element: HTMLElement;
}

function makeContext(view: HTMLElement, trigger: HTMLElement): ViewContext {
  const rect = trigger.getBoundingClientRect();
  const url = new URL(location.href);
  return {
    route: {
      id: view.getAttribute('data-view') ?? 'lab',
      path: url.pathname,
      params: {},
      url,
      document: url.pathname,
    },
    element: view,
    trigger,
    direction: 'forward',
    origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
  };
}

export function initLab(ctx: LabContext): () => void {
  const cleanups: (() => void)[] = [];
  const status = $<HTMLElement>('[data-lab-status]');
  const buttons = $$<HTMLButtonElement>('[data-lab-run]');
  const view = ctx.element;

  let running = false;

  const run = async (rule: TransitionRule, trigger: HTMLButtonElement): Promise<void> => {
    if (running) return;
    running = true;
    buttons.forEach((button) => {
      button.disabled = true;
      button.classList.toggle('is-running', button === trigger);
    });
    if (status) status.textContent = `Running “${rule.name}”…`;

    const context = makeContext(view, trigger);

    try {
      rule.beforeLeave?.(context);
      await rule.leave?.(context);
      rule.afterLeave?.(context);

      rule.beforeEnter?.(context);
      await rule.enter?.(context);
      rule.afterEnter?.(context);
    } catch {
      if (status) status.textContent = 'That transition could not run on this page.';
    }

    /* The rules leave transforms on the view while they play. Clear them so
       the page is exactly as it was before the replay. */
    gsap.set(view, { clearProps: 'transform,opacity,filter' });

    buttons.forEach((button) => {
      button.disabled = false;
      button.classList.remove('is-running');
    });
    running = false;
    if (status) {
      status.textContent = env.reducedMotion
        ? 'Reduced motion is on, so the transitions play as their final state.'
        : 'Replayed. The same rule runs on every route change.';
    }
  };

  buttons.forEach((button) => {
    const onClick = (): void => {
      const rule = TRANSITIONS.find((item) => item.name === button.dataset.labRun);
      if (!rule) return;
      void run(rule, button);
    };
    button.addEventListener('click', onClick);
    cleanups.push(() => button.removeEventListener('click', onClick));
  });

  // --- the stage controls -------------------------------------------------- //
  cleanups.push(bindStageControls(view));

  return () => cleanups.forEach((teardown) => teardown());
}
