/**
 * DENVUP — central content file.
 *
 * Every word, price, link and section label used by the site lives here (or in
 * the neighbouring lab registry for interactive demos). Edit this file to edit
 * the website; no copy is embedded in HTML templates.
 *
 * Content provenance is documented in IMPLEMENTATION_NOTES.md. Verified facts:
 * brand name, the four team names, email, two phone numbers and the three
 * starting prices, all supplied by DENVUP. Everything else is suggested copy
 * written for this build and is marked as such in the notes.
 */

export type Theme = 'paper' | 'ink' | 'orange' | 'bone';

export interface Phone {
  label: string;
  display: string;
  e164: string;
  wa: string;
}

export const brand = {
  name: 'DENVUP',
  wordmark: 'DENVUP',
  legalNote: 'Independent digital studio',
  location: 'Andhra Pradesh, India',
  oneLiner: 'Websites, interfaces and interactive experiences.',
  description:
    'DENVUP is a digital studio for website design and development, UI/UX, interactive experiences and custom digital solutions.',
  tagline: 'Built in the den. Made to move.',
  email: 'denvupforyou@gmail.com',
  phones: [
    { label: 'Phone / WhatsApp', display: '+91 76759 93371', e164: '+917675993371', wa: '917675993371' },
    { label: 'Phone / WhatsApp', display: '+91 91335 85849', e164: '+919133585849', wa: '919133585849' },
  ] satisfies Phone[],
  hours: 'Monday to Saturday, 10:00–19:00 IST',
  replyNote: 'You will hear from one of the four of us, not a sequence.',
  soundNote: 'Sound is off by default. Turn it on in the footer if you want the small cues.',
};

const whatsappBase = 'https://wa.me/';

export function waLink(phone: Phone, text: string): string {
  return `${whatsappBase}${phone.wa}?text=${encodeURIComponent(text)}`;
}

export const enquiryText = {
  general:
    'Hello DENVUP — I found your site and would like to talk about a project.\n\nWhat I am making: \nWhat it needs to do: \nTimeline: \nBudget range: ',
  effect: (id: number, name: string) =>
    `Hello DENVUP — I would like effect #${id} (${name}) considered for my website.\n\nWhat I am making: \nWhere the effect would be used: \nTimeline: `,
  effectMany: (ids: number[]) =>
    `Hello DENVUP — I would like to talk about effects ${ids.map((i) => `#${i}`).join(', ')} from your library.\n\nWhat I am making: \nTimeline: `,
  pricing: (summary: string) => `Hello DENVUP — I used the scope estimate on your site.\n\n${summary}\n\nA little about my project: `,
};

export const nav = [
  { label: 'Studio', href: '#manifesto' },
  { label: 'Services', href: '#services' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Effects', href: '#effects-library' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'Pricing', href: '#pricing' },
] as const;

export const chapters = [
  { id: 'prelude', label: 'Prelude', short: '01' },
  { id: 'hero', label: 'Studio', short: '02' },
  { id: 'identity', label: 'The mark', short: '03' },
  { id: 'manifesto', label: 'Point of view', short: '04' },
  { id: 'services', label: 'Services', short: '05' },
  { id: 'services-deep', label: 'In detail', short: '06' },
  { id: 'capabilities', label: 'Capabilities', short: '07' },
  { id: 'effects-library', label: 'Effects library', short: '08' },
  { id: 'process', label: 'Process', short: '09' },
  { id: 'technologies', label: 'Technologies', short: '10' },
  { id: 'team', label: 'Team', short: '11' },
  { id: 'showcase', label: 'Concepts', short: '12' },
  { id: 'pricing', label: 'Pricing', short: '13' },
  { id: 'faq', label: 'Questions', short: '14' },
  { id: 'standards', label: 'Standards', short: '15' },
  { id: 'contact', label: 'Contact', short: '16' },
  { id: 'closing', label: 'Close', short: '17' },
] as const;

export const prelude = {
  beats: [
    {
      lead: 'Most websites are documents.',
      line: 'A few are places you remember arriving at.',
      aside: 'DENVUP — a digital studio',
    },
    {
      lead: 'The difference is rarely budget.',
      line: 'It is attention: to the first second, the first sentence, the first click.',
      aside: 'Design, motion and code, held to one standard',
    },
    {
      lead: 'So we built a studio around attention.',
      line: 'Four people. Websites, interfaces and interactive experiences.',
      aside: 'Scroll to open the den',
    },
  ],
  gateLabel: 'Keep scrolling',
  gateHint: 'The den is opening',
  gateEnd: 'Welcome in',
  skipLabel: 'Skip the opening',
};

export const hero = {
  kicker: 'DENVUP — digital studio',
  headline: ['Websites that', 'earn a second look.'],
  lede:
    'We design and build websites, interfaces and interactive experiences for businesses that would rather be remembered than mistaken for everyone else.',
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'Browse the effects library', href: '#effects-library' },
  facts: [
    { value: '₹15,000', label: 'Starting point for a landing page' },
    { value: 'Four', label: 'People, direct from first call to launch' },
    { value: 'One', label: 'Standard for motion, speed and access' },
  ],
  orbit: ['DESIGN', 'DEVELOPMENT', 'MOTION', 'ACCESSIBILITY', 'UI/UX', 'WEBGL'],
  scrollNote: 'Scroll — the story starts here',
  reelLabel: 'This site',
  reelNote: 'No client work is claimed anywhere on this page. The demos are the portfolio.',
};

