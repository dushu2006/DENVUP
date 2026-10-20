import type { Lab } from './types';

export const navigationLab: Lab = {
  slug: 'navigation',
  title: 'Navigation & transitions',
  blurb:
    'Navigation is a promise about where things are. These demos keep the promise with native controls, real focus handling and a visible way back.',
  modes: [
    {
      ids: [430],
      name: 'Tabs with roving focus',
      summary: 'One tab is in the tab order; arrow keys move between them. The panel is labelled by its tab, and the content is real HTML rather than a screenshot.',
      html: `<div class="d-tabs" data-tabs>
        <div class="d-tabs__list" role="tablist" aria-label="Service types">
          ${['Website', 'Interface', 'Experience'].map((t, i) => `<button role="tab" id="ntab-${i}" aria-controls="npanel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="d-tabs__tab${i === 0 ? ' is-active' : ''}" data-tab>${t}</button>`).join('')}
        </div>
        ${['A website with a clear job and a pace that suits it.', 'An interface where every state is designed, including the empty ones.', 'An interactive piece with a fallback that still carries the idea.'].map((copy, i) => `<div role="tabpanel" id="npanel-${i}" aria-labelledby="ntab-${i}" tabindex="0" class="d-tabs__panel"${i === 0 ? '' : ' hidden'}>${copy}</div>`).join('')}
      </div>`,
      init: ({ stage }) => {
        const tabs = [...stage.querySelectorAll<HTMLButtonElement>('[data-tab]')];
        const select = (index: number, focus = true) => {
          tabs.forEach((tab, i) => {
            const on = i === index;
            tab.setAttribute('aria-selected', String(on));
            tab.tabIndex = on ? 0 : -1;
            tab.classList.toggle('is-active', on);
            const panel = stage.querySelector<HTMLElement>(`#npanel-${i}`);
            if (panel) panel.hidden = !on;
          });
          if (focus) tabs[index]?.focus();
        };
        tabs.forEach((tab, i) => {
          tab.addEventListener('click', () => select(i, false));
          tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') select((i + 1) % tabs.length);
            if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length);
            if (e.key === 'Home') select(0);
            if (e.key === 'End') select(tabs.length - 1);
          });
        });
      },
      notes: { keyboard: 'Arrow keys, Home and End follow the WAI-ARIA tabs pattern.' },
    },
    {
      ids: [188, 187, 205],
      name: 'Filter with counts',
      summary: 'Chips filter the list and each chip states how many items it holds before you press it. The count comes from the data, not from a hard-coded label.',
      html: `<div class="d-filterdemo" data-filterdemo>
        <div class="d-row" role="group" aria-label="Filter disciplines">
          <button type="button" class="d-chip is-active" data-filter="all" aria-pressed="true">All</button>
          <button type="button" class="d-chip" data-filter="web" aria-pressed="false">Web</button>
          <button type="button" class="d-chip" data-filter="ui" aria-pressed="false">UI/UX</button>
          <button type="button" class="d-chip" data-filter="motion" aria-pressed="false">Motion</button>
        </div>
        <ul class="d-filterlist">
          ${[['web', 'A launch page with one job'], ['ui', 'A booking flow with fewer steps'], ['motion', 'A scroll story that releases'], ['web', 'A catalogue with honest filters'], ['ui', 'A dashboard for a small team']].map(([tag, title]) => `<li data-tag="${tag}"><span>${title}</span><small>${tag}</small></li>`).join('')}
        </ul>
        <p class="d-cap" data-filter-note aria-live="polite">5 items</p>
      </div>`,
      init: ({ stage }) => {
        const chips = [...stage.querySelectorAll<HTMLButtonElement>('[data-filter]')];
        const rows = [...stage.querySelectorAll<HTMLLIElement>('[data-tag]')];
        const note = stage.querySelector<HTMLElement>('[data-filter-note]')!;
        chips.forEach((chip) => {
          const value = chip.dataset.filter!;
          const count = value === 'all' ? rows.length : rows.filter((r) => r.dataset.tag === value).length;
          chip.textContent = `${chip.textContent} (${count})`;
          chip.addEventListener('click', () => {
            chips.forEach((c) => {
              const on = c === chip;
              c.classList.toggle('is-active', on);
              c.setAttribute('aria-pressed', String(on));
            });
            let shown = 0;
            rows.forEach((row) => {
              const show = value === 'all' || row.dataset.tag === value;
              row.hidden = !show;
              if (show) shown += 1;
            });
            note.textContent = `${shown} item${shown === 1 ? '' : 's'}`;
          });
        });
      },
      notes: { keyboard: 'Buttons expose aria-pressed; the result count is announced.' },
    },
    {
      ids: [155, 157, 159],
      name: 'A menu with a way out',
      summary: 'The panel opens inside the demo, moves focus to its first link, closes on Escape and returns focus to the opener. The page behind stays put.',
      html: `<div class="d-menudemo"><button type="button" class="d-btn d-btn--solid" data-menu-open aria-expanded="false" aria-controls="dmenupanel">Open menu</button><div class="d-menupanel" id="dmenupanel" data-menu-panel hidden><div class="d-menupanel__top"><span>Menu</span><button type="button" class="d-chip" data-menu-close aria-label="Close the menu">Close</button></div><a href="#services" data-menu-link>Services</a><a href="#process" data-menu-link>Process</a><a href="#pricing" data-menu-link>Pricing</a><a href="#contact" data-menu-link>Contact</a></div><p class="d-cap" data-menu-note>Closed.</p></div>`,
      init: ({ stage }) => {
        const open = stage.querySelector<HTMLButtonElement>('[data-menu-open]')!;
        const panel = stage.querySelector<HTMLElement>('[data-menu-panel]')!;
        const close = stage.querySelector<HTMLButtonElement>('[data-menu-close]')!;
        const note = stage.querySelector<HTMLElement>('[data-menu-note]')!;
        const links = [...panel.querySelectorAll<HTMLElement>('[data-menu-link]')];
        const setOpen = (on: boolean) => {
          panel.hidden = !on;
          open.setAttribute('aria-expanded', String(on));
          note.textContent = on ? 'Open. Escape closes it; focus is in the panel.' : 'Closed. Focus returned to the button.';
          if (on) links[0]?.focus();
          else open.focus();
        };
        open.addEventListener('click', () => setOpen(true));
        close.addEventListener('click', () => setOpen(false));
        links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
        panel.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            setOpen(false);
          }
        });
      },
      notes: { keyboard: 'Escape closes and focus returns to the opener.' },
    },
    {
      ids: [165, 169],
      name: 'A transition you can undo',
      summary: 'Two panels swap with a short slide. The Back button is always visible, and no history entry is faked.',
      html: `<div class="d-pagetrans" data-trans><div class="d-pagetrans__page is-on" data-page-a><p class="d-h">The work</p><button type="button" class="d-btn d-btn--line" data-to-b>Read the process</button></div><div class="d-pagetrans__page" data-page-b><p class="d-h">The process</p><button type="button" class="d-chip" data-to-a>Back to the work</button></div></div>`,
      init: ({ stage }) => {
        const root = stage.querySelector<HTMLElement>('[data-trans]')!;
        const a = stage.querySelector<HTMLElement>('[data-page-a]')!;
        const b = stage.querySelector<HTMLElement>('[data-page-b]')!;
        const go = (toB: boolean) => {
          root.classList.toggle('is-b', toB);
          a.classList.toggle('is-on', !toB);
          b.classList.toggle('is-on', toB);
        };
        stage.querySelector('[data-to-b]')!.addEventListener('click', () => go(true));
        stage.querySelector('[data-to-a]')!.addEventListener('click', () => go(false));
      },
      notes: { motion: 'Reduced motion swaps instantly.', keyboard: 'Both directions are buttons.' },
    },
    {
      ids: [161, 416],
      name: 'A sheet you can dismiss',
      summary: 'The bottom sheet has a labelled close button, a drag handle and Escape support. It never covers the whole screen on a large viewport.',
      html: `<div class="d-sheetdemo"><button type="button" class="d-btn d-btn--line" data-sheet-open aria-expanded="false" aria-controls="dsheet">Open sheet</button><div class="d-sheet" id="dsheet" role="dialog" aria-modal="false" aria-labelledby="dsheet-title" data-sheet hidden><span class="d-sheet__handle" aria-hidden="true"></span><h4 id="dsheet-title">Quick contact</h4><p class="d-body">A sheet is for a small decision, not a second website.</p><div class="d-row"><a class="d-btn d-btn--solid" href="mailto:denvupforyou@gmail.com">Email</a><button type="button" class="d-chip" data-sheet-close>Close</button></div></div></div>`,
      init: ({ stage }) => {
        const open = stage.querySelector<HTMLButtonElement>('[data-sheet-open]')!;
        const sheet = stage.querySelector<HTMLElement>('[data-sheet]')!;
        const close = stage.querySelector<HTMLButtonElement>('[data-sheet-close]')!;
        const set = (on: boolean) => {
          sheet.hidden = !on;
          open.setAttribute('aria-expanded', String(on));
          if (on) close.focus();
          else open.focus();
        };
        open.addEventListener('click', () => set(true));
        close.addEventListener('click', () => set(false));
        sheet.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') set(false);
        });
      },
      notes: { keyboard: 'Focus moves into the sheet and returns on close.' },
    },
    {
      ids: [163],
      name: 'A command list',
      summary: 'Type to narrow the list, move with the arrow keys and press Enter. The selected option is reported with aria-activedescendant while focus stays in the input.',
      html: `<div class="d-cmd"><label class="d-cap" for="dcmd-input">Jump to</label><input id="dcmd-input" class="d-cmd__input" type="search" role="combobox" aria-expanded="true" aria-controls="dcmd-list" aria-autocomplete="list" data-cmd-input placeholder="Type “price” or “team”"><ul class="d-cmd__list" id="dcmd-list" role="listbox" data-cmd-list>${[['Services', '#services'], ['Process', '#process'], ['Pricing', '#pricing'], ['Team', '#team'], ['Contact', '#contact']].map(([label, href], i) => `<li role="option" id="dcmd-${i}" aria-selected="${i === 0}" data-cmd-item data-href="${href}">${label}</li>`).join('')}</ul><p class="d-cap" data-cmd-note aria-live="polite">5 destinations</p></div>`,
      init: ({ stage }) => {
        const input = stage.querySelector<HTMLInputElement>('[data-cmd-input]')!;
        const items = [...stage.querySelectorAll<HTMLLIElement>('[data-cmd-item]')];
        const note = stage.querySelector<HTMLElement>('[data-cmd-note]')!;
        let active = 0;
        const paint = () => {
          items.forEach((item, i) => item.setAttribute('aria-selected', String(i === active)));
          const current = items[active];
          if (current) input.setAttribute('aria-activedescendant', current.id);
        };
        const filter = () => {
          const q = input.value.trim().toLowerCase();
          items.forEach((item) => {
            item.hidden = Boolean(q) && !(item.textContent ?? '').toLowerCase().includes(q);
          });
          const visible = items.filter((i) => !i.hidden);
          active = Math.max(0, visible.indexOf(items[active]));
          const shown = items.filter((i) => !i.hidden).length;
          note.textContent = `${shown} destination${shown === 1 ? '' : 's'}`;
          paint();
        };
        input.addEventListener('input', filter);
        input.addEventListener('keydown', (e) => {
          const visible = items.filter((i) => !i.hidden);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            active = Math.min(visible.length - 1, active + 1);
            paint();
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            active = Math.max(0, active - 1);
            paint();
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            note.textContent = `Chosen: ${visible[active]?.textContent ?? 'nothing'}. This demo does not navigate the page.`;
          }
        });
        paint();
      },
      notes: { keyboard: 'Combobox pattern: focus stays in the input, arrows change the active option.' },
    },
    {
      ids: [151, 152, 160],
      name: 'A header that yields',
      summary: 'The bar hides on downward scroll and returns on upward scroll, with a hard threshold so it never flickers. It is always visible when focus enters it.',
      html: `<div class="d-head-demo" data-headdemo><div class="d-scrollbox" data-headbox tabindex="0" role="region" aria-label="Header demo scroll area"><header class="d-fakehead" data-fakehead><span>DENVUP</span><nav><a href="#services">Services</a><a href="#contact">Contact</a></nav></header>${Array.from({ length: 8 }, (_, i) => `<p class="d-body">Paragraph ${i + 1}. Scroll down: the header leaves. Scroll up: it comes back.</p>`).join('')}<div class="d-spacer"></div></div></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLElement>('[data-headbox]')!;
        const head = stage.querySelector<HTMLElement>('[data-fakehead]')!;
        let last = box.scrollTop;
        box.addEventListener('scroll', () => {
          const now = box.scrollTop;
          if (Math.abs(now - last) < 8) return;
          head.classList.toggle('is-hidden', now > last && now > 60);
          last = now;
        }, { passive: true });
        head.addEventListener('focusin', () => head.classList.remove('is-hidden'));
      },
      notes: { keyboard: 'Focusing a link brings the header back.' },
    },
    {
      ids: [121, 154, 172],
      name: 'Progress, without a takeover',
      summary: 'A chapter rail shows where you are and jumps on click. The markers are links, and the current one is marked with aria-current.',
      html: `<nav class="d-progress-nav" data-pnav aria-label="Demo chapter rail"><div class="d-progress-nav__bar"><i data-pnav-bar></i></div><div class="d-progress-nav__chips">${['Prelude', 'Services', 'Process', 'Close'].map((label, i) => `<button type="button" data-pnav-item="${i}"${i === 0 ? ' class="is-active" aria-current="step"' : ''}>${label}</button>`).join('')}</div><p class="d-cap" data-pnav-note>Chapter 1 of 4</p></nav>`,
      init: ({ stage }) => {
        const items = [...stage.querySelectorAll<HTMLButtonElement>('[data-pnav-item]')];
        const bar = stage.querySelector<HTMLElement>('[data-pnav-bar]')!;
        const note = stage.querySelector<HTMLElement>('[data-pnav-note]')!;
        items.forEach((item, i) => {
          item.addEventListener('click', () => {
            items.forEach((other, j) => {
              other.classList.toggle('is-active', i === j);
              if (i === j) other.setAttribute('aria-current', 'step');
              else other.removeAttribute('aria-current');
            });
            bar.style.transform = `scaleX(${(i + 1) / items.length})`;
            note.textContent = `Chapter ${i + 1} of ${items.length}`;
          });
        });
      },
      notes: { keyboard: 'Each marker is a real button; aria-current marks the selected one.' },
    },
  ],
};
