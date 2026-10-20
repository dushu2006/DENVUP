# Website information architecture

DENVUP is a multi-route site with a persistent shell. This document is the
map: what is on screen, in what order, how one route becomes another, and
what each chapter does when it arrives and when it leaves.

It is written to be checkable. Every entrance and exit below names the
mechanism and the technique IDs from
`AI_Skills_Pack/Website_Animation_Interaction_Encyclopedia.md`, and the
route table names the file that implements it.

---

## 1. The three layers

The site is three things stacked on top of each other, and they have
different lifetimes.

| Layer | What it is | Lifetime | Implemented in |
| --- | --- | --- | --- |
| **The shell** | Skip link, grain, scroll and route progress bars, the stage canvas, the two-part cursor, the header and its sliding indicator, the full-screen menu, the command palette, the footer route map, the journey dock, the to-top control | Mounted once. Never re-created. Proven by the browser check, which tags the shell nodes before a navigation and finds the same nodes afterwards. | `src/shell/shell-before.html`, `src/shell/shell-after.html`, `src/core/shell.ts` |
| **The stage** | One canvas behind the whole site. Its colour, camera and shapes are re-parameterised per chapter and per route rather than reloaded. | One instance. Re-look, never re-create. | `src/core/stage.ts`, `src/core/stage-controller.ts`, `src/data/stage.ts` |
| **The view** | The content of the route that is on screen. | Mounted on entry, torn down on exit. | `src/views/index.ts`, `src/sections/*` |

The shell and the stage are injected into every document by a Vite plugin
(`vite.config.ts` → `shellPlugin()`), which reads the three partials in
`src/shell/` and refuses to build if a marker is left unresolved.

The view is the only thing that changes. A route change fetches the target
document, extracts its `<main>`, and swaps it in.

---

## 2. The route map

Fifteen documents, one router, one shell.

| Route | Document | What it is |
| --- | --- | --- |
| `/` | `index.html` | Home — sixteen chapters, 0 to 15 |
| `/services/` | `services/index.html` | The five lines, as a layered overview and a card index |
| `/services/web-design/` | `services/web-design/index.html` | Web design & development |
| `/services/ai-solutions/` | `services/ai-solutions/index.html` | AI-powered solutions |
| `/services/business-integrations/` | `services/business-integrations/index.html` | Business integrations |
| `/services/creative-experiences/` | `services/creative-experiences/index.html` | Creative & interactive experiences |
| `/services/automation/` | `services/automation/index.html` | Automation & business tools |
| `/lab/` | `lab/index.html` | The Effects Library — every technique, live — plus the transition playground |
| `/concepts/` | `concepts/index.html` | Work in progress, stated honestly |
| `/studio/` | `studio/index.html` | Manifesto, principles, process, tool set, people |
| `/pricing/` | `pricing/index.html` | The three starting points, the estimator, and the pricing FAQ |
| `/contact/` | `contact/index.html` | The enquiry, in three steps |
| `/privacy/` | `privacy/index.html` | The policy |
| `/terms/` | `terms/index.html` | The terms |
| anything else | `404.html` | A designed 404, reached through the `/*` wildcard rule |

**Interior routes have no opening sequence.** Arriving at a price list
should not mean sitting through a cinematic intro, so the boot overlay only
plays on the home page (`src/core/boot.ts`).

---

## 3. The route transition table

The router asks for "the rule that matches this pair of routes"; first match
wins (`src/transitions/index.ts`). Every rule is a designed transition, and
**none of them is a fade** — that is the testable property. If a cross-fade
could be swapped in unnoticed, the rule is not finished.

