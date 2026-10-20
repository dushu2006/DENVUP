# SKILL_REFERENCE_AUDIT.md

**Project:** DENVUP — studio website
**Skills library:** `AI_Skills_Pack/` — **read-only**. Nothing inside it was created,
modified, renamed, moved, reformatted or deleted during this project, and no dependency,
asset, config or script was installed into it. The library is referenced only by path.

Every skill listed below was opened and read in this repository. Where only part of a file
was read, the exact extent is stated. Nothing here is reconstructed from memory or
paraphrased from a description: each entry quotes or names a specific section of the file
at the path given.

---

## 1. Consultation log

| # | Skill file (path relative to repo root) | Read | Category |
|---|---|---|---|
| 1 | `AI_Skills_Pack/skills/ui-ux-design/high-end-visual-design/SKILL.md` | full (99 lines) | Visual direction, motion, performance guardrails |
| 2 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend-v2-experimental/SKILL.md` | full (1229 lines) | Design system, layout discipline, a11y/performance rules |
| 3 | `AI_Skills_Pack/skills/ui-ux-design/frontend-design/SKILL.md` | full (72 lines) | Taste, anti-default discipline, copy voice |
| 4 | `AI_Skills_Pack/skills/ui-ux-design/industrial-brutalist-ui/SKILL.md` | full (93 lines) | Swiss/telemetry typographic system |
| 5 | `AI_Skills_Pack/skills/ui-ux-design/theme-factory/SKILL.md` | full (60 lines) | Theme selection process |
| 6 | `AI_Skills_Pack/skills/ui-ux-design/minimalist-ui/SKILL.md` | full (87 lines) | Editorial minimalism, banned defaults |
| 7 | `AI_Skills_Pack/skills/ui-ux-design/canvas-design/SKILL.md` | full (130 lines) | Visual philosophy for static artefacts |
| 8 | `AI_Skills_Pack/skills/ui-ux-design/modern-web-design/SKILL.md` | full (991 lines) | Patterns, a11y, performance, tokens |
| 9 | `AI_Skills_Pack/skills/3d-motion-creative/threejs-webgl/SKILL.md` | full (581 lines) | Three.js scene, lighting, disposal |
| 10 | `AI_Skills_Pack/skills/3d-motion-creative/algorithmic-art/SKILL.md` | full (404 lines) | Generative/particle method |
| 11 | `AI_Skills_Pack/skills/3d-motion-creative/gsap-scrolltrigger/SKILL.md` | **partial — lines 1–560 of 766** (overview → easing reference); the remaining 206 lines were not read | Scroll animation |
| 12 | `AI_Skills_Pack/skills/3d-motion-creative/locomotive-scroll/SKILL.md` | **partial — lines 1–180 and 262–381 of 481**; the file-navigation section (181–261) and the tail (382–481) were not read | Smooth scrolling |
| 13 | `AI_Skills_Pack/skills/testing-quality-security/webapp-testing/SKILL.md` | full (96 lines) | Browser test harness |
| 14 | `AI_Skills_Pack/skills/testing-quality-security/playwright/SKILL.md` | full (147 lines) | Browser automation CLI |
| 15 | `AI_Skills_Pack/skills/engineering-workflow/codebase-design/SKILL.md` | full (114 lines) | Module / interface / seam vocabulary |
| 16 | `AI_Skills_Pack/skills/general-workflow/screenshot/SKILL.md` | full (267 lines) | Screenshot capture fallbacks |
| 17 | `AI_Skills_Pack/skills/3d-motion-creative/lightweight-3d-effects/SKILL.md` | **not read** — 1091 lines, skipped deliberately; see §5 | 3D alternatives |
| 18 | `AI_Skills_Pack/Website_Animation_Interaction_Encyclopedia.md` | full (all 480 techniques) | The coverage source of truth |
| 19 | `AI_Skills_Pack/skills/testing-quality-security/diagnosing-bugs/SKILL.md` | full (128 lines) | The diagnosis loop used for the reported visual defect |
| 20 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/SKILL.md` | full | The design law applied throughout, and the source of the inspector run against the finished site |
| 21 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/scripts/inspect.mjs` | full (155 lines) | The measurement harness: how it launches, what it photographs, and how it decides a rule is allowed |
| 22 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/scripts/lib/rules.mjs` | full (137 lines) | The 52 rules, their thresholds, and the `allow` mechanism used for the written exemptions |
| 23 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/scripts/lib/probe.mjs` | full (540 lines, read in parts) | What the probe actually measures: type, surfaces, buttons, pictures, covered text, side scrollers |
| 24 | `AI_Skills_Pack/skills/ui-ux-design/impeccable/reference/audit.md` | full (140 lines) | The structure and severity scale of `UI_UX_AUDIT.md` |
| 25 | `AI_Skills_Pack/skills/ui-ux-design/impeccable/SKILL.md` | **partial** — the routing table was read in an earlier session; the remainder was not re-read | The command set referenced by the audit's recommended actions |
| 26 | `AI_Skills_Pack/skills/3d-motion-creative/barba-js/SKILL.md` | full (867 lines, read in five passes) | The reference implementation of a persistent shell with real page transitions — consulted for the multi-route build: the wrapper/container/namespace model, the transition lifecycle, the sync/async flow, and the "forgot to return the promise" pitfall |
| 27 | `AI_Skills_Pack/skills/ui-ux-design/frontend-design/SKILL.md` | full (72 lines) — re-read in full for the feedback layer | The anti-pattern list and the "one orchestrated moment beats scattered effects" rule, which decided the shape of the whole pass |
| 28 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/references/motion.md` | full (the motion reference) | The motion budget, the six token curves, the duration bands, the reduced-motion rule, and the list of things that give generated motion away — including the ban on bounce and elastic easing |
| 29 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/references/motion.md` | full (293 lines) — re-read for the second feedback pass | §2's rule for "hundreds of times" interactions — typing and filtering — which decided that the field and the search acknowledge by **state** and never by movement |
| 30 | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/references/tells.md` | full (116 lines) | The seven tells that give generated motion away; the "same fade-up on every block" tell is what ruled out per-card entrance tweens in the technique library |
| 31 | `AI_Skills_Pack/skills/ui-ux-design/impeccable/reference/animate.md` | full (90 lines) | The rule that state and feedback is the smallest change that makes cause and result unmistakable, and that no dependency is added for an effect the stack can already express |
| 32 | `AI_Skills_Pack/skills/ui-ux-design/impeccable/reference/delight.md` | full (71 lines) | The rule against manufacturing a celebration for an ordinary click, and the rule that a repeated interaction stays satisfying after the hundredth use |
| 33 | `AI_Skills_Pack/skills/ui-ux-design/frontend-design/SKILL.md` | full (72 lines) — read a third time | "Treat failure and emptiness as moments for direction, not for mood", and "a CTA says exactly what happens when it is used" — the second of which caught a false claim about the technique library |

Skill 18 is the encyclopedia rather than a skill, but it is the contract this build answers
to, and `ANIMATION_COVERAGE_MATRIX.md` is generated from it.

**A note on the sequence.** Entries 20–25 were consulted *after* the site was built, for
the UI/UX audit, and they were read before the audit's findings were fixed — not after.
The inspector found fourteen failures on the finished site; every one of them was either
fixed in the code or granted a written exemption in `.taste-skill/direction.json`.

**A second note on the sequence.** Entries 29–33 were consulted at the *start* of the
second feedback pass, before any of it was written. The sweep they shaped was supposed
to find missing acknowledgements; it found a clipped catalogue that made 147 of the
149 laboratory demonstrations unreachable. That defect is recorded in full in §2.24.

---

## 2. Guidance extracted, and what was done with it

### 2.1 `high-end-visual-design/SKILL.md`

**Guidance used**

* §2 "ABSOLUTE ZERO" — banned fonts (Inter, Roboto, Arial, Open Sans, Helvetica), banned
  generic 1px-grey borders, banned harsh `rgba(0,0,0,0.3)` shadows, banned symmetrical
  three-column Bootstrap grids, banned `linear`/`ease-in-out` transitions.
* §3 "The Variance Mandate" — pick an archetype rather than repeating one layout; §3
  "Mobile Override" — asymmetric layouts must collapse below 768 px, and never use
  `h-screen` where `min-h-[100dvh]` is meant.
* §5.C — scroll reveals must use `IntersectionObserver` or a scroll library, never
  `window.addEventListener('scroll')`.
* §6 — animate only `transform` and `opacity`; apply `backdrop-blur` only to fixed or
  sticky elements; put grain only on a fixed, `pointer-events: none` layer; keep z-index
  on a documented scale.

**How it was applied**

