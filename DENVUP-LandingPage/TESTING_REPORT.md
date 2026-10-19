# Testing report

Run on 19 October 2026 in the Arena sandbox. Node 22.22.3, npm 10.9.8, Linux. **No browser is installed and none could be installed**: requests to Playwright/CDN/deb hosts returned network code 000. Everything below was actually executed; nothing is inferred from a screenshot that does not exist.

## 1. TypeScript

```bash
npx tsc --noEmit
```

**Result: exit 0**, no diagnostics. Covers `src/**` including all 21 labs, the coverage map, renderers, client modules and the seven test files.

## 2. Automated tests (Vitest + jsdom)

```bash
npx vitest run
```

**Result: 7 test files, 46 tests, 46 passed.**

| File | Tests | What is actually checked |
| --- | --- | --- |
| `src/tests/render.test.ts` | 12 | One `h1` and `main`; skip link; unique ids; resolving `aria-labelledby` / `aria-describedby` / `aria-controls`; alt text and accessible names; nine capability tabs each with one panel and the mounted demo’s own technique IDs; the effects library, its 480-row table, the mark section and every literal `>Close<` control are absent; the catalogue still holds 480 rows; fifteen chapters; business details, three prices and contact encodings; no third-party script/font host; no placeholder copy. |
| `src/tests/facts.test.ts` | 6 | Exact identity, email, both phone numbers (display, E.164, WhatsApp), four names; one source of truth for 15,000 / 20,000 / 50,000; single-encoded `wa.me` message with newlines; pricing note says "starting" and "third-party"; no superlative claims. |
| `src/tests/content.test.ts` | 9 | No lorem/TODO/placeholder; no invented years, project counts, clients, awards or ratings; every showcase piece labelled a concept; six service slugs with complete deep-dive fields; Discovery→Launch order; technologies; FAQ substance and uniqueness; chapter ids unique, no `experience`; prices and contact details absent from renderers. |
| `src/tests/labs.test.ts` | 6 | 21 labs and ≥140 modes with names, summaries and markup or init; technique ids in range; no repeated id inside a lab and no id claimed by more than two modes; interaction notes for every mode and a touch note for hover demos; every demo mounts and tears down without throwing, including reduced-motion + coarse-pointer; after mounting and destroying all 148 modes, the stage is empty and the document contains no leftover `<dialog>`. |
| `src/tests/boot.test.ts` | 1 | Boots the real prerendered document through every client module (navigation, motion, forms, capabilities, embeds) with chapter geometry stubbed; fails on any `console.error`, then asserts the header starts on `paper`, turns `orange` over the hero and `ink` over the manifesto as scroll position changes, exactly one capability demo is mounted, the menu dialog exists and the progress bar is present. |
| `src/tests/ui.test.ts` | 5 | Capability stage mounts exactly one demo, destroys it on switch, updates `aria-selected`, roving `tabindex`, counter and panel visibility; arrow/Home/End keys move selection and focus; rail travel maths uses the rail column for services and the pin for a full-bleed track, and never goes negative. |
| `src/tests/forms.test.ts` | 7 | Estimator starts at 15,000, recalculates to 50,000 and 59,000, sums extras to 31,000 and carries the summary into the enquiry; empty submission lists five fields and says nothing was sent; no endpoint produces "Nothing was sent" + "no server endpoint" and working mailto/`wa.me`/`tel:` links; honeypot rejection; FAQ filter and clear. |

The canvas stub in `src/tests/setup.ts` provides a 2D context proxy so canvas demos genuinely execute their init paths in jsdom.

**Reveal contract (added after the screenshots pass).** Reveal styles are gated behind `html.reveal-armed`, a class `src/client/motion.ts` adds only after word-splitting succeeds and `IntersectionObserver` is confirmed. Content is therefore never hidden by CSS alone: if the module fails to load, throws, or the browser lacks the API, every `[data-reveal]` element stays visible. Reduced motion and the no-observer path call `revealAll()` and never arm. This is covered by the boot test (which imports the real module) and by the no-JS `.no-js` overrides; it is not visually verified because there is no browser.

## 3. Production build

```bash
npm run build
```

**Result: exit 0.**

```
[prerender] 21 labs, 148 live demos, 336 distinct technique IDs
[prerender] coverage: 23 tested, 342 implemented, 0 requires revision, 45 blocked, 70 planned
dist/index.html                 131.29 kB │ gzip: 23.57 kB
dist/assets/style-D0qqicJC.css  213.84 kB │ gzip: 38.69 kB
dist/assets/index-B1WoAx0t.js   218.25 kB │ gzip: 67.11 kB
```

The document fell from 479 kB to 131 kB after the Effects library and the mark chapter were removed. Deleted stylesheet blocks (the never-rendered gate, library search, coverage table and status chips) account for the further 4.2 kB drop in CSS. The registry still reports 21 labs / 148 modes / 336 distinct IDs because those demos remain the source for the capability stage and the showcase; the page itself mounts five live demos at rest — the active capability and the four concepts — not 148 shells. No prerender warnings about duplicate or out-of-range IDs were emitted.

## 4. HTML validation

```bash
npm run validate
```

