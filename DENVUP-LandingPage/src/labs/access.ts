import type { Lab } from './types';

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const linear = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

function ratio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export const accessLab: Lab = {
  slug: 'access',
  title: 'Access & motion controls',
  blurb:
    'Accessibility is not a mode added at the end. These demos expose focus order, contrast, motion preference and structure — and let you check them rather than trust a badge.',
  modes: [
    {
      ids: [431],
      name: 'A visible focus path',
      summary: 'Three controls with a focus ring that is never removed. The panel reports the order as focus moves, so the tab path can be checked.',
      html: `<div class="d-focusdemo" data-focusdemo><button type="button" class="d-btn d-btn--solid" data-focus-item>First</button><button type="button" class="d-btn d-btn--line" data-focus-item>Second</button><a class="d-btn d-btn--line" href="#contact" data-focus-item>Third, a link</a><p class="d-cap" data-focus-note aria-live="polite">Tab into the group to begin.</p></div>`,
      init: ({ stage }) => {
        const note = stage.querySelector<HTMLElement>('[data-focus-note]')!;
        const items = [...stage.querySelectorAll<HTMLElement>('[data-focus-item]')];
        items.forEach((item, i) => {
          item.addEventListener('focus', () => {
            note.textContent = `Focus ${i + 1} of ${items.length}: ${item.textContent}. The ring is drawn with :focus-visible, not removed.`;
          });
        });
      },
      notes: { keyboard: 'This demo is the keyboard path.', motion: 'No motion involved.' },
    },
    {
      ids: [434],
      name: 'Contrast, measured',
      summary: 'Pick two colours and the ratio is calculated from their luminance. Both AA thresholds are reported; no badge is claimed without the number.',
      html: `<div class="d-contrast" data-contrast><div class="d-contrast__preview" data-preview style="background:#ff4a00;color:#0b0a09"><b>Starting at ₹15,000</b><span>Body-size text on the orange field</span></div><div class="d-contrast__controls"><label>Text <input type="color" value="#0b0a09" data-fg></label><label>Field <input type="color" value="#ff4a00" data-bg></label></div><p class="d-h" data-ratio>—</p><p class="d-cap" data-verdict aria-live="polite">Calculating…</p></div>`,
      init: ({ stage }) => {
        const preview = stage.querySelector<HTMLElement>('[data-preview]')!;
        const fg = stage.querySelector<HTMLInputElement>('[data-fg]')!;
        const bg = stage.querySelector<HTMLInputElement>('[data-bg]')!;
        const out = stage.querySelector<HTMLElement>('[data-ratio]')!;
        const verdict = stage.querySelector<HTMLElement>('[data-verdict]')!;
        const apply = () => {
          const r = ratio(fg.value, bg.value);
          preview.style.color = fg.value;
          preview.style.background = bg.value;
          out.textContent = `${r.toFixed(2)}:1`;
          const aa = r >= 4.5;
          const large = r >= 3;
          verdict.textContent = `AA body text ${aa ? 'passes' : 'fails'} (needs 4.5:1). Large text ${large ? 'passes' : 'fails'} (needs 3:1).`;
        };
        fg.addEventListener('input', apply);
        bg.addEventListener('input', apply);
        apply();
      },
      notes: { keyboard: 'Native colour inputs; the verdict is text, not colour only.' },
    },
    {
      ids: [426, 427],
      name: 'Reduced motion, demonstrated',
      summary: 'A toggle reproduces what the reduced-motion version does to this plate: the travelling dot becomes a still marker and the copy stays.',
      html: `<div class="d-motiondemo" data-motiondemo><div class="d-motiondemo__stage"><span class="d-motiondemo__dot" aria-hidden="true"></span></div><button type="button" class="d-chip" data-motion-toggle aria-pressed="false">Emulate reduced motion</button><p class="d-cap" data-motion-note>Full motion: the dot travels the loop.</p></div>`,
      init: ({ stage }) => {
        const root = stage.querySelector<HTMLElement>('[data-motiondemo]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
        const note = stage.querySelector<HTMLElement>('[data-motion-note]')!;
        btn.addEventListener('click', () => {
          const on = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!on));
          root.classList.toggle('is-reduced', !on);
          note.textContent = on ? 'Full motion: the dot travels the loop.' : 'Reduced: the dot is still, the text remains, and nothing is lost.';
        });
      },
      notes: { motion: 'The toggle shows the difference; the site obeys the OS setting.', keyboard: 'Button with pressed state.' },
    },
    {
      ids: [438, 440],
      name: 'The structure, written down',
      summary: 'The landmarks and headings this page exposes, in order. It is a reading of the DOM rather than a promise; the same structure is in the source.',
      html: `<div class="d-landmarks"><h4>Landmark order</h4><ol><li><code>header</code> — brand, menu, jump to section</li><li><code>main</code> — one h1, then h2 per chapter</li><li><code>nav</code> — primary, chapter rail, footer</li><li><code>footer</code> — contact, legal, sound</li><li><code>dialog</code> — menu, shortcuts, privacy, profile</li></ol><p class="d-cap">Check the source: every landmark is a real element, not a role added to a div.</p></div>`,
      notes: { motion: 'Static text.' },
    },
  ],
};