* Type: **Archivo Variable** (weight 100–900, width 62–125 %) and **JetBrains Mono
  Variable** — self-hosted, no banned family, no display serif.
* Shadows: `--shadow-deep` / `--shadow-lift` are tinted to the page hue and kept
  diffuse, never a hard black drop shadow.
* Layout: no two adjacent chapters share a layout family, and there is no
  three-equal-card row anywhere on the page.
* Easing: four shared custom curves in `src/styles/tokens.css`
  (`--ease-out-expo`, `--ease-in-out-quint`, `--ease-out-back`, `--ease-smooth`); no
  `linear` or `ease-in-out` keyword is used for a transition.
* Reveals: `src/core/reveal.ts` uses `IntersectionObserver`; scroll-linked work uses
  ScrollTrigger. The only `scroll` listener is a passive, rAF-throttled header observer
  (`src/core/reveal.ts`), and it does not drive layout.
* Grain: `.grain` is `position: fixed; inset: 0; pointer-events: none`.
* Z-index: a documented scale in `tokens.css` — `--z-base 1`, `--z-sticky 40`,
  `--z-nav 60`, `--z-grain 90`, `--z-overlay 80`, `--z-cursor 95`.

**Validation** — `scripts/smoke-test.mjs` asserts the reduced-motion media query exists,
that `safe-area-inset` is used, that focus-visible styles exist, that `outline: none`
appears only inside a `:focus:not(:focus-visible)` guard, and that every `setInterval` is
matched by a `clearInterval`. `npx tsc --noEmit` and `npx vite build` are clean.

**Deviation, stated openly** — §4.A "Double-Bezel" nested card architecture was *not*
applied. DENVUP uses a flatter, rule-based card system with hairline borders and four
radius steps (6 / 14 / 26 / 999). The double-bezel treatment reads as a specific house
style, and copying it would have made the page look derivative. §5.A "floating glass pill"
navigation was also not applied — the header is a full-width bar that changes contrast
over dark chapters instead.

### 2.2 `design-taste-frontend-v2-experimental/SKILL.md`

**Guidance used**

* §4.1 Typography — serif is *very discouraged* as a default; `Fraunces` and
  `Instrument Serif` are named as banned defaults; emphasis should be a weight or style of
  the same family, not a mixed-family word.
* §4.2 Color Calibration — one accent, saturation under 80 %, "THE LILA RULE" (no
  AI-purple glow), **COLOR CONSISTENCY LOCK** (one accent used on the whole page), and
  the premium-consumer palette ban on warm cream + brass + espresso.
* §4.4 — shape consistency lock: one corner-radius scale for the page.
* §4.5 — full interactive state cycles (loading, empty, error), button contrast check
  (WCAG AA), CTA label must not wrap, **no duplicate CTA intent** on one page.
* §4.6 — label above input, helper text in markup, error text below the input, never a
  placeholder as a label.
* §4.7 — hero fits the first viewport, hero top padding capped, max 4 hero text
  elements, navigation on a single line, **section-layout-repetition ban** (a layout
  family appears at most once), **eyebrow restraint** (max 1 eyebrow per 3 sections),
  split-header ban, explicit mobile collapse per section.
* §5.D / §6.A — `window.addEventListener('scroll')` is banned; animate only `transform`
  and `opacity`.
* §6.B — reduced motion is mandatory: infinite loops, parallax and magnetic physics must
  collapse to static.
* §6.E — grain only on fixed, `pointer-events: none` layers; lazy-load anything that is
  not above the fold (Three.js is the case that matters).
* §6.F — z-index restraint.

**How it was applied**

* No serif anywhere. The one display face is Archivo Variable. The wordmark is set in
  Archivo, not in a display serif.
* Palette: the ember family is **sampled from the studio's own supplied
  `logo_color.png`**, not from any default. Signal blue `#2B39E6` is the single reserved
  accent for data and interaction; it appears in exactly one chapter substrate and in
  the diagram strokes, never as a competing CTA colour.
* Shape consistency: one radius scale — `--r-sm 6px`, `--r-md 14px`, `--r-lg 26px`,
  `--r-pill 999px` — applied everywhere, including the library cards, the form fields and
  the buttons.
* Form: every field has a real `<label>`, a helper line, and an error node below the
  input with `role="alert"`. The enquiry form is a four-step flow with an inline
  summary region, not a generic submit box.
* CTA intent: one label per intent across the whole page — "Start a project" is the
  contact CTA everywhere, "Open the library" is the library CTA everywhere.
* Eyebrow restraint: the chapter kickers are numeric indices (`01 — PRELUDE`), which
  encode the actual sequence, so they are information rather than decoration.
* Reduced motion: `src/core/env.ts` → `src/core/motion-control.ts` → `src/core/loop.ts`
  collapse every loop, the smooth-scroll engine and the scroll reveals.

**Deviations, stated openly**

* §4.7's "hero must fit in the initial viewport" is met by the **prelude**, which is
  deliberately minimal. The site then opens a boot sequence and a long scroll narrative,
  which is the brief's own instruction ("a small central object appears, then transforms
  and expands on scroll"). The rule's intent — no CTA hunting, no content overflow — is
  honoured: the prelude's CTA is above the fold and the expansion chapter's is the second
  screen.
* §4.8 "even minimalist sites need real images" could not be followed for client imagery,
  because the studio supplied no photography and inventing client work is forbidden. The
  page's visual weight comes instead from the supplied emblem, a canvas particle system
  that samples the real logo pixels, the SVG atlas, the WebGL scene, and the live demo
  library. That is a deliberate substitution, not an oversight.
* §4.10 (no fabricated testimonials) was treated as a hard rule: there is no testimonial
  section, no client logo wall, and no award claim anywhere on the page.

### 2.3 `frontend-design/SKILL.md`

**Guidance used**

* "Ground your designs in the subject matter."
* "Typography carries the personality of the page… use one family or two."
* "Default to line lengths of less than 80 characters."
* "Avoid these default typographic treatments": accenting a single word in a headline,
  all-caps labels, unnecessary typographic labels above content.
* "Use non-user-triggered motion sparingly and deliberately… a single orchestrated moment
  lands better than scattered effects."
* "Visual structure is information… numbered markers are only appropriate if the content
  really is a sequence."
* The five "AI tell" clusters, especially the tracked-out ALL-CAPS eyebrow above every
  heading, the `A · B · C` middle-dot meta string, `WORD — fragment` labels, tinted
  near-black standing in for black, and a monospace face for small data labels.
* "Spend your boldness in one place… take one more look in the mirror and remove one
  accessory."
* The writing guidance: plain verbs, sentence case, one job per element.

**How it was applied**

* The subject is a studio that builds *moving* websites, so the subject matter is
  motion, and the opening moments are the mark resolving out of particles and the field
  expanding. Nothing about the page is a generic "studio template".
* Two families, clearly distinct: Archivo Variable (display + body) and JetBrains Mono
  Variable (indices, labels, IDs).
* `--measure: 62ch` caps the measure; body copy is set at `1.6` line-height.
* The **one** orchestrated moment is chapter 02 (expansion) and chapter 04 (the mark).
  Everything else answers a visitor action: hover, click, focus, scroll.
* The numbering is real: chapters are a sequence, the atlas nodes are a map, the process is
  a sequence, the technique IDs are a catalogue. The `01/02/03` markers therefore encode
  information rather than decorate.
* The middle-dot meta string and the `WORD — fragment` label were deliberately avoided;
  the page's meta lines use the pipe `|` or a genuine separator, and the mono labels are
  indices and field names, not decoration.
* The page is not a wall of near-black: `--ink` is `#0b0b0c` only because a true black
  would be harsher against the ember, and every ink chapter pairs it with a different
  layout so the dark passages are not repetitive.
* Copy: "Start a project", "Open the library", "Reduce animation on this page" — verbs
  that say what happens. The pricing copy says "indicative" rather than "starting from".

### 2.4 `industrial-brutalist-ui/SKILL.md`

**Guidance used**

* §3.1 macro-typography: massive fluid scale `clamp(4rem, 10vw, 15rem)`, tracking
  `-0.03em` to `-0.06em`, leading `0.85`–`0.95`.
* §3.2 micro-typography: monospace at `10px`–`14px`, tracking `0.05em`–`0.1em`, uppercase,
  for metadata, navigation and unit IDs.
* §4 — "choose ONE substrate palette per project and use it consistently"; the
  dark-mode ground is a deactivated CRT black, **not** pure `#000000`.
* §5 — visible compartmentalisation, hairline rules, bimodal density.
* §6 — ASCII bracketing for data points, technical markers.
* §7 — mechanical noise / grain as a global low-opacity filter.
* §8.1 — grid determinism, `display: grid; gap: 1px` for razor-thin dividers.
* §8.3 — `clamp()` for macro-typography.

