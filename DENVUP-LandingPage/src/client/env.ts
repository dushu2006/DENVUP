/** Shared browser helpers. Kept dependency-free and defensive. */

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] =>
  [...root.querySelectorAll<T>(sel)];

export const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');

export const prefersReduced = (): boolean => reducedQuery.matches;
export const isTouch = (): boolean => touchQuery.matches;

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));

let toastTimer = 0;

export function toast(message: string, ms = 3800): void {
  const el = $('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), ms);
}

export function announce(message: string): void {
  const live = $('[data-lab-status]');
  if (live) live.textContent = message;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function on<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  fn: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function on<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  fn: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  fn: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function on(
  target: EventTarget,
  type: string,
  fn: (event: Event) => void,
  options?: AddEventListenerOptions,
): () => void {
  target.addEventListener(type, fn, options);
  return () => target.removeEventListener(type, fn, options);
}

/** One shared sound source, created only after the reader opts in. */
let audio: AudioContext | null = null;

export function soundOn(): boolean {
  return document.documentElement.dataset.sound === 'on';
}

export function setSound(on: boolean): void {
  document.documentElement.dataset.sound = on ? 'on' : 'off';
  try {
    localStorage.setItem('denvup-sound', on ? 'on' : 'off');
  } catch {
    /* storage can be unavailable; the session still works */
  }
}

export function storedSound(): boolean {
  try {
    return localStorage.getItem('denvup-sound') === 'on';
  } catch {
    return false;
  }
}

export function uiSound(kind: 'tick' | 'pop' | 'chime'): void {
  if (!soundOn()) return;
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    const freq = kind === 'tick' ? 880 : kind === 'pop' ? 520 : 660;
    osc.type = kind === 'chime' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    if (kind === 'pop') osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'chime' ? 0.5 : 0.14));
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + (kind === 'chime' ? 0.55 : 0.18));
  } catch {
    /* audio is a garnish; never let it break interaction */
  }
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer = 0;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), ms);
  };
}

export function throttle<T extends (...args: never[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let last = 0;
  let queued = 0;
  return (...args: Parameters<T>) => {
    const now = performance.now();
    const wait = Math.max(0, ms - (now - last));
    window.clearTimeout(queued);
    queued = window.setTimeout(() => {
      last = performance.now();
      fn(...args);
    }, wait);
  };
}

export function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}
