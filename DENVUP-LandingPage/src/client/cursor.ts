import { $, clamp, isTouch, on, prefersReduced } from './env';

const labels: Record<string, string> = {
  prelude: 'Begin',
  gate: 'Scroll',
  hero: 'Start',
  identity: 'Look',
  manifesto: 'Read',
  services: 'Open',
  'services-deep': 'Enquire',
  capabilities: 'Try',
  'effects-library': 'Play',
  process: 'Follow',
  technologies: 'Inspect',
  team: 'Meet',
  showcase: 'Play',
  pricing: 'Enquire',
  faq: 'Read',
  standards: 'Read',
  contact: 'Write',
  closing: 'Talk',
};

export function initCursor(): void {
  const root = $<HTMLElement>('[data-cursor]');
  if (!root) return;
  if (isTouch() || prefersReduced() || !window.matchMedia('(pointer: fine)').matches) return;

  const dot = root.querySelector<HTMLElement>('.cursor__dot');
  const ring = root.querySelector<HTMLElement>('.cursor__ring');
  const label = root.querySelector<HTMLElement>('.cursor__label');
  if (!dot || !ring || !label) return;

  document.documentElement.dataset.cursor = 'custom';

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;
  let raf = 0;
  let visible = false;

  const move = (event: PointerEvent) => {
    x = event.clientX;
    y = event.clientY;
    if (!visible) {
      visible = true;
      root.style.opacity = '1';
    }
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const animate = () => {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    const dx = clamp((x - rx) / 40, -1, 1);
    const dy = clamp((y - ry) / 40, -1, 1);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(${dx * 5}px, ${dy * 5}px)`;
    label.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    raf = requestAnimationFrame(animate);
  };

  on(window, 'pointermove', move, { passive: true });

  on(document, 'pointerover', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('a, button, [role="button"], summary, label, input, select, textarea');
    if (target) {
      root.classList.add('is-target');
      const section = target.closest<HTMLElement>('[data-chapter]');
      const key = section?.dataset.chapter ?? '';
      const text = target.dataset.cursorLabel ?? labels[key] ?? '';
      if (text) {
        label.textContent = text;
        root.classList.add('has-label');
      }
    } else {
      root.classList.remove('is-target', 'has-label');
    }
  });

  on(document, 'pointerout', (event) => {
    if (!(event.relatedTarget as HTMLElement | null)?.closest?.('a, button, [role="button"], summary, label, input, select, textarea')) {
      root.classList.remove('is-target', 'has-label');
    }
  });

  on(document, 'pointerdown', () => root.classList.add('is-down'));
  on(document, 'pointerup', () => root.classList.remove('is-down'));
  on(document, 'pointerleave', () => {
    root.style.opacity = '0';
    visible = false;
  });

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = () => {
    if (media.matches) {
      cancelAnimationFrame(raf);
      root.style.display = 'none';
      delete document.documentElement.dataset.cursor;
    } else {
      root.style.display = '';
      raf = requestAnimationFrame(animate);
    }
  };
  media.addEventListener('change', onChange);
  raf = requestAnimationFrame(animate);
}
