/**
 * Portrait slots.
 *
 * No photographs were supplied, and inventing them was never an option. So
 * every member of the studio has a slot that holds their monogram, drawn in
 * the studio's own emblem treatment.
 *
 * The moment a real photograph is dropped into `/public/portraits/` with the
 * right file name, the slot picks it up and the monogram steps aside. There
 * is no layout change and no second template: the photograph is the same
 * shape, in the same place, at the same size.
 *
 * The file names the studio expects are:
 *
 *   /portraits/t-dusyanth.jpg
 *   /portraits/m-nanda-kishore.jpg
 *   /portraits/k-v-sai-prashanth.jpg
 *   /portraits/p-venkatesh.jpg
 */

import { team } from '../data/site';

const PORTRAIT_DIR = '/portraits/';

function portraitPath(slug: string): string {
  return `${PORTRAIT_DIR}${slug}.jpg`;
}

/**
 * Swap a monogram slot for a photograph, if one exists.
 *
 * The image is fetched off the main thread by the browser; if it 404s the
 * slot keeps the monogram and nothing else changes. No layout shift, because
 * the slot already reserves the photograph's box.
 */
function swapInPortrait(slot: HTMLElement, slug: string, name: string): void {
  if (slot.dataset.portraitState === 'loading') return;
  slot.dataset.portraitState = 'loading';

  const image = new Image();
  image.alt = `${name}, ${'member of the DENVUP studio'}`;
  image.decoding = 'async';
  image.loading = 'lazy';
  image.width = 640;
  image.height = 800;

  image.addEventListener('load', () => {
    slot.dataset.portraitState = 'ready';
    slot.classList.add('has-portrait');
    slot.replaceChildren(image);
  });

  image.addEventListener('error', () => {
    slot.dataset.portraitState = 'absent';
    slot.classList.remove('has-portrait');
    /* The monogram stays. Nothing is broken, nothing is missing. */
  });

  image.src = portraitPath(slug);
}

/**
 * Find every portrait slot on the page and wire it up.
 *
 * A slot is any element carrying `data-portrait` with the member's slug.
 */
export function initPortraits(): () => void {
  const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-portrait]'));
  if (!slots.length) return () => {};

  const byslug = new Map(team.map((member) => [member.slug, member]));

  slots.forEach((slot) => {
    const slug = slot.dataset.portrait ?? '';
    const member = byslug.get(slug);
    if (!member) return;
    swapInPortrait(slot, slug, member.name);
  });

  return () => {};
}
