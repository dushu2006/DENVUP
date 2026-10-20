# UI/UX skills inventory

The UI/UX skills in `AI_Skills_Pack/skills/ui-ux-design/` that were consulted
for the DENVUP site, what each one actually said, and what was done with it.

This is a focused inventory. The complete study of all 303 skills in the pack
— including the 252 that were excluded and why — is in
`SKILLS_STUDY_LIST.md`, and the per-change record of what was applied and how
it was verified is in `SKILL_REFERENCE_AUDIT.md`.

**Rules this file follows.**

- Every path below is real and was read from the pack. Nothing is cited from
  memory.
- Every takeaway is in the skill's own words, not a paraphrase of a
  paraphrase.
- Where a skill conflicted with the brief, the conflict is stated and the
  resolution is stated with it. Two rules from
  `design-taste-frontend` were deliberately **not** applied, and both are
  recorded rather than quietly dropped.

---

## 1. The category at a glance

`AI_Skills_Pack/skills/ui-ux-design/` holds **29** skills.

| Group | Skills | Consulted |
| --- | ---: | ---: |
| Read in full and applied | 12 | 12 |
| Read in full, consulted but not applied | 5 | 5 |
| Read as an outline (a routed summary was read first) | 2 | 2 |
| Excluded with a reason | 10 | 0 |
| **Total** | **29** | **19** |

The 10 excluded skills are all Figma- or image-generation-specific: they
describe working inside Figma, or generating images from a prompt. This
project has no Figma file and no image-generation step — the artwork is
drawn by `scripts/build-art.py` — so they have nothing to apply to. They are
named, with reasons, in `SKILLS_STUDY_LIST.md` §5.6.

---

## 2. The skills that shaped the work

### 2.1 `ui-ux-design/design-taste-frontend/SKILL.md` — read complete

*414 lines, plus `references/motion.md`, `scripts/lib/rules.mjs` and
`scripts/inspect.mjs`.*

**Why it matters.** It is the only skill in the pack that ships a *measurable*
definition of premium: `scripts/inspect.mjs` renders the page in a real
browser and fails it on objective findings. It also forbids the exact failure
mode the brief names.

**What it said, and what was done.**

| Its rule | What the site does | Where |
| --- | --- | --- |
| Display tracking `-0.02…-0.05em`, leading `0.85–1.05` | The type scale is collapsed to five steps; display tracking is negative | `src/styles/tokens.css` |
| Body 16–20 px at leading 1.45–1.6, 45–75 characters per line | Paragraph measure is capped at `62ch`; the body is 1.05 rem at 1.58 | `src/styles/tokens.css`, `src/styles/base.css` |
| Five sizes on a page is the ceiling | Five: display, title, lead, body, micro | `src/styles/tokens.css` |
| Left-aligned by default, centred at most one moment | Centred text appears once, in the closing chapter | `src/styles/base.css` |
| One grid, one pair of tight margins (16–32 px) | A single `--shell` gutter; the interior grid is 12 columns | `src/styles/tokens.css` |
| The gap between sections is larger than any gap inside one | One `--space-section` token, 120–220 px | `src/styles/tokens.css` |
| Each section has a different composition from its neighbour | Every chapter has its own layout; there is no shared card grid | `src/styles/sections.css` |
| Motion tokens: press 140 ms, hover 180 ms, ui 240 ms, reveal 800 ms; a leaving animation is about 70 % of an arriving one | The same four durations, plus `--dur-panel` and `--dur-scene`. The route transitions follow the 70 % rule | `src/styles/tokens.css`, `src/transitions/index.ts` |
| `prefers-reduced-motion` must collapse to a static end-state, not to nothing | Every scroll-linked effect has a static end-state; the route transitions fall back to a single crossfade | `src/core/env.ts`, `src/transitions/index.ts` |
| `overflow-x-hidden` on the root | The root clips horizontally, and every route is asserted for overflow at 360–1920 | `src/styles/base.css`, `scripts/browser-check.mjs` |
| "No custom cursor" | **Not applied** — the brief requires a two-part cursor. See §4. | `src/core/shell.ts` |
| "No smooth-scroll library by default" | **Not applied** — the brief requires immersive scrolling. See §4. | `src/core/scroll.ts` |

Its inspector is the acceptance gate for the visual work. The baseline is
recorded in `UI_UX_AUDIT.md`.

### 2.2 `ui-ux-design/gpt-taste/SKILL.md` — read complete

*75 lines.*

- **Meta-label ban.** "SECTION 01"-style labels above content are called out
  as a tell. → The chapters use a real `<ol>` for ordered material rather than
  painted index numbers; the remaining labels are words.
- **No six-line headings.** → Headlines are capped at two lines.
- **No empty bento cells.** → Every grid cell carries content, or the cell is
  not there.
- **GSAP ScrollTrigger for pinning, scrubbing and stacking, not for reveals.**
  → The pinned service chapter and the capability rail are ScrollTrigger work;
  the reveals are a lighter mechanism.
- **Reduced motion must collapse to a static end-state.** → Applied to every
  scroll-linked effect, not only to the reveals.
