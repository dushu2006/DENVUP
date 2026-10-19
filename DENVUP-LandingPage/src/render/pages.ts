import { brand, showcase, team, pricing as pricingContent, teamNote } from '../content/site';
import { services, serviceBySlug, legal, type ServicePage } from '../content/routes';
import { coverageRows, coverageSummary, statusOrder } from '../content/coverage-map';
import { labs } from '../labs/registry';
import { esc, icon } from './html';
import { renderPreludeFlood, renderServicesSelector, renderDeepDives } from './home-chapters';
import {
  renderHero,
  renderManifesto,
  renderCapabilities,
  renderProcess,
  renderTechnologies,
  renderTeam,
  renderShowcase,
  renderPricing,
  renderFaq,
  renderStandards,
} from './sections';
import { renderContact, renderClosing } from './forms';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/* ------------------------------------------------------------------- shared */

function pageHead(opts: { title: string; lead: string; kicker?: string; aside?: string }): string {
  return `<section class="page-head" data-ch="0" data-scene="paper">
    <div class="page-head__inner">
      ${opts.kicker ? `<p class="page-head__kicker">${esc(opts.kicker)}</p>` : ''}
      <h1 class="page-head__title">${esc(opts.title)}</h1>
      <p class="page-head__lead">${esc(opts.lead)}</p>
      ${opts.aside ? `<p class="page-head__aside">${esc(opts.aside)}</p>` : ''}
    </div>
  </section>`;
}

function ctaRow(primary = 'Start a project', secondary?: { label: string; href: string }): string {
  return `<div class="cta-row">
    <a class="btn btn--solid" href="/contact"><span class="btn__label">${esc(primary)}</span><span class="btn__icon">${icon('arrow-up-right')}</span></a>
    ${secondary ? `<a class="btn btn--line" href="${esc(secondary.href)}"><span class="btn__label">${esc(secondary.label)}</span><span class="btn__icon">${icon('arrow-down')}</span></a>` : ''}
  </div>`;
}

/* --------------------------------------------------------------------- home */

/** Chapter 7: three live studies, each naming its technique and offering a route in. */
function renderDemoChapter(): string {
  const picks = [
    { lab: 'type', mode: 3, title: 'Weight as emphasis', ids: '90, 91, 92', body: 'One variable font, three weights, one reading order. The emphasis is the layout.' },
    { lab: 'scroll', mode: 1, title: 'Sticky, then release', ids: '131, 148', body: 'A pinned stage that releases exactly when its argument ends — never a scroll takeover.' },
    { lab: 'threed', mode: 0, title: 'A shader with a fallback', ids: '236, 238', body: 'A depth field drawn on canvas, with a designed static frame when motion is reduced.' },
  ];
  const cards = picks
    .map(
      (p, i) => `<article class="demo-card" data-ch-part="${i + 1}">
        <div class="demo-card__stage" data-lab-host data-lab="${p.lab}" data-mode="${p.mode}" data-label="${esc(p.title)}">
          <p class="demo-card__fallback">${esc(p.title)} — a live study. It needs JavaScript; the description below still explains it.</p>
        </div>
        <div class="demo-card__body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.body)}</p>
          <p class="demo-card__ids">Technique ${esc(p.ids)}</p>
          <div class="demo-card__actions">
            <button class="mini" type="button" data-lab-replay>Replay</button>
            <a class="mini mini--go" href="/contact?subject=${encodeURIComponent(`I want ${p.title.toLowerCase()}`)}">I want this ${icon('arrow-up-right')}</a>
          </div>
        </div>
      </article>`,
    )
    .join('');

  return `<section id="demos" class="demos" data-chapter="demos" data-ch="7" data-scene="den" aria-labelledby="demos-title">
    <div class="demos__inner">
      <header class="demos__head">
        <h2 id="demos-title">Three things, working.</h2>
        <p>Not screenshots. Each one is mounted on this page, names the technique it uses, and can be replayed. If a demo cannot run, the sentence beside it still explains the idea.</p>
      </header>
      <div class="demos__grid" data-lab-group>${cards}</div>
      <p class="demos__more"><a href="/lab">The lab has ${labs.reduce((n, l) => n + l.modes.length, 0)} live studies ${icon('arrow-up-right')}</a></p>
    </div>
  </section>`;
}

