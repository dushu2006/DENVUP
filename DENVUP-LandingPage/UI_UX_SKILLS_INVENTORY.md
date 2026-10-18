# UI/UX skills inventory — DENVUP studio website

**Phase 0 deliverable.** Written before any redesign decision, code, style, animation or asset.
**Date:** 2026-10-19
**Collection:** `AI_Skills_Pack/` (read-only, 0 modified entries)
**Site project:** `DENVUP-LandingPage/`

---

## 1. How this inventory was built

Discovery was not limited to the top-level index. The following passes were run against the real tree:

| Pass | Command / method | Result |
| --- | --- | --- |
| Count | `find AI_Skills_Pack/skills -name SKILL.md \| wc -l` | **303** skill files |
| Directories | `ls AI_Skills_Pack/skills` | **10** categories (cloud-platform 143, engineering-workflow 35, ui-ux-design 29, 3d-motion-creative 23, platforms-integrations-ai 19, google-product-integrations 18, testing-quality-security 14, documents-content 13, general-workflow 6, ai-agents-development 3) |
| Frontmatter parse | Python pass over all 303 files | name, description, line count, category for every skill |
| Nested resources | Per-skill `os.walk` counts | e.g. `impeccable` 62 extras, `canvas-design` 83, `design-taste-frontend` 29 |
| Keyword scan outside the design categories | regex over every remaining `description:` for accessib / a11y / css / html / responsive / typograph / colour / design system / animation / web performance / seo / copywrit / brand / illustrat / icon / figma / image / canvas / svg / shader / webgl / frontend / ui / ux | 36 hits; **all but 9 were false positives** (Genkit, PDF, xlsx, Ads MCP, ASP.NET, WinUI…). The real finds are logged under *Additional categories*. |
| Access test | `ls`, `sed`, `wc` on every file cited below | every cited file opened |
| Tooling | skill scripts `draw.mjs`, `lint.mjs` | both executed against this project |

A skill is only marked **Fully read** when its whole `SKILL.md` was read end to end. Partial reads state the exact fraction. Nothing in this file was inferred from a folder name.

### Status vocabulary (used exactly)

| Status | Meaning |
| --- | --- |
| **Discovered** | Path and description verified; instructions not opened. Authorises nothing. |
| **Opened** | File opened; only part of the instructions read. |
| **Fully read** | Entire `SKILL.md` read line by line. |
| **Supporting refs reviewed** | Named reference files opened and read (fraction stated). |
| **Ready to apply** | Fully read **and** its governing references reviewed; may authorise work. |
| **Not applicable** | Real skill, but its stack or surface does not exist in this build (React, routing, Wix, native app, etc.). |
| **Rejected** | Read, then deliberately not applied because it conflicts with the brief, the brand or a higher rule. Reason stated. |
| **Blocked** | Requires a prerequisite this environment cannot supply (Figma file, browser binary, Spline runtime, Blender). |

---

## 2. Summary (computed from the rows below, not estimated)

| Measure | Count |
| --- | --- |
| Relevant **skills** covered | **54** (45 individual skills + the 9-skill Figma set, recorded as one blocked row) |
| Table rows | **46** |
| Categories named by the brief that contain at least one real skill | **16 of 25** |
| Categories with no standalone skill, governed by a named reference inside another skill | **9 of 25** (layout, typography, colour, intro, navigation, forms, accessibility, mobile, performance) |
| Fully read (`SKILL.md` complete) | **21** |
| Opened but not fully read | **10** |
| Discovered only (no instructions read) | **11** |
| Ready to apply | **14** |
| Rejected after reading | **4** (`brand-guidelines`, `theme-factory`, `locomotive-scroll`, `design-taste-frontend-v2-experimental`) |
| Not applicable to this stack or surface | **10** |
| Blocked | **6** (browser ×4, Figma set, Blender) |
| Supporting reference files reviewed | **21** (9 design-taste + 8 impeccable + 4 modern-web-design) |
| Skill scripts executed | **2** (`draw.mjs`, `lint.mjs`) |

The remaining 249 skills are cloud, backend, document, integration, agent and workflow skills that this static marketing site does not need. They are out of scope by the brief's own instruction ("do not spend the phase on unrelated deployment/database/backend/testing/infra skills unless the site needs them").

