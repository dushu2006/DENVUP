import { brand, pricing, waLink } from '../content/site';
import { $, $$, formatINR, on, prefersReduced, toast } from './env';

/* ---------------------------------------------------------------- estimator */

interface Quote {
  total: number;
  summary: string;
}

function readQuote(form: HTMLElement): Quote {
  const typeKey = (form.querySelector<HTMLInputElement>('input[name="est-type"]:checked')?.value ?? 'landing') as string;
  const pageKey = form.querySelector<HTMLInputElement>('input[name="est-pages"]:checked')?.value ?? 'three-five';
  const motionKey = form.querySelector<HTMLInputElement>('input[name="est-motion"]:checked')?.value ?? 'standard';
  const extras = $$<HTMLInputElement>('input[name="est-extra"]:checked', form).map((i) => i.value);

  const type = pricing.estimator.types.find((t) => t.key === typeKey) ?? pricing.estimator.types[0];
  const pages = pricing.estimator.pageOptions.find((p) => p.key === pageKey) ?? pricing.estimator.pageOptions[0];
  const motion = pricing.estimator.motionOptions.find((m) => m.key === motionKey) ?? pricing.estimator.motionOptions[0];
  const extraRows = pricing.estimator.extraOptions.filter((e) => extras.includes(e.key));

  const total = type.base + pages.add + motion.add + extraRows.reduce((sum, e) => sum + e.add, 0);
  const summary = [
    type.label,
    pages.label.toLowerCase(),
    motion.label.toLowerCase(),
    ...extraRows.map((e) => e.label.toLowerCase()),
  ].join(' · ');
  return { total, summary };
}

function initEstimator(): void {
  const root = $<HTMLElement>('[data-estimator]');
  const form = $<HTMLElement>('[data-estimator-form]');
  const out = $<HTMLElement>('[data-est-output]');
  const detail = $<HTMLElement>('[data-est-detail]');
  const cta = $<HTMLAnchorElement>('[data-est-cta]');
  if (!root || !form || !out || !detail) return;

  let quote = readQuote(form);

  const paint = () => {
    quote = readQuote(form);
    out.textContent = quote.total.toLocaleString('en-IN');
    detail.textContent = quote.summary;
    if (cta) {
      cta.dataset.summary = quote.summary;
      cta.dataset.total = String(quote.total);
    }
  };

  form.addEventListener('input', paint);
  form.addEventListener('change', paint);
  paint();

  cta?.addEventListener('click', () => {
    const message = $<HTMLTextAreaElement>('#f-message');
    if (message) {
      message.value = `Hello DENVUP — I used the scope estimate on your site.\n\nEstimate: ${formatINR(quote.total)} — ${quote.summary}\n\nWhat I am making: \nTimeline: `;
      message.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const budget = $<HTMLSelectElement>('#f-budget');
    if (budget) {
      const option = [...budget.options].find((o) => o.textContent?.toLowerCase().includes('not sure'));
      if (option) budget.value = option.value;
    }
    toast(`Estimate ${formatINR(quote.total)} added to the enquiry. It is still not a quote.`);
  });
}

/* -------------------------------------------------------------------- FAQ */

function initFaq(): void {
  const input = $<HTMLInputElement>('[data-faq-search]');
  const clear = $<HTMLButtonElement>('[data-faq-clear]');
  const empty = $<HTMLElement>('[data-faq-empty]');
  const items = $$<HTMLDetailsElement>('[data-faq-item]');
  const tags = $$<HTMLButtonElement>('[data-faq-tag]');
  if (!input || !items.length) return;

  let tag = 'all';

  const filter = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() ?? '';
      const tagList = (item.dataset.tags ?? '').toLowerCase().split(/\s+/);
      const matchText = !q || text.includes(q);
      const matchTag = tag === 'all' || tagList.includes(tag.toLowerCase());
      const show = matchText && matchTag;
      item.hidden = !show;
      if (show) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;
    if (clear) clear.hidden = !q;
  };

  on(input, 'input', filter, { passive: true });
  clear?.addEventListener('click', () => {
    input.value = '';
    filter();
    input.focus();
  });
  tags.forEach((btn) => {
    btn.addEventListener('click', () => {
      tag = btn.dataset.faqTag ?? 'all';
      tags.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      filter();
    });
  });
}

/* ----------------------------------------------------------------- enquiry */

interface FieldError {
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  message: string;
}

