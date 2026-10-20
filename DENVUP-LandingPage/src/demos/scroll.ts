/** Scroll-driven motion demonstrations (scroll inside the panel). */

import { el } from '../core/dom';
import { gsap, ScrollTrigger } from '../core/motion';
import { artwork, button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

function scrollStage(root: HTMLElement, height = 320): HTMLElement {
  const wrap = stage(root, 'demo__stage--scroll');
  wrap.style.height = `${height}px`;
  return wrap;
}

function scroller(root: HTMLElement, contentHeight: number): HTMLElement {
  const wrap = scrollStage(root);
  const inner = el('div', 'demo__scroll-inner');
  inner.style.height = `${contentHeight}px`;
  wrap.appendChild(inner);
  return inner;
}

const slideEdges: Demo = {
  id: 'scroll-slide-edges',
  title: 'Panels slide in from either edge',
  category: 'scroll',
  summary: 'Direction-aware entrances: the left panel comes from the left, the right one from the right.',
  trigger: 'Scroll inside the panel',
  techniques: [113, 144],
  keywords: 'slide left right direction enter',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const left = el('div', 'demo__slide demo__slide--left');
    const right = el('div', 'demo__slide demo__slide--right');
    left.textContent = 'Left';
    right.textContent = 'Right';
    inner.append(left, right);
    if (reduced) return;
    gsap.fromTo(
      left,
      { xPercent: -120 },
      {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: left, start: 'top bottom', end: 'top top', scrub: 0.6 },
      },
    );
    gsap.fromTo(
      right,
      { xPercent: 120 },
      {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: right, start: 'top bottom', end: 'top top', scrub: 0.6 },
      },
    );
  },
};

const scaleReveal: Demo = {
  id: 'scroll-scale-reveal',
  title: 'Scale-up reveal on entry',
  category: 'scroll',
  summary: 'Cards grow from a small size as they arrive, rather than simply fading in.',
  trigger: 'Scroll inside the panel',
  techniques: [115],
  keywords: 'scale reveal grow entry',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const card = el('div', 'demo__block demo__block--ember');
    inner.appendChild(card);
    if (reduced) return;
    gsap.fromTo(
      card,
      { scale: 0.4, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        ease: 'power2.out',
        scrollTrigger: { scroller: inner.parentElement!, trigger: card, start: 'top 85%', end: 'top 40%', scrub: 0.8 },
      },
    );
  },
};

const blurClear: Demo = {
  id: 'scroll-blur-clear',
  title: 'Blur-to-clear reveal',
  category: 'scroll',
  summary: 'Content arrives out of focus and sharpens as the scroll settles.',
  trigger: 'Scroll inside the panel',
  techniques: [116],
  keywords: 'blur clear focus scroll reveal',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const card = el('div', 'demo__block demo__block--ink');
    inner.appendChild(card);
    if (reduced) return;
    gsap.fromTo(
      card,
      { filter: 'blur(16px)', autoAlpha: 0.3 },
      {
        filter: 'blur(0px)',
        autoAlpha: 1,
        ease: 'power2.out',
        scrollTrigger: { scroller: inner.parentElement!, trigger: card, start: 'top 90%', end: 'top 45%', scrub: 0.7 },
      },
    );
  },
};

const clipReveal: Demo = {
  id: 'scroll-clip-reveal',
  title: 'Clip-path reveal',
  category: 'scroll',
  summary: 'A window opens across the artwork as you scroll.',
  trigger: 'Scroll inside the panel',
  techniques: [117],
  keywords: 'clip path reveal window',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const frame = el('div', 'demo__frame');
    const img = el('img');
    img.src = artwork('a', 900, 40);
    img.alt = '';
    frame.appendChild(img);
    inner.appendChild(frame);
    if (reduced) return;
    gsap.fromTo(
      frame,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: frame, start: 'top 95%', end: 'top 35%', scrub: 0.6 },
      },
    );
  },
};

