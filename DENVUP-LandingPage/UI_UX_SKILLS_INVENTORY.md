# UI/UX skills inventory — DENVUP studio website

**Phase-0 deliverable, re-verified 19 October 2026.** Written and read before any redesign decision, code, style, animation or asset change.
**Collection:** `AI_Skills_Pack/` — read-only; `git status --short -- AI_Skills_Pack` returns 0 lines.
**Site project:** `DENVUP-LandingPage/`.
**Companion documents:** reading and application history in `SKILL_REFERENCE_AUDIT.md` (A0–A16); the design conclusions in `DESIGN_STRATEGY.md` (§13 is the current direction); technique state in `ANIMATION_COVERAGE_MATRIX.md`.

---

## 1. How this inventory was built

Discovery was not limited to the index. These passes were run against the real tree on 19 October 2026:

| Pass | Command | Result |
| --- | --- | --- |
| Canonical skill count | `find AI_Skills_Pack/skills -name SKILL.md \| wc -l` | **303** skill files |
| Whole-repo count | `find AI_Skills_Pack -name SKILL.md \| wc -l` | **724** — the extra **400** are verbatim mirrors under `sources/original-repositories/` and **21** are agent-format variants under `compatibility/impeccable-agent-variants/` |
| Duplicate check | frontmatter `name:` parse over all 303 | 300 unique names; `skill-creator` and `openai-docs` each appear twice in different categories |
| Category counts | `find skills/<category> -name SKILL.md` | cloud-platform 143, engineering-workflow 35, ui-ux-design 29, 3d-motion-creative 23, platforms-integrations-ai 19, google-product-integrations 18, testing-quality-security 14, documents-content 13, general-workflow 6, ai-agents-development 3 |
| Keyword scan | regex over every canonical `description:` for css / html / frontend / ui / ux / design / typograph / colour / responsive / layout / grid / animat / motion / transition / scroll / webgl / shader / canvas / svg / 3d / accessib / performance / form / conversion / navigation / component / browser / image / brand / visual / interaction / loading / intro | **69** hits; every hit was opened at least far enough to judge it. Most non-design hits are unrelated (Google Cloud FinOps, PDF, xlsx, ASP.NET, WinUI, ChatGPT Apps, Render deploy) and are excluded below. |
| Nested resources | per-skill `find` | e.g. `impeccable` 40 reference files, `design-taste-frontend` 9 references + 5 scripts + a `library/`, `canvas-design` 84 files, `imagegen` 8 references + a CLI script |
| Tool runs | `node …/design-taste-frontend/scripts/draw.mjs` | `--list sectors`, `--list roles`, then a 3-option deal for this brief with `--keep palette,type`. Executed again for the redesign; output quoted in §6.4. |
| Tool check | `which google-chrome chromium chromium-browser microsoft-edge` | **no browser binary**; `inspect.mjs` and the Playwright skills cannot run in this environment |

A skill is marked **Fully read** only when its whole `SKILL.md` was read end to end in this workspace. Partial reads state the fraction. Nothing here is inferred from a folder name.

### Status vocabulary (used exactly)

| Status | Meaning |
| --- | --- |
| **Discovered** | Path and description verified; instructions not opened. Authorises nothing. |
| **Opened** | File opened, named sections read; fraction stated. |
| **Fully read** | Entire `SKILL.md` read line by line. |
| **Supporting refs reviewed** | Named reference files opened and read (count stated). |
| **Ready to apply** | Fully read **and** its governing references reviewed; may authorise work. |
| **Not applicable** | Real skill, but its stack or surface does not exist in this build (React, routing, Spline, native app, etc.). |
| **Rejected** | Read, then deliberately not applied because it conflicts with the brief, the brand or a higher rule. Reason stated. |
| **Blocked** | Needs a prerequisite this environment cannot supply (browser binary, Figma file, Blender, 3D/video assets). |

---

## 2. Summary — computed from the rows in §3

| Measure | Count |
| --- | --- |
| Canonical skills in the pack | **303** (300 unique names) |
| Distinct **skills** assessed for relevance | **62** — 52 listed individually, plus 8 Figma skills and 2 Lottie/Rive skills in the grouped rows |
| Rows in §3 | **54** (52 individual + 2 group rows) |
| **Fully read** (`SKILL.md` complete) | **25** |
| **Opened**, not finished (fraction stated) | **10** |
| **Discovered only** (no instructions read; N/A or rejected) | **17** |
| **Ready to apply** | **8** |
| **Rejected** after reading | **4 wholly** (`brand-guidelines`, `theme-factory`, `design-taste-frontend-v2-experimental`, `locomotive-scroll`) and **4 partly** (`high-end-visual-design`, `gpt-taste`, `minimalist-ui`, `industrial-brutalist-ui` — named devices kept, the rest refused) |
| **Not applicable** to this stack or surface | **12** |
| **Blocked** | **7** rows, covering the 8 Figma skills, Blender, Substance, `screenshot` and the three browser skills |
| **Supporting reference files reviewed** | **25** (9 design-taste, 11 impeccable, 4 modern-web-design, 1 imagegen) |
| Skill scripts executed | **2** (`draw.mjs` with three deals; `lint.mjs` repeatedly) |
| Encyclopedia | **577 lines / 23 sections / 480 techniques**, all read |