---

## 3. Inventory by category

### 1. UI/UX and user-centred design

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `impeccable` | `AI_Skills_Pack/skills/ui-ux-design/impeccable/SKILL.md` | A command router for shaping, critiquing, auditing, polishing, harden­ing, animating and typesetting an interface; four visitor modes (Persuade / Operate / Read / Experience); "refinement preserves, redesign replaces" | The site is a **Persuade + Experience** surface. Gives the audit/refine commands and the craft floor used for the final pass | **Fully read**; 8 refs reviewed; **Ready to apply** | `reference/{craft-floor,new-work,audit,animate,typeset,layout,colorize,polish}.md` read. 54 command refs unread (routes not used) |
| `design-taste-frontend` | `…/ui-ux-design/design-taste-frontend/SKILL.md` | The house style derived from a measured study of 248 gallery sites: no eyebrows/mono labels/numbering/hairlines/gradients/shadows; ≤2 faces; display ≥4× body; margins 16–32px; one accent <5%; one signature move; drawings with three levels of detail | The strictest and best-evidenced rule set available. Its `draw.mjs` dealt the site's art direction and its `lint.mjs` audited the current build (186 FAIL / 139 WARN) | **Fully read**; all **9 refs reviewed**; scripts executed; **Ready to apply** | `type,colour,layout,motion,copy,tells,imagery,critique,research.md` all read |
| `gpt-taste` | `…/ui-ux-design/gpt-taste/SKILL.md` | Compact anti-slop checklist: ban generic hero, badge rows, card grids, stock copy; specify the one idea | Fast cross-check during composition | **Fully read**; **Ready to apply** | none |
| `full-output-enforcement` | `…/ui-ux-design/full-output-enforcement/SKILL.md` | Bans truncation and placeholder code; scope count before build | Guarantees the redesign ships complete files, not sketches | **Fully read**; **Ready to apply** | none |

### 2. Front-end / component architecture

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `frontend-design` | `…/ui-ux-design/frontend-design/SKILL.md` | Distinction between decoration and design; composition, hierarchy, restraint | Governs section composition | **Fully read**; **Ready to apply** | none |
| `animated-component-libraries` | `…/ui-ux-design/animated-component-libraries/SKILL.md` | Magic UI / React Bits catalogue, shadcn integration, performance caps | **Not applicable** — the project is vanilla TypeScript + Vite, no React | **Opened** (overview, performance, pitfalls ≈ 120/825) | none |
| `web-artifacts-builder` | `…/general-workflow/web-artifacts-builder/SKILL.md` | Builds self-contained React/Tailwind artifacts | **Not applicable** — this is a deployed Vite site, not a chat artifact | **Discovered** | none |

### 3. Visual design / art direction / design systems

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `high-end-visual-design` | `…/ui-ux-design/high-end-visual-design/SKILL.md` | "expensive" surface craft: large type, generous ground, restrained detail | Read and **selectively applied**; its glass pill nav, eyebrows and double-bezel cards are banned by `design-taste-frontend` and the brief | **Fully read** | none |
| `brandkit` | `…/ui-ux-design/brandkit/SKILL.md` | Premium **brand-kit image** generation: logo concepting, 3×3 boards, colour discipline | **Not governing** — logos are supplied and must not be redrawn. Useful only for its colour-discipline and mockup language | **Opened** (≈120/844) | none |
| `stitch-design-taste` | `…/ui-ux-design/stitch-design-taste/SKILL.md` | Writes a `DESIGN.md` for Google Stitch enforcing anti-generic rules | Its rule list is useful; its Stitch flow and "no custom cursors" are **rejected** for this brief (cursor-*responsive elements* are required, not cursor replacement) | **Fully read** | none |
| `canvas-design` | `…/ui-ux-design/canvas-design/SKILL.md` | Design-philosophy method: name a movement, write 4–6 paragraphs, then express it visually; three levels of detail; craft as the bar | Method for the original SVG/generative graphics that stand in honestly for photography | **Fully read**; **Ready to apply** | 83 template assets not needed |
| `brand-guidelines` | `…/ui-ux-design/brand-guidelines/SKILL.md` | Anthropic's own colours/type (Poppins/Lora, #d97757…) | **Rejected** — applying another company's identity to DENVUP would be a brand violation | **Fully read** | — |
| `theme-factory` | `…/ui-ux-design/theme-factory/SKILL.md` | 10 preset slide themes | **Rejected** — preset palettes contradict "no imposed single palette" and the brand's own orange | **Fully read** | — |

