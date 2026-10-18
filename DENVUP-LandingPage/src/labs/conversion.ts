import type { Lab } from './types';
import { brand, pricing, waLink } from '../content/site';

const inr = new Intl.NumberFormat('en-IN');

export const conversionLab: Lab = {
  slug: 'conversion',
  title: 'Conversion & enquiry',
  blurb:
    'Enquiry patterns that stay honest: real arithmetic, a visible next step, no fake urgency and no success message without a real submission.',
  modes: [
    {
      ids: [359, 360],
      name: 'A small scope estimate',
      summary: 'Choose a type and a motion level; the total is computed from the same data as the pricing section. It is labelled an estimate, not a quote.',
      html: `<div class="d-miniestimator" data-estimator>
        <div class="d-stack" role="group" aria-label="Project type">
          ${pricing.estimator.types.map((t, i) => `<label class="d-radio"><input type="radio" name="mini-type" value="${t.key}" ${i === 0 ? 'checked' : ''} data-est-type><span aria-hidden="true"></span>${t.label}</label>`).join('')}
        </div>
        <div class="d-stack" role="group" aria-label="Motion level">
          ${pricing.estimator.motionOptions.map((m, i) => `<label class="d-radio"><input type="radio" name="mini-motion" value="${m.add}" ${i === 0 ? 'checked' : ''} data-est-motion><span aria-hidden="true"></span>${m.label}${m.add ? ` · +₹${inr.format(m.add)}` : ''}</label>`).join('')}
        </div>
        <p class="d-h">₹<span data-est-total>${inr.format(pricing.estimator.types[0]!.base)}</span></p>
        <p class="d-cap" data-est-note aria-live="polite">Starting point: landing page, clean and calm.</p>
        <a class="d-btn d-btn--solid" href="${waLink(brand.phones[0], 'Hello DENVUP — I used the scope estimate on your site.')}" target="_blank" rel="noopener noreferrer" data-est-link>Send this shape on WhatsApp</a>
      </div>`,
      init: ({ stage }) => {
        const types = [...stage.querySelectorAll<HTMLInputElement>('[data-est-type]')];
        const motions = [...stage.querySelectorAll<HTMLInputElement>('[data-est-motion]')];
        const total = stage.querySelector<HTMLElement>('[data-est-total]')!;
        const note = stage.querySelector<HTMLElement>('[data-est-note]')!;
        const link = stage.querySelector<HTMLAnchorElement>('[data-est-link]')!;
        const paint = () => {
          const type = pricing.estimator.types.find((t) => t.key === types.find((i) => i.checked)?.value) ?? pricing.estimator.types[0]!;
          const motion = pricing.estimator.motionOptions.find((m) => String(m.add) === motions.find((i) => i.checked)?.value) ?? pricing.estimator.motionOptions[0]!;
          const value = type.base + motion.add;
          total.textContent = inr.format(value);
          note.textContent = `Starting point: ${type.label.toLowerCase()}, ${motion.label.toLowerCase()}. Third-party costs are separate.`;
          link.href = waLink(brand.phones[0], `Hello DENVUP — I used the scope estimate on your site.\n\nEstimate: ₹${inr.format(value)} — ${type.label}, ${motion.label}\n\nWhat I am making: `);
        };
        [...types, ...motions].forEach((input) => input.addEventListener('change', paint));
        paint();
      },
      notes: { keyboard: 'Native radios; arrow keys change the group.', motion: 'No counting animation; the number changes at once.' },
    },
    {
      ids: [369, 372, 380],
      name: 'A form that tells the truth',
      summary: 'This demo form has no endpoint. On submit it says plainly that nothing was sent and offers email and WhatsApp. It never shows a false success.',
      html: `<form class="d-demoform" data-demoform novalidate>
        <div class="d-field"><label for="df-name">Name</label><input id="df-name" name="name" autocomplete="name" required></div>
        <div class="d-field"><label for="df-email">Email</label><input id="df-email" name="email" type="email" autocomplete="email" required></div>
        <div class="d-field"><label for="df-note">What are you making?</label><textarea id="df-note" name="note" rows="3" required></textarea></div>
        <button class="d-btn d-btn--solid" type="submit">Send enquiry</button>
        <p class="d-cap" data-demoform-status aria-live="polite">Nothing sent yet.</p>
      </form>`,
      init: ({ stage }) => {
        const form = stage.querySelector<HTMLFormElement>('[data-demoform]')!;
        const status = stage.querySelector<HTMLElement>('[data-demoform-status]')!;
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const data = new FormData(form);
          const name = String(data.get('name') ?? '').trim();
          const email = String(data.get('email') ?? '').trim();
          const note = String(data.get('note') ?? '').trim();
          if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || note.length < 10) {
            status.textContent = 'Check the name, email and note. Nothing was sent.';
            return;
          }
          status.textContent = 'Nothing was sent: this demo has no server endpoint. Email denvupforyou@gmail.com or message +91 76759 93371 and it will reach the studio.';
        });
      },
      notes: { keyboard: 'Labels and native validation semantics; the status is live.', motion: 'No spinner; text carries the state.' },
    },
    {
      ids: [375, 376],
      name: 'A next step you can see',
      summary: 'A sticky enquiry bar appears after the pricing content and hides again at the contact form, so it never double-covers the real action.',
      html: `<div class="d-stickycta"><div class="d-stickycta__bar"><span>Scope, price, sequence — in one conversation.</span><a class="d-btn d-btn--solid" href="#contact">Start a project</a><button type="button" class="d-chip" data-sticky-dismiss aria-label="Dismiss this demo bar">Dismiss</button></div><p class="d-cap" data-sticky-note>Visible until the real contact section.</p></div>`,
      init: ({ stage }) => {
        const bar = stage.querySelector<HTMLElement>('.d-stickycta__bar')!;
        const note = stage.querySelector<HTMLElement>('[data-sticky-note]')!;
        stage.querySelector('[data-sticky-dismiss]')!.addEventListener('click', () => {
          bar.hidden = true;
          note.textContent = 'Dismissed by the reader. It does not come back in this demo.';
        });
      },
      notes: { keyboard: 'The dismiss control is a labelled button.' },
    },
    {
      ids: [361, 363],
      name: 'Objections, answered',
      summary: 'Three real objections with direct answers and no scarcity language. The details elements work without JavaScript.',
      html: `<div class="d-objections">${[
        ['What does “starting price” leave out?', 'Scope beyond the written brief, third-party licences, hosting, domains and paid media. Those are named in the proposal before work starts.'],
        ['Do we need to have the words ready?', 'No. Content structuring can be part of the scope. You do need to be available for the decisions only you can make.'],
        ['What happens after launch?', 'A handover with files, notes and a walkthrough. Ongoing support is a separate, optional arrangement.'],
      ].map(([q, a]) => `<details class="d-objection"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`,
      notes: { keyboard: 'Native details/summary, keyboard operable.' },
    },
    {
      ids: [365, 366],
      name: 'A step form that can go back',
      summary: 'Three short steps with a visible count and a working Back button. Values survive a step change because the inputs are not destroyed.',
      html: `<div class="d-stepper" data-stepper><div class="d-stepper__bar"><i data-step-bar></i></div><div class="d-stepper__step" data-step-index="0"><label class="d-field"><span>What are you making?</span><input data-step-input="making" placeholder="A studio site, a launch page…"></label><button type="button" class="d-btn d-btn--solid" data-step-next>Next</button></div><div class="d-stepper__step" data-step-index="1" hidden><label class="d-field"><span>When should it be live?</span><input data-step-input="when" placeholder="Before the end of the year"></label><div class="d-row"><button type="button" class="d-chip" data-step-back>Back</button><button type="button" class="d-btn d-btn--solid" data-step-next>Next</button></div></div><div class="d-stepper__step" data-step-index="2" hidden><label class="d-field"><span>Anything else?</span><input data-step-input="extra" placeholder="A must-have, a constraint, a link"></label><div class="d-row"><button type="button" class="d-chip" data-step-back>Back</button><button type="button" class="d-btn d-btn--solid" data-step-finish>Review</button></div></div><p class="d-cap" data-step-note aria-live="polite">Step 1 of 3</p><div class="d-step-result" data-step-result hidden></div></div>`,
      init: ({ stage }) => {
        const steps = [...stage.querySelectorAll<HTMLElement>('[data-step-index]')];
        const bar = stage.querySelector<HTMLElement>('[data-step-bar]')!;
        const note = stage.querySelector<HTMLElement>('[data-step-note]')!;
        const result = stage.querySelector<HTMLElement>('[data-step-result]')!;
        const values: Record<string, string> = {};
        let index = 0;
        const paint = () => {
          steps.forEach((s, i) => (s.hidden = i !== index));
          bar.style.transform = `scaleX(${(index + 1) / steps.length})`;
          note.textContent = `Step ${index + 1} of ${steps.length}`;
          if (index === steps.length - 1) result.hidden = true;
        };
        const next = () => {
          const input = steps[index]?.querySelector<HTMLInputElement>('[data-step-input]');
          if (input) values[input.dataset.stepInput ?? ''] = input.value.trim();
          index = Math.min(steps.length - 1, index + 1);
          paint();
        };
        stage.querySelectorAll('[data-step-next]').forEach((btn) => btn.addEventListener('click', next));
        stage.querySelectorAll('[data-step-back]').forEach((btn) =>
          btn.addEventListener('click', () => {
            index = Math.max(0, index - 1);
            paint();
          }),
        );
        stage.querySelector('[data-step-finish]')!.addEventListener('click', () => {
          const extra = stage.querySelector<HTMLInputElement>('[data-step-input="extra"]');
          if (extra) values.extra = extra.value.trim();
          result.hidden = false;
          result.replaceChildren();
          const title = document.createElement('p');
          title.className = 'd-h';
          title.textContent = 'This is what we have.';
          const list = document.createElement('dl');
          Object.entries(values).forEach(([key, value]) => {
            if (!value) return;
            const dt = document.createElement('dt');
            dt.textContent = key;
            const dd = document.createElement('dd');
            dd.textContent = value;
            list.append(dt, dd);
          });
          const link = document.createElement('a');
          link.className = 'd-btn d-btn--solid';
          link.href = waLink(
            brand.phones[0],
            `Hello DENVUP — I answered the three-step brief.\n\nWhat I am making: ${values.making ?? ''}\nWhen: ${values.when ?? ''}\nAnything else: ${values.extra ?? ''}`,
          );
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Send this on WhatsApp';
          const restart = document.createElement('button');
          restart.type = 'button';
          restart.className = 'd-chip';
          restart.textContent = 'Start again';
          restart.addEventListener('click', () => {
            index = 0;
            Object.keys(values).forEach((k) => delete values[k]);
            stage.querySelectorAll<HTMLInputElement>('[data-step-input]').forEach((input) => (input.value = ''));
            result.hidden = true;
            paint();
          });
          result.append(title, list, link, restart);
          note.textContent = 'Review shown. Nothing sent.';
        });
        paint();
      },
      notes: { keyboard: 'Buttons only; no swipe. Focus is not trapped.', motion: 'Step changes are instant.' },
    },
    {
      ids: [373, 374],
      name: 'Routes, not a funnel',
      summary: 'Three contact routes with the real details, encoded correctly. Each opens the visitor’s own application; this page never pretends to send anything.',
      html: `<div class="d-routes"><a class="d-route" href="mailto:${brand.email}"><b>Email</b><span>${brand.email}</span></a><a class="d-route" href="${waLink(brand.phones[0], 'Hello DENVUP — I would like to talk about a project.')}" target="_blank" rel="noopener noreferrer"><b>WhatsApp</b><span>${brand.phones[0].display}</span></a><a class="d-route" href="tel:${brand.phones[1].e164}"><b>Call</b><span>${brand.phones[1].display}</span></a></div><p class="d-cap">No form required for any of these.</p>`,
      notes: { keyboard: 'Real links; all three are in the tab order.' },
    },
    {
      ids: [380],
      name: 'Nothing dark',
      summary: 'A short list of the patterns this site refuses: fake countdowns, invented scarcity and pre-ticked consent. The copy is the demo.',
      html: `<div class="d-nodark"><h4>Not used here</h4><ul><li>No invented countdown or “three slots left”.</li><li>No pre-ticked consent or hidden subscription.</li><li>No success message without a real submission.</li><li>No fake testimonials, ratings or client logos.</li></ul><p class="d-cap">If a pattern only works by misleading someone, it is not a pattern worth shipping.</p></div>`,
      notes: { motion: 'Static text.' },
    },
  ],
};