**Result: exit 0**, `html-validate dist/index.html` with no messages. `.htmlvalidate.json` disables only `form-dup-name` (the enquiry and estimator intentionally share field names); everything else, including landmark and ARIA rules, is active.

An **axe-core 4.14** run against the built document (jsdom, `color-contrast` disabled because jsdom has no layout) reports **0 violations**. It found two real defects in the previous build, both fixed: the closing marquee’s `role="img"` made its pause button a nested interactive control, and the reading-progress element sat outside every landmark. The dependency was installed with `--no-save`; no test dependency was added to `package.json`.

## 5. Coverage audit

`npx tsx scripts/coverage-report.ts` regenerates `ANIMATION_COVERAGE_MATRIX.md` from `coverageRows` (480 rows):

| Status | Count |
| --- | --- |
| Tested | 23 |
| Implemented | 342 |
| Requires revision | 0 |
| Blocked | 45 |
| Planned | 70 |

**This is a shortfall against the 480/480 target and is not hidden.** The 70 planned techniques are concentrated in: 3D/WebGL object work (130, 230, 239, 241, 245, 284, 285, 288, 289), particle systems and fluid fields (252, 253, 255, 259–261, 266–269), route transitions and preview menus (153, 158, 162, 166–168, 171, 173–175), interactive story diagrams (305–307, 310–314, 317, 319–321, 322, 325), people/team modules (348, 355), pricing comparisons (356–358, 377–379), media controls (388, 392, 395, 397), easter eggs (403, 404, 406, 410), touch comparison and mobile transitions (413, 424), pause/flash rules (428, 429, 435), and the dynamic-import/network-test rules (454, 458). Each is listed with a real file/where value in the matrix; they are not counted as done.

The 45 blocked techniques each carry a verified reason and a closest safe alternative in `src/content/coverage.ts`.

## 6. What was **not** tested

- **No browser, no screenshots.** The full scroll journey, the opening sequence, sticky/horizontal sections, cursor states, WebGL-adjacent canvas rendering and responsive breakpoints were never visually inspected. This remains the largest gap in the evidence below.
- **The header colour transition was not watched in a browser.** Its selection logic is geometric and unit-independent, but the 0.4s colour transition between chapters is unverified visually.
- **No real device or touch testing.** Mobile behaviour is verified only by CSS/JS review and jsdom event simulation.
- **No performance profiling.** No Lighthouse, no throttled network, no long-task measurement. Build sizes are reported, nothing more.
- **No screen-reader run.** Semantics and ARIA are validated and unit-tested, but not heard through NVDA/VoiceOver.
- **No real form submission.** There is no endpoint by design; the honest failure path is what the tests assert.
- **No Playwright.** The skill was read; the dependency was deliberately not added.

## 7. Known defects / follow-ups

1. 70 techniques remain Planned (see §5); closing them requires real 3D models, video/audio assets or backend routes.
2. ~~`section-head__eyebrow` markup.~~ **Removed on 19 October 2026.** All eleven kicker lines (eight `sectionHead` callers, manifesto, contact) and their CSS are gone; sections now open on the heading. `service-card__index` is kept because it prints the service’s `S1`–`S6` code, which is the same code the deep-dive anchor uses — it is a cross-reference, not decorative numbering. `rail-hint` is kept as the only affordance for the horizontal rail; it stays accurate at every width because `.services__rail` is a horizontal scroller even when the pin is disabled.
3. The **black “Close” chip seen at the top-left of the client’s screenshots does not exist in the built document**. `>Close<` appeared in the retired chapter-rail label (chapter 17, now renamed “End” and the rail removed) and inside three demo dialogs. A global `dialog:not([open]) { display: none !important }` guard and `contain: paint` on the capability stage now make it impossible for a closed demo dialog to paint outside its frame. If the chip persists in the client’s viewer, it belongs to the viewer, not the page.
4. The Effects library UI, its search/filter chips, its 480-row table, the identity chapter and the loader overlay are gone. That is a deliberate scope change, recorded in `ANIMATION_COVERAGE_MATRIX.md`; the registry and its 148 mount/teardown tests remain.
5. ~~Lab-stage teardown leaks body-level dialogs from `access` / `collections`.~~ **Checked on 19 October 2026: does not reproduce.** A regression test now mounts and destroys every mode and asserts the stage is empty and the document's `<dialog>` count is unchanged. The earlier note described an older prototype; the current demos keep their dialogs inside the stage. The test remains as the guard.
6. Service worker / offline behaviour is not implemented; the manifest and icons exist only for install metadata.
7. No automated visual regression baseline exists.
8. `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/scripts/lint.mjs` reports **153 FAIL / 127 WARN** for `src/` (down from 192 / 133 after the dead CSS was deleted). Of those, 30 FAILs are 1px hairlines in the four page stylesheets — all row separators inside the FAQ list, footer columns, pricing and menu rows, not dividers between sections (sections separate by ground colour and space). The rest come from the 21 catalogue stylesheets the demos render: 1px demo boxes, four glass panels, monospace inside demo code, and em dashes in demo copy. Those demos are the product being demonstrated and are excluded from the house-style rewrite; the linter is not silenced with `taste-skill-ignore`, and this note records the judgement.
