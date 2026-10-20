/**
 * Chapter-tinted root background.
 *
 * `scrollbar-gutter: stable` reserves a strip beside the body box, and that
 * strip is painted with the root element's background — never with the
 * chapter that is on screen. With a fixed root colour that leaves a dark
 * band running down the side of every light chapter, which reads as a
 * rendering fault rather than a design.
 *
 * The root is therefore repainted with the colour of the chapter in view.
 * The colour is read from the section's own computed background, so the
 * palette stays defined in one place (the `.ch-*` scopes) and this module
 * never hard-codes a hex value.
 */

/** Repaint the root with the background of the chapter with this id. */
export function syncChapterBackground(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;
  const colour = getComputedStyle(section).backgroundColor;
  if (!colour || colour === 'rgba(0, 0, 0, 0)' || colour === 'transparent') return;
  const root = document.documentElement;
  if (root.style.backgroundColor === colour) return;
  root.style.backgroundColor = colour;
}

/**
 * Paint the root with the first chapter immediately, before the observer
 * has had a chance to report one, so the gutter never flashes.
 */
export function initChapterBackground(): () => void {
  const first = document.querySelector<HTMLElement>('main section[id]');
  if (first) syncChapterBackground(first.id);
  return () => {
    document.documentElement.style.backgroundColor = '';
  };
}
