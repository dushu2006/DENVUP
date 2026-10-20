# DESIGN_RESEARCH.md

**Project:** DENVUP — studio website
**Research window:** 18 October 2026 (composition pass) and 19 October 2026 (route and
transition pass) — all observations are dated.
**Method:** each URL below was fetched and read as a page, not recalled from memory. Where a
statement could not be confirmed from the fetched markup or copy it is marked **inferred**.
Where a site could not be reached it is listed in §3 with the exact failure.

The purpose of the first pass was not to collect inspiration. It was to find the handful
of structural moves that good studio sites use to make a long page feel authored rather
than stacked, and then to build something with its own logic that borrows none of their
identity, artwork, copy or composition.

**The second pass (19 October 2026, §6)** answers a different question: the site was
restructured from one long page into a multi-route site with a persistent shell, and a
multi-route site has to answer *what comes after what*. Twelve sites were re-read
specifically for their **handoff** — the moment a visitor leaves one route and arrives at
the next — and for how their 404 behaves, because a 404 is the handoff that has no
destination. §7 turns those observations into the route transition table the brief
specifies.

---

## 1. The six moves that actually shaped this build

Across the seventeen reachable sites, six patterns showed up more than once. Each one is
traceable to a specific site, and each one has a specific counterpart in the delivered
DENVUP page.

### 1.1 A chapter, not a stack

`lusion.co` opens with "scroll to explore" and treats the page as a sequence of
**acts** — the work chapter, then a manifesto chapter — with a persistent "Keep Scrolling"
prompt. `signal-a.studio` indexes its work as `A—1 … A—6` and ends with an honest
"Showreel 2026 / Coming Soon" state rather than a placeholder.

**DENVUP counterpart:** sixteen numbered chapters (`01 Prelude` … `16 Closing`), each with
its own substrate, its own typographic gesture and its own set of techniques. The
"coming soon" idea is echoed honestly: the studio has no showreel and no client work, so
the page says so rather than faking it.

### 1.2 Taxonomy as content, with counts

`lusion.co/about` presents "AREA OF EXPERTISE" as a four-axis taxonomy and lists people as
`[[ 001 ]]`, `[[ 002 ]]`. `obys.agency` publishes a dense nineteen-project index with
`Discipline` tags and zero-padded numbering `01…19`. `instrument.com` filters its work
list by tag chips.

**DENVUP counterpart:** chapter 07 is a *capability atlas* — a fifteen-node diagram of what
the studio can do, each node opening a panel that explains the layer, its purpose and its
notes. The technique library (chapter 09) is the second taxonomy: 480 techniques across 21
categories, searchable and filterable, with copyable IDs.

### 1.3 Rows instead of grids of equal cards

`clay.com` states its offer as an equation — "Design + Webflow + Strategy = Full Circle" —
and a four-step `A → B` process. `merci-michel.com` lists projects as long rows with a
category and a date, not as a masonry of pictures. `locomotive.ca/en` repeats a
"Digital-First Design" ticker and stacks its location block.

**DENVUP counterpart:** the service chapter is a set of numbered rows, not a three-card
grid. The process chapter is a five-stage horizontal rail that collapses to a vertical
stack on narrow screens. The pricing chapter is a comparison table with three editable
starting points, not three identical price cards.

### 1.4 Typographic scale used as structure

`resn.co.nz` offers four full-screen entry words with explicit close affordances.
`linear.app` crossfades a duplicated headline and captions its product shots as
`Fig 0.1 / 0.2 / 0.3`. `studiofreight.com` runs a concatenated headline over a horizontal
thumbnail rail.

**DENVUP counterpart:** the type laboratory (chapter 10) is a specimen sheet where each
row *is* a technique — optical sizing, variable width, per-letter reveals, kerning pairs —
and the atlas and library use zero-padded index numbers as a persistent typographic motif.

### 1.5 Proof instead of assertion

