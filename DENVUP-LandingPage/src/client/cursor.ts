/**
 * Pointer-only cursor: a dot, a ring with a trailing echo, and a label.
 *
 * Rules that matter here:
 *  - only on fine pointers; a touch device keeps its native behaviour;
 *  - the native pointer is restored the moment anything fails, so a visitor is
 *    never left without a cursor;
 *  - no blend mode: the ring carries a two-tone rim so it stays visible on
 *    white, on orange and on the dark chapters;
 *  - pointer-events: none, so it can never swallow a click;
 *  - under reduced motion the echo is removed and the ring stops scaling.
 */

let ring: HTMLElement | null = null;
let dot: HTMLElement | null = null;
let label: HTMLElement | null = null;
let started = false;
let x = 0;
let y = 0;
let rx = 0;
let ry = 0;
let raf = 0;
let visible = false;
let probedAt = 0;
let probeTimer = 0;

const LABELLED = 'a, button, [role="button"], [data-cursor-label], input, textarea, select, summary, [data-lab-host]';

function enabled(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function reduced(): boolean {
  return document.documentElement.dataset.motion === 'reduced';
}

/**
 * The scene key says which chapter the stage is on, not what is under the
 * pointer: a dark card scrolling over a bone chapter (or a light form over the
 * ink chapter) would leave a ring of the same colour as its ground. So the ink
 * is decided by the topmost painted background at the pointer, and only falls
 * back to the scene when that ground is an image, a canvas or unknown.
 */
function parseColour(value: string): [number, number, number, number] | null {
  const nums = value.match(/[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 3) return null;
  // color(srgb ...) reports 0..1 channels; rgb()/rgba() report 0..255.
  const scale = value.startsWith('color(') ? 255 : 1;
  const [r, g, b, a] = nums;
  return [r * scale, g * scale, b * scale, a === undefined ? 1 : a];
}

const INK_DARK: [number, number, number] = [11, 10, 9];
const INK_LIGHT: [number, number, number] = [244, 239, 232];

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number): number => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

let sampleCanvas: HTMLCanvasElement | null = null;

function toneOf(pixel: [number, number, number]): 'dark' | 'light' {
  return contrast(pixel, INK_DARK) >= contrast(pixel, INK_LIGHT) ? 'dark' : 'light';
}

/** The first painted background behind an element, composited over white. */
function behind(node: Element): [number, number, number] {
  let parent = node.parentElement;
  while (parent) {
    const colour = parseColour(getComputedStyle(parent).backgroundColor);
    if (colour && colour[3] >= 0.5) return [colour[0], colour[1], colour[2]];
    parent = parent.parentElement;
  }
  return [255, 255, 255];
}

/**
 * The tone actually seen at the pointer over an image: the image is drawn at
 * that point into a one-pixel canvas, then composited over whatever is behind
 * it. Transparent art (a glow over a dark card) therefore reads the card, not
 * the average of the file.
 */
function imageTone(img: HTMLImageElement, px: number, py: number): 'dark' | 'light' | null {
  const src = img.currentSrc || img.src;
  if (!src || !img.complete || img.naturalWidth === 0) return null;
  try {
    const rect = img.getBoundingClientRect();
    const fit = getComputedStyle(img).objectFit;
    let drawWidth = rect.width;
    let drawHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;
    if (fit === 'cover' || fit === 'contain') {
      const scale = fit === 'cover'
        ? Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
        : Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
      drawWidth = img.naturalWidth * scale;
      drawHeight = img.naturalHeight * scale;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = (rect.height - drawHeight) / 2;
    }
    const u = (px - rect.left - offsetX) / drawWidth;
    const v = (py - rect.top - offsetY) / drawHeight;
    const back = behind(img);
    if (u < 0 || u > 1 || v < 0 || v > 1) return toneOf(back); // pointer on the card behind
    sampleCanvas ??= document.createElement('canvas');
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const context = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;
    context.clearRect(0, 0, 1, 1);
    const sourceW = Math.max(1, img.naturalWidth / 64);
    const sourceH = Math.max(1, img.naturalHeight / 64);
    context.drawImage(img, u * img.naturalWidth - sourceW / 2, v * img.naturalHeight - sourceH / 2, sourceW, sourceH, 0, 0, 1, 1);
    const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
    const a = alpha / 255;
    const pixel: [number, number, number] = a < 0.02
      ? back
      : [r * a + back[0] * (1 - a), g * a + back[1] * (1 - a), b * a + back[2] * (1 - a)];
    return toneOf(pixel);
  } catch {
    return null; // cross-origin or undecodable: the two-tone rim still carries it
  }
}

function probeInk(px: number, py: number, force = false): void {
  const now = performance.now();
  if (!force && now - probedAt < 80) return;
  probedAt = now;
  try {
    const root = document.documentElement;
    const nodes = document.elementsFromPoint(px, py) as Element[];
    for (const node of nodes) {
      if (node.closest('.cursor')) continue;
      if (node instanceof HTMLImageElement) {
        const tone = imageTone(node, px, py);
        if (tone) root.dataset.cursorInk = tone;
        else delete root.dataset.cursorInk;
        return;
      }
      if (node instanceof HTMLCanvasElement || node instanceof HTMLVideoElement) {
        // The stage paints its own ground, so its ink stays with the scene. A
        // demo canvas is a panel inside a card: the card behind it is the ground.
        if (node.hasAttribute('data-scene-canvas')) {
          delete root.dataset.cursorInk;
          return;
        }
        continue;
      }
      const colour = parseColour(getComputedStyle(node).backgroundColor);
      if (!colour || colour[3] < 0.5) continue;
      const ground: [number, number, number] = [colour[0], colour[1], colour[2]];
      root.dataset.cursorInk = contrast(ground, INK_DARK) >= contrast(ground, INK_LIGHT) ? 'dark' : 'light';
      return;
    }
    delete root.dataset.cursorInk;
  } catch {
    /* A failed probe must not remove the cursor; the scene ink still applies. */
  }
}

/** Scrolling changes the ground without a pointermove; settle, then re-read it. */
function queueProbe(): void {
  if (!visible) return;
  clearTimeout(probeTimer);
  probeTimer = window.setTimeout(() => probeInk(x, y, true), 90);
}

function frame(): void {
  raf = requestAnimationFrame(frame);
  const ease = reduced() ? 1 : 0.18;
  rx += (x - rx) * ease;
  ry += (y - ry) * ease;
  if (ring) ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
  if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  if (label) label.style.transform = `translate3d(${(rx + 26).toFixed(1)}px, ${(ry + 18).toFixed(1)}px, 0)`;
}

function labelFor(target: HTMLElement): string {
  const explicit = target.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel;
  if (explicit) return explicit;
  if (target.closest('a, button, [role="button"], summary')) {
    if (target.closest('[data-lab-host]')) return 'play';
    return '';
  }
  return '';
}

function onOver(event: PointerEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const interactive = target.closest<HTMLElement>(LABELLED);
  document.documentElement.classList.toggle('cursor-is-hot', Boolean(interactive));
  const text = labelFor(target);
  if (label) {
    label.textContent = text;
    label.classList.toggle('is-on', Boolean(text));
  }
}

export function initCursor(): void {
  if (started) return;
  if (!enabled()) {
    document.documentElement.dataset.cursor = 'native';
    return;
  }
  ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
  dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!ring || !dot) {
    document.documentElement.dataset.cursor = 'native';
    return;
  }

  try {
    started = true;
    document.documentElement.dataset.cursor = 'custom';
    document.documentElement.classList.add('has-cursor');

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        document.documentElement.classList.add('cursor-is-on');
      }
      probeInk(x, y);
    }, { passive: true });

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', () => document.documentElement.classList.add('cursor-is-down'));
    document.addEventListener('pointerup', () => document.documentElement.classList.remove('cursor-is-down'));
    document.addEventListener('pointerleave', () => {
      visible = false;
      document.documentElement.classList.remove('cursor-is-on');
    });

    window.addEventListener('scroll', queueProbe, { passive: true });
    window.addEventListener('scrollend', queueProbe, { passive: true });

    raf = requestAnimationFrame(frame);
  } catch {
    /* If anything above fails, put the native cursor back. */
    document.documentElement.classList.remove('has-cursor');
    document.documentElement.dataset.cursor = 'native';
    cancelAnimationFrame(raf);
  }
}
