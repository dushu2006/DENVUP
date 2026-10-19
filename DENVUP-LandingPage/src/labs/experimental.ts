import type { Lab } from './types';
import { trackPointer } from './helpers';

export const experimentalLab: Lab = {
  slug: 'experimental',
  title: 'Experimental plates',
  blurb:
    'Ideas that are still proving themselves. Each plate is a real canvas or CSS construction with a pause control and a still frame — experiments are allowed, claims are not.',
  modes: [
    {
      ids: [464],
      name: 'Metaballs, cheaply',
      summary: 'Moving discs are drawn on a canvas and merged by a CSS blur-and-contrast filter. It looks like a fluid field without a physics engine.',
      html: `<div class="d-metaballs" data-balls><canvas data-ballcanvas aria-hidden="true"></canvas><div class="d-row"><button type="button" class="d-chip" data-balls-toggle aria-pressed="false">Pause</button><span class="d-cap">CSS filter: blur + contrast</span></div></div>`,
      init: (ctx) => {
        const canvas = ctx.stage.querySelector<HTMLCanvasElement>('[data-ballcanvas]')!;
        const c = canvas.getContext('2d');
        const btn = ctx.stage.querySelector<HTMLButtonElement>('[data-balls-toggle]')!;
        if (!c) return;
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(r.width * dpr);
          canvas.height = Math.floor(r.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        let paused = ctx.reduced;
        btn.setAttribute('aria-pressed', String(paused));
        btn.textContent = paused ? 'Play' : 'Pause';
        btn.addEventListener('click', () => {
          paused = !paused;
          btn.setAttribute('aria-pressed', String(paused));
          btn.textContent = paused ? 'Play' : 'Pause';
        });
        const blobs = Array.from({ length: 7 }, (_, i) => ({ phase: i * 0.9, r: 34 + i * 6, speed: 0.0006 + i * 0.00012 }));
        ctx.raf((time) => {
          if (paused) return;
          const r = canvas.getBoundingClientRect();
          const w = r.width;
          const h = r.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          c.fillStyle = '#ff4a00';
          blobs.forEach((b, i) => {
            const x = w / 2 + Math.sin(time * b.speed * 2 + b.phase) * w * 0.28;
            const y = h / 2 + Math.cos(time * b.speed * 1.6 + b.phase * 1.3) * h * 0.26;
            c.beginPath();
            c.arc(x, y, b.r * (1 + Math.sin(time * 0.001 + i) * 0.12), 0, Math.PI * 2);
            c.fill();
          });
        });
        return () => ro.disconnect();
      },
      notes: { motion: 'One still frame with the filter applied.', keyboard: 'Pause is a button.' },
    },
    {
      ids: [466],
      name: 'A procedural ridge',
      summary: 'The horizon is generated from layered sine waves. Moving the range changes the number of octaves; nothing is a downloaded image.',
      html: `<div class="d-terrain"><canvas data-terrain aria-hidden="true"></canvas><label class="d-cap" for="octaves">Octaves</label><input class="d-slider" id="octaves" type="range" min="2" max="7" value="4" data-octaves><span class="d-cap" data-octave-note>4 octaves</span></div>`,
      init: ({ stage }) => {
        const canvas = stage.querySelector<HTMLCanvasElement>('[data-terrain]')!;
        const c = canvas.getContext('2d');
        const range = stage.querySelector<HTMLInputElement>('[data-octaves]')!;
        const note = stage.querySelector<HTMLElement>('[data-octave-note]')!;
        if (!c) return;
        let octaves = Number(range.value);
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(r.width * dpr);
          canvas.height = Math.floor(r.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        const paint = () => {
          const r = canvas.getBoundingClientRect();
          const w = r.width;
          const h = r.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          for (let layer = 0; layer < octaves; layer++) {
            c.beginPath();
            const amp = 26 / (layer * 0.7 + 1);
            const freq = 0.008 * (layer + 1);
            for (let x = 0; x <= w; x += 6) {
              const y = h * 0.55 + layer * 14 + Math.sin(x * freq + layer) * amp;
              if (x === 0) c.moveTo(x, y);
              else c.lineTo(x, y);
            }
            c.strokeStyle = layer === 0 ? '#ff4a00' : `rgba(241,237,231,${0.5 - layer * 0.06})`;
            c.lineWidth = layer === 0 ? 1.8 : 1;
            c.stroke();
          }
        };
        paint();
        range.addEventListener('input', () => {
          octaves = Number(range.value);
          note.textContent = `${octaves} octave${octaves === 1 ? '' : 's'}`;
          paint();
        });
        return () => ro.disconnect();
      },
      notes: { motion: 'The field is static; the control still redraws it.' },
    },
    {
      ids: [465],
      name: 'Signed distance type',
      summary: 'The glow is drawn by offsetting the same word at different alphas. It is a canvas trick, not a shader, and it pauses with the button.',
      html: `<div class="d-sdf"><canvas data-sdf aria-hidden="true"></canvas><div class="d-row"><button type="button" class="d-chip" data-sdf-toggle aria-pressed="false">Pause</button><span class="d-cap">Offsets, not a font effect</span></div></div>`,
      init: ({ stage, raf, reduced }) => {
        const canvas = stage.querySelector<HTMLCanvasElement>('[data-sdf]')!;
        const c = canvas.getContext('2d');
        const btn = stage.querySelector<HTMLButtonElement>('[data-sdf-toggle]')!;
        if (!c) return;
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(r.width * dpr);
          canvas.height = Math.floor(r.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        let paused = reduced;
        btn.setAttribute('aria-pressed', String(paused));
        btn.textContent = paused ? 'Play' : 'Pause';
        btn.addEventListener('click', () => {
          paused = !paused;
          btn.setAttribute('aria-pressed', String(paused));
          btn.textContent = paused ? 'Play' : 'Pause';
        });
        raf((time) => {
          if (paused) return;
          const r = canvas.getBoundingClientRect();
          const w = r.width;
          const h = r.height;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          c.font = `700 ${Math.min(72, w * 0.16)}px system-ui, sans-serif`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          const pulse = Math.sin(time / 700) * 4;
          for (let i = 5; i >= 1; i--) {
            c.fillStyle = `rgba(255,74,0,${0.05 * i})`;
            c.fillText('DENVUP', w / 2 + i * 1.5, h / 2 + i * 1.5 + pulse);
          }
          c.fillStyle = '#ff4a00';
          c.fillText('DENVUP', w / 2, h / 2 + pulse);
          c.strokeStyle = 'rgba(255,255,255,.55)';
          c.lineWidth = 0.8;
          c.strokeText('DENVUP', w / 2, h / 2 + pulse);
        });
        return () => ro.disconnect();
      },
      notes: { motion: 'The glow is drawn once without the pulse.' },
    },
    {
      ids: [470],
      name: 'Layers with a horizon',
      summary: 'Four flat layers, four speeds, one pointer. The type layer moves least, so the sentence stays legible while the landscape shifts.',
      html: `<div class="d-layers" data-layers><span class="d-layers__l l1" aria-hidden="true"></span><span class="d-layers__l l2" aria-hidden="true"></span><span class="d-layers__l l3" aria-hidden="true"></span><span class="d-layers__l l4" aria-hidden="true"></span><p>Move across the plate</p></div>`,
      init: (ctx) => {
        const el = ctx.stage.querySelector<HTMLElement>('[data-layers]')!;
        const p = trackPointer(ctx);
        ctx.raf(() => {
          el.style.setProperty('--x', String(ctx.reduced ? 0 : (p.x - 0.5) * 2));
        });
      },
      notes: { touch: 'Drag to move; the text stays put.', motion: 'All layers align.' },
    },
    {
      ids: [478],
      name: 'A transition with a fallback',
      summary: 'A conic sweep moves across the panel to change chapters. The fallback is a flat colour change with the same words.',
      html: `<div class="d-shadertrans" data-shadertrans><div class="d-shadertrans__field" data-st-field></div><div class="d-shadertrans__copy"><span>Chapter change</span><button type="button" class="d-chip" data-st-run>Run it</button></div></div>`,
      init: ({ stage }) => {
        const field = stage.querySelector<HTMLElement>('[data-st-field]')!;
        const run = () => {
          field.classList.remove('is-on');
          void field.getBoundingClientRect();
          field.classList.add('is-on');
        };
        stage.querySelector('[data-st-run]')!.addEventListener('click', run);
      },
      notes: { motion: 'The field switches instantly; no sweep.', keyboard: 'The button runs it.' },
    },
  ],
};
