/**
 * Audio demonstrations.
 *
 * The repository contains no recorded audio asset, so every sound here is
 * synthesised with the Web Audio API. Nothing ever plays until the visitor
 * turns sound on, and the same switch governs every audio demo on the page.
 */

import { el } from '../core/dom';
import { createLoop, fitCanvas } from '../core/loop';
import { button, controls, hint, palette, stage } from './helpers';
import type { Demo } from './types';

type Listener = (enabled: boolean) => void;

class AudioEngine {
  context: AudioContext | null = null;
  master: GainNode | null = null;
  analyser: AnalyserNode | null = null;
  private data: Uint8Array<ArrayBuffer> | null = null;
  private listeners = new Set<Listener>();
  private _enabled = false;

  get enabled(): boolean {
    return this._enabled;
  }

  onChange(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private ensureContext(): AudioContext | null {
    if (this.context) return this.context;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      this.context = new Ctor();
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.data = new Uint8Array(this.analyser.frequencyBinCount);
      this.master.connect(this.analyser);
      this.analyser.connect(this.context.destination);
    } catch {
      this.context = null;
    }
    return this.context;
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    if (enabled) {
      const context = this.ensureContext();
      if (context) {
        void context.resume();
        if (this.master) {
          this.master.gain.cancelScheduledValues(context.currentTime);
          this.master.gain.linearRampToValueAtTime(0.18, context.currentTime + 0.2);
        }
      }
    } else if (this.master && this.context) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.15);
    }
    this.listeners.forEach((listener) => listener(enabled));
  }

  /** Play a short synthesised tone. No-op while sound is off. */
  blip(frequency = 440, duration = 0.12, type: OscillatorType = 'triangle'): void {
    if (!this._enabled) return;
    const context = this.ensureContext();
    if (!context || !this.master) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(context.currentTime + duration + 0.02);
  }

  /** Current output level, 0–1. */
  level(): number {
    if (!this.analyser || !this.data || !this._enabled) return 0;
    this.analyser.getByteFrequencyData(this.data);
    let sum = 0;
    for (let i = 0; i < this.data.length; i += 1) sum += this.data[i];
    return sum / (this.data.length * 255);
  }

  /** Frequency data for the waveform view. */
  spectrum(): Uint8Array<ArrayBuffer> | null {
    if (!this.analyser || !this.data || !this._enabled) return null;
    this.analyser.getByteFrequencyData(this.data);
    return this.data;
  }
}

export const audioEngine = new AudioEngine();

const waveform: Demo = {
  id: 'audio-waveform',
  title: 'Live waveform',
  category: 'media',
  summary:
    'A waveform drawn live from an analyser node. Nothing is recorded — the tone is synthesised in the browser.',
  trigger: 'Turn sound on, then press Play',
  techniques: [387, 389],
  keywords: 'waveform analyser audio live sound',
  mount({ root }) {
    const canvas = el('canvas', 'demo__canvas');
    const wrap = stage(root, 'demo__stage--canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      hint(root, 'This browser did not provide a 2D canvas context.');
      return;
    }

    let oscillator: OscillatorNode | null = null;

    const bar = controls(root);
    const toggle = button('Turn sound on', () => {
      const next = !audioEngine.enabled;
      audioEngine.setEnabled(next);
      toggle.textContent = next ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(next));
      if (next) audioEngine.blip(523.25, 0.4, 'sawtooth');
    });
    bar.appendChild(toggle);

    const stop = button('Stop tone', () => {
      oscillator?.stop();
      oscillator = null;
    });
    bar.appendChild(stop);

    const start = button('Hold a tone', () => {
      if (!audioEngine.enabled) audioEngine.setEnabled(true);
      if (oscillator) return;
      const context = audioEngine.context;
      const master = audioEngine.master;
      if (!context || !master) return;
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 196;
      gain.gain.value = 0.12;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      oscillator = osc;
      stop.disabled = false;
    });
    bar.appendChild(start);

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx: c, width, height } = fitted;
        c.clearRect(0, 0, width, height);
        c.strokeStyle = palette.ember;
        c.lineWidth = 1.5;
        c.beginPath();
        const data = audioEngine.spectrum();
        const bars = 64;
        for (let i = 0; i < bars; i += 1) {
          const value = data ? data[i % data.length] / 255 : 0;
          const h = value * height * 0.8;
          const x = (i / bars) * width;
          c.moveTo(x, height / 2 - h / 2);
          c.lineTo(x, height / 2 + h / 2);
        }
        c.stroke();
        c.fillStyle = 'rgba(11,11,12,0.6)';
        c.font = '12px "JetBrains Mono Variable", monospace';
        c.fillText(audioEngine.enabled ? 'sound on' : 'sound off', 12, 20);
      },
    });

    const off = audioEngine.onChange((enabled) => {
      toggle.textContent = enabled ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(enabled));
    });

    return () => {
      off();
      oscillator?.stop();
      loop.destroy();
    };
  },
};

