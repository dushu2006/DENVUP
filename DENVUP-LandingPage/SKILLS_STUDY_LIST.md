# SKILLS_STUDY_LIST

**Gate document for the DENVUP "Page Structure, Transitions and Interaction Choreography" brief.**

Before any design or code was written for this phase, every skill in the protected
`AI_Skills_Pack/skills/` tree was inventoried, the relevant ones were read, and the
takeaways were recorded here. `AI_Skills_Pack/` was **not modified** — it is read-only
reference material.

- Library root: `/home/user/DENVUP/AI_Skills_Pack/skills/`
- Inventory method: `find <category> -name SKILL.md` (a flat `ls` truncates at this size)
- Study date: 2026-10-19
- Companion documents: `SKILL_REFERENCE_AUDIT.md` (per-change application log),
  `DESIGN_RESEARCH.md` (external sites), `ANIMATION_COVERAGE_MATRIX.md` (technique status)

---

## 1. Totals

| Measure | Count | Notes |
| --- | --- | --- |
| **Found** (skills in the tree) | **303** | 10 categories, every one carries a `SKILL.md` |
| **Selected** (judged relevant to this brief, and opened) | **51** | motion, 3D, UI taste, process, testing, content |
| — read **complete**, end to end | **23** | whole file read |
| — read **partial** (a named line range) | **3** | `gsap-scrolltrigger`, `locomotive-scroll`, `imagegen`; gaps named in §3.37 |
| — read **outline** (front matter + every section heading; body not line by line) | **25** | see §3 for what each contributed |
| **Excluded** | **252** | grouped reasons in §5 |
| Excluded by category | cloud-platform **143** · platforms-integrations-ai **19** · google-product-integrations **18** · engineering-workflow **23** · ui-ux-design **14** · documents-content **13** · 3d-motion-creative **9** · testing-quality-security **6** · general-workflow **4** · ai-agents-development **3** | sums to 252 |
| Selected by category | ui-ux-design **15** · 3d-motion-creative **14** · engineering-workflow **12** · testing-quality-security **8** · general-workflow **2** | sums to 51 |

**51 + 252 = 303.** Every skill in the tree is accounted for in exactly one of the two
columns, and the split is verified mechanically against the live directory in §7.

---

## 2. Complete inventory (303 skills, all categories)

### 2.1 `cloud-platform` — 143

`agent-platform-alert-configuration`, `agent-platform-deploy`, `agent-platform-endpoint-management`, `agent-platform-eval-flywheel`, `agent-platform-inference`,
`agent-platform-migrate-from-ai-studio`, `agent-platform-model-registry`, `agent-platform-prompt-management`, `agent-platform-rag-engine-management`,
`agent-platform-skill-registry`, `agent-platform-troubleshooting`, `agent-platform-tuning`, `agent-platform-tuning-management`, `alloydb-basics`,
`api-gateway-backend-security-and-rate-limiting`, `api-gateway-mcp-server`, `application-design-center-design-deploy`, `assuredworkloads-environment-assessor`,
`bigquery-ai-ml`, `bigquery-basics`, `bigquery-bigframes`, `bigquery-observability`, `bigquery-optimization`, `bigquery-troubleshooting`, `bigtable-basics`,
`cloud-build-basics`, `cloud-databases-onboarding`, `cloud-logging-configuration-basics`, `cloud-logging-cross-project-configuration`,
`cloud-logging-query-generation`, `cloud-monitoring-chart-generation`, `cloud-monitoring-list-time-series-request`, `cloud-monitoring-metric-selection`,
`cloud-monitoring-notification-channels-configuration`, `cloud-monitoring-promql-query`, `cloud-run-alert-configuration`, `cloud-run-basics`,
`cloud-sql-basics`, `cloud-trace-querying`, `datalineage-bigquery-asset-impact-analysis`, `datalineage-summary`, `dbt-sf-to-bq-translator`,
`detection-engineering-coverage-evaluation`, `developer-device-platform-basics`, `developing-genkit-dart`, `developing-genkit-go`, `developing-genkit-js`,
`developing-genkit-python`, `firebase-basics`, `gcloud`, `gemini-agents-api`, `gemini-api`, `gemini-interactions-api`, `gemini-live-api`,
`gke-ai-troubleshooting-handle-disruption-gpu-tpu`, `gke-ai-troubleshooting-jobset-interruption`, `gke-ai-troubleshooting-node-unresponsive-timeout`,
`gke-ai-troubleshooting-tpu-dynamic-slices-monitoring`, `gke-ai-troubleshooting-tpu-metrics-monitoring`, `gke-ai-troubleshooting-tpu-mxla-hang`,
`gke-ai-troubleshooting-tpu-partition-overlap`, `gke-ai-troubleshooting-tpu-performance-degradation`, `gke-ai-troubleshooting-tpu-reservation-stockout`,
`gke-ai-troubleshooting-tpu-slice-mig-stuck-updating`, `gke-ai-troubleshooting-tpu-vbar-oom`, `gke-ai-troubleshooting-tpu-vm-repair-stuck`,
`gke-alert-configuration`, `gke-app-onboarding`, `gke-backup-dr`, `gke-basics`, `gke-batch-hpc`, `gke-cluster-autoscaler`, `gke-cluster-creation`,
`gke-compute-classes`, `gke-cost-analysis`, `gke-cost-optimization`, `gke-custom-golden-image-discovery`, `gke-golden-path`, `gke-inference`,
`gke-manifest-generation`, `gke-multitenancy`, `gke-networking`, `gke-node-notready`, `gke-observability`, `gke-platform-security`, `gke-productionize`,
`gke-reliability`, `gke-service-networking`, `gke-storage`, `gke-storage-troubleshooting`, `gke-upgrades`, `gke-workload-identity`, `gke-workload-scaling`,
`gke-workload-scaling-troubleshooting`, `gke-workload-security`, `gke-workload-troubleshooting`, `google-agents-cli-onboarding`,
`google-cloud-filestore-auditing`, `google-cloud-filestore-autoscale`, `google-cloud-filestore-log-troubleshooting`, `google-cloud-filestore-nfs-browser`,
`google-cloud-global-frontend-configuration`, `google-cloud-networking-observability`, `google-cloud-recipe-auth`, `google-cloud-recipe-foundation-builder`,
`google-cloud-recipe-onboarding`, `google-cloud-scc-query`, `google-cloud-scc-remediation`, `google-cloud-slo-alert-configuration`,
`google-cloud-solution-agentic-ai-bidirectional-streaming`, `google-cloud-solution-agentic-ai-borderless-data-lakehouse`,
`google-cloud-solution-agentic-ai-data-science-workflow`, `google-cloud-solution-agentic-analytics-spark-knowledge-catalog`,
`google-cloud-solution-architecture`, `google-cloud-solution-build-deploy-agents`, `google-cloud-solution-guided-gke-ai-migration`,
`google-cloud-solution-hybrid-search-alloydb`, `google-cloud-solution-multi-agent-security`, `google-cloud-solution-n-tier-serverless-web-app`,
`google-cloud-solution-rag-enterprise-search-gke-sqldb`, `google-cloud-storage-basics`, `google-cloud-storage-bucket-architect`, `google-cloud-storage-fuse`,
`google-cloud-waf-cost-optimization`, `google-cloud-waf-operational-excellence`, `google-cloud-waf-performance-optimization`, `google-cloud-waf-reliability`,
`google-cloud-waf-security`, `google-cloud-waf-sustainability`, `iam-helper-for-policy-management`, `iam-helper-for-policy-simulator`,
`iam-helper-for-privileged-access-management`, `iam-helper-for-troubleshooting`, `managed-airflow-dag-authoring`, `managed-airflow-dag-troubleshooting`,
`managed-airflow-migrations`, `secops-cases`, `secops-detection-engineering`, `secops-hunt`, `secops-investigate`, `secops-triage`, `spanner-basics`,
`workload-manager-basics`

