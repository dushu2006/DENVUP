# Skills study list — DENVUP (master-prompt pass)

**Created:** 19 October 2026, before any code for the page-structure/transition rebuild.
**Pack:** `AI_Skills_Pack/` (read-only). **Project:** `DENVUP-LandingPage/`.
**Companion registers:** `UI_UX_SKILLS_INVENTORY.md` (what each skill contains and why it matters), `SKILL_REFERENCE_AUDIT.md` (per-action evidence).

This file answers three questions the brief asks for: **what exists, what was selected, what was actually read** — with exclusions and reasons. It does not repeat the full inventory; it is the study ledger for this build.

---

## 1. Discovery

| Step | Method | Result |
| --- | --- | --- |
| Canonical skills | `find AI_Skills_Pack/skills -name SKILL.md` | **303** |
| Mirrors and variants | `find AI_Skills_Pack -name SKILL.md` | **724** total; 400 are `sources/` mirrors and 21 are `compatibility/` agent formats. Mirrors are not counted as separate skills |
| Indexes and manifests | `SKILL-INDEX.md`, `MANIFEST.json`, category folders | 10 categories, 300 unique frontmatter names |
| Keyword sweep | css, html, frontend, ui, ux, design, typograph, colour, layout, grid, responsive, animation, motion, transition, scroll, cursor, webgl, shader, canvas, svg, 3d, accessib, performance, form, conversion, navigation, component, browser, image, brand, visual, interaction, loading, intro, copy | **69** description hits; **14** outside the four obvious categories |
| Screened set | Every skill in `ui-ux-design` (29), `3d-motion-creative` (23), `testing-quality-security` (14), `general-workflow` (6) plus the 14 extra hits | **86** skills screened by description and file size |
| Assessed as relevant to this site | Inventory pass | **62** |
| Encyclopedia | `AI_Skills_Pack/Website_Animation_Interaction_Encyclopedia.md` | **577 lines, 23 sections, 480 techniques**, all read |

**Filename note.** The brief names `Website_Animation_Interaction_Encyclopedia_1.md` and "the earlier encyclopedia file if both exist". Only **one** file exists — `Website_Animation_Interaction_Encyclopedia.md`. It contains **21 technique sections** (§1–§21, 480 IDs) plus §22 "How to choose" and §23 "Non-negotiable rules", which accounts for the "21 categories" in the brief. No second file was found; nothing is claimed about a file that is not in the repository.

---

## 2. Totals

