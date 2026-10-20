/**
 * Copy to clipboard.
 *
 * The confirmation only appears after the copy actually succeeded. If the
 * Clipboard API is unavailable or permission is refused, the code falls back
 * to selecting the text and says so plainly.
 */

import { $$ } from './dom';
import { confirm } from './feedback';

/*
 * Each copy button owns its own timer, so copying one address does not
 * cancel the cleanup of the one before it.
 */
const timers = new WeakMap<HTMLElement, number>();

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fall through to the manual path */
  }

  try {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * Wire every `[data-copy]` element. Clicking copies the attribute value and
 * reports the result in place.
 */
export function initCopyButtons(): () => void {
  const items = $$<HTMLElement>('[data-copy]');
  if (!items.length) return () => {};

  const onClick = async (event: Event) => {
    const item = event.currentTarget as HTMLElement;
    const value = item.dataset.copy ?? item.textContent?.trim() ?? '';
    if (!value) return;
    event.preventDefault();

    const ok = await copyText(value);
    item.classList.add(ok ? 'is-copied' : 'is-copy-failed');
    item.dataset.copyState = ok ? 'copied' : 'failed';

    /*
     * The label used to be swapped for "Copied" and put back two seconds
     * later — a flicker, not a reading. The confirmation now draws a tick
     * and leaves it there, so a visitor who looks away and looks back can
     * still see that the address was copied.
     */
    confirm(item, ok ? 'Copied' : 'Press Ctrl+C to copy');

    const existing = timers.get(item);
    if (existing) window.clearTimeout(existing);
    const timer = window.setTimeout(() => {
      item.classList.remove('is-copied', 'is-copy-failed');
      delete item.dataset.copyState;
      timers.delete(item);
    }, 2600);
    timers.set(item, timer);
  };

  items.forEach((item) => item.addEventListener('click', onClick));
  return () => {
    items.forEach((item) => {
      const timer = timers.get(item);
      if (timer) window.clearTimeout(timer);
      timers.delete(item);
      item.removeEventListener('click', onClick);
    });
  };
}

export { copyText };