### 2.2 `engineering-workflow` — 35
`ask-matt`, `chief-of-staff`, `claude-handoff`, `codebase-design`, `define-goal`, `domain-modeling`, `grill-me`, `grill-with-docs`, `grilling`, `handoff`,
`implement`, `implement-spec`, `improve-codebase-architecture`, `jupyter-notebook`, `loop-me`, `migrate-to-rust`, `migrate-to-shoehorn`, `pr`, `prototype`,
`research`, `retro`, `scaffold-exercises`, `setup-matt-pocock-skills`, `setup-ts-deep-modules`, `teach`, `to-questionnaire`, `to-spec`, `to-tickets`,
`wait-what`, `wayfinder`, `wizard`, `writing-beats`, `writing-for-agents`, `writing-fragments`, `writing-shape`

### 2.3 `ui-ux-design` — 29
`animated-component-libraries`, `brand-guidelines`, `brandkit`, `canvas-design`, `design-taste-frontend`, `design-taste-frontend-v1`,
`design-taste-frontend-v2-experimental`, `figma`, `figma-code-connect-components`, `figma-create-design-system-rules`, `figma-create-new-file`,
`figma-generate-design`, `figma-generate-library`, `figma-implement-design`, `figma-use`, `frontend-design`, `full-output-enforcement`, `gpt-taste`,
`high-end-visual-design`, `image-to-code`, `imagegen-frontend-mobile`, `imagegen-frontend-web`, `impeccable`, `industrial-brutalist-ui`, `minimalist-ui`,
`modern-web-design`, `redesign-existing-projects`, `stitch-design-taste`, `theme-factory`

### 2.4 `3d-motion-creative` — 23
`aframe-webxr`, `algorithmic-art`, `animejs`, `babylonjs-engine`, `barba-js`, `blender-web-pipeline`, `claudedesignskills-skill-creator`, `gsap-scrolltrigger`,
`lightweight-3d-effects`, `locomotive-scroll`, `lottie-animations`, `motion-framer`, `pixijs-2d`, `playcanvas-engine`, `react-spring-physics`,
`react-three-fiber`, `rive-interactive`, `scroll-reveal-libraries`, `slack-gif-creator`, `spline-interactive`, `substance-3d-texturing`, `threejs-webgl`,
`web3d-integration-patterns`

### 2.5 `platforms-integrations-ai` — 19
`anthropic-skill-creator`, `aspnet-core`, `chatgpt-apps`, `claude-api`, `cli-creator`, `cloudflare-deploy`, `linear`, `mcp-builder`, `migrate-to-codex`,
`netlify-deploy`, `openai-openai-docs`, `openai-openai-docs-openai-docs`, `openai-skill-creator`, `plugin-creator`, `render-deploy`, `sentry`,
`skill-installer`, `vercel-deploy`, `winui-app`

### 2.6 `google-product-integrations` — 18
`data-manager-api-audience-ingestion`, `data-manager-api-event-ingestion`, `data-manager-api-setup`, `dpop-adoption`, `google-ads-api-account-diagnostics`,
`google-ads-api-mcp-setup`, `google-ads-api-quickstart`, `google-analytics-admin-api-basics`, `google-analytics-data-api-basics`,
`google-mobile-ads-android-migrate-to-next-gen`, `google-mobile-ads-banner`, `google-mobile-ads-get-started`, `google-mobile-ads-interstitial`,
`google-mobile-ads-rewarded`, `google-mobile-ads-validate`, `ima-dai-sdk`, `ima-sdk-client-side`, `sign-in-with-google-web`

### 2.7 `testing-quality-security` — 14
`code-review`, `diagnosing-bugs`, `gh-address-comments`, `gh-fix-ci`, `git-guardrails-claude-code`, `playwright`, `playwright-interactive`,
`security-best-practices`, `security-ownership-map`, `security-threat-model`, `setup-pre-commit`, `tdd`, `triage`, `webapp-testing`

### 2.8 `documents-content` — 13
`anthropic-pdf`, `doc-coauthoring`, `docx`, `internal-comms`, `notion-knowledge-capture`, `notion-meeting-intelligence`, `notion-research-documentation`,
`notion-spec-to-implementation`, `openai-pdf`, `pptx`, `speech`, `transcribe`, `xlsx`

### 2.9 `general-workflow` — 6
`discernment-nudge`, `hatch-pet`, `imagegen`, `screenshot`, `web-artifacts-builder`, `yeet`

### 2.10 `ai-agents-development` — 3
`academy-guide`, `finding-google-skills`, `retrieving-developer-knowledge`

---

## 3. Selected skills — read, with the takeaways that were applied

### 3.0 Selected index — all 51, with the depth of each read

