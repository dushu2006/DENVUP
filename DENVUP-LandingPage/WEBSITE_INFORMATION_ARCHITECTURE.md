# Website information architecture

## The job of the site

A visitor should be able to answer four questions without hunting:

1. What does DENVUP make? (sites, interfaces, interactive experiences, custom digital solutions)
2. Is this the right scale for my project? (starting prices, process, honest scope)
3. Can these people actually build the thing? (live demos, code, a real index)
4. How do I start a conversation? (form, email, WhatsApp, phone)

Everything else is evidence or atmosphere.

## Chapter order

Section themes are declared on each `<section data-theme>`; the fixed header reads the chapter behind its own lower edge, so the header colour is always the colour of the section under it.

| # | Chapter (id) | Theme | Purpose | Primary evidence |
| --- | --- | --- | --- | --- |
| 01 | `prelude` | paper | Three compact editorial beats, then the den opens | Type, pacing, one rising line per beat |
| 02 | `hero` | orange | Value proposition and the first route into the work | Full-bleed brand field, orbit mark |
| 03 | `manifesto` | ink | What the studio believes, in short leads | Editorial type at pace |
| 04 | `services` | paper | Six offers in a pinned horizontal rail | Native vertical scroll mapped to a sideways rail |
| 05 | `services-deep` | bone | Each service: who it is for, deliverables, outcomes, starting point | Six deep dives |
| 06 | `capabilities` | ink | Nine capabilities, each with one live demonstration on a shared stage | Tabbed stage; 9 embedded lab modes; technique IDs taken from each mounted demo |
| 07 | `process` | bone | Six stages, with what is delivered at each step | Horizontal timeline + sticky stage |
| 08 | `technologies` | ink | Only the technologies this build actually uses | Annotated constellation |
| 09 | `team` | paper | Four names, initials, no invented biographies | Nameplates + profiles |
| 10 | `showcase` | bone | Four self-initiated concept pieces, labelled as concepts | Live concept demos |
| 11 | `pricing` | ink | Three starting prices, scope notes, estimator | Published numbers |
| 12 | `faq` | paper | Objections answered, searchable | FAQ with tags + search |
| 13 | `standards` | ink | The rules the site holds itself to | Written standard |
| 14 | `contact` | orange | One honest form, plus email, WhatsApp and phone | Form + direct routes |
| 15 | `closing` | ink | A final brand statement | Marquee + mark |
| — | footer | ink | Full sitemap, contact, team names, legal note | Dense footer |

The **Effects library** chapter and the **"the mark"** identity chapter were removed at the client's request. Their live demos now sit inside `capabilities` (nine) and `showcase` (four); the 480-row reference remains in the coverage documents, not on the page.

No "Experience" chapter exists; employment-style timelines would invent facts.

## Navigation model

- **Header**: brand, six primary links (Studio, Services, Capabilities, Process, Team, Pricing), a jump button (`⌘/Ctrl + K`), a project CTA and a menu button on narrow screens. The header is fixed at the top for the whole page, never auto-hides, and takes the colour of the chapter behind it from geometry read on scroll.
- **Menu**: a full-screen dialog listing ten destinations; closes on link, Escape, backdrop or the close button.
- **Command palette** (`⌘/Ctrl + K` or `/`): jumps to the fifteen chapters and the nine capability demos. Starting a demo scrolls to the stage, selects the tab and focuses it.
- **In-page links** from each service card into its deep dive, and from the capability stage into the nine demos.
- The former right-hand chapter rail and loader overlay were removed; the only persistent chrome is the header, the reading-progress bar at the bottom edge and the legal stamp.

## Content model

One data file, `src/content/site.ts`, owns every user-visible string and every business fact:

- brand, contact routes, prices
- chapters and navigation
- services with `summary`, `forWho`, `deliverables`, `outcomes`, `proof`
- capabilities and their demo bindings
- process steps, technologies, team, showcase concepts
- pricing tiers, estimator options, notes
- FAQ, standards, contact copy, closing, footer, metadata

Lab copy lives with its demo in `src/labs/*.ts`; the technique catalogue lives in `src/content/technique-catalogue.json`; coverage status lives in `src/content/coverage.ts` + `coverage-map.ts`.

## Responsive intent

| Width | Behaviour |
| --- | --- |
| ≤ 640 (phone) | One column; full-screen menu; horizontal rails become native swipe strips with visible buttons; tap-to-preview for hover demos; 44px minimum targets; safe-area padding. |
| 641–960 (tablet) | Two-column cards; shorter sticky stages; the capability index becomes a two-column list above the stage; horizontal sections release to vertical. |
| 961–1440 (laptop) | Full grid; services and process rails active; capability index beside the stage. |
| ≥ 1441 (large desktop) | Content maxes at 1440px; display type scales with `clamp()`; no layout is stretched edge to edge. |