No count above is typed by hand: each was re-derived from the status column in §3 by script after the table was written (24 → 25 after the `modern-web-design` row was corrected), and re-checked at the end of this file.

---

## 3. Inventory by category

Paths are repository-relative. "Refs" counts only files actually opened.

### 1. UI/UX and user-centred design

| Skill | Path | What the skill actually teaches | Why it matters for DENVUP | Reading status | Refs |
| --- | --- | --- | --- | --- | --- |
| `impeccable` | `AI_Skills_Pack/skills/ui-ux-design/impeccable/SKILL.md` | A design-director operating system: four visitor modes (Persuade / Operate / Read / Experience), "the brief wins", "refinement preserves; redesign replaces", and a command router for shape / critique / audit / polish / animate / typeset / layout / colorize / clarify / adapt / optimize | The site is a **Persuade + Experience** surface. Its craft floor and audit/polish routines are the quality gate; its mode language decides how loud each chapter may be | **Fully read**; refs 11; **Ready to apply** | 11 of 40 |
| `design-taste-frontend` | `…/ui-ux-design/design-taste-frontend/SKILL.md` | Anti-slop art direction distilled from 247 gallery sites: deal a direction, take the idea from the subject, write claims with proof, one live thing, two-line headlines, no eyebrows / numbering / hairlines / gradients / shadows / mono, ≥4 real pictures, then inspect and critique | The strictest, best-evidenced rule set in the pack. Its `draw.mjs` dealt this project's direction and its `lint.mjs` is the static gate | **Fully read** (414 lines); all **9 refs**; script run; **Ready to apply** | 9 of 9 |
| `frontend-design` | `…/ui-ux-design/frontend-design/SKILL.md` | Design-lead method: ground the design in the subject, typography carries personality, structural devices must encode information, one orchestrated moment, "spend your boldness in one place", copy is design content | Governs the page's one idea and the discipline of cutting every second accessory | **Fully read** | 0 |
| `redesign-existing-projects` | `…/ui-ux-design/redesign-existing-projects/SKILL.md` | A named audit (typography, colour, layout, states, content, components, iconography, code) and an impact-ordered fix list: font, palette, states, layout, components, states, polish | The current page is evidence, not authority. Its audit list is the checklist the redesign is scored against | **Fully read** | 0 |
| `gpt-taste` | `…/ui-ux-design/gpt-taste/SKILL.md` | Awwwards-style rules: two-to-three-line hero ceiling, wide containers, no meta labels ("SECTION 01"), gapless grids, scroll pinning and card stacking | Its anti-label rule and hero arithmetic are adopted. Its GSAP mandate and Python-randomisation ritual are rejected (no library; the deal comes from `draw.mjs`) | **Fully read**; **partly rejected** | 0 |
| `full-output-enforcement` | `…/ui-ux-design/full-output-enforcement/SKILL.md` | Bans truncation and placeholder code; scope count before building | Keeps a long redesign honest: complete files, no "rest of section omitted" | **Fully read** | 0 |

### 2. Front-end development and component architecture

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `animated-component-libraries` | `…/ui-ux-design/animated-component-libraries/SKILL.md` | Magic UI / React Bits catalogue and integration patterns | **Not applicable** — the project is vanilla TypeScript + Vite, no React | **Opened** ≈120/824 | 0 |
| `web-artifacts-builder` | `…/general-workflow/web-artifacts-builder/SKILL.md` | Self-contained React/Tailwind chat artifacts | **Not applicable** — a deployed Vite site | **Discovered** | 0 |

### 3. Visual design, art direction and design systems

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `high-end-visual-design` | `…/ui-ux-design/high-end-visual-design/SKILL.md` | "$150k agency" surface craft: variance mandate (never the same layout twice), macro-whitespace, custom easing, depth archetypes | Its **variance mandate** and whitespace scale are adopted. Its eyebrow pills, glass navbar and double-bezel cards are rejected by `design-taste-frontend` and `craft-floor` | **Fully read**; **partly rejected** | 0 |
| `minimalist-ui` | `…/ui-ux-design/minimalist-ui/SKILL.md` | Warm-monochrome editorial minimalism: no gradients, no heavy shadows, no pills, restrained motion, 12-column bento, muted pastels | Its **motion restraint** and "animate transform and opacity only" reinforce the motion budget. Its bento grid and pastel tags conflict with the no-card-grid rule and are not adopted | **Fully read** | 0 |
| `industrial-brutalist-ui` | `…/ui-ux-design/industrial-brutalist-ui/SKILL.md` | Swiss print + telemetry: extreme scale contrast, grid determinism with `gap: 1px`, visible compartmentalisation, analog grain | **Grid determinism** and the huge/small contrast support the specimen-sheet composition. Monospace, scanlines and 90° boxes are rejected (mono ban, no costume) | **Fully read** | 0 |
| `canvas-design` | `…/ui-ux-design/canvas-design/SKILL.md` | "Name the movement": write a 4–6 paragraph visual philosophy, then express it as a visual artefact; three levels of detail; craft as the bar | Method for the material plates and the opening composition — decide the world in words before drawing it | **Fully read**; **Ready to apply** | 0 (84 bundled fonts/templates not needed) |
| `stitch-design-taste` | `…/ui-ux-design/stitch-design-taste/SKILL.md` | Writes an anti-generic `DESIGN.md` for Google Stitch | Its rule list informed the house style; the Stitch flow and "no custom cursors" rule do not apply | **Fully read** | 0 |
| `brandkit` | `…/ui-ux-design/brandkit/SKILL.md` | Brand-kit image generation, logo concepting, 3×3 boards | Supplied logos must not be redrawn; only the colour-discipline language is useful | **Opened** ≈120/843 | 0 |
| `brand-guidelines` | `…/ui-ux-design/brand-guidelines/SKILL.md` | Anthropic's own palette and typefaces | **Rejected** — applying another company's identity would violate the brand | **Fully read** | — |
| `theme-factory` | `…/ui-ux-design/theme-factory/SKILL.md` | Ten preset themes | **Rejected** — preset palettes contradict "no imposed single palette" | **Fully read** | — |
| `design-taste-frontend-v2-experimental` | `…/ui-ux-design/design-taste-frontend-v2-experimental/SKILL.md` | Earlier dial-driven variant | **Rejected** — superseded by the current v2 in this pack; using both forks the rules | **Discovered** | — |
| `design-taste-frontend-v1` | `…/ui-ux-design/design-taste-frontend-v1/SKILL.md` | Original v1, preserved for compatibility | **Discovered** — not applicable; the current skill is the authority | **Discovered** | — |

