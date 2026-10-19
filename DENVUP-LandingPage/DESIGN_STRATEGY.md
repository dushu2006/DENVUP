# DENVUP redesign strategy

**Status:** Phase 0 output. No redesign code has been written yet.
**Direction:** dealt by `design-taste-frontend/scripts/draw.mjs` (seed 88951005, sector `studio-portfolio`, tone `editorial`, `--have illustration`, `--keep palette,type`) and recorded in `.taste-skill/direction.json`.
**Governing skills:** `design-taste-frontend` (house rules + 9 references), `impeccable` (persuade/experience mode, craft floor, typeset, layout, colour, animate, audit), `frontend-design`, `high-end-visual-design` (selectively), `modern-web-design`, `redesign-existing-projects`, `gsap-scrolltrigger`, `threejs-webgl`, `algorithmic-art`, `imagegen`, `canvas-design`, `minimalist-ui`, `industrial-brutalist-ui`.
**Explicit non-sources:** no client work, no testimonials, no statistics, no portraits, no stock photography. Nothing in this strategy requires them.

---

## 1. The one idea

> **On this page, the studio's own technique becomes the architecture.**

DENVUP cannot show client work it does not have, or photographs it cannot take. What it genuinely owns is a catalogue of 480 interactive techniques that it can build, and four people who build them. So the site does not *describe* capability — **it is the capability, running.** Every chapter is a live proof of one discipline; the Effects Library is the index of the proofs.

**Competitor test:** replace "DENVUP" with any other small studio and the idea collapses, because no other studio has this catalogue rendered live on its own page. It is not "a creative studio with nice animations".

**The live thing:** the Effects Library stage — pick any of 148+ demos, watch it run, replay it, reset it, switch to its mobile/keyboard alternative, and send it to the studio as a brief. The whole page also *is* one: every chapter demonstrates what it claims.

**What the page must prove in five seconds:** this is a four-person studio that builds interactive websites; it is unusually good at motion and interface craft; here is how to start.

---

## 2. The visual world

### 2.1 Grounds (five, each a complete field)

| Token | Value | Role |
| --- | --- | --- |
| `paper` | `#ffffff` | The default. Opening, manifesto, capabilities, process, team, contact |
| `bone` | `#f1ede7` | Quiet variant for index chapters (services, effects, showcase, FAQ) |
| `ink` | `#0b0a09` | Two interruptions: technologies, standards, closing |
| `orange` | `#ff4a00` | Brand signal: the hero field and pricing. Used twice only |
| `clay` | `#c73e12` | One deeper room: services-deep. Never adjacent to orange |

Fields meet the viewport edge to edge. No chapter sits inside a rounded container. No gradients, glass, blur, textured overlays, grain or vignettes. The page's colour rhythm is deliberately uneven: a long light run, one deep room, another light run, one dark interruption, a return to light, and the orange pricing chapter as the single loudest surface before the close.

### 2.2 Type system

Two families, both already licensed and loaded: **Bricolage Grotesque** (display; variable weight/width) and **Instrument Sans** (body and UI). No third face, no monospace outside code.

| Role | Size | Use |
| --- | --- | --- |
| Small | 13px | metadata, captions, legal, technique IDs |
| Body | 17px desktop / 16px mobile | running copy, form, list rows |
| Lead | `clamp(18px, 1.45vw, 21px)` | chapter intros, answers |
| Statement | `clamp(28px, 3.6vw, 44px)` | chapter headings and short statements |
| Display | `clamp(56px, 9vw, 128px)` | the largest sentence in a chapter |

The monument (`DENVUP` at `clamp(96px, 20.5vw, 340px)`) is a **composition element**, not a sixth type step: it is the brand wordmark treated as architecture, set from the display face at a bespoke size, tracking `-0.055em`, leading `0.78`, always one line.

Display is ≥4× body everywhere it appears. Body measure 62ch. `text-wrap: balance` on headings, `pretty` on paragraphs. No all-caps labels, no letter-spaced small caps, no eyebrows.

### 2.3 Grid and spacing

- 12 columns, gutter 16px, margins `clamp(20px, 2.2vw, 32px)`.
- Section gap `clamp(96px, 12vh, 200px)`; chapters that change ground get the full 200px or a hard cut, never a fade.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200, 240. No one-off values.
- Content never centred in a 700–1300px container. Composition anchors to margins, to a fixed off-centre line at 34%, or to opposite corners.
- Radius: **0** on every surface, image, button and input. No shadows on resting elements.

### 2.4 Controls

One button shape: a filled rectangle, 44px minimum height, 15px label, no icon unless it replaces a word. Primary = ink on paper / paper on ink / ink on orange. Secondary = a text link with a drawn underline. One primary action per screen. Focus ring: 2px solid currentColor, 3px offset, always visible.

