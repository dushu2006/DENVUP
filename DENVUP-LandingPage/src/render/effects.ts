import { labs, labEntries, implementedIds } from '../labs/registry';
import { coverageRows, coverageSummary, statusOrder } from '../content/coverage-map';
import { esc, icon, sectionHead } from './html';

const pad = (n: number) => String(n).padStart(2, '0');

export function renderEffects(): string {
  const shipped = coverageSummary.Tested + coverageSummary.Implemented;
  const stats = [
    { value: String(labs.length), label: 'labs' },
    { value: String(labEntries.length), label: 'live demos' },
    { value: String(implementedIds.length), label: 'techniques in the library' },
    { value: `${shipped}/480`, label: 'covered in this build' },
  ];

  const filters = labs
    .map(
      (lab) =>
        `<button type="button" class="chip" data-lab-filter="${esc(lab.slug)}" aria-pressed="false">${esc(lab.title)}</button>`,
    )
    .join('');

  const shells = labs
    .map(
      (lab, index) => `<article class="lab" data-lab-shell="${esc(lab.slug)}" id="lab-${esc(lab.slug)}" aria-labelledby="lab-title-${esc(lab.slug)}">
      <header class="lab__head">
        <div class="lab__intro">
          <p class="lab__number">Lab ${pad(index + 1)}</p>
          <h3 class="lab__title" id="lab-title-${esc(lab.slug)}">${esc(lab.title)}</h3>
          <p class="lab__blurb">${esc(lab.blurb)}</p>
        </div>
        <p class="lab__count"><b>${lab.modes.length}</b> demos<span aria-hidden="true"> · </span><b>${new Set(lab.modes.flatMap((m) => m.ids)).size}</b> techniques</p>
      </header>
      <div class="lab__frame">
        <div class="lab__stage" data-lab-stage></div>
        <div class="lab__side lab__info" data-lab-info>
          <p class="lab__eyebrow" data-lab-eyebrow>${esc(lab.title)}</p>
          <p class="lab__loading" data-lab-loading>Loads when it reaches the viewport.</p>
          <div class="lab__detail" data-lab-detail hidden>
            <p class="lab__ids" data-lab-ids></p>
            <p class="lab__mode-name" data-lab-name></p>
            <p class="lab__summary" data-lab-summary></p>
            <dl class="lab__notes" data-lab-notes hidden></dl>
          </div>
          <div class="lab__actions">
            <button type="button" class="d-chip" data-lab-replay>${icon('replay')}<span>Replay</span></button>
            <button type="button" class="d-chip" data-lab-hover hidden>${icon('expand')}<span>Preview hover state</span></button>
            <button type="button" class="d-chip d-chip--want" data-lab-want>${icon('copy')}<span>I want this</span></button>
          </div>
          <p class="lab__status" data-lab-status aria-live="polite"></p>
        </div>
      </div>
      <div class="lab__modes" data-lab-modes role="group" aria-label="${esc(lab.title)} demos"></div>
      <noscript><p class="lab__noscript">The live demo needs JavaScript. Its name, technique IDs and explanation are still in this page, and the full index below records the real status.</p></noscript>
    </article>`,
    )
    .join('');

  const summary = statusOrder
    .map(
      (status) =>
        `<li><span class="status status--${esc(status.toLowerCase().replace(/\s+/g, '-'))}">${esc(status)}</span><b>${coverageSummary[status]}</b></li>`,
    )
    .join('');

  const rows = coverageRows
    .map(
      (row) => `<tr data-coverage-row data-status="${esc(row.status)}">
        <td class="cov__id">${row.id}</td>
        <td class="cov__name">${esc(row.name)}</td>
        <td class="cov__section">${esc(row.sectionName)}</td>
        <td><span class="status status--${esc(row.status.toLowerCase().replace(/\s+/g, '-'))}">${esc(row.status)}</span></td>
        <td class="cov__where">${esc(row.where)}</td>
        <td class="cov__file">${esc(row.file)}</td>
        <td class="cov__test">${esc(row.test)}</td>
      </tr>`,
    )
    .join('');

  return `<section id="effects-library" class="library" data-chapter="effects-library" data-theme="ink" aria-labelledby="library-title">
    <div class="library__head wrap">
      ${sectionHead({
        eyebrow: 'Effects library',
        title: 'Every effect, live — and honest about the ones that are not here.',
        lede: 'Each lab is a group of working demonstrations from the studio’s animation reference. Change the mode, replay it, try the keyboard path, then copy the technique ID into an enquiry. Nothing is a screenshot, and nothing is marked “done” unless it ships.',
        id: 'library-title',
      })}
      <dl class="library__stats">${stats.map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('')}</dl>
      <div class="library__tools">
        <div class="field field--search">
          <label for="lab-search">Search the library</label>
          <div class="field__inner">
            ${icon('search')}
            <input id="lab-search" type="search" placeholder="Technique name, lab or an ID from 1–480" autocomplete="off" data-lab-search>
            <button type="button" class="field__clear" data-lab-search-clear hidden aria-label="Clear library search">${icon('close')}</button>
          </div>
          <p class="library__result" data-lab-count aria-live="polite">Showing all ${labs.length} labs</p>
        </div>
        <div class="library__filters" data-lab-filters role="group" aria-label="Filter by lab">
          <button type="button" class="chip is-active" data-lab-filter="all" aria-pressed="true">All labs</button>
          ${filters}
        </div>
      </div>
      <p class="library__hint">Search by name or technique number. Each lab loads when you reach it; demos pause when the tab is hidden.</p>
    </div>

    <div class="library__search-results wrap" data-lab-search-results hidden></div>
    <div class="library__labs wrap" data-labs>${shells}</div>

    <div class="library__coverage wrap">
      <details class="coverage" data-coverage>
        <summary><span>The full 480-technique index, with real statuses</span><span class="coverage__count">480 rows</span></summary>
        <div class="coverage__inner">
          <p class="coverage__intro">Generated from the implementation, not typed by hand. “Tested” means a named automated check exercises it. “Implemented” means the code ships and the build passes. “Blocked” means a verified reason prevents a live version; the closest safe alternative is named. “Planned” is not dressed up as done.</p>
          <ul class="coverage__summary">${summary}</ul>
          <div class="field field--search">
            <label for="coverage-search">Filter the index</label>
            <div class="field__inner">
              ${icon('search')}
              <input id="coverage-search" type="search" placeholder="Name, ID, status or section" data-coverage-search>
            </div>
          </div>
          <div class="coverage__table-wrap">
            <table class="coverage__table">
              <caption>All 480 techniques in the reference index</caption>
              <thead><tr><th scope="col">ID</th><th scope="col">Technique</th><th scope="col">Reference section</th><th scope="col">Status</th><th scope="col">Where it lives</th><th scope="col">File</th><th scope="col">How it was checked</th></tr></thead>
              <tbody data-coverage-body>${rows}</tbody>
            </table>
          </div>
          <p class="coverage__empty" data-coverage-empty hidden>No rows match that filter.</p>
        </div>
      </details>
    </div>
  </section>`;
}
