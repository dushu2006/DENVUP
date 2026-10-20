/**
 * Demonstrations for the site-wide system behaviours: loading, navigation,
 * forms, team, easter eggs and accessibility.
 */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

const realProgress: Demo = {
  id: 'system-load-progress',
  title: 'Progress tied to real loading',
  category: 'loading',
  summary:
    'The bar is driven by actual asset decoding and font readiness — never by a timer that pretends to finish.',
  trigger: 'Automatic',
  techniques: [17, 18, 4],
  keywords: 'progress loading real fonts assets',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row demo__stage--progress');
    const bar = el('span', 'demo__progress-bar');
    const value = el('span', 'demo__progress-value');
    value.textContent = '0%';
    wrap.append(bar, value);

    const jobs: { label: string; promise: Promise<unknown> }[] = [];
    const img = new Image();
    img.src = './brand-mark.png';
    const decode = typeof img.decode === 'function' ? img.decode() : Promise.resolve();
    jobs.push({ label: 'brand mark', promise: decode.catch(() => undefined) });
    if (document.fonts?.ready) {
      jobs.push({ label: 'fonts', promise: document.fonts.ready });
    }

    let done = 0;
    const update = () => {
      const pct = Math.round((done / jobs.length) * 100);
      bar.style.setProperty('--p', `${pct}%`);
      value.textContent = `${pct}%`;
    };
    update();
    jobs.forEach((job) => {
      void job.promise.then(() => {
        done += 1;
        update();
      });
    });
    hint(root, 'This demo decodes the real brand asset and waits for the real font files.');
  },
};

const skeleton: Demo = {
  id: 'system-skeleton',
  title: 'Skeleton placeholders',
  category: 'loading',
  summary: 'Blocks hold the layout while content is still arriving, so nothing jumps.',
  trigger: 'Automatic',
  techniques: [5],
  keywords: 'skeleton placeholder loading layout shift',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--cards');
    for (let i = 0; i < 3; i += 1) {
      const card = el('div', 'demo__skeleton');
      card.innerHTML = '<span class="demo__skeleton-media"></span><span class="demo__skeleton-line"></span><span class="demo__skeleton-line demo__skeleton-line--short"></span>';
      wrap.appendChild(card);
    }
    const bar = controls(root);
    bar.appendChild(
      button('Fill in', () => {
        wrap.querySelectorAll<HTMLElement>('.demo__skeleton').forEach((card, i) => {
          card.classList.add('is-filled');
          card.style.setProperty('--delay', `${i * 90}ms`);
        });
      }),
    );
  },
};

