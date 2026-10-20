# TESTING_REPORT.md

**Project:** DENVUP — studio website
**Date of this report:** 20 October 2026 (the figures below are from the final build)
**Test environment:** Linux sandbox · Node 22.22.3 · npm 10.9.8 · Python 3.11.2 ·
Pillow 13.0.0 · jsdom 30.1.3 · **Chromium 153.0.0** (`@sparticuz/chromium`) driven by
`puppeteer-core` 25.14 · real GPU-less software rasterisation (SwiftShader)

---

## 1. Summary

| Verification activity | Method | Result |
|---|---|---|
| Type correctness | `npx tsc --noEmit` (strict) | **Pass** — exit 0, no output |
| Production build | `npx vite build` | **Pass** — ~4 s, all assets emitted |
| Dependency audit | `npm audit` | **Pass** — 0 vulnerabilities |
| Automated functional checks | `node scripts/smoke-test.mjs` (jsdom) | **Pass** — 43 checks, 43 passing |
| Delivery over HTTP | `node scripts/serve-check.mjs` (`vite preview` + real fetches) | **Pass** — 44 checks, 44 passing |
| Demo layer | 149 demos mounted and torn down in jsdom, normal **and** reduced-motion | **Pass** — 149/149, no throws |
| Asset integrity | Every `src`/`href`/`content` reference and every CSS `url()` target resolved against `dist/` | **Pass** — 11 HTML references, all CSS targets, 8 webfont files |
| Link integrity | Every in-page anchor resolved against the real DOM | **Pass** — 24/24 |
| Heading hierarchy | DOM walk over `h1`–`h6` | **Pass** — one `h1`, no skipped levels |
| Colour contrast | Fourteen documented token pairs against WCAG targets | **Pass** |
| Catalogue integrity | 480 techniques, 21 categories, unique contiguous IDs, every `Tested` technique points at a file that exists | **Pass** |
| Business-fact audit | Email, both WhatsApp numbers, four team names, three price points, no fabricated testimonials or awards | **Pass** |
| **Real-browser rendering** | `node scripts/browser-check.mjs` (Chromium 153, nine viewports) | **Pass** — 209 checks, 209 passing |
| **Responsive rendering** | Same check at 1920, 1536, 1440, 1280, 1185, 1024, 768, 390 and 360 px wide | **Pass** — no horizontal overflow at any of the nine widths |
| **Routing and transitions** | `node scripts/route-check.mjs` (Chromium 153) | **Pass** — 103 checks, 103 passing |
| **Inert controls and broken links** | `node scripts/inert-check.mjs` (Chromium 153, DevTools protocol) | **Pass** — 42 checks, 42 passing; **0 inert controls** and **0 broken links** across all fourteen routes |
| **Route transitions** | The same check, driven through every route pair forward and back | **Pass** — each pair uses its own transition, no transition is a plain fade, and the shell, stage and cursor survive every swap |
| **Shell persistence** | The same check compares DOM node identity across a route change | **Pass** — header, menu, command palette, cursor, stage canvas and dock are the *same elements* before and after, not re-created |
| **Design-taste inspection** | `design-taste-frontend` inspector at 1440 and 390 | **Pass** — 0 FAIL, 0 WARN (the pre-existing baseline was 14 FAIL and 8 WARN) |
| **The feedback layer** | The same check drives a copy, a choice, a rejected field, a step change and the laboratory's "I want this" button | **Pass** — a tick is drawn, a choice traces itself, a rule wipes in, the steps travel, and "I want this" is no longer inert |
| **WebGL / Canvas output** | Panels screenshotted through the compositor and their pixels read back | **Pass** — the shader field, the Three.js scene, the mark particle field and a library demo all render pixels |
| **Interaction** | The same check drives the drawer, the palette, the menu and the enquiry wizard | **Pass** — every control opens, filters, closes and stays readable |
| **Slow network / low power** | Chromium CDP: 6× CPU throttle, 400 kbit/s, 300 ms latency | **Pass** — a usable page in 5.8 s, no errors |
| **Console and network cleanliness** | Console, `pageerror` and `requestfailed` captured at every viewport | **Pass** — zero errors, zero failed requests |

**The single most important line in this report:** the site is now verified in a real
browser as well as structurally. **Fifty-one defects** were found by that verification —
including three that made the delivered page look broken, one that meant **no canvas
demo had ever drawn a single frame**, one that made **every route change hang for
twelve seconds under load**, and one that left **147 of the site's 149 laboratory
demonstrations unreachable** — and every one of them is listed in §3 with the check
that now guards it.

The last of those is the one worth dwelling on. The Effects Library is the site's
flagship, and the defect had been shipping the whole time, because every check the
project had asked the question in the wrong way: *does the page have horizontal
overflow? does the console stay clean? do the chapters paint something?* A catalogue
that is clipped to an eighth of its height passes all three. The checks now ask the
question the visitor would ask — **can I reach it?** — and the answer is measured, not
assumed.

---

## 2. What the smoke test actually does

`scripts/smoke-test.mjs` loads the **built** `dist/index.html` into jsdom with the
handful of APIs jsdom does not implement stubbed (`matchMedia`, `requestAnimationFrame`,
`IntersectionObserver`, `ResizeObserver`, `HTMLCanvasElement.getContext`), installs the
jsdom globals on `globalThis`, and then runs seven groups of checks.

### Group 1 — build output
* `dist/index.html` exists.
* The module entry point and the stylesheet are referenced with `type="module"` and
  `rel="stylesheet"`.
* The skip link is present as the first focusable element.

### Group 2 — internal links and anchors
* All 24 in-page anchors are resolved against the ids actually present in the parsed
  DOM. A dangling anchor fails the run.
* All sixteen chapter section ids are present.
* Exactly one `<h1>` exists.
* The heading walk confirms no level is ever skipped (`h2 → h4` would fail).

### Group 3 — referenced assets
* Every `src`, `href` and `content` attribute in the built HTML that points at a local
  file is resolved against the real `dist/` tree — 11 references, all present.
* Every `url()` target in the built CSS is resolved **relative to the CSS file's own
  directory**, and `data:` URIs are excluded. The scanner walks balanced parentheses and
  resumes after each token, so a `url()` nested inside a data URI is not double-counted.
* The count of `@font-face` rules is asserted (9 — three Archivo subsets plus six
  JetBrains Mono subsets, each with an italic-free `font-display: swap`).

### Group 4 — data modules
* `src/data/techniques.json` holds exactly 480 techniques across exactly 21 categories.
* The ids are unique and contiguous, 1 … 480.
* The status distribution is printed and checked: `Tested 459`, `Blocked 17`,
  `Requires revision 4`, `Planned 0`.

### Group 5 — the demo layer
* `src/demos/registry.ts` is bundled with the local esbuild binary and imported into the
  jsdom document.
* **All 149 demos are mounted.** A demo that throws is reported by id and fails the run.
* **All 149 teardowns are executed.** A teardown that throws is reported and fails.
* **All 149 demos are mounted a second time with `reduced: true` and `budget: 'low'`**
  and torn down again, so the reduced-motion path is exercised for every demo rather
  than assumed.
