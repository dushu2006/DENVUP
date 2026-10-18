# Implementation notes

## Stack and why

- **Vite 8 + TypeScript 5.9**, no UI framework. The page is prerendered to static HTML by `scripts/prerender.ts`; the client is a set of small ES modules.
- **GSAP + ScrollTrigger** for the gate pin and the horizontal rails only. Native scrolling is never intercepted or smoothed.
- **No Three.js.** A WebGL scene without real models would be decoration; the brief forbids fake assets. CSS 3D and Canvas 2D carry the depth work instead. Every blocked 3D technique names its closest shipped alternative.
- **No Lenis or scroll-smoothing library.** The brief requires native scrolling; the browser's own scroll is used everywhere, including the scrubbed demo region inside the effects library.
- **Fonts self-hosted**: Bricolage Grotesque (display) and Instrument Sans (body), both variable, subset to Latin and served from `public/assets/fonts/`.

## Page architecture

- `src/content/site.ts` — every visible string and business fact, one source of truth.
- `src/render/*` — pure render functions (page shell, sections, forms, effects library).
- `src/labs/*` — 21 labs / 148 live demos, each mode with markup, optional init, interaction notes and technique IDs.
- `src/client/*` — navigation, motion, forms, cursor, library controller, embeds, accessibility helpers.
- `scripts/prerender.ts` — writes `index.html` with the full markup; warns on duplicate or out-of-range technique IDs.
- `scripts/build-brand-assets.mjs` — derives brand files without touching originals.

## The opening sequence

1. Paper page, black type, three beats. No logo animation, no spinner.
2. A small box rises from the bottom centre, then grows via `transform: scale()` and `clip-path` until it fills the viewport with `#ff4a00`.
3. The hero content is already in the DOM and becomes visible inside the colour field; the box never hides content.
4. Orange hands over to ink, then to the paper chapters; each chapter sets `data-theme`, which drives the header and the chapter rail.
5. `prefers-reduced-motion: reduce` removes the pin and the scale, keeps the three beats readable and shows the hero immediately.

## Known conflicts and decisions

- **Eyebrow / index markers.** The house rules ban eyebrow pills, "01 / 02 / 03" markers and tiny tracked capitals. Some renderers still emit `section-head__eyebrow` and `service-card__index` from earlier iterations. They are restyled as plain small labels where they survive, not used as decorative numbering. This is a known inconsistency, not a design intent; a future pass should either remove them from the markup or give them a real informational job.
- **Deep-link ids vs. chapters.** Chapters use readable ids (`services`, `effects-library`); the deep-dive anchors use `service-{slug}`. The command palette resolves both.
- **Coverage vs. honesty.** 70 of 480 techniques are marked **Planned** and 45 **Blocked**. They were not silently claimed. The block list states a verified reason and the closest safe alternative for every entry. A complete 480/480 implementation would require assets this repository does not have (3D models, video/audio) or would mean fabricating client work; both are refused by the brief.
- **`prefers-reduced-motion` and the opening.** The reduced path keeps all three beats and the hero copy, drops the pin, and shows the colour field as a static plate. It is not a "no content" mode.
- **No browser in this environment.** Installation of Chromium/Playwright is blocked (network 000 to CDNs and package mirrors). No screenshot, scroll-journey or device test is claimed. The site is verified by prerender, typecheck, jsdom tests and HTML validation only.

## Honesty rules enforced in code

- The enquiry form has no endpoint in this build. On submit it says **"Nothing was sent: this build has no server endpoint…"** and renders mailto, `wa.me` and `tel:` links. It never displays a success state.
- The price estimator labels itself a planning tool, not a quote; the published prices are starting points and third-party costs are called out as separate.
- Showcase pieces are labelled "Concept, not client work" in content and UI.
- The team section lists four names and initials only; no titles, biographies, portraits or years are invented.
- No testimonial, rating, client logo or project metric exists anywhere in the build.

## Accessibility

- Skip link, one `h1`, landmark structure, labelled controls, visible focus.
- Dialogs use native `<dialog>` with focus return; the menu traps focus and closes on Escape.
- Canvas demos have text alternatives; all hover-only interactions have tap and keyboard routes.
- `prefers-reduced-motion` removes transitions, pins and decorative loops, and keeps every word.

## Performance

- HTML is prerendered; the heaviest labs mount lazily with `IntersectionObserver` (420px root margin).
- Canvases cap particle counts, pause offscreen and use device pixel ratio capped at 2.
- Build output: 479 kB HTML (47.7 kB gzip), 229 kB CSS (41.5 kB gzip), ~249 kB JS (78 kB gzip). The HTML is large because all 480 coverage rows and 148 demo shells are prerendered; this is deliberate so the index works without JavaScript.
