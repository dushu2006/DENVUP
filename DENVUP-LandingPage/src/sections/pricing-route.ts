/**
 * The pricing route.
 *
 * The route page has its own layout — rows rather than cards — but it
 * shares the estimator logic with the home chapter, so the two never
 * disagree about a figure. Everything is calculated in the browser; nothing
 * is sent anywhere.
 */

import { $ } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';
import { register } from '../core/feedback';

const BASES: Record<string, number> = {
  landing: 15000,
  website: 20000,
  advanced: 50000,
};

const FACTORS: Record<string, number> = {
  pages: 1.4,
  content: 1.2,
  motion: 1.35,
  integration: 1.3,
  ai: 1.45,
};

function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function initPricingRoute(): () => void {
  const root = $<HTMLElement>('[data-estimator]');
  if (!root) return () => {};

  const figure = root.querySelector<HTMLElement>('[data-estimator-figure]');
  const baseInputs = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[data-estimator-base]'),
  );
  const factorInputs = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[data-estimator-factor]'),
  );

  /*
   * The figure is the payoff of the whole control, so it does not simply
   * swap. It travels to its new value, and the two ends of the range move
   * together so the visitor can see which end moved and how far.
   */
  let lastLow = 0;
  let lastHigh = 0;

  const update = (): void => {
    const chosen = baseInputs.find((input) => input.checked)?.value ?? 'landing';
    const base = BASES[chosen] ?? BASES.landing;

    let multiplier = 1;
    factorInputs.forEach((input) => {
      if (!input.checked) return;
      const factor = FACTORS[input.dataset.estimatorFactor ?? ''];
      if (factor) multiplier *= factor;
    });

    const low = Math.round((base * 0.9) / 500) * 500;
    const high = Math.round((base * multiplier * 1.1) / 500) * 500;

    if (!figure) {
      lastLow = low;
      lastHigh = high;
      return;
    }

    if (lastLow === 0 && lastHigh === 0) {
      figure.textContent = `${formatINR(low)} – ${formatINR(high)}`;
    } else if (env.reducedMotion) {
      figure.textContent = `${formatINR(low)} – ${formatINR(high)}`;
    } else {
      const proxy = { low: lastLow, high: lastHigh };
      gsap.to(proxy, {
        low,
        high,
        duration: 0.42,
        ease: 'power3.out',
        onUpdate: () => {
          figure.textContent = `${formatINR(Math.round(proxy.low))} – ${formatINR(Math.round(proxy.high))}`;
        },
        onComplete: () => {
          figure.textContent = `${formatINR(low)} – ${formatINR(high)}`;
        },
      });
    }
    lastLow = low;
    lastHigh = high;
  };

  /*
   * The chosen row traces itself, so the answer to the estimator is
   * visible on the control as well as in the number.
   */
  const trace = (input: HTMLInputElement): void => {
    const label = input.closest<HTMLElement>('.estimator__choice');
    if (!label) return;
    root.querySelectorAll<HTMLElement>('.estimator__choice').forEach((node) => {
      node.classList.remove('is-registered');
    });
    register(label);
  };

  const onChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    if (input.checked) trace(input);
    update();
  };
  baseInputs.forEach((input) => input.addEventListener('change', onChange));
  factorInputs.forEach((input) => input.addEventListener('change', onChange));
  update();

  return () => {
    baseInputs.forEach((input) => input.removeEventListener('change', onChange));
    factorInputs.forEach((input) => input.removeEventListener('change', onChange));
  };
}
