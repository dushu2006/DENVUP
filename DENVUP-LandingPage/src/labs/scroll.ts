import type { Lab } from './types';
import { clamp, lerp } from './helpers';

function scrollbox(stage: HTMLElement, label: string): HTMLElement {
  const box = document.createElement('div');
  box.className = 'd-scrollbox';
  box.tabIndex = 0;
  box.setAttribute('role', 'region');
  box.setAttribute('aria-label', label);
  stage.append(box);
  return box;
}

function progress(box: HTMLElement): number {
  const max = box.scrollHeight - box.clientHeight;
  return max > 0 ? clamp(box.scrollTop / max) : 0;
}

export const scrollLab: Lab = {
  slug: 'scroll',
  title: 'Scroll behaviour',
  blurb:
    'Scroll is the one gesture a visitor already knows. These demos use native scroll inside a labelled region, never take over the page, and keep every word reachable.',
  modes: [
    {
      ids: [119, 120],
      name: 'A progress you can read',
      summary: 'The bar reports the position of this panel, not the window. It is a real progressbar with a value, and the text repeats the number.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Scroll progress demo');
        box.innerHTML = `<div class="d-progressdemo"><div class="d-progressdemo__bar"><i data-prog></i></div><p class="d-progressdemo__num" data-prog-num>0%</p><p class="d-progressdemo__copy">Scroll this panel. The bar and the number move together, and neither is the page scrollbar.</p><div class="d-spacer"></div><p class="d-progressdemo__copy">The end of the panel. Nothing was pinned, hijacked or smoothed by a library.</p></div>`;
        const bar = box.querySelector<HTMLElement>('[data-prog]')!;
        const num = box.querySelector<HTMLElement>('[data-prog-num]')!;
        const update = () => {
          const p = progress(box);
          bar.style.transform = `scaleX(${p})`;
          num.textContent = `${Math.round(p * 100)}%`;
        };
        box.addEventListener('scroll', update, { passive: true });
        update();
      },
      notes: { keyboard: 'The panel is focusable; arrow keys scroll it natively.', motion: 'The bar still updates under reduced motion.' },
    },
    {
      ids: [131, 148],
      name: 'Sticky, then release',
      summary: 'A heading pins inside the panel for one screen of reading, then leaves with the section. Position: sticky does the work; no scroll listener is needed.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Sticky heading demo');
        box.innerHTML = `<div class="d-stickydemo"><div class="d-stickydemo__head"><p class="d-h">A heading that waits</p></div>${['First paragraph: the heading is pinned while you read.', 'Second paragraph: still pinned, because the section is still on screen.', 'Third paragraph: the section is ending and the heading is about to leave.', 'Fourth paragraph: the heading has gone with its section.'].map((t) => `<p class="d-body">${t}</p>`).join('')}<div class="d-spacer"></div></div>`;
      },
      notes: { keyboard: 'Sticky positioning never traps a panel; scrolling continues normally.' },
    },
    {
      ids: [134],
      name: 'Horizontal inside vertical',
      summary: 'Vertical scroll drives a horizontal rail inside the panel, then releases back to vertical. The panel owns the scroll; the page does not.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Horizontal inside vertical demo');
        box.innerHTML = `<div class="d-hscroll"><div class="d-hscroll__pin"><div class="d-hscroll__track" data-track>${['One', 'Two', 'Three', 'Four']
          .map((t, i) => `<article class="d-hscroll__card"><span>0${i + 1}</span><strong>${t}</strong></article>`)
          .join('')}</div></div><div class="d-spacer"></div></div>`;
        const track = box.querySelector<HTMLElement>('[data-track]')!;
        const pin = box.querySelector<HTMLElement>('.d-hscroll__pin')!;
        let frame = 0;
        const update = () => {
          const max = track.scrollWidth - pin.clientWidth;
          track.style.transform = ctx.reduced ? 'none' : `translate3d(${(-progress(box) * max).toFixed(1)}px,0,0)`;
          frame = 0;
        };
        box.addEventListener('scroll', () => {
          if (!frame) frame = requestAnimationFrame(update);
        }, { passive: true });
        update();
        return () => cancelAnimationFrame(frame);
      },
      notes: { touch: 'Native panel scroll; the horizontal travel is a transform.', motion: 'Reduced motion shows the cards in a normal horizontal strip.' },
    },
    {
      ids: [122, 123],
      name: 'Parallax with a limit',
      summary: 'Two layers move at different rates, capped at 40 px so nothing separates. The transform is written from the panel’s scroll position.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Parallax demo');
        box.innerHTML = `<div class="d-parallax"><div class="d-parallax__back" data-back><span>background</span></div><div class="d-parallax__front" data-front><span>foreground</span></div><p class="d-cap">Two layers, one derived value</p><div class="d-spacer"></div></div>`;
        const back = box.querySelector<HTMLElement>('[data-back]')!;
        const front = box.querySelector<HTMLElement>('[data-front]')!;
        let frame = 0;
        const update = () => {
          const p = progress(box);
          const a = ctx.reduced ? 0 : lerp(24, -16, p);
          const b = ctx.reduced ? 0 : lerp(0, -40, p);
          back.style.transform = `translate3d(0,${a.toFixed(1)}px,0)`;
          front.style.transform = `translate3d(0,${b.toFixed(1)}px,0)`;
          frame = 0;
        };
        box.addEventListener('scroll', () => {
          if (!frame) frame = requestAnimationFrame(update);
        }, { passive: true });
        update();
        return () => cancelAnimationFrame(frame);
      },
      notes: { motion: 'Parallax is removed entirely; both layers align.' },
    },
    {
      ids: [145, 191],
      name: 'Scroll snap, with an exit',
      summary: 'Cards snap one at a time, but a button moves the rail without a gesture and arrow keys work when the rail has focus.',
      html: `<div class="d-snap"><div class="d-snap__rail" data-snap tabindex="0" aria-label="Snapping cards">${['Fold', 'Current', 'Index', 'Relay'].map((n) => `<div class="d-snap__card">${n}</div>`).join('')}</div><div class="d-row"><button type="button" class="d-chip" data-snap-prev>← Previous</button><button type="button" class="d-chip" data-snap-next>Next →</button></div></div>`,
      init: ({ stage }) => {
        const rail = stage.querySelector<HTMLElement>('[data-snap]')!;
        const step = () => (rail.firstElementChild?.getBoundingClientRect().width ?? 240) + 10;
        stage.querySelector('[data-snap-prev]')!.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
        stage.querySelector('[data-snap-next]')!.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
        rail.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') rail.scrollBy({ left: step() });
          if (e.key === 'ArrowLeft') rail.scrollBy({ left: -step() });
        });
      },
      notes: { keyboard: 'Arrow keys scroll the focused rail; buttons are always visible.' },
    },
    {
      ids: [124],
      name: 'Velocity, then rest',
      summary: 'The card leans with scroll speed and settles when the panel stops. The angle is clamped to six degrees, so it never becomes a gimmick.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Velocity demo');
        box.innerHTML = `<div class="d-velocity"><article class="d-velocity__card" data-vcard><span>Scroll speed becomes tilt</span><b data-vnum>0.0°</b></article><div class="d-spacer"></div></div>`;
        const card = box.querySelector<HTMLElement>('[data-vcard]')!;
        const num = box.querySelector<HTMLElement>('[data-vnum]')!;
        let last = box.scrollTop;
        let angle = 0;
        let frame = 0;
        const loop = () => {
          const now = box.scrollTop;
          const delta = now - last;
          last = now;
          const target = clamp(delta * 0.22, -6, 6);
          angle += (target - angle) * 0.16;
          card.style.transform = `rotate(${(ctx.reduced ? 0 : angle).toFixed(2)}deg)`;
          num.textContent = `${(ctx.reduced ? 0 : angle).toFixed(1)}°`;
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
      },
      notes: { motion: 'Reduced motion shows 0° and no transform.' },
    },
    {
      ids: [141],
      name: 'A number that scrubs',
      summary: 'The figure is tied to the panel’s scroll position, not a timer. Scroll back up and it counts down; the value is also printed as text.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Scrubbed number demo');
        box.innerHTML = `<div class="d-countdemo"><p class="d-display" data-count>0</p><p class="d-cap">projects, if we were counting. We are not: this demo starts at zero and counts to 480 techniques.</p><div class="d-spacer"></div></div>`;
        const num = box.querySelector<HTMLElement>('[data-count]')!;
        const update = () => {
          num.textContent = String(Math.round(progress(box) * 480));
        };
        box.addEventListener('scroll', update, { passive: true });
        update();
      },
      notes: { motion: 'The same value is readable without animation.' },
    },
    {
      ids: [111, 114],
      name: 'Reveal on approach',
      summary: 'Blocks arrive when they enter the panel, not on a fixed delay. The observer is disconnected when the demo is destroyed.',
      html: '',
      init: (ctx) => {
        const box = scrollbox(ctx.stage, 'Reveal demo');
        box.innerHTML = `<div class="d-reveals">${['One', 'Two', 'Three', 'Four'].map((n) => `<p class="d-reveals__item" data-reveal-item>${n} — this paragraph arrives when it is reached.</p>`).join('')}<div class="d-spacer"></div></div>`;
        const items = [...box.querySelectorAll<HTMLElement>('[data-reveal-item]')];
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-on');
              io.unobserve(entry.target);
            });
          },
          { root: box, threshold: 0.6 },
        );
        items.forEach((item) => io.observe(item));
        return () => io.disconnect();
      },
      notes: { motion: 'All items start visible under reduced motion.', keyboard: 'Scrolling the region reveals them as it would with any content.' },
    },
    {
      ids: [117, 125, 126, 127, 128, 129, 132, 133, 135, 136, 137, 138, 139, 140, 142, 143, 144, 146, 147, 150],
      name: 'One scroll, many states',
      summary:
        'A single scrubbed sequence inside its own scroll region: type, crop, colour, depth, an SVG diagram and a card all read one progress value. It is the page-wide system at demo scale.',
      html: `<div class="d-seq" data-seq tabindex="0" role="region" aria-label="Scroll-driven sequence demo">
        <div class="d-seq__track">
          <div class="d-seq__stage">
            <div class="d-seq__field" data-field aria-hidden="true"></div>
            <div class="d-seq__back" data-back aria-hidden="true"></div>
            <p class="d-seq__type" data-seqtype>Scroll the region.<br>Everything here reads one number.</p>
            <div class="d-seq__crop"><img src="/assets/media/den-glow.webp" alt="Abstract orange field being cropped by scroll" loading="lazy" decoding="async"></div>
            <svg class="d-seq__diagram" viewBox="0 0 120 40" role="img" aria-label="Diagram whose connector draws as the region scrolls">
              <path d="M6 32 L34 12 L62 26 L92 8 L114 20" fill="none" stroke="currentColor" stroke-width="1.2" data-path/>
              <circle cx="6" cy="32" r="2.2"/><circle cx="62" cy="26" r="2.2" data-node/><circle cx="114" cy="20" r="2.2" data-node/>
            </svg>
            <div class="d-seq__chips" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
            <div class="d-seq__card" data-seqcard><b>Card expands</b><small>and settles</small></div>
            <p class="d-seq__read" data-seqread aria-live="off">0%</p>
          </div>
        </div>
      </div>`,
      init: ({ stage, reduced, onCleanup }) => {
        const box = stage.querySelector<HTMLElement>('[data-seq]')!;
        const type = stage.querySelector<HTMLElement>('[data-seqtype]')!;
        const crop = stage.querySelector<HTMLElement>('.d-seq__crop')!;
        const img = crop.querySelector('img')!;
        const field = stage.querySelector<HTMLElement>('[data-field]')!;
        const back = stage.querySelector<HTMLElement>('[data-back]')!;
        const path = stage.querySelector<SVGPathElement>('[data-path]')!;
        const card = stage.querySelector<HTMLElement>('[data-seqcard]')!;
        const chips = [...stage.querySelectorAll<HTMLElement>('.d-seq__chips i')];
        const read = stage.querySelector<HTMLElement>('[data-seqread]')!;
        const length = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 120;
        path.style.strokeDasharray = String(length);

        const paint = () => {
          const max = box.scrollHeight - box.clientHeight;
          const p = reduced ? 0.55 : Math.min(1, Math.max(0, box.scrollTop / Math.max(1, max)));
          type.style.transform = `translateY(${(1 - p) * 22}px)`;
          type.style.opacity = String(0.35 + p * 0.65);
          type.style.letterSpacing = `${-0.02 - p * 0.03}em`;
          crop.style.clipPath = `inset(${(1 - p) * 18}% ${(1 - p) * 26}% round 2px)`;
          img.style.objectPosition = `50% ${20 + p * 60}%`;
          field.style.background = `linear-gradient(${140 + p * 80}deg, #ff4a00 0%, hsl(${22 - p * 12} 100% ${58 - p * 26}%) 100%)`;
          back.style.transform = `translateY(${(1 - p) * -28}px) scale(${1 + p * 0.06})`;
          path.style.strokeDashoffset = String((1 - p) * length);
          card.style.transform = `translateY(${(1 - p) * 16}px) scale(${0.92 + p * 0.1})`;
          card.style.opacity = String(0.4 + p * 0.6);
          chips.forEach((chip, i) => {
            const angle = (i / chips.length) * Math.PI * 2;
            const spread = p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2;
            chip.style.transform = `translate(${Math.cos(angle) * spread * 46}px, ${Math.sin(angle) * spread * 30}px)`;
          });
          read.textContent = `${Math.round(p * 100)}%`;
        };

        box.addEventListener('scroll', paint, { passive: true });
        box.setAttribute('tabindex', '0');
        paint();
        onCleanup(() => box.removeEventListener('scroll', paint));
      },
      notes: {
        touch: 'Drag the region with a finger; native scrolling is used, with no hijacking.',
        keyboard: 'Focus the region and use Page Down / arrow keys; the readout and every visual follow the same number.',
        motion: 'At rest the sequence sits at a mid state: type, crop, diagram, card and all sections stay visible.',
      },
    },
  ],
};
