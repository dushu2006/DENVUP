/**
 * The persistent shell.
 *
 * Everything in this module is wired once and then lives for the whole
 * session: the smooth scroll, the header, the custom cursor, the magnetic
 * targets, the copy buttons, the full-screen menu, the command palette and
 * the scroll progress. None of it is torn down or rebuilt when the route
 * changes — that is the whole point of the shell.
 *
 * The view layer (`src/views/index.ts`) is what comes and goes.
 */

import { $ } from './dom';
import { initCopyButtons } from './clipboard';
import { initPressFeedback } from './feedback';
import { initCursor } from './cursor';
import { initEasterEggs } from './easter';
import { initHeader } from './reveal';
import { initMagnetic, initProximity } from './pointer';
import { destroySmoothScroll, getScrollProgress, initSmoothScroll, pauseOnHidden } from './scroll';
import { initNavigation } from '../sections/navigation';

export function initShell(): () => void {
  const cleanups: (() => void)[] = [];
  const track = (teardown: (() => void) | void): void => {
    if (typeof teardown === 'function') cleanups.push(teardown);
  };

  initSmoothScroll();
  track(destroySmoothScroll);
  track(pauseOnHidden());
  track(initHeader());
  track(initCursor());
  track(initMagnetic());
  track(initProximity());
  track(initCopyButtons());
  track(initPressFeedback());
  track(initEasterEggs());
  track(initNavigation());

  // --- scroll progress ---------------------------------------------------- //
  const bar = $<HTMLElement>('#scroll-progress-bar');
  if (bar) {
    const update = () => {
      bar.style.transform = `scaleX(${getScrollProgress()})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    track(() => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    });
  }

  // --- route progress ----------------------------------------------------- //
  /*
   * The route bar is driven by the router, not by the scroll: it fills while
   * a transition is running, so a slow page still shows that something is
   * happening.
   */
  const routeBar = $<HTMLElement>('#route-progress');
  const setRouteProgress = (value: number) => {
    if (!routeBar) return;
    routeBar.style.setProperty('--route-progress', String(value));
  };
  (window as unknown as Record<string, unknown>).__denvupRouteProgress = setRouteProgress;

  // --- footer year -------------------------------------------------------- //
  const year = document.querySelector<HTMLElement>('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  return () => {
    cleanups.forEach((teardown) => {
      try {
        teardown();
      } catch {
        /* a failing teardown must not block the rest */
      }
    });
    cleanups.length = 0;
  };
}