## URL and routing model

A single prerendered document with hash anchors (`#services`, `#capabilities`, `#pricing`, …). The command palette and header use those anchors, so deep links work with JavaScript disabled. The site does not pretend to be multi-page; no route transitions are claimed in production (the transitions lab is explicitly a demo).

## Empty and failure states

- No endpoint is configured for the enquiry form: the form says plainly that nothing was sent and offers email, WhatsApp and phone.
- A capability demo that cannot initialise leaves its "Demo loading…" fallback text visible; the panel still names the technique IDs and the capability.
- WebGL/WebAudio are optional; every canvas demo has a 2D or static path.

---

## Master-prompt revision — routes, chapters and hand-offs (19 October 2026)

This section **supersedes the chapter order and navigation model above** where they differ. It is the document the acceptance test "every chapter has an entrance and exit that is not a plain fade, documented with technique IDs" refers to. It records the intended structure; the build status is stated at the end and is not overstated.

### A. Routes

| Route | Purpose | Shell | Status |
| --- | --- | --- | --- |
| `/` | The full signature story: 15 chapters below | header, stage, cursor, progress | **Built** as a single page (chapters 1–15 of this document); the new chapter order is **planned** |
| `/services` | Overview of the five offers, each expanding into its page | shared | **Planned** |
| `/services/web-design` | Web design and development | shared | **Planned** |
| `/services/ai-solutions` | AI-powered solutions (illustrated, never a live-product claim) | shared | **Planned** |
| `/services/integrations` | Business integrations | shared | **Planned** |
| `/services/interactive` | Creative and interactive experiences | shared | **Planned** |
| `/services/automation` | Automation and business tools | shared | **Planned** |
| `/lab` | Filterable live demos of interaction techniques | shared | **Planned** (the 21-lab registry and 148 modes already exist) |
| `/concepts` | Four self-initiated concepts, labelled as concepts | shared | **Planned** |
| `/studio` | About, principles, process, technologies, team | shared | **Planned** |
| `/pricing` | Three starting prices, scope guidance, estimator, FAQ | shared | **Planned** |
| `/contact` | Multi-step enquiry, email, WhatsApp | shared | **Planned** |
| `/privacy`, `/terms` | Legal, with owner-to-confirm items flagged | shared | **Planned** |
| `404` | Designed error page | shared | **Planned** |

**Build model.** Static multi-page output (one real HTML file per route, prerendered), with **cross-document View Transitions** (`@view-transition { navigation: auto }`) mapping the header, stage and cursor with `view-transition-name`. Browsers without support get a normal navigation. There is no client-side router and no history hijacking.

### B. Persistent systems

| System | Behaviour | Techniques |
| --- | --- | --- |
| Stage | One fixed canvas behind the DOM for the whole site; colour, density and camera change per chapter; paused offscreen; CSS-only fallback when WebGL is missing or the device is weak | 127, 130, 139, 229, 236, 238, 245, 250, 251–264, 265, 299, 415, 419 |
| Header | Fixed; compresses on scroll; colour of the chapter under it; sliding active indicator; magnetic links; full-screen menu with shape reveal and reverse close | 34, 151–160, 164, 173, 174 |
| Cursor | Dot + ring, contextual label, colour by chapter, trailing echo; hidden on coarse pointers; native cursor if the script fails | 21–27, 35, 36, 48, 50 |
| Progress | Reading progress + active chapter; route-change indicator | 19, 119, 121, 175 |
| Motion tokens | Three durations, two easings, one distance scale, one stagger step; every transition declares trigger, duration, easing, reverse, mobile and reduced-motion behaviour | 426–429, 436–437 |

### C. Home chapter choreography

“In” and “Out” are the designed handovers. A plain fade is not used anywhere.