| From → To | Rule | What happens | Reverse (Back) |
| --- | --- | --- | --- |
| Home → a service detail | `service-expand` | The card lifts from its exact screen rectangle, becomes the artwork, and the artwork becomes the page header. The outgoing view scales to 0.96 behind it. | The artwork collapses back towards the middle of the screen and the home page grows back into place. |
| Services → a service detail | `service-expand` | As above, from the services index. | As above. |
| Any → Lab | `shape-wipe` | A blueprint grid fades in under a shape wipe that grows from the exact point that was clicked, so the wipe starts where the finger was. | The circle opens again from the centre and closes **at the point the forward journey started** — the click point travels with the history entry. |
| Any → Studio | `colour-wipe` | A horizontal colour wipe; the real brand mark travels across the screen in the opposite direction to the wipe. | The field grows from the right instead of the left, the mark travels the other way, and the content slides the other way. |
| Any → Pricing | `panel-overlap` | Three panels arrive at different speeds and stack over the outgoing page. | The panels fall from the top instead of rising from the bottom, and leave through the bottom edge. |
| Any → Contact | `curtain-open` | A curtain closes over the page and opens onto a contact page that has already settled behind it. | The curtain comes from the opposite corners and the content slides the other way. |
| Any → Concepts | `image-mask` | An image mask opens in three liquid steps, each a different circle, so the edge never travels in a straight line. | The wobble runs the other way round. |
| Any → not found | `glitch-settle` | Three bands jump in stepped time, then settle. | The jumps are mirrored. |
| Everything else | `stack-default` | The outgoing view scales to 0.94 and dims to 55 % brightness; the incoming view rises into place over it. | The outgoing view falls instead of rising and the incoming view comes from above. |

**Reduced motion.** When the visitor's system asks for less motion, none of
the above is played. A single 0.24 s crossfade exchanges the two views
(`reducedCrossfade` in `src/transitions/index.ts`). This is the only fade in
the system, and it exists because the alternative is movement. Technique
**168**.

**The reverse is a real reverse.** The browser does not tell a page whether
the visitor pressed Back or Forward, so the router keeps a monotonic index
on every history entry (`src/core/router.ts` → `historyIndex`). A smaller
index is a Back press, a larger one is a Forward press, and the rule of the
journey being undone is chosen and played backwards.

**The router cannot wedge.** Every transition is bounded by a timeout, every
transition body is wrapped so that a thrown animation falls back to a plain
swap, and a watchdog releases the router if it is ever left busy for longer
than any transition could legitimately take. A missing animation is
acceptable; a dead router is not.

---

## 4. The Home page — sixteen chapters

Numbering follows `src/data/site.ts` → `navSections`, which is also what the
floating journey dock shows. Every chapter has its own entrance and its own
exit. **No entrance or exit on this site is a plain fade.**

| # | Chapter | Ground | What it is | Entrance | Exit | Techniques |
| ---: | --- | --- | --- | --- | --- | --- |
| 00 | Prelude | Paper | The seed: a square and three beats, on white | The seed square grows from nothing and the copy arrives on a rise | The square keeps growing and becomes the environment of chapter 01 | 11, 12, 125–127, 209, 334, 478 |
| 01 | The expansion | Ember | The square becomes a world | The panel scales up and the ground changes from paper to ember at 45 % of the scroll | The copy lifts and the environment scales past the viewport | 43, 130, 228–233, 239, 242, 247, 250, 288, 308, 309, 404, 415, 446, 454, 455, 459, 471, 476, 477 |
| 02 | Studio | Ink | What DENVUP is | Words rise and the line reflows as the scroll moves | The statement settles into the grid | 27, 40, 277 |
| 03 | Brand system | Ink | The emblem treated as data | The mark draws itself from its own geometry | The mark resolves into the wordmark | 14, 255, 396, 409, 433, 480 |
| 04 | Manifesto | Paper | The rules the work is built on, and the studio plate — the one large image on the site | Words arrive one at a time, in reading order; the plate then breaks the shell full-bleed | The last line holds and the ground warms | 83, 92, 94, 102, 128, 352, 408 |
| 05 | Services | Ember | Five lines, five signatures | The stage pins; the first service's visual enters as a built composition and the split screen assembles | The pinned panel scales into the atlas chapter | 225, 301–303, 325, 430 |
| 06 | Capability atlas | Signal | The tool set, plotted | The connectors draw from their nodes outward | The map lifts and the map lines retract | 140, 142, 217–219, 304, 305, 307, 311, 312, 314, 336, 338, 400, 434 |
| 07 | Process | Paper | Six stages, each with an output | The rail draws downward as the section enters | The last stage's outputs stay | 136, 141, 148, 318, 319, 326–340 |
| 08 | Technique library | Ink | The reference catalogue | The catalogue rows stagger in and the detail panel slides | The catalogue hands over to the typography chapter | 72, 171, 183–188, 204, 205, 317, 321, 322, 375 |
| 09 | Typography | Paper | Type as a material | The baseline grid draws, then the scale sets itself | The specimens travel off on a track | 90, 91, 104, 109, 418 |
| 10 | Spatial lab | Ink | WebGL and Three.js pieces | The loader resolves into the scene; the object assembles from its parts | The camera pulls back and the object leaves the frame | 288, 336, 359, 372 (shared with the service signatures) |
| 11 | Team | Paper | The four people, typographically | The cards rise in a stagger; the network draws between them | The portraits hold | 341–351, 354, 355 |
| 12 | Pricing | Ink | Three starting points and an estimator | The figures count up; the rows separate | The estimator stays lit | 320, 323, 324, 357–360 |
| 13 | Questions | Paper | Seven questions | The rows arrive as a run of hairlines; the answer opens on a grid-row height change | The last answer closes | 361, 363, 364 |
| 14 | Contact | Ember | The enquiry, in three steps | The steps slide in on a stagger, one at a time | The field closes over the closing chapter | 65, 75, 78–80, 365–372, 374, 377–380, 432 |
| 15 | Closing | Ink | The last statement | The words arrive in a run and the field closes | The footer takes over | 13, 262 |

