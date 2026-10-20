import { labById } from '../labs/registry';
import { isTouch, prefersReduced } from './env';
import { mountStage } from './stage';

/**
 * Mount one lab mode into a host outside the (retired) effects library.
 * Returns a destroy function so a stage can be swapped without leaving
 * canvases, timers or pointer listeners behind.
 */
export function mountEmbed(host: HTMLElement, slug: string, modeIndex: number, label: string): (() => void) | null {
  const lab = labById.get(slug);
  const mode = lab?.modes[modeIndex];
  if (!lab || !mode) return null;
  const mounted = mountStage(host, mode, { reduced: prefersReduced(), touch: isTouch() });
  host.dataset.embed = `${slug}:${modeIndex}`;
  host.setAttribute('role', 'group');
  host.setAttribute('aria-label', `${label} — live demo: ${mode.name}. ${mode.summary}`);
  return () => mounted.destroy();
}
