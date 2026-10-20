/**
 * Demo contract for the technique library.
 *
 * Every entry in the library is a *working* demonstration. A demo receives a
 * root element, wires its own interaction, and returns a teardown function
 * that releases every listener, observer, timer and animation it created.
 */

import type { Technique } from '../data/techniques';

export type DemoCategory =
  | 'loading'
  | 'cursor'
  | 'micro'
  | 'type'
  | 'scroll'
  | 'nav'
  | 'cards'
  | 'vector'
  | 'spatial'
  | 'particles'
  | 'effects'
  | 'story'
  | 'team'
  | 'convert'
  | 'media'
  | 'eggs'
  | 'a11y';

export interface DemoContext {
  /** Element the demo may render into. */
  root: HTMLElement;
  /** True when the visitor asked for reduced motion. */
  reduced: boolean;
  /** Device budget: particle counts and loop complexity scale with it. */
  budget: 'low' | 'mid' | 'high';
  /** Fire an announcement for assistive technology. */
  announce: (message: string) => void;
}

export type DemoTeardown = () => void;

export interface Demo {
  /** Stable identifier, also used as the DOM id. */
  id: string;
  /** Human readable name shown on the card. */
  title: string;
  /** Library category this demo belongs to. */
  category: DemoCategory;
  /** One-line description of what the visitor is looking at. */
  summary: string;
  /** What makes the interaction happen. */
  trigger: string;
  /** Encyclopedia technique numbers this demo demonstrates. */
  techniques: number[];
  /** Extra search terms. */
  keywords?: string;
  /** Optional note about limitations. */
  note?: string;
  /** Build the demo. Return a teardown function. */
  mount: (ctx: DemoContext) => DemoTeardown | void;
}

export const categoryLabels: Record<DemoCategory, string> = {
  loading: 'Loading & first visit',
  cursor: 'Cursor & pointer',
  micro: 'Buttons & micro-interactions',
  type: 'Typography & text motion',
  scroll: 'Scroll-driven motion',
  nav: 'Navigation & transitions',
  cards: 'Cards, grids & galleries',
  vector: 'SVG, vector & illustration',
  spatial: '3D, WebGL & spatial',
  particles: 'Particles & generative art',
  effects: 'Materials, light & effects',
  story: 'Service, data & storytelling',
  team: 'Team & studio',
  convert: 'Pricing, FAQ & forms',
  media: 'Audio & immersive media',
  eggs: 'Exploratory details',
  a11y: 'Accessibility & resilience',
};

export function techniqueMap(techniques: Technique[]): Map<number, Technique> {
  return new Map(techniques.map((t) => [t.id, t]));
}
