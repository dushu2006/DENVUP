import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as site from '../content/site';

const root = path.resolve(__dirname, '..');
const banned = ['lorem', 'ipsum', 'dolor sit', 'todo', 'tbd', 'placeholder', 'sample text', 'xxx'];

function strings(value: unknown, trail = 'site'): Array<[string, string]> {
  if (typeof value === 'string') return [[trail, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${trail}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => strings(child, `${trail}.${key}`));
  }
  return [];
}

const copy = strings(site).filter(([key]) => !key.includes('whatsappBase'));

describe('copy', () => {
  it('contains no lorem ipsum or placeholder text', () => {
    const found = copy.filter(([, text]) => banned.some((word) => text.toLowerCase().includes(word)));
    expect(found).toEqual([]);
  });

  it('makes no unverifiable credibility claims', () => {
    const patterns = [
      /\b\d{1,3}\+?\s*(years|projects|clients|brands)\b/i,
      /\b(award[- ]winning|industry[- ]leading|world[- ]class|best[- ]in[- ]class)\b/i,
      /\b(trusted by|our clients|client since|rated \d)\b/i,
    ];
    const found = copy
      .filter(([, text]) => patterns.some((re) => re.test(text)))
      .map(([key, text]) => `${key}: ${text.slice(0, 80)}`);
    expect(found).toEqual([]);
  });

  it('labels every showcase piece as a concept', () => {
    expect(site.showcase.length).toBeGreaterThanOrEqual(4);
    site.showcase.forEach((item) => {
      expect(item.note.toLowerCase()).toContain('concept');
      expect(item.note.toLowerCase()).toContain('not client work');
    });
  });

  it('gives each service a distinct slug and complete deep-dive fields', () => {
    const slugs = site.services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(['websites', 'ui-ux', 'interactive', 'custom', 'brand', 'care']);
    site.services.forEach((service) => {
      expect(service.summary.length).toBeGreaterThan(80);
      expect(service.forWho.length).toBeGreaterThan(40);
      expect(service.deliverables.length).toBeGreaterThanOrEqual(4);
      expect(service.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(service.proof.length).toBeGreaterThan(20);
    });
  });

  it('runs the process from discovery to launch', () => {
    expect(site.processSteps.map((s) => s.title)).toEqual([
      'Discovery',
      'Planning',
      'Design',
      'Development',
      'Testing',
      'Launch & handover',
    ]);
  });

  it('lists only technologies used in this build', () => {
    const names = site.technologies.map((t) => t.name);
    ['CSS motion', 'IntersectionObserver', 'Vite', 'TypeScript', 'WebGL', 'WAI-ARIA'].forEach((name) =>
      expect(names).toContain(name),
    );
    site.technologies.forEach((tech) => {
      expect(tech.role.length).toBeGreaterThan(5);
      expect(tech.note.length).toBeGreaterThan(20);
    });
  });

  it('answers every FAQ with substance and no duplicates', () => {
    const questions = site.faq.map((f) => f.q);
    expect(new Set(questions).size).toBe(questions.length);
    expect(site.faq.length).toBeGreaterThanOrEqual(8);
    site.faq.forEach((item) => {
      expect(item.a.length).toBeGreaterThan(60);
      expect(item.tags.length).toBeGreaterThan(0);
    });
  });

  it('keeps chapter ids unique and linked to real sections', () => {
    const ids = site.chapters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('prelude');
    expect(ids).toContain('closing');
    expect(ids).not.toContain('experience');
  });

  it('keeps prices and contact details out of the renderers', () => {
    const files = ['render/sections.ts', 'render/forms.ts', 'render/page.ts'];
    files.forEach((file) => {
      const text = fs.readFileSync(path.join(root, file), 'utf8');
      expect(text).not.toMatch(/₹\s?\d{2},\d{3}/);
      expect(text).not.toContain('denvupforyou@gmail.com');
      expect(text).not.toContain('7675993371');
    });
  });
});