export function homeBody(): string {
  return `${renderPreludeFlood()}
  ${renderHero()}
  ${renderManifesto()}
  ${renderServicesSelector()}
  ${renderDeepDives()}
  ${renderCapabilities()}
  ${renderDemoChapter()}
  ${renderProcess()}
  ${renderTechnologies()}
  ${renderTeam()}
  ${renderShowcase()}
  ${renderPricing()}
  ${renderFaq()}
  ${renderContact()}
  ${renderClosing()}`;
}

/* ----------------------------------------------------------------- services */

export function servicesIndexBody(): string {
  const cards = services
    .map(
      (s, i) => `<li class="svc-card" data-ch-part="${i + 1}" style="--i:${i}">
        <a class="svc-card__link" href="/services/${s.slug}" data-service-card>
          <div class="svc-card__art" data-svc-art="${s.slug}" aria-hidden="true"><span></span><i></i></div>
          <div class="svc-card__body">
            <h2 class="svc-card__name">${esc(s.name)}</h2>
            <p class="svc-card__short">${esc(s.short)}</p>
            <p class="svc-card__price">From ${inr(s.priceFrom)}</p>
            <span class="svc-card__go">Open ${icon('arrow-up-right')}</span>
          </div>
        </a>
      </li>`,
    )
    .join('');

  return `${pageHead({
    kicker: 'Services',
    title: 'Five ways in.',
    lead: 'Most projects use one of these as the spine and borrow from another. The starting price is published on every card, because a number is part of the brief.',
    aside: 'Prices are starting points. A written estimate follows a scope conversation.',
  })}
  <section class="route-section" data-ch="1" data-scene="paper" aria-labelledby="svc-list-title">
    <h2 class="sr-only" id="svc-list-title">The five services</h2>
    <ol class="svc-list" data-service-list>${cards}</ol>
  </section>
  <section class="route-section route-section--tight" data-ch="2" data-scene="bone" aria-labelledby="svc-how">
    <div class="split">
      <h2 id="svc-how">Not sure which one?</h2>
      <div class="split__body">
        <p>Describe the problem in a sentence and we will say which of the five it is — or whether it is none of them. That conversation is free and it is allowed to end in “you do not need this”.</p>
        ${ctaRow('Start a project', { label: 'See pricing', href: '/pricing' })}
      </div>
    </div>
  </section>`;
}

function svcDiagram(s: ServicePage): string {
  const steps = s.steps
    .map(
      (step, i) => `<li class="flow__step" data-ch-part="${i + 1}">
        <span class="flow__num">${String(i + 1).padStart(2, '0')}</span>
        <div><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p></div>
      </li>`,
    )
    .join('');
  return `<ol class="flow" data-flow>${steps}</ol>`;
}