**The one large image.** The home page carries a single dominant image:
`public/art/plate-01.jpg`, the studio plate, set full-bleed inside the
manifesto chapter between the title and the argument, captioned as plate 01
and captioned as artwork generated by `scripts/build-art.py`. It is the only
place on the site where the supplied emblem appears as a picture — everywhere
else it is drawn live, as particles. The five service lines each carry a small
plate of their own artwork in the services chapter, beside the live diagram
rather than instead of it.

**Chapter 05 in detail.** This is the chapter the brief is strictest about,
so it is spelled out.

- The chapter is a **pinned split screen**. The stage on the left is sticky
  and holds the viewport while five service steps scroll past it on the
  right.
- Each service owns **one signature visual**, and only one:
  - *Web design* — a wireframe assembles into a composition behind a moving
    divider.
  - *AI solutions* — a node network where selecting a node lights the paths
    that answer it.
  - *Business integrations* — systems drawn as named boxes, with a packet
    travelling the flow between them.
  - *Creative experiences* — layered planes turning in space under the
    pointer.
  - *Automation* — a token entering a processor and leaving as a result.
- The chapter is also a real **tab list**: arrow keys move between the
  services, and choosing one scrolls the story to it. It works with a
  keyboard and a screen reader, not only with a pointer.
- On a narrow screen the stage stops being a column and becomes a band
  that follows the step it belongs to. There is no horizontal scroll.

The five service signatures are implemented in
`src/sections/service-visuals.ts`; the chapter itself in
`src/sections/services.ts`.

---

## 5. The global systems

These follow the visitor from page to page, because they belong to the shell
rather than to any one chapter.

| System | Behaviour | Mobile | Reduced motion | Techniques |
| --- | --- | --- | --- | --- |
| **The stage** | One canvas behind the site. Colour, camera and shape parameters change per chapter and per route; the change is a tween, not a cut. The canvas has a static CSS field behind it, so if the 2D context cannot be created the page still has a ground. | The same stage, fewer particles, 30 fps. | The loop never starts. One composed frame, then stillness. | 19, 175 and the stage chapter entries |
| **The cursor** | A dot and a ring that follow separately; the ring lags; the label is contextual; the colour changes per chapter; magnetic targets pull it; a trailing echo follows the pointer. | The native cursor is restored. `pointer: coarse` and any pointer failure both fall back. | The native cursor is restored. | 153–164, 172–174 |
| **The header** | Compresses on scroll; a sliding indicator travels to the active item; links are magnetic. | The links collapse into a sheet. | The indicator still slides, but nothing animates on its own. | 153–164 |
| **The menu** | A full-screen curtain with a shape reveal. | A sheet that slides from the edge. | The sheet appears without a wipe. | 165–170 |
| **The command palette** | `⌘K` / `Ctrl-K` opens a searchable list of every route and section. | Reachable from the menu. | No animation. | 339, 376, 417, 438 |
| **The journey dock** | A floating index of the current route's sections, with the active one marked. | Hidden below 640 px; the menu carries the same list. | The active mark still moves. | 153–164 |
| **The progress** | A scroll bar and a route bar. The route bar fills while a document is being fetched. | Both remain. | Both remain. | 19, 175 |
| **The grain** | A fixed noise layer over the page. | The same. | The same. | 11, 12 |

---

## 6. Motion tokens

Defined once in `src/styles/tokens.css` and used by every module.

