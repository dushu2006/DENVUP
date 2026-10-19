import type { Lab } from './types';
import { copyText, typeText } from './helpers';

export const microLab: Lab = {
  slug: 'micro',
  title: 'Buttons & micro-interactions',
  blurb:
    'The small replies that make an interface feel inhabited: a fill, a press, a copied confirmation. Each one here does real work and has a focus state.',
  modes: [
    {
      ids: [51, 52, 53],
      name: 'Fill and swap',
      summary: 'The background wipes up from the bottom while the label swaps for its second half. Both labels are in the DOM; the second is hidden from assistive technology until the hover state ends.',
      html: `<div class="d-row d-center"><button type="button" class="d-btn d-btn--wipe" data-wipe><span class="d-btn__a">Start a project</span><span class="d-btn__b">Tell us the shape</span></button></div>`,
      init: ({ stage }) => {
        const btn = stage.querySelector<HTMLButtonElement>('[data-wipe]')!;
        btn.addEventListener('click', () => btn.classList.toggle('is-on'));
      },
      notes: { keyboard: 'Focus triggers the same fill; Enter keeps the pressed state.', motion: 'The fill switches instantly.' },
    },
    {
      ids: [54, 55, 56, 59],
      name: 'A button that tells the truth',
      summary: 'Idle → working → done, driven by a real two-second task. Press it again to reset. The state is announced, and the label never lies about what happened.',
      html: `<div class="d-row d-center"><button type="button" class="d-btn d-btn--solid" data-async><span data-async-label>Copy the brief</span></button><p class="d-cap" data-async-note aria-live="polite">Ready.</p></div>`,
      init: ({ stage, timeout }) => {
        const btn = stage.querySelector<HTMLButtonElement>('[data-async]')!;
        const label = stage.querySelector<HTMLElement>('[data-async-label]')!;
        const note = stage.querySelector<HTMLElement>('[data-async-note]')!;
        let state: 'idle' | 'busy' | 'done' = 'idle';
        btn.addEventListener('click', () => {
          if (state === 'busy') return;
          if (state === 'done') {
            state = 'idle';
            label.textContent = 'Copy the brief';
            note.textContent = 'Ready.';
            btn.removeAttribute('aria-busy');
            return;
          }
          state = 'busy';
          btn.setAttribute('aria-busy', 'true');
          btn.disabled = true;
          label.textContent = 'Working…';
          note.textContent = 'Doing the thing. The button is disabled while it happens.';
          timeout(() => {
            state = 'done';
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            label.textContent = 'Done — copy again';
            note.textContent = 'Finished. Nothing was actually uploaded; this is a local demo.';
          }, 1900);
        });
      },
      notes: { keyboard: 'Native disabled state during work; focus returns afterwards.', motion: 'No spinner; the words carry the state.' },
    },
    {
      ids: [73],
      name: 'A real switch',
      summary: 'A switch is a checkbox with a role: checked is announced, the state is visible without colour, and the hit area is the whole row.',
      html: `<div class="d-switchrow"><label class="d-switch"><input type="checkbox" data-switch checked><span class="d-switch__track" aria-hidden="true"></span><span class="d-switch__text"><b>Sound cues</b><small data-switch-note>On — small ticks only when you ask for them</small></span></label></div>`,
      init: ({ stage }) => {
        const input = stage.querySelector<HTMLInputElement>('[data-switch]')!;
        const note = stage.querySelector<HTMLElement>('[data-switch-note]')!;
        input.addEventListener('change', () => {
          note.textContent = input.checked ? 'On — small ticks only when you ask for them' : 'Off — the interface is silent';
        });
      },
      notes: { keyboard: 'Space toggles; the label wraps the input.' },
    },
    {
      ids: [74, 75, 76],
      name: 'Check, radio, choose',
      summary: 'Three custom controls that keep native inputs underneath. The visual layer is a sibling, so keyboard behaviour and form submission are unchanged.',
      html: `<div class="d-formdemo">
        <label class="d-check"><input type="checkbox" checked><span aria-hidden="true"></span>Content editing</label>
        <fieldset class="d-radios"><legend>Project type</legend>
          <label><input type="radio" name="d-type" value="landing" checked><span aria-hidden="true"></span>Landing page</label>
          <label><input type="radio" name="d-type" value="business"><span aria-hidden="true"></span>Business site</label>
        </fieldset>
        <p class="d-cap">These are real inputs inside real labels.</p>
      </div>`,
      notes: { keyboard: 'Tab and arrow keys behave exactly as the native controls do.' },
    },
    {
      ids: [57, 58],
      name: 'Ripple from the press point',
      summary: 'The ripple starts where the press happened, not in the centre. It is one absolutely-positioned span, removed when it finishes.',
      html: `<div class="d-ripple-zone" data-ripple-zone><button type="button" class="d-btn d-btn--solid" data-ripple>Press anywhere on me</button><p class="d-cap">The origin is measured from the pointer or from the centre for keyboard presses.</p></div>`,
      init: ({ stage }) => {
        const zone = stage.querySelector<HTMLElement>('[data-ripple-zone]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-ripple]')!;
        btn.addEventListener('pointerdown', (event) => {
          const r = btn.getBoundingClientRect();
          spawnRipple(btn, event.clientX - r.left, event.clientY - r.top);
        });
        btn.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          spawnRipple(btn, btn.clientWidth / 2, btn.clientHeight / 2);
        });
        function spawnRipple(target: HTMLElement, x: number, y: number) {
          const span = document.createElement('span');
          span.className = 'd-ripple';
          span.style.left = `${x}px`;
          span.style.top = `${y}px`;
          target.append(span);
          window.setTimeout(() => span.remove(), 620);
          zone.classList.add('is-used');
        }
      },
      notes: { keyboard: 'Enter or Space ripples from the middle.', touch: 'The press point is used, so the touch lands where the finger is.' },
    },
    {
      ids: [60, 61, 62, 64],
      name: 'Icon states',
      summary: 'One icon element rotates between menu and close, and the accessible name changes with it. The shape is two spans, not an image swap.',
      html: `<div class="d-row d-center"><button type="button" class="d-iconbtn" data-iconbtn aria-expanded="false" aria-label="Open the demo panel"><span aria-hidden="true"><i></i><i></i></span></button><p class="d-cap" data-iconnote>Closed</p></div>`,
      init: ({ stage }) => {
        const btn = stage.querySelector<HTMLButtonElement>('[data-iconbtn]')!;
        const note = stage.querySelector<HTMLElement>('[data-iconnote]')!;
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!open));
          btn.setAttribute('aria-label', open ? 'Open the demo panel' : 'Close the demo panel');
          btn.classList.toggle('is-on', !open);
          note.textContent = open ? 'Closed' : 'Open';
        });
      },
      notes: { keyboard: 'aria-expanded and aria-label change together.' },
    },
    {
      ids: [63, 65, 66, 67],
      name: 'Save with a count',
      summary: 'A save button that springs, updates a real number and can be undone. It demonstrates optimistic feedback without pretending to reach a server.',
      html: `<div class="d-row d-center"><button type="button" class="d-save" data-save aria-pressed="false"><span class="d-save__heart" aria-hidden="true">◇</span><span data-save-label>Save</span><span class="d-save__count" data-save-count>12</span></button><p class="d-cap" data-save-note>Twelve people saved this concept.</p></div>`,
      init: ({ stage }) => {
        const btn = stage.querySelector<HTMLButtonElement>('[data-save]')!;
        const label = stage.querySelector<HTMLElement>('[data-save-label]')!;
        const count = stage.querySelector<HTMLElement>('[data-save-count]')!;
        const note = stage.querySelector<HTMLElement>('[data-save-note]')!;
        let n = 12;
        btn.addEventListener('click', () => {
          const saved = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!saved));
          btn.classList.toggle('is-on', !saved);
          label.textContent = saved ? 'Save' : 'Saved';
          n += saved ? -1 : 1;
          count.textContent = String(n);
          note.textContent = saved ? `${n} people have saved this concept.` : `Saved locally. ${n} on this demo counter; no server was involved.`;
        });
      },
      notes: { keyboard: 'aria-pressed reports the state; the count is text.' },
    },
    {
      ids: [68, 69],
      name: 'Copy, actually',
      summary: 'The copy button uses the clipboard API and reports the result. If the clipboard is blocked, it says so and selects the text instead.',
      html: `<div class="d-copy"><code data-copy-src>denvupforyou@gmail.com</code><button type="button" class="d-chip" data-copy>Copy</button><p class="d-cap" data-copy-note aria-live="polite">Nothing copied yet.</p></div>`,
      init: ({ stage }) => {
        const src = stage.querySelector<HTMLElement>('[data-copy-src]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-copy]')!;
        const note = stage.querySelector<HTMLElement>('[data-copy-note]')!;
        btn.addEventListener('click', async () => {
          const ok = await copyText(src.textContent ?? '');
          note.textContent = ok ? 'Copied to the clipboard.' : 'The clipboard refused. The address is selectable above.';
        });
      },
      notes: { keyboard: 'A normal button; the result is announced.' },
    },
    {
      ids: [70, 71, 72, 77],
      name: 'A field that explains itself',
      summary: 'The label stays visible, the hint says what is expected and the error appears after blur rather than while typing. The field is validated for real.',
      html: `<form class="d-formdemo" data-miniform novalidate>
        <div class="d-field"><label for="mini-email">Email</label><input id="mini-email" name="email" type="email" placeholder="you@studio.com" aria-describedby="mini-hint mini-error"><p class="d-cap" id="mini-hint">We reply from denvupforyou@gmail.com.</p><p class="d-field__error" id="mini-error" data-mini-error hidden>That address is missing something. Check the @ and the dot.</p></div>
        <button class="d-btn d-btn--line" type="submit">Check</button>
        <p class="d-cap" data-mini-note aria-live="polite">Nothing submitted anywhere.</p>
      </form>`,
      init: ({ stage }) => {
        const form = stage.querySelector<HTMLFormElement>('[data-miniform]')!;
        const input = stage.querySelector<HTMLInputElement>('#mini-email')!;
        const error = stage.querySelector<HTMLElement>('[data-mini-error]')!;
        const note = stage.querySelector<HTMLElement>('[data-mini-note]')!;
        const validate = () => {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value);
          error.hidden = ok || !input.value;
          input.setAttribute('aria-invalid', String(!ok && Boolean(input.value)));
          return ok;
        };
        input.addEventListener('blur', validate);
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const ok = validate();
          note.textContent = ok ? 'That looks like an address. Still nothing was sent.' : 'The address needs work. Nothing was sent.';
        });
      },
      notes: { keyboard: 'Errors are linked with aria-describedby; the message is visible, not colour-only.' },
    },
    {
      ids: [81, 82, 83, 78, 79, 80],
      name: 'Text that writes itself',
      summary: 'A short typing routine with a visible caret and a pause button. The full sentence is exposed to assistive technology from the start.',
      html: `<div class="d-typewriter"><p class="d-statement"><span data-type></span><i class="d-caret" aria-hidden="true"></i></p><p class="sr-only">A website can be a place, not a brochure.</p><button type="button" class="d-chip" data-type-reset>Type it again</button></div>`,
      init: ({ stage, reduced, timeout }) => {
        const el = stage.querySelector<HTMLElement>('[data-type]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-type-reset]')!;
        let stop = () => {};
        const run = () => {
          stop();
          if (reduced) {
            el.textContent = 'A website can be a place, not a brochure.';
            return;
          }
          stop = typeText(el, 'A website can be a place, not a brochure.', 32);
        };
        run();
        btn.addEventListener('click', run);
        timeout(() => undefined, 0);
        return () => stop();
      },
      notes: { motion: 'Reduced motion prints the finished sentence at once.', keyboard: 'The replay button is reachable by Tab.' },
    },
    {
      ids: [84, 85, 86, 87],
      name: 'Pressure and depth',
      summary: 'A press state built from a shadow and a one-pixel translate. It reads as physical because the shadow changes, not because the button moves far.',
      html: `<div class="d-row d-center"><button type="button" class="d-press" data-press>Press and hold</button><p class="d-cap" data-press-note>Resting depth: 4 px</p></div>`,
      init: ({ stage }) => {
        const btn = stage.querySelector<HTMLButtonElement>('[data-press]')!;
        const note = stage.querySelector<HTMLElement>('[data-press-note]')!;
        const down = () => {
          btn.classList.add('is-down');
          note.textContent = 'Pressed: depth 1 px, shadow removed';
        };
        const up = () => {
          btn.classList.remove('is-down');
          note.textContent = 'Resting depth: 4 px';
        };
        btn.addEventListener('pointerdown', down);
        btn.addEventListener('pointerup', up);
        btn.addEventListener('pointerleave', up);
        btn.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') down();
        });
        btn.addEventListener('keyup', up);
      },
      notes: { keyboard: 'Space and Enter show the same pressed state.' },
    },
    {
      ids: [88, 89],
      name: 'A disabled state that explains',
      summary: 'The control is genuinely disabled, but the reason is written next to it and linked with aria-describedby. Nothing depends on a tooltip.',
      html: `<div class="d-formdemo"><label class="d-check"><input type="checkbox" data-gate><span aria-hidden="true"></span>I have read the scope</label><button type="button" class="d-btn d-btn--solid" data-gated disabled aria-describedby="gate-why">Continue</button><p class="d-cap" id="gate-why" data-gate-why>Disabled until the box is ticked.</p></div>`,
      init: ({ stage }) => {
        const box = stage.querySelector<HTMLInputElement>('[data-gate]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-gated]')!;
        const why = stage.querySelector<HTMLElement>('[data-gate-why]')!;
        box.addEventListener('change', () => {
          btn.disabled = !box.checked;
          why.textContent = box.checked ? 'Enabled. The button is still a demo and takes no payment.' : 'Disabled until the box is ticked.';
        });
      },
      notes: { keyboard: 'The reason is linked even while the control is disabled.' },
    },
  ],
};
