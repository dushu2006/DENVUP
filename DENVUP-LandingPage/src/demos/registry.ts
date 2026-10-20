/**
 * The technique library registry.
 *
 * Every demo in the library is registered here, together with the encyclopedia
 * technique numbers it demonstrates. The library section uses these maps to
 * link a technique to a working demonstration, and to copy a technique id.
 */

import { audioDemos } from './audio';
import { buttonDemos } from './buttons';
import { cardDemos } from './cards';
import { chartDemos } from './charts';
import { cursorDemos } from './cursor';
import { effectDemos } from './effects';
import { particleDemos } from './particles';
import { scrollDemos } from './scroll';
import { shaderDemos } from './shader';
import { systemDemos } from './system';
import { threeDemos } from './three';
import { typeDemos } from './type';
import { vectorDemos } from './vector';
import { categoryLabels, type Demo, type DemoCategory } from './types';

export const allDemos: Demo[] = [
  ...systemDemos,
  ...cursorDemos,
  ...buttonDemos,
  ...typeDemos,
  ...scrollDemos,
  ...cardDemos,
  ...vectorDemos,
  ...threeDemos,
  ...shaderDemos,
  ...particleDemos,
  ...effectDemos,
  ...chartDemos,
  ...audioDemos,
];

export const demoById = new Map<string, Demo>(allDemos.map((demo) => [demo.id, demo]));

export const demosByTechnique = new Map<number, Demo[]>();
for (const demo of allDemos) {
  for (const technique of demo.techniques) {
    const list = demosByTechnique.get(technique) ?? [];
    list.push(demo);
    demosByTechnique.set(technique, list);
  }
}

export function demosForCategory(category: DemoCategory): Demo[] {
  return allDemos.filter((demo) => demo.category === category);
}

export function usedCategories(): DemoCategory[] {
  const seen = new Set<DemoCategory>();
  for (const demo of allDemos) seen.add(demo.category);
  return (Object.keys(categoryLabels) as DemoCategory[]).filter((category) => seen.has(category));
}

/** Free-text search across the demo title, summary, keywords and technique ids. */
export function searchDemos(query: string): Demo[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return allDemos;
  const numeric = Number(needle);
  return allDemos.filter((demo) => {
    if (Number.isFinite(numeric) && numeric > 0) {
      if (demo.techniques.includes(numeric)) return true;
    }
    const haystack = `${demo.title} ${demo.summary} ${demo.keywords ?? ''} ${demo.techniques.join(' ')} ${categoryLabels[demo.category]}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export { categoryLabels };
export type { Demo, DemoCategory };
