/**
 * The FAQ chapter.
 *
 * A searchable accordion. Only one answer is open at a time, the panel opens
 * with a grid-row height transition, and the plus sign rotates into a minus.
 */

import { $, el } from '../core/dom';
import { env } from '../core/env';
import { brand } from '../data/site';
import { faqs, type Faq } from '../data/faqs';

/**
 * @param source  The question set to render. The Home chapter passes the
 *                studio questions; the pricing route passes the buying ones.
 * @param scope   A CSS scope so two sets on one page cannot collide.
 */
export function initFaq(source: Faq[] = faqs, scope = 'faq'): () => void {
  const list = $<HTMLElement>(`[data-faq-list="${scope}"]`);
  const search = $<HTMLInputElement>(`[data-faq-search="${scope}"]`);
  if (!list) return () => {};

  const cleanups: (() => void)[] = [];
  const items: HTMLElement[] = [];

  source.forEach((faq, index) => {
    const item = el('div', 'faq__item');
    item.dataset.keywords = `${faq.keywords} ${faq.q} ${faq.a}`.toLowerCase();

    const head = el('button', 'faq__question');
    head.type = 'button';
    head.setAttribute('aria-expanded', 'false');
    head.id = `faq-q-${scope}-${faq.id}`;
    const index2 = el('span', 'faq__index');
    index2.textContent = String(index + 1).padStart(2, '0');
    const label = el('span', 'faq__label');
    label.textContent = faq.q;
    const sign = el('span', 'faq__sign');
    sign.setAttribute('aria-hidden', 'true');
    head.append(index2, label, sign);

    const body = el('div', 'faq__answer');
    body.id = `faq-a-${scope}-${faq.id}`;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', head.id);
    const inner = el('div', 'faq__answer-inner');
    const paragraph = el('p');
    paragraph.textContent = faq.a;
    inner.appendChild(paragraph);
    body.appendChild(inner);

    item.append(head, body);
    list.appendChild(item);
    items.push(item);

    const toggle = () => {
      const open = head.getAttribute('aria-expanded') === 'true';
      items.forEach((other) => {
        other.querySelector('button')?.setAttribute('aria-expanded', 'false');
        other.classList.remove('is-open');
      });
      if (!open) {
        head.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
        if (!env.reducedMotion) {
          const inner2 = item.querySelector<HTMLElement>('.faq__answer-inner');
          if (inner2) {
            inner2.style.transform = 'none';
          }
        }
      }
    };
    head.addEventListener('click', toggle);
    cleanups.push(() => head.removeEventListener('click', toggle));
  });

  // ------------------------------------------------------------------ //
  // The search reports what it did
  // ------------------------------------------------------------------ //
  /*
   * The filter used to work silently: rows were hidden with the `hidden`
   * attribute and nothing else changed. A search that gives no reading
   * leaves the visitor guessing whether the words were understood.
   *
   * So the search now says what it found — a count beside the box — and
   * when it finds nothing it says that too and offers the way out. The
   * design reference is blunt about empty states: "an empty screen is an
   * invitation to act".
   *
   * Nothing here animates per keystroke. Typing is an action a visitor
   * performs hundreds of times, and the motion reference gives things
   * seen hundreds of times no animation at all. The count changes; the
   * rows are present or not. Both are instant, and both are legible.
   */
  /*
   * The count lives in the search box, so it only exists where there is
   * something to search. It is a live region, like the counts on the
   * laboratory and the home library — one behaviour for every filter on
   * the site.
   */
  const count = el('p', 'faq__count');
  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');
  const searchBox = search?.closest<HTMLElement>('.faq__search');
  if (searchBox) searchBox.append(count);

  const empty = el('div', 'faq__empty');
  empty.hidden = true;
  list.after(empty);

  const applyFilter = (): void => {
    const query = search?.value.trim().toLowerCase() ?? '';
    let matches = 0;

    items.forEach((item) => {
      const haystack = item.dataset.keywords ?? '';
      const hit = query.length === 0 || haystack.includes(query);
      item.hidden = !hit;
      if (hit) matches += 1;
    });

    if (query.length === 0) {
      count.textContent = `${items.length} questions`;
      empty.hidden = true;
      return;
    }

    count.textContent = `${matches} of ${items.length} questions match`;

    if (matches > 0) {
      empty.hidden = true;
      return;
    }

    empty.hidden = false;
    empty.innerHTML = '';

    const said = el('p', 'faq__empty-text');
    said.textContent = `No question matches “${search?.value.trim() ?? ''}”.`;
    empty.append(said);

    const actions = el('p', 'faq__empty-actions');

    const clear = el('button', 'btn btn--ghost');
    clear.type = 'button';
    clear.textContent = 'Clear the search';
    clear.addEventListener('click', () => {
      if (!search) return;
      search.value = '';
      applyFilter();
      search.focus();
    });
    actions.append(clear);

    /*
     * The studio questions and the buying questions are two different
     * sets, so a visitor searching for "cost" here is looking for
     * something that lives on the pricing page. Pointing at it is the
     * honest next step rather than a dead end.
     */
    if (scope !== 'pricing') {
      const pricing = el('a', 'btn btn--ghost');
      pricing.href = '/pricing/#pricing-faq';
      pricing.textContent = 'See the buying questions';
      actions.append(pricing);
    }

    const ask = el('a', 'btn btn--ghost');
    ask.href = `mailto:${brand.email}`;
    ask.textContent = 'Ask us instead';
    actions.append(ask);

    empty.append(actions);
  };

  search?.addEventListener('input', applyFilter);
  cleanups.push(() => search?.removeEventListener('input', applyFilter));

  applyFilter();

  return () => cleanups.forEach((fn) => fn());
}