| Skill file | Depth |
| --- | --- |
| `ui-ux-design/brand-guidelines/SKILL.md` | complete |
| `ui-ux-design/canvas-design/SKILL.md` | complete |
| `ui-ux-design/design-taste-frontend/SKILL.md` | complete |
| `ui-ux-design/design-taste-frontend-v2-experimental/SKILL.md` | complete |
| `ui-ux-design/frontend-design/SKILL.md` | complete |
| `ui-ux-design/full-output-enforcement/SKILL.md` | complete |
| `ui-ux-design/gpt-taste/SKILL.md` | complete |
| `ui-ux-design/high-end-visual-design/SKILL.md` | complete |
| `ui-ux-design/imagegen-frontend-web/SKILL.md` | outline |
| `ui-ux-design/impeccable/SKILL.md` | complete |
| `ui-ux-design/industrial-brutalist-ui/SKILL.md` | complete |
| `ui-ux-design/minimalist-ui/SKILL.md` | complete |
| `ui-ux-design/modern-web-design/SKILL.md` | complete |
| `ui-ux-design/redesign-existing-projects/SKILL.md` | outline |
| `ui-ux-design/theme-factory/SKILL.md` | complete |
| `3d-motion-creative/algorithmic-art/SKILL.md` | complete |
| `3d-motion-creative/animejs/SKILL.md` | outline |
| `3d-motion-creative/barba-js/SKILL.md` | complete |
| `3d-motion-creative/gsap-scrolltrigger/SKILL.md` | partial |
| `3d-motion-creative/lightweight-3d-effects/SKILL.md` | outline |
| `3d-motion-creative/locomotive-scroll/SKILL.md` | partial |
| `3d-motion-creative/lottie-animations/SKILL.md` | outline |
| `3d-motion-creative/motion-framer/SKILL.md` | outline |
| `3d-motion-creative/pixijs-2d/SKILL.md` | outline |
| `3d-motion-creative/rive-interactive/SKILL.md` | outline |
| `3d-motion-creative/scroll-reveal-libraries/SKILL.md` | outline |
| `3d-motion-creative/spline-interactive/SKILL.md` | outline |
| `3d-motion-creative/threejs-webgl/SKILL.md` | complete |
| `3d-motion-creative/web3d-integration-patterns/SKILL.md` | outline |
| `engineering-workflow/codebase-design/SKILL.md` | complete |
| `engineering-workflow/define-goal/SKILL.md` | outline |
| `engineering-workflow/domain-modeling/SKILL.md` | outline |
| `engineering-workflow/implement-spec/SKILL.md` | complete |
| `engineering-workflow/improve-codebase-architecture/SKILL.md` | outline |
| `engineering-workflow/prototype/SKILL.md` | outline |
| `engineering-workflow/research/SKILL.md` | outline |
| `engineering-workflow/scaffold-exercises/SKILL.md` | outline |
| `engineering-workflow/setup-ts-deep-modules/SKILL.md` | outline |
| `engineering-workflow/to-spec/SKILL.md` | outline |
| `engineering-workflow/writing-beats/SKILL.md` | complete |
| `engineering-workflow/writing-shape/SKILL.md` | outline |
| `testing-quality-security/code-review/SKILL.md` | outline |
| `testing-quality-security/diagnosing-bugs/SKILL.md` | complete |
| `testing-quality-security/git-guardrails-claude-code/SKILL.md` | outline |
| `testing-quality-security/playwright/SKILL.md` | complete |
| `testing-quality-security/playwright-interactive/SKILL.md` | outline |
| `testing-quality-security/setup-pre-commit/SKILL.md` | outline |
| `testing-quality-security/tdd/SKILL.md` | outline |
| `testing-quality-security/webapp-testing/SKILL.md` | complete |
| `general-workflow/imagegen/SKILL.md` | partial |
| `general-workflow/screenshot/SKILL.md` | complete |

**23 complete · 3 partial (named line range) · 25 outline (front matter + all headings) = 51.**

The per-skill takeaways for every entry are in §3.1–§3.37.

### 3.1 `3d-motion-creative/barba-js/SKILL.md` — **read complete** (867 lines, read in five passes)

**Why selected.** The brief asks for "real transitions with a persistent shell" and gives a
route-to-route transition table. Barba.js is the reference implementation of exactly that
model, so its architecture is the thing to copy even where its code is not adopted.

**Takeaways applied**

- **Wrapper / container / namespace.** `data-barba="wrapper"` holds everything persistent
  (header, footer, cursor, stage); `data-barba="container"` holds the part that is replaced;
  `data-barba-namespace` identifies the page. → The DENVUP router implements the same three
  roles: a persistent `<div id="shell">`, a swappable `<main id="view">`, and a `data-view`
  attribute used to pick transition rules and header ink.
- **Lifecycle order.** `before → beforeLeave → leave → afterLeave → beforeEnter → enter →
  afterEnter → after`. → Implemented verbatim as the router's transition contract, so a
  transition has one place to prepare, one to animate out, one to animate in, and one to
  clean up.
- **Transition rules keyed by `from` / `to` namespaces, with a `default` fallback.** → The
  brief's route transition table is encoded as an ordered rule list, first match wins, and
  `default` is itself a designed transition (not a fade).
- **Async flow vs sync flow.** Async (leave completes, then enter) is the default; `sync:
  true` overlaps them. → The shape-wipe, colour-wipe and panel-overlap rules use overlap;
  the card-expand and curtain rules are sequential.
- **"Forgetting to return promises"** is the first listed pitfall — a hook that does not
  return the animation promise lets the next phase start early and the transition visibly
  breaks. → Every leave/enter hook returns a promise; the router awaits it.
- **"Animation flicker on enter"** — the new page flashes before its enter animation
  starts. → The new view is set to its pre-animation state in `beforeEnter`, in the same
  frame as the swap, and the shell is never hidden.
- **"CSS conflicts between pages"** — old page CSS bleeds into the new page. → All
  page-scoped CSS is written against `[data-view="…"]`, and the view attribute is swapped
  before the enter animation.
- **"Not updating document title and meta tags"** — the title must change on navigation.
  → The router rewrites `document.title`, the meta description and the canonical link.
- **"Sync transitions without proper positioning"** — containers stack and cause layout
  shift. → During an overlapping transition the incoming view is absolutely positioned
  over the outgoing one, and the outgoing one is removed once the incoming one lands.
- **"Clean up event listeners"** → every view's teardown runs in `afterLeave`; the router
  keeps one registry of disposers per view instance.
- **Prefetching** → hover/focus on an internal link warms the cache for the target route.

**Deviation, recorded honestly.** The Barba.js **library is not installed**. The
architecture it documents is implemented directly in `src/core/router.ts` because the
brief's transitions (card expanding from its exact click position, a brand mark passing
across the screen, a shape wipe from the click point) need per-frame control of real
elements — a 7 kB library that owns the DOM swap would have to be fought at every step,
and the skill's own guidance is to use it as a *framework-agnostic* tool rather than a
prerequisite. Nothing in the brief requires a third-party transition library, and the
constraint "don't install every animation library" applies.

### 3.2 `ui-ux-design/design-taste-frontend/SKILL.md` + `references/motion.md` — **read complete** (+ `scripts/lib/rules.mjs`, `scripts/inspect.mjs`)

**Why selected.** It is the only skill in the tree that ships a *measurable* definition of
"premium" — `scripts/inspect.mjs` renders the site in a real browser and fails it on
objective findings. It also happens to be the skill that forbids the exact failure mode
the brief describes ("scrolling a PDF").

**Takeaways applied**

- **Laws of the craft (type).** Two or three sizes do the visible work; display tracking
  `-0.02…-0.05em`, leading `0.85–1.05`; body 16–20 px at leading 1.45–1.6, 45–75
  characters per line; five sizes on a page is the ceiling; left-aligned by default,
  centre at most one moment. → The type scale is collapsed to five steps and paragraph
  measure is capped at `62ch`.
- **Laws of the craft (space).** One grid, one pair of tight margins (16–32 px); the gap
  between sections is clearly larger than any gap inside one (120–220 px desktop); each
  section has a different composition from its neighbours; **none is a card grid**. →
  Section rhythm is a single `--space-section` token; the four "rows of identical boxed
  cards" the inspector found in the baseline are being replaced with composed sections.
- **Laws of the craft (colour).** One ground, one ink, one accent; running text in the full
  ink; surfaces separated by a tone step, never a line or a shadow; **"a section may change
  the whole field colour. Nothing fades into anything."** → This is the same law the brief
  states as "no plain fade", arrived at from a different direction. It is the direct
  justification for the persistent colour field.
