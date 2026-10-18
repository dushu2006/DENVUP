import { describe, expect, it } from 'vitest';
import { renderPage } from '../render/page';
import { coverageRows, coverageSummary } from '../content/coverage-map';
import { implementedIds, labs } from '../labs/registry';
import { brand } from '../content/site';

const html = renderPage();
const doc = new DOMParser().parseFromString(html, 'text/html');

describe('rendered page', () => {
  it('has one h1 and a main landmark', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('main#main')).not.toBeNull();
    expect(doc.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main');
  });

  it('has unique ids and resolving ARIA references', () => {
    const ids = [...doc.querySelectorAll('[id]')].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    const broken: string[] = [];
    doc.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]').forEach((el) => {
      ['aria-labelledby', 'aria-describedby', 'aria-controls'].forEach((attr) => {
        const value = el.getAttribute(attr);
        if (!value) return;
        value.split(/\s+/).forEach((id) => {
          if (!doc.getElementById(id)) broken.push(`${attr}=${id}`);
        });
      });
    });
    expect(broken).toEqual([]);
  });

  it('gives every image an alt attribute and every control an accessible name', () => {
    doc.querySelectorAll('img').forEach((img) => expect(img.hasAttribute('alt')).toBe(true));
    const unnamed = [...doc.querySelectorAll('button, a')].filter((el) => {
      const text = (el.textContent ?? '').trim();
      return !text && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.querySelector('img[alt]:not([alt=""])');
    });
    expect(unnamed.map((el) => el.outerHTML.slice(0, 90))).toEqual([]);
  });

  it('renders all 21 lab shells with a stage and a mode container', () => {
    const shells = [...doc.querySelectorAll('[data-lab-shell]')];
    expect(shells).toHaveLength(labs.length);
    expect(shells).toHaveLength(21);
    shells.forEach((shell) => {
      expect(shell.querySelector('[data-lab-stage]')).not.toBeNull();
      expect(shell.querySelector('[data-lab-modes]')).not.toBeNull();
      expect(shell.querySelector('[data-lab-want]')).not.toBeNull();
    });
  });

  it('includes the complete 480-row index and an honest summary', () => {
    const rows = [...doc.querySelectorAll('[data-coverage-row]')];
    expect(rows).toHaveLength(480);
    expect(coverageRows).toHaveLength(480);
    const total = Object.values(coverageSummary).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(480);
    expect(rows[0]?.textContent).toContain('Loading, startup');
    expect(rows[479]?.textContent).toContain('custom interaction');
  });

  it('uses the supplied business details and the three starting prices', () => {
    const text = doc.body.textContent ?? '';
    expect(text).toContain('denvupforyou@gmail.com');
    expect(text).toContain('+91 76759 93371');
    expect(text).toContain('+91 91335 85849');
    expect(text).toContain('₹15,000');
    expect(text).toContain('₹20,000');
    expect(text).toContain('₹50,000');
    ['T. Dusyanth', 'M. Nanda Kishore', 'K. V. Sai Prashanth', 'P. Venkatesh'].forEach((name) =>
      expect(text).toContain(name),
    );
    expect(text).toContain('Domains, hosting, API usage');
    expect(text).toContain('starting points, not quotations');
  });

  it('encodes contact routes correctly', () => {
    const mail = [...doc.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]')];
    expect(mail.length).toBeGreaterThan(0);
    mail.forEach((a) => expect(a.getAttribute('href')).toContain(`mailto:${brand.email}`));
    const tels = [...doc.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')].map((a) => a.getAttribute('href'));
    expect(tels).toContain('tel:+917675993371');
    expect(tels).toContain('tel:+919133585849');
    const wa = [...doc.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]')].map((a) => a.getAttribute('href') ?? '');
    expect(wa.length).toBeGreaterThan(0);
    wa.forEach((href) => {
      const url = new URL(href);
      expect(url.searchParams.get('text')).toBeTruthy();
      expect(url.searchParams.get('text')).not.toMatch(/%20\+/);
    });
    expect(wa.some((href) => href.startsWith('https://wa.me/917675993371?text='))).toBe(true);
    expect(wa.some((href) => href.startsWith('https://wa.me/919133585849?text='))).toBe(true);
  });

  it('loads nothing from a third party', () => {
    expect(doc.querySelectorAll('script[src^="http"], link[href^="http"]')).toHaveLength(0);
    expect(html).not.toContain('fonts.googleapis');
    expect(html).not.toContain('fonts.gstatic');
    expect(html).not.toContain('googletagmanager');
  });

  it('contains no placeholder or fabricated-credibility copy', () => {
    const text = doc.body.textContent?.toLowerCase() ?? '';
    ['lorem ipsum', 'award-winning', 'years of experience', 'clients trust', 'trusted by', 'our clients'].forEach(
      (phrase) => expect(text).not.toContain(phrase),
    );
    // The only pull quote is the studio's own manifesto, never a client testimonial.
    doc.querySelectorAll('blockquote').forEach((quote) => {
      expect(quote.hasAttribute('cite')).toBe(false);
      expect(quote.closest('[data-testimonial], [class*="testimonial"]')).toBeNull();
    });
    expect(doc.querySelectorAll('[data-rating], [data-stars], [data-client-logo]')).toHaveLength(0);
  });

  it('indexes every one of the 480 techniques exactly once', () => {
    const ids = coverageRows.map((row) => row.id);
    expect(ids).toEqual(Array.from({ length: 480 }, (_, i) => i + 1));
    expect(implementedIds.length).toBeGreaterThan(200);
  });
});
