import {
  brand,
  capabilities,
  closing,
  contact,
  enquiryText,
  faq,
  hero,
  identity,
  manifesto,
  nav,
  prelude,
  pricing,
  processSteps,
  services,
  showcase,
  standards,
  team,
  teamNote,
  technologies,
  waLink,
} from '../content/site';
import { cta, esc, icon, logoMark, mailto, sectionHead, wordmark } from './html';

/* ------------------------------------------------------------------ prelude */

export function renderPrelude(): string {
  const beats = prelude.beats
    .map(
      (beat, i) => `
      <div class="beat" data-beat="${i + 1}">
        <div class="beat__inner">
          <p class="beat__lead" data-reveal="rise">${esc(beat.lead)}</p>
          <p class="beat__line" data-beat-line>${esc(beat.line)}</p>
          <p class="beat__aside">${esc(beat.aside)}</p>
        </div>
        <div class="beat__index" aria-hidden="true">${String(i + 1).padStart(2, '0')} / 03</div>
      </div>`,
    )
    .join('');

  return `<section id="prelude" class="prelude" data-chapter="prelude" data-theme="paper" aria-labelledby="prelude-title">
    <h1 class="sr-only" id="prelude-title">DENVUP — a digital studio for websites, interfaces and interactive experiences</h1>
    <a class="prelude__skip" href="#hero" data-skip-intro>${esc(prelude.skipLabel)} ${icon('arrow-down')}</a>
    <div class="prelude__beats">${beats}</div>
    <div class="prelude__foot">
      <p class="prelude__hint"><span class="prelude__square" aria-hidden="true"></span>${esc(prelude.gateHint)}</p>
      <p class="prelude__scroll">${esc(prelude.gateLabel)} ${icon('arrow-down')}</p>
    </div>
  </section>`;
}

/* --------------------------------------------------------------------- gate */

export function renderGate(): string {
  return `<section id="gate" class="gate" data-chapter="gate" data-theme="paper" aria-label="The den opens">
    <div class="gate__stage" data-gate-stage>
      <div class="gate__frame" aria-hidden="true">
        <span class="gate__corner gate__corner--tl"></span>
        <span class="gate__corner gate__corner--tr"></span>
        <span class="gate__corner gate__corner--bl"></span>
        <span class="gate__corner gate__corner--br"></span>
      </div>
      <div class="gate__field" data-gate-field>
        <div class="gate__field-inner">
          <p class="gate__label" data-gate-label>${esc(prelude.gateHint)}</p>
          <p class="gate__end" data-gate-end>${esc(prelude.gateEnd)}</p>
          <div class="gate__count" aria-hidden="true"><span data-gate-num>00</span><span class="gate__count-sep">/</span><span>100</span></div>
        </div>
        <span class="gate__box-outline" data-gate-box aria-hidden="true"></span>
      </div>
      <p class="gate__instruction" data-gate-hint>${esc(prelude.gateLabel)} — ${esc(prelude.gateHint)}</p>
    </div>
  </section>`;
}

/* --------------------------------------------------------------------- hero */

