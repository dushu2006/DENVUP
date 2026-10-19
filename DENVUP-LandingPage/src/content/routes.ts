/**
 * Route map and the offer model.
 *
 * The master prompt replaces the earlier six-service list with five offers.
 * Every price here is one of the three published starting points; nothing is
 * invented and no delivery date is promised. AI work is described as a service
 * that is scoped and illustrated, never as a shipped product or a client result.
 */

export type Theme = 'paper' | 'ink' | 'orange' | 'bone' | 'den';

export interface ServiceStep {
  title: string;
  body: string;
}

export interface ServiceDemo {
  lab: string;
  mode: number;
  label: string;
  note: string;
}

export interface ServicePage {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  summary: string[];
  whoFor: string[];
  deliverables: string[];
  steps: ServiceStep[];
  demos: ServiceDemo[];
  priceFrom: number;
  priceNote: string;
  signature: string;
  related: string[];
  theme: Theme;
}

export const services: ServicePage[] = [
  {
    slug: 'web-design',
    name: 'Web design and development',
    short: 'Sites that hold attention and answer the question.',
    tagline: 'The page is the product.',
    summary: [
      'A website is the only part of a business that every visitor meets in the same order. We design that order first: what the visitor needs to understand, what proves it, and what they should do next. Then we build it, in clean HTML, CSS and TypeScript, without a page builder in the middle.',
      'Every build is responsive at real breakpoints, keyboard-complete, and readable with JavaScript off. Motion is composed, not sprinkled: each section has one job and one movement that shows the change.',
    ],
    whoFor: [
      'A studio, practice or small business that has outgrown a template',
      'A launch that needs one page to do the work of a deck',
      'A site that looks fine but reads badly on a phone',
    ],
    deliverables: [
      'A written page structure before any visual work',
      'Design in the browser at three real widths, not a picture of a page',
      'Hand-built responsive front end, semantic and keyboard-complete',
      'Performance budget, accessibility pass and a launch checklist',
      'A short handover: how to edit copy, add a page, and what not to break',
    ],
    steps: [
      { title: 'Structure', body: 'The order of the argument, written as plain sentences. We agree on what the page must say before we choose a single colour.' },
      { title: 'Composition', body: 'One signature idea, a grid, a type scale, and the moments where motion carries meaning. Reviewed at 390, 768 and 1440 pixels.' },
      { title: 'Build', body: 'Static HTML with a thin layer of client code. Every interactive part has a no-script and reduced-motion path.' },
      { title: 'Check', body: 'Keyboard walk-through, contrast, overflow at seven widths, real-device reading, then handover.' },
    ],
    demos: [
      { lab: 'type', mode: 3, label: 'Weight as emphasis', note: 'A single variable font doing the work of three.' },
      { lab: 'scroll', mode: 0, label: 'A progress you can read', note: 'Reading position, not a decorative bar.' },
    ],
    priceFrom: 20000,
    priceNote: 'A business website starts at ₹20,000. A single landing page starts at ₹15,000. Scope, content and integrations decide the rest.',
    signature: 'The page as one continuous composition, not a stack of blocks.',
    related: ['interactive', 'automation'],
    theme: 'paper',
  },
  {
    slug: 'ai-solutions',
    name: 'AI-powered solutions',
    short: 'Assistants and retrieval, built on your material, with the limits visible.',
    tagline: 'Useful, scoped, and honest about what it is.',
    summary: [
      'Most “AI” on a website is a chat box wired to a general model with no knowledge of the business behind it. We build the opposite: a narrow assistant that answers from documents you supply, cites the passage it used, and says “I do not know” when the material does not cover the question.',
      'The work starts with the corpus, not the model. If your policies, price list or manuals are not in a state a machine can read, that is the first job. Every build ships with an evaluation set: the questions it must answer, and the ones it must refuse.',
    ],
    whoFor: [
      'A team answering the same twenty questions every week',
      'A catalogue or policy set that people need to search, not read',
      'An internal tool where a wrong answer must be traceable',
    ],
    deliverables: [
      'A document audit and a retrieval design, before any model choice',
      'A scoped assistant with citations to the source passage',
      'A refusal path and a written list of what it will not answer',
      'An evaluation set with real questions and expected answers',
      'A handover document covering cost, limits and how to update the corpus',
    ],
    steps: [
      { title: 'Corpus', body: 'What exists, what is missing, what is out of date. Documents are cleaned and chunked before a model is chosen.' },
      { title: 'Retrieval', body: 'Search over your material, with the passage shown next to every answer so a person can check it.' },
      { title: 'Interface', body: 'A small, quiet surface: one input, cited answers, a visible way to reach a human.' },
      { title: 'Evaluation', body: 'A fixed question set is run on every change. Anything that cannot be checked is cut from scope.' },
    ],
    demos: [
      { lab: 'conversion', mode: 1, label: 'A form that tells the truth', note: 'The same honesty rule we apply to AI: no invented success state.' },
      { lab: 'story', mode: 2, label: 'A flow with a bright path', note: 'A pipeline diagram you can follow without a legend.' },
    ],
    priceFrom: 50000,
    priceNote: 'Advanced custom work starts at ₹50,000. Model and hosting costs are billed by their providers and are quoted separately, in writing, before work starts.',
    signature: 'An assistant that shows its sources and refuses what it cannot support.',
    related: ['integrations', 'automation'],
    theme: 'ink',
  },
  {
    slug: 'integrations',
    name: 'Business integrations',
    short: 'The tools you already pay for, actually talking to each other.',
    tagline: 'One source of truth, or none.',
    summary: [
      'Most integration work is not glamorous: it is deciding which system owns a customer record, what happens when two of them disagree, and who is told when a sync fails. We map that first, then write the smallest service that keeps the data straight.',
      'We work with documented APIs and webhooks. Where a provider has no API, we say so rather than scraping a screen and calling it an integration.',
    ],
    whoFor: [
      'A CRM and an invoice tool that disagree about the same customer',
      'Orders that arrive by email and are retyped by hand',
      'A form whose submissions never reach the place decisions are made',
    ],
    deliverables: [
      'A written data map: systems, owners, fields, frequency',
      'The integration itself, with retries and a failure log',
      'A human-readable error path: who is told, and what they do',
      'Credentials handled through environment configuration, never in the repository',
      'A runbook for changing keys, pausing a sync and replaying a failed event',
    ],
    steps: [
      { title: 'Map', body: 'List every system, who owns each field, and what “correct” means when two systems disagree.' },
      { title: 'Contract', body: 'Write the shape of every payload and the exact conditions for a failure.' },
      { title: 'Build', body: 'Small services, idempotent writes, retries with backoff, and a log a person can read.' },
      { title: 'Run', body: 'Alerts, a replay path, and a document that does not assume the original developer is still around.' },
    ],
    demos: [
      { lab: 'story', mode: 2, label: 'A flow with a bright path', note: 'Data moving between systems, drawn as a path rather than a list.' },
      { lab: 'engineering', mode: 0, label: 'Frame meter and a particle cap', note: 'Cost is measured, not assumed.' },
    ],
    priceFrom: 50000,
    priceNote: 'Advanced custom work starts at ₹50,000. Third-party subscription and usage costs stay with the client and are listed in the estimate.',
    signature: 'A data map a non-developer can read, and a failure path that reaches a person.',
    related: ['automation', 'ai-solutions'],
    theme: 'bone',
  },
  {
    slug: 'interactive',
    name: 'Creative and interactive experiences',
    short: 'One idea, made physical: motion, sound and space that carry meaning.',
    tagline: 'Motion with a job.',
    summary: [
      'An interactive piece earns its cost when the interaction is the explanation: a product you can take apart, a process you can walk through, a comparison you can drag. We design the idea first and the effect second, and we budget for the fallback at the same time as the effect.',
      'Everything ships with a keyboard path, a reduced-motion path and a static image that still communicates the point.',
    ],
    whoFor: [
      'A launch that needs one memorable moment rather than another landing page',
      'A complex product that is easier to show than to describe',
      'An exhibition, kiosk or presentation that has to hold a room',
    ],
    deliverables: [
      'A concept with a one-sentence explanation of why it is interactive',
      'A motion specification: trigger, duration, easing, reverse, mobile and reduced-motion behaviour',
      'A hand-built scene or WebGL piece with a real performance budget',
      'Static and reduced-motion fallbacks that keep the meaning',
      'A recording of the piece for decks, plus the source',
    ],
    steps: [
      { title: 'Idea', body: 'The one thing the visitor should be able to do that a paragraph cannot.' },
      { title: 'Sketch', body: 'Thumbnail sequences and a timing chart, before any code.' },
      { title: 'Build', body: 'One render loop, capped pixel ratio, pause off-screen, dispose on exit.' },
      { title: 'Fallback', body: 'Keyboard, touch, reduced motion and no-WebGL versions designed as part of the piece, not after it.' },
    ],
    demos: [
      { lab: 'threed', mode: 0, label: 'A shader with a fallback', note: 'The fallback is designed first.' },
      { lab: 'collections', mode: 3, label: 'Before and after', note: 'A comparison a visitor drives.' },
      { lab: 'materials', mode: 2, label: 'Depth from light', note: 'Light as structure, not decoration.' },
    ],
    priceFrom: 50000,
    priceNote: 'Advanced custom work starts at ₹50,000. A single interactive scene inside an existing page is quoted as a smaller piece of the same budget.',
    signature: 'The visitor does something that explains the thing.',
    related: ['web-design', 'ai-solutions'],
    theme: 'den',
  },
  {
    slug: 'automation',
    name: 'Automation and business tools',
    short: 'Small internal tools that remove a repeated job, not a whole team.',
    tagline: 'Boring on purpose.',
    summary: [
      'The best automation is invisible: an invoice that files itself, a report that arrives on Monday, a form that creates the record and tells the right person. We build the smallest tool that removes the task, and we write down what happens when it breaks.',
      'We do not sell dashboards nobody reads. If a spreadsheet and a scheduled script solve it, that is what we will recommend.',
    ],
    whoFor: [
      'A weekly report assembled by hand from three exports',
      'A quote or invoice that is retyped into another system',
      'A process that only one person knows how to run',
    ],
    deliverables: [
      'A process map with the time cost of each step',
      'The smallest working tool, with a manual override',
      'A scheduled job with logging and a failure notification',
      'A written runbook in plain language',
      'A named owner for each part, so nothing depends on memory',
    ],
    steps: [
      { title: 'Observe', body: 'Watch the task happen. The described process and the real one are rarely the same.' },
      { title: 'Cut', body: 'Remove steps before automating them. Half of most workflows is a copy-paste that should not exist.' },
      { title: 'Build', body: 'One tool, one job, with a manual override and a log.' },
      { title: 'Hand over', body: 'A runbook, a named owner, and a test that proves the job still runs.' },
    ],
    demos: [
      { lab: 'engineering', mode: 3, label: 'Debounce and throttle', note: 'The difference between a busy system and a correct one.' },
      { lab: 'process', mode: 0, label: 'A line that connects', note: 'A process drawn so it can be questioned.' },
    ],
    priceFrom: 20000,
    priceNote: 'Business tooling starts at ₹20,000. Advanced custom work starts at ₹50,000. Third-party plan costs are listed separately.',
    signature: 'A task that stops happening, and a document that says why it is safe.',
    related: ['integrations', 'web-design'],
    theme: 'bone',
  },
];

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