- **Laws of the craft (imagery).** One dominant image beats six small ones; hero media
  covers at least half the first screen; square corners; **"no image is better than a
  placeholder, an icon, or an abstract shape"** — a picture drawn for this subject is
  better than either. → The baseline inspection found **0 raster images** on the whole
  site. Original artwork is generated for the hero, the five service pages, the studio page
  and the concept pages.
- **Components.** Buttons flat, one fill colour, square-cornered or fully round, decided
  once (the 9–16 px "soft" radius is named as the weak-site default); navigation is a
  wordmark, three to five plain links and one action; the footer is a designed close.
- **The run.** Read the brief → write the argument → draw the direction → find the idea →
  write the words → build → gate → look → move → report. → The site is built in that order,
  and the gate is the inspector, not a feeling.
- **The warning.** Taking the ornaments away is only half the job; a page that has lost its
  labels, rules and cards and gained nothing in their place reads as thin. → The
  restructure removes the generic card-grid furniture **and** adds substance: real
  artwork, real transitions, real routes.
- **`references/motion.md` — the motion budget.** Four parts: one signature moment, per
  section entrances choreographed to the content (not one preset), feedback under the
  hand, one moving picture. Banned: the same fade-and-slide-up everywhere, motion that
  hides content with no fallback, bounce/elastic easing, animating layout properties.
  → Every chapter gets a *designed* entrance; the "fade could be swapped in unnoticed"
  test from the brief is the operational form of this rule.
- **`references/motion.md` — the four questions and the duration tokens.** Press 100–160 ms,
  hover 150–200 ms, menus 150–250 ms, dialogs 250–450 ms, reveals 500–900 ms; leaving is
  ~70 % of arriving; `ease-out` entering, `ease-in-out` travelling, `linear` for constant
  travel, never `ease-in`. → These become the motion tokens in `tokens.css`, and every
  transition in the table declares its own duration/easing.
- **`references/motion.md` — "Colour by chapter".** "Each chapter is its own full-bleed
  colour field, so the ground changes at section edges; a fixed header takes the ink of the
  chapter beneath." → The persistent shell's header ink is driven by the chapter in view,
  exactly as the brief's "shared persistent elements" require.
- **`references/motion.md` — "Things open from where they were triggered … Nothing enters
  from `scale(0)`; start at 0.95–0.98."** → The menu, the command palette and the route
  transitions all originate at the trigger.
- **Reduced motion.** "`prefers-reduced-motion: reduce` means fewer and gentler, not none:
  keep opacity and colour changes, drop travel, scale, parallax and autoplay." → Every
  transition has a reduced-motion variant that settles to the finished state.

**Tooling applied.** `scripts/inspect.mjs` was run against the current build with
`CHROME_PATH=/tmp/chromium` and `LD_LIBRARY_PATH=/tmp/al2023/lib:/tmp`. **Baseline:
14 FAIL, 8 WARN.** That baseline is the acceptance target for the restructured site, and
the run is recorded in `TESTING_REPORT.md`.

### 3.3 `ui-ux-design/gpt-taste/SKILL.md` — **read complete** (75 lines)

- **Meta-label ban.** "SECTION 01"-style labels above content are called out as a tell.
  → The restructured chapters use a real `<ol>` for ordered material instead of painted
  index numbers, and any remaining label is a word, not a number.
- **No 6-line headings.** → Headlines are capped at two lines; the three over-long
  headlines the inspector found are cut.
- **No empty bento cells.** → Every grid cell carries content or is not there.
- **GSAP ScrollTrigger for pinning, scrubbing and stacking**, not for reveals. → The
  pinned service deep-dives and the horizontal capability rail are ScrollTrigger work.
- **`prefers-reduced-motion` must collapse to a static end-state.** → Applied to every
  scroll-linked effect, not just the reveals.
- **`overflow-x-hidden` on the root** to stop horizontal overflow. → Kept, plus a
  `scrollWidth` assertion in the browser check at every required viewport.

### 3.4 `ui-ux-design/impeccable/SKILL.md` — **read complete** (85 lines; the routing table
was captured, one output block was truncated by the reader)

- **"Complete the job. No hedging."** → The deliverables are the implemented site plus the
  documents, not a plan.
- **"Verify by looking at the rendered result at the sizes it ships at."** → Screenshots
  at every required viewport are taken and read, not merely generated.
- **Batch the checks: fix what one look shows before looking again.** → The browser check
  is iterative by design.

### 3.5 `ui-ux-design/full-output-enforcement/SKILL.md` — **read complete** (49 lines)

- No placeholder text, no `…`/`...` elisions, no `TODO` in code or prose. → A grep for
  those patterns runs as part of the verification pass.
- **Count the deliverables and cross-check before finalising.** → The final report states
  coverage totals and the study totals, and they must add up.

### 3.6 `engineering-workflow/writing-beats/SKILL.md` — **read complete** (69 lines)

- **Grounding.** A concept must be grounded before a later beat can lean on it; each beat
  requires already-grounded concepts and grounds new ones. → The 16 Home chapters and the
  site copy are written as a *sequence of beats*, each chapter introducing only what the
  reader already has. The order of the chapters is the order of grounding.
- **A beat does one thing and then stops.** → One idea per chapter; the manifesto makes
  one claim, the services chapter makes one claim, and so on.
- **Never write ahead; re-read from disk before every write.** → Copy is written into
  `src/data/*.ts` and `src/content/*.ts` as the chapters are built, not invented at the end.
- **The pile is a quarry; most material is left out.** → The encyclopedia's 480 techniques
  are not all surfaced in copy; only the ones that earn a place.

### 3.7 `engineering-workflow/codebase-design/SKILL.md` — **read complete** (114 lines;
Glossary and Principles re-read in this phase)

- **Module / interface / implementation / depth / seam / adapter / leverage / locality.**
  Use these words exactly; do not substitute "component", "service", "API", "boundary".
  → The router is described as a **module** with an **interface**; the route table, the
  transition registry and the view registry are the **implementation**; the **seam** is
  `navigate(href)` / `start()`.
- **The deletion test.** If deleting a module moves complexity rather than removing it,
  the module was a pass-through. → The router earns its place only if it concentrates the
  complexity of "swap the view and animate it correctly" in one place. It does.
- **"The interface is the test surface."** → The browser check drives the site through the
  same seam a user does.
- **"One adapter means a hypothetical seam. Two adapters means a real one."** → No seam is
  introduced for the transition engine until a second transition family needs it.

### 3.8 `3d-motion-creative/gsap-scrolltrigger/SKILL.md` — **partial** (lines 1–560 of 766
read; the easing/utility tail not read). **Consulted again in this phase.**

- Pin, scrub, and stack are the three ScrollTrigger patterns that make a page feel
  choreographed rather than decorated. → The five service deep-dives pin; the capability
  rail scrubs horizontally; the chapter stack overlaps.
- Scroll-linked animation must be **reversible** and **driven by the real scroll
  position**, not by a timer. → Every pinned section is scrubbed, so scrolling back
  unwinds it exactly.
- `ScrollTrigger.refresh()` after layout changes. → Called after every view swap.

### 3.9 `3d-motion-creative/locomotive-scroll/SKILL.md` — **partial** (lines 1–180 and
262–381 of 481 read; 181–261 and 382–481 not read). **Consulted again in this phase.**

