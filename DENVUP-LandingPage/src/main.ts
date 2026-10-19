import { initEmbeds } from './client/embeds';
import { initForms } from './client/forms';
import { initCapabilities } from './client/caps';
import { initMotion } from './client/motion';
import { initNavigation } from './client/navigation';
import { on, prefersReduced, reducedQuery, toast } from './client/env';

let started = false;

function boot(): void {
  if (started) return;
  started = true;
  document.documentElement.dataset.motion = prefersReduced() ? 'reduced' : 'full';

  initNavigation();
  initMotion();
  initForms();
  initCapabilities();
  initEmbeds();

  reducedQuery.addEventListener('change', (event) => {
    document.documentElement.dataset.motion = event.matches ? 'reduced' : 'full';
    toast(
      event.matches
        ? 'Reduced motion is on. Pinned sections release and decorative movement stops; all content remains.'
        : 'Reduced motion is off. Reload to restart the full motion path.',
      6000,
    );
  });

  on(window, 'pageshow', (event) => {
    if ((event as PageTransitionEvent).persisted) {
      document.documentElement.classList.add('is-restored');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