const brandReveal: Demo = {
  id: 'system-brand-reveal',
  title: 'Brand reveal',
  category: 'loading',
  summary: 'The emblem assembles from its parts and the wordmark types in beside it.',
  trigger: 'Press Replay',
  techniques: [6, 7, 8],
  keywords: 'brand reveal logo assemble wordmark',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--row demo__stage--brand');
    const mark = el('span', 'demo__brand-mark');
    const word = el('span', 'demo__brand-word');
    word.textContent = 'DENVUP';
    wrap.append(mark, word);

    const play = () => {
      gsap.set(mark, { scale: reduced ? 1 : 0.2, opacity: reduced ? 1 : 0, rotate: -30 });
      gsap.set(word, { opacity: reduced ? 1 : 0 });
      if (reduced) return;
      gsap.to(mark, { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.8)' });
      gsap.to(word, { opacity: 1, duration: 0.5, delay: 0.4, ease: 'power2.out' });
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

const sharedUnderline: Demo = {
  id: 'system-nav-underline',
  title: 'A shared underline slides between links',
  category: 'nav',
  summary: 'One indicator moves between items instead of each link drawing its own line.',
  trigger: 'Move between the links',
  techniques: [153, 154],
  keywords: 'nav underline indicator slides active',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row demo__stage--navdemo');
    const nav = el('nav', 'demo__navdemo');
    nav.setAttribute('aria-label', 'Section links');
    const indicator = el('span', 'demo__navdemo-indicator');
    const labels = ['Intro', 'Work', 'Method', 'Contact'];
    const links = labels.map((label, index) => {
      const link = el('button', 'demo__navdemo-link');
      link.type = 'button';
      link.textContent = label;
      link.addEventListener('click', () => activate(index));
      nav.appendChild(link);
      return link;
    });
    nav.appendChild(indicator);
    wrap.appendChild(nav);

    const activate = (index: number) => {
      links.forEach((link, i) => {
        link.classList.toggle('is-active', i === index);
        link.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
      const target = links[index];
      const offset = target.offsetLeft;
      indicator.style.transform = `translateX(${offset}px)`;
      indicator.style.width = `${target.offsetWidth}px`;
    };
    activate(0);
    requestAnimationFrame(() => activate(0));
    return () => indicator.remove();
  },
};

const panelWipe: Demo = {
  id: 'system-panel-wipe',
  title: 'Panel transition with a shape mask',
  category: 'nav',
  summary:
    'The panel arrives through an expanding shape mask rather than a plain rectangle — and it can be dismissed with Escape.',
  trigger: 'Press Open, then press Escape',
  techniques: [165, 166, 167],
  keywords: 'panel wipe mask transition dismiss',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--panel');
    const trigger = el('button', 'demo__sample-btn');
    trigger.type = 'button';
    trigger.textContent = 'Open panel';
    const panel = el('div', 'demo__panelbox');
    panel.hidden = true;
    const title = el('h4', 'demo__panelbox-title');
    title.textContent = 'Technique detail';
    const body = el('p', 'demo__panelbox-body');
    body.textContent =
      'The title of the selected card is carried into the panel, and the panel remembers how you arrived.';
    const close = el('button', 'demo__sample-btn');
    close.type = 'button';
    close.textContent = 'Close';
    panel.append(title, body, close);
    wrap.append(trigger, panel);

    const open = () => {
      panel.hidden = false;
      gsap.fromTo(
        panel,
        { clipPath: 'circle(0% at 50% 50%)', autoAlpha: 0 },
        { clipPath: 'circle(150% at 50% 50%)', autoAlpha: 1, duration: 0.55, ease: 'power3.inOut' },
      );
      close.focus();
    };
    const shut = () => {
      gsap.to(panel, {
        clipPath: 'circle(0% at 50% 50%)',
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          panel.hidden = true;
          trigger.focus();
        },
      });
    };
    trigger.addEventListener('click', open);
    close.addEventListener('click', shut);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !panel.hidden) shut();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  },
};

const accordion: Demo = {
  id: 'system-accordion',
  title: 'Accordion with a height transition',
  category: 'convert',
  summary: 'The answer opens with a grid-row height transition and only one panel is open at a time.',
  trigger: 'Press a question',
  techniques: [361, 362, 363],
  keywords: 'accordion faq question answer height',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--rows');
    const items = [
      { q: 'How long does a project take?', a: 'It depends on scope. We agree the milestones in the brief.' },
      { q: 'What does the price cover?', a: 'Design, build, motion and handover as written in the proposal.' },
      { q: 'Do you work with existing brands?', a: 'Yes. We work inside the brand you already have.' },
    ];
    const heads: HTMLButtonElement[] = [];
    items.forEach((item, index) => {
      const row = el('div', 'demo__row');
      const head = el('button', 'demo__row-head');
      head.type = 'button';
      head.setAttribute('aria-expanded', 'false');
      head.innerHTML = `<b>${item.q}</b><span class="demo__row-sign" aria-hidden="true"></span>`;
      const body = el('div', 'demo__row-body');
      body.innerHTML = `<div><p>${item.a}</p></div>`;
      row.append(head, body);
      head.addEventListener('click', () => {
        const open = head.getAttribute('aria-expanded') === 'true';
        heads.forEach((other) => {
          other.setAttribute('aria-expanded', 'false');
          other.parentElement?.classList.remove('is-open');
        });
        if (!open) {
          head.setAttribute('aria-expanded', 'true');
          row.classList.add('is-open');
        }
      });
      heads.push(head);
      wrap.appendChild(row);
      void index;
    });
  },
};

const comparisonTable: Demo = {
  id: 'system-comparison-table',
  title: 'Comparison table revealed on scroll',
  category: 'convert',
  summary: 'The feature comparison between the three plans reveals row by row.',
  trigger: 'Automatic as the rows come into view',
  techniques: [358, 320],
  keywords: 'comparison table pricing features rows',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--table');
    const table = el('table', 'demo__table');
    table.innerHTML = `
      <caption class="visually-hidden">Indicative comparison of the three engagement shapes</caption>
      <thead><tr><th scope="col">Capability</th><th scope="col">Landing</th><th scope="col">Business</th><th scope="col">Custom</th></tr></thead>
      <tbody>
        <tr><th scope="row">Responsive layout</th><td>Yes</td><td>Yes</td><td>Yes</td></tr>
        <tr><th scope="row">Motion system</th><td>Core</td><td>Core</td><td>Extended</td></tr>
        <tr><th scope="row">3D / WebGL</th><td>—</td><td>Optional</td><td>Yes</td></tr>
        <tr><th scope="row">CMS editing</th><td>—</td><td>Optional</td><td>Yes</td></tr>
      </tbody>`;
    wrap.appendChild(table);
    const rows = table.querySelectorAll<HTMLElement>('tbody tr');
    rows.forEach((row, index) => {
      row.style.setProperty('--delay', `${index * 80}ms`);
      row.classList.add('demo__table-row');
    });
  },
};

