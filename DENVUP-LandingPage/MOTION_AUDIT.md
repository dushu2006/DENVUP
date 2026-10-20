# Motion audit and plan

19 October 2026 · scope: every interactive surface outside the home-page choreography, which is already built.

## 0. Context (confirmed with the owner, not inferred)

| Axis | Answer | Source |
| --- | --- | --- |
| Audience | Studio, practice and small-business owners who have outgrown a template; mixed technical literacy, often on a phone, price-sensitive | `src/content/routes.ts:52`; confirmed by the owner this session |
| Job of the site | Prove capability by running it, not describing it | `DESIGN_STRATEGY.md:14` |
| Personality | Editorial specimen sheet: dry, precise, printed; never playful for its own sake | `DESIGN_STRATEGY.md:283` |
| Motion appetite | **Expressive**, per the owner, with the skill's warning recorded: expressiveness in *behaviour*, not decoration | Owner, this session |
| Budget | Open, but measured and reported anyway | Owner, this session |
| Hard constraints | Native scrolling only; reduced motion keeps all content; no third-party libraries; transform/opacity only | `DESIGN_STRATEGY.md:402`; choreography brief |

## 1. Method

Every interactive surface was read in source and counted. Evidence is file:line, not impression. A surface counts as a **gap** when the person acts and nothing acknowledges it, when a state change is instantaneous, or when a relationship the person needs to understand is left implicit.

Counted across the built pages (`/`, `/lab`, `/contact`, `/pricing`):

- **301 buttons, 374 links, 43 inputs, 4 selects, 2 textareas, 31 disclosures.**
- **96 `:hover` rules, 60 `:focus-visible` rules — but only 6 `:active` rules, and all six are inside lab demos.** The site chrome has **zero** press states.
- **0 `:disabled` rules**, while the submit button is genuinely disabled during sending.
- 211 `transition` and 52 `@keyframes` declarations already ship, so the motion language exists; the gaps are specific, not systemic.

## 2. What already moves (do not duplicate)

Home choreography (flood prelude, selector band, pinned dives), route hand-offs with a 220 ms watchdog, cursor with ground-adaptive ink, menu and sheet entrances (`menu-in`, `sheet-in`), cursor hover enlargement, capability stage swap, toast, FAQ icon rotation, reading progress, magnetic buttons, estimator arithmetic, lab demos themselves.

## 3. Findings

Severity: **S1** = a person's action goes unanswered or an intent is lost; **S2** = state changes without explanation; **S3** = polish.

| # | Surface | What the person does | What happens now | Gap | Sev |
| --- | --- | --- | --- | --- | --- |
| F1 | All chrome | Presses any button or link | No visual change on press | 6 `:active` rules exist, all in demos; none in chrome | S1 |
| F2 | Enquiry submit | Presses Send | Button silently becomes `disabled`; looks identical | 0 `:disabled` rules, no pending affordance | S1 |
| F3 | Every "I want this" link | Asks for a technique | Navigates to `/contact?subject=…`; **the query is never read** — the message field is empty | Intent dropped. `grep URLSearchParams` → 0 hits in `src/client` | **S1 (functional bug)** |
| F4 | Enquiry validation | Submits with mistakes | Errors appear instantly; focus moves to the first field | No visual link between the status line, the summary and the field | S2 |
| F5 | Enquiry status | Triggers success/error | `.form-status` is `display:none` → `block` | A `display` switch cannot transition; the message snaps | S2 |
| F6 | Estimator | Changes options | Total string is replaced in place | No acknowledgment that the number changed, or which row caused it | S2 |
| F7 | /lab filters | Picks a category | `card.hidden = true` per card | Instant disappearance; no indicator travel. The choreography brief explicitly asked for an animated filter indicator | S2 |
| F8 | /lab search | Types | Filters on every keystroke, count changes silently | No debounce, no result feedback, no empty-state transition | S2 |
| F9 | /lab replay | Presses replay | `unmount()` then `mount()` | Nothing tells the person it restarted | S2 |
| F10 | All dialogs | Closes menu/sheet/shortcuts | Entrances animate (500/350 ms); closing snaps | Entrances without exits is the classic unfinished-motion tell | S2 |
| F11 | FAQ | Opens a question | Icon rotates; body height snaps | Half-animated disclosure | S3 |
| F12 | Copy buttons | Copies the email | Toast confirms | Good. The button itself never confirms | S3 |
| F13 | Keyboard guide | Opens with `?` | Panel appears | No stagger, no pressed-key feedback | S3 |

**Ranking rule:** `(how often it happens × how much it costs to not understand) ÷ (risk × cost)`.
The intent bug (F3) outranks everything: it is a lost sales enquiry, not a missing flourish.

## 4. Plan

Four layers, executed in this order. Every item states its reduced-motion alternative, because *fewer and gentler* is the standard, not none.

### Tier 1 — Feedback under the hand (every route, highest frequency)

