import { labById, labEntries, labs, totalLabModes, type LabEntry } from '../labs/registry';
import type { Lab, LabMode } from '../labs/types';
import { coverageRows } from '../content/coverage-map';
import { brand, enquiryText } from '../content/site';
import { $, $$, announce, copyText, isTouch, prefersReduced, toast } from './env';
import { mountStage, type MountedStage } from './stage';

interface LabRuntime {
  shell: HTMLElement;
  lab: Lab;
  stage: HTMLElement;
  modesWrap: HTMLElement;
  info: HTMLElement;
  loading: HTMLElement;
  idsEl: HTMLElement;
  nameEl: HTMLElement;
  summaryEl: HTMLElement;
  notesEl: HTMLElement;
  statusEl: HTMLElement;
  hoverBtn: HTMLButtonElement;
  active: number;
  mounted: MountedStage | null;
  loaded: boolean;
}

const runtimes = new Map<string, LabRuntime>();

function notesFor(mode: LabMode): [string, string][] {
  const entries: [string, string | undefined][] = [
    ['Touch', mode.notes?.touch],
    ['Keyboard', mode.notes?.keyboard],
    ['Motion', mode.notes?.motion],
  ];
  return entries.filter(([, value]) => Boolean(value)) as [string, string][];
}

function renderModeButtons(rt: LabRuntime): void {
  rt.modesWrap.replaceChildren(
    ...rt.lab.modes.map((mode, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mode-btn';
      btn.dataset.labMode = String(index);
      const num = document.createElement('small');
      num.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.textContent = mode.name;
      btn.append(num, label);
      if (index === 0) btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', String(index === 0));
      btn.addEventListener('click', () => select(rt, index));
      return btn;
    }),
  );
}

function renderInfo(rt: LabRuntime, mode: LabMode): void {
  rt.idsEl.replaceChildren(
    ...mode.ids.map((id) => {
      const span = document.createElement('span');
      span.textContent = `#${id}`;
      return span;
    }),
  );
  rt.nameEl.textContent = mode.name;
  rt.summaryEl.textContent = mode.summary;
  const notes = notesFor(mode);
  rt.notesEl.replaceChildren(
    ...notes.map(([label, value]) => {
      const wrap = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      wrap.append(dt, dd);
      return wrap;
    }),
  );
  rt.notesEl.hidden = notes.length === 0;
  rt.info.hidden = false;
  rt.loading.hidden = true;
  rt.hoverBtn.hidden = !mode.hoverPreview;
  rt.statusEl.textContent = `${mode.name} · ${mode.ids.map((id) => `#${id}`).join(' ')}`;
}