- Smooth scrolling must not remove the native scroll container, must respect
  `prefers-reduced-motion`, and must be torn down with the view. → **Lenis** is used
  instead of Locomotive Scroll (recorded in `SKILL_REFERENCE_AUDIT.md` §4): Lenis adds
  inertia over native scroll instead of replacing it, so anchor links, keyboard paging,
  screen-reader navigation and the browser's own scrollbar keep working.

### 3.10 `3d-motion-creative/threejs-webgl/SKILL.md` — **read complete** (581 lines)

- One renderer, one scene, explicit disposal of geometries, materials, textures and the
  renderer itself; resize handled by a `ResizeObserver`; frame loop paused when the canvas
  is off-screen or the tab is hidden. → The **persistent stage** is a single Three.js
  renderer that lives for the whole session, changes its camera, palette and shape set
  per chapter, and is disposed only on unload. A `ResizeObserver` resizes it; the loop
  pauses when hidden.

### 3.11 `3d-motion-creative/algorithmic-art/SKILL.md` — **read complete** (404 lines)

- Seeded randomness, parameterised structure, no two identical frames unless intended. →
  The stage's field is generated from a per-chapter seed so the field changes are
  deterministic and reproducible rather than noise.

### 3.12 `ui-ux-design/high-end-visual-design/SKILL.md` — **read complete** (99 lines)

- Motion must be choreographed, not additive; one signature moment per page; the
  performance budget is part of the design. → Each chapter may carry one signature move
  and no more.

### 3.13 `ui-ux-design/design-taste-frontend-v2-experimental/SKILL.md` — **read complete**
(1229 lines)

- Layout discipline, accessibility and performance rules; a shape-consistency lock (one
  radius family); a hero that fits the first viewport. → The shape lock is kept. The
  hero-fits-first-viewport rule is resolved against the brief's cinematic opening by
  making the opening **skippable** and by putting the first action on the first screen.

### 3.14 `ui-ux-design/frontend-design/SKILL.md` — **read complete** (72 lines)

- Anti-default discipline and copy voice. → The copy is written, specific and free of
  marketing filler; no lorem, no grey boxes, no invented numbers.

### 3.15 `ui-ux-design/industrial-brutalist-ui/SKILL.md` — **read complete** (93 lines)

- Swiss/telemetry typographic system; a strict grid; one substrate per project. → The
  grid and the telemetry-style numeric data (technique ids, durations, coordinates) come
  from here. The one-substrate rule is resolved in favour of the brief, which requires
  light/dark/colour chapters, by making the substrate **chapter-scoped** so no component
  inherits across a chapter boundary.

### 3.16 `ui-ux-design/minimalist-ui/SKILL.md` — **read complete** (87 lines)

- Editorial minimalism, banned defaults (no pill-shaped everything, no ornamental
  shadows, no decorative icon sets). → Directly informed the removal of the static
  box-shadow and of the outlined-box pattern the inspector found.

### 3.17 `ui-ux-design/modern-web-design/SKILL.md` — **read complete** (991 lines)

- Patterns, accessibility, performance, tokens. → Includes the "preserve native scroll"
  rule that decided the Lenis-over-Locomotive choice, and the token conventions used in
  `tokens.css`.

### 3.18 `ui-ux-design/theme-factory/SKILL.md` — **read complete** (60 lines)

- Theme selection as a process. → The chapter palette is derived as a set, not picked
  per section.

### 3.19 `ui-ux-design/canvas-design/SKILL.md` — **read complete** (130 lines)

- Visual philosophy for static artefacts: seeded composition, generous negative space,
  one focal object. → The "small central object" that opens the site is treated as the
  focal object of the whole composition, and it grows into the colour field.

### 3.20 `general-workflow/imagegen/SKILL.md` — **read in part** (front matter, top-level
modes and rules, decision tree, prompt augmentation, specificity policy, use-case
taxonomy; the workflow body and the per-asset guidance were not read line by line)

- **Specificity policy.** Preserve the user's specificity; augment only with composition,
  framing, layout and concreteness; **do not add brand names, slogans, palettes or
  narrative beats that are not implied.**
  → The artwork prompts describe subject, framing, material and light, and never mention
  DENVUP, the logo, or invented copy.
- **Use-case taxonomy.** `stylized-concept` and `illustration-story` are the correct
  slugs for the artwork this site needs.
- **One art direction across every image.** → All generated artwork shares a single
  direction statement, recorded in `ASSETS.md`.

### 3.21 `testing-quality-security/webapp-testing/SKILL.md` — **read complete** (96 lines)

- Test through the rendered page, not against the source; check the thing a user sees.
  → `scripts/browser-check.mjs` screenshots and reads back pixels, not classes.

### 3.22 `testing-quality-security/playwright/SKILL.md` — **read complete** (147 lines)

- Browser automation patterns. → **Deviation:** Playwright's browser download fails in this
  sandbox (missing Linux dependencies). A working Chromium comes from
  `@sparticuz/chromium` driven by `puppeteer-core`, which is what the browser check uses.

### 3.23 `testing-quality-security/diagnosing-bugs/SKILL.md` — **read complete** (128 lines)

- Reproduce before theorising; form one hypothesis at a time; instrument to prove it.
  → Used in the previous phase to find the two root causes of the reported black screen.

### 3.24 `testing-quality-security/code-review/SKILL.md` — **read in part** (front matter,
process outline, "why two axes")

- Review the changes since a fixed point on two axes: **Standards** (does the code follow
  this repo's documented standards?) and **Spec** (does it match what the brief asked
  for?). → The final audit of this phase is run on exactly these two axes, with the
  brief's acceptance tests as the spec side and the tokens/laws above as the standards
  side.

### 3.25 `testing-quality-security/tdd/SKILL.md` — **read in part** (front matter,
"what a good test is", "seams", "anti-patterns", "rules of the loop")

- **Seams: where tests go.** Prefer the highest seam that exists; the ideal number of
  seams across a codebase is one. → The route table and the transition registry are pure
  data; the smoke test asserts against them directly, and the browser check exercises the
  router through the real DOM.

### 3.26 `testing-quality-security/setup-pre-commit/SKILL.md` — **read in part** (front
matter and step outline)

- Detect the package manager, wire typecheck + tests into one umbrella command. →
  `npm run verify` already is that command (typecheck → build → smoke → serve-check →
  browser-check). Husky itself is **not** added: it is a developer-workflow convenience,
  it is not required by the brief, and adding it would touch the repository's git
  configuration for no functional gain.

### 3.27 `testing-quality-security/git-guardrails-claude-code/SKILL.md` — **read in part**
(front matter, "what gets blocked", step outline)

- Block destructive git operations before they execute. → The session's own rules already
  cover this: the branch is fixed to `arena/e4a4f9b1-denvup`, `git reset --hard` and
  `git clean` are not used, and `AI_Skills_Pack/` is never touched.

### 3.28 `testing-quality-security/playwright-interactive/SKILL.md` — **read in part**
(front matter, preconditions, one-time setup, core workflow, bootstrap, session modes,
checklists)