export function renderHero(): string {
  const facts = hero.facts
    .map(
      (f) => `<li class="hero__fact"><span class="hero__fact-value">${esc(f.value)}</span><span class="hero__fact-label">${esc(f.label)}</span></li>`,
    )
    .join('');
  const orbit = [...hero.orbit, ...hero.orbit].join(' · ');
  return `<section id="hero" class="hero" data-chapter="hero" data-theme="orange" aria-labelledby="hero-title">
    <div class="hero__grain" aria-hidden="true"></div>
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__kicker">${esc(hero.kicker)} <span class="hero__dot" aria-hidden="true"></span> ${esc(brand.location)}</p>
        <h2 class="hero__title" id="hero-title">
          <span class="hero__line" data-reveal="rise">${esc(hero.headline[0])}</span>
          <span class="hero__line" data-reveal="rise">${esc(hero.headline[1])}</span>
        </h2>
        <p class="hero__lede">${esc(hero.lede)}</p>
        <div class="hero__actions">
          ${cta({ label: hero.primaryCta.label, href: hero.primaryCta.href, variant: 'solid', icon: 'arrow-up-right' })}
          ${cta({ label: hero.secondaryCta.label, href: hero.secondaryCta.href, variant: 'line', icon: 'arrow-down' })}
        </div>
      </div>
      <div class="hero__orbit" data-hero-orbit aria-hidden="true">
        <canvas class="hero__canvas" data-hero-canvas width="720" height="720"></canvas>
        <div class="hero__ring hero__ring--outer"><svg viewBox="0 0 400 400" class="hero__orbit-type">
          <defs><path id="heroOrbitPath" d="M200,200 m-168,0 a168,168 0 1,1 336,0 a168,168 0 1,1 -336,0" fill="none"/></defs>
          <text><textPath href="#heroOrbitPath" startOffset="0%">${esc(orbit)} · </textPath></text>
        </svg></div>
        <div class="hero__ring hero__ring--mid"></div>
        <div class="hero__ring hero__ring--inner"></div>
        <div class="hero__mark"><img src="/assets/brand/logo-black-360.webp" width="360" height="360" alt="" decoding="async"></div>
        <span class="hero__satellite" data-hero-satellite></span>
      </div>
      <ul class="hero__facts">${facts}</ul>
      <div class="hero__foot">
        <p class="hero__scroll-note">${esc(hero.scrollNote)} ${icon('arrow-down')}</p>
        <p class="hero__reel-note"><span>${esc(hero.reelLabel)}</span> ${esc(hero.reelNote)}</p>
      </div>
    </div>
  </section>`;
}

/* ----------------------------------------------------------------- identity */

export function renderIdentity(): string {
  const states = identity.captions
    .map(
      (c, i) => `<li class="identity__state identity__state--${i}">
        <span class="identity__state-mark" aria-hidden="true">${
          i === 2
            ? '<img src="/assets/brand/logo-white-360.webp" alt="" width="360" height="360" loading="lazy" decoding="async">'
            : i === 1
              ? '<img src="/assets/brand/logo-colour-360.webp" alt="" width="360" height="360" loading="lazy" decoding="async">'
              : '<img src="/assets/brand/logo-black-360.webp" alt="" width="360" height="360" loading="lazy" decoding="async">'
        }</span>
        <span class="identity__state-tone">${esc(c.tone)}</span>
        <span class="identity__state-note">${esc(c.note)}</span>
        <code class="identity__state-file">${esc(c.file)}</code>
      </li>`,
    )
    .join('');

  return `<section id="identity" class="identity" data-chapter="identity" data-theme="ink" aria-labelledby="identity-title">
    <div class="identity__stage">
      <div class="identity__plate" data-identity-plate aria-hidden="true">
        <div class="identity__plate-grid"></div>
        <img class="identity__mark identity__mark--colour" src="/assets/brand/logo-colour-360.webp" width="360" height="360" alt="" decoding="async">
        <img class="identity__mark identity__mark--black" src="/assets/brand/logo-black-360.webp" width="360" height="360" alt="" loading="lazy" decoding="async">
        <img class="identity__mark identity__mark--white" src="/assets/brand/logo-white-360.webp" width="360" height="360" alt="" loading="lazy" decoding="async">
        <span class="identity__wipe" data-identity-wipe></span>
        <span class="identity__scan" aria-hidden="true"></span>
        <span class="identity__plate-label">mark / 01</span>
      </div>
      <div class="identity__copy">
        ${sectionHead({ eyebrow: identity.eyebrow, title: identity.title, lede: identity.body, id: 'identity-title' })}
        <ul class="identity__facts">${identity.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <p class="identity__note">${esc(identity.transitionNote)}</p>
      </div>
    </div>
    <ul class="identity__states">${states}</ul>
  </section>`;
}

/* ----------------------------------------------------------------- manifesto */

export function renderManifesto(): string {
  const principles = manifesto.principles
    .map(
      (p, i) => `<li class="principle" data-principle>
        <span class="principle__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="principle__title">${esc(p.lead)}</h3>
        <p class="principle__body">${esc(p.body)}</p>
      </li>`,
    )
    .join('');
  return `<section id="manifesto" class="manifesto" data-chapter="manifesto" data-theme="ink" aria-labelledby="manifesto-title">
    <div class="manifesto__inner">
      <header class="manifesto__head">
        <p class="section-head__eyebrow"><span class="dot" aria-hidden="true"></span>${esc(manifesto.eyebrow)}</p>
        <h2 class="manifesto__title" id="manifesto-title">${esc(manifesto.title)}</h2>
        <p class="manifesto__intro">${esc(manifesto.intro)}</p>
      </header>
      <ol class="principles">${principles}</ol>
      <p class="manifesto__close">${esc(manifesto.close)}</p>
    </div>
    <figure class="manifesto__quote" data-quote>
      <blockquote>${esc(manifesto.quote)}</blockquote>
      <figcaption>The studio, in one line</figcaption>
    </figure>
  </section>`;
}