const memberCard: Demo = {
  id: 'system-member-card',
  title: 'Member card without a portrait',
  category: 'team',
  summary:
    'No portraits were supplied, so the card shows a monogram that scales and tilts under the pointer instead of a fabricated face.',
  trigger: 'Move the pointer over the card',
  techniques: [341, 342, 343, 344, 345],
  keywords: 'team member monogram card tilt portrait',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const card = el('article', 'demo__member');
    const mono = el('span', 'demo__member-mono');
    mono.textContent = 'TD';
    const name = el('b', 'demo__member-name');
    name.textContent = 'T. Dusyanth';
    const focus = el('span', 'demo__member-focus');
    focus.textContent = 'Design, front-end';
    card.append(mono, name, focus);
    wrap.appendChild(card);

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      mono.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      mono.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    };
    const onLeave = () => {
      card.style.transform = '';
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  },
};

const secretWord: Demo = {
  id: 'system-secret-word',
  title: 'Type the studio name',
  category: 'eggs',
  summary:
    'Typing the studio name anywhere on the page pulses the emblem. It never blocks navigation and never hides content.',
  trigger: 'Type DENVUP',
  techniques: [397, 398, 405, 406, 410],
  keywords: 'easter egg secret pulse emblem hidden',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row demo__stage--secret');
    const readout = el('span', 'demo__readout');
    readout.textContent = '0 / 6 letters';
    const field = el('input');
    field.type = 'text';
    field.className = 'demo__secret-input';
    field.placeholder = 'Type here';
    field.setAttribute('aria-label', 'Type the studio name to trigger the emblem pulse');
    wrap.append(field, readout);

    const target = 'denvup';
    let typed = '';
    const onInput = () => {
      typed = field.value.toLowerCase().replace(/[^a-z]/g, '').slice(-6);
      readout.textContent = `${typed.length} / 6 letters`;
      if (typed === target) {
        field.classList.add('is-hit');
        readout.textContent = 'Emblem pulsed';
        window.setTimeout(() => {
          field.classList.remove('is-hit');
          readout.textContent = '0 / 6 letters';
          field.value = '';
          typed = '';
        }, 1200);
      }
    };
    field.addEventListener('input', onInput);
    return () => field.removeEventListener('input', onInput);
  },
};

const reducedMotionSwitch: Demo = {
  id: 'system-reduced-motion',
  title: 'Motion preference control',
  category: 'a11y',
  summary:
    'The control mirrors the operating-system preference and can override it either way. Nothing is hidden when motion is reduced — it is only shortened.',
  trigger: 'Press the switch',
  techniques: [426, 427, 428, 150],
  keywords: 'reduced motion accessibility switch preference',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const label = el('label', 'demo__switch-row');
    const input = el('input');
    input.type = 'checkbox';
    input.className = 'demo__switch-input';
    const text = el('span');
    text.textContent = 'Reduce motion';
    const status = el('span', 'demo__readout');
    status.textContent = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'system: reduced'
      : 'system: full';
    label.append(input, text);
    wrap.append(label, status);
    input.addEventListener('change', () => {
      status.textContent = input.checked ? 'reduced (manual)' : 'full (manual)';
    });
  },
};

const shortcutGuide: Demo = {
  id: 'system-shortcuts',
  title: 'Keyboard shortcut guide',
  category: 'a11y',
  summary: 'A keyboard-only way to open the guide. Every shortcut is also available as a visible control.',
  trigger: 'Press ? or use the button',
  techniques: [407, 174, 431],
  keywords: 'keyboard shortcut guide question mark focus',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const open = el('button', 'demo__sample-btn');
    open.type = 'button';
    open.textContent = 'Open the shortcut guide';
    const list = el('dl', 'demo__shortcuts');
    list.hidden = true;
    list.innerHTML = `
      <dt>/</dt><dd>Open the command palette</dd>
      <dt>?</dt><dd>Open this guide</dd>
      <dt>Esc</dt><dd>Close whatever is open</dd>
      <dt>Tab</dt><dd>Move through the interface</dd>`;
    open.addEventListener('click', () => {
      list.hidden = !list.hidden;
      open.textContent = list.hidden ? 'Open the shortcut guide' : 'Close the shortcut guide';
    });
    wrap.append(open, list);
    hint(root, 'On the live site, press ? anywhere to open the guide.');
  },
};

export const systemDemos: Demo[] = [
  realProgress,
  skeleton,
  brandReveal,
  sharedUnderline,
  panelWipe,
  accordion,
  comparisonTable,
  memberCard,
  secretWord,
  reducedMotionSwitch,
  shortcutGuide,
];
