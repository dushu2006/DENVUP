# Skill reference audit

Every entry below was read from `AI_Skills_Pack/` before the named work. Paths are relative to the repository root. No skill file was modified, generated into, renamed or moved.

Skills that were not read are not listed. Where no relevant skill existed, the decision is recorded in `IMPLEMENTATION_NOTES.md` rather than invented here.

| Skill file read | Guidance taken | Where it was applied | How it was checked |
| --- | --- | --- | --- |
| `AI_Skills_Pack/AI_WORKFLOW.md` | Work order: audit → skills → research → IA → build → test → report; keep a written audit trail. | Order of work, this file, the coverage matrix and the testing report. | `git status` shows `AI_Skills_Pack/` unchanged; this table names only files actually opened. |
| `AI_Skills_Pack/TASK-PROMPT.md` | Deliver a complete site, not a hero; every technique must be accounted for; no fabricated credibility. | Scope decisions, honest block list, "concept, not client work" labels. | `src/tests/content.test.ts` rejects placeholder copy and unverifiable claims. |
| `AI_Skills_Pack/SKILL-INDEX.md` | Which skill covers layout, motion, 3D, testing. | Selection of the skills below. | Each selected path exists and was read. |
| `AI_Skills_Pack/skills/webapp-testing/SKILL.md` | Test real states and failure paths, not only the happy path. | Form failure states, lab mount/teardown tests, coverage claims limited to what a check exercises. | `npx vitest run` — 37 tests. |
| `AI_Skills_Pack/skills/playwright/SKILL.md` | Browser testing would be the correct final verification. | Planned verification only; no browser can be installed in this environment. | Recorded as **not run** in `TESTING_REPORT.md`; no Playwright dependency was added. |
| `AI_Skills_Pack/skills/design-taste-frontend/SKILL.md` | Restraint, hierarchy, one idea per section, avoid decorative noise. | Chapter rhythm, type scale, limited palette, no card grids everywhere. | Manual review against the house rules in `IMPLEMENTATION_NOTES.md`. |
| `AI_Skills_Pack/skills/impeccable/SKILL.md` | Craft at the detail level: spacing, alignment, states, copy tone. | Buttons, focus states, footer, empty states, copy. | Visual verification is limited by the missing browser; source review completed. |
| `AI_Skills_Pack/skills/gsap-scrolltrigger/SKILL.md` | Pin sections with `ScrollTrigger`, scrub progress, always provide a reduced-motion branch, always clean up. | `src/client/motion.ts`: gate pin, horizontal rails, process line, section relays. | `tsc --noEmit`; reduced-motion branch reviewed; cleanup via `gsap.context()` — not exercised in a browser. |
| `AI_Skills_Pack/skills/threejs-webgl/SKILL.md` | Use WebGL only with a real asset, a fallback and context-loss handling. | Decision **not** to ship a Three.js scene without models; CSS 3D and Canvas 2D used instead. | Documented in `IMPLEMENTATION_NOTES.md`; blocked techniques list the closest alternative. |
| `AI_Skills_Pack/skills/lightweight-3d-effects/SKILL.md` | Prefer CSS 3D/2D projection when the effect can be achieved without a 3D engine. | Depth scene, card tilt, isometric plate, orbiting points. | Labs mount in jsdom; no WebGL context is required. |
| `AI_Skills_Pack/skills/frontend-design/SKILL.md` | Semantic structure, readable type, deliberate responsive behaviour. | Section markup, heading order, `clamp()` scales, breakpoints. | `html-validate` passes; render tests assert one `h1`, labelled controls and unique ids. |
| `AI_Skills_Pack/skills/high-end-visual-design/SKILL.md` | Art direction over decoration: a strong field colour, editorial type, one signature motion. | Orange/ink chapter system, oversized display type, opening sequence. | Source review; visual confirmation pending a browser. |
| `AI_Skills_Pack/skills/modern-web-design/SKILL.md` | Native scrolling, accessible motion, performance budgets. | No scroll smoothing library; no scroll hijack; lazy lab mounting; `content-visibility` and capped canvases. | Build sizes and lab mount tests; no runtime profiling available. |

## What this audit does not claim

- No skill was consulted for the logo pipeline beyond the asset rules in the brief; the pipeline is documented in `scripts/build-brand-assets.mjs` and `ASSETS.md`.
- The Playwright skill was read, but Playwright was never installed or run. No browser test is claimed anywhere in this repository.