function initEnquiry(): void {
  const form = $<HTMLFormElement>('[data-enquiry]');
  if (!form) return;
  const status = $<HTMLElement>('[data-form-status]', form);
  const summary = $<HTMLElement>('[data-error-summary]', form);
  const fallback = $<HTMLElement>('[data-enquiry-fallback]', form);
  const submit = $<HTMLButtonElement>('[data-submit]', form);
  const emailBtn = $<HTMLButtonElement>('[data-enquiry-email]', form);
  const message = $<HTMLTextAreaElement>('#f-message', form);
  const counter = $<HTMLElement>('[data-message-count]', form);

  const payload = (): Record<string, string> => {
    const data = new FormData(form);
    const out: Record<string, string> = {};
    data.forEach((value, key) => {
      if (typeof value === 'string') out[key] = value;
    });
    return out;
  };

  const setStatus = (text: string, error = false) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = text;
    status.classList.add('is-on');
    status.classList.toggle('is-error', error);
  };

  const clearErrors = () => {
    $$<HTMLElement>('[data-error-for]', form).forEach((el) => {
      el.hidden = true;
      el.textContent = '';
    });
    $$<HTMLElement>('[aria-invalid="true"]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    if (summary) {
      summary.hidden = true;
      summary.replaceChildren();
    }
  };

  const showErrors = (errors: FieldError[]) => {
    errors.forEach(({ field, message: text }) => {
      field.setAttribute('aria-invalid', 'true');
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${field.name}"]`);
      if (slot) {
        slot.hidden = false;
        slot.textContent = text;
      }
    });
    if (summary) {
      summary.hidden = false;
      summary.replaceChildren();
      const intro = document.createElement('p');
      intro.textContent = `Check ${errors.length} field${errors.length === 1 ? '' : 's'}:`;
      const list = document.createElement('ul');
      errors.forEach(({ field, message: text }) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${field.id}`;
        link.textContent = `${field.name === 'consent' ? 'Consent' : field.name} — ${text}`;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          field.focus();
        });
        li.append(link);
        list.append(li);
      });
      summary.append(intro, list);
      summary.focus({ preventScroll: true });
    }
    errors[0]?.field.focus();
  };

  const validate = (data: Record<string, string>): FieldError[] => {
    const errors: FieldError[] = [];
    const name = form.elements.namedItem('name') as HTMLInputElement | null;
    const email = form.elements.namedItem('email') as HTMLInputElement | null;
    const project = form.elements.namedItem('project') as HTMLSelectElement | null;
    const consent = form.elements.namedItem('consent') as HTMLInputElement | null;
    if (!data.name || data.name.trim().length < 2) errors.push({ field: name!, message: 'Please add your name.' });
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      errors.push({ field: email!, message: 'Please add a valid email address.' });
    }
    if (!data.project) errors.push({ field: project!, message: 'Choose the closest project type.' });
    if (!data.message || data.message.trim().length < 10) {
      errors.push({ field: message!, message: 'A sentence about the project, at least ten characters.' });
    }
    if (!consent?.checked) errors.push({ field: consent!, message: 'Please confirm we may reply to your enquiry.' });
    return errors;
  };

  const mailBody = () => {
    const data = payload();
    return `Hello DENVUP — I would like to talk about a project.\n\nName: ${data.name ?? ''}\nEmail: ${data.email ?? ''}\nPhone: ${data.phone ?? ''}\nProject: ${data.project ?? ''}\nBudget: ${data.budget ?? ''}\n\n${data.message ?? ''}`;
  };

  on(message ?? form, 'input', () => {
    if (counter && message) counter.textContent = String(message.value.length);
  }, { passive: true });

  emailBtn?.addEventListener('click', () => {
    const subject = encodeURIComponent('Project enquiry — DENVUP');
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${encodeURIComponent(mailBody())}`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    const data = payload();

    if (data.company) {
      setStatus('Nothing was sent. The enquiry looked automated, so it was stopped.', true);
      return;
    }

    const errors = validate(data);
    if (errors.length) {
      showErrors(errors);
      setStatus(`Nothing was sent yet — ${errors.length} field${errors.length === 1 ? '' : 's'} need attention.`, true);
      return;
    }

    const endpoint = form.dataset.endpoint?.trim() ?? '';
    if (!endpoint) {
      // No endpoint is configured. Say so plainly and offer real routes out.
      setStatus(
        'Nothing was sent: this build has no server endpoint, so there is nowhere to store your message. The details are kept in this form only. Use the email or WhatsApp route below and they will reach the studio.',
        true,
      );
      if (fallback) {
        fallback.hidden = false;
        fallback.replaceChildren();
        const p = document.createElement('p');
        p.textContent = 'Send the same details through a route that works today:';
        const mail = document.createElement('a');
        mail.href = `mailto:${brand.email}?subject=${encodeURIComponent('Project enquiry — DENVUP')}&body=${encodeURIComponent(mailBody())}`;
        mail.textContent = `Email ${brand.email}`;
        const wa = document.createElement('a');
        wa.href = waLink(brand.phones[0], mailBody());
        wa.target = '_blank';
        wa.rel = 'noopener noreferrer';
        wa.textContent = `WhatsApp ${brand.phones[0].display}`;
        const tel = document.createElement('a');
        tel.href = `tel:${brand.phones[0].e164}`;
        tel.textContent = `Call ${brand.phones[0].display}`;
        fallback.append(p, mail, wa, tel);
        fallback.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'nearest' });
      }
      return;
    }

    submit?.setAttribute('disabled', 'true');
    setStatus('Sending…');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('Sent. Your message reached the studio; you will hear from one of the four of us, not a sequence.');
      form.reset();
      if (counter) counter.textContent = '0';
      if (fallback) fallback.hidden = true;
    } catch {
      setStatus(
        'Not sent — the form endpoint did not accept the message. Nothing was stored. Please use email or WhatsApp below.',
        true,
      );
    } finally {
      submit?.removeAttribute('disabled');
    }
  });
}

export function initForms(): void {
  initEstimator();
  initFaq();
  initEnquiry();
  // Keep the prefilled WhatsApp links in the direct-contact block honest.
  $$<HTMLAnchorElement>('a[href*="wa.me"]').forEach((link) => {
    link.setAttribute('rel', 'noopener noreferrer');
  });
}
