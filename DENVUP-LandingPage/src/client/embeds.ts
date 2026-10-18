import { $$ } from './env';
import { mountEmbed } from './labs';

const capabilityMap: Record<string, [string, number]> = {
  web: ['navigation', 0],
  uiux: ['navigation', 1],
  motion: ['media', 0],
  type: ['type', 3],
  scroll: ['scroll', 3],
  cursor: ['cursor', 6],
  graphics: ['graphics', 0],
  threed: ['threed', 2],
  responsive: ['responsive', 1],
};

const conceptMap: Record<string, [string, number]> = {
  fold: ['type', 3],
  current: ['particles', 3],
  index: ['collections', 4],
  relay: ['scroll', 5],
};

export function initEmbeds(): void {
  $$<HTMLElement>('[data-cap-demo]').forEach((host) => {
    const key = host.dataset.capDemo ?? '';
    const mapping = capabilityMap[key];
    if (!mapping) return;
    const [slug, index] = mapping;
    host.querySelector('.cap__fallback')?.remove();
    mountEmbed(host, slug, index, key);
  });

  $$<HTMLElement>('[data-concept-demo]').forEach((host) => {
    const key = host.dataset.conceptDemo ?? '';
    const mapping = conceptMap[key];
    if (!mapping) return;
    const [slug, index] = mapping;
    host.querySelector('.cap__fallback')?.remove();
    mountEmbed(host, slug, index, key);
  });
}
