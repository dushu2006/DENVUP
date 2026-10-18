# Skill reference audit

This file is the running consultation log for the DENVUP site. It is written **before** each action and completed **after** validation. No entry is added for a skill that was not opened in this workspace.

Protocol followed for every action:

1. state the action;
2. locate the skill in `AI_Skills_Pack/skills/` (never guess a path);
3. open and read the actual `SKILL.md` and any required references;
4. record the guidance and its application here, before the change;
5. perform the change;
6. validate it;
7. complete the row with the real result.

`AI_Skills_Pack/` is read-only. `git status --short -- AI_Skills_Pack` is the check used to prove it.

---

## Running log

| Action | Planned action | Skill files opened (repository-relative) | Consultation evidence | Application | Execution result | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| A0 | Initial repo audit, research, IA, full site build and test pass (completed before this log existed). | `AI_Skills_Pack/AI_WORKFLOW.md`; `AI_Skills_Pack/TASK-PROMPT.md`; `AI_Skills_Pack/SKILL-INDEX.md`; `skills/testing-quality-security/webapp-testing/SKILL.md`; `skills/testing-quality-security/playwright/SKILL.md`; `skills/ui-ux-design/design-taste-frontend/SKILL.md`; `skills/ui-ux-design/impeccable/SKILL.md`; `skills/ui-ux-design/high-end-visual-design/SKILL.md`; `skills/ui-ux-design/frontend-design/SKILL.md`; `skills/ui-ux-design/modern-web-design/SKILL.md`; `skills/3d-motion-creative/gsap-scrolltrigger/SKILL.md`; `skills/3d-motion-creative/threejs-webgl/SKILL.md`; `skills/3d-motion-creative/lightweight-3d-effects/SKILL.md` | **Reconstructed entry.** Recorded from the build session; every listed path was verified to exist afterwards. Guidance used: audit before building; test real failure states; pin/scrub with cleanup and reduced-motion branches; do not ship WebGL without assets and fallbacks; native scrolling; semantic structure. | Produced the page, 21 labs, coverage map, tests and documentation. | `npx tsc --noEmit` exit 0; `npx vitest run` 37/37; build exit 0; `html-validate` exit 0. No browser available. |
| A1 | Re-baseline this audit as the mandated running log; no site code change. | `AI_Skills_Pack/AI_WORKFLOW.md`; `AI_Skills_Pack/skills/engineering-workflow/writing-for-agents/SKILL.md` | `AI_WORKFLOW.md`: read the actual `SKILL.md` for each selected skill; report files changed, checks and known limitations. `writing-for-agents`: steps need a checkable completion criterion; one meaning in one place; disclose reference behind pointers instead of sprawling; state the positive target. | Replaced the prose audit with a per-action log (planned action → skills → evidence → application → result → validation) plus a compact reference register. No skill file touched. | This file rewritten. | `grep` confirms every required column exists; `git status --short -- AI_Skills_Pack` returns 0 lines. |
| A2 | Verify the recorded “body-level dialog leak” from the lab stage; add a regression guard; correct the report if it does not reproduce. | `AI_Skills_Pack/skills/testing-quality-security/diagnosing-bugs/SKILL.md`; `AI_Skills_Pack/skills/testing-quality-security/webapp-testing/SKILL.md` | `diagnosing-bugs`: Phase 1 requires a **red-capable** loop that drives the exact symptom before any hypothesis; a green loop means the bug is not reproduced. `webapp-testing`: inspect the rendered DOM and assert on real state, not on assumptions. | Wrote a jsdom test that mounts and destroys all 148 modes, then asserts the stage is empty and the document `<dialog>` count is unchanged. Expected red; got **green**, so no code “fix” was invented. Corrected `TESTING_REPORT.md` §7.3 to say the claim does not reproduce and kept the test as a guard. | Added one test to `src/tests/labs.test.ts`; edited only the test and `TESTING_REPORT.md`. No production code changed. | `npx tsc --noEmit` exit 0; `npx vitest run` **38/38** passing; the new test fails if a demo leaves a node or dialog behind. |

---

## Reference register

Only skills actually opened are listed. Paths are relative to the repository root.

| Skill | What was taken from it | Where it influenced the build |
| --- | --- | --- |
| `AI_Skills_Pack/AI_WORKFLOW.md` | Audit → skill selection → implementation → verification → honest completion note; no skill claimed unless read. | The whole work order and this log. |
| `AI_Skills_Pack/TASK-PROMPT.md` | Complete working site, every technique accounted for, no fabricated credibility. | Scope, block list, “concept, not client work” labels. |
| `AI_Skills_Pack/SKILL-INDEX.md` | Real category paths for UI/UX, motion, testing and workflow skills. | Location of every skill below. |
| `skills/testing-quality-security/webapp-testing/SKILL.md` | Exercise failure states and real user paths, not only the happy path. | Enquiry failure path, lab mount/teardown tests, FAQ filter. |
| `skills/testing-quality-security/playwright/SKILL.md` | Browser automation would be the correct final check. | Not run: no browser installable. Recorded as unverified, never claimed. |
| `skills/ui-ux-design/design-taste-frontend/SKILL.md` | Restraint, hierarchy, one idea per section, avoid decorative noise. | Chapter rhythm, type scale, palette discipline. |
| `skills/ui-ux-design/impeccable/SKILL.md` | Detail-level craft: spacing, alignment, states, copy tone. | Buttons, focus states, empty states, footer. |
| `skills/ui-ux-design/high-end-visual-design/SKILL.md` | Art direction over decoration; one signature motion. | Orange/ink chapter system, oversized display type, opening. |
| `skills/ui-ux-design/frontend-design/SKILL.md` | Semantic structure, readable type, deliberate responsive behaviour. | Section markup, heading order, `clamp()` scale. |
| `skills/ui-ux-design/modern-web-design/SKILL.md` | Native scrolling, accessible motion, performance budgets. | No scroll-jacking, lazy lab mounting, capped canvases. |
| `skills/3d-motion-creative/gsap-scrolltrigger/SKILL.md` | Pin/scrub with cleanup, reduced-motion branch, no hijack. | Gate pin, horizontal rails, process line. |
| `skills/3d-motion-creative/threejs-webgl/SKILL.md` | WebGL only with real assets, fallback and context-loss handling. | Decision not to ship Three.js; blocked 3D rows name alternatives. |
| `skills/3d-motion-creative/lightweight-3d-effects/SKILL.md` | Prefer CSS 3D/2D projection when an engine is not required. | Depth scene, tilt cards, isometric plate, orbit. |

## What this log does not claim

- No browser test exists. Playwright was read but never installed or run.
- A0 is explicitly marked reconstructed; it is not presented as a contemporary live log.
- Skill files are reference material only; nothing in `AI_Skills_Pack/` was written, moved or renamed.
