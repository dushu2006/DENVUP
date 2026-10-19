# Testing report

Run on 19 October 2026. Node 22.22.3, Linux sandbox. The site is built, prerendered and then driven in a **real Chromium 131** assembled for this workspace (`scripts/browser/launch.mjs`: `@sparticuz/chromium` + NSS from GitHub + NSPR compiled from source). Every number below was produced by the command above it; anything not performed is listed as not performed.

## 1. TypeScript

```bash
npx tsc --noEmit
```

**Exit 0**, no diagnostics. Covers `src/**` including the 21 labs, the coverage map, all renderers, client modules and the seven test files.

## 2. Automated tests (Vitest + jsdom)

```bash
npx vitest run
```

**7 files, 46 tests, 46 passed.**

| File | Tests | What it actually asserts |
| --- | --- | --- |
| `render.test.ts` | 12 | One `h1` and `main`; skip link; unique ids; ARIA references resolve; alt text and accessible names; capability tabs and panels; catalogue holds 480 rows; sixteen home chapters; business details, three prices and contact encodings; no third-party hosts; no placeholder copy. |
| `facts.test.ts` | 6 | Identity, email, both numbers in display/E.164/WhatsApp form; single source for 15,000 / 20,000 / 50,000; one-encoded `wa.me` message; pricing note says “starting” and “third-party”; no superlative claims. |
| `content.test.ts` | 9 | No lorem/TODO; no invented years, counts, clients, awards or ratings; every concept labelled; six service slugs complete; Discovery→Launch order; FAQ substance; unique chapter ids; no Experience section. |
| `labs.test.ts` | 6 | 21 labs, ≥140 modes, ids in range; no id claimed twice by one lab or more than twice overall; every mode has interaction and touch notes; all 148 modes mount and tear down; no leftover `<dialog>`. |
| `boot.test.ts` | 1 | Boots the prerendered document through every client module; header starts `paper`, turns `orange` over the hero and `ink` over the manifesto; exactly one demo mounted; progress present; fails on any `console.error`. |
| `ui.test.ts` | 5 | Stage mounts one demo, destroys on switch, `aria-selected`, roving tabindex; arrow/Home/End; rail travel maths never negative. |
| `forms.test.ts` | 7 | Estimator 15,000 → 50,000 → 59,000; extras; empty submission lists five fields and sends nothing; no endpoint says so and offers mailto/`wa.me`/`tel:`; honeypot; FAQ filter. |

## 3. Production build

```bash
npm run build
```

**Exit 0.** Prerenders 15 routes to `dist/`, writes hashed assets, then prerenders again against the manifest.

```
[prerender] 21 labs, 148 live demos, 333 distinct technique IDs
[prerender] coverage: 25 tested, 339 implemented, 0 requires revision, 45 blocked, 71 planned
```

| Artifact | Bytes | gzip | brotli |
| --- | --- | --- | --- |
| `dist/index.html` | 130,544 (130.5 kB) | — | — |
| `dist/assets/style-*.css` | 250,038 (250.0 kB) | 45,453 | 36,796 |
| `dist/assets/index-*.js` | 239,313 (239.3 kB) | 73,323 | 59,559 |
| fonts (3 × woff2) | 196 kB total | — | — |

The original budget (CSS ≤ 220 kB, JS ≤ 230 kB) is **exceeded by 30.0 kB and 9.3 kB**. The revised budget, its reason (the 480-technique library) and the next optimisation (splitting lab CSS off the eight routes that mount no demo) are stated in `DESIGN_STRATEGY.md` §13.11 rather than hidden. Combined gzip payload is 118.8 kB.

## 4. Markup validation

```bash
npm run validate
```

`html-validate` over all 15 prerendered pages: **exit 0, no messages.** Only `form-dup-name` is disabled (the enquiry and estimator intentionally share field names).

## 5. Route suite — real browser (`scripts/browser/run.mjs`)

15 routes (including `/404`) at **360, 390, 768, 1024, 1280, 1536 and 1920**.

- Every route returns 200 (`/404` is prerendered at `/404/`), has exactly one `h1`, no broken images, a clean console and **zero horizontal overflow at all seven widths**.
- **axe-core 4.10** (WCAG 2 A/AA + 2.1 A/AA + best-practice): **0 violations on all 15 routes**, including `/404`. `color-contrast` is disabled because a headless canvas cannot model text over the stage; contrast is measured directly by the cursor test and by the design tokens.
- Soft navigation `/` → `/services/web-design`: **641 ms**, stage canvas still connected, focus moved to the new `h1`, Back returns to `/`.
- Reduced motion: **0 hidden sections**, no intro overlay.

