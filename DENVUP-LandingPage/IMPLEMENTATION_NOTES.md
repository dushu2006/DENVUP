# IMPLEMENTATION_NOTES.md

**Project:** DENVUP — studio website
**Location:** `DENVUP-LandingPage/`
**Stack:** Vite 7 + vanilla TypeScript (strict), GSAP 3.15 + ScrollTrigger, Lenis 1.3,
Three.js 0.180 (dynamic), raw WebGL2, self-hosted Archivo Variable + JetBrains Mono
Variable.
**Node:** 22.22.3 · **npm:** 10.9.8 · **Python:** 3.11.2 (asset generation only)

---

## 1. Running it

```bash
cd DENVUP-LandingPage
npm install
npm run dev      # http://localhost:5173 — binds 0.0.0.0
npm run build    # typecheck + production build → dist/
npm run preview  # serve the production build on 0.0.0.0:4173
npm run verify   # typecheck → build → 43 smoke → 44 HTTP → browser → route → inert
```

`npm run dev` binds `0.0.0.0` so the sandbox preview can reach it, and `server.allowedHosts`
is enabled so a generated preview hostname is accepted. The production build uses a
**relative** `base`, so `dist/` can be served from any sub-path without a rebuild.

### The verification harness

| Script | What it does |
|---|---|
| `scripts/smoke-test.mjs` | 43 checks over the built output in jsdom: links, anchors, heading order, asset integrity, the 480-technique catalogue, a full mount-and-teardown of all 149 demos in both normal and reduced-motion modes, the business facts, fourteen contrast pairs, and a SHA-256 check that the two supplied logos are published byte-identically. |
| `scripts/serve-check.mjs` | 44 checks over the real delivery path: starts `vite preview`, fetches every one of the fifteen documents and every referenced asset, the stylesheet, the entry module, the webfonts, `robots.txt` and the web manifest, and confirms the Three.js chunk is not in the initial document. |
| `scripts/browser-check.mjs` | 209 checks in a real Chromium (from `@sparticuz/chromium`, driven by `puppeteer-core`): no overlay is painted over the page, the first chapter is visible, no horizontal overflow at any of the nine viewports (1920, 1536, 1440, 1280, 1185, 1024, 768, 390, 360), all sixteen chapters paint, the WebGL/Three/canvas panels are screenshotted and their pixels read back, the console and the network are clean, the drawer, palette, menu and enquiry wizard are driven, and the page still boots with the CPU throttled 6× on a 400 kbit/s link. Writes `screenshots/`. |
| `scripts/route-check.mjs` | 103 checks over the router: every route pair forward **and back**, the shell, the stage and the cursor surviving each change, each transition's rule and its reverse, no transition being a plain fade, the emergency swap, the 404, the reduced-motion path, and no horizontal overflow on five routes at 390 px. |
| `scripts/perf-check.mjs` | Measures five routes in a real Chromium: the load time, the time to `data-router="ready"`, the long-task count, the scroll frame rate and the console error count. Not part of `verify` because it needs a server already running. |
| `scripts/check-study-list.py` | Re-derives the `SKILLS_STUDY_LIST.md` totals from the live `AI_Skills_Pack/` tree and from the document, and fails when the two disagree. Prints `problems: NONE` and `sum=303`. |
| `scripts/build-art.py` | Regenerates the seven original artworks in `public/art/` from the studio palette, seeded, so the output is byte-identical between runs. |
| `scripts/gen-coverage.py` | Regenerates `src/data/techniques.json` and `ANIMATION_COVERAGE_MATRIX.md` from `scripts/techniques.py`. |
| `scripts/build-assets.py` | Regenerates the 13 brand assets in `public/` from the two supplied logos. |
| `scripts/gen_service_pages.py` | Regenerates the five service detail documents from `src/data/services.ts`. |

---

## 2. Why this stack

The repository was inspected before anything was chosen (`REPOSITORY-AUDIT.md` in the
skills library records the same ground). The website folder was empty apart from the two
supplied logos, there was no framework, no package manager lockfile, and no build
tooling — so the stack was chosen for the brief rather than inherited.

| Decision | Why |
|---|---|
| **Vanilla TypeScript, no framework** | The brief is sixteen chapters and 149 live demos across fifteen documents. A component framework would add a runtime, a reconciliation pass and a dependency tree without removing any work. Every chapter is a module that returns a teardown. |
| **Fifteen real documents plus a client-side router** | Every route is a real HTML file with real content, so the site works with JavaScript disabled, every route has its own URL, and a static host can serve it without rewrite rules. When JavaScript *is* available, `src/core/router.ts` swaps only `<main id="view">` and lets the eight transition rules play. |
| **GSAP + ScrollTrigger as the only animation engine** | One engine means one easing vocabulary and one timeline model. The `gsap-scrolltrigger` skill's "dispose your ScrollTriggers" rule is honoured by creating every tween inside a `gsap.context()`. |
| **Lenis for scroll inertia only** | Locomotive Scroll transforms a scroll container, which replaces the browser's scroll physics. The brief forbids scroll-hijacking and the `modern-web-design` skill forbids it explicitly. Lenis adds inertia to the *existing* native scroll, so the scrollbar, keyboard paging, the mouse wheel and find-in-page all behave normally. |
| **Three.js dynamically imported** | 705 kB raw / 181 kB gzip is far too much to put on the critical path. It is only fetched when the visitor reaches the spatial chapter or opens a 3D demo. |
| **Raw WebGL2 for the shader demos** | A shader is a fragment program; Three.js would add 700 kB to render a full-screen triangle. |
| **Self-hosted variable fonts** | No third-party font CDN, no request to a third party, and the width axis (`wdth 62–125%`) is what gives the type laboratory its variable-width specimens. |

### Dependencies

```
dependencies    @fontsource-variable/archivo  ·  @fontsource-variable/jetbrains-mono
                gsap  ·  lenis  ·  three
devDependencies vite  ·  typescript  ·  @types/three  ·  jsdom
```