### 4. Layout / grids / responsive

**No standalone `SKILL.md` in the pack.** Governed by `design-taste-frontend/references/layout.md` (fully read) and `impeccable/reference/layout.md` (fully read): 12-column grid, proximity before containers, one spacing scale, squint test, structural reflow rather than scaling, `44px` touch targets.

### 5. Typography and kinetic type

**No standalone `SKILL.md`.** Governed by `design-taste-frontend/references/type.md` (fully read), `…/motion.md` (text motion section, fully read) and `impeccable/reference/typeset.md` (fully read): role scale stated before editing, 45–75ch measure, 16px body floor, `text-wrap: balance/pretty`, tracking −0.02…−0.05em at display sizes, leading 0.85–1.05, ≤2 families.

### 6. Colour theory / contrast

**No standalone `SKILL.md`.** Governed by `design-taste-frontend/references/colour.md` (fully read) and `impeccable/reference/colorize.md` (fully read): one ground + one ink + one accent; accent <5%; flat fields to the edge; contrast 4.5:1 body / 3:1 large and controls; never encode state by colour alone; no gradients as decoration.

### 7. Interaction and microinteractions

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `motion-framer` | `…/3d-motion-creative/motion-framer/SKILL.md` | React animation: variants, gestures, exit, layout, spring presets (gentle 100/20, wobbly 200/10, stiff 400/30), reduced motion | **Not applicable** as code (React-only); spring **timing ratios** inform CSS/GSAP easing | **Opened** (overview, transitions, spring, reduced motion ≈ 160/933) | none |
| `react-spring-physics` | `…/3d-motion-creative/react-spring-physics/SKILL.md` | Physics springs for React | **Not applicable** | **Discovered** | none |

### 8. CSS animation and transform

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `scroll-reveal-libraries` | `…/3d-motion-creative/scroll-reveal-libraries/SKILL.md` | AOS: data-attribute CSS reveals; when **not** to use it (complex timelines, precise scrubbing); `once: true`; disable on mobile; refresh after DOM change | We keep the CSS-reveal discipline but use GSAP/IntersectionObserver, not AOS | **Opened** (overview, performance, pitfalls, AOS-vs-GSAP ≈ 170/821) | none |

### 9. Scroll-triggered and storytelling

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `locomotive-scroll` | `…/3d-motion-creative/locomotive-scroll/SKILL.md` | Smooth-scroll library and ScrollTrigger proxy | **Rejected** — native scrolling is a hard requirement; this library changes scroll physics | **Discovered** | none |

### 10. Intro / loading / brand reveal

**No standalone `SKILL.md`.** Governed by `design-taste-frontend/references/motion.md` (signature opening, `html.js` gate, reduced-motion fallback) and encyclopedia §1 (20 techniques). The current opening already implements the white → box → scale → colour-field sequence, but **without** the three editorial beats and with the first paint gated by JS; the redesign must fix that.

### 11. Page and inter-section transitions

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `barba-js` | `…/3d-motion-creative/barba-js/SKILL.md` | Route transitions, overlays, shared elements | **Not applicable** — one page, no routing; chapter transitions are colour fields, not routes | **Discovered** | none |

### 12. GSAP / ScrollTrigger / tools

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `gsap-scrolltrigger` | `…/3d-motion-creative/gsap-scrolltrigger/SKILL.md` | Tweens/timelines, start/end syntax, scrub, toggleActions, pinning, horizontal-in-vertical, batch, parallax, `invalidateOnRefresh`, disposal, easing | The build's motion engine (`gsap@3.15.0` already installed). Governs the horizontal chapter, sticky stage and scrub timing | **Fully read**; **Ready to apply** | bundled `references/*` unread (API/easing tables not needed) |

### 13. SVG / vector / masking / morphing

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `animejs` | `…/3d-motion-creative/animejs/SKILL.md` | Stagger incl. `from: 'center'`, `strokeDashoffset` line drawing, path morphing, spring/steps/custom easing, playback control | **Principles only** — the same effects are done with GSAP + CSS; no new dependency. `strokeDashoffset` maths and grid-stagger-from-centre reused | **Opened** (core, stagger, SVG, performance ≈ 230/526) | none |

