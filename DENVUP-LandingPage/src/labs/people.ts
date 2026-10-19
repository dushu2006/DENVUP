import type { Lab } from './types';
import { team, teamNote } from '../content/site';

const initials = (name: string) =>
  name
    .replace(/\./g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const peopleLab: Lab = {
  slug: 'people',
  title: 'People, named',
  blurb:
    'Four people, four names, no invented job titles. The site says who is behind it and what a first conversation is like, and leaves the rest to the work.',
  modes: [
    {
      ids: [350, 351],
      name: 'Nameplates, not portraits',
      summary: 'Each person is a name and initials. There are no stock portraits and no fabricated biographies; the only claim is that these are the four people in the studio.',
      html: `<div class="d-nameplates">${team.map((m) => `<article class="d-nameplate"><span class="d-nameplate__initials" aria-hidden="true">${initials(m.name)}</span><b>${m.name}</b><small>One of the four</small></article>`).join('')}</div><p class="d-cap">${teamNote}</p>`,
      notes: { touch: 'Cards are static; no hover is required.', keyboard: 'Names are ordinary text.' },
    },
    {
      ids: [347],
      name: 'A profile that does not invent',
      summary: 'Opening a name shows the same supplied detail and an honest note about what is deliberately absent. The dialog is native, labelled, and returns focus.',
      html: `<div class="d-profilelist">${team.map((m, i) => `<button type="button" class="d-profilebtn" data-person="${i}" aria-haspopup="dialog">${m.name}<span aria-hidden="true">↗</span></button>`).join('')}<dialog class="d-profile" data-profile aria-labelledby="dprofile-title"><p class="d-cap">One of four</p><h4 id="dprofile-title" data-profile-name></h4><p class="d-body">There is no invented role or biography on this page. The names are the supplied team; the work is the introduction.</p><p class="d-cap">${teamNote}</p><button type="button" class="d-chip" data-profile-close>Close</button></dialog><p class="d-cap" data-profile-note aria-live="polite">Choose a name</p></div>`,
      init: ({ stage }) => {
        const dialog = stage.querySelector<HTMLDialogElement>('[data-profile]')!;
        const name = stage.querySelector<HTMLElement>('[data-profile-name]')!;
        const note = stage.querySelector<HTMLElement>('[data-profile-note]')!;
        let opener: HTMLElement | null = null;
        stage.querySelectorAll<HTMLButtonElement>('[data-person]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const person = team[Number(btn.dataset.person)]!;
            name.textContent = person.name;
            note.textContent = `Profile: ${person.name}`;
            opener = btn;
            dialog.showModal();
          });
        });
        stage.querySelector('[data-profile-close]')!.addEventListener('click', () => dialog.close());
        dialog.addEventListener('close', () => opener?.focus());
      },
      notes: { keyboard: 'Escape closes the native dialog; focus returns to the name.' },
    },
    {
      ids: [352],
      name: 'How we work',
      summary: 'Three working principles, each with a sentence that could be checked in a kickoff call. They describe behaviour, not credentials.',
      html: `<div class="d-principles">${[
        ['One conversation, then writing', 'The brief is confirmed in writing before design starts, so the scope and the number describe the same thing.'],
        ['The browser is the proof', 'Reviews happen on the real site at real widths, not in a deck. If it does not work there, it is not finished.'],
        ['No borrowed credibility', 'No invented clients, awards or statistics. If something is a concept, it is labelled a concept.'],
      ].map(([t, c]) => `<article class="d-principle"><h4>${t}</h4><p>${c}</p></article>`).join('')}</div>`,
      notes: { motion: 'Static.' },
    },
  ],
};