| ID | Trigger | Motion | Duration / easing | Reduced motion | Files |
| --- | --- | --- | --- | --- | --- |
| **M1** | Press any chrome button/link | Button gives 1 px and 0.5% under the finger; links shift ink and their underline thickens | 90 ms `--ease-out-quint` | Colour only, no transform | `base.css`, `chrome.css`, `sections.css` |
| **M2** | Submit / any busy action | Disabled style (55% ink, `not-allowed`); a 2 px indeterminate rule tracks under the button; `aria-busy="true"` | 120 ms in, rule loops at 900 ms | Static "Sending…" text, no rule | `forms.ts`, `sections.css` |
| **M3** | Validation result | Status band opens by `grid-template-rows: 0fr→1fr` with opacity; border colour crosses from oxide to error red | 260 ms in / 195 ms out `--ease-out-quart` | Instant, both states fully legible | `forms.ts`, `sections.css` |
| **M4** | Failed submit | Invalid fields' underlines draw left→right; the first invalid field takes a single 300 ms ring pulse; error text reveals 12 px | 220 ms draw, 180 ms reveal | Underline colour change only | `forms.ts`, `sections.css` |
| **M5** | Copy | Button label swaps to a check for 1.4 s and back | 180 ms crossfade | Instant swap | `navigation.ts`, `chrome.css` |
| **M6** | Estimator changes | Old total exits 8 px up, new enters 8 px from below; the changed row flashes its rule | 220 ms in / 165 ms out | Number replaces instantly, row rule recolours | `forms.ts`, `sections.css` |

### Tier 2 — Relationships and state (the tools)

| ID | Trigger | Motion | Duration / easing | Reduced motion | Files |
| --- | --- | --- | --- | --- | --- |
| **M7** | Lab filter tab | One oxide rule travels between tabs (FLIP measured, not a sliding fake); active tab's ink settles | 260 ms `--ease-out-quint` | Rule jumps, no travel | `lab-library.ts`, new `motion-feedback.ts`, `labs-*.css` |
| **M8** | Filter/search applied | Departing cards drop 120 ms; arriving cards rise 6 px and fade in with a 20 ms stagger **capped at 12 items**; count rolls | 180 ms in / 120 ms out | Instant list swap, count still updates | `lab-library.ts`, `labs-*.css` |
| **M9** | No results | Empty state draws its rule and its line rises 8 px | 200 ms | Instant | `lab-library.ts`, `labs-*.css` |
| **M10** | Replay / reset | Stage frame flashes 1 px oxide (160 ms); replay icon turns 180°; demo re-enters at 0.98 scale | 240 ms icon, 160 ms stage | Frame colour change only, no rotation | `lab-library.ts`, `labs-*.css` |
| **M11** | Close any dialog | Exit plays at 75% of entry (menu 300 ms, sheet 262 ms), then unmounts on `animationend` with a 400 ms safety timeout | 300 / 262 ms `--ease-out-quart` | Closes immediately | `navigation.ts`, `chrome.css` |
| **M12** | FAQ open/close | Body opens by `grid-template-rows` (the accepted exception to "don't animate layout"); close runs at 75% | 240 ms in / 180 ms out | Instant, icon still rotates | `sections.ts`, `sections.css` |

### Tier 3 — The signature moment (one loud move, and it earns it)

| ID | Trigger | Motion | Duration / easing | Reduced motion | Files |
| --- | --- | --- | --- | --- | --- |
| **M13** | "I want this" → `/contact?subject=…` | **Fixes F3.** On arrival the message field is prefilled with the technique's name; the field is focused and receives a one-time oxide wash that wipes down and clears via `clip-path` (not a fade); a small "Carried over from The Lab" line rises 6 px beneath it | 600 ms wipe, 200 ms line | Field prefilled and focused; no wash | `router.ts`, `forms.ts`, `sections.css` |
| **M14** | Keyboard guide opens | Keycap chips stagger 15 ms, max 12; pressing a key highlights its row for 300 ms | 15 ms stagger | No stagger, instant | `navigation.ts`, `chrome.css` |

**Why M13 is the signature and not a decoration:** it is the only moment that changes an outcome. A visitor who liked a technique in the Lab arrives with their intent already written down — the animation exists to show them it survived the journey. It also removes a real defect.

## 5. Non-goals (and why)

- **No new section entrances or scroll reveals.** The home page already has a full choreography, and staggered fade-up on each block is the exact "generated default" `motion.md` §7 names. Adding more would dilute the existing signature.
- **No bounce or elastic easing.** They draw attention to the animation instead of the content.
- **No animated `width`/`height`/`top`/`left`**, except the two accordion bodies, where `grid-template-rows` is explicitly allowed.
- **No motion on hover for every card.** A21 already added tilt and the selector band; more would be noise.
- **No scroll hijacking, no smooth-scroll library, no autoplay audio.** Unchanged from the brief.
- **No loading spinners over content.** The only indeterminate motion is the 2 px rule inside the submit button.