const imageWipe: Demo = {
  id: 'scroll-image-wipe',
  title: 'Image wipe reveal',
  category: 'scroll',
  summary: 'One artwork wipes over another as the panel scrolls.',
  trigger: 'Scroll inside the panel',
  techniques: [118],
  keywords: 'image wipe replace reveal',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const frame = el('div', 'demo__frame');
    const a = el('img');
    const b = el('img', 'demo__frame-top');
    a.src = artwork('a', 900, 16);
    b.src = artwork('b', 900, 210);
    a.alt = '';
    b.alt = '';
    frame.append(a, b);
    inner.appendChild(frame);
    if (reduced) return;
    gsap.fromTo(
      b,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: frame, start: 'top 90%', end: 'top 35%', scrub: 0.6 },
      },
    );
  },
};

const parallaxLayers: Demo = {
  id: 'scroll-parallax',
  title: 'Parallax background and foreground',
  category: 'scroll',
  summary: 'Three layers move at different rates, which is what makes a flat page feel deep.',
  trigger: 'Scroll inside the panel',
  techniques: [122, 123],
  keywords: 'parallax layers depth background foreground',
  mount({ root, reduced }) {
    const inner = scroller(root, 1000);
    const layer = (depth: number, cls: string) => {
      const node = el('div', `demo__plane demo__plane--${cls}`);
      node.dataset.depth = String(depth);
      inner.appendChild(node);
      return node;
    };
    layer(0.1, 'back');
    layer(0.35, 'mid');
    layer(0.8, 'front');
    if (reduced) return;
    inner.querySelectorAll<HTMLElement>('.demo__plane').forEach((node) => {
      const depth = Number(node.dataset.depth ?? 0);
      gsap.to(node, {
        yPercent: -40 * depth,
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: inner, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    });
  },
};

const scrollRotation: Demo = {
  id: 'scroll-rotation',
  title: 'Scroll-linked rotation',
  category: 'scroll',
  summary: 'A shape turns exactly as far as you scroll, with no easing to fight the wheel.',
  trigger: 'Scroll inside the panel',
  techniques: [124],
  keywords: 'rotation spin scroll linked',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const shape = el('div', 'demo__rotator');
    inner.appendChild(shape);
    if (reduced) return;
    gsap.to(shape, {
      rotation: 360,
      ease: 'none',
      scrollTrigger: { scroller: inner.parentElement!, trigger: inner, start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
  },
};

const imageCrop: Demo = {
  id: 'scroll-image-crop',
  title: 'Scroll-linked image crop',
  category: 'scroll',
  summary: 'The frame stays put while the artwork inside it moves, cropping it as you go.',
  trigger: 'Scroll inside the panel',
  techniques: [129],
  keywords: 'crop image scroll linked',
  mount({ root, reduced }) {
    const inner = scroller(root, 900);
    const frame = el('div', 'demo__frame demo__frame--tall');
    const img = el('img');
    img.src = artwork('b', 1200, 205);
    img.alt = '';
    frame.appendChild(img);
    inner.appendChild(frame);
    if (reduced) return;
    gsap.fromTo(
      img,
      { yPercent: 0 },
      {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: frame, start: 'top top', end: 'bottom top', scrub: 0.6 },
      },
    );
  },
};

const pinnedSwap: Demo = {
  id: 'scroll-pinned-swap',
  title: 'Pinned panel with changing content',
  category: 'scroll',
  summary: 'A panel stays put while the content inside it changes step by step.',
  trigger: 'Scroll inside the panel',
  techniques: [131, 132, 133],
  keywords: 'pin sticky swap content change',
  mount({ root, reduced }) {
    const wrap = scrollStage(root, 340);
    const inner = el('div', 'demo__scroll-inner');
    inner.style.height = '1400px';
    const pinned = el('div', 'demo__pinned');
    const copy = el('div', 'demo__pinned-copy');
    pinned.appendChild(copy);
    inner.appendChild(pinned);
    wrap.appendChild(inner);

    const steps = ['Research', 'Structure', 'Surface', 'Behaviour', 'Ship'];
    copy.textContent = steps[0];

    if (reduced) {
      hint(root, 'Reduced motion: the steps are listed instead of being pinned.');
      const list = el('ol', 'demo__list');
      steps.forEach((s) => {
        const li = el('li');
        li.textContent = s;
        list.appendChild(li);
      });
      wrap.appendChild(list);
      return;
    }

    const st = ScrollTrigger.create({
      scroller: wrap,
      trigger: inner,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinned,
      pinSpacing: false,
      onUpdate: (self) => {
        const index = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        if (copy.textContent !== steps[index]) copy.textContent = steps[index];
      },
    });
    return () => st.kill();
  },
};

const horizontalStory: Demo = {
  id: 'scroll-horizontal',
  title: 'Vertical scroll drives a horizontal track',
  category: 'scroll',
  summary: 'The classic horizontal-scroll chapter. On small screens it becomes a vertical stack instead.',
  trigger: 'Scroll inside the panel',
  techniques: [134, 421],
  keywords: 'horizontal scroll vertical storytelling track',
  mount({ root, reduced }) {
    const wrap = scrollStage(root, 300);
    const inner = el('div', 'demo__scroll-inner');
    inner.style.height = '1600px';
    const track = el('div', 'demo__htrack');
    for (let i = 0; i < 5; i += 1) {
      const panel = el('div', 'demo__hpanel');
      panel.textContent = `Chapter ${String(i + 1).padStart(2, '0')}`;
      track.appendChild(panel);
    }
    inner.appendChild(track);
    wrap.appendChild(inner);

    if (reduced) {
      track.classList.add('demo__htrack--stacked');
      return;
    }
    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - track.parentElement!.clientWidth),
      ease: 'none',
      scrollTrigger: {
        scroller: wrap,
        trigger: inner,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  },
};

const productShowcase: Demo = {
  id: 'scroll-showcase',
  title: 'Scroll-controlled showcase',
  category: 'scroll',
  summary: 'One object, six states, each one a scroll position.',
  trigger: 'Scroll inside the panel',
  techniques: [135, 137, 138],
  keywords: 'showcase scroll state assemble disperse',
  mount({ root, reduced }) {
    const wrap = scrollStage(root, 300);
    const inner = el('div', 'demo__scroll-inner');
    inner.style.height = '1500px';
    const stageEl = el('div', 'demo__showcase');
    const parts = [0, 1, 2, 3, 4, 5].map((i) => {
      const p = el('span', 'demo__showcase-part');
      p.style.setProperty('--i', String(i));
      stageEl.appendChild(p);
      return p;
    });
    inner.appendChild(stageEl);
    wrap.appendChild(inner);

    if (reduced) {
      stageEl.classList.add('demo__showcase--static');
      return;
    }
    const st = ScrollTrigger.create({
      scroller: wrap,
      trigger: inner,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const active = Math.min(parts.length - 1, Math.floor(self.progress * parts.length));
        parts.forEach((p, i) => p.classList.toggle('is-active', i <= active));
      },
    });
    return () => st.kill();
  },
};

const directionAware: Demo = {
  id: 'scroll-direction',
  title: 'Direction-aware enter and exit',
  category: 'scroll',
  summary: 'The same element exits the opposite way it entered, so the page never feels random.',
  trigger: 'Scroll up and down inside the panel',
  techniques: [144],
  keywords: 'direction aware exit enter',
  mount({ root, reduced }) {
    const inner = scroller(root, 1200);
    const a = el('div', 'demo__block demo__block--ember');
    const b = el('div', 'demo__block demo__block--signal');
    inner.append(a, b);
    if (reduced) return;
    const scrollerEl = inner.parentElement!;
    gsap.fromTo(
      a,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: { scroller: scrollerEl, trigger: a, start: 'top 88%', toggleActions: 'play none none reverse' },
      },
    );
    gsap.fromTo(
      b,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: { scroller: scrollerEl, trigger: b, start: 'top 88%', toggleActions: 'play none none reverse' },
      },
    );
  },
};