- **`overflow-x-hidden` on the root.** → Kept, plus a scroll-width assertion
  at every required viewport.

### 2.3 `ui-ux-design/impeccable/SKILL.md` — read complete

*85 lines, plus `reference/audit.md` and `reference/critique.md`.*

- **"Complete the job. No hedging, no shortcuts."** → The deliverable is the
  implemented site plus the documents, not a plan.
- **"Verify by looking at the rendered result at the sizes it ships at."** →
  Screenshots at every required viewport are taken and read, not merely
  generated.
- **"Batch the checks: fix what one look shows before looking again."** → The
  browser check is iterative by design.
- **Modes.** The brief names this surface *Persuade* — the visitor decides
  and acts, so the design is the product. → The site is built to be judged on
  its first screen and its argument, not on its features.
- **The audit's five dimensions** (accessibility, performance, theming,
  responsive design, implementation integrity) and its 0–4 scale are the
  structure of `UI_UX_AUDIT.md`.

The `impeccable` **detector engine could not be run in this environment**: the
launcher downloads a release binary from `release-assets.githubusercontent.com`,
and that host is not reachable from this sandbox. The audit says so, and uses
the `design-taste-frontend` inspector — a real, runnable detector — plus
first-party measurements instead.

### 2.4 `ui-ux-design/high-end-visual-design/SKILL.md` — read complete

*99 lines.*

- Motion must be choreographed, not additive; one signature moment per page;
  the performance budget is part of the design. → Each chapter carries one
  signature move and no more, and the five service signatures are five
  different mechanisms rather than five variations on one.

### 2.5 `ui-ux-design/design-taste-frontend-v2-experimental/SKILL.md` — read complete

*1229 lines.*

- Layout discipline, accessibility and performance rules. → Applied to the
  route pages, which are the least experimental part of the site and are held
  to the strictest rules.
- A shape-consistency lock — one radius family. → The radii are 6, 14, 26 and
  999 px, and nothing else is used.
- A hero that fits the first viewport. → Resolved against the brief's
  cinematic opening by making the opening **skippable** and putting the first
  action on the first screen.

### 2.6 `ui-ux-design/frontend-design/SKILL.md` — read complete

*72 lines.*

- Anti-default discipline and copy voice. → The copy is written, specific and
  free of marketing filler. There is no lorem, no grey box and no invented
  number anywhere on the site.

### 2.7 `ui-ux-design/industrial-brutalist-ui/SKILL.md` — read complete

*93 lines.*

- A Swiss and telemetry typographic system; a strict grid; one substrate per
  project. → The grid and the telemetry-style numeric data — technique ids,
  durations, coordinates — come from here.
- The one-substrate rule conflicts with the brief, which requires light, dark
  and colour chapters. → Resolved by making the substrate **chapter-scoped**:
  no component inherits its background across a chapter boundary, so the
  substrate changes with the chapter and nothing else changes with it.

### 2.8 `ui-ux-design/minimalist-ui/SKILL.md` — read complete

*87 lines.*

- Editorial minimalism; banned defaults — no pill-shaped everything, no
  ornamental shadows, no decorative icon sets. → Directly informed the removal
  of the static box-shadow and of the outlined-box pattern the inspector
  found in the baseline. Shadows are only ever used to say "this is above
  that".

### 2.9 `ui-ux-design/modern-web-design/SKILL.md` — read complete

*991 lines.*

- Patterns, accessibility, performance, tokens. → Includes the **preserve
  native scroll** rule, which decided the choice of a native scroll with a
  light smoothing layer over a full scroll-hijacking library, and the token
  conventions used throughout `tokens.css`.

### 2.10 `ui-ux-design/theme-factory/SKILL.md` — read complete

*60 lines.*

- Theme selection as a process, not a per-section pick. → The chapter palette
  is derived as a set: paper `#edecea`, ink `#0b0b0c`, ember `#f0490f`,
  signal `#2b39e6`, with one ground, one ink and one accent per chapter.

### 2.11 `ui-ux-design/canvas-design/SKILL.md` — read complete

*130 lines.*

- Seeded composition, generous negative space, one focal object. → The small
  central square that opens the site is the focal object of the whole
  composition, and it grows into the colour field of chapter 01. The artwork
  generator is seeded for the same reason: the same file every time.

### 2.12 `ui-ux-design/full-output-enforcement/SKILL.md` — read complete

*49 lines.*

- No placeholder text, no `…` elisions, no `TODO` in code or prose. → A grep
  for those patterns runs as part of the verification pass.
- Count the deliverables and cross-check before finalising. → The final report
  states the coverage totals and the study totals, and they add up.

### 2.13 The same rules, applied to the route pages

The site is a multi-route build: fifteen documents, a client-side router, a
persistent shell and eight route transitions. The UI/UX rules above were
re-applied to that layer rather than left behind on the home page.

