/**
 * The effects library.
 *
 * Every demonstration in the site, on one page, running live.
 *
 * A demo is mounted when its card comes into view and torn down when it
 * leaves, so a page with a hundred and fifty canvases never has a hundred
 * and fifty animation loops running at once. Each card carries the
 * technique numbers it demonstrates, a copy action for the reference, and a
 * request action that starts an enquiry with the reference already in it.
 */

import { $, el, announce } from '../core/dom';
import { env } from '../core/env';
import { copyText } from '../core/clipboard';
import { settleOn } from '../core/scroll';
import { confirm, register, writeInto } from '../core/feedback';
import { allDemos, categoryLabels, type Demo, type DemoCategory } from '../demos/registry';
import type { DemoContext, DemoTeardown } from '../demos/types';
import { techniques } from '../data/techniques';

const techniqueName = new Map(techniques.map((technique) => [technique.id, technique.name]));

function techniqueAnchor(id: number): string {
  return `DENVUP-T${String(id).padStart(3, '0')}`;
}

interface Card {
  demo: Demo;
  root: HTMLElement;
  stage: HTMLElement;
  teardown: DemoTeardown | null;
  mounted: boolean;
}

export function initLabLibrary(hash = ''): () => void {
  const gridNode = $<HTMLElement>('[data-lab-grid]');
  if (!gridNode) return () => {};
  const grid: HTMLElement = gridNode;

  const filters = $<HTMLElement>('[data-lab-filters]');
  const search = $<HTMLInputElement>('[data-lab-search]');
  const count = $<HTMLElement>('[data-lab-count]');
  const empty = $<HTMLElement>('[data-lab-empty]');
  const reset = $<HTMLButtonElement>('[data-lab-reset]');

  const cleanups: (() => void)[] = [];
  const cards: Card[] = [];

  let query = '';
  let category: DemoCategory | 'all' = 'all';

  // ------------------------------------------------------------------ //
  // Cards
  // ------------------------------------------------------------------ //
  /*
   * A technique that has a demonstration gets an address on this page,
   * so a link to "/lab/#tech-118" lands on the demonstration itself
   * rather than at the top of a long list.
   *
   * Several demonstrations can share a technique, so the first one claims
   * the number and every id on the page stays unique.
   */
  const claimed = new Set<number>();

  allDemos.forEach((demo) => {
    const card = el('article', 'fx-card');
    card.dataset.demoId = demo.id;
    card.dataset.category = demo.category;

    demo.techniques.forEach((technique) => {
      if (claimed.has(technique)) return;
      claimed.add(technique);
      const anchor = el('span', 'fx-card__anchor');
      anchor.id = `tech-${technique}`;
      anchor.setAttribute('aria-hidden', 'true');
      card.prepend(anchor);
    });

    const head = el('header', 'fx-card__head');
    const ref = el('p', 'fx-card__ref');
    ref.textContent = demo.techniques
      .slice(0, 3)
      .map((id) => `T${String(id).padStart(3, '0')}`)
      .join(' · ');
    const title = el('h3', 'fx-card__title');
    title.textContent = demo.title;
    const category = el('p', 'fx-card__category');
    category.textContent = categoryLabels[demo.category];
    head.append(ref, title, category);

    const stage = el('div', 'fx-card__stage');
    stage.setAttribute('data-fx-stage', demo.id);

    const summary = el('p', 'fx-card__summary');
    summary.textContent = demo.summary;

    const trigger = el('p', 'fx-card__trigger');
    trigger.textContent = demo.trigger;

    const actions = el('div', 'fx-card__actions');

    const replay = el('button', 'fx-card__replay');
    replay.type = 'button';
    replay.textContent = 'Replay';
    replay.setAttribute('aria-label', `Replay the ${demo.title} demonstration`);

    const copy = el('button', 'fx-card__copy');
    copy.type = 'button';
    copy.textContent = 'Copy the reference';
    copy.setAttribute('aria-label', `Copy the technique reference for ${demo.title}`);

    const want = el('a', 'fx-card__want');
    want.href = '/contact/';
    want.textContent = 'I want this';
    want.setAttribute('aria-label', `Ask about the ${demo.title} technique`);

    actions.append(replay, copy, want);

    /*
     * The acknowledgement strip. It is hidden until the visitor asks for
     * the technique, and when it opens it carries the reference itself —
     * the answer to "what did you just do?" is the thing they asked for.
     */
    const ack = el('div', 'fx-card__ack');
    ack.hidden = true;
    const ackText = el('p', 'fx-card__ack-text');
    const ackActions = el('div', 'fx-card__ack-actions');
    const ackCopy = el('button', 'fx-card__copy');
    ackCopy.type = 'button';
    ackCopy.textContent = 'Copy reference';
    const ackOpen = el('a', 'fx-card__want');
    ackOpen.href = '/contact/';
    ackOpen.textContent = 'Open the enquiry';
    ackActions.append(ackCopy, ackOpen);
    ack.append(ackText, ackActions);

    const notes = el('ul', 'fx-card__notes');
    demo.techniques.slice(0, 4).forEach((id) => {
      const li = el('li');
      const name = techniqueName.get(id);
      li.textContent = name ? `${techniqueAnchor(id)} — ${name}` : techniqueAnchor(id);
      notes.appendChild(li);
    });

    card.append(head, stage, summary, trigger, notes, actions, ack);
    grid.appendChild(card);
    cards.push({ demo, root: card, stage, teardown: null, mounted: false });
  });

  // ------------------------------------------------------------------ //
  // Mounting
  // ------------------------------------------------------------------ //
  const mount = (card: Card): void => {
    if (card.mounted) return;
    card.mounted = true;
    card.stage.innerHTML = '';
    const ctx: DemoContext = {
      root: card.stage,
      reduced: env.reducedMotion,
      budget: env.budget,
      announce,
    };
    try {
      card.teardown = card.demo.mount(ctx) ?? null;
    } catch {
      card.stage.innerHTML = '<p class="fx-card__failed">This demonstration could not start on this device.</p>';
      card.teardown = null;
    }
  };

  const unmount = (card: Card): void => {
    if (!card.mounted) return;
    card.mounted = false;
    try {
      card.teardown?.();
    } catch {
      /* a failing teardown must not block the rest */
    }
    card.teardown = null;
    card.stage.innerHTML = '';
  };

  /*
   * A deep link to a technique has to survive the page settling.
   *
   * A demonstration is mounted when its card comes into view, and a
   * mounted demonstration is taller than an empty one — so the page grows
   * after the first scroll, and a target that was in the right place a
   * moment ago is now some thousands of pixels further down. The link
   * therefore finds its card, mounts the demonstration straight away
   * rather than waiting for it to come into view, and keeps the position
   * until the page stops moving.
   */
  const landOnTechnique = (): void => {
    const fragment = hash || window.location.hash;
    if (!fragment) return;
    const id = decodeURIComponent(fragment.slice(1));
    if (!id.startsWith('tech-')) return;

    const anchor = document.getElementById(id);
    const card = anchor?.closest<HTMLElement>('.fx-card');
    if (!card) return;

    const entry = cards.find((item) => item.root === card);
    if (entry) mount(entry);

    /*
     * The jump is instant rather than smooth, and it is settled rather
     * than taken once. A smooth scroll across twenty thousand pixels of
     * catalogue would take a minute to arrive and would drag the visitor
     * through every card on the way; and a single jump would be wrong
     * the moment the demonstrations above the target finished mounting
     * and made the page taller.
     */
    if (anchor) settleOn(anchor);
  };

  /*
   * The observer does two jobs: it mounts a demo when its card arrives, and
   * it unmounts it when the card leaves, so the page never holds more than
   * a handful of live loops.
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = cards.find((item) => item.root === entry.target);
        if (!card) return;
        if (entry.isIntersecting) mount(card);
        else unmount(card);
      });
    },
    { rootMargin: '240px 0px', threshold: 0.01 },
  );
  cards.forEach((card) => observer.observe(card.root));
  cleanups.push(() => observer.disconnect());

  // ------------------------------------------------------------------ //
  // Filtering
  // ------------------------------------------------------------------ //
  landOnTechnique();

  const apply = (): void => {
    const needle = query.trim().toLowerCase();
    let shown = 0;

    cards.forEach((card) => {
      const matchesCategory = category === 'all' || card.demo.category === category;
      const haystack = [
        card.demo.title,
        card.demo.summary,
        card.demo.trigger,
        categoryLabels[card.demo.category],
        ...(card.demo.keywords ?? '').split(','),
        ...card.demo.techniques.map((id) => `${techniqueAnchor(id)} ${techniqueName.get(id) ?? ''}`),
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const visible = matchesCategory && matchesQuery;
      card.root.hidden = !visible;
      if (visible) {
        shown += 1;
        mount(card);
      } else {
        unmount(card);
      }
    });

    if (count) {
      count.textContent = `${shown} of ${cards.length} demonstrations`;
    }
    if (empty) empty.hidden = shown > 0;
  };

  // --- category chips ----------------------------------------------------- //
  if (filters) {
    const categories = Array.from(new Set(allDemos.map((demo) => demo.category)));
    const chip = (value: DemoCategory | 'all', label: string, total: number): void => {
      const button = el('button', 'fx-filter');
      button.type = 'button';
      button.dataset.category = value;
      button.setAttribute('aria-pressed', value === category ? 'true' : 'false');
      const name = el('span', 'fx-filter__label');
      name.textContent = label;
      const number = el('span', 'fx-filter__count');
      number.textContent = String(total);
      button.append(name, number);
      button.addEventListener('click', () => {
        category = value;
        filters.querySelectorAll<HTMLButtonElement>('.fx-filter').forEach((node) => {
          const on = node.dataset.category === value;
          node.setAttribute('aria-pressed', on ? 'true' : 'false');
          if (on) register(node);
        });
        apply();
      });
      filters.appendChild(button);
    };

    chip('all', 'Everything', cards.length);
    categories.forEach((value) => {
      const total = allDemos.filter((demo) => demo.category === value).length;
      chip(value, categoryLabels[value], total);
    });
  }

  // --- search ------------------------------------------------------------- //
  const onSearch = (): void => {
    query = search?.value ?? '';
    apply();
  };
  search?.addEventListener('input', onSearch);
  cleanups.push(() => search?.removeEventListener('input', onSearch));

  // --- reset -------------------------------------------------------------- //
  const onReset = (): void => {
    query = '';
    category = 'all';
    if (search) search.value = '';
    filters?.querySelectorAll<HTMLButtonElement>('.fx-filter').forEach((node) => {
      const on = node.dataset.category === 'all';
      node.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) register(node);
    });
    apply();
  };
  reset?.addEventListener('click', onReset);
  cleanups.push(() => reset?.removeEventListener('click', onReset));

  // ------------------------------------------------------------------ //
  // Card actions
  //
  // Every one of these acknowledges itself. The old behaviour — swapping a
  // label for 1800 ms and then putting it back — was a flicker, not a
  // reading, and the "I want this" button did nothing at all on a page
  // that has no enquiry form, which is the page most people meet it on.
  // ------------------------------------------------------------------ //
  cards.forEach((card) => {
    const replay = card.root.querySelector<HTMLButtonElement>('.fx-card__replay');
    const copy = card.root.querySelector<HTMLButtonElement>('.fx-card__copy');
    const want = card.root.querySelector<HTMLAnchorElement>('.fx-card__want');
    const ack = card.root.querySelector<HTMLElement>('.fx-card__ack');
    const ackText = card.root.querySelector<HTMLElement>('.fx-card__ack-text');
    const ackCopy = card.root.querySelector<HTMLButtonElement>('.fx-card__ack .fx-card__copy');
    const ackOpen = card.root.querySelector<HTMLAnchorElement>('.fx-card__ack .fx-card__want');

    const reference = card.demo.techniques
      .map((id) => `${techniqueAnchor(id)}${techniqueName.get(id) ? ` — ${techniqueName.get(id)}` : ''}`)
      .join('\n');

    const codes = card.demo.techniques.map((id) => techniqueAnchor(id)).join(', ');

    /* --- replay ------------------------------------------------------- */
    replay?.addEventListener('click', () => {
      unmount(card);
      mount(card);
      confirm(replay, 'Replayed');
      announce(`${card.demo.title} replayed.`);
    });

    /* --- copy --------------------------------------------------------- */
    copy?.addEventListener('click', async () => {
      const ok = await copyText(reference);
      confirm(copy, ok ? 'Copied' : 'Copy failed');
      announce(ok ? `Reference ${codes} copied.` : 'Copy failed.');
    });

    ackCopy?.addEventListener('click', async () => {
      const ok = await copyText(reference);
      confirm(ackCopy, ok ? 'Copied' : 'Copy failed');
      announce(ok ? `Reference ${codes} copied.` : 'Copy failed.');
    });

    /* --- "I want this" ------------------------------------------------ */
    /*
     * The signature moment. A visitor finds a technique they like and says
     * so; the site *shows* that it heard them, by writing the reference
     * into their brief in front of them. When there is no brief on this
     * page — the laboratory has none — the acknowledgement strip opens
     * with the reference in it, and the enquiry link carries the codes
     * across to the contact page.
     */
    const openAck = (): void => {
      if (!ack || !ackText) return;
      ackText.innerHTML = '';
      const lead = document.createTextNode('Added to your brief — ');
      const strong = document.createElement('b');
      strong.textContent = codes;
      ackText.append(lead, strong);
      ack.hidden = false;
      if (ackOpen) ackOpen.href = `/contact/?ref=${encodeURIComponent(codes)}`;
    };

    want?.addEventListener('click', (event) => {
      const field = document.querySelector<HTMLTextAreaElement>('#enquiry-brief');
      if (!field) {
        /* No brief on this page: acknowledge here, and carry the codes on. */
        event.preventDefault();
        openAck();
        confirm(want, 'Added');
        announce(`${codes} added to your enquiry. Open the enquiry to write about it.`);
        return;
      }

      /* There is a brief on this page: write into it, visibly. */
      event.preventDefault();
      openAck();
      confirm(want, 'Added');
      const sentence = `I would like ${codes} — ${card.demo.title} — on my site.`;
      writeInto(field, field.value ? ` ${sentence}` : sentence, () => {
        field.scrollIntoView({ behavior: env.reducedMotion ? 'auto' : 'smooth', block: 'center' });
        field.focus({ preventScroll: true });
      });
      announce(`${codes} written into your brief.`);
    });
  });

  apply();

  return () => {
    cleanups.forEach((teardown) => teardown());
    cards.forEach(unmount);
    observer.disconnect();
  };
}
