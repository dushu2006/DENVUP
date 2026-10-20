/** Typography and text-motion demonstrations. */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { splitText } from '../core/pointer';
import { artwork, button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

const SAMPLE = 'SHAPE THE IDEA';

function textStage(root: HTMLElement, className = ''): HTMLElement {
  const wrap = stage(root, `demo__stage--type ${className}`.trim());
  return wrap;
}

function sampleText(text: string, className = ''): HTMLElement {
  const node = el('p', `demo__type ${className}`.trim());
  node.textContent = text;
  return node;
}

const charReveal: Demo = {
  id: 'type-char-reveal',
  title: 'Character-by-character reveal',
  category: 'type',
  summary: 'Each glyph fades and rises on its own, with the source text kept for screen readers.',
  trigger: 'Press Replay',
  techniques: [81, 110],
  keywords: 'character letters reveal typing',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const chars = splitText(line, 'chars');

    const play = () => {
      gsap.set(chars, { autoAlpha: 0, yPercent: 60, rotate: 6 });
      if (reduced) {
        gsap.set(chars, { autoAlpha: 1, yPercent: 0, rotate: 0 });
        return;
      }
      gsap.to(chars, {
        autoAlpha: 1,
        yPercent: 0,
        rotate: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.022,
      });
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const wordReveal: Demo = {
  id: 'type-word-reveal',
  title: 'Word-by-word rise from a mask',
  category: 'type',
  summary: 'Words slide up out of an overflow mask, in reading order.',
  trigger: 'Press Replay',
  techniques: [82, 86, 89],
  keywords: 'word mask rise reveal',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const words = splitText(line, 'words');

    const play = () => {
      gsap.set(words, { yPercent: 110 });
      if (reduced) {
        gsap.set(words, { yPercent: 0 });
        return;
      }
      gsap.to(words, {
        yPercent: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.08,
      });
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const clipReveal: Demo = {
  id: 'type-clip-reveal',
  title: 'Clip-path text reveal',
  category: 'type',
  summary: 'A growing window reveals the headline, in the style of a printed page being exposed.',
  trigger: 'Press Replay',
  techniques: [84, 117],
  keywords: 'clip path reveal window',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const play = () => {
      gsap.fromTo(
        line,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: reduced ? 0 : 0.9, ease: 'power3.inOut' },
      );
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const panelMask: Demo = {
  id: 'type-panel-mask',
  title: 'Text masked by a moving panel',
  category: 'type',
  summary: 'A solid panel slides across the line and the text is only visible where it has passed.',
  trigger: 'Press Replay',
  techniques: [85],
  keywords: 'panel mask wipe text',
  mount({ root, reduced }) {
    const wrap = textStage(root, 'demo__stage--clip');
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const panel = el('span', 'demo__panel');
    wrap.appendChild(panel);
    const play = () => {
      gsap.set(panel, { xPercent: -110 });
      gsap.set(line, { opacity: 0.25 });
      if (reduced) {
        gsap.set(panel, { display: 'none' });
        gsap.set(line, { opacity: 1 });
        return;
      }
      gsap.to(panel, { xPercent: 110, duration: 1, ease: 'power3.inOut' });
      gsap.to(line, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const dropIn: Demo = {
  id: 'type-drop-in',
  title: 'Text drops into place',
  category: 'type',
  summary: 'The line falls from above and settles, with a small bounce at the end.',
  trigger: 'Press Replay',
  techniques: [87],
  keywords: 'drop bounce settle text',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const play = () => {
      if (reduced) {
        gsap.set(line, { y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        line,
        { y: -90, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'bounce.out' },
      );
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const blurIn: Demo = {
  id: 'type-blur-in',
  title: 'Blur-to-sharp entrance',
  category: 'type',
  summary: 'The type arrives out of focus and resolves, the way a lens finds its subject.',
  trigger: 'Press Replay',
  techniques: [88, 116],
  keywords: 'blur sharp focus reveal',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const play = () => {
      if (reduced) {
        gsap.set(line, { filter: 'none', opacity: 1 });
        return;
      }
      gsap.fromTo(
        line,
        { filter: 'blur(18px)', opacity: 0, y: 12 },
        { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.95, ease: 'power2.out' },
      );
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const phraseCycle: Demo = {
  id: 'type-phrase-cycle',
  title: 'Headline changes between approved phrases',
  category: 'type',
  summary: 'A fixed set of headlines cycles in place — never random copy, always approved wording.',
  trigger: 'Automatic, or press Next',
  techniques: [93],
  keywords: 'headline cycle rotate phrases',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText('WE BUILD THE INTERACTION', 'demo__type--xl');
    wrap.appendChild(line);
    const phrases = [
      'WE BUILD THE INTERACTION',
      'WE BUILD THE MOMENT',
      'WE BUILD THE INTERFACE',
      'WE BUILD THE DETAIL',
    ];
    let index = 0;
    let timer = 0;
    const next = () => {
      index = (index + 1) % phrases.length;
      if (reduced) {
        line.textContent = phrases[index];
        return;
      }
      gsap.to(line, {
        autoAlpha: 0,
        y: -18,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: () => {
          line.textContent = phrases[index];
          gsap.to(line, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' });
        },
      });
    };
    if (!reduced) timer = window.setInterval(next, 2600);
    const bar = controls(root);
    bar.appendChild(button('Next', next));
    return () => window.clearInterval(timer);
  },
};

const typewriter: Demo = {
  id: 'type-typewriter',
  title: 'Typewriter with a caret',
  category: 'type',
  summary: 'Text is typed out one character at a time with a blinking caret.',
  trigger: 'Automatic, or press Type',
  techniques: [95],
  keywords: 'typewriter caret typing',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText('', 'demo__type--lg demo__type--caret');
    wrap.appendChild(line);
    const text = 'A studio for websites that behave.';
    let index = 0;
    let timer = 0;
    const tick = () => {
      line.textContent = text.slice(0, index);
      index += 1;
      if (index <= text.length) timer = window.setTimeout(tick, 42);
    };
    if (reduced) line.textContent = text;
    else timer = window.setTimeout(tick, 300);
    const bar = controls(root);
    bar.appendChild(
      button('Type again', () => {
        window.clearTimeout(timer);
        index = 0;
        line.textContent = '';
        if (!reduced) timer = window.setTimeout(tick, 120);
      }),
    );
    return () => window.clearTimeout(timer);
  },
};

const scrollHighlight: Demo = {
  id: 'type-scroll-highlight',
  title: 'Highlight follows scroll progress',
  category: 'type',
  summary: 'Scrolling through the panel fills a highlight across the sentence.',
  trigger: 'Scroll inside the panel',
  techniques: [96, 108],
  keywords: 'highlight scroll progress fill',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type demo__stage--scroll');
    const inner = el('div', 'demo__scroll-inner');
    const lead = el('p', 'demo__type demo__type--lg');
    lead.textContent =
      'Motion is only worth doing when it carries information. The highlight below follows the scroll position, so the emphasis and the reading position always agree.';
    const marked = el('span', 'demo__mark');
    marked.textContent = 'emphasis and the reading position always agree';
    inner.appendChild(lead);
    wrap.appendChild(inner);

    const words = lead.textContent ?? '';
    lead.textContent = '';
    const before = words.slice(0, words.indexOf('emphasis'));
    lead.append(before, marked, ' and the reading position always agree.'.slice(0, 0));

    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (wrap.clientHeight - (rect.bottom - 60)) / (wrap.clientHeight + rect.height)),
      );
      const size = marked.offsetWidth * progress;
      marked.style.backgroundSize = `${size}px 100%`;
    };
    wrap.addEventListener('scroll', update, { passive: true });
    update();
    if (reduced) marked.style.backgroundSize = '100% 100%';
    return () => wrap.removeEventListener('scroll', update);
  },
};

const underlineWords: Demo = {
  id: 'type-underline-words',
  title: 'Animated underline beneath selected words',
  category: 'type',
  summary: 'Only the meaningful words are underlined, and the underline draws itself in.',
  trigger: 'Automatic on entry',
  techniques: [97],
  keywords: 'underline words emphasis',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = el('p', 'demo__type demo__type--lg');
    const parts = [
      'Motion ',
      'has a job',
      ', and ',
      'the job has a name',
      '.',
    ];
    line.textContent = '';
    parts.forEach((part) => {
      if (part === 'has a job' || part === 'the job has a name') {
        const span = el('span', 'demo__ul-word');
        span.textContent = part;
        line.appendChild(span);
      } else {
        line.appendChild(document.createTextNode(part));
      }
    });
    wrap.appendChild(line);
    const words = line.querySelectorAll<HTMLElement>('.demo__ul-word');
    gsap.fromTo(
      words,
      { '--ul': '0%' },
      { '--ul': '100%', duration: reduced ? 0 : 0.8, ease: 'power2.inOut', stagger: 0.18 },
    );
  },
};

const outlineToSolid: Demo = {
  id: 'type-outline-solid',
  title: 'Outline typography becomes solid',
  category: 'type',
  summary: 'Stroked letters fill in, a classic way to move from technical drawing to finished sign.',
  trigger: 'Automatic on entry',
  techniques: [98],
  keywords: 'outline stroke solid fill text',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl demo__type--outline');
    wrap.appendChild(line);
    gsap.to(line, {
      '--fill': '1',
      duration: reduced ? 0 : 1.4,
      ease: 'power2.inOut',
    });
  },
};

const strokeDraw: Demo = {
  id: 'type-stroke-draw',
  title: 'Text stroke draws on',
  category: 'type',
  summary: 'The letterforms are drawn as SVG strokes and then fill in.',
  trigger: 'Automatic on entry',
  techniques: [99],
  keywords: 'svg stroke draw letters',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 600 120');
    svg.setAttribute('class', 'demo__stroke-svg');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '300');
    text.setAttribute('y', '92');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'demo__stroke-text');
    text.textContent = 'DENVUP';
    svg.appendChild(text);
    wrap.appendChild(svg);
    if (!reduced) {
      const length = text.getComputedTextLength?.() ?? 400;
      gsap.fromTo(
        text,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' },
      );
    }
  },
};

const stretchCompress: Demo = {
  id: 'type-stretch',
  title: 'Type stretches and compresses',
  category: 'type',
  summary: 'Letter spacing and width change together, showing how far a variable face can be pushed.',
  trigger: 'Automatic on a loop',
  techniques: [100, 108],
  keywords: 'stretch compress width spacing variable',
  mount({ root, reduced }) {
    const wrap = textStage(root);
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    if (reduced) return;
    gsap.to(line, {
      '--track': '0.22em',
      '--wdth': '62',
      duration: 2.4,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
    });
  },
};

const perspectiveType: Demo = {
  id: 'type-perspective',
  title: 'Perspective text entrance',
  category: 'type',
  summary: 'The line rotates into place in 3D space rather than sliding.',
  trigger: 'Press Replay',
  techniques: [101],
  keywords: 'perspective 3d rotate entrance',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type demo__stage--perspective');
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    const play = () => {
      if (reduced) {
        gsap.set(line, { rotateX: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        line,
        { rotateX: -72, opacity: 0, transformPerspective: 700 },
        { rotateX: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
      );
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const circularType: Demo = {
  id: 'type-circular',
  title: 'Type rotates on a circular path',
  category: 'type',
  summary: 'A ring of type turns slowly around an empty centre.',
  trigger: 'Automatic',
  techniques: [103],
  keywords: 'circle path rotate type',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type demo__stage--circle');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('class', 'demo__circle-svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'demo-circle-path');
    path.setAttribute('d', 'M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0');
    defs.appendChild(path);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', 'demo__circle-text');
    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPath.setAttribute('href', '#demo-circle-path');
    textPath.textContent = 'DENVUP · MOTION · INTERACTION · CRAFT · ';
    text.appendChild(textPath);
    svg.append(defs, text);
    wrap.appendChild(svg);
    if (!reduced) {
      gsap.to(text, { rotation: 360, transformOrigin: '50% 50%', duration: 22, ease: 'none', repeat: -1 });
    }
  },
};

const bidirectionalMarquee: Demo = {
  id: 'type-marquee-bidirectional',
  title: 'Bidirectional marquee with pause control',
  category: 'type',
  summary: 'Two opposed tracks, with a control that genuinely stops the movement.',
  trigger: 'Press Pause / Play',
  techniques: [105, 104],
  keywords: 'marquee ticker pause bidirectional',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type demo__stage--marquee');
    const trackA = el('div', 'demo__marquee-track');
    const trackB = el('div', 'demo__marquee-track demo__marquee-track--reverse');
    const words = 'DESIGN · DEVELOPMENT · MOTION · INTERACTION · ';
    trackA.innerHTML = `<span>${words.repeat(4)}</span>`;
    trackB.innerHTML = `<span>${words.repeat(4)}</span>`;
    wrap.append(trackA, trackB);

    const bar = controls(root);
    let playing = !reduced;
    const toggle = button(playing ? 'Pause' : 'Play', () => {
      playing = !playing;
      toggle.textContent = playing ? 'Pause' : 'Play';
      toggle.setAttribute('aria-pressed', String(playing));
      wrap.classList.toggle('is-paused', !playing);
    });
    toggle.setAttribute('aria-pressed', String(playing));
    if (reduced) wrap.classList.add('is-paused');
    bar.appendChild(toggle);
  },
};

const clipThroughImage: Demo = {
  id: 'type-clip-image',
  title: 'Text clipped through an image',
  category: 'type',
  summary: 'The headline is masked by artwork, so the letters appear only inside the picture.',
  trigger: 'Automatic on entry',
  techniques: [106],
  keywords: 'clip image text mask artwork',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type demo__stage--clipimage');
    const img = el('img', 'demo__clipimg');
    img.src = artwork('a', 900, 26);
    img.alt = '';
    const line = sampleText(SAMPLE, 'demo__type--xl demo__type--clipped');
    wrap.append(img, line);
    gsap.fromTo(
      line,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: reduced ? 0 : 1.1, ease: 'power3.inOut' },
    );
  },
};

const shapeMaskType: Demo = {
  id: 'type-shape-mask',
  title: 'Text revealed through a shape mask',
  category: 'type',
  summary: 'A circle opens over the headline and the type is revealed only inside it.',
  trigger: 'Automatic on entry',
  techniques: [107],
  keywords: 'shape mask circle reveal text',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--type');
    const line = sampleText(SAMPLE, 'demo__type--xl');
    wrap.appendChild(line);
    gsap.fromTo(
      line,
      { clipPath: 'circle(0% at 50% 50%)' },
      { clipPath: 'circle(75% at 50% 50%)', duration: reduced ? 0 : 1.1, ease: 'power3.inOut' },
    );
  },
};

const weightFollowsPointer: Demo = {
  id: 'type-weight-pointer',
  title: 'Weight follows the pointer',
  category: 'type',
  summary:
    'The variable weight axis of the typeface tracks the pointer’s vertical position, so the line breathes under the cursor.',
  trigger: 'Move the pointer up and down over the line',
  techniques: [37],
  keywords: 'variable weight axis pointer breathe',
  mount({ root }) {
    const wrap = textStage(root);
    const line = sampleText('VARIABLE WEIGHT', 'demo__type--xl');
    wrap.appendChild(line);
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const t = 1 - (event.clientY - rect.top) / rect.height;
      const weight = Math.round(180 + Math.max(0, Math.min(1, t)) * 720);
      line.style.fontVariationSettings = `'wght' ${weight}`;
    };
    wrap.addEventListener('pointermove', onMove);
    const onLeave = () => {
      line.style.fontVariationSettings = "'wght' 400";
    };
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  },
};

const charactersPushAway: Demo = {
  id: 'type-push',
  title: 'Characters push away from the pointer',
  category: 'type',
  summary: 'Letters nearest the cursor are pushed outward, like stones in a path.',
  trigger: 'Move the pointer over the line',
  techniques: [38],
  keywords: 'characters push away repel pointer',
  mount({ root }) {
    const wrap = textStage(root);
    const line = sampleText('MOVE THROUGH ME', 'demo__type--lg');
    wrap.appendChild(line);
    const chars = splitText(line, 'chars');
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      chars.forEach((char) => {
        const box = char.getBoundingClientRect();
        const cx = box.left - rect.left + box.width / 2;
        const cy = box.top - rect.top + box.height / 2;
        const dx = cx - px;
        const dy = cy - py;
        const d = Math.hypot(dx, dy);
        const push = d < 60 ? (60 - d) / 60 : 0;
        char.style.transform = `translate(${(dx * push * 0.5).toFixed(1)}px, ${(dy * push * 0.5).toFixed(
          1,
        )}px)`;
      });
    };
    const onLeave = () => {
      chars.forEach((char) => {
        char.style.transform = '';
      });
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  },
};

const charactersPullIn: Demo = {
  id: 'type-pull',
  title: 'Characters pull towards the pointer',
  category: 'type',
  summary: 'The opposite behaviour: letters lean in towards the cursor.',
  trigger: 'Move the pointer over the line',
  techniques: [39],
  keywords: 'characters pull attract pointer magnetic',
  mount({ root }) {
    const wrap = textStage(root);
    const line = sampleText('GATHER HERE', 'demo__type--lg');
    wrap.appendChild(line);
    const chars = splitText(line, 'chars');
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      chars.forEach((char) => {
        const box = char.getBoundingClientRect();
        const cx = box.left - rect.left + box.width / 2;
        const cy = box.top - rect.top + box.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const d = Math.hypot(dx, dy);
        const pull = d < 110 ? (110 - d) / 110 : 0;
        char.style.transform = `translate(${(dx * pull * 0.16).toFixed(1)}px, ${(dy * pull * 0.16).toFixed(
          1,
        )}px)`;
      });
    };
    const onLeave = () => {
      chars.forEach((char) => {
        char.style.transform = '';
      });
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  },
};

export const typeDemos: Demo[] = [
  charReveal,
  wordReveal,
  clipReveal,
  panelMask,
  dropIn,
  blurIn,
  phraseCycle,
  typewriter,
  scrollHighlight,
  underlineWords,
  outlineToSolid,
  strokeDraw,
  stretchCompress,
  perspectiveType,
  circularType,
  bidirectionalMarquee,
  clipThroughImage,
  shapeMaskType,
  weightFollowsPointer,
  charactersPushAway,
  charactersPullIn,
];

export { hint };
