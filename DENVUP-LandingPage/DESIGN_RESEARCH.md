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
