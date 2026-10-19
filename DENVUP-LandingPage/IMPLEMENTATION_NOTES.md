# Implementation notes

## Stack and why

- **Vite 8 + TypeScript 5.9**, no UI framework. The page is prerendered to static HTML by `scripts/prerender.ts`; the client is a set of small ES modules.
- **No animation library.** The pinned rails, the chapter colour changes and every reveal are authored with CSS transitions and a scroll listener that writes a transform. Native scrolling is never intercepted or smoothed. GSAP was removed from both the code and `package.json` when the audit found it was declared but never imported.
- **No Three.js.** A WebGL scene without real models would be decoration; the brief forbids fake assets. CSS 3D and Canvas 2D carry the depth work instead. Every blocked 3D technique names its closest shipped alternative.
- **No Lenis or scroll-smoothing library.** The brief requires native scrolling; the browser's own scroll is used everywhere.
- **Fonts self-hosted**: Bricolage Grotesque (display) and Instrument Sans (body), both variable, subset to Latin and served from `public/assets/fonts/`.

## Page architecture

- `src/content/site.ts` — every visible string and business fact, one source of truth.
- `src/render/*` — pure render functions (page shell, sections, forms). The former effects-library renderer is deleted.
- `src/labs/*` — 21 labs / 148 demo modes, each with markup, optional init, interaction notes and technique IDs. Nine capability demos are mounted one at a time as tabs change and four concepts run at once, so at most five run together; all 148 are still mounted and destroyed by tests.
- `src/client/*` — navigation, motion, forms, capability stage, embeds, accessibility helpers. The custom-cursor module is deleted.
- `scripts/prerender.ts` — writes `index.html` with the full markup; warns on duplicate or out-of-range technique IDs.
- `scripts/build-brand-assets.mjs` — derives brand files without touching originals.

## The opening sequence

1. Paper page, black type, three compact beats that share one screen rather than three full screens. No logo animation, no spinner, no loader, no door.
2. The beats hand straight over to the full-bleed orange hero. There is nothing to scale open and nothing to scroll past: the earlier gate was removed in the 19 October review, and this note follows the shipped page.
3. The hero is in the DOM from the first paint, so no transition can hide the headline or the calls to action.
4. Orange hands over to ink, then to the chapter colours. The fixed header reads the chapter under its own lower edge on scroll and takes that colour; it never hides.
5. `prefers-reduced-motion: reduce` keeps the three beats readable, keeps every reveal visible and shows the hero immediately.

## Known conflicts and decisions

- **Eyebrow / index markers.** The house rules ban eyebrow pills, "01 / 02 / 03" markers and tiny tracked capitals. All eleven `section-head__eyebrow` lines are now deleted from the renderers and content, together with `.principle__index`, the capability frame counter and the deep-dive position counter. What survives has a job: the `S1`–`S6` service codes are the same codes the deep-dive anchors use, the process steps are numbered because they are one ordered sequence drawn on a line, and the capability footer counter reports the selected tab (the only remaining position indicator). Nothing is left as decoration.
- **Deep-link ids vs. chapters.** Chapters use readable ids (`services`, `capabilities`); the deep-dive anchors use `service-{slug}`. The command palette resolves both.
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

- HTML is prerendered. The capability stage mounts one demo at a time and destroys it on switch, so at most one canvas or interval runs at once; concept demos mount with `IntersectionObserver`.
- Canvases cap particle counts, pause offscreen and use device pixel ratio capped at 2.
- Build output: 133 kB HTML (24 kB gzip), 218 kB CSS (40 kB gzip), 218 kB JS (67 kB gzip) after the review pass. The HTML no longer contains 148 demo shells or the 480-row index; the remaining weight is the page copy and the demo registry in JS.
