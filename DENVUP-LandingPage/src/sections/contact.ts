/**
 * The contact chapter.
 *
 * The form is honest: this site has no server, so it never claims to have
 * received anything. Submitting prepares a complete message and opens the
 * visitor's own mail application with it filled in, and the status line says
 * exactly that. Email and WhatsApp links work without the form.
 */

import { $, el, announce } from '../core/dom';
import { env } from '../core/env';
import { brand } from '../data/site';
import { gsap } from '../core/motion';
import { advance, register, reject, watchField, writeInto } from '../core/feedback';

const TYPES = [
  { id: 'website', label: 'A business website', hint: 'Multiple pages, something you can run.' },
  { id: 'landing', label: 'A landing page', hint: 'One page, one job.' },
  { id: 'motion', label: 'Motion and interaction', hint: 'A site that behaves like the idea.' },
  { id: 'other', label: 'Something else', hint: 'Tell us in the brief.' },
];

const SCOPES = [
  { id: 'small', label: 'Small', hint: 'A focused build.' },
  { id: 'medium', label: 'Medium', hint: 'A site with real content.' },
  { id: 'large', label: 'Large', hint: 'An application surface.' },
  { id: 'unsure', label: 'Not sure yet', hint: 'That is a normal place to start.' },
];

const FIELD_LABELS: Record<string, string> = {
  website: 'business website',
  landing: 'landing page',
  motion: 'motion and interaction work',
  other: 'project',
};

