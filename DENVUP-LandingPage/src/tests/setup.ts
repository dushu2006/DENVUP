/* jsdom gaps that the site relies on. Keep this list honest: if a test needs
   more browser than this, it belongs in the manual report, not here. */

import { vi } from 'vitest';

const listeners = new WeakMap<MediaQueryList, Set<(e: MediaQueryListEvent) => void>>();

function matches(query: string): boolean {
  return query.includes('prefers-reduced-motion') ? false : false;
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => {
    const set = new Set<(e: MediaQueryListEvent) => void>();
    const mql = {
      matches: matches(query),
      media: query,
      onchange: null,
      addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => set.add(fn),
      removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => set.delete(fn),
      addListener: (fn: (e: MediaQueryListEvent) => void) => set.add(fn),
      removeListener: (fn: (e: MediaQueryListEvent) => void) => set.delete(fn),
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
    listeners.set(mql, set);
    return mql;
  },
});

class StubObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] {
    return [];
  }
}

Object.defineProperty(globalThis, 'IntersectionObserver', { writable: true, value: StubObserver });
Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, value: StubObserver });


const gradient = { addColorStop() {} };
const fakeContext = new Proxy(
  {
    measureText: () => ({ width: 10 }),
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    putImageData: () => {},
    canvas: null,
  } as Record<string, unknown>,
  {
    get(target, key) {
      if (key in target) return Reflect.get(target, key);
      if (typeof key === 'string' && /^[a-z]/.test(key)) return () => {};
      return undefined;
    },
    set(target, key, value) {
      return Reflect.set(target, key, value);
    },
  },
);

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: (type: string) => (type === '2d' ? fakeContext : null),
});


// Native dialogs exist in jsdom 30, but keep the methods harmless if not.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}

// Element.animate is not implemented; the site treats it as optional.
if (!Element.prototype.animate) {
  Object.defineProperty(Element.prototype, 'animate', {
    writable: true,
    value: () => ({ finished: Promise.resolve(), cancel() {}, onfinish: null }),
  });
}

if (!Element.prototype.scrollIntoView) {
  Object.defineProperty(Element.prototype, 'scrollIntoView', { writable: true, value: () => {} });
}

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
