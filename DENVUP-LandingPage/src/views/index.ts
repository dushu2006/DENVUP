/**
 * The view layer.
 *
 * Each route has a view: the set of modules that wire up its content. A
 * view is mounted when its route is entered and torn down when it is left,
 * so nothing from the previous page is still listening when the next one
 * arrives.
 *
 * The shell (`src/core/shell.ts`) is the opposite: it is mounted once and
 * survives every route change.
 */

import { destroyReveal, initReveal, initSectionSpy } from '../core/reveal';
import { initChapterBackground, syncChapterBackground } from '../core/chapter';
import { refreshTriggers } from '../core/motion';
import { initNavigationForRoute, setDockSections } from '../sections/navigation';
import type { DockSection } from '../sections/navigation';
import { initAtlas } from '../sections/atlas';
import { initClosing } from '../sections/closing';
import { initContact } from '../sections/contact';
import { initExpansion } from '../sections/expansion';
import { initFaq } from '../sections/faq';
import { pricingFaqs } from '../data/faqs';
import { initLab } from '../sections/lab';
import { initLabLibrary } from '../sections/lab-library';
import { initLibrary } from '../sections/library';
import { initManifesto } from '../sections/manifesto';
import { initMark } from '../sections/mark';
import { markActiveSection } from '../sections/navigation';
import { initPricing } from '../sections/pricing';
import { initPricingRoute } from '../sections/pricing-route';
import { initProcess } from '../sections/process';
import { initServices } from '../sections/services';
import { initServiceDetail } from '../sections/service-detail';
import { initSpatial } from '../sections/spatial';
import { initStudio } from '../sections/studio';
import { initStudioRoute } from '../sections/studio-route';
import { initPortraits } from '../sections/portraits';
import { initTeam } from '../sections/team';
import { initTypography } from '../sections/typography';
import { navSections } from '../data/site';

export interface ViewContext {
  /** The route id, e.g. 'home', 'service', 'lab'. */
  id: string;
  /** The resolved pathname, e.g. '/services/web-design/'. */
  path: string;
  /** The route parameters, e.g. { slug: 'web-design' }. */
  params: Record<string, string>;
  /** The view element, `<main id="view">`. */
  element: HTMLElement;
  /** The link that started the navigation, if there was one. */
  trigger: HTMLElement | null;
  /** 'forward' or 'back'. */
  direction: 'forward' | 'back';
  /**
   * The fragment of the address, without the '#'.
   *
   * The view is mounted before the router puts the new address into the
   * history, so `location.hash` still belongs to the page the visitor is
   * leaving. The router knows the address it is going to, and it is
   * passed here so a deep link can be honoured on arrival.
   */
  hash: string;
}

type ViewInit = (ctx: ViewContext) => (() => void) | void;

/** The dock entries for each route. */
const DOCKS: Record<string, DockSection[]> = {
  home: navSections.map((section) => ({
    id: section.id,
    index: section.index,
    label: section.label,
  })),
  services: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'service-list', index: '02', label: 'The five lines' },
  ],
  service: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'svc-body-title', index: '02', label: 'What it is' },
    { id: 'svc-stages-title', index: '03', label: 'How it starts' },
    { id: 'svc-siblings-title', index: '04', label: 'The other four' },
  ],
  lab: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'playground', index: '02', label: 'Transition lab' },
    { id: 'stage-controls', index: '03', label: 'Field controls' },
  ],
  concepts: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'concept-list', index: '02', label: 'In progress' },
  ],
  studio: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'team', index: '02', label: 'The team' },
  ],
  pricing: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'plans', index: '02', label: 'The figures' },
    { id: 'estimator', index: '03', label: 'Estimator' },
    { id: 'scope', index: '04', label: 'What is included' },
  ],
  contact: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'enquiry', index: '02', label: 'The form' },
    { id: 'faq', index: '03', label: 'Before you write' },
  ],
  privacy: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'legal-body', index: '02', label: 'The policy' },
  ],
  terms: [
    { id: 'top', index: '01', label: 'Overview' },
    { id: 'legal-body', index: '02', label: 'The terms' },
  ],
  notfound: [
    { id: 'notfound', index: '01', label: 'Not found' },
  ],
};

const homeView: ViewInit = () => {
  const cleanups: (() => void)[] = [];
  const track = (teardown: (() => void) | void): void => {
    if (typeof teardown === 'function') cleanups.push(teardown);
  };

  track(initStudio());
  track(initExpansion());
  track(initMark());
  track(initManifesto());
  track(initServices());
  track(initAtlas());
  track(initProcess());
  track(initLibrary());
  track(initTypography());
  track(initSpatial());
  track(initTeam());
  track(initPortraits());
  track(initPricing());
  track(initFaq());
  track(initContact());
  track(initClosing());

  return () => cleanups.forEach((teardown) => teardown());
};

const plainView: ViewInit = () => undefined;

const VIEWS: Record<string, ViewInit> = {
  home: homeView,
  services: plainView,
  service: (ctx) => initServiceDetail(ctx.params.slug ?? ''),
  lab: (ctx) => {
    const teardown = initLab(ctx);
    const libraryTeardown = initLabLibrary(ctx.hash);
    return () => {
      teardown();
      libraryTeardown();
    };
  },
  concepts: plainView,
  studio: () => {
    const teardown = initStudioRoute();
    const processTeardown = initProcess();
    const atlasTeardown = initAtlas();
    const portraitTeardown = initPortraits();
    return () => {
      teardown();
      processTeardown();
      atlasTeardown();
      portraitTeardown();
    };
  },
  pricing: () => {
    const teardown = initPricingRoute();
    const faqTeardown = initFaq(pricingFaqs, 'pricing');
    return () => {
      teardown();
      faqTeardown();
    };
  },
  contact: () => initContact(),
  privacy: plainView,
  terms: plainView,
  notfound: plainView,
};

/**
 * Mount a view.
 *
 * The teardown is returned so the router can call it before the next route
 * is mounted.
 */
export function mountView(ctx: ViewContext): () => void {
  const cleanups: (() => void)[] = [];
  const track = (teardown: (() => void) | void): void => {
    if (typeof teardown === 'function') cleanups.push(teardown);
  };

  const init = VIEWS[ctx.id] ?? plainView;
  track(init(ctx));

  // --- shared view behaviour ---------------------------------------------- //
  initReveal();
  track(initChapterBackground());
  track(
    initSectionSpy((id) => {
      markActiveSection(id);
      syncChapterBackground(id);
    }),
  );

  // --- the dock describes where the reader is ----------------------------- //
  setDockSections(DOCKS[ctx.id] ?? []);
  initNavigationForRoute(ctx.id);

  // --- layout settles ------------------------------------------------------ //
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => refreshTriggers());
  }
  window.setTimeout(() => refreshTriggers(), 400);

  return () => {
    cleanups.forEach((teardown) => {
      try {
        teardown();
      } catch {
        /* a failing teardown must not block the rest */
      }
    });
    cleanups.length = 0;
    destroyReveal();
  };
}
