#!/usr/bin/env python3
"""Generate the five service detail pages.

The pages are static documents, but their content comes from
`src/data/services.ts` so that a service cannot say one thing on the home
page and another on its own page. Run this after editing the data file:

    python3 scripts/gen_service_pages.py
"""

import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / 'src' / 'data' / 'services.ts'

STAGE_COUNT = 6


def read_services():
    """Pull the service records out of the TypeScript data file.

    The file is a plain object literal, so a small hand-rolled scanner is
    enough and avoids needing a TypeScript parser.
    """
    text = DATA.read_text(encoding='utf-8')

    start = text.index('export const services: Service[] = [')
    end = text.index('export interface ProcessStage')
    block = text[start:end]

    services = []
    for chunk in re.findall(r'\{\n(.*?)\n  \},', block, re.S):
        record = {}
        for key in ('id', 'slug', 'index', 'title', 'short', 'body', 'audience',
                    'outcome', 'accent', 'diagram', 'signature', 'priceNote'):
            m = re.search(rf"\b{key}:\s*\n?\s*'((?:[^'\\]|\\.)*)'", chunk)
            if m:
                record[key] = m.group(1).replace("\\'", "'")
        m = re.search(r"deliverables:\s*\[(.*?)\]", chunk, re.S)
        if m:
            record['deliverables'] = re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1))
        m = re.search(r"techniqueIds:\s*\[(.*?)\]", chunk, re.S)
        if m:
            record['techniqueIds'] = re.findall(r"'([^']*)'", m.group(1))
        m = re.search(r"question:\s*\{\s*q:\s*'((?:[^'\\]|\\.)*)',\s*a:\s*\n?\s*'((?:[^'\\]|\\.)*)'", chunk, re.S)
        if m:
            record['question'] = {'q': m.group(1), 'a': m.group(2)}
        services.append(record)
    return services


def read_stages():
    text = DATA.read_text(encoding='utf-8')
    start = text.index('export const processStages: ProcessStage[] = [')
    end = text.index('/** Look a service up by its route slug. */')
    block = text[start:end]
    stages = []
    for chunk in re.findall(r'\{\n(.*?)\n  \},', block, re.S):
        record = {}
        for key in ('id', 'index', 'name', 'when', 'title', 'body'):
            m = re.search(rf"\b{key}:\s*\n?\s*'((?:[^'\\]|\\.)*)'", chunk)
            if m:
                record[key] = m.group(1).replace("\\'", "'")
        m = re.search(r"outputs:\s*\[(.*?)\]", chunk, re.S)
        if m:
            record['outputs'] = re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1))
        stages.append(record)
    return stages


