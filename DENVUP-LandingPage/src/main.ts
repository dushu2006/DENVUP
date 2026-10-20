/**
 * DENVUP — entry point.
 *
 * The site is a multi-page build with a client-side router on top.
 *
 * Three layers, in order of how long they live:
 *
 *   the shell   the header, the menu, the cursor, the stage — mounted once,
 *               and never replaced, whatever route the visitor moves to
 *   the stage   one canvas behind the whole site, re-parameterised per
 *               chapter and per route rather than reloaded
 *   the view    the content of the route that is on screen — mounted and
 *               torn down on every change
 *
 * The boot sequence releases the home page. Interior routes have no intro:
 * arriving at a price list should not mean sitting through a cinematic
 * opening.
 */

/* Self-hosted variable fonts: Archivo (weight + width axes) and JetBrains Mono. */
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono/index.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/library.css';
import './styles/motion.css';
import './styles/feedback.css';
import './styles/routes.css';

import { $ } from './core/dom';
import { env, onMotionPreferenceChange } from './core/env';
import { runBoot } from './core/boot';
import { initShell } from './core/shell';
import { initStageController, setStageLook } from './core/stage-controller';
import { createRouter } from './core/router';
import { refreshTriggers } from './core/motion';
import { ROUTES } from './data/routes';
import { STAGE_FALLBACK, STAGE_LOOKS, type StageLookName } from './data/stage';
import { reducedCrossfade, TRANSITIONS } from './transitions';
import { mountView } from './views/index';
import { initNavigationForRoute } from './sections/navigation';

const teardowns: (() => void)[] = [];

function track(teardown: (() => void) | void): void {
  if (typeof teardown === 'function') teardowns.push(teardown);
}

/** The stage look for a route id. */
const ROUTE_LOOKS: Record<string, StageLookName> = {
  home: 'routeHome',
  services: 'routeServices',
  service: 'routeService',
  lab: 'routeLab',
  concepts: 'routeConcepts',
  studio: 'routeStudio',
  pricing: 'routePricing',
  contact: 'routeContact',
  privacy: 'routeLegal',
  terms: 'routeLegal',
  notfound: 'routeNotFound',
};

function boot(): void {
  document.documentElement.classList.add('js');

  // --- the shell, mounted once ------------------------------------------- //
  track(initShell());
  track(initStageController());

  // --- the router --------------------------------------------------------- //
  const view = $<HTMLElement>('#view');
  if (!view) return;

  const routeProgress = $<HTMLElement>('#route-progress');
  const setProgress = (value: number): void => {
    if (!routeProgress) return;
    routeProgress.style.setProperty('--route-progress', String(value));
  };

  const router = createRouter({
    view,
    shell: document.body,
    rules: ROUTES,
    transitions: TRANSITIONS,
    /* The reduced-motion fallback: one short crossfade, no choreography. */
    reducedTransitions: [reducedCrossfade],
    isReduced: () => env.reducedMotion,
    mount: (ctx) =>
      mountView({
        id: ctx.route.id,
        path: ctx.route.path,
        params: ctx.route.params,
        element: ctx.element,
        trigger: ctx.trigger,
        direction: ctx.direction,
        hash: ctx.route.url.hash,
      }),
    onRoute: (ctx) => {
      const look = STAGE_LOOKS[ROUTE_LOOKS[ctx.route.id] ?? 'routeHome'] ?? STAGE_FALLBACK;
      setStageLook(look, 1.4);
      initNavigationForRoute(ctx.route.id);
      setProgress(0);
    },
    onProgress: (phase) => {
      setProgress(phase === 'start' ? 0.12 : 1);
    },
  });

  track(() => router.dispose());

  /*
   * The router starts before the boot sequence finishes. The intro is an
   * overlay, so the shell is already live underneath it, and a visitor who
   * clicks during the intro gets a real route change rather than a full
   * page load.
   */
  router.start();
  document.documentElement.setAttribute('data-router', 'ready');
  document.documentElement.setAttribute('data-direction', 'forward');

  // --- release ------------------------------------------------------------ //
  void runBoot().then(() => {
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => refreshTriggers());
    }
    window.setTimeout(() => refreshTriggers(), 600);
  });
}

// The operating-system preference and the in-page switch both end up here.
onMotionPreferenceChange((reduced) => {
  document.documentElement.classList.toggle('is-reduced', reduced);
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    teardowns.forEach((teardown) => {
      try {
        teardown();
      } catch {
        /* a failing teardown must not block the rest */
      }
    });
    teardowns.length = 0;
  });
}

boot();

export { env };
