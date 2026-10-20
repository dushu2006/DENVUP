import type { Lab } from './types';

const plates = [
  { name: 'Fold', tone: 'orange', copy: 'A single screen with one argument.' },
  { name: 'Current', tone: 'ink', copy: 'An interface that reacts like software.' },
  { name: 'Index', tone: 'bone', copy: 'A searchable set of studies.' },
  { name: 'Relay', tone: 'clay', copy: 'A scroll story that hands back control.' },
];

export const collectionsLab: Lab = {
  slug: 'collections',
  title: 'Cards, grids & galleries',
  blurb:
    'Collections fail when the only way to browse them is a gesture. Every grid and rail here has a button, a keyboard path and a visible count.',
  modes: [
    {
      ids: [187, 188, 205],
      name: 'A grid with real filters',
      summary: 'Chips narrow the same DOM; nothing is re-rendered and nothing is fetched. The result count is announced, and an empty state says so.',
      html: `<div class="d-griddemo" data-griddemo><div class="d-row" role="group" aria-label="Filter plates">${['All', 'Web', 'Interface', 'Motion'].map((t, i) => `<button type="button" class="d-chip${i === 0 ? ' is-active' : ''}" data-grid-filter="${i === 0 ? 'all' : t.toLowerCase()}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div><div class="d-grid" data-grid>${plates.concat(plates).map((p, i) => `<article class="d-cell" data-kind="${['web', 'interface', 'motion'][i % 3]}" style="--tone:var(--${p.tone})"><span>${p.name}</span><small>${p.copy}</small></article>`).join('')}</div><p class="d-cap" data-grid-count aria-live="polite">8 plates</p></div>`,
      init: ({ stage }) => {
        const cells = [...stage.querySelectorAll<HTMLElement>('.d-cell')];
        const count = stage.querySelector<HTMLElement>('[data-grid-count]')!;
        stage.querySelectorAll<HTMLButtonElement>('[data-grid-filter]').forEach((chip) => {
          chip.addEventListener('click', () => {
            const kind = chip.dataset.gridFilter!;
            stage.querySelectorAll<HTMLButtonElement>('[data-grid-filter]').forEach((c) => {
              c.classList.toggle('is-active', c === chip);
              c.setAttribute('aria-pressed', String(c === chip));
            });
            let shown = 0;
            cells.forEach((cell) => {
              const on = kind === 'all' || cell.dataset.kind === kind;
              cell.hidden = !on;
              if (on) shown += 1;
            });
            count.textContent = `${shown} plate${shown === 1 ? '' : 's'}${kind === 'all' ? '' : ` in ${kind}`}`;
          });
        });
      },
      notes: { keyboard: 'Buttons carry pressed state; the count is live.', touch: 'Filters are always visible above the grid.' },
    },
    {
      ids: [176, 177],
      name: 'Tilt, with restraint',
      summary: 'Cards tilt towards the pointer by at most four degrees and settle on leave. Under reduced motion they stay flat; on touch, no tilt is attempted.',
      html: `<div class="d-tiltgrid">${plates.slice(0, 3).map((p) => `<article class="d-tiltcard" data-tilt><span>${p.name}</span><small>${p.copy}</small></article>`).join('')}</div>`,
      init: ({ stage, reduced, touch }) => {
        if (reduced || touch) return;
        stage.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(700px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', () => {
            card.style.transform = '';
          });
        });
      },
      notes: { touch: 'No tilt; the cards are plain links with large hit areas.', motion: 'Tilt is disabled entirely.' },
    },
    {
      ids: [189, 190],
      name: 'Drag, with a handle',
      summary: 'The rail scrolls by drag, wheel and a visible pair of buttons. Dragging is an accelerator, not the only route.',
      html: `<div class="d-dragrail" data-dragrail><div class="d-dragrail__track" data-dragtrack tabindex="0" aria-label="Draggable rail">${plates.concat(plates).map((p) => `<article class="d-dragrail__card"><b>${p.name}</b><small>${p.copy}</small></article>`).join('')}</div><div class="d-row"><button type="button" class="d-chip" data-drag-prev>←</button><button type="button" class="d-chip" data-drag-next>→</button></div></div>`,
      init: ({ stage }) => {
        const track = stage.querySelector<HTMLElement>('[data-dragtrack]')!;
        let down = false;
        let startX = 0;
        let startLeft = 0;
        const prev = () => track.scrollBy({ left: -260, behavior: 'smooth' });
        const next = () => track.scrollBy({ left: 260, behavior: 'smooth' });
        stage.querySelector('[data-drag-prev]')!.addEventListener('click', prev);
        stage.querySelector('[data-drag-next]')!.addEventListener('click', next);
        track.addEventListener('pointerdown', (e) => {
          down = true;
          startX = e.clientX;
          startLeft = track.scrollLeft;
          track.setPointerCapture(e.pointerId);
        });
        track.addEventListener('pointermove', (e) => {
          if (!down) return;
          track.scrollLeft = startLeft - (e.clientX - startX);
        });
        const up = () => {
          down = false;
        };
        track.addEventListener('pointerup', up);
        track.addEventListener('pointercancel', up);
        track.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') next();
          if (e.key === 'ArrowLeft') prev();
        });
      },
      notes: { keyboard: 'Arrow keys scroll the focused rail; buttons duplicate the gesture.' },
    },
    {
      ids: [194, 195],
      name: 'Before and after',
      summary: 'A range input moves the divider, so the comparison works with a keyboard and a screen reader. The two images are the same artwork, cropped differently.',
      html: `<div class="d-compare" data-compare><img src="/assets/media/den-glow.webp" alt="The generated artwork, full colour" width="800" height="600"><div class="d-compare__top"><img src="/assets/media/den-glow.webp" alt="The same artwork in a tighter crop" width="800" height="600"></div><span class="d-compare__line" aria-hidden="true"></span><label class="sr-only" for="cmp">Reveal the tighter crop</label><input id="cmp" class="d-compare__range" type="range" min="0" max="100" value="55" data-compare-range></div>`,
      init: ({ stage }) => {
        const root = stage.querySelector<HTMLElement>('[data-compare]')!;
        const range = stage.querySelector<HTMLInputElement>('[data-compare-range]')!;
        const apply = () => {
          root.style.setProperty('--split', `${range.value}%`);
        };
        range.addEventListener('input', apply);
        apply();
      },
      notes: { keyboard: 'Arrow keys move the divider; the label names what is revealed.', touch: 'The native range input is usable with a finger.' },
    },
    {
      ids: [196, 197],
      name: 'A lightbox that returns',
      summary: 'The enlarged view is a modal dialog inside the demo, labelled by its title. Escape closes it and focus returns to the thumbnail that opened it.',
      html: `<div class="d-lightboxdemo"><div class="d-thumbs">${plates.map((p, i) => `<button type="button" class="d-thumb" data-light="${i}" aria-haspopup="dialog"><span>${p.name}</span></button>`).join('')}</div><dialog class="d-lightbox" data-lightbox aria-labelledby="light-title"><p class="d-lightbox__tag" data-light-tag></p><h4 id="light-title" data-light-title></h4><p class="d-body" data-light-copy></p><div class="d-row"><button type="button" class="d-chip" data-light-close>Close</button></div></dialog></div>`,
      init: ({ stage }) => {
        const dialog = stage.querySelector<HTMLDialogElement>('[data-lightbox]')!;
        const title = stage.querySelector<HTMLElement>('[data-light-title]')!;
        const tag = stage.querySelector<HTMLElement>('[data-light-tag]')!;
        const copy = stage.querySelector<HTMLElement>('[data-light-copy]')!;
        let opener: HTMLElement | null = null;
        stage.querySelectorAll<HTMLButtonElement>('[data-light]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const plate = plates[Number(btn.dataset.light)]!;
            title.textContent = plate.name;
            tag.textContent = 'Concept plate';
            copy.textContent = plate.copy;
            opener = btn;
            dialog.showModal();
          });
        });
        stage.querySelector('[data-light-close]')!.addEventListener('click', () => dialog.close());
        dialog.addEventListener('close', () => opener?.focus());
      },
      notes: { keyboard: 'Native dialog handles Escape; focus returns to the thumbnail.' },
    },
    {
      ids: [183],
      name: 'Stack, then deal',
      summary: 'Three cards sit in a stack; the button deals the top one to the back. Each card keeps its own text, and the order is announced.',
      html: `<div class="d-deck" data-deck>${plates.slice(0, 3).map((p, i) => `<article class="d-deck__card" style="--i:${i}"><b>${p.name}</b><small>${p.copy}</small></article>`).join('')}<button type="button" class="d-chip" data-deal>Deal the top card</button><p class="d-cap" data-deal-note aria-live="polite">Top card: Fold</p></div>`,
      init: ({ stage }) => {
        const deck = stage.querySelector<HTMLElement>('[data-deck]')!;
        const note = stage.querySelector<HTMLElement>('[data-deal-note]')!;
        const cards = [...deck.querySelectorAll<HTMLElement>('.d-deck__card')];
        let order = [0, 1, 2];
        const paint = () => {
          order.forEach((idx, position) => {
            const card = cards[idx]!;
            card.style.setProperty('--i', String(position));
            card.setAttribute('aria-hidden', String(position > 0));
          });
          note.textContent = `Top card: ${cards[order[0]!]!.querySelector('b')!.textContent}`;
        };
        stage.querySelector('[data-deal]')!.addEventListener('click', () => {
          order = [order[1]!, order[2]!, order[0]!];
          paint();
        });
        paint();
      },
      notes: { keyboard: 'The deal control is a button; the visible top card is named in text.' },
    },
    {
      ids: [199, 200],
      name: 'A gallery that counts',
      summary: 'A rail whose position is reported as “3 of 8”. Buttons and keys move it; the number is derived from scroll position rather than a separate state.',
      html: `<div class="d-gal"><div class="d-gal__track" data-galtrack tabindex="0" aria-label="Gallery of concept plates">${plates.concat(plates).map((p) => `<figure class="d-gal__item"><span>${p.name}</span><figcaption>${p.copy}</figcaption></figure>`).join('')}</div><div class="d-row"><button type="button" class="d-chip" data-gal-prev>Previous</button><span class="d-cap" data-gal-count>1 of 8</span><button type="button" class="d-chip" data-gal-next>Next</button></div></div>`,
      init: ({ stage }) => {
        const track = stage.querySelector<HTMLElement>('[data-galtrack]')!;
        const count = stage.querySelector<HTMLElement>('[data-gal-count]')!;
        const step = () => (track.firstElementChild?.getBoundingClientRect().width ?? 200) + 8;
        const update = () => {
          count.textContent = `${Math.min(8, Math.round(track.scrollLeft / step()) + 1)} of 8`;
        };
        stage.querySelector('[data-gal-prev]')!.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
        stage.querySelector('[data-gal-next]')!.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
        track.addEventListener('scroll', update, { passive: true });
        track.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') track.scrollBy({ left: step() });
          if (e.key === 'ArrowLeft') track.scrollBy({ left: -step() });
        });
        update();
      },
      notes: { touch: 'Native horizontal scroll; buttons stay visible.', keyboard: 'Arrow keys move the focused rail.' },
    },
    {
      ids: [179, 202],
      name: 'A hover grid, on touch',
      summary: 'The grid reveals a second layer on hover; on touch, tapping pins the same layer open. Nothing is available only on hover.',
      html: `<div class="d-hovergrid">${plates.map((p, i) => `<button type="button" class="d-hovergrid__cell" data-hovercell="${i}" aria-expanded="false"><span>${p.name}</span><small>${p.copy}</small></button>`).join('')}</div>`,
      init: ({ stage }) => {
        const cells = [...stage.querySelectorAll<HTMLButtonElement>('[data-hovercell]')];
        cells.forEach((cell) => {
          cell.addEventListener('click', () => {
            const open = cell.getAttribute('aria-expanded') === 'true';
            cells.forEach((c) => {
              c.classList.remove('is-on');
              c.setAttribute('aria-expanded', 'false');
            });
            if (!open) {
              cell.classList.add('is-on');
              cell.setAttribute('aria-expanded', 'true');
            }
          });
        });
      },
      notes: { keyboard: 'Enter pins the second layer; Escape is not needed because it is not modal.' },
    },
    {
      ids: [178, 180, 181, 182, 184, 185, 186, 192, 193, 201, 203, 204],
      name: 'One grid, many behaviours',
      summary:
        'A working card rack: lift, zoom, pan, content slide and an editorial entrance, then a real carousel, a drag-to-reorder list and a detail panel that expands from the same card.',
      html: `<div class="d-rack" data-rack>
        <div class="d-rack__grid">
          <button type="button" class="d-rack__card c-lift" data-card><img src="/assets/media/den-glow.webp" alt="" loading="lazy" decoding="async"><span>Lift</span></button>
          <button type="button" class="d-rack__card c-zoom" data-card><img src="/assets/media/den-glow.webp" alt="" loading="lazy" decoding="async"><span>Image zoom</span></button>
          <button type="button" class="d-rack__card c-pan" data-card><img src="/assets/media/den-glow.webp" alt="" loading="lazy" decoding="async"><span>Pan</span></button>
          <button type="button" class="d-rack__card c-slide" data-card><img src="/assets/media/den-glow.webp" alt="" loading="lazy" decoding="async"><span>Content slide</span></button>
        </div>
        <div class="d-rack__editorial" data-editorial><i></i><i></i><i></i><i></i><span>Editorial grid</span></div>
        <div class="d-rack__carousel" data-carousel>
          <div class="d-rack__stage" data-cstage>
            <figure class="is-current"><img src="/assets/media/den-glow.webp" alt="Abstract orange field, plate one" loading="lazy" decoding="async"><figcaption>01 — Field</figcaption></figure>
            <figure><img src="/assets/media/grain.png" alt="Grain texture, plate two" loading="lazy" decoding="async"><figcaption>02 — Grain</figcaption></figure>
            <figure><img src="/assets/media/den-glow.webp" alt="Abstract orange field, plate three" loading="lazy" decoding="async"><figcaption>03 — Glow</figcaption></figure>
          </div>
          <div class="d-rack__nav">
            <button type="button" class="d-chip" data-cprev>Previous</button>
            <button type="button" class="d-chip" data-cmode aria-pressed="false">Coverflow</button>
            <button type="button" class="d-chip" data-cnext>Next</button>
            <p class="d-cap" data-cnote>Carousel 1 of 3 — use the buttons or arrow keys.</p>
          </div>
        </div>
        <ul class="d-rack__list" data-reorder aria-label="Reorderable list">
          <li draggable="true"><button type="button" class="d-rack__grip" aria-label="Move item">⠿</button>Structure</li>
          <li draggable="true"><button type="button" class="d-rack__grip" aria-label="Move item">⠿</button>Type</li>
          <li draggable="true"><button type="button" class="d-rack__grip" aria-label="Move item">⠿</button>Motion</li>
          <li draggable="true"><button type="button" class="d-rack__grip" aria-label="Move item">⠿</button>Access</li>
        </ul>
        <button type="button" class="d-chip" data-open-detail>Open the detail panel</button>
        <dialog class="d-rack__dialog" data-detail aria-labelledby="rack-detail-title">
          <h3 id="rack-detail-title">Field notes</h3>
          <p>A detail view can expand from the card, but it must trap focus, close with Escape and return focus to the card that opened it.</p>
          <details><summary>Metadata</summary><p>Concept piece. Canvas and CSS only; no client work is implied.</p></details>
          <button type="button" class="d-btn d-btn--line" data-close-detail>Close</button>
        </dialog>
      </div>`,
      init: ({ stage, announce, onCleanup }) => {
        const carousel = stage.querySelector<HTMLElement>('[data-carousel]')!;
        const slides = [...carousel.querySelectorAll<HTMLElement>('figure')];
        const note = carousel.querySelector<HTMLElement>('[data-cnote]')!;
        let index = 0;
        let coverflow = false;
        const paint = () => {
          slides.forEach((slide, i) => slide.classList.toggle('is-current', i === index));
          carousel.classList.toggle('is-coverflow', coverflow);
          note.textContent = `Carousel ${index + 1} of ${slides.length} — ${coverflow ? 'coverflow' : 'flat'} — use the buttons or arrow keys.`;
        };
        const go = (delta: number) => {
          index = (index + delta + slides.length) % slides.length;
          paint();
          announce(`Slide ${index + 1} of ${slides.length}`);
        };
        carousel.querySelector('[data-cprev]')!.addEventListener('click', () => go(-1));
        carousel.querySelector('[data-cnext]')!.addEventListener('click', () => go(1));
        const mode = carousel.querySelector<HTMLButtonElement>('[data-cmode]')!;
        mode.addEventListener('click', () => {
          coverflow = !coverflow;
          mode.setAttribute('aria-pressed', String(coverflow));
          paint();
        });
        const onKey = (event: KeyboardEvent) => {
          if (event.key === 'ArrowLeft') go(-1);
          if (event.key === 'ArrowRight') go(1);
        };
        carousel.addEventListener('keydown', onKey);
        carousel.tabIndex = 0;
        paint();

        const list = stage.querySelector<HTMLUListElement>('[data-reorder]')!;
        let dragged: HTMLLIElement | null = null;
        list.querySelectorAll<HTMLLIElement>('li').forEach((item) => {
          item.addEventListener('dragstart', () => { dragged = item; item.classList.add('is-dragging'); });
          item.addEventListener('dragend', () => { item.classList.remove('is-dragging'); dragged = null; });
          item.addEventListener('dragover', (event) => event.preventDefault());
          item.addEventListener('drop', (event) => {
            event.preventDefault();
            if (!dragged || dragged === item) return;
            const items = [...list.children];
            if (items.indexOf(dragged) < items.indexOf(item)) item.after(dragged);
            else item.before(dragged);
            announce('List reordered');
          });
          const grip = item.querySelector<HTMLButtonElement>('button')!;
          grip.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
            event.preventDefault();
            const sibling = event.key === 'ArrowUp' ? item.previousElementSibling : item.nextElementSibling;
            if (!sibling) return;
            if (event.key === 'ArrowUp') sibling.before(item); else sibling.after(item);
            grip.focus();
            announce('List reordered');
          });
        });

        const dialog = stage.querySelector<HTMLDialogElement>('[data-detail]')!;
        const opener = stage.querySelector<HTMLButtonElement>('[data-open-detail]')!;
        opener.addEventListener('click', () => dialog.showModal());
        dialog.querySelector('[data-close-detail]')!.addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', (event) => {
          if (event.target === dialog) dialog.close();
        });
        onCleanup(() => {
          carousel.removeEventListener('keydown', onKey);
          if (dialog.open) dialog.close();
        });
      },
      notes: {
        touch: 'The carousel has Previous/Next buttons; the list reorders with the grip using the arrow keys or by dragging.',
        keyboard: 'Arrow keys move the carousel; the grip buttons reorder with Up/Down; Escape closes the detail dialog.',
        motion: 'Cards change state without transitions; the carousel switches slides instantly.',
      },
    },
  ],
};
