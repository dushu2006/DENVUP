import { $$, on } from './env';
import { mountEmbed } from './labs';
import { capabilityDemo } from '../content/demo-map';

/**
 * Capability stage: one live demo mounted at a time.
 * The previous mount is destroyed before the next starts so no canvas,
 * interval or pointer listener survives a switch.
 */
export function initCapabilities(): void {
  const tabs = $$<HTMLButtonElement>('[data-cap-tab]');
  const panels = $$<HTMLElement>('[data-cap-panel]');
  const counter = document.querySelector<HTMLElement>('[data-cap-count]');
  if (!tabs.length || tabs.length !== panels.length) return;

  let current = -1;
  let destroy: (() => void) | null = null;

  const select = (index: number, focus = false): void => {
    if (index === current) return;
    destroy?.();
    destroy = null;

    current = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });

    const panel = panels[index];
    const host = panel?.querySelector<HTMLElement>('[data-cap-demo]');
    if (panel && host) {
      const key = panel.dataset.capPanel ?? '';
      const mapping = capabilityDemo[key];
      const label = tabs[index]?.querySelector('.caps__name')?.textContent?.trim() ?? key;
      host.querySelector('.cap__fallback')?.remove();
      if (mapping) destroy = mountEmbed(host, mapping[0], mapping[1], label);
      panel.dataset.mounted = 'true';
    }

    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    if (focus) tabs[index]?.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    on(tab, 'keydown', (event) => {
      const key = (event as KeyboardEvent).key;
      let next = i;
      if (key === 'ArrowDown' || key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (key === 'ArrowUp' || key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  });

  select(0);
}