`jsdom` is the only dependency added purely for verification. `npm audit` reports **0
vulnerabilities**.

---

## 3. Repository layout

```
DENVUP-LandingPage/
├── index.html                  the home page — 16 chapters, one module script
├── services/                   the five service detail documents
├── lab/  concepts/  studio/  pricing/  contact/  privacy/  terms/
├── 404.html                    the designed 404
├── package.json  package-lock.json  tsconfig.json  vite.config.ts
├── logo_black.png  logo_color.png          the two supplied marks (untouched)
├── public/                     13 generated brand assets, 7 original artworks,
│                               portraits/ (slots), robots.txt, site.webmanifest
├── scripts/
│   ├── techniques.py           the 480-technique coverage map (source of truth)
│   ├── gen-coverage.py         writes techniques.json + ANIMATION_COVERAGE_MATRIX.md
│   ├── build-assets.py         generates public/ from the two logos
│   ├── build-art.py            generates the seven original artworks
│   ├── gen_service_pages.py    writes the five service documents from services.ts
│   ├── smoke-test.mjs          42 headless checks
│   ├── serve-check.mjs         44 delivery checks
│   ├── browser-check.mjs       76 real-browser checks, nine viewports
│   └── route-check.mjs         100 router checks
├── src/
│   ├── main.ts                 composition root
│   ├── shell/                  the injected chrome: before · after · boot
│   ├── core/                   env · dom · motion · scroll · reveal · cursor · pointer
│   │                           loop · boot · clipboard · easter · motion-control
│   │                           router · shell · stage · stage-controller · chapter
│   ├── data/                   site · services · pricing · faqs · atlas · techniques
│   │                           routes · stage
│   ├── demos/                  14 modules + registry.ts (149 demos)
│   ├── sections/               16 chapter modules + the route modules
│   ├── transitions/            the eight route rules + the reduced-motion crossfade
│   ├── views/                  the per-route view registry
│   └── styles/                 tokens · base · components · sections · library
│                               routes · motion
├── .taste-skill/direction.json  the ten written design exemptions, with reasons
├── DESIGN_RESEARCH.md
├── WEBSITE_INFORMATION_ARCHITECTURE.md
├── ANIMATION_COVERAGE_MATRIX.md
├── SKILLS_STUDY_LIST.md
├── SKILL_REFERENCE_AUDIT.md
├── UI_UX_SKILLS_INVENTORY.md
├── UI_UX_AUDIT.md
├── ASSETS.md
├── IMPLEMENTATION_NOTES.md
└── TESTING_REPORT.md
```

### The core modules and their seams

| Module | Interface | Why it is a seam |
|---|---|---|
| `core/env.ts` | `env.reducedMotion`, `env.budget`, `env.webgl`, `setMotionPaused()` | One place decides what the device and the visitor's motion preference allow. Every other module asks it instead of re-reading media queries. |
| `core/motion.ts` | `gsap`, `ScrollTrigger`, `ease`, `dur`, `createContext`, `revealOnScroll`, `refreshTriggers`, `killAll` | The only place that knows GSAP exists (plus two single-purpose uses in `easter.ts` and `main.ts`). |
| `core/motion-control.ts` | `setPageMotion(reduced, manual?)`, `watchSystemMotion(cb)`, `MOTION_EVENT` | The single place that decides what "reduced motion" means, across CSS, smooth scroll, scroll reveals and canvas loops. |
| `core/loop.ts` | `createLoop(options) → { stop, destroy, running }`, `fitCanvas`, `fitDrawingBuffer`, `measureCanvas` | One render loop shared by eighteen call sites; handles rAF, visibility, offscreen pausing, budget scaling and full teardown. The three sizing helpers are separate because a canvas can only carry one context type: `fitCanvas` is for 2D, `fitDrawingBuffer` for WebGL, `measureCanvas` reads a box without touching the buffer (Three.js owns its own). |
| `core/chapter.ts` | `initChapterBackground()`, `syncChapterBackground(id)` | Repaints the root element with the colour of the chapter in view, so the strip reserved by `scrollbar-gutter: stable` is never a dark band beside a light chapter. |
| `demos/types.ts` | `Demo` — `mount(ctx) → teardown` | The seam that makes 149 demos testable by one loop in the smoke test. |
| `demos/registry.ts` | `allDemos`, `demoById`, `demosByTechnique`, `demosForCategory`, `searchDemos` | The library chapter consumes this and never learns which module a demo came from. |
| `core/router.ts` | `createRouter(options)`, `RouterOptions.transitions`, `.reducedTransitions`, `.isReduced` | The only module that touches `history`. It swaps `<main id="view">`, never the shell, and it always has a way out: `emergencySwap()` runs if a transition throws, a 9 s watchdog releases the lock, and `try/catch/finally` guarantees the busy flag is cleared. |
| `core/shell.ts` | `initShell()` | Builds the header, the menu, the command palette, the cursor, the dock and the progress bar once. It is never rebuilt on a route change, which is what makes the shell persistent. |
| `core/stage.ts` / `core/stage-controller.ts` | `initStage()`, `createStageController()` | The persistent stage: one canvas behind the whole site whose colour, camera and shapes change per chapter. The controller maps a route to its stage state; the stage pauses on `visibilitychange`. |
| `transitions/index.ts` | `serviceExpand`, `shapeWipe`, `colourWipe`, `panelOverlap`, `curtainOpen`, `imageMask`, `glitchSettle`, `stackDefault`, `reducedCrossfade` | Each rule declares a trigger, a duration, an easing, and a **reverse** behaviour, because Back has to undo exactly what Forward did. The reduced-motion crossfade is the only fade on the site. |

### The demo contract

```ts
interface Demo {
  id: string;
  title: string;
  category: DemoCategory;
  summary: string;
  trigger: string;        // what the visitor should do
  techniques: number[];   // encyclopedia IDs
  keywords: string;
  mount(ctx: { root: HTMLElement; reduced: boolean; budget: 'low'|'mid'|'high';
                announce(msg: string): void }): void | (() => void);
}
```