| Token | Value | Used for |
| --- | --- | --- |
| `--dur-press` | 140 ms | Press feedback |
| `--dur-hover` | 180 ms | Hover feedback |
| `--dur-ui` | 240 ms | Interface state changes, the reduced-motion crossfade |
| `--dur-reveal` | 800 ms | Chapter entrances |
| `--dur-panel` | 420 ms | Panel and layer changes |
| `--dur-scene` | 1200 ms | Stage re-looks |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Arrivals |
| `--ease-in` | `cubic-bezier(0.76, 0, 0.24, 1)` | Exits |
| `--ease-inout` | `cubic-bezier(0.33, 1, 0.68, 1)` | Reversals and scrubs |

**The rule of leaving.** A chapter that is leaving spends about 70 % of the
time of the chapter arriving. The exit has to be quicker than the entrance,
because the visitor is already looking somewhere else.

**Lag smoothing is off** (`src/core/motion.ts`). GSAP treats a frame longer
than half a second as a hiccup and advances its clock by 33 ms. That is right
for scroll-scrubbed animation and wrong for a route transition, which is a
promise about elapsed time: on a slow device a one-second wipe was taking
fifteen seconds of wall-clock time. With smoothing off, a transition that is
late finishes late by the amount it was late, and no later.

---

## 7. The other routes

### `/services/`

A layered overview, then the five lines as cards. Clicking a card runs
`service-expand` — the card grows from its own rectangle and becomes the
detail page's header artwork.

### `/services/<slug>/`

Each detail page is generated from `src/data/services.ts` by
`scripts/gen_service_pages.py`, so a service cannot describe one thing on the
home page and another here. The order is:

1. **Hero** — kicker, title, the one-line promise, two actions.
2. **Artwork** — original art for that line, from `public/art/`.
3. **What it is** — the body, the signature sentence, and the facts
   (audience, outcome, price note).
4. **How this one works** — the animated workflow diagram. The line draws
   itself, a marker travels it, and the nodes fire in order. Under reduced
   motion the same information is shown as a complete, readable diagram.
5. **What the interaction could look like** — the labelled concept demos,
   each linked to its technique in the Effects Library so the claim is
   checkable rather than decorative.
6. **The six stages** — the same process as the home page.
7. **The question** — the one a buyer of that line actually asks.
8. **The call** — write to the studio.
9. **The other four lines** — a sibling rail.

### `/lab/`

Two parts.

- **The Effects Library** — every technique in the encyclopedia, mounted
  live, in a filterable and searchable grid. Each card carries its technique
  ID, name, summary, trigger, a **Replay** button, **Copy the reference**,
  and **I want this**, which pre-fills the enquiry brief and links to
  `/contact/`. Cards mount when they scroll into view and tear down when they
  leave, so a page with a hundred and forty-nine live demos does not run a
  hundred and forty-nine animation loops at once.
- **The transition playground** — the eight route transitions, replayed over
  the live page, with the field controls underneath.

**The technique anchors.** Every demonstration carries an id of the form
`tech-NNN`, where `NNN` is the encyclopedia's own number for that technique.
The same id exists on the home page's technique library, where it marks the
card rather than the demonstration. The anchors are what make the service
pages' links honest: a technique with a running demonstration links to
`/lab/#tech-NNN` and says **live demo**; a technique that is only a record
links to `/#tech-NNN` and says **reference**.

A deep link to one of these is a real navigation, not a bookmark that lands
in the wrong place. It is handled in three steps, because three things have
to be true at once:

1. The **fragment has to be the one being navigated to.** The view is mounted
   before the router puts the new address into the history, so the router
   carries the fragment through the view context rather than reading
   `location.hash`, which still belongs to the page being left.
2. The **jump has to be instant.** A deep link can cross twenty thousand
   pixels of catalogue, and a smooth scroll across that distance would drag
   the visitor through every card on the way.
3. The **position has to be settled.** The page grows as the demonstrations
   above the target mount, so the landing is corrected until it stops
   changing, and the correction is given up after a few seconds so it can
   never hold the page.

Measured on the finished build: a deep link into the middle of the catalogue
lands its card **89 px** from the top of the window — the height of the
fixed header, exactly as designed.

### `/studio/`

Manifesto, six principles, the process, the tool set (the same capability
atlas as the home page), and the people.

**No fake portraits.** Each member of the studio has a monogram drawn in the
emblem treatment. The frame is a portrait slot: drop a real photograph into
`/public/portraits/` with the right file name and it replaces the monogram
in place, with no layout change and no second template. The expected file
names are listed in `src/sections/portraits.ts`.