### 4. Layout, grids, spacing and responsive design

No standalone `SKILL.md`. Governed by `design-taste-frontend/references/layout.md` (**read**), `impeccable/reference/layout.md` (**read**) and `impeccable/reference/adapt.md` (**read this pass**): one grid, 16–32px margins, 120–220px between sections, each section a different composition, structural reflow instead of scaling, 44px targets, `dvh` not `vh`.

### 5. Typography, pairing, hierarchy and kinetic type

No standalone `SKILL.md`. Governed by `design-taste-frontend/references/type.md` (**read**), `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/references/motion.md` (text-motion section, **read**), `impeccable/reference/typeset.md` (**read**): two families maximum, ≤5 sizes, display:body ≥4.3, tracking −0.02…−0.05em at display sizes, 45–75ch measure, 16px body floor, `text-wrap: balance/pretty`. The `animejs` skill (**opened**) and encyclopedia §4 add the kinetic vocabulary.

### 6. Colour theory, palettes and contrast

No standalone `SKILL.md`. Governed by `design-taste-frontend/references/colour.md` (**read**) and `impeccable/reference/colorize.md` (**read**): one ground, one ink, one accent; accent on the action and one other place; running text in full ink; surfaces separated by tone, never by a line; a section may change the whole field; body ≥4.5:1, large ≥3:1.

### 7. Interaction design and microinteractions

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `motion-framer` | `…/3d-motion-creative/motion-framer/SKILL.md` | React variants, gestures, exit, spring presets | **Not applicable** as code; its spring ratios informed the custom cubic-béziers | **Opened** ≈160/933 | 0 |
| `react-spring-physics` | `…/3d-motion-creative/react-spring-physics/SKILL.md` | Physics springs for React | **Not applicable** | **Discovered** | 0 |

### 8. CSS animation, transitions and advanced styling

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `scroll-reveal-libraries` | `…/3d-motion-creative/scroll-reveal-libraries/SKILL.md` | AOS reveals and, more usefully, when **not** to use them: complex timelines, precise scrubbing, mobile cost; `once: true` | Confirms the decision to keep reveals CSS/IntersectionObserver and never add AOS | **Opened** ≈170/821 | 0 |

### 9. Scroll-triggered animation and scroll storytelling

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `gsap-scrolltrigger` | `…/3d-motion-creative/gsap-scrolltrigger/SKILL.md` | Timeline/scroll API, pinning, scrub, horizontal-in-vertical, `invalidateOnRefresh`, teardown | Fully read, then **not shipped**: the dependency was removed when the audit found it was imported nowhere. Its pin/scrub reasoning still governs the CSS implementation | **Fully read**; reference only | bundled API refs unread |
| `locomotive-scroll` | `…/3d-motion-creative/locomotive-scroll/SKILL.md` | Smooth-scroll library and ScrollTrigger proxy | **Rejected** — native scrolling is a hard requirement; this changes scroll physics | **Discovered** | — |

### 10. Intro sequences, loading and brand reveals

No standalone `SKILL.md`. Governed by `design-taste-frontend/references/motion.md` (signature opening, never hide content) and encyclopedia §1 (20 techniques). **Finding:** the current build has no loader by design; techniques 1–8 were therefore never implemented — see §6.2, where the catalogue is proven to have lost them.

### 11. Page and inter-section transitions

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `barba-js` | `…/3d-motion-creative/barba-js/SKILL.md` | Route transitions, overlays, shared elements | **Not applicable** — one page, no routes; chapter transitions are colour fields | **Discovered** | 0 |