function select(rt: LabRuntime, index: number, reason = 'mode'): void {
  const mode = rt.lab.modes[index];
  if (!mode) return;
  rt.active = index;
  rt.mounted?.destroy();
  rt.mounted = mountStage(rt.stage, mode, {
    reduced: prefersReduced(),
    touch: isTouch(),
    onStatus: (message) => {
      rt.statusEl.textContent = message;
      announce(message);
    },
  });
  renderInfo(rt, mode);
  rt.modesWrap.querySelectorAll<HTMLElement>('[data-lab-mode]').forEach((btn, i) => {
    const on = i === index;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  if (reason === 'replay') {
    rt.statusEl.textContent = `Replayed: ${mode.name}`;
    announce(`Replayed ${mode.name}`);
  }
}

function buildLab(shell: HTMLElement): LabRuntime | null {
  const slug = shell.dataset.labShell ?? '';
  const lab = labById.get(slug);
  if (!lab) return null;
  const stage = $<HTMLElement>('[data-lab-stage]', shell);
  const modesWrap = $<HTMLElement>('[data-lab-modes]', shell);
  const info = $<HTMLElement>('[data-lab-info]', shell);
  const loading = $<HTMLElement>('[data-lab-loading]', shell);
  const idsEl = $<HTMLElement>('[data-lab-ids]', shell);
  const nameEl = $<HTMLElement>('[data-lab-name]', shell);
  const summaryEl = $<HTMLElement>('[data-lab-summary]', shell);
  const notesEl = $<HTMLElement>('[data-lab-notes]', shell);
  const statusEl = $<HTMLElement>('[data-lab-status]', shell);
  const hoverBtn = $<HTMLButtonElement>('[data-lab-hover]', shell);
  if (!stage || !modesWrap || !info || !loading || !idsEl || !nameEl || !summaryEl || !notesEl || !statusEl || !hoverBtn) {
    return null;
  }
  const rt: LabRuntime = {
    shell,
    lab,
    stage,
    modesWrap,
    info,
    loading,
    idsEl,
    nameEl,
    summaryEl,
    notesEl,
    statusEl,
    hoverBtn,
    active: 0,
    mounted: null,
    loaded: false,
  };
  renderModeButtons(rt);
  $<HTMLButtonElement>('[data-lab-replay]', shell)?.addEventListener('click', () => {
    if (!rt.loaded) {
      rt.loaded = true;
      select(rt, rt.active);
    }
    rt.mounted?.replay();
    rt.statusEl.textContent = `Replayed: ${rt.lab.modes[rt.active]?.name ?? ''}`;
    announce(`Replayed ${rt.lab.modes[rt.active]?.name ?? ''}`);
  });
  hoverBtn.addEventListener('click', () => {
    const mode = rt.lab.modes[rt.active];
    if (!mode) return;
    const on = !rt.stage.classList.contains('is-preview');
    rt.stage.classList.toggle('is-preview', on);
    const target = rt.stage.querySelector<HTMLElement>('.d-btn, .d-chip, button:not([data-lab-mode])');
    target?.dispatchEvent(new PointerEvent(on ? 'pointerenter' : 'pointerleave', { bubbles: false }));
    rt.statusEl.textContent = on
      ? 'Hover state pinned. The same state is available from a keyboard focus.'
      : 'Hover preview released.';
  });
  $<HTMLButtonElement>('[data-lab-want]', shell)?.addEventListener('click', () => void want(rt));
  return rt;
}

async function want(rt: LabRuntime): Promise<void> {
  const mode = rt.lab.modes[rt.active];
  if (!mode) return;
  const text = `${mode.ids.map((id) => `#${id}`).join(', ')} — ${mode.name} (${rt.lab.title})`;
  const ok = await copyText(text);
  if (ok) {
    toast(`Copied ${text}. Paste it into the enquiry form or a message.`);
    rt.statusEl.textContent = `Copied: ${text}`;
    return;
  }
  const first = mode.ids[0] ?? 0;
  const href = `mailto:${brand.email}?subject=${encodeURIComponent(`Effect enquiry — #${first}`)}&body=${encodeURIComponent(enquiryText.effect(first, mode.name))}`;
  toast('The clipboard refused. Opening an email with the same technique details.');
  window.location.href = href;
  rt.statusEl.textContent = `Could not copy; the email route uses ${text}.`;
}

function lazyLabs(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const slug = (entry.target as HTMLElement).dataset.labShell ?? '';
        const rt = runtimes.get(slug);
        if (!rt || rt.loaded) {
          observer.unobserve(entry.target);
          return;
        }
        rt.loaded = true;
        select(rt, 0, 'lazy');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '420px 0px 120px' },
  );
  runtimes.forEach((rt) => observer.observe(rt.shell));
}

/* ------------------------------------------------------------------ search */

function openEntry(entry: LabEntry): void {
  const rt = runtimes.get(entry.lab.slug);
  if (!rt) return;
  if (!rt.loaded) {
    rt.loaded = true;
  }
  select(rt, entry.index, 'search');
  rt.shell.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
  window.setTimeout(() => {
    const first = rt.modesWrap.querySelector<HTMLButtonElement>('[data-lab-mode]');
    first?.focus({ preventScroll: true });
  }, prefersReduced() ? 0 : 500);
}

function resultNode(opts: { title: string; meta: string; body: string; onOpen?: () => void; href?: string }): HTMLElement {
  const row = document.createElement('div');
  row.className = 'searchhit';
  const head = document.createElement('p');
  head.className = 'searchhit__meta';
  head.textContent = opts.meta;
  const title = document.createElement(opts.onOpen ? 'button' : 'a') as HTMLButtonElement | HTMLAnchorElement;
  title.className = 'searchhit__title';
  title.textContent = opts.title;
  if (opts.onOpen) {
    (title as HTMLButtonElement).type = 'button';
    title.addEventListener('click', opts.onOpen);
  } else {
    (title as HTMLAnchorElement).href = opts.href ?? '#effects-library';
  }
  const body = document.createElement('p');
  body.className = 'searchhit__body';
  body.textContent = opts.body;
  row.append(head, title, body);
  return row;
}