### `/pricing/`

The home pricing chapter, expanded: the three rows, the estimator, what is
in every quote, and a **pricing FAQ** — eight questions a buyer asks once a
number is on the screen. The pricing FAQ is a separate set from the seven
studio questions on the home page, so the two never repeat each other.

### `/contact/`

A three-step enquiry with honest states. There is no backend, so the form
does not pretend to submit: it validates, it tells the truth about what will
happen, and it gives the visitor a working email and two working WhatsApp
links. A "fake success" message would be the one dishonest thing on the
site.

### `/privacy/`, `/terms/`

Real, plain text about a studio that does not track people and does not run
a backend. **Owner-to-confirm:** the legal text has not been reviewed by a
lawyer, and the studio's registered address and jurisdiction are placeholders
that have to be replaced before the site goes live.

### 404

A designed 404, reached through the `/*` wildcard. It offers the route map,
the studio's email, and a way back — the pattern Awwwards and Studiofreight
use, recorded in `DESIGN_RESEARCH.md` §6.

---

## 8. The chapters of the other routes

| Route | Sections | Techniques |
| --- | --- | --- |
| `/services/` | Layered overview, the five lines, the process preview | 225, 301–303, 325, 430 |
| `/services/<slug>/` | Hero, artwork, what it is, how it works, concept demos, stages, question, call, siblings | 102, 118, 121, 131, 146, 158, 196, 202, 215, 233, 274, 288, 289, 301, 312, 327, 336, 341, 359, 372 |
| `/lab/` | The Effects Library and the transition playground | 72, 165–170, 171, 183–188, 204, 205, 317, 321, 322, 375 |
| `/studio/` | Manifesto, principles, process, tool set, people | 27, 40, 136, 141, 148, 217–219, 277, 318, 319, 326–340, 341–351, 354, 355 |
| `/pricing/` | Figures, estimator, scope, pricing FAQ, call | 320, 323, 324, 357–364 |
| `/contact/` | Hero, the three steps, alternatives, the FAQ strip | 65, 75, 78–80, 365–372, 374, 377–380, 432 |
| `/concepts/` | The honest in-progress index | 19 |
| `/privacy/`, `/terms/` | The legal text | 19 |

---

## 9. Accessibility and resilience

- **Semantic markup.** One `h1` per route, sections labelled by
  `aria-labelledby`, the service story is a real tab list, the FAQ is a
  real disclosure widget, and the dock is a navigation landmark.
- **Keyboard.** Every control is reachable. The service story responds to
  the arrow keys, the team strip to the arrow keys, Home and End. The command
  palette opens on `⌘K` and closes on Escape.
- **Visible focus.** A focus ring that is never removed.
- **Reduced motion.** `prefers-reduced-motion: reduce` is honoured in three
  places at once: the shell, the chapters, and the route transitions. The
  route crossfade is the only fade in the system.
- **No motion-only information.** Every animation has a static equivalent.
  The workflow diagram on a service page shows the same four stages whether
  or not it is animating.
- **Touch.** Anything that is hover-only has a tap or focus equivalent, and
  the custom cursor is only installed for fine pointers.
- **Resilience.** If the stage canvas cannot be created, the CSS field
  stands in. If a transition throws, the page still arrives. If a document
  cannot be fetched, the browser navigates for real. If the router is ever
  left busy, the watchdog releases it.
- **Safe areas.** The header, the dock and the floating contact control
  respect `env(safe-area-inset-*)`.

---

## 10. What is still to confirm

These are not gaps in the build. They are things only the studio can answer.

1. **Prices.** ₹15,000 / ₹20,000 / ₹50,000 are indicative starting points
   and are editable in `src/data/services.ts` and `pricing/index.html`.
2. **Legal text.** The privacy policy and the terms have not been reviewed
   by a lawyer, and the address and jurisdiction are placeholders.
3. **The form backend.** There is none. The contact form is honest about
   that, and the email and WhatsApp links work.
4. **Portraits.** Four slots, four file names, no photographs.
5. **The studio's contact details on the legal pages.**

**Which content is the studio's and which was written for the site** is set out
in `IMPLEMENTATION_NOTES.md` §13, item by item. Everything the studio supplied —
the two logos, the email address, both WhatsApp numbers, the four names and the
three price points — is used exactly as given. Everything else was written for
this build and is open to change.
