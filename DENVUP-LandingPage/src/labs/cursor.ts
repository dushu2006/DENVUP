import type { Lab } from './types';
import { clamp, magnetic, trackPointer } from './helpers';
import { icon } from '../render/html';

export const cursorLab: Lab = {
  slug: 'cursor',
  title: 'Pointer studies',
  blurb:
    'The cursor is the most-used tool on a website and the easiest thing to make worse. These demos add information, never friction — and every one has a keyboard or tap path.',
  modes: [
    {
      ids: [21, 22, 26, 27],
      name: 'A pointer that answers',
      summary: 'A dot and a ring replace the system cursor inside this panel only. The dot follows at once; the ring lags. Over a control, both grow and the ring reports what the control does.',
      html: `<div class="d-cursor-zone" data-zone>
        <p class="d-cap">Inside this panel the cursor is drawn by the page</p>
        <button type="button" class="d-btn d-btn--fill" data-cursor-target data-cursor-label="Press">Press me</button>
        <a class="d-btn d-btn--line" href="#pricing" data-cursor-target data-cursor-label="Go to pricing">See pricing</a>
        <span class="d-cursorfake" data-dot aria-hidden="true"></span>
        <span class="d-cursorfake d-cursorfake--ring" data-ring aria-hidden="true"><b data-ring-label></b></span>
        <p class="d-cap" data-zone-note aria-live="polite">No keyboard needed to use the buttons.</p>
      </div>`,
      init: (ctx) => {
        const { stage } = ctx;
        const zone = stage.querySelector<HTMLElement>('[data-zone]')!;
        const dot = stage.querySelector<HTMLElement>('[data-dot]')!;
        const ring = stage.querySelector<HTMLElement>('[data-ring]')!;
        const label = stage.querySelector<HTMLElement>('[data-ring-label]')!;
        const note = stage.querySelector<HTMLElement>('[data-zone-note]')!;
        const p = trackPointer(ctx, zone);
        let rx = 0.5;
        let ry = 0.5;
        let frame = 0;
        const paint = () => {
          rx += (p.x - rx) * 0.16;
          ry += (p.y - ry) * 0.16;
          dot.style.left = `${p.x * 100}%`;
          dot.style.top = `${p.y * 100}%`;
          ring.style.left = `${rx * 100}%`;
          ring.style.top = `${ry * 100}%`;
          frame = requestAnimationFrame(paint);
        };
        frame = requestAnimationFrame(paint);
        zone.addEventListener('pointerover', (event) => {
          const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor-target]');
          zone.classList.toggle('is-over', Boolean(target));
          label.textContent = target?.dataset.cursorLabel ?? '';
          if (target) note.textContent = `Ring label: “${target.dataset.cursorLabel}”. The button itself still works with Enter.`;
        });
        return () => cancelAnimationFrame(frame);
      },
      notes: { touch: 'The panel keeps a visible focus ring; the drawn pointer is hidden on coarse pointers.', keyboard: 'The drawn cursor is decorative; buttons remain native controls.' },
    },
    {
      ids: [23, 25, 35],
      name: 'Magnetic pull',
      summary: 'A button leans towards the pointer within a 90 px radius, then springs back. The transform is small, never enough to trap a click, and it is disabled for touch and reduced motion.',
      html: `<div class="d-magnetic"><p class="d-cap">Move near the button</p><button type="button" class="d-btn d-btn--solid" data-magnet>Start a project</button><p class="d-cap">Pull: 28% of the distance from the centre</p></div>`,
      init: (ctx) => {
        const { stage, touch, reduced } = ctx;
        const btn = stage.querySelector<HTMLButtonElement>('[data-magnet]')!;
        if (touch || reduced) {
          btn.classList.add('is-static');
          return;
        }
        magnetic(btn, ctx, 0.28);
      },
      notes: { touch: 'No pull; the button is a plain, large target.', motion: 'Static button under reduced motion.' },
    },
    {
      ids: [24, 48],
      name: 'Context labels',
      summary: 'Each card changes one floating word: open, read, listen, copy. The label follows the pointer and disappears on leave; the card title always says the same thing.',
      html: `<div class="d-labelzone" data-labels>
        <button type="button" class="d-labelcard" data-label="Open the manifesto">Point of view</button>
        <button type="button" class="d-labelcard" data-label="Read the process">Process</button>
        <button type="button" class="d-labelcard" data-label="Copy the email">Email</button>
        <span class="d-pointer-label" data-pointer aria-hidden="true"></span>
      </div>`,
      init: (ctx) => {
        const { stage } = ctx;
        const zone = stage.querySelector<HTMLElement>('[data-labels]')!;
        const marker = stage.querySelector<HTMLElement>('[data-pointer]')!;
        const move = (event: PointerEvent) => {
          const rect = zone.getBoundingClientRect();
          marker.style.left = `${event.clientX - rect.left}px`;
          marker.style.top = `${event.clientY - rect.top}px`;
          const card = (event.target as HTMLElement).closest<HTMLElement>('[data-label]');
          marker.textContent = card?.dataset.label ?? '';
          marker.classList.toggle('is-on', Boolean(card));
        };
        zone.addEventListener('pointermove', move);
        zone.addEventListener('pointerleave', () => marker.classList.remove('is-on'));
        return () => zone.removeEventListener('pointermove', move);
      },
      notes: { keyboard: 'Focusing a card shows the same word above it in the DOM order.', touch: 'Tapping opens the card target; the label is supplementary.' },
    },
    {
      ids: [31, 32, 45],
      name: 'Cursor as a brush',
      summary: 'The pointer draws on a canvas. Velocity sets the line width, so slow movement is fine and quick movement is bold. Clear it with a real button.',
      html: `<div class="d-brush"><canvas data-brush aria-label="Drawing area. Use the pointer to draw; the Clear button erases it."></canvas><p class="d-cap">Draw with mouse, pen or finger</p><button type="button" class="d-chip" data-brush-clear>Clear</button></div>`,
      init: ({ stage }) => {
        const canvas = stage.querySelector<HTMLCanvasElement>('[data-brush]')!;
        const c = canvas.getContext('2d');
        const clear = stage.querySelector<HTMLButtonElement>('[data-brush-clear]')!;
        if (!c) return;
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor((r.width || 300) * dpr);
          canvas.height = Math.floor((r.height || 220) * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
          c.lineCap = 'round';
          c.strokeStyle = '#ff4a00';
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        let drawing = false;
        let lx = 0;
        let ly = 0;
        const pos = (e: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          return { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const down = (e: PointerEvent) => {
          drawing = true;
          const p = pos(e);
          lx = p.x;
          ly = p.y;
          canvas.setPointerCapture(e.pointerId);
        };
        const move = (e: PointerEvent) => {
          if (!drawing) return;
          const p = pos(e);
          const speed = Math.hypot(p.x - lx, p.y - ly);
          c.lineWidth = clamp(22 - speed * 0.6, 2, 22);
          c.beginPath();
          c.moveTo(lx, ly);
          c.lineTo(p.x, p.y);
          c.stroke();
          lx = p.x;
          ly = p.y;
        };
        const up = () => {
          drawing = false;
        };
        canvas.addEventListener('pointerdown', down);
        canvas.addEventListener('pointermove', move);
        canvas.addEventListener('pointerup', up);
        canvas.addEventListener('pointercancel', up);
        clear.addEventListener('click', () => c.clearRect(0, 0, canvas.width, canvas.height));
        return () => {
          ro.disconnect();
          canvas.removeEventListener('pointerdown', down);
          canvas.removeEventListener('pointermove', move);
          canvas.removeEventListener('pointerup', up);
          canvas.removeEventListener('pointercancel', up);
        };
      },
      notes: { keyboard: 'Drawing is optional; the Clear button is reachable by keyboard.', touch: 'Pointer events cover pen and finger.' },
    },
    {
      ids: [33, 34, 36],
      name: 'Hover preview',
      summary: 'A small preview follows the pointer as you move down the list. On touch, tapping a row shows the same preview inline instead of hiding it.',
      html: `<div class="d-previewlist" data-previewlist>
        ${[
          ['A landing page that explains one offer', 'Fold', 'One screen, one argument, one next step.'],
          ['A site that behaves like a product', 'Current', 'State, feedback and pace borrowed from software.'],
          ['A library of interaction studies', 'Index', 'Small demos, labelled and searchable.'],
        ]
          .map(
            ([title, tag, copy], i) => `<button type="button" class="d-previewrow" data-preview="${i}" data-tag="${tag}" data-copy="${copy}">${icon('arrow-up-right')} ${title}</button>`,
          )
          .join('')}
        <div class="d-previewcard" data-previewcard aria-live="polite"><b data-preview-tag>Fold</b><span data-preview-copy>One screen, one argument, one next step.</span></div>
      </div>`,
      init: ({ stage }) => {
        const list = stage.querySelector<HTMLElement>('[data-previewlist]')!;
        const card = stage.querySelector<HTMLElement>('[data-previewcard]')!;
        const tag = stage.querySelector<HTMLElement>('[data-preview-tag]')!;
        const copy = stage.querySelector<HTMLElement>('[data-preview-copy]')!;
        let i = 0;
        list.querySelectorAll<HTMLElement>('[data-preview]').forEach((row) => {
          row.addEventListener('pointerenter', () => {
            tag.textContent = row.dataset.tag ?? '';
            copy.textContent = row.dataset.copy ?? '';
            card.classList.add('is-on');
          });
          row.addEventListener('focus', () => {
            tag.textContent = row.dataset.tag ?? '';
            copy.textContent = row.dataset.copy ?? '';
            card.classList.add('is-on');
          });
          row.addEventListener('click', () => {
            i = (i + 1) % 3;
            card.classList.toggle('is-open', i % 2 === 0);
            row.classList.toggle('is-on');
          });
        });
        const move = (e: PointerEvent) => {
          const r = list.getBoundingClientRect();
          card.style.setProperty('--mx', `${clamp((e.clientX - r.left) / r.width) * 100}%`);
        };
        list.addEventListener('pointermove', move);
        list.addEventListener('pointerleave', () => card.classList.remove('is-on'));
        return () => list.removeEventListener('pointermove', move);
      },
      notes: { touch: 'Tap a row; the preview stays visible as a card below the list.', keyboard: 'Focusing a row updates the card.' },
    },
    {
      ids: [28, 29, 30],
      name: 'Difference and trail',
      summary: 'One dot uses mix-blend-mode: difference so it stays visible on both fields. A twelve-dot trail shows how much smoothing is too much.',
      html: `<div class="d-blend"><div class="d-blend__field"><span>paper</span></div><div class="d-blend__field d-blend__field--ink"><span>ink</span></div><div class="d-blend__dot" data-blend aria-hidden="true"></div><p class="d-blend__note">Blend mode: <button type="button" class="d-chip" data-blend-toggle aria-pressed="true">difference</button></p></div>`,
      init: (ctx) => {
        const { stage, raf } = ctx;
        const root = stage.querySelector<HTMLElement>('.d-blend')!;
        const dot = stage.querySelector<HTMLElement>('[data-blend]')!;
        const toggle = stage.querySelector<HTMLButtonElement>('[data-blend-toggle]')!;
        const trail = Array.from({ length: 12 }, () => {
          const el = document.createElement('span');
          el.className = 'd-trail-dot';
          root.append(el);
          return el;
        });
        const p = trackPointer(ctx, root);
        const pts = trail.map(() => ({ x: 0.5, y: 0.5 }));
        raf(() => {
          dot.style.left = `${p.x * 100}%`;
          dot.style.top = `${p.y * 100}%`;
          pts.forEach((pt, i) => {
            const target = i === 0 ? p : pts[i - 1]!;
            pt.x += (target.x - pt.x) * 0.28;
            pt.y += (target.y - pt.y) * 0.28;
            const el = trail[i]!;
            el.style.left = `${pt.x * 100}%`;
            el.style.top = `${pt.y * 100}%`;
            el.style.opacity = String(1 - i / trail.length);
          });
        });
        toggle.addEventListener('click', () => {
          const diff = toggle.getAttribute('aria-pressed') === 'true';
          toggle.setAttribute('aria-pressed', String(!diff));
          toggle.textContent = diff ? 'normal' : 'difference';
          dot.classList.toggle('is-normal', diff);
        });
      },
      notes: { motion: 'Trail is hidden under reduced motion; the dot stays.', keyboard: 'The blend-mode button toggles the state by keyboard.' },
    },
    {
      ids: [37, 38, 39, 40],
      name: 'A nav that follows',
      summary: 'A magnetic underline sits under the pointer and snaps to focus. The links are ordinary anchors; the underline is decoration with no hit area.',
      html: `<nav class="d-magnetnav" data-magnetnav aria-label="Demo navigation"><a href="#services" data-navitem>Services</a><a href="#process" data-navitem>Process</a><a href="#pricing" data-navitem>Pricing</a><a href="#contact" data-navitem>Contact</a><span class="d-magnetnav__line" data-navline aria-hidden="true"></span></nav>`,
      init: ({ stage }) => {
        const nav = stage.querySelector<HTMLElement>('[data-magnetnav]')!;
        const line = stage.querySelector<HTMLElement>('[data-navline]')!;
        const items = [...nav.querySelectorAll<HTMLElement>('[data-navitem]')];
        const moveTo = (el: HTMLElement) => {
          const nr = nav.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          line.style.left = `${r.left - nr.left}px`;
          line.style.width = `${r.width}px`;
        };
        items.forEach((item) => {
          item.addEventListener('pointerenter', () => moveTo(item));
          item.addEventListener('focus', () => moveTo(item));
          item.addEventListener('click', () => moveTo(item));
        });
        if (items[0]) moveTo(items[0]);
      },
      notes: { keyboard: 'Focus moves the underline to the same place as hover.' },
    },
    {
      ids: [41, 42, 43, 44],
      name: 'Spotlight reveal',
      summary: 'A dark panel hides a sentence; the pointer opens a soft window onto it. The whole sentence is in the DOM and appears fully under keyboard focus or reduced motion.',
      html: `<div class="d-spotlight" data-spotlight tabindex="0" aria-label="Hidden message: we build websites that behave like places, not brochures."><p>We build websites that behave like places, not brochures.</p><span class="d-spotlight__lamp" aria-hidden="true"></span><button type="button" class="d-chip" data-spot-on>Show me</button></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLElement>('[data-spotlight]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-spot-on]')!;
        const move = (e: PointerEvent) => {
          const r = box.getBoundingClientRect();
          box.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`);
          box.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`);
        };
        box.addEventListener('pointermove', move);
        box.addEventListener('focus', () => box.classList.add('is-lit'));
        box.addEventListener('blur', () => box.classList.remove('is-lit'));
        btn.addEventListener('click', () => box.classList.toggle('is-lit'));
        return () => box.removeEventListener('pointermove', move);
      },
      notes: { keyboard: 'Focusing the panel or pressing Show me reveals the whole sentence.', motion: 'Reduced motion starts fully lit.' },
    },
    {
      ids: [46, 47, 49, 50],
      name: 'Cursor states',
      summary: 'One control cycles through the four states a drawn cursor needs: default, over a link, pressing, and disabled. The label is text, not colour alone.',
      html: `<div class="d-cursorstates"><div class="d-cursorfake d-cursorfake--ring is-static" data-state-ring aria-hidden="true"><b>default</b></div><button type="button" class="d-chip" data-state-next>Next state</button><p class="d-cap" data-state-copy>Default: a small ring with no label.</p></div>`,
      init: ({ stage }) => {
        const ring = stage.querySelector<HTMLElement>('[data-state-ring]')!;
        const label = ring.querySelector('b')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-state-next]')!;
        const copy = stage.querySelector<HTMLElement>('[data-state-copy]')!;
        const states = [
          ['default', 'Default: a small ring with no label.'],
          ['over', 'Over a link: the ring grows and says Open.'],
          ['down', 'Pressing: the ring tightens to 80%.'],
          ['disabled', 'Disabled: a slash, and the label says unavailable.'],
        ];
        let i = 0;
        btn.addEventListener('click', () => {
          i = (i + 1) % states.length;
          const [state, text] = states[i]!;
          ring.dataset.state = state;
          label.textContent = state === 'over' ? 'Open' : state === 'disabled' ? 'Unavailable' : state;
          copy.textContent = text;
        });
      },
      notes: { touch: 'States are shown as a labelled diagram, not a requirement.', keyboard: 'The cycle is a button with a live description.' },
    },
  ],
};