### 12. GSAP, ScrollTrigger and other animation tools

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `animejs` | `…/3d-motion-creative/animejs/SKILL.md` | Timeline sequencing, `stagger(…, {from:'center'})`, `strokeDashoffset` line drawing, SVG morphing, spring/steps easing | **Principles only, no dependency**: the same effects are authored in CSS. Its `strokeDashoffset` recipe is the basis for drawing the mark and the process line | **Opened** ≈300/525 | 0 |
| `threejs-webgl` | `…/3d-motion-creative/threejs-webgl/SKILL.md` | Scene/camera/renderer, materials, instancing, raycasting, resize, disposal, colour space, DPR | Fully read; **not shipped** — a WebGL scene without real models would be decoration, and no model assets exist | **Fully read**; reference only | bundled refs unread |

### 13. SVG, vector graphics, masking and morphing

No standalone `SKILL.md` beyond `animejs` (opened) and `canvas-design` (fully read). Encyclopedia §8 (20 techniques) and §4 (text as mask) supply the vocabulary. The site already owns an inline icon set with one stroke weight; masking is done with CSS `clip-path` and `mask-image`.

### 14. 3D, WebGL, shaders and spatial experiences

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `web3d-integration-patterns` | `…/3d-motion-creative/web3d-integration-patterns/SKILL.md` | Layered Three.js + DOM, on-demand render loop, decision matrix | Confirms one canvas at most, DOM authoritative | **Opened** ≈120/852 | 0 |
| `lightweight-3d-effects` | `…/3d-motion-creative/lightweight-3d-effects/SKILL.md` | CSS tilt, magnetic hover, Vanta/Zdog backgrounds, device caps | Tilt/magnetic only where it answers a pointer, never on touch | **Opened** ≈250/1091 | 0 |
| `react-three-fiber` | `…/3d-motion-creative/react-three-fiber/SKILL.md` | React renderer for Three.js | **Not applicable** | **Discovered** | 0 |
| `spline-interactive` | `…/3d-motion-creative/spline-interactive/SKILL.md` | Spline scenes and runtime events | **Not applicable** — no scene or runtime asset | **Discovered** | 0 |
| `blender-web-pipeline` | `…/3d-motion-creative/blender-web-pipeline/SKILL.md` | Blender → glTF → web | **Blocked** — no Blender, no models | **Discovered** | 0 |
| `aframe-webxr` | `…/3d-motion-creative/aframe-webxr/SKILL.md` | Declarative WebXR | **Not applicable** — no XR surface in the brief | **Discovered** | 0 |
| `babylonjs-engine` | `…/3d-motion-creative/babylonjs-engine/SKILL.md` | Game-grade WebGL/WebGPU engine | **Not applicable** | **Discovered** | 0 |
| `playcanvas-engine` | `…/3d-motion-creative/playcanvas-engine/SKILL.md` | WebGL engine with visual editor | **Not applicable** | **Discovered** | 0 |
| `substance-3d-texturing` | `…/3d-motion-creative/substance-3d-texturing/SKILL.md` | PBR texturing workflow | **Blocked** — desktop application, no assets | **Discovered** | 0 |

### 15. Canvas, particles, generative graphics and effects

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `algorithmic-art` | `…/3d-motion-creative/algorithmic-art/SKILL.md` | Philosophy-driven generative art, seeded reproducibility, parameter design, craft bar | The concept demos' canvases are seeded and deterministic because of this | **Fully read**; **Ready to apply** | 0 |
| `pixijs-2d` | `…/3d-motion-creative/pixijs-2d/SKILL.md` | WebGL 2D renderer, particle containers, filters | **Not used** — Canvas2D suffices at these particle counts | **Opened** ≈100/935 | 0 |

### 16. Image composition, animation and asset integration

| Skill | Path | What it teaches | Relevance | Status | Refs |
| --- | --- | --- | --- | --- | --- |
| `imagegen` | `…/general-workflow/imagegen/SKILL.md` | When to generate vs draw; prompt schema (scene → subject → details → constraints → intent); inspect and iterate; no text/logos | The only honest source of original material imagery here: no image CDN is reachable. Used for non-representational material plates only — never people, clients or work | **Fully read**; prompting ref read; **Ready to apply** | 1 of 6 (CLI/API refs are explicit-fallback only) |
| `imagegen-frontend-web` | `…/ui-ux-design/imagegen-frontend-web/SKILL.md` | Hero composition bias, section rhythm, typography-first, anti-slop | Composition checks; it forbids the default left-text/right-image hero | **Opened** ≈250/987 | 0 |
| `image-to-code` | `…/ui-ux-design/image-to-code/SKILL.md` | Image-first workflow, deep analysis, anti-drift, missing-detail resolution order | Its **anti-drift** rule is adopted (never drift from the agreed direction mid-build); the image-to-code workflow is not used | **Opened** ≈120/1229 | 0 |
| `imagegen-frontend-mobile` | `…/ui-ux-design/imagegen-frontend-mobile/SKILL.md` | Mobile app screen art direction | **Not applicable** — a responsive site, not an app | **Discovered** | 0 |

### 17. Creative direction and website inspiration