export function serviceDetailBody(slug: string): string {
  const s = serviceBySlug.get(slug);
  if (!s) return notFoundBody();
  const related = s.related
    .map((r) => serviceBySlug.get(r))
    .filter((x): x is ServicePage => Boolean(x))
    .map(
      (r) => `<li><a href="/services/${r.slug}" data-service-card><span>${esc(r.name)}</span><span class="mini-arrow">${icon('arrow-up-right')}</span></a></li>`,
    )
    .join('');

  const who = s.whoFor.map((w) => `<li>${esc(w)}</li>`).join('');
  const what = s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('');
  const demos = s.demos
    .map(
      (d, i) => `<article class="demo-card demo-card--sm" data-ch-part="${i + 1}">
        <div class="demo-card__stage" data-lab-host data-lab="${d.lab}" data-mode="${d.mode}" data-label="${esc(d.label)}">
          <p class="demo-card__fallback">${esc(d.label)} — an illustration, mounted live when JavaScript runs.</p>
        </div>
        <div class="demo-card__body">
          <h3>${esc(d.label)}</h3>
          <p>${esc(d.note)}</p>
          <p class="demo-card__ids">Illustration — not client work</p>
        </div>
      </article>`,
    )
    .join('');

  return `<section class="svc-hero" data-ch="0" data-scene="${s.theme}" data-svc-hero="${s.slug}">
    <div class="svc-hero__inner">
      <p class="svc-hero__kicker"><a href="/services">Services</a> / ${esc(s.name)}</p>
      <h1 class="svc-hero__title" data-transition-title>${esc(s.name)}</h1>
      <p class="svc-hero__tagline">${esc(s.tagline)}</p>
      <p class="svc-hero__summary">${esc(s.summary[0]!)}</p>
      <div class="svc-hero__meta">
        <p>From <strong>${inr(s.priceFrom)}</strong></p>
        <a class="btn btn--solid" href="/contact?subject=${encodeURIComponent(s.name)}"><span class="btn__label">Start a project</span><span class="btn__icon">${icon('arrow-up-right')}</span></a>
      </div>
      <div class="svc-hero__art" data-svc-art="${s.slug}" aria-hidden="true"><span></span><i></i></div>
    </div>
  </section>
  <section class="route-section" data-ch="1" data-scene="${s.theme}" aria-labelledby="svc-what">
    <div class="split">
      <h2 id="svc-what">What it is</h2>
      <div class="split__body">${s.summary.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    </div>
  </section>
  <section class="route-section" data-ch="2" data-scene="bone" aria-labelledby="svc-who">
    <div class="cols2">
      <div><h2 id="svc-who">Who it is for</h2><ul class="tick-list">${who}</ul></div>
      <div><h2 id="svc-deliv">What you get</h2><ul class="tick-list">${what}</ul></div>
    </div>
  </section>
  <section class="route-section" data-ch="3" data-scene="ink" aria-labelledby="svc-flow">
    <div class="split split--onDark">
      <div><h2 id="svc-flow">How it works</h2><p class="split__note">${esc(s.signature)}</p></div>
      <div class="split__body">${svcDiagram(s)}</div>
    </div>
  </section>
  <section class="route-section" data-ch="4" data-scene="paper" aria-labelledby="svc-demos">
    <h2 id="svc-demos">The ideas, running.</h2>
    <p class="route-lead">These are illustrations of the kind of interaction the work can use. They are not client work and they are not screenshots.</p>
    <div class="demos__grid demos__grid--3" data-lab-group>${demos}</div>
  </section>
  <section class="route-section route-section--price" data-ch="5" data-scene="orange" aria-labelledby="svc-price">
    <div class="price-band">
      <div>
        <h2 id="svc-price">Starting at ${inr(s.priceFrom)}</h2>
        <p>${esc(s.priceNote)}</p>
      </div>
      ${ctaRow('Tell us about it', { label: 'All pricing', href: '/pricing' })}
    </div>
  </section>
  <section class="route-section" data-ch="6" data-scene="paper" aria-labelledby="svc-related">
    <h2 id="svc-related">Often paired with</h2>
    <ul class="related">${related}</ul>
  </section>`;
}

/* ---------------------------------------------------------------------- lab */