`mount` returns a teardown. Every demo is mounted and torn down by the smoke test in
jsdom, in both normal and reduced-motion modes, and a demo that throws is a failed
build.

---

## 4. The design system

### Colour

The ember family is **sampled from the supplied `logo_color.png`** (orange `#F0490F` →
amber `#FFB627`) rather than chosen from a template. The signal blue `#2B39E6` is the
single reserved accent for data, diagrams and interaction.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#EDEEEA` | Chapter substrate 01 / 05 / 08 / 10 / 12 / 14 |
| `--ink` | `#0B0B0C` | Chapter substrate 03 / 04 / 07 / 09 / 11 / 13 / 16 and the footer |
| `--ember` | `#F0490F` | Chapter substrate 02 / 06 / 15, and the brand accent |
| `--signal` | `#2B39E6` | Chapter substrate 07 only, plus diagram strokes |
| `--ember-deep` | `#B8300A` | **Text** accent on paper (5.20:1) |
| `--ember-hot` | `#FF5B18` | **Text** accent on ink (6.33:1) |

The plain `--ember` is 3.18:1 on paper, which fails AA for body copy, so a separate
`--accent-text` token is defined per chapter scope and used for every ember-coloured
piece of text. The fourteen documented pairs are asserted in the smoke test.

### Chapter scopes

Each chapter sets its own tokens, so a component never inherits across a chapter
boundary:

```css
.ch-paper  { --bg: var(--paper);  --fg: var(--fg-on-paper);  --accent-text: var(--ember-deep); }
.ch-ink    { --bg: var(--ink);    --fg: var(--fg-on-ink);    --accent-text: var(--ember-hot); }
.ch-ember  { --bg: var(--ember);  --fg: var(--fg-on-ember);  --accent-text: var(--ink); }
.ch-signal { --bg: var(--signal); --fg: #f2f3ff;             --accent-text: #ffc94d; }
```

### Type

* **Archivo Variable** — `wght 100–900`, `wdth 62–125%`. Imported from
  `@fontsource-variable/archivo/wdth.css`. Display, headings and body.
* **JetBrains Mono Variable** — `wght 100–800`, from
  `@fontsource-variable/jetbrains-mono/index.css`. Every index, label, ID and metadata
  string.
* Fluid scale from `--fs-micro` (11–13 px) to `--fs-mega` (64–352 px), all `clamp()`.
* Display tracking `--tracking-tight: -0.045em`; mono tracking `--tracking-wide: 0.14em`.
* Measure capped at `--measure: 62ch`.

### Shape and motion

* One radius scale: `--r-sm 6px`, `--r-md 14px`, `--r-lg 26px`, `--r-pill 999px`.
* One easing vocabulary: `--ease-out-expo`, `--ease-in-out-quint`, `--ease-out-back`,
  `--ease-smooth`. No `linear` or `ease-in-out` keyword is used for a transition.
* Durations: `--dur-fast 220ms`, `--dur-base 420ms`, `--dur-slow 900ms`.
* A documented z-index scale: `--z-base 1`, `--z-sticky 40`, `--z-nav 60`, `--z-overlay 80`,
  `--z-grain 90`, `--z-cursor 95`.

---

## 5. The chapters, and what each one actually does

| # | Chapter | Implementation notes |
|---|---|---|
| 01 | Prelude | Three editorial beats, a small central object, a "scroll to explore" cue. |
| 02 | Expansion | The object scales and expands into a full-screen colour field using `clip-path` and `mask` driven by a scroll trigger. |
| 03 | Studio | The plain statement. Left-aligned, deliberately quiet. |
| 04 | The mark | **The signature.** `logo_color.png` is drawn to an offscreen canvas, its pixels are read, and ~2 000 particles converge onto the real sampled coordinates. The emblem is therefore the actual logo, not a drawing of it. |
| 05 | Manifesto | Numbered rows, rule-separated, no cards. |
| 06 | Services | An equation header and six rows with deliverables. |
| 07 | Capability atlas | A fifteen-node SVG map with a sticky detail panel. Nodes are real buttons with tooltips; the map has a grid, band fills, connectors and a dashed progress path. |
| 08 | Process | Five stages on a rail; selecting one updates the detail. Collapses to a vertical stack under 900 px. |
| 09 | Technique library | The centrepiece. Search, 21 category filters, 149 cards, a detail panel that names the source file for each technique, a guided tour, and copy-to-clipboard for every technique ID. |
| 10 | Type laboratory | 21 specimens, each demonstrating one typographic technique on live text. |
| 11 | Spatial laboratory | A real Three.js scene (icosahedron + wireframe + PMREM environment) with four projected hotspots, plus a raw WebGL2 shader stage. |
| 12 | Team | Four names, no titles, no portraits. |
| 13 | Pricing | Three indicative starting points, a scope picker, an estimate range, and a disclaimer that says the figures are not fixed quotations. |
| 14 | Questions | A rule-separated disclosure list with keyword search. |
| 15 | Contact | A four-step enquiry form plus working email and WhatsApp links. |
| 16 | Closing | The final statement and the return path. |

---

## 6. The honest contact form

There is no server, so the form never claims to have received anything.

1. The visitor chooses a project type, a scope, an optional start date and an optional
   reference file, and writes a brief.
2. A honeypot field is present and is checked on submit.
3. On submit the form **validates**, composes a complete message, and opens the
   visitor's own mail application with that message pre-filled to
   `denvupforyou@gmail.com`.
4. The status line under the button says exactly what happened — that the message was
   prepared and their mail app was opened, and that if nothing opened, the email address
   and both WhatsApp numbers are one tap away.

There is no "Thanks! We'll be in touch." There is no fake spinner, no fake success state
and no endpoint. `mailto:denvupforyou@gmail.com` and both `https://wa.me/…` links work
whether or not the form is used at all.

---

## 7. Motion, and how to turn it off

`prefers-reduced-motion: reduce` is honoured at four levels:

| Level | Behaviour |
|---|---|
| CSS | `@media (prefers-reduced-motion: reduce)` neutralises every animation and transition. |
| JavaScript | `env.reducedMotion` is true, so `initSmoothScroll` returns null (native scroll), `revealOnScroll` sets the end state instead of animating, `createLoop` never starts, and the boot sequence is skipped. |
| Canvas | Every demo receives `reduced: true` in its context and renders a static frame. |
| The in-page switch | A visible button (bottom right) pauses motion on a system that asked for none. It is **locked** when the system has already asked for reduction, because the page must never override a system preference. |

The switch is not decorative. `core/motion-control.ts` applies the state to all four
systems at once: it sets `html.is-motion-paused` (which the CSS block uses), stops
Lenis, lands every non-scrubbed scroll reveal immediately, and dispatches
`denvup:motion`, which every render loop listens for. This was found during the audit —
the switch originally only toggled a class that nothing read, which would have been an
inert control.

---

## 7b. The feedback layer

Every control on this site answers what it did. There is one vocabulary, six
acknowledgements, and one signature moment.

### The vocabulary

| | Trigger | What the visitor sees | Duration |
|---|---|---|---|
| **press** | the finger went down | the control is depressed | 140 ms |
| **register** | a choice was made | a hairline traces around the chosen row | 240 ms |
| **confirm** | an action succeeded | a tick is **drawn** and left behind | 320 ms |
| **reject** | an action was refused | a rule wipes in under the field | 240 ms |
| **advance** | a step or panel changed | the outgoing panel leaves, the incoming arrives behind it | 300 out / 420 in |
| **write** | the signature moment | text is written into the brief in front of the visitor | 0.6–1.5 s |

Two rules hold it together.

**Residue, not flash.** A confirmation leaves a reading behind — a drawn tick, a
traced rule, a settled figure. It does not blink and vanish. A visitor who looks
away and looks back can still see that the copy worked.

**Nothing is animated that cannot be a state.** Every motion resolves to a class,
a style or a piece of text, so the reduced-motion path is the same code with the
motion switched off, not a second implementation. Under
`prefers-reduced-motion: reduce` the trace still traces, the tick still shows, the
error rule still draws and the figure still lands on the right number. *No motion*
never means *no feedback*.

### The signature moment

On a laboratory card, **"I want this"** writes the technique's reference into the
visitor's brief, in front of them, character by character. It is the one loud
moment on the site, and it is loud because it carries meaning: it makes visible
the connection between the thing they liked and the thing they are about to write.

It is also the fix for a real defect. The button used to look for a brief field
and, on the laboratory page — which has no form — find nothing and return
silently. **It was completely inert on the page most people meet it on.** Now the
acknowledgement strip opens with the reference in it, the codes travel to the
contact page in the query string, and the brief starts with what the visitor
actually asked for.

### What changed, surface by surface

| Surface | Before | After |
|---|---|---|
| Laboratory card — "I want this" | silent, and inert on `/lab/` | writes the reference into the brief, or opens a strip that carries it |
| Laboratory card — "Copy the reference" | the label swapped and reverted after 1.8 s | a tick is drawn and left |
| Laboratory card — "Replay" | only the demo restarted | the demo restarts **and** the button registers |
| Library — "Copy reference" | label swap | a drawn tick |
| Library — "Request this technique" | the field's value was assigned silently | the reference is written into the brief, visibly |
| Library — "Export this view" | a status string appeared | a status string **and** a tick |
| Enquiry — the three steps | `hidden` toggled: the questions blinked out and in | the outgoing step leaves and the incoming arrives behind it |
| Enquiry — the two questions | a border colour change, with a 20 % `back.out(2)` bounce | the choice traces itself, and the row eases in and stops |
| Enquiry — a rejected field | a line of text appeared | a rule wipes in under the field, and the field itself registers |
| Enquiry — the running summary | the line was replaced | the new line settles in |
| Pricing — the estimator figure | the number swapped | the figure travels to its new value, both ends moving together |
| Pricing route — the estimator figure | the number swapped | the same |
| Any address — "copy" | the label swapped and reverted | a tick is drawn beside the address and stays |
| Every filter chip | a pressed state | a pressed state **and** a trace |

### The easing

The interface uses `cubic-bezier(0.22, 1, 0.36, 1)` for everything — the curve
the `design-taste-frontend` motion reference names for entering and exiting. It
has **no overshoot**.

An earlier draft used a 12 % overshoot to make a press feel physical, and the
reference is explicit: *"bounce or elastic easing on interface elements"* is one
of the things that gives generated motion away. The overshoot went. The warmth of
this layer comes from the residue, the draw and the one signature moment, not
from a spring.

The one overshoot curve left in the codebase, `ease.back`, is used **only by the
demonstration library**, which exists to show what these curves look like.

---

## 7c. The second feedback pass — the whole site

The first pass built the feedback layer and its vocabulary. This pass swept the
**whole site** for the same thing: an action the visitor takes and nothing that
says it was received. The goal was narrow and strict — *every action visibly
acknowledged* — and the tone was warmer and more playful.

**What was added**

| Surface | What it did before | What it does now |
|---|---|---|
| The FAQ search on the home page | Filtered silently. A visitor who typed "cost" and got nothing could not tell a no-match from a broken page. | A live count beside the box (`role="status"`, `aria-live="polite"`) and an empty state that names the situation and offers three ways out: **Clear the search**, **See the buying questions** (which goes to `/pricing/#pricing-faq`), **Ask us instead**. |
| The enquiry fields | Typed into, and nothing happened. | A field reports the moment it crosses from empty to holding something that reads correctly: the mark is drawn **once** and stays. Nothing moves on a keystroke. The brief also shows its length. |
| The technique library on the home page | Rebuilt all 480 cards on every keystroke, each with its own entrance tween. | Built **once** into a map; the filter only shows and hides. Measured **10–11 ms** per keystroke, and the cards keep their identity, so a card that was already read stays read. The arrival happens one time, as one block, when the grid first comes into view. |
| The three spatial hotspots | Revealed their note on hover and did nothing when pressed — and on a touch screen, where there is no hover, did nothing at all. | A press opens the note and keeps it open; a second press closes it. Only one note is open at a time. |