TEMPLATE = """<!doctype html>
<html lang="en" data-theme="ink">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>{title} &mdash; DENVUP</title>
    <meta name="description" content="{description}" />
    <meta name="theme-color" content="#f0490f" />
    <meta name="color-scheme" content="dark light" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DENVUP" />
    <meta property="og:title" content="{title} &mdash; DENVUP" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="module" src="/src/main.ts"></script>
  </head>

  <body>
    <!--@boot:none-->

    <!--@shell:before-->

    <main id="view" class="view" data-view="service">
      <section class="section ch-ember route-hero" id="top" data-route-hero aria-labelledby="svc-title">
        <div class="shell">
          <p class="route-hero__kicker">Service {index}</p>
          <h1 class="route-hero__title" id="svc-title">{title}</h1>
          <p class="route-hero__lead">{short}</p>
          <div class="route-hero__actions">
            <a class="btn btn--solid" href="/contact/" data-magnetic>
              <span>Start a conversation</span>
              <span class="btn__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>
              </span>
            </a>
            <a class="btn btn--ghost" href="/pricing/"><span>Indicative prices</span></a>
          </div>
        </div>
      </section>

      <figure class="service-art ch-ink">
        <img data-service-art src="/art/service-{slug}.jpg" alt="Original artwork for the {title} service line: a geometric field in the DENVUP palette." width="1600" height="900" decoding="async" />
        <figcaption class="service-art__caption">
          <span>Original artwork, drawn for this page.</span>
        </figcaption>
      </figure>

      <section class="section ch-paper svc-body" id="what" aria-labelledby="svc-body-title">
        <div class="shell">
          <div class="svc-body__grid">
            <div class="svc-body__lead">
              <h2 class="svc-body__title" id="svc-body-title">{body}</h2>
              <p class="svc-body__signature">{signature}</p>
            </div>

            <dl class="svc-facts">
              <div>
                <dt>Who it is for</dt>
                <dd>{audience}</dd>
              </div>
              <div>
                <dt>What it produces</dt>
                <dd>{outcome}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd data-svc-price></dd>
              </div>
            </dl>
          </div>

          <h3 class="svc-deliverables__title">What is included</h3>
          <ul class="svc-deliverables">
{deliverables}
          </ul>
        </div>
      </section>

      <section class="section ch-ink svc-how-section" aria-labelledby="svc-how-title">
        <div class="shell">
          <div data-svc-how></div>
        </div>
      </section>

      <section class="section ch-paper svc-demos-section" aria-labelledby="svc-demos-title">
        <div class="shell">
          <div data-svc-demos></div>
        </div>
      </section>

      <section class="section ch-ember svc-stages" id="stages" aria-labelledby="svc-stages-title">
        <div class="shell">
          <h2 class="svc-stages__title" id="svc-stages-title">The {stage_count} stages it usually moves through</h2>
          <p class="svc-stages__lede">
            The same process runs behind every line. What changes is the work inside each
            stage, and how long it takes.
          </p>
          <ol class="stage-cards">
{stages}
          </ol>
          <p class="svc-stages__more">
            The full process, with everything that comes out of each stage, is on the
            <a href="/#process">home page</a>.
          </p>
        </div>
      </section>

      <section class="section ch-paper svc-question" aria-labelledby="svc-question-title">
        <div class="shell">
          <h2 class="svc-question__title" id="svc-question-title">{question_q}</h2>
          <p class="svc-question__answer">{question_a}</p>
        </div>
      </section>

      <section class="section ch-ink svc-cta" aria-labelledby="svc-cta-title">
        <div class="shell svc-cta__inner">
          <h2 class="svc-cta__title" id="svc-cta-title">Tell us what you are trying to do</h2>
          <p class="svc-cta__body">
            One paragraph is enough to start. We will reply with questions, an honest
            read on the scope, and what it would roughly cost.
          </p>
          <div class="svc-cta__actions">
            <a class="btn btn--solid" href="/contact/" data-magnetic>
              <span>Write to the studio</span>
              <span class="btn__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>
              </span>
            </a>
            <a class="btn btn--ghost" href="/services/"><span>Compare the five lines</span></a>
          </div>
        </div>
      </section>

      <section class="section ch-paper svc-siblings" id="others" aria-labelledby="svc-siblings-title">
        <div class="shell">
          <div class="svc-siblings__head">
            <h2 class="svc-siblings__title" id="svc-siblings-title">The other four lines</h2>
            <a class="svc-siblings__back" href="/services/">
              <span aria-hidden="true">&larr;</span> All services
            </a>
          </div>
          <div data-svc-siblings></div>
        </div>
      </section>

    <!--@shell:after-->
  </body>
</html>
"""


def main():
    services = read_services()
    stages = read_stages()
    assert len(stages) == STAGE_COUNT, f'expected {STAGE_COUNT} stages, found {len(stages)}'

    for service in services:
        deliverables = '\n'.join(
            f'              <li>{html.escape(item)}</li>' for item in service['deliverables']
        )
        stage_items = '\n'.join(
            f'''            <li class="stage-card">
              <span class="stage-card__index">{stage['index']}</span>
              <span class="stage-card__name">{html.escape(stage['name'])}</span>
              <span class="stage-card__body">{html.escape(stage['title'])}</span>
            </li>'''
            for stage in stages
        )
        description = service['short']
        page = TEMPLATE.format(
            title=html.escape(service['title']).replace('&amp;', '&amp;'),
            description=html.escape(description),
            index=service['index'],
            slug=service['slug'],
            short=html.escape(service['short']),
            body=html.escape(service['body']),
            signature=html.escape(service['signature']),
            audience=html.escape(service['audience']),
            outcome=html.escape(service['outcome']),
            deliverables=deliverables,
            stage_count=STAGE_COUNT,
            stages=stage_items,
            question_q=html.escape(service['question']['q']),
            question_a=html.escape(service['question']['a']),
        )
        target = ROOT / 'services' / service['slug'] / 'index.html'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding='utf-8')
        print('wrote', target.relative_to(ROOT))


if __name__ == '__main__':
    main()
