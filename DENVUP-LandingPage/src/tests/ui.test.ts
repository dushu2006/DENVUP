import { beforeEach, describe, expect, it, vi } from 'vitest';
import { railTravel } from '../client/motion';
import { renderCapabilities } from '../render/sections';

const destroy = vi.fn();
const mountEmbed = vi.fn<(...args: unknown[]) => () => void>(() => destroy);
vi.mock('../client/labs', () => ({ mountEmbed: (...args: unknown[]) => mountEmbed(...args) }));

import { initCapabilities } from '../client/caps';

describe('capability stage', () => {
  beforeEach(() => {
    document.body.innerHTML = renderCapabilities();
    mountEmbed.mockClear();
    destroy.mockClear();
    initCapabilities();
  });

  it('mounts only the first demo and swaps cleanly on click', () => {
    expect(mountEmbed).toHaveBeenCalledTimes(1);
    const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-cap-tab]')];
    const panels = [...document.querySelectorAll<HTMLElement>('[data-cap-panel]')];
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(panels.filter((p) => !p.hidden)).toHaveLength(1);

    tabs[4]?.click();
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(mountEmbed).toHaveBeenLastCalledWith(expect.any(HTMLElement), 'scroll', 1, 'Scroll storytelling');
    expect(panels[4]?.hidden).toBe(false);
    expect(panels[0]?.hidden).toBe(true);
    expect(tabs[4]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs[4]?.tabIndex).toBe(0);
    expect(document.querySelector('[data-cap-count]')?.textContent).toBe('05');
  });

  it('moves through the tabs with the arrow keys', () => {
    const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-cap-tab]')];
    tabs[0]?.focus();
    tabs[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
    tabs[1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabs[8]?.getAttribute('aria-selected')).toBe('true');
  });
});

describe('horizontal rail travel', () => {
  it('uses the rail column, not the pin, when the rail is narrower', () => {
    // 1366px pin, 956px rail column, six 355px cards.
    expect(railTravel({ scrollWidth: 2200, railLeft: 300, railWidth: 956, lastRight: 2500, pinWidth: 1366 })).toBe(
      2500 - 300 - 956 + 48,
    );
  });

  it('uses the pin width for a full-bleed track', () => {
    expect(railTravel({ scrollWidth: 3000, railLeft: 0, railWidth: 3000, lastRight: 3000, pinWidth: 1366 })).toBe(
      3000 - 1366 + 48,
    );
  });

  it('never returns a negative distance', () => {
    expect(railTravel({ scrollWidth: 800, railLeft: 0, railWidth: 800, lastRight: 800, pinWidth: 1366 })).toBe(48);
  });
});