**Why a field acknowledges by state and not by movement.** The motion reference is
explicit: *hundreds of times (keyboard actions, typing): no animation.* A field is
seen and used hundreds of times, so the mark is drawn once — on the state change —
and then it simply stays. The same rule retired the library's per-card tweens.

**The defect the sweep found.** The sweep was meant to find missing feedback and
found something far larger, described in full in `SKILL_REFERENCE_AUDIT.md` §2.24.

The laboratory's catalogue grid and the shape-wipe transition's blueprint overlay
were both called `.fx-grid`. The transition's rule sets `position: absolute` and
`inset: 0`; the catalogue's rule did not, so it inherited them. The Effects
Library was taken out of the flow, held at the height of its section and clipped
by that section's `overflow: clip`.

| | Shipped | Now |
|---|---|---|
| Height of the laboratory page | 4 973 px | 28 622 px |
| The 149th demonstration | at viewport y = 21 494 | inside the page |
| Demonstrations a visitor could reach | **2 of 149** | **149 of 149** |

The transition overlay is now `.fx-blueprint`, and every other class the
transition layer creates was checked against every page stylesheet — no other
collision.

**The links that were broken.** The service pages promised that *every* technique
was live in the Effects Library. Ten of the twenty are; ten are records only. The
copy now counts them honestly, and each technique links to what actually exists:
`/lab/#tech-NNN` when there is a running demonstration, `/#tech-NNN` when there is
only the record. The link says which it is — **live demo** or **reference** — and
the five-word rotating label that used to stand in for that has been deleted.

**The deep links that did not land.** Three separate causes, all fixed:

1. The view is mounted *before* the router puts the new address into the history,
   so `location.hash` still belonged to the page the visitor was leaving. The
   fragment is now carried through the view context (`src/main.ts` →
   `src/views/index.ts` → `src/sections/lab-library.ts`).
2. Lenis caches the height of the page and clamps every scroll to that cache, so
   a jump to a page that had just grown was cut short. `jumpTo()` refreshes the
   measurement first.
3. A single jump is wrong the moment the demonstrations above the target mount
   and make the page taller. `settleOn()` corrects the position until it stops
   changing, and gives up after a few seconds so it can never hold the page.

Measured on the finished build: a deep link to a technique in the middle of the
catalogue lands the card **89 px** from the top of the window — the header offset,
exactly as designed.

## 8. Performance

### Build output (measured, 19 October 2026, multi-route build)

| Artefact | Raw | gzip |
|---|---|---|
| `main-*.css` (all fifteen documents share it) | 154.56 kB | 28.97 kB |
| `main-*.js` | 408.89 kB | 113.50 kB |
| `gsap-*.js` (chunk) | 114.01 kB | 45.01 kB |
| `lenis-*.js` (chunk) | 19.58 kB | 5.65 kB |
| `three-*.js` (chunk, **dynamic**) | 704.69 kB | 180.15 kB |
| Web fonts | 11 `.woff2` files, 395 kB total; the Latin subsets are 130 kB | — |
| The seven original artworks | 588 kB total | — |
| `dist/` in total | 5.2 MB | — |

The initial payload is the HTML, the CSS, the main chunk, GSAP and Lenis — about
**193 kB gzipped** before fonts. Three.js is fetched only when the spatial
chapter or a 3D demo is reached.

**Measured in the browser** (`npm run perf-check` — `scripts/perf-check.mjs` —
Chromium, 1440 × 900, against `vite preview`):

| Route | Load | Ready | Long tasks | Scroll fps (median of five) | Console errors |
|---|---:|---:|---:|---:|---:|
| `/` | 2453 ms | 2462 ms | 0 | **62** | 0 |
| `/lab/` | 1995 ms | 2002 ms | 0 | **58** | 0 |
| `/studio/` | 793 ms | 799 ms | 0 | **58** | 0 |
| `/services/` | 665 ms | 671 ms | 0 | **62** | 0 |
| `/services/web-design/` | 680 ms | 687 ms | 0 | **58** | 0 |

The frame rate is the median of five two-second samples, and the five samples
are printed so the spread is visible.

**Why the instrument changed.** The first version measured one pass down the
whole page, stepping 600 px every 60 ms — about 10 000 px a second, several
times faster than a person scrolls. The same build measured 16, 17, 27 and 34
fps on four different passes in one run, because the laboratory mounts and
tears down 149 live demonstrations as it goes. A direct A/B settled what the
cost is:

| Laboratory page | Frame rate |
|---|---:|
| As shipped | 34 fps |
| The same page with the demonstrations not mounted | **60 fps** |

So the demonstrations are the cost, not the layout and not the length of the
page: with them disabled the page is the same height and scrolls at the
display's refresh rate. `content-visibility: auto` was tried on the cards and
changed nothing measurable while making the page's height depend on an
estimate, so it was taken back out.

The bundle size is unchanged, and the home page is still the slowest to load
because it carries all 480 library cards in the main chunk. That is recorded as
P2-1 in `UI_UX_AUDIT.md` rather than hidden.

### The techniques used

* **Dynamic import** for Three.js; the shader demos use raw WebGL2 with no library.
* **Manual chunks** in `vite.config.ts` so GSAP, Lenis and Three are separate files.
* **`IntersectionObserver`** for every canvas loop, so an off-screen demo draws nothing.
* **`requestAnimationFrame` throttling** with a device budget — `env.budget` is `low`
  under reduced motion or on a low-core device, `mid` on ≤ 4 cores or ≤ 4 GB, `high`
  otherwise — and the loop caps itself at 30 fps on `low`.
* **No layout-triggering animation.** Only `transform` and `opacity` are animated; no
  `top`, `left`, `width` or `height` transition exists in the project.
