/**
 * Home chapters 1–5, rebuilt for the choreography brief.
 *
 *  1  Prelude — a white field, pinned editorial beats, and a box at the
 *     bottom centre that grows with scroll until it floods the viewport in the
 *     brand orange. The flood *is* the transition into the hero: the hero is
 *     already behind it, so nothing fades.
 *  4  Services — an interactive selector: the highlight follows the pointer,
 *     the artwork changes with the selection, and each card expands into its
 *     own page.
 *  5  Deep dives — a pinned split screen. The visual stays; the text advances.
 */

import { services, type ServicePage } from '../content/routes';
import { icon, esc } from './html';
import { prelude as preludeCopy } from '../content/site';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/* -------------------------------------------------------------- 1. prelude */

export function renderPreludeFlood(): string {
  const beats = preludeCopy.beats
    .map(
      (beat, i) => `<li class="beat" data-beat="${i + 1}">
        <p class="beat__lead">${esc(beat.lead)}</p>
        <p class="beat__line" data-beat-line>${esc(beat.line)}</p>
        <p class="beat__aside">${esc(beat.aside)}</p>
      </li>`,
    )
    .join('');

  return `<section id="prelude" class="prelude prelude--choreo" data-chapter="prelude" data-theme="paper" aria-labelledby="prelude-title">
    <h1 class="sr-only" id="prelude-title">DENVUP — a digital studio for websites, interfaces and interactive experiences</h1>
    <div class="prelude__pin">
      <div class="prelude__beats-wrap">
        <ol class="prelude__beats">${beats}</ol>
        <p class="prelude__hint"><span aria-hidden="true">↓</span> Keep scrolling. The page opens.</p>
      </div>
      <div class="flood" data-flood data-cursor-label="the page opens" aria-hidden="true">
        <span class="flood__edge"></span>
        <span class="flood__label">The page opens</span>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------- 4. services */

function servicePanel(s: ServicePage, index: number): string {
  return `<article class="svc-panel" data-svc-panel="${s.slug}" style="--i:${index}"${index === 0 ? '' : ' hidden'}>
    <p class="svc-panel__kicker">${String(index + 1).padStart(2, '0')} · ${esc(s.short)}</p>
    <h3 class="svc-panel__name">${esc(s.name)}</h3>
    <p class="svc-panel__tagline">${esc(s.tagline)}</p>
    <ul class="svc-panel__points">${s.deliverables
      .slice(0, 3)
      .map((d) => `<li>${esc(d)}</li>`)
      .join('')}</ul>
    <div class="svc-panel__foot">
      <p class="svc-panel__price">From ${inr(s.priceFrom)}</p>
      <a class="btn btn--line" href="/services/${s.slug}"><span class="btn__label">Open the detail</span><span class="btn__icon">${icon('arrow-up-right')}</span></a>
    </div>
  </article>`;
}

export function renderServicesSelector(): string {
  const rows = services
    .map(
      (s, i) => `<li class="svc-row" style="--i:${i}">
        <button class="svc-row__btn" type="button" data-svc-tab="${s.slug}" aria-pressed="${i === 0}" aria-controls="svc-stage">
          <span class="svc-row__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <span class="svc-row__name">${esc(s.name)}</span>
          <span class="svc-row__price">${inr(s.priceFrom)}</span>
        </button>
      </li>`,
    )
    .join('');

  const panels = services.map(servicePanel).join('');
  const arts = services
    .map(
      (s, i) =>
        `<span class="svc-art" data-svc-art="${s.slug}"${i === 0 ? '' : ' hidden'} aria-hidden="true"><i></i><b></b></span>`,
    )
    .join('');

  return `<section id="services" class="services services--selector" data-chapter="services" data-theme="paper" aria-labelledby="services-title">
    <div class="services__inner">
      <header class="services__head">
        <h2 id="services-title">Five ways in.</h2>
        <p>Choose a service and the page changes around it. Every price below is a published starting point, not a quotation.</p>
      </header>
      <div class="selector" data-svc-selector>
        <div class="svc-rows-wrap">
          <ol class="svc-rows" aria-label="Services">${rows}</ol>
          <span class="selector__highlight" data-svc-highlight aria-hidden="true"></span>
        </div>
        <div class="svc-stage" id="svc-stage" data-svc-stage>${panels}</div>
        <div class="svc-arts" data-svc-arts>${arts}</div>
      </div>
      <p class="services__all"><a href="/services">Compare all five, side by side ${icon('arrow-up-right')}</a></p>
    </div>
  </section>`;
}

/* ------------------------------------------------------------ 5. deep dives */

const SIGNATURE: Record<string, { lab: string; mode: number; caption: string; ids: string }> = {
  'web-design': { lab: 'type', mode: 3, caption: 'Weight as emphasis — one variable axis carrying the hierarchy.', ids: '90, 91, 92' },
  'ai-solutions': { lab: 'story', mode: 2, caption: 'A flow with a bright path — an illustrated pipeline, not a live product.', ids: '303, 304' },
  integrations: { lab: 'collections', mode: 0, caption: 'A grid with real filters — the same structure used for records.', ids: '187, 188, 205' },
  interactive: { lab: 'threed', mode: 0, caption: 'A shader with a fallback — depth, with a designed still frame.', ids: '236, 238' },
  automation: { lab: 'process', mode: 0, caption: 'A line that connects — a workflow drawn so it can be questioned.', ids: '326, 327' },
};

export function renderDeepDives(): string {
  const items = services
    .map((s, i) => {
      const sig = SIGNATURE[s.slug]!;
      return `<article class="dive" data-dive="${s.slug}" style="--i:${i}" aria-labelledby="dive-${s.slug}">
        <div class="dive__figure">
          <div class="dive__screen" data-lab-host data-lab="${sig.lab}" data-mode="${sig.mode}" data-label="${esc(s.name)}">
            <p class="dive__fallback">${esc(sig.caption)}</p>
          </div>
          <p class="dive__caption">${esc(sig.caption)} <span class="dive__ids">${esc(sig.ids)}</span></p>
          <p class="dive__note">Illustration, not client work.</p>
        </div>
        <div class="dive__body">
          <p class="dive__kicker">${String(i + 1).padStart(2, '0')} / 05</p>
          <h3 id="dive-${s.slug}">${esc(s.name)}</h3>
          <p class="dive__lead">${esc(s.summary[0]!)}</p>
          <ul class="dive__points">${s.deliverables
            .slice(0, 4)
            .map((d) => `<li>${esc(d)}</li>`)
            .join('')}</ul>
          <div class="dive__actions">
            <a class="btn btn--solid" href="/services/${s.slug}"><span class="btn__label">Read the detail</span><span class="btn__icon">${icon('arrow-up-right')}</span></a>
            <p class="dive__price">From ${inr(s.priceFrom)}</p>
          </div>
        </div>
      </article>`;
    })
    .join('');

  return `<section id="services-deep" class="deep-dives deep-dives--pinned" data-chapter="services-deep" data-theme="bone" aria-labelledby="deep-title">
    <div class="deep-dives__pin">
      <header class="deep-dives__head">
        <h2 id="deep-title">What each one actually includes.</h2>
        <p>Scroll through. The figure stays and the detail changes — the same visual language carries each service, so the differences are in the content, not the decoration.</p>
      </header>
      <div class="dives" data-dives>${items}</div>
      <ol class="dives__rail" data-dives-rail aria-label="Jump to a service"></ol>
    </div>
  </section>`;
}
