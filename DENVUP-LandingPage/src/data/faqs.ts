/** Frequently asked questions. Plain language, no sales hedging. */

/**
 * The seven questions the Home chapter answers. Anything that only makes
 * sense next to a number lives in `pricingFaqs` instead, so the two sets
 * do not repeat each other.
 */
export interface Faq {
  id: string;
  q: string;
  a: string;
  keywords: string;
}

export const faqs: Faq[] = [
  {
    id: 'what-do-you-do',
    q: 'What exactly do you do?',
    a: 'We design and build websites: business sites, landing pages, product interfaces and interactive experiences. The studio is four people working across design and front-end engineering, so the people you speak to are the people who make the work. We also take on improvement work — performance, accessibility, structure and integration — on sites that already exist.',
    keywords: 'services build design studio what',
  },
  {
    id: 'how-long',
    q: 'How long does a project take?',
    a: 'A landing page is usually two to three weeks. A business website is four to six. An advanced build with a motion system or 3D work runs six to eight. Those ranges assume content is ready when we need it — the slowest part of most projects is waiting for copy and approvals, not the build itself.',
    keywords: 'timeline duration weeks how long time',
  },
  {
    id: 'technology',
    q: 'What do you build with?',
    a: 'Modern, boring, dependable front-end: semantic HTML, CSS with custom properties, TypeScript, and a build step. GSAP handles the scroll and motion work, and WebGL is used where it earns its place. We are happy to work inside your existing stack if you have one — the capability atlas lists the tools we actually use.',
    keywords: 'tech stack tools code react vite three gsap',
  },
  {
    id: 'cms',
    q: 'Can I update the site myself afterwards?',
    a: 'Yes, and we plan for it from the first session. Depending on the project we will set up a CMS, a headless content model, or a simple set of JSON data files. What you get is chosen for how you actually work, not for what is fashionable. If you would rather never touch a code editor again, say so in the brief and we will build for that.',
    keywords: 'cms content edit update headless sanity',
  },
  {
    id: 'motion-accessibility',
    q: 'Will all those animations work for everyone?',
    a: 'No, and they should not. Every animated sequence has a static equivalent that is readable and complete, and the site respects your operating system setting for reduced motion. Nothing important is only communicated through motion, colour or hover. The Effects Library lets you try each effect before you ask for it.',
    keywords: 'accessibility reduced motion a11y keyboard screen reader',
  },
  {
    id: 'existing-site',
    q: 'We already have a site. Can you improve it instead of rebuilding?',
    a: 'Often that is the better call. We start with an audit — performance, accessibility, structure, content and the parts of the design that are fighting themselves — and we fix the highest-value problems first. A full rebuild is only the right answer when the underlying structure is the problem.',
    keywords: 'existing redesign improve audit fix rebuild',
  },
  {
    id: 'start',
    q: 'How do we start?',
    a: 'Send us a short brief by email or WhatsApp: what the site is for, who it is for, when it needs to be live, and anything you have seen that you like. We will come back with questions, a rough range and the next step. The first reply is usually a set of questions, not an invoice.',
    keywords: 'start begin enquiry brief contact get in touch',
  },
];

/**
 * The pricing FAQ, kept separate so the Home chapter does not turn into a
 * price sheet. These answers are the ones a buyer asks once they have seen a
 * number.
 */
export const pricingFaqs: Faq[] = [
  {
    id: 'why-only-starting-prices',
    q: 'Why are the starting prices the only numbers on this page?',
    a: 'Because a real quotation needs a real brief. The prices shown are proposed starting points for a typical project of each kind. Once we know the scope, the number of pages, the functionality and who is writing the content, we can quote properly. The estimator on this page is indicative arithmetic, not a quote.',
    keywords: 'pricing cost money quote estimate budget',
  },
  {
    id: 'what-is-included',
    q: 'What is included in a starting price?',
    a: 'Discovery and planning, the design of every page in the agreed scope, a responsive build, the agreed number of content pages, basic on-page SEO setup, testing on the common screen sizes, and handover with documentation. Hosting, domain, a paid CMS plan, photography, copywriting and paid advertising are separate, and we will say so before you commit.',
    keywords: 'included scope deliverables price package',
  },
  {
    id: 'what-changes-the-price',
    q: 'What actually moves the price up or down?',
    a: 'Three things, in this order: how many pages and how unusual they are, whether the site needs to talk to other systems, and how much of the content already exists. A lot of copy, images and copy ready to paste will move a number down. A site with a booking flow, a login and a live inventory will move it up. The estimator below applies a simple version of those rules.',
    keywords: 'cost driver variable increase decrease scope change',
  },
  {
    id: 'phases',
    q: 'Can we do it in phases?',
    a: 'Yes, and for most business sites we would recommend it. A first release that does one job properly — usually the landing page or the service pages — gives you something live to test, and the second phase is then scoped by what you learned rather than by a guess. Phasing also spreads the cost, and we will show you the split before you decide.',
    keywords: 'phases staged rollout first release second phase',
  },
  {
    id: 'payment',
    q: 'How do payments work?',
    a: 'We usually ask for half to begin and half before launch, with a small initial payment for projects that start with a long discovery phase. Invoices are issued per phase. If your process needs different terms, or if the currency is a problem, say so in the first message and we will work out something workable before anything is signed.',
    keywords: 'payment terms invoice deposit half currency',
  },
  {
    id: 'after-launch',
    q: 'What happens after launch?',
    a: 'The site is yours, including the code and the content. We hand over documentation, walk you through it, and fix anything that was in the agreed scope and not working. After that, you can take it in-house, or keep us on a light maintenance arrangement for updates and small changes.',
    keywords: 'after launch handover ownership support maintenance',
  },
  {
    id: 'hosting-domain',
    q: 'Do you handle hosting and domains?',
    a: 'We can recommend and set up hosting, and we can help move an existing domain, but hosting and domain fees are billed by the provider and are not part of our price. We will tell you what to buy and why before you buy it.',
    keywords: 'hosting domain deploy dns server',
  },
  {
    id: 'mobile',
    q: 'Is it built for phones?',
    a: 'Phones are the design target for most of the sites we build, not an afterthought. Layouts are designed at small widths first, hover-only behaviour always has a tap alternative, horizontal sequences either become vertical or keep their own scroll, and we test on real small viewports before handing over.',
    keywords: 'mobile responsive phone tablet viewport',
  },
];