export function initContact(): () => void {
  const form = $<HTMLFormElement>('[data-enquiry]');
  if (!form) return () => {};

  const cleanups: (() => void)[] = [];
  const typeRoot = form.querySelector<HTMLElement>('[data-enquiry-type]');
  const scopeRoot = form.querySelector<HTMLElement>('[data-enquiry-scope]');
  const progress = form.querySelector<HTMLElement>('[data-enquiry-progress]');
  const backButton = form.querySelector<HTMLButtonElement>('[data-enquiry-back]');
  const nextButton = form.querySelector<HTMLButtonElement>('[data-enquiry-next]');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-enquiry-submit]');
  const status = form.querySelector<HTMLElement>('[data-enquiry-status]');
  const summary = document.querySelector<HTMLElement>('[data-contact-summary]');

  /*
   * A reference carried over from the laboratory. The visitor pressed
   * "I want this" on a technique, and the codes travel here in the query
   * string so the brief starts with what they actually asked for.
   */
  const carried = new URLSearchParams(window.location.search).get('ref');

  const state = {
    step: 0,
    type: '',
    scope: '',
    date: '',
    fileName: '',
    brief: '',
    lastSubmit: 0,
    honeypot: '',
  };

  const setStatus = (message: string) => {
    if (status) status.textContent = message;
  };

  /*
   * An error is a rule that wipes in under the offending field, not a
   * line of text that was always there. The field it belongs to is marked
   * too, so the connection between the message and the input is visible.
   */
  const setError = (name: string, message: string) => {
    const node = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (node) node.textContent = message;
    if (!message) return;
    const owner =
      form.querySelector<HTMLElement>(`[data-field-for="${name}"]`) ??
      node?.closest<HTMLElement>('.field, .enquiry__choices');
    if (owner) reject(owner);
  };

  /*
   * Put the carried reference into the brief. It is written visibly, like
   * every other thing that arrives in this form, and it is written after
   * the boot sequence so the visitor sees it arrive rather than finding
   * it already there.
   */
  if (carried) {
    const brief = form.querySelector<HTMLTextAreaElement>('#enquiry-brief');
    if (brief) {
      const sentence = `I would like ${carried} — on my site.`;
      window.setTimeout(() => {
        writeInto(brief, sentence, () => {
          announce(`${carried} carried into your brief.`);
        });
      }, 900);
    }
  }

  /*
   * ------------------------------------------------------------------
   * The fields report themselves
   * ------------------------------------------------------------------
   *
   * Typing is an action a visitor performs hundreds of times, and the
   * motion reference is blunt about it: things seen hundreds of times get
   * no animation at all. So a field's acknowledgement is a *state* — a
   * mark drawn once when the field first holds something that reads
   * correctly — and a number that changes as the brief grows.
   *
   * The mark never animates on a keystroke, so the form stays calm no
   * matter how long the visitor writes.
   */
  const fieldRow = (field: HTMLElement): { row: HTMLElement; mark: HTMLElement } | null => {
    const label = field.id
      ? (form.querySelector<HTMLElement>(`label[for="${field.id}"]`) ?? null)
      : null;
    if (!label) return null;
    const row = el('div', 'field__row');
    const mark = el('span', 'field__mark');
    label.parentElement?.insertBefore(row, label);
    row.append(label, mark);
    return { row, mark };
  };

  const nameField = form.querySelector<HTMLInputElement>('#enquiry-name');
  const emailField = form.querySelector<HTMLInputElement>('#enquiry-email');
  const briefField = form.querySelector<HTMLTextAreaElement>('#enquiry-brief');

  if (nameField) {
    const { mark } = fieldRow(nameField) ?? {};
    cleanups.push(watchField(nameField, mark ? { mark } : {}));
  }

  if (emailField) {
    const { mark } = fieldRow(emailField) ?? {};
    /*
     * An address only counts as written once it looks like one. The mark
     * means "this reads back to you", so it must not appear on a
     * half-typed address.
     */
    cleanups.push(
      watchField(emailField, {
        valid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value),
        ...(mark ? { mark } : {}),
      }),
    );
  }

  if (briefField) {
    const { row, mark } = fieldRow(briefField) ?? {};
    /*
     * The count is a reading, not a decoration: it tells the visitor how
     * much they have written, which is the one thing a blank brief box
     * cannot tell them.
     */
    const counter = el('span', 'field__count');
    row?.append(counter);

    const countWords = (): void => {
      const text = briefField.value.trim();
      if (!text) {
        counter.textContent = '';
        return;
      }
      const words = text.split(/\s+/).length;
      counter.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
    };

    briefField.addEventListener('input', countWords);
    countWords();
    cleanups.push(() => briefField.removeEventListener('input', countWords));
    cleanups.push(watchField(briefField, mark ? { mark } : {}));
  }

  const clearErrors = () => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((node) => {
      node.textContent = '';
    });
  };

  const updateSummary = () => {
    if (!summary) return;
    const parts: string[] = [];
    if (state.type) parts.push(`Project: ${FIELD_LABELS[state.type] ?? state.type}`);
    if (state.scope) parts.push(`Scope: ${state.scope}`);
    if (state.date) parts.push(`Preferred start: ${state.date}`);
    if (state.fileName) parts.push(`Reference file: ${state.fileName}`);
    summary.innerHTML = '';
    if (!parts.length) {
      const p = el('p');
      p.textContent = 'No project selected yet — the enquiry form below starts from a blank brief.';
      summary.appendChild(p);
      return;
    }
    const p = el('p');
    p.textContent = `You have selected — ${parts.join(' · ')}.`;
    summary.appendChild(p);
    /*
     * The summary is the running record of the visitor's choices, so a new
     * choice has to be *seen* to land there. It settles in rather than
     * replacing the line underneath it.
     */
    if (!env.reducedMotion) {
      gsap.fromTo(
        p,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' },
      );
    }
  };

  // ------------------------------------------------------------------ //
  // Choices
  // ------------------------------------------------------------------ //
  const buildChoices = (
    host: HTMLElement,
    options: { id: string; label: string; hint: string }[],
    onPick: (id: string) => void,
  ) => {
    options.forEach((option) => {
      const label = el('label', 'enquiry__choice');
      const input = el('input');
      input.type = 'radio';
      /*
       * The group name lives on the host, not on the label. Reading it from
       * the label gave every radio in the form the same empty name, which
       * merged the "project" and "scope" questions into one group — a
       * screen reader could not tell the two questions apart, and answering
       * one could clear the other.
       */
      input.name = host.dataset.group ?? 'enquiry';
      input.value = option.id;
      const text = el('span', 'enquiry__choice-text');
      const title = el('b');
      title.textContent = option.label;
      const hint = el('small');
      hint.textContent = option.hint;
      text.append(title, hint);
      label.append(input, text);
      host.appendChild(label);
      input.addEventListener('change', () => {
        if (!input.checked) return;
        host.querySelectorAll('.enquiry__choice').forEach((node) => {
          node.classList.remove('is-picked', 'is-registered');
        });
        label.classList.add('is-picked');
        /* The choice traces itself, so the picked row is unmistakable. */
        register(label);
        if (!env.reducedMotion) {
          /*
           * The old curve was `back.out(2)` — a 20 % overshoot with a
           * visible bounce, which the motion reference names as a
           * giveaway. The row now eases in and stops.
           */
          gsap.fromTo(
            text,
            { scale: 0.97 },
            { scale: 1, duration: 0.24, ease: 'power3.out' },
          );
        }
        onPick(option.id);
      });
    });
  };

  if (typeRoot) {
    typeRoot.dataset.group = 'enquiry-type';
    buildChoices(typeRoot, TYPES, (id) => {
      state.type = id;
      setError('type', '');
      updateSummary();
    });
  }

  if (scopeRoot) {
    scopeRoot.dataset.group = 'enquiry-scope';
    buildChoices(scopeRoot, SCOPES, (id) => {
      state.scope = id;
      setError('scope', '');
      updateSummary();
    });
  }

  // ------------------------------------------------------------------ //
  // Step 2 extras: preferred date, reference file, honeypot
  // ------------------------------------------------------------------ //
  const step2 = form.querySelector<HTMLElement>('[data-step="2"]');
  if (step2) {
    const fields = step2.querySelector<HTMLElement>('.enquiry__fields');
    if (fields) {
      const dateField = el('div', 'field');
      const dateLabel = el('label');
      dateLabel.htmlFor = 'enquiry-date';
      dateLabel.innerHTML = 'Preferred start <span class="field__optional">optional</span>';
      const dateInput = el('input');
      dateInput.type = 'date';
      dateInput.id = 'enquiry-date';
      dateInput.name = 'date';
      const dateError = el('p', 'field__error');
      dateError.dataset.errorFor = 'date';
      dateError.setAttribute('role', 'alert');
      dateField.append(dateLabel, dateInput, dateError);
      fields.appendChild(dateField);

      dateInput.addEventListener('change', () => {
        state.date = dateInput.value;
        dateError.textContent = '';
        updateSummary();
      });

      // A drop zone that accepts a local file and says plainly that nothing
      // is uploaded anywhere.
      const dropField = el('div', 'field field--wide');
      const dropLabel = el('span', 'field__label-like');
      dropLabel.textContent = 'Reference file (optional)';
      const drop = el('div', 'enquiry__drop');
      drop.setAttribute('role', 'button');
      drop.setAttribute('tabindex', '0');
      drop.innerHTML = `<span class="enquiry__drop-text">Choose a file or drop one here</span><small class="enquiry__drop-note">It stays on your device. Nothing is uploaded — attach it to the email yourself.</small>`;
      const fileInput = el('input');
      fileInput.type = 'file';
      fileInput.className = 'visually-hidden';
      fileInput.id = 'enquiry-file';
      drop.appendChild(fileInput);
      const fileName = el('p', 'enquiry__file-name');
      dropField.append(dropLabel, drop, fileInput, fileName);

      const acceptFile = (file: File | undefined) => {
        if (!file) return;
        state.fileName = file.name;
        fileName.textContent = `Ready to attach: ${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`;
        drop.classList.add('has-file');
        updateSummary();
      };
      fileInput.addEventListener('change', () => acceptFile(fileInput.files?.[0]));
      drop.addEventListener('click', () => fileInput.click());
      drop.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          fileInput.click();
        }
      });
      drop.addEventListener('dragover', (event) => {
        event.preventDefault();
        drop.classList.add('is-over');
      });
      drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
      drop.addEventListener('drop', (event) => {
        event.preventDefault();
        drop.classList.remove('is-over');
        acceptFile(event.dataTransfer?.files?.[0]);
      });
      fields.appendChild(dropField);

      // Honeypot: real visitors never see it, bots sometimes fill it.
      const honey = el('div', 'enquiry__honeypot');
      const honeyInput = el('input');
      honeyInput.type = 'text';
      honeyInput.name = 'company';
      honeyInput.tabIndex = -1;
      honeyInput.autocomplete = 'off';
      honey.setAttribute('aria-hidden', 'true');
      honey.append(honeyInput);
      step2.appendChild(honey);
      honeyInput.addEventListener('input', () => {
        state.honeypot = honeyInput.value;
      });
    }
  }

  // ------------------------------------------------------------------ //
  // Step navigation
  // ------------------------------------------------------------------ //
  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-step]'));

  /*
   * The steps used to appear and vanish with `hidden`, which is an
   * instant state change: the visitor pressed a button and a different
   * set of questions simply replaced the old ones. They now travel, so the
   * form reads as one continuous surface being turned rather than three
   * separate screens.
   */
  const showStep = (index: number) => {
    const previous = state.step;
    const direction: 1 | -1 = index >= previous ? 1 : -1;
    state.step = index;
    steps.forEach((step, i) => {
      if (i !== index) step.hidden = true;
    });
    const incoming = steps[index];
    if (incoming) {
      const outgoing = previous === index ? null : steps[previous];
      advance(outgoing, incoming, direction);
    }
    progress?.querySelectorAll('li').forEach((li, i) => {
      if (i === index) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
      li.classList.toggle('is-done', i < index);
    });
    if (backButton) backButton.hidden = index === 0;
    if (nextButton) nextButton.hidden = index === steps.length - 1;
    if (submitButton) submitButton.hidden = index !== steps.length - 1;
  };

  const validateStep = (index: number): boolean => {
    clearErrors();
    if (index === 0 && !state.type) {
      setError('type', 'Choose what you are building so the brief starts in the right place.');
      return false;
    }
    if (index === 1 && !state.scope) {
      setError('scope', 'Pick the closest size. “Not sure yet” is a valid answer.');
      return false;
    }
    if (index === 2) {
      const name = form.querySelector<HTMLInputElement>('#enquiry-name');
      const email = form.querySelector<HTMLInputElement>('#enquiry-email');
      const date = form.querySelector<HTMLInputElement>('#enquiry-date');
      let valid = true;

      if (!name?.value.trim()) {
        setError('name', 'Tell us your name so we know who we are replying to.');
        valid = false;
      }
      if (!email?.value.trim()) {
        setError('email', 'We need an email address to reply to.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError('email', 'That does not look like a complete email address — check for a missing @ or domain.');
        valid = false;
      }
      if (date?.value) {
        const chosen = new Date(date.value);
        const today = new Date();
        if (Number.isNaN(chosen.getTime())) {
          setError('date', 'That date could not be read. Pick it again from the calendar.');
          valid = false;
        } else if (chosen < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
          setError('date', 'That date is in the past. Choose today or a future date.');
          valid = false;
        }
      }
      if (!valid) {
        setError('form', 'Some details still need attention — the messages above say what.');
        const firstInvalid = form.querySelector<HTMLElement>('.field__error:not(:empty), .enquiry__error:not(:empty)');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
    return true;
  };

  nextButton?.addEventListener('click', () => {
    if (!validateStep(state.step)) return;
    showStep(Math.min(steps.length - 1, state.step + 1));
    setStatus('');
  });

  backButton?.addEventListener('click', () => {
    showStep(Math.max(0, state.step - 1));
    setStatus('');
  });

  // ------------------------------------------------------------------ //
  // Submit — honest, no fake success
  // ------------------------------------------------------------------ //
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep(2)) return;

    if (state.honeypot) {
      setStatus('We could not send that. Please email us directly.');
      return;
    }

    // A light rate guard so a stuck key cannot open a hundred mail drafts.
    const now = Date.now();
    if (now - state.lastSubmit < 4000) {
      setStatus('That was a moment ago. Give it a few seconds, or email us directly.');
      return;
    }
    state.lastSubmit = now;

    const name = form.querySelector<HTMLInputElement>('#enquiry-name')?.value.trim() ?? '';
    const email = form.querySelector<HTMLInputElement>('#enquiry-email')?.value.trim() ?? '';
    const brief = form.querySelector<HTMLTextAreaElement>('#enquiry-brief')?.value.trim() ?? '';
    state.brief = brief;

    const lines = [
      `Project: ${FIELD_LABELS[state.type] ?? state.type}`,
      `Scope: ${state.scope}`,
      state.date ? `Preferred start: ${state.date}` : '',
      state.fileName ? `Reference file (attach separately): ${state.fileName}` : '',
      '',
      'Brief:',
      brief || '(not written yet)',
      '',
      `Reply to: ${name} <${email}>`,
    ].filter(Boolean);

    const subject = `Project enquiry — ${FIELD_LABELS[state.type] ?? 'new project'} from ${name}`;
    const href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join('\n'),
    )}`;

    submitButton?.classList.add('is-busy');
    setStatus('Preparing your mail draft…');
    if (submitButton) submitButton.disabled = true;

    window.setTimeout(() => {
      window.location.href = href;
      submitButton?.classList.remove('is-busy');
      if (submitButton) submitButton.disabled = false;
      setStatus(
        'Your mail app should be opening with the brief filled in. Nothing was sent from this page — if no window opened, email ' +
          brand.email +
          ' directly, or use WhatsApp.',
      );
    }, 320);
  });

  // ------------------------------------------------------------------ //
  // WhatsApp with a prefilled message
  // ------------------------------------------------------------------ //
  const whatsappMessage = encodeURIComponent(
    'Hello DENVUP — I would like to talk about a project. Here is what I have in mind: ',
  );
  document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((link) => {
    const base = link.getAttribute('href') ?? '';
    if (!base.includes('?text=')) {
      link.setAttribute('href', `${base}?text=${whatsappMessage}`);
    }
  });

  showStep(0);
  updateSummary();

  return () => cleanups.forEach((fn) => fn());
}