const clickSounds: Demo = {
  id: 'audio-clicks',
  title: 'Interface click sounds',
  category: 'media',
  summary: 'A short synthesised tick confirms a press — only once sound has been enabled.',
  trigger: 'Press the buttons',
  techniques: [388, 389],
  keywords: 'click sound ui tick feedback',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--row');
    const bar = controls(root);
    const toggle = button('Turn sound on', () => {
      const next = !audioEngine.enabled;
      audioEngine.setEnabled(next);
      toggle.textContent = next ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(next));
    });
    bar.appendChild(toggle);

    for (let i = 0; i < 3; i += 1) {
      const btn = button(`Press ${i + 1}`, () => {
        audioEngine.blip(320 + i * 140, 0.1, 'square');
        btn.classList.add('is-hit');
        window.setTimeout(() => btn.classList.remove('is-hit'), 180);
      });
      bar.appendChild(btn);
    }
    const off = audioEngine.onChange((enabled) => {
      toggle.textContent = enabled ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(enabled));
    });
    void wrap;
    return off;
  },
};

const levelParticles: Demo = {
  id: 'audio-level-particles',
  title: 'Particle brightness follows the audio level',
  category: 'media',
  summary: 'The particles brighten with the level of the sound, and settle when it stops.',
  trigger: 'Turn sound on',
  techniques: [390, 474],
  keywords: 'audio level particles brightness reactive',
  mount({ root }) {
    const canvas = el('canvas', 'demo__canvas');
    const wrap = stage(root, 'demo__stage--canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = 90;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: (i * 37) % 100,
      y: (i * 61) % 100,
      r: 1 + (i % 5),
    }));

    const bar = controls(root);
    const toggle = button('Turn sound on', () => {
      const next = !audioEngine.enabled;
      audioEngine.setEnabled(next);
      toggle.textContent = next ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(next));
      if (next) audioEngine.blip(392, 0.6, 'triangle');
    });
    bar.appendChild(toggle);

    const loop = createLoop({
      observe: canvas,
      draw(_, time) {
        const fitted = fitCanvas(canvas);
        if (!fitted) return;
        const { ctx: c, width, height } = fitted;
        c.clearRect(0, 0, width, height);
        const level = audioEngine.level();
        particles.forEach((p, i) => {
          const wobble = Math.sin(time * 2 + i) * 6;
          c.globalAlpha = 0.25 + level * 0.75;
          c.fillStyle = level > 0.08 ? palette.amber : palette.ember;
          c.beginPath();
          c.arc(
            ((p.x + wobble) / 100) * width,
            ((p.y + Math.cos(time * 1.5 + i) * 5) / 100) * height,
            p.r * (1 + level * 2.4),
            0,
            Math.PI * 2,
          );
          c.fill();
        });
        c.globalAlpha = 1;
      },
    });
    const off = audioEngine.onChange((enabled) => {
      toggle.textContent = enabled ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(enabled));
    });
    return () => {
      off();
      loop.destroy();
    };
  },
};

const scrollSounds: Demo = {
  id: 'audio-scroll',
  title: 'Scroll-linked sound',
  category: 'media',
  summary:
    'A soft tone follows the scroll position, but only after an explicit opt-in — sound is never automatic.',
  trigger: 'Turn sound on, then scroll inside the panel',
  techniques: [149, 47],
  keywords: 'scroll sound opt-in tone',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--scroll');
    wrap.style.height = '220px';
    const inner = el('div', 'demo__scroll-inner');
    inner.style.height = '900px';
    wrap.appendChild(inner);

    const bar = controls(root);
    const toggle = button('Turn sound on', () => {
      const next = !audioEngine.enabled;
      audioEngine.setEnabled(next);
      toggle.textContent = next ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(next));
    });
    bar.appendChild(toggle);

    let lastTone = 0;
    const onScroll = () => {
      if (!audioEngine.enabled) return;
      const now = performance.now();
      if (now - lastTone < 120) return;
      lastTone = now;
      const rect = wrap.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - wrap.clientHeight)));
      audioEngine.blip(220 + progress * 440, 0.09, 'triangle');
    };
    wrap.addEventListener('scroll', onScroll, { passive: true });
    const off = audioEngine.onChange((enabled) => {
      toggle.textContent = enabled ? 'Turn sound off' : 'Turn sound on';
      toggle.setAttribute('aria-pressed', String(enabled));
    });
    return () => {
      off();
      wrap.removeEventListener('scroll', onScroll);
    };
  },
};

export const audioDemos: Demo[] = [waveform, clickSounds, levelParticles, scrollSounds];
