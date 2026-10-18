# Website information architecture

## The job of the site

A visitor should be able to answer four questions without hunting:

1. What does DENVUP make? (sites, interfaces, interactive experiences, custom digital solutions)
2. Is this the right scale for my project? (starting prices, process, honest scope)
3. Can these people actually build the thing? (live demos, code, a real index)
4. How do I start a conversation? (form, email, WhatsApp, phone)

Everything else is evidence or atmosphere.

## Chapter order

| # | Chapter (id) | Theme | Purpose | Primary evidence |
| --- | --- | --- | --- | --- |
| 0 | `prelude` | paper | Three editorial beats, then the box rises and becomes the brand field | Type, timing, restraint |
| 0 | `gate` | orange → ink | The signature opening at page scale: box grows, colour fills, content appears inside it | Sticky stage, `--p`, clip-path |
| 1 | `hero` | orange | Value proposition and the first route into the work | Hero canvas, one-sentence promise |
| 2 | `identity` | ink / orange | The mark in motion: black, white, orange and a wipe | Logo geometry, CSS mask |
| 3 | `manifesto` | paper | What the studio believes, in short leads | Editorial type at pace |
| 4 | `services` | ink | Four offers, one line each | Horizontal rail inside vertical scroll |
| 4b | `services-deep` | alternating | Each service: what it is, who it is for, deliverables, outcomes, proof | Six deep dives |
| 5 | `capabilities` | paper | Nine capabilities with a live demo beside each | Embedded lab demos |
| 6 | `effects-library` | bone | 21 labs, 148 live demos, 480 techniques indexed | Demos, filters, search, coverage table |
| 7 | `process` | ink | Discovery → Launch, with what is delivered at each step | Horizontal timeline + sticky stage |
| 8 | `technologies` | paper | Only the technologies this build actually uses | Annotated constellation |
| 9 | `team` | bone | Four names, initials, no invented biographies | Nameplates + profiles |
| 10 | `showcase` | alternating | Four self-initiated concept pieces, labelled as concepts | Live concept demos |
| 11 | `pricing` | paper | Three starting prices, scope notes, estimator | Published numbers |
| 12 | `faq` | ink | Objections answered, searchable | FAQ with tags + search |
| 13 | `standards` | bone | The rules the site holds itself to | Written standard |
| 14 | `contact` | paper | One honest form, plus email, WhatsApp and phone | Form + direct routes |
| 15 | `closing` | orange | A final brand statement and the mark | Marquee + logo |
| — | footer | ink | Full sitemap, contact, team names, legal note | Dense footer |

No "Experience" chapter exists; employment-style timelines would invent facts.

## Navigation model

- **Header**: the mark, four primary links (Studio, Services, Effects, Pricing), a menu button, sound toggle and a section counter. It hides on downward scroll, yields focus, and returns on upward scroll.
- **Menu**: a full-screen dialog listing all chapters with one-line descriptions; closes on link, Escape, backdrop or the close button.
- **Command palette** (`⌘/Ctrl + K` or `/`): jumps to chapters, labs and individual demos.
- **Chapter rail**: a right-hand progress indicator on large screens, derived from `[data-chapter]`.
- **In-page links** from the effects index into the enquiry form.

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
| 641–960 (tablet) | Two-column cards; shorter sticky stages; reduced motion intensity; the effects index drops to one lab per row. |
| 961–1440 (laptop) | Full grid; horizontal sections active; chapter rail visible. |
| ≥ 1441 (large desktop) | Content maxes at 1440px; display type scales with `clamp()`; no layout is stretched edge to edge. |

## URL and routing model

A single prerendered document with hash anchors (`#services`, `#effects-library`, `#pricing`, …). The command palette and header use those anchors, so deep links work with JavaScript disabled. The site does not pretend to be multi-page; no route transitions are claimed in production (the transitions lab is explicitly a demo).

## Empty and failure states

- No endpoint is configured for the enquiry form: the form says plainly that nothing was sent and offers email, WhatsApp and phone.
- A lab that cannot initialise leaves its static fallback content visible.
- WebGL/WebAudio are optional; every canvas demo has a 2D or static path.
