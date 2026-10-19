import type { Lab } from './types';

export const graphicsLab: Lab = {
  slug: 'graphics',
  title: 'SVG & 2D graphics',
  blurb:
    'Vectors stay sharp, weigh little and can be read by the DOM. These plates are hand-built SVG — no stock icons, no traced artwork — and each one has a static state.',
  modes: [
    {
      ids: [206, 210],
      name: 'Draw the line',
      summary: 'Stroke-dashoffset turns a path into a drawing. It runs on entry, replays on demand, and is decorative: the caption carries the meaning.',
      html: `<div class="d-svgplate" data-drawplate><svg viewBox="0 0 420 200" role="img" aria-label="A continuous line drawing of a low horizon"><path class="d-drawpath" d="M20 160 C80 40 150 170 210 90 S320 30 400 120" pathLength="1"/></svg><div class="d-row"><button type="button" class="d-chip" data-draw-run>Draw again</button><span class="d-cap">One path, no bitmap</span></div></div>`,
      init: ({ stage }) => {
        const path = stage.querySelector<SVGPathElement>('.d-drawpath')!;
        const run = () => {
          path.classList.remove('is-on');
          void path.getBoundingClientRect();
          path.classList.add('is-on');
        };
        stage.querySelector('[data-draw-run]')!.addEventListener('click', run);
        run();
      },
      notes: { motion: 'The line is drawn complete on load under reduced motion.', keyboard: 'The replay control is a button.' },
    },
    {
      ids: [208, 215],
      name: 'Contours and one line',
      summary: 'Nine ellipses and a single stroke describe a form. Both are aria-hidden; the caption describes the drawing.',
      html: `<div class="d-svgplate"><svg viewBox="0 0 420 240" aria-hidden="true"><g class="d-contours">${Array.from({ length: 9 }, (_, i) => `<ellipse cx="210" cy="${120 + i}" rx="${40 + i * 17}" ry="${18 + i * 9}"/>`).join('')}</g><path class="d-lineart__path" d="M20 200 C100 60 160 190 220 110 S340 30 400 140" pathLength="1"/></svg><p class="d-cap">Nine contours, one line, no illustration file</p></div>`,
      notes: { motion: 'Static drawing; the contours do not pulse.' },
    },
    {
      ids: [211, 212, 213],
      name: 'Gradient, mask, filter',
      summary: 'A gradient fills a circle, a mask wipes a band, and a turbulence filter roughens one edge. Each is a separate SVG feature in the same plate.',
      html: `<div class="d-svgplate"><svg viewBox="0 0 420 240" role="img" aria-label="Three shapes demonstrating gradient, mask and filter"><defs><linearGradient id="dGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4a00"/><stop offset="1" stop-color="#ffc24b"/></linearGradient><mask id="dMask"><rect width="420" height="240" fill="black"/><circle cx="210" cy="120" r="66" fill="white"/></mask><filter id="dRough"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="10"/></filter></defs><rect x="10" y="20" width="120" height="200" fill="url(#dGrad)"/><circle cx="210" cy="120" r="92" fill="#0b0a09" mask="url(#dMask)"/><rect x="300" y="20" width="110" height="200" fill="none" stroke="#ff4a00" stroke-width="2" filter="url(#dRough)"/></svg><p class="d-cap">Gradient · mask · feTurbulence</p></div>`,
      notes: { motion: 'No animation; the filters are static.' },
    },
    {
      ids: [198],
      name: 'Clip reveal',
      summary: 'A clip-path circle opens over the artwork. The same artwork sits beneath, so the reveal cannot lose content if it fails.',
      html: `<div class="d-clipdemo" data-clipdemo><div class="d-clipdemo__under"><img src="/assets/media/den-glow.webp" alt="Generated glow artwork" width="800" height="600"></div><div class="d-clipdemo__over" data-clipover><img src="/assets/media/den-glow.webp" alt="" width="800" height="600"></div><button type="button" class="d-chip" data-clip-toggle aria-pressed="true">Open</button></div>`,
      init: ({ stage }) => {
        const over = stage.querySelector<HTMLElement>('[data-clipover]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-clip-toggle]')!;
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!open));
          btn.textContent = open ? 'Closed' : 'Open';
          over.classList.toggle('is-closed', open);
        });
      },
      notes: { keyboard: 'The toggle reports state; the image beneath is always visible.', motion: 'The clip switches without transition.' },
    },
    {
      ids: [216],
      name: 'Pattern from a rule',
      summary: 'A repeating pattern is generated from one tile definition, so the whole field weighs less than a single photograph.',
      html: `<div class="d-svgplate"><svg viewBox="0 0 420 240" role="img" aria-label="A generated geometric pattern"><defs><pattern id="dPat" width="42" height="42" patternUnits="userSpaceOnUse"><rect width="42" height="42" fill="#f1ede7"/><path d="M0 42 42 0M-10 10 10 -10M32 52 52 32" stroke="#0b0a09" stroke-width="1.2"/><circle cx="21" cy="21" r="3" fill="#ff4a00"/></pattern></defs><rect width="420" height="240" fill="url(#dPat)"/></svg><p class="d-cap">One 42 px tile, defined once</p></div>`,
      notes: { motion: 'Static.' },
    },
    {
      ids: [315],
      name: 'A chart that is also a table',
      summary: 'The bars are SVG; the same numbers are in a real table for assistive technology. The chart is not the only way to get the data.',
      html: `<div class="d-chartdemo"><svg viewBox="0 0 420 200" role="img" aria-label="Bar chart of five technique groups"><g class="d-chartbars">${[152, 96, 88, 74, 70].map((v, i) => `<rect x="${24 + i * 78}" y="${180 - v}" width="46" height="${v}" data-bar="${v}"/>`).join('')}</g><line x1="16" y1="180" x2="404" y2="180" class="d-chartaxis"/></svg><table class="d-charttable"><caption>Techniques implemented per group</caption><thead><tr><th scope="col">Group</th><th scope="col">Count</th></tr></thead><tbody>${[['Opening', 152], ['Pointer', 96], ['Type', 88], ['Scroll', 74], ['Motion', 70]].map(([g, v]) => `<tr><th scope="row">${g}</th><td>${v}</td></tr>`).join('')}</tbody></table></div>`,
      init: ({ stage }) => {
        const bars = [...stage.querySelectorAll<SVGRectElement>('[data-bar]')];
        bars.forEach((bar) => {
          bar.setAttribute('tabindex', '0');
          bar.setAttribute('role', 'img');
          bar.setAttribute('aria-label', `${bar.dataset.bar} techniques`);
        });
      },
      notes: { keyboard: 'Bars are focusable and labelled; the table holds the same figures.' },
    },
    {
      ids: [224],
      name: 'An icon with three states',
      summary: 'One path becomes an arrow, a check and a close by moving three points. It is a single SVG, not three images swapping.',
      html: `<div class="d-svgplate d-iconstates"><svg viewBox="0 0 120 120" role="img" aria-label="An arrow that becomes a check and a close"><path data-iconpath d="M28 60h56M64 40l20 20-20 20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="d-row"><button type="button" class="d-chip" data-icon-next aria-pressed="false">Next state</button><span class="d-cap" data-icon-note>Arrow</span></div></div>`,
      init: ({ stage, reduced }) => {
        const path = stage.querySelector<SVGPathElement>('[data-iconpath]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-icon-next]')!;
        const note = stage.querySelector<HTMLElement>('[data-icon-note]')!;
        const states = [
          ['M28 60h56M64 40l20 20-20 20', 'Arrow'],
          ['M32 62l18 18 36-40', 'Check'],
          ['M38 38l44 44M82 38 38 82', 'Close'],
        ];
        let i = 0;
        btn.addEventListener('click', () => {
          i = (i + 1) % states.length;
          const [d, label] = states[i]!;
          path.setAttribute('d', d);
          note.textContent = label;
          btn.setAttribute('aria-pressed', String(i % 2 === 0));
          if (!reduced) path.animate?.([{ opacity: 0.4 }, { opacity: 1 }], { duration: 220 });
        });
      },
      notes: { keyboard: 'The state name is written next to the graphic.' },
    },
    {
      ids: [227],
      name: 'An SVG in three dimensions',
      summary: 'An isometric plate drawn in flat SVG, with a pointer-driven tilt applied to the wrapper. The drawing itself never becomes 3D geometry.',
      html: `<div class="d-isometric" data-iso><svg viewBox="0 0 300 300" role="img" aria-label="Isometric blocks drawn in SVG"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M60 170l90-52 90 52-90 52z"/><path d="M60 170v40l90 52v-40M240 170v40l-90 52"/><path d="M150 118V38M150 38l60 34M150 38l-60 34"/></g></svg><p class="d-cap">Flat SVG, tilted wrapper</p></div>`,
      init: ({ stage, reduced, touch }) => {
        const el = stage.querySelector<HTMLElement>('[data-iso]')!;
        if (reduced || touch) return;
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
        });
        el.addEventListener('pointerleave', () => {
          el.style.transform = '';
        });
      },
      notes: { motion: 'No tilt; the plate is legible flat.', touch: 'Tap does not tilt; the caption still explains it.' },
    },
    {
      ids: [207, 209, 214, 217, 218, 219, 220, 221, 222, 223, 225],
      name: 'An SVG atlas',
      summary:
        'Eleven vector techniques in one plate: a path that morphs, shapes that assemble, blobs, a node diagram, arrows, orbit and rings, a reactive point grid and an icon set that changes with a tab.',
      html: `<div class="d-atlas" data-atlas>
        <div class="d-atlas__plate">
          <svg viewBox="0 0 200 120" role="img" aria-label="Interactive vector atlas">
            <g class="a-shapes" data-assemble>
              <circle cx="36" cy="34" r="11"/><rect x="60" y="22" width="22" height="22" rx="2"/>
              <path d="M108 18 L128 40 L108 40 Z"/><circle cx="160" cy="32" r="8"/>
            </g>
            <path class="a-morph" data-morph d="M20 86 C48 62, 66 104, 92 84 S136 62, 168 86" fill="none" stroke="currentColor" stroke-width="2"/>
            <g class="a-blobs" aria-hidden="true">
              <path d="M126 92 q10 -16 24 -6 t14 18 q-8 14 -24 10 t-14 -22" />
              <path d="M150 78 q14 -8 20 8 t-8 24 q-16 4 -18 -10 t6 -22" opacity=".45" />
            </g>
            <g class="a-nodes" data-nodes>
              <circle cx="24" cy="106" r="3"/><circle cx="64" cy="98" r="3"/><circle cx="96" cy="110" r="3"/>
              <path d="M24 106 L64 98 L96 110" fill="none" stroke="currentColor" stroke-width="1"/>
            </g>
            <g class="a-arrows" aria-hidden="true">
              <path d="M12 12 h22 m-6 -5 l6 5 l-6 5"/><path d="M12 20 h14 m-5 -4 l5 4 l-5 4"/>
            </g>
            <g class="a-orbit" aria-hidden="true"><circle cx="176" cy="100" r="12" fill="none" stroke="currentColor"/><circle cx="176" cy="100" r="3"/><circle class="a-sat" cx="188" cy="100" r="2"/></g>
            <g class="a-rings" aria-hidden="true"><circle cx="176" cy="66" r="8" fill="none" stroke="currentColor"/><circle cx="176" cy="66" r="13" fill="none" stroke="currentColor" opacity=".5"/><circle cx="176" cy="66" r="18" fill="none" stroke="currentColor" opacity=".25"/></g>
          </svg>
          <div class="d-atlas__dots" data-dots aria-hidden="true"></div>
        </div>
        <div class="d-atlas__bar">
          <div class="d-atlas__tabs" role="tablist" aria-label="Icon states">
            <button type="button" role="tab" aria-selected="true" data-atab="arc">Arc</button>
            <button type="button" role="tab" aria-selected="false" data-atab="orbit">Orbit</button>
            <button type="button" role="tab" aria-selected="false" data-atab="grid">Grid</button>
          </div>
          <button type="button" class="d-chip" data-arun>Replay</button>
          <p class="d-cap" data-anote>Eleven techniques, one live plate. Replay restarts the sequential ones.</p>
        </div>
      </div>`,
      init: ({ stage, reduced, announce, timeout, onCleanup }) => {
        const atlas = stage.querySelector<HTMLElement>('[data-atlas]')!;
        const note = atlas.querySelector<HTMLElement>('[data-anote]')!;
        const morph = atlas.querySelector<SVGPathElement>('[data-morph]')!;
        const dots = atlas.querySelector<HTMLElement>('[data-dots]')!;
        const tabs = [...atlas.querySelectorAll<HTMLButtonElement>('[data-atab]')];
        const shapes = [...atlas.querySelectorAll<SVGElement>('[data-assemble] > *')];

        for (let i = 0; i < 88; i += 1) {
          const dot = document.createElement('i');
          dot.style.setProperty('--i', String(i));
          dots.append(dot);
        }
        const points = [...dots.children] as HTMLElement[];

        let pointer = { x: 0.5, y: 0.5 };
        const move = (event: PointerEvent) => {
          const box = atlas.getBoundingClientRect();
          pointer = { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height };
          points.forEach((point, i) => {
            const col = i % 11;
            const row = Math.floor(i / 11);
            const dx = pointer.x - (col + 0.5) / 11;
            const dy = pointer.y - (row + 0.5) / 8;
            const force = Math.max(0, 0.2 - Math.hypot(dx, dy)) * 5;
            point.style.transform = `translate(${dx * force * 18}px, ${dy * force * 18}px)`;
            point.style.opacity = String(0.25 + Math.max(0, 0.22 - Math.hypot(dx, dy)) * 2.2);
          });
        };
        atlas.addEventListener('pointermove', move);

        const run = () => {
          atlas.classList.remove('is-run');
          shapes.forEach((shape) => shape.classList.remove('is-in'));
          if (reduced) {
            shapes.forEach((shape) => shape.classList.add('is-in'));
            morph.setAttribute('d', 'M20 86 C48 62, 66 104, 92 84 S136 62, 168 86');
            note.textContent = 'Reduced motion: every vector is shown in its final state, without the sequence.';
            return;
          }
          void atlas.offsetWidth;
          atlas.classList.add('is-run');
          shapes.forEach((shape) => shape.classList.add('is-in'));
          timeout(() => morph.setAttribute('d', 'M20 78 C50 100, 74 58, 100 88 S144 106, 168 74'), 700);
          timeout(() => morph.setAttribute('d', 'M20 86 C48 62, 66 104, 92 84 S136 62, 168 86'), 1900);
        };
        atlas.querySelector('[data-arun]')!.addEventListener('click', run);
        run();

        tabs.forEach((tab) => {
          tab.addEventListener('click', () => {
            tabs.forEach((other) => other.setAttribute('aria-selected', String(other === tab)));
            atlas.dataset.icon = tab.dataset.atab ?? 'arc';
            announce(`Icon state: ${tab.textContent}`);
          });
        });
        onCleanup(() => atlas.removeEventListener('pointermove', move));
      },
      notes: {
        keyboard: 'Tab reaches the tabs, Replay and the plate; arrow keys are not required because tabs are plain buttons.',
        touch: 'Drag across the plate to move the point grid; all vector sequences play on Replay.',
        motion: 'Shapes appear in place and the path stays in its first state; nothing animates.',
      },
    },
  ],
};
