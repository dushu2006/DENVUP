/** Card, grid and gallery demonstrations. */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { artwork, button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

function cardGrid(root: HTMLElement, count = 4, className = ''): HTMLElement[] {
  const wrap = stage(root, `demo__stage--cards ${className}`.trim());
  const cards: HTMLElement[] = [];
  for (let i = 0; i < count; i += 1) {
    const card = el('article', 'demo__card');
    const media = el('div', 'demo__card-media');
    const img = el('img');
    img.src = artwork(i % 2 === 0 ? 'a' : 'b', 600, i * 37 + 12);
    img.alt = '';
    const body = el('div', 'demo__card-body');
    body.innerHTML = `<b>Project ${String(i + 1).padStart(2, '0')}</b><span>Design · Build · Motion</span>`;
    card.append(media, body);
    media.appendChild(img);
    wrap.appendChild(card);
    cards.push(card);
  }
  return cards;
}

const tiltCard: Demo = {
  id: 'card-tilt',
  title: '3D tilt and pointer highlight',
  category: 'cards',
  summary: 'The card tilts in 3D and a highlight follows the pointer across its surface.',
  trigger: 'Move the pointer over a card',
  techniques: [176, 177, 179, 178, 344],
  keywords: 'tilt 3d card perspective highlight',
  mount({ root }) {
    const cards = cardGrid(root, 2, 'demo__stage--cards-tilt');
    const cleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${
          -y * 12
        }deg) translateZ(6px)`;
        card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
        card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      };
      const onLeave = () => {
        card.style.transform = '';
      };
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  },
};

const imagePan: Demo = {
  id: 'card-image-pan',
  title: 'Artwork pans inside a clipped frame',
  category: 'cards',
  summary: 'The image is larger than its frame and slides as the pointer moves, so the crop feels physical.',
  trigger: 'Move the pointer over the card',
  techniques: [181, 180, 425],
  keywords: 'pan image clipped frame crop zoom',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--cards');
    const card = el('article', 'demo__card demo__card--wide');
    const media = el('div', 'demo__card-media demo__card-media--pan');
    const img = el('img');
    img.src = artwork('b', 1200, 205);
    img.alt = '';
    media.appendChild(img);
    card.appendChild(media);
    wrap.appendChild(card);
    const onMove = (event: PointerEvent) => {
      const rect = media.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `scale(1.12) translate(${(-x * 16).toFixed(1)}px, ${(
        -y * 16
      ).toFixed(1)}px)`;
    };
    const onLeave = () => {
      img.style.transform = '';
    };
    media.addEventListener('pointermove', onMove);
    media.addEventListener('pointerleave', onLeave);
    return () => {
      media.removeEventListener('pointermove', onMove);
      media.removeEventListener('pointerleave', onLeave);
    };
  },
};

const contentSlide: Demo = {
  id: 'card-content-slide',
  title: 'Card content slides into view',
  category: 'cards',
  summary: 'The metadata panel slides up over the artwork on hover, or on tap.',
  trigger: 'Hover, focus or tap a card',
  techniques: [182, 202, 411, 420],
  keywords: 'content slide hover tap metadata',
  mount({ root }) {
    const cards = cardGrid(root, 2);
    const cleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const onEnter = () => card.classList.add('is-open');
      const onLeave = () => card.classList.remove('is-open');
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('focusin', onEnter);
      card.addEventListener('focusout', onLeave);
      card.addEventListener('click', () => card.classList.toggle('is-open'));
      card.tabIndex = 0;
      cleanups.push(() => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointerleave', onLeave);
        card.removeEventListener('focusin', onEnter);
        card.removeEventListener('focusout', onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  },
};

const expandCard: Demo = {
  id: 'card-expand',
  title: 'Card expands into a detail panel',
  category: 'cards',
  summary: 'Selecting a card grows it into a full detail view with its own close control.',
  trigger: 'Press a card',
  techniques: [183, 184, 197, 196],
  keywords: 'expand card detail fullscreen lightbox',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--cards demo__stage--expand');
    const cards = cardGrid(root, 3);
    const detail = el('div', 'demo__detail');
    detail.hidden = true;
    const detailMedia = el('div', 'demo__detail-media');
    const detailBody = el('div', 'demo__detail-body');
    const close = el('button', 'demo__detail-close');
    close.type = 'button';
    close.textContent = 'Close';
    close.setAttribute('aria-label', 'Close detail view');
    detailBody.innerHTML = '<b>Project detail</b><p>Scope, outcome and the techniques used.</p>';
    detail.append(detailMedia, detailBody, close);
    wrap.appendChild(detail);

    const cleanups: (() => void)[] = [];
    const open = (card: HTMLElement) => {
      const img = card.querySelector('img');
      if (img) {
        detailMedia.style.backgroundImage = `url(${img.src})`;
      }
      detail.hidden = false;
      gsap.fromTo(
        detail,
        { autoAlpha: 0, scale: 0.94 },
        { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'power3.out' },
      );
      close.focus();
    };
    const closeDetail = () => {
      gsap.to(detail, {
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          detail.hidden = true;
        },
      });
    };
    cards.forEach((card) => {
      const onClick = () => open(card);
      card.addEventListener('click', onClick);
      card.tabIndex = 0;
      cleanups.push(() => card.removeEventListener('click', onClick));
    });
    close.addEventListener('click', closeDetail);
    return () => cleanups.forEach((fn) => fn());
  },
};

const dragGallery: Demo = {
  id: 'card-drag-gallery',
  title: 'Drag-to-scroll gallery with inertia',
  category: 'cards',
  summary: 'Drag the strip sideways; it keeps moving for a moment when you let go.',
  trigger: 'Drag the strip, or use the buttons',
  techniques: [189, 190, 423],
  keywords: 'drag gallery inertial momentum scroll',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--strip');
    const track = el('div', 'demo__strip-track');
    for (let i = 0; i < 8; i += 1) {
      const item = el('figure', 'demo__strip-item');
      const img = el('img');
      img.src = artwork(i % 2 ? 'b' : 'a', 420, i * 29 + 8);
      img.alt = '';
      item.appendChild(img);
      track.appendChild(item);
    }
    wrap.appendChild(track);

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;
    let momentum = 0;

    const onDown = (event: PointerEvent) => {
      dragging = true;
      startX = event.clientX;
      lastX = event.clientX;
      lastT = performance.now();
      startScroll = track.scrollLeft;
      velocity = 0;
      momentum = 0;
      track.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      track.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = (event.clientX - lastX) / dt;
      lastX = event.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      momentum = -velocity * 12;
    };
    const tick = () => {
      if (!dragging && Math.abs(momentum) > 0.4) {
        track.scrollLeft += momentum;
        momentum *= 0.94;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);

    const bar = controls(root);
    bar.append(
      button('Scroll left', () => {
        track.scrollBy({ left: -220, behavior: 'smooth' });
      }),
      button('Scroll right', () => {
        track.scrollBy({ left: 220, behavior: 'smooth' });
      }),
    );
    hint(root, 'Drag the strip, or use the buttons — both do the same thing.');
    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
    };
  },
};

const snapCarousel: Demo = {
  id: 'card-snap-carousel',
  title: 'Scroll-snap carousel',
  category: 'cards',
  summary: 'A snapping carousel that also responds to a swipe.',
  trigger: 'Scroll or swipe the row',
  techniques: [191, 412, 191],
  keywords: 'carousel snap swipe scroll',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--strip demo__stage--snaprow');
    for (let i = 0; i < 6; i += 1) {
      const item = el('div', 'demo__snaprow-item');
      item.textContent = `Item ${i + 1}`;
      wrap.appendChild(item);
    }
  },
};

const threeCarousel: Demo = {
  id: 'card-3d-carousel',
  title: '3D carousel',
  category: 'cards',
  summary: 'Cards arranged around a circle in 3D space, rotated with a slider.',
  trigger: 'Drag the slider',
  techniques: [192, 193],
  keywords: '3d carousel coverflow circle',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--carousel');
    const ring = el('div', 'demo__carousel-ring');
    for (let i = 0; i < 6; i += 1) {
      const card = el('div', 'demo__carousel-card');
      card.textContent = String(i + 1).padStart(2, '0');
      card.style.setProperty('--a', `${(i / 6) * 360}deg`);
      ring.appendChild(card);
    }
    wrap.appendChild(ring);
    const bar = controls(root);
    const range = el('input');
    range.type = 'range';
    range.min = '0';
    range.max = '360';
    range.value = '0';
    range.setAttribute('aria-label', 'Rotate the carousel');
    range.addEventListener('input', () => {
      ring.style.transform = `rotateY(${range.value}deg)`;
    });
    bar.appendChild(range);
  },
};

const comparison: Demo = {
  id: 'card-comparison',
  title: 'Before / after comparison slider',
  category: 'cards',
  summary: 'Drag the handle to wipe between two treatments of the same frame.',
  trigger: 'Drag the handle, or use the arrow keys',
  techniques: [194, 195, 413, 423],
  keywords: 'before after comparison slider wipe drag',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--compare');
    const a = el('img', 'demo__compare-a');
    const b = el('img', 'demo__compare-b');
    a.src = artwork('a', 900, 24);
    b.src = artwork('b', 900, 210);
    a.alt = 'Artwork before the treatment';
    b.alt = 'Artwork after the treatment';
    const handle = el('span', 'demo__compare-handle');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('aria-label', 'Comparison position');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', '50');
    wrap.append(a, b, handle);

    let position = 50;
    const apply = () => {
      b.style.clipPath = `inset(0 0 0 ${position}%)`;
      handle.style.left = `${position}%`;
      handle.setAttribute('aria-valuenow', String(Math.round(position)));
    };
    const setFromEvent = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      position = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      apply();
    };
    let dragging = false;
    const onDown = (event: PointerEvent) => {
      dragging = true;
      handle.setPointerCapture(event.pointerId);
      setFromEvent(event);
    };
    const onMove = (event: PointerEvent) => {
      if (dragging) setFromEvent(event);
    };
    const onUp = () => {
      dragging = false;
    };
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    handle.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') position = Math.max(0, position - 4);
      else if (event.key === 'ArrowRight') position = Math.min(100, position + 4);
      else return;
      event.preventDefault();
      apply();
    });
    apply();
    return () => {
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  },
};

const beforeAfterSite: Demo = {
  id: 'card-site-transformation',
  title: 'Before / after website transformation',
  category: 'cards',
  summary:
    'One page structure shown twice: as a generic template, and as the studio’s treatment of it.',
  trigger: 'Drag the divider',
  techniques: [306],
  keywords: 'before after website transformation comparison',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--site');
    const plain = el('div', 'demo__site demo__site--plain');
    plain.innerHTML = `
      <div class="demo__site-bar"><span>ACME SUPPLY</span><span>Home About Contact</span></div>
      <div class="demo__site-body">
        <h4>We build websites</h4>
        <p>Affordable websites for small businesses. Fast, simple and cheap.</p>
        <button>Read more</button>
        <div class="demo__site-cols"><i></i><i></i><i></i></div>
      </div>`;
    const made = el('div', 'demo__site demo__site--made');
    made.innerHTML = `
      <div class="demo__site-bar"><span>ACME / STUDIO</span><span>Work Method Contact</span></div>
      <div class="demo__site-body">
        <h4>Build the thing they remember</h4>
        <p>Motion, structure and craft — decided in the brief, not added at the end.</p>
        <button>Start a project</button>
        <div class="demo__site-cols"><i></i><i></i><i></i></div>
      </div>`;
    wrap.append(plain, made);
    const toggle = el('button', 'demo__toggle-line');
    toggle.type = 'button';
    toggle.textContent = 'Drag to compare';
    let pos = 50;
    const apply = () => {
      made.style.clipPath = `inset(0 0 0 ${pos}%)`;
      toggle.style.left = `${pos}%`;
    };
    const set = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pos = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      apply();
    };
    let dragging = false;
    const onDown = (event: PointerEvent) => {
      dragging = true;
      set(event);
    };
    const onMove = (event: PointerEvent) => {
      if (dragging) set(event);
    };
    const onUp = () => {
      dragging = false;
    };
    wrap.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    apply();
    return () => {
      wrap.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  },
};

const thumbnailFollow: Demo = {
  id: 'card-thumbnail-follow',
  title: 'Thumbnail follows the pointer',
  category: 'cards',
  summary: 'A floating preview tracks the pointer across a list of projects.',
  trigger: 'Move the pointer over the list',
  techniques: [200, 201, 70],
  keywords: 'thumbnail follow pointer preview project number',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--follow');
    const list = el('div', 'demo__follow-list');
    for (let i = 0; i < 4; i += 1) {
      const row = el('button', 'demo__follow-row');
      row.type = 'button';
      row.innerHTML = `<span>0${i + 1}</span><b>Project ${i + 1}</b>`;
      list.appendChild(row);
    }
    const preview = el('div', 'demo__follow-preview');
    wrap.append(list, preview);

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      preview.style.transform = `translate3d(${event.clientX - rect.left - 60}px, ${
        event.clientY - rect.top - 45
      }px, 0)`;
      preview.style.opacity = '1';
    };
    const onLeave = () => {
      preview.style.opacity = '0';
    };
    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerleave', onLeave);
    list.addEventListener('pointerover', (event) => {
      const row = (event.target as HTMLElement).closest<HTMLElement>('.demo__follow-row');
      if (!row) return;
      const index = Number(row.querySelector('span')?.textContent ?? '1') - 1;
      preview.style.backgroundImage = `url(${artwork(index % 2 ? 'b' : 'a', 300, index * 41 + 10)})`;
    });
    return () => {
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', onLeave);
    };
  },
};

const expandableMeta: Demo = {
  id: 'card-meta-expand',
  title: 'Expandable project metadata',
  category: 'cards',
  summary: 'Each row reveals its own detail without moving the others.',
  trigger: 'Press a row',
  techniques: [203, 143],
  keywords: 'expandable metadata details rows',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--rows');
    for (let i = 0; i < 3; i += 1) {
      const item = el('div', 'demo__row');
      const head = el('button', 'demo__row-head');
      head.type = 'button';
      head.setAttribute('aria-expanded', 'false');
      head.innerHTML = `<b>Project ${i + 1}</b><span class="demo__row-sign" aria-hidden="true"></span>`;
      const body = el('div', 'demo__row-body');
      body.innerHTML = '<div><p>Scope, stack, and the techniques used in the build.</p></div>';
      item.append(head, body);
      head.addEventListener('click', () => {
        const open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', String(!open));
        item.classList.toggle('is-open', !open);
      });
      wrap.appendChild(item);
    }
  },
};

const lightbox: Demo = {
  id: 'card-lightbox',
  title: 'Lightbox zoom from the thumbnail',
  category: 'cards',
  summary: 'The image expands out of the position of the thumbnail that opened it.',
  trigger: 'Press a thumbnail',
  techniques: [196, 197],
  keywords: 'lightbox zoom thumbnail modal',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--thumbs');
    const thumbs = el('div', 'demo__thumbs');
    for (let i = 0; i < 3; i += 1) {
      const t = el('button', 'demo__thumb');
      t.type = 'button';
      const img = el('img');
      img.src = artwork(i % 2 ? 'b' : 'a', 260, i * 33 + 6);
      img.alt = '';
      t.appendChild(img);
      thumbs.appendChild(t);
    }
    wrap.appendChild(thumbs);
  },
};

const motionPreview: Demo = {
  id: 'card-motion-preview',
  title: 'Motion preview on hover',
  category: 'cards',
  summary:
    'A procedural clip plays on hover instead of a video file — no licensed footage required.',
  trigger: 'Hover or focus a card',
  techniques: [199],
  keywords: 'hover preview video motion procedural',
  note:
    'Implemented as a procedural motion preview because the repository contains no licensed video asset. Swapping in a real clip is a one-line change.',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--cards');
    const card = el('article', 'demo__card demo__card--preview');
    const media = el('div', 'demo__card-media demo__card-media--preview');
    const bars = el('div', 'demo__preview-bars');
    for (let i = 0; i < 9; i += 1) {
      const bar = el('i');
      bar.style.setProperty('--i', String(i));
      bars.appendChild(bar);
    }
    media.appendChild(bars);
    const body = el('div', 'demo__card-body');
    body.innerHTML = '<b>Motion preview</b><span>Hover to play</span>';
    card.append(media, body);
    wrap.appendChild(card);
    if (reduced) {
      bars.classList.add('is-static');
      return;
    }
    const onEnter = () => bars.classList.add('is-playing');
    const onLeave = () => bars.classList.remove('is-playing');
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('focusin', onEnter);
    card.addEventListener('focusout', onLeave);
    return () => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
    };
  },
};

export const cardDemos: Demo[] = [
  tiltCard,
  imagePan,
  contentSlide,
  expandCard,
  dragGallery,
  snapCarousel,
  threeCarousel,
  comparison,
  beforeAfterSite,
  thumbnailFollow,
  expandableMeta,
  lightbox,
  motionPreview,
];

export { gsap };