/* ----------------------------------------------------------------- services */

export function renderServices(): string {
  const cards = services
    .map(
      (s) => `<li class="service-card" data-service-card data-theme="${s.theme}">
        <a class="service-card__link" href="#service-${esc(s.slug)}">
          <span class="service-card__index">${esc(s.index)}</span>
          <h3 class="service-card__title">${esc(s.title)}</h3>
          <p class="service-card__short">${esc(s.short)}</p>
          <span class="service-card__tags">${s.deliverables.slice(0, 3).map((d) => `<span>${esc(d.split(',')[0].split(' and ')[0])}</span>`).join('')}</span>
          <span class="service-card__cta">Read the detail ${icon('arrow-right')}</span>
        </a>
      </li>`,
    )
    .join('');

  return `<section id="services" class="services" data-chapter="services" data-theme="paper" aria-labelledby="services-title">
    <div class="services__pin" data-horizontal data-horizontal-min="900">
      <div class="services__head">
        ${sectionHead({
          eyebrow: 'Services',
          title: 'Six ways we make the web<br>do something.',
          lede: 'Start with the outcome you need. Every service is delivered by the same four people, with the same standard for motion, speed and access.',
          id: 'services-title',
        })}
        <p class="rail-hint">Scroll to move sideways <span aria-hidden="true">→</span></p>
      </div>
      <ol class="services__rail" data-rail aria-label="Services">
        ${cards}
      </ol>
      <div class="rail-meter" aria-hidden="true"><span data-rail-meter></span></div>
    </div>
  </section>`;
}

export function renderServiceDeepDives(): string {
  const articles = services
    .map(
      (s, i) => `<article class="deepdive" id="service-${esc(s.slug)}" data-deepdive data-theme="${s.theme}" aria-labelledby="service-title-${esc(s.slug)}">
        <div class="deepdive__aside">
          <span class="deepdive__index">${esc(s.index)}</span>
          <span class="deepdive__rule" aria-hidden="true"></span>
          <span class="deepdive__position">${String(i + 1).padStart(2, '0')} / 06</span>
        </div>
        <div class="deepdive__body">
          <h3 class="deepdive__title" id="service-title-${esc(s.slug)}">${esc(s.title)}</h3>
          <p class="deepdive__summary">${esc(s.summary)}</p>
          <dl class="deepdive__facts">
            <div><dt>Who it is for</dt><dd>${esc(s.forWho)}</dd></div>
            <div><dt>What you get</dt><dd><ul>${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></dd></div>
            <div><dt>What changes</dt><dd><ul>${s.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></dd></div>
          </dl>
          <p class="deepdive__proof">${esc(s.proof)}</p>
          <div class="deepdive__actions">
            ${cta({
              label: `Talk about ${s.title.split(' ')[0].toLowerCase()}`,
              href: mailto(`Project enquiry — ${s.title}`, `${enquiryText.general}\n\nService: ${s.title}`),
              variant: 'line',
              icon: 'mail',
            })}
            <span class="deepdive__price">From ${esc(s.slug === 'websites' ? pricing.tiers[1].fromLabel : s.slug === 'custom' ? pricing.tiers[2].fromLabel : s.slug === 'ui-ux' || s.slug === 'interactive' || s.slug === 'brand' || s.slug === 'care' ? pricing.tiers[2].fromLabel : pricing.tiers[0].fromLabel)}</span>
          </div>
        </div>
      </article>`,
    )
    .join('');
  return `<section id="services-deep" class="deep-dives" data-chapter="services-deep" data-theme="bone" aria-labelledby="deep-title">
    <div class="deep-dives__head wrap">
      ${sectionHead({
        eyebrow: 'In detail',
        title: 'What each service actually includes.',
        lede: 'No mystery boxes. The deliverables and outcomes below are the scope we plan against; anything outside it gets its own written scope.',
        id: 'deep-title',
      })}
    </div>
    <div class="deep-dives__list">${articles}</div>
  </section>`;
}