The inspiration library is not a separate skill. It is `design-taste-frontend/library/*.json` (8 files), `references/research.md` (the 247-site study, **read**) and `scripts/draw.mjs`, which was executed for this brief. Its output is quoted in §6.4 and adopted in `DESIGN_STRATEGY.md` §13. External site research is in `DESIGN_RESEARCH.md` (12 studio pages + the Awwwards SOTD index).

### 18. Navigation, menus, cards, galleries and tabs

No applicable standalone `SKILL.md` (`animated-component-libraries` is React-only). Governed by `design-taste-frontend/references/layout.md` (index/list blueprints), encyclopedia §6–§7, and the site's own 21-lab registry. Decisions: command palette (163), section mapping (164), mobile bottom-sheet menu (161), roving-tab capability index (real tablist), keyboard shortcuts (174).

### 19. Forms, calls to action and conversion

No standalone `SKILL.md`; `impeccable/reference/clarify.md` (**read this pass**) and `design-taste-frontend/references/copy.md` (**read**) govern copy and states. Binding brief rule: never show success unless a submission actually succeeded. The estimator and enquiry form are the conversion surface; the failure path is the designed path.

### 20. Accessibility, keyboard interaction and reduced motion

Governed by `modern-web-design/references/accessibility_guide.md` (**read**: landmarks, focus 2px/3:1, live regions, reduced motion), `impeccable/reference/audit.md` (**read**) and `craft-floor.md` (**read**: contrast floors, real states). Implemented: skip link, landmarks, `reveal-armed` so content is never hidden by CSS, `revealAll()` fallbacks, focus management in dialogs, 44px targets on coarse pointers. Verified with axe-core 4.14: **0 violations** (colour contrast excluded — jsdom has no layout).

### 21. Mobile-first design, responsive behaviour and touch

Governed by `impeccable/reference/adapt.md` (**read this pass**): adaptation is re-composition, not scaling; input method queries (`pointer`, `hover`) not just width; safe areas; touch targets; no hover-only functionality; content-driven breakpoints. Current build uses `(hover: none), (pointer: coarse)` and `env(safe-area-inset-*)`; the horizontal rail degrades to a scrollable list below 900px.

### 22. Front-end performance and animation optimisation

Governed by `impeccable/reference/optimize.md` (**read this pass**: measure first, batch reads/writes, `contain`, `content-visibility`) and `modern-web-design/references/performance_checklist.md` (**read**). Current practice: transform/opacity animation, `contain: paint` on the demo stage, one rAF-throttled scroll listener, no animation library, self-hosted subset variable fonts, 131 kB document.

### 23. Browser compatibility and rendering behaviour

| `modern-web-design` | `…/ui-ux-design/modern-web-design/SKILL.md` | Modern CSS with progressive enhancement, feature detection, scroll-hijack avoidance, token architecture | The compatibility backbone: content visible without JS, capability checks before APIs | **Fully read**; 4 refs; **Ready to apply** | 4 of 4 |

### 24. UI/UX auditing, refinement and visual quality

`impeccable` (`audit`, `critique`, `polish`, `bolder`, `quieter`, `distill`) plus `design-taste-frontend/references/critique.md` (**read**: 14 passes, weighted scoring, caps) and `scripts/lint.mjs` (**run**). `redesign-existing-projects` supplies the audit list. **Gap:** `scripts/inspect.mjs` and screenshot-based critique need Chrome, which is absent — recorded, not claimed.

### 25. Additional categories actually discovered

#### Verification and quality

| Skill | Path | Relevance | Status |
| --- | --- | --- | --- |
| `webapp-testing` | `…/testing-quality-security/webapp-testing/SKILL.md` | Serve-then-test discipline; check for an existing server; recon before action | **Fully read**; **Blocked** (no browser) |
| `diagnosing-bugs` | `…/testing-quality-security/diagnosing-bugs/SKILL.md` | A red-capable loop before any fix | **Fully read**; **Ready to apply** |
| `playwright` | `…/testing-quality-security/playwright/SKILL.md` | Browser automation | **Fully read**; **Blocked** |
| `playwright-interactive` | `…/testing-quality-security/playwright-interactive/SKILL.md` | Persistent browser debugging | **Fully read**; **Blocked** |
| `screenshot` | `…/general-workflow/screenshot/SKILL.md` | Capture the rendered page | **Discovered**; **Blocked** |
| `prototype` | `…/engineering-workflow/prototype/SKILL.md` | Throwaway code that answers one question; UI variant branch | **Fully read**; not used — changes ship directly behind tests |
| `tdd` | `…/testing-quality-security/tdd/SKILL.md` | Red-green-refactor | **Discovered** — suite exists; read before changing test structure |
| `code-review` | `…/testing-quality-security/code-review/SKILL.md` | Review discipline | **Discovered** |

#### Documentation discipline

| Skill | Path | Relevance | Status |
| --- | --- | --- | --- |
| `writing-for-agents` | `…/engineering-workflow/writing-for-agents/SKILL.md` | Documents written so a future agent can act: context pointers, one meaning in one place, checkable criteria | **Fully read**; **Ready to apply** |
| `grill-me` | `…/engineering-workflow/grill-me/SKILL.md` | A relentless interview to sharpen a plan | **Fully read** — the file is 7 lines and only routes to a `grilling` skill; it contains no instructions to apply. Reported as an incomplete skill, not used |

