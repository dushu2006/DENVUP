/**
 * Which working demo represents each capability, and which demo backs each
 * concept card. The renderer and the client stage both read this map, so the
 * technique IDs printed under a capability always belong to the mounted demo.
 */

export const capabilityDemo: Record<string, [slug: string, modeIndex: number]> = {
  web: ['collections', 8],
  uiux: ['navigation', 1],
  motion: ['micro', 0],
  type: ['type', 3],
  scroll: ['scroll', 1],
  cursor: ['cursor', 1],
  graphics: ['graphics', 2],
  threed: ['threed', 0],
  responsive: ['collections', 7],
};

export const conceptDemo: Record<string, [slug: string, modeIndex: number]> = {
  fold: ['type', 3],
  current: ['particles', 3],
  index: ['collections', 4],
  relay: ['scroll', 5],
};
