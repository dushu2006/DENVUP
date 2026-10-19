/**
 * Site-level coverage and the honest block list.
 *
 * A row is only marked "Tested" when a named automated check exercises it.
 * "Blocked" rows must state the verified reason and the closest safe
 * alternative that actually ships.
 */

export type CoverageStatus = 'Tested' | 'Implemented' | 'Requires revision' | 'Blocked' | 'Planned';

export interface SiteCoverage {
  ids: number[];
  area: string;
  file: string;
  status: CoverageStatus;
  test: string;
  note?: string;
}

export const siteCoverage: SiteCoverage[] = [
  {
    ids: [1, 2, 3],
    area: 'Intro progress that reports real work, not a timer',
    file: 'src/client/intro.ts · src/client/scene.ts',
    status: 'Implemented',
    test: 'src/tests/boot.test.ts mounts the client with a stubbed document.fonts; the intro never gates content and can be skipped.',
    note: 'The count is driven by font readiness, the first stage frame and the document load event. A hard 4 s ceiling releases the page even if an asset never resolves.',
  },
  {
    ids: [6, 7, 8],
    area: 'The opening: the supplied mark arrives, then the wordmark assembles',
    file: 'src/client/intro.ts · src/styles/intro.css',
    status: 'Implemented',
    test: 'Source review plus boot smoke test; the mark is the supplied artwork, never redrawn.',
    note: 'First visit only, skippable, and reduced motion shows the assembled mark at once.',
  },
  {
    ids: [460],
    area: 'Every interactive surface has a no-motion, no-script path',
    file: 'src/styles/responsive.css · src/main.ts · src/client/caps.ts',
    status: 'Implemented',
    test: 'Reduced-motion CSS path reviewed by hand; JS boot test runs with matchMedia stubbed.',
  },
  {
    ids: [9],
    area: 'Hero content entrance',
    file: 'src/client/motion.ts',
    status: 'Implemented',
    test: 'Boot smoke test (src/tests) mounts the page client without errors; visual check pending a browser.',
  },
  {
    ids: [10, 11, 12, 14, 20],
    area: 'The opening: box rise, scale, clip-path, colour field and reduced-motion fallback',
    file: 'src/render/sections.ts · src/client/motion.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Reduced-motion branch reviewed in source; automated boot test; no visual browser available in this environment.',
    note: 'The signature opening is the page-level version of these techniques.',
  },
  {
    ids: [16, 18],
    area: 'First-visit behaviour and font readiness',
    file: 'src/main.ts · src/styles/base.css',
    status: 'Implemented',
    test: 'No storage or timers that block content; fonts use font-display: swap.',
    note: 'The opening is skippable and does not gate content on storage.',
  },
  {
    ids: [19],
    area: 'Loading feedback for the single-page journey',
    file: 'src/client/motion.ts · scripts/prerender.ts',
    status: 'Implemented',
    test: 'Loader reports real phases; skip control tested in the boot smoke test.',
  },
  {
    ids: [51, 52, 53, 97],
    area: 'Header links, underlines and the section nav',
    file: 'src/styles/chrome.css · src/client/navigation.ts',
    status: 'Implemented',
    test: 'Focus styles and aria-current wiring reviewed; navigation boot test.',
  },
  {
    ids: [92, 96, 102, 108],
    area: 'Manifesto typography and kinetic headings',
    file: 'src/client/motion.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Reduced-motion path keeps every word visible.',
  },
  {
    ids: [121, 139, 146, 150, 151, 152, 154, 164, 170, 172],
    area: 'Header states, progress bar, command palette and back-to-top',
    file: 'src/client/navigation.ts · src/client/motion.ts',
    status: 'Implemented',
    test: 'Boot smoke test; keyboard paths documented in the shortcuts dialog.',
  },
  {
    ids: [155, 156, 157, 159, 160, 417],
    area: 'Full-screen menu and its close state',
    file: 'src/render/page.ts · src/client/navigation.ts',
    status: 'Implemented',
    test: 'Dialog markup validated with html-validate; focus handling reviewed by hand.',
  },
  {
    ids: [178, 185],
    area: 'Services and concept grids',
    file: 'src/render/sections.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Class inventory and rendered-HTML checks.',
  },
  {
    ids: [301, 302, 324],
    area: 'Capability demos and service signatures',
    file: 'src/render/sections.ts · src/client/embeds.ts',
    status: 'Implemented',
    test: 'Each capability mounts a real lab mode; mount/teardown covered by the lab smoke test.',
  },
  {
    ids: [323, 359, 360],
    area: 'Scope estimator on the pricing section',
    file: 'src/render/sections.ts · src/client/forms.ts',
    status: 'Tested',
    test: 'src/tests/forms.test.ts — selecting an option changes the computed total and the enquiry summary.',
  },
  {
    ids: [328, 334, 340],
    area: 'Process timeline and chapter colour changes',
    file: 'src/client/motion.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Horizontal rail has a reduced-motion vertical fallback; boot smoke test.',
  },
  {
    ids: [361, 362, 363, 364],
    area: 'FAQ accordion, icon and search',
    file: 'src/client/forms.ts · src/render/sections.ts',
    status: 'Tested',
    test: 'src/tests/forms.test.ts — search hides non-matching questions and restores them when cleared.',
  },
  {
    ids: [365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 380],
    area: 'Enquiry form, validation, honest no-endpoint state, contact routes',
    file: 'src/render/forms.ts · src/client/forms.ts',
    status: 'Tested',
    test: 'src/tests/forms.test.ts — empty submit shows errors; valid submit with no endpoint states that nothing was sent; WhatsApp text is encoded.',
    note: 'The form never claims success without a real endpoint.',
  },
  {
    ids: [407, 438, 440],
    area: 'Shortcut guide, dialogs and pause/skip controls',
    file: 'src/render/forms.ts · src/client/navigation.ts',
    status: 'Implemented',
    test: 'Dialog ids and aria references validated; keyboard handling reviewed by hand.',
  },
  {
    ids: [414, 415, 417, 418, 419, 420, 421, 422, 423, 425],
    area: 'Responsive type, menus, safe areas and touch alternatives',
    file: 'src/styles/responsive.css · src/labs/responsive.ts',
    status: 'Implemented',
    test: 'CSS media queries reviewed; responsive lab mounts in the lab smoke test.',
    note: 'Viewport testing in a real browser remains outstanding and is disclosed in TESTING_REPORT.md.',
  },
  {
    ids: [426, 427, 431, 434, 436, 437],
    area: 'Reduced motion, focus visibility, contrast and no scroll-jacking',
    file: 'src/styles/base.css · src/main.ts · src/client/motion.ts',
    status: 'Implemented',
    test: 'Reduced-motion CSS and JS branches present; contrast tokens hand-checked in the access lab.',
  },
  {
    ids: [430, 432, 433, 439],
    area: 'Keyboard tabs, live status, text alternatives and media captions',
    file: 'src/labs/navigation.ts · src/client/forms.ts · src/render/sections.ts',
    status: 'Implemented',
    test: 'ARIA wiring validated; lab tab pattern mounts in the lab smoke test.',
  },
  {
    ids: [441, 442, 443, 445, 446, 447, 448, 449, 451, 452, 453, 455, 456, 457],
    area: 'Transform-only motion, observers, RAF cleanup, lazy media, fallbacks, restraint',
    file: 'src/client/*.ts · src/labs/*.ts',
    status: 'Implemented',
    test: 'Lab smoke test mounts and destroys every mode, and asserts no console errors during teardown.',
    note: 'Cleanup is exercised for every demo by the teardown pass.',
  },
  {
    ids: [480],
    area: 'The signature opening sequence as one coherent interaction',
    file: 'src/client/motion.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Manual source review; browser verification unavailable in this environment.',
  },
  {
    ids: [328, 334, 335, 340],
    area: 'Process timeline, pinned narrative and chapter relays',
    file: 'src/client/motion.ts · src/render/sections.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Source review of the pin and rail maths; reduced-motion branch checked. No browser available.',
    note: 'The process line and the chapter relays are the page-level versions of these techniques.',
  },
  {
    ids: [361, 364],
    area: 'FAQ accordion and search',
    file: 'src/render/sections.ts · src/client/forms.ts',
    status: 'Tested',
    test: 'src/tests/forms.test.ts — FAQ filter shows only matches and Clear restores every item.',
  },
  {
    ids: [362, 363],
    area: 'FAQ icon state and one-open-at-a-time behaviour',
    file: 'src/render/sections.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Native <details>; no custom keyboard handling is needed.',
  },
  {
    ids: [369, 432],
    area: 'Enquiry validation, error summary and live status',
    file: 'src/client/forms.ts · src/render/forms.ts',
    status: 'Tested',
    test: 'src/tests/forms.test.ts — missing fields set aria-invalid and the live status says nothing was sent.',
  },
  {
    ids: [373, 374],
    area: 'Copy-to-clipboard contact details and prefilled WhatsApp',
    file: 'src/client/forms.ts · src/content/site.ts · src/render/forms.ts',
    status: 'Tested',
    test: 'src/tests/render.test.ts — mailto, tel and wa.me hrefs are correctly encoded.',
  },
  {
    ids: [417, 420, 421, 422, 426, 427, 431, 433, 436, 437, 438, 440],
    area: 'Responsive and accessible behaviour of the page itself',
    file: 'src/styles/responsive.css · src/client/navigation.ts · src/client/motion.ts',
    status: 'Implemented',
    test: 'Source review plus the jsdom boot test. Real device testing is outstanding (no browser here).',
    note: 'Native scrolling, visible focus, safe-area padding, a full-screen mobile menu and reduced-motion overrides ship in the page shell.',
  },
  {
    ids: [441, 443, 445, 446, 452, 453, 456, 460],
    area: 'Engineering rules in the shipped client',
    file: 'src/client/{motion,labs,embeds}.ts · src/styles/base.css · package.json',
    status: 'Implemented',
    test: 'Lab mount/cleanup test plus source review; no throttled-network test was possible here.',
  },
  {
    ids: [92, 102, 121, 139, 146, 150],
    area: 'Editorial typography, chapter colour and the opening',
    file: 'src/client/motion.ts · src/styles/sections.css',
    status: 'Implemented',
    test: 'Reduced-motion path keeps every word visible; verified by source review and the boot smoke test.',
  },
  {
    ids: [480],
    area: 'The signature opening and the capability stage as one system',
    file: 'src/client/motion.ts · src/client/caps.ts · src/client/labs.ts',
    status: 'Implemented',
    test: 'One coherent interaction across the opening and the stage; the tab tests cover mount, destroy and keyboard switching.',
  },
];