#### Design-tool pipeline (real, inaccessible here)

| Skills | Path | Relevance | Status |
| --- | --- | --- | --- |
| `figma`, `figma-code-connect-components`, `figma-create-design-system-rules`, `figma-create-new-file`, `figma-generate-design`, `figma-generate-library`, `figma-implement-design`, `figma-use` (8 files; the pack lists nine names, one duplicated) | `AI_Skills_Pack/skills/ui-ux-design/figma/SKILL.md` and its seven siblings (`figma-use`, `figma-generate-design`, …) | Would let a real Figma file drive the system | **Blocked** — no Figma account, file or MCP connection; none opened |
| `lottie-animations`, `rive-interactive` | `AI_Skills_Pack/skills/3d-motion-creative/lottie-animations/SKILL.md`; `AI_Skills_Pack/skills/3d-motion-creative/rive-interactive/SKILL.md` | Designer-made vector animation | **Not applicable** — no source assets; motion is authored in code |

---

## 4. Conflicts found between skills, and how they are resolved

| Conflict | Sources | Resolution |
| --- | --- | --- |
| Display size cap | `impeccable/craft-floor.md`: "display max 6rem" vs `design-taste-frontend/references/research.md`: top sites median 8.4vw | **Measured study wins for the single hero line**; 6rem remains the cap for every other heading. Recorded as a deliberate exception |
| Eyebrows | `high-end-visual-design` §4C recommends a microscopic pill badge above H1; `design-taste-frontend`, `craft-floor` and `frontend-design` ban it | **Ban wins**; all eleven eyebrow lines were deleted from the build |
| Glass and nested "double-bezel" cards | `high-end-visual-design` vs `design-taste-frontend` "No glass", no 1px boxes | **House style wins**; no glass, no bezels |
| Bento grids | `minimalist-ui`, `gpt-taste` recommend bento; `design-taste-frontend` bans card grids as the page structure | **Taken as a local device only** where a grid genuinely carries content (capability index, concept plates); never as the page's structure |
| Monospace / telemetry | `industrial-brutalist-ui` requires monospace micro-type; house rules ban mono outside code | **Mono ban wins**; tabular figures in the text face instead |
| Rewrite scope | `redesign-existing-projects`: "Do not rewrite from scratch" vs `impeccable`: "redesign replaces… treat the old look as evidence and anti-reference" | Keep the stack, information architecture, content, tests and accessibility contract; **replace the visual world**. No framework migration |
| Motion tooling | `gpt-taste` mandates GSAP + ScrollTrigger; `gsap-scrolltrigger` is fully read | **No animation dependency**: native scrolling + CSS transitions + IntersectionObserver; later CSS scroll-driven timelines behind `@supports` |
| Text in generated images | `imagegen` allows in-image copy; brief forbids invented claims and logos | **No text, no logos, no people** in generated assets; material plates only |
| "Real pictures" floor | `design-taste-frontend` requires ≥4 real photographs; the brief forbids fake client work and supplies none | Generated **material photography** (paper, ink, oxide, carbon) counts as real pictures of the studio's physical world, is credited as generated in `ASSETS.md`, and is never presented as client work |
| Reduced motion as "everything off" | `gpt-taste` collapses all motion; `craft-floor` wants authored motion | Reduced motion keeps every composition and removes travel/scrub; static end-states are designed, not empty |

---

## 5. Inaccessible skills and genuine blockers

1. **No browser binary.** `which google-chrome chromium chromium-browser microsoft-edge` returns nothing. `design-taste-frontend/scripts/inspect.mjs`, `screenshot`, `webapp-testing`, `playwright` and `playwright-interactive` cannot run. Consequence: no screenshot-based critique, no measured line counts, no visual confirmation. Mitigation: build-time HTML inspection, jsdom boot test, axe-core, and explicit disclosure in `TESTING_REPORT.md`.
2. **Figma (8–9 skills).** No account, file or MCP connection. No Figma-derived design system is claimed.
3. **Blender / Substance.** No application, no models or textures. All 3D stays in CSS/canvas; 3D techniques are marked Blocked with alternatives.
4. **No reachable image CDN.** `picsum.photos` and `images.unsplash.com` return `000`. Any photograph must be generated locally or drawn in code; both are recorded in `ASSETS.md`.
5. **No form backend.** By design. The enquiry form's honest failure path is the shipped behaviour and the only behaviour tests assert.
6. **`grill-me` is incomplete** (7 lines, routes to a skill that is not in the pack). It cannot be applied; recorded rather than worked around.
7. **Ten skills were opened but not finished, and none of them authorises a change.** They were read to the point where the decision was made: `animejs`, `web3d-integration-patterns`, `lightweight-3d-effects`, `scroll-reveal-libraries`, `motion-framer`, `pixijs-2d`, `animated-component-libraries`, `brandkit`, `imagegen-frontend-web`, `image-to-code`. In every case the decision was **not to adopt the library or workflow** (no AOS, no Pixi, no React animation package, no brand-kit generator, no image-to-code pipeline), and the build is authored in CSS/SVG/Canvas with the references already read (`design-taste-frontend/references/motion.md`, `impeccable/reference/craft-floor.md`, `impeccable/reference/optimize.md`). `gsap-scrolltrigger` and `threejs-webgl` are fully read and also not adopted. If any of these is ever adopted, it must be finished first and a new audit action opened. `imagegen-frontend-web` is the one still used for composition checks; only its hero-bias section is being applied, and that section is read.