### 14. 3D / WebGL / shaders / spatial

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `threejs-webgl` | `…/3d-motion-creative/threejs-webgl/SKILL.md` | Scene/camera/renderer, materials, instancing, raycasting, GSAP camera animation, resize, disposal, colour space, DPR | Drives the one WebGL object in the opening/identity chapter | **Fully read**; **Ready to apply** | bundled refs unread |
| `web3d-integration-patterns` | `…/3d-motion-creative/web3d-integration-patterns/SKILL.md` | Layered Three.js + GSAP + DOM; on-demand render loop; decision matrix ("marketing landing page with scroll-driven 3D → Three.js + GSAP") | Confirms the architecture: one canvas, ScrollTrigger drives it, DOM stays authoritative | **Opened** (overview, performance, decision matrix ≈ 120/853) | none |
| `lightweight-3d-effects` | `…/3d-motion-creative/lightweight-3d-effects/SKILL.md` | CSS tilt, magnetic hover, Vanta/Zdog backgrounds, device caps | Tilt/magnetic behaviour for the card and CTA chapters, disabled on touch | **Opened** (tilt + performance sections) | none |
| `react-three-fiber` | `…/3d-motion-creative/react-three-fiber/SKILL.md` | React renderer for Three.js | **Not applicable** | **Discovered** | none |
| `spline-interactive` | `…/3d-motion-creative/spline-interactive/SKILL.md` | Embedding Spline scenes and runtime events | **Not applicable** — no Spline scene, no runtime asset | **Discovered** | none |
| `blender-web-pipeline` | `…/3d-motion-creative/blender-web-pipeline/SKILL.md` | Blender → glTF → web pipeline | **Blocked** — no Blender in this environment and no model assets | **Discovered** | none |

### 15. Canvas / particles / generative

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `pixijs-2d` | `…/3d-motion-creative/pixijs-2d/SKILL.md` | WebGL 2D renderer, ParticleContainer, filters, object pooling | **Not used** — Canvas2D at our particle counts; adding Pixi would be a dependency without a need | **Opened** (when-to-use, performance ≈ 100/936) | none |
| `algorithmic-art` | `…/3d-motion-creative/algorithmic-art/SKILL.md` | Philosophy-driven generative art, seeded reproducibility, parameter design, craftsmanship bar | The generative chapter's canvas: seeded, deterministic, ownable | **Fully read**; **Ready to apply** | `templates/viewer.html` not used (Anthropic-branded shell) |

### 16. Image composition and animation

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `imagegen` | `…/general-workflow/imagegen/SKILL.md` | When to generate vs draw; labelled prompt schema (use case, asset type, scene, subject, style, composition, lighting, palette, constraints, avoid); inspect and iterate; no text/logos | The only honest way to get original imagery here: **no external image host is reachable** (`picsum.photos` and `images.unsplash.com` both return `000`) | **Fully read**; **Ready to apply** | 2 refs unread (sample prompts) |
| `imagegen-frontend-web` | `…/ui-ux-design/imagegen-frontend-web/SKILL.md` | Hero composition bias (11 alternatives to left-text/right-image), section rhythm, typography-first, anti-slop | Composition checks for the page comps; explicitly forbids the default split hero | **Opened** (core directive, hero bias, typography, rhythm ≈ 120/988) | none |
| `image-to-code` | `…/ui-ux-design/image-to-code/SKILL.md` | Image-first workflow; deep analysis; **anti-drift** rule; missing-detail resolution order | Anti-drift is the main risk in a large hand-coded redesign; its resolution order is adopted | **Opened** (core, anti-drift, missing detail ≈ 120/1229) | none |
| `imagegen-frontend-mobile` | `…/ui-ux-design/imagegen-frontend-mobile/SKILL.md` | Mobile app screen art direction | **Not applicable** — responsive website, not an app | **Discovered** | none |

### 17. Creative direction / inspiration

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `design-taste-frontend-v2-experimental` | `…/ui-ux-design/design-taste-frontend-v2-experimental/SKILL.md` | Earlier experimental variant | **Rejected** — superseded by the current v3 (`design-taste-frontend`); using both would fork the rules | **Discovered** | none |