/** Techniques that cannot ship here. Each entry states why and what replaces it. */
export const blockedTechniques: Record<number, string> = {
  228:
    'A real Three.js object needs a licensed 3D model and a GPU test pass. No model is supplied and no browser is available to verify the result, so nothing is claimed. Closest safe alternative: the CSS 3D card in the 3D lab, which needs no model file.',
  229:
    'Scroll-controlled 3D rotation needs a real scene and a render budget that can only be verified in a browser. Closest safe alternative: the pointer/tilt depth scene in the 3D lab.',
  231:
    'Material changes on selection require a modelled object with multiple materials. None is supplied. Closest safe alternative: the flat material study (light, grain, foil) in the materials lab.',
  232:
    'A reflective metallic material needs a real 3D asset and environment lighting. Closest safe alternative: the CSS light-sweep and elevation plates.',
  233:
    'Translucent glass in 3D needs refraction rendering and a model. Closest safe alternative: the CSS glass panel with an opaque fallback.',
  234:
    'A liquid surface shader requires a vertex-grid mesh and a verified frame budget. Closest safe alternative: the 2D metaball plate (CSS-filtered canvas).',
  235:
    'Refraction/distortion needs a WebGL pass that cannot be visually verified in this environment. Closest safe alternative: the SVG feTurbulence distortion plate.',
  237:
    'Vertex displacement requires a mesh and a shader pipeline. Closest safe alternative: the layered depth scene and the terrain line plate.',
  240:
    'Orbiting 3D objects would need real geometry and a verifiable render loop. Closest safe alternative: the 2D-projected point globe, labelled as a projection.',
  246:
    'An interactive architectural environment needs a large model and a performance budget that cannot be validated here. Closest safe alternative: the SVG isometric plate.',
  247:
    'A 3D product viewer needs a product model and drag-rotation testing on a real device. Closest safe alternative: the SVG isometric plate and the CSS 3D card.',
  248:
    'An exploded-view animation needs a modelled assembly. Closest safe alternative: the flat SVG isometric drawing.',
  249:
    'Progressive 3D detail loading needs real model LODs. Closest safe alternative: the reserved-ratio lazy media demo.',
  341:
    'Portrait reveals require real portraits of named people. None were supplied, and generating faces for real team members would fabricate identity. Closest safe alternative: the monogram nameplates, with no portrait claimed.',
  342:
    'Portrait zoom/parallax has the same portrait problem. Closest safe alternative: the monogram nameplates and the general depth-scene demo.',
  343:
    'Portrait duotone-to-colour needs a portrait. Closest safe alternative: the before/after artwork comparison, clearly labelled as generated artwork.',
  344:
    'Portrait card tilt needs a portrait. Closest safe alternative: the tilt card demo using generated artwork.',
  345:
    'Type reacting to a portrait hover needs a portrait. Closest safe alternative: the nameplate typography, which reacts to focus instead.',
  346:
    'An expandable biography would require inventing roles and histories for the four real people. None were supplied, so the profile states only the supplied names. Closest safe alternative: the honest profile dialog.',
  349:
    'A role/skill map needs confirmed roles and skills. Only names were supplied. Closest safe alternative: the four names presented without invented titles.',
  353:
    'A studio floorplan would be a fabricated depiction of a workspace nobody has seen. Closest safe alternative: an abstract studio principles panel.',
  354:
    'A team slider is possible but the brief forbids invented profile content to fill it. Closest safe alternative: the four supplied names in a static, keyboard-readable list.',
  381:
    'A muted background video needs an actual video file and a poster. No footage is supplied and generating fictional client footage would misrepresent the studio. Closest safe alternative: the generated canvas motion poster.',
  382:
    'Masking a video requires video footage. Closest safe alternative: the image wipe reveal using generated artwork.',
  383:
    'Scroll-scrubbed video needs an encoded video with keyframe control. No file is supplied. Closest safe alternative: the canvas-scrubbed line plate.',
  384:
    'Hover-to-preview video needs video files. Closest safe alternative: the before/after artwork comparison.',
  385:
    'Custom video controls have nothing real to control here. Closest safe alternative: the pause/resume controls on the canvas poster and particle fields.',
  386:
    'Video chapters need a chaptered video. No video is supplied. Closest safe alternative: the command palette and the header navigation.',
  390:
    'Audio-reactive particles need a user-supplied audio source; generating music is out of scope and embedding a track would add a licence. Closest safe alternative: the opt-in test-tone waveform, which is real Web Audio.',
  391:
    'A narrated product tour would require a voice recording presented as the studio’s own. No recording was supplied. Closest safe alternative: the written walkthrough and captioned demo cards.',
  393:
    'Captions and transcripts need spoken media to caption. There is none. Closest safe alternative: every visual demo carries a written description and text alternative.',
  461:
    'A WebGL displacement transition needs a verified shader pass and two matched images. Only one generated image exists. Closest safe alternative: the SVG mask/clip transition.',
  462:
    'Shader-driven image reveal cannot be verified without a browser/GPU pass. Closest safe alternative: the clip-path image reveal, which has a static state.',
  463:
    'A fluid simulation needs a GPU pipeline and a frame-budget test. Closest safe alternative: the CSS-filtered metaball plate (no simulation claimed).',
  467:
    'A generative 3D sculpture needs a real geometry pipeline and visual review. Closest safe alternative: the SVG isometric plate.',
  468:
    'GPU particle morphing needs a mesh target and verified instancing. Closest safe alternative: the 2D canvas flow field.',
  469:
    'A GPU-instanced object field cannot be verified here. Closest safe alternative: the capped 2D particle field.',
  471:
    'A point-cloud portrait needs a portrait and a depth map, which are not supplied. Closest safe alternative: the projected point globe.',
  472:
    'Camera-based interaction requires explicit permission, a real camera and a privacy review. Shipping it without those would be irresponsible. Closest safe alternative: pointer and keyboard controls for every interactive plate.',
  473:
    'Motion-input interaction needs device sensors and a tested alternative. Closest safe alternative: visible buttons and keyboard controls on every demo.',
  474:
    'An audio-driven shader needs both a shader and user audio. Closest safe alternative: the opt-in waveform visualiser.',
  475:
    'Real-time data-driven generative art needs a live data source and a licence to use it. Closest safe alternative: deterministic generated plates from a seeded generator.',
  476:
    'A 3D scene with hotspots needs a model and a spatial layout that can be verified. Closest safe alternative: the 2D hotspot diagram in the story lab.',
  477:
    'A spatial interface needs 3D navigation and a conventional fallback tested on devices. Closest safe alternative: the standard header navigation and the command palette.',
  479:
    'A scroll-progress shader transition needs a shader pass tied to scroll and a GPU test. Closest safe alternative: the chapter colour changes driven by section data.',
};