export const identity = {
  title: 'One mark, several temperatures.',
  eyebrow: 'The mark',
  body:
    'The fox sits inside a loop: alert, adaptive, never quite finished. We animate the supplied artwork rather than redraw it — the same discipline we bring to a brand. Protect the asset. Give it motion.',
  captions: [
    { tone: 'Orange field', note: 'Black mark, the supplied artwork', file: 'logo_black.png' },
    { tone: 'White field', note: 'Colour mark, untouched', file: 'logo_color.png' },
    { tone: 'Black field', note: 'White knockout derived from the black mark’s alpha', file: 'derivative' },
  ],
  facts: [
    'The originals are never edited, stretched or replaced.',
    'The white version is generated from the alpha channel by a repeatable build script.',
    'The header and footer use the mark as a CSS mask, so it can follow the chapter colour.',
  ],
  transitionNote: 'The chapter changes temperature as you scroll: orange, black, then white.',
};

export const manifesto = {
  eyebrow: 'Point of view',
  title: 'The web has enough average.',
  intro:
    'We are a small studio with an unfashionable belief: a website should be made deliberately, for one business, by the people who will answer the phone when it breaks.',
  principles: [
    {
      lead: 'A website is a place.',
      body:
        'People arrive, look around and decide how they feel before they read a word. We design that arrival — the light, the pace, the first thing that moves.',
    },
    {
      lead: 'Motion is a sentence.',
      body:
        'It can explain a change, carry a hierarchy or set a tempo. If it does none of those, it is noise with a performance cost. We cut it.',
    },
    {
      lead: 'Speed is a design decision.',
      body:
        'Weight is chosen at the beginning: fewer typefaces, honest images, effects that earn their kilobytes. A slow site is not a hosting problem; it is a series of design decisions.',
    },
    {
      lead: 'Access is the floor.',
      body:
        'Contrast, keyboard paths, reduced motion and honest form states are how the thing works, not a compliance layer added at the end. If a technique cannot be used by everyone, it gets a fallback or it gets cut.',
    },
    {
      lead: 'Specific beats impressive.',
      body:
        'We would rather build something that fits you exactly than something that could belong to anyone. That usually means fewer sections and sharper ones.',
    },
  ],
  close: 'That is the whole studio. Four people, one standard.',
  quote: 'If it could be any studio’s website, it is not yet yours.',
};

export interface Service {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  forWho: string;
  deliverables: string[];
  outcomes: string[];
  proof: string;
  theme: Theme;
}

