/**
 * DENVUP — the router.
 *
 * A small, deliberate client-side router. It follows the architecture that
 * Barba.js documents (a persistent *wrapper* around a swappable *container*,
 * with a *namespace* on each page that decides which transition runs), but it
 * is written here rather than installed, because the transitions this site
 * needs — a card expanding from its exact screen rectangle, a shape wipe from
 * the click point, a brand mark travelling across the screen — need direct
 * control of the DOM swap at every frame, and because the brief asks for the
 * lightest set of dependencies that solves the problem.
 *
 * The interface is deliberately small:
 *
 *     const router = createRouter({ view, rules, transitions, ... });
 *     router.start();
 *     router.navigate('/pricing');
 *
 * Everything else — history, prefetching, the eight-phase transition
 * lifecycle, scroll restoration, title and meta rewriting, the progress
 * indicator, teardown of the outgoing view, and the fallback to a real
 * browser navigation when a fetch fails — lives behind it.
 *
 * The lifecycle is the Barba one, in the same order:
 *
 *     before → beforeLeave → leave → afterLeave
 *            → beforeEnter → enter → afterEnter → after
 *
 * Every `leave` and `enter` hook may return a promise, and the router awaits
 * it. That is the single most common way a page transition breaks: the next
 * phase starts before the animation has finished.
 */

import { $, $$ } from './dom';
import { settleOn } from './scroll';

/**
 * Scroll to the fragment a link asked for.
 *
 * A link such as "/lab/#tech-118" is a real address: the visitor should
 * arrive on the demonstration itself, not at the top of a long list. The
 * browser will not do this for us — the router swaps the document, so the
 * fragment has to be honoured after the new view is in place.
 *
 * The scroll is deferred by a frame, because the new view is mounted in
 * the same task as the swap and the anchor may not be in the document
 * yet. If the fragment names something that is not there, nothing happens
 * and the visitor simply lands at the top of the page.
 */
function scrollToAnchor(hash: string): void {
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return;
  window.requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (!target) return;
    /*
     * The jump is instant and then settled. A deep link can cross
     * twenty thousand pixels of catalogue, and a smooth scroll across
     * that distance would drag the visitor through every card between
     * here and the target. The settle keeps the position while the page
     * finishes growing underneath it.
     */
    settleOn(target);
  });
}

export interface RouteMatch {
  /** Namespace: 'home', 'services', 'service', 'lab', 'concepts', … */
  id: string;
  /** The resolved pathname. */
  path: string;
  /** Captured path segments. */
  params: Record<string, string>;
  /** The full URL. */
  url: URL;
  /** The document that carries this route's content. */
  document: string;
}

export interface RouteRule {
  id: string;
  /** A path pattern such as '/services/:slug/'. '*' matches any segments. */
  path: string;
  /** A stable title suffix, e.g. 'Services'. */
  title?: string;
  /**
   * The document that holds this route's content, relative to the site root.
   * Defaults to the route's own path. The 404 uses this to serve one
   * document for every unmatched path.
   */
  fetch?: string;
}

export interface ViewContext {
  route: RouteMatch;
  /** The element that holds the route's content. */
  element: HTMLElement;
  /** The link that caused the navigation, when there was one. */
  trigger: HTMLElement | null;
  /** 'forward' for a push, 'back' for a popstate. */
  direction: 'forward' | 'back';
  /** The click point, in client coordinates, when there was one. */
  origin: { x: number; y: number } | null;
}

export interface TransitionRule {
  name: string;
  /** Route namespaces this rule applies from. */
  from?: string | string[];
  /** Route namespaces this rule applies to. */
  to?: string | string[];
  /** Runs before the outgoing view starts leaving. */
  beforeLeave?: (ctx: ViewContext) => void;
  /** Animates the outgoing view out. May return a promise. */
  leave?: (ctx: ViewContext) => void | Promise<void>;
  /** Runs after the outgoing view has left. */
  afterLeave?: (ctx: ViewContext) => void;
  /** Runs before the incoming view is shown. */
  beforeEnter?: (ctx: ViewContext) => void;
  /** Animates the incoming view in. May return a promise. */
  enter?: (ctx: ViewContext) => void | Promise<void>;
  /** Runs after the incoming view has arrived. */
  afterEnter?: (ctx: ViewContext) => void;
}

