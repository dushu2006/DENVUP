/**
 * The typography chapter.
 *
 * One variable grotesque with two live axes, a continuous strip, and type
 * travelling along an SVG path. The axis demo scales itself down on small
 * screens so the controls stay reachable.
 */

import { $ } from '../core/dom';
import { env } from '../core/env';
import { gsap } from '../core/motion';

export function initTypography(): () => void {
  const cleanups: (() => void)[] = [];

  // --- live variable axes ------------------------------------------------ //
  const target = $<HTMLElement>('[data-axis-target]');
  const weight = $<HTMLInputElement>('[data-axis-weight]');
  const width = $<HTMLInputElement>('[data-axis-width]');

  const applyAxes = () => {
    if (!target) return;
    const wght = weight?.value ?? '400';
    const wdth = width?.value ?? '100';
    target.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}`;
    const specimen = target.closest<HTMLElement>('.specimen');
    specimen?.style.setProperty('--axis-wght', wght);
    specimen?.style.setProperty('--axis-wdth', wdth);
  };

  weight?.addEventListener('input', applyAxes);
  width?.addEventListener('input', applyAxes);
  applyAxes();

  // --- continuous marquee ------------------------------------------------ //
  const marquee = $<HTMLElement>('[data-marquee]');
  const marqueeToggle = $<HTMLButtonElement>('[data-marquee-toggle]');
  if (marquee) {
    const track = marquee.querySelector<HTMLElement>('.marquee__track');
    if (track && !env.reducedMotion) {
      // Duplicate the strip so the loop is seamless.
      track.innerHTML += track.innerHTML;
      gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: 'none',
        repeat: -1,
      });
    }

    const setPaused = (paused: boolean) => {
      marquee.classList.toggle('is-paused', paused);
      marqueeToggle?.setAttribute('aria-pressed', String(!paused));
      if (marqueeToggle) marqueeToggle.textContent = paused ? 'Play' : 'Pause';
      gsap.globalTimeline.getChildren().forEach(() => {});
      const tween = gsap.getTweensOf(track)[0];
      if (tween) {
        if (paused) tween.pause();
        else tween.resume();
      }
    };

    marqueeToggle?.addEventListener('click', () => {
      setPaused(!marquee.classList.contains('is-paused'));
    });
    marquee?.addEventListener('pointerenter', () => {
      if (!env.reducedMotion) gsap.getTweensOf(track)[0]?.pause();
    });
    marquee?.addEventListener('pointerleave', () => {
      if (!env.reducedMotion && !marquee.classList.contains('is-paused')) {
        gsap.getTweensOf(track)[0]?.resume();
      }
    });
    if (env.reducedMotion) setPaused(true);
  }

  // --- type travelling on a path ----------------------------------------- //
  const pathText = document.querySelector<SVGTextElement>('.typepath__text');
  if (pathText && !env.reducedMotion) {
    const textPath = pathText.querySelector('textPath');
    if (textPath) {
      /*
       * `SVGTextPathElement.startOffset` is a read-only accessor in every
       * browser — it returns an SVGAnimatedLength and cannot be assigned.
       * GSAP's CSS plugin therefore tried `element.startOffset = '50%'`,
       * threw on every frame, and flooded the console with TypeErrors.
       * This build of GSAP ships no AttrPlugin either, so the attribute is
       * written by hand from a tweened plain object.
       */
      const offset = { value: 0 };
      gsap.to(offset, {
        value: 100,
        duration: 12,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          textPath.setAttribute('startOffset', `${offset.value.toFixed(3)}%`);
        },
      });
    }
  }

  return () => cleanups.forEach((fn) => fn());
}