/* --------------------------------------------------------------- capabilities */

export function renderCapabilities(): string {
  const panels = capabilities
    .map(
      (c, i) => `<li class="cap" data-cap="${esc(c.key)}" data-theme="${i % 2 ? 'ink' : 'paper'}">
        <div class="cap__top">
          <span class="cap__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="cap__title">${esc(c.title)}</h3>
        </div>
        <div class="cap__demo" data-cap-demo="${esc(c.key)}" role="group" aria-label="${esc(c.title)} live demonstration">
          <p class="cap__fallback">Demo loading…</p>
        </div>
        <p class="cap__body">${esc(c.body)}</p>
        <ul class="cap__tags">${c.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </li>`,
    )
    .join('');
  return `<section id="capabilities" class="capabilities" data-chapter="capabilities" data-theme="ink" aria-labelledby="capabilities-title">
    <div class="capabilities__head wrap">
      ${sectionHead({
        eyebrow: 'Capabilities',
        title: 'Nine rooms in the same house.',
        lede: 'Each panel is a live demonstration, not a screenshot. Drag, tap, tab or use the controls inside it. The full library below has the rest.',
        id: 'capabilities-title',
      })}
      <p class="rail-hint">Drag, swipe or use the arrows <span aria-hidden="true">→</span></p>
    </div>
    <ol class="capabilities__rail" data-rail aria-label="Capability demonstrations">${panels}</ol>
    <div class="capabilities__controls wrap" data-cap-controls>
      <button class="round-btn" type="button" data-cap-prev aria-label="Previous capability">${icon('arrow-left')}</button>
      <button class="round-btn" type="button" data-cap-next aria-label="Next capability">${icon('arrow-right')}</button>
      <p class="capabilities__progress"><span data-cap-count>01</span> / 09</p>
    </div>
  </section>`;
}

/* -------------------------------------------------------------------- process */

export function renderProcess(): string {
  const steps = processSteps
    .map(
      (s, i) => `<li class="stage" data-stage>
        <button class="stage__button" type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="stage-panel-${i}" id="stage-tab-${i}" data-stage-button>
          <span class="stage__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <span class="stage__title">${esc(s.title)}</span>
          <span class="stage__plus" aria-hidden="true">${icon('plus')}</span>
        </button>
        <div class="stage__panel" id="stage-panel-${i}" role="region" aria-labelledby="stage-tab-${i}" data-stage-panel ${i === 0 ? '' : 'hidden'}>
          <p class="stage__body">${esc(s.body)}</p>
          <p class="stage__deliverable"><span>You end this stage with</span> ${esc(s.deliverable)}</p>
          <p class="stage__detail">${esc(s.detail)}</p>
        </div>
      </li>`,
    )
    .join('');
  return `<section id="process" class="process" data-chapter="process" data-theme="bone" aria-labelledby="process-title">
    <div class="process__head wrap">
      ${sectionHead({
        eyebrow: 'Process',
        title: 'Six stages, no theatre.',
        lede: 'A project moves through the same six stages. You always know which one we are in, what is being decided, and what you will hold at the end of it.',
        id: 'process-title',
      })}
    </div>
    <div class="process__pin" data-horizontal data-horizontal-min="1000">
      <div class="process__track">
        <svg class="process__line" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 H1200" class="process__line-base"/>
          <path d="M0 60 H1200" class="process__line-live" data-process-line/>
        </svg>
        <ol class="process__steps">${steps}</ol>
      </div>
      <p class="process__hint">Scroll to advance the timeline. Every stage opens with keyboard or tap.</p>
    </div>
  </section>`;
}

/* --------------------------------------------------------------- technologies */

