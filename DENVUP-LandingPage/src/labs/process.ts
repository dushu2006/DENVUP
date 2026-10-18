import type { Lab } from './types';

export const processLab: Lab = {
  slug: 'process',
  title: 'Process & narrative',
  blurb:
    'How a project moves from a conversation to a launch. These demos explain sequence; none of them pretends the work is linear.',
  modes: [
    {
      ids: [326, 327],
      name: 'A line that connects',
      summary: 'The stages share one line, drawn once. The line is SVG and the stages are a list, so the relationship survives without the drawing.',
      html: `<div class="d-proc"><svg class="d-proc__line" viewBox="0 0 600 8" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="4" x2="600" y2="4" pathLength="1"/></svg><ol class="d-proc__steps">${[
        ['Discovery', 'What the site must do.'],
        ['Structure', 'What goes where, and why.'],
        ['Build', 'The real thing in a browser.'],
        ['Launch', 'Handover, notes, next steps.'],
      ].map(([t, c], i) => `<li class="${i === 0 ? 'is-on' : ''}" data-proc-step="${i}"><b>${t}</b><span>${c}</span></li>`).join('')}</ol><p class="d-cap" data-proc-note aria-live="polite">Stage 1: Discovery</p></div>`,
      init: ({ stage }) => {
        const steps = [...stage.querySelectorAll<HTMLElement>('[data-proc-step]')];
        const note = stage.querySelector<HTMLElement>('[data-proc-note]')!;
        steps.forEach((step, i) => {
          step.addEventListener('click', () => {
            steps.forEach((s, j) => s.classList.toggle('is-on', i === j));
            note.textContent = `Stage ${i + 1}: ${step.querySelector('b')?.textContent}`;
          });
        });
        stage.querySelector<SVGLineElement>('.d-proc__line line')?.classList.add('is-on');
      },
      notes: { keyboard: 'Each stage is a list item with a click target and a text summary.' },
    },
    {
      ids: [328, 330],
      name: 'The active stage',
      summary: 'A scroll panel keeps one stage highlighted as it passes. The stage names are also listed above, so the panel is an illustration of the sequence, not its only source.',
      html: '',
      init: (ctx) => {
        const box = document.createElement('div');
        box.className = 'd-scrollbox d-scrollbox--proc';
        box.tabIndex = 0;
        box.setAttribute('role', 'region');
        box.setAttribute('aria-label', 'Process stages');
        box.innerHTML = `<div class="d-stageflow"><div class="d-stageflow__sticky"><p class="d-cap">Now reading</p><p class="d-h" data-now>Discovery</p></div><div class="d-stageflow__steps">${[
          ['Discovery', 'A conversation, a written brief and a decision about fit.'],
          ['Structure', 'Page order and content before visual direction.'],
          ['Build', 'Design and code together, reviewed in the browser.'],
          ['Launch', 'Checks, handover and a walkthrough.'],
        ].map(([t, c]) => `<section data-now-step data-name="${t}"><h4>${t}</h4><p>${c}</p></section>`).join('')}</div></div><div class="d-spacer"></div>`;
        ctx.stage.append(box);
        const now = box.querySelector<HTMLElement>('[data-now]')!;
        const steps = [...box.querySelectorAll<HTMLElement>('[data-now-step]')];
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              now.textContent = (entry.target as HTMLElement).dataset.name ?? '';
              steps.forEach((s) => s.classList.toggle('is-on', s === entry.target));
            });
          },
          { root: box, threshold: 0.6 },
        );
        steps.forEach((step) => io.observe(step));
        return () => io.disconnect();
      },
      notes: { keyboard: 'The panel scrolls natively; the sticky label is text.', motion: 'The label changes without fades.' },
    },
    {
      ids: [333, 332],
      name: 'Idea to artefact',
      summary: 'A sketch, a wireframe and a built page share one frame. The button moves between them; the descriptions stay visible.',
      html: `<div class="d-artefact" data-artefact><div class="d-artefact__stage"><div class="d-artefact__layer is-on" data-art="0"><span class="d-scribble" aria-hidden="true"></span><b>The sketch</b></div><div class="d-artefact__layer" data-art="1"><span class="d-wire" aria-hidden="true"></span><b>The structure</b></div><div class="d-artefact__layer" data-art="2"><span class="d-built" aria-hidden="true"></span><b>The build</b></div></div><div class="d-row">${['Sketch', 'Structure', 'Build'].map((t, i) => `<button type="button" class="d-chip${i === 0 ? ' is-active' : ''}" data-art-btn="${i}">${t}</button>`).join('')}</div><p class="d-cap" data-art-note aria-live="polite">Sketch: the idea, before it has to be precise.</p></div>`,
      init: ({ stage }) => {
        const layers = [...stage.querySelectorAll<HTMLElement>('[data-art]')];
        const note = stage.querySelector<HTMLElement>('[data-art-note]')!;
        const copy = ['Sketch: the idea, before it has to be precise.', 'Structure: the same idea with its hierarchy decided.', 'Build: the same structure in the browser, with real type and real constraints.'];
        stage.querySelectorAll<HTMLButtonElement>('[data-art-btn]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const i = Number(btn.dataset.artBtn);
            layers.forEach((layer, j) => layer.classList.toggle('is-on', i === j));
            stage.querySelectorAll('[data-art-btn]').forEach((b) => b.classList.toggle('is-active', b === btn));
            note.textContent = copy[i] ?? '';
          });
        });
      },
      notes: { keyboard: 'Buttons select the state; the description changes with it.', motion: 'The layers switch instantly.' },
    },
  ],
};
