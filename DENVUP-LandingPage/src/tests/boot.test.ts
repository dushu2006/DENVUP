import { describe, expect, it, vi } from 'vitest';
import { renderPage } from '../render/page';

/**
 * Boots the real prerendered document through every client module.
 * This is the closest substitute available for a browser smoke test:
 * it catches null lookups and thrown initialisers after markup changes.
 */
describe('whole-page boot', () => {
  it('initialises the client without console errors', async () => {
    const parsed = new DOMParser().parseFromString(renderPage(), 'text/html');
    document.head.innerHTML = parsed.head.innerHTML.replace(/<script[\s\S]*?<\/script>/g, '');
    document.body.innerHTML = parsed.body.innerHTML.replace(/<script[\s\S]*?<\/script>/g, '');
    document.documentElement.className = 'js';

    // jsdom has no layout: give each chapter a 900px band so the header
    // selector is exercised with a realistic sequence instead of zero rects.
    let scroll = 0;
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scroll });
    let index = 0;
    document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((section) => {
      const base = index * 900;
      index += 1;
      Object.defineProperty(section, 'offsetTop', { configurable: true, get: () => base });
      Object.defineProperty(section, 'offsetHeight', { configurable: true, get: () => 900 });
      section.getBoundingClientRect = () => {
        const top = base - scroll;
        return {
          top,
          bottom: top + 900,
          left: 0,
          right: 1366,
          width: 1366,
          height: 900,
          x: 0,
          y: top,
          toJSON: () => ({}),
        } as DOMRect;
      };
    });

    const errors: unknown[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args);
    });

    await import('../main');
    await new Promise((resolve) => window.setTimeout(resolve, 30));

    spy.mockRestore();

    expect(errors).toEqual([]);
    // The header's ground now follows the stage, which sets data-scene on <html>.
    expect(document.documentElement.dataset.scene).toBe('paper');
    expect(document.querySelector('[data-head]')?.hasAttribute('data-head')).toBe(true);
    expect(document.querySelectorAll('[data-cap-demo][data-embed]')).toHaveLength(1);
    expect(document.querySelector('#site-menu')?.tagName).toBe('DIALOG');
    expect(document.querySelector('[data-progress]')).not.toBeNull();

    const root = document.documentElement;
    scroll = 900;
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => window.setTimeout(resolve, 140));
    expect(root.dataset.scene).toBe('orange');

    scroll = 1800;
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => window.setTimeout(resolve, 140));
    expect(root.dataset.scene).toBe('ink');
  });
});