export interface RouterOptions {
  /** The element whose children hold the current route's content. */
  view: HTMLElement;
  /** The persistent shell that wraps the view. */
  shell: HTMLElement;
  /** Route rules, in priority order. */
  rules: RouteRule[];
  /** Transition rules, in priority order. First match wins. */
  transitions: TransitionRule[];
  /**
   * The rule set used when the visitor has asked for less motion.
   * Defaults to `transitions`.
   */
  reducedTransitions?: TransitionRule[];
  /** Whether the reduced-motion set should be used right now. */
  isReduced?: () => boolean;
  /** Mounts a route's content. Returns a teardown. */
  mount: (ctx: ViewContext) => void | (() => void);
  /** Unmounts a route's content before it is replaced. */
  unmount?: (ctx: ViewContext) => void;
  /** Called when the route changes, for the header's active state. */
  onRoute?: (ctx: ViewContext) => void;
  /** Called when a navigation starts and ends, for a progress bar. */
  onProgress?: (state: 'start' | 'end') => void;
}

export interface Router {
  start: () => void;
  navigate: (href: string, options?: { trigger?: HTMLElement | null; replace?: boolean }) => Promise<boolean>;
  current: () => RouteMatch | null;
  refresh: () => void;
  dispose: () => void;
}

const INTERNAL = /^(?:[a-z]+:)?\/\//i;

/**
 * Run a transition step, but never wait for it forever.
 *
 * A transition is a promise that resolves when its timeline finishes. If the
 * page is in a background tab the animation ticker is paused, and a rule
 * that awaits its own timeline would never settle — which would leave the
 * router locked on the old route with the new URL in the address bar. The
 * timeout is generous enough that a real transition always wins it, and
 * short enough that a stalled one cannot hold the router.
 */
const TRANSITION_TIMEOUT = 4000;

function withTimeout<T>(promise: Promise<T> | undefined, ms = TRANSITION_TIMEOUT): Promise<T | void> {
  if (!promise) return Promise.resolve();
  return Promise.race([
    promise.catch(() => undefined),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms);
    }),
  ]);
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  // A trailing '*' matches any number of remaining segments.
  const wildcard = patternParts[patternParts.length - 1] === '*';
  if (wildcard) patternParts.pop();
  if (!wildcard && patternParts.length !== pathParts.length) return null;
  if (wildcard && pathParts.length < patternParts.length) return null;

  for (let i = 0; i < patternParts.length; i += 1) {
    const p = patternParts[i];
    const v = pathParts[i];
    if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(v);
    else if (p !== v) return null;
  }
  return params;
}

/** Fill `:param` placeholders in a route pattern with the captured values. */
function canonicalise(pattern: string, params: Record<string, string>): string {
  return pattern.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => encodeURIComponent(params[key] ?? ''));
}