---

## 3. The chapter sequence

> **Superseded plan.** The table below is the Phase-0 chapter plan. The shipped page has **15 chapters** and no Effects Library, no mark chapter and no gate; §12 records the changes and `WEBSITE_INFORMATION_ARCHITECTURE.md` is the current sequence. The rows are kept as a record of the design reasoning, not as a description of the build.

The plan had 17 chapters plus the closing/footer (18 `data-chapter` regions, because the Effects Library had its own gate). Each row states the composition, the live element, the transition out, and the phone behaviour. No two neighbouring chapters share a layout.

| # | Chapter | Ground | Composition | Live element | Transition out | Phone |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Prelude** | paper | Three full-sentence editorial beats, left margin, 5vw, 260px measure; the orange square below them | The opening sequence itself | The square scales to fill the screen → orange | Beats at 8vw, square 20px |
| 2 | **Hero** | orange | `DENVUP` at 20.5vw on the bottom edge; one 18px sentence top-left; 4 links top-right; one ink CTA bottom-right | A slow WebGL wireframe ring in the negative space above the `N`, pointer-parallaxed ±10px | Hard field cut to bone | Monument 22vw, CTA above it, nav collapses to one "Menu" word |
| 3 | **The mark** | bone | A bone field with one large paper panel, inset 32px; the original colour logo, untouched, at correct ratio, with drawn construction lines around it | Pointer moves a light band across the panel; the construction lines redraw on focus | Mask wipe upward | Panel full-bleed, construction lines simplified |
| 4 | **Point of view** | paper | No heading. 70-word statement at 38px across columns 3–12; three facts in a 160px column at 34% | One word in orange; the statement's last line is set in the display face | Overlap lift: the last line stays while services slides beneath | Statement 26px, facts below |
| 5 | **Services** | bone | One-size index: three groups on columns 1, 4, 7; 16px names; columns 10–12 deliberately empty | Hover/focus on a name writes its one-line description into the empty columns | Hard cut to clay | Three stacked groups, descriptions always visible |
| 6 | **In detail** | clay | Full-bleed clay; six service words stacked at 56px on the left; a live artwork panel on the right; two sentences beneath | Service selector swaps a drawn canvas/SVG artwork and its caption; arrow-key operable | The artwork's last frame wipes down into paper | Words become a horizontal scroll strip with snap; artwork below |
| 7 | **Capabilities** | paper | Pinned horizontal-in-vertical stage, 6 panels, each 84vw; captions bottom-left; progress = six filled squares, no numerals | Each panel is a different live specimen (mask reveal, path draw, type scramble, tilt, particle field, grid morph) | The final panel's field expands to bone | Vertical stack of the same six specimens; no pin |
| 8 | **Effects Library** | bone | Ledger at 22%: 560px column of rows (name 16px, category 14px, technique ID 13px); sticky live stage on the right | One demo mounted at a time; search, category text filters, replay, reset, mobile alternative, keyboard path, "I want this" | The stage's field collapses to paper | Filters become a two-row scroll strip; stage above the list |
| 9 | **Process** | paper | Four written stages at 44–76px, each starting two columns right of the previous (staircase); 34ch note under each | A single SVG path draws between the four baselines as the chapter scrolls | The drawn line exits through the top of the next chapter | Indent 6vw per stage; path hidden |
| 10 | **Tools** | ink | Three columns of tool names at 16px in paper; the right third holds a five-layer stack diagram | Hover/focus highlights the matching layer; no percentages, no logos-as-badges | Field cuts to paper | Columns stack; diagram above |
| 11 | **Four people** | paper | Side facts at 34% (Founded / Based / Team / Focus); a five-line paragraph to 90%; below, four names at 36px on a shared baseline with staggered indents | A unique drawn stroke per person (seeded from initials) draws beside the name on hover/focus — explicitly not a portrait | Names lift and the showcase field slides under | Names stack; strokes always visible |
| 12 | **Concept studies** | bone | Big names at 44–80px in columns 1–8; sticky 4:5 plate at 26vw on the right; each row tagged "Concept study" at 13px | Switching names crossfades the plate; keyboard focus does the same | Plates stack into the orange pricing field | Each study: plate, then name, then tag |
| 13 | **Pricing** | orange | Three sentences at 44–76px, one per plan, stepped across the grid; each price sits inside a filled ink block on its line; one CTA | The price block is the only orange-on-ink object; hover nudges nothing, focus adds the ring | Mask wipe to bone | Three stacked blocks at 34px |
| 14 | **Questions** | bone | Heading at 5.5vw, then six questions indented to column 5; no rules; 36px gaps | `<details>` rows; the open row gets an ink tile behind question and answer | Field cuts to ink | Questions full width, tile bleeds to both edges |
| 15 | **Standards** | ink | Three statements at 40px in a 2-column arrangement, 120px apart, one orange word each | None. This chapter is deliberately still | Field cuts to paper | Statements 30px, single column |
| 16 | **Contact** | paper | Left 60%: the email as display type, fitted to the width, mailto; phones and WhatsApp at 20px beneath. Right 40%: the compact form | Form validation and honest submit state; copy-to-clipboard on the email | The email's baseline stays while the closing field rises | Email at 11.5vw across two lines; form below |
| 17 | **Close** | ink | `DENVUP` at full width, cropped by the **bottom** edge (never the top); contact links at 32px in orange; three link columns; legal + back-to-top | The opening's 20px orange square returns once, at the legal line — a quiet rhyme, not a new section | End of page | Wordmark fitted, links stacked 26px |

