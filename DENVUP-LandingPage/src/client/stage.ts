import type { LabContext, LabMode } from '../labs/types';
import { totalLabModes } from '../labs/registry';
import { announce, uiSound } from './env';

/** Lab markup is written once but can be mounted in several places; duplicate
 *  ids would break label association, so each mount gets a unique suffix. */
function uniquifyIds(root: HTMLElement): void {
  const suffix = `-${Math.random().toString(36).slice(2, 7)}`;
  const map = new Map<string, string>();
  root.querySelectorAll<HTMLElement>('[id]').forEach((el) => {
    const next = `${el.id}${suffix}`;
    map.set(el.id, next);
    el.id = next;
  });
  root.querySelectorAll<HTMLElement>('[for],[aria-labelledby],[aria-describedby],[aria-controls]').forEach((el) => {
    for (const attr of ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls']) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      const parts = value.split(/\s+/).map((part) => map.get(part) ?? part);
      el.setAttribute(attr, parts.join(' '));
    }
  });
}


export interface StageOptions {
  reduced: boolean;
  touch: boolean;
  onStatus?: (message: string) => void;
}

export interface MountedStage {
  destroy: () => void;
  replay: () => void;
  mode: LabMode;
}

/**
 * Mounts one lab mode into a stage element. All timers, observers and RAF
 * loops registered through the context are torn down on destroy/replay.
 */
export function mountStage(stage: HTMLElement, mode: LabMode, opts: StageOptions): MountedStage {
  let mounted: MountedStage | null = null;

  const build = (): MountedStage => {
    const cleanups: (() => void)[] = [];
    const rafs = new Set<(time: number, delta: number) => void>();
    const timers = new Set<number>();
    let frame = 0;
    let last = performance.now();
    let stopped = false;

    stage.innerHTML = '';
    stage.dataset.mode = mode.name;
    stage.classList.toggle('is-tall', mode.size === 'tall');
    stage.classList.remove('is-preview');

    // The chart demo reads real registry numbers instead of hard-coded copy.
    const probe = document.createElement('div');
    probe.innerHTML = mode.html;
    const fragment = document.createDocumentFragment();
    while (probe.firstChild) fragment.append(probe.firstChild);
    stage.append(fragment);
    uniquifyIds(stage);
    stage.querySelectorAll<HTMLElement>('[data-live-demos]').forEach((el) => {
      el.dataset.liveDemos = String(totalLabModes);
    });

    const tick = (now: number) => {
      if (stopped) return;
      const delta = Math.min(64, now - last);
      last = now;
      if (!document.hidden) {
        for (const fn of rafs) {
          try {
            fn(now, delta);
          } catch (error) {
            console.error('[lab] frame', error);
          }
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const ctx: LabContext = {
      stage,
      reduced: opts.reduced,
      touch: opts.touch,
      sound: uiSound,
      onCleanup: (fn) => cleanups.push(fn),
      raf: (fn) => {
        rafs.add(fn);
        if (!frame) {
          last = performance.now();
          frame = requestAnimationFrame(tick);
        }
        return () => rafs.delete(fn);
      },
      timeout: (fn, ms) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          fn();
        }, ms);
        timers.add(id);
      },
      replay: () => mounted?.replay(),
      announce: (message) => {
        if (opts.onStatus) opts.onStatus(message);
        else announce(message);
      },
    };

    if (mode.init) {
      try {
        const result = mode.init(ctx);
        if (typeof result === 'function') cleanups.push(result);
      } catch (error) {
        console.error('[lab] init failed', mode.name, error);
        const fallback = document.createElement('p');
        fallback.className = 'd-fallback__state';
        fallback.textContent = 'This demo could not start in your browser. The description beside it still explains the technique.';
        stage.append(fallback);
      }
    }

    const destroy = () => {
      stopped = true;
      cancelAnimationFrame(frame);
      frame = 0;
      rafs.clear();
      for (const id of timers) window.clearTimeout(id);
      timers.clear();
      for (const fn of cleanups.reverse()) {
        try {
          fn();
        } catch (error) {
          console.error('[lab] cleanup', error);
        }
      }
      cleanups.length = 0;
      stage.innerHTML = '';
      stage.classList.remove('is-tall', 'is-preview');
      delete stage.dataset.mode;
    };

    mounted = {
      destroy,
      replay: () => {
        destroy();
        mounted = build();
      },
      mode,
    };
    return mounted;
  };

  return build();
}
