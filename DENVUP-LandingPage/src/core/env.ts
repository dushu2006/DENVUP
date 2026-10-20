/**
 * Motion state for the whole page.
 *
 * Two things can reduce motion: the operating system preference and the
 * in-page switch. The system preference always wins — a visitor who asked
 * their OS for less motion can never be overridden by the page — but the
 * in-page switch can pause motion on a system that asked for none.
 *
 * Everything that animates asks {@link env.reducedMotion} rather than
 * re-reading the media query, so there is a single source of truth.
 */

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarseQuery = window.matchMedia('(pointer: coarse)');
const narrowQuery = window.matchMedia('(max-width: 767px)');

/** Set when the visitor uses the in-page switch. `null` means "follow the OS". */
let manualPaused = false;

export const env = {
  /** True when the operating system asks for reduced motion. */
  get systemReducedMotion(): boolean {
    return motionQuery.matches;
  },
  /** True when motion should be reduced, for any reason. */
  get reducedMotion(): boolean {
    return motionQuery.matches || manualPaused;
  },
  /** True when the visitor used the in-page switch to pause motion. */
  get manuallyPaused(): boolean {
    return manualPaused;
  },
  get coarsePointer(): boolean {
    return coarseQuery.matches;
  },
  get narrow(): boolean {
    return narrowQuery.matches;
  },
  /** Wide enough for the full motion language. */
  get capable(): boolean {
    return !this.reducedMotion && window.innerWidth >= 768;
  },
  /** How many particles / heavy loops we are allowed to run. */
  get budget(): 'low' | 'mid' | 'high' {
    if (this.reducedMotion) return 'low';
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    if (cores <= 4 || mem <= 4) return 'mid';
    return 'high';
  },
  get webgl(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(
        window.WebGL2RenderingContext && canvas.getContext('webgl2'),
      );
    } catch {
      return false;
    }
  },
};

/**
 * Pause or resume motion for the in-page switch.
 *
 * The system preference is never undone by this call — it can only add a
 * pause on top of it.
 */
export function setMotionPaused(paused: boolean): void {
  manualPaused = paused;
}

export function onMotionPreferenceChange(fn: (reduced: boolean) => void): void {
  const handler = () => fn(motionQuery.matches);
  motionQuery.addEventListener('change', handler);
  /*
   * Report the current value as well as future changes. A visitor whose
   * operating system already asks for less motion must not have to change
   * the preference for the page to notice it.
   */
  fn(motionQuery.matches);
}
