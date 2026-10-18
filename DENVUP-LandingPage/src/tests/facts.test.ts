import { describe, expect, it } from 'vitest';
import { brand, business, enquiryText, pricing, waLink } from '../content/site';

describe('business facts', () => {
  it('has the exact studio identity and contact details', () => {
    expect(brand.name).toBe('DENVUP');
    expect(brand.email).toBe('denvupforyou@gmail.com');
    expect(brand.location).toBe('Andhra Pradesh, India');
    expect(brand.description).toBe(
      'DENVUP is a digital studio for website design and development, UI/UX, interactive experiences and custom digital solutions.',
    );
    expect(brand.phones.map((p) => p.e164)).toEqual(['+917675993371', '+919133585849']);
    expect(brand.phones.map((p) => p.display)).toEqual(['+91 76759 93371', '+91 91335 85849']);
    expect(brand.phones.map((p) => p.wa)).toEqual(['917675993371', '919133585849']);
  });

  it('keeps one source of truth for the three starting prices', () => {
    const from = pricing.tiers.map((t) => [t.key, t.from, t.fromLabel]);
    expect(from).toEqual([
      ['landing', 15000, '₹15,000'],
      ['business', 20000, '₹20,000'],
      ['advanced', 50000, '₹50,000'],
    ]);
    expect(business.priceFrom).toEqual({ landing: 15000, business: 20000, advanced: 50000 });
    expect(pricing.tiers.every((t) => t.fromLabel === `₹${t.from.toLocaleString('en-IN')}`)).toBe(true);
  });

  it('names exactly the four people, with no invented titles', () => {
    expect(business.teamNames).toEqual([
      'T. Dusyanth',
      'M. Nanda Kishore',
      'K. V. Sai Prashanth',
      'P. Venkatesh',
    ]);
  });

  it('encodes WhatsApp links once, with a readable prefilled message', () => {
    const href = waLink(brand.phones[0], enquiryText.effect(21, 'Custom cursor dot'));
    const url = new URL(href);
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/917675993371');
    const text = url.searchParams.get('text') ?? '';
    expect(text).toContain('#21');
    expect(text).toContain('Custom cursor dot');
    // Encoding must happen exactly once: no stray percent escapes or plus signs for spaces.
    expect(href).not.toContain('%2520');
    expect(url.search).not.toContain('+');
    expect(text).toContain('\n');
  });

  it('builds the enquiry deep link from the same price data', () => {
    const text = enquiryText.pricing('Landing page · ₹15,000');
    expect(text).toContain('₹15,000');
    expect(decodeURIComponent(encodeURIComponent(text))).toBe(text);
  });

  it('states that prices are starting points and third-party costs are separate', () => {
    const notes = pricing.notes.join(' ').toLowerCase();
    expect(notes).toContain('starting');
    expect(notes).toContain('third-party');
    expect(notes).not.toMatch(/guarantee|cheapest|best in/);
  });
});
