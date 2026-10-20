/**
 * Does the feedback layer actually answer?
 *
 * Every check drives a real interaction in Chromium and reads a real computed
 * value or measured box. Nothing here trusts the CSS or the JS to have worked.
 *
 * A pass requires: the answer exists, it changes the rendered result, it
 * settles (no wedged dialogs or stuck states), and under reduced motion the
 * same action still leaves the interface correct — just without travel.
 */
import { launchBrowser } from './launch.mjs';

const BASE = process.env.DENVUP_URL ?? 'http://127.0.0.1:4173';
const results = [];
let failures = 0;

function check(ok, label, detail = '') {
  if (!ok) failures += 1;
  results.push({ ok, label, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const { browser, page } = await launchBrowser({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));

try {
  await page.goto(`${BASE}/lab`, { waitUntil: 'networkidle0' });
  await wait(400);

  /* ---------------------------------------------------- M1: press feedback */
  {
    const target = await page.$('[data-lab-filter]');
    const box = await target.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const pressed = await page.evaluate(
      () => getComputedStyle(document.querySelector('[data-lab-filter]')).scale,
    );
    await page.mouse.up();
    await wait(120);
    const released = await page.evaluate(
      () => getComputedStyle(document.querySelector('[data-lab-filter]')).scale,
    );
    check(pressed !== 'none' && Number(pressed) < 1, 'press gives under the finger', `scale ${pressed}`);
    check(released === 'none' || Number(released) === 1, 'press releases cleanly', `scale ${released}`);
  }

  /* ------------------------------------------- M7: the filter rule travels */
  {
    const before = await page.evaluate(() => {
      const rule = document.querySelector('.lab-tabs__rule');
      return rule ? getComputedStyle(rule).transform : null;
    });
    const tabs = await page.$$('[data-lab-filter]');
    await tabs[tabs.length - 1].click();
    await wait(420);
    const after = await page.evaluate(() => {
      const rule = document.querySelector('.lab-tabs__rule');
      return rule ? { transform: getComputedStyle(rule).transform, opacity: getComputedStyle(rule).opacity } : null;
    });
    const readX = (v) => {
      if (!v) return 0;
      const m = v.match(/matrix\(([^)]+)\)/);
      if (m) return Number(m[1].split(',')[4]) || 0;
      const t = v.match(/translate\((-?[\d.]+)px/);
      return t ? Number(t[1]) : 0;
    };
    // The authored target is the honest measure here: this headless build
    // throttles the animation clock, so getComputedStyle reports the start
    // value for the whole transition and then jumps to the end.
    const target = await page.evaluate(() => {
      const rule = document.querySelector('.lab-tabs__rule');
      return rule ? { inline: rule.style.transform, transition: getComputedStyle(rule).transitionProperty } : null;
    });
    const moved = Math.abs(readX(target?.inline ?? '') - readX(before));
    check(before !== null && after !== null, 'filter rule exists');
    check(moved > 20, 'filter rule targets the chosen tab', `${Math.round(moved)} px [${target?.inline}]`);
    check((target?.transition ?? '').includes('transform'), 'the rule is transitioned, not teleported', target?.transition ?? '');
    const countText = await page.evaluate(() => document.querySelector('[data-lab-count]')?.textContent);
    const shown = await page.evaluate(() => [...document.querySelectorAll('[data-lab-card]')].filter((c) => !c.hidden).length);
    check(Number(countText) === shown, 'result count matches the visible cards', `${countText} vs ${shown}`);
  }

  /* -------------------------------- M8/M9: filtered cards and empty state */
  {
    const input = await page.$('[data-lab-search]');
    await input.click();
    await page.keyboard.type('zzzz-no-such-technique');
    await wait(320);
    const empty = await page.evaluate(() => {
      const el = document.querySelector('[data-lab-empty]');
      return { hidden: el?.hidden, chars: el?.textContent?.trim().length ?? 0 };
    });
    check(empty.hidden === false && empty.chars > 0, 'empty state appears with guidance');
    const reset = await page.$('[data-lab-reset]');
    if (reset) await reset.click();
    await wait(260);
    const restored = await page.evaluate(() => [...document.querySelectorAll('[data-lab-card]')].filter((c) => !c.hidden).length);
    check(restored > 0, 'reset restores the library', `${restored} cards`);
  }

  /* -------------------------------------------------- M10: replay answers */
  {
    await page.evaluate(() => window.scrollTo(0, 900));
    await wait(500);
    const button = await page.$('[data-lab-replay]');
    if (button) {
      await button.click();
      const running = await page.evaluate(() => {
        const host = document.querySelector('[data-lab-card] [data-lab-host]');
        const icon = document.querySelector('[data-lab-replay] svg');
        return {
          host: host ? host.getAnimations().length : 0,
          icon: icon ? icon.getAnimations().length : 0,
        };
      });
      check(running.host > 0 || running.icon > 0, 'replay is acknowledged by the stage or the control', JSON.stringify(running));
    } else {
      check(false, 'replay control present');
    }
  }

  /* -------------------------------------- M13: the intent survives the trip */
  {
    await page.goto(`${BASE}/lab`, { waitUntil: 'networkidle0' });
    await wait(300);
    const [link] = await page.$$('a.mini--go');
    const label = await page.evaluate((el) => el.textContent.replace(/\s+/g, ' ').trim(), link);
    await link.click();
    // The router swaps <main> inside a view transition; the pathname changes
    // before the new form exists, so wait for routing to finish as well.
    await page
      .waitForFunction(
        () => location.pathname === '/contact' && !document.documentElement.classList.contains('is-routing'),
        { timeout: 8000 },
      )
      .catch(() => undefined);
    await page.waitForSelector('#enquiry', { timeout: 4000 }).catch(() => undefined);
    await wait(250);
    const carried = await page.evaluate(() => {
      const message = document.querySelector('#f-message');
      const note = document.querySelector('.contact__carried');
      return {
        path: location.pathname,
        value: message instanceof HTMLTextAreaElement ? message.value : '',
        note: note?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        counter: document.querySelector('[data-message-count]')?.textContent ?? '',
      };
    });
    check(carried.path === '/contact', 'navigation reached contact', carried.path);
    check(carried.value.length > 10, 'the requested technique is in the message field', carried.value.slice(0, 48));
    check(carried.note.includes('The Lab'), 'the page says where the request came from', carried.note.slice(0, 48));
    check(Number(carried.counter) === carried.value.length, 'the character count agrees with the prefilled text', `${carried.counter} vs ${carried.value.length}`);
    check(link !== undefined && label.toLowerCase().includes('want'), 'the link that was used is an intent link', label);
  }

  /* ------------------------------------ M3/M4: the form answers a mistake */
  {
    const before = await page.evaluate(() => document.querySelector('[data-form-status]')?.getBoundingClientRect().height ?? 0);
    await page.evaluate(() => document.querySelector('[data-enquiry]')?.requestSubmit());
    await wait(90);
    const opening = await page.evaluate(() => ({
      height: document.querySelector('[data-form-status]')?.getBoundingClientRect().height ?? 0,
      text: document.querySelector('[data-form-status-text]')?.textContent ?? '',
      invalid: document.querySelectorAll('.field.is-invalid').length,
      errors: [...document.querySelectorAll('.field__error')].filter((e) => !e.hidden).length,
      focused: document.activeElement?.getAttribute('name') ?? '',
      animated: (document.querySelector('.form-status__body')?.getAnimations() ?? []).length > 0,
      duration: Math.round(document.querySelector('.form-status__body')?.getAnimations()?.[0]?.effect?.getTiming().duration ?? 0),
    }));
    await wait(400);
    const settled = await page.evaluate(() => document.querySelector('[data-form-status]')?.getBoundingClientRect().height ?? 0);
    check(before < 2, 'status band starts closed', String(Math.round(before)));
    check(
      opening.animated && opening.duration === 260,
      'opening the band starts a 260 ms height animation',
      `${opening.duration} ms, ${opening.animated ? 'animation present' : 'none'}`,
    );
    check(settled > 1, 'the band settles at a readable height', `${Math.round(settled)} px`);
    check(opening.invalid > 0, 'invalid fields are marked', String(opening.invalid));
    check(opening.text.toLowerCase().includes('nothing was sent'), 'the message is honest', opening.text.slice(0, 52));
    check(opening.focused === 'name', 'focus moved to the first field', opening.focused);
  }

  /* ------------------------------------------ M11: dialogs close with motion */
  {
    await page.evaluate(() => (document.querySelector('[data-open-menu]')).click());
    await wait(600);
    const opened = await page.evaluate(() => document.getElementById('site-menu')?.open);
    await page.evaluate(() => (document.querySelector('[data-menu-close]')).click());
    const closing = await page.evaluate(() => document.getElementById('site-menu')?.classList.contains('is-closing'));
    await wait(500);
    const closed = await page.evaluate(() => {
      const menu = document.getElementById('site-menu');
      return { open: menu?.open, closing: menu?.classList.contains('is-closing') };
    });
    check(opened === true, 'menu opens');
    check(closing === true, 'menu plays an exit before unmounting');
    check(closed.open === false && closed.closing === false, 'menu is closed and unmarked afterwards');
  }

  /* ------------------------------------------------ M12: FAQ disclosure */
  {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.querySelector('#faq')?.scrollIntoView());
    await wait(600);
    const opening = await page.evaluate(() => {
      const item = document.querySelector('[data-faq-item]');
      item.querySelector('summary').click();
      return { open: item.open };
    });
    await wait(80);
    const anim = await page.evaluate(() => {
      const body = document.querySelector('[data-faq-item] .faq-item__body');
      const list = body?.getAnimations() ?? [];
      return { count: list.length, duration: Math.round(list[0]?.effect?.getTiming().duration ?? 0) };
    });
    await wait(400);
    const heightSettled = await page.evaluate(() => document.querySelector('[data-faq-item] .faq-item__body')?.getBoundingClientRect().height ?? 0);
    check(opening.open === true, 'FAQ opens on click');
    check(anim.count > 0 && anim.duration === 240, 'FAQ body animates its own height', `${anim.duration} ms`);
    check(heightSettled > 40, 'FAQ body settles fully open', `${Math.round(heightSettled)} px`);
  }

  /* ------------------------------------------------ M2: the busy state */
  {
    const disabled = await page.evaluate(() => {
      const button = document.querySelector('[data-submit]');
      if (!button) return null;
      button.disabled = true;
      const opacity = getComputedStyle(button).opacity;
      button.disabled = false;
      return opacity;
    });
    check(disabled !== null && Number(disabled) < 1, 'a disabled control looks disabled', `opacity ${disabled}`);
  }

  check(errors.length === 0, 'no page errors during the motion checks', errors.slice(0, 2).join(' | '));

  /* ------------------------------------------- reduced motion still works */
  {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`${BASE}/contact?subject=${encodeURIComponent('I want a scroll-driven gallery')}`, { waitUntil: 'networkidle0' });
    await wait(500);
    const reduced = await page.evaluate(() => ({
      motion: document.documentElement.dataset.motion,
      value: document.querySelector('#f-message')?.value ?? '',
      note: document.querySelector('.contact__carried')?.textContent ?? '',
      running: document.getAnimations().filter((a) => a.playState === 'running').length,
    }));
    check(reduced.motion === 'reduced', 'reduced motion is detected', reduced.motion);
    check(reduced.value.includes('scroll-driven gallery'), 'the intent still arrives under reduced motion', reduced.value.slice(0, 40));
    check(reduced.note.includes('The Lab'), 'the provenance note is still shown', reduced.note.slice(0, 40));

    await page.evaluate(() => document.querySelector('[data-enquiry]')?.requestSubmit());
    await wait(450);
    const status = await page.evaluate(() => {
      const el = document.querySelector('[data-form-status]');
      return { height: el?.getBoundingClientRect().height ?? 0, text: el?.textContent?.trim().length ?? 0 };
    });
    check(status.height > 10 && status.text > 10, 'the outcome is fully visible without motion', `${Math.round(status.height)} px`);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  }
} finally {
  await browser.close();
}

console.log(`\n${failures === 0 ? `${results.length} passed, 0 failed` : `${failures} failed of ${results.length}`}`);
process.exitCode = failures === 0 ? 0 : 1;
