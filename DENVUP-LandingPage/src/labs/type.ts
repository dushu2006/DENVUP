import type { Lab } from './types';
import { splitLetters } from './helpers';

export const typeLab: Lab = {
  slug: 'type',
  title: 'Typography in motion',
  blurb:
    'Type is the interface before anything is clicked. These demos change weight, fill, position and mask — and every one keeps the words selectable and readable.',
  modes: [
    {
      ids: [82, 89],
      name: 'A sentence that assembles',
      summary: 'Words rise into place in reading order, 55 ms apart. The line is real text with an accessible label; the spans are hidden from the tree.',
      html: `<div class="d-typeplate"><p class="d-display" data-beat>Built in the den. Made to move.</p><p class="d-cap">Reading order, not random order</p></div>`,
      init: ({ stage, timeout }) => {
        const line = stage.querySelector<HTMLElement>('[data-beat]')!;
        const text = line.textContent ?? '';
        line.textContent = '';
        line.setAttribute('aria-label', text);
        const words = text.split(' ').map((word) => {
          const wrap = document.createElement('span');
          wrap.className = 'd-word';
          const inner = document.createElement('span');
          inner.textContent = word;
          wrap.append(inner);
          line.append(wrap, document.createTextNode(' '));
          return inner;
        });
        words.forEach((word, i) => timeout(() => word.classList.add('is-on'), i * 90));
      },
      notes: { motion: 'Reduced motion shows the line with no transforms.', keyboard: 'The sentence is static text for assistive technology.' },
    },
    {
      ids: [81, 114],
      name: 'Letter stagger',
      summary: 'A single word is split into letters and lifted. The original word is kept as an aria-label so a screen reader hears one word, not six.',
      html: `<div class="d-typeplate d-typeplate--ink"><p class="d-kinetic" data-letters>DENVUP</p><p class="d-cap">One word, six letters, 40 ms apart</p></div>`,
      init: ({ stage, reduced, timeout }) => {
        const el = stage.querySelector<HTMLElement>('[data-letters]')!;
        const letters = splitLetters(el);
        if (reduced) return;
        letters.forEach((letter, i) => timeout(() => letter.classList.add('is-on'), 120 + i * 40));
      },
      notes: { keyboard: 'aria-label carries the word; the letters are hidden.' },
    },
    {
      ids: [104, 105],
      name: 'The endless line',
      summary: 'A marquee that pauses on hover, focus and a real button. The duplicated half is aria-hidden, so the sentence is read once.',
      html: `<div class="d-marquee" data-marquee><div class="d-marquee__track"><span>Websites that behave like places</span><span aria-hidden="true">Websites that behave like places</span></div><button type="button" class="d-chip" data-marquee-pause aria-pressed="false">Pause</button></div>`,
      init: ({ stage }) => {
        const marquee = stage.querySelector<HTMLElement>('[data-marquee]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-marquee-pause]')!;
        btn.addEventListener('click', () => {
          const paused = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!paused));
          btn.textContent = paused ? 'Pause' : 'Play';
          marquee.classList.toggle('is-paused', !paused);
        });
        marquee.addEventListener('focusin', () => marquee.classList.add('is-paused'));
      },
      notes: { keyboard: 'Focusing the pause button stops the line; so does hover.', motion: 'Reduced motion starts paused.' },
    },
    {
      ids: [90, 91, 92],
      name: 'Weight as emphasis',
      summary: 'A variable axis moves the same sentence from light to heavy, then settles. Weight changes meaning, so it is used once and returned.',
      html: `<div class="d-typeplate"><p class="d-var" data-var>Some sentences carry more weight.</p><div class="d-row"><label class="d-cap" for="var">Weight</label><input class="d-slider" id="var" type="range" min="300" max="800" value="420" data-var-range aria-label="Weight"><span class="d-cap" data-var-note>420</span></div></div>`,
      init: ({ stage }) => {
        const el = stage.querySelector<HTMLElement>('[data-var]')!;
        const range = stage.querySelector<HTMLInputElement>('[data-var-range]')!;
        const note = stage.querySelector<HTMLElement>('[data-var-note]')!;
        const apply = () => {
          el.style.fontVariationSettings = `"wght" ${range.value}`;
          note.textContent = range.value;
        };
        range.addEventListener('input', apply);
        apply();
      },
      notes: { keyboard: 'The range input responds to arrow keys.', touch: 'The slider is a native control.' },
    },
    {
      ids: [98, 99],
      name: 'Outline to fill',
      summary: 'The same letterform switches from stroke to solid fill. The text remains selectable; the effect is painted with text-stroke and colour.',
      html: `<div class="d-typeplate d-typeplate--orange"><p class="d-outline" data-outline>MAKE<br>IT SEEN</p><button type="button" class="d-chip" data-outline-toggle aria-pressed="true">Filled</button></div>`,
      init: ({ stage }) => {
        const el = stage.querySelector<HTMLElement>('[data-outline]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-outline-toggle]')!;
        btn.addEventListener('click', () => {
          const filled = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!filled));
          btn.textContent = filled ? 'Outline' : 'Filled';
          el.classList.toggle('is-outline', filled);
        });
      },
      notes: { motion: 'Switch is instant; there is no stroke animation to miss.' },
    },
    {
      ids: [106, 107],
      name: 'Type in the image',
      summary: 'The word is used as a window onto the generated artwork. A hidden text layer keeps the word available to screen readers and search.',
      html: `<div class="d-typeplate d-typeplate--ink"><p class="d-window" data-window>DEN</p><p class="sr-only">DEN</p><p class="d-cap">background-clip: text over a local image</p></div>`,
      init: ({ stage }) => {
        const el = stage.querySelector<HTMLElement>('[data-window]')!;
        el.style.backgroundImage = 'url(/assets/media/den-glow.webp)';
      },
      notes: { motion: 'The fill is static; nothing depends on animation.' },
    },
    {
      ids: [109, 103],
      name: 'Text on a line',
      summary: 'The sentence follows a curve drawn in SVG. The readable copy sits below it; the curved version is decoration and cannot trap the reader.',
      html: `<div class="d-typeplate"><svg class="d-curved" viewBox="0 0 420 120" aria-hidden="true"><path id="dCurve" d="M10 95 C120 15 300 15 410 95" fill="none" stroke="none"/><text><textPath href="#dCurve" startOffset="6%">a sentence that follows the line</textPath></text></svg><p class="d-body">A sentence that follows the line. The same words, set straight below, so the curve is a drawing rather than the only way to read it.</p></div>`,
      notes: { keyboard: 'The curved text is aria-hidden; the straight copy is the real content.' },
    },
    {
      ids: [94, 93, 95],
      name: 'Scramble, then settle',
      summary: 'Letters cycle through noise and resolve into the real sentence. It runs once, can be replayed, and settles instantly under reduced motion.',
      html: `<div class="d-typeplate"><p class="d-statement" data-scramble>THE WORK IS THE ARGUMENT</p><button type="button" class="d-chip" data-scramble-run>Scramble</button></div>`,
      init: ({ stage, reduced, timeout }) => {
        const el = stage.querySelector<HTMLElement>('[data-scramble]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-scramble-run]')!;
        const final = el.textContent ?? '';
        const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&';
        let timers: number[] = [];
        const run = () => {
          timers.forEach((t) => window.clearTimeout(t));
          timers = [];
          if (reduced) {
            el.textContent = final;
            return;
          }
          let frame = 0;
          const step = () => {
            el.textContent = final
              .split('')
              .map((char, i) => (char === ' ' ? ' ' : i < frame / 3 ? char : glyphs[Math.floor(Math.random() * glyphs.length)]))
              .join('');
            frame += 1;
            if (frame < final.length * 3 + 12) timers.push(window.setTimeout(step, 32));
            else el.textContent = final;
          };
          step();
        };
        btn.addEventListener('click', run);
        timeout(() => undefined, 0);
        return () => timers.forEach((t) => window.clearTimeout(t));
      },
      notes: { motion: 'Reduced motion prints the sentence immediately.', keyboard: 'The replay control is a button.' },
    },
    {
      ids: [110, 108],
      name: 'Measure and rhythm',
      summary: 'A 62-character measure with a 1.45 line height, then a toggle to a deliberately bad 120-character measure. The difference is the argument.',
      html: `<div class="d-typeplate d-measure"><p data-measure>Good body copy is a physical object: it has a width, a rhythm and an edge. This paragraph is set to roughly sixty-two characters per line, which is where most readers stop losing their place. The control below proves the point by breaking it.</p><button type="button" class="d-chip" data-measure-toggle aria-pressed="false">Make it worse</button></div>`,
      init: ({ stage }) => {
        const p = stage.querySelector<HTMLElement>('[data-measure]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-measure-toggle]')!;
        btn.addEventListener('click', () => {
          const bad = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!bad));
          btn.textContent = bad ? 'Make it worse' : 'Restore the measure';
          p.classList.toggle('is-wide', !bad);
        });
      },
      notes: { keyboard: 'The toggle states which setting is active.' },
    },
    {
      ids: [96, 97, 100, 101, 102, 111, 112, 113, 115, 116],
      name: 'Reveal, then rest',
      summary:
        'A paragraph arrives word by word, then stops. The same words exist for reduced motion, for search engines and for anyone who scrolls past before the animation begins.',
      html: `<div class="d-reveals" data-reveals><p class="d-reveals__text" data-reveal-text>Most of this page is type. It should arrive with intent, then get out of the way.</p><button class="d-btn d-btn--line" type="button" data-reveal-replay>Replay the arrival</button></div>`,
      init: ({ stage, reduced, timeout, onCleanup }) => {
        const root = stage.querySelector<HTMLElement>('[data-reveals]')!;
        const line = stage.querySelector<HTMLElement>('[data-reveal-text]')!;
        const replay = stage.querySelector<HTMLButtonElement>('[data-reveal-replay]')!;
        const words = line.textContent!.split(' ');
        line.textContent = '';
        const spans = words.map((word, i) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.style.setProperty('--i', String(i));
          line.append(span, document.createTextNode(' '));
          return span;
        });
        const run = () => {
          root.classList.remove('is-in');
          if (reduced) {
            root.classList.add('is-static');
            return;
          }
          void root.offsetWidth;
          root.classList.add('is-in');
        };
        replay.addEventListener('click', () => {
          spans.forEach((span) => span.style.setProperty('--i', String(spans.indexOf(span))));
          run();
        });
        timeout(run, 40);
        onCleanup(() => line.replaceChildren());
      },
      notes: {
        motion: 'Every word is painted without transform, blur or delay; the paragraph reads as one block.',
        keyboard: 'Replay is a normal button. Nothing is hidden from search engines or screen readers.',
      },
    },
  ],
};
