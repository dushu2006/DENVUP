/**
 * Effects-library types. A lab groups demonstrations from the same chapter of
 * the studio's animation reference; each mode is one live, labelled technique
 * (or a small set that only makes sense together).
 */

export interface LabCleanup {
  (): void;
}

export interface LabContext {
  /** The element that owns the demo; cleared between modes. */
  stage: HTMLElement;
  /** Whether the reader asked for reduced motion. */
  reduced: boolean;
  /** Coarse pointer / no hover. */
  touch: boolean;
  /** Play a short UI sound only when the reader has opted in. */
  sound: (kind: 'tick' | 'pop' | 'chime') => void;
  /** Register a cleanup for listeners, observers, RAF loops, timers. */
  onCleanup: (fn: LabCleanup) => void;
  /** requestAnimationFrame loop that stops automatically on cleanup. */
  raf: (fn: (time: number, delta: number) => void) => () => void;
  /** setTimeout that is cleared automatically on cleanup. */
  timeout: (fn: () => void, ms: number) => void;
  /** Replay the current mode from scratch. */
  replay: () => void;
  /** Announce a short status message to assistive technology. */
  announce: (message: string) => void;
}

export interface LabNotes {
  touch?: string;
  keyboard?: string;
  motion?: string;
}

export interface LabMode {
  /** Encyclopedia technique IDs demonstrated by this mode. */
  ids: number[];
  name: string;
  /** One or two sentences: what it does and when to use it. */
  summary: string;
  /** Markup for the stage. Author-controlled, static strings only. */
  html: string;
  /** Optional behaviour. Return a cleanup function if needed. */
  init?: (ctx: LabContext) => void | LabCleanup;
  /** True when the effect is primarily hover-based and needs a tap preview. */
  hoverPreview?: boolean;
  notes?: LabNotes;
  theme?: 'paper' | 'ink' | 'orange' | 'clay';
  /** 'tall' gives the stage more room (3D, galleries). */
  size?: 'short' | 'default' | 'tall';
}

export interface Lab {
  slug: string;
  title: string;
  /** Short, human description used above the stage. */
  blurb: string;
  modes: LabMode[];
}