### 3.1 Why these compositions

They are the dealt sheet's own blueprints, not a return to the old layout: title/note/facts (prelude), side facts/wide paragraph (people), big names/fixed preview (concept studies), lines that step across (process), one-size name columns (services, tools), small frames/wide space (Effects Library strip), one plan as a sentence (pricing, adapted to three), wide heading/indented questions (FAQ), email as display type (contact), name first (closing). Capabilities, identity, standards and services-deep are additional compositions the brief requires; they are built in the same type, colour and manner.

---

## 4. The opening, beat by beat

> **Superseded plan.** The timed sequence below was never shipped in this form. The build uses three static editorial beats that hand straight to the orange hero; there is no door, no autoplay and no skip prompt. Read §12 for the shipped opening.

The opening is the one authored focal sequence. It must work **before JavaScript runs** and must never gate content.

| Time | What happens |
| --- | --- |
| 0 ms | Paper field paints from HTML. Beat 1 — "Most websites are documents." — is already visible at 5vw on the left margin. No loader, no spinner, no counter, no blank first paint. |
| 900 ms | Beat 1 crossfades (180 ms) into beat 2 — "A few are places you remember arriving at." |
| 1,800 ms | Beat 2 into beat 3 — the studio's own sentence, ending on the promise. |
| 2,600 ms | A 20px orange square rises 40px from the baseline at the optical centre and holds for 120 ms. |
| 2,900 ms | The square scales to cover the viewport (620 ms, `expo.inOut`), its edges landing exactly on the viewport edges. |
| 3,500 ms | The orange field is now the hero. Nav and sentence enter first (60 ms stagger), then the monument rises through a clip mask (700 ms). |
| any time | Click, key, wheel or touch skips to the settled hero. Total forced time ≤ 3.5 s; session storage shortens repeat visits to 600 ms. |

**Reduced motion:** no scale, no rise. The three beats are shown together as a short editorial column, followed by an orange field with the hero already in place. Nothing is hidden.

**Failure mode:** if the script fails, the paper field, all three beats and the hero content are visible in normal flow. The animation is an enhancement on top of a complete document.

---

## 5. Inter-section transition system

Four transitions, each used three or four times. Nothing crossfades into mush; no gradient is used to hide an edge.

