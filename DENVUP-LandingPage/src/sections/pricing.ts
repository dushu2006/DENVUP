/**
 * The pricing chapter.
 *
 * Three indicative plans, a comparison table, and an estimator that
 * multiplies the base price by the options you pick. The estimator is labelled
 * as indicative everywhere it appears, and the disclaimer is always visible.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { gsap, ScrollTrigger } from '../core/motion';
import { estimatorGroups, plans, pricingDisclaimer } from '../data/pricing';
import { register } from '../core/feedback';

function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function initPricing(): () => void {
  const root = $<HTMLElement>('[data-pricing]');
  if (!root) return () => {};

  const cleanups: (() => void)[] = [];

  // ------------------------------------------------------------------ //
  // Plan cards
  // ------------------------------------------------------------------ //
  const cards = el('div', 'pricing__cards');
  plans.forEach((plan, index) => {
    const card = el('article', `pricing__card${plan.featured ? ' is-featured' : ''}`);
    card.dataset.plan = plan.id;

    const head = el('div', 'pricing__card-head');
    const name = el('h3', 'pricing__card-name');
    name.textContent = plan.name;
    const price = el('p', 'pricing__card-price');
    const amount = el('span', 'pricing__card-amount');
    amount.textContent = formatINR(plan.from);
    const from = el('span', 'pricing__card-from');
    from.textContent = 'from';
    price.append(amount, from);
    const summary = el('p', 'pricing__card-summary');
    summary.textContent = plan.summary;
    head.append(name, price, summary);

    const list = el('ul', 'pricing__card-includes');
    plan.includes.forEach((entry) => {
      const li = el('li');
      li.textContent = entry;
      list.appendChild(li);
    });

    const action = el('a', 'btn btn--ghost pricing__card-action');
    action.href = '#contact';
    action.textContent = 'Talk about this scope';
    action.dataset.estimate = plan.id;

    card.append(head, list, action);
    cards.appendChild(card);
    void index;
  });
  root.appendChild(cards);

  // ------------------------------------------------------------------ //
  // Comparison table
  // ------------------------------------------------------------------ //
  const tableWrap = el('div', 'pricing__table-wrap');
  const table = el('table', 'pricing__table');
  const featureRows: [string, string, string, string][] = [
    ['Pages', 'One', 'Multiple', 'As required'],
    ['Visual system', 'Concept', 'Full system', 'Full system + tokens'],
    ['Motion pass', 'Core', 'Core + extended', 'Full interaction system'],
    ['3D / WebGL', '—', 'Optional', 'Included where earned'],
    ['CMS / content model', '—', 'Optional', 'Included'],
    ['Accessibility & performance pass', 'Yes', 'Yes', 'Yes'],
    ['Technique library handover', 'Summary', 'Full', 'Full + source'],
    ['Typical duration', '1–2 weeks', '3–5 weeks', '6+ weeks'],
  ];
  table.innerHTML = `
    <caption class="visually-hidden">Indicative comparison of the three engagement shapes</caption>
    <thead>
      <tr>
        <th scope="col">What you get</th>
        <th scope="col">Landing page</th>
        <th scope="col">Business website</th>
        <th scope="col">Advanced custom</th>
      </tr>
    </thead>
    <tbody></tbody>`;
  const tbody = table.querySelector('tbody');
  const columnLabels = ['Landing page', 'Business website', 'Advanced custom'];
  featureRows.forEach((row, index) => {
    const tr = el('tr', 'pricing__table-row');
    tr.style.setProperty('--delay', `${index * 70}ms`);
    row.forEach((cell, cellIndex) => {
      const node = el(cellIndex === 0 ? 'th' : 'td');
      if (cellIndex === 0) node.setAttribute('scope', 'row');
      // The label each cell carries when the table is stacked on a narrow
      // screen, where there is no header row to read across.
      if (cellIndex > 0) node.dataset.label = columnLabels[cellIndex - 1] ?? '';
      node.textContent = cell;
      tr.appendChild(node);
    });
    tbody?.appendChild(tr);
  });
  tableWrap.appendChild(table);
  root.appendChild(tableWrap);

  if (!env.reducedMotion) {
    const rows = table.querySelectorAll<HTMLElement>('.pricing__table-row');
    const trigger = ScrollTrigger.create({
      trigger: tableWrap,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        rows.forEach((row) => row.classList.add('is-in'));
      },
    });
    cleanups.push(() => trigger.kill());
  }

  // ------------------------------------------------------------------ //
  // Estimator
  // ------------------------------------------------------------------ //
  const estimator = el('div', 'pricing__estimator');
  const head = el('div', 'pricing__estimator-head');
  const heading = el('h3', 'pricing__estimator-title');
  heading.textContent = 'Indicative estimator';
  const intro = el('p', 'pricing__estimator-intro');
  intro.textContent =
    'Pick the closest shape. The number multiplies out from the base price — it is a starting point for a conversation, not a quotation.';
  head.append(heading, intro);

  const controls = el('div', 'pricing__estimator-controls');
  const selections: Record<string, string> = {};

  estimatorGroups.forEach((group) => {
    const fieldset = el('fieldset', 'pricing__group');
    const legend = el('legend', 'pricing__group-label');
    legend.textContent = group.label;
    const options = el('div', 'pricing__options');
    group.options.forEach((option, index) => {
      const label = el('label', 'pricing__option');
      const input = el('input');
      input.type = 'radio';
      input.name = `estimator-${group.id}`;
      input.value = option.id;
      input.checked = index === 0;
      const text = el('span');
      text.textContent = option.label;
      label.append(input, text);
      options.appendChild(label);
      selections[group.id] = option.id;
      input.addEventListener('change', () => {
        if (!input.checked) return;
        selections[group.id] = option.id;
        /* The chosen row traces itself, so the answer to the estimator is
         * visible on the control as well as in the number below. */
        options.querySelectorAll('.pricing__option').forEach((node) => {
          node.classList.remove('is-registered');
        });
        register(label);
        update();
      });
    });
    fieldset.append(legend, options);
    controls.appendChild(fieldset);
  });

  const summary = el('div', 'pricing__summary');
  const summaryLabel = el('p', 'pricing__summary-label');
  summaryLabel.textContent = 'Indicative range';
  const summaryValue = el('p', 'pricing__summary-value');
  const summaryNote = el('p', 'pricing__summary-note');
  summaryNote.textContent = pricingDisclaimer;
  summary.append(summaryLabel, summaryValue, summaryNote);

  estimator.append(head, controls, summary);
  root.appendChild(estimator);

  /*
   * The total is the payoff of the whole control, so it does not simply
   * swap. It travels to its new value, and the range's two ends move
   * together so the visitor can see which end moved and how far.
   */
  let lastLow = 0;
  let lastHigh = 0;

  const update = () => {
    let total = 0;
    let base = 0;
    estimatorGroups.forEach((group) => {
      const option = group.options.find((item) => item.id === selections[group.id]) ?? group.options[0];
      if (group.id === 'base') {
        base = 15000 * option.factor;
        total = base;
      } else {
        total *= option.factor;
      }
    });
    const low = Math.round(base * 0.9);
    const high = Math.round(total * 1.1);

    if (lastLow === 0 && lastHigh === 0) {
      summaryValue.textContent = `${formatINR(low)} – ${formatINR(high)}`;
    } else {
      const proxy = { low: lastLow, high: lastHigh };
      if (env.reducedMotion) {
        summaryValue.textContent = `${formatINR(low)} – ${formatINR(high)}`;
      } else {
        gsap.to(proxy, {
          low,
          high,
          duration: 0.42,
          ease: 'power3.out',
          onUpdate: () => {
            summaryValue.textContent = `${formatINR(Math.round(proxy.low))} – ${formatINR(Math.round(proxy.high))}`;
          },
          onComplete: () => {
            summaryValue.textContent = `${formatINR(low)} – ${formatINR(high)}`;
          },
        });
      }
    }
    lastLow = low;
    lastHigh = high;
  };
  update();

  // Selecting a plan card fills the estimator base.
  root.querySelectorAll<HTMLAnchorElement>('.pricing__card-action').forEach((link) => {
    link.addEventListener('click', () => {
      const plan = plans.find((item) => item.id === link.dataset.estimate);
      if (!plan) return;
      const group = estimatorGroups[0];
      const option = group.options.find((item) => item.id === plan.id);
      if (!option) return;
      const input = root.querySelector<HTMLInputElement>(
        `input[name="estimator-${group.id}"][value="${option.id}"]`,
      );
      if (input) {
        input.checked = true;
        selections[group.id] = option.id;
        update();
      }
    });
  });

  if (!env.reducedMotion) {
    gsap.fromTo(
      cards.children,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08 },
    );
  }

  return () => cleanups.forEach((fn) => fn());
}
