import type { Lab } from './types';

export const engineeringLab: Lab = {
  slug: 'engineering',
  title: 'Engineering & restraint',
  blurb:
    'The unglamorous half of motion: budgets, lazy work, pause when unseen, and fallbacks that are designed rather than improvised.',
  modes: [
    {
      ids: [443, 450, 459],
      name: 'Frame meter and a particle cap',
      summary: 'A live frame meter beside a canvas with a hard particle cap. The slider refuses to go past the budget the page sets.',
      html: `<div class="d-perf"><canvas data-perf aria-hidden="true"></canvas><p class="d-perf__hud" data-perf-hud>measuring…</p></div><div class="d-row" style="padding:0 1rem 1rem"><label class="d-cap" for="perf-count">Particles</label><input class="d-slider" id="perf-count" type="range" min="0" max="1200" step="100" value="600" data-perf-count><span class="d-cap" data-perf-note>600 / 1200 cap</span></div>`,
      init: (ctx) => {
        const canvas = ctx.stage.querySelector<HTMLCanvasElement>('[data-perf]')!;
        const hud = ctx.stage.querySelector<HTMLElement>('[data-perf-hud]')!;
        const range = ctx.stage.querySelector<HTMLInputElement>('[data-perf-count]')!;
        const note = ctx.stage.querySelector<HTMLElement>('[data-perf-note]')!;
        const c = canvas.getContext('2d');
        if (!c) return;
        let count = Number(range.value);
        range.addEventListener('input', () => {
          count = Math.min(1200, Number(range.value));
          note.textContent = `${count} / 1200 cap`;
        });

        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(rect.width * dpr);
          canvas.height = Math.floor(rect.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        let frames = 0;
        let windowStart = performance.now();
        const dots = Array.from({ length: 1200 }, () => ({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0006,
          vy: (Math.random() - 0.5) * 0.0006,
        }));

        ctx.raf((time, delta) => {
          if (ctx.reduced && frames > 1) return;
          const rect = canvas.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          c.fillStyle = '#ff4a00';
          for (let i = 0; i < count; i++) {
            const dot = dots[i]!;
            dot.x += dot.vx * delta;
            dot.y += dot.vy * delta;
            if (dot.x < 0 || dot.x > 1) dot.vx *= -1;
            if (dot.y < 0 || dot.y > 1) dot.vy *= -1;
            c.fillRect(dot.x * w, dot.y * h, 2, 2);
          }
          frames += 1;
          if (time - windowStart > 500) {
            const fps = Math.round((frames * 1000) / (time - windowStart));
            hud.textContent = `${fps} fps · ${count} particles · ${w.toFixed(0)}×${h.toFixed(0)} CSS px`;
            frames = 0;
            windowStart = time;
          }
        });
        ctx.onCleanup(() => {
          hud.textContent = 'meter stopped';
        });
      },
      notes: { motion: 'Reduced motion draws one frame, then stops the loop.', touch: 'The slider is a native range input.' },
    },
    {
      ids: [446, 453],
      name: 'Lazy load, reserved box',
      summary: 'The box has a fixed ratio before the image exists, so nothing jumps. Loading starts only when asked, and the elapsed time is reported.',
      html: `<div class="d-lazy"><div class="d-lazy__box" data-lazy-box><span data-lazy-label>16:10 reserved · image not requested</span></div></div><div class="d-row" style="padding:0 1rem 1rem"><button type="button" class="d-btn" data-lazy-load>Load the image</button><span class="d-cap" data-lazy-time aria-live="polite">No request made yet.</span></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLElement>('[data-lazy-box]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-lazy-load]')!;
        const time = stage.querySelector<HTMLElement>('[data-lazy-time]')!;
        btn.addEventListener('click', () => {
          btn.disabled = true;
          time.textContent = 'Requesting…';
          const started = performance.now();
          const img = new Image();
          img.src = '/assets/media/den-glow.webp';
          img.alt = 'Generated glow artwork used as a placeholder demonstration';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.width = 800;
          img.height = 500;
          img.addEventListener('load', () => {
            box.replaceChildren(img);
            time.textContent = `Loaded in ${Math.round(performance.now() - started)} ms. The box never changed size.`;
          });
          img.addEventListener('error', () => {
            time.textContent = 'The image could not be loaded. The reserved box still holds the layout.';
            btn.disabled = false;
          });
        });
      },
      notes: { motion: 'Nothing moves; the reserved ratio prevents layout shift.' },
    },
    {
      ids: [451, 442],
      name: 'Offscreen pause',
      summary: 'An IntersectionObserver stops the loop when the demo leaves the viewport. The count shows what the observer currently believes.',
      html: `<div class="d-offscreen" data-offscreen><span data-offscreen-state>Waiting for the observer…</span><small data-offscreen-count>0 frames rendered</small></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLElement>('[data-offscreen]')!;
        const state = stage.querySelector<HTMLElement>('[data-offscreen-state]')!;
        const count = stage.querySelector<HTMLElement>('[data-offscreen-count]')!;
        let frames = 0;
        let visible = false;
        const io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              visible = entry.isIntersecting;
              state.textContent = visible ? 'Visible — the loop is running.' : 'Offscreen — the loop is paused.';
              box.classList.toggle('is-on', visible);
            }
          },
          { threshold: 0.25 },
        );
        io.observe(box);
        const raf = (time: number) => {
          if (visible) {
            frames += 1;
            count.textContent = `${frames} frames rendered · ${Math.round(time / 1000)}s since start`;
          }
          requestAnimationFrame(raf);
        };
        const id = requestAnimationFrame(raf);
        return () => {
          io.disconnect();
          cancelAnimationFrame(id);
        };
      },
      notes: { motion: 'The pause is real: no frames are counted while offscreen.' },
    },
    {
      ids: [444, 452],
      name: 'Debounce and throttle',
      summary: 'One handler runs for every event; the other is throttled. Move the pointer across the strip and compare the counts.',
      html: `<div class="d-events"><div class="d-cursor-zone" data-throttle-zone style="margin:0;min-height:10rem">Move across this strip</div><div class="d-events__counts"><span>raw: <b data-raw>0</b></span><span>throttled: <b data-throttled>0</b></span><span>debounced: <b data-debounced>0</b></span></div><p class="d-cap">Throttled at 80 ms; debounced at 240 ms after the last move. The raw count is what the browser actually delivered.</p></div>`,
      init: ({ stage, onCleanup }) => {
        const zone = stage.querySelector<HTMLElement>('[data-throttle-zone]')!;
        const raw = stage.querySelector<HTMLElement>('[data-raw]')!;
        const thr = stage.querySelector<HTMLElement>('[data-throttled]')!;
        const deb = stage.querySelector<HTMLElement>('[data-debounced]')!;
        let rawCount = 0;
        let thrCount = 0;
        let debCount = 0;
        let last = 0;
        let timer = 0;
        const move = () => {
          rawCount += 1;
          raw.textContent = String(rawCount);
          const now = performance.now();
          if (now - last > 80) {
            last = now;
            thrCount += 1;
            thr.textContent = String(thrCount);
          }
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            debCount += 1;
            deb.textContent = String(debCount);
          }, 240);
        };
        zone.addEventListener('pointermove', move);
        onCleanup(() => {
          zone.removeEventListener('pointermove', move);
          window.clearTimeout(timer);
        });
      },
      notes: { touch: 'Drag across the strip; touchmove counts too.' },
    },
    {
      ids: [455, 456],
      name: 'Fallback and restraint',
      summary: 'A capability report read from the browser, plus what the site does when each capability is missing. No claim is made for a feature that is not detected.',
      html: `<div class="d-fallback"><p class="d-h">What this browser reports</p><ul class="d-events__counts" data-cap-list></ul><p class="d-fallback__state" data-cap-state>Checking…</p><p class="d-cap">The site caps device pixel ratio at 2, caps particles, pauses offscreen work and never autoplays sound.</p></div>`,
      init: ({ stage }) => {
        const list = stage.querySelector<HTMLElement>('[data-cap-list]')!;
        const state = stage.querySelector<HTMLElement>('[data-cap-state]')!;
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
        const rows: [string, string][] = [
          ['WebGL', gl ? 'available' : 'not available — CSS fallback'],
          ['Reduced motion', window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'requested' : 'not requested'],
          ['Save-Data', (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ? 'on — heavy media skipped' : 'off or unknown'],
          ['Hover', window.matchMedia('(hover: hover)').matches ? 'available' : 'none — tap paths used'],
        ];
        list.replaceChildren(
          ...rows.map(([label, value]) => {
            const li = document.createElement('span');
            li.textContent = `${label}: ${value}`;
            return li;
          }),
        );
        state.textContent = gl
          ? 'This browser can run the shader demo. If it stutters, the page still works without it.'
          : 'The shader demo will show its designed fallback here. Nothing essential is lost.';
      },
      notes: { motion: 'The report is text, not a decorative chart.' },
    },
    {
      ids: [449, 457],
      name: 'The cost of a canvas',
      summary: 'The same field at three device-pixel-ratio caps. The numbers are measured from this canvas, not quoted from a blog post.',
      html: `<div class="d-budget"><div class="d-budget__row">${[1, 2, 3].map((d, i) => `<button type="button" class="d-chip${i === 1 ? ' is-active' : ''}" data-dpr="${d}">DPR cap ${d}</button>`).join('')}</div><canvas data-budget aria-hidden="true"></canvas><p class="d-cap" data-budget-note>Drawing buffer: measuring…</p></div>`,
      init: ({ stage, reduced }) => {
        const canvas = stage.querySelector<HTMLCanvasElement>('[data-budget]')!;
        const note = stage.querySelector<HTMLElement>('[data-budget-note]')!;
        const c = canvas.getContext('2d');
        if (!c) return;
        let cap = 2;
        const paint = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, cap);
          canvas.width = Math.max(1, Math.floor(r.width * dpr));
          canvas.height = Math.max(1, Math.floor(r.height * dpr));
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, r.width, r.height);
          c.fillStyle = '#ff4a00';
          for (let i = 0; i < 900; i++) {
            const x = ((i * 37) % 100) / 100;
            const y = ((i * 61) % 100) / 100;
            c.fillRect(x * r.width, y * r.height, reduced ? 3 : 2, reduced ? 3 : 2);
          }
          note.textContent = `CSS ${r.width.toFixed(0)}×${r.height.toFixed(0)} · buffer ${canvas.width}×${canvas.height} · ${(canvas.width * canvas.height / 1e6).toFixed(2)} megapixels`;
        };
        paint();
        stage.querySelectorAll<HTMLButtonElement>('[data-dpr]').forEach((btn) => {
          btn.addEventListener('click', () => {
            cap = Number(btn.dataset.dpr);
            stage.querySelectorAll('[data-dpr]').forEach((b) => b.classList.toggle('is-active', b === btn));
            paint();
          });
        });
        const ro = new ResizeObserver(paint);
        ro.observe(canvas);
        return () => ro.disconnect();
      },
      notes: { motion: 'The field is drawn once.', keyboard: 'The caps are buttons with a visible active state.' },
    },
  ],
};