export function createRouter(options: RouterOptions): Router {
  const { shell, rules, transitions } = options;
  /* `view` is replaced when a document is hydrated, so it is not a constant. */
  let view: HTMLElement = options.view;
  const cache = new Map<string, Promise<{ html: string; title: string; description: string }>>();
  const stack: RouteMatch[] = [];
  let currentRoute: RouteMatch | null = null;
  let currentTeardown: (() => void) | null = null;
  let busy = false;
  let disposed = false;
  let started = false;

  /* ------------------------------------------------------------------ */
  /* Route resolution                                                    */
  /* ------------------------------------------------------------------ */

  const resolve = (url: URL): RouteMatch => {
    const path = url.pathname.replace(/\/+$/, '') || '/';
    for (const rule of rules) {
      const params = matchPath(rule.path, path);
      if (!params) continue;
      const canonical = canonicalise(rule.path, params);
      return {
        id: rule.id,
        path,
        params,
        url,
        document: rule.fetch ?? canonical,
      };
    }
    /* The rule list always ends with the catch-all, so this is unreachable
       in practice; it exists so a malformed table fails loudly. */
    return {
      id: 'notfound',
      path,
      params: {},
      url,
      document: '/404.html',
    };
  };

  const resolveOrNotFound = resolve;

  /* ------------------------------------------------------------------ */
  /* Fetching + prefetching                                              */
  /* ------------------------------------------------------------------ */

  const fetchRoute = (
    _url: URL,
    document: string,
  ): Promise<{ html: string; title: string; description: string }> => {
    const key = document;
    const existing = cache.get(key);
    if (existing) return existing;

    const promise = fetch(key, { headers: { accept: 'text/html' } })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const next = doc.querySelector('#view');
        const title = doc.querySelector('title')?.textContent?.trim() ?? '';
        const description =
          doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
        return { html: next ? next.innerHTML : '', title, description };
      });

    cache.set(key, promise);
    // A failed fetch must not poison the cache.
    promise.catch(() => cache.delete(key));
    return promise;
  };

  const prefetch = (href: string): void => {
    try {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      const route = resolve(url);
      if (!cache.has(route.document)) void fetchRoute(url, route.document);
    } catch {
      /* a malformed href is simply not prefetched */
    }
  };

  /* ------------------------------------------------------------------ */
  /* Transition rule matching                                            */
  /* ------------------------------------------------------------------ */

  const findTransition = (from: RouteMatch | null, to: RouteMatch): TransitionRule | null => {
    const list =
      options.isReduced?.() && options.reducedTransitions?.length
        ? options.reducedTransitions
        : transitions;
    for (const rule of list) {
      const fromOk = toArray(rule.from).length === 0 || (from && toArray(rule.from).includes(from.id));
      const toOk = toArray(rule.to).length === 0 || toArray(rule.to).includes(to.id);
      if (fromOk && toOk) return rule;
    }
    return null;
  };

  /* ------------------------------------------------------------------ */
  /* Document head                                                       */
  /* ------------------------------------------------------------------ */

  const updateHead = (title: string, description: string, url: URL): void => {
    if (title) document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url.origin + url.pathname;
  };

  /* ------------------------------------------------------------------ */
  /* Navigation                                                          */
  /* ------------------------------------------------------------------ */

  /*
   * A monotonic index on the history entries.
   *
   * `popstate` does not say which way the visitor moved. The index does:
   * a smaller index is a Back press, a larger one is a Forward press. That
   * is what lets the reverse transition be a real reverse.
   */
  let historyIndex = 0;

  const makeContext = (
    route: RouteMatch,
    element: HTMLElement,
    trigger: HTMLElement | null,
    direction: 'forward' | 'back',
    origin: { x: number; y: number } | null,
  ): ViewContext => ({ route, element, trigger, direction, origin });

  /**
   * Put the incoming view on screen without an animation.
   *
   * This is the floor under every transition. If a rule throws — a missing
   * image, a browser quirk, a typo in an easing — the visitor still gets
   * the page they asked for, and the router is never left busy. A wedged
   * router is far worse than a missing animation.
   */
  const emergencySwap = (
    outgoing: HTMLElement,
    incoming: HTMLElement,
    payload: { html: string; title: string; description: string } | null,
    target: RouteMatch,
    url: URL,
    enterCtx: ViewContext,
  ): void => {
    try {
      if (payload) incoming.innerHTML = payload.html;
      if (outgoing.parentNode) outgoing.before(incoming);
      outgoing.remove();
      view = incoming;
      shell.classList.remove('is-swapping');
      incoming.style.position = '';
      incoming.style.zIndex = '';
      incoming.style.minHeight = '';
      updateHead(payload?.title ?? '', payload?.description ?? '', url);
      window.scrollTo(0, 0);
      const mountResult = options.mount?.(enterCtx);
      currentTeardown = typeof mountResult === 'function' ? mountResult : null;
    } catch (error) {
      console.error('[denvup] the view could not be mounted', error);
    }
    try {
      options.onRoute?.(enterCtx);
    } catch (error) {
      console.error('[denvup] the route callback failed', error);
    }
    currentRoute = target;
  };

  /**
   * Is the page on screen?
   *
   * A hidden tab has its animation frames throttled to a crawl, so a
   * transition that nobody can see would still hold the router for seconds.
   * When the document is hidden the swap is done immediately instead.
   */
  const visible = (): boolean => document.visibilityState === 'visible';

  const navigate: Router['navigate'] = async (href, opts = {}) => {
    if (disposed || busy) return false;

    let url: URL;
    try {
      url = new URL(href, location.href);
    } catch {
      return false;
    }
    if (url.origin !== location.origin) {
      location.assign(url.href);
      return false;
    }

    const target = resolveOrNotFound(url);
    const from = currentRoute;

    // Navigating to the route we are already on is a no-op, not a transition.
    if (from && from.id === target.id && from.path === target.path && from.url.hash === url.hash) {
      if (url.hash) {
        const anchor = document.getElementById(url.hash.slice(1));
        anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return false;
    }

    busy = true;
    busySince = performance.now();
    document.documentElement.setAttribute('data-transitioning', 'true');
    options.onProgress?.('start');

    const trigger = opts.trigger ?? null;
    const origin =
      trigger && trigger instanceof HTMLElement
        ? (() => {
            const r = trigger.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          })()
        : null;

    let payload: { html: string; title: string; description: string } | null = null;
    let incoming: HTMLElement | null = null;
    let enterCtx: ViewContext | null = null;

    try {
      try {
        payload = await fetchRoute(url, target.document);
      } catch {
        // The page could not be fetched. Fall back to a real navigation so
        // the visitor still gets somewhere, rather than leaving them on a
        // dead site.
        location.assign(url.href);
        return false;
      }

      const outgoing = view;
      const next = document.createElement('main');
      next.id = 'view';
      next.className = outgoing.className;
      next.setAttribute('data-view', target.id);
      next.innerHTML = payload.html;
      incoming = next;

      const leaveCtx = makeContext(from ?? target, outgoing, trigger, 'forward', origin);
      const enter = makeContext(target, next, trigger, 'forward', origin);
      enterCtx = enter;
      const rule = findTransition(from, target);

      /*
       * Record which rule ran. It is the only way to prove that a route
       * change used the designed transition and not a generic one, and it
       * lets the browser check assert it.
       */
      document.documentElement.setAttribute('data-transition', rule?.name ?? 'stack-default');
      document.documentElement.setAttribute('data-direction', 'forward');

      // --- phase 1: before ---------------------------------------------- //
      rule?.beforeLeave?.(leaveCtx);
      options.unmount?.(leaveCtx);
      if (currentTeardown) {
        try {
          currentTeardown();
        } catch {
          /* a failing teardown must not block the navigation */
        }
        currentTeardown = null;
      }

      // --- phase 2: leave ----------------------------------------------- //
      if (rule?.leave && visible()) {
        await withTimeout(Promise.resolve(rule.leave(leaveCtx)));
      } else {
        await leaveDefault(outgoing);
      }
      rule?.afterLeave?.(leaveCtx);

      // --- the swap ----------------------------------------------------- //
      outgoing.before(next);
      shell.classList.add('is-swapping');

      // --- phase 3: enter ----------------------------------------------- //
      rule?.beforeEnter?.(enter);
      if (rule?.enter && visible()) {
        await withTimeout(Promise.resolve(rule.enter(enter)));
      } else {
        await enterDefault(next);
      }

      outgoing.remove();
      view = next;
      shell.classList.remove('is-swapping');

      // --- phase 4: after ----------------------------------------------- //
      const mountResult = options.mount?.(enter);
      currentTeardown = typeof mountResult === 'function' ? mountResult : null;

      updateHead(payload.title, payload.description, url);
      if (!url.hash) window.scrollTo(0, 0);
      else scrollToAnchor(url.hash);

      rule?.afterEnter?.(enter);
      options.onRoute?.(enter);

      currentRoute = target;
      stack.push(target);
      if (stack.length > 40) stack.shift();

      /*
       * The click point travels with the history entry, so the reverse
       * transition can return to exactly where the forward one started.
       */
      const state = {
        denvup: true,
        id: target.id,
        fxOrigin: origin ?? null,
        index: opts.replace ? historyIndex : historyIndex + 1,
      };
      if (opts.replace) history.replaceState(state, '', url.href);
      else {
        historyIndex += 1;
        history.pushState(state, '', url.href);
      }

      return true;
    } catch (error) {
      console.error('[denvup] the route transition failed', error);
      if (incoming && enterCtx) {
        emergencySwap(view, incoming, payload, target, url, enterCtx);
      }
      return false;
    } finally {
      document.documentElement.removeAttribute('data-transitioning');
      options.onProgress?.('end');
      busy = false;
      if (pendingPopUrl) {
        window.setTimeout(() => onPopState(), 0);
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Defaults (used when a rule supplies no leave/enter)                  */
  /* ------------------------------------------------------------------ */

  const leaveDefault = async (element: HTMLElement): Promise<void> => {
    element.classList.add('is-leaving');
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 120);
    });
  };

  const enterDefault = async (element: HTMLElement): Promise<void> => {
    element.classList.remove('is-leaving');
  };

  /* ------------------------------------------------------------------ */
  /* Back / forward                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * A back press that arrives while a transition is running is not dropped.
   *
   * The browser has already changed the URL, so the view has to catch up.
   * The request is parked and replayed as soon as the running transition
   * finishes.
   */
  let pendingPopUrl: string | null = null;

  /*
   * A watchdog.
   *
   * Every transition is bounded by `withTimeout`, so a rule that never
   * resolves cannot hold the router forever. This is the second belt: if
   * the router somehow ends up busy for longer than any transition could
   * legitimately take, it is released, the page is put back in step with the
   * address bar, and the parked request is replayed.
   */
  let busySince = 0;
  const watchdog = window.setInterval(() => {
    if (!busy) return;
    if (performance.now() - busySince < 9000) return;
    console.error('[denvup] a transition ran long; the router has been released');
    busy = false;
    document.documentElement.removeAttribute('data-transitioning');
    options.onProgress?.('end');
    const parked = pendingPopUrl;
    pendingPopUrl = null;
    if (parked) void navigate(parked);
  }, 1000);

  const onPopState = (event?: PopStateEvent): void => {
    if (disposed) return;
    if (busy) {
      /*
       * Remember the URL the browser moved to. The running navigation will
       * push a state of its own, so the parked request has to carry the
       * address it was made for rather than read the current one.
       */
      pendingPopUrl = location.href;
      return;
    }
    const url = new URL(pendingPopUrl ?? location.href);
    pendingPopUrl = null;
    const target = resolveOrNotFound(url);
    const from = currentRoute;
    if (from && from.id === target.id && from.path === target.path) return;

    /*
     * Where the forward journey started. The reverse transition returns to
     * that point rather than to the middle of the screen.
     */
    const state = (event?.state ?? null) as
      | { fxOrigin?: { x: number; y: number } | null; index?: number }
      | null;
    const origin = state?.fxOrigin ?? null;

    /*
     * Which way did the visitor move? The history index answers it. A
     * Back press plays the reverse of the journey that got us here; a
     * Forward press plays it forwards.
     */
    const index = typeof state?.index === 'number' ? state.index : historyIndex;
    const direction: 'forward' | 'back' = index < historyIndex ? 'back' : 'forward';
    historyIndex = index;

    busy = true;
    busySince = performance.now();
    document.documentElement.setAttribute('data-transitioning', 'true');
    options.onProgress?.('start');

    const outgoing = view;
    const incoming = document.createElement('main');
    incoming.id = 'view';
    incoming.className = outgoing.className;
    incoming.setAttribute('data-view', target.id);

    // The back transition is the forward one, run in reverse.
    void (async () => {
      let fetched: { html: string; title: string; description: string };
      try {
        fetched = await fetchRoute(url, target.document);
        incoming.innerHTML = fetched.html;
      } catch {
        location.reload();
        return;
      }
      const payload = fetched;

      const leaveCtx = makeContext(from ?? target, outgoing, null, direction, origin);
      const enterCtx = makeContext(target, incoming, null, direction, origin);
      /*
       * On a Back press the rule of the journey we are undoing is the one
       * that should run — played in reverse.
       */
      const rule =
        direction === 'back'
          ? findTransition(target, from ?? target)
          : findTransition(from ?? target, target);
      document.documentElement.setAttribute('data-transition', rule?.name ?? 'stack-default');
      document.documentElement.setAttribute('data-direction', direction);

      try {
        rule?.beforeLeave?.(leaveCtx);
        options.unmount?.(leaveCtx);
        if (currentTeardown) {
          try {
            currentTeardown();
          } catch {
            /* ignore */
          }
          currentTeardown = null;
        }

        if (rule?.leave && visible()) await withTimeout(Promise.resolve(rule.leave(leaveCtx)));
        else await leaveDefault(outgoing);
        rule?.afterLeave?.(leaveCtx);

        outgoing.before(incoming);
        shell.classList.add('is-swapping');

        rule?.beforeEnter?.(enterCtx);
        if (rule?.enter && visible()) await withTimeout(Promise.resolve(rule.enter(enterCtx)));
        else await enterDefault(incoming);

        outgoing.remove();
        view = incoming;
        shell.classList.remove('is-swapping');

        const mountResult = options.mount?.(enterCtx);
        currentTeardown = typeof mountResult === 'function' ? mountResult : null;

        updateHead(payload.title, payload.description, url);
        window.scrollTo(0, 0);
        rule?.afterEnter?.(enterCtx);
        options.onRoute?.(enterCtx);

        currentRoute = target;
      } catch (error) {
        console.error('[denvup] the back transition failed', error);
        emergencySwap(outgoing, incoming, payload, target, url, enterCtx);
      } finally {
        document.documentElement.removeAttribute('data-transitioning');
        options.onProgress?.('end');
        busy = false;
        if (pendingPopUrl) {
          window.setTimeout(() => onPopState(), 0);
        }
      }
    })();
  };

  /* ------------------------------------------------------------------ */
  /* Event wiring                                                        */
  /* ------------------------------------------------------------------ */

  const isInternal = (anchor: HTMLAnchorElement): boolean => {
    const href = anchor.getAttribute('href');
    if (!href) return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.dataset.noRouter !== undefined) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (INTERNAL.test(href)) {
      try {
        return new URL(href, location.href).origin === location.origin;
      } catch {
        return false;
      }
    }
    return href.startsWith('/') || href.startsWith('./') || href.startsWith('#');
  };

  const onClick = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.('a');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (!isInternal(anchor)) return;

    const href = anchor.getAttribute('href')!;
    if (href.startsWith('#')) {
      // A pure fragment stays inside the current route.
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState({ denvup: true }, '', href);
      }
      return;
    }

    event.preventDefault();
    void navigate(href, { trigger: anchor });
  };

  const onPointerEnter = (event: PointerEvent): void => {
    const anchor = (event.target as Element | null)?.closest?.('a');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (!isInternal(anchor)) return;
    const href = anchor.getAttribute('href')!;
    if (href.startsWith('#')) return;
    prefetch(href);
  };

  const onFocusIn = (event: FocusEvent): void => {
    const anchor = (event.target as Element | null)?.closest?.('a');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (!isInternal(anchor)) return;
    const href = anchor.getAttribute('href')!;
    if (href.startsWith('#')) return;
    prefetch(href);
  };

  /**
   * Replace the document's view with the one the URL actually names.
   *
   * A static host serves `index.html` for an unknown path, so a direct visit
   * to `/pricing/` arrives as the home document. Rather than showing the
   * wrong page, the router fetches the right document and swaps it in
   * before the first paint of the route.
   */
  const hydrate = async (route: RouteMatch): Promise<void> => {
    busy = true;
    try {
      const payload = await fetchRoute(route.url, route.document);
      const incoming = document.createElement('main');
      incoming.id = 'view';
      incoming.className = view.className;
      incoming.setAttribute('data-view', route.id);
      incoming.innerHTML = payload.html;
      view.before(incoming);
      view.remove();
      view = incoming;
      updateHead(payload.title, payload.description, route.url);
    } catch {
      /* The document could not be fetched: the served page stands. */
    }
    busy = false;
    currentRoute = route;
    view.setAttribute('data-view', route.id);
    const ctx = makeContext(route, view, null, 'forward', null);
    const mountResult = options.mount?.(ctx);
    currentTeardown = typeof mountResult === 'function' ? mountResult : null;
    options.onRoute?.(ctx);
  };

  return {
    start(): void {
      if (started || disposed) return;
      started = true;
      document.addEventListener('click', onClick);
      document.addEventListener('pointerenter', onPointerEnter, true);
      document.addEventListener('focusin', onFocusIn, true);
      window.addEventListener('popstate', onPopState);

      const url = new URL(location.href);
      const route = resolve(url);
      const served = view.getAttribute('data-view');

      if (served && served !== route.id) {
        void hydrate(route);
        return;
      }

      currentRoute = route;
      view.setAttribute('data-view', route.id);
      history.replaceState(
        { denvup: true, id: route.id, fxOrigin: null, index: historyIndex },
        '',
        location.href,
      );
      const ctx = makeContext(route, view, null, 'forward', null);
      const mountResult = options.mount?.(ctx);
      currentTeardown = typeof mountResult === 'function' ? mountResult : null;
      options.onRoute?.(ctx);
    },

    navigate,

    current(): RouteMatch | null {
      return currentRoute;
    },

    refresh(): void {
      const url = new URL(location.href);
      currentRoute = resolveOrNotFound(url);
      view.setAttribute('data-view', currentRoute.id);
    },

    dispose(): void {
      disposed = true;
      window.clearInterval(watchdog);
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerenter', onPointerEnter, true);
      document.removeEventListener('focusin', onFocusIn, true);
      window.removeEventListener('popstate', onPopState);
      cache.clear();
    },
  };
}

export { $, $$ };