`framer.com` prints real performance figures (`LCP 1.1s · INP 95ms · CLS 0.01`) and shows
a CMS table. `linear.app` shows a real gantt chart and a live activity feed rather than a
screenshot of one. `clay.com` shows a working process diagram.

**DENVUP counterpart:** the technique library is a working product, not a claim about one.
Every card is live, replayable, keyboard-operable and screen-reader-labelled, and every
technique ID is copyable to the clipboard. The build report in `IMPLEMENTATION_NOTES.md`
publishes the real bundle sizes.

### 1.6 Honest states

`signal-a.studio` labels unreleased work as "Coming Soon". `vercel.com` shows a
console-style release log with real timestamps. `awwwards.com` publishes the score, the
vote count and the date of the current site of the day. `nothing.tech` frames its product
media inside a poster frame instead of implying more than it shows.

**DENVUP counterpart:** the contact form has no server, so it never claims to have
received anything — it composes the message and opens the visitor's own mail client, and
says exactly that. Where a technique could not be implemented for a verified technical
reason, the coverage matrix records the reason and the closest safe alternative instead of
claiming success.

---

## 2. Site-by-site log

Every row was fetched on **18 October 2026**. "Verified" means the observation is visible
in the fetched page text or markup; "inferred" means it is a reasonable reading of
behaviour that could not be exercised in a static fetch.

| # | Site | What was observed | Influence on DENVUP |
|---|------|-------------------|----------------------|
| 1 | `https://lusion.co/` | Verified: "scroll to explore"; per-project service tags; a persistent "Keep Scrolling" cue; the page shifts from a work chapter to a manifesto act. | Chaptered scroll narrative; per-item metadata in the service and process rows. |
| 2 | `https://lusion.co/about` | Verified: stacked uppercase statement; people numbered `[[ 001 ]]`; client-logo carousel; awards counter; four-axis "AREA OF EXPERTISE". | Numbered people list in the team chapter; expertise treated as a taxonomy with counts, not a paragraph. |
| 3 | `https://locomotive.ca/en` | Verified: repeating "Digital-First Design" ticker; stacked location block; project list; recognition strip. | Typographic ticker treatment and the recognition-style metadata strip in the process chapter. |
| 4 | `https://obys.agency/` | Verified: dense nineteen-project index; `Discipline` tags; zero-padded `01…19`. | Catalogue-as-index: the technique library uses the same zero-padded numbering as its visual grammar. |
| 5 | `https://www.studiofreight.com/` | Verified: "MovingMissionsForward" concatenated headline over a horizontal thumbnail rail. | Concatenated-word headline in the closing chapter. |
| 6 | `https://resn.co.nz/` | Verified: four full-screen entry words, each with an explicit close affordance. | Giant single-word entry treatment in the prelude; explicit close controls on every overlay. |
| 7 | `https://linear.app/` | Verified: duplicated headline crossfade; figure captions `Fig 0.1 / 0.2 / 0.3`; real product UI, gantt and live activity feed. | Crossfading headline, numbered figure captions, and the rule that any "proof" section must contain a working thing rather than a picture of one. |
| 8 | `https://framer.com/` | Verified: three pillars each carrying a live canvas; typing/thinking agent panel; CMS table; measured `LCP 1.1s · INP 95ms · CLS 0.01`. | Real performance numbers published as content; the library's "each card demonstrates one technique" grid follows the same logic as their live-canvas pillars. |
| 9 | `https://www.instrument.com/` | Verified: reel; stacked headline; filterable work list with tag chips; client marquee; per-letter purpose statement. | Filter-chip index in the library; per-letter reveal in the type laboratory. |
| 10 | `https://www.merci-michel.com/` | Verified: category filters; long project list with category and date. | Category-filterable catalogue with metadata columns. |
| 11 | `https://clay.com/` | Verified: "Design + Webflow + Strategy = Full Circle"; `A → B` process diagram; steps `01–04`; marquee rows; client grid. | Equation-style service line; `A → B` stage diagram in the process chapter; row-based service list. |
| 12 | `https://nothing.tech/` | Verified: seasonal card; category tiles; poster-frame product media; benefit list. | Poster-frame media treatment; benefit list rather than invented testimonials. |
| 13 | `https://vercel.com/` | Verified: skip link; light/dark hero variants; console-style release log with real timestamps. | Terminal-style log; theme-variant imagery; the skip link is the first focusable element in the delivered markup. |
| 14 | `https://www.figma.com/` | Verified: eight labelled capability cards, each with its own video poster (Texture, Variable type, Type on a path, Motion timeline, Image displace). | Capability-card grid where each card demonstrates exactly one technique. |
| 15 | `https://www.awwwards.com/` | Verified live on 18 Oct 2026: Site of the Day "Signal-A Studio" scored 7.22/10, plus a nominees/winners strip and an Academy grid. | The dated/score UI pattern, and the decision to publish the DENVUP build report with real numbers rather than adjectives. |
| 16 | `https://neutomni.com/` | Verified: cookie panel; live local clock; "Open for work" badge; numbered work list; rotating shape gallery. | Availability badge and live clock; numbered work list; shape-morphing in the spatial laboratory. |
| 17 | `https://signal-a.studio/` | Verified: Awwwards Site of the Day 18 Oct 2026; glitched character-stream hero; layered SVG headers; `A—1…A—6` project indexing; "Showreel 2026 / Coming Soon". | Layered SVG hero; alphabet/number project indexing; the honest coming-soon state, and the decision to state plainly that no client work is shown. |

