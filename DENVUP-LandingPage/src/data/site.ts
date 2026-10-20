/**
 * Verified business information for DENVUP.
 *
 * Everything in this file comes from the supplied brief. Nothing here is
 * invented: no client names, no testimonials, no awards, no years of
 * experience, no performance statistics.
 */

export const brand = {
  name: 'DENVUP',
  positioning:
    'A digital studio focused on website design, development, interactive experiences and digital solutions.',
  email: 'denvupforyou@gmail.com',
  emailHref: 'mailto:denvupforyou@gmail.com',
  phones: [
    { label: '+91 76759 93371', raw: '+917675993371', href: 'https://wa.me/917675993371' },
    { label: '+91 91335 85849', raw: '+919133585849', href: 'https://wa.me/919133585849' },
  ],
} as const;

export interface NavSection {
  id: string;
  label: string;
  index: string;
  blurb: string;
}

export const navSections: NavSection[] = [
  { id: 'prelude', label: 'Opening', index: '01', blurb: 'The seed object and the first three beats.' },
  { id: 'expansion', label: 'The expansion', index: '02', blurb: 'A square that becomes an environment.' },
  { id: 'studio', label: 'Studio', index: '03', blurb: 'What DENVUP is and how it works.' },
  { id: 'mark', label: 'Brand system', index: '04', blurb: 'The emblem treated as data.' },
  { id: 'manifesto', label: 'Manifesto', index: '05', blurb: 'The rules we build by.' },
  { id: 'services', label: 'Services', index: '06', blurb: 'Five lines, five routes, five signatures.' },
  { id: 'atlas', label: 'Capability atlas', index: '07', blurb: 'The tools, plotted and explained.' },
  { id: 'process', label: 'Process', index: '08', blurb: 'Five stages, each with an output.' },
  { id: 'library', label: 'Technique library', index: '09', blurb: 'Working demos you can request.' },
  { id: 'type', label: 'Typography', index: '10', blurb: 'Type as a material.' },
  { id: 'lab', label: 'Spatial lab', index: '11', blurb: 'WebGL and Three.js pieces.' },
  { id: 'team', label: 'Team', index: '12', blurb: 'The four people in the studio.' },
  { id: 'pricing', label: 'Pricing', index: '13', blurb: 'Starting points and an estimator.' },
  { id: 'faq', label: 'Questions', index: '14', blurb: 'Plain answers.' },
  { id: 'contact', label: 'Contact', index: '15', blurb: 'Tell us what you want it to feel like.' },
  { id: 'closing', label: 'Closing', index: '16', blurb: 'The last statement.' },
];

export interface TeamMember {
  name: string;
  initials: string;
  /** A file-name-safe identifier, used for the portrait slot. */
  slug: string;
  role: string;
  note: string;
  focus: string[];
}

export const team: TeamMember[] = [
  {
    name: 'T. Dusyanth',
    slug: 't-dusyanth',
    initials: 'TD',
    role: 'Studio — design & front-end',
    note: 'Works across layout systems, typography and the build that follows them.',
    focus: ['Design systems', 'Front-end', 'Typography'],
  },
  {
    name: 'M. Nanda Kishore',
    slug: 'm-nanda-kishore',
    initials: 'NK',
    role: 'Studio — interaction & motion',
    note: 'Shapes how a page behaves: transitions, states, timing and feel.',
    focus: ['Interaction', 'Motion', 'Prototyping'],
  },
  {
    name: 'K. V. Sai Prashanth',
    slug: 'k-v-sai-prashanth',
    initials: 'SP',
    role: 'Studio — development',
    note: 'Builds the production side: performance, structure, maintainability.',
    focus: ['Engineering', 'Performance', 'Accessibility'],
  },
  {
    name: 'P. Venkatesh',
    slug: 'p-venkatesh',
    initials: 'PV',
    role: 'Studio — quality & delivery',
    note: 'Keeps the detail honest — testing, consistency, and the final mile.',
    focus: ['QA', 'Delivery', 'Content'],
  },
];

export const studioFacts = [
  { value: '4', label: 'people in the studio' },
  { value: '5', label: 'service lines' },
  { value: '480', label: 'techniques catalogued' },
] as const;