**ALL CHECKS PASSED.**

## 6. Journey suite — real browser (`scripts/browser/journeys.mjs`)

**28 passed, 0 failed, 0 not performed.**

| Journey | Result |
| --- | --- |
| Slow scroll to the end | 0 hidden sections |
| Scroll back to the top | y = 0, scene returns to paper |
| Scene reversal | paper → bottom → paper |
| Skip link from y = 2400 | y = 2400 → 0, focus `H1#prelude-title` |
| Keyboard | first Tab is “Skip to the content”; 8 distinct stops; solid 2 px focus outline |
| Route pairs, click + Back | 8/8, stage/header/cursor/`h1` alive each time |
| View Transitions unsupported | navigation to `/pricing` still works |
| Canvas disabled | `sceneFailed:true`, 15 sections, all text present |
| Touch | native cursor kept, custom cursor hidden |
| Reduced motion | hidden 0, overlays 0, 19,459 words present |
| Page errors | 0 |

Screenshots: `.browser/shots/`.

## 7. Cursor visibility — real browser (`scripts/browser/cursor-inks.mjs`)

Headless Chromium cannot report `hover: hover`, so the test overrides **only** that media query before page scripts run; the production cursor module, event handlers, probe and CSS are otherwise unchanged.

- 23,279 px page, **52 scroll stops × 2 phases** (after a scroll with a still pointer, and after a pointer move) = 104 measurements.
- **0 below 3:1** (WCAG 1.4.11 non-text threshold). **Lowest 5.87:1**, on the orange hero.
- 0 page errors. Grounds included flat chapters, inverted cards, a white enquiry form, a transparent glow image over a dark card and a black demo canvas.
- Screenshots: `.browser/shots/cursor-{orange,glow-image,demo-canvas,light-form}.png`.

## 8. Failures found and fixed in this pass

| # | Failure | Evidence | Fix | Retest |
| --- | --- | --- | --- | --- |
| 1 | Cursor disappeared on inverted grounds | ring-vs-ground **1.02–1.15:1** at white forms, dark cards, demo canvases | ink chosen from the painted ground at the pointer; composited image pixels and demo panels; scene fallback + two-tone rim | 0/104 below 3:1, min 5.87:1 |
| 2 | Soft navigation stalled, `is-routing` stuck after a cancelled nav | no-op View Transition took **1132 ms**; route swapped at ~1500 ms | 220 ms watchdog racing `transition.ready`; `pending` counter decremented in `finally` | 641 ms, Back works |
| 3 | `/404` heading-order | axe `heading-order` (1 node) | visually hidden `h2` before the link list | axe clean |
| 4 | Build dirtied tracked files | `npm run build` rewrote `404/index.html`, `lab/index.html` | removed generated dev pages from Git, ignored them, build no longer runs the dev prerender | `git status` clean after build |
| 5 | Test artefacts looked like product bugs | sweep sampled **mid smooth-scroll** (scrollY 16 of 14,850 at 520 ms); skip-link test sampled at 500 ms | tests wait for scroll to settle before measuring | 0 false failures |

## 9. Not performed

- **Real touch hardware.** Touch behaviour is emulated (CDP touch emulation), not tested on a device.
- **Screen reader.** Semantics and ARIA are validated and unit-tested, but not heard through NVDA/VoiceOver.
- **Network throttling and Lighthouse.** No throttled run, no long-task trace, no field data. Build sizes and browser checks are what exist.
- **A real form submission.** There is no endpoint by design; the honest “nothing was sent” path is what runs.
- **Visual regression baseline.** Screenshots exist for review; no pixel-diff baseline is committed.
- **Reading the stage canvas pixel under the cursor.** A WebGL canvas without `preserveDrawingBuffer` cannot be read back; that ground keeps the scene ink plus the rim, and is excluded from the numeric pass (it was verified visually).

## 10. Coverage and follow-ups

| Status | Techniques |
| --- | --- |
| Tested | 25 |
| Implemented | 339 |
| Requires revision | 0 |
| Blocked | 45 |
| Planned | 71 |

- The 45 blocked techniques each state a verified reason and the closest safe alternative that actually ships (`src/content/coverage.ts`).
- The 71 planned techniques are listed individually in `ANIMATION_COVERAGE_MATRIX.md`; they are **not** claimed as done. They concentrate in real 3D models, media/audio assets, backend routes and story diagrams.
- The ten skills “opened to a stated fraction” in `SKILLS_STUDY_LIST.md` §3.2 are still **not read end to end**; §2.1 records this as outstanding rather than claiming them.
- Next performance step: move the 195 kB of lab-demo CSS off the eight routes that mount no demo. Recorded, not done.