* **`backdrop-filter`** is used only on the fixed header, the menu and the command panel.
* **Grain** is a single fixed, `pointer-events: none` `feTurbulence` layer.
* **Every listener, observer, timer and canvas is released** on teardown. The smoke test
  asserts that every `setInterval` is matched by a `clearInterval`, and the loop's
  `destroy()` removes the `visibilitychange` listener, the motion listener and the
  IntersectionObserver.
* **Fonts** use `font-display: swap`, and `document.fonts.ready` triggers a
  `ScrollTrigger.refresh()` so the scroll measurements are taken after the real
  metrics land.
* `prefers-reduced-motion` is also read at runtime, and the page responds if the
  preference changes while it is open.

### Known limitation

The build emits a Vite warning that the Three.js chunk exceeds the default 500 kB
warning threshold. This is expected — Three.js is a single large library — and the
chunk is loaded on demand, never on the critical path.

---

## 9. Assets

`scripts/build-assets.py` generates every brand asset from the two supplied marks using
Pillow:

* It trims to the **alpha bounding box**, so no transparent margin is baked in.
* It never stretches: aspect ratio is preserved, and only a uniform scale is applied.
* It never replaces the artwork: `logo_black.png` and `logo_color.png` are used as-is
  in the page, and every generated file is derived from those exact pixels.

Generated into `public/`: `favicon.svg`, `favicon-16/32/64.png`, `icon-192.png`,
`icon-512.png`, `apple-touch-icon.png`, `brand-mark.png`, `brand-mark-ink.png`,
`og-image.png`, `og-image-square.png`, `logo_color.png`, `logo_black.png`,
`logo_color.webp`, `logo_black.webp`, plus a hand-written `robots.txt` (allow all) and
`site.webmanifest`.

**The two supplied marks are published byte-identically.** `scripts/build-assets.py`
copies `logo_color.png` and `logo_black.png` into `public/` with a file copy — the SHA-256
of the source and of the published file are compared by the smoke test, so this cannot
drift. The page references them directly:

| Position | File |
|---|---|
| Header lockup | `/logo_black.png` (the black twin, correct on the light header) |
| Expansion chapter emblem | `/logo_color.png` |
| Footer emblem | `/logo_color.png` |
| Mark chapter particle source | `/logo_color.webp` — the same pixels, sampled on a canvas |

Each of those is wrapped in a `<picture>` with a WebP source, so a modern browser
downloads 184 kB + 69 kB instead of 804 kB + 321 kB while the supplied PNG stays the
fallback. The artwork is never stretched: the header mark uses `object-fit: contain`, and
every other instance keeps its intrinsic aspect ratio (`width: 220px; height: auto`).

**There is no wordmark in either supplied logo.** The DENVUP wordmark is typeset in
Archivo Variable in the page, which is why the wordmark is text rather than an image —
it stays crisp, selectable and translatable, and it does not misrepresent the supplied
files.

---

## 10. Business facts, as used

| Fact | Value | Where |
|---|---|---|
| Studio name | DENVUP | Header, footer, page title |
| Email | `denvupforyou@gmail.com` | Contact chapter, footer, menu — as a `mailto:` link and a copy button |
| WhatsApp | `+91 76759 93371` | `https://wa.me/917675993371` — contact chapter and footer |
| WhatsApp | `+91 91335 85849` | `https://wa.me/919133585849` — contact chapter and footer |
| Landing pages | from ₹15,000 | Pricing chapter, marked indicative |
| Business websites | from ₹20,000 | Pricing chapter, marked indicative |
| Advanced custom solutions | from ₹50,000 | Pricing chapter, marked indicative |
| Team | T. Dusyanth · M. Nanda Kishore · K. V. Sai Prashanth · P. Venkatesh | Team chapter, by name only |

**Not present anywhere on the site, because it was not supplied:** job titles, bios,
years of experience, client names, client logos, testimonials, awards, project
statistics, "years in business" claims, or headcount claims. The pricing figures are
labelled indicative, scope-dependent and editable, and the page says that external
charges may be separate.

---

## 11. Techniques that could not be implemented

Seventeen of the 480 techniques are marked **Blocked** and four **Requires revision** in
`ANIMATION_COVERAGE_MATRIX.md`, each with a recorded reason:

* **Video and audio playback techniques (381–386, 392, 393, 439, 447)** — the studio
  supplied no video or audio assets, and inventing or stock-substituting them would be
  fabrication. The audio *reactive* behaviour is implemented with the Web Audio
  oscillator API instead, so the technique is demonstrated without a missing asset.
* **Router-dependent techniques (19, 168, 169, 175)** — these were blocked while the
  site was a single document. They are implemented now: `src/core/router.ts` swaps
  only `<main id="view">`, and `src/transitions/index.ts` holds the eight named
  route rules. The one exception is technique 168 in its *reduced-motion* form, which
  is a single 0.24 s crossfade — the only fade on the site, used only when the
  visitor asks for less motion.
* **Studio floor plan (353)** — the studio has not supplied a floor plan, and one
  cannot be invented.
* **Camera permission (472)** — requires a device camera and an explicit permission
  prompt; the demonstration would be intrusive and cannot be verified in this
  environment.
* **199, 288, 470** — implemented and working, but the visual result did not reach
  the intended standard, so they are called out as **Requires revision** rather than
  quietly counted as successes. (458, the slow-network test, was raised to **Tested**
  once the browser check was able to drive the throttled pass on its own.)

**The counts as they stand now:** 464 Tested · 0 Planned · 3 Requires revision ·
13 Blocked. Regenerate with `python3 scripts/gen-coverage.py` after any change to
`scripts/techniques.py`.

---

## 12. Things a future maintainer should know

* **The coverage matrix is generated, never hand-edited.** Change
  `scripts/techniques.py`, then run `python3 scripts/gen-coverage.py`, which rewrites
  both `src/data/techniques.json` and `ANIMATION_COVERAGE_MATRIX.md`. The script has a
  count guard that fails if the total is not 480.
