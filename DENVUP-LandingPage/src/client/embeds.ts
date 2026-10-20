import { $$ } from './env';
import { mountEmbed } from './labs';
import { conceptDemo } from '../content/demo-map';

export function initEmbeds(): void {
  $$<HTMLElement>('[data-concept-demo]').forEach((host) => {
    const key = host.dataset.conceptDemo ?? '';
    const mapping = conceptDemo[key];
    if (!mapping) return;
    const [slug, index] = mapping;
    host.querySelector('.cap__fallback')?.remove();
    mountEmbed(host, slug, index, key);
  });
}