### Typography and palette decisions that came out of this

* **Type.** `instrument.com` (per-letter reveal), `resn.co.nz` (full-screen words) and
  `linear.app` (figure captions) all rely on type doing structural work. DENVUP therefore
  sets a variable sans (Archivo Variable, weight 100–900 and width 62–125 %) as the display
  face and a monospace (JetBrains Mono Variable) for every index, label and ID. There is no
  third family and no display serif — the studio's mark is a geometric emblem and the
  typography stays geometric.
* **Colour.** The ember/amber pair is **not** from any of these sites: it is sampled
  directly from the supplied `logo_color.png` (orange `#F0490F` → amber `#FFB627`). The
  signal blue `#2B39E6` was introduced as a single reserved accent for data, diagrams and
  interactive affordances, and it became the substrate of exactly one chapter (the
  capability atlas) so the page has a cool breath between the warm chapters.
* **Substrate.** The paper/ink alternation follows the observation at `resn.co.nz` and
  `lusion.co` that a long page needs hard changes of light. DENVUP alternates
  paper → ember → ink → paper → ember → signal → paper … so no two adjacent chapters share
  a substrate and no chapter is a repeat of the one before it.

---

## 3. Access limits — sites that could not be read

These were attempted on 18 October 2026 and returned **HTTP 500** from the fetch tool.
None of their content is used, described or paraphrased anywhere in this project.

| URL | Result |
|-----|--------|
| `https://activetheory.net/` | HTTP 500 |
| `https://unseen.studio/` | HTTP 500 |
| `https://immersivegarden.com/` | HTTP 500 |
| `https://matvoyce.co.uk/` | HTTP 500 |
| `https://overworld.audio/` | HTTP 500 |
| `https://belgradearbor.com/` | HTTP 500 |
| `https://heron.ai/` | HTTP 500 |

Seventeen sites were read successfully, which is above the ten-to-fifteen target, so the
failed list was not retried.

**A second limit applies to the whole research pass:** the environment has no browser
binary, so none of these pages could be *interacted with*. Everything above is derived
from fetched text and markup. Scroll behaviour, cursor reactions, hover states and
transition timings on those sites are therefore **inferred** and are not presented as
verified. The same limitation is why the DENVUP page was designed from structural
principles rather than by copying a specific interaction.

