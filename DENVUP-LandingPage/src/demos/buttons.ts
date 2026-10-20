/** Button, link and micro-interaction demonstrations. */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

function demoRow(
  root: HTMLElement,
  className: string,
  label: string,
  inner: string,
): HTMLElement {
  const wrap = stage(root, 'demo__stage--row');
  wrap.classList.add(className);
  const btn = el('button', 'demo__sample-btn');
  btn.type = 'button';
  btn.innerHTML = inner;
  const caption = el('span', 'demo__caption');
  caption.textContent = label;
  wrap.append(btn, caption);
  return btn;
}

const underlineCentre: Demo = {
  id: 'micro-underline-centre',
  title: 'Underline grows from the centre',
  category: 'micro',
  summary: 'A hairline scales out from the middle of the label instead of the left edge.',
  trigger: 'Hover or focus the label',
  techniques: [53, 52],
  keywords: 'underline centre link',
  mount({ root }) {
    const link = demoRow(
      root,
      'demo__underline-centre',
      'Hover me',
      '<span class="demo__uc-label">Centre underline</span>',
    );
    const label = link.querySelector<HTMLElement>('.demo__uc-label');
    if (!label) return;
    const after = document.createElement('span');
    after.className = 'demo__uc-line';
    label.appendChild(after);
    return () => after.remove();
  },
};

const iconRotate: Demo = {
  id: 'micro-icon-rotate',
  title: 'Icon rotates on hover',
  category: 'micro',
  summary: 'A circular icon spins 45° and the label lifts, giving the control a mechanical feel.',
  trigger: 'Hover or focus the button',
  techniques: [55, 56],
  keywords: 'icon rotate hover lift',
  mount({ root }) {
    demoRow(
      root,
      'demo__icon-rotate',
      'Hover me',
      '<span class="demo__ir-label">Rotate</span><span class="demo__ir-icon" aria-hidden="true">↻</span>',
    );
  },
};

const shineSweep: Demo = {
  id: 'micro-shine',
  title: 'Button shine sweep',
  category: 'effects',
  summary: 'A specular highlight travels across the surface and returns to a resting state.',
  trigger: 'Hover the button',
  techniques: [59, 275],
  keywords: 'shine sweep highlight specular',
  mount({ root }) {
    demoRow(
      root,
      'demo__shine',
      'Hover me',
      '<span class="demo__shine-label">Sweep</span><span class="demo__shine-glint" aria-hidden="true"></span>',
    );
  },
};

const borderDraw: Demo = {
  id: 'micro-border-draw',
  title: 'Border draws around the perimeter',
  category: 'micro',
  summary: 'An SVG outline traces itself around the button on hover.',
  trigger: 'Hover the button',
  techniques: [60],
  keywords: 'border draw perimeter svg',
  mount({ root }) {
    demoRow(
      root,
      'demo__border-draw',
      'Hover me',
      '<span class="demo__bd-label">Outline</span>',
    );
  },
};

const splitColour: Demo = {
  id: 'micro-split-colour',
  title: 'Split-colour button transition',
  category: 'micro',
  summary: 'The button splits into two blocks that exchange places on hover.',
  trigger: 'Hover the button',
  techniques: [62],
  keywords: 'split colour swap blocks',
  mount({ root }) {
    demoRow(
      root,
      'demo__split',
      'Hover me',
      '<span class="demo__split-a">Split</span><span class="demo__split-b">Colour</span>',
    );
  },
};

const textSwap: Demo = {
  id: 'micro-text-swap',
  title: 'Text swaps on hover',
  category: 'micro',
  summary: 'The label rolls up and a second phrase rolls in from below.',
  trigger: 'Hover or focus the button',
  techniques: [63],
  keywords: 'text swap hover label',
  mount({ root }) {
    demoRow(
      root,
      'demo__text-swap',
      'Hover me',
      '<span class="demo__ts-stack"><span>Request a demo</span><span>Tell us more</span></span>',
    );
  },
};

const arrowMorph: Demo = {
  id: 'micro-arrow-morph',
  title: 'Arrow transforms into another icon',
  category: 'micro',
  summary: 'The arrow rotates and redraws into a tick on hover.',
  trigger: 'Hover the button',
  techniques: [64],
  keywords: 'arrow morph icon tick',
  mount({ root }) {
    demoRow(
      root,
      'demo__arrow-morph',
      'Hover me',
      '<span class="demo__am-label">Send</span><span class="demo__am-icon" aria-hidden="true"></span>',
    );
  },
};

