import { describe, expect, it } from 'vitest';
import { renderPage } from '../render/page';
import { coverageRows, coverageSummary } from '../content/coverage-map';
import { capabilities } from '../content/site';
import { implementedIds, labById } from '../labs/registry';
import { capabilityDemo } from '../content/demo-map';
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

  it('renders nine capability tabs with one live panel each', () => {
    const tabs = [...doc.querySelectorAll('[data-cap-tab]')];
    const panels = [...doc.querySelectorAll('[data-cap-panel]')];
    expect(tabs).toHaveLength(9);
    expect(panels).toHaveLength(9);
    expect(panels.filter((panel) => !panel.hasAttribute('hidden'))).toHaveLength(1);
    tabs.forEach((tab) => {
      const panel = doc.getElementById(tab.getAttribute('aria-controls') ?? '');
      expect(panel).not.toBeNull();
      expect(panel?.querySelector('[data-cap-demo]')).not.toBeNull();
      expect(panel?.querySelectorAll('.caps__tech li').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('retires the effects library and the mark section', () => {
    expect(doc.getElementById('effects-library')).toBeNull();
    expect(doc.getElementById('identity')).toBeNull();
    expect(doc.querySelector('[data-lab-shell]')).toBeNull();
    expect(doc.querySelector('[data-coverage-row]')).toBeNull();
    expect(renderPage()).not.toContain('>Close<');
  });

  it('keeps the 480-row reference intact and cites the mounted demo’s own ids', () => {
    expect(coverageRows).toHaveLength(480);
    const ids = new Set(coverageRows.map((row) => row.id));
    const expected = capabilities.flatMap((c) => {
      const mapping = capabilityDemo[c.key];
      const mode = mapping ? labById.get(mapping[0])?.modes[mapping[1]] : undefined;
      return (mode?.ids ?? []).slice(0, 3);
    });
    expect(expected.length).toBeGreaterThanOrEqual(18);
    const cited = [...doc.querySelectorAll('.caps__tech-id')].map((el) => Number(el.textContent));
    expect(cited).toEqual(expected);
    cited.forEach((id) => expect(ids.has(id)).toBe(true));
    const total = Object.values(coverageSummary).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(480);
  });

  it('pins the header and keeps the fifteen home chapters', () => {
    const head = doc.querySelector('.site-head');
    expect(head?.hasAttribute('data-head')).toBe(true);
    expect(doc.querySelector('.chapter-rail')).toBeNull();
    expect(doc.querySelectorAll('main [data-chapter]')).toHaveLength(15);
    expect(doc.querySelector('[data-chapter="effects-library"]')).toBeNull();
    expect(doc.querySelector('[data-chapter="identity"]')).toBeNull();
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

  it('loads no third-party script, stylesheet or font', () => {
    const external = [...doc.querySelectorAll('script[src], link[href]')]
      .map((el) => el.getAttribute('src') ?? el.getAttribute('href') ?? '')
      .filter((href) => /^https?:\/\//.test(href) && !href.startsWith('https://denvup.com'));
    expect(external).toEqual([]);
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