export function renderTechnologies(): string {
  const nodes = technologies
    .map((t, i) => {
      const angle = (i / technologies.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 41;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius * 0.86;
      return `<button class="tech-node" type="button" data-tech-node="${i}" style="--x:${x.toFixed(2)};--y:${y.toFixed(2)}" aria-describedby="tech-detail" aria-label="${esc(t.name)} — ${esc(t.role)}"><span>${esc(t.name)}</span></button>`;
    })
    .join('');
  const lines = technologies
    .map((_, i) => {
      const angle = (i / technologies.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 41;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius * 0.86;
      return `<line x1="50" y1="50" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" />`;
    })
    .join('');
  const list = technologies
    .map(
      (t) => `<li><button type="button" class="tech-list__item" data-tech-node="${technologies.indexOf(t)}">
        <span class="tech-list__name">${esc(t.name)}</span><span class="tech-list__role">${esc(t.role)}</span>
      </button></li>`,
    )
    .join('');

  return `<section id="technologies" class="technologies" data-chapter="technologies" data-theme="ink" aria-labelledby="tech-title">
    <div class="technologies__inner wrap">
      <div class="technologies__copy">
        ${sectionHead({
          eyebrow: 'Technologies',
          title: 'A short list, used honestly.',
          lede: 'Only tools that appear in this repository. No speculative stack, no logo wall. Select a node or use the list to see where it is used.',
          id: 'tech-title',
        })}
        <div class="tech-detail" id="tech-detail" aria-live="polite">
          <p class="tech-detail__name" data-tech-name>${esc(technologies[0].name)}</p>
          <p class="tech-detail__role" data-tech-role>${esc(technologies[0].role)}</p>
          <p class="tech-detail__note" data-tech-note>${esc(technologies[0].note)}</p>
        </div>
      </div>
      <div class="technologies__atlas" data-atlas>
        <svg class="atlas__lines" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="41" class="atlas__orbit"/>
          <circle cx="50" cy="50" r="27" class="atlas__orbit atlas__orbit--inner"/>
          ${lines}
        </svg>
        <div class="atlas__core" aria-hidden="true">${logoMark('logo-mask--orange')}<span>DENVUP</span></div>
        ${nodes}
      </div>
      <ul class="tech-list" aria-label="Technology list">${list}</ul>
    </div>
  </section>`;
}

/* ----------------------------------------------------------------------- team */

const teamMarks: Record<string, string> = {
  arc: '<path d="M8 62a42 42 0 0 1 84 0" /><path d="M24 70a26 26 0 0 1 52 0" /><circle cx="50" cy="70" r="6"/>',
  orbit: '<circle cx="50" cy="50" r="12"/><ellipse cx="50" cy="50" rx="42" ry="20"/><ellipse cx="50" cy="50" rx="20" ry="42"/>',
  grid: '<path d="M18 18h64v64H18zM18 39h64M18 60h64M39 18v64M60 18v64"/>',
  wave: '<path d="M10 58c10-30 20-30 30 0s20 30 30 0 20-30 20 0"/><path d="M10 74c10-18 20-18 30 0s20 18 30 0 20-18 20 0"/>',
};

export function renderTeam(): string {
  const plates = team
    .map(
      (m, i) => `<li class="person" data-person="${i}">
        <button class="person__button" type="button" data-person-open="${i}" aria-haspopup="dialog" aria-label="Meet ${esc(m.name)}">
          <span class="person__art" aria-hidden="true">
            <svg viewBox="0 0 100 100" class="person__art-svg">${teamMarks[m.mark]}</svg>
            <span class="person__initials">${esc(m.initials)}</span>
          </span>
          <span class="person__meta"><span class="person__name" data-person-name>${esc(m.name)}</span><span class="person__one">One of four</span></span>
          <span class="person__arrow" aria-hidden="true">${icon('arrow-up-right')}</span>
        </button>
      </li>`,
    )
    .join('');
  return `<section id="team" class="team" data-chapter="team" data-theme="paper" aria-labelledby="team-title">
    <div class="team__head wrap">
      ${sectionHead({
        eyebrow: 'Team',
        title: 'Four people, named.',
        lede: 'A small studio is an advantage only if you can reach it. These are the people who will actually do the work.',
        id: 'team-title',
      })}
    </div>
    <ol class="team__grid">${plates}</ol>
    <div class="team__note wrap"><p>${esc(teamNote)}</p>${cta({ label: 'Talk to the studio', href: '#contact', variant: 'line', icon: 'arrow-down' })}</div>
  </section>`;
}

/* ------------------------------------------------------------------ showcase */

export function renderShowcase(): string {
  const items = showcase
    .map(
      (c, i) => `<li class="concept" data-concept data-demo="${esc(c.demo)}" data-theme="${i % 2 ? 'ink' : 'paper'}">
        <div class="concept__head">
          <span class="concept__kind"><span class="badge">Concept</span>${esc(c.kind)}</span>
          <span class="concept__count" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        </div>
        <h3 class="concept__title">${esc(c.title)}</h3>
        <p class="concept__summary">${esc(c.summary)}</p>
        <div class="concept__demo" data-concept-demo="${esc(c.demo)}" role="group" aria-label="${esc(c.title)} live concept demo"><p class="cap__fallback">Demo loading…</p></div>
        <p class="concept__build">${esc(c.build)}</p>
        <p class="concept__note">${esc(c.note)}</p>
      </li>`,
    )
    .join('');
  return `<section id="showcase" class="showcase" data-chapter="showcase" data-theme="bone" aria-labelledby="showcase-title">
    <div class="showcase__head wrap">
      ${sectionHead({
        eyebrow: 'Concepts',
        title: 'Evidence, not claims.',
        lede: 'We have not invented clients, awards or testimonials. Instead, four clearly labelled concepts run live on this page. They are the work sample.',
        id: 'showcase-title',
      })}
    </div>
    <ol class="showcase__list">${items}</ol>
  </section>`;
}

/* ------------------------------------------------------------------- pricing */

export function renderPricing(): string {
  const cards = pricing.tiers
    .map(
      (t) => `<li class="price-card${t.featured ? ' price-card--featured' : ''}">
        <div class="price-card__top">
          <h3 class="price-card__name">${esc(t.name)}</h3>
          ${t.featured ? '<span class="badge badge--ink">Most common</span>' : ''}
        </div>
        <p class="price-card__from"><span>from</span> ${esc(t.fromLabel)}</p>
        <p class="price-card__best">${esc(t.best)}</p>
        <ul class="price-card__list">${t.includes.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <p class="price-card__time">${esc(t.timeline)}</p>
        ${cta({ label: 'Enquire', href: `#contact`, variant: t.featured ? 'solid' : 'line', icon: 'arrow-up-right', data: { budget: t.name } })}
      </li>`,
    )
    .join('');
  const notes = pricing.notes.map((n) => `<li>${esc(n)}</li>`).join('');
  const engagements = pricing.engagement
    .map((e) => `<div class="engage"><h4>${esc(e.title)}</h4><p>${esc(e.body)}</p></div>`)
    .join('');

  return `<section id="pricing" class="pricing" data-chapter="pricing" data-theme="ink" aria-labelledby="pricing-title">
    <div class="pricing__inner wrap">
      ${sectionHead({ eyebrow: pricing.eyebrow, title: pricing.title, lede: pricing.intro, id: 'pricing-title' })}
      <ol class="pricing__cards">${cards}</ol>
      <div class="pricing__notes">
        <h3 class="pricing__notes-title">What the number does and does not include</h3>
        <ul>${notes}</ul>
      </div>
      <div class="pricing__engage">${engagements}</div>
      ${renderEstimator()}
    </div>
  </section>`;
}

function renderEstimator(): string {
  const { estimator } = pricing;
  const typeOptions = estimator.types
    .map(
      (t, i) => `<label class="choice"><input type="radio" name="est-type" value="${esc(t.key)}" ${i === 0 ? 'checked' : ''}><span>${esc(t.label)}</span><small>from ₹${t.base.toLocaleString('en-IN')}</small></label>`,
    )
    .join('');
  const pageOptions = estimator.pageOptions
    .map(
      (p, i) => `<label class="choice"><input type="radio" name="est-pages" value="${esc(p.key)}" ${i === 1 ? 'checked' : ''}><span>${esc(p.label)}</span><small>${p.add ? `+₹${p.add.toLocaleString('en-IN')}` : 'included'}</small></label>`,
    )
    .join('');
  const motionOptions = estimator.motionOptions
    .map(
      (m, i) => `<label class="choice"><input type="radio" name="est-motion" value="${esc(m.key)}" ${i === 0 ? 'checked' : ''}><span>${esc(m.label)}</span><small>${m.add ? `+₹${m.add.toLocaleString('en-IN')}` : 'included'}</small></label>`,
    )
    .join('');
  const extras = estimator.extraOptions
    .map((e) => `<label class="check"><input type="checkbox" name="est-extra" value="${esc(e.key)}"><span>${esc(e.label)}</span><small>+₹${e.add.toLocaleString('en-IN')}</small></label>`)
    .join('');

  return `<div class="estimator" data-estimator>
    <div class="estimator__head">
      <h3 id="est-title">${esc(estimator.title)}</h3>
      <p>${esc(estimator.intro)}</p>
    </div>
    <div class="estimator__form" data-estimator-form role="group" aria-labelledby="est-title">
      <fieldset><legend>What are you making?</legend><div class="choices">${typeOptions}</div></fieldset>
      <fieldset><legend>How much content?</legend><div class="choices">${pageOptions}</div></fieldset>
      <fieldset><legend>How much motion?</legend><div class="choices">${motionOptions}</div></fieldset>
      <fieldset><legend>Anything extra?</legend><div class="choices choices--checks">${extras}</div></fieldset>
    </div>
    <div class="estimator__out" aria-live="polite">
      <p class="estimator__label">Indicative starting point</p>
      <p class="estimator__value"><span>₹</span><output data-est-output>15,000</output></p>
      <p class="estimator__detail" data-est-detail>Landing page · 3–5 pages · Clean and calm</p>
      <p class="estimator__disclaimer">${esc(estimator.disclaimer)}</p>
      <div class="estimator__actions">
        <a class="btn btn--solid" href="#contact" data-est-cta><span class="btn__label">Send this shape</span><span class="btn__icon">${icon('arrow-right')}</span></a>
      </div>
    </div>
  </div>`;
}

/* ----------------------------------------------------------------------- faq */

export function renderFaq(): string {
  const items = faq
    .map(
      (q) => `<details class="faq-item" data-faq-item data-tags="${esc(q.tags.join(' '))}">
        <summary class="faq-item__summary">
          <span class="faq-item__q">${esc(q.q)}</span>
          <span class="faq-item__icon" aria-hidden="true">${icon('plus')}</span>
        </summary>
        <div class="faq-item__body"><p>${esc(q.a)}</p></div>
      </details>`,
    )
    .join('');
  const tags = [...new Set(faq.flatMap((f) => f.tags))];
  return `<section id="faq" class="faq" data-chapter="faq" data-theme="paper" aria-labelledby="faq-title">
    <div class="faq__inner wrap">
      <div class="faq__head">
        ${sectionHead({
          eyebrow: 'Questions',
          title: 'The things worth asking first.',
          lede: 'Pricing, process, ownership and what we will not pretend to know. Search the list or open a question.',
          id: 'faq-title',
        })}
        <div class="faq__search">
          <label for="faq-search">Search questions</label>
          <div class="field field--search">
            ${icon('search')}
            <input id="faq-search" type="search" placeholder="e.g. price, hosting, accessibility" autocomplete="off" data-faq-search>
            <button type="button" class="field__clear" data-faq-clear hidden aria-label="Clear search">${icon('close')}</button>
          </div>
          <div class="filter-row" role="group" aria-label="Filter questions">
            <button type="button" class="chip is-active" data-faq-tag="all" aria-pressed="true">All</button>
            ${tags.map((t) => `<button type="button" class="chip" data-faq-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="faq__list" data-faq-list>${items}<p class="faq__empty" data-faq-empty hidden>No question matches that. Try “pricing”, “hosting” or <a href="#contact">ask us directly</a>.</p></div>
    </div>
  </section>`;
}

/* ----------------------------------------------------------------- standards */

export function renderStandards(): string {
  const items = standards.items
    .map((i) => `<li><h3>${esc(i.title)}</h3><p>${esc(i.body)}</p></li>`)
    .join('');
  return `<section id="standards" class="standards" data-chapter="standards" data-theme="ink" aria-labelledby="standards-title">
    <div class="standards__inner wrap">
      ${sectionHead({ eyebrow: standards.eyebrow, title: standards.title, lede: standards.intro, id: 'standards-title' })}
      <ul class="standards__grid">${items}</ul>
      <p class="standards__note">${esc(standards.reportNote)} <a href="#contact">Report a problem</a>.</p>
    </div>
  </section>`;
}

export { closing, contact, brand, nav, waLink, wordmark };