export const services: Service[] = [
  {
    slug: 'websites',
    index: 'S1',
    title: 'Website design & development',
    short: 'Sites that explain the business and survive a real launch.',
    summary:
      'Marketing sites, business sites and landing pages designed as one system, then built by the people who designed them. We start with what the site has to do, not with a template.',
    forWho:
      'Businesses with something to explain and a first impression to repair; founders who need a site to do actual work rather than exist.',
    deliverables: [
      'Sitemap, page roles and content plan',
      'Art direction and page design',
      'Responsive build with real content',
      'Motion pass with reduced-motion version',
      'Metadata, analytics and launch checklist',
      'Handover documents and a walkthrough',
    ],
    outcomes: [
      'A site that loads quickly and reads clearly on a phone',
      'A design your team can extend without breaking it',
      'One place to send every future enquiry',
    ],
    proof: 'The section you are on is built from the same system we would hand you.',
    theme: 'bone',
  },
  {
    slug: 'ui-ux',
    index: 'S2',
    title: 'UI/UX design',
    short: 'Flows and interfaces for products that need to feel obvious.',
    summary:
      'Research, task mapping, prototypes and interface systems for products that have outgrown guesswork. We design the states people actually meet: empty, loading, wrong, slow and done.',
    forWho:
      'Product teams, internal tools, dashboards, booking flows and early-stage applications that need to make sense before they need more features.',
    deliverables: [
      'User flows and task maps',
      'Wireframes and an interactive prototype',
      'Interface design and component library',
      'Design tokens and accessibility annotations',
      'Build-ready specifications and states',
      'Usability notes from a recorded test pass',
    ],
    outcomes: [
      'Fewer support questions and shorter paths to the important action',
      'A component language developers can implement once',
      'Decisions written down, not trapped in a file',
    ],
    proof: 'Every interactive control on this page has a focus, hover, active and disabled state designed.',
    theme: 'paper',
  },
  {
    slug: 'interactive',
    index: 'S3',
    title: 'Interactive experiences & motion',
    short: 'Scroll stories, WebGL, cursor systems and motion with a reason.',
    summary:
      'The moments people describe to someone else: a product reveal that unfolds with the scroll, a WebGL scene that responds to the pointer, a typographic sequence with a pulse. Built with a performance budget and a way out for every device.',
    forWho:
      'Launches, campaigns, portfolios and brand moments where attention is the brief — and where the site still has to work on a mid-range phone.',
    deliverables: [
      'Motion direction and a written beat sheet',
      'Interactive prototype of the signature moment',
      'Custom canvas or WebGL scenes',
      'Scroll choreography with native scrolling',
      'Device fallbacks and reduced-motion design',
      'Performance budget and measurement notes',
    ],
    outcomes: [
      'A signature moment that belongs to your brand',
      'Theatre without scroll hijacking',
      'A version that still makes sense with animation off',
    ],
    proof: 'This site’s opening and effects library are built this way. Inspect freely.',
    theme: 'ink',
  },
  {
    slug: 'custom',
    index: 'S4',
    title: 'Custom digital solutions',
    short: 'The parts a template cannot do.',
    summary:
      'Calculators, configurators, dashboards, directories and integrations. Small, well-scoped tools that remove a manual step or make a complicated offer legible.',
    forWho:
      'Operations teams, service businesses and founders with a specific workflow that has been living in a spreadsheet for too long.',
    deliverables: [
      'Technical discovery and a scoped specification',
      'Data model and integration plan',
      'Interface design and build',
      'Third-party connections (payments, email, CRM, maps)',
      'Test plan and edge-case review',
      'Documentation and maintainable handover',
    ],
    outcomes: [
      'One fewer spreadsheet and one fewer manual step',
      'A tool someone other than its author can maintain',
      'Clear costs for anything that bills per use',
    ],
    proof: 'This site’s scope estimator, form handling and effects index are small custom tools.',
    theme: 'bone',
  },
  {
    slug: 'brand',
    index: 'S5',
    title: 'Brand & art direction for the web',
    short: 'Identity systems that survive contact with a browser.',
    summary:
      'Type, colour, motion and voice as one system, delivered as tokens and components rather than a PDF nobody opens. We work with an identity you have, or build the part of it the web needs.',
    forWho:
      'New brands, rebrands and teams whose visual identity stops at a logo file.',
    deliverables: [
      'Visual direction and references',
      'Type and colour systems',
      'Motion principles and easing tokens',
      'Design tokens and component styling',
      'Social and launch artwork',
      'Usage notes for the next person',
    ],
    outcomes: [
      'Consistency across pages without policing',
      'A brand that moves the way it sounds',
      'Assets your team can actually use',
    ],
    proof: 'The chapter colours, type scale and motion rules on this page are a live token system.',
    theme: 'paper',
  },
  {
    slug: 'care',
    index: 'S6',
    title: 'Care & improvement',
    short: 'For sites that look fine but feel slow, fragile or unfinished.',
    summary:
      'Audits and focused work on existing sites: speed, accessibility, mobile behaviour, conversion paths and the small broken things everyone has learned to live with.',
    forWho:
      'Sites that are already live and bring enquiries, but fail on phones, take too long to load or lock the team out of simple edits.',
    deliverables: [
      'Performance and accessibility audit',
      'Prioritised fix list with effort levels',
      'Implementation of the agreed fixes',
      'Before-and-after measurements',
      'Monitoring and handover',
      'Optional monthly care arrangement',
    ],
    outcomes: [
      'A faster first paint and a calmer phone experience',
      'Accessibility issues closed in a documented way',
      'A shorter path from landing to enquiry',
    ],
    proof: 'Our own testing notes are published in TESTING_REPORT.md, including what failed.',
    theme: 'bone',
  },
];

