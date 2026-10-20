/**
 * Exploratory details.
 *
 * These are small, optional discoveries. Every one of them is reachable by
 * keyboard and by tap, none of them intercept navigation, and none of them
 * hide or remove content. The only visible state they change is a colour
 * repaint, and there is always a visible control to leave that state.
 */

import { $, el } from './dom';
import { env } from './env';
import { isMotionPaused, setPageMotion, watchSystemMotion } from './motion-control';

export const PULSE_EVENT = 'denvup:emblem-pulse';
export const TECHNIQUE_EVENT = 'denvup:technique-opened';

const SECRET_WORD = 'denvup';

function buildShortcutGuide(): HTMLElement {
  const dialog = el('div', 'guide');
  dialog.id = 'shortcut-guide';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Keyboard shortcuts');
  dialog.hidden = true;

  const panel = el('div', 'guide__panel');
  const head = el('div', 'guide__head');
  const title = el('h2', 'guide__title');
  title.textContent = 'Keyboard shortcuts';
  const close = el('button', 'guide__close');
  close.type = 'button';
  close.textContent = 'Close';
  close.setAttribute('aria-label', 'Close the shortcut guide');
  head.append(title, close);

  const list = el('dl', 'guide__list');
  const rows: [string, string][] = [
    ['/', 'Open the search palette'],
    ['⌘K / Ctrl K', 'Open the search palette'],
    ['?', 'Open this guide'],
    ['Esc', 'Close whatever is open'],
    ['Tab', 'Move through the interface'],
    ['↑ ↓', 'Move through search results'],
    ['Enter', 'Open the highlighted result'],
  ];
  rows.forEach(([key, description]) => {
    const dt = el('dt');
    const kbd = el('kbd');
    kbd.textContent = key;
    dt.appendChild(kbd);
    const dd = el('dd');
    dd.textContent = description;
    list.append(dt, dd);
  });

  const foot = el('p', 'guide__foot');
  foot.textContent =
    'Every shortcut also exists as an ordinary button, so nothing here is keyboard-only.';

  panel.append(head, list, foot);
  dialog.appendChild(panel);
  return dialog;
}

/**
 * The in-page motion switch.
 *
 * If the operating system already asks for reduced motion the switch is
 * locked and says so, because the page must never override a system
 * preference. Otherwise it pauses and resumes the page's motion.
 */
function buildMotionToggle(): HTMLElement {
  const button = el('button', 'motion-toggle');
  button.type = 'button';
  const dot = el('span', 'motion-toggle__dot');
  dot.setAttribute('aria-hidden', 'true');
  const label = el('span', 'motion-toggle__label');
  button.append(dot, label);

  const paint = (reduced: boolean, locked: boolean) => {
    button.setAttribute('aria-pressed', String(reduced));
    button.disabled = locked;
    label.textContent = locked
      ? 'Motion: reduced by your system'
      : reduced
        ? 'Motion: reduced'
        : 'Motion: full';
    button.setAttribute(
      'aria-label',
      locked
        ? 'Reduced motion is set in your system settings, so it cannot be switched on here.'
        : reduced
          ? 'Motion is reduced on this page. Switch animation back on.'
          : 'Motion is full. Reduce animation on this page.',
    );
    button.title = locked
      ? 'Your system asks for reduced motion, so this stays on.'
      : 'Pause or resume the animation on this page.';
  };

  paint(env.reducedMotion, env.systemReducedMotion);
  button.addEventListener('click', () => {
    setPageMotion(!isMotionPaused(), true);
  });

  return button;
}

export interface EasterResult {
  /** True when the visitor found the secret word. */
  secret: boolean;
  /** How many techniques were opened. */
  opened: number;
}

/**
 * Wire the exploratory details. Returns a teardown.
 */
export function initEasterEggs(): () => void {
  const cleanups: (() => void)[] = [];
  let buffer = '';

  const guide = buildShortcutGuide();
  document.body.appendChild(guide);
  cleanups.push(() => guide.remove());

  const closeGuide = () => {
    guide.hidden = true;
    document.body.classList.remove('is-locked');
  };
  guide.querySelector('.guide__close')?.addEventListener('click', closeGuide);
  guide.addEventListener('click', (event) => {
    if (event.target === guide) closeGuide();
  });

  const openGuide = () => {
    guide.hidden = false;
    document.body.classList.add('is-locked');
    (guide.querySelector('.guide__close') as HTMLButtonElement | null)?.focus();
  };

  const motionToggle = buildMotionToggle() as HTMLButtonElement;
  document.body.appendChild(motionToggle);
  cleanups.push(() => motionToggle.remove());

  // Keep the switch in step with the operating system setting.
  cleanups.push(
    watchSystemMotion(({ reduced, locked }) => {
      const dot = motionToggle.querySelector('.motion-toggle__dot');
      motionToggle.setAttribute('aria-pressed', String(reduced));
      motionToggle.disabled = locked;
      const label = motionToggle.querySelector('.motion-toggle__label');
      if (label) {
        label.textContent = locked
          ? 'Motion: reduced by your system'
          : reduced
            ? 'Motion: reduced'
            : 'Motion: full';
      }
      if (dot) dot.setAttribute('data-state', reduced ? 'off' : 'on');
    }),
  );

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const typing =
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable);
    if (typing) return;

    if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      if (guide.hidden) openGuide();
      else closeGuide();
      return;
    }

    if (event.key === 'Escape' && !guide.hidden) {
      closeGuide();
      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey) return;

    buffer = (buffer + event.key.toLowerCase()).slice(-SECRET_WORD.length);
    if (buffer === SECRET_WORD) {
      buffer = '';
      document.documentElement.classList.add('is-secret');
      window.dispatchEvent(new CustomEvent(PULSE_EVENT));
      const exit = document.querySelector<HTMLElement>('[data-secret-exit]');
      if (exit) {
        exit.hidden = false;
        exit.focus();
      }
    }
  };

  window.addEventListener('keydown', onKeyDown);
  cleanups.push(() => window.removeEventListener('keydown', onKeyDown));

  // The visible way out of secret mode (encyclopedia 405).
  const secretExit = el('button', 'secret-exit');
  secretExit.type = 'button';
  secretExit.dataset.secretExit = '';
  secretExit.hidden = true;
  secretExit.textContent = 'Leave secret mode';
  secretExit.addEventListener('click', () => {
    document.documentElement.classList.remove('is-secret');
    secretExit.hidden = true;
  });
  document.body.appendChild(secretExit);
  cleanups.push(() => secretExit.remove());

  let opened = 0;
  const onTechnique = () => {
    opened += 1;
    if (opened === 5) {
      const note = el('p', 'easter-note');
      note.setAttribute('role', 'status');
      note.textContent =
        'You have opened five techniques. There are 480 in the catalogue — this one only lists what we built.';
      const library = $('#library');
      library?.querySelector('.library__head')?.appendChild(note);
    }
  };
  window.addEventListener(TECHNIQUE_EVENT, onTechnique);
  cleanups.push(() => window.removeEventListener(TECHNIQUE_EVENT, onTechnique));

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

/** Called by the library when a technique panel is opened. */
export function noteTechniqueOpened(id: number): void {
  window.dispatchEvent(new CustomEvent(TECHNIQUE_EVENT, { detail: { id } }));
}
