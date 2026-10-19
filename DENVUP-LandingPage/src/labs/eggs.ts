import type { Lab } from './types';

export const eggsLab: Lab = {
  slug: 'eggs',
  title: 'Small secrets',
  blurb:
    'Details that reward attention without withholding anything. Each one has a plain alternative, works with a keyboard, and disappears under reduced motion.',
  modes: [
    {
      ids: [396, 409],
      name: 'The mark has another state',
      summary: 'Hover or focus the supplied mark to reveal an annotated detail. The artwork itself is untouched; the annotation is drawn around it.',
      html: `<div class="d-markstates"><p class="d-cap">Hover or focus the plate</p><button type="button" class="d-markstates__stage" data-mark aria-describedby="mark-note"><img src="/assets/brand/logo-black-360.webp" width="360" height="360" alt="The supplied DENVUP mark"><span class="d-markstates__ring" aria-hidden="true"></span></button><p class="d-cap" id="mark-note" data-mark-note aria-live="polite">The loop is the part that moves in the brand animation.</p></div>`,
      init: ({ stage }) => {
        const mark = stage.querySelector<HTMLButtonElement>('[data-mark]')!;
        const note = stage.querySelector<HTMLElement>('[data-mark-note]')!;
        const show = () => {
          mark.classList.add('is-on');
          note.textContent = 'The loop is the part that moves in the brand animation. The file is never redrawn or stretched.';
        };
        mark.addEventListener('focus', show);
        mark.addEventListener('pointerenter', show);
        mark.addEventListener('pointerleave', () => mark.classList.remove('is-on'));
        mark.addEventListener('blur', () => mark.classList.remove('is-on'));
        mark.addEventListener('click', show);
      },
      notes: { keyboard: 'Focus reveals the same note as hover.', touch: 'Tap to hold the annotation.' },
    },
    {
      ids: [401, 408],
      name: 'Reveal a principle',
      summary: 'A button uncovers one working principle with a wipe. The content is in the page, not in a tooltip; it is simply hidden until asked for.',
      html: `<div class="d-reveal-principle"><button type="button" class="d-reveal-principle__btn" data-reveal aria-expanded="false">Why this studio?</button><p class="d-reveal-principle__note" data-reveal-note>Press to reveal a working principle.</p></div>`,
      init: ({ stage, reduced }) => {
        const btn = stage.querySelector<HTMLButtonElement>('[data-reveal]')!;
        const note = stage.querySelector<HTMLElement>('[data-reveal-note]')!;
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!open));
          note.textContent = open
            ? 'Press to reveal a working principle.'
            : 'Motion is a sentence. If it does not help someone understand what changed, it is removed.';
          if (!reduced) {
            note.animate?.(
              [
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0 0 0)' },
              ],
              { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' },
            );
          }
        });
      },
      notes: { keyboard: 'aria-expanded reports the state; the text is real content.' },
    },
    {
      ids: [398, 405],
      name: 'Secret mode with an exit',
      summary: 'A temporary visual mode, clearly labelled, with an obvious way back. Nothing is stored, and a reload restores the page.',
      html: `<div class="d-denmode" data-den><p class="d-cap">A room inside the page</p><p class="d-h" data-den-title>The den, briefly.</p><button type="button" class="d-chip" data-den-toggle aria-pressed="false">Enter the den</button><p class="d-cap" data-den-note aria-live="polite">The page stays exactly where it is.</p></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLElement>('[data-den]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-den-toggle]')!;
        const note = stage.querySelector<HTMLElement>('[data-den-note]')!;
        btn.addEventListener('click', () => {
          const on = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!on));
          box.classList.toggle('is-den', !on);
          btn.textContent = on ? 'Enter the den' : 'Leave the den';
          note.textContent = on ? 'The page stays exactly where it is.' : 'You are in the den: the field is orange, and the exit is the same button.';
        });
      },
      notes: { motion: 'The change is a flat colour swap, not a flash.', keyboard: 'The toggle keeps focus and reports its state.' },
    },
    {
      ids: [399],
      name: 'Click the field',
      summary: 'Each press leaves a ring and connects to the previous point. It is decoration with a reset and a hard cap, never an obstacle.',
      html: `<div class="d-cursor-zone" data-clickfield style="margin:1rem;background:var(--ink);color:var(--bone);border:none"><svg class="d-connect" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg><p class="d-cap" style="color:rgba(255,255,255,.6);position:relative;z-index:2">Click or tap five times</p><button type="button" class="d-chip" data-click-reset style="position:relative;z-index:2">Reset</button></div>`,
      init: ({ stage }) => {
        const field = stage.querySelector<HTMLElement>('[data-clickfield]')!;
        const svg = field.querySelector<SVGSVGElement>('.d-connect')!;
        const points: [number, number][] = [];
        const reset = () => {
          points.length = 0;
          field.querySelectorAll('.d-click-dot, .d-click-ring').forEach((n) => n.remove());
          svg.replaceChildren();
        };
        field.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          if (target.closest('button')) return;
          const rect = field.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          const dot = document.createElement('span');
          dot.className = 'd-click-dot';
          dot.style.left = `${x}%`;
          dot.style.top = `${y}%`;
          const ring = document.createElement('span');
          ring.className = 'd-click-ring';
          ring.style.left = `${x}%`;
          ring.style.top = `${y}%`;
          field.append(dot, ring);
          window.setTimeout(() => ring.remove(), 900);
          points.push([x, y]);
          if (points.length > 5) points.shift();
          svg.replaceChildren();
          for (let i = 1; i < points.length; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', String(points[i - 1]![0]));
            line.setAttribute('y1', String(points[i - 1]![1]));
            line.setAttribute('x2', String(points[i]![0]));
            line.setAttribute('y2', String(points[i]![1]));
            line.setAttribute('stroke', 'rgba(255,74,0,.45)');
            line.setAttribute('stroke-width', '0.4');
            svg.append(line);
          }
          if (field.querySelectorAll('.d-click-dot').length > 5) field.querySelector('.d-click-dot')?.remove();
        });
        field.querySelector('[data-click-reset]')!.addEventListener('click', reset);
      },
      notes: { touch: 'Tap works; the reset is a button.', keyboard: 'The decorative field is not required to use the page.' },
    },
    {
      ids: [400, 402],
      name: 'A constellation of links',
      summary: 'Five real links arranged as a small map. Hover or focus draws a line; the links work without it.',
      html: `<div class="d-linkcloud">${[
        ['Studio', '#manifesto'],
        ['Services', '#services'],
        ['Capabilities', '#capabilities'],
        ['Pricing', '#pricing'],
        ['Contact', '#contact'],
      ]
        .map(([label, href]) => `<a href="${href}" data-link>${label}</a>`)
        .join('')}</div>`,
      init: ({ stage }) => {
        const anchors = [...stage.querySelectorAll<HTMLAnchorElement>('[data-link]')];
        anchors.forEach((a) => {
          a.addEventListener('pointerenter', () => a.classList.add('is-on'));
          a.addEventListener('pointerleave', () => a.classList.remove('is-on'));
          a.addEventListener('focus', () => a.classList.add('is-on'));
          a.addEventListener('blur', () => a.classList.remove('is-on'));
        });
      },
      notes: {
        keyboard: 'Tab through the five links; focus draws the same connecting line.',
        touch: 'Tap a link directly — the line appears on focus and the link still opens.',
      },
    },
  ],
};