export interface Capability {
  key: string;
  title: string;
  body: string;
  tags: string[];
}

export const capabilities: Capability[] = [
  {
    key: 'web',
    title: 'Web design & development',
    body: 'Semantic structure, a real type scale and responsive layouts built by hand. Content first, decoration second, no page builder in the middle.',
    tags: ['HTML', 'CSS', 'TypeScript', 'Vite'],
  },
  {
    key: 'uiux',
    title: 'UI/UX',
    body: 'Flows, states and components. The demo beside this note lets you walk the same task through a default and a designed path.',
    tags: ['Flows', 'States', 'Prototypes', 'Tokens'],
  },
  {
    key: 'motion',
    title: 'Motion',
    body: 'Easing, choreography and restraint. Motion is used to explain hierarchy or change — never to make a static page feel busier.',
    tags: ['GSAP', 'CSS', 'WAAPI'],
  },
  {
    key: 'type',
    title: 'Typography',
    body: 'One display face, one text face, a five-step scale and an obsession with measure. Variable axes are used where they carry meaning.',
    tags: ['Variable fonts', 'Optical size', 'Fluid scale'],
  },
  {
    key: 'scroll',
    title: 'Scroll storytelling',
    body: 'Native scrolling, pinned chapters and horizontal sections that release cleanly. Reduced motion gets the same story, told vertically.',
    tags: ['ScrollTrigger', 'Sticky', 'Native scroll'],
  },
  {
    key: 'cursor',
    title: 'Cursor & pointers',
    body: 'A cursor that says what it can do: view, drag, play, open. It disappears entirely on touch, where the interface has to speak for itself.',
    tags: ['Pointer events', 'Magnetic', 'Context labels'],
  },
  {
    key: 'graphics',
    title: 'Graphics & SVG',
    body: 'Drawn diagrams, generative arcs and masks built from the logo’s geometry. Vector-first, so the artwork stays sharp and small.',
    tags: ['SVG', 'Masks', 'Canvas 2D'],
  },
  {
    key: 'threed',
    title: '3D & WebGL',
    body: 'A hand-written shader scene with a 2D fallback and a hard particle cap. If the GPU says no, the page still works and still looks intentional.',
    tags: ['WebGL', 'GLSL', 'Fallbacks'],
  },
  {
    key: 'responsive',
    title: 'Responsive patterns',
    body: 'Designed at 360, 768, 1280 and 1600 pixels. Horizontal becomes vertical, hover becomes tap, and nothing essential hides behind a pointer.',
    tags: ['Container queries', 'Touch', 'Safe areas'],
  },
];

export const processSteps = [
  {
    title: 'Discovery',
    body:
      'A conversation, then a written brief: goals, audience, content, constraints and what success looks like. We ask the uncomfortable questions while they are still cheap to answer.',
    deliverable: 'Brief, success measures, honest fit',
    detail: 'Usually one call and one round of written notes. If we are not the right studio, we say so here.',
  },
  {
    title: 'Planning',
    body:
      'Sitemap, page roles, content plan, technical approach and a realistic sequence. You see the shape of the site before anyone designs a pixel.',
    deliverable: 'Sitemap, scope, sequence, unknowns',
    detail: 'We separate what is known from what is still a guess, and put the guesses where they can be tested.',
  },
  {
    title: 'Design',
    body:
      'Art direction first, then page designs and motion tests. Risky moments are prototyped rather than described in a slide.',
    deliverable: 'Direction, page designs, a working prototype',
    detail: 'You review at real widths, on your own phone, with real content wherever it exists.',
  },
  {
    title: 'Development',
    body:
      'Built in the open: semantic HTML, design tokens, component styles and motion with reduced-motion paths. Reviews happen on real devices, not only in a design file.',
    deliverable: 'Working build and a staging link',
    detail: 'Progress is visible. Nothing is revealed for the first time on launch day.',
  },
  {
    title: 'Testing',
    body:
      'Keyboard paths, labels, contrast, breakpoints, slow connections, WebGL fallbacks and every form state. We fix what we find before you do.',
    deliverable: 'Test notes, fixes, known limitations',
    detail: 'The testing report for this site is published, including the things that failed and why.',
  },
  {
    title: 'Launch & handover',
    body:
      'Domains, hosting, metadata, redirects and analytics. Then a walkthrough, written documentation and clean handover of every account and file.',
    deliverable: 'Live site, documentation, accounts',
    detail: 'You leave owning the site and the path to change it — not dependent on us to edit a sentence.',
  },
];