The actual inspiration library is not a separate skill: it is `design-taste-frontend/library/*.json` (8 files) plus `references/research.md` (the 248-site study). It was exercised through `draw.mjs`; the direction sheet is filed in `.taste-skill/`.

### 18. Navigation / menus / cards / galleries / tabs

**No standalone `SKILL.md` that applies.** `animated-component-libraries` catalogues dock nav, marquee, text reveal and card effects, but is React-only. Governed instead by `design-taste-frontend/references/layout.md` (index/list blueprints), encyclopedia §6–§7, and the site's own `labs` registry (21 mounted demos).

### 19. Forms / CTA / conversion

**No standalone `SKILL.md` applied.** Governed by `design-taste-frontend/references/copy.md` (fully read) and `impeccable/reference/clarify.md` (not yet read — required before any **copy** change to the form). Hard rule from the brief: never show success unless a real submission succeeded.

### 20. Accessibility / keyboard / reduced motion

**No standalone `SKILL.md`.** Governed by `impeccable/reference/audit.md` (fully read) and `modern-web-design/references/accessibility_guide.md` (contrast, keyboard, focus and motion sections read). Key conflict resolved below.

### 21. Mobile-first / touch

**No standalone `SKILL.md` applied.** Governed by `impeccable/reference/adapt.md` (assessment and mobile/tablet strategy read) and `design-taste-frontend/references/layout.md` (per-blueprint phone rules). Rule: adaptation is re-composition, not scaling.

### 22. Performance / optimisation

**No standalone `SKILL.md` applied.** Governed by `impeccable/reference/optimize.md` (assess/measure-first section read), `modern-web-design/references/performance_checklist.md` (60 fps, will-change, images, lazy loading read) and `threejs-webgl` (DPR, disposal, instancing). Measured baseline exists in `TESTING_REPORT.md`.

### 23. Browser compatibility

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `modern-web-design` | `…/ui-ux-design/modern-web-design/SKILL.md` | Modern CSS/JS patterns, accessibility, performance, progressive enhancement, feature detection, scroll-hijack avoidance, token architecture | The compatibility/progressive-enhancement backbone: content visible without JS, feature-detect before using APIs | **Fully read**; 4 refs reviewed (section-level, 3,756 lines); **Ready to apply** | `interaction_patterns`, `accessibility_guide`, `performance_checklist`, `design_trends_2024` |

### 24. UI/UX auditing and refinement

| Skill | Path | What it actually teaches | Why it matters for DENVUP | Status | Supporting refs |
| --- | --- | --- | --- | --- | --- |
| `redesign-existing-projects` | `…/ui-ux-design/redesign-existing-projects/SKILL.md` | Audit an incumbent, keep what works, replace the visual world rather than polishing it, define a new direction | Exactly this task: the current site is evidence, not authority | **Fully read**; **Ready to apply** | none |

`impeccable` (audit/critique/polish) and `design-taste-frontend/references/critique.md` (fully read: caps, score shape, fix order) are the scoring instruments. `design-taste-frontend/scripts/lint.mjs` is the static detector.

### 25. Additional categories actually discovered

#### Verification and quality (needed to validate this build)

| Skill | Path | Why it matters | Status |
| --- | --- | --- | --- |
| `webapp-testing` | `…/testing-quality-security/webapp-testing/SKILL.md` | Test the served app, console errors, responsive checks | **Fully read**; **Blocked** — no browser binary can be installed |
| `diagnosing-bugs` | `…/testing-quality-security/diagnosing-bugs/SKILL.md` | Red test before fix; reproduce before changing code | **Fully read**; **Ready to apply** |
| `playwright-interactive` | `…/testing-quality-security/playwright-interactive/SKILL.md` | Persistent browser debugging | **Fully read**; **Blocked** — no browser |
| `playwright` | `…/testing-quality-security/playwright/SKILL.md` | Browser automation | **Fully read**; **Blocked** — no browser |
| `tdd` | `…/testing-quality-security/tdd/SKILL.md` | Red-green-refactor | **Discovered** — suite already established; will read before changing test structure |
| `code-review` | `…/engineering-workflow/code-review/SKILL.md` | Review discipline | **Discovered** |