export function labBody(): string {
  const categories = labs.map((l, i) => ({ slug: l.slug, title: l.title, count: l.modes.length, i }));
  const tabs = categories
    .map(
      (c, i) =>
        `<button class="lab-tab" type="button" data-lab-filter="${c.slug}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span>${esc(c.title)}</span><em>${c.count}</em></button>`,
    )
    .join('');

  const sections = labs
    .map(
      (lab) => `<section class="lab-sec" data-lab-section="${lab.slug}" aria-labelledby="lab-${lab.slug}">
        <header class="lab-sec__head">
          <h2 id="lab-${lab.slug}">${esc(lab.title)}</h2>
          <p>${esc(lab.blurb)}</p>
        </header>
        <div class="lab-grid">${lab.modes
          .map(
            (mode, i) => `<article class="lab-card" data-lab-card data-lab-ids="${mode.ids.join(',')}" data-search="${esc(`${lab.title} ${mode.name} ${mode.summary} ${mode.ids.join(' ')}`.toLowerCase())}">
            <div class="lab-card__stage" data-lab-host data-lab="${lab.slug}" data-mode="${i}" data-label="${esc(mode.name)}">
              <p class="lab-card__fallback">${esc(mode.summary)}</p>
            </div>
            <div class="lab-card__body">
              <div class="lab-card__top"><h3>${esc(mode.name)}</h3><span class="lab-card__ids">${mode.ids.join(' · ')}</span></div>
              <p class="lab-card__summary">${esc(mode.summary)}</p>
              <div class="lab-card__actions">
                <button class="mini" type="button" data-lab-replay>Replay</button>
                <a class="mini mini--go" href="/contact?subject=${encodeURIComponent(`I want ${mode.name}`)}">I want this ${icon('arrow-up-right')}</a>
              </div>
              ${mode.notes?.motion ? `<p class="lab-card__note">Mobile / reduced motion: ${esc(mode.notes.motion)}</p>` : ''}
              ${mode.notes?.keyboard ? `<p class="lab-card__note">Keyboard: ${esc(mode.notes.keyboard)}</p>` : ''}
            </div>
          </article>`,
          )
          .join('')}</div>
      </section>`,
    )
    .join('');

  const demoIds = new Set(labs.flatMap((l) => l.modes.flatMap((m) => m.ids)));
  const grouped = statusOrder
    .map((status) => {
      const rows = coverageRows.filter((r) => r.status === status);
      return `<details class="cov-group" data-cov="${status}">
        <summary><span>${status}</span><em>${rows.length}</em></summary>
        <ul class="cov-list">${rows
          .map((r) => `<li><b>${r.id}</b> ${esc(r.name)}</li>`)
          .join('')}</ul>
      </details>`;
    })
    .join('');

  return `${pageHead({
    kicker: 'The Lab',
    title: 'Every idea, working.',
    lead: 'A live library of interaction studies. Each card mounts the real code, names the encyclopedia technique it uses, and can be replayed. Filter, search, or read the ones you need.',
    aside: `${labs.length} studies · ${labs.reduce((n, l) => n + l.modes.length, 0)} demos · ${demoIds.size} technique IDs demonstrated live.`,
  })}
  <section class="lab-controls" data-ch="1" data-scene="ink" aria-label="Filter the lab">
    <div class="lab-controls__inner">
      <div class="lab-tabs" role="group" aria-label="Categories">
        <button class="lab-tab" type="button" data-lab-filter="all" aria-pressed="true"><span>All</span><em>${labs.length}</em></button>
        ${tabs}
      </div>
      <label class="lab-search">
        <span class="sr-only">Search the lab by name, description or technique ID</span>
        ${icon('search')}
        <input type="search" placeholder="Search by name or ID…" data-lab-search autocomplete="off">
      </label>
      <p class="lab-count" role="status" aria-live="polite"><span data-lab-count>${labs.reduce((n, l) => n + l.modes.length, 0)}</span> demos</p>
    </div>
  </section>
  <div class="lab-empty" data-lab-empty hidden>
    <p>No demo matches that. <button class="linklike" type="button" data-lab-reset>Clear the filter</button></p>
  </div>
  <div class="lab-body" data-lab-body>${sections}</div>
  <section class="route-section coverage" id="coverage" data-ch="2" data-scene="ink" aria-labelledby="coverage-title">
    <div class="split">
      <h2 id="coverage-title">All ${coverageRows.length} IDs, accounted for.</h2>
      <div class="split__body">
        <p>This library demonstrates ${demoIds.size} of the ${coverageRows.length} techniques in the encyclopedia. The rest are grouped below by honest status: implemented elsewhere on the site, blocked with a named reason, or planned and not claimed.</p>
        <div class="cov-summary">${statusOrder.map((s) => `<span><b>${coverageSummary[s]}</b> ${s.toLowerCase()}</span>`).join('')}</div>
        ${grouped}
      </div>
    </div>
  </section>`;
}

/* ----------------------------------------------------------------- concepts */

export function conceptsBody(): string {
  const items = showcase
    .map(
      (c, i) => `<article class="concept" data-ch-part="${i + 1}">
        <div class="concept__head">
          <p class="concept__kind">${esc(c.kind)} · Self-initiated concept</p>
          <h2>${esc(c.title)}</h2>
        </div>
        <div class="concept__body">
          <p>${esc(c.summary)}</p>
          <p class="concept__build">${esc(c.build)}</p>
          <p class="concept__note">${esc(c.note)}</p>
        </div>
        <div class="concept__demo" data-concept-demo="${c.demo}">
          <p class="cap__fallback">${esc(c.title)} — a live concept study, mounted when JavaScript runs.</p>
        </div>
      </article>`,
    )
    .join('');

  return `${pageHead({
    kicker: 'Concepts',
    title: 'Four studies, no clients.',
    lead: 'Self-initiated pieces that show how we think about type, fields, catalogues and scroll. They are concepts: no client, no result and no brief is implied.',
    aside: 'Everything here is clearly labelled. Nothing on this page is client work.',
  })}
  <section class="route-section" data-ch="1" data-scene="bone"><div class="concept-list">${items}</div></section>
  <section class="route-section route-section--tight" data-ch="2" data-scene="paper">
    ${ctaRow('Start a project', { label: 'See the lab', href: '/lab' })}
  </section>`;
}

