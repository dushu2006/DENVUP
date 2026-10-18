import { chapters } from '../content/site';
import { labEntries } from '../labs/registry';
import { icon } from '../render/html';
import {
  $,
  $$,
  clamp,
  copyText,
  on,
  prefersReduced,
  setSound,
  soundOn,
  storedSound,
  throttle,
  toast,
  uiSound,
} from './env';

/* ------------------------------------------------------------------- header */

function initHeader(): void {
  const head = $<HTMLElement>('[data-head]');
  const progress = $<HTMLElement>('[data-progress]');
  const bar = $<HTMLElement>('[data-progress-bar]');
  const sections = $$<HTMLElement>('[data-chapter]');
  const links = $$<HTMLAnchorElement>('[data-chapter-link]');
  if (!head) return;

  let lastY = window.scrollY;
  let hidden = false;

  const update = throttle(() => {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = clamp(y / max);
    if (bar) bar.style.transform = `scaleX(${p})`;
    progress?.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    head.classList.toggle('is-pinned', y > 24);

    if (!hidden && y > 240 && y > lastY + 6 && !head.contains(document.activeElement)) {
      head.classList.add('is-hidden');
      hidden = true;
    } else if (hidden && (y < lastY - 4 || y < 200)) {
      head.classList.remove('is-hidden');
      hidden = false;
    }
    lastY = y;
  }, 16);

  on(window, 'scroll', update, { passive: true });
  update();

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const el = visible.target as HTMLElement;
      const theme = el.dataset.theme;
      if (theme) head.dataset.theme = theme;
      const id = el.dataset.chapter;
      links.forEach((link) => {
        const active = link.dataset.chapterLink === id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-42% 0px -52% 0px', threshold: [0, 0.2, 0.6] },
  );
  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------------ dialogs */

function openDialog(dialog: HTMLDialogElement | null, trigger?: HTMLElement | null): void {
  if (!dialog) return;
  if (dialog.open) return;
  dialog.showModal();
  trigger?.setAttribute('aria-expanded', 'true');
  dialog.addEventListener(
    'close',
    () => {
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.focus({ preventScroll: true });
    },
    { once: true },
  );
}

function initDialogs(): void {
  const byId = (id: string): HTMLDialogElement | null => document.getElementById(id) as HTMLDialogElement | null;
  const menu = byId('site-menu');
  const command = byId('command-dialog');
  const profile = byId('profile-dialog');
  const shortcuts = byId('shortcuts-dialog');
  const a11y = byId('a11y-dialog');
  const privacy = byId('privacy-dialog');
  const foxNote = byId('fox-dialog');
  const menuToggle = $<HTMLButtonElement>('[data-open-menu]');

  $$<HTMLElement>('[data-dialog-close]').forEach((btn) =>
    btn.addEventListener('click', () => (btn.closest('dialog') as HTMLDialogElement | null)?.close()),
  );

  [menu, command, profile, shortcuts, a11y, privacy, foxNote].forEach((dialog) => {
    if (!dialog) return;
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  $<HTMLElement>('[data-open-menu]')?.addEventListener('click', () => openDialog(menu, menuToggle));
  $<HTMLElement>('[data-menu-close]')?.addEventListener('click', () => menu?.close());
  $$<HTMLElement>('[data-menu-link]').forEach((link) => link.addEventListener('click', () => menu?.close()));
  $<HTMLElement>('[data-open-shortcuts]')?.addEventListener('click', () => openDialog(shortcuts));
  $<HTMLElement>('[data-open-a11y]')?.addEventListener('click', () => openDialog(a11y));
  $<HTMLElement>('[data-open-privacy]')?.addEventListener('click', () => openDialog(privacy));
  $<HTMLElement>('[data-open-fox]')?.addEventListener('click', () => openDialog(foxNote));

  menu?.addEventListener('close', () => menuToggle?.setAttribute('aria-expanded', 'false'));

  // Team profiles: clone the hidden template, then name the dialog after it.
  const profileBody = $<HTMLElement>('[data-profile-body]');
  $$<HTMLElement>('[data-person-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.personOpen ?? '0';
      const template = document.querySelector<HTMLTemplateElement>(`[data-person-template="${index}"]`);
      if (!profile || !profileBody || !template) return;
      profileBody.replaceChildren(template.content.cloneNode(true));
      profile.setAttribute('aria-labelledby', `profile-name-${index}`);
      openDialog(profile);
      profileBody.querySelector<HTMLElement>('[data-close-dialog]')?.addEventListener('click', () => profile.close());
    });
  });

  initCommand(byId('command-dialog'));
}

function initCommand(command: HTMLDialogElement | null): void {
  if (!command) return;
  const input = $<HTMLInputElement>('#cmd-input', command);
  const list = $<HTMLElement>('[data-cmd-list]', command);
  const trigger = $<HTMLElement>('[data-open-command]');
  if (!input || !list) return;

  interface Item {
    label: string;
    hint: string;
    href?: string;
    run?: () => void;
  }

  const items: Item[] = [
    ...chapters.map((c) => ({ label: c.label, hint: `Section ${c.short}`, href: `#${c.id}` })),
    ...labEntries.map((entry) => ({
      label: entry.mode.name,
      hint: `${entry.lab.title} · ${entry.mode.ids.map((id) => `#${id}`).join(' ')}`,
      run: () => {
        const shell = $(`[data-lab-shell="${entry.lab.slug}"]`);
        shell?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
        const btn = $$<HTMLButtonElement>(`[data-lab-shell="${entry.lab.slug}"] .mode-btn`)[entry.index];
        btn?.click();
      },
    })),
  ];

  let filtered = items;
  let selected = 0;

  const close = () => command.close();

  const choose = (item: Item | undefined) => {
    if (!item) return;
    close();
    if (item.href) {
      window.location.hash = item.href;
    } else item.run?.();
  };

  const render = () => {
    list.replaceChildren();
    const q = input.value.trim().toLowerCase();
    filtered = items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(q)).slice(0, 50);
    selected = Math.min(selected, Math.max(0, filtered.length - 1));
    if (!filtered.length) {
      const li = document.createElement('li');
      li.className = 'cmd__empty';
      li.textContent = 'No destination matches. Try “pricing”, “cursor” or an ID such as 174.';
      list.append(li);
      input.removeAttribute('aria-activedescendant');
      return;
    }
    filtered.forEach((item, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `cmd-opt-${i}`;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', String(i === selected));
      btn.tabIndex = -1;
      const label = document.createElement('span');
      label.textContent = item.label;
      const hint = document.createElement('small');
      hint.textContent = item.hint;
      btn.append(label, hint);
      btn.addEventListener('click', () => choose(item));
      li.append(btn);
      list.append(li);
    });
    const active = filtered[selected];
    if (active) input.setAttribute('aria-activedescendant', `cmd-opt-${selected}`);
  };

  const move = (dir: number) => {
    if (!filtered.length) return;
    selected = (selected + dir + filtered.length) % filtered.length;
    $$<HTMLElement>('[role="option"]', list).forEach((el, i) => el.setAttribute('aria-selected', String(i === selected)));
    $(`#cmd-opt-${selected}`)?.scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', `cmd-opt-${selected}`);
  };

  input.addEventListener('input', () => {
    selected = 0;
    render();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(filtered[selected]);
    }
  });

  const show = () => {
    input.value = '';
    selected = 0;
    render();
    openDialog(command, trigger);
    window.setTimeout(() => input.focus(), 30);
  };

  trigger?.addEventListener('click', show);
  command.addEventListener('close', () => {
    trigger?.setAttribute('aria-expanded', 'false');
  });
}