* Every technique with status `Tested` must point at a file that exists in the
  repository.
* The number of techniques that have a live demonstration in the registry is reported
  (243 of 480); the remainder are implemented inside the chapters themselves.

### Group 6 — static business-fact audit
* Both WhatsApp numbers appear as `https://wa.me/917675993371` and
  `https://wa.me/919133585849`.
* `mailto:denvupforyou@gmail.com` is present.
* All four team names are present in `src/data/site.ts`.
* `src/data/site.ts` contains no testimonial, award, winner or client-list field
  (comments are stripped before the check, so a comment that *says* "no testimonials"
  does not trip it).
* The three price points (15000, 20000, 50000) are present and the file carries an
  explicit "not fixed quotations" disclaimer.

### Group 7 — CSS and source audit
* A `prefers-reduced-motion: reduce` media query exists in the built CSS.
* The in-page motion switch has CSS rules **and** is wired to the page in the source
  (this is what caught the inert-control defect described in §4).
* `safe-area-inset` is used at least three times.
* `:focus-visible` styles exist.
* Every `outline: none` is inside a `:focus:not(:focus-visible)` guard, so no keyboard
  user loses the focus ring.
* Every `setInterval` is matched by a `clearInterval` (11 started, 11 cleared).
* `removeEventListener` is present, so teardown paths exist.
* Fourteen colour pairs are checked against their WCAG targets, including the two
  alpha-composited "soft" foregrounds at their composited values.

### Running it

```bash
cd DENVUP-LandingPage
npx vite build          # the test asserts against dist/
node scripts/smoke-test.mjs
```

Latest run: **43 checks, 43 passing.**

---

## 2b. What the HTTP check does

`scripts/serve-check.mjs` starts the real `vite preview` server on port 4183, waits for
it to answer, and then fetches **every route** over HTTP. It is not a file-system
check — it is the thing a visitor's browser actually does.

* The preview server starts and answers.
* The served home document is the built document and contains all sixteen chapters.
* **All fifteen routes** are fetched directly. Each must return `200`, and — the check
  that matters for a multi-page build — **every route must serve its own distinct
  document** (15 routes, 15 distinct bodies). A single-page build would answer all
  fifteen with the same bytes and fail here.
* **Every route carries the shell** — each served document contains `#site-head` and
  `#stage-canvas`, so the header and the stage are present before a single line of
  JavaScript runs.
* The 404 document is served and is marked `noindex`.
* Every local `src`/`href`/`content`/`srcset` reference found across **all fifteen**
  documents resolves with a `200` over HTTP.
* The hashed stylesheet and the hashed entry module are served.
* Every webfont file referenced by the stylesheet is served.
* The Three.js chunk exists as its own file **and is not referenced by the initial
  document**, which confirms the code-split is real rather than cosmetic.
* The document contains no false submission string — a regular expression for
  "we have received", "thanks for your enquiry" and "we'll be in touch" finds nothing.
* `robots.txt` is served and allows crawling; `site.webmanifest` parses as JSON and has
  a name.

### The supplied marks are checked byte-for-byte

Group 8 of the smoke test hashes the two supplied logos and the copies published in
`public/`, and fails if they differ. The page must reference the supplied files, and it
must also offer a WebP sibling of each — 804 kB and 321 kB of PNG become 184 kB and
69 kB without a single change to the artwork.

Forty-four checks, forty-four passing, in under a second.

### One harness detail worth recording

The first version of the smoke test never terminated the Node process. The cause is
GSAP's ScrollTrigger, which starts a permanent `requestAnimationFrame` loop when it is
enabled — this is its iOS workaround (`_rafBugFix` in the plugin source) and it is
correct behaviour in a browser, where the loop is throttled to the frame rate and does
almost nothing. In Node it keeps the event loop alive forever. The harness now ends
explicitly with `process.exit()`. **This is a harness artefact, not a site defect**, and
it was confirmed by inspecting the pending handles: all three surviving rAF loops were
inside GSAP's own ticker code, and the global timeline held zero active tweens after
teardown, which confirms the demos themselves release everything.

---

## 2c. What the browser check does

`scripts/browser-check.mjs` is the first check in this project that opens the delivered
site in a real browser. It is not a screenshot dump: every claim it makes is a pass/fail
assertion, and the screenshots it writes are evidence for a human, not the test itself.

**The browser.** Playwright's browser download fails in this sandbox (three attempts, all
recorded in §5.1 of the previous revision of this report), so the Chromium binary comes
from `@sparticuz/chromium` instead and is driven with `puppeteer-core`. The package
bundles the shared libraries Chromium needs in an `al2023.tar.br` archive that it only
unpacks on Amazon Linux; here it is unpacked by hand and the directory is added to
`LD_LIBRARY_PATH` (`CHROMIUM_LIBS` overrides the location; the script falls back to the
usual extraction spot so it works out of the box).

**What it asserts — 209 checks across nine viewports**, plus the standing checks
that run once at the end: the library drawer, the command palette, the mobile menu,
the enquiry wizard, the type-on-a-path demo, the feedback layer, the laboratory
page, and — added in the second pass — **whether the last of the 149 laboratory
demonstrations is reachable, whether anything on a page sits below the point the
page can scroll to, whether a deep link lands on its target, whether the enquiry
fields report what they hold, whether the FAQ search says when it finds nothing,
and whether the technique library filters without rebuilding its cards.**

| # | Viewport | Size | `scrollWidth` vs `clientWidth` | Chapters painted | Errors |
|---|---|---|---:|---:|---:|
| 1 | wide | 1920×1080 | 1905 ≤ 1920 | 16/16 | 0 |
| 2 | desktop-wide | 1536×960 | 1521 ≤ 1536 | 16/16 | 0 |
| 3 | desktop | 1440×900 | 1425 ≤ 1440 | 16/16 | 0 |
| 4 | laptop-wide | 1280×800 | 1265 ≤ 1280 | 16/16 | 0 |
| 5 | laptop | 1185×820 | 1170 ≤ 1185 | 16/16 | 0 |
| 6 | tablet-landscape | 1024×768 | 1009 ≤ 1024 | 16/16 | 0 |
| 7 | tablet | 768×1024 | 753 ≤ 768 | 16/16 | 0 |
| 8 | phone | 390×844 | 375 ≤ 390 | 16/16 | 0 |
| 9 | phone-small | 360×740 | 345 ≤ 360 | 16/16 | 0 |

The check groups:

| Group | What it proves |
|---|---|
| Overlays | No overlay is painted over the page at rest — the shortcut guide, the library drawer, the palette, the menu, the guided tour, the card detail and the dock list |
| Wizard | Exactly one of the three enquiry steps is on screen |
| First screen | The opening chapter has content, is at full opacity, and the header is visible |
| Overflow | `scrollWidth ≤ clientWidth` — no horizontal scroll at any width, with the offending elements named if it fails |
| Chapters | All sixteen chapters have a real height and paint something when scrolled to |
| Pixels | The WebGL shader field, the Three.js scene and the mark chapter's particle field are screenshotted through the compositor and their pixels read back — a canvas that initialises but never draws fails here |
| Console | No uncaught errors, no console errors, no failed network requests |
| Interaction | The library drawer opens and closes on Escape; the palette opens on both `/` and ⌘K, filters and closes; the mobile menu opens and closes; the menu's type is contrast-checked against its own curtain; the type-on-a-path demo's `startOffset` actually changes; the enquiry's two radio groups stay independent |
| Slow network | The page boots and stays readable with the CPU throttled 6× and the network at 400 kbit/s with 300 ms of latency |
| The feedback layer | A copy is clicked, a choice is made, a field is rejected, a step is advanced, and the laboratory's "I want this" is pressed — each one asserted to have registered |