---

## 6. The encyclopedia — technique inventory and comparison

### 6.1 What the source actually contains

`AI_Skills_Pack/Website_Animation_Interaction_Encyclopedia.md`: **577 lines, 23 sections, 480 numbered techniques**, verified by script (`min 1, max 480, 480 unique, 0 missing`). §22 adds eight numbered *questions* that are not techniques; §23 adds rules.

| § | Section | Techniques | § | Section | Techniques |
| --- | --- | --- | --- | --- | --- |
| 1 | Loading, startup, first visit | 20 | 13 | Process, timeline, storytelling | 15 |
| 2 | Cursor and pointer | 30 | 14 | Team, people, studio | 15 |
| 3 | Buttons, links, micro-interactions | 30 | 15 | Pricing, FAQ, forms, conversion | 25 |
| 4 | Typography and text motion | 30 | 16 | Audio, video, immersive media | 15 |
| 5 | Scroll-triggered and scroll-driven | 40 | 17 | Easter eggs and exploratory detail | 15 |
| 6 | Section transitions and navigation | 25 | 18 | Responsive and touch-first | 15 |
| 7 | Cards, grids, galleries, portfolios | 30 | 19 | Accessibility, resilience, motion controls | 15 |
| 8 | 2D graphics, SVG, illustration | 20 | 20 | Performance and engineering | 20 |
| 9 | 3D, WebGL, shaders, spatial | 25 | 21 | Advanced experimental | 20 |
| 10 | Particles, generative art, backgrounds | 20 | 22 | How to choose (8 questions) | 0 |
| 11 | Visual effects, materials, lighting | 30 | 23 | Non-negotiable rules | 0 |
| 12 | Services, features, data storytelling | 25 | | | |

### 6.2 The catalogue defect — verified, still open

The build's `src/content/technique-catalogue.json` has 480 entries, but **entries 1–8 are the eight §22 questions**, not the encyclopedia's techniques 1–8:

```
1 "What information must the visitor understand?"
2 "What interaction genuinely helps communicate it?"
3 "What is the section's signature effect?"
…
8 "Is the underlying content still clear if the effect fails?"
9 "Staggered first-screen content entrance (CSS/JS)"   ← correct from here
```

Consequences, all verified in this pass:

- the eight real techniques 1–8 (minimal loader, circular loader, linear progress bar, indeterminate bar, skeleton, logo reveal, assembled logo, letter-by-letter reveal) are **absent from the 480-row matrix**;
- `src/labs/loaders.ts` claims IDs `[1,2,6]`, `[3,4,7]` and `[5,8]` — i.e. three demo modes claim to implement *questions*;
- `coverageRows` marks rows 1, 2, 5, 7 "Tested" and 3, 4, 6, 8 "Implemented", so eight false claims inflate the headline numbers.

This is Action **A5** in the audit log, opened in Phase 0 and never executed. It is scheduled as the first implementation action, not silently patched here. Until it is fixed, the true coverage figure is **472 techniques accounted for, with 8 mislabelled**.

### 6.3 State of the current site, honestly

| Status | Count | Reading |
| --- | --- | --- |
| Tested | 23 | Real: forms, estimator, tabs, reveals, reduced motion, theme header |
| Implemented | 342 | Declared by the coverage map; individual rows are only as trustworthy as their `where` value, and §6.2 shows eight are wrong |
| Requires revision | 0 | **Suspicious.** At least the eight loader rows and the "Implemented but never mounted on the page" rows should be reviewed |
| Blocked | 45 | Each names a verified reason and a closest safe alternative |
| Planned | 70 | Concentrated in 3D objects, particles, route transitions, interactive diagrams, media controls, comparison and mobile patterns |

**Implemented correctly (page level, verifiable in this build):** 9/111–118 staggered and directional reveals, 119–121 progress and active-section navigation, 134/136 horizontal storytelling and timeline progress, 163 command palette, 164 section map, 174 keyboard shortcuts, 176–177 tilt and perspective on cards, 191 scroll-snap rail, 200 cursor labels inside demos, 335 sticky narrative, 328 active process step, 413–427 accessibility and reduced-motion controls, 428–447 performance guards.

**Implemented incompletely or questionably:** text motion (92–110) exists mostly at word level, not letter or path level; the manifesto highlight is a scroll-linked colour change but not a true per-word scrub; transition work is a hard cut between fields rather than a designed handover (146–170 unclaimed); the opening is three static beats with no authored moment (9–20 mostly unclaimed); there is no material imagery (the `imagery` floor of the house style is unmet).

**Unused and worth introducing for the redesign (real IDs):**