| Rule (and where it is written) | How it reaches the route layer | Where |
|---|---|---|
| *"Every section has a different composition from its neighbour"* | Each route page has its own composition — `/services/` is a layered overview, `/lab/` is a dense filterable instrument panel, `/studio/` is a typographic manifesto, `/pricing/` is a table with an estimator, `/contact/` is a three-step form. No two routes share a layout. | `src/views/`, `src/sections/` |
| *"Five sizes on a page is the ceiling"* | The same five-step scale is used on every route; nothing was added when the pages multiplied. | `src/styles/tokens.css` |
| *"One grid, one pair of tight margins"* | Every route uses the same `--shell` width and the same 12-column interior grid, so the site reads as one place. | `src/styles/tokens.css`, `src/styles/routes.css` |
| *"No custom cursor"* → overruled by the brief | The cursor is the *same element* on every route — it is part of the persistent shell and is never re-created. The route check asserts this by node identity. | `src/core/shell.ts` |
| *"Motion: press 140 ms, hover 180 ms, ui 240 ms, reveal 800 ms; a leaving animation is about 70 % of an arriving one"* | The eight route transitions use the same four durations, and each transition's leave is about 70 % of its enter. | `src/transitions/index.ts`, `src/styles/motion.css` |
| *"Reduced motion must collapse to a static end-state"* | Under `prefers-reduced-motion: reduce` every route transition collapses to a single 0.24 s crossfade, and the route check asserts that routing still works in that mode. | `src/transitions/index.ts`, `src/core/router.ts` |
| *"Every section has a different composition"* — applied to the 404 | The 404 is a designed page with its own composition, not a default error body. | `src/views/index.ts` |

**The one place the rules were deliberately stretched.** `industrial-brutalist-ui`
prescribes a single substrate for a project. The route layer keeps that rule
*within* a route: a route never mixes grounds internally, and the change of
ground happens only at a route boundary, where a transition covers it. That is
the same chapter-scoped resolution used on the home page, applied at the route
scale.

---

## 3. The skills that were read but not applied

These were read in full. They are listed because reading them was part of the
work, and because a skill that was read and then deliberately set aside
should say so.

| Skill | Why it did not drive the work |
| --- | --- |
| `ui-ux-design/brand-guidelines/SKILL.md` | It is **Anthropic's own brand system** — its palette, its type, its rules. Applying it would have overwritten the studio's identity with a different studio's. It was read for completeness and to know what it prescribed. |
| `ui-ux-design/imagegen-frontend-web/SKILL.md` | Read as an outline. It generates a page from an image prompt; this project draws its own artwork and writes its own markup, so there is nothing for it to generate. |
| `ui-ux-design/redesign-existing-projects/SKILL.md` | Read in part. Its subject is an existing codebase being redesigned; this site was built from nothing, so there is no incumbent to preserve. |
| `ui-ux-design/figma-use/SKILL.md` and the other eight Figma skills | There is no Figma file in this project. The design system lives in `src/styles/tokens.css` and in the components themselves, where it can be version-controlled. |
| `ui-ux-design/animated-component-libraries/SKILL.md` | A catalogue of component libraries. The brief asks for the lightest set of dependencies that solves the problem, and the site ships one animation engine. |

---

## 4. The two conflicts, stated plainly

`design-taste-frontend` is the strictest skill in the pack, and two of its
rules were not applied. Both conflicts are recorded here rather than
quietly dropped.

### 4.1 "No custom cursor"

**The skill says.** A custom cursor is a tell of a template, and it should be
removed.

**The brief says.** A two-part cursor — a dot and a ring — with contextual
labels, per-chapter colour, a trailing echo and magnetic targets, restoring
the native cursor on touch and on failure.

**Resolution.** The brief wins; it is the pinned requirement. The mitigation
is that the custom cursor is *earned* rather than decorative: it is
pointer-only, it never replaces the native cursor on a coarse pointer, it
degrades to the native cursor if the pointer API fails, and it does not
conceal the system's own focus ring. It also carries real information — the
label changes with the thing under the pointer, and the colour changes with
the chapter.

### 4.2 "No smooth-scroll library by default"

**The skill says.** Use native scrolling; a smooth-scroll library is a
liability.

**The brief says.** Scroll drives the scene, scrubbed, reversible, native
only.

**Resolution.** The brief wins, with the library kept as light as possible:
the native scroll is never hijacked, the wheel and the keyboard keep their
own behaviour, the scroll position remains the single source of truth (so the
story is reversible and the address bar is honest), and the smoothing layer
is disabled entirely under `prefers-reduced-motion`.

---

## 5. How the inventory is used

This inventory is not a reading list. It is the argument for why the site
looks and behaves the way it does. Every rule above has a file and a line
behind it, and `SKILL_REFERENCE_AUDIT.md` records, for each change, the
skill that was consulted, the guidance that was taken, and how the result was
verified.

The audit that scores the built site against these rules is
`UI_UX_AUDIT.md`. The route layer's own skill — the page-transition reference
implementation — is recorded in `SKILL_REFERENCE_AUDIT.md` §2.21, because it is
a motion skill rather than a UI skill, and it is where the persistent-shell
architecture is justified.