const snapPanels: Demo = {
  id: 'scroll-snap',
  title: 'Scroll snap between panels',
  category: 'scroll',
  summary: 'A snap container that settles on one panel at a time.',
  trigger: 'Scroll inside the panel',
  techniques: [145],
  keywords: 'snap panels scroll settle',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--scroll demo__stage--snap');
    wrap.style.height = '260px';
    for (let i = 0; i < 4; i += 1) {
      const p = el('div', 'demo__snap-panel');
      p.textContent = `Panel ${i + 1}`;
      wrap.appendChild(p);
    }
  },
};

const overlappingLayers: Demo = {
  id: 'scroll-overlap',
  title: 'Overlapping layers between chapters',
  category: 'scroll',
  summary: 'Two panels cross over each other as the scroll moves on.',
  trigger: 'Scroll inside the panel',
  techniques: [146],
  keywords: 'overlap layers transition cross',
  mount({ root, reduced }) {
    const inner = scroller(root, 1100);
    const a = el('div', 'demo__layer-card demo__layer-card--a');
    const b = el('div', 'demo__layer-card demo__layer-card--b');
    a.textContent = 'Chapter A';
    b.textContent = 'Chapter B';
    inner.append(a, b);
    if (reduced) return;
    gsap.to(a, {
      yPercent: -60,
      ease: 'none',
      scrollTrigger: { scroller: inner.parentElement!, trigger: inner, start: 'top top', end: 'bottom top', scrub: 0.7 },
    });
    gsap.fromTo(
      b,
      { yPercent: 60 },
      {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { scroller: inner.parentElement!, trigger: inner, start: 'top top', end: 'bottom top', scrub: 0.7 },
      },
    );
  },
};