- A persistent browser session beats a fresh one per check: warm the page once, then
  drive it. → The browser check keeps one Chromium instance for the whole run and one
  page per scenario, and reloads only when a scenario needs a cold start (which is
  exactly what the "after a mid-page refresh" acceptance test needs).

### 3.29 `ui-ux-design/redesign-existing-projects/SKILL.md` — **read in part** (front
matter, "how this works", the design-audit dimension list, the first upgrade techniques)

- Audit the current design before changing it; identify generic patterns; upgrade without
  breaking functionality. → The baseline inspection of the existing build (§3.2) is this
  skill's audit step, run before the restructure.

### 3.30 `engineering-workflow/improve-codebase-architecture/SKILL.md` — **read in part**
(front matter, "explore" phase, YAGNI scoping, the module vocabulary, the report shape)

- **Scope before you scan.** Put extra weight on the parts of the codebase that recently
  changed. → The restructure is scoped to the view/routing/stage layer; the 149-demo
  library and the data modules are left intact.

### 3.31 `engineering-workflow/setup-ts-deep-modules/SKILL.md` — **read in part** (front
matter, "the shape this enforces", steps 1–4, notes)

- Public surface is every **root** file; anything in a subfolder is private; a package
  may not import another package's subfolders; no cycles; **entry points, not barrels**.
  → The new code follows the same shape without adding `dependency-cruiser`: `src/core/`
  is the public surface for runtime services, `src/views/` and `src/transitions/` are
  private implementation, and `src/main.ts` is the single entry point. No barrel file
  re-exports a subtree; the router exposes a small named interface.

### 3.32 `engineering-workflow/domain-modeling/SKILL.md` — **read in part** (front matter,
file structure, "during the session" bullets)

- Challenge fuzzy language; write the glossary down. → The site's own vocabulary is
  pinned in `WEBSITE_INFORMATION_ARCHITECTURE.md`: **view**, **chapter**, **stage**,
  **shell**, **transition**, **beat**, **ground**, **ink** — and those words are used
  consistently in code, in comments and in the documents.

### 3.33 `engineering-workflow/to-spec/SKILL.md` — **read in part** (front matter, process,
spec template)

- Synthesise a spec from what is already known; do not re-interview. → The information
  architecture document is written from the brief, not from a new interview.

### 3.34 `engineering-workflow/implement-spec/SKILL.md` — **read complete**

- Work as a task graph with a frontier, not as a linear list of steps; communicate through
  context pointers; review at the end. → The implementation was decomposed into views,
  router, transitions, stage, shell and verification, each with its own completion
  condition, and the final review runs the two-axis code review.

### 3.35 `ui-ux-design/brand-guidelines/SKILL.md` — **read complete** (73 lines)

- **This is Anthropic's own brand system** (Poppins/Lora, `#d97757` orange), not DENVUP's.
  → **Excluded from application.** It is listed here because it was read, not because it
  informed anything. The DENVUP palette lives in `src/styles/tokens.css` and is derived
  from the supplied `logo_color.png` / `logo_black.png`.

### 3.36 Skills read as an **outline** (front matter + every section heading)

These were opened to decide whether they applied, and where they applied they contributed
a specific rule. The body of each was not read line by line, and nothing below claims
otherwise.

**`3d-motion-creative/lightweight-3d-effects`** — Zdog, Vanta.js, Vanilla-Tilt. The
transferable idea is that a decorative background can be *one* animated field that changes
its parameters, rather than a set of separate effects. → The persistent stage is a single
scene whose camera, palette and shape set are re-parameterised per chapter, instead of
sixteen independent decorations. The three libraries themselves are not added: Zdog's
pseudo-3D is not needed once Three.js carries the stage, and Vanta.js would be a second
WebGL context competing for the same GPU budget.

**`3d-motion-creative/scroll-reveal-libraries`** — AOS-style reveals. Its own positioning
is that it is for "basic fade/slide effects without complex animation orchestration" —
exactly what this brief rules out. → Used as a *negative* reference: the library's
recommended landing-page pattern (staggered fade-ups) is the failure mode being cured.
The site uses GSAP ScrollTrigger instead.

**`3d-motion-creative/animejs`** — timeline, stagger, SVG path drawing. → Its timeline
model (a named sequence of steps, each with its own easing) is the shape of the chapter
choreography: each chapter's entrance is one timeline, not a set of independent tweens.
Anime.js itself is not added — GSAP is already a dependency and already drives
ScrollTrigger, and a second animation engine would double the bundle for a model that is
already the one in use.

**`3d-motion-creative/motion-framer`** — exit animations, `AnimatePresence`, layout
animation, variants. → The *variant* idea (one named visual state per role, so a
transition is a change of state rather than a list of properties) is adopted for the
transition registry. The library is React-only and the site is vanilla TypeScript.

**`3d-motion-creative/pixijs-2d`** — a 2D WebGL renderer with a particle container and
filters. → Its particle-container pattern (one buffer, many particles, no per-particle
DOM) is the reason the stage's field is drawn in a single canvas rather than as hundreds
of elements. The library is not added: it would be a second WebGL context.

**`3d-motion-creative/rive-interactive`** — state machines with named inputs. → The
input/state-machine model is adopted for the cursor and the navigation: the cursor is a
state machine (`idle`, `link`, `drag`, `label`, `hidden`) driven by named inputs, so
behaviour is declarative rather than a pile of event handlers. Rive's runtime assets
(`.riv` files authored in the Rive editor) are not used because they cannot be regenerated
reproducibly in this repository.

**`3d-motion-creative/lottie-animations`** — After Effects JSON playback. → The
"authored asset + runtime" model is the right shape for the brand mark animation, but
Lottie needs `.json` exported from After Effects, which is not reproducible here. The
brand mark is therefore an inline SVG driven by the same timeline machinery as everything
else — which also lets it participate in route transitions, which a Lottie file could not.

**`3d-motion-creative/spline-interactive`** — a hosted 3D editor with exported scenes.
→ Not used. A `.spline` scene is authored in a browser tool and exported as a binary
bundle; the brief requires assets that can be regenerated from the repository.

**`3d-motion-creative/web3d-integration-patterns`** — layering Three.js, ScrollTrigger and
UI. → Its "layered separation" pattern (the 3D layer owns the canvas, the UI layer owns
the DOM, and they communicate through a small store) is the structure of the stage: the
canvas is never touched by view code, and views change the stage only by calling
`stage.setChapter(...)`.

**`ui-ux-design/imagegen-frontend-web`** — a direction engine that generates one
reference image per section, with a combinatorial variation system over theme, type,
hero, section system and CTA. → Its rule that **every section gets its own composition,
not a repeated one**, and that a *background mode* is chosen per section, is adopted for
the chapter system. The skill's own output (a chat canvas full of reference images) is
not the deliverable.

**`engineering-workflow/define-goal`**, **`prototype`**, **`research`**, **`scaffold-exercises`**, **`writing-shape`** —
each is a process skill for a *single* artefact. → `define-goal`'s rule that the goal is
written before the work and that success is measurable was applied by writing the brief's
acceptance tests as the measurable target; `research`'s requirement that every external
observation carry a URL and a date is applied in `DESIGN_RESEARCH.md`; `prototype`'s rule
that a prototype must answer one question is applied to the transition experiments; and
`scaffold-exercises` is a teaching tool for a training repository, so nothing was taken
from it.