export const technologies = [
  { name: 'HTML', role: 'Structure and semantics', note: 'Every section is readable without JavaScript.', group: 'foundation' },
  { name: 'CSS', role: 'Layout, tokens, motion', note: 'Custom properties, container queries, clamp() scales, grid and masks.', group: 'foundation' },
  { name: 'TypeScript', role: 'Typed content and interactivity', note: 'The content file and every interaction module are typed.', group: 'foundation' },
  { name: 'JavaScript', role: 'Progressive enhancement', note: 'No UI framework ships with this site.', group: 'foundation' },
  { name: 'Vite', role: 'Build and dev server', note: 'Prerendered HTML plus hashed assets.', group: 'build' },
  { name: 'Node.js', role: 'Prerender and asset scripts', note: 'Content is rendered to HTML before the browser asks.', group: 'build' },
  { name: 'sharp', role: 'Image and brand pipeline', note: 'Logos, favicons, social preview and textures are derived by script.', group: 'build' },
  { name: 'Vitest + jsdom', role: 'Automated DOM checks', note: 'Interaction and content tests, documented in TESTING_REPORT.md.', group: 'build' },
  { name: 'GSAP ScrollTrigger', role: 'Scroll choreography', note: 'Pinned gates, horizontal rails and scrubbed colour relays.', group: 'motion' },
  { name: 'Web Animations API', role: 'Small state animations', note: 'Used where a keyframe needs a dynamic value.', group: 'motion' },
  { name: 'SVG', role: 'Masks, diagrams, line art', note: 'Drawn geometry derived from the mark’s circular language.', group: 'graphics' },
  { name: 'Canvas 2D', role: 'Particles and plots', note: 'Capped particle counts and offscreen pausing.', group: 'graphics' },
  { name: 'WebGL', role: 'Shader gradient and points', note: 'Hand-written GLSL with a context-loss fallback.', group: 'graphics' },
  { name: 'Web Audio', role: 'Opt-in interface sound', note: 'Silent by default. Only starts after an explicit toggle.', group: 'media' },
  { name: 'WAI-ARIA', role: 'Dialogs, tabs, live regions', note: 'Focus management, announcements and keyboard paths.', group: 'access' },
  { name: 'Git', role: 'Version control', note: 'The site lives in the DENVUP repository.', group: 'build' },
];

export const team = [
  { name: 'T. Dusyanth', initials: 'TD', mark: 'arc' },
  { name: 'M. Nanda Kishore', initials: 'MNK', mark: 'orbit' },
  { name: 'K. V. Sai Prashanth', initials: 'KVSP', mark: 'grid' },
  { name: 'P. Venkatesh', initials: 'PV', mark: 'wave' },
];

export const teamNote =
  'The studio is four people: T. Dusyanth, M. Nanda Kishore, K. V. Sai Prashanth and P. Venkatesh. We have deliberately not invented job titles, biographies or portraits. You will meet the actual people on the first call.';

export interface Concept {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  build: string;
  demo: 'fold' | 'current' | 'index' | 'relay';
  note: string;
}

