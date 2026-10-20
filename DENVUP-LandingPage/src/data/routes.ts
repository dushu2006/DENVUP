/**
 * The route table.
 *
 * Every route in the site, in priority order. The patterns use a trailing
 * slash because every route except the home page is a directory in the
 * build output (`/services/web-design/index.html`), which is what a static
 * host can serve without rewriting rules.
 *
 * `fetch` names the document that holds the route's content. It is the same
 * as the route's path, except for the 404, which has a document of its own
 * and is served for *any* path that does not match.
 */

import type { RouteRule } from '../core/router';

export const ROUTES: RouteRule[] = [
  { id: 'home', path: '/', title: 'DENVUP — digital studio' },
  { id: 'services', path: '/services/', title: 'Services — DENVUP' },
  { id: 'service', path: '/services/:slug/', title: 'Service — DENVUP' },
  { id: 'lab', path: '/lab/', title: 'Interaction lab — DENVUP' },
  { id: 'concepts', path: '/concepts/', title: 'Concepts — DENVUP' },
  { id: 'studio', path: '/studio/', title: 'Studio — DENVUP' },
  { id: 'pricing', path: '/pricing/', title: 'Pricing — DENVUP' },
  { id: 'contact', path: '/contact/', title: 'Contact — DENVUP' },
  { id: 'privacy', path: '/privacy/', title: 'Privacy — DENVUP' },
  { id: 'terms', path: '/terms/', title: 'Terms — DENVUP' },
  { id: 'notfound', path: '/*', title: 'Page not found — DENVUP', fetch: '/404.html' },
];

/** The route ids that are not the home page. */
export const ROUTE_IDS = ROUTES.map((route) => route.id);

/**
 * The menu and the command palette.
 *
 * These are the pages a visitor is most likely to be looking for. The menu
 * is the only place in the site where every route appears at once, so it is
 * the site's map.
 */
export const MENU_ENTRIES: { index: string; label: string; blurb: string; href: string }[] = [
  { index: '01', label: 'Home', blurb: 'Sixteen chapters, one continuous stage.', href: '/' },
  {
    index: '02',
    label: 'Services',
    blurb: 'Five lines, five routes, five signatures.',
    href: '/services/',
  },
  {
    index: '03',
    label: 'Interaction lab',
    blurb: 'The transitions, replayable on demand.',
    href: '/lab/',
  },
  {
    index: '04',
    label: 'Concepts',
    blurb: 'Work in progress, shown honestly.',
    href: '/concepts/',
  },
  {
    index: '05',
    label: 'Studio',
    blurb: 'Four people and how the work gets made.',
    href: '/studio/',
  },
  {
    index: '06',
    label: 'Pricing',
    blurb: 'Three starting points and an estimator.',
    href: '/pricing/',
  },
  {
    index: '07',
    label: 'Contact',
    blurb: 'Three steps, one honest form.',
    href: '/contact/',
  },
];

/** Human names, used by the section map and the command palette. */
export const ROUTE_LABELS: Record<string, string> = {
  home: 'Home',
  services: 'Services',
  service: 'Service detail',
  lab: 'Interaction lab',
  concepts: 'Concepts',
  studio: 'Studio',
  pricing: 'Pricing',
  contact: 'Contact',
  privacy: 'Privacy',
  terms: 'Terms',
  notfound: 'Not found',
};
