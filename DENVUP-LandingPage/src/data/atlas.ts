/**
 * Capability atlas.
 *
 * Every entry names a tool the studio actually uses in the work described on
 * this site. Each node carries the reason it is used, so the map explains
 * itself rather than just listing logos.
 */

export type AtlasLayer = 'Design' | 'Build' | 'Motion' | 'Real-time' | 'Ship';

export interface AtlasNode {
  id: string;
  label: string;
  layer: AtlasLayer;
  x: number;
  y: number;
  /** What it is used for. */
  purpose: string;
  /** Where it appears in the build. */
  stage: string;
  notes: string;
}

export const atlasNodes: AtlasNode[] = [
  {
    id: 'figma',
    label: 'Figma',
    layer: 'Design',
    x: 150,
    y: 120,
    purpose: 'Page design, component libraries and state documentation.',
    stage: 'Design',
    notes: 'We keep the file in sync with the build, so a spec change is a code change.',
  },
  {
    id: 'type',
    label: 'Variable type',
    layer: 'Design',
    x: 330,
    y: 80,
    purpose: 'One family, with weight and width axes used as live design parameters.',
    stage: 'Design',
    notes: 'Axis ranges are documented in the type lab on this page.',
  },
  {
    id: 'tokens',
    label: 'Design tokens',
    layer: 'Design',
    x: 150,
    y: 250,
    purpose: 'Colour, type scale, spacing and motion curves as CSS custom properties.',
    stage: 'Design',
    notes: 'One source of truth, so a change lands everywhere it should.',
  },
  {
    id: 'html',
    label: 'Semantic HTML',
    layer: 'Build',
    x: 520,
    y: 130,
    purpose: 'Real elements, real headings, real landmarks — before any styling.',
    stage: 'Build',
    notes: 'Accessibility starts here, not in an audit at the end.',
  },
  {
    id: 'css',
    label: 'Modern CSS',
    layer: 'Build',
    x: 700,
    y: 210,
    purpose: 'Custom properties, container queries, grid, cascade layers.',
    stage: 'Build',
    notes: 'Animation runs on transform and opacity to keep the compositor busy, not the layout engine.',
  },
  {
    id: 'ts',
    label: 'TypeScript',
    layer: 'Build',
    x: 520,
    y: 300,
    purpose: 'Typed modules for the interactive layer, with no framework in the way.',
    stage: 'Build',
    notes: 'The site you are reading is built this way.',
  },
  {
    id: 'vite',
    label: 'Vite',
    layer: 'Ship',
    x: 880,
    y: 130,
    purpose: 'Fast builds, code splitting, hashed assets.',
    stage: 'Ship',
    notes: 'Heavy 3D code is loaded only when it is needed.',
  },
  {
    id: 'gsap',
    label: 'GSAP + ScrollTrigger',
    layer: 'Motion',
    x: 860,
    y: 300,
    purpose: 'Timelines, pinning, scrubbing and scroll-linked values.',
    stage: 'Motion',
    notes: 'One animation engine across the whole site — no competing timelines.',
  },
  {
    id: 'lenis',
    label: 'Lenis',
    layer: 'Motion',
    x: 700,
    y: 380,
    purpose: 'Inertial scrolling that keeps native scroll behaviour.',
    stage: 'Motion',
    notes: 'Disabled automatically for reduced motion.',
  },
  {
    id: 'three',
    label: 'Three.js',
    layer: 'Real-time',
    x: 1060,
    y: 200,
    purpose: 'Real-time 3D scenes: drag rotation, materials, instanced fields.',
    stage: 'Motion',
    notes: 'Dynamically imported and paused when off screen.',
  },
  {
    id: 'webgl',
    label: 'Raw WebGL 2',
    layer: 'Real-time',
    x: 1060,
    y: 330,
    purpose: 'Shader fields, displacement reveals, metaballs, fluid response.',
    stage: 'Motion',
    notes: 'Used where a shader does the job better than a library would.',
  },
  {
    id: 'canvas',
    label: 'Canvas 2D',
    layer: 'Real-time',
    x: 900,
    y: 430,
    purpose: 'Particle fields, trails and the live emblem reconstruction.',
    stage: 'Motion',
    notes: 'Particle counts scale down on lower-powered devices.',
  },
  {
    id: 'a11y',
    label: 'Accessibility pass',
    layer: 'Ship',
    x: 420,
    y: 430,
    purpose: 'Keyboard paths, focus order, contrast, reduced motion, announcements.',
    stage: 'Ship',
    notes: 'Checked with the build, not at the end of the project.',
  },
  {
    id: 'perf',
    label: 'Performance budget',
    layer: 'Ship',
    x: 180,
    y: 400,
    purpose: 'Asset budgets, lazy loading, image sizing, render-cost control.',
    stage: 'Ship',
    notes: 'A heavy site is a broken site wearing a good coat.',
  },
  {
    id: 'content',
    label: 'Content model',
    layer: 'Ship',
    x: 620,
    y: 470,
    purpose: 'Structured content the client can edit after handover.',
    stage: 'Ship',
    notes: 'Chosen for how the client works, not for fashion.',
  },
];

export const atlasLayers: AtlasLayer[] = ['Design', 'Build', 'Motion', 'Real-time', 'Ship'];
