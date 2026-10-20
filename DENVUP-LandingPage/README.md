# DENVUP — studio website

The DENVUP marketing site: a multi-route studio site with a persistent shell, a
persistent stage behind every page, real route transitions, and a working
demonstration of what the studio can build.

```bash
npm install
npm run dev       # http://localhost:5173
npm run verify    # typecheck → build → 43 smoke → 44 HTTP → browser → route → inert
npm run browser-check   # the real-browser pass on its own; writes screenshots/
npm run route-check     # the real-browser route/transition pass on its own
npm run inert-check     # asks the browser, on every route, whether every control has a
                        # listener and every link resolves to a real document and fragment
npm run perf-check      # the load / long-task / frame-rate measurement on its own
npm run study-check     # re-derives the study-list totals from the live skills pack
```

## What is here

| Path | |
|---|---|
| `index.html` + `src/shell/*.html` | The fifteen documents. The shell (header, menu, command palette, cursor, grain, progress bar, stage canvas, dock, footer) is injected by a Vite plugin, so it is written once and never re-created. |
| `src/main.ts` | Composition root — boots the shell, wires the router, tears everything down on hot reload. |
| `src/core/` | The shared machinery: `router`, `shell`, `stage`, `stage-controller`, `motion`, `env`, `boot`, `pointer`, `loop`, `reveal`, `cursor`, `scroll`, `clipboard`, `easter`, `motion-control`. |
| `src/transitions/` | The eight route-transition rules, each direction-aware, plus the reduced-motion crossfade. |
| `src/views/` | One renderer per route. The router swaps `<main id="view">` only. |
| `src/sections/` | One module per chapter or route section. Each exports `init<Name>()` and returns a teardown. |
| `src/demos/` | 14 modules, **149 live demos**, plus `registry.ts` — the index the lab library and the test harness both use. |
| `src/data/` | The studio's own facts: routes, services, indicative pricing, FAQs, the capability atlas, the stage states, the 480-technique catalogue. |
| `src/styles/` | `tokens` → `base` → `components` → `sections` → `routes` → `library` → `motion`. |
| `public/` | Generated brand assets, the seven original artworks, and the two supplied logos published byte-identically. |
| `scripts/` | Asset and artwork generation, coverage generation, and the seven verification harnesses (jsdom, HTTP, a real Chromium, a real Chromium driving the router, an inert-control and link audit, a real-browser performance probe, and the study-list checker). |

## The routes

| Route | What it is |
|---|---|
| `/` | The home page — sixteen chapters, `ch-00` to `ch-15`. |
| `/services/` | The service overview; its cards expand into the detail pages. |
| `/services/{web-design,ai-solutions,business-integrations,creative-experiences,automation}/` | The five service detail pages. |
| `/lab/` | The interaction lab — every live demo, filterable. |
| `/concepts/` | The honest concepts showcase. |
| `/studio/` | The studio: manifesto, principles, process, technology atlas, team. |
| `/pricing/` | Pricing, expanded from the home page, with the estimator and the pricing FAQ. |
| `/contact/` | The full enquiry, with the honest alternatives when there is no backend. |
| `/privacy/`, `/terms/` | The legal pages. |
| `/404.html` | The designed not-found page. |

## The documentation

| Document | What it answers |
|---|---|
| [`SKILLS_STUDY_LIST.md`](./SKILLS_STUDY_LIST.md) | The study gate: every relevant skill in `AI_Skills_Pack/`, read or listed, with the reason for each decision and the totals (303 found, 51 selected, 252 excluded). |
| [`DESIGN_RESEARCH.md`](./DESIGN_RESEARCH.md) | The studio sites that were actually read, what was taken from each, what was deliberately left alone, and the route-handoff research that shaped the transitions. |
| [`WEBSITE_INFORMATION_ARCHITECTURE.md`](./WEBSITE_INFORMATION_ARCHITECTURE.md) | The sixteen chapters, the route map, the navigation model, the content model, and the non-fade entrance/exit technique ID for every chapter. |
| [`ANIMATION_COVERAGE_MATRIX.md`](./ANIMATION_COVERAGE_MATRIX.md) | All 480 encyclopedia techniques, each with its status and the file that implements it. |
| [`SKILL_REFERENCE_AUDIT.md`](./SKILL_REFERENCE_AUDIT.md) | Every skill consulted, the guidance taken from it, how it was applied, and where it was overruled and why. |
| [`IMPLEMENTATION_NOTES.md`](./IMPLEMENTATION_NOTES.md) | The stack and why, the design system, the router and transition architecture, the build output and the measured performance, the honest contact form, **which content is the studio's and which was written for the site** (§13), and what changed after the first working build. |
| [`TESTING_REPORT.md`](./TESTING_REPORT.md) | What was verified, how, the defects the testing found and their fixes, and — at length — what could **not** be verified and why. |
| [`ASSETS.md`](./ASSETS.md) | Every image, font, icon and mark — where it came from, how it was generated, and where it is used. |
| [`UI_UX_SKILLS_INVENTORY.md`](./UI_UX_SKILLS_INVENTORY.md) | The UI/UX skill inventory: which of the 303 skills bear on interface design, and what each one contributed. |
| [`UI_UX_AUDIT.md`](./UI_UX_AUDIT.md) | The UI/UX audit: a scored review of accessibility, performance, theming, responsiveness and integrity, with findings, appendices and the measured contrast table. |

## Ground rules this project keeps

* The two supplied logos are published byte-identically and referenced directly. They are
  never stretched and never replaced.
* No client names, client logos, testimonials, awards, statistics or team roles are
  invented anywhere. The four team members are listed by name only.
* The pricing figures are labelled indicative, scope-dependent and editable.
* The contact form has no server, so it never claims to have received anything — it
  prepares the message, opens the visitor's own mail client, and says exactly that.
* Techniques that could not be implemented are recorded as **Blocked** with the reason,
  not quietly counted as successes.
* No chapter enters or leaves with a plain fade. Every entrance and exit has a named,
  non-fade technique, recorded in `WEBSITE_INFORMATION_ARCHITECTURE.md`.
* Every action registers. Six acknowledgements — press, register, confirm, reject,
  advance, write — and one vocabulary shared by every route. A confirmation leaves a
  reading behind rather than a blink, and under `prefers-reduced-motion: reduce` the
  state still changes and only the travel is dropped. No control is ever inert.
* The site is verified in a real browser, not only in jsdom: the overlays, the console,
  the overflow, the form, the WebGL output, the pixels, the route transitions and the
  persistence of the shell are all asserted, and the screenshots in `screenshots/` are
  the real output of the real build.