---

## 4. What was deliberately *not* taken

* No identity, wordmark, illustration, photograph or copy from any of the seventeen sites.
* No section composition was reproduced. The chapter sequence, the atlas, the type
  laboratory, the spatial laboratory and the technique library are original to DENVUP.
* No client names, project names, awards, scores or statistics were imported. The only
  numbers in the delivered page are the studio's own (technique counts, category counts,
  build sizes) and the pricing figures the studio supplied.
* The `awwwards.com` observation was used to decide **how to present a score**, not to
  claim one. DENVUP's build report publishes its own measurements.

---

## 5. How to check this research against the result

| Research claim | Where it shows up in the build |
|---|---|
| Chaptered narrative with per-chapter light changes | `index.html` — sixteen `<section>` elements, each with a `ch-paper` / `ch-ink` / `ch-ember` / `ch-signal` scope |
| Taxonomy with counts | `src/sections/atlas.ts` (15 nodes), `src/data/techniques.json` (480 / 21) |
| Rows rather than equal card grids | `src/sections/services.ts`, `src/sections/pricing.ts` |
| Typography as structure | `src/sections/type.ts`, `src/demos/type.ts` (21 demos) |
| Working proof, not claimed proof | `src/demos/` — 149 live demos, `src/sections/library.ts` |
| Honest states | `src/sections/contact.ts`, `ANIMATION_COVERAGE_MATRIX.md` (17 Blocked, 4 Requires revision) |
| Published real numbers | `IMPLEMENTATION_NOTES.md`, `TESTING_REPORT.md` |

---

## 6. The route and handoff pass — twelve sites, read for "what comes after what"

Every row below was fetched and read on **19 October 2026**. "Verified" means the
observation is present in the fetched page text or markup. "Inferred" means it is a
reading of behaviour that a static fetch cannot exercise — these are marked and are never
presented as fact.

### 6.1 The twelve sites and their handoff behaviour