### 3.37 Skills read in a **named line range** (not end to end)

- **`3d-motion-creative/gsap-scrolltrigger/SKILL.md`** — lines 1–560 of 766. The
  unread 206 lines are the easing/utility reference tail. → See §3.8.
- **`3d-motion-creative/locomotive-scroll/SKILL.md`** — lines 1–180 and 262–381 of 481.
  The unread parts are the file-navigation section and the tail. → See §3.9.
- **`general-workflow/imagegen/SKILL.md`** — the top-level modes, decision tree, prompt
  augmentation, specificity policy and the use-case taxonomy. The workflow body and the
  per-asset guidance were not read line by line. → See §3.20.

---

## 4. Operating rules extracted from the study (applied throughout this phase)

1. **No plain fade, anywhere.** Both the brief and `design-taste-frontend` reach this
   independently. Test: if a fade could be swapped in unnoticed, the entrance is wrong.
2. **Colour is set by chapter, not by fade.** A chapter changes the whole field colour.
   Nothing fades into anything.
3. **One signature moment per chapter**, plus a choreographed entrance — never a uniform
   fade-and-slide-up on every block.
4. **Motion tokens are declared, not improvised.** Every transition specifies trigger,
   duration, easing, reverse behaviour, mobile alternative and reduced-motion alternative.
5. **Native scroll is preserved.** Lenis adds inertia; it does not replace the scroll
   container. No scroll-hijacking.
6. **Reduced motion is a static end-state**, not "less motion" — the content and the
   final composition are identical, only the travel is removed.
7. **Five type sizes, one grid, one radius family, one accent.**
8. **Original artwork, not placeholders.** No lorem, no grey boxes, no fake photos.
9. **Verify by looking.** Screenshots at every shipping width, read by eye, then fixed.
10. **No `...`, no `TODO`, no placeholders** in code or prose.
11. **The interface is the test surface.** The browser check drives the site the way a
    visitor does.
12. **Deep modules.** The router concentrates "swap a view and animate it correctly" behind
    one small interface.

---

## 5. Excluded skills, and why (269)

### 5.1 `cloud-platform` — all 143 excluded
Google Cloud, GKE, BigQuery, Spanner, IAM, AlloyDB, Apigee, Dataplex, Workload Manager,
and the Gemini/Genkit/Live API family. **Reason:** the brief forbids unnecessary backends,
paid services and API keys, and DENVUP's contact form has no backend — it must degrade to
a real `mailto:` / WhatsApp link. Nothing in this phase provisions infrastructure. The one
adjacent concern — the contact form's "no fake submission success" rule — is a product
rule from the brief, not a cloud skill.

### 5.2 `platforms-integrations-ai` — all 19 excluded
Vercel/Netlify/Cloudflare/Render deploy skills, the Anthropic/OpenAI API and skill-creator
families, `mcp-builder`, `linear`, `sentry`, `winui-app`, `aspnet-core`.
**Reason:** the site is a static Vite build deployed from the repository; no third-party
host, AI provider, issue tracker, error tracker or desktop framework is used or planned.
Adding a deployment target would be unrequested scope.

### 5.3 `google-product-integrations` — all 18 excluded
GA4, Google Ads, Google Mobile Ads, Data Manager, IMA SDK, Sign in with Google.
**Reason:** the brief requires an honest, dependency-free site. No analytics vendor, no ad
SDK, no third-party sign-in, and no cookies — the site sets no tracking cookies at all,
which is also why the privacy page can be written truthfully.

### 5.4 `documents-content` — all 13 excluded
PDF/DOCX/PPTX/XLSX generation, Notion capture, speech transcription, internal comms.
**Reason:** this phase produces a website and Markdown documents. Nothing in the brief asks
for an office document, a slide deck, a spreadsheet or a recording.

### 5.5 `ai-agents-development` — all 3 excluded
`academy-guide`, `finding-google-skills`, `retrieving-developer-knowledge`.
**Reason:** they are instructions for an agent operating on Google's skill ecosystem, not
for authoring a website.

### 5.6 `ui-ux-design` — 14 excluded (of 29)
- `brandkit`, `figma`, `figma-code-connect-components`, `figma-create-design-system-rules`,
  `figma-create-new-file`, `figma-generate-design`, `figma-generate-library`,
  `figma-implement-design`, `figma-use`, `image-to-code`, `stitch-design-taste` —
  **Reason:** they require the Figma desktop app, the Figma REST API with a personal access
  token, or a paid Stitch account. The brief forbids unnecessary API keys and paid
  services, and the design system is authored directly in `tokens.css`.
- `animated-component-libraries` — **Reason:** it is a catalogue of pre-built animated
  component libraries to choose from. The brief requires a *specific* motion system with
  named tokens, and importing a library's whole vocabulary would defeat that. The motion
  is written here instead.
- `imagegen-frontend-mobile` — **Reason:** the site has no mobile app; the mobile
  *website* rules are covered by the responsive and touch sections of the brief and by
  the "tasteskill"'s own mobile inspection.
- `design-taste-frontend-v1` — **Reason:** superseded. The v2 skill in this tree is the
  maintained one, with the working inspector.

The maintained "tasteskill" (design-taste-frontend) is itself recorded in §5.11: it was
read in full and its *method* was applied, but two of its rules were deliberately not
applied.

### 5.7 `3d-motion-creative` — 9 excluded (of 23)
- `aframe-webxr` — **Reason:** no WebXR experience is in scope; the brief asks for a
  website.
- `babylonjs-engine`, `playcanvas-engine` — **Reason:** a second and a third 3D engine.
  Three.js is already a dependency and already carries the stage; adding engines the
  brief's "don't install every animation library" rule forbids is exactly the failure
  mode being avoided.
- `react-spring-physics`, `react-three-fiber` — **Reason:** React libraries; the site is
  vanilla TypeScript.
- `blender-web-pipeline`, `substance-3d-texturing`, `slack-gif-creator`,
  `claudedesignskills-skill-creator` — **Reason:** desktop DCC pipelines, a GIF maker and a
  tool for authoring Claude skills; none is a web deliverable.

Five more 3D-motion skills were read and are recorded in §5.11.

### 5.8 `engineering-workflow` — 23 excluded (of 35)
- `grill-me`, `grill-with-docs`, `grilling`, `to-questionnaire`, `ask-matt`, `wait-what`,
  `wizard`, `chief-of-staff`, `loop-me`, `wayfinder`, `teach`, `retro`, `handoff`,
  `claude-handoff` — **Reason:** these are interactive interview/loop/handoff *commands*
  whose value is the back-and-forth with a human. The brief already supplies the
  requirements; re-interviewing the user would stall delivery.
- `jupyter-notebook` — **Reason:** the analysis is in TypeScript and Python scripts inside
  the project, not notebooks.
- `migrate-to-rust`, `migrate-to-shoehorn` — **Reason:** the stack is fixed as TypeScript
  and is not being migrated.