function initSearch(): void {
  const input = $<HTMLInputElement>('[data-lab-search]');
  const clear = $<HTMLButtonElement>('[data-lab-search-clear]');
  const count = $<HTMLElement>('[data-lab-count]');
  const results = $<HTMLElement>('[data-lab-search-results], [data-lab-results]');
  if (!input) return;
  const shellList = [...runtimes.values()];

  const apply = () => {
    const raw = input.value.trim();
    const q = raw.toLowerCase();
    if (clear) clear.hidden = !raw;
    let shown = 0;
    shellList.forEach((rt) => {
      const haystack = [
        rt.lab.title,
        rt.lab.blurb,
        ...rt.lab.modes.map((mode) => `${mode.name} ${mode.ids.join(' ')} ${mode.summary}`),
      ]
        .join(' ')
        .toLowerCase();
      const match = !q || haystack.includes(q) || rt.lab.modes.some((mode) => mode.ids.includes(Number(q)));
      rt.shell.hidden = !match || (rt.shell.dataset.filteredOut === 'true');
      if (!rt.shell.hidden) shown += 1;
    });
    if (count) count.textContent = q ? `${shown} lab${shown === 1 ? '' : 's'} match “${raw}”` : `Showing all ${labs.length} labs`;

    if (!results) return;
    results.replaceChildren();
    results.hidden = !q;
    if (!q) return;

    const entries = labEntries.filter((entry) => {
      const hay = `${entry.lab.title} ${entry.mode.name} ${entry.mode.summary} ${entry.mode.ids.join(' ')}`.toLowerCase();
      return hay.includes(q) || entry.mode.ids.includes(Number(q));
    });
    const exact = Number.isFinite(Number(q)) && q !== '' ? coverageRows.find((row) => row.id === Number(q)) : undefined;
    const nodes: HTMLElement[] = [];
    if (exact) {
      nodes.push(
        resultNode({
          meta: `#${exact.id} · ${exact.status} · ${exact.sectionName}`,
          title: exact.name,
          body: `${exact.where}. ${exact.note ?? ''}`,
        }),
      );
    }
    entries.slice(0, 12).forEach((entry) => {
      nodes.push(
        resultNode({
          meta: `${entry.lab.title} · demo ${entry.index + 1} · ${entry.mode.ids.map((id) => `#${id}`).join(' ')}`,
          title: entry.mode.name,
          body: entry.mode.summary,
          onOpen: () => openEntry(entry),
        }),
      );
    });
    if (!nodes.length) {
      const empty = document.createElement('p');
      empty.className = 'searchhit';
      empty.textContent = 'No lab demo or indexed technique matches that. Try a name, a section such as “scroll”, or a number from 1 to 480.';
      nodes.push(empty);
    }
    results.append(...nodes);
  };

  input.addEventListener('input', apply);
  clear?.addEventListener('click', () => {
    input.value = '';
    apply();
    input.focus();
  });
  apply();
}

function initFilters(): void {
  const chips = $$<HTMLButtonElement>('[data-lab-filter]');
  const count = $<HTMLElement>('[data-lab-count]');
  let active = 'all';
  const apply = () => {
    let shown = 0;
    runtimes.forEach((rt) => {
      const match = active === 'all' || rt.lab.slug === active;
      rt.shell.dataset.filteredOut = match ? 'false' : 'true';
      rt.shell.hidden = !match;
      if (match) shown += 1;
    });
    if (count) count.textContent = `Showing ${shown} of ${labs.length} labs`;
  };
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      active = chip.dataset.labFilter ?? 'all';
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      apply();
      const first = [...runtimes.values()].find((rt) => !rt.shell.hidden);
      first?.shell.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
      announce(`Filtered to ${active === 'all' ? 'all labs' : first?.lab.title ?? active}`);
    });
  });
}

function initCoverage(): void {
  const root = $<HTMLDetailsElement>('[data-coverage]');
  if (!root) return;
  const input = $<HTMLInputElement>('[data-coverage-search]', root);
  const rows = $$<HTMLTableRowElement>('[data-coverage-row]', root);
  const empty = $<HTMLElement>('[data-coverage-empty]', root);
  if (!input) return;
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach((row) => {
      const match = !q || (row.textContent ?? '').toLowerCase().includes(q);
      row.hidden = !match;
      if (match) shown += 1;
    });
    if (empty) {
      empty.hidden = shown > 0;
      empty.textContent = `No rows match “${input.value.trim()}”.`;
    }
  };
  input.addEventListener('input', apply);
}

function setLiveCounts(): void {
  $$<HTMLElement>('[data-live-demos]').forEach((el) => {
    el.textContent = String(totalLabModes);
  });
  $$<HTMLElement>('[data-coverage-total]').forEach((el) => {
    el.textContent = String(coverageRows.length);
  });
}

export function initLibrary(): void {
  $$<HTMLElement>('[data-lab-shell]').forEach((shell) => {
    const rt = buildLab(shell);
    if (rt) runtimes.set(rt.lab.slug, rt);
  });
  lazyLabs();
  initFilters();
  initSearch();
  initCoverage();
  setLiveCounts();
  $<HTMLElement>('.library__hint')?.replaceChildren(
    document.createTextNode(
      `${labs.length} labs, ${totalLabModes} demos. Each lab loads when you reach it; demos pause when the tab is hidden.`,
    ),
  );
}

/** Mounts a lab mode outside the library, for capability and concept cards. */
export function mountEmbed(host: HTMLElement, slug: string, modeIndex: number, label: string): (() => void) | null {
  const lab = labById.get(slug);
  const mode = lab?.modes[modeIndex];
  if (!lab || !mode) return null;
  const mounted = mountStage(host, mode, { reduced: prefersReduced(), touch: isTouch() });
  host.dataset.embed = `${slug}:${modeIndex}`;
  host.setAttribute('role', 'img');
  host.setAttribute('aria-label', `${label} — live demo: ${mode.name}. ${mode.summary}`);
  return () => mounted.destroy();
}

