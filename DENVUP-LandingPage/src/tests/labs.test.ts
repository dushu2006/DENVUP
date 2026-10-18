import { describe, expect, it } from 'vitest';
import { labEntries, labs } from '../labs/registry';
import type { LabContext } from '../labs/types';

function makeContext(stage: HTMLElement, cleanups: Array<() => void>): LabContext {
  return {
    stage,
    reduced: false,
    touch: false,
    sound: () => undefined,
    onCleanup: (fn) => cleanups.push(fn),
    raf: () => () => undefined,
    timeout: () => undefined,
    replay: () => undefined,
    announce: () => undefined,
  };
}

describe('effects registry', () => {
  it('has 21 labs, each with named, described modes', () => {
    expect(labs).toHaveLength(21);
    expect(new Set(labs.map((lab) => lab.slug)).size).toBe(21);
    expect(labEntries.length).toBeGreaterThanOrEqual(140);

    const problems: string[] = [];
    labEntries.forEach(({ lab, mode }) => {
      const label = `${lab.slug}: ${mode.name}`;
      if (mode.name.trim().length < 4) problems.push(`${label}: name too short`);
      if (mode.summary.trim().length < 25) problems.push(`${label}: summary too short`);
      if (mode.html.trim().length < 21 && !mode.init) problems.push(`${label}: empty markup and no init`);
      if (!mode.ids.length) problems.push(`${label}: claims no technique`);
    });
    expect(problems).toEqual([]);
  });

  it('claims each technique id once per lab and at most twice overall', () => {
    const claims = new Map<number, string[]>();
    const problems: string[] = [];
    labEntries.forEach(({ lab, mode }) => {
      const local = new Set<number>();
      mode.ids.forEach((id) => {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(480);
        if (local.has(id)) problems.push(`#${id} repeated inside ${lab.slug} / ${mode.name}`);
        local.add(id);
        claims.set(id, [...(claims.get(id) ?? []), `${lab.slug} / ${mode.name}`]);
      });
    });
    claims.forEach((where, id) => {
      if (where.length > 2) problems.push(`#${id} claimed by ${where.length} modes: ${where.join(' | ')}`);
    });
    expect(problems).toEqual([]);
  });

  it('documents an interaction route for every mode and a touch route for hover demos', () => {
    const problems: string[] = [];
    labEntries.forEach(({ lab, mode }) => {
      const notes = mode.notes ?? {};
      const label = `${lab.slug}: ${mode.name}`;
      if (mode.hoverPreview && !notes.touch) problems.push(`${label}: hover demo without a touch note`);
      if (!notes.keyboard && !notes.touch && !notes.motion) problems.push(`${label}: no interaction note`);
    });
    expect(problems).toEqual([]);
  });
});

describe('every demo mounts', () => {
  const mount = (reduced: boolean, touch: boolean) => {
    const problems: string[] = [];
    labEntries.forEach(({ lab, mode, index }) => {
      const label = `${lab.slug}[${index}] ${mode.name}`;
      const cleanups: Array<() => void> = [];
      const stage = document.createElement('div');
      try {
        stage.innerHTML = mode.html;
        document.body.append(stage);
        const result = mode.init?.({
          ...makeContext(stage, cleanups),
          reduced,
          touch,
        });
        if (typeof result === 'function') cleanups.push(result);
        if (stage.innerHTML.trim().length < 10) problems.push(`${label}: rendered an empty stage`);
      } catch (error) {
        problems.push(`${label}: init threw ${(error as Error).message}`);
      }
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          problems.push(`${label}: cleanup threw ${(error as Error).message}`);
        }
      });
      stage.remove();
    });
    return problems;
  };

  it('initialises all demos without throwing', () => {
    expect(mount(false, false)).toEqual([]);
  });

  it('still initialises with reduced motion and a coarse pointer', () => {
    expect(mount(true, true)).toEqual([]);
  });
});