| # | Chapter | In | Signature interaction | Out | IDs |
| --- | --- | --- | --- | --- | --- |
| 0 | Intro (first visit only, skippable, ≤3 s) | Logo assembled from the real mark, letter-by-letter wordmark | Asset-load progress, fonts ready, first-visit flag | Split-panel curtain into the white prelude | 7, 8, 10, 11, 15–18, 20, 209 |
| 1 | Prelude (white, black type) | Page already complete underneath | Pinned editorial beats, line masks, scroll highlight, oversized background type; a small box grows with scroll and floods the viewport orange | The flood **is** the transition; hero content is already inside the colour | 83, 86, 96, 102, 117, 125, 127, 128, 131, 146 |
| 2 | Hero (orange) | Revealed by the flood | Kinetic headline, magnetic CTAs, the real logo, one pointer/scroll-reactive shader object, mesh gradient | Elements disperse while the field darkens to carbon | 35, 81, 88, 90, 138, 228, 229, 232, 233, 239, 262, 264 |
| 3 | Manifesto (carbon) | Carbon field arrives with the dispersed hero particles | Scroll-linked highlight, words through a shape mask, marquee with pause, decode on key words | Liquid wipe / particles form a word that becomes the services plate | 94, 96, 105, 107, 255, 285 |
| 4 | Services overview | Liquid form resolves into the selector | Interactive selector changes the artwork; magnetic cards; pointer-follow highlight; 3D tilt | Selected card expands into the first deep dive | 36, 176, 179, 183, 225, 301, 302 |
| 5 | Service deep dives (pinned) | Expanded card becomes the fixed visual panel | Sticky narrative with changing text; one diagram per service; before/after labelled as a concept | Fixed panel scales into the next chapter's first image | 133, 147, 167, 194, 218, 219, 227, 303, 304, 306, 314, 335, 336 |
| 6 | Capabilities / lab teaser | Panel scale resolves into the horizontal track | Horizontal storytelling with a drag gallery, “Drag” cursor label, pointer-following thumbnail; link to `/lab` | Track releases into vertical scrolling with direction-aware motion | 24, 134, 144, 189, 190, 201 |
| 7 | Type, scroll and 3D demos | Direction-aware release continues the same movement | Variable-font weight/width; pointer-repelled characters; curved text; scroll-controlled 3D rotation; liquid image transition; each names its ID and has “I want this” | Perspective grid / depth transition | 38, 90, 91, 109, 229, 284, 285, 295 |
| 8 | Process | Line drops in from the previous depth layer | Timeline draws, nodes light in order, active step follows scroll, central illustration changes; vertical on phone | The line continues into the technology chapter | 146, 326–330, 332, 333 |
| 9 | Technology atlas | Line terminates in a node | Layers reveal on selection; links draw between nodes; progressive detail; only confirmed tools | Nodes collapse to a point that becomes the team graphic | 218, 255, 311, 312, 325, 348 |
| 10 | Studio and team | The point opens into the four nameplates | Typographic names reacting to hover; monogram detail; network graphic; portrait slots ready for real photos; no invented roles | Names slide away in opposing directions | 113, 341, 343, 345, 348, 350, 352 |
| 11 | Concepts | Colour chapter opens from the outgoing names | Labelled concept explorations; comparison sliders; interactive mockups | Lightbox zoom / mask into pricing | 12, 194–198 |
| 12 | Pricing | Mask resolves into the rate card | Three prices from config; plan selector with animated state; feature comparison; estimator using approved starting prices only | Soft vignette / focus shift | 287, 297, 356–360 |
| 13 | FAQ | Vignette opens | Accordion with height transition and plus/minus morph, one open at a time, search | Contact CTA rises; field returns to brand orange | 127, 361–364 |
| 14 | Contact | CTA rise becomes the form | Multi-step enquiry, conditional fields, inline validation, honest loading/success/error, copy-to-clipboard, WhatsApp with prefilled message | Curtain closes into the footer | 365–374, 377 |
| 15 | Closing | Curtain opens on the mark | Large closing statement, interactive logo states, small details, shortcut guide, legal links, optional easter egg | — | 396, 402, 406, 407, 409 |

### D. Route transitions

| From → to | Transition | IDs |
| --- | --- | --- |
| Home → service detail | Clicked card expands from its exact position; its artwork becomes the page header | 167, 183, 184, 197 |
| Any → `/lab` | Shape wipe growing from the click point into a blueprint environment | 166, 212, 294, 295 |
| Any → `/studio` | Horizontal colour wipe with the brand mark passing across | 165, 170 |
| Any → `/pricing` | Overlapping panels at different speeds | 146, 169 |
| Any → `/contact` | Curtain opens on an already-settled page | 10, 156 |
| Any → `/concepts` | Image-mask / liquid wipe | 12, 285 |
| Back | Reverse of the forward transition | 159 |
| 404 | Brief controlled glitch, then settle | 300 |

### E. Build status (honest)

- **Built today:** the single-page route `/` with 15 chapters, the nine capability demos, four concepts, pricing, FAQ, contact and closing. Language: vanilla TypeScript, no router, no persistent WebGL stage, no custom cursor.
- **Planned:** every other route in §A, the persistent stage, the cursor, cross-document View Transitions, and the chapter-by-chapter handovers in §C. None of those is claimed as built or tested.
- **Acceptance tests 1–5 require a real browser.** This environment has none (`which google-chrome chromium …` returns nothing). They will be reported as not performed unless the environment changes; static DOM, build, jsdom and axe checks are the substitute, and they are labelled as such.