#### Documentation discipline

| Skill | Path | Why it matters | Status |
| --- | --- | --- | --- |
| `writing-for-agents` | `…/engineering-workflow/writing-for-agents/SKILL.md` | Documents written so a future agent can act on them | **Fully read**; **Ready to apply** |

#### Design-tool pipeline (real, inaccessible here)

| Skill | Path | Why it matters | Status |
| --- | --- | --- | --- |
| `figma`, `figma-code-connect-components`, `figma-create-design-system-rules`, `figma-create-new-file`, `figma-generate-design`, `figma-generate-library`, `figma-implement-design`, `figma-use`, `figma-implement-design` | `AI_Skills_Pack/skills/ui-ux-design/figma*/SKILL.md` | Would let a real Figma file drive the visual system and code | **Blocked** — no Figma account, file or MCP connection in this environment; none opened |
| `lottie-animations` | `…/3d-motion-creative/lottie-animations/SKILL.md` | Designer-made vector animation | **Not applicable** — no Lottie source assets; animation is authored in code |
| `rive-interactive` | `…/3d-motion-creative/rive-interactive/SKILL.md` | State-machine vector animation | **Not applicable** — no `.riv` asset |
| `screenshot` | `…/general-workflow/screenshot/SKILL.md` | Capture the rendered page | **Blocked** — no browser |

---

## 4. Conflicts found between skills, and how they are resolved

Resolution order adopted from the dealt direction sheet: **brief / house rules → the direction → type and palette → hero → sections.**

| Conflict | Skills | Resolution for DENVUP |
| --- | --- | --- |
| Eyebrows, pill nav, glass, blur, double-bezel cards | `high-end-visual-design` **for**; `design-taste-frontend`, `impeccable/reference/craft-floor.md`, `stitch-design-taste` **against** | **Against.** Remove `section-head__eyebrow` and `service-card__index`; no pills, no glass cards, no resting shadows |
| Custom cursor | `modern-web-design`, `design_trends_2024` **for**; `design-taste-frontend/references/motion.md`, `stitch-design-taste` **against** | **Do not replace the system cursor.** Build *cursor-responsive elements* (magnetic CTA, proximity-aware index, pointer-lit image) that keep the native cursor visible and work by keyboard |
| Motion for reduced-motion users | `modern-web-design/references/accessibility_guide.md` proposes a global `0.01ms` kill; `impeccable/reference/audit.md` flags that as destroying meaningful feedback | **Per-component alternative**: remove spatial movement, keep opacity/colour/state changes; content always visible without JS |
| Smooth scrolling | `locomotive-scroll`, `gsap-scrolltrigger` proxy **for**; brief and `modern-web-design` pitfall 6 **against** | **Native scroll only.** ScrollTrigger for pin/scrub, never for scroll physics |
| Numbering, monospace labels, hairlines | Present on award sites (38–45%) per `research.md`; banned by `design-taste-frontend` | **Banned as house style**, as the research itself notes. Structure must come from space, tone and scale |
| Section rhythm | `stitch-design-taste` and `modern-web-design` ask for uniform section spacing; brief asks for distinct chapters | **Controlled irregularity**: one shared section gap at the seams, radically different internal composition per chapter. No two neighbouring chapters share a layout |
| Preset palettes | `theme-factory` offers 10 themes | **Rejected.** Brand orange and its fields; chapter variation comes from proportion and ground, not new hues |
| Generated imagery | `imagegen` permits it; `design-taste-frontend` demands "real pictures" and honesty | **Generate only material/atmosphere** (no people, no fake UI, no logos, no text). Draw the studio's own systems in SVG/Canvas. Disclose both in `ASSETS.md` and on the page |

---

## 5. Inaccessible skills and genuine blockers

1. **All nine Figma skills** — no Figma file, account or MCP bridge. Not consulted; no claim made about their content.
2. **Browser-dependent skills** (`webapp-testing`, `playwright`, `playwright-interactive`, `screenshot`) — read, but no browser can be installed: every CDN/deb host returns `000`. Visual verification in a real browser is **not possible** in this environment and is reported as such.
3. **`blender-web-pipeline`** — no Blender, no models.
4. **`impeccable` launcher and detector** — the skill's binary is downloaded on first run; outbound access does not include its host. The skill's own fallback is followed: read the references directly (done) and disclose that the detector did not run.
5. **`design-taste-frontend` `inspect.mjs`** — needs a rendered page (browser). `lint.mjs` (static) **did** run.
6. **Image sourcing** — `assets.mjs` cannot reach Unsplash/Picsum/Wikimedia (`000`). No found photography is used or claimed.

