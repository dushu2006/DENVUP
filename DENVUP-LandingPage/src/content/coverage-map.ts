import catalogue from './technique-catalogue.json';
import { blockedTechniques, siteCoverage, type CoverageStatus } from './coverage';
import { findModeForId, labs } from '../labs/registry';

export type { CoverageStatus };

export interface CoverageRow {
  id: number;
  name: string;
  section: number;
  sectionName: string;
  status: CoverageStatus;
  where: string;
  file: string;
  test: string;
  note?: string;
}

const names = catalogue.techniques as Record<string, string>;
const sections = catalogue.sections as Record<string, string>;

const bounds = [20, 50, 80, 110, 150, 175, 205, 225, 250, 270, 300, 325, 340, 355, 380, 395, 410, 425, 440, 460, 480];

function sectionFor(id: number): number {
  for (let i = 0; i < bounds.length; i++) {
    if (id <= bounds[i]!) return i + 1;
  }
  return 21;
}

const siteById = new Map<number, (typeof siteCoverage)[number]>();
siteCoverage.forEach((entry) => entry.ids.forEach((id) => siteById.set(id, entry)));

export const coverageRows: CoverageRow[] = Array.from({ length: 480 }, (_, index) => {
  const id = index + 1;
  const section = sectionFor(id);
  const base = {
    id,
    name: names[String(id)] ?? `Technique ${id}`,
    section,
    sectionName: sections[String(section)] ?? 'Technique',
  };
  const site = siteById.get(id);
  if (site) {
    return {
      ...base,
      status: site.status,
      where: site.area,
      file: site.file,
      test: site.test,
      note: site.note,
    };
  }
  const entry = findModeForId(id);
  if (entry) {
    return {
      ...base,
      status: 'Implemented',
      where: `${entry.lab.title} — ${entry.mode.name}`,
      file: `src/labs/${entry.lab.slug}.ts`,
      test: 'Mounts and tears down in the automated lab test. Visual verification in a real browser is outstanding.',
      note: entry.mode.notes?.motion,
    };
  }
  const blocked = blockedTechniques[id];
  if (blocked) {
    return {
      ...base,
      status: 'Blocked',
      where: 'Not shipped — the closest safe alternative is named',
      file: '—',
      test: 'Not applicable',
      note: blocked,
    };
  }
  return {
    ...base,
    status: 'Planned',
    where: 'Not built in this build',
    file: '—',
    test: 'Not tested',
    note: 'No demo ships for this technique here. It stays on the reference list and is not claimed as covered.',
  };
});

export const coverageSummary = coverageRows.reduce<Record<CoverageStatus, number>>(
  (acc, row) => {
    acc[row.status] += 1;
    return acc;
  },
  { Tested: 0, Implemented: 0, 'Requires revision': 0, Planned: 0, Blocked: 0 },
);

export const statusOrder: CoverageStatus[] = ['Tested', 'Implemented', 'Requires revision', 'Blocked', 'Planned'];

export const labIds = new Set(labs.flatMap((lab) => lab.modes.flatMap((mode) => mode.ids)));

export const siteStatusCounts = siteCoverage.reduce<Record<string, number>>((acc, item) => {
  acc[item.status] = (acc[item.status] ?? 0) + item.ids.length;
  return acc;
}, {});