export const showcase: Concept[] = [
  {
    slug: 'fold',
    title: 'Fold',
    kind: 'Type specimen',
    summary:
      'A one-page specimen that stretches a single word until it fills the screen, then lets the reader fold it back. A study in one variable axis doing the work of a layout.',
    build: 'Variable font · Slider + keyboard · CSS clamp()',
    demo: 'fold',
    note: 'Concept, not client work. No result or client is implied.',
  },
  {
    slug: 'current',
    title: 'Current',
    kind: 'Generative field',
    summary:
      'A pointer-fed flow field drawn on canvas. Speed changes the density; standing still lets the page settle. Pauses offscreen and caps its particle count.',
    build: 'Canvas 2D · Pointer velocity · Seeded field',
    demo: 'current',
    note: 'Concept, not client work. No result or client is implied.',
  },
  {
    slug: 'index',
    title: 'Index',
    kind: 'Catalogue system',
    summary:
      'A filterable catalogue where the layout rearranges rather than disappears. Keyboard-operable filters, an animated indicator and a readable empty state.',
    build: 'Filters · FLIP-style layout · Keyboard',
    demo: 'index',
    note: 'Concept, not client work. No result or client is implied.',
  },
  {
    slug: 'relay',
    title: 'Relay',
    kind: 'Scroll story',
    summary:
      'A short pinned story with three acts: a line draws, a shape assembles, a field changes colour. Releases cleanly into the page and stacks vertically when motion is reduced.',
    build: 'Sticky stage · SVG path · Colour relay',
    demo: 'relay',
    note: 'Concept, not client work. No result or client is implied.',
  },
];

export const pricing = {
  eyebrow: 'Pricing',
  title: 'Starting points, published.',
  intro:
    'Most studios hide the number until after a call. These are honest starting points, so you can decide whether a conversation is worth having. A quote follows the scope, not the other way around.',
  currency: '₹',
  tiers: [
    {
      key: 'landing',
      name: 'Landing page',
      from: 15000,
      fromLabel: '₹15,000',
      best: 'A launch, a campaign, a service, a waitlist.',
      includes: [
        'One page with a single clear job',
        'Up to five sections, written and designed',
        'Responsive build and a motion pass',
        'Contact route: form, email or WhatsApp',
        'Basic metadata and analytics setup',
        'Accessibility and speed checks',
      ],
      timeline: 'Indicative: 1–2 weeks',
      featured: false,
    },
    {
      key: 'business',
      name: 'Business website',
      from: 20000,
      fromLabel: '₹20,000',
      best: 'A business that has more than one thing to explain.',
      includes: [
        'Up to five pages, or more by scope',
        'Content structure and page roles',
        'Art direction across every page',
        'Responsive build and motion system',
        'Editable content layer or CMS handover',
        'Testing notes and launch checklist',
      ],
      timeline: 'Indicative: 2–4 weeks',
      featured: true,
    },
    {
      key: 'advanced',
      name: 'Advanced custom',
      from: 50000,
      fromLabel: '₹50,000',
      best: 'Interactive experiences, tools, integrations.',
      includes: [
        'Custom interaction or WebGL work',
        'Calculators, configurators or dashboards',
        'Third-party integrations and data flows',
        'Content and motion direction',
        'Performance budget and fallbacks',
        'Documentation and maintainable handover',
      ],
      timeline: 'Indicative: 4–8 weeks',
      featured: false,
    },
  ],
  notes: [
    'The final price depends on scope, complexity, functionality and content.',
    'Domains, hosting, API usage, telephony and other third-party costs may be separate.',
    'Prices shown are indicative starting points, not quotations.',
    'Anything outside the agreed scope is quoted separately, in writing, before it starts.',
  ],
  estimator: {
    title: 'A rough shape of the project',
    intro:
      'Three choices, one indicative starting point. This is a planning tool, not a quote — the number that matters comes after a conversation about scope.',
    types: [
      { key: 'landing', label: 'Landing page', base: 15000 },
      { key: 'business', label: 'Business website', base: 20000 },
      { key: 'advanced', label: 'Custom / interactive', base: 50000 },
    ],
    pageOptions: [
      { key: 'one', label: 'One page', add: 0 },
      { key: 'three-five', label: '3–5 pages', add: 0 },
      { key: 'six-ten', label: '6–10 pages', add: 9000 },
      { key: 'more', label: 'More than 10', add: 18000 },
    ],
    motionOptions: [
      { key: 'standard', label: 'Clean and calm', add: 0 },
      { key: 'rich', label: 'Rich motion', add: 6000 },
      { key: 'webgl', label: '3D / WebGL / custom', add: 16000 },
    ],
    extraOptions: [
      { key: 'content', label: 'Content structuring and editing', add: 5000 },
      { key: 'cms', label: 'Editable content layer', add: 4000 },
      { key: 'integrations', label: 'Third-party integrations', add: 10000 },
    ],
    disclaimer:
      'Indicative starting point only. Actual scope, licences, hosting and third-party costs are confirmed in a written proposal.',
  },
  engagement: [
    {
      title: 'Fixed-scope project',
      body: 'A written scope, a starting price and a sequence. Best when the outcome is clear.',
    },
    {
      title: 'Iteration window',
      body: 'A block of studio days used across design, build and fixes. Best when the product is still moving.',
    },
    {
      title: 'Care after launch',
      body: 'A monthly arrangement for updates, checks and small improvements. Scope agreed in writing.',
    },
  ],
};