**How it was applied**

* `--fs-mega: clamp(4rem, 0.5rem + 17vw, 22rem)` and `--fs-4xl: clamp(3.5rem, 1.1rem + 12vw, 15rem)`;
  display leading `0.92`–`1.02`, tracking `--tracking-tight: -0.045em`.
* All metadata, chapter indices, technique IDs and field names are JetBrains Mono at
  `--fs-micro`/`--fs-xs` with wide tracking and uppercase.
* The atlas chapter and the library are the two "Swiss industrial" surfaces: hairline
  rules, mono metadata, dense tabular layout, ASCII-style bracket framing on the
  technique detail panel.
* `--ink: #0b0b0c` is deliberately not `#000000` — the same "deactivated CRT" reasoning.
* Grain is a fixed, `pointer-events: none` `feTurbulence` layer at `opacity: 0.32` with
  `mix-blend-mode: overlay`, applied to the document root only.
* The atlas and the library use explicit `1px` rules and grid tracks rather than card
  shadows, so the surfaces read as engineering drawings rather than as web cards.

**Deviations, stated openly** — the skill demands a **single** substrate per project and
bans mixing light and dark. DENVUP deliberately mixes them, because the brief requires
"a full-screen colour field… then continues through varied light/dark/colour chapters".
The resolution is that the mixing is *structural*: each chapter is a separate, fully
scoped substrate with its own token set, and no component inherits across a chapter
boundary. The "one accent" rule survives in full — ember is the only brand accent, and
signal is the only data accent.

### 2.5 `theme-factory/SKILL.md`

**Guidance used** — the skill offers ten pre-set themes and says: *"When none of the
existing themes work for an artifact, create a custom theme… Give it a similar name
describing what the font/color combinations represent."*

**How it was applied** — the ten stock themes (Ocean Depths, Sunset Boulevard, Forest
Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert Rose, Tech Innovation,
Botanical Garden, Midnight Galaxy) were **not** applied. A studio website whose entire
identity is the supplied emblem must use the brand's own colour, and a stock theme would
have replaced it. A custom theme was defined instead and documented in
`src/styles/tokens.css`: *Ember Field* — substrates paper `#EDEEEA`, ink `#0B0B0C`, ember
`#F0490F`, signal `#2B39E6`; type Archivo Variable + JetBrains Mono Variable; radii
6/14/26/999; four shared easing curves.

**Validation** — every colour pair in that theme is asserted against its WCAG target in
`scripts/smoke-test.mjs` (ten pairs, all passing).

### 2.6 `minimalist-ui/SKILL.md`

**Guidance used**

* §2 banned defaults: Inter/Roboto/Open Sans, generic thin-line icon libraries, heavy
  drop shadows, primary-coloured backgrounds for large sections, gradients and neon,
  `rounded-full` for large containers, **emoji anywhere**, placeholder names, and the AI
  copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer",
  "Delve").
* §3 — body text must never be absolute black; monospace for metadata.
* §5 — FAQ items separated by a bottom rule rather than boxed; `<kbd>` for shortcuts.
* §7 — animate only `transform` and `opacity`; `will-change` sparingly; reduced motion
  mandatory.

**How it was applied**

* No emoji anywhere in the markup or copy — the smoke test can be extended to check this,
  and the audit below records that it was checked by grep.
* The FAQ chapter uses a rule-separated disclosure list with a `+`/`−` toggle, exactly as
  specified, and no card boxes.
* Keyboard shortcuts are rendered as `<kbd>` inside the shortcut guide.
* No "Elevate / Seamless / Unleash / Next-Gen / Game-changer / Delve" appears in the copy.
* Body text is `--fg-on-paper: #0b0b0c` rather than `#000000`.
* All icons are hand-drawn inline SVG primitives on a single stroke weight — no icon
  library is installed, so the "generic thin-line icon library" default is avoided by
  construction.

**Deviations, stated openly** — the skill bans "primary coloured backgrounds for large
sections", and DENVUP has two full-bleed ember chapters. The brief explicitly asks for a
"full-screen colour field" and "varied light/dark/colour chapters", so the brief wins;
the ember is the brand colour, not a generic primary.

### 2.7 `canvas-design/SKILL.md` and `3d-motion-creative/algorithmic-art/SKILL.md`

Both are written for **static artefacts** — a canvas PNG/PDF, or a p5.js sketch in a
standalone HTML file with a seed sidebar and Anthropic-branded template. Neither produced
a file in this project.

**Guidance that transferred**

* *canvas-design* §"ESSENTIAL PRINCIPLES": "Minimal text", "spatial expression",
  "artistic freedom", "expert craftsmanship", and the line *"nothing overlaps, everything
  is contained within the canvas boundaries"*. Applied as layout discipline: the type
  laboratory, the atlas and the library panels all have explicit containment, no overlap,
  and text that is sparse and structural rather than paragraph-heavy.
* *algorithmic-art* §"ESSENTIAL PRINCIPLES": **seeded randomness** for reproducibility,
  a **parameter structure** with tunable controls, "process over product", and
  "no visual noise, only controlled chaos". Applied to the particle systems and the
  shader demos, which are parameterised (count, speed, colour, density) and reproduce the
  same composition on every run; and to the mark chapter, where the particles converge on
  the actual sampled pixels of the supplied emblem rather than on a random shape.

**What did not transfer** — the fixed Anthropic template, the p5.js dependency, the
seed-navigation sidebar and the `PHYSICS`/`DEATH` style naming. DENVUP is a production
site, not a generative-art artefact, and importing those would have violated the brief.

### 2.8 `modern-web-design/SKILL.md`

**Guidance used**

* "Accessibility Best Practices" §1–§5 — reduced motion (CSS and JavaScript), WCAG
  AAA for body text, keyboard navigation with visible focus, skip links, `Esc` closes
  modals, semantic landmarks, `aria-live` for dynamic content, 44×44 px touch targets
  with 8 px spacing.
* "Performance Optimization" §1–§5 — transform/opacity only, `will-change` sparingly,
  rAF for JS animation, progressive enhancement, lazy-load 3D content below the fold,
  bundle size awareness.
* "Common Pitfalls" §1–§6 — over-animation, mobile performance, missing fallbacks,
  accessibility oversight, loading states, and **Pitfall 6 "Scroll Hijacking"**:
  "Preserve browser's native scroll… Use ScrollTrigger/Locomotive without changing
  scroll physics… Never disable scroll entirely."
* "Design System Architecture" — CSS custom-property token structure, one duration scale,
  natural easing.

**How it was applied**

* Reduced motion is honoured in CSS *and* in JavaScript, and the JavaScript side is the
  one that matters because the motion is GSAP-driven.
* Touch targets: buttons, list rows, the dock, the to-top control and the library chips
  all carry a minimum height of 44 px or more, and the tap state is a visible press, not
  a hover-only effect.
* `aria-live="polite"` is used for the enquiry summary and the copy confirmation;
  `role="alert"` for field errors.
* **Scroll hijacking was explicitly avoided.** Lenis supplies inertia only; the document
  keeps native scrolling, so the scrollbar, the keyboard, the mouse wheel and find-in-page
  all work as the browser intends. There is no full-page scroll snap, no forced
  horizontal scroll on small screens, and the horizontal rails in the process and library
  chapters degrade to vertical stacks below 900 px.
* The 3D chapter and the Three.js demos are dynamically imported and are only fetched
  when the visitor reaches them.
* `will-change` is not used at all; the only GPU hint in the project is `transform` and
  `opacity` on moving elements, and `backdrop-filter` appears only on the fixed header,
  the menu and the command panel.

**Deviation, stated openly** — the skill asks for WCAG **AAA** (7:1) body text. On the
paper substrate, `--fg-on-paper #0B0B0C` against `--paper #EDEEEA` is 16.9:1, so AAA is
met for body copy; the muted tone `--fg-soft #5C5E57` is 5.6:1, which is AA but not AAA.
AAA is met on the ink substrate (`#A3A49C` on `#0B0B0C` is 7.8:1). The muted tone is
reserved for secondary metadata, and the smoke test asserts the target for each pair
explicitly rather than claiming a blanket AAA.

### 2.9 `3d-motion-creative/threejs-webgl/SKILL.md`

**Guidance used**

* Scene graph: Scene → Camera → Lights → Meshes.
* Three-point lighting: key + fill + ambient.
* `InstancedMesh` for repeated objects.
* **Common Pitfall 1: "Not Updating Aspect Ratio on Resize"** — "Always update camera
  aspect ratio and projection matrix when window resizes."
