/**
 * Pricing.
 *
 * These are the indicative starting prices supplied in the brief. They are
 * deliberately treated as proposals rather than quotations, and every piece
 * of pricing copy on the site says so.
 */

export interface Plan {
  id: string;
  name: string;
  from: number;
  currency: '₹';
  summary: string;
  includes: string[];
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'landing',
    name: 'Landing page',
    from: 15000,
    currency: '₹',
    summary: 'One page, one job, one strong idea.',
    includes: [
      'Concept and art direction',
      'Scroll narrative and section sequence',
      'Production build',
      'Motion pass and performance tuning',
    ],
  },
  {
    id: 'website',
    name: 'Business website',
    from: 20000,
    currency: '₹',
    summary: 'A multi-page site with a content structure you can run.',
    includes: [
      'Sitemap and visual system',
      'Responsive page design and build',
      'CMS or content structure',
      'Accessibility and performance pass',
      'Handover documentation',
    ],
    featured: true,
  },
  {
    id: 'advanced',
    name: 'Advanced custom solution',
    from: 50000,
    currency: '₹',
    summary: 'Interactive builds, 3D, WebGL and application surfaces.',
    includes: [
      'Everything in the business website scope',
      'Interaction and motion system',
      'WebGL / 3D / shader work where it earns its place',
      'API-backed application front end',
      'Technique library handover',
    ],
  },
];

export interface EstimatorOption {
  id: string;
  label: string;
  /** Multiplier applied to the base price. */
  factor: number;
}

export interface EstimatorGroup {
  id: string;
  label: string;
  options: EstimatorOption[];
}

/**
 * The estimator is explicitly indicative: it multiplies a base price by the
 * selected options. The copy beside it states that the real number comes from
 * a conversation about scope.
 */
export const estimatorGroups: EstimatorGroup[] = [
  {
    id: 'base',
    label: 'Base',
    options: [
      { id: 'landing', label: 'Landing page · ₹15k', factor: 1 },
      { id: 'website', label: 'Business site · ₹20k', factor: 1.33 },
      { id: 'advanced', label: 'Advanced · ₹50k', factor: 3.33 },
    ],
  },
  {
    id: 'motion',
    label: 'Motion & interaction',
    options: [
      { id: 'none', label: 'Standard motion', factor: 1 },
      { id: 'rich', label: 'Rich motion system', factor: 1.3 },
      { id: 'cinematic', label: 'Cinematic / WebGL', factor: 1.7 },
    ],
  },
  {
    id: 'scope',
    label: 'Scope',
    options: [
      { id: 'single', label: 'Single template', factor: 1 },
      { id: 'custom', label: 'Custom design system', factor: 1.4 },
      { id: 'product', label: 'Product / application', factor: 1.8 },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    options: [
      { id: 'supplied', label: 'Content supplied', factor: 1 },
      { id: 'assisted', label: 'Copy assistance', factor: 1.15 },
      { id: 'written', label: 'Full copy write', factor: 1.3 },
    ],
  },
];

export const pricingDisclaimer =
  'Final pricing depends on scope, complexity, functionality, content and delivery requirements. These figures are proposed starting points for a typical project of each kind, not fixed quotations. Domains, hosting, third-party APIs, telephony and similar external charges are quoted separately where they apply.';
