import { beforeEach, describe, expect, it } from 'vitest';
import { renderPage } from '../render/page';
import { initForms } from '../client/forms';
import { brand } from '../content/site';

function mountPage() {
  const parsed = new DOMParser().parseFromString(renderPage(), 'text/html');
  document.body.innerHTML = parsed.body.innerHTML;
  document.title = parsed.title;
  initForms();
}

const $ = <T extends Element>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector)!;

describe('scope estimator', () => {
  beforeEach(mountPage);

  it('starts at the published landing-page price', () => {
    expect($('[data-est-output]').textContent).toBe('15,000');
    expect($('[data-est-detail]').textContent).toContain('Landing page');
  });

  it('recalculates when the project type changes and never hides the calculation', () => {
    const advanced = $<HTMLInputElement>('input[name="est-type"][value="advanced"]');
    advanced.checked = true;
    $('[data-estimator-form]').dispatchEvent(new Event('change', { bubbles: true }));
    expect($('[data-est-output]').textContent).toBe('50,000');
    expect($('[data-est-detail]').textContent).toContain('Custom');

    const pages = $<HTMLInputElement>('input[name="est-pages"][value="six-ten"]');
    pages.checked = true;
    $('[data-estimator-form]').dispatchEvent(new Event('change', { bubbles: true }));
    expect($('[data-est-output]').textContent).toBe('59,000');
  });

  it('sums motion and extras, and carries the summary to the enquiry', () => {
    const type = $<HTMLInputElement>('input[name="est-type"][value="business"]');
    type.checked = true;
    const motion = $<HTMLInputElement>('input[name="est-motion"][value="rich"]');
    motion.checked = true;
    const extra = $<HTMLInputElement>('input[name="est-extra"][value="content"]');
    extra.checked = true;
    $('[data-estimator-form]').dispatchEvent(new Event('change', { bubbles: true }));
    expect($('[data-est-output]').textContent).toBe('31,000');

    $<HTMLAnchorElement>('[data-est-cta]').click();
    const message = $<HTMLTextAreaElement>('#f-message');
    expect(message.value).toContain('31,000');
    expect(message.value).toContain('Business website');
    const budget = $<HTMLSelectElement>('#f-budget');
    expect([...budget.options].some((o) => o.selected && /not sure/i.test(o.textContent ?? ''))).toBe(true);
  });
});

describe('enquiry form', () => {
  beforeEach(mountPage);

  it('reports missing fields and never claims a send', () => {
    const form = $<HTMLFormElement>('#enquiry');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    const status = $('[data-form-status]');
    expect(status.textContent).toContain('Nothing was sent');
    expect(status.textContent).not.toMatch(/\bSent\./);
    expect($<HTMLElement>('[data-error-summary]').hidden).toBe(false);
    expect($<HTMLElement>('[data-error-for="name"]').hidden).toBe(false);
    const invalid = [...form.querySelectorAll('[aria-invalid="true"]')].map((el) => el.getAttribute('name'));
    expect(invalid).toEqual(expect.arrayContaining(['name', 'email', 'project', 'message', 'consent']));
  });

  it('has no endpoint in this build, so it says so and offers email, WhatsApp and phone', () => {
    const form = $<HTMLFormElement>('#enquiry');
    $<HTMLInputElement>('#f-name').value = 'Test Person';
    $<HTMLInputElement>('#f-email').value = 'person@example.com';
    $<HTMLSelectElement>('#f-project').value = $<HTMLSelectElement>('#f-project').options[1].value;
    $<HTMLTextAreaElement>('#f-message').value = 'A website for a small studio, launching this quarter.';
    $<HTMLInputElement>('#enquiry input[name="consent"]').checked = true;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    const status = $('[data-form-status]').textContent ?? '';
    expect(status).toContain('Nothing was sent');
    expect(status.toLowerCase()).toContain('no server endpoint');
    expect(status).not.toMatch(/^Sent/);

    const fallback = $<HTMLElement>('[data-enquiry-fallback]');
    expect(fallback.hidden).toBe(false);
    const mail = fallback.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')!;
    expect(mail.getAttribute('href')).toContain(brand.email);
    expect(decodeURIComponent(mail.getAttribute('href') ?? '')).toContain('Test Person');
    const wa = fallback.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]')!;
    expect(wa.href).toContain(`https://wa.me/${brand.phones[0].wa}?text=`);
    const tel = fallback.querySelector<HTMLAnchorElement>('a[href^="tel:"]')!;
    expect(tel.getAttribute('href')).toBe(`tel:${brand.phones[0].e164}`);
  });

  it('stops a honeypot submission with an explicit message', () => {
    const form = $<HTMLFormElement>('#enquiry');
    $<HTMLInputElement>('#f-company').value = 'Spam Co';
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect($('[data-form-status]').textContent).toContain('looked automated');
  });
});

describe('FAQ filter', () => {
  beforeEach(mountPage);

  it('shows only matching questions and clears the query', () => {
    const input = $<HTMLInputElement>('[data-faq-search]');
    const items = [...document.querySelectorAll<HTMLDetailsElement>('[data-faq-item]')];
    const before = items.filter((item) => !item.hidden).length;
    expect(before).toBe(items.length);

    input.value = 'hosting';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const visible = items.filter((item) => !item.hidden);
    expect(visible.length).toBeGreaterThan(0);
    expect(visible.length).toBeLessThan(items.length);
    visible.forEach((item) => expect(item.textContent?.toLowerCase()).toContain('hosting'));

    $<HTMLButtonElement>('[data-faq-clear]').click();
    expect(input.value).toBe('');
    expect(items.every((item) => !item.hidden)).toBe(true);
  });
});