export interface RouteMeta {
  path: string;
  name: string;
  title: string;
  description: string;
  theme: Theme;
  chapter: string;
  nav?: string;
  priority: number;
}

export const routes: RouteMeta[] = [
  { path: '/', name: 'Home', title: 'DENVUP — A digital studio for the web', description: 'DENVUP is a four-person digital studio in Andhra Pradesh. Websites, AI-powered tools, integrations, interactive work and automation, with published starting prices.', theme: 'paper', chapter: 'prelude', priority: 1 },
  { path: '/services', name: 'Services', title: 'Services — DENVUP', description: 'Five ways DENVUP works: web design and development, AI-powered solutions, business integrations, interactive experiences, and automation. Starting prices published.', theme: 'paper', chapter: 'services', nav: 'Services', priority: 0.9 },
  ...services.map<RouteMeta>((s) => ({
    path: `/services/${s.slug}`,
    name: s.name,
    title: `${s.name} — DENVUP`,
    description: s.short,
    theme: s.theme,
    chapter: 'service',
    priority: 0.8,
  })),
  { path: '/lab', name: 'Lab', title: 'The Lab — live interaction studies, DENVUP', description: 'A filterable library of interaction studies: loaders, cursor states, typography, scroll, 3D and more. Every demo names the technique it uses and can be replayed.', theme: 'ink', chapter: 'lab', nav: 'Lab', priority: 0.8 },
  { path: '/concepts', name: 'Concepts', title: 'Concepts — self-initiated studies, DENVUP', description: 'Four self-initiated concepts that show how we think. Clearly labelled as concepts, never presented as client work.', theme: 'bone', chapter: 'concepts', nav: 'Concepts', priority: 0.7 },
  { path: '/studio', name: 'Studio', title: 'Studio — DENVUP', description: 'A four-person studio in Andhra Pradesh: how we work, what we believe, the process we follow and the technologies we actually use.', theme: 'paper', chapter: 'studio', nav: 'Studio', priority: 0.7 },
  { path: '/pricing', name: 'Pricing', title: 'Pricing — DENVUP', description: 'Three published starting points: ₹15,000 for a landing page, ₹20,000 for a business website, ₹50,000 for advanced custom work. Scope and third-party costs explained.', theme: 'ink', chapter: 'pricing', nav: 'Pricing', priority: 0.9 },
  { path: '/contact', name: 'Contact', title: 'Contact — DENVUP', description: 'Tell DENVUP what you are building. Email, two phone numbers and WhatsApp, or a short form that prepares your message.', theme: 'orange', chapter: 'contact', nav: 'Contact', priority: 0.9 },
  { path: '/privacy', name: 'Privacy', title: 'Privacy — DENVUP', description: 'How this site handles data: no cookies, no analytics, no third-party trackers, and a form that transmits nothing until it is connected.', theme: 'paper', chapter: 'legal', priority: 0.2 },
  { path: '/terms', name: 'Terms', title: 'Terms — DENVUP', description: 'The working terms for an engagement with DENVUP, with the items that still need the owner’s confirmation marked.', theme: 'paper', chapter: 'legal', priority: 0.2 },
  { path: '/404', name: 'Not found', title: 'Page not found — DENVUP', description: 'This page does not exist. The studio, services, lab and contact pages do.', theme: 'ink', chapter: 'notfound', priority: 0.1 },
];