| # | Site and route read | What happens on the way out and in | Verified / inferred | Influence on DENVUP |
|---|---|---|---|---|
| R1 | `https://signal-a.studio/` → `/case-studies` → `/case-studies/laura-makabresku` | **Verified:** the nav link set is byte-identical on the home page and on a case study, so the shell is conceptually persistent; each index card carries the fields *Project scope / Art Direction / Web Design / Branding / Web Development*, and the detail page is headed by exactly those fields; the detail page closes with a "Case Studies" rail of the *sibling* projects in a different order, each with its own hover-cursor artwork; a `go-back-arrow` returns to the index. | Verified (content and link structure) / inferred (that the card animates into the detail header) | **The service handoff is a content handoff first.** The five service cards on `/services` will carry the same field names that head each service detail page, and every service detail page ends with a rail of its four siblings plus a "back to services" control. This is the content half of the brief's "the card expands from its exact position". |
| R2 | `https://www.awwwards.com/websites/` → a site page | **Verified:** the index is a filterable grid with a dated award strip; each entry carries a score, a vote count and a date, and each entry opens its own route. | Verified | The DENVUP technique library keeps its ID, category and status visible on the card *and* on the detail, so the index already contains the detail's shape. |
| R3 | `https://www.awwwards.com/` (unknown path → 404) | **Verified:** the 404 is a designed page, not an error: a photographic background, the heading "Page not found", a **map of the site** grouped as Awards / Inspiration / Academy / Directory, plus a "w." column of secondary links, and an explicit "Awwwards home page" return. | Verified | The DENVUP 404 is a **map**, not an apology: every route is listed, grouped, and reachable in one click. |
| R4 | `https://www.studiofreight.com/projects` (unknown path → 404) | **Verified:** the 404 shows `404`, a single `Back To Home→` control with an arrow, and an illustration. Nothing else. | Verified | The DENVUP 404 pairs the map (R3) with **one** unmistakable primary action, and shows the brand mark glitching before it settles. |
| R5 | `https://obys.agency/projects` (unknown path → 404) | **Verified:** the 404 shows `404`, the studio's positioning sentence ("The studio is shaped by people who care deeply about design and the process behind."), a working `mailto:info@obys.agency`, and the index `00`. | Verified | The DENVUP 404 speaks in the studio's own voice and carries a working email link, and its index is `00` — the same zero-padded grammar the rest of the site uses. |
| R6 | `https://www.merci-michel.com/en/projects` | **Verified:** the filter chips carry **live counts** (`All / Gaming 22 / Online event 5 / Installation 5 / Website 11 / Brand content 7`) that match the number of rows carrying each tag; each row is a long line with title, subtitle, one-line description, its category tags and a `MM/YYYY` date; each row's href reveals the detail route pattern `/projects/projects/<slug>`. | Verified | The DENVUP service filters and library categories show **truthful counts**, and every index row's metadata is a field the destination page also shows. |
| R7 | `https://resn.co.nz/work` | **Verified:** the work route is reached through a full-screen entry word; the route itself is a *list* state with `View All Projects` and per-project `Close Project` affordances. | Verified (structure) / inferred (the entry-word → list handoff animates) | DENVUP keeps an explicit **section map** so a visitor can reach any chapter or route without scrolling, which is the same need the entry-word menu serves. |
| R8 | `https://basecamp.com/pricing` | **Verified:** a skip link is the first focusable element; a live social-proof line opens the page; each plan carries inline `?` explainers that expand in place; the trial length differs per plan ("30-day" vs "45-day"); before the FAQ the page **leaves the pricing frame** for a company-values essay, then returns to questions. | Verified | The DENVUP pricing route has a skip link, per-line explainers, plan-specific honest copy, and a values beat before its FAQ — so the route is not one long table. |
| R9 | `https://www.clay.com/pricing` | **Verified:** every testimonial is attributed to a named person with a role and a company, and each attribution is a link to that company's own case-study route. | Verified | The DENVUP pricing route's quotes (if any are used) must be attributable — and since the studio has no clients, the route uses its **own** demonstrable work instead: the technique library, with real IDs. |
| R10 | `https://linear.app/pricing` | **Verified:** the route is a four-plan comparison with a second, much wider feature matrix beneath it, a `Customer stories→` handoff, and a "Skip to content" link. | Verified | The DENVUP pricing route has two layers — the three indicative starting points, then the full scope matrix — and a skip link. |
| R11 | `https://www.instrument.com/` → `/work` | **Verified:** the home page is a reel; the work route is a filter-chip index. The reel and the index are two *views of the same project data*, not two unrelated pages. | Verified | The DENVUP "concepts" route and the home chapter that previews it read from one data source, so the two never disagree. |
| R12 | `https://locomotive.ca/en` → `/en/studio` | **Verified:** the ticker repeats the studio's positioning on every route; the home route carries the work list and the recognition strip, the studio route carries the people and the location block. The shared ticker is the element that crosses the route boundary. | Verified (structure) / inferred (that the ticker persists rather than re-entering) | The DENVUP **persistent stage** is the element that crosses the route boundary: it never re-enters, it re-parameterises. That is the direct answer to "what comes after what" on this site. |

### 6.2 The four findings that changed the build

**Finding 1 — a handoff is a content handoff before it is a motion handoff.**
R1 is the proof: the case-study index card and the case-study detail page share the same
field names, in the same order. The visitor arrives at a page they have already read the
shape of. *Applied:* every DENVUP service card shows the four things the detail page
opens with, in the detail page's order.

**Finding 2 — every good handoff closes a loop.**
R1 closes with a rail of the siblings, R4 closes with one way home, R3 closes with a map.
Nothing on the observed sites ends a route in a dead end. *Applied:* every DENVUP route
ends with a "where next" beat — the service detail ends with the sibling rail, the
pricing route ends with the contact route, the 404 ends with the map.

