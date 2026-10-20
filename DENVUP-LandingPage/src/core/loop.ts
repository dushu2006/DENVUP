/**
 * A shared, disposable render loop.
 *
 * Canvas demos all need the same three things: a requestAnimationFrame loop
 * that pauses when the element is off screen or the tab is hidden, a device
 * budget that scales the work down, and a teardown that releases everything.
 */

import { env } from './env';
import { on } from './dom';
import { MOTION_EVENT, type MotionEventDetail } from './motion-control';

export interface LoopOptions {
  /** Called once per frame with the elapsed time in seconds. */
  draw: (dt: number, time: number) => void;
  /** Optional per-frame callback that runs before the draw. */
  update?: (dt: number, time: number) => void;
  /** Target frames per second. Lowered automatically on low-budget devices. */
  fps?: number;
  /** Pause when the element scrolls out of view. */
  observe?: Element | null;
}

export interface LoopHandle {
  stop: () => void;
  /** Stop the loop and release every listener it registered. */
  destroy: () => void;
  readonly running: boolean;
}

export function createLoop(options: LoopOptions): LoopHandle {
  const fps = Math.min(options.fps ?? 60, env.budget === 'low' ? 30 : 60);
  const minDelta = 1 / fps;
  let raf = 0;
  let last = 0;
  let running = false;
  let visible = true;

  const frame = (time: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    /*
     * The first frame only establishes the time baseline. Without it `last`
     * stays 0, `dt` stays 0, and the frame-rate guard below rejects every
     * frame forever — the loop would spin without ever drawing.
     */
    if (!last) {
      last = time;
      return;
    }
    const dt = Math.min((time - last) / 1000, 0.05);
    last = time;
    if (dt < minDelta) return;
    options.update?.(dt, time / 1000);
    options.draw(dt, time / 1000);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (visible) start();
  };

  document.addEventListener('visibilitychange', onVisibility);

  // The in-page motion switch stops the loop. The last frame stays on screen
  // so the panel never goes blank.
  const onMotion = (event: Event) => {
    const detail = (event as CustomEvent<MotionEventDetail>).detail;
    if (detail?.reduced) {
      stop();
    } else if (visible && !document.hidden) {
      start();
    }
  };
  window.addEventListener(MOTION_EVENT, onMotion);

  let observer: IntersectionObserver | null = null;
  if (options.observe) {
    observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    observer.observe(options.observe);
  }

  if (!env.reducedMotion) start();

  return {
    stop,
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener(MOTION_EVENT, onMotion);
      observer?.disconnect();
    },
    get running() {
      return running;
    },
  };
}

/**
 * Measure a canvas's CSS box.
 *
 * Returns the size in CSS pixels, or null when the canvas has no box yet
 * (it is `display: none`, or not yet laid out).
 */
export function measureCanvas(canvas: HTMLCanvasElement): { width: number; height: number } | null {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  return { width: rect.width, height: rect.height };
}

/** Size a canvas to its CSS box at device pixel ratio. Returns the context. */
export function fitCanvas(
  canvas: HTMLCanvasElement,
  maxDpr = 2,
): { ctx: CanvasRenderingContext2D; width: number; height: number } | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const size = measureCanvas(canvas);
  if (!size) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = Math.max(1, Math.round(size.width * dpr));
  const height = Math.max(1, Math.round(size.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: size.width, height: size.height };
}

/**
 * Size a WebGL drawing buffer to its CSS box.
 *
 * A canvas can only ever carry one context type, so asking a canvas that
 * already has a WebGL context for a 2D context returns `null` — which means
 * the WebGL demos cannot use `fitCanvas`. This helper resizes the drawing
 * buffer instead and reports its size in device pixels, which is the space
 * `gl.viewport` and `gl_FragCoord` work in.
 */
export function fitDrawingBuffer(
  canvas: HTMLCanvasElement,
  maxDpr = 2,
): { width: number; height: number } | null {
  const size = measureCanvas(canvas);
  if (!size) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = Math.max(1, Math.round(size.width * dpr));
  const height = Math.max(1, Math.round(size.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height };
}

/** Register a teardown function. */
export function disposer(): { add: (fn: () => void) => void; run: () => void } {
  const fns: (() => void)[] = [];
  return {
    add: (fn) => fns.push(fn),
    run: () => {
      fns.forEach((fn) => {
        try {
          fn();
        } catch {
          /* teardown must never throw */
        }
      });
      fns.length = 0;
    },
  };
}

export { on };