---

## 6. The encyclopedia — technique inventory and comparison with the site

`AI_Skills_Pack/Website_Animation_Interaction_Encyclopedia.md` was read in full (577 lines, 23 sections, 480 numbered techniques). Its own instruction is that it is "a menu of possibilities, not a mandatory checklist"; the brief overrides that and requires coverage of all 480, so every technique must be represented somewhere in the page or the Effects Library, with an honest status.

### 6.1 Section-by-section state (from `ANIMATION_COVERAGE_MATRIX.md`, which is generated from `coverage-map.ts`)

| § | Section | Techniques | Tested | Implemented | Blocked | Planned |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Loading / startup | 20 | 4 | 16 | 0 | 0 |
| 2 | Cursor / pointer | 30 | 0 | 30 | 0 | 0 |
| 3 | Buttons / micro | 30 | 0 | 30 | 0 | 0 |
| 4 | Typography motion | 30 | 0 | 30 | 0 | 0 |
| 5 | Scroll-driven | 40 | 0 | 38 | 0 | 2 |
| 6 | Section transitions / nav | 25 | 0 | 15 | 0 | 10 |
| 7 | Cards / grids / galleries | 30 | 0 | 30 | 0 | 0 |
| 8 | SVG / illustration | 20 | 0 | 20 | 0 | 0 |
| 9 | 3D / WebGL | 25 | 0 | 8 | 13 | 4 |
| 10 | Particles / generative | 20 | 0 | 10 | 0 | 10 |
| 11 | Materials / lighting | 30 | 0 | 26 | 0 | 4 |
| 12 | Service / data storytelling | 25 | 1 | 10 | 0 | 14 |
| 13 | Process / timeline | 15 | 0 | 12 | 0 | 3 |
| 14 | Team / people | 15 | 0 | 4 | 9 | 2 |
| 15 | Pricing / FAQ / forms | 25 | 17 | 2 | 0 | 6 |
| 16 | Audio / video | 15 | 0 | 3 | 9 | 3 |
| 17 | Easter eggs | 15 | 0 | 10 | 0 | 5 |
| 18 | Responsive / touch | 15 | 0 | 13 | 0 | 2 |
| 19 | Accessibility / resilience | 15 | 1 | 11 | 0 | 3 |
| 20 | Performance | 20 | 0 | 18 | 0 | 2 |
| 21 | Advanced experimental | 20 | 0 | 6 | 14 | 0 |
| | **Total** | **480** | **23** | **342** | **45** | **70** |

### 6.2 Findings that change the plan

1. **The catalogue is mis-numbered at IDs 1–8.** `src/content/technique-catalogue.json` contains the eight *selection questions* from encyclopedia §22 at IDs 1–8 instead of the first eight loading techniques (minimal loader, circular loader, linear bar, indeterminate bar, skeleton, logo reveal, logo from parts, letter-by-letter reveal). IDs 9–480 match the source exactly. So the matrix's "480 covered" includes 8 non-techniques, and 8 real techniques are absent. **Must be fixed before any coverage claim is repeated.**
2. **"Implemented" is declared, not observed.** Only 23 of 480 are `Tested`, and the tests are structural (mount/unmount, ids, ARIA), not visual. With no browser, this cannot be upgraded by assertion. The redesign must add real page-level usage and keep the status honest.
3. **The techniques are concentrated in the Effects Library, not the page.** 148 demos exist, but the journey itself uses a small fraction. The redesign's job is to move technique into composition: the page should *be* the demonstration.
4. **Section 9 (3D) and 21 (advanced) are 27 of the 45 blocked items** — WebGL-dependent techniques blocked by device/perf policy. A single well-built WebGL chapter plus CSS/Canvas fallbacks can unblock a meaningful subset without pretending.
5. **Section 15 is the only well-tested area (17 tested)** because forms are testable without a browser. That is evidence the other statuses are optimistic, not that the forms are excellent.