export const routeByPath = new Map(routes.map((r) => [r.path, r]));

/** Primary navigation, in order. Contact is a button, not a link in the list. */
export const primaryNav = [
  { label: 'Services', href: '/services' },
  { label: 'Lab', href: '/lab' },
  { label: 'Concepts', href: '/concepts' },
  { label: 'Studio', href: '/studio' },
  { label: 'Pricing', href: '/pricing' },
] as const;

export const footerNav = [
  {
    title: 'Services',
    links: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '/studio' },
      { label: 'Concepts', href: '/concepts' },
      { label: 'Lab', href: '/lab' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Start a project', href: '/contact' },
      { label: 'Email', href: 'mailto:denvupforyou@gmail.com' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
] as const;

export const legal = {
  privacy: {
    title: 'Privacy',
    lead: 'What this site does with your data, written so it can be checked.',
    sections: [
      { h: 'What this site loads', p: 'Fonts are served from this domain. There are no analytics scripts, advertising pixels, social embeds or third-party trackers. The page makes no network request to another company when you read it.' },
      { h: 'Cookies and storage', p: 'No cookies are set. The site stores two things in your browser: whether this is your first visit (so the opening sequence does not repeat) and your motion preference. Both stay on your device and are not transmitted.' },
      { h: 'The contact form', p: 'The form prepares a message in your own email or WhatsApp application. Until a form endpoint is connected, nothing is transmitted by the site itself and no message is stored. When it is connected, the endpoint and its retention period will be named on this page before the form is enabled.' },
      { h: 'Email and phone', p: 'If you email, call or message DENVUP, your details are used to answer that enquiry and to keep the project record. They are not sold or added to a mailing list. Ask for the conversation to be deleted and it will be.' },
      { h: 'Your rights', p: 'Write to denvupforyou@gmail.com to ask what is held about you, to correct it, or to have it deleted. The owners confirm the legal entity and the statutory retention periods below before launch.' },
      { h: 'Owner to confirm', p: 'Business legal name and registered address; the data controller’s contact for formal requests; retention period for project records. Marked in ASSETS.md as an owner-to-confirm item, not invented here.' },
    ],
  },
  terms: {
    title: 'Terms',
    lead: 'The working terms for an engagement. Short, and written to be read before a contract, not instead of one.',
    sections: [
      { h: 'Quotations', p: 'Published prices are starting points, not quotations. A written estimate follows a scope conversation and lists what is included, what is excluded, and every third-party cost. Work starts when that estimate is accepted.' },
      { h: 'Scope and changes', p: 'A change to the agreed scope is quoted before it is built. Where a change invalidates work already done, that work is billed. We will always say this before starting, not afterwards.' },
      { h: 'Payment', p: 'A deposit before work starts and the balance on delivery, unless the written estimate says otherwise. Third-party subscriptions, domains and model usage are paid by the client, in their own accounts, so they always keep control.' },
      { h: 'Ownership', p: 'On final payment, the client owns the delivered design and code for their project. We keep the right to describe the work and to show it in a portfolio unless the estimate says otherwise. The DENVUP mark and the studio’s own pre-existing code remain ours.' },
      { h: 'What we do not promise', p: 'No delivery date is promised on this website. No ranking, traffic or revenue outcome is promised. Where a dependency is outside our control — a third-party API, a hosting provider, a model provider — the estimate names it.' },
      { h: 'Owner to confirm', p: 'Governing law and jurisdiction; the deposit percentage; the warranty period after delivery; the invoicing entity and tax details. These are flagged in ASSETS.md for the owners, not assumed here.' },
    ],
  },
} as const;