/* ------------------------------------------------------------------- studio */

export function studioBody(): string {
  const names = team
    .map(
      (m, i) => `<li class="nameplate" data-ch-part="${i + 1}" style="--i:${i}">
        <button class="nameplate__btn" type="button" data-person="${i}" aria-haspopup="dialog">
          <span class="nameplate__initials" aria-hidden="true">${esc(m.initials)}</span>
          <span class="nameplate__name">${esc(m.name)}</span>
          <span class="nameplate__hint">One of four ${icon('arrow-up-right')}</span>
        </button>
      </li>`,
    )
    .join('');

  return `${pageHead({
    kicker: 'Studio',
    title: 'Four people, one standard.',
    lead: 'DENVUP is a digital studio in Andhra Pradesh. We design and build websites, interfaces and interactive work, and we publish what they cost.',
    aside: 'No invented history, no borrowed clients, no stock portraits.',
  })}
  <section class="route-section" data-ch="1" data-scene="paper" aria-labelledby="studio-what">
    <div class="split">
      <h2 id="studio-what">What we are</h2>
      <div class="split__body">
        <p>${esc(brand.description)}</p>
        <p>${esc(teamNote)}</p>
      </div>
    </div>
  </section>
  <section class="route-section" data-ch="2" data-scene="ink" aria-labelledby="studio-names">
    <h2 id="studio-names">The four</h2>
    <ul class="nameplates">${names}</ul>
  </section>
  ${renderManifesto()}
  ${renderStandards()}
  ${renderProcess()}
  ${renderTechnologies()}
  <section class="route-section route-section--tight" data-ch="3" data-scene="bone" aria-labelledby="studio-cta">
    <div class="split">
      <h2 id="studio-cta">Work with us</h2>
      <div class="split__body"><p>Tell us what you are building. If it is not a fit, we will say so in the first reply.</p>${ctaRow('Start a project', { label: 'Read the terms', href: '/terms' })}</div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ pricing */

export function pricingBody(): string {
  return `${pageHead({
    kicker: 'Pricing',
    title: 'Starting points, published.',
    lead: pricingContent.intro,
    aside: 'Three starting points: ₹15,000 · ₹20,000 · ₹50,000. A written estimate follows the scope.',
  })}
  ${renderPricing()}
  ${renderFaq()}
  <section class="route-section route-section--tight" data-ch="2" data-scene="paper">
    ${ctaRow('Ask for an estimate', { label: 'What is included in a build', href: '/services' })}
  </section>`;
}

/* ------------------------------------------------------------------ contact */

export function contactBody(): string {
  return `<section class="route-section route-section--contact" data-ch="0" data-scene="orange">
    ${renderContact(1)}
  </section>`;
}

/* -------------------------------------------------------------------- legal */

export function legalBody(kind: 'privacy' | 'terms'): string {
  const doc = legal[kind];
  const sections = doc.sections
    .map(
      (s, i) => `<section class="legal__sec" data-ch-part="${i + 1}">
        <h2>${esc(s.h)}</h2>
        <p>${esc(s.p)}</p>
      </section>`,
    )
    .join('');
  return `${pageHead({ kicker: 'Legal', title: doc.title, lead: doc.lead })}
  <section class="route-section" data-ch="1" data-scene="paper">
    <div class="legal">${sections}
      <p class="legal__updated">Last updated 19 October 2026. Items marked “owner to confirm” are listed in ASSETS.md and are not presented as settled.</p>
    </div>
  </section>`;
}

/* ----------------------------------------------------------------------- 404 */

export function notFoundBody(): string {
  return `<section class="notfound" data-ch="0" data-scene="den" aria-labelledby="nf-title">
    <div class="notfound__inner">
      <p class="notfound__code" aria-hidden="true" data-glitch>404</p>
      <h1 id="nf-title">This page is not here.</h1>
      <p class="notfound__lead">The link may be old, or the page may have moved. These all exist:</p>
      <ul class="notfound__links">
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/lab">The Lab</a></li>
        <li><a href="/studio">Studio</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
  </section>`;
}
