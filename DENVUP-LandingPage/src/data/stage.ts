/**
 * The stage's looks.
 *
 * One entry per chapter of the home page and one per route. The stage moves
 * between these; it is never reset to a default. Every look is a full
 * specification of the field — palette, density, speed, swirl, stroke length,
 * camera zoom, camera offset and seed — so a chapter's atmosphere is a
 * decision rather than an accident.
 *
 * The names are the site's own vocabulary. "Paper" is the bone ground, "ink"
 * the carbon one, "ember" the brand orange, "signal" the reserved blue.
 */

import type { StageLook } from '../core/stage';

const look = (
  ink: string,
  wash: string,
  density: number,
  speed: number,
  swirl: number,
  length: number,
  zoom: number,
  seed: number,
  offset: { x: number; y: number } = { x: 0, y: 0 },
): StageLook => ({ ink, wash, density, speed, swirl, length, zoom, offset, seed });

export const STAGE_LOOKS = {
  /* ---- Home chapters ------------------------------------------------- */
  prelude: look('#0b0b0c', '#edeeea', 0.55, 0.22, 1.5, 0.018, 1.22, 11),
  expansion: look('#140a05', '#f0490f', 1.35, 0.85, 0.45, 0.055, 1.04, 23),
  manifesto: look('#edeeea', '#0b0b0c', 0.8, 0.35, 1.1, 0.03, 1.12, 5),
  services: look('#140a05', '#f0490f', 1.1, 0.6, 0.8, 0.045, 1.0, 41),
  atlas: look('#f2f3ff', '#2b39e6', 1.25, 0.7, 0.55, 0.05, 1.08, 67),
  process: look('#0b0b0c', '#edeeea', 0.7, 0.3, 1.35, 0.026, 1.16, 89),
  library: look('#edeeea', '#0b0b0c', 1.45, 0.5, 0.9, 0.038, 1.0, 101),
  typography: look('#0b0b0c', '#edeeea', 0.5, 0.18, 1.8, 0.014, 1.3, 131),
  spatial: look('#edeeea', '#0b0b0c', 1.6, 0.95, 0.4, 0.06, 1.02, 149),
  team: look('#0b0b0c', '#edeeea', 0.65, 0.26, 1.2, 0.024, 1.14, 173),
  pricing: look('#edeeea', '#0b0b0c', 0.85, 0.4, 0.95, 0.032, 1.06, 197),
  faq: look('#0b0b0c', '#edeeea', 0.5, 0.2, 1.6, 0.016, 1.26, 211),
  contact: look('#140a05', '#f0490f', 0.95, 0.42, 1.0, 0.036, 1.1, 233),
  closing: look('#edeeea', '#0b0b0c', 1.2, 0.5, 0.75, 0.044, 1.03, 251),

  /* ---- Routes -------------------------------------------------------- */
  routeHome: look('#0b0b0c', '#edeeea', 0.6, 0.24, 1.5, 0.02, 1.2, 11),
  routeServices: look('#140a05', '#f0490f', 1.15, 0.6, 0.8, 0.046, 1.0, 41),
  routeService: look('#140a05', '#f0490f', 1.3, 0.72, 0.62, 0.052, 1.02, 43),
  routeLab: look('#f2f3ff', '#2b39e6', 1.5, 0.9, 0.5, 0.058, 1.0, 67),
  routeConcepts: look('#edeeea', '#0b0b0c', 1.2, 0.55, 0.85, 0.04, 1.04, 277),
  routeStudio: look('#0b0b0c', '#edeeea', 0.7, 0.3, 1.25, 0.026, 1.14, 173),
  routePricing: look('#edeeea', '#0b0b0c', 0.9, 0.42, 0.95, 0.034, 1.06, 197),
  routeContact: look('#140a05', '#f0490f', 1.0, 0.46, 1.0, 0.038, 1.08, 233),
  routeLegal: look('#0b0b0c', '#edeeea', 0.45, 0.18, 1.7, 0.015, 1.28, 307),
  routeNotFound: look('#edeeea', '#0b0b0c', 1.7, 1.2, 0.25, 0.07, 1.0, 409),
} as const satisfies Record<string, StageLook>;

export type StageLookName = keyof typeof STAGE_LOOKS;

/** The look used when a route or chapter has no explicit entry. */
export const STAGE_FALLBACK = STAGE_LOOKS.routeHome;
