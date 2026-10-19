import { initEmbeds } from './client/embeds';
import { initForms } from './client/forms';
import { initCapabilities } from './client/caps';
import { initMotion } from './client/motion';
import { initNavigation } from './client/navigation';
import { initScene, refreshScene } from './client/scene';
import { initCursor } from './client/cursor';
import { initRouter } from './client/router';
import { initLabLibrary } from './client/lab-library';
import { initSelector } from './client/selector';
import { maybeIntro } from './client/intro';
import { on, prefersReduced, reducedQuery, toast } from './client/env';

let started = false;

/**
 * Everything that belongs to the content inside <main>. Safe to call again
 * after a soft navigation: motion aborts its previous listeners, and the other
 * modules only bind elements that were just replaced.
 */
function mountContent(): void {
  initMotion();
  initForms();
  initCapabilities();
  initEmbeds();
  initLabLibrary();
  initSelector();
  refreshScene();
}

function boot(): void {
  if (started) return;
  started = true;
  document.documentElement.dataset.motion = prefersReduced() ? 'reduced' : 'full';

  /* Document-lifetime systems. They live outside <main> and survive routing. */
  initScene();
  initCursor();
  initNavigation();
  initRouter();

  mountContent();
  maybeIntro();

  window.DENVUP = { endpoint: '', route: window.location.pathname, remount: mountContent };

  reducedQuery.addEventListener('change', (event) => {
    document.documentElement.dataset.motion = event.matches ? 'reduced' : 'full';
    document.dispatchEvent(new CustomEvent('denvup:motion', { detail: { reduced: event.matches } }));
    toast(
      event.matches
        ? 'Reduced motion is on. Pinned sections release and decorative movement stops; all content remains.'
        : 'Reduced motion is off. The scroll-linked scene resumes.',
      6000,
    );
  });

  on(window, 'pageshow', (event) => {
    if ((event as PageTransitionEvent).persisted) {
      document.documentElement.classList.add('is-restored');
      refreshScene();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