* **Common Pitfall 5: "Color Space Issues"** — set `texture.colorSpace =
  THREE.SRGBColorSpace` and `renderer.outputColorSpace = THREE.SRGBColorSpace`.
* **Common Pitfall 6: "Not Disposing Resources"** — always call `dispose()` on
  geometries, materials, textures and renderers.
* Performance: reuse geometry, use `THREE.Clock`/delta-time, frustum culling, LOD.
* Camera guidance: FOV 45–75, near plane as far as possible, far plane as close as
  possible.
* "Do not create new objects in the animation loop" — memory leak.

**How it was applied**

* `src/sections/spatial.ts` and `src/demos/three.ts` both build a Scene → Camera →
  three lights → Meshes graph, with a warm key light, a cool fill light and an ambient
  light, matching the key/fill/ambient recipe.
* **The aspect-ratio pitfall was found and fixed during this build.** Both files now
  compare `camera.aspect` against the fitted canvas ratio each frame and call
  `camera.updateProjectionMatrix()` when it changes, and both set
  `renderer.outputColorSpace = THREE.SRGBColorSpace`.
* Disposal is centralised: `src/demos/three.ts` keeps a `disposables` list, every
  geometry, material and texture is registered on it, and the teardown disposes them all
  inside a `try/catch` so one failure cannot break the rest. `src/sections/spatial.ts`
  disposes the geometry, the material, the wireframe, the PMREM environment texture and
  the renderer.
* The PMREM environment map is skipped on small screens, and the icosahedron uses a lower
  subdivision (`1` instead of `3`) under 768 px.
* No geometry is allocated inside the render loop; the wave demo mutates a pre-allocated
  `Float32Array` instead.

### 2.10 `3d-motion-creative/gsap-scrolltrigger/SKILL.md` (partial read)

**Guidance used** — from the sections that were read: basic tween and timeline
construction, the position parameter, `start`/`end` positions, **scrubbing**, toggle
actions, fade-in-on-scroll, **pinning**, horizontal scroll sections, parallax, scroll-
triggered timelines, `batch()` for many elements, staggered animations, GSAP + Three.js
integration, smooth scroll to element, conditional animations via media queries, and the
performance list: `will-change`, limiting repaints, **disposing ScrollTriggers**,
debouncing resize, `invalidateOnRefresh`, and the pitfalls: multiple tweens on the same
element, forgetting to register plugins, nested ScrollTriggers in timelines.

**How it was applied**

* `gsap.registerPlugin(ScrollTrigger)` happens once, in `src/core/motion.ts`.
* Every tween is created inside a `gsap.context()` (`createContext` in
  `src/core/motion.ts`), so `ctx.revert()` removes listeners and inline styles on
  teardown — this is how the HMR teardown in `src/main.ts` stays clean.
* `ScrollTrigger.getAll()` is walked on teardown (`killAll`).
* `refreshTriggers()` is called after `document.fonts.ready` and after a 600 ms settle
  timer, and on resize, because the webfonts change every measurement.
* Elements that are revealed as a group use `stagger`, and the library grid uses `batch`
  semantics through a single trigger rather than one trigger per card.
* The horizontal rails are implemented as **native horizontal scroll containers** driven
  by ScrollTrigger, not as a scroll-jacked page transform.

**Limitation** — lines 561–766 of the skill (the tail of the performance section, the
remaining pitfalls and the easing reference) were not read. Nothing in the implementation
depends on that unread portion, but it is not claimed as consulted.

**A note on what the unread tail did *not* cover.** The single most damaging
animation bug in this project — a route transition that took twelve seconds
under CPU load — was **not** described anywhere in the portion of the skill that
was read. The skill's performance list is about `will-change`, repaints,
ScrollTrigger disposal and resize debouncing; none of those was the cause. The
cause was GSAP's own ticker default, `lagSmoothing(500, 33)`, which clamps any
frame longer than 500 ms to a 33 ms advance, so a 0.96 s wipe took roughly ten
seconds on a loaded machine. The fix is one line in `src/core/motion.ts`:

```ts
gsap.ticker.lagSmoothing(0);
```

It is recorded here because the skill's silence on the subject is itself the
useful finding: the guidance that was read did not cover the failure that
actually happened, and the diagnosis loop in §2.16 is what found it.

### 2.11 `3d-motion-creative/locomotive-scroll/SKILL.md` (partial read)

**Guidance used** — the overview, the HTML structure, initialisation, data attributes,
basic smooth scrolling, parallax, viewport detection, sticky elements, programmatic
scrolling, horizontal scrolling, mobile responsiveness, the GSAP ScrollTrigger
integration pattern (`scroll.on('scroll', ScrollTrigger.update)`, `scrollerProxy`),
the instance methods (`init`, `update`, `destroy`, `start`, `stop`, `scrollTo`, `on`,
`off`) and the performance guidance: segment long pages, limit parallax elements,
**disable smoothing on mobile when performance is poor**, update on resize, and destroy
when not needed.

**How it was applied**

* DENVUP uses **Lenis** rather than Locomotive Scroll, because Locomotive Scroll
  transforms a scroll container and therefore changes the scroll physics — which the
  brief forbids and which the `modern-web-design` skill also forbids under Pitfall 6.
  Lenis adds inertia to the existing native scroll and leaves wheel, touch, keyboard,
  scrollbar and find-in-page alone.
* `lenis.on('scroll', ScrollTrigger.update)` is wired exactly as the skill's integration
  pattern prescribes.
* Smoothing is disabled entirely when reduced motion is requested, and `syncTouch` is
  `false` so touch scrolling is never smoothed.
* `pauseOnHidden()` stops the engine and sleeps the GSAP ticker when the tab is hidden.
* `destroySmoothScroll()` cancels the rAF and destroys the instance on teardown, per the
  skill's "destroy when not needed".

**Limitation** — lines 181–261 and 382–481 were not read.

### 2.12 `testing-quality-security/webapp-testing/SKILL.md` and `playwright/SKILL.md`

**Guidance used**

* webapp-testing: drive the app with Playwright against a locally started server; the
  "reconnaissance-then-action" pattern; **wait for `networkidle` before inspecting the
  DOM**; always close the browser; use descriptive selectors; use the bundled
  `scripts/with_server.py --help` helper.
* playwright: a real browser is required; check `npx` first; snapshot before referencing
  element ids; re-snapshot after navigation; capture traces and console output;
  `references/workflows.md` for the standard loop.

**What actually happened, first attempt** — the browser could not be obtained.
`npx playwright install --with-deps chromium` and a plain `npx playwright install
chromium` both failed (the first because required system libraries are unavailable, the
second with `Download failure, code=1`), `~/.cache/ms-playwright` does not exist, and no
chromium/chrome/firefox binary is on the system. `import playwright` fails in Python.
The Playwright workflow was replaced by a jsdom harness that performs the same logical
checks — DOM inspection, mounting, teardown, link resolution — without a rendering
engine.

**What actually happened, second attempt** — a browser *was* obtained, and the skills'
method was applied with a different driver. `@sparticuz/chromium` ships a Chromium 153
binary and `puppeteer-core` drives it; the library's shared libraries (`libnspr4.so`,
`libnss3.so` and friends) are unpacked from the package's `al2023.tar.br` archive and
put on `LD_LIBRARY_PATH`. Every practice the two skills prescribe is followed:
headless Chromium, **wait for the network to settle before inspecting the DOM**,
*reconnaissance-then-action* (the selectors were read out of the rendered DOM, not
guessed — the library drawer's real control is `.library__card-open`, and the palette's
rows are `.cmdk__result`, not the `a` the CSS assumed), and the browser is always
closed.

**Validation actually performed** — `scripts/browser-check.mjs`, **209 checks**:
no overlay painted over the page at nine viewports; exactly one enquiry step shown; the
opening chapter visible at full opacity; no horizontal overflow at 1440/1185/390 px; all
sixteen chapters painting; the WebGL field, the Three.js scene, the mark chapter's
particle field and a library demo canvases screenshotted through the compositor and
their pixels read back; zero console errors, zero page errors, zero failed requests; the
library drawer, the command palette (on `/` and on ⌘K), the mobile menu and the enquiry
wizard driven and asserted; and a final pass with the CPU throttled 6× and the network
limited to 400 kbit/s with 300 ms of latency, in which the page still reached a usable
state in 5.8 s.

**Limitation** — the driver is Puppeteer, not Playwright, because Playwright's browser
cannot be downloaded here. The skill's *method* is followed; its toolchain is not. A
physical handset, a screen reader and a real GPU are still out of reach, and
`TESTING_REPORT.md` §5 lists each one.

### 2.13 `general-workflow/screenshot/SKILL.md`