export const faq = [
  {
    q: 'What does a project cost?',
    a: 'Landing pages start at ₹15,000, business websites at ₹20,000 and advanced custom work at ₹50,000. The final price depends on scope, complexity, functionality and content. We give a written estimate after the first conversation.',
    tags: ['pricing'],
  },
  {
    q: 'How long does a project take?',
    a: 'A landing page is typically one to two weeks, a business site two to four, and custom work four to eight or more. Content readiness and feedback speed move that number more than anything else. Any timeline we give is a planning estimate until scope is signed off.',
    tags: ['timeline'],
  },
  {
    q: 'Do you work with businesses outside India?',
    a: 'Yes. We work remotely and schedule calls across time zones. Everything is documented in writing so the project does not depend on overlapping office hours.',
    tags: ['working together'],
  },
  {
    q: 'Who writes the content?',
    a: 'You can, and it usually produces the most honest site. We can also structure, edit or write the copy as part of the scope. Content is collected in a single document before design is locked.',
    tags: ['content'],
  },
  {
    q: 'Can you work with our existing brand?',
    a: 'Yes. We work inside existing guidelines, or extend them where the web needs rules the brand book never covered: motion, focus states, responsive type. If there is no system yet, we can build one.',
    tags: ['brand'],
  },
  {
    q: 'What do you need from us to start?',
    a: 'One decision-maker, your content or access to it, and any brand assets. Then honesty about budget and timing. We will bring the questions, the plan and the first prototype.',
    tags: ['working together'],
  },
  {
    q: 'Do we own the website when it is finished?',
    a: 'Ownership and licensing are set out in the proposal before work begins. Wherever possible the site is built on your accounts — your domain, your hosting, your repository — so access does not depend on us.',
    tags: ['pricing'],
  },
  {
    q: 'What about domains, hosting and third-party costs?',
    a: 'Domains, hosting, API usage, telephony and other third-party services may be billed separately, usually directly to you and in your name. We help set them up and document what each one costs.',
    tags: ['pricing'],
  },
  {
    q: 'Will the site work on phones?',
    a: 'It is designed on a phone first and checked at 360, 768, 1280 and 1600 pixels. Hover interactions get touch equivalents, horizontal sections become usable vertical ones, and nothing essential hides behind a pointer.',
    tags: ['quality'],
  },
  {
    q: 'Is the site accessible?',
    a: 'We work to WCAG 2.2 AA as the baseline: contrast, keyboard paths, visible focus, labelled controls, reduced motion and real error messages. We document what was tested. A formal third-party audit can be arranged and quoted separately.',
    tags: ['quality'],
  },
  {
    q: 'Can you maintain the site after launch?',
    a: 'Yes, either as a monthly care arrangement or as occasional fixed-scope work. Handover always includes documentation so you are not dependent on us for basic edits.',
    tags: ['quality'],
  },
  {
    q: 'Do you use templates or page builders?',
    a: 'No page builders. We build with HTML, CSS, TypeScript and specific libraries where they earn their weight. That is why the effects on this site can be tuned rather than switched on.',
    tags: ['quality'],
  },
  {
    q: 'What happens on the first call?',
    a: 'Thirty minutes: what you are making, what it needs to do, what exists already and what a realistic budget is. You will leave with a straight answer about fit, even if the answer is no.',
    tags: ['working together'],
  },
];