**Finding 3 — the 404 is a handoff too, and the three best ones differ.**
R3 gives a map, R4 gives one action, R5 gives a voice and an email. All three are good
because none of them apologises. *Applied:* the DENVUP 404 gives all three at once — the
map, one primary action, and a line in the studio's voice with a working email — and it
animates as a controlled glitch that settles.

**Finding 4 — the element that survives the route is the site's identity.**
R12's ticker and R1's nav are the things a visitor would name when asked what the site
"feels like" after moving between pages. *Applied:* on DENVUP the surviving elements are
the brand mark, the stage (which changes colour, camera and shape set per route without
ever being destroyed), the header, and the cursor. Those four persist across every
transition; nothing else does.

### 6.3 What could not be verified

The same limit as the first pass applies and is repeated here deliberately: **the fetch
tool returns text, not a running browser.** No scroll behaviour, hover state, cursor
reaction, transition duration or easing on any of the twelve sites was observed. Every
statement above about *motion* is marked inferred, and the transition table in §7 is
therefore built from the brief's specification and from the published patterns in §7.1 —
not from a claim that a particular site does it a particular way.

Three sites could not be read for this pass at all and are listed with the failure:

| URL | Result (19 October 2026) |
|-----|--------------------------|
| `https://obys.agency/projects` | reachable, but returns the site's own 404 (observed above as R5) |
| `https://www.studiofreight.com/projects` | reachable, but returns the site's own 404 (observed above as R4) |
| `https://www.awwwards.com/sites/freight/` | HTTP 404 — the guessed slug does not exist; the site's own 404 was read instead and is used as R3 |

---

## 7. The transition doctrine this research produced

### 7.1 The published patterns the implementation follows

These are the publicly documented approaches to cross-page transitions that the
implementation is built on. They are cited as **published guidance**, not as observations
of the twelve sites above.

| Source | Pattern taken | Where it is implemented |
|---|---|---|
| Barba.js documentation — *wrapper / container / namespace* | Everything persistent lives in the wrapper; only the container is replaced; a namespace identifies the page and drives the transition rule | `src/core/router.ts` — `<div id="shell">` (persistent) and `<main id="view">` (swapped), with `data-view` on the root as the namespace |
| Barba.js documentation — *lifecycle hooks* `before → beforeLeave → leave → afterLeave → beforeEnter → enter → afterEnter → after` | A transition has one prepare, one exit, one entry and one cleanup point | `src/core/router.ts` — the same eight phases, in the same order |
| Barba.js documentation — *transition rules keyed by `from`/`to` with a default* | Conditional transitions are data, not a chain of `if`s | `src/transitions/index.ts` — an ordered rule list, first match wins |
| Barba.js documentation — *return a promise from `leave`/`enter`* | The next phase must not start before the animation finishes | Every transition hook returns a promise; the router awaits it |
| Barba.js documentation — *animation flicker on enter* | The incoming page must be pre-set before it is shown, or it flashes | `beforeEnter` sets the incoming view's start state in the same frame as the swap |
| Barba.js documentation — *sync transitions need absolute positioning* | Overlapping containers stack and cause layout shift | Overlapping transitions position the incoming view absolutely over the outgoing one |
| Barba.js documentation — *update the title and meta tags* | A route change that leaves the old title is a bug | The router rewrites `document.title`, the description, and the canonical link |
| Barba.js documentation — *clean up between pages* | ScrollTrigger instances and split-text wrappers do not survive a DOM swap | The router kills every trigger and disposer owned by the outgoing view before the swap, and rebuilds them on entry |
| Codrops — *Webflow + GSAP + Three.js* (18 March 2026) | "The camera and the content animate in parallel, which is what makes it feel cohesive" | The stage's camera move and the view's content entrance run on one timeline |
| Codrops — *Astro + Barba.js + GSAP* (8 April 2026) | A `is__transitioning` class on the wrapper disables pointer events so two navigations cannot overlap | `document.documentElement` carries `data-transitioning`; links are inert while a transition runs |
| Codrops — *Astro + Barba.js + GSAP* (8 April 2026) | `clipPath: inset(100% 0 0 0)` → `inset(0)` as the shape wipe | The Lab and Concepts wipes are `clip-path` wipes, not fades |
| Codrops — *Astro + Barba.js + GSAP* (8 April 2026) | `preventRunning` and a `prevent` guard for "the link is the current page" | The router refuses to navigate to the URL it is already on |
| Codrops — *vanilla async page transitions* (26 February 2026) | An explicit transition engine, a `/lib` entry point for heavy dependencies, and a `delay()` promise helper | `src/transitions/` is the engine; `src/core/motion.ts` is the single import point for GSAP |
| Codrops — *parallel transitions + React Router* (8 October 2026) | One shared timeline with **labels** as publish points, so the entrance can start at a named moment in the leave | The DENVUP transition timeline uses labels (`swap`, `settle`) and the enter phase is scheduled onto the same timeline |
| adigital.agency (11 May 2026) | "Use the lightest tool that solves the actual UX problem" | No transition library is installed; the engine is written here, following the published architecture |