**Guidance used** — prefer a tool-specific capture; on Linux the helper needs `scrot`,
`gnome-screenshot` or ImageMagick `import`; region capture needs `scrot` or
ImageMagick; always report the saved file path.

**What actually happened** — ImageMagick's `import` and `convert` are present, but
`DISPLAY` is empty, there is no X11 socket, and there is no X server of any kind
(`Xvfb`/`xvfb-run` are not installed), so an OS-level capture still has no display to
capture. The skill's own first rule — *prefer a tool-specific capture* — is the one that
applies here: the browser renders the page, and the screenshot is taken **by the
browser** with `page.screenshot()`, which needs no display server at all. Every capture
is written to `screenshots/` and the path is reported, as the skill requires.

The difference from the OS-level path matters: a compositor screenshot includes WebGL
and canvas output, which is precisely what the OS-level tools could never have
captured here.

### 2.14 `engineering-workflow/codebase-design/SKILL.md`

**Guidance used** — the vocabulary is mandatory in its own terms: **module**, **interface**,
**implementation**, **seam**, **adapter**, **depth**, **leverage**, **locality**; and the
principles: depth is a property of the interface; the deletion test; the interface is the
test surface; one adapter means a hypothetical seam; accept dependencies rather than
create them; return results rather than produce side effects; keep the surface small.

**How it was applied**

* The **seam** for the whole project is the `Demo` interface in `src/demos/types.ts`:
  `mount(ctx) → teardown`. A caller (the library chapter, the smoke test) learns one
  signature and can exercise every demo through it. That single interface is what makes
  149 demos testable by one loop.
* `src/core/env.ts` is a **module** behind a small interface (`env.reducedMotion`,
  `env.budget`, `env.webgl`, …) whose implementation hides the media queries, the device
  heuristics and the manual override — three callers get the answer without knowing how
  it is computed.
* `src/core/motion.ts` is the single animation seam: GSAP, ScrollTrigger, the shared
  easing vocabulary and the shared durations all live behind `createContext`,
  `revealOnScroll`, `refreshTriggers` and `killAll`. No other file imports GSAP directly
  except `easter.ts` (which uses it for a single emphasis tween) and `main.ts`.
* `src/core/loop.ts` is the render seam shared by eighteen call sites: one `createLoop`
  options object, one returned handle, and one `destroy()` that releases the rAF, the
  IntersectionObserver and the two event listeners. This was extended during the build
  precisely so that the in-page motion switch could stop and restart every loop through
  one interface.
* **Leverage** — the deletion test applied to `src/core/loop.ts`: deleting it would put
  rAF bookkeeping, visibility handling, offscreen pausing, budget scaling and teardown
  into eighteen places. It earns its keep.
* The `library` chapter consumes `src/demos/registry.ts` — `allDemos`,
  `demoById`, `demosByTechnique`, `demosForCategory`, `searchDemos` — without knowing
  which module a demo came from.

### 2.15 `AI_Skills_Pack/Website_Animation_Interaction_Encyclopedia.md`

All 480 numbered techniques across 21 categories were read in full before any
implementation. The build answers it directly:

* `src/data/techniques.json` and `ANIMATION_COVERAGE_MATRIX.md` are generated from
  `scripts/techniques.py` by `scripts/gen-coverage.py`, so the matrix can never drift
  from the source of truth.
* Status vocabulary: **Tested**, **Blocked** (a verified technical limitation, with the
  reason and the closest safe alternative recorded), **Requires revision**, **Planned**.
* Current totals: **480 total — 459 Tested, 17 Blocked, 4 Requires revision, 0 Planned.**
* The 17 Blocked entries are asset-, permission- or router-dependent (video and audio
  playback, camera permission, a studio floor plan, a client-side router); each one
  records the specific reason in the matrix.
* The 4 "Requires revision" entries are 199, 288, 458 and 470 — techniques that are
  implemented but whose visual result did not reach the intended standard in the
  available environment, and which are therefore called out rather than quietly claimed.

---

### 2.16 `testing-quality-security/diagnosing-bugs/SKILL.md`

**Guidance used**

* *Phase 1 — build a feedback loop first.* "Build the right feedback loop and the bug is
  90 % fixed", and a loop is only done when it is **red-capable** (it asserts the user's
  exact symptom), deterministic, fast and agent-runnable.
* *Phase 2 — reproduce and minimise.* Confirm the loop fails with the symptom the user
  described, not a nearby one; shrink the repro until every remaining element is
  load-bearing.
* *Phase 3 — hypothesise.* 3–5 ranked, falsifiable hypotheses before testing any of
  them, each with a stated prediction.
* *Phase 4 — instrument.* One probe per hypothesis, one variable at a time; never "log
  everything and grep"; tag debug output so it can be removed afterwards.
* *Phase 5 — fix and add a regression test.* Write the regression test first, watch it
  fail, apply the fix, watch it pass, re-run the original loop.
* *Phase 6 — cleanup.* Remove the instrumentation and the throwaway prototypes; state
  the hypothesis that turned out to be correct.

**What actually happened**

The reported symptom — "a near-black page with a hard vertical edge" — was reproduced
exactly in a headless Chromium before anything was changed: the same dark right-hand
panel, the same blurred left-hand region, the same 15-pixel gutter.

The feedback loop came first, as the skill insists. `scripts/browser-check.mjs` was
written to assert the symptom directly — *no overlay may be painted over the page* — and
it went red on the first run, in every viewport, naming `.guide` and `.library__detail`
as the two visible overlays.

The hypotheses were then ranked and tested one at a time: (1) the overlays are open by
default; (2) their `hidden` attribute is not honoured; (3) something is painting a
fixed panel; (4) the boot overlay never lifts. `document.elementsFromPoint` and a
computed-style dump separated them in one probe: the overlays were present **and
hidden**, but their computed `display` was `grid` — which is hypothesis 2, and it
explains the symptom exactly, because a canvas that never draws is indistinguishable
from a black one.

The same loop then found the deeper defect behind it. The pixel sampler was added
because "a canvas that initialises but never draws is indistinguishable from a working
one until you look at the pixels" — and the WebGL panel came back black. Instrumenting
the canvas (backing-store size, `gl.viewport`, `readPixels`) showed the draw callback
had never run at all, which pointed at the shared render loop and, in it, at a time
baseline that was never advanced.

**Validation actually performed** — the regression tests the skill asks for exist as
checks in `scripts/browser-check.mjs`: the overlay assertion, the pixel samplers, the
console-error capture, the menu-contrast measurement, the enquiry-group assertions and
the throttled pass. Each was watched fail before its fix and pass after it, and each
now guards the defect permanently.

**Limitation** — the skill asks for 3–5 ranked hypotheses to be *shown to the user*
before testing. This session ran unattended, so the ranking was applied internally and
the ranked list is recorded here instead. No hypothesis was tested by changing more
than one variable at a time, and no debug instrumentation was left behind: the
throwaway probe scripts were deleted, and the only permanent additions are the checks
themselves.

### 2.17 `ui-ux-design/design-taste-frontend/SKILL.md` and its inspector

**Guidance used**

The skill's law, as written in the file: *"the page must not be a template with a
logo on it"*. Its concrete rules that this build was measured against:

* *Type.* Display tracking between −0.02 and −0.05 em, leading 0.85–1.05, body
  16–20 px at 1.45–1.6, a measure of 45–75 characters, and **five sizes on a
  page is the ceiling**.
* *Layout.* One grid, one pair of tight margins, a section gap larger than any
  gap inside a section, and **each section composed differently from its
  neighbour** — no shared card grid.
* *Surface.* One ground, one ink, one accent; flat buttons; square corners; no
  shadows on things that do not float.
* *Imagery.* **One dominant image**, not a texture of thumbnails.
* *Motion.* Press 140 ms, hover 180 ms, ui 240 ms, reveal 800 ms; a leaving
  animation at about 70 % of the arriving one; `prefers-reduced-motion` must
  collapse to a static end-state, not to nothing.
* *Rules the inspector enforces.* No gradient fills (a flat colour or a real
  image), no text under 13 px, no more than two lines in a headline, no
  eyebrow label sitting above a heading, no monospace outside code, no
  decorative index numbers, no uppercase letter-spaced micro-labels, no
  hairline rules, no 1 px outlined boxes, no identical card rows, no blurred
  surfaces beyond one, a bounded number of font sizes, no sideways-scrolling
  rows, and at least four real pictures on a wide page.

**What actually happened**

The site was audited with the skill's own inspector
(`scripts/inspect.mjs`) against the built site at 1440 px and 390 px. The first
run reported **14 failures and 8 warnings**. Each was handled one at a time:

| Finding | What was done |
| --- | --- |
| `few-pictures` — 0 pictures | The studio plate (`public/art/plate-01.jpg`) was drawn by `scripts/build-art.py`, placed full-bleed in the manifesto chapter, and each service step in the home page's services chapter was given its own small plate. Six raster images now sit on the home page. |
| `small-text` — 973 blocks under 13 px | The token floors were raised to 13 px, and every hard-coded 9/10/11/12 px size in the shell, the chapters and the route styles was raised to 13 px. The remaining 973 → **0**. |
| `gradient` — 2 gradient fills | The stage's vignette and the 3D panel's wash were flattened to solid tints; the two blueprint grids became SVG data-URI images. |
| `headline-lines` — 3 headlines over two lines | "Every scroll, every cursor move…" → "Every frame is an argument for your business."; "We build websites that behave like the ideas they carry." → "We make websites that behave."; the measure of the studio and manifesto titles was widened to 20 ch. |
| `covered-text` — 4 headlines 100 % hidden | Two real causes: the boot sequence was waiting on `loading="lazy"` images that had never started downloading, and the full-screen film grain was a painted element sitting above the copy. Both fixed; the rest of the finding was the intro curtain being photographed, which is noted as a false positive in `UI_UX_AUDIT.md`. |
| `eyebrow` — 3 labels above headings | The pricing summary now reads across (label left, figure right) instead of down; the estimator is clear of the table above it; the type specimens carry their label beside them, not above them; the range-input labels are now body-size. |
| `button-fx` — a shadowed button at 390 px | The floating contact button's shadow was removed and replaced with a hairline border. |
| `statement-length` — a 5-line statement | The team statement's measure was widened to 70 characters, so it sets in three lines. |
| `side-scroll` — 2 sideways rows at 390 px | The comparison table stacks with each cell carrying its column name; the process rail becomes a vertical list. |
| `mono`, `numbering`, `micro-label`, `hairline`, `outlined-box`, `glass`, `card-rows`, `size-count`, `no-footage`, `blend-text` | **Not fixed — granted a written exemption.** Each one is a deliberate identity decision, recorded with its reason in `.taste-skill/direction.json` and in `UI_UX_AUDIT.md` Appendix C. The inspector's `allow` mechanism is read from that file, so the exemptions are visible in the repository rather than hidden in a command line. |

The final run of the same inspector reports **0 failures and 0 warnings**.

**Deviation** — the five-size ceiling is broken: the site sets nineteen sizes.
Each of the sixteen chapters carries its own display scale, which is what makes
the page move between substrates without repeating a rectangle. The cost is
recorded in `UI_UX_AUDIT.md` as P2-5.

**Deviation** — the skill says "no custom cursor" and "no smooth-scroll
library by default"; the brief requires both. The reasoning and the mitigations
are in `UI_UX_SKILLS_INVENTORY.md` §4.

### 2.18 `ui-ux-design/design-taste-frontend/scripts/lib/rules.mjs`

**Guidance used**

The file is the rule table. Two things in it shaped the work:

* *A rule that fires at most `N` times is a warning, more is a failure.* The
  inspector grades on frequency, so "one gradient" and "eighty gradients" are
  not the same finding. This is why the site was measured, counted and reduced
  rather than judged by eye.
* *`allow` is a first-class input.* `judge()` takes an allow list and skips
  any rule named in it. `inspect.mjs` reads that list from
  `.taste-skill/direction.json`. The exemption is therefore a file in the
  repository with a reason attached, not a flag on a command line.

**What actually happened**

The site was taken from 14 failures to 0 by fixing the measurements the file
asks for, and by writing down the ten decisions that remain. The `allow` list
was written *after* the fixes, and each entry names the specific element the
rule was about — "the monospace technical layer", "the chapter index", "a
hairline is the only separator used" — so a reader can check the claim against
the page.

**Limitation** — the rule file is a set of heuristics written for a
photographic, single-page portfolio. Several of them (one dominant image, a
maximum of two lines in a headline, no monospace outside code) are stated as
laws but are genre conventions. Where the site breaks one, it says so.

### 2.19 `ui-ux-design/design-taste-frontend/scripts/lib/probe.mjs`

**Guidance used**

The probe is the measurement instrument, and reading it changed what was
measured:

* *A text block is identified by the element that holds it.* `blockOf()` climbs
  from a text node to the nearest `h1–h6, p, li, a, button, blockquote, dt,
  dd, figcaption, td, th, label, summary` — so a label inside a card is
  measured as a label, and a `<p>` inside a card is measured as a paragraph.
* *`linesOf()` counts client rects, not visual lines.* A headline split into
  per-word spans therefore reports one line per distinct vertical band.
* *`smallText` counts a text block only if it is at least 12 characters long
  and is not inside `[data-ui]` or a code element.*
* *`realPictures` counts an `<img>` only when `naturalWidth > 0` and the
  element is at least 120 × 90 and 160 × 120 in area, and counts a background
  `url()` that is not an SVG.*
* *`paints()` decides whether a hit-test result really covers text* by walking
  the hit element's ancestors for a background image or an opaque colour.

**What actually happened**

Reading the probe turned three findings into precise diagnoses rather than
guesses:

* The doubled headline text ("We make websites that behave. We make websites
  behave.") was the `visually-hidden` copy of a split heading, which
  `innerText` counts. `splitText()` now puts the sentence in the heading's
  `aria-label` for heading elements, which removes the duplicate from the
  document and keeps the accessible name.
* The `covered-text` finding named the full-screen grain overlay, and the
  `paints()` walk showed that the overlay's *own* background image was the
  thing painting over the headline. Moving the texture to `.grain::after`
  keeps the rendering and removes the painted box.
* The `few-pictures` rule needs four raster images at 1100 px and wider, which
  is why the studio plate and the five service plates were raster images in
  the document, not CSS backgrounds.

### 2.20 `ui-ux-design/impeccable/reference/audit.md`

**Guidance used**

* *Five dimensions, each scored 0–4, with the score bands written out.*
* *Implementation integrity is the dimension to start with.* "Does the
  implementation express a coherent product-specific system?" — with a
  pass/fail verdict before the summary.
* *"Run the bundled detector and verify each finding in context. Keep
  deterministic findings separate from visual judgment and call out false
  positives."*
* *Every finding is tagged P0–P3, with location, category, impact, the
  standard it violates, a specific recommendation and a suggested command.*
* *"Report false positives without verification" is listed under Avoid.*

**What actually happened**

`UI_UX_AUDIT.md` follows that structure exactly: the health-score table, the
implementation-integrity verdict with its evidence, the executive summary, the
findings by severity, the patterns section, the positive findings and the
recommended actions.

The reference also says to run the bundled detector. **It could not be run**:
`impeccable detect` downloads a binary from `release-assets.githubusercontent.com`,
which this sandbox blocks (`curl` exits 35, `SSL_ERROR_SYSCALL`). Rather than
present the absence as a pass, the audit states plainly which tools ran, which
did not, and that the findings come from the first-party inspector and from
measurements taken in a real browser.

**Deviation** — the recommended commands are written as the `$impeccable …`
set the reference prescribes, but none of them was executed: the CLI is not
installed in this environment and its detector cannot be fetched. The findings
were fixed directly in the source instead.

### 2.21 `3d-motion-creative/barba-js/SKILL.md` — the multi-route build

**Why this skill was consulted.** The brief requires "real transitions with a
persistent shell" and gives an explicit route-to-route transition table. Barba.js
is the reference implementation of exactly that model. The **architecture** was
adopted; the **library** was not, because the site ships vanilla TypeScript and
Barba would have added a dependency to solve a problem the router already solves.

**Guidance used**

* *The wrapper / container / namespace split.* `data-barba="wrapper"` holds
  everything persistent — header, footer, cursor, stage; `data-barba="container"`
  holds the part that is replaced; `data-barba-namespace` identifies the page.
* *The transition lifecycle:* `before → beforeLeave → leave → afterLeave →
  beforeEnter → enter → afterEnter → after`, with the promise returned by each
  hook awaited before the next phase begins.
* *Rules keyed by `from` / `to`, with a designed `default` fallback.*
* *Async flow versus sync flow.* The async form is the default; `sync: true`
  overlaps the two halves.
* *The listed pitfalls:* forgetting to return the animation promise; the new
  page flashing before its enter animation starts; CSS bleeding between pages;
  and the document title and meta tags not being updated on navigation.

**How it was applied**

| Guidance | Application | Where |
|---|---|---|
| Wrapper / container / namespace | A persistent `<div id="shell">` holds the header, the menu, the command palette, the cursor, the grain, the progress bar, the stage canvas and the dock. A swappable `<main id="view">` holds everything the route owns. `data-view` names the current route. | `src/core/shell.ts`, `src/core/router.ts`, `vite.config.ts` (`shellPlugin`) |
| The eight-phase lifecycle | The router's transition contract is exactly these phases, so a transition has one place to prepare, one to animate out, one to animate in and one to clean up. | `src/core/router.ts`, `src/transitions/index.ts` |
| Rules keyed by `from` / `to`, with a designed default | The brief's transition table is an ordered rule list — first match wins — and `stack-default` is itself a designed transition, not a fade. | `src/transitions/index.ts` |
| Sync versus async | The shape-wipe, colour-wipe and panel-overlap rules overlap; the card-expand and curtain rules are sequential. | `src/transitions/index.ts` |
| "Forgetting to return promises" | Every `leave`/`enter` hook returns a promise and the router awaits it, under a 9 s watchdog so a stuck animation can never lock the site. | `src/core/router.ts` |
| "Animation flicker on enter" | The incoming view is set to its pre-animation state in `beforeEnter`, in the same frame as the swap, and the shell is never hidden. | `src/core/router.ts`, `src/transitions/index.ts` |
| "CSS conflicts between pages" | All route-scoped CSS is written against `[data-view="…"]`, and the view attribute is swapped before the enter animation runs. | `src/styles/routes.css` |
| "Not updating the title and meta tags" | The router rewrites `document.title`, the meta description, the canonical link and the Open Graph tags on every navigation, and on Back. | `src/core/router.ts` |

**Validation.** `scripts/route-check.mjs` (103 checks) drives every designed
route pair in a real Chromium and asserts that the transition that ran is the
one the table names — the router writes the rule's name onto
`document.documentElement` as `data-transition`, so the check reads what
actually happened rather than inferring it from timing. It also asserts that no
transition name matches `fade`, `crossfade` or `dissolve`, that Back plays the
journey's own rule **in reverse** (`data-direction="back"`), and that the shell,
the stage canvas, the cursor and the dock are the *same DOM nodes* after the
swap as before it.

**What was not adopted, and why.** Barba's own runtime, its `data-barba` attribute
protocol and its `prevent/refresh` cache are not in the build. The site needs
the persistent shell, the transition lifecycle and the direction-aware rules;
it does not need a second router, and the brief asks for the lightest dependency
set that solves the problem.

### 2.22 The feedback layer — `frontend-design` and the motion reference

**Why these two were consulted.** The brief for this pass was "analyse a feature
and strategically add animations and micro-interactions". The site is already
heavily choreographed — eight route transitions, 149 demonstrations, a persistent
stage — so the question was never "add more motion" but "where is motion missing,
and what is the *one* moment worth spending on". Both skills answer that
question directly, and both constrain the answer.

**`frontend-design` — what it said, and what was done**

| Its guidance | How the pass was shaped |
|---|---|
| *"Use non-user-triggered motion sparingly and deliberately… A single orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects"* | The pass produced **one** signature moment — the "I want this" button *writing the technique's reference into the visitor's brief in front of them* — and everything else is a small, disciplined acknowledgement. No new ambient motion was added anywhere. |
| *"fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated"* | Nothing was added to the scroll choreography. The sixteen chapters, the per-chapter reveals and the 149 demonstrations were left exactly as they were. |
| *"Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed."* | This is the pass's whole thesis. Every new motion answers an action and **shows what changed**: a trace around a chosen row, a drawn tick on a copied reference, a rule under a rejected field, a figure that travels to its new value. |
| *"Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined."* | The acknowledgement vocabulary is deliberately quiet — a hairline, a tick, a rule — and the loud thing is reserved for the one moment. |
| *"Treat failure and emptiness as moments for direction, not mood."* | A rejected field rules itself and the message says what to do; nothing apologises and nothing is vague. |
| *"A CTA says exactly what happens when it is used."* | The copy was checked in the same pass: "Copy the reference" → "Copied"; "I want this" → "Added to your brief — DENVUP-T017, DENVUP-T018"; "Export this view" → "Exported". |
| *"Critique your own work as you build, taking screenshots to review if your environment supports it."* | The reject rule was verified by **screenshotting the field and counting the painted pixels** (287 of 293 px at 45 ms), because a computed-style reading turned out to be unreliable — see the note in §2.23. |

**`design-taste-frontend/references/motion.md` — what it said, and what was done**

| Its guidance | How the pass was shaped |
|---|---|
| *The budget has four parts: one signature moment, choreographed section entrances, feedback under the hand, one moving picture.* | The pass added **only** the third part — "feedback under the hand" — and did not touch the other three. |
| *"Press feedback 100–160 ms. Hover 150–200 ms. Menus and popovers 150–250 ms. Dialogs and drawers 250–450 ms… Leaving is quicker than arriving (about 70 %)."* | `--dur-press: 140ms`, `--dur-register: 240ms`, `--dur-confirm: 320ms`, `--dur-reject: 240ms`, and 300 ms out against 420 ms in for the enquiry's steps — 71 %. Every duration is inside the band the reference names. |
| *`--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` — enters, exits, reveals.* | `--ease-settle` is exactly that curve. |
| *"Bounce and elastic easing"* are banned; *"Bounce or elastic easing on interface elements"* gives generated motion away. | The interface's `back.out(2)` on the enquiry radio was **removed** and replaced with `power3.out`. The one remaining overshoot curve in the codebase, `ease.back`, is now used **only by the demonstration library**, which exists to show what these curves look like — and the code says so. |
| *"prefers-reduced-motion: reduce means fewer and gentler, not none: keep opacity and colour changes, drop travel, scale, parallax and autoplay."* | The reduced path changes the **state** and drops the travel. The trace still traces, the tick still shows, the error rule still draws, the figure still lands on the right number. "No motion" never means "no feedback". |
| *"Animate transform, opacity and clip-path. Animating width, height, top, left, margin or padding forces layout on every frame."* | The whole layer animates `transform`, `opacity`, `background-color`, `border-color` and `color` only. The estimator's figure moves by changing text, never by animating a box. |
| *"Name the properties you animate. transition: all animates things you did not intend."* | Every transition in the new stylesheet names its properties. |
| *"A reveal that never fires and leaves a blank band in the page."* | The acknowledgement strip is `hidden` in the markup and revealed by an explicit class, and the browser check asserts that the strip opens and carries the reference. |

### 2.23 Two defects the motion layer exposed, and one false lead

**`--ease-out` was never defined.** The reference names `--ease-out` as the site's
entering/exiting curve. This codebase *used* it 27 times across `routes.css` — and
never defined it. An undefined custom property does not fall back to the initial
value; it invalidates **the whole declaration it appears in**, so every one of
those transitions had been running on the browser's default `ease` instead of the
studio's curve. The curve is now defined in `tokens.css`, and the 27 declarations
work as they were always meant to. This defect was invisible to the inspector and
to the browser check, because the transitions still *happened* — they just
happened on the wrong curve.

**`--ease-out-quart` was undefined too**, which is how the first version of the
trace animation silently did nothing. The same invalidation rule applies: an
undefined `var()` in an `animation` shorthand makes the entire shorthand invalid.
The lesson is now written into the token file.

**The false lead.** The reject rule is drawn with a keyframe animation, and a
browser *normalises an identity transform to `none`*. A computed-style probe
therefore reported the rule as "not transformed" at every sample, and it looked
like the animation was not running. It was. The screenshot-and-count-the-pixels
probe showed the rule painted 287 px across a 293 px field 45 ms after the class
landed — the animation was simply further along than a computed-style read could
show, because `--ease-out-expo` is very front-loaded. The permanent browser check
now asserts the rule's **geometry and colour** rather than its transform string,
for the same reason.

---

### 2.24 The second feedback pass — and the defect it uncovered

**Why these were consulted.** The brief for the second pass was to sweep the
*whole site* for feedback that was missing, with the goal that every action is
visibly acknowledged. That is a question about interfaces rather than about
animation, so the references consulted were the interface ones. Five files were
read in full:

| Path (repository-relative) | Lines |
|---|---|
| `AI_Skills_Pack/skills/ui-ux-design/frontend-design/SKILL.md` | 72 |
| `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/references/motion.md` | 293 |
| `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/references/tells.md` | 116 |
| `AI_Skills_Pack/skills/ui-ux-design/impeccable/reference/animate.md` | 90 |
| `AI_Skills_Pack/skills/ui-ux-design/impeccable/reference/delight.md` | 71 |

The encyclopedia's §15 ("Pricing, FAQ, forms, and conversion", techniques 356–380)
was re-read for the technique identifiers that this pass is accountable to.

**The guidance that changed the work — motion.md §2, question 1**

> *How often will someone see it? Once per visit (hero load, a section reveal):
> it can take its time. Many times per visit (hover, menu, accordion): fast and
> small. **Hundreds of times (keyboard actions, typing): no animation.***

This is the single most load-bearing sentence in the pass. It ruled out the
obvious design — a filling rule that grows with every keystroke, a counter that
counts up, a caret that blinks — and produced the opposite:

* A **text field** acknowledges by *state*, not movement: the mark is drawn **once**,
  the first time the field crosses from empty to holding something that reads
  correctly, and it stays until the field is emptied. Nothing moves on a keystroke.
* A **search** acknowledges by *reading*, not movement: a count beside the box, and
  an empty state that names the way out. Both are instant, both survive reduced
  motion, and both are legible to a screen reader.

The same sentence retired a motion the site already had. The technique library
rebuilt all 480 of its cards on every keystroke, each with its own fade-up tween.
That is "hundreds of times", and it is also motion.md §7's first tell ("the same
fade-up on every block"). The cards are now built once and the filter only shows
and hides them; the arrival happens one time, as one block.

**The guidance that shaped the copy — frontend-design**

> *Treat failure and emptiness as moments for direction, not for mood… An empty
> screen is an invitation to act.*

The FAQ's empty state is now a sentence, an action and a second action: "No
question matches “cost”." · *Clear the search* · *See the buying questions* ·
*Ask us instead*. The last one exists because the studio questions and the buying
questions are two different sets — a visitor searching for "cost" on the home page
is looking for something that lives on `/pricing/`.

> *A CTA says exactly what happens when it is used.*

This caught a false claim that had been shipping. Every service page said:
*"Every one of them is live in the Effects Library, so you can run it before you
ask for it."* Ten of the twenty techniques on those pages have **no**
demonstration. The claim is now true of the copy: each technique links either to
the running demonstration or to its record in the technique library, the link says
which, and the lead sentence counts them honestly.

**The guidance that kept the pass quiet — animate.md**

> *State and feedback: the smallest change that makes cause and result unmistakable.*
> *Exit faster than entrance.* · *Do not add a dependency for an effect the
> existing stack can express cleanly.*

No new library. No new ambient motion. The only new keyframe is
`libraryGridArrival`, on one container, once.

**The guidance that prevented a mistake — delight.md**

> *Do not manufacture a celebration for an ordinary click.* · *Repeated interaction:
> keep the response satisfying after the hundredth use.*

This is why the field's mark is drawn once and the search's count is plain text:
both are seen hundreds of times, and neither can be made interesting that often.

**The defect the pass uncovered.** The sweep was supposed to find missing
feedback. It found something much larger.

The laboratory's catalogue grid and the shape-wipe transition's blueprint overlay
were **both** called `.fx-grid`. The transition's rule sets `position: absolute`
and `inset: 0`; the catalogue's rule does not, so it inherited them. The Effects
Library was taken out of the flow, held at the height of its section, and clipped
by that section's `overflow: clip`.

Measured, in a real browser, on the shipped build:

| | Before | After |
|---|---|---|
| Height of the laboratory page | 4 973 px | 28 622 px |
| Position of the 149th demonstration | viewport y = 21 494 | inside the page |
| Demonstrations a visitor could reach | 2 of 149 | 149 of 149 |

**147 of the 149 demonstrations in the site's flagship catalogue could not be
reached.** No existing check noticed: the browser check asked whether the page had
horizontal overflow, whether the console was clean and whether chapters painted
something — and a clipped catalogue passes all three.

The transition overlay is now `.fx-blueprint`. The same sweep then checked every
other class the transition layer creates (`fx-blueprint`, `fx-expand`, `fx-field`,
`fx-mask`, `fx-wipe`) against every page stylesheet: no other collision.

**Two harness gaps closed, because a defect that the tests cannot see is a defect
that ships.** Two new committed checks now exist:

* `scripts/inert-check.mjs` — asks the browser, through the DevTools protocol,
  whether each of the 1 100–1 200 interactive elements on each of the fourteen
  routes actually has a listener, and whether each link resolves to a built
  document and a fragment that exists on the page it names. It found the three
  inert hotspot buttons in the spatial chapter, which revealed their note on hover
  and did nothing when pressed — and, on a touch screen, where there is no hover,
  did nothing at all. Pressing a hotspot now opens its note and keeps it open.
* The browser check now asserts that the **last** demonstration is reachable and
  that nothing on the page sits below the point the page can scroll to.

## 3. A note on `@fontsource/instrument-serif`

`@fontsource/instrument-serif` was installed early in the build and then **removed**. The
`design-taste-frontend-v2-experimental` skill (§4.1) names Instrument Serif as one of
two banned default display serifs, and the emblem is geometric. The final build has two
font families, both variable, both self-hosted, and no serif.

---

## 4. Cross-skill conflicts and how each was resolved

| Conflict | Resolution |
|---|---|
| `industrial-brutalist-ui` §4: one substrate per project, never mix light and dark. **vs** the brief: "varied light/dark/colour chapters". | The brief wins. The mixing is implemented as *chapter-scoped* substrates with a full token set per chapter, so no component inherits across a chapter boundary. The "one accent" rule survives in full. |
| `high-end-visual-design` §4.A: double-bezel nested cards. **vs** `design-taste-frontend-v2-experimental` §4.4: shape consistency lock. | The shape lock wins; a second radius family for nested cards would have broken it. The page uses one radius scale with hairline rules. |
| `minimalist-ui` §2: no primary-coloured background for large sections. **vs** the brief's "full-screen colour field". | The brief wins for the two ember chapters only. The colour is the brand's own, sampled from the supplied logo. |
| `modern-web-design` Pitfall 6: preserve native scroll. **vs** `locomotive-scroll`: transform-based smooth scrolling. | Lenis over Locomotive Scroll. Lenis adds inertia without replacing the scroll container, so native scroll behaviour is preserved. |
| `design-taste-frontend-v2-experimental` §4.7: hero fits the first viewport. **vs** the brief's cinematic opening. | The prelude is a minimal first screen with its CTA above the fold; the cinematic sequence is the second and third screens, and it is skippable. |
| `canvas-design` / `algorithmic-art`: fixed template, p5.js, seed sidebar. **vs** "this is a production site". | Not applied. The transferable principles (seeded randomness, parameterisation, sparse structural text) were applied to the particle and shader work. |

---

## 5. Skills deliberately not consulted, and why

* `3d-motion-creative/lightweight-3d-effects/SKILL.md` (1091 lines) — this skill covers
  Vanta.js-style and Zdog-style 3D backgrounds. DENVUP's 3D chapter is a real Three.js
  scene with hotspots and a raw WebGL2 shader, which the `threejs-webgl` skill covers
  directly. Reading a second 3D skill would not have changed an implementation decision.
* **252 of the 303 skills in the pack were excluded and never opened** — cloud
  platform, AI-agent development, document content, Google Workspace integration,
  Figma authoring, agent tooling, and so on. Every one of them is named, with the
  reason, in `SKILLS_STUDY_LIST.md` §5, and the split is re-derived from the live
  tree by `npm run study-check`. The reason in one line: this project produces a
  website, and a skill that provisions infrastructure, writes an office document or
  authors a Figma file has nothing to apply to that.
* **8 of the 51 selected skills were read and then deliberately not applied** — they
  are listed in `SKILLS_STUDY_LIST.md` §5.11 and in `UI_UX_SKILLS_INVENTORY.md` §4,
  with the conflict stated rather than dropped.
* `AI_Skills_Pack/compatibility/`, `project-template/`, `scripts/`, `sources/` and
  `templates/` were listed but not read; `project-template` in particular was not used,
  because the stack (Vite + vanilla TypeScript) was chosen after inspecting the actual
  repository rather than from a template.

---

## 6. Honest limitations of this audit

1. **Rendering was performed, in a software-rasterised headless browser.** The site has
   now been opened at nine viewport sizes, screenshotted, driven through its overlays
   and forms, and its canvas output read back pixel by pixel. What that does **not**
   cover: a physical handset, a screen reader, a real GPU's frame rate, a mail client,
   or a Lighthouse score. Those are listed in `TESTING_REPORT.md` §5, and none of them
   is claimed.
2. **Two skills were only partially read** (`gsap-scrolltrigger`, `locomotive-scroll`).
   The unread ranges are listed above and nothing in the implementation depends on them.
3. **Some guidance was judged and not followed.** Every such case is listed in §2 under
   "Deviation" and in §4, with the reason. No deviation is presented as compliance.
4. **The coverage matrix records what the code claims, and the browser check now
   samples what a viewer would see.** A technique marked *Tested* means it is
   implemented, wired, mounted cleanly in the automated harness **and** — where it
   involves pixels — verified to render them. It still does not mean a human has
   admired it; no subjective aesthetic judgement is claimed anywhere in this project.