### 6.3 Comparison against the current site — implemented / incorrect / incomplete / unused / new

| Verdict | Evidence |
| --- | --- |
| **Implemented and correct** | Opening box→field sequence; 21 lab groups; 148 mountable demos; sticky chapter nav; form validation and honest submit states; reduced-motion branch on every lab (`reduced` in `LabContext`); native scroll |
| **Implemented incorrectly** | (a) IDs 1–8 of the catalogue; (b) `section-head__eyebrow` and `service-card__index` violate the house rules; (c) the first editorial beat is prerendered but set to `opacity: 0` by `.js [data-reveal]` and only restored by an IntersectionObserver — there is **no failure timeout**, so a script error after boot leaves the opening invisible even though the text is in the HTML; (d) the global reduced-motion `0.001ms` rule removes feedback instead of replacing movement; (e) uniform card/eyebrow/reveal language across chapters — the "same fade everywhere" failure named by both `design-taste-frontend` and `impeccable/animate.md` |
| **Incomplete** | Horizontal-in-vertical exists only as a lab, not as a chapter; no chapter-level colour transition; team chapter has no honest portrait alternative; 70 Planned and 45 Blocked techniques remain; Effects Library lacks the full filter/search contract |
| **Unused but available** | Pinned narrative with changing visuals; image-mask reveals at page scale; variable-font weight animation; SVG path drawing tied to scroll; cursor-responsive type; 3D scroll camera; generative seeded field; live pricing estimator |
| **New improvements (not in the encyclopedia)** | A chapter whose composition *is* the technique (the "proof chapter"); a live "specimen sheet" of the studio's type and grid; a scroll-driven colour-temperature shift that carries the brand rather than decorating it; a single WebGL object that survives from opening to closing as a recurring motif |
| **Possible combinations** | Monument type + mask reveal + WebGL object behind it (chapters 2–3); horizontal gallery + pinned stage + live technique caption (capabilities); staircase process + scroll-drawn line + step-activated artwork (process); index list + sticky preview + cursor proximity (showcase); email-as-display-type + form + honest fallback (contact); seeded generative field + brand mark construction (identity) |

---

## 7. Principles learned, and how they will shape the redesign

1. **One idea only this studio can own.** The research is unambiguous: high scores go to a concept taken from the subject. DENVUP has no client work it may claim and no photographs of itself. What it *does* own is the catalogue of techniques it can build. Therefore: **the page is the demonstration** — every chapter is a live proof of a discipline, and the Effects Library is the index of the proof. No fabricated projects, testimonials or portraits.
2. **The name is the monument.** The dealt direction sets `DENVUP` at 16–24vw on the first screen, one small sentence, three or four links, and the page deliberately quiet after it. That gives the opening its scale and gives the chapters room to differ.
3. **One signature move, then choreography.** The opening is the authored sequence (white → three beats → box → full field). Every other chapter gets one gesture tied to its content — not a universal fade-and-rise. Stagger 60–90 ms, 16–32 px; exits faster than entrances.
4. **Structure from space, tone and scale.** No eyebrows, no numbering, no mono labels, no hairlines, no pills, no gradients, no glass, no resting shadows. Hierarchy comes from size contrast (display ≥4× body), measure (45–75ch), and full-bleed colour fields.
5. **Every chapter is a different place.** White, ink, orange, clay, bone as complete fields meeting edge to edge; one accent used on the single action. No two neighbouring chapters share a composition; one planned exception breaks the system.
6. **Draw the subject honestly.** SVG/Canvas diagrams of the studio's own systems (grid, type scale, technique atlas, mark construction) with three levels of detail; generated material imagery only as atmosphere, disclosed. No stock, no fake screenshots, no portraits.
7. **Motion must explain something.** Each animation answers: what state, relationship or hierarchy does this make legible? If it cannot, it is removed.
8. **Reduced motion is a design, not a switch.** All content and state changes survive; movement is replaced, not deleted.
9. **Native scroll, real DOM, content first.** No scroll hijack, no custom cursor replacement, no JS-gated first paint, no canvas-only content.
10. **Call the work what it is.** With no browser in this environment, visual verification is declared impossible; the build is validated by static analysis, type-checking, the test suite, prerender output and byte-level checks. No claim of "seen working" will be made.