const tooltipReveal: Demo = {
  id: 'micro-tooltip',
  title: 'Tooltip reveal',
  category: 'micro',
  summary: 'A labelled tooltip appears on hover and, importantly, on keyboard focus.',
  trigger: 'Hover or focus the control',
  techniques: [69],
  keywords: 'tooltip focus hover label',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const btn = el('button', 'demo__sample-btn demo__tip-btn');
    btn.type = 'button';
    btn.textContent = 'Focus me';
    const tip = el('span', 'demo__tip');
    tip.textContent = 'Explain what happens next';
    btn.setAttribute('aria-describedby', 'tip-demo');
    tip.id = 'tip-demo';
    wrap.append(btn, tip);
  },
};

const externalIndicator: Demo = {
  id: 'micro-external-link',
  title: 'External-link indicator',
  category: 'micro',
  summary: 'An outward arrow animates to show that a link leaves the site.',
  trigger: 'Hover the link',
  techniques: [71],
  keywords: 'external link arrow indicator',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const link = el('a', 'demo__ext');
    link.href = 'https://developer.mozilla.org/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = '<span>MDN Web Docs</span><span class="demo__ext-arrow" aria-hidden="true">↗</span>';
    link.appendChild(el('span', 'visually-hidden'));
    link.querySelector('.visually-hidden')!.textContent = '(opens in a new tab)';
    wrap.appendChild(link);
  },
};

const toggleSwitch: Demo = {
  id: 'micro-toggle',
  title: 'Toggle switch with a moving thumb',
  category: 'micro',
  summary: 'The thumb travels and the state is exposed to assistive technology, not only by colour.',
  trigger: 'Press the switch',
  techniques: [73],
  keywords: 'toggle switch thumb on off',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const btn = el('button', 'demo__toggle');
    btn.type = 'button';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-checked', 'false');
    btn.innerHTML = '<span class="demo__toggle-track"><span class="demo__toggle-thumb"></span></span><span class="demo__toggle-label">Motion</span>';
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-checked') === 'true';
      btn.setAttribute('aria-checked', String(!on));
    });
    wrap.appendChild(btn);
  },
};

const checkboxDraw: Demo = {
  id: 'micro-checkbox',
  title: 'Checkbox draws its tick',
  category: 'micro',
  summary: 'The tick is drawn with an SVG stroke rather than swapped in as an image.',
  trigger: 'Press the box',
  techniques: [74, 75],
  keywords: 'checkbox tick draw svg radio',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const label = el('label', 'demo__check');
    const input = el('input');
    input.type = 'checkbox';
    input.className = 'demo__check-input';
    const box = el('span', 'demo__check-box');
    box.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.6 6.2 12 13 4.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const text = el('span', 'demo__check-label');
    text.textContent = 'Include the technique library in the handover';
    label.append(input, box, text);
    wrap.appendChild(label);
  },
};

const floatingLabel: Demo = {
  id: 'micro-floating-label',
  title: 'Floating label transition',
  category: 'micro',
  summary: 'The label sits inside the field and lifts out of it when the field is used.',
  trigger: 'Focus the field or type in it',
  techniques: [77, 76],
  keywords: 'floating label input focus',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const field = el('div', 'demo__float');
    const input = el('input');
    input.type = 'text';
    input.id = 'float-demo-input';
    input.placeholder = ' ';
    const label = el('label', 'demo__float-label');
    label.htmlFor = 'float-demo-input';
    label.textContent = 'Project name';
    field.append(input, label);
    wrap.appendChild(field);
  },
};

const disabledState: Demo = {
  id: 'micro-disabled',
  title: 'Disabled and pressed states',
  category: 'micro',
  summary: 'A control that is temporarily unavailable fades and stops accepting the pointer.',
  trigger: 'Press the primary button',
  techniques: [66, 57],
  keywords: 'disabled pressed tactile state',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const btn = el('button', 'demo__sample-btn demo__state-btn');
    btn.type = 'button';
    btn.textContent = 'Press me';
    const other = el('button', 'demo__sample-btn demo__state-btn');
    other.type = 'button';
    other.textContent = 'Unavailable';
    other.disabled = true;
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = 'Working…';
      window.setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Press me';
      }, 1600);
    });
    wrap.append(btn, other);
    hint(root, 'The first button recovers on its own; the second stays unavailable.');
  },
};

export const buttonDemos: Demo[] = [
  underlineCentre,
  iconRotate,
  shineSweep,
  borderDraw,
  splitColour,
  textSwap,
  arrowMorph,
  tooltipReveal,
  externalIndicator,
  toggleSwitch,
  checkboxDraw,
  floatingLabel,
  disabledState,
];

/** Re-exported for the library card interactions. */
export { gsap, button, controls };
