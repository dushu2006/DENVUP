/**
 * Service lines.
 *
 * Five lines, each with its own route and its own detail page. The
 * categories, deliverables and outcomes are written for a prospective
 * client. No service is listed that the studio cannot credibly deliver with
 * a four-person design + engineering team.
 *
 * The `slug` is the route: `/services/<slug>/`. The `signature` is the one
 * move that identifies the service on the home page and in the route
 * transition — the thing that makes the line memorable rather than
 * interchangeable.
 */

export interface Service {
  id: string;
  /** The route segment: /services/<slug>/ */
  slug: string;
  index: string;
  title: string;
  short: string;
  body: string;
  audience: string;
  outcome: string;
  deliverables: string[];
  /** 1 = design, 2 = build, 3 = motion, 4 = platform */
  accent: number;
  diagram: 'build' | 'motion' | 'system' | 'commerce' | 'interface' | 'care';
  /** The one move that identifies this service. */
  signature: string;
  /** The technique IDs that carry the service on the home page. */
  techniqueIds: string[];
  /** A short, honest note on what the price depends on. */
  priceNote: string;
  /** The question a buyer of this particular line actually asks. */
  question: { q: string; a: string };
}

export const services: Service[] = [
  {
    id: 'website-design-development',
    slug: 'web-design',
    index: '01',
    title: 'Web design & development',
    short: 'Full sites, designed and built in-house.',
    body:
      'We design and build complete business websites — information architecture, visual system, page design, front-end build, and a content structure your team can actually operate without a developer.',
    audience: 'Businesses replacing an ageing site, or building their first real one.',
    outcome: 'A site that loads fast, reads clearly on a phone, and can be updated by the people who own the content.',
    deliverables: [
      'Sitemap and page structure',
      'Visual system: type, colour, grid, components',
      'Responsive page design and prototype',
      'Production front-end build',
      'Content model and handover notes',
    ],
    accent: 1,
    diagram: 'build',
    signature:
      'The page is built in the browser from the first day, so what you approve is what ships — not a picture of it.',
    techniqueIds: ['102', '118', '131', '146'],
    priceNote:
      'Depends on the number of pages, the content you already have, and whether a CMS is needed.',
    question: {
      q: 'Do you work with our existing content?',
      a:
        'Yes, and it is usually the fastest route. Send what you have — a Word document, a Notion page, a spreadsheet of services — and we will tell you what we can keep, what needs rewriting, and what is missing. Rewriting is part of the work, not a charge on top of it.',
    },
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    index: '02',
    title: 'AI-powered solutions',
    short: 'AI where it earns its place, and nowhere else.',
    body:
      'We design and build the parts of a product where machine learning actually pays for itself: assistants that know your content, search that understands a question, tools that draft, summarise or classify, and interfaces that make a probabilistic answer feel accountable.',
    audience: 'Teams who have tried a generic assistant and found it useless, or who want to ship one that works.',
    outcome: 'A working AI feature with a clear job, a visible source of its answer, and a fallback when the model is unsure.',
    deliverables: [
      'Use-case definition and an honest feasibility read',
      'Interface and interaction design for uncertain output',
      'Front-end build against your model or API of choice',
      'Prompt, retrieval and data-handling setup',
      'Evaluation set and a human fallback path',
    ],
    accent: 2,
    diagram: 'system',
    signature:
      'Every answer shows where it came from. A model that cannot be checked is not shipped.',
    techniqueIds: ['202', '215', '233', '289'],
    priceNote:
      'Depends on the model, the data you can give it, and how much of the existing system has to change.',
    question: {
      q: 'What if the model is not good enough yet?',
      a:
        'Then we tell you, and we scope the work around what the model can actually do today. We start with the narrowest useful version — one job, one dataset, one honest evaluation — and widen it only when the evaluation says it is safe. If the honest answer is that you do not need AI here, that is the answer we will give you.',
    },
  },
  {
    id: 'business-integrations',
    slug: 'business-integrations',
    index: '03',
    title: 'Business integrations',
    short: 'Your tools, wired to each other and to the site.',
    body:
      'We connect what you already run: CRMs, payment gateways, inventory, scheduling, email, analytics, ERP. The work is mostly unglamorous and mostly decisive — getting the data to land in the right place, in the right shape, without anybody maintaining it by hand.',
    audience: 'Businesses whose website sits apart from the tools that actually run the business.',
    outcome: 'One connected flow: a form becomes a record, a payment becomes an order, a booking becomes a calendar entry.',
    deliverables: [
      'Map of the systems involved and the data that moves',
      'API and webhook design, with failure handling',
      'Front-end and back-end integration build',
      'Reconciliation, logging and error reporting',
      'Documentation and a handover walkthrough',
    ],
    accent: 3,
    diagram: 'system',
    signature:
      'Every integration is drawn as a line between two named systems before a line of code is written.',
    techniqueIds: ['301', '312', '327', '341'],
    priceNote:
      'Depends on how many systems are involved and whether the APIs you need are documented and reachable.',
    question: {
      q: 'What if one of the systems has no usable API?',
      a:
        'Then we say so in the first conversation, because it changes the price and the timeline. There is usually a workable route — a scheduled export, a shared database table, a webhook from the other side — but it is never as clean as a documented API, and pretending otherwise is how projects slip.',
    },
  },
  {
    id: 'creative-experiences',
    slug: 'creative-experiences',
    index: '04',
    title: 'Creative & interactive experiences',
    short: 'The part of the site people remember.',
    body:
      'Scroll choreography, kinetic typography, cursor systems, WebGL moments, route transitions. We build the interaction layer as a system with written rules — not as a pile of one-off effects that only work on the page they were made for.',
    audience: 'Brands that need to be memorable, and products that need to be explained properly.',
    outcome: 'A motion system with documented rules that stays fast, stays usable, and survives being handed to another developer.',
    deliverables: [
      'Motion direction and an interaction map',
      'Prototype of the key sequences',
      'Production implementation',
      'Reduced-motion and no-JavaScript fallbacks',
      'Handover of the technique library',
    ],
    accent: 4,
    diagram: 'motion',
    signature:
      'One signature moment per page, and a rule that the rest of the motion has to earn its place.',
    techniqueIds: ['121', '158', '196', '274'],
    priceNote:
      'Depends on how much of the page is interactive and how many original visuals have to be made.',
    question: {
      q: 'Will it still work on a slow phone?',
      a:
        'Yes. The heavy work is budgeted: one signature moment per page, real devices as the target rather than a desktop with a good GPU, and an animation budget measured in milliseconds rather than vibes. If a sequence cannot be made to hold sixty frames on a mid-range phone, we cut it rather than ship it and hope.',
    },
  },
  {
    id: 'automation',
    slug: 'automation',
    index: '05',
    title: 'Automation & business tools',
    short: 'Internal tools that remove a manual step.',
    body:
      'When a person is copying data between two systems every week, that is a small application waiting to be built. We design and build the internal tools, dashboards and configurators that make the step disappear — with the states that matter: loading, empty, error and permission.',
    audience: 'Operations and service teams whose week is spent on repetitive hand-offs.',
    outcome: 'A working tool your team uses daily, with the edge cases handled rather than assumed away.',
    deliverables: [
      'Process mapping and the specific step being removed',
      'Interface and state design for the tool',
      'Front-end build against your data',
      'Roles, permissions and error handling',
      'Deployment, documentation and a walkthrough',
    ],
    accent: 5,
    diagram: 'care',
    signature:
      'Every state is designed, including the empty one and the one where the request failed.',
    techniqueIds: ['288', '336', '359', '372'],
    priceNote:
      'Depends on the number of states, the permissions model and what the tool has to talk to.',
    question: {
      q: 'What happens when the data is wrong or missing?',
      a:
        'That is the part we design for first. The tool shows the record, the reason it could not be processed, and what a person should do about it. A tool that quietly skips the hard rows is worse than no tool, because you stop checking.',
    },
  },
];

