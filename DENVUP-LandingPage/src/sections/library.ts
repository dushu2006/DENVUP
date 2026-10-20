/**
 * The technique library.
 *
 * Every one of the 480 catalogued techniques is listed here. Where a
 * technique has a working demonstration, the card opens a panel that mounts
 * the real demo, live, in place. Where the technique is implemented elsewhere
 * on the site, the card links to that chapter. Every reference id is
 * copyable, and the current view can be exported.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { announce } from '../core/dom';
import { gsap } from '../core/motion';
import { scrollTo } from '../core/scroll';
import { copyText } from '../core/clipboard';
import { confirm, writeInto } from '../core/feedback';
import { noteTechniqueOpened } from '../core/easter';
import { navSections } from '../data/site';
import { techniques, type Technique, type TechniqueStatus } from '../data/techniques';
import { allDemos, categoryLabels, demosByTechnique, searchDemos } from '../demos/registry';
import type { DemoContext } from '../demos/types';

interface LibraryState {
  query: string;
  status: TechniqueStatus | 'all';
  category: number | 'all';
  path: number[];
}

const STATUS_LABEL: Record<TechniqueStatus, string> = {
  Tested: 'Tested',
  Planned: 'Planned',
  'Requires revision': 'Needs revision',
  Blocked: 'Blocked',
};

function techniqueAnchor(id: number): string {
  return `DENVUP-T${String(id).padStart(3, '0')}`;
}

export function initLibrary(): () => void {
  const gridNode = $<HTMLElement>('[data-library-grid]');
  if (!gridNode) return () => {};
  const grid: HTMLElement = gridNode;
  const search = $<HTMLInputElement>('[data-library-search]');
  const filters = $<HTMLElement>('[data-library-filters]');
  const count = $<HTMLElement>('[data-library-count]');
  const empty = $<HTMLElement>('[data-library-empty]');
  const reset = $<HTMLButtonElement>('[data-library-reset]');
  const cleanups: (() => void)[] = [];
  const state: LibraryState = { query: '', status: 'all', category: 'all', path: [] };

  // ------------------------------------------------------------------ //
  // Filters
  // ------------------------------------------------------------------ //
  const statuses: (TechniqueStatus | 'all')[] = [
    'all',
    'Tested',
    'Requires revision',
    'Blocked',
  ];

  const filterButtons = new Map<string, HTMLButtonElement>();
  statuses.forEach((status) => {
    const button = el('button', 'library__filter');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(status === 'all'));
    const total =
      status === 'all'
        ? techniques.length
        : techniques.filter((technique) => technique.status === status).length;
    button.innerHTML = `<span>${status === 'all' ? 'All' : STATUS_LABEL[status]}</span><b>${total}</b>`;
    button.addEventListener('click', () => {
      state.status = status;
      filterButtons.forEach((other, key) =>
        other.setAttribute('aria-pressed', String(key === String(status))),
      );
      render();
    });
    filters?.appendChild(button);
    filterButtons.set(String(status), button);
  });

  const categorySelect = el('select', 'library__select');
  categorySelect.setAttribute('aria-label', 'Filter by encyclopedia category');
  const allOption = el('option');
  allOption.value = 'all';
  allOption.textContent = 'All categories';
  categorySelect.appendChild(allOption);
  techniques.forEach((technique, index) => {
    if (index && techniques[index - 1].catLabel === technique.catLabel) return;
    const option = el('option');
    option.value = String(technique.cat);
    option.textContent = `${technique.cat}. ${technique.catLabel}`;
    categorySelect.appendChild(option);
  });
  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value === 'all' ? 'all' : Number(categorySelect.value);
    render();
  });
  filters?.appendChild(categorySelect);

  // ------------------------------------------------------------------ //
  // Export
  // ------------------------------------------------------------------ //
  const exportButton = el('button', 'library__export');
  exportButton.type = 'button';
  exportButton.textContent = 'Export this view';
  filters?.appendChild(exportButton);

  const exportStatus = el('span', 'library__export-status');
  exportStatus.setAttribute('role', 'status');
  filters?.appendChild(exportStatus);

  exportButton.addEventListener('click', () => {
    const rows = filtered();
    const lines = [
      'reference,name,category,status,component,note',
      ...rows.map((technique) =>
        [
          techniqueAnchor(technique.id),
          `"${technique.name.replace(/"/g, '""')}"`,
          `"${technique.catLabel.replace(/"/g, '""')}"`,
          technique.status,
          `"${technique.comp}"`,
          `"${technique.note.replace(/"/g, '""')}"`,
        ].join(','),
      ),
    ];
    const text = `${lines.join('\n')}\n`;
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    // The reported size is the real byte count of the generated file.
    exportStatus.textContent = `${rows.length} references · ${blob.size} bytes`;
    /* The export is an action too, so it registers like every other one. */
    confirm(exportButton, 'Exported');
    const url = URL.createObjectURL(blob);
    const link = el('a');
    link.href = url;
    link.download = 'denvup-technique-references.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    announce(`Exported ${rows.length} technique references.`);
  });

  // ------------------------------------------------------------------ //
  // Guided tour
  // ------------------------------------------------------------------ //
  const tourButton = el('button', 'library__tour');
  tourButton.type = 'button';
  tourButton.textContent = 'Take the guided tour';
  filters?.appendChild(tourButton);

  let tourPanel: HTMLElement | null = null;

  const stopTour = () => {
    tourPanel?.remove();
    tourPanel = null;
    document.body.classList.remove('is-locked');
  };

  const startTour = (index: number) => {
    const section = navSections[index];
    if (!section) {
      stopTour();
      return;
    }
    if (!tourPanel) {
      tourPanel = el('div', 'tour');
      tourPanel.setAttribute('role', 'dialog');
      tourPanel.setAttribute('aria-label', 'Guided tour');
      const head = el('div', 'tour__head');
      const label = el('p', 'tour__label');
      label.textContent = 'Guided tour';
      const skip = el('button', 'tour__skip');
      skip.type = 'button';
      skip.textContent = 'Skip tour';
      skip.addEventListener('click', stopTour);
      head.append(label, skip);
      const title = el('h2', 'tour__title');
      const body = el('p', 'tour__body');
      const foot = el('div', 'tour__foot');
      const prev = el('button', 'tour__nav');
      prev.type = 'button';
      prev.textContent = 'Previous';
      prev.addEventListener('click', () => startTour(Math.max(0, index - 1)));
      const next = el('button', 'tour__nav tour__nav--next');
      next.type = 'button';
      next.textContent = index === navSections.length - 1 ? 'Finish' : 'Next';
      next.addEventListener('click', () =>
        index === navSections.length - 1 ? stopTour() : startTour(index + 1),
      );
      foot.append(prev, next);
      tourPanel.append(head, title, body, foot);
      document.body.appendChild(tourPanel);
    }
    const section2 = navSections[index];
    const title = tourPanel.querySelector<HTMLElement>('.tour__title');
    const body = tourPanel.querySelector<HTMLElement>('.tour__body');
    if (title) title.textContent = `${section2.index} — ${section2.label}`;
    if (body) body.textContent = section2.blurb;
    scrollTo(`#${section2.id}`, -70);
    announce(`Tour step ${index + 1} of ${navSections.length}: ${section2.label}.`);
  };

  tourButton.addEventListener('click', () => startTour(0));
  cleanups.push(stopTour);

  // ------------------------------------------------------------------ //
  // Detail panel
  // ------------------------------------------------------------------ //
  const panel = el('div', 'library__detail');
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', 'Technique detail');
  const panelScrim = el('div', 'library__detail-scrim');
  panelScrim.addEventListener('click', closeDetail);
  panel.appendChild(panelScrim);
  const panelBody = el('div', 'library__detail-body');
  panel.appendChild(panelBody);
  document.body.appendChild(panel);

  let teardown: (() => void) | null = null;

  function closeDetail(): void {
    teardown?.();
    teardown = null;
    panel.hidden = true;
    document.body.classList.remove('is-locked');
  }

  function openDetail(technique: Technique) {
    teardown?.();
    teardown = null;

    panelBody.innerHTML = '';

    const breadcrumb = el('nav', 'library__crumb');
    breadcrumb.setAttribute('aria-label', 'Path');
    const crumbs = el('ol');
    const trail: string[] = ['Library', `${technique.catLabel}`];
    if (state.path.length) trail.unshift('Library');
    trail.forEach((label, index) => {
      const li = el('li');
      li.textContent = label;
      if (index === trail.length - 1) li.setAttribute('aria-current', 'page');
      crumbs.appendChild(li);
    });
    breadcrumb.appendChild(crumbs);

    const head = el('header', 'library__detail-head');
    const ref = el('p', 'library__detail-ref');
    ref.textContent = techniqueAnchor(technique.id);
    const title = el('h3', 'library__detail-title');
    title.textContent = technique.name;
    const status = el('p', `library__detail-status is-${technique.status.replace(/\s+/g, '-')}`);
    status.textContent = STATUS_LABEL[technique.status];
    const close = el('button', 'library__detail-close');
    close.type = 'button';
    close.textContent = 'Close';
    close.setAttribute('aria-label', 'Close the technique detail');
    close.addEventListener('click', closeDetail);
    head.append(ref, title, status, close);

    const note = el('p', 'library__detail-note');
    note.textContent = technique.note;

    const meta = el('dl', 'library__detail-meta');
    const comp = el('div');
    const compTerm = el('dt');
    compTerm.textContent = 'Implemented in';
    const compValue = el('dd');
    compValue.textContent = technique.comp;
    comp.append(compTerm, compValue);
    const cat = el('div');
    const catTerm = el('dt');
    catTerm.textContent = 'Category';
    const catValue = el('dd');
    catValue.textContent = `${technique.cat}. ${technique.catLabel}`;
    cat.append(catTerm, catValue);
    meta.append(comp, cat);

    const actions = el('div', 'library__detail-actions');
    const copyButton = el('button', 'btn btn--ghost');
    copyButton.type = 'button';
    copyButton.textContent = 'Copy reference';
    copyButton.addEventListener('click', async () => {
      const ok = await copyText(techniqueAnchor(technique.id));
      confirm(copyButton, ok ? 'Copied' : 'Copy failed');
      announce(ok ? `Reference ${techniqueAnchor(technique.id)} copied.` : 'Copy failed.');
    });

    const request = el('a', 'btn btn--primary');
    request.href = `#contact`;
    request.textContent = 'Request this technique';
    request.addEventListener('click', (event) => {
      const field = $<HTMLTextAreaElement>('#enquiry-brief');
      if (!field) return;
      /*
       * The request is written into the brief in front of the visitor,
       * rather than silently assigned. The old code set the value and
       * moved on; the visitor never saw the connection between the
       * technique they asked for and the brief they are about to send.
       */
      event.preventDefault();
      closeDetail();
      const sentence = `I would like ${techniqueAnchor(technique.id)} — ${technique.name} — on my site.`;
      window.setTimeout(() => {
        writeInto(field, field.value ? ` ${sentence}` : sentence, () => {
          field.scrollIntoView({ behavior: env.reducedMotion ? 'auto' : 'smooth', block: 'center' });
          field.focus({ preventScroll: true });
        });
        announce(`${techniqueAnchor(technique.id)} written into your brief.`);
      }, 400);
    });

    actions.append(copyButton, request);

    panelBody.append(breadcrumb, head, note, meta, actions);

    // The live demo, if this technique has one.
    const demos = demosByTechnique.get(technique.id) ?? [];
    if (demos.length) {
      const demo = demos[0];
      const heading = el('h4', 'library__detail-demo-title');
      heading.textContent = 'Working demonstration';
      const host = el('div', 'library__demo');
      const trigger = el('p', 'library__demo-trigger');
      trigger.textContent = demo.trigger;
      const replay = el('button', 'library__demo-replay');
      replay.type = 'button';
      replay.textContent = 'Replay';
      const stageHost = el('div', 'library__demo-stage');
      host.append(trigger, stageHost, replay);
      panelBody.append(heading, host);

      const mountDemo = () => {
        stageHost.innerHTML = '';
        const ctx: DemoContext = {
          root: stageHost,
          reduced: env.reducedMotion,
          budget: env.budget,
          announce,
        };
        teardown = demo.mount(ctx) ?? null;
      };
      mountDemo();
      replay.addEventListener('click', () => {
        teardown?.();
        mountDemo();
      });
    } else {
      const missing = el('p', 'library__detail-missing');
      missing.textContent =
        technique.status === 'Blocked'
          ? 'This technique is deliberately not implemented. The reason is recorded in the coverage matrix.'
          : 'This technique is implemented in a chapter of the site rather than as a standalone demo.';
      panelBody.appendChild(missing);
    }

    panel.hidden = false;
    document.body.classList.add('is-locked');
    noteTechniqueOpened(technique.id);
    if (!env.reducedMotion) {
      gsap.fromTo(
        panelBody,
        { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 0 },
        { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' },
      );
    }
    (panelBody.querySelector('.library__detail-close') as HTMLButtonElement | null)?.focus();
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !panel.hidden) closeDetail();
  };
  window.addEventListener('keydown', onKey);
  cleanups.push(() => window.removeEventListener('keydown', onKey));
  cleanups.push(() => {
    teardown?.();
    panel.remove();
  });

  // ------------------------------------------------------------------ //
  // Grid
  // ------------------------------------------------------------------ //
  function filtered(): Technique[] {
    const query = state.query.trim().toLowerCase();
    return techniques.filter((technique) => {
      if (state.status !== 'all' && technique.status !== state.status) return false;
      if (state.category !== 'all' && technique.cat !== state.category) return false;
      if (!query) return true;
      const haystack =
        `${technique.name} ${technique.catLabel} ${technique.note} ${technique.id} ${technique.comp}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  /*
   * The index is built once.
   *
   * It used to be rebuilt from scratch on every keystroke in the search
   * box: four hundred and eighty cards were destroyed and remade, each
   * one with its own entrance tween, for every character typed. That was
   * slow, and it was also the motion reference's first motion tell —
   * "the same fade-up on every block", repeated endlessly.
   *
   * So the cards are made once and the filter only shows and hides them.
   * The arrival happens one time, as one block, and the reading the
   * filter gives back is the count.
   */
  const cards = new Map<number, HTMLElement>();

  function build() {
    grid.innerHTML = '';
    cards.clear();

    techniques.forEach((technique) => {
      const card = el('article', 'library__card');
      card.dataset.status = technique.status;
      card.dataset.category = String(technique.cat);
      /*
       * Every technique has an address. The service pages and the
       * laboratory both link to a technique by its number, and the
       * library holds one card per technique, so this is the one place
       * the number can be made unique.
       */
      card.id = `tech-${technique.id}`;

      const top = el('div', 'library__card-top');
      const ref = el('button', 'library__card-ref');
      ref.type = 'button';
      ref.textContent = techniqueAnchor(technique.id);
      ref.title = 'Copy this reference';
      ref.setAttribute('aria-label', `Copy reference ${techniqueAnchor(technique.id)}`);
      ref.addEventListener('click', async (event) => {
        event.stopPropagation();
        const ok = await copyText(techniqueAnchor(technique.id));
        /*
         * The same confirmation the laboratory uses: the label is
         * replaced and a tick is drawn, and the reference comes back
         * afterwards. The mark stays, so the visitor can still see that
         * the copy worked.
         */
        confirm(ref, ok ? 'Copied' : 'Failed');
        announce(ok ? `Reference copied.` : 'Copy failed.');
      });

      const status = el('span', `library__card-status is-${technique.status.replace(/\s+/g, '-')}`);
      status.textContent = STATUS_LABEL[technique.status];
      top.append(ref, status);

      const name = el('h3', 'library__card-name');
      name.textContent = technique.name;

      const cat = el('p', 'library__card-cat');
      cat.textContent = `${technique.cat}. ${technique.catLabel}`;

      const open = el('button', 'library__card-open');
      open.type = 'button';
      const hasDemo = (demosByTechnique.get(technique.id) ?? []).length > 0;
      open.textContent = hasDemo ? 'Open the demo' : 'Open the details';
      open.addEventListener('click', () => openDetail(technique));

      card.append(top, name, cat, open);
      grid.appendChild(card);
      cards.set(technique.id, card);
    });

  }

  /*
   * The index arrives when it is reached, as one block.
   *
   * A reference table is not a sequence of moments; it is one wall of
   * references, and giving it a single arrival keeps the attention where
   * it belongs. The arrival is a CSS animation on the container rather
   * than a script that hides it first, so if the script never runs the
   * index is still there — a reveal that fails must never leave a blank
   * band.
   *
   * The observer watches with a threshold of zero on purpose. The shared
   * reveal primitive releases an element at eight per cent of its own
   * area, and this grid is thousands of pixels tall, so that ratio can
   * never be reached and the index would stay hidden for good.
   */
  if (!env.reducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          grid.classList.add('is-arriving');
          observer.disconnect();
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );
    observer.observe(grid);
    cleanups.push(() => observer.disconnect());
  }

  function render() {
    const visible = new Set(filtered().map((technique) => technique.id));
    cards.forEach((card, id) => {
      card.hidden = !visible.has(id);
    });

    if (count) {
      count.textContent = `${visible.size} of ${techniques.length} techniques`;
    }
    if (empty) empty.hidden = visible.size > 0;
  }

  search?.addEventListener('input', () => {
    state.query = search.value;
    render();
  });

  reset?.addEventListener('click', () => {
    state.query = '';
    state.status = 'all';
    state.category = 'all';
    if (search) search.value = '';
    categorySelect.value = 'all';
    filterButtons.forEach((button, key) =>
      button.setAttribute('aria-pressed', String(key === 'all')),
    );
    render();
  });

  build();
  render();

  // Keep the command palette in step with the library.
  void searchDemos;

  return () => cleanups.forEach((fn) => fn());
}

export { allDemos, categoryLabels };
