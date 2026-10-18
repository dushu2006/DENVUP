import type { Lab } from './types';

export const responsiveLab: Lab = {
  slug: 'responsive',
  title: 'Responsive patterns',
  blurb:
    'The same content at different widths. Hover becomes tap, horizontal becomes vertical, and safe areas are treated as layout, not an afterthought.',
  modes: [
    {
      ids: [411, 420],
      name: 'Tap to reveal',
      summary: 'The detail is always in the DOM and opens with a tap, a click or Enter. Nothing important is available only on hover.',
      html: `<div class="d-tapcards">${['Scope', 'Sequence', 'Handover'].map((title, i) => `<article class="d-tapcard" data-tapcard><span class="d-tapcard__art" aria-hidden="true">${['◇', '↗', '⌘'][i]}</span><button type="button" class="d-tapcard__title" aria-expanded="false" data-tap>${title}<span class="d-tapcard__hint">Open</span></button><p class="d-tapcard__detail">${['A written scope before work starts, so the number and the outcome match.', 'A stage-by-stage sequence with a review at each handover.', 'Files, notes and a walkthrough you can pass to someone else.'][i]}</p></article>`).join('')}</div>`,
      init: ({ stage }) => {
        stage.querySelectorAll<HTMLButtonElement>('[data-tap]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const card = btn.closest<HTMLElement>('[data-tapcard]')!;
            const open = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!open));
            card.classList.toggle('is-open', !open);
            btn.querySelector('.d-tapcard__hint')!.textContent = open ? 'Open' : 'Close';
          });
        });
      },
      notes: { touch: 'Tap opens; tap again closes.', keyboard: 'Buttons carry aria-expanded.' },
    },
    {
      ids: [412, 423],
      name: 'Swipe, with buttons',
      summary: 'A scroll-snap rail with visible previous and next buttons. The gesture is never the only way to move.',
      html: `<div class="d-swipe"><div class="d-swipe__track" data-swipe tabindex="0" role="region" aria-label="Concept cards">${['Fold', 'Current', 'Index', 'Relay'].map((n) => `<div>${n}</div>`).join('')}</div><div class="d-row"><button type="button" class="d-chip" data-swipe-prev aria-label="Previous card">←</button><button type="button" class="d-chip" data-swipe-next aria-label="Next card">→</button><span class="d-cap" data-swipe-note>1 of 4</span></div></div>`,
      init: ({ stage }) => {
        const track = stage.querySelector<HTMLElement>('[data-swipe]')!;
        const note = stage.querySelector<HTMLElement>('[data-swipe-note]')!;
        const cards = [...track.children] as HTMLElement[];
        const step = () => (cards[0]?.getBoundingClientRect().width ?? 200) + 6;
        const update = () => {
          const index = Math.round(track.scrollLeft / step()) + 1;
          note.textContent = `${Math.min(cards.length, index)} of ${cards.length}`;
        };
        stage.querySelector('[data-swipe-prev]')!.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
        stage.querySelector('[data-swipe-next]')!.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
        track.addEventListener('scroll', update, { passive: true });
        track.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowRight') track.scrollBy({ left: step() });
          if (event.key === 'ArrowLeft') track.scrollBy({ left: -step() });
        });
        update();
      },
      notes: { keyboard: 'Arrow keys scroll the region when it has focus.' },
    },
    {
      ids: [414, 418],
      name: 'Container-led layout',
      summary: 'The card responds to its own width, not the window. Drag the slider and the layout changes because the container did.',
      html: `<div class="d-container-demo" data-cq-host><div class="d-cq"><div class="d-cq__art" aria-hidden="true"></div><p class="d-cq__copy">At narrow widths this copy sits under the artwork; at wider widths it moves beside it. The component does not know the viewport.</p></div></div><div class="d-row" style="padding:0 1rem 1rem"><label class="d-cap" for="cq-size">Container width</label><input class="d-slider" id="cq-size" type="range" min="22" max="100" value="100" data-cq-range><span class="d-cap" data-cq-note>100%</span></div>`,
      init: ({ stage }) => {
        const host = stage.querySelector<HTMLElement>('[data-cq-host]')!;
        const range = stage.querySelector<HTMLInputElement>('[data-cq-range]')!;
        const note = stage.querySelector<HTMLElement>('[data-cq-note]')!;
        const apply = () => {
          host.style.maxWidth = `${range.value}%`;
          note.textContent = `${range.value}% · ${range.value === '100' ? 'wide' : 'narrow'} container`;
        };
        range.addEventListener('input', apply);
        apply();
      },
      notes: { motion: 'The layout change is instant; no transition is required to understand it.' },
    },
    {
      ids: [422, 425],
      name: 'Safe areas and focal points',
      summary: 'A phone frame with the notch and home area marked, and an image whose focal point can be moved. The crop is a decision, not an accident.',
      html: `<div class="d-safe"><div class="d-safe__phone" aria-hidden="true"><span class="d-safe__notch"></span><div class="d-crop"><img src="/assets/media/den-glow.webp" alt="" width="800" height="800" loading="lazy" data-crop-img></div><span class="d-safe__home"></span><span class="d-safe__thumb"></span></div><div class="d-stack"><p class="d-cq__copy">The notch and home indicator are measured, not guessed. Content keeps out of the safe area with <code>env()</code>.</p><label class="d-cap" for="focal">Focal point</label><input class="d-slider" id="focal" type="range" min="0" max="100" value="50" data-focal><p class="d-safe__copy" data-focal-note>object-position: 50% 50%</p></div></div>`,
      init: ({ stage }) => {
        const range = stage.querySelector<HTMLInputElement>('[data-focal]')!;
        const img = stage.querySelector<HTMLImageElement>('[data-crop-img]')!;
        const note = stage.querySelector<HTMLElement>('[data-focal-note]')!;
        const apply = () => {
          img.style.objectPosition = `${range.value}% 50%`;
          note.textContent = `object-position: ${range.value}% 50%`;
        };
        range.addEventListener('input', apply);
        apply();
      },
      notes: { touch: 'The range input works with touch and arrow keys.' },
    },
  ],
};
