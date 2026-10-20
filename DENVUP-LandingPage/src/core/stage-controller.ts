/**
 * The stage controller.
 *
 * The stage is part of the shell: it is created once and lives for the
 * whole session. This module owns it and lets the view layer ask for a new
 * look without knowing anything about canvases.
 */

import { $, $$ } from './dom';
import { initStage, type StageHandle, type StageLook } from './stage';

let handle: StageHandle | null = null;

export function initStageController(): () => void {
  const canvas = $<HTMLCanvasElement>('#stage-canvas');
  handle = initStage(canvas);

  if (!handle.live) {
    document.documentElement.setAttribute('data-stage', 'fallback');
  }

  return () => {
    handle?.destroy();
    handle = null;
    document.documentElement.removeAttribute('data-stage');
  };
}

/** The live stage, or null when the canvas could not be created. */
export function getStage(): StageHandle | null {
  return handle;
}

/** Move the stage toward a new look. */
export function setStageLook(look: StageLook, duration = 1.2): void {
  handle?.setLook(look, duration);
}

/** The stage's current look, for tests and for the lab's read-out. */
export function getStageLook(): StageLook | null {
  return handle?.getLook() ?? null;
}

/**
 * Apply a partial change to the current look.
 *
 * The lab's sliders use this so a control adjusts the field that is running
 * right now instead of replacing it with a different scene.
 */
export function patchStageLook(patch: Partial<StageLook>, duration = 0.35): void {
  const current = getStageLook();
  if (!current) return;
  setStageLook({ ...current, ...patch }, duration);
}

/** All the stage sliders on the page, wired to the live field. */
export function bindStageControls(root: ParentNode = document): () => void {
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-stage-param]'));
  if (!inputs.length) return () => {};

  const onInput = (): void => {
    inputs.forEach((input) => {
      const param = input.dataset.stageParam as keyof StageLook | undefined;
      if (!param) return;
      const value = Number(input.value);
      if (!Number.isFinite(value)) return;
      const out = root.querySelector<HTMLOutputElement>(`[data-stage-out="${param}"]`);
      if (out) out.textContent = value.toFixed(2);
      patchStageLook({ [param]: value } as Partial<StageLook>);
    });
  };

  inputs.forEach((input) => input.addEventListener('input', onInput));
  onInput();

  // --- palette presets ----------------------------------------------------- //
  const swatches = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-stage-preset]'));
  const onPreset = (event: Event): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const preset = button.dataset.stagePreset;
    if (!preset) return;
    const current = getStageLook();
    if (!current) return;
    const palette: Record<string, { ink: string; wash: string }> = {
      paper: { ink: '#0b0b0c', wash: '#edeeea' },
      ink: { ink: '#edeeea', wash: '#0b0b0c' },
      ember: { ink: '#0b0b0c', wash: '#f0490f' },
      signal: { ink: '#edeeea', wash: '#2b39e6' },
    };
    const colours = palette[preset];
    if (!colours) return;
    setStageLook({ ...current, ...colours }, 0.8);
    swatches.forEach((swatch) => swatch.classList.remove('is-active'));
    button.classList.add('is-active');
  };
  swatches.forEach((swatch) => swatch.addEventListener('click', onPreset));

  return () => {
    inputs.forEach((input) => input.removeEventListener('input', onInput));
    swatches.forEach((swatch) => swatch.removeEventListener('click', onPreset));
  };
}

/** True when the stage is actually drawing. */
export function stageIsLive(): boolean {
  return handle?.live ?? false;
}

/** The stage element, for tests. */
export function stageElement(): HTMLElement | null {
  return $('#stage');
}

export { $$ };
