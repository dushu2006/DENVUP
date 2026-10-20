/** Visual-effect demonstrations: distortion, grain, bloom, glitch and lens treatments. */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { createLoop, fitCanvas } from '../core/loop';
import { artwork, button, canvasStage, controls, hint, palette, stage } from './helpers';
import type { Demo } from './types';

interface EffectControls {
  root: HTMLElement;
  set: (key: string, value: number | string) => void;
}

function effectSliders(
  root: HTMLElement,
  specs: { key: string; label: string; min: number; max: number; value: number }[],
  onChange: (key: string, value: number) => void,
): EffectControls {
  const bar = controls(root, 'demo__controls--wrap');
  const inputs: Record<string, HTMLInputElement> = {};
  specs.forEach((spec) => {
    const wrap = el('label', 'demo__slider');
    const cap = el('span', 'demo__slider-label');
    cap.textContent = spec.label;
    const input = el('input');
    input.type = 'range';
    input.min = String(spec.min);
    input.max = String(spec.max);
    input.value = String(spec.value);
    input.addEventListener('input', () => onChange(spec.key, Number(input.value)));
    wrap.append(cap, input);
    bar.appendChild(wrap);
    inputs[spec.key] = input;
  });
  return {
    root: bar,
    set(key, value) {
      const input = inputs[key];
      if (input) input.value = String(value);
    },
  };
}

function mediaStage(root: HTMLElement, className = ''): HTMLDivElement {
  const wrap = stage(root, `demo__stage--media ${className}`.trim());
  const img = el('img', 'demo__media-img');
  img.src = artwork('a', 900, 32);
  img.alt = '';
  wrap.appendChild(img);
  return wrap;
}

const hoverGlow: Demo = {
  id: 'effects-hover-glow',
  title: 'Pointer-tracked glow',
  category: 'effects',
  summary: 'A coloured glow follows the pointer and lifts the card it sits on.',
  trigger: 'Move the pointer over the panel',
  techniques: [276, 271],
  keywords: 'hover glow pointer lift 3d',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--media');
    const img = el('img', 'demo__media-img');
    img.src = artwork('b', 900, 214);
    img.alt = '';
    const glow = el('span', 'demo__glow');
    wrap.append(img, glow);
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      glow.style.setProperty('--x', `${event.clientX - rect.left}px`);
      glow.style.setProperty('--y', `${event.clientY - rect.top}px`);
      wrap.style.setProperty('--lift', '1');
    };
    const onLeave = () => {
      wrap.style.setProperty('--lift', '0');
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  },
};