- `implement`, `pr`, `to-tickets`, `handoff`, `claude-handoff`, `setup-matt-pocock-skills`,
  `writing-for-agents`, `writing-fragments` — **Reason:** each is a command whose output
  is a ticket, a pull request, a handoff note or a machine-facing document. The brief's
  deliverables are the site and the six Markdown documents, none of which is one of
  these, and creating a ticket tracker for a single-session build would be ceremony.

### 5.9 `testing-quality-security` — 6 excluded (of 14)
- `security-best-practices`, `security-threat-model`, `security-ownership-map` —
  **Reason:** this is a static marketing site with no auth, no database, no user data and
  no third-party scripts. The one security-relevant surface is the contact form, which
  sends nothing anywhere; its honest behaviour is covered by the brief's own rule and by
  the browser check.
- `gh-address-comments`, `gh-fix-ci` — **Reason:** operate on GitHub pull-request review
  threads and CI runs. This phase opens no pull request and the repository has no CI
  workflow to fix.
- `triage` — **Reason:** a bug-triage workflow for an issue tracker; the site has one
  defect class (the transition/view layer) handled directly.

### 5.10 `general-workflow` — 4 excluded (of 6)
- `web-artifacts-builder` — **Reason:** builds a single-file React + Tailwind + shadcn
  artifact for a chat canvas. The deliverable is a multi-route site in an existing Vite
  repository with its own design system; the skill's "bundle to a single HTML file" output
  shape is the opposite of what the brief asks for.
- `hatch-pet`, `yeet`, `discernment-nudge` — **Reason:** unrelated to this deliverable
  (a desktop pet, a task-handoff helper, a nudge prompt).
Two more general-workflow skills were read and are recorded in §5.11.

### 5.11 Consulted, read, and **deliberately not applied** (8 skills)

These are counted as **selected** (§3), not excluded — they were read, and each one was
then set aside for a stated reason. They are listed separately so the accounting in §1
stays disjoint.

| Skill | Why it was not applied |
| --- | --- |
| `ui-ux-design/design-taste-frontend` | Its *method* was applied in full (measure, fix, re-measure; the five laws of the craft; the motion budget) and its inspector is now an acceptance gate. Two of its **rules** were not applied: *"no custom cursor"* (the brief requires a two-part cursor) and *"no smooth-scroll library by default"* (the brief requires immersive scrolling). Both conflicts are recorded in §6 with their mitigations. |
| `3d-motion-creative/motion-framer` | React-only library; the site is vanilla TypeScript. Its *variant* model was adopted for the transition registry (§3.36). |
| `3d-motion-creative/pixijs-2d` | A second WebGL context competing with the Three.js stage for the same GPU budget. Its *particle-container* pattern was adopted (§3.36). |
| `3d-motion-creative/rive-interactive` | Needs `.riv` files authored in the Rive editor, which cannot be regenerated reproducibly in this repository. Its *state-machine* model was adopted for the cursor and the navigation (§3.36). |
| `3d-motion-creative/lottie-animations` | Needs `.json` exported from After Effects, which cannot be regenerated reproducibly in this repository, and a Lottie file could not participate in a route transition anyway. The brand mark is an inline SVG on the shared timeline instead (§3.36). |
| `3d-motion-creative/spline-interactive` | Needs a `.spline` scene exported from a hosted editor. The stage is authored in code so it can be regenerated and parameterised per chapter. |
| `testing-quality-security/playwright` | Read in full and its patterns were applied, but **its browser cannot be installed in this sandbox** ("Download failure, code=1", missing Linux dependencies). The browser check drives `@sparticuz/chromium` through `puppeteer-core` instead — the same CDP protocol, a different browser binary. Recorded in §3.22. |
| `general-workflow/screenshot` | Read in full in the previous phase and *applied* — it is the reason the browser check falls back through several capture strategies and verifies pixels rather than trusting a screenshot file. It is listed here only because it is a read skill that is not part of this phase's design work. |

---

## 6. Honest limitations of this study

- **Two selected skills were read in a named line range, and both gaps are named above**:
  `gsap-scrolltrigger` (206 of 766 lines unread — the easing/utility reference tail) and
  `locotive-scroll` (201 of 481 lines unread — the file-navigation section and the tail).
  `imagegen` was read in three named ranges. The unread parts are reference material and
  body prose, not behavioural rules.
- **Twenty-five selected skills were read as an outline** — front matter plus every section
  heading, body not read line by line. They are grouped in §3.36 and each one is credited
  with the specific rule it contributed. Where a skill's body might have changed a
  decision, it was re-opened and promoted to §3.1–3.35.
- **`design-taste-frontend` is a general "tasteskill" written for marketing pages.** Two of
  its recommendations conflict with this brief, and the brief wins — with the conflict
  recorded rather than silently dropped:
  - *"no custom cursor"* — the brief **requires** a two-part cursor. Mitigated by
    disabling it on touch pointers, on pointer failure, and under `prefers-reduced-motion`.
  - *"no smooth-scroll library by default"* — the brief requires immersive scrolling.
    Mitigated by using Lenis over native scroll (adds inertia, keeps the native scroll
    container) rather than a transform-based scroller.
  - Its *"few-pictures"* rule assumes a subject with a photographable world. DENVUP is a
    digital studio with no photography of its own and no permission to use stock people —
    so the requirement is met by **original generated artwork** under one art direction,
    which the brief explicitly allows, not by borrowing images.
- The inspector baseline (**14 FAIL, 8 WARN**) is a *measurement of the current build*,
  not a claim that the restructured build already passes. The post-restructure run is
  reported separately in `TESTING_REPORT.md`.
- **One skill was read but deliberately not applied**: `ui-ux-design/brand-guidelines` is
  Anthropic's own brand system. Applying it would have overwritten DENVUP's palette.

---

## 7. Verification of this inventory

The inventory was checked mechanically against the live tree rather than by eye.

```
$ find AI_Skills_Pack/skills -name SKILL.md | wc -l
303
```

- Every one of the **303** names printed in §2 was extracted back out of this document and
  diffed against the live directory: **0 missing, 0 invented**. (The only extra tokens the
  extractor picks up are the ten category names themselves.)
- The selected/excluded split in §1 and §5 is exhaustive and disjoint:
  **51 + 252 = 303**, with the per-category counts summing to the same total.
- `AI_Skills_Pack/` was opened **read-only** throughout. `git status` at the end of this
  phase is reported in `IMPLEMENTATION_NOTES.md` and shows the protected tree unchanged.

### 7.1 The check is a script, not a claim

`scripts/check-study-list.py` re-derives every number in §1 from the live pack and
from this document, and fails when the two disagree. It checks that the §2
inventory is exactly the live directory (no skill missing, none invented), that
every path in the §3.0 index exists on disk, that no skill is both selected and
excluded, that for every category `selected + excluded == the number of skills
in it`, and that the totals in §1 are the totals the document actually
contains.

```
$ npm run study-check
skills in the pack : 303
selected           : 51
  read complete    : 23
  read outline     : 25
  read partial     : 3
excluded           : 252
sum                : 303

problems: NONE
```
