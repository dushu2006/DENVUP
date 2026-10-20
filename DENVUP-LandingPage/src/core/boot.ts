/**
 * The boot sequence.
 *
 * The progress bar is bound to real work: the web fonts and the images the
 * first screen needs. It never simulates completion. The intro can be skipped
 * at any point, and it only plays once per visit (sessionStorage), so a
 * returning visitor is never held behind an animation they have already seen.
 */

import { $ } from './dom';
import { env } from './env';
import { gsap } from './motion';

const WELCOME_KEY = 'denvup.welcomed';

export interface BootResult {
  /** True when the intro actually played (rather than being skipped). */
  played: boolean;
  /** How long the visitor waited, in milliseconds. */
  duration: number;
}

/**
 * The images the intro should wait for.
 *
 * Only images the browser has already been asked to fetch. A lazy image
 * below the fold has not started loading and will not until the visitor
 * scrolls, so waiting for it would hold the intro open until the failsafe
 * fired — the page would sit behind a curtain that had nothing to do with
 * the first screen.
 */
function pendingImages(): HTMLImageElement[] {
  return Array.from(document.images).filter((img) => !img.complete && img.loading !== 'lazy');
}

function countAssets(): { total: number; loaded: number } {
  const images = pendingImages();
  return { total: images.length, loaded: 0 };
}

function waitForImages(): Promise<void> {
  const images = pendingImages();
  if (!images.length) return Promise.resolve();
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}

/**
 * Run the boot sequence. Resolves once the page is released.
 */
export function runBoot(): Promise<BootResult> {
  const boot = $<HTMLElement>('#boot');
  const bar = $<HTMLElement>('#boot-bar');
  const count = $<HTMLElement>('#boot-count');
  const skip = $<HTMLButtonElement>('#boot-skip');
  const started = performance.now();

  if (!boot) {
    document.documentElement.classList.add('is-booted');
    return Promise.resolve({ played: false, duration: 0 });
  }

  const seen = sessionStorage.getItem(WELCOME_KEY) === '1';
  const shouldPlay = !seen && !env.reducedMotion;

  const setProgress = (value: number) => {
    const pct = Math.max(0, Math.min(1, value));
    bar?.style.setProperty('transform', `scaleX(${pct})`);
    if (count) count.textContent = String(Math.round(pct * 100)).padStart(3, '0');
  };

  if (!shouldPlay) {
    // Reduced motion or a returning visit: release the page immediately.
    boot.setAttribute('data-boot', 'skipped');
    setProgress(1);
    window.setTimeout(() => {
      boot.remove();
      document.documentElement.classList.add('is-booted');
    }, 30);
    sessionStorage.setItem(WELCOME_KEY, '1');
    return Promise.resolve({ played: false, duration: performance.now() - started });
  }

  // Real work: fonts + first-screen images.
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const assets = waitForImages();
  let fontDone = false;
  let assetDone = false;
  let resolved = false;

  const update = () => {
    const value = (fontDone ? 0.55 : 0) + (assetDone ? 0.45 : 0);
    setProgress(value);
  };

  const finish = (played: boolean): number => {
    if (resolved) return 0;
    resolved = true;
    setProgress(1);
    sessionStorage.setItem(WELCOME_KEY, '1');
    const duration = performance.now() - started;

    const release = () => {
      document.documentElement.classList.add('is-booted');
      boot.remove();
    };

    if (env.reducedMotion) {
      release();
    } else {
      gsap.to(boot, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.9,
        ease: 'expo.inOut',
        onComplete: release,
      });
    }
    /*
     * Backstop: the exit above is a tween, and a tween only completes while
     * the ticker is running. If anything stalls the animation loop the intro
     * would never lift and the visitor would be locked behind it — so the
     * release is also scheduled as plain time, independently of the ticker.
     */
    window.setTimeout(release, 1600);
    if (played) boot.setAttribute('data-boot', 'played');
    return duration;
  };

  let resolveOuter: (result: BootResult) => void = () => {};
  const promise = new Promise<BootResult>((resolve) => {
    resolveOuter = resolve;
  });

  const complete = (played: boolean) => {
    const duration = finish(played);
    resolveOuter({ played, duration });
  };

  skip?.addEventListener(
    'click',
    () => {
      complete(false);
    },
    { once: true },
  );

  void fonts.then(() => {
    fontDone = true;
    update();
    // Fonts are the gate for the body reveal (encyclopedia 18).
    document.documentElement.classList.add('fonts-ready');
  });

  void assets.then(() => {
    assetDone = true;
    update();
  });

  // Never hold the page hostage: release after 4s at the latest.
  const failsafe = window.setTimeout(() => {
    complete(true);
  }, 4000);

  void Promise.all([fonts, assets]).then(() => {
    window.clearTimeout(failsafe);
    window.setTimeout(() => complete(true), 220);
  });

  return promise;
}

/** Progress helper used by the boot demo in the library. */
export function bootProgressSnapshot(): { total: number; loaded: number } {
  return countAssets();
}