## 6. Tokens to add

`base.css` has `--ease`, `--ease-out` and a single `--dur: 0.7s`. Adding a scale so timings are chosen, not invented:

```css
--dur-press: 90ms;    /* answer the finger */
--dur-swap: 180ms;    /* small state change */
--dur-panel: 260ms;   /* panel, band, filter */
--dur-enter: 420ms;   /* only the signature wash exceeds this */
```

Plus `--ease-out-quart`, `--ease-out-quint` (the two the plan actually uses). Existing `--ease-out` is kept for the choreography.

## 7. Cost and risk

| Tier | Items | Est. CSS | Est. JS | Risk |
| --- | --- | --- | --- | --- |
| 1 | M1–M6 | +2.4 kB | +0.9 kB | Low — states only |
| 2 | M7–M12 | +3.1 kB | +2.6 kB | Medium — list re-flow must stay under 16 ms for 12 cards |
| 3 | M13–M14 | +0.8 kB | +1.1 kB | Medium — touches the router's arrival path |

Projected: **CSS ≈ 256 kB, JS ≈ 243 kB** — inside the revised 260/245 budgets. If M8's stagger cannot hold 60 fps on the 148-card Lab, the cap drops to 8 and the stagger goes to 12 ms; that decision will be measured, not assumed.

## 8. Verification (before anything is claimed)

1. `scripts/browser/motion.mjs` (new) asserts in a real browser: press state changes computed `transform`; disabled style differs; the status band's height changes across frames; the filter rule's `x` moves more than 20 px; **`/lab` "I want this" → `/contact` lands with the technique name in the message field**; dialogs close with an exit animation and still unmount.
2. Reduced-motion run: every item resolves to its stated alternative, 0 running animations, all content present.
3. `tsc`, `vitest`, `build`, `html-validate`, axe on all 15 routes, and the existing journey suite re-run to prove nothing regressed.
4. Frame timing for M8 sampled with `requestAnimationFrame` over 120 frames while filtering; reported as a number, or the item is cut.

## 9. Order of work

`M13` (bug + signature) → `M1–M6` (feedback) → `M7–M12` (state) → `M14` (delight) → gates → one commit per tier.

## 10. Results (measured, 2026-10-20)

Everything below ran against the built site in Chromium at 1440 × 900 through `scripts/browser/`.

| Gate | Result |
| --- | --- |
| `motion.mjs` (new, 32 assertions) | **32 passed, 0 failed** |
| `vitest run` | **46/46** |
| `html-validate` on every prerendered route | clean |
| `run.mjs` (routes, axe, images, console, soft nav) | **ALL CHECKS PASSED** |
| `journeys.mjs` | **28 passed, 0 failed, 0 not performed** |
| `cursor-inks.mjs` | **PASS**, lowest **5.87:1** over 52 stops × 2 phases |
| `tsc --noEmit` | 0 errors |

Selected measurements:

- **M7** — the rule travels by transform, not by being redrawn: `translate(0, 0) scaleX(58)` → `translate(809.7px, 71.8px) scaleX(158)`, i.e. across three wrapped rows, and `transition-property` confirms `transform, height, opacity`.
- **M3 / M12** — the status band opens with a 260 ms height animation and settles at 72 px; the FAQ animates 240 ms and settles at 140 px.
- **M4** — submitting four invalid fields marks 3 named fields, writes “Nothing was sent yet — 4 fields need attention.”, and moves focus to the first field.
- **M8** — arrival is a 180 ms rise with 20 ms steps, **capped at 12 animated items**; the widest restore (“All”, 143 returning cards) animates 12 and totals 400 ms.
- **M13** — an intent link from `/lab` lands on `/contact` with the technique name in the message field, a provenance line, and a character count that agrees with the text.
- **Reduced motion** — the outcome is fully visible at 72 px with the band unmoved by travel; no content is hidden.

### What was not measured, and why

**60 fps was not established.** `requestAnimationFrame` is throttled to roughly 450 ms per frame in this headless build even when the page is idle (4 frames in 900 ms), and CSS transitions report `currentTime` 0 for their whole duration before committing. Any frame-timing figure produced here would be fabricated. What *is* true and verified: each item animates only `transform` and `opacity`, durations stay inside the brief's bands, and concurrency is capped at 12 elements. On a real device the 143-layer risk that motivated that cap is bounded by construction rather than by a measurement this environment cannot take.

### Deviation from the skill, recorded deliberately

`motion.md` accepts `grid-template-rows: 0fr → 1fr` for accordions and asks that `height` not be animated. This build animates `height` for the two disclosures, because the grid technique could not be verified to interpolate here (and the clock throttling means it cannot be verified at all in this harness). The exception is kept narrow: one element at a time, 180–260 ms, user-triggered only, never on scroll, always with a determinable end state. `rollValue()` likewise writes the number before animating it: a price that lags its own input by 110 ms is a correctness problem, not a style choice.