const depthPerspective: Demo = {
  id: 'scroll-depth',
  title: 'Scroll-linked depth and perspective',
  category: 'scroll',
  summary: 'Layers separate in Z as you scroll, which reads as physical distance.',
  trigger: 'Scroll inside the panel',
  techniques: [147],
  keywords: 'depth perspective parallax z scroll',
  mount({ root, reduced }) {
    const wrap = scrollStage(root, 300);
    wrap.style.perspective = '900px';
    const inner = el('div', 'demo__scroll-inner');
    inner.style.height = '1200px';
    const scene = el('div', 'demo__scene');
    [0, 1, 2].forEach((i) => {
      const layer = el('div', 'demo__scene-layer');
      layer.dataset.depth = String(i);
      scene.appendChild(layer);
    });
    inner.appendChild(scene);
    wrap.appendChild(inner);
    if (reduced) return;
    scene.querySelectorAll<HTMLElement>('.demo__scene-layer').forEach((layer) => {
      const depth = Number(layer.dataset.depth ?? 0);
      gsap.to(layer, {
        z: 260 * depth,
        ease: 'none',
        scrollTrigger: { scroller: wrap, trigger: inner, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    });
  },
};

const storyPanels: Demo = {
  id: 'scroll-story-panels',
  title: 'Sequential full-screen story panels',
  category: 'scroll',
  summary: 'Three narrative panels, each taking the full width of the frame.',
  trigger: 'Scroll inside the panel',
  techniques: [337, 136],
  keywords: 'story panels sequence narrative',
  mount({ root }) {
    const wrap = scrollStage(root, 280);
    for (let i = 0; i < 3; i += 1) {
      const p = el('div', 'demo__story-panel');
      p.innerHTML = `<b>0${i + 1}</b><span>Chapter</span>`;
      wrap.appendChild(p);
    }
  },
};

export const scrollDemos: Demo[] = [
  slideEdges,
  scaleReveal,
  blurClear,
  clipReveal,
  imageWipe,
  parallaxLayers,
  scrollRotation,
  imageCrop,
  pinnedSwap,
  horizontalStory,
  productShowcase,
  directionAware,
  snapPanels,
  overlappingLayers,
  depthPerspective,
  storyPanels,
];

export { button, controls };
