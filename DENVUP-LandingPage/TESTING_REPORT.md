# Testing report

Run on 19 October 2026 in the Arena sandbox. Node 22.22.3, npm 10.9.8, Linux. **No browser is installed and none could be installed**: requests to Playwright/CDN/deb hosts returned network code 000. Everything below was actually executed; nothing is inferred from a screenshot that does not exist.

## 1. TypeScript

```bash
npx tsc --noEmit
```

**Result: exit 0**, no diagnostics. Covers `src/**` including all 21 labs, the coverage map, renderers, client modules and the five test files.

## 2. Automated tests (Vitest + jsdom)

```bash
npx vitest run
```

**Result: 5 test files, 38 tests, 38 passed.**

| File | Tests | What is actually checked |
| --- | --- | --- |
| `src/tests/render.test.ts` | 10 | One `h1` and `main`; skip link; unique ids; resolving `aria-labelledby` / `aria-describedby` / `aria-controls`; alt text and accessible names; 21 lab shells each with stage, modes and "I want this"; 480 coverage rows; business details, three prices and contact encodings; no third-party script/font host; no placeholder copy; one claim per demo id. |
| `src/tests/facts.test.ts` | 6 | Exact identity, email, both phone numbers (display, E.164, WhatsApp), four names; one source of truth for 15,000 / 20,000 / 50,000; single-encoded `wa.me` message with newlines; pricing note says "starting" and "third-party"; no superlative claims. |
| `src/tests/content.test.ts` | 9 | No lorem/TODO/placeholder; no invented years, project counts, clients, awards or ratings; every showcase piece labelled a concept; six service slugs with complete deep-dive fields; Discovery→Launch order; technologies; FAQ substance and uniqueness; chapter ids unique, no `experience`; prices and contact details absent from renderers. |
| `src/tests/labs.test.ts` | 6 | 21 labs and ≥140 modes with names, summaries and markup or init; technique ids in range; no repeated id inside a lab and no id claimed by more than two modes; interaction notes for every mode and a touch note for hover demos; every demo mounts and tears down without throwing, including reduced-motion + coarse-pointer; after mounting and destroying all 148 modes, the stage is empty and the document contains no leftover `<dialog>`. |
| `src/tests/forms.test.ts` | 7 | Estimator starts at 15,000, recalculates to 50,000 and 59,000, sums extras to 31,000 and carries the summary into the enquiry; empty submission lists five fields and says nothing was sent; no endpoint produces "Nothing was sent" + "no server endpoint" and working mailto/`wa.me`/`tel:` links; honeypot rejection; FAQ filter and clear. |

The canvas stub in `src/tests/setup.ts` provides a 2D context proxy so canvas demos genuinely execute their init paths in jsdom.

## 3. Production build

```bash
npm run build
```

**Result: exit 0.**

```
[prerender] 21 labs, 148 live demos, 336 distinct technique IDs
[prerender] coverage: 23 tested, 342 implemented, 0 requires revision, 45 blocked, 70 planned
dist/index.html                 479.15 kB │ gzip: 47.73 kB
dist/assets/style-DgTUhxeD.css  228.78 kB │ gzip: 41.54 kB
dist/assets/index-tcfHu8tq.js   269.12 kB │ gzip: 82.28 kB
```

`index.html` is 479 kB because the 480-row coverage index and all 148 demo shells are prerendered; gzip is 47.7 kB. No prerender warnings about duplicate or out-of-range IDs were emitted.

## 4. HTML validation

```bash
npm run validate
```

**Result: exit 0**, `html-validate dist/index.html` with no messages. `.htmlvalidate.json` disables only `form-dup-name` (the enquiry and estimator intentionally share field names); everything else, including landmark and ARIA rules, is active.

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

- **No browser, no screenshots.** The full scroll journey, the opening sequence, sticky/horizontal sections, cursor states, WebGL-adjacent canvas rendering and responsive breakpoints were never visually inspected.
- **No real device or touch testing.** Mobile behaviour is verified only by CSS/JS review and jsdom event simulation.
- **No performance profiling.** No Lighthouse, no throttled network, no long-task measurement. Build sizes are reported, nothing more.
- **No screen-reader run.** Semantics and ARIA are validated and unit-tested, but not heard through NVDA/VoiceOver.
- **No real form submission.** There is no endpoint by design; the honest failure path is what the tests assert.
- **No Playwright.** The skill was read; the dependency was deliberately not added.

## 7. Known defects / follow-ups

1. 70 techniques remain Planned (see §5); closing them requires real 3D models, video/audio assets or backend routes.
2. `section-head__eyebrow` and `service-card__index` markup survives from earlier passes and conflicts with the written house rule; it is restyled small but should be removed or given a real function.
3. ~~Lab-stage teardown leaks body-level dialogs from `access` / `collections`.~~ **Checked on 19 October 2026: does not reproduce.** A regression test now mounts and destroys every mode and asserts the stage is empty and the document's `<dialog>` count is unchanged. The earlier note described an older prototype; the current demos keep their dialogs inside the stage. The test remains as the guard.
4. Service worker / offline behaviour is not implemented; the manifest and icons exist only for install metadata.
5. No automated visual regression baseline exists.