export interface ProcessStage {
  id: string;
  index: string;
  name: string;
  when: string;
  title: string;
  body: string;
  outputs: string[];
}

export const processStages: ProcessStage[] = [
  {
    id: 'discovery',
    index: '01',
    name: 'Discovery',
    when: 'Week 1',
    title: 'We find out what the site is actually for',
    body:
      'Before anything is drawn we get specific: who arrives, what they are trying to do, what the business needs from it, and what is in the way. We look at the current site, the competitors and the content you already have. The output is a brief that both sides can point at.',
    outputs: [
      'A written brief with real goals and constraints',
      'Content inventory and sitemap',
      'Technical and platform recommendation',
      'Fixed scope and price range',
    ],
  },
  {
    id: 'planning',
    index: '02',
    name: 'Planning',
    when: 'Week 1–2',
    title: 'The order of the work, written down',
    body:
      'A site is a sequence of decisions, and the sequence matters as much as the design. We write the order: what is decided first, what depends on it, what can be built in parallel, and what has to be true before the next thing can start.',
    outputs: [
      'A build order with dependencies made explicit',
      'The content that is needed, and when it is needed',
      'A decision log, so nothing is re-litigated in week five',
      'An honest answer on what will not be in the first release',
    ],
  },
  {
    id: 'design',
    index: '03',
    name: 'Design',
    when: 'Weeks 2–3',
    title: 'A direction you can react to, not a deck',
    body:
      'We design the pages as a connected set, with the type, colour and component rules written down as we go. You see working pages in a browser rather than flat images, because motion and layout only make sense in the real medium.',
    outputs: [
      'Design direction with the reasoning behind it',
      'Working responsive pages in the browser',
      'Component and style documentation',
      'Content and copy drafts',
    ],
  },
  {
    id: 'development',
    index: '04',
    name: 'Development',
    when: 'Weeks 4–5',
    title: 'The build is the design, not a copy of it',
    body:
      'We build in the browser from the first day, so the design is never translated into something else. Semantic markup, sensible CSS, real fonts, images sized for their slot, and animation that runs on transform and opacity.',
    outputs: [
      'Production front-end build',
      'CMS or content structure wired up',
      'Cross-browser and device check',
      'Performance pass with measured results',
    ],
  },
  {
    id: 'testing',
    index: '05',
    name: 'Testing',
    when: 'Week 6',
    title: 'Checked on the devices people actually use',
    body:
      'Every build is tested on a phone, a tablet and a desktop, with the keyboard, with motion switched off and with the network throttled. The fixes that come out of this pass are the ones that would otherwise come out of a support message.',
    outputs: [
      'A viewport, keyboard and contrast pass',
      'A reduced-motion and no-JavaScript pass',
      'A throttled-network load measurement',
      'A written list of what was found and what was changed',
    ],
  },
  {
    id: 'launch',
    index: '06',
    name: 'Launch & handover',
    when: 'Week 7+',
    title: 'Ship it, then stay reachable',
    body:
      'We run the launch checklist, set up analytics, and hand over documentation that a person on your side can use. After that we are still here for changes, iterations and the next thing.',
    outputs: [
      'Launch checklist and deployment',
      'Analytics and search basics',
      'Handover documentation and walkthrough',
      'A maintenance option if you want one',
    ],
  },
];

/** Look a service up by its route slug. */
export function serviceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
