/**
 * The opening, once.
 *
 * Rules from the brief and from the encyclopedia §1:
 *  - first visit only;
 *  - short: it releases when fonts and the first frame are ready, with a hard
 *    3-second ceiling, so a slow asset can never hold the page;
 *  - skippable from the first frame, in the DOM as a real button;
 *  - reduced motion skips it entirely;
 *  - it never gates content: the page behind it is already rendered.
 */

const KEY = 'denvup:visited';

export function maybeIntro(): void {
  if (window.location.pathname !== '/') return;
  if (document.documentElement.dataset.motion === 'reduced') return;
  try {
    if (localStorage.getItem(KEY)) return;
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'intro';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Welcome to DENVUP');
  overlay.innerHTML = `
    <div class="intro__inner">
      <img class="intro__mark" src="/assets/brand/logo-colour-360.webp" width="140" height="140" alt="" fetchpriority="high">
      <p class="intro__word" aria-hidden="true">${'DENVUP'.split('').map((c) => `<span>${c}</span>`).join('')}</p>
      <p class="intro__note">A digital studio · Andhra Pradesh</p>
      <div class="intro__meter" aria-hidden="true"><i></i></div>
      <button class="intro__skip" type="button">Skip</button>
    </div>`;

  document.body.append(overlay);
  document.documentElement.classList.add('intro-open');

  const bar = overlay.querySelector<HTMLElement>('.intro__meter i');
  let progress = 0;
  let done = false;

  const tick = () => {
    if (done) return;
    progress = Math.min(96, progress + 4 + Math.random() * 6);
    if (bar) bar.style.transform = `scaleX(${progress / 100})`;
  };
  const timer = window.setInterval(tick, 90);

  const finish = () => {
    if (done) return;
    done = true;
    window.clearInterval(timer);
    if (bar) bar.style.transform = 'scaleX(1)';
    overlay.classList.add('is-gone');
    document.documentElement.classList.remove('intro-open');
    window.setTimeout(() => overlay.remove(), 700);
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  overlay.querySelector('.intro__skip')?.addEventListener('click', finish);

  const ready = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    }),
    new Promise<void>((resolve) => window.setTimeout(resolve, 650)),
  ]);

  void ready.then(() => window.setTimeout(finish, 220));
  window.setTimeout(finish, 3000);
}