export const standards = {
  eyebrow: 'Standards',
  title: 'What we check before calling it done.',
  intro:
    'This page makes claims about accessibility and speed. Here is the list we hold ourselves to, and the report we publish when something fails.',
  items: [
    { title: 'Keyboard, end to end', body: 'Every control reachable, focus visible, dialogs trap and restore focus, no keyboard traps.' },
    { title: 'Reduced motion', body: 'A full content path with animation off; parallax, pinning and cursor effects disabled, not just shortened.' },
    { title: 'Contrast and colour', body: 'Text and control contrast checked against WCAG 2.2 AA; state never communicated by colour alone.' },
    { title: 'Real widths', body: '360, 768, 1280 and 1600 pixels with no horizontal overflow at any of them.' },
    { title: 'Touch equivalents', body: 'Hover-only information gets a tap path; horizontal rails scroll with a finger or offer arrows.' },
    { title: 'Slow and offline', body: 'Tested against a slow connection and with WebGL disabled; content remains usable if a library fails.' },
    { title: 'Honest states', body: 'Loading, empty, error and success states correspond to something that actually happened.' },
    { title: 'Published results', body: 'TESTING_REPORT.md lists the checks, the failures and what remains unverified in this environment.' },
  ],
  reportNote: 'The full report ships next to the code in this repository.',
};

export const contact = {
  eyebrow: 'Contact',
  title: 'Tell us what you’re making.',
  intro:
    'A few lines are enough. We will reply with questions, a straight answer about fit, and a next step. No newsletter, no sequence, no form that pretends to have sent something it did not.',
  formNote:
    'This build has no form endpoint connected. Nothing is sent when you press the button — instead you get an honest status and a prefilled email or WhatsApp message you can send yourself.',
  fields: {
    name: 'Your name',
    email: 'Email address',
    phone: 'Phone (optional)',
    project: 'What do you need?',
    budget: 'Starting point you have in mind',
    message: 'What are you making?',
    consent: 'I am happy for DENVUP to reply about this enquiry.',
    submit: 'Review and send',
  },
  budgets: ['Not sure yet', 'Landing page — from ₹15,000', 'Business website — from ₹20,000', 'Advanced custom — from ₹50,000', 'Something else'],
  projectTypes: ['Website', 'UI/UX', 'Interactive / motion', 'Custom solution', 'Brand system', 'Audit or care', 'Not sure yet'],
  alternatives: 'Prefer email or WhatsApp? Both work.',
  directTitle: 'Direct lines',
  reply: 'You will hear from one of the four of us.',
};

export const closing = {
  line: ['Built in the den.', 'Made to move.'],
  cta: 'Start a project',
  note: 'DENVUP — websites, interfaces and interactive experiences.',
};

export const footer = {
  columns: [
    {
      title: 'Studio',
      links: [
        { label: 'Point of view', href: '#manifesto' },
        { label: 'Services', href: '#services' },
        { label: 'Process', href: '#process' },
        { label: 'Team', href: '#team' },
      ],
    },
    {
      title: 'Work',
      links: [
        { label: 'Capabilities', href: '#capabilities' },
        { label: 'Effects library', href: '#effects-library' },
        { label: 'Concepts', href: '#showcase' },
        { label: 'Technologies', href: '#technologies' },
      ],
    },
    {
      title: 'Practical',
      links: [
        { label: 'Pricing', href: '#pricing' },
        { label: 'Questions', href: '#faq' },
        { label: 'Standards', href: '#standards' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ],
  colophon:
    'Designed and built by DENVUP. Set in Bricolage Grotesque and Instrument Sans. No cookies, no third-party trackers, no client work claimed.',
  shortcuts: 'Press ? for keyboard shortcuts, F for the fox.',
  accessibility: 'Accessibility statement',
  privacy: 'Privacy',
  top: 'Back to top',
};

export const meta = {
  title: 'DENVUP — Websites, interfaces and interactive experiences',
  description:
    'DENVUP is a digital studio in Andhra Pradesh, India. Website design and development, UI/UX, interactive experiences and custom digital solutions. Starting points published; demos, not claimed client work.',
  themeColor: '#ff4a00',
  ogImage: '/assets/brand/og-image.jpg',
  ogAlt: 'DENVUP — orange field, black fox mark and the word DENVUP',
};

/** Aggregated business facts used by buttons, forms and structured data. */
export const business = {
  email: brand.email,
  phonePrimary: brand.phones[0],
  whatsapp: brand.phones.map((p) => p.wa),
  priceFrom: { landing: 15000, business: 20000, advanced: 50000 },
  teamNames: team.map((t) => t.name),
  location: brand.location,
};