| Measure | Count |
| --- | --- |
| Canonical skills in the pack | **303** |
| Screened | **86** |
| Selected as relevant | **62** |
| **Fully read** (`SKILL.md` end to end) | **25** |
| **Opened** to the decision depth (fraction stated) | **10** |
| **Discovered only** (N/A or rejected, instructions not opened) | **17** |
| Excluded at screening (outside this site's disciplines) | **217** |
| Blocked by environment | **7 rows** (8 Figma skills, Blender, Substance, browser ×4) |
| Supporting references reviewed | **25** files |
| Scripts executed | **2** (`draw.mjs`, `lint.mjs`) |
| Encyclopedia techniques | **480 / 480 inventoried**; see §5 for the build's current split |

A skill is marked **Fully read** only when the whole file was read in this workspace. Statuses below are identical to `UI_UX_SKILLS_INVENTORY.md` §3; that file carries the long-form summary of each skill.

---

## 3. Selected skills, with concrete takeaways

### 3.1 Governing design skills — read in full

| Skill | Path | Concrete takeaway used in this build | Status |
| --- | --- | --- | --- |
| `design-taste-frontend` | `AI_Skills_Pack/skills/ui-ux-design/design-taste-frontend/SKILL.md` | Deal a direction, take the idea from the subject, one live thing, two-line headlines, no eyebrows/numbering/hairlines/gradients/shadows/mono, ≥4 real pictures, look at the render | **Fully read** + 9 refs |
| `impeccable` | `…/ui-ux-design/impeccable/SKILL.md` | Persuade/Experience modes; “the brief wins”; “refinement preserves; redesign replaces”; craft floor before any edit | **Fully read** + 11 refs |
| `frontend-design` | `…/ui-ux-design/frontend-design/SKILL.md` | One orchestrated moment; spend boldness in one place; structural devices must encode information; copy is design | **Fully read** |
| `redesign-existing-projects` | `…/ui-ux-design/redesign-existing-projects/SKILL.md` | Audit before editing; work with the stack; fix in impact order; no framework migration | **Fully read** |
| `high-end-visual-design` | `…/ui-ux-design/high-end-visual-design/SKILL.md` | Variance mandate; macro-whitespace; custom easing. Eyebrows/glass/bezels rejected | **Fully read** (partly rejected) |
| `minimalist-ui` | `…/ui-ux-design/minimalist-ui/SKILL.md` | Motion should feel invisible; transform/opacity only; reduced-motion block mandatory. Bento rejected | **Fully read** (partly rejected) |
| `industrial-brutalist-ui` | `…/ui-ux-design/industrial-brutalist-ui/SKILL.md` | Grid determinism (`gap: 1px`), extreme scale contrast. Mono/scanlines rejected | **Fully read** (partly rejected) |
| `gpt-taste` | `…/ui-ux-design/gpt-taste/SKILL.md` | Hero ≤2–3 lines; no “SECTION 01” labels; contrast on buttons. GSAP mandate rejected | **Fully read** (partly rejected) |
| `modern-web-design` | `…/ui-ux-design/modern-web-design/SKILL.md` | Progressive enhancement; native scrolling; feature detection; **View Transitions API as progressive enhancement** (line 428); reduced motion keeps content | **Fully read** + 4 refs |
| `canvas-design` | `…/ui-ux-design/canvas-design/SKILL.md` | Name the movement, then express it; three levels of detail; craft as the bar | **Fully read** |
| `stitch-design-taste` | `…/ui-ux-design/stitch-design-taste/SKILL.md` | Anti-generic rule list; Stitch-specific flow not applicable | **Fully read** |
| `algorithmic-art` | `…/3d-motion-creative/algorithmic-art/SKILL.md` | Seeded reproducibility; parameters as design; craft bar | **Fully read** |
| `imagegen` | `…/general-workflow/imagegen/SKILL.md` | Prompt schema scene → subject → details → constraints → intent; inspect and iterate; no text/logos/people for material plates | **Fully read** + prompting ref |
| `writing-for-agents` | `…/engineering-workflow/writing-for-agents/SKILL.md` | Pointer wording decides reach; one meaning in one place; checkable completion criteria | **Fully read** |
| `diagnosing-bugs` | `…/testing-quality-security/diagnosing-bugs/SKILL.md` | A tight, red-capable loop before any fix | **Fully read** |
| `webapp-testing` | `…/testing-quality-security/webapp-testing/SKILL.md` | Check for a running server; recon before action; test real states | **Fully read** (blocked: no browser) |
| `playwright`, `playwright-interactive` | `…/testing-quality-security/{playwright,playwright-interactive}/SKILL.md` | The correct final check is a real browser | **Fully read** (blocked) |
| `prototype` | `…/engineering-workflow/prototype/SKILL.md` | Throwaway prototypes answer one question; never ship them | **Fully read** |
| `full-output-enforcement` | `…/ui-ux-design/full-output-enforcement/SKILL.md` | No truncation, no placeholder code; count scope before building | **Fully read** |
| `grill-me` | `…/engineering-workflow/grill-me/SKILL.md` | 7 lines; routes to a `grilling` skill not present. No instructions to apply | **Fully read** (incomplete) |
| `brand-guidelines`, `theme-factory` | `…/ui-ux-design/{brand-guidelines,theme-factory}/SKILL.md` | Rejected: another company's identity; preset palettes | **Fully read** (rejected) |
| `gsap-scrolltrigger`, `threejs-webgl` | `…/3d-motion-creative/{gsap-scrolltrigger,threejs-webgl}/SKILL.md` | Pin/scrub semantics; one renderer, DPR cap, resize, dispose, context-loss handling. Libraries not shipped | **Fully read** (reference) |

### 3.2 Opened to decision depth

| Skill | Path | Fraction / sections read | Decision | Status |
| --- | --- | --- | --- | --- |
| `web3d-integration-patterns` | `…/3d-motion-creative/web3d-integration-patterns/SKILL.md` | Overview + layered-separation architecture + performance (§1–§2) ≈150/852 | Adopt **layered separation and one render loop**; the rest is GSAP/R3F-specific and not used | Opened |
| `lightweight-3d-effects` | `…/3d-motion-creative/lightweight-3d-effects/SKILL.md` | Tilt, magnetic, performance, device caps ≈250/1091 | Magnetic/tilt only on fine pointers; disable on touch | Opened |
| `animejs` | `…/3d-motion-creative/animejs/SKILL.md` | Core, stagger, SVG drawing, spring ≈300/525 | Principles only (`strokeDashoffset`, stagger-from-centre); no dependency | Opened |
| `scroll-reveal-libraries` | `…/3d-motion-creative/scroll-reveal-libraries/SKILL.md` | Overview, pitfalls, AOS vs GSAP ≈170/821 | No AOS; CSS/IntersectionObserver only | Opened |
| `imagegen-frontend-web` | `…/ui-ux-design/imagegen-frontend-web/SKILL.md` | Core directive, hero bias, typography, rhythm ≈250/987 | Composition checks; no default split hero | Opened |
| `image-to-code` | `…/ui-ux-design/image-to-code/SKILL.md` | Core, anti-drift, missing detail ≈120/1229 | Anti-drift rule only; no image-first pipeline | Opened |
| `motion-framer` | `…/3d-motion-creative/motion-framer/SKILL.md` | Overview, springs, reduced motion ≈160/933 | Not applicable (React) | Opened |
| `pixijs-2d` | `…/3d-motion-creative/pixijs-2d/SKILL.md` | When-to-use, performance ≈100/935 | Not used; Canvas2D suffices | Opened |
| `animated-component-libraries` | `…/ui-ux-design/animated-component-libraries/SKILL.md` | Overview, performance ≈120/824 | Not applicable (React) | Opened |
| `brandkit` | `…/ui-ux-design/brandkit/SKILL.md` | Colour discipline ≈120/843 | Logos are supplied; not used | Opened |

### 3.3 Discovered only (N/A or rejected, with reason)

`design-taste-frontend-v1` (superseded), `design-taste-frontend-v2-experimental` (superseded), `locomotive-scroll` (rejected: changes scroll physics), `barba-js` (not applicable: static multi-page uses View Transitions), `react-spring-physics`, `react-three-fiber`, `spline-interactive`, `aframe-webxr`, `babylonjs-engine`, `playcanvas-engine`, `substance-3d-texturing`, `blender-web-pipeline` (blocked), `lottie-animations`, `rive-interactive`, `imagegen-frontend-mobile`, `web-artifacts-builder`, `screenshot` (blocked), `tdd`, `code-review`.

### 3.4 Blocked

| Skill family | Path | Reason | Consequence |
| --- | --- | --- | --- |
| `figma`, `figma-use`, `figma-generate-design`, `figma-implement-design`, `figma-create-design-system-rules`, `figma-create-new-file`, `figma-generate-library`, `figma-code-connect-components` | `AI_Skills_Pack/skills/ui-ux-design/figma*/SKILL.md` | No Figma account, file or MCP connection | No Figma-derived system claimed |
| `blender-web-pipeline`, `substance-3d-texturing` | `…/3d-motion-creative/*` | No application, no models/textures | 3D is CSS/canvas; 3D rows name alternatives |
| `screenshot`, `webapp-testing`, `playwright`, `playwright-interactive` | `…/general-workflow`, `…/testing-quality-security` | No Chrome/Chromium binary (`which` returns none) | **Acceptance tests 1–5 of the master prompt cannot be run here.** Disclosed, never simulated |

---

## 4. What the study changes in this build

1. **Routing.** No routing skill exists in the pack. The only governing line is `modern-web-design` line 428: “View Transitions API (Chrome 111+, progressive enhancement)]. Adopt **static multi-page routes + cross-document View Transitions with named elements**, falling back to normal navigation. No SPA router, no history hijack.
2. **Persistent stage.** `threejs-webgl` + `web3d-integration-patterns` → **one** canvas, layered under the DOM, DPR capped at 2, paused offscreen, disposed on route change; CSS gradient/particle fallback when WebGL is unavailable or the device is weak.
3. **Cursor.** Encyclopedia §2 + `modern-web-design` Pattern 6 + `lightweight-3d-effects` → dot + ring, contextual labels, colour by chapter, native cursor on touch and on failure. It must be *visible*: no `mix-blend-mode` that disappears on orange, and a 1px contrasting rim.
4. **Transitions.** `design-taste-frontend/references/motion.md` + encyclopedia §6 → every chapter gets a named entrance and exit with a technique ID; plain fades are not allowed.
5. **Accessibility.** `modern-web-design/references/accessibility_guide.md` + `craft-floor` → focus 2px/3:1, reduced-motion end states, content never hidden by CSS alone.
6. **Imagery.** `imagegen` → original material plates only; no people, no client work, no text in images.

---

## 5. Encyclopedia coverage baseline (before this rebuild)

`ANIMATION_COVERAGE_MATRIX.md` is generated from `src/content/coverage.ts` and currently reports **480 rows**: 23 Tested, 342 Implemented, 0 Requires revision, 45 Blocked, 70 Planned. It has a **verified defect**: catalogue IDs 1–8 are the eight §22 questions, not techniques 1–8, and three loader lab modes claim those IDs. The real techniques 1–8 are missing from the matrix. Repair is action **A18**; until it lands, the true accounted-for count is 472.

---

## 6. Honesty note

- 40% of the 62 relevant skills are fully read; the rest are opened to a stated fraction, discovered only, or blocked. The inventory states each one rather than claiming blanket coverage.
- The 10 opened skills are all **non-adopted** libraries/workflows; none authorises a code change.
- No browser test is claimed anywhere in this project. The master prompt’s acceptance tests 1–5 require one and will be reported as **not performed** unless the environment changes.