* **`src/styles/sections.css` was rewritten from scratch** to match the class names the
  chapter modules actually emit. The old class names (`.pricing__amount`, `.faq__q`,
  `.faq__a`, `.atlas__panel-title`, and the old `.team__*` / `.spatial__*` /
  `.library__*` / `.typography__*` names) do not exist in the markup and must not be
  reintroduced.
* **`src/demos/micro.ts` was renamed to `src/demos/buttons.ts`.** Any reference to
  `micro.ts` is stale.
* **The demo modules are imported by `registry.ts` only.** A new module must be added
  there, or its demos will not appear in the library.
* **Every chapter module exports `init<Name>(): () => void`** and `src/main.ts` collects
  the teardown. A chapter that returns `undefined` will break the HMR teardown.
* **The `Demo` context's `announce` function is how a demo talks to a screen reader.**
  Use it rather than writing to the DOM directly.
* **Adding a colour means adding it to the contrast list** in `scripts/smoke-test.mjs`
  and re-checking the fourteen documented pairs.
* **The browser is verified** — `scripts/browser-check.mjs` (209 checks across nine
  viewports) and `scripts/route-check.mjs` (103 checks over every route pair, forward
  and back). What is still *not* verified — a physical handset, a screen reader, a
  real GPU, a mail client, a Lighthouse score — is listed in `TESTING_REPORT.md` §5.
* **The site is a multi-page build with a client-side router.** Fifteen real HTML
  documents; the router swaps `<main id="view">` and leaves the shell, the stage and
  the cursor alive. `src/shell/shell-before.html` and `shell-after.html` are injected
  by the `shellPlugin()` in `vite.config.ts` — never copy the chrome into a page.
* **A route's transition is chosen by `data-transition` on the target document**, and
  the direction is resolved from the history index, so Back reverses the same rule
  that Forward played. The eight rules and their reverses are in
  `WEBSITE_INFORMATION_ARCHITECTURE.md` §3.
* **`gsap.ticker.lagSmoothing(0)` in `src/core/motion.ts` is load-bearing.** GSAP's
  default clamps a frame longer than 500 ms to a 33 ms advance, which turned a
  0.96 s transition into a ten-second one under CPU load. Do not remove it.

---

## 13. Suggested versus verified content

Every string on the site falls into one of three categories, and this section says
which is which. Nothing was invented and presented as a fact.

### 13.1 Verified — supplied by the studio, used exactly as given

| Item | Where it appears |
|---|---|
| The two supplied logos (`logo_black.png`, `logo_color.png`) | The header wordmark, the intro, the transitions, the footer, the favicons, the touch icons and the social preview. Published byte-identically; a SHA-256 comparison in the smoke test fails if the published copy differs from the source. |
| `denvupforyou@gmail.com` | The header, the contact chapter, the contact route, the footer, the privacy page and the mailto hand-off. |
| `+91 7675993371` and `+91 9133585849` | Two `wa.me` links in the contact chapter, the contact route and the footer. Both resolve to a real WhatsApp conversation. |
| The four names — T. Dusyanth, M. Nanda Kishore, K. V. Sai Prashanth, P. Venkatesh | The studio route and the closing chapter. **By name only.** No title, no role, no biography, no founding year, no location, no photograph. |
| Three price points — from ₹15,000, from ₹20,000, from ₹50,000 | The pricing chapter, the pricing route, the service detail pages and the estimator. Labelled indicative, scope-dependent and editable in `src/data/services.ts`. |
| The brief's own technical requirements | The route list, the transition table, the chapter list and the motion rules are the studio's, and the build follows them. |

### 13.2 Suggested — written for the site, and open to change

Everything below was written for this build and is the studio's to rewrite. It is
accurate about what the site *does*; it is not a claim about the studio's history,
its clients or its results.

| Content | Where | Note |
|---|---|---|
| The manifesto and the manifesto chapters | The home page | The studio's position, argued. No claim of any achievement. |
| Every chapter headline and paragraph | The home page and every route | |
| The five service descriptions, their deliverables and their "how it works" diagrams | `/services/` and the five detail pages | The diagrams describe the shape of the work, not a delivered project. |
| The process — six stages | The home page and `/studio/` | A proposed way of working, not a claim about past projects. |
| The capability atlas — the technology list | The home page and `/studio/` | Technologies the studio works with, not a certification or a client list. |
| The FAQ answers | The home page, `/pricing/` and `/contact/` | |
| The concepts index | `/concepts/` | Honestly labelled as in-progress. |
| The pricing estimator's range and logic | The home page and `/pricing/` | Built on the three verified price points; the multipliers are suggested. |
| The enquiry's question set | The home page and `/contact/` | |
| The legal text | `/privacy/` and `/terms/` | **Draft.** Written to be structurally sound, not reviewed by a lawyer. The address and the jurisdiction are placeholders and say so. |
| The 480-technique coverage claims | The library and the coverage matrix | Each entry names the file that implements it; the counts are measured by `scripts/gen-coverage.py`. |
| Every performance number quoted on the site | The performance chapter | Measured in this environment and labelled as such. |

### 13.3 Deliberately absent

No client names, no client logos, no testimonials, no awards, no rankings, no
"10+ years" claim, no percentage figure about results, no stock photography of
people at laptops, no invented portraits, no fake statistics, and no awards strip.
The smoke test asserts the absence of testimonial and award fields in
`src/data/site.ts`, and the browser check asserts that the artwork on the page
is the seven original pieces in `public/art/`.

---

## 14. What was changed after the first working build

Recorded because it shows the verification actually found things:

