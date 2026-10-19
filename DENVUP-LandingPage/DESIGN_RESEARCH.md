# Design research

Research date: **18 October 2026**. Timeboxed to one pass; every entry notes whether it came from inspecting the live page, from secondary sources, or from a screenshot-free description.

This research set direction, not assets. No layout, artwork, copy or identity was copied from any reference. The brief was to understand the level of craft expected, then build something that belongs to DENVUP.

## Award-level studio sites

| # | Site | What was actually verified | What was inferred |
| --- | --- | --- | --- |
| 1 | [Lusion](https://lusion.co/) — fetched | Full-bleed WebGL scene, a single sentence of direction ("scroll to explore"), a full-sentence closing statement, work framed as experiments. | Real render performance and audio behaviour could not be measured without a browser. |
| 2 | [Merci Michel](https://www.merci-michel.com/) — fetched | A filterable index of projects with client, name, one-sentence description, category and date — a catalogue, not a gallery. | The hover film behaviour on project rows. |
| 3 | [Locomotive](https://locomotive.ca/en) — fetched | A repeated-phrase headline used as a whole viewport, numbered "Extras", a dense multi-column footer. | The easing and speed of the transitions. |
| 4 | [Unseen Studio](https://unseen.co) — fetched | Filters with counts, audio-gated entry, contact details for two cities. | Whether audio is remembered between visits. |
| 5 | [Dogstudio](https://www.dogstudio.co) — fetched | Full-screen overlay menu, one word per line stacking, a showreel modal. | The modal's focus behaviour. |
| 6 | [Build in Amsterdam](https://www.buildinamsterdam.com) — fetched | A JavaScript-only shell, a small badge and a one-line value proposition. | The underlying build stack. |
| 7 | [Hello Monday](https://www.hellomonday.com) — fetched | A long tagged project list with inline filters. | Their filter animation details. |
| 8 | [Basic Agency](https://www.basicagency.com) — fetched | A numbered internal index, a drag-hint cursor, an awards list. | Cursor implementation. |
| 9 | [Cuberto](https://cuberto.com) — fetched | Outcome-language service copy, a logo marquee, one-sentence project grid, a headline stat block. | Whether the stat block is current. Deliberately not imitated: DENVUP has no verified numbers, so the site uses none. |
| 10 | [Vercel](https://vercel.com) — fetched | Alternating dark/light feature blocks and tabbed lists. Useful pattern for technical explanation. | Product metrics and claims; not used. |
| 11 | [Awwwards Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/) — fetched | The 7–18 October 2026 roster skewed minimal and typographic: large type, restrained palettes, one strong idea per page. | Individual site behaviour; each SOTD would need its own visit. |
| 12 | [Dennis Snellenberg](https://dennissnellenberg.com) — search result only | Known for a single-page, motion-led portfolio and a compact project index. | Not verified by inspection; excluded from design conclusions. |

## Directly comparable small studios

| Site | Verified | Inferred |
| --- | --- | --- |
| [Wibble](https://www.wearewibble.com) — fetched | Logo strip, four-up work grid, service columns, a care plan. A realistic peer for a four-person studio: fewer project rows, more service explanation. | Their exact project count. No numbers were reused. |
| [Build in Amsterdam](https://www.buildinamsterdam.com) — fetched | A studio that leads with one clear position rather than a portfolio grid. Supports the decision to make the manifesto and the effects library the spine of this site. | — |
| [Locomotive](https://locomotive.ca/en) — fetched | A studio that publishes its own editorial/news section; evidence that a studio site can carry writing rather than only work. | — |

## What the research changed

1. **An index can be the portfolio.** Merci Michel and Hello Monday treat the project list as a filterable table. With no client work to show, DENVUP makes its *technique index* the browsable body: 480 rows, live demos, search.
2. **One sentence beats a paragraph.** Lusion, Cuberto and Wibble all let a short claim carry a section. The site uses short leads and moves detail into disclosure.
3. **Repeated words are a rhythm, not a gimmick.** Locomotive's repeated headline works because the repetition is the content. The opening here repeats a promise across beats, then hands over to a single box.
4. **Filters need counts.** Unseen's counted filters make scale legible. The effects library shows counts per category and updates live.
5. **Dense footers are useful.** Locomotive and Basic treat the footer as a sitemap plus contact, not a legal afterthought. The footer here repeats the full chapter list, contact routes and the four names.

## What was explicitly rejected

- Copying a palette. The reference set is mostly monochrome with one accent; DENVUP's orange is its own.
- Fake client logos, awards or numbers. Cuberto's "15+ years / 300+ projects" was noted and deliberately not imitated.
- Scroll-hijacking. Several references use smoothed or hijacked scroll; this build keeps native scrolling and puts scrubbed sequences inside their own regions.
- Heavy 3D as a default. Lusion-level WebGL was out of scope for an honest build with no 3D assets; CSS 3D and 2D canvas are used instead where they can be made to work.

## Sites that could not be inspected

`activetheory.net`, `immersive-garden.com`, `igloo.inc`, `pointer-click.com`, `wearecheckers.com` — fetch failed (timeouts or empty responses). They are recorded here as uninspectable, not as influences. No claim about their design is made.

---

## Hand-offs and route transitions (added 19 October 2026)

The master prompt asks what comes **after** what, how sections hand off and how routes transition. The earlier pass captured content and composition; this pass re-reads the same verified set for sequence and continuity. Two limits are stated up front: a fetched HTML document does not expose JavaScript timelines, and this environment has no browser, so **no transition was watched**. What follows is what the documents and assets show about order and continuity, plus what the build adopts.

| Site | Verified sequence | Observable hand-off idea | Adopted? |
| --- | --- | --- | --- |
| Lusion | One full-screen scene → “scroll to explore” → work as experiments → single-sentence close | The scene persists while the copy changes; the page reads as one world | **Yes:** one persistent stage behind all chapters |
| Merci Michel | Filterable index → project detail | Index rows expand into detail rather than loading a new shell | **Yes:** service card expands into its page (167/183/184) |
| Locomotive | Repeated-phrase viewport → numbered extras → dense footer | Type is reused as the transition itself, not a graphic laid over it | **Yes:** the wordmark carries between chapters and routes |
| Unseen | Audio gate → counted filters → contact | A single entry condition, then density | **No:** no audio gate; it blocks content |
| Dogstudio | Full-screen menu → one-word-per-line stack → showreel modal | Menu is a place, not a list; closing reverses the opening | **Yes:** full-screen menu with reverse close (156–160) |
| Build in Amsterdam | Badge + one-line position → work | Minimal first screen, immediate evidence | **Partly:** short claim, evidence directly after |
| Hello Monday | Long tagged list → inline filters | Filters change the body in place, no page change | **Yes:** `/lab` filters (188, 205) |
| Basic Agency | Numbered index → drag-hint cursor → awards | The cursor teaches the interaction before it is used | **Yes:** contextual cursor labels (24) |
| Cuberto | Outcome-language services → logo marquee | Service rows carry their own visual, swapped on hover | **Yes:** services selector changes artwork (301/302) |
| Vercel | Alternating dark/light blocks → tabbed lists | A field change marks a new argument, not a new page | **Yes:** chapter grounds change wholesale |
| Awwwards SOTD roster (7–18 Oct 2026) | — | Roster skewed to one strong idea and large type | **Yes:** one idea (the specimen sheet), few effects |

**What the research changed in the choreography**

1. **Continuity beats novelty.** The strongest references keep one scene alive; the weak ones restart the canvas per section. The build gets a single stage whose parameters are keyed to the chapter, not a new background per section.
2. **Transitions are shapes, not fades.** Every reference that reads as “designed” uses a shape, a mask, a shared element or a type move. The build's handover is a printed plate with a hard edge and an oxide lip.
3. **Route changes should feel like the same place.** The expand-from-card, colour-wipe and curtain patterns all preserve an element across the change. The build uses cross-document View Transitions with named header, stage and mark.
4. **The cursor is part of the teaching.** Basic and Cuberto use labels to announce “drag” or “view”. The build labels only demos that need it, and never replaces the pointer on touch.
5. **Do not imitate the numbers.** Cuberto's stat block is the clearest example of a pattern that only works with verified data; DENVUP has none and uses none.

**Unobservable and therefore not claimed:** the actual easing, duration, scroll coupling, or performance of any reference transition. No frame rates, no timings and no “feel” judgements are attributed to these sites.