### 7.2 The DENVUP route transition table

This is the table the brief specifies, with each row given the parameters the brief demands:
trigger, duration, easing, reverse behaviour, mobile alternative and reduced-motion
alternative. The full table with technique IDs lives in
`WEBSITE_INFORMATION_ARCHITECTURE.md` §4.

| From | To | The transition | Reverse (Back) |
|---|---|---|---|
| Home | a service detail | the clicked card expands from its exact screen rectangle and becomes the page header; the artwork becomes the header image | the header image contracts back into the card's rectangle in the services list |
| any | `/lab` | a shape wipe from the **click point** outward, over a blueprint grid that draws itself as the wipe passes | the wipe closes back to the click point |
| any | `/studio` | a horizontal colour wipe; the brand mark travels across the screen in the opposite direction to the wipe | the wipe reverses; the mark travels back |
| any | `/pricing` | overlapping panels arrive at different speeds and settle stacked | they un-stack in reverse order |
| any | `/contact` | a curtain opens over a page that has already settled underneath | the curtain closes |
| any | `/concepts` | an image-mask wipe — the incoming artwork reveals through a liquid mask | the mask closes |
| any | 404 | a controlled glitch (three frames of channel displacement) that settles into the page | — |
| any | any other | the default: the outgoing chapter **stacks** under the incoming one, which arrives from the direction of travel | reversed |

**No row in this table is a fade.** If a transition could be swapped for a fade without
anyone noticing, it is not finished.

---

## 8. How to check the route research against the build

| Research claim | Where it shows up in the build |
|---|---|
| The handoff is a content handoff (R1) | `src/data/services.ts` — each service's four fields are the section headings of `/services/<slug>` |
| Every route closes a loop (R1, R3, R4) | `src/views/` — every view ends with a "where next" beat; the service detail ends with the sibling rail |
| The 404 is a map, one action and a voice (R3, R4, R5) | `src/views/not-found.ts` |
| The surviving element is the identity (R12) | `src/core/stage.ts` (stage), `src/core/cursor.ts` (cursor), the header and the brand mark in `index.html` |
| Persistent shell, swapped container, namespace | `index.html` + `src/core/router.ts` |
| Lifecycle hooks, promised, pre-set, cleaned up | `src/core/router.ts` |
| Conditional transitions as data | `src/transitions/index.ts` |
| Camera and content animate in parallel | `src/transitions/index.ts` — the default transition drives `stage.setRoute()` on the same timeline |
| No transition library | `package.json` — no `@barba/*`, no `framer-motion`; GSAP and Lenis only |