const skewDistort: Demo = {
  id: 'effects-skew',
  title: 'Skew distortion on hover',
  category: 'effects',
  summary: 'The surface bends as the pointer crosses it, then springs back.',
  trigger: 'Move the pointer over the panel',
  techniques: [274, 277],
  keywords: 'skew distort bend pointer',
  mount({ root }) {
    const wrap = mediaStage(root);
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      wrap.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) skewX(${(
        x * 6
      ).toFixed(2)}deg) skewY(${(y * 4).toFixed(2)}deg)`;
    };
    const onLeave = () => {
      wrap.style.transform = '';
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  },
};

const dragDistort: Demo = {
  id: 'effects-drag-distort',
  title: 'Drag-to-distort surface',
  category: 'effects',
  summary: 'The image stretches under the pointer while you drag it.',
  trigger: 'Press and drag the panel',
  techniques: [277],
  keywords: 'drag distort stretch image',
  mount({ root }) {
    const wrap = mediaStage(root);
    const img = wrap.querySelector<HTMLImageElement>('.demo__media-img');
    if (!img) return;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const onDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      wrap.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = (event.clientX - lastX) / 20;
      const dy = (event.clientY - lastY) / 20;
      lastX = event.clientX;
      lastY = event.clientY;
      const current = img.style.transform || 'scale(1)';
      const match = current.match(/scale\(([\d.]+)\)/);
      const scale = match ? Math.min(1.4, Number(match[1]) + Math.hypot(dx, dy) * 0.2) : 1;
      img.style.transform = `scale(${scale.toFixed(3)}) translate(${(dx * 8).toFixed(
        1,
      )}px, ${(dy * 8).toFixed(1)}px) rotate(${(dx * 4).toFixed(2)}deg)`;
    };
    const onUp = () => {
      dragging = false;
      gsap.to(img, { scale: 1, x: 0, y: 0, rotate: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    };
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);
    return () => {
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
    };
  },
};

const chromatic: Demo = {
  id: 'effects-chromatic',
  title: 'Chromatic aberration',
  category: 'effects',
  summary: 'Colour channels separate, as they do in a cheap lens or a damaged display.',
  trigger: 'Move the pointer, or drag the slider',
  techniques: [278, 289, 285],
  keywords: 'chromatic aberration rgb split colour',
  mount({ root }) {
    const wrap = mediaStage(root);
    const img = wrap.querySelector<HTMLImageElement>('.demo__media-img');
    if (!img) return;
    let amount = 0;
    const apply = () => {
      img.style.filter = `drop-shadow(${amount}px 0 0 rgba(255,0,60,0.75)) drop-shadow(${
        -amount * 0.8
      }px 0 0 rgba(0,140,255,0.75))`;
    };
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      amount = Math.abs(((event.clientX - rect.left) / rect.width - 0.5) * 14);
      apply();
    };
    wrap.addEventListener('pointermove', onMove);
    const panel = effectSliders(
      root,
      [{ key: 'amount', label: 'Separation', min: 0, max: 12, value: 4 }],
      (_key, value) => {
        amount = value;
        apply();
      },
    );
    void panel;
    return () => wrap.removeEventListener('pointermove', onMove);
  },
};

const glitch: Demo = {
  id: 'effects-glitch',
  title: 'Glitch slices',
  category: 'effects',
  summary: 'The image is cut into horizontal bands that shift sideways, then settle.',
  trigger: 'Press Trigger, or move the pointer',
  techniques: [279, 246],
  keywords: 'glitch slices rgb datamosh broken',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--media demo__stage--glitch');
    const img = el('img', 'demo__media-img');
    img.src = artwork('b', 900, 24);
    img.alt = '';
    wrap.appendChild(img);

    if (reduced) {
      hint(root, 'Reduced motion: the glitch is shown as a single static offset instead of slices.');
      wrap.classList.add('is-static-glitch');
      return;
    }

    const bands = 7;
    const slices: HTMLDivElement[] = [];
    for (let i = 0; i < bands; i += 1) {
      const slice = el('div', 'demo__glitch-slice');
      slice.style.setProperty('--i', String(i));
      slice.style.setProperty('--h', `${100 / bands}%`);
      slice.style.setProperty('--top', `${(i * 100) / bands}%`);
      const clone = el('img', 'demo__media-img');
      clone.src = artwork('b', 900, 24);
      clone.alt = '';
      slice.appendChild(clone);
      wrap.appendChild(slice);
      slices.push(slice);
    }

    const trigger = () => {
      slices.forEach((slice) => {
        gsap.fromTo(
          slice,
          { x: 0, opacity: 0.85 },
          {
            x: (Math.random() - 0.5) * 70,
            opacity: 0,
            duration: 0.34,
            ease: 'steps(4)',
            repeat: 1,
            yoyo: true,
          },
        );
      });
    };
    const bar = controls(root);
    bar.appendChild(button('Trigger', trigger));
    const onMove = () => {
      if (Math.random() > 0.94) trigger();
    };
    wrap.addEventListener('pointermove', onMove);
    return () => wrap.removeEventListener('pointermove', onMove);
  },
};

const scanlines: Demo = {
  id: 'effects-scanlines',
  title: 'Scanlines and CRT curvature',
  category: 'effects',
  summary: 'The picture is drawn with a subtle line grid and a darkened edge.',
  trigger: 'Automatic',
  techniques: [280, 281, 290],
  keywords: 'scanlines crt curvature vignette retro',
  mount({ root, reduced }) {
    const wrap = mediaStage(root, 'demo__stage--crt');
    const scan = el('span', 'demo__scanlines');
    const vign = el('span', 'demo__vignette');
    wrap.append(scan, vign);
    if (reduced) return;
    gsap.to(scan, {
      backgroundPositionY: '24px',
      duration: 1.1,
      ease: 'none',
      repeat: -1,
    });
  },
};

const filmGrain: Demo = {
  id: 'effects-grain',
  title: 'Film grain',
  category: 'effects',
  summary: 'A generated noise texture sits over the artwork like real film stock.',
  trigger: 'Drag the intensity slider',
  techniques: [283, 292, 294],
  keywords: 'grain noise film texture',
  mount({ root }) {
    const wrap = mediaStage(root, 'demo__stage--grain');
    const grain = el('span', 'demo__grain');
    wrap.appendChild(grain);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(128, 128);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = 110 + Math.random() * 145;
      image.data[i] = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    grain.style.backgroundImage = `url(${canvas.toDataURL()})`;

    effectSliders(
      root,
      [{ key: 'grain', label: 'Intensity', min: 0, max: 60, value: 22 }],
      (_key, value) => {
        grain.style.opacity = String(value / 100);
      },
    );
  },
};

const bloom: Demo = {
  id: 'effects-bloom',
  title: 'Bloom around highlights',
  category: 'effects',
  summary: 'A blurred copy of the image is added back underneath to create glow.',
  trigger: 'Drag the intensity slider',
  techniques: [291, 293, 297],
  keywords: 'bloom glow blur highlights lens flare',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--media demo__stage--bloom');
    const img = el('img', 'demo__media-img');
    img.src = artwork('a', 900, 32);
    img.alt = '';
    const glow = el('img', 'demo__media-img demo__media-glow');
    glow.src = artwork('a', 900, 32);
    glow.alt = '';
    wrap.append(glow, img);
    effectSliders(
      root,
      [{ key: 'bloom', label: 'Bloom', min: 0, max: 100, value: 45 }],
      (_key, value) => {
        glow.style.opacity = String(value / 100);
      },
    );
  },
};

const vignette: Demo = {
  id: 'effects-vignette',
  title: 'Vignette',
  category: 'effects',
  summary: 'The corners of the frame darken, drawing the eye to the centre.',
  trigger: 'Drag the intensity slider',
  techniques: [290, 298],
  keywords: 'vignette darken edges focus god rays',
  mount({ root }) {
    const wrap = mediaStage(root);
    const vign = el('span', 'demo__vignette');
    wrap.appendChild(vign);
    effectSliders(
      root,
      [{ key: 'v', label: 'Intensity', min: 0, max: 100, value: 55 }],
      (_key, value) => {
        vign.style.opacity = String(value / 100);
      },
    );
  },
};

const dither: Demo = {
  id: 'effects-dither',
  title: 'Ordered dithering',
  category: 'effects',
  summary: 'The image is reduced to a small palette with a Bayer matrix, giving it a printed feel.',
  trigger: 'Drag the matrix-size slider',
  techniques: [295, 294],
  keywords: 'dither bayer pixelate retro palette',
  mount({ root }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const source = artwork('b', 600, 214);
    const img = new Image();
    img.src = source;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const bayer = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ];
    let block = 4;
    const render = () => {
      const fitted = fitCanvas(canvas);
      if (!fitted) return;
      const { ctx: c, width, height } = fitted;
      c.fillStyle = palette.ink;
      c.fillRect(0, 0, width, height);
      c.imageSmoothingEnabled = false;
      const size = block * 4;
      if (!img.complete || img.naturalWidth === 0) return;
      c.drawImage(img, 0, 0, size, size, 0, 0, width, height);
      const data = c.getImageData(0, 0, width, height);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * 4;
          const threshold = (bayer[y % 4][x % 4] / 16 - 0.5) * 90;
          data.data[i] = Math.max(0, Math.min(255, data.data[i] + threshold));
          data.data[i + 1] = Math.max(0, Math.min(255, data.data[i + 1] + threshold));
          data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + threshold));
        }
      }
      c.putImageData(data, 0, 0);
    };
    img.addEventListener('load', render);
    effectSliders(
      root,
      [{ key: 'block', label: 'Matrix size', min: 2, max: 12, value: 4 }],
      (_key, value) => {
        block = value;
        render();
      },
    );
  },
};

const shockwave: Demo = {
  id: 'effects-shockwave',
  title: 'Shockwave ripple',
  category: 'effects',
  summary: 'A press sends a shock ring through the artwork.',
  trigger: 'Press the panel',
  techniques: [300, 286, 271],
  keywords: 'shockwave ripple press impact',
  mount({ root, reduced }) {
    const wrap = mediaStage(root);
    const onPress = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const wave = el('span', 'demo__shock');
      wave.style.left = `${event.clientX - rect.left}px`;
      wave.style.top = `${event.clientY - rect.top}px`;
      wrap.appendChild(wave);
      if (reduced) {
        wave.classList.add('is-static');
      }
      wave.addEventListener('animationend', () => wave.remove());
    };
    wrap.addEventListener('pointerdown', onPress);
    return () => wrap.removeEventListener('pointerdown', onPress);
  },
};

const lightSweep: Demo = {
  id: 'effects-light-sweep',
  title: 'Light sweep across a surface',
  category: 'effects',
  summary: 'A specular band travels across the artwork and loops.',
  trigger: 'Automatic',
  techniques: [299, 275],
  keywords: 'light sweep specular highlight loop',
  mount({ root, reduced }) {
    const wrap = mediaStage(root);
    const sweep = el('span', 'demo__sweep');
    wrap.appendChild(sweep);
    if (reduced) return;
    gsap.fromTo(
      sweep,
      { xPercent: -120 },
      { xPercent: 120, duration: 3.4, ease: 'power1.inOut', repeat: -1, repeatDelay: 1.6 },
    );
  },
};

const depthOfField: Demo = {
  id: 'effects-dof',
  title: 'Depth-of-field approximation',
  category: 'effects',
  summary:
    'A blurred copy is masked by a horizontal band, so only part of the frame is out of focus.',
  trigger: 'Drag the slider',
  techniques: [288],
  keywords: 'depth of field blur focus band',
  note:
    'A 2D approximation of depth of field. A true effect needs a depth buffer, which the flat artwork here does not have.',
  mount({ root }) {
    const wrap = mediaStage(root);
    const blur = el('img', 'demo__media-img demo__media-blur');
    blur.src = artwork('a', 900, 32);
    blur.alt = '';
    wrap.appendChild(blur);
    let position = 50;
    effectSliders(
      root,
      [{ key: 'focus', label: 'Focus band', min: 0, max: 100, value: 50 }],
      (_key, value) => {
        position = value;
        blur.style.maskImage = `linear-gradient(to bottom, #000 0%, #000 ${position - 12}%, transparent ${
          position + 12
        }%, transparent 100%)`;
      },
    );
  },
};

const pixelate: Demo = {
  id: 'effects-pixelate',
  title: 'Pixelation',
  category: 'effects',
  summary: 'The artwork is drawn at a reduced resolution and scaled back up.',
  trigger: 'Drag the size slider',
  techniques: [294, 295],
  keywords: 'pixelate low resolution retro',
  mount({ root }) {
    const canvas = canvasStage(root, 'demo__stage--canvas');
    const source = artwork('a', 800, 32);
    const img = new Image();
    img.src = source;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let size = 24;
    const render = () => {
      const fitted = fitCanvas(canvas);
      if (!fitted) return;
      const { ctx: c, width, height } = fitted;
      c.imageSmoothingEnabled = false;
      c.clearRect(0, 0, width, height);
      if (!img.complete || img.naturalWidth === 0) return;
      c.drawImage(img, 0, 0, size, (size * height) / width, 0, 0, width, height);
    };
    img.addEventListener('load', render);
    effectSliders(
      root,
      [{ key: 'size', label: 'Pixel size', min: 6, max: 90, value: 24 }],
      (_key, value) => {
        size = value;
        render();
      },
    );
  },
};

export const effectDemos: Demo[] = [
  hoverGlow,
  skewDistort,
  dragDistort,
  chromatic,
  glitch,
  scanlines,
  filmGrain,
  bloom,
  vignette,
  dither,
  shockwave,
  lightSweep,
  depthOfField,
  pixelate,
];

export { createLoop };
