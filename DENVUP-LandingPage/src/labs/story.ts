import type { Lab } from './types';

export const storyLab: Lab = {
  slug: 'story',
  title: 'Service & data stories',
  blurb:
    'A story is a reading order, not a scroll effect. These demos put the evidence in text first, then let the graphic agree with it.',
  modes: [
    {
      ids: [335, 336],
      name: 'Steps beside a sticky figure',
      summary: 'Each step updates the same figure while the heading stays in view. The panel scrolls natively, and every step is readable without the figure.',
      html: '',
      size: 'tall',
      init: (ctx) => {
        const box = document.createElement('div');
        box.className = 'd-scrolly';
        box.tabIndex = 0;
        box.setAttribute('role', 'region');
        box.setAttribute('aria-label', 'Scrollytelling demo');
        box.innerHTML = `<div class="d-scrolly__box"><div class="d-scrolly__figure"><span data-figure>01</span><p data-figure-copy>Discovery</p></div><div class="d-scrolly__steps">${[
          ['Discovery', 'We start with what the site must do, not how it should look.'],
          ['Structure', 'The page order is agreed before a single colour is chosen.'],
          ['Build', 'The build is reviewed in the browser, at real widths.'],
          ['Handover', 'Files, notes and a walkthrough that survives us.'],
        ].map(([title, copy], i) => `<section class="d-scrolly__step" data-step="${i}"><h4>${title}</h4><p>${copy}</p></section>`).join('')}</div></div>`;
        ctx.stage.append(box);
        const figure = box.querySelector<HTMLElement>('[data-figure]')!;
        const figureCopy = box.querySelector<HTMLElement>('[data-figure-copy]')!;
        const steps = [...box.querySelectorAll<HTMLElement>('[data-step]')];
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const i = steps.indexOf(entry.target as HTMLElement);
              figure.textContent = `0${i + 1}`;
              figureCopy.textContent = entry.target.querySelector('h4')?.textContent ?? '';
              steps.forEach((s) => s.classList.toggle('is-on', s === entry.target));
            });
          },
          { root: box, threshold: 0.7 },
        );
        steps.forEach((s) => io.observe(s));
        return () => io.disconnect();
      },
      notes: { keyboard: 'Arrow keys scroll the focused panel; the figure updates.', motion: 'The figure number changes without any fade.' },
    },
    {
      ids: [315, 316],
      name: 'A chart that explains itself',
      summary: 'Bars grow from zero once, on request. Values, labels and a summary sentence are all present in text; the chart is a second reading.',
      html: `<div class="d-barchart"><div class="d-barchart__bars">${[['Landing', 44], ['Business', 68], ['Custom', 92]].map(([label, v]) => `<div class="d-barchart__row"><span>${label}</span><i data-chart-bar="${v}"></i><b>${v}</b></div>`).join('')}</div><button type="button" class="d-chip" data-chart-run>Grow the bars</button><p class="d-cap">Illustrative shape of relative scope, not a measurement of past work.</p></div>`,
      init: ({ stage, reduced }) => {
        const bars = [...stage.querySelectorAll<HTMLElement>('[data-chart-bar]')];
        const run = () => {
          bars.forEach((bar) => {
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              bar.style.width = `${bar.dataset.chartBar}%`;
            });
          });
        };
        if (reduced) bars.forEach((bar) => (bar.style.width = `${bar.dataset.chartBar}%`));
        else run();
        stage.querySelector('[data-chart-run]')!.addEventListener('click', run);
      },
      notes: { motion: 'Bars are at their final width immediately.', keyboard: 'The growth can be repeated by a button.' },
    },
    {
      ids: [303, 304],
      name: 'A flow with a bright path',
      summary: 'A four-step flow highlights the step being described. The steps are ordinary list items; the connecting line is decorative.',
      html: `<div class="d-flow" data-flow><div class="d-flow__line" aria-hidden="true"></div>${['Brief', 'Structure', 'Build', 'Launch'].map((t, i) => `<button type="button" class="d-flow__node${i === 0 ? ' is-on' : ''}" data-flow-node="${i}">${t}</button>`).join('')}<p class="d-cap" data-flow-note aria-live="polite">Step 1: Brief</p></div>`,
      init: ({ stage }) => {
        const nodes = [...stage.querySelectorAll<HTMLButtonElement>('[data-flow-node]')];
        const note = stage.querySelector<HTMLElement>('[data-flow-note]')!;
        nodes.forEach((node, i) => {
          node.addEventListener('click', () => {
            nodes.forEach((n, j) => n.classList.toggle('is-on', j === i));
            note.textContent = `Step ${i + 1}: ${node.textContent}`;
          });
        });
      },
      notes: { keyboard: 'Each node is a button; the active step is written as text.' },
    },
    {
      ids: [308, 309],
      name: 'Hotspots on a drawing',
      summary: 'Three labelled points describe a page architecture. Each point is a button with a description that appears in a live region, not a tooltip.',
      html: `<div class="d-hotspots"><div class="d-hotspots__stage" aria-hidden="true"><span class="d-hotspots__block a"></span><span class="d-hotspots__block b"></span><span class="d-hotspots__block c"></span></div>${[['A', 'The first screen names the offer and the next step.'], ['B', 'The middle gives evidence, not adjectives.'], ['C', 'The close repeats one route to contact.']].map(([k, copy], i) => `<button type="button" class="d-hotspot" style="--x:${[24, 52, 76][i]}%;--y:${[36, 58, 34][i]}%" data-hotspot="${k}" aria-describedby="hs-${i}">${k}</button><span class="sr-only" id="hs-${i}">${copy}</span>`).join('')}<p class="d-cap" data-hotspot-note aria-live="polite">Choose a point</p></div>`,
      init: ({ stage }) => {
        const note = stage.querySelector<HTMLElement>('[data-hotspot-note]')!;
        stage.querySelectorAll<HTMLButtonElement>('[data-hotspot]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const copy = document.getElementById(`hs-${Number(btn.dataset.hotspot!.charCodeAt(0) - 65)}`);
            note.textContent = copy?.textContent ?? '';
          });
        });
      },
      notes: { keyboard: 'Hotspots are buttons with descriptions in the DOM, not hover tooltips.' },
    },
    {
      ids: [318],
      name: 'A number with a source',
      summary: 'The count-up is a decorative reading of a number that is always present as text, with the qualification beside it.',
      html: `<div class="d-sourcecount"><p class="d-display"><span data-source-num>480</span></p><p class="d-body">Techniques in the reference index. It is a library size, not a claim about completed client work.</p></div>`,
      notes: { motion: 'The number is static.', keyboard: 'Plain text.' },
    },
    {
      ids: [338, 339],
      name: 'A long read with a map',
      summary: 'The rail reports the reading position of the panel and marks the current section. It is a navigation aid, not a scroll-jacker.',
      html: '',
      init: (ctx) => {
        const box = document.createElement('div');
        box.className = 'd-scrollbox';
        box.tabIndex = 0;
        box.setAttribute('role', 'region');
        box.setAttribute('aria-label', 'Long read demo');
        box.innerHTML = `<div class="d-readmap"><div class="d-readmap__rail" aria-hidden="true"><i data-readbar></i></div><div class="d-readmap__body">${['The brief', 'The structure', 'The build', 'The handover'].map((t, i) => `<section><h4>${t}</h4><p>Section ${i + 1} of four. The rail at the left shows how much of the panel has been read.</p></section>`).join('')}</div></div><div class="d-spacer"></div>`;
        ctx.stage.append(box);
        const bar = box.querySelector<HTMLElement>('[data-readbar]')!;
        const update = () => {
          const max = box.scrollHeight - box.clientHeight;
          bar.style.transform = `scaleY(${max > 0 ? box.scrollTop / max : 0})`;
        };
        box.addEventListener('scroll', update, { passive: true });
        update();
      },
      notes: { keyboard: 'The panel is scrollable by keyboard; the rail is decorative.' },
    },
  ],
};