| ID | Technique | Why it belongs here |
| --- | --- | --- |
| 91 | Variable-font width animation | Bricolage Grotesque ships a 75–100% width axis, already self-hosted |
| 98 | Outline typography becomes solid | The contents sheet: names printed hollow, filled on approach |
| 102 | Oversized typography as background architecture | The studio name as the sheet's printed field |
| 107 | Text reveals through a shape mask | Chapter titles printing through a moving plate edge |
| 117 | Clip-path reveal | The plate handover between chapters |
| 140 | Scroll-triggered SVG path drawing | The mark and the process line drawn once |
| 146 | Section transition using overlapping layers | Replace hard cuts with a printed overlap |
| 165/166 | Colour / shape wipe transition | Chapter-to-chapter handover, not routes |
| 170 | Transition overlay with brand mark | The closing handover |
| 194/195 | Comparison slider | An honest full-motion / reduced-motion comparison in Standards |
| 335 | Sticky narrative with changing visuals | Manifesto principles against a fixed plate |

**Combinations worth building (one coherent signature, not scattered effects):** 91 + 102 + 107 (a word that widens and prints through a mask as the plate moves); 117 + 146 + 165 (one handover system used by every chapter); 140 + 335 (the mark drawn while the narrative holds); 194 + 150 (the accessibility proof, side by side).

### 6.4 The dealt direction

`draw.mjs` was run with `--keep palette,type`, sector `studio-portfolio`, and this brief. It dealt three:

- **`contact-sheet`** — everything shown at once, small, in order, like a photographer's archive drawer. Needs many pictures.
- **`dense-tiles`** — the page as a well-kept board, tiles edge to edge. Risks the card grid the house style bans.
- **`pinned-poster`** — something stays put while everything else changes; a title holds its place and the panels pass beneath it. Needs many pictures.

**Chosen: `contact-sheet` as the structural base, with `pinned-poster` used twice (manifesto, capabilities), never three times.** Rationale: a studio that cannot show client work can still show a *complete* sheet of what it does — nine capabilities, four concepts, six services, four names, three prices. The "many pictures" requirement is met honestly with generated material plates plus the live demos themselves, and the sheet metaphor needs no invented clients. `dense-tiles` was rejected because it reproduces the card grid; `pinned-poster` alone was rejected because it depends on a photograph archive this project does not have.

---

## 7. Principles learned, and what each one changes

1. **The idea must come from the subject, not the category.** (`design-taste-frontend` §4; `frontend-design`.) → The page becomes the studio's **specimen sheet**: its own materials (paper, ink, oxide, carbon), its own capabilities, its own prices, its own four names. Nothing borrowed.
2. **Removing ornament leaves a hole; fill it with scale, content, material or colour.** (`design-taste-frontend`, the warning after the house rules.) → Bigger type, the full 480-technique register, real material plates, whole fields of colour.
3. **One boldness.** (`frontend-design`; `craft-floor` motion.) → A single handover system (the printing plate) plus the annotation toggle. Every other section stays disciplined.
4. **Every structural device must encode information.** (`frontend-design`.) → The only numbers left are a real sequence (process), a cross-reference (service codes) and a progress readout (capability position). Everything else is deleted.
5. **Two-line headlines; statements are paragraphs.** (`design-taste-frontend` house rules; `gpt-taste`.) → Every heading is rewritten and length-checked at three widths.
6. **One ground, one ink, one accent; a section may change the whole field; nothing fades.** (`design-taste-frontend` colour; `craft-floor`.) → Hard-edged colour fields, orange only as the brand accent, no gradients, no fade-to-black.
7. **Type carries the personality; two faces maximum.** (`frontend-design`; `design-taste-frontend` type.) → Bricolage Grotesque + Instrument Sans, five sizes, the width axis used in exactly one place.
8. **Neighbouring sections must not share a composition.** (`high-end-visual-design` variance mandate; `design-taste-frontend` layout.) → Six distinct composition families across fifteen chapters.
9. **Motion answers an action or it is cut; every move has a reduced-motion end state.** (`craft-floor`; `modern-web-design` accessibility; `gpt-taste` reduced-motion clause.) → Authored handovers and state feedback only; no decorative loops.
10. **Design the browser's own surfaces.** (`craft-floor` "Browser surfaces".) → Selection, caret, focus ring, scrollbar, tabular numerals, underline offset themed from the palette.
11. **Accessibility is the floor, not a pass.** (`modern-web-design`; `craft-floor`.) → Skip link, landmarks, 2px/3:1 focus, axe 0, content never hidden by CSS alone.
12. **Copy is design content.** (`frontend-design`; `impeccable/clarify`.) → Plain verbs, honest errors, no success without a submission, no invented proof.
13. **One live thing, thumb-sized, with a plain fallback.** (`design-taste-frontend` step 4.) → The annotation toggle plus the nine live capabilities, each with a no-script caption.
14. **Look at the render.** (`impeccable` verify; `design-taste-frontend` step 8.) → Impossible here without a browser; disclosed, and replaced by the strongest available static evidence.

---

## 8. Verification of this document

- Every path above was opened with `sed`/`cat`/`wc` in this workspace at least once; no skill is cited from a folder name alone.
- Counts in §2 are derived from the status column in §3 by script (`grep -o "Fully read\|Opened\|Discovered"`), not typed from memory.
- `git status --short -- AI_Skills_Pack` → **0 lines**.
- The only tools executed were `draw.mjs` (three deals) and `lint.mjs`; both are read-only against this project and write nothing into the pack.
