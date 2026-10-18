import type { Lab } from './types';
import { clamp, makeCanvas } from './helpers';

export const loadersLab: Lab = {
  slug: 'loaders',
  title: 'Opening acts',
  blurb:
    'The first two seconds decide whether a visitor stays. A loader is a promise: something is being prepared. These are short, skippable and silent by default.',
  modes: [
    {
      ids: [1, 2, 6],
      name: 'Count to ready',
      summary: 'A real counter that stops when the work is done. The number is not theatre: the demo measures its own decode and reports the elapsed time.',
      html: `<div class="d-loader" data-count-loader><span class="d-loader__word">DENVUP</span><span class="d-loader__count" data-count>00</span><span class="d-loader__note" data-count-note>preparing the plate</span></div>`,
      init: ({ stage, timeout }) => {
        const root = stage.querySelector<HTMLElement>('[data-count-loader]')!;
        const num = stage.querySelector<HTMLElement>('[data-count]')!;
        const note = stage.querySelector<HTMLElement>('[data-count-note]')!;
        const started = performance.now();
        const image = new Image();
        image.src = '/assets/media/den-glow.webp';
        let value = 0;
        const tick = () => {
          const target = image.complete ? 100 : Math.min(92, 12 + (performance.now() - started) / 22);
          value += Math.max(0.8, (target - value) * 0.12);
          num.textContent = String(Math.round(value)).padStart(2, '0');
          if (value >= 99.4) {
            root.classList.add('is-done');
            num.textContent = '100';
            note.textContent = `decoded in ${Math.round(performance.now() - started)} ms — then the page can move`;
            return;
          }
          timeout(tick, 55);
        };
        tick();
      },
      notes: { motion: 'Under reduced motion the count is replaced by the word Ready plus the timing sentence.', keyboard: 'No interaction is required; nothing blocks the page.' },
    },
    {
      ids: [3, 4, 7],
      name: 'Words, not noise',
      summary: 'A line of type assembles word by word, then resolves. The sentence says what is happening, so the wait has meaning.',
      html: `<div class="d-loader d-loader--words"><p class="d-loader__line" data-line></p><p class="d-loader__note">Six words, 380 ms apart</p></div>`,
      init: ({ stage, timeout }) => {
        const line = stage.querySelector<HTMLElement>('[data-line]')!;
        const words = ['A', 'site', 'is', 'being', 'built.', 'Wait.'];
        line.replaceChildren(
          ...words.map((word) => {
            const span = document.createElement('span');
            span.className = 'd-word';
            const inner = document.createElement('span');
            inner.textContent = word;
            span.append(inner);
            return span;
          }),
        );
        const spans = [...line.querySelectorAll<HTMLElement>('.d-word')];
        spans.forEach((span, i) => timeout(() => span.classList.add('is-on'), i * 380));
        timeout(() => {
          line.classList.add('is-done');
          spans.forEach((span) => span.classList.add('is-on'));
        }, words.length * 380 + 700);
      },
      notes: { keyboard: 'The loader is not focusable and does not trap focus.' },
    },
    {
      ids: [5, 8],
      name: 'The mark arrives',
      summary: 'The supplied logo is revealed by a clip-path wipe. The artwork is not redrawn or stretched; only the reveal is animated.',
      html: `<div class="d-loader d-loader--mark"><div class="d-logo-reveal" data-logo><img src="/assets/brand/logo-colour-360.webp" width="360" height="360" alt="The supplied DENVUP mark" loading="lazy"></div><p class="d-loader__note">clip-path reveal · no redraw</p></div>`,
      init: ({ stage, timeout }) => {
        const mark = stage.querySelector<HTMLElement>('[data-logo]')!;
        timeout(() => mark.classList.add('is-on'), 150);
      },
      notes: { motion: 'Reduced motion shows the mark immediately, without the wipe.' },
    },
    {
      ids: [9, 18],
      name: 'Bar and percentage',
      summary: 'A determinate bar with a percentage label. Both stop at 100 and then leave the screen; nothing loops forever.',
      html: `<div class="d-loader d-loader--bar"><div class="d-progressbar"><i data-bar></i></div><p class="d-loader__note"><span data-bar-pct>0%</span> — decoding the first chapter</p></div>`,
      init: ({ stage, timeout }) => {
        const bar = stage.querySelector<HTMLElement>('[data-bar]')!;
        const pct = stage.querySelector<HTMLElement>('[data-bar-pct]')!;
        bar.style.width = '8%';
        let n = 8;
        const step = () => {
          n = Math.min(100, n + Math.random() * 16);
          bar.style.width = `${n}%`;
          pct.textContent = `${Math.round(n)}%`;
          if (n < 100) timeout(step, 120);
          else pct.textContent = '100% — ready';
        };
        timeout(step, 160);
      },
      notes: { keyboard: 'The bar is decorative and aria-hidden; the percentage is plain text.' },
    },
    {
      ids: [13],
      name: 'Pour and settle',
      summary: 'The field fills from the bottom like liquid, then settles into the colour of the next chapter. One property moves; no layout thrash.',
      html: `<div class="d-loader d-loader--pour"><div class="d-pour"><i data-pour></i><span>filling</span></div><p class="d-loader__note">transform: translateY()</p></div>`,
      init: ({ stage, timeout }) => {
        const fill = stage.querySelector<HTMLElement>('[data-pour]')!;
        timeout(() => {
          fill.style.transform = 'translateY(0)';
        }, 120);
        timeout(() => {
          fill.style.transform = 'translateY(-101%)';
        }, 2400);
      },
      notes: { motion: 'The fill is skipped; the label remains.' },
    },
    {
      ids: [11],
      name: 'Sweep',
      summary: 'A single highlight sweeps across the wordmark. The animation is one transform on a mask, which is why it stays cheap.',
      html: `<div class="d-loader d-loader--sweep"><p class="d-sweep">DENVUP</p><p class="d-loader__note">one transform, one mask</p></div>`,
      init: ({ stage, timeout }) => {
        const el = stage.querySelector<HTMLElement>('.d-sweep')!;
        timeout(() => el.classList.add('is-on'), 100);
      },
      notes: { motion: 'Reduced motion shows the plain wordmark.' },
    },
    {
      ids: [12],
      name: 'Iris open',
      summary: 'A circular aperture opens onto the page underneath. The content behind is live, not a screenshot.',
      html: `<div class="d-loader d-loader--iris"><div class="d-iris" data-iris><span>Behind the aperture</span></div><p class="d-loader__note">clip-path: circle()</p></div>`,
      init: ({ stage, timeout }) => {
        const iris = stage.querySelector<HTMLElement>('[data-iris]')!;
        timeout(() => iris.classList.add('is-on'), 120);
      },
      notes: { motion: 'The aperture starts open under reduced motion.' },
    },
    {
      ids: [14],
      name: 'Particle convergence',
      summary: 'Scattered points find their places and settle into the loop of the mark. The loop is drawn from the supplied geometry, not traced by eye.',
      html: '',
      size: 'default',
      init: (ctx) => {
        const kit = makeCanvas(ctx, 'd-canvas');
        const c = kit.ctx;
        const dots = Array.from({ length: 260 }, (_, i) => {
          const angle = (i / 260) * Math.PI * 2;
          return {
            x: Math.random(),
            y: Math.random(),
            tx: 0.5 + Math.cos(angle) * 0.28,
            ty: 0.5 + Math.sin(angle) * 0.28,
            size: 1.5 + Math.random() * 1.6,
          };
        });
        const started = performance.now();
        ctx.raf((time) => {
          const t = time - started;
          const w = kit.width;
          const h = kit.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          const settle = ctx.reduced ? 1 : clamp(t / 2200);
          dots.forEach((dot) => {
            const x = dot.x + (dot.tx - dot.x) * settle;
            const y = dot.y + (dot.ty - dot.y) * settle;
            c.fillStyle = settle > 0.85 ? '#ff4a00' : 'rgba(255,255,255,.55)';
            c.fillRect(x * w, y * h, dot.size, dot.size);
          });
          c.fillStyle = '#fff';
          c.font = '600 14px system-ui';
          c.fillText(settle > 0.9 ? 'the loop is the idea' : 'finding the shape', 12, h - 14);
        });
      },
      notes: { motion: 'Reduced motion draws the settled frame once.', touch: 'No dragging required.' },
    },
    {
      ids: [16],
      name: 'Staggered first screen',
      summary: 'Three bands of the first screen arrive in sequence. The order matches reading order, so attention lands where the sentence starts.',
      html: `<div class="d-stagger" data-stagger><span>Built in the den.</span><span>Made to move.</span><span>Live in weeks, not quarters.</span></div>`,
      init: ({ stage, timeout }) => {
        const root = stage.querySelector<HTMLElement>('[data-stagger]')!;
        root.querySelectorAll('span').forEach((span, i) => {
          timeout(() => span.classList.add('is-on'), i * 180);
        });
      },
      notes: { keyboard: 'All three lines are present in the DOM from the start.' },
    },
    {
      ids: [17, 19],
      name: 'A real load',
      summary: 'This one waits for the actual file: it streams the 800px artwork, reports decoded progress, then shows the result. If the file is missing, it says so.',
      html: `<div class="d-loader d-loader--real"><div class="d-real" data-real><span>requesting /assets/media/den-glow.webp</span></div><p class="d-loader__note" data-real-note>Nothing loaded yet</p></div>`,
      init: ({ stage, timeout }) => {
        const host = stage.querySelector<HTMLElement>('[data-real]')!;
        const note = stage.querySelector<HTMLElement>('[data-real-note]')!;
        let url: string | null = null;
        const controller = new AbortController();
        const run = async () => {
          try {
            note.textContent = 'Streaming the file…';
            const response = await fetch('/assets/media/den-glow.webp', { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const total = Number(response.headers.get('content-length') ?? 0);
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No stream');
            const chunks: Uint8Array[] = [];
            let received = 0;
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                chunks.push(value);
                received += value.length;
                note.textContent = total ? `${Math.round((received / total) * 100)}% of the file received` : `${received} bytes received`;
              }
            }
            url = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'image/webp' }));
            const img = new Image();
            img.src = url;
            img.alt = 'The generated artwork this demo loaded';
            img.width = 400;
            img.height = 300;
            await img.decode();
            host.replaceChildren(img);
            note.textContent = `Loaded ${received} bytes and decoded it. This is a real load, not a timer.`;
          } catch (error) {
            if ((error as Error).name === 'AbortError') return;
            host.textContent = 'The file could not be loaded. This box still holds its space, and the rest of the page is unaffected.';
            note.textContent = 'A designed failure state, not an endless spinner.';
          }
          timeout(() => undefined, 0);
        };
        void run();
        return () => {
          controller.abort();
          if (url) URL.revokeObjectURL(url);
        };
      },
      notes: { motion: 'Nothing animates; progress is text.', touch: 'No interaction.' },
    },
    {
      ids: [10],
      name: 'Curtain up',
      summary: 'Two panels split and lift, revealing the chapter beneath. The panels are decorative and never hide content from a screen reader.',
      html: `<div class="d-curtain" data-curtain><div class="d-curtain__panel"></div><div class="d-curtain__panel"></div><div class="d-curtain__content"><p class="d-h">Chapter two</p><p class="d-cap">The page was here all along</p></div></div>`,
      init: ({ stage, timeout }) => {
        const curtain = stage.querySelector<HTMLElement>('[data-curtain]')!;
        timeout(() => curtain.classList.add('is-on'), 200);
      },
      notes: { keyboard: 'The content is ordinary text; the panels are aria-hidden.' },
    },
    {
      ids: [15, 20],
      name: 'Cinematic open',
      summary: 'A quiet title card with a visible skip control. It leaves on its own after four seconds, and the skip button is first in the tab order.',
      html: `<div class="d-intro" data-intro><p class="d-intro__line">Some things still deserve an opening.</p><button type="button" class="d-chip" data-intro-skip>Skip</button></div>`,
      init: ({ stage, timeout }) => {
        const intro = stage.querySelector<HTMLElement>('[data-intro]')!;
        const skip = stage.querySelector<HTMLButtonElement>('[data-intro-skip]')!;
        const close = () => intro.classList.add('is-done');
        skip.addEventListener('click', close);
        timeout(close, 4200);
      },
      notes: { keyboard: 'The skip button is focusable and closes the card.', motion: 'No fade; the card is simply removed.' },
    },
  ],
};
