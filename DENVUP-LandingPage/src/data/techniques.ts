/**
 * The technique catalogue, loaded from the generated JSON.
 *
 * `src/data/techniques.json` is produced by `scripts/gen-coverage.py` from
 * `scripts/techniques.py`, so the numbers the site quotes always match
 * `ANIMATION_COVERAGE_MATRIX.md`.
 */

import raw from './techniques.json';

export type TechniqueStatus = 'Tested' | 'Planned' | 'Requires revision' | 'Blocked';

export interface Technique {
  id: number;
  name: string;
  cat: number;
  catLabel: string;
  status: TechniqueStatus;
  comp: string;
  note: string;
}

export interface TechniqueCategory {
  index: number;
  label: string;
  count: number;
}

interface TechniqueFile {
  total: number;
  categories: TechniqueCategory[];
  techniques: Technique[];
}

const data = raw as TechniqueFile;

export const techniques: Technique[] = data.techniques;
export const techniqueCategories: TechniqueCategory[] = data.categories;
export const techniqueTotal = data.total;

export const techniqueById = new Map<number, Technique>(techniques.map((t) => [t.id, t]));

export const statusCounts = techniques.reduce<Record<string, number>>((acc, technique) => {
  acc[technique.status] = (acc[technique.status] ?? 0) + 1;
  return acc;
}, {});