| Found by | Problem | Fix |
|---|---|---|
| Type check | 30 errors on the first `tsc --noEmit` pass, then 21 more after the section modules landed | Fixed individually; `npx tsc --noEmit` is clean (exit 0) |
| Type check | `src/core/reveal.ts` contained `export function initHeader(): void => void {` — a hard syntax error | Corrected to `(): () => void` |
| Type check | `gsap.ScrollTrigger` used as a type | The class is declared globally; the bare `ScrollTrigger` type is correct |
| Type check | `Uint8Array` rejected by `getByteFrequencyData` in TypeScript 5.9 | Changed to `Uint8Array<ArrayBuffer>` |
| Type check | Three.js ships no types | Added `@types/three@0.180` as a dev dependency |
| Smoke test | The CSS asset check matched `url(%23n)` inside the grain SVG data URI | Data URIs are now skipped, and the URL scanner resumes after each token so nested `url()` is not scanned twice |
| Smoke test | The built module failed to import with `document is not defined` | jsdom globals are installed on `globalThis` before the dynamic import |
| Smoke test | Four demos threw in jsdom: `img.decode is not a function`, `path.getTotalLength is not a function` | Guarded in the source — this was a genuine robustness improvement, not a test workaround |
| Skill audit (`threejs-webgl`) | The camera aspect ratio was never updated on resize, so scenes stretched after a resize | Both Three.js files now sync `camera.aspect` and call `updateProjectionMatrix()` |
| Skill audit (`threejs-webgl`) | `renderer.outputColorSpace` was never set | Set to `THREE.SRGBColorSpace` in both files |
| Contrast audit | `--ember` on paper is 3.18:1 — below AA for body copy | Added a per-chapter `--accent-text` token and moved every ember-coloured *text* onto it |
| Contrast audit | The signal chapter's muted text was 3.81:1 | Raised to 5.36:1 |
| Code audit | The in-page motion switch only toggled a class nothing read — an inert control | `core/motion-control.ts` now drives CSS, smooth scroll, scroll reveals and every render loop |
| Code audit | `createLoop` never removed its `visibilitychange` listener, and the loop could restart after teardown | Added `destroy()`; all eighteen call sites updated |
| Code audit | `.field input:focus-visible { outline: none }` removed the focus ring for keyboard users | The global ring now applies; `outline: none` survives only under `:focus:not(:focus-visible)` |
| Code audit | The fonts were installed but never imported — the site was rendering in fallback fonts | `@fontsource-variable/archivo/wdth.css` and `@fontsource-variable/jetbrains-mono/index.css` are now imported in `src/main.ts` |
| Code audit | `.ch-signal` was defined in the tokens but used nowhere | The capability atlas chapter now uses it, which also reduces the number of dark chapters |
| Code audit | The dev server rejected the sandbox preview hostname with HTTP 403 | `server.allowedHosts: true` and `preview.allowedHosts: true` in `vite.config.ts` |
| Browser check | The `hidden` attribute was defeated by author `display` declarations on six overlays, so the shortcut guide and the library drawer were painted over the page | One global `[hidden] { display: none !important; }` in `base.css` |
| Browser check | `createLoop` never advanced its time baseline, so `dt` stayed `0` and **no canvas demo on the site ever drew a frame** | The first frame now only establishes the baseline |
| Browser check | The WebGL demos sized their canvas with the 2D helper, which returns `null` on a WebGL canvas | `fitCanvas` split into `fitCanvas` / `fitDrawingBuffer` / `measureCanvas` |
| Browser check | `SVGTextPathElement.startOffset` was assigned as a property, throwing on every frame | The attribute is written by hand from a tweened object |
| Browser check | The mobile menu and the command palette never received the `is-open` class their CSS is keyed on, so the menu had no backdrop and its light type sat on the paper chapter | `is-open` is now toggled on both; the menu's exit is rebuilt around the curtain |
| Browser check | The palette and the menu rows were styled against class names the scripts never emit | The rules now target `.cmdk__result*` and `.menu__item*` |
| Browser check | Every enquiry radio shared the name `""`, merging two questions into one group | The group name is read from the host |
| Browser check | The radio controls were stretched across their card by the grid | Pinned to a 1 rem box beside the label |
| Browser check | A dark band ran down the right of every light chapter (the scrollbar gutter) | `core/chapter.ts` repaints the root with the chapter in view |
| Browser check | The intro could not be dismissed if the animation ticker stalled | The release is also scheduled as plain time |
| Second feedback pass | The Effects Library's catalogue grid and the shape-wipe transition's blueprint overlay were both `.fx-grid`. The transition's `position: absolute; inset: 0` was inherited by the catalogue, which was clipped to the height of its section — **147 of the 149 demonstrations were unreachable** | The overlay is now `.fx-blueprint`; the catalogue is back in the flow and the page is 28 622 px tall instead of 4 973 |
| Second feedback pass | The service pages claimed every technique was live in the Effects Library; ten of the twenty have no demonstration | Each technique now links to what exists — `/lab/#tech-NNN` or `/#tech-NNN` — and says which it is: **live demo** or **reference** |
| Second feedback pass | The view was mounted before the router pushed the new address, so a deep link read the *previous* page's fragment | The fragment is carried through the view context |
| Second feedback pass | Lenis clamps every scroll to its cached page height, so a jump into a page that had just grown was cut short | `jumpTo()` refreshes the measurement before the jump |
| Second feedback pass | A single jump is wrong the moment the demonstrations above the target mount and make the page taller | `settleOn()` corrects the position until it stops changing, and gives up after a few seconds |
| Second feedback pass | The three spatial hotspots were buttons that revealed a note on hover and did nothing when pressed — and on a touch screen, where there is no hover, did nothing at all | A press opens the note and keeps it open; a second press closes it |
| Second feedback pass | The technique library rebuilt all 480 cards on every keystroke, each with its own entrance tween | The cards are built once; the filter only shows and hides them. Measured 10–11 ms per keystroke |
| Second feedback pass | The FAQ search filtered silently, so a no-match was indistinguishable from a broken page | A live count and an empty state with three ways out |
| Second feedback pass | The enquiry fields gave no acknowledgement while typing | A field reports the state change once, and the brief shows its length |
| Harness | The smoke test never terminated the Node process | GSAP's ScrollTrigger keeps a permanent rAF loop alive once enabled — correct in a browser, fatal in Node. The harness now ends with an explicit `process.exit()`. Verified as a harness artefact, not a site defect: after tearing down all 149 demos, `gsap.globalTimeline` held **zero** active tweens. |
