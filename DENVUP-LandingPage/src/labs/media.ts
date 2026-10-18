import type { Lab } from './types';

export const mediaLab: Lab = {
  slug: 'media',
  title: 'Media & sound',
  blurb:
    'Images and audio should earn their bytes. These plates reserve their space, wait to be asked, and never autoplay a sound.',
  modes: [
    {
      ids: [118],
      name: 'An image that arrives',
      summary: 'The plate is revealed with a clip-path and a short scale. It has a fixed ratio, so nothing moves around it. The replay button makes the effect repeatable.',
      html: `<div class="d-imagereveal"><div class="d-imagereveal__frame"><img src="/assets/media/den-glow.webp" alt="Generated orange glow artwork used as a placeholder for real project imagery" width="800" height="600" loading="lazy" data-reveal-img></div><div class="d-row"><button type="button" class="d-chip" data-reveal-run>Replay reveal</button><span class="d-cap">19:14 reserved ratio</span></div></div>`,
      init: ({ stage }) => {
        const frame = stage.querySelector<HTMLElement>('.d-imagereveal__frame')!;
        const run = () => {
          frame.classList.remove('is-on');
          void frame.getBoundingClientRect();
          frame.classList.add('is-on');
        };
        stage.querySelector('[data-reveal-run]')!.addEventListener('click', run);
        run();
      },
      notes: { motion: 'The image is fully visible without animation.', keyboard: 'Replay is a button.' },
    },
    {
      ids: [194, 195],
      name: 'Before and after',
      summary: 'One artwork, two treatments, one range input. The comparison is keyboard operable and the labels say which side is which.',
      html: `<div class="d-beforeafter" data-ba><div class="d-beforeafter__a"><img src="/assets/media/den-glow.webp" alt="The artwork in its original colour" width="800" height="600"></div><div class="d-beforeafter__b"><img src="/assets/media/den-glow.webp" alt="The same artwork treated in high contrast" width="800" height="600"></div><span class="d-beforeafter__line" aria-hidden="true"></span><span class="d-beforeafter__tag" aria-hidden="true">Original</span><span class="d-beforeafter__tag d-beforeafter__tag--b" aria-hidden="true">Treated</span><label class="sr-only" for="ba">Reveal the treated version</label><input id="ba" class="d-beforeafter__range" type="range" min="0" max="100" value="50" data-ba-range></div>`,
      init: ({ stage }) => {
        const root = stage.querySelector<HTMLElement>('[data-ba]')!;
        const range = stage.querySelector<HTMLInputElement>('[data-ba-range]')!;
        const apply = () => root.style.setProperty('--split', `${range.value}%`);
        range.addEventListener('input', apply);
        apply();
      },
      notes: { keyboard: 'Arrow keys move the divider.', touch: 'Native range input.' },
    },
    {
      ids: [387, 389],
      name: 'Sound, only after consent',
      summary: 'A generated test tone, not a music file. It starts only when the button is pressed, stops at four seconds, and the waveform is drawn from a live analyser.',
      html: `<div class="d-audio"><canvas data-wave aria-hidden="true"></canvas><div class="d-row"><button type="button" class="d-btn d-btn--solid" data-tone aria-pressed="false">Play a test tone</button><span class="d-cap" data-tone-note>Silent until you press it.</span></div></div>`,
      init: ({ stage, timeout }) => {
        const canvas = stage.querySelector<HTMLCanvasElement>('[data-wave]')!;
        const c = canvas.getContext('2d');
        const btn = stage.querySelector<HTMLButtonElement>('[data-tone]')!;
        const note = stage.querySelector<HTMLElement>('[data-tone-note]')!;
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
        let audio: AudioContext | null = null;
        let stop = () => {};
        btn.addEventListener('click', () => {
          if (btn.getAttribute('aria-pressed') === 'true') {
            stop();
            return;
          }
          const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtor) {
            note.textContent = 'This browser does not expose Web Audio. Nothing is played.';
            return;
          }
          audio = new AudioCtor();
          const osc = audio.createOscillator();
          const gain = audio.createGain();
          const analyser = audio.createAnalyser();
          analyser.fftSize = 64;
          osc.type = 'sine';
          osc.frequency.value = 392;
          gain.gain.value = 0.0001;
          gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.08);
          osc.connect(gain).connect(analyser).connect(audio.destination);
          osc.start();
          btn.setAttribute('aria-pressed', 'true');
          btn.textContent = 'Stop the tone';
          note.textContent = 'A quiet 392 Hz test tone. It ends by itself; no audio file is loaded.';
          const data = new Uint8Array(analyser.frequencyBinCount);
          let frame = 0;
          let running = true;
          const draw = () => {
            if (!running) return;
            const r = canvas.getBoundingClientRect();
            analyser.getByteFrequencyData(data);
            c.fillStyle = '#0b0a09';
            c.fillRect(0, 0, r.width, r.height);
            const bar = r.width / data.length;
            data.forEach((v, i) => {
              const h = (v / 255) * r.height;
              c.fillStyle = i % 3 === 0 ? '#ff4a00' : 'rgba(255,255,255,.65)';
              c.fillRect(i * bar, r.height - h, Math.max(1, bar - 2), h);
            });
            frame = requestAnimationFrame(draw);
          };
          draw();
          const end = () => {
            running = false;
            cancelAnimationFrame(frame);
            try {
              gain.gain.exponentialRampToValueAtTime(0.0001, audio!.currentTime + 0.1);
              osc.stop(audio!.currentTime + 0.12);
            } catch {
              /* already stopped */
            }
            btn.setAttribute('aria-pressed', 'false');
            btn.textContent = 'Play a test tone';
            note.textContent = 'Stopped. Silence is the default.';
            stop = () => {};
          };
          stop = end;
          timeout(end, 4200);
        });
        return () => {
          stop();
          void audio?.close();
          ro.disconnect();
        };
      },
      notes: { keyboard: 'A button starts and stops; no autoplay.', motion: 'The waveform is drawn once when sound plays.', touch: 'Same button.' },
    },
    {
      ids: [394],
      name: 'A poster that moves',
      summary: 'A canvas plate animates without video codecs or a network request. Pause is a real control; reduced motion shows one frame.',
      html: `<div class="d-poster"><canvas data-poster aria-hidden="true"></canvas><div class="d-row"><button type="button" class="d-chip" data-poster-toggle aria-pressed="false">Pause</button><span class="d-cap" data-poster-note>Generated in the browser</span></div></div>`,
      init: ({ stage, reduced }) => {
        const canvas = stage.querySelector<HTMLCanvasElement>('[data-poster]')!;
        const c = canvas.getContext('2d');
        const btn = stage.querySelector<HTMLButtonElement>('[data-poster-toggle]')!;
        const note = stage.querySelector<HTMLElement>('[data-poster-note]')!;
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
        let t = 0;
        const draw = () => {
          const r = canvas.getBoundingClientRect();
          const w = r.width;
          const h = r.height;
          t += 0.006;
          c.fillStyle = '#0b0a09';
          c.fillRect(0, 0, w, h);
          for (let i = 0; i < 7; i++) {
            c.beginPath();
            c.strokeStyle = i % 2 ? 'rgba(255,74,0,.7)' : 'rgba(241,237,231,.4)';
            c.lineWidth = 1.4;
            const phase = t + i * 0.42;
            for (let x = 0; x <= w; x += 8) {
              const y = h / 2 + Math.sin(x * 0.012 + phase) * h * 0.18 * Math.sin(phase * 0.6 + i);
              if (x === 0) c.moveTo(x, y);
              else c.lineTo(x, y);
            }
            c.stroke();
          }
          if (!paused) window.requestAnimationFrame(draw);
        };
        draw();
        if (reduced) note.textContent = 'Still frame: reduced motion requested.';
        btn.addEventListener('click', () => {
          const nowPaused = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!nowPaused));
          btn.textContent = nowPaused ? 'Pause' : 'Play';
          paused = !nowPaused;
          note.textContent = paused ? 'Paused by the reader.' : 'Playing a generated loop.';
          if (!paused) draw();
        });
        return () => ro.disconnect();
      },
      notes: { motion: 'One frame only.', keyboard: 'The pause control is a button with pressed state.' },
    },
    {
      ids: [453, 448],
      name: 'A reserved box',
      summary: 'The box fixes its ratio before the file exists, so the page never jumps. The button loads the real image and reports the time it took.',
      html: `<div class="d-reserve"><div class="d-reserve__box" data-reserve-box><span>16:9 reserved</span></div><button type="button" class="d-chip" data-reserve-load>Load the image</button><p class="d-cap" data-reserve-note aria-live="polite">No request made.</p></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLElement>('[data-reserve-box]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-reserve-load]')!;
        const note = stage.querySelector<HTMLElement>('[data-reserve-note]')!;
        btn.addEventListener('click', () => {
          btn.disabled = true;
          note.textContent = 'Loading…';
          const started = performance.now();
          const img = new Image();
          img.src = '/assets/media/den-glow.webp';
          img.alt = 'Loaded artwork';
          img.width = 800;
          img.height = 450;
          img.addEventListener('load', () => {
            box.replaceChildren(img);
            note.textContent = `Loaded in ${Math.round(performance.now() - started)} ms. The box did not change size.`;
          });
          img.addEventListener('error', () => {
            note.textContent = 'The file could not be loaded. The reserved box still holds its space.';
            btn.disabled = false;
          });
        });
      },
      notes: { motion: 'Nothing moves; the ratio is fixed.' },
    },
    {
      ids: [433],
      name: 'A caption you can read',
      summary: 'Media with a summary, a duration and a transcript-like description. The text is not an afterthought for search engines; it is the fallback.',
      html: `<figure class="d-figure"><img src="/assets/media/den-glow.webp" alt="Generated orange glow field" width="800" height="600"><figcaption><b>Concept plate 04.</b> A generated field, used here to demonstrate a caption that carries the meaning. No stock photograph and no fictional client is being shown.</figcaption></figure>`,
      notes: { motion: 'Static.' },
    },
  ],
};