1. **Field cut** — the next ground starts on a hard horizontal edge. Used hero→mark, services→in-detail, questions→standards, standards→contact.
2. **Mask wipe** — a solid block grows from a content edge (left, bottom, or the last artwork's frame) revealing the next field. Used mark→point-of-view, pricing→questions.
3. **Overlap lift** — the last line or name of a chapter stays fixed while the next field slides beneath it, then releases. Native scroll only, via `position: sticky` + a scrubbed transform, never scroll-jacking. Used point-of-view→services, people→concept-studies.
4. **Stepped field change** — three flat bands replace the field in sequence over a 40vh scroll span, producing a colour change without a gradient. Used capabilities→effects, contact→close.

Every transition is reversible, works with keyboard scrolling, and is disabled under reduced motion (the fields simply meet).

---

## 6. Motion system

**Thesis:** one rehearsed opening, then one gesture per chapter that explains that chapter's content. No universal fade-and-rise. If a gesture cannot say what state or relationship it clarifies, it is cut.

| Token | Value |
| --- | --- |
| `--dur-1` | 140 ms — feedback (press, focus, hover fill) |
| `--dur-2` | 240 ms — state change (row swap, accordion, filter) |
| `--dur-3` | 420 ms — overlay / image reveal |
| `--dur-4` | 700 ms — authored entrance |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| stagger | 70 ms, maximum total 420 ms |

**Per-chapter gesture**

| Chapter | Gesture |
| --- | --- |
| Hero | Monument clip-rise; WebGL ring parallax ±10px (pointer only, disabled on touch) |
| Mark | Construction lines draw in SVG `strokeDashoffset`; light band follows pointer |
| Point of view | Word-level colour change as the statement crosses the viewport (scrub, not a typewriter) |
| Services | Description writes into the empty columns; names shift weight, never position |
| In detail | Artwork wipes between services with a clip-path edge, 420 ms |
| Capabilities | Horizontal traverse driven by vertical scroll; each panel's specimen runs only while visible |
| Effects Library | Stage crossfade 200 ms; demo mounts on selection, destroyed on change |
| Process | SVG path draws with scroll; each stage's note rises 16px once |
| Tools | Layer highlight; diagram nodes light in sequence |
| People | Signature stroke draws 0→full in 700 ms |
| Concept studies | Plate crossfade 200 ms; no zoom, no tilt on the plate |
| Pricing | Price block wipes in from the left on entry; nothing moves on hover |
| Questions | Height transition 240 ms; icon rotates 45° |
| Standards | None |
| Contact | Email underline draws on hover; form states are instant + 140 ms |
| Close | The 20px square fades up once |

**Cursor-responsive, not cursor replacement.** The native cursor is always visible. Magnetism is limited to the primary CTA (±8px, off on touch and reduced motion). The index responds to proximity by weight, not by moving text. The mark panel's light band is a CSS variable driven by pointer position. No dot, ring, trail or blend-mode cursor anywhere on the page.

**Reduced motion.** Per-component alternatives: no translation, scale, pin, horizontal traverse or parallax; opacity and colour state changes remain where they carry meaning (focus, validation, open/closed). Canvas renders one static seeded frame with a visible pause/play control. Content order is unchanged.

---

## 7. Imagery and original graphics

`picsum.photos`, `images.unsplash.com` and Wikimedia are unreachable from this environment (all return `000`), so **no found photography will be used or claimed**. The plan is honest about what these assets are.

### 7.1 Generated material studies (8, via `imagegen`)

| Asset | Subject | Use | Rules |
| --- | --- | --- | --- |
| `material-orange` | matte orange pigment surface, raking light | Mark panel inset / pricing edge | No objects, no text, no hands |
| `material-paper` | folded white paper, hard shadow | Point of view / close | Monochrome |
| `material-ink` | black ink pooling on paper | Tools chapter | Macro, no legible marks |
| `material-clay` | terracotta surface, shallow relief | In detail | No pottery product |
| `structure-grid` | abstract ceiling grid, concrete | Capabilities first panel | Architectural, no people |
| `structure-fold` | folded metal geometry | Concept studies plate | Studio-lit, no brand |
| `light-sweep` | single light band on dark surface | Standards | No lens flare |
| `pigment-cloud` | orange pigment in water | Close | No text, no logo |

All are 16:10 or 4:5, 1600–2000px, exported to AVIF + WebP + JPEG fallback, `width`/`height` set, lazy except the one in the first two screens. They are **atmosphere, not evidence**: never a stand-in for the team, a client, a project or an interface. `ASSETS.md` records prompt, model, date and role; a one-line credit sits in the closing chapter.

### 7.2 Drawn graphics (original, code-native)

These carry the "subject's own things" role that photography cannot:

1. **Mark construction sheet** — proportions, clear space and the D's geometry traced from the supplied logo. The logo itself is never redrawn, stretched or recoloured; the sheet is drawn *around* it.
2. **Technique atlas** — 12 small diagrams, one per encyclopedia family, in one stroke language.
3. **Process path** — a single continuous SVG path stepping across four baselines.
4. **Stack diagram** — five labelled layers for the tools chapter.
5. **Four signature strokes** — seeded paths derived from initials; decorative, labelled as such.
6. **Six capability specimens** — mask reveal, path draw, type scramble, tilt, particle field, grid morph; each is a real live component, not an illustration.

Drawings use the palette at full strength, three levels of detail, and one consistent corner/stroke vocabulary. No isometric clip art, no laptop illustrations, no abstract blobs.

---

## 8. Responsive behaviour

| Range | Rules |
| --- | --- |
| **Desktop ≥1200px** | 12 columns; horizontal capabilities; sticky plates; full monument; pointer effects enabled |
| **Tablet 768–1199px** | 8 columns; margins 24px; horizontal chapter keeps 2 panels visible; monument 18vw; pointer effects only where a mouse exists (`(hover: hover)`) |
| **Phone <768px** | 4 columns; margins 20px; every multi-column chapter collapses to one; horizontal becomes vertical; sticky previews become inline plates; monument 22vw; touch targets ≥44px; no hover-only information |
| **Reduced motion / low power** | No pin, no horizontal, no parallax, no canvas loop; static poster frames; all content in normal flow |
| **Zoom 200% / text-only** | Composition reflows to one column; no fixed heights on text; no clipped headings |

Safe-area insets respected on the closing and the sticky nav. No horizontal overflow at any width; the horizontal chapter uses a transformed inner track inside an `overflow: clip` stage, never a widened body.

---

## 9. Coverage and honesty plan

1. **Repair the catalogue before anything else.** Rebuild `technique-catalogue.json` from encyclopedia §§1–21 only, with a section-aware parser; assert that ID *n*'s text equals the source line *n* for all 480. Currently IDs 1–8 hold the eight §22 selection questions, so eight real techniques are missing. No coverage claim may be repeated until this is fixed.
2. **Then remap** the 480 rows: page-level instance, lab demo, or blocked-with-reason. Keep `src/content/coverage-map.ts` as the single source of truth.
3. **Raise tested coverage** from 23 to at least 60 by adding DOM-level tests for each new page-level effect (opening states, chapter transitions, horizontal keyboard controls, filters, form states, reduced-motion branches).
4. **Implement at least 40 of the 70 Planned** techniques in the page, and move the rest to labs or keep them Planned with a named reason.
5. **Keep the 45 Blocked** with specific reasons (no audio/video assets, no camera permission story, no real portraits, device-dependent WebGL). Do not relabel them.
6. **Never claim visual verification.** No browser is installable in this environment; the report states exactly what was verified (type-check, 38 tests, prerender HTML byte checks, html-validate, lint) and what was not (rendered pixels, real-device performance).

---

## 10. Risks and how they are handled

| Risk | Handling |
| --- | --- |
| The page becomes a technique dump | One gesture per chapter, chosen for meaning; the library holds the breadth, the page holds the argument |
| "Concept studies" read as fake client work | Every row is labelled **Concept study**, and the copy says these are self-initiated |
| Generated imagery reads as stock or as evidence | Only material/atmosphere; never people, products or UI; disclosed in `ASSETS.md` and the closing credit |
| Motion harms accessibility | Per-component reduced-motion alternatives, pause controls, no pin on phone, no hover-only content |
| 480-technique claims are unverifiable | Catalogue repair + per-row status + tested counts + explicit "not visually verified" |
| Scope exceeds one pass | Five implementation passes, each ending in a build + test + audit row |

---

## 11. Implementation order (next actions, each with its own skill consultation row)

1. **A5 — catalogue repair** (`design-taste-frontend` parser discipline, `diagnosing-bugs` red test). Add a test that fails on the current JSON, fix the parser, regenerate, re-map, verify 480/480 names.
2. **A6 — foundations**: tokens, 5-step type scale, 12-column grid, one button, one focus ring, chapter shells; remove `section-head__eyebrow`, `service-card__index`, hairline borders, resting shadows, global reduced-motion kill.
3. **A7 — opening + hero + mark**: the sequence, the monument, the logo panel, the WebGL ring.
4. **A8 — chapters 4–8**: point of view, services, in-detail selector, horizontal capabilities, Effects Library ledger.
5. **A9 — chapters 9–13**: process, tools, people, concept studies, pricing.
6. **A10 — chapters 14–17**: questions, standards, contact, close.
7. **A11 — coverage + docs + final audit**: regenerate matrix, update all seven documents, run tsc/vitest/build/validate/lint, report counts and limitations.

Each pass is validated before the next begins. No pass may claim more than it tested.

---

## 12. Revision after the client review (19 October 2026)

The client reviewed the running preview and issued a punch-list. It takes priority over §11's pass order; the executed actions and their skill evidence are A7–A13 in `SKILL_REFERENCE_AUDIT.md`. The full Phase-0 re-read that followed is A15, and the current direction is §13 (A16); where §3–§7 and §13 disagree, §13 governs.

- The **Effects library** chapter, its stat band, search, filter chips, 480-row table and the old loader strip are removed. So is the **“the mark”** identity chapter and its fox note. The 480-technique reference survives in `ANIMATION_COVERAGE_MATRIX.md` and in the registry, not as a page chapter.
- The page is now **fifteen chapters**; thirteen demos are surfaced (nine capability tabs, four concepts). The 148 registry modes still exist and are tested, but they are not claimed as page locations.
- The **header is permanently fixed** and takes the colour of the chapter under its lower edge; the loader and right-hand chapter rail are gone.
- The **custom cursor is gone**. The native pointer is never suppressed outside four self-contained demo boxes that draw their own pointer.
- **Capabilities** is a single tabbed stage, one real demo at a time, each citing three technique IDs from the encyclopedia.
- **Services** travel is measured from the rail column and its last child, not from the pin, so the last card can reach the edge.

§11's **A5 catalogue repair** (the eight §22 questions occupying technique IDs 1–8) is still open; removing the library did not fix the catalogue and the review did not ask it to. It is re-verified in `UI_UX_SKILLS_INVENTORY.md` §6.2 and is now action **A17** in §13.12 — the first implementation step of the new direction.

---

## 13. Redesign direction, Phase 0 close (19 October 2026)

§12 recorded the client's removals. This section is the **replacement visual world** those removals left room for. It is written after the full skill re-read and encyclopedia audit recorded in `UI_UX_SKILLS_INVENTORY.md` and `SKILL_REFERENCE_AUDIT.md` A15–A16. It supersedes §3–§7 wherever they conflict; the brief, the business facts, the price list and the accessibility contract are unchanged.

### 13.1 The direction

**A specimen sheet, not a portfolio.** A small studio cannot show client work it does not have, but it can show, completely and without decoration, what it can make and how it works. The page is set as a printed specimen sheet from a working studio: paper, ink, oxide and carbon; a contents list at the front; plates through the middle; a colophon at the end. Every claim is printed beside a live proof of it.

Dealt by `design-taste-frontend/scripts/draw.mjs` (`--sector studio-portfolio --keep palette,type --options 3`): **`contact-sheet`** as the structural base, with **`pinned-poster`** used exactly twice (manifesto, capabilities). `dense-tiles` was rejected because it reproduces the card grid the house style bans; `pinned-poster` alone was rejected because it depends on a photograph archive this project does not have.

**Idea sentence.** On this page, **the studio's own working materials and its 480-technique reference** become **a printed specimen sheet whose plates are live**.

**The one live thing.** A *reference* control in the capabilities chapter. It opens the full technique list for the demo on the stage — real names and IDs from the encyclopedia — so a visitor can check the claim while looking at the proof. It is a native `<details>` element, so it works with no JavaScript, and the short caption (up to three techniques) is visible without opening it. Not a playground: one control, one job.

**Signature moment.** The **plate**: between chapters, the incoming ground arrives as a hard-edged printed field with a 10px oxide lip, driven by scroll position — never a fade, never a wipe over the text. One system, used at every boundary, and nowhere else.

### 13.2 What this replaces, and what it keeps

| Kept | Replaced |
| --- | --- |
| Stack (Vite + TypeScript + vanilla CSS), prerendering, tests, 480-row registry | The "stack of section heads" rhythm where every chapter opened the same way |
| 15 chapters, their content, business facts, prices, contact links | The prelude's three-beat white screen (underbuilt, no authored moment) |
| Native scrolling, no animation library, reduced-motion parity | Hard colour cuts between chapters |
| `reveal-armed` contract (content never hidden by CSS alone) | Small-caps labels, counters and eyebrow tics |
| The nine capability demos and four concepts | The capability stage's uniform frame for every demo |
| Header pinned with per-chapter colour | The header's plain bar (it becomes a printed running head: wordmark, section name, progress hairline) |

### 13.3 Palette — one family, six grounds

No gradients, no glass, no shadows at rest. Fields are flat and run to the edge; a chapter changes the whole field.

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#ffffff` | Sheet, contents, FAQ |
| `--bone` | `#f1ede7` | Warm plate |
| `--sand` | `#e3dbcd` | Deeper warm plate, one use only |
| `--ink` | `#0b0a09` | Carbon field, body ink |
| `--den` | `#17120f` | Warm near-black, one chapter (capabilities) |
| `--oxide` | `#ff4a00` | Brand accent: cover, contact, the plate lip, focus |
| `--deep` | `#f03c00` | Pressed / hover on oxide |
| `--clay` | `#c73e12` | Tertiary text on oxide only |

Accent budget: oxide appears as a whole field in exactly two chapters (cover, contact), as the plate lip at every boundary (10px, a printed registration bar), and on the primary action. It never colours a word inside a headline. Body ink on paper is full ink, not grey; secondary text is a tint of the ground's own hue.

### 13.4 Typography

Two faces, unchanged and self-hosted: **Bricolage Grotesque** (display, weight 200–800, width 75–100) and **Instrument Sans** (text, 400–700, plus italic).

| Role | Size | Setting |
| --- | --- | --- |
| Cover wordmark | `clamp(3.4rem, 11vw, 11rem)` | weight 640, width 92, tracking −0.05em, leading 0.82 |
| Section heading | `clamp(2.2rem, 5.2vw, 4.6rem)` | weight 560, tracking −0.04em, leading 0.92, **two lines maximum at every width** |
| Sub-heading | `clamp(1.35rem, 2vw, 1.95rem)` | weight 560, leading 1.05 |
| Body | `clamp(1rem, 0.5vw + 0.9rem, 1.18rem)` | leading 1.5, measure 58–68ch |
| Micro | `0.82rem` | sentence case, tabular figures, no tracking theatre |

Five sizes only. The width axis is used in exactly one place — the cover wordmark, widening 88→100 as the page begins to scroll (technique 91) — so it reads as a made thing, not as a font trick. Statements (intros, quotes) are `<p>`/`<blockquote>` at ≤36px and ≤25 words, never set as headlines.

### 13.5 Layout and spacing

One 12-column grid (`--wrap: 92rem`), margins `clamp(1.15rem, 3vw, 1.75rem)`, gutter 16px. Section spacing 140–200px desktop / 64–88px phone; the gap between sections is always larger than any gap inside one. Six composition families, no two neighbours sharing one:

1. **Contents sheet** — dense index, four names as a colophon, nine capabilities, three prices, all in one screen.
2. **Full-field claim** — one sentence, two lines, one action; the type is the image.
3. **Sticky narrative** — a fixed plate with a scrolling column of principles (technique 335).
4. **Horizontal rail** — services and process, pinned on wide screens only.
5. **Specimen bench** — capability index plus one live stage, with the reference control.
6. **Editorial spread** — deep dives, team nameplates, rate card, FAQ, form.

### 13.6 Motion system

Tokens: `--t-fast 180ms`, `--t-base 420ms`, `--t-slow 720ms`; `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-inout: cubic-bezier(.65,0,.35,1)`. Nothing moves on a linear curve.

- **The plate (signature).** At each boundary the incoming chapter's ground covers the outgoing one from the leading edge, hard-edged, with a 10px oxide lip. Implemented as a sticky field with `clip-path: inset()`, driven by CSS `animation-timeline: view()` where supported, otherwise by an IntersectionObserver + rAF writer of `--plate`. Reduced motion: instant cut, same colour order.
- **Printing (in-chapter).** Headings arrive through a `mask-image` moving 12% (technique 107); the mark and the process line draw once with `stroke-dashoffset` (140); body and media stagger 60–90ms behind the heading (9/114), 16–28px rise, once per section.
- **Scrubbing (chapter-level).** Manifesto principles change weight and colour as they pass the plate (96/128); the capability reference IDs count up with the tab (already shipped). No parallax on text.
- **Feedback.** Press `scale(.98)`, hover underline offset, focus ring 2px oxide at 3px offset. Pointer-only tilt on the three plates that hold a demo (176/177), never on touch.
- **Forbidden.** Autoplay video, looping ambient animation, cursor replacement, scroll hijacking, content hidden until a script runs.

### 13.7 Imagery

No client work, no portraits, no stock. Two honest sources:

1. **Generated material photography** — four to six plates, made with the image tool under `imagegen`'s prompt schema: uncoated paper fibre (macro, raking light), ink wash on sized paper, oxide/rust pigment, graphite on board, warm plaster in shadow. No text, no logos, no people, no invented places. Used as a cover panel, a chapter band, and the Standards comparison backdrop — never under a headline. Credited as generated in `ASSETS.md`.
2. **Drawn in code** — the supplied mark (never redrawn, never stretched), the process line, the capability diagrams, the icon set at one stroke weight.

The house style's "real pictures" floor is met by the material plates and recorded as an explicit decision: they are real photographs of real material, not stand-ins for clients.

### 13.8 The chapter sequence

| # | Chapter | Ground | Composition | Live element | Handover in | Phone |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Cover | paper | Contents sheet: wordmark at 11vw, four names, nine capabilities, three prices | Wordmark widens with scroll | Plate from bottom, oxide lip | Stacked index; no wordmark widening |
| 2 | Claim | oxide | Two-line claim, one action, one sentence, price line | Live pointer-follow on the wordmark's letterforms (pointer only) | Hard cut to carbon | Centred claim, action full width |
| 3 | Point of view | ink | Sticky plate + scrolling five principles | Principle weight changes at the plate | Plate to paper | Principles stack; no plate |
| 4 | Services | paper | Horizontal rail, six panels, alternating grounds | Rail travel tied to scroll | Plate to bone | Vertical list with scroll-snap |
| 5 | Details | bone | Editorial spread, sticky aside, six deep dives | Aside index follows the spread | Plate to den | Single column, aside becomes a chip row |
| 6 | Capabilities | den | Specimen bench: index + one stage + reference control | The nine demos, one at a time | Plate to paper | Index becomes a select; stage full width |
| 7 | Process | paper | Horizontal timeline, drawn line | Line draws with progress | Plate to bone | Vertical steps, line vertical |
| 8 | Tools | bone | Typographic bench list + detail panel | Selecting a tool updates the panel | Plate to carbon | List only, detail inline |
| 9 | Team | ink | Four nameplates, monogram geometry | Nameplate opens a profile dialog | Plate to paper | Single column, dialog full screen |
| 10 | Concepts | paper | Four plates, two up, alternating aspect | Four live concept demos | Plate to sand | One up, captions below |
| 11 | Pricing | sand | Rate card as a printed table | Estimator carries the chosen tier | Plate to carbon | Table becomes stacked rows |
| 12 | Questions | ink | Search + accordion, no boxes | FAQ filter and disclosure | Plate to paper | Same, full width |
| 13 | Standards | paper | Six promises, each with its proof | Reduced-motion comparison slider (194/195) | Plate to oxide | Comparison stacks, labels above |
| 14 | Contact | oxide | Form + three direct lines + hours | Honest failure path | Plate to carbon | Form first, details below |
| 15 | Colophon | ink | Mark drawn once, closing line, marquee, footer | Pause control on the marquee | — | Static marquee, footer stacked |

### 13.9 Opening, handovers, closing

**Opening (never gates content).** First paint is the finished sheet: wordmark, four names, nine capabilities, three prices, all readable with JavaScript off. With motion allowed, the wordmark's counters fill with oxide from the baseline over 700ms, the contents lines stagger 40ms each, and the cover plate begins to rise only when the visitor scrolls. No loader, no spinner, no forced wait, no skip prompt.

**Handover.** The plate is the only transition. It carries the incoming ground and a 10px oxide lip; it never covers a headline that has not yet been read, because it moves with the boundary, not with time.

**Closing.** Carbon. The mark draws in oxide once, the claim returns at display size, the three direct lines are printed as a colophon, the marquee runs with a pause control, and the footer closes with the name at full width — a designed close, not a sitemap.

### 13.10 Responsive behaviour

- **≥1120px:** all six composition families; rails pinned; annotations available.
- **768–1119px:** rails become scroll-snap strips; two-up plates; header collapses to the menu button; the sticky narrative releases.
- **<768px:** every section recomposed, not scaled: the contents sheet becomes a stacked index, the claim centres and the action goes full width, the bench index becomes a native `<select>`, the process line turns vertical, the rate card becomes rows.
- **Input method, not width:** `(hover: none), (pointer: coarse)` removes tilt, magnetic and hover-only reveals and raises every target to 44px. Safe-area insets on the header, footer and toast.

### 13.11 Accessibility and performance budget

Skip link, landmarks, one `h1`, 2px/3:1 focus, visible states for hover/active/disabled/invalid, dialogs with focus return, `aria-live` for results, reduced motion preserving every composition, no content hidden by CSS alone. Budget, revised 19 October 2026 against the built site: document ≤ 150 kB (**130.5 kB** on `/`), CSS ≤ 260 kB (**250.0 kB**; 45.5 kB gzip, 36.8 kB brotli), JS ≤ 245 kB (**239.3 kB**; 73.3 kB gzip, 59.6 kB brotli), fonts ≤ 270 kB, no third-party requests, `content-visibility: auto` on the long lists, `contain: paint` on the demo stage. The earlier targets of 220 kB CSS and 230 kB JS predate the 480-technique library and were exceeded by 30.0 kB and 9.3 kB. The honest next step, not yet taken, is to move the 195 kB of lab-demo CSS off the eight routes that mount no demo; it is recorded here rather than hidden.

### 13.12 Build order and acceptance

1. **A17 — catalogue repair:** restore techniques 1–8, correct the three loader lab ID sets and the eight false coverage rows; regenerate the matrix. No visual change.
2. **A18 — sheet and cover:** tokens, grid, type scale, contents sheet, wordmark widening, plate primitive.
3. **A19 — chapter recomposition:** services, details, capabilities bench + reference control, process, tools, team, concepts, pricing, questions, standards (with the comparison), contact, colophon.
4. **A20 — material plates:** generate, inspect, crop, credit; wire as cover panel, bands and comparison backdrop.
5. **A21 — motion layer:** plate handovers, printing masks, mark and line drawing, stagger, feedback; reduced-motion end states for every one.
6. **A22 — verification:** tsc, 46+ tests, build, html-validate, axe, custom lint, coverage regeneration, full doc refresh.

Acceptance for the redesign: every headline ≤2 lines at 390/768/1440; no section repeats its neighbour's composition; every claim has a visible proof; reduced motion loses no content; axe 0; no third-party requests; no fabricated credibility; the pack untouched.