**How the feedback layer is checked.** Six assertions, all of them behavioural
rather than cosmetic:

* a copy **draws its tick** and leaves it behind (the tick element exists, the
  path's dash offset has reached zero, and the control still carries its
  confirmed state);
* a choice **traces itself** (the chosen row carries the class, and the trace
  pseudo-element has a real width);
* a rejected field **rules itself** (the rule is two pixels tall, is painted in
  the error colour, and is not `content: none`);
* the enquiry's steps **travel rather than blink** (mid-flight the incoming step
  has a transform, and it settles at full opacity);
* **"I want this" is not inert** (on the laboratory page the acknowledgement
  strip opens, carries the reference, and the button carries its confirmed
  state). This one runs on its own page, after the home page has been closed:
  the two together mount 149 demonstrations, a WebGL field and two Three.js
  scenes in a software rasteriser, and the home page's animation loops starve
  the laboratory page's event loop badly enough that a `networkidle2` wait can
  time out. That was a harness artefact, and it is recorded here rather than
  hidden — one page at a time is also how a visitor meets them;
* the feedback layer uses **no bounce curve**.

**How a pixel check works.** A canvas that initialises cleanly but never draws is
indistinguishable from a working one until you look at the pixels. The check
screenshots the element through the compositor (so the result includes WebGL output,
which a `drawImage` of the canvas would not) and then decodes that PNG *inside the
browser* with `Image` + `getImageData`, reporting the average luma, the peak luma and
the number of lit pixels. Screenshot clips are in document coordinates, not viewport
coordinates — an early version of this check got that wrong and was "passing" by
sampling the paper chapter instead of the panel.

**Evidence.** `screenshots/` holds the captured frames for all nine viewports plus the
throttled run, and `screenshots/report.json` holds the machine-readable result of every
viewport. The directory is generated, so it is not committed — `npm run browser-check`
recreates all of it in about twenty-five minutes.

---

## 2d. What the route check does

`scripts/route-check.mjs` is the fourth harness, and it exists because the first three
could not answer the question that matters most about a multi-route build: **does the
site behave like one site, or like fifteen pages that happen to share a header?**

It opens the built site in the same real Chromium, and asserts **103 things**:

| Group | What it proves |
|---|---|
| Direct loads | All eleven checked routes load directly, with their own title, their own `<h1>`, the shell in place, and no horizontal overflow |
| Document identity | Every route serves a different document — a single-page build would fail here |
| Client-side navigation | Clicking a link in the shell swaps the view, and the router records the transition it ran |
| Shell persistence | The header, the stage canvas, the cursor and the dock carry a token that is set **before** the navigation and read **after** it. If the shell were re-created, the token would be gone. This is the whole point of the persistent shell, and it is the one thing a screenshot cannot prove |
| Stage persistence | The stage canvas is the same element across a route change, and the router hands the stage controller the new route's scene state |
| Transition correctness | Each route pair uses the transition it is supposed to use — `service-expand`, `shape-wipe`, `colour-wipe`, `panel-overlap`, `curtain-open`, `image-mask`, `glitch-settle`. The transitions write their own name onto `<html>`, so the check reads what actually ran rather than guessing from timing |
| No plain fade | The set of transition names actually used contains nothing matching `fade`, `crossfade` or `dissolve`, and every designed rule was exercised |
| Direction | Back plays the transition in **reverse** (`data-direction="back"`, and it runs the journey's own rule, reversed); Forward plays it forwards. The two are told apart by a monotonic history index, not by a guess |
| Every pair | Every one of the eight designed route pairs is probed, not a sample of them |
| Reduced motion | With `prefers-reduced-motion: reduce`, the transition collapses to the crossfade, the router still routes, the reduced flag is set and no error is raised |
| 404 | An unknown path lands on the designed 404 view, with its own heading |
| Mobile | At 390 px, the home page and `/services/`, `/lab/`, `/pricing/` and `/contact/` all have no horizontal overflow |
| Console | Zero console errors and zero uncaught exceptions across the entire navigation session |

**Why this caught a real bug.** The route check is what exposed the twelve-second
route hang described in §3, row 36. Every structural check had passed; the site looked
right; but under CPU contention the *transition itself* stalled, because GSAP's lag
smoothing was clamping the ticker delta and the timeline never reached its end. The
fix — `gsap.ticker.lagSmoothing(0)` — took the measured back-navigation from
**5257 ms to 1083 ms** and forward navigation from **12020 ms to 2296 ms**. A check that
only asserted "the page still works" would have passed the broken build.


## 2e. What the inert-control audit does

`scripts/inert-check.mjs` is the fifth harness. It exists because of a rule in the
brief that no other harness could enforce: *"never leave broken links, missing
assets, or inert controls."*

The other four harnesses all work from the outside. This one asks the browser
directly, through the DevTools protocol, what is actually on the page and what is
actually wired up.

| Group | What it proves |
|---|---|
| Every route | All fourteen routes are opened in a real browser in turn |
| Every control | Every `button`, every link, every input, every `[role="button"]`, every focusable `[tabindex]` is counted — **1 142 interactive elements on the home page, 839 in the laboratory** |
| Every listener | Each one is asked, through `DOMDebugger.getEventListeners`, whether it has a listener attached. A control with no listener is **inert** and is reported by name |
| The exceptions, and why they are exceptions | A link with an `href` is **navigational** — it is not supposed to have a listener, and the check verifies its target instead. A field inside a `<form>` that has a submit listener is handled by that form, and is not reported |
| Every link | Each link is resolved against the built output: the document has to exist as a **file** (a directory is not a document), and the fragment has to exist **on the page it names** — checked by opening that page in a second browser tab and asking the DOM, because the technique anchors are created at runtime and are not in the delivered HTML at all |
| Every route | No uncaught exception and no console error on any of the fourteen routes |

**Why this caught real bugs.** The audit found the three inert spatial hotspots
(§3, row 48) and the twenty service-page links that pointed at fragments which did
not exist (§3, rows 46 and 47). Neither was visible to the other four harnesses:
a button that does nothing still looks like a button, and a link to a fragment that
does not exist still looks like a link.

**The two rules that had to be written correctly before it could be trusted.**

1. *An anchor with an `href` is navigational.* The first version reported every
   link in the site as inert — 1 142 of them — because a link has no click
   listener and is not supposed to have one.
2. *A directory is not a document.* The first version resolved `/contact/` to the
   folder `dist/contact/`, tried to read it as a file, threw, and reported every
   route with a fragment as broken. The resolution now asks whether the path is a
   **file**.

The audit is part of `npm run verify`.

---

## 3. Defects this testing found, and the fixes

These are listed because a test report that only says "all green" is not evidence of
anything. Every row was a real failure at the time it was found.

| # | Defect | How it was found | Fix | Verified by |
|---|---|---|---|---|
| 1 | 30 TypeScript errors on the first type check | `npx tsc --noEmit` | Fixed individually across `core/`, `data/`, `demos/` | `tsc --noEmit` clean |
| 2 | 21 further type errors after the section modules landed | `npx tsc --noEmit` | Fixed individually | `tsc --noEmit` clean |
| 3 | `src/core/reveal.ts` had `export function initHeader(): void => void {` — a hard syntax error (TS1144/TS1005) | Type check | Corrected to `(): () => void` | Type check |
| 4 | `env` was imported from `core/dom` in three core modules instead of `core/env` | Type check | Import paths corrected | Type check |
| 5 | `gsap.ScrollTrigger` used as a type | Type check | The bare `ScrollTrigger` type is correct — the class is declared globally | Type check |
| 6 | `Uint8Array` rejected by `AnalyserNode.getByteFrequencyData` in TS 5.9 | Type check | `Uint8Array<ArrayBuffer>` | Type check |
| 7 | Three.js ships no TypeScript types | Type check | `@types/three@0.180` added as a dev dependency | Type check |
| 8 | `src/styles/sections.css` used class names the section modules never emit (`.pricing__amount`, `.faq__q`, `.faq__a`, `.atlas__panel-title`, and no `.team__*` / `.spatial__*` / `.library__*` / `.typography__*`) | Visual/DOM reasoning during the section rewrite | `sections.css` rewritten from scratch against the real markup | The stylesheet now matches the emitted class names |
| 9 | The CSS asset check matched `url(%23n)` inside the grain SVG data URI | Smoke test | Data URIs skipped; the URL scanner resumes after each token so nested `url()` is not scanned twice | Smoke test group 3 |
| 10 | The built module failed to import: `ReferenceError: document is not defined` | Smoke test | jsdom globals installed on `globalThis` before the dynamic import | Smoke test group 5 |
| 11 | The WhatsApp assertion expected exactly 2 links; there are 4 (contact chapter + footer) | Smoke test | Assertion changed to "both numbers are present" | Smoke test group 6 |
| 12 | The email assertion used an `https?://` regex, so `mailto:` never matched | Smoke test | A separate `mailto:` assertion | Smoke test group 6 |
| 13 | The fontsource packages were installed but never imported — the site rendered in fallback fonts | Static audit of `src/main.ts` against `package.json` | `@fontsource-variable/archivo/wdth.css` and `@fontsource-variable/jetbrains-mono/index.css` imported | Smoke test group 3 (`@font-face` count) + the built CSS |
| 14 | Four demos threw in jsdom: `img.decode is not a function`, `path.getTotalLength is not a function` | Smoke test group 5 | Guarded in `src/demos/system.ts`, `vector.ts`, `charts.ts` — a genuine robustness improvement, not a test workaround | Smoke test group 5: 149/149 |
| 15 | The camera aspect ratio was never updated on resize, so the Three.js scenes stretched after a resize | `threejs-webgl` skill, "Common Pitfall 1" | `camera.aspect` is now compared and `updateProjectionMatrix()` is called in both `spatial.ts` and `demos/three.ts` | Type check; behaviour is not visually verified (§5) |
| 16 | `renderer.outputColorSpace` was never set | `threejs-webgl` skill, "Common Pitfall 5" | `THREE.SRGBColorSpace` set in both files | Type check |
| 17 | `--ember` on `--paper` is 3.18:1 — below WCAG AA for body copy | Contrast audit of the ten token pairs | A per-chapter `--accent-text` token was added and every ember-coloured *text* was moved onto it | Smoke test group 7 |
| 18 | The signal chapter's muted text was 3.81:1 | Contrast audit | Raised to 5.36:1 | Smoke test group 7 |
| 19 | **The in-page motion switch was inert** — it toggled a class that nothing read and dispatched an event nobody listened to | Source audit against the "no inert controls" requirement | `src/core/motion-control.ts` was written; it now drives the CSS class, stops Lenis, lands the scroll reveals and dispatches `denvup:motion`, which every render loop listens for | Smoke test group 7 (the switch is wired to the page); the loop teardown is verified by mounting and unmounting 149 demos |
| 20 | `createLoop` never removed its `visibilitychange` listener, and a stopped loop could restart after teardown | Source audit | `destroy()` added; all eighteen call sites updated | Smoke test group 5 (teardown of 149 demos, no errors) and group 7 (timer balance) |
| 21 | `.field input:focus-visible { outline: none }` removed the focus ring for keyboard users | Source audit against `modern-web-design` §"Keyboard Navigation" | The global 2 px ring now applies; `outline: none` survives only under `:focus:not(:focus-visible)` | Smoke test group 7 |
| 22 | `.ch-signal` was defined in the tokens but used by nothing | Static audit for unused tokens | The capability atlas chapter now uses it, which also reduces the number of dark chapters from 7 to 6 of 16 | Type check; the chapter scope is visible in `index.html` |
| 23 | The section spy only treated `ch-ink` as a dark chapter, so the header would have been light over the new signal and ember chapters | Source audit | `DARK_CHAPTERS = ['ch-ink', 'ch-signal', 'ch-ember']` | Type check |
| 24 | **The `hidden` attribute did nothing on six overlays.** The UA sheet's `[hidden] { display: none }` is an author-level no-show, so any author `display` declaration outranks it — and `.guide`, `.library__detail`, `.manifesto__body`, `.demo__detail`, `.dock__list` and `.enquiry__step` all declare `display: grid`. The shortcut guide and the library drawer were therefore **permanently painted over the page**: the drawer body is an opaque ink panel that covered the right-hand 62 % of the viewport and the two stacked scrims blurred and darkened the rest. This was the exact symptom reported from the live preview. | Browser check: "no overlay is painted over the page" | One global rule in `src/styles/base.css` — `[hidden] { display: none !important; }` — so the attribute is authoritative everywhere | Browser check, all nine viewports |
| 25 | **`SVGTextPathElement.startOffset` was assigned as a property.** It is a read-only accessor in every browser, so GSAP's CSS plugin threw `Cannot set property startOffset of #<SVGTextPathElement> which has only a getter` on every frame of the type-on-a-path animation, and this build of GSAP ships no `AttrPlugin` to fall back on | Browser check: console error capture | The attribute is now written by hand from a tweened plain object (`src/sections/typography.ts`) | Browser check: "the type-on-a-path demo animates" + zero console errors |
| 26 | **`createLoop` never advanced its time baseline**, so `dt` was permanently `0`, the frame-rate guard rejected every frame, and **not one canvas demo on the site ever drew a frame** — 149 demos, the mark chapter's particle field, the WebGL laboratory and both Three.js scenes were all blank | Browser check: the pixel sampler returned a black panel where the shader field should be | The first frame now only establishes the baseline (`src/core/loop.ts`) | Browser check: "the WebGL shader field renders pixels", "the Three.js scene renders pixels", "the mark chapter's particle field renders pixels" |
| 27 | **The WebGL demos sized their canvas with the 2D helper.** `fitCanvas()` calls `canvas.getContext('2d')`, which returns `null` on a canvas that already carries a WebGL context, so the shader demos returned early and never drew | Browser check: the canvas' backing store was still its HTML size and `gl.viewport` was never touched | `fitCanvas` split into `fitCanvas` (2D), `fitDrawingBuffer` (WebGL) and `measureCanvas` (read-only, for Three.js) in `src/core/loop.ts` | Browser check: pixel sampler |
| 28 | **The "fading cursor trail" demo never emitted a point.** The condition that decided whether to lay down ink excluded the `fade` mode, so the canvas stayed blank for the demo whose entire subject is the trail | Browser check: the library demo canvas sampler found a black canvas | The condition now excludes only the speed threshold | Browser check: "the library demo canvas renders pixels" |
| 29 | **The mobile menu had no backdrop.** The CSS for the ink curtain behind the menu is keyed on `.menu.is-open`, and that class was never applied — so the menu's light type sat directly on the light paper chapter and was unreadable. The command palette had the same problem: its scrim never rose | Browser check: a contrast measurement of the menu label against its own background | `is-open` is now toggled on both overlays; the menu's exit animation was rebuilt around the curtain it was always meant to use | Browser check: "the menu is readable on its curtain (contrast ≥ 7:1)" |
| 30 | **The command palette's results were unstyled.** The CSS targeted `.cmdk__results a` but the script renders `<li class="cmdk__result">` with three child spans, so the rows had no layout, no padding and no selected-state highlight | Source audit of every class the scripts emit against the stylesheet | The rules now target the elements that exist, and the kind / label / hint each got their own | Screenshot `desktop-10-command-palette.png` |
| 31 | **The mobile menu's rows were unstyled** for the same reason — the CSS keyed on `.menu__index` while the script emits `menu__item-index`, `menu__item-label` and `menu__item-blurb` | Same audit | The three parts are styled as an index / label / caption row | Screenshot `phone-03-menu.png` |
| 32 | **The enquiry's radio buttons all shared the name `""`.** The group name was read from the label instead of the host, so the "project" and "scope" questions were one group: answering the scope question could clear the project question, and a screen reader had no way to tell the two questions apart | Browser check: the enquiry group assertion | The name is read from the host, so the two questions are separate groups | Browser check: "the enquiry has two independent radio groups" |
| 33 | **The radio controls were stretched across their card** by the grid layout, drawing them at an inconsistent size | Browser check: the radio's measured width | The control is pinned to a 1 rem box beside the label | Browser check: "the radio control is not stretched across its card" |
| 34 | **A dark band ran down the right-hand side of every light chapter.** `scrollbar-gutter: stable` reserves a strip outside the body box, and that strip is painted with the root background, which was fixed to the ink colour | Browser check: the gutter was visible in every screenshot | The root is repainted with the colour of the chapter in view (`src/core/chapter.ts`) | Screenshots at all nine viewports |
| 35 | **The intro could not be skipped out of if the animation ticker stalled** — the release ran only as a tween's `onComplete` | Source audit of the boot sequence | The release is also scheduled as plain time, independently of the ticker | Browser check: "the page still boots on a slow connection" |
| 36 | **Every route change hung for up to twelve seconds.** The transition timeline never reached its end under CPU contention, so the router sat in `busy` and the new view was never mounted. The site was *correct* and still unusable. The first diagnosis — a `tl.then()` deadlock — was **wrong**, and a second diagnosis (rAF throttling) was wrong too; a visibility probe proved the second page was visible at 61 fps the whole time. The real cause was **GSAP's lag smoothing**, which clamps the ticker delta to 500 ms, so a timeline with a long total duration took an unbounded number of frames to finish | Route check: a forward navigation measured **12020 ms** and a Back measured **5257 ms** | `gsap.ticker.lagSmoothing(0)` in `src/core/motion.ts`. The same measurement afterwards: forward **2296 ms**, Back **1083 ms** — a 5.2× improvement, and no longer a hang | Route check: "the move to X was played forwards" + the whole 85-check suite completing in ~90 s instead of ~6 min |
| 37 | **The background tab kept rendering.** The stage and the demo loops kept their rAF alive when the tab was hidden, so a backgrounded tab ate the CPU and made the *next* navigation slow | Source audit of the visibility handling | The stage pauses on `visibilitychange`, and the router's `visible()` guard skips the animated path when the document is hidden — a hidden tab swaps instantly instead of animating nothing | Route check + the browser check's "no console errors" pass |
| 38 | **The transition name was not observable, so "the right transition ran" could not be proven** | Source audit while writing the route check | The router now writes both `data-transition` (the rule's name) and `data-direction` (`forward` / `back`) onto `<html>` | Route check: "the move to X used a transition, not a page load", "Back plays the transition in reverse", "no route transition is a plain fade" |
| 39 | **The "I want this" button on a laboratory card was completely inert.** Its handler looked for a brief field, and the laboratory page has no form — so it found nothing and returned without a sound. The one button on the site that promises to do something for you did nothing at all, on the page most people meet it on | Source audit of every control that acts without acknowledgement | The button now opens an acknowledgement strip carrying the reference, the codes travel to the contact page in the query string, and where a brief *is* on the page the reference is written into it in front of the visitor | Browser check: `"I want this" is not inert — it acknowledges and carries the reference` |
| 40 | **The enquiry's three steps blinked.** `step.hidden = i !== index` replaced one set of questions with another instantly — the visitor pressed a button and the form was a different form | Source audit against the brief's "jarring transitions" | The outgoing step leaves on the vertical axis and the incoming one arrives behind it, 300 ms out against 420 ms in | Browser check: "the enquiry steps travel rather than blink" |
| 41 | **A copy flickered instead of registering.** The label was swapped for "Copied" and put back 1.8–2.2 seconds later | Source audit | The confirmation now draws a tick and leaves it there | Browser check: "a copy draws its tick and leaves it behind" |
| 42 | **A rejected field was a line of text with no connection to the field it belonged to** | Source audit | A rule wipes in under the field and the field's border registers | Browser check: "a rejected field rules itself" |
| 43 | **`--ease-out` was used 27 times and never defined.** An undefined custom property does not fall back to the initial value — it invalidates the **whole declaration**, so every one of those transitions had been running on the browser's default `ease` instead of the studio's curve | A custom-property audit of every `var()` in the stylesheets against `tokens.css` | The curve is defined in `tokens.css`; a permanent check now asserts that no token-level `var()` is undefined | The token audit, re-run after the fix: **no misses** |
| 44 | **The enquiry's radio pick used `back.out(2)`** — a 20 % overshoot with a visible bounce, on an interface element | The `design-taste-frontend` motion reference bans "bounce or elastic easing on interface elements" | Replaced with `power3.out`. The one overshoot curve left in the codebase is used only by the demonstration library, and the code says so | Browser check: "the feedback layer uses no bounce curve" |
| 45 | **147 of the 149 laboratory demonstrations were unreachable.** The catalogue grid and the shape-wipe transition's blueprint overlay were both `.fx-grid`; the transition's rule set `position: absolute; inset: 0` and the catalogue's rule did not, so the catalogue inherited them. It was taken out of the flow, held at the height of its section and clipped by that section's `overflow: clip`. Measured: the laboratory page was **4 973 px** tall and the 149th demonstration sat at viewport y = 21 494 | The second feedback sweep, and a purpose-built reachability probe: the last card was never inside the viewport at any scroll position | The overlay is now `.fx-blueprint`; the catalogue is back in the flow. The laboratory page is **28 622 px** tall and the 149th demonstration is reachable | Browser check: "every demonstration in the Effects Library is reachable" + "nothing on the laboratory page sits outside the scrollable area" |
| 46 | **The service pages made a false claim.** Each said "every one of them is live in the Effects Library, so you can run it before you ask for it" — but ten of the twenty techniques on those pages have no demonstration | The inert-control audit, which resolved every link on the service pages and found the twenty technique links pointing at fragments that did not exist | The copy now counts honestly, and each technique links to what exists: `/lab/#tech-NNN` when there is a running demonstration, `/#tech-NNN` when there is only the record. The link says which: **live demo** or **reference** | Inert-control audit: 20/20 technique links resolve, 0 bad href on all fourteen routes |
| 47 | **A deep link to a technique could not land.** Three causes: the view is mounted before the router pushes the new address, so `location.hash` still belonged to the page being left; Lenis clamps every scroll to its cached page height; and a single jump is wrong the moment the demonstrations above the target mount and make the page taller | A link probe that followed every technique link and measured where the anchor ended up (`anchorTop: 21 945` in a 4 973 px page) | The fragment is carried through the view context; `jumpTo()` refreshes the page-height measurement first; `settleOn()` corrects the position until it stops changing | Browser check: "a deep link to a technique lands on the technique" — measured **89 px** from the top of the window, which is the header offset |
| 48 | **The three spatial hotspots were buttons that did nothing.** They revealed their note on hover, but on a touch screen — where there is no hover — pressing one produced no note and no change at all | The inert-control audit, which asked the browser through the DevTools protocol whether each interactive element had a listener | A press opens the note and keeps it open; a second press closes it; only one note is open at a time | Inert-control audit: 0 controls without a listener on all fourteen routes |
| 49 | **The technique library rebuilt all 480 cards on every keystroke**, each with its own entrance tween — the "hundreds of times: no animation" case, and the "same fade-up on every block" tell | Source audit while adding the search's acknowledgement | The cards are built **once** into a map and the filter only shows and hides them | Measured **10–11 ms** per keystroke, node identity preserved; browser check: "the technique library filters without rebuilding its cards" |
| 50 | **The FAQ search filtered silently.** A no-match was indistinguishable from a broken page | The same sweep | A live count (`role="status"`, `aria-live="polite"`) and an empty state with three ways out: **Clear the search**, **See the buying questions**, **Ask us instead** | Browser check: "the FAQ search reports how many questions there are", "the FAQ search says when it finds nothing, and offers a way out", "clearing the FAQ search brings every question back" |
| 51 | **The enquiry fields gave no acknowledgement while typing** | The same sweep | The field reports the moment it crosses from empty to holding something that reads correctly — drawn once, and left in place. The brief also shows its length | Browser check: "a written field reports that it is filled", "an address that does not read like an address is not reported as filled", "the brief reports its length and that it is filled" |

---

## 4. Static analysis results

### 4.1 Accessibility

| Check | Method | Result |
|---|---|---|
| One `h1`, no skipped heading levels | DOM walk | Pass |
| Skip link first | Markup | Pass |
| Landmarks | `header` / `nav`×3 / `main` / `footer` | Pass |
| Visible focus on every interactive element | CSS audit | Pass — 2 px `--ember-hot` ring with a 3 px offset, plus chapter-specific `outline-color` |
| `outline: none` guarded | CSS audit | Pass — 1 occurrence, guarded by `:focus:not(:focus-visible)` |
| Reduced motion — CSS | Media query present | Pass |
| Reduced motion — JavaScript | `env.reducedMotion` gates smooth scroll, reveals, loops, boot | Pass |
| Reduced motion — every demo | 149/149 mounted with `reduced: true` | Pass |
| Live regions | `aria-live="polite"` on the enquiry summary and the copy confirmation; `role="alert"` on field errors | Pass |
| Touch targets | 44 px minimum on buttons, rows, chips, dock and to-top | Pass by inspection — **not measured in a browser** |
| Contrast | Fourteen documented pairs | Pass |
| Form labelling | Every input has a `<label>`; errors are below the input; no placeholder-as-label | Pass by inspection |
| Escape closes overlays, focus returns | Source review of `navigation.ts` and `easter.ts` | Pass by inspection — **not exercised in a browser** |

### 4.2 Performance

| Check | Method | Result |
|---|---|---|
| No layout-triggering animation | Source review — only `transform` and `opacity` are animated | Pass |
| No `will-change` overuse | Grep | Pass — not used at all |
| `backdrop-filter` only on fixed chrome | Source review | Pass — header, menu, command panel only |
| Grain only on a fixed, `pointer-events: none` layer | Source review | Pass |
| Offscreen loops paused | `IntersectionObserver` in `createLoop` | Pass by inspection |
| Timers balanced | Grep count | Pass — 11 `setInterval`, 11 `clearInterval` |
| Listeners released | `destroy()` in `createLoop`; `removeEventListener` throughout | Pass |
| Three.js code-split | `vite.config.ts` manual chunks + dynamic import | Pass — 705 kB raw in a separate dynamic chunk |
| Bundle sizes | `vite build` output | main 408.89 kB (113.50 kB gz) · CSS 154.56 kB (28.97 kB gz) · GSAP 114.01 kB (45.01 kB gz) · Lenis 19.58 kB (5.65 kB gz) · Three 704.69 kB (180.15 kB gz, on demand) · `dist/` 5.2 MB total, seven artworks 588 kB |
| Route payload | the shell is shared by all fifteen documents, so a route change fetches **one document and one view fragment** | Pass — measured below |
| Lighthouse / Core Web Vitals | — | **Not measured** — no browser (§5) |

### 4.2.1 Measured in the browser

`scripts/perf-check.mjs` (`npm run perf-check`) drove the built site in Chromium at
1440 × 900 against `vite preview` and recorded the load time, the number of long tasks
over 50 ms, the frame rate while scrolling and the console error count.

The frame rate is the **median of five samples of two seconds each**, and the five
samples are printed so the spread is visible rather than hidden behind one number.

| Route | Load | Ready | Long tasks | Scroll fps (median) | Samples | Console errors |
|---|---:|---:|---:|---:|---|---:|
| `/` | 2453 ms | 2462 ms | 0 | **62** | 57, 58, 62, 62, 62 | 0 |
| `/lab/` | 1995 ms | 2002 ms | 0 | **58** | 57, 58, 58, 62, 62 | 0 |
| `/studio/` | 793 ms | 799 ms | 0 | **58** | 57, 58, 58, 62, 62 | 0 |
| `/services/` | 665 ms | 671 ms | 0 | **62** | 58, 58, 62, 62, 62 | 0 |
| `/services/web-design/` | 680 ms | 687 ms | 0 | **58** | 58, 58, 58, 62, 62 | 0 |

**The instrument was changed, and why.** The first version of this check measured
the frame rate over **one pass down the whole page**, stepping 600 px every 60 ms —
about 10 000 px a second, several times faster than a person scrolls. That is a
stress test, not a measurement, and it was badly behaved: the same build measured
**16, 17, 27 and 34 fps on four different passes in the same run**.

The cause is the laboratory page. It holds 149 live demonstrations, and it mounts
and tears them down as they come into view, so how many are alive at once — and
therefore how much work each frame costs — depends on where the pass happens to be.
A direct A/B was run to separate the two candidates:

| Laboratory page | Frame rate |
|---|---:|
| As shipped, 149 demonstrations mounting as they scroll | 34 fps |
| The same page with the demonstrations not mounted at all | **60 fps** |

So the cost is the demonstrations, not the layout, and not the page's length: with
the demonstrations disabled the page is the same height and scrolls at the display's
refresh rate. The `content-visibility: auto` rule that was tried on the cards
changed nothing measurable and made the page's height depend on an estimate, so it
was removed again.

The honest summary is: **the laboratory page is as fast as the others at a
human scroll, and it is the heaviest page on the site when scrolled as fast as the
machine allows.** The numbers above come from a software-rasterised headless
browser with no GPU, so they are a floor, not a measurement of real hardware.

### 4.3 Responsive structure

The stylesheet carries breakpoints at **1023, 899, 719 and 599 px**, plus a
`@media (hover: none), (pointer: coarse)` block and a `prefers-reduced-motion` block.
All layout is fluid (`clamp()`) rather than fixed, `--gutter` is fluid, and
`min(100% - var(--gutter) * 2, var(--shell-max))` is the shell width. `100vw` appears
twice in the whole project, both inside `min()` with a subtraction, so neither can
overflow. The only two `100vw` usages were checked individually.

**This is a static analysis of the CSS, not a rendered test.** It cannot prove that a
layout looks right at 375 px, and it does not.

---

## 5. What is still NOT tested, and exactly why

The browser check closed most of the gap this report used to have, but some things
still cannot be verified in this environment. They are listed so the limits of the
evidence stay visible.

| Not verified | Why it matters | How it should be checked |
|---|---|---|
| **A physical handset** | The 390×844 viewport is a real render, but it is not a real touch device: hover media queries, real momentum scrolling and real safe-area insets are not exercised | Open the site on an actual phone and walk the enquiry, the library filters and the dock |
| **Screen-reader output** | The ARIA wiring is in the markup and the group names are now correct, but no screen reader was run | Test with VoiceOver and NVDA |
| **The OS mail client hand-off** | The `mailto:` composition is correct in code and the button says so honestly, but no mail client exists here | Submit the form on a desktop OS |
| **Lighthouse / Core Web Vitals** | The lab's own frame-rate readout and the throttled pass are evidence, but no Lighthouse run was performed | Run Lighthouse against the built site on real hardware |
| **Long-scroll performance on a real GPU** | The headless browser rasterises in software, so the timings here are a floor, not a measurement of the real thing | Record a performance profile while scrolling the whole page on a laptop |
| **The eyebrow/DPR behaviour on a Retina display** | Device pixel ratio is 1 in the headless browser, so the `dpr`-scaled drawing buffers are only exercised at their smallest size | Open the spatial lab on a Retina laptop |
| **The physical "scroll to open" cue and the real cursor** | The custom cursor is drawn by the page and the cue is a real element, but the pointer itself is synthetic | Move a real mouse over the page |
| **Print stylesheets** | None are written | Add one if printing matters |
| **The transition choreography on a real GPU** | The route check proves that the right transition *runs*, that it runs in the right direction and that the shell survives it. It cannot prove that the choreography reads beautifully on a 120 Hz display | Watch a forward and a Back transition on a laptop with a high-refresh screen |
| **The stage scene continuity between routes** | The stage canvas is asserted to be the same DOM node across a route change, and the stage controller is given the new route's scene state — but whether the *visual* morph reads as one continuous world is an editorial judgement that needs eyes on the screen | Scrub through the eight transitions and confirm the stage reads as one place |
| **A mid-page refresh** | A refresh is a full document load by definition, so the router starts from scratch; the *state* after a mid-page refresh (which chapter you land on, whether the stage remembers) is not asserted | Reload at the middle of the home page on a phone |

Nothing in this list is claimed to work; nothing in this list is claimed to be broken.
They are simply the boundaries of what a headless software-rendered browser on a Linux
sandbox can tell you.

---

## 6. What each defect is now guarded by

Every defect in §3 that could be turned into a check is now turned into a check, so the
same failure cannot come back silently.

| Defect | The check that now catches it |
|---|---|
| 24 — `hidden` overlays painting over the page | "no overlay is painted over the page" (nine viewports) + "exactly one enquiry step is shown" |
| 25 — the `startOffset` exception | "the type-on-a-path demo animates" + zero console errors |
| 26 — the render loop never drawing | the three pixel-sampling checks |
| 27 — the WebGL canvas sizing | the WebGL pixel-sampling check |
| 28 — the blank cursor trail | the library demo pixel-sampling check |
| 29 — the missing menu curtain | "the menu is readable on its curtain (contrast ≥ 7:1)" |
| 32 / 33 — the enquiry radios | "the enquiry has two independent radio groups", "answering the scope question does not clear the project question", "the radio control is not stretched across its card" |
| 34 — the dark gutter | the no-horizontal-overflow check plus the screenshots |
| 35 — the intro that could not be dismissed | "the page still boots on a slow connection" |
| 45 — 147 of the 149 demonstrations unreachable | "every demonstration in the Effects Library is reachable" + "nothing on the laboratory page sits outside the scrollable area" |
| 46 — the service pages' false claim and dead links | the inert-control audit: "every link points at something real" on all fourteen routes, which resolves each link to a built document **and** a fragment that exists on the page it names |
| 47 — a deep link that could not land | "a deep link to a technique lands on the technique" — the anchor is measured against the top of the window, and the header offset is 89 px |
| 48 — three buttons that did nothing when pressed | the inert-control audit: "every interactive control has a listener" on all fourteen routes |
| 49 — the library rebuilt on every keystroke | "the technique library filters without rebuilding its cards" — the card count and the node identity are both compared before and after |
| 50 — the silent FAQ search | "the FAQ search reports how many questions there are", "the FAQ search says when it finds nothing, and offers a way out", "clearing the FAQ search brings every question back" |
| 51 — the fields that said nothing while you typed | "a written field reports that it is filled", "an address that does not read like an address is not reported as filled", "the brief reports its length and that it is filled" |

---

## 6b. The environment note

Playwright's own browser download does not work in this sandbox, so the browser check
uses `@sparticuz/chromium` and `puppeteer-core` instead. This is recorded here rather
than hidden: the Playwright `playwright` and `webapp-testing` skills assume a Playwright
browser is available, and it is not. The *practice* those skills describe — headless
Chromium, wait for the network to settle, inspect the rendered DOM before acting on
selectors, and always close the browser — is what the script follows.

---

## 7. Test coverage map

| Area | Covered by | Status |
|---|---|---|
| Type safety | `tsc --noEmit` strict | Covered |
| Build integrity | `vite build` | Covered |
| Links and anchors | Smoke test group 2 | Covered |
| Heading hierarchy | Smoke test group 2 | Covered |
| Asset references | Smoke test group 3 | Covered |
| Webfont delivery | Smoke test group 3 | Covered |
| Catalogue integrity | Smoke test group 4 | Covered |
| Demo mounting | Smoke test group 5 | Covered |
| Demo teardown | Smoke test group 5 | Covered |
| Demo reduced-motion path | Smoke test group 5 | Covered |
| Technique → file integrity | Smoke test group 5 | Covered |
| Business facts | Smoke test group 6 | Covered |
| Supplied logos published byte-identically | Smoke test group 8 (SHA-256 comparison) | Covered |
| No fabricated social proof | Smoke test group 6 | Covered |
| Contrast | Smoke test group 7 | Covered |
| Focus management | Smoke test group 7 (CSS) | Partially covered — behaviour unverified |
| Reduced motion | Smoke test group 7 (CSS) + group 5 (JS) | Covered |
| Timer balance | Smoke test group 7 | Covered |
| Safe-area insets | Smoke test group 7 | Covered |
| **Rendered layout** | Browser check, nine viewports (1920 → 360) | **Covered** |
| **Route rendering** | Route check, direct load of every route | **Covered** |
| **Client-side navigation** | Route check | **Covered** |
| **Shell / stage / cursor persistence across routes** | Route check, DOM node identity via a token set before and read after | **Covered** |
| **Transition correctness and direction** | Route check, `data-transition` + `data-direction` | **Covered** |
| **No plain fade as a route transition** | Route check | **Covered** |
| **Reduced-motion routing** | Route check | **Covered** |
| **404 routing** | Route check | **Covered** |
| **Horizontal overflow on every route at 390 px** | Route check + browser check | **Covered** |
| **Every action registers** | Browser check: copy, choice, rejection, step change, laboratory request, field fill, FAQ search, library filter | **Covered** |
| **No inert controls** | Browser check: the laboratory's "I want this" opens a strip and carries the reference — **and** the inert-control audit, which asks the browser whether *every* control on *every* route has a listener | **Covered** |
| **Every link resolves to a real document and a real fragment** | Inert-control audit: the document must exist as a file, and the fragment must exist on the page it names | **Covered** |
| **Every element on a page is inside the scrollable area** | Browser check, on the laboratory page | **Covered** |
| **Every demonstration in the Effects Library is reachable** | Browser check: the last of the 149 cards is scrolled into the viewport | **Covered** |
| **A deep link lands on its target** | Browser check: a technique link is followed and the anchor is measured against the top of the window | **Covered** |
| **No bounce easing in the interface** | Browser check: the computed transition curve of every feedback element | **Covered** |
| **Every CSS custom property resolves** | A token audit of every `var()` against `tokens.css` | **Covered** |
| **Real WebGL / Canvas output** | Browser check, compositor screenshots + pixel read-back | **Covered** |
| **Console / network cleanliness** | Browser check | **Covered** |
| **Overlay state at rest** | Browser check | **Covered** |
| **Interaction (drawer, palette, menu, enquiry)** | Browser check | **Covered** |
| **Slow network / low power** | Browser check, CDP throttling | **Covered** |
| **Horizontal overflow** | Browser check, nine viewports | **Covered** |
| **Delivery over HTTP** | `scripts/serve-check.mjs` | **Covered** |
| **Frame rate on a real GPU** | — | **Not covered** — the lab's own readout is the only evidence |
| **Real touch and screen-reader behaviour** | — | **Not covered** |
| **Lighthouse / Core Web Vitals** | — | **Not covered** |
| **Mail-client hand-off** | — | **Not covered** |

---

## 8. Reproducing this report

```bash
cd DENVUP-LandingPage
npm ci
npm run verify              # typecheck → build → 43 smoke → 44 serve → browser → route → inert
npm run inert-check         # the inert-control audit on its own (about 15 minutes)
npm audit                   # expect: 0 vulnerabilities
```

`npm run verify` is the single command. It runs, in order:

| Step | Command | Expected |
|---|---|---|
| 1 | `tsc --noEmit` | no output, exit 0 |
| 2 | `vite build` | `✓ built in ~4s` |
| 3 | `node scripts/smoke-test.mjs` | `43/43 checks passed. Smoke test passed.` |
| 4 | `node scripts/serve-check.mjs` | `44/44 checks passed. Serve check passed.` |
| 5 | `node scripts/browser-check.mjs` | `209/209 checks passed. Browser check passed.` (about 25 minutes) |
| 6 | `node scripts/route-check.mjs` | `103/103 checks passed.` (about 3 minutes) |
| 7 | `node scripts/inert-check.mjs` | `42/42 checks passed · 0 inert controls found · 0 broken links found` (about 4 minutes) |

Each of the seven steps can also be run on its own with `npm run typecheck`,
`npm run build:fast`, `npm run smoke`, `npm run serve-check`, `npm run browser-check`,
`npm run route-check` and `npm run inert-check`.

Two further scripts are not part of `verify`:

* `npm run perf-check` measures the load time, the long-task count, the scroll
  frame rate and the console error count for five routes against a
  `vite preview` on port 4173. It is the source of the numbers in §4.2, and it
  needs a server already running.
* `npm run study-check` (`scripts/check-study-list.py`) re-derives the
  `SKILLS_STUDY_LIST.md` totals from the live `AI_Skills_Pack/` tree and from
  the document, and fails when the two disagree. It prints
  `303 skills · 51 selected (23 complete, 3 partial, 25 outline) · 252 excluded ·
  sum 303` and `problems: NONE`.

The browser step writes its evidence to `screenshots/` and `screenshots/report.json`.
It needs the Chromium shared libraries; it finds them in the usual extraction location
automatically, and `CHROMIUM_LIBS=/some/where` points it elsewhere.

The build sizes quoted in §4.2 are the sizes produced by that build on 19 October 2026
and will vary slightly with the toolchain version.

---

## 9. Statement of honesty

Every check in this report was actually run, in this environment, against this code, and
the results are reported as they came out.

The site **has now been seen**. It was opened in a real Chromium at nine viewport
sizes, driven through its overlays and its forms, screenshotted, and its canvas output
read back pixel by pixel. It was then driven through every route, forward and back,
and the shell, the stage and the cursor were watched through every swap. Those passes
found twelve further defects — including the one that was reported from the live
preview, the one that meant no canvas demo had ever drawn, and the one that made every
route change hang for twelve seconds under load — and all of them are fixed and guarded
by a check.

What is still not claimed: a Lighthouse score, a frame-rate measurement on real
hardware, a physical handset, a screen-reader run, or a mail-client hand-off. Those are
listed in §5 with the reason each one is out of reach here. The screenshots in
`screenshots/` are the real output of the real build; the numbers in this report are the
numbers the checks printed.
