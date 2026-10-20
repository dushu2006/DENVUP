import type { Lab, LabMode } from './types';
import { loadersLab } from './loaders';
import { cursorLab } from './cursor';
import { microLab } from './micro';
import { typeLab } from './type';
import { scrollLab } from './scroll';
import { navigationLab } from './navigation';
import { collectionsLab } from './collections';
import { graphicsLab } from './graphics';
import { threedLab } from './threed';
import { particlesLab } from './particles';
import { materialsLab } from './materials';
import { storyLab } from './story';
import { processLab } from './process';
import { peopleLab } from './people';
import { conversionLab } from './conversion';
import { mediaLab } from './media';
import { eggsLab } from './eggs';
import { responsiveLab } from './responsive';
import { accessLab } from './access';
import { engineeringLab } from './engineering';
import { experimentalLab } from './experimental';

export const labs: Lab[] = [
  loadersLab,
  cursorLab,
  microLab,
  typeLab,
  scrollLab,
  navigationLab,
  collectionsLab,
  graphicsLab,
  threedLab,
  particlesLab,
  materialsLab,
  storyLab,
  processLab,
  peopleLab,
  conversionLab,
  mediaLab,
  eggsLab,
  responsiveLab,
  accessLab,
  engineeringLab,
  experimentalLab,
];

export interface LabEntry {
  lab: Lab;
  mode: LabMode;
  index: number;
}

export const labById = new Map<string, Lab>(labs.map((lab) => [lab.slug, lab]));

export const labEntries: LabEntry[] = labs.flatMap((lab) =>
  lab.modes.map((mode, index) => ({ lab, mode, index })),
);

export const totalLabModes = labEntries.length;

export const implementedIds: number[] = [
  ...new Set(labEntries.flatMap((entry) => entry.mode.ids)),
].sort((a, b) => a - b);

export function findModeForId(id: number): LabEntry | undefined {
  return labEntries.find((entry) => entry.mode.ids.includes(id));
}

export function modeLabel(entry: LabEntry): string {
  return `${entry.lab.title} — ${entry.mode.name}`;
}
