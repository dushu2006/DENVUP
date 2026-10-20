# Testing report

Run on 19–20 October 2026 (the motion pass re-ran every suite on 20 October). Node 22.22.3, Linux sandbox. The site is built, prerendered and then driven in a **real Chromium 131** assembled for this workspace (`scripts/browser/launch.mjs`: `@sparticuz/chromium` + NSS from GitHub + NSPR compiled from source). Every number below was produced by the command above it; anything not performed is listed as not performed.

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

## 9. Motion pass — differential and measured (`scripts/browser/motion.mjs`)

**32 passed, 0 failed.** Every assertion compares two states of the same control rather than trusting that a rule exists in the stylesheet.

| Check | Measurement |
| --- | --- |
| Press state | computed `transform` differs while held, returns to `none` on release |
| Disabled control | opacity 0.55, not colour-only |
| Filter rule | `translate(0,0) scaleX(58)` → `translate(809.7px, 71.8px) scaleX(158)`, across three wrapped rows; `transition-property` includes `transform` |
| Filter result | count reads the same number as the visible cards (5 vs 5); reset restores 148 |
| Empty state | appears with guidance and an action, not a blank panel |
| Arrival stagger | 180 ms rise, 20 ms steps, **12 animated items capped**, widest run 400 ms |
| Status band | starts at 0 px, opens with a 260 ms height animation, settles at 72 px |
| Validation | 3 named fields marked, honest “nothing was sent” message, focus to the first field |
| Carried intent | `/lab` “I want this” → `/contact` with the technique in the message, provenance note, matching character count |
| Dialog exit | exit plays before unmount; menu closed and unmarked after |
| FAQ | 240 ms height animation, settles at 140 px |
| Reduced motion | outcome fully visible at 72 px, intent still carried, provenance still shown |

**Not measured: 60 fps.** `requestAnimationFrame` is throttled to ≈450 ms per frame in this headless build even when idle (4 frames in 900 ms), and CSS transitions report `currentTime` 0 for their full duration before committing. Frame timing here would be invented, so it is reported as not performed. What was verified: only `transform`/`opacity` animate, durations sit inside the brief's bands, and concurrent animated elements are capped at 12.

## 10. Defects found and fixed by the motion gate

| # | Failure | Evidence that located it | Fix | Retest |
| --- | --- | --- | --- | --- |
| 1 | The signature filter rule never travelled | `.lab-tabs` wraps to three rows at 1440 px (tops 0/36/72), and a `.is-wrapped` guard hid the rule by design | guard and `.is-wrapped` rules removed; the rule travels in two dimensions | 810 px of travel measured |
| 2 | The rule moved to the previously pressed tab | `placeRule()` ran before `aria-pressed` was written | call moved after the attribute writes | correct target |
| 3 | The status band snapped open | isolated probe: 0 px at 2–248 ms, 43.9 at 309 ms; a synthetic `grid-template-rows` probe held 0 px for 286 ms then jumped to 80 | `animateHeight()` measures the target and animates height with a guaranteed end state | 260 ms animation, settles at 72 px |
| 4 | The price could lag its own input | two unit tests: display read `15,000` while the quote was `50,000` | `rollValue()` writes the value immediately, then animates its arrival | 46/46 |
| 5 | Restoring “All” animated 143 cards at once | probe counted `getAnimations()` on every returned card | cap raised on items, not only on delay: 12 animate, the rest are present | 12 animated, 400 ms total |
| 6 | The test measured the overlay, not the form | submit click swallowed while a view-transition snapshot was still mounted | drive the form with `requestSubmit()`, as Enter does | 32/32 |
| 7 | The cursor contrast sweep read a half-faded button | 1.14:1 on one run, 5.87:1 on the next, same build | sweep waits for finite animations to settle before sampling | 5.87:1 minimum, 0 below 3:1 |

Full re-run after the fixes: `tsc` 0, `vitest` 46/46, build clean, `html-validate` clean, `run.mjs` ALL CHECKS PASSED, `journeys.mjs` 28/28, `cursor-inks.mjs` 5.87:1, `motion.mjs` 32/32.

## 11. Not performed

- **Real touch hardware.** Touch behaviour is emulated (CDP touch emulation), not tested on a device.
- **Screen reader.** Semantics and ARIA are validated and unit-tested, but not heard through NVDA/VoiceOver.
- **Network throttling and Lighthouse.** No throttled run, no long-task trace, no field data. Build sizes and browser checks are what exist.
- **A real form submission.** There is no endpoint by design; the honest “nothing was sent” path is what runs.
- **60 fps / frame timing.** `requestAnimationFrame` runs at ≈450 ms per frame in this headless build; no long-task trace was possible (see §9).
- **Visual regression baseline.** Screenshots exist for review; no pixel-diff baseline is committed.
- **Reading the stage canvas pixel under the cursor.** A WebGL canvas without `preserveDrawingBuffer` cannot be read back; that ground keeps the scene ink plus the rim, and is excluded from the numeric pass (it was verified visually).

## 12. Coverage and follow-ups

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