/* -------------------------------------------------------------- shortcuts */

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

function initKeys(): void {
  on(document, 'keydown', (event) => {
    if (isTyping(event.target)) return;
    const meta = event.metaKey || event.ctrlKey;
    if (meta && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      $<HTMLElement>('[data-open-command]')?.click();
      return;
    }
    if (meta || event.altKey) return;
    if (event.key === '?') {
      event.preventDefault();
      $<HTMLElement>('[data-open-shortcuts]')?.click();
    } else if (event.key.toLowerCase() === 'f') {
      runFox();
    } else if (event.key.toLowerCase() === 'm') {
      $<HTMLElement>('[data-open-menu]')?.click();
    }
  });
}

function runFox(): void {
  if (prefersReduced()) {
    toast('The fox stays still when reduced motion is requested.');
    return;
  }
  const fox = $<HTMLElement>('[data-fox]');
  if (!fox) return;
  fox.classList.remove('is-running');
  void fox.offsetWidth;
  fox.classList.add('is-running');
  window.setTimeout(() => fox.classList.remove('is-running'), 3600);
}

/* ------------------------------------------------------------------ footer */

function initFooter(): void {
  const soundBtn = $<HTMLButtonElement>('[data-sound-toggle]');
  const soundLabel = $<HTMLElement>('[data-sound-label]');

  const paintSound = () => {
    const on = soundOn();
    if (soundBtn) {
      soundBtn.setAttribute('aria-pressed', String(on));
      soundBtn.innerHTML = `${icon(on ? 'sound-on' : 'sound-off')}<span data-sound-label>${on ? 'Sound on' : 'Sound off'}</span>`;
    }
    if (soundLabel) soundLabel.textContent = on ? 'Sound on' : 'Sound off';
  };

  setSound(storedSound());
  paintSound();

  soundBtn?.addEventListener('click', () => {
    const next = !soundOn();
    setSound(next);
    paintSound();
    if (next) uiSound('chime');
    toast(next ? 'Sound cues on. They only play after a click, and never autoplay.' : 'Sound off.');
  });

  const clock = $<HTMLElement>('[data-clock]');
  if (clock) {
    const tick = () => {
      try {
        clock.textContent = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
      } catch {
        clock.textContent = 'IST';
      }
    };
    tick();
    window.setInterval(tick, 30_000);
  }

  $<HTMLElement>('[data-year]')?.replaceChildren(String(new Date().getFullYear()));

  const marquee = $<HTMLElement>('[data-marquee]');
  const pause = $<HTMLButtonElement>('[data-marquee-pause]');
  pause?.addEventListener('click', () => {
    const paused = marquee?.classList.toggle('is-paused') ?? false;
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Play moving text' : 'Pause moving text');
    pause.innerHTML = icon(paused ? 'play' : 'pause');
    toast(paused ? 'Marquee paused.' : 'Marquee playing.');
  });

  $<HTMLElement>('[data-to-top]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
    $<HTMLElement>('#top')?.focus({ preventScroll: true });
  });

  $$<HTMLElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy ?? '';
      const ok = await copyText(value);
      toast(ok ? `Copied ${value}` : `Copy failed — the address is ${value}`);
      if (ok) uiSound('tick');
    });
  });

  $<HTMLElement>('[data-open-fox]')?.addEventListener('click', runFox);
  $<HTMLElement>('[data-skip-intro]')?.addEventListener('click', (event) => {
    event.preventDefault();
    $<HTMLElement>('#hero')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
  });
}

export function initNavigation(): void {
  initHeader();
  initDialogs();
  initKeys();
  initFooter();
}
